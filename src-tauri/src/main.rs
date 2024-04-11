// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::db::manager::ConnPool;
use tauri::Manager;
use tracing::debug;

mod commands;
mod db;
mod schema;
mod service;

fn main() {
    #[cfg(debug_assertions)]
    commands::export_ts();

    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(commands::handlers())
        .setup(move |app| {
            let config = app.config();
            service::logging::initialize_logger(&config);
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                debug!("Opening devtools");
                window.open_devtools();
                window.close_devtools();
            }
            let conn = db::manager::establish_connection(&config);
            db::manager::run_migration(&conn);
            app.manage::<ConnPool>(conn);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}