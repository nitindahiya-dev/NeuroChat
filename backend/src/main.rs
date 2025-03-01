mod db;
mod auth;
mod schema;
mod models;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer, http};
use db::establish_connection;
use auth::{signup, login, profile};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let pool = establish_connection();
    println!("✅ Database connection established!");

    let server = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(Cors::default()
                .allowed_origin("http://localhost:3000") // Allow frontend
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                .allowed_headers(vec![http::header::CONTENT_TYPE, http::header::AUTHORIZATION])
                .supports_credentials() // 🔥 Allow cookies/sessions
            )
            .app_data(web::Data::new(pool.clone()))
            .route("/signup", web::post().to(signup))
            .route("/login", web::post().to(login))
            .route("/profile", web::get().to(profile))
    })
    .bind("127.0.0.1:8080")?;

    println!("🚀 Server is running at http://127.0.0.1:8080");
    server.run().await
}
