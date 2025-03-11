// groups.rs
use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use crate::db::DbPool;
use crate::models::Group;

pub async fn get_groups(pool: web::Data<DbPool>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    // Load all groups from the database.
    let groups = crate::schema::groups::table
        .load::<Group>(&mut conn)
        .expect("Error loading groups");
    HttpResponse::Ok().json(groups)
}
