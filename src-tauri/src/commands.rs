use std::{fmt::Display};

use serde::{Deserialize, Serialize};
use serde_json::json;
use specta;
use tauri::{generate_handler, Invoke, Runtime};
use tracing::{debug, error, info};
use webbrowser;

use crate::db::{account::Account, account_repo::AccountRepo, timeline::Timeline, timeline_repo::TimelineRepo, manager::ConnPool};

pub(crate) fn handlers<R: Runtime>() -> impl Fn(Invoke<R>) + Send + Sync + 'static {
    generate_handler![
        util_get_version,
        miauth_init,
        miauth_check,
        fetch_raw_misskey_api,
        find_all_accounts,
        create_timeline,
        find_all_timelines,
    ]
}

#[derive(Debug, Clone, Serialize, Deserialize, specta::Type)]
struct Note {
    note_id: String,
    user_id: String,
}

#[cfg(debug_assertions)]
pub(crate) fn export_ts() {
    tauri_specta::ts::export_with_cfg(
        specta::collect_types![
            util_get_version,
            miauth_init,
            miauth_check,
            fetch_raw_misskey_api,
            find_all_accounts,
            create_timeline,
            find_all_timelines,
        ]
        .unwrap(),
        specta::ts::ExportConfiguration::new().bigint(specta::ts::BigIntExportBehavior::Number),
        "../lib/bindings.ts",
    )
    .unwrap();
}

#[derive(Debug, Clone, Serialize, specta::Type)]
#[specta(export)]
#[serde(tag = "type")]
enum RustError {
    Unrecoverable { message: String },
}

impl RustError {
    fn unrecoverable<T: Display>(value: T) -> Self {
        error!("{value}");
        Self::Unrecoverable {
            message: value.to_string(),
        }
    }
}

impl<E: Display> From<E> for RustError {
    fn from(value: E) -> Self {
        RustError::unrecoverable(format!("io error: {value}"))
    }
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
fn util_get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
fn miauth_init(session_id: String, server_domain: String) {
    const PERMISSIONS: &str = "read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,write:reactions,write:votes,read:pages,write:pages,read:page-likes,write:page-likes,read:user-groups,write:user-groups,read:channels,write:channels,write:gallery-likes,read:gallery-likes";
    let url = format!(
        "https://{}/miauth/{}?name=tauriApp&permission={}",
        server_domain, session_id, PERMISSIONS
    );
    webbrowser::open(&url).unwrap();
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
async fn miauth_check(
    session_id: String,
    server_domain: String,
    connection: tauri::State<'_, ConnPool>,
) -> Result<bool, RustError> {
    let url = format!("https://{}/api/miauth/{}/check", server_domain, session_id);
    let body = json!({});
    let client = reqwest::Client::new();
    let resp = client.post(&url).json(&body).send().await?.text().await?;
    let res_json: serde_json::Value = serde_json::from_str(&resp).unwrap();
    debug!("res_json: {:?}", res_json);
    if res_json["ok"].as_bool().unwrap() {
        let conn = &mut connection
            .get()
            .map_err(|e| error!("Connection not found. {}", e))
            .unwrap();
        AccountRepo::create_account(
            conn,
            res_json["user"]["id"].as_str().unwrap(),
            res_json["user"]["name"].as_str().unwrap(),
            res_json["user"]["username"].as_str().unwrap(),
            &server_domain,
            res_json["token"].as_str().unwrap(),
        );
        Ok(true)
    } else {
        Ok(false)
    }
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
fn find_all_accounts(connection: tauri::State<'_, ConnPool>) -> Vec<Account> {
    info!("find_all_accounts");
    let conn = &mut connection
        .get()
        .map_err(|e| error!("Connection not found. {}", e))
        .unwrap();
    let res = AccountRepo::find_all(conn);
    debug!("res: {:?}", res);
    res
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
async fn fetch_raw_misskey_api(
    server_domain: String,
    endpoint: String,
    parms: String,
) -> Result<serde_json::Value, RustError> {
    let url = format!("https://{}/api/{}", server_domain, endpoint);
    debug!("url: {}", url);
    let body = serde_json::from_str::<serde_json::Value>(&parms).unwrap();
    debug!("body: {:?}", body);
    let client = reqwest::Client::new();
    let resp = client
        .post(&url)
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .json(&body)
        .send()
        .await?
        .text()
        .await?;
    let res_json: serde_json::Value = serde_json::from_str(&resp).unwrap();
    debug!("res_json: {:?}", res_json);
    Ok(res_json)
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
fn create_timeline(
    user_id: i32,
    server_domain: String,
    channel: String,
    connection: tauri::State<'_, ConnPool>,
) -> usize {
    let conn = &mut connection
        .get()
        .map_err(|e| error!("Connection not found. {}", e))
        .unwrap();
    TimelineRepo::create_timeline(conn, &user_id, &server_domain, &channel)
}

#[tauri::command]
#[specta::specta]
#[tracing::instrument]
fn find_all_timelines(connection: tauri::State<'_, ConnPool>) -> Vec<Timeline> {
    let conn = &mut connection
        .get()
        .map_err(|e| error!("Connection not found. {}", e))
        .unwrap();
    TimelineRepo::find_all(conn)
}