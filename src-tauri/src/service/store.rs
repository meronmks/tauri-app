use std::{fs, path::PathBuf, sync::Arc};
use tauri::{api::path::app_data_dir, Config};

/// Get app directory absolite path.
/// <ul>
///   <li>Linux:   /home/username/.config/${bundle_identifier}</li>
///   <li>Windows: C:\Users\username\AppData\Roaming\${bundle_identifier}</li>
///   <li>macOS:   /Users/username/Library/Application Support\${bundle_identifier}</li>
/// </ul>
pub(crate) fn get_app_path(config: &Arc<Config>) -> PathBuf {
    let path = app_data_dir(config).expect("Failed to get application data path.");
    if !path.exists() {
        fs::create_dir_all(&path).unwrap();
    }

    return path;
}