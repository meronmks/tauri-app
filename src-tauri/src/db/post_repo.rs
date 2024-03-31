use crate::db::post::Post;
use crate::db::post::NewPost;
use crate::schema::posts::dsl::*;

use diesel::sqlite::SqliteConnection;
use diesel::RunQueryDsl;

pub struct PostRepo;

impl PostRepo {
    pub(crate) fn create_post(conn: &mut SqliteConnection, post_title: &str, post_body: &str) -> usize {
        let new_post = NewPost {
            title: post_title,
            body: post_body,
        };
    
        diesel::insert_into(posts)
            .values(&new_post)
            .execute(conn)
            .expect("Error saving new post")
    }
}