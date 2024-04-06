// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::db::manager::ConnPool;
use tauri::Manager;
use tauri_plugin_log::{LogTarget, TimezoneStrategy};
use tracing::{debug, log::LevelFilter};

mod commands;
mod db;
mod schema;
mod service;

fn main() {
    #[cfg(debug_assertions)]
    commands::export_ts();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    LogTarget::Stdout,
                    LogTarget::Webview,
                    LogTarget::LogDir
                ])
                .level(
                    #[cfg(debug_assertions)]{
                        LevelFilter::Debug
                    },
                    #[cfg(not(debug_assertions))]{
                        LevelFilter::Info
                    },
                )
                .timezone_strategy(TimezoneStrategy::UseLocal)
                .max_file_size(100000)
                .log_name("app")
                .build(),
        )
        .invoke_handler(commands::handlers())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                debug!("Opening devtools");
                window.open_devtools();
                window.close_devtools();
            }
            let config = app.config();
            let conn = db::manager::establish_connection(&config);
            db::manager::run_migration(&conn);
            app.manage::<ConnPool>(conn);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}