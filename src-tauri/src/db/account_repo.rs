use crate::db::account::Account;
use crate::db::account::NewAccount;
use crate::schema::accounts::dsl::*;

use diesel::sqlite::SqliteConnection;
use diesel::RunQueryDsl;
use tracing::error;

pub struct AccountRepo;

impl AccountRepo {
    pub(crate) fn create_account(conn: &mut SqliteConnection, user_id: &str, display_name: &str, user_name: &str, server_domain: &str, access_token: &str) -> usize {
        let new_account = NewAccount {
            userID: user_id,
            displayName: display_name,
            userName: user_name,
            serverDomain: server_domain,
            accessToken: access_token,
        };
    
        diesel::insert_into(accounts)
            .values(&new_account)
            .execute(conn)
            .expect("Error saving new account")
    }

    pub(crate) fn find_all(conn: &mut SqliteConnection) -> Vec<Account> {
        match accounts.load::<Account>(conn) {
            Ok(r) => r,
            Err(e) => {
                error!("Error loading accounts: {}", e);
                Vec::new()
            }
        }
    }
}