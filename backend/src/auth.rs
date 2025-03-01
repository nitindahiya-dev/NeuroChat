use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use diesel::pg::PgConnection;
use bcrypt::{hash, verify, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::db::DbPool;
use crate::schema::users;
use crate::models::PublicUser; // Import PublicUser
use crate::schema::users::dsl::*; // Import DSL for filtering

#[derive(Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = users)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

impl User {
    pub fn create(
        input_username: &str,
        input_email: &str,
        input_password: &str,
        conn: &mut PgConnection,
    ) -> Result<PublicUser, diesel::result::Error> {
        let hashed_password = hash(input_password, DEFAULT_COST).unwrap();
        
        diesel::insert_into(users::table)
            .values((
                users::id.eq(Uuid::new_v4()),
                users::username.eq(input_username),
                users::email.eq(input_email),
                users::password_hash.eq(hashed_password),
            ))
            .execute(conn)?;
    
        users::table
            .filter(users::email.eq(input_email))
            .select((users::id, users::username, users::email))
            .first::<PublicUser>(conn)
    }

    pub fn find_by_email(
        user_email: &str,
        conn: &mut PgConnection,
    ) -> Result<User, diesel::result::Error> {
        users::table.filter(users::email.eq(user_email)).first::<User>(conn)
    }

    pub fn verify_password(&self, password: &str) -> bool {
        verify(password, &self.password_hash).unwrap_or(false)
    }
}

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

pub async fn signup(
    pool: web::Data<DbPool>,
    form: web::Json<SignupRequest>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    match User::create(&form.username, &form.email, &form.password, &mut conn) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::BadRequest().body("User creation failed"),
    }
}

pub async fn login(
    pool: web::Data<DbPool>,
    form: web::Json<LoginRequest>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    
    match User::find_by_email(&form.email, &mut conn) {
        Ok(user) if user.verify_password(&form.password) => {
            HttpResponse::Ok().json(PublicUser {
                id: user.id,
                username: user.username,
                email: user.email,
            })
        },
        _ => HttpResponse::Unauthorized().json(serde_json::json!({"error": "Invalid credentials"})),
    }
}

pub async fn profile(user: web::ReqData<User>) -> impl Responder {
    HttpResponse::Ok().json(user.into_inner())
}