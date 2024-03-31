use std::sync::Arc;

use diesel::r2d2::ConnectionManager;
use diesel::r2d2::{Pool, PooledConnection};
use diesel::SqliteConnection;
use tauri::Config;

pub type ConnPool = Pool<ConnectionManager<SqliteConnection>>;
pub type ConnPooled = PooledConnection<ConnectionManager<SqliteConnection>>;

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

use crate::service::store;
use dotenv::dotenv;
use std::env;
// ---------------------------------------------
// Property
// ---------------------------------------------

pub fn establish_connection(config: &Arc<Config>) -> ConnPool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let mut path = store::get_app_path(config);
    path.push(database_url);
    let manager = ConnectionManager::<SqliteConnection>::new(path.to_str().unwrap());
    Pool::builder()
        .build(manager)
        .unwrap()
}

/// Run migration
pub fn run_migration(conn: &ConnPool) {
    // Get a connection from the connection pool
    conn.get()
        .unwrap()
        .run_pending_migrations(MIGRATIONS)
        .unwrap();
}