use crate::schema::accounts;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Debug, Clone, Serialize, specta::Type)]
pub struct Account {
    pub id: i32,
    pub user_id: String,
    pub display_name: String,
    pub user_name: String,
    pub server_domain: String,
    pub access_token: String,
}

#[derive(Insertable)]
#[diesel(table_name = accounts)]
pub struct NewAccount<'a> {
    pub userID: &'a str,
    pub displayName: &'a str,
    pub userName: &'a str,
    pub serverDomain: &'a str,
    pub accessToken: &'a str,
}