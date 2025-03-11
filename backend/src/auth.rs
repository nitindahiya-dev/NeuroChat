use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use crate::db::DbPool;
use crate::models::{PublicUser, User, NewGroup, Group}; // ✅ Fix Import
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct SignupRequest {
    username: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    email: String,
    password: String,
}

pub async fn signup(pool: web::Data<DbPool>, form: web::Json<SignupRequest>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    match User::create(&form.username, &form.email, &form.password, &mut conn) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::BadRequest().json(serde_json::json!({"error": "User creation failed"})),
    }
}

pub async fn login(pool: web::Data<DbPool>, form: web::Json<LoginRequest>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    match User::find_by_email(&form.email, &mut conn) {
        Ok(user) if user.verify_password(&form.password) => HttpResponse::Ok().json(PublicUser {
            id: user.id,
            username: user.username,
            email: user.email,
        }),
        _ => HttpResponse::Unauthorized().json(serde_json::json!({"error": "Invalid credentials"})),
    }
}

pub async fn profile(user: web::ReqData<User>) -> impl Responder {
    HttpResponse::Ok().json(user.into_inner())
}

// ✅ Fix: Added `create_group` and `join_group`
#[derive(Deserialize)]
pub struct CreateGroupRequest {
    name: String,
    description: Option<String>,
}

#[derive(Deserialize)]
pub struct JoinGroupRequest {
    user_id: Uuid,
    group_id: Uuid,
}

pub async fn create_group(pool: web::Data<DbPool>, form: web::Json<CreateGroupRequest>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    let new_group = NewGroup {
        name: form.name.clone(),
        description: form.description.clone(),
    };

    let group = diesel::insert_into(crate::schema::groups::table)
        .values(&new_group)
        .get_result::<Group>(&mut conn);

    match group {
        Ok(g) => HttpResponse::Ok().json(g),
        Err(_) => HttpResponse::BadRequest().json(serde_json::json!({"error": "Failed to create group"})),
    }
}

pub async fn join_group(pool: web::Data<DbPool>, form: web::Json<JoinGroupRequest>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    let result = diesel::insert_into(crate::schema::user_groups::table)
        .values((
            crate::schema::user_groups::user_id.eq(form.user_id),
            crate::schema::user_groups::group_id.eq(form.group_id),
        ))
        .execute(&mut conn);

    match result {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"message": "Joined group successfully"})),
        Err(_) => HttpResponse::BadRequest().json(serde_json::json!({"error": "Failed to join group"})),
    }
}
