use actix::{Actor, Addr, Context, Handler, Message as ActixMessage, Recipient, StreamHandler, AsyncContext};
use actix_web::{HttpRequest, HttpResponse, web};
use actix_web_actors::ws;
use std::collections::HashMap;
use std::time::{Duration, Instant};
use actix::prelude::*;
use actix::ActorContext;

// Message to broadcast to sessions
#[derive(ActixMessage)]
#[rtype(result = "()")]
pub struct BroadcastMessage {
    pub room: String,
    pub message: String,
}

// Message from client to server
#[derive(ActixMessage)]
#[rtype(result = "()")]
pub struct ClientMessage {
    pub room: String,
    pub message: String,
}

#[derive(ActixMessage)]
#[rtype(result = "usize")]
pub struct Connect {
    pub addr: Recipient<BroadcastMessage>,
    pub room: String,
}

#[derive(ActixMessage)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: usize,
    pub room: String,
}

pub struct ChatServer {
    sessions: HashMap<usize, Recipient<BroadcastMessage>>,
    rooms: HashMap<String, Vec<usize>>,
    counter: usize,
}

impl ChatServer {
    pub fn new() -> Self {
        ChatServer {
            sessions: HashMap::new(),
            rooms: HashMap::new(),
            counter: 0,
        }
    }
    pub fn broadcast(&self, room: &str, message: &str) {
        if let Some(session_ids) = self.rooms.get(room) {
            for id in session_ids {
                if let Some(addr) = self.sessions.get(id) {
                    let _ = addr.do_send(BroadcastMessage {
                        room: room.to_owned(),
                        message: message.to_owned(),
                    });
                }
            }
        }
    }
}

impl Actor for ChatServer {
    type Context = Context<Self>;
}

impl Handler<Connect> for ChatServer {
    type Result = usize;
    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        let id = self.counter;
        self.counter += 1;
        self.sessions.insert(id, msg.addr);
        self.rooms.entry(msg.room.clone()).or_insert_with(Vec::new).push(id);
        id
    }
}

impl Handler<Disconnect> for ChatServer {
    type Result = ();
    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        self.sessions.remove(&msg.id);
        if let Some(ids) = self.rooms.get_mut(&msg.room) {
            ids.retain(|&x| x != msg.id);
        }
    }
}

impl Handler<ClientMessage> for ChatServer {
    type Result = ();
    fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
        self.broadcast(&msg.room, &msg.message);
    }
}

pub struct ChatSession {
    pub id: usize,
    pub room: String,
    pub server: Addr<ChatServer>,
    pub hb: Instant,
}

impl ChatSession {
    pub fn new(room: String, server: Addr<ChatServer>) -> Self {
        ChatSession {
            id: 0,
            room,
            server,
            hb: Instant::now(),
        }
    }
    fn start_heartbeat(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(Duration::from_secs(5), |act, ctx| {
            if Instant::now().duration_since(act.hb) > Duration::from_secs(10) {
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
}

impl Actor for ChatSession {
    type Context = ws::WebsocketContext<Self>;
    fn started(&mut self, ctx: &mut Self::Context) {
        self.start_heartbeat(ctx);
        let addr = ctx.address().recipient();
        self.server
            .send(Connect {
                addr,
                room: self.room.clone(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(id) => act.id = id,
                    Err(_) => ctx.stop(),
                }
                actix::fut::ready(())
            })
            .wait(ctx);
    }
    fn stopped(&mut self, _: &mut Self::Context) {
        self.server.do_send(Disconnect {
            id: self.id,
            room: self.room.clone(),
        });
    }
}

impl Handler<BroadcastMessage> for ChatSession {
    type Result = ();
    fn handle(&mut self, msg: BroadcastMessage, ctx: &mut Self::Context) {
        ctx.text(msg.message);
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for ChatSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Text(text)) => {
                self.server.do_send(ClientMessage {
                    room: self.room.clone(),
                    message: text.trim().to_string(),
                });
            }
            Ok(ws::Message::Binary(_)) => println!("Unexpected binary"),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}

pub async fn ws_index(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<ChatServer>>,
) -> Result<HttpResponse, actix_web::Error> {
    let room = req
        .uri()
        .query()
        .and_then(|q| {
            q.split('&').find_map(|param| {
                let mut parts = param.split('=');
                if let (Some(key), Some(val)) = (parts.next(), parts.next()) {
                    if key == "room" {
                        Some(val.to_owned())
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
        })
        .unwrap_or_else(|| "general".to_owned());
    let session = ChatSession::new(room, srv.get_ref().clone());
    ws::start(session, &req, stream)
}