use specta;
use tauri::{generate_handler, Invoke, Runtime};

pub(crate) fn handlers<R: Runtime>() -> impl Fn(Invoke<R>) + Send + Sync + 'static {
    generate_handler![
        util_get_version,
    ]
}

#[cfg(debug_assertions)]
pub(crate) fn export_ts() {
    tauri_specta::ts::export_with_cfg(
        specta::collect_types![
            util_get_version,
        ]
        .unwrap(),
        specta::ts::ExportConfiguration::new().bigint(specta::ts::BigIntExportBehavior::Number),
        "../lib/bindings.ts",
    )
    .unwrap();
}

#[tauri::command]
#[specta::specta]
fn util_get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}