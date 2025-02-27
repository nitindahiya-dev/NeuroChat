use actix_web::{web, App, HttpServer, HttpResponse};
use actix_web_actors::ws;
use dotenv::dotenv;
use std::env;

mod actors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let server_addr = "0.0.0.0:8080";

    println!("Starting server at {}", server_addr);
    println!("Starting datbase at {}", database_url);

    HttpServer::new(|| {
        App::new()
            .route("/ws", web::get().to(ws_route))
    })
    .bind(server_addr)?
    .run()
    .await
}

async fn ws_route(req: actix_web::HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
    ws::start(actors::ChatServer::new(), &req, stream)
}