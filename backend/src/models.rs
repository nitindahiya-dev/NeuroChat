use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::prelude::*;
use diesel::sql_types::Jsonb; // needed for annotation
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Queryable, Serialize, Deserialize, Clone)]
pub struct PublicUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Queryable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::users)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

impl User {
    pub fn create(
        user_name: &str,
        user_email: &str,
        user_password: &str,
        conn: &mut PgConnection,
    ) -> Result<PublicUser, diesel::result::Error> {
        use crate::schema::users::dsl::*;
        let new_user = NewUser {
            id: Uuid::new_v4(),
            username: user_name.to_owned(),
            email: user_email.to_owned(),
            password_hash: hash(user_password, DEFAULT_COST).unwrap(),
        };
        diesel::insert_into(users)
            .values(&new_user)
            .execute(conn)?;
        // Return only public fields
        users
            .filter(email.eq(&new_user.email))
            .select((id, username, email))
            .first(conn)
    }

    pub fn find_by_email(
        search_email: &str,
        conn: &mut PgConnection,
    ) -> Result<User, diesel::result::Error> {
        use crate::schema::users::dsl::*;
        users.filter(email.eq(search_email)).first(conn)
    }

    pub fn verify_password(&self, password: &str) -> bool {
        verify(password, &self.password_hash).unwrap_or(false)
    }
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::groups)]
pub struct NewGroup {
    pub name: String,
    pub description: Option<String>,
    #[diesel(sql_type = Jsonb)]
    pub members: Value,
    pub owner: Uuid,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::groups)]
pub struct Group {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub owner: Uuid, // Ensure order matches DB: (id, name, description, owner, members)
    #[diesel(sql_type = Jsonb)]
    pub members: Value,
}
