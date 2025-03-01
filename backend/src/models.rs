// src/models.rs
use diesel::prelude::*;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Queryable, Selectable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::users)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct PublicUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}