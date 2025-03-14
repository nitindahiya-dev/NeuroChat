use crate::db::DbPool;
use crate::models::{Group, NewGroup, PublicUser, User};
use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use serde::Deserialize;
use serde_json::{json, to_value};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct SignupRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

pub async fn signup(pool: web::Data<DbPool>, form: web::Json<SignupRequest>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    // Call create with renamed parameters
    match User::create(&form.username, &form.email, &form.password, &mut conn) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => HttpResponse::BadRequest().json(json!({"error": format!("User creation failed: {:?}", e)})),
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
        _ => HttpResponse::Unauthorized().json(json!({"error": "Invalid credentials"})),
    }
}

pub async fn profile(user: web::ReqData<User>) -> impl Responder {
    HttpResponse::Ok().json(user.into_inner())
}

#[derive(Deserialize)]
pub struct CreateGroupRequest {
    pub name: String,
    pub description: Option<String>,
    pub owner: Uuid,
}

pub async fn create_group(
    pool: web::Data<DbPool>,
    form: web::Json<CreateGroupRequest>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");

    let new_group = NewGroup {
        name: form.name.clone(),
        description: form.description.clone(),
        // Create a JSON array with the owner's UUID (as a string)
        members: to_value(vec![form.owner.to_string()]).unwrap(),
        owner: form.owner,
    };

    let group = match diesel::insert_into(crate::schema::groups::table)
        .values(new_group)
        .get_result::<Group>(&mut conn)
    {
        Ok(g) => g,
        Err(e) => {
            return HttpResponse::BadRequest()
                .json(json!({"error": format!("Error creating group: {:?}", e)}))
        }
    };

    if let Err(e) = diesel::insert_into(crate::schema::user_groups::table)
        .values((
            crate::schema::user_groups::user_id.eq(form.owner),
            crate::schema::user_groups::group_id.eq(group.id),
        ))
        .execute(&mut conn)
    {
        return HttpResponse::InternalServerError()
            .json(json!({"error": format!("Failed to add owner to user_groups: {:?}", e)}));
    }

    HttpResponse::Ok().json(group)
}

#[derive(Deserialize)]
pub struct JoinGroupRequest {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

pub async fn join_group(
    pool: web::Data<DbPool>,
    form: web::Json<JoinGroupRequest>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");

    if let Err(e) = diesel::insert_into(crate::schema::user_groups::table)
        .values((
            crate::schema::user_groups::user_id.eq(form.user_id),
            crate::schema::user_groups::group_id.eq(form.group_id),
        ))
        .execute(&mut conn)
    {
        return HttpResponse::BadRequest()
            .json(json!({"error": format!("Failed to join group: {:?}", e)}));
    }

    let members: Vec<String> = match crate::schema::user_groups::table
        .filter(crate::schema::user_groups::group_id.eq(form.group_id))
        .select(crate::schema::user_groups::user_id)
        .load::<Uuid>(&mut conn)
    {
        Ok(uuids) => uuids.into_iter().map(|uuid| uuid.to_string()).collect(),
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(json!({"error": format!("Error loading members: {:?}", e)}))
        }
    };

    if let Err(e) = diesel::update(crate::schema::groups::table)
        .filter(crate::schema::groups::id.eq(form.group_id))
        .set(crate::schema::groups::members.eq(to_value(&members).unwrap()))
        .execute(&mut conn)
    {
        return HttpResponse::InternalServerError()
            .json(json!({"error": format!("Error updating group members: {:?}", e)}));
    }

    HttpResponse::Ok().json(json!({"message": "Joined group successfully"}))
}

pub async fn leave_group(
    pool: web::Data<DbPool>,
    form: web::Json<JoinGroupRequest>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");

    if let Err(e) = diesel::delete(
        crate::schema::user_groups::table
            .filter(crate::schema::user_groups::user_id.eq(form.user_id))
            .filter(crate::schema::user_groups::group_id.eq(form.group_id)),
    )
    .execute(&mut conn)
    {
        return HttpResponse::BadRequest()
            .json(json!({"error": format!("Error removing user from group: {:?}", e)}));
    }

    let members: Vec<String> = match crate::schema::user_groups::table
        .filter(crate::schema::user_groups::group_id.eq(form.group_id))
        .select(crate::schema::user_groups::user_id)
        .load::<Uuid>(&mut conn)
    {
        Ok(uuids) => uuids.into_iter().map(|uuid| uuid.to_string()).collect(),
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(json!({"error": format!("Error loading members: {:?}", e)}))
        }
    };

    if let Err(e) = diesel::update(crate::schema::groups::table.find(form.group_id))
        .set(crate::schema::groups::members.eq(to_value(&members).unwrap()))
        .execute(&mut conn)
    {
        return HttpResponse::InternalServerError()
            .json(json!({"error": format!("Error updating group members: {:?}", e)}));
    }

    HttpResponse::Ok().json(json!({"message": "Left group successfully"}))
}
