use crate::db::timeline::Timeline;
use crate::db::timeline::NewTimeline;
use crate::schema::timelines::dsl::*;

use diesel::sqlite::SqliteConnection;
use diesel::RunQueryDsl;
use tracing::error;

pub struct TimelineRepo;

impl TimelineRepo {
    pub(crate) fn create_timeline(conn: &mut SqliteConnection, account_id: &i32, server_domain: &str, ch: &str) -> usize {
        let new_timeline = NewTimeline {
            accountID: account_id,
            serverDomain: server_domain,
            channel: ch,
        };
    
        diesel::insert_into(timelines)
            .values(&new_timeline)
            .execute(conn)
            .expect("Error saving new timeline")
    }

    pub(crate) fn find_all(conn: &mut SqliteConnection) -> Vec<Timeline> {
        match timelines.load::<Timeline>(conn) {
            Ok(r) => r,
            Err(e) => {
                error!("Error loading timelines: {}", e);
                Vec::new()
            }
        }
    }
}