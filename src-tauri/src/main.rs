// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use db::manager::ConnPool;
use tauri::Manager;

mod commands;
mod db;
mod schema;
mod service;

fn main() {
    #[cfg(debug_assertions)]
    commands::export_ts();

    tauri::Builder::default()
        .invoke_handler(commands::handlers())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
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