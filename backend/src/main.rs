mod db;
mod auth;
mod schema;
mod models;
mod ws;
mod groups;

use actix_web::{web, App, HttpServer, middleware};
use actix_cors::Cors;
use db::establish_connection;
use auth::{signup, login, profile, create_group, join_group};
use actix_web::http::header; // Fix: Use Actix-Web's http module

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let pool = establish_connection();
    println!("✅ Database connection established!");

    let server = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![header::CONTENT_TYPE, header::AUTHORIZATION]) // Works with the new import
                    .supports_credentials()
            )
            .app_data(web::Data::new(pool.clone()))
            .route("/signup", web::post().to(signup))
            .route("/login", web::post().to(login))
            .route("/profile", web::get().to(profile))
            .route("/create-group", web::post().to(create_group))
            .route("/join-group", web::post().to(join_group))
            .route("/ws", web::get().to(ws::ws_index))
            .route("/groups", web::get().to(groups::get_groups))

    })
    .bind("127.0.0.1:8080")?;

    println!("🚀 Server is running at http://127.0.0.1:8080");
    server.run().await
}