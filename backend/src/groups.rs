use crate::db::DbPool;
use crate::models::Group;
use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use serde::Deserialize;
use serde_json::{json, to_value};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct UpdateGroupRequest {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub members: Vec<String>,
    pub owner: String,
}

pub async fn get_groups(pool: web::Data<DbPool>) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    let groups = crate::schema::groups::table
        .load::<Group>(&mut conn)
        .expect("Error loading groups");
    HttpResponse::Ok().json(groups)
}

pub async fn update_group(
    pool: web::Data<DbPool>,
    form: web::Json<UpdateGroupRequest>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");
    let group_id = Uuid::parse_str(&form.id).expect("Invalid UUID in form.id");
    let owner_id = Uuid::parse_str(&form.owner).expect("Invalid UUID in form.owner");
    let updated_members = to_value(&form.members).unwrap();

    let result = diesel::update(crate::schema::groups::table)
        .filter(crate::schema::groups::id.eq(group_id))
        .set((
            crate::schema::groups::name.eq(&form.name),
            crate::schema::groups::description.eq(&form.description),
            crate::schema::groups::members.eq(updated_members),
            crate::schema::groups::owner.eq(owner_id),
        ))
        .execute(&mut conn);

    match result {
        Ok(_) => HttpResponse::Ok().json(json!({"message": "Group updated successfully"})),
        Err(e) => HttpResponse::BadRequest().json(json!({"error": format!("Failed to update group: {:?}", e)})),
    }
}


pub async fn delete_group(path: web::Path<Uuid>, pool: web::Data<DbPool>) -> impl Responder {
    let group_id = path.into_inner();
    let mut conn = pool.get().expect("Failed to get DB connection");

    println!("Attempting to delete group: {}", group_id);

    // Check if group exists
    let group_exists = crate::schema::groups::table
        .filter(crate::schema::groups::id.eq(group_id))
        .first::<Group>(&mut conn)
        .is_ok();
    if !group_exists {
        println!("Group not found: {}", group_id);
        return HttpResponse::NotFound().json(json!({"error": "Group not found"}));
    }

    // Delete user_groups entries
    let user_groups_deleted = diesel::delete(
        crate::schema::user_groups::table.filter(crate::schema::user_groups::group_id.eq(group_id))
    )
    .execute(&mut conn)
    .unwrap_or(0);
    println!("Deleted {} user_groups rows", user_groups_deleted);

    // Delete the group
    let result = diesel::delete(
        crate::schema::groups::table.filter(crate::schema::groups::id.eq(group_id))
    )
    .execute(&mut conn);

    match result {
        Ok(count) if count > 0 => {
            println!("Deleted group with id: {}", group_id);
            HttpResponse::Ok().json(json!({"message": "Group deleted successfully"}))
        },
        Ok(_) => HttpResponse::NotFound().json(json!({"error": "Group not found"})),
        Err(e) => {
            println!("Error deleting group: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": format!("Failed to delete group: {:?}", e)}))
        },
    }
}
