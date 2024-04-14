use crate::schema::timelines;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Debug, Clone, Serialize, specta::Type)]
pub struct Timeline {
    pub id: i32,
    pub account_id: Option<i32>,
    pub server_domain: String,
    pub channel: String,
}

#[derive(Insertable)]
#[diesel(table_name = timelines)]
pub struct NewTimeline<'a> {
    pub accountID: &'a i32,
    pub serverDomain: &'a str,
    pub channel: &'a str,
}