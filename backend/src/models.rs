use bcrypt::{verify, DEFAULT_COST};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::users)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

impl User {
    pub fn create(
        username: &str,
        email: &str,
        password: &str,
        conn: &mut PgConnection,
    ) -> Result<PublicUser, diesel::result::Error> {
        use crate::schema::users::dsl::{users, id, username as user_username, email as user_email};

        let new_user = User {
            id: Uuid::new_v4(),
            username: username.to_owned(),
            email: email.to_owned(),
            password_hash: bcrypt::hash(password, DEFAULT_COST).unwrap(),
        };

        diesel::insert_into(users).values(&new_user).execute(conn)?;

        users
            .filter(user_email.eq(&new_user.email))
            .select((id, user_username, user_email))
            .first::<PublicUser>(conn)
    }

    pub fn find_by_email(
        user_email: &str,
        conn: &mut PgConnection,
    ) -> Result<User, diesel::result::Error> {
        use crate::schema::users::dsl::*;
        users.filter(email.eq(user_email)).first::<User>(conn)
    }

    pub fn verify_password(&self, password: &str) -> bool {
        verify(password, &self.password_hash).unwrap_or(false)
    }
} // Single closing brace for `impl User`

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct PublicUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::groups)]
pub struct NewGroup {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Group {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
}