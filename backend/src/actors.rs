use actix::prelude::*;
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Messages
#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
    pub id: usize,
    pub msg: String,
}

#[derive(Message)]
#[rtype(result = "usize")]
pub struct Connect {
    pub addr: Addr<ChatServer>,
}

// Chat Server Actor
pub struct ChatServer {
    sessions: HashMap<usize, Addr<ChatServer>>,
    next_id: usize,
}

impl ChatServer {
    pub fn new() -> Self {
        ChatServer {
            sessions: HashMap::new(),
            next_id: 0,
        }
    }
}

impl Actor for ChatServer {
    type Context = Context<Self>;
}

impl Handler<Connect> for ChatServer {
    type Result = usize;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        let id = self.next_id;
        self.next_id += 1;
        self.sessions.insert(id, msg.addr);
        id
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for ChatServer {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => println!("Received: {}", text),
            Ok(ws::Message::Close(_)) => ctx.stop(),
            _ => (),
        }
    }
}

impl Handler<ClientMessage> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
        println!("Message from {}: {}", msg.id, msg.msg);
    }
}