mod auth;
mod db;
mod groups;
mod models;
mod schema;
mod ws;

use actix::Actor;
use actix_cors::Cors;
use actix_web::http::header;
use actix_web::{middleware, web, App, HttpServer};
use auth::{create_group, join_group, login, profile, signup};
use crate::groups::{get_groups, update_group, delete_group}; // Import endpoints
use db::establish_connection;
use ws::ChatServer;
use uuid::Uuid;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let pool = establish_connection();
    println!("✅ Database connection established!");

    let chat_server = ChatServer::new().start();

    let server = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![header::CONTENT_TYPE, header::AUTHORIZATION])
                    .supports_credentials(),
            )
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(chat_server.clone()))
            .route("/signup", web::post().to(signup))
            .route("/login", web::post().to(login))
            .route("/profile", web::get().to(profile))
            .route("/create-group", web::post().to(create_group))
            .route("/join-group", web::post().to(join_group))
            .route("/ws", web::get().to(ws::ws_index))
            .route("/groups", web::get().to(get_groups))
            .route("/update-group", web::put().to(update_group))
            .route("/groups/{id}", web::delete().to(delete_group))
    })
    .bind("127.0.0.1:8080")?;

    println!("🚀 Server is running at http://127.0.0.1:8080");
    server.run().await
}
