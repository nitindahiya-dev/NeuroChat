use actix::prelude::*;
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Message)]
#[rtype(result = "()")]
struct ClientMessage {
    room: String,
    content: String,
}

#[derive(Message)]
#[rtype(result = "usize")]
struct Connect {
    addr: Addr<ChatServer>,
}

#[derive(Serialize, Deserialize)]
struct ChatMessage {
    room: String,
    content: String,
}

pub struct ChatServer {
    sessions: HashMap<usize, Addr<ChatServer>>,
    rooms: HashMap<String, Vec<usize>>,
}

impl ChatServer {
    pub fn new() -> Self {
        ChatServer {
            sessions: HashMap::new(),
            rooms: HashMap::new(),
        }
    }

    fn send_message(&self, room: &str, message: &str, skip_id: usize) {
        if let Some(users) = self.rooms.get(room) {
            for id in users {
                if *id != skip_id {
                    if let Some(addr) = self.sessions.get(id) {
                        addr.do_send(ClientMessage {
                            room: room.to_string(),
                            content: message.to_string(),
                        });
                    }
                }
            }
        }
    }
}

impl Actor for ChatServer {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let id = self.sessions.len();
        self.sessions.insert(id, ctx.address());
        println!("New connection: {}", id);
    }
}

impl Handler<Connect> for ChatServer {
    type Result = usize;

    fn handle(&mut self, msg: Connect, _: &mut Self::Context) -> Self::Result {
        let id = self.sessions.len();
        self.sessions.insert(id, msg.addr);
        id
    }
}

// impl Handler<ClientMessage> for ChatServer {
//     type Result = ();

//     fn handle(&mut self, msg: ClientMessage, _: &mut Self::Context) {
//         self.rooms
//             .entry(msg.room.clone())
//             .or_insert_with(Vec::new)
//             .push(self.sessions.len() - 1);
//         let chat_msg = ChatMessage {
//             room: msg.room.clone(),
//             content: msg.content.clone(),
//         };
//         let serialized = serde_json::to_string(&chat_msg).unwrap();
//         self.send_message(&msg.room, &serialized, self.sessions.len() - 1);
//     }
// }

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for ChatServer {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                let chat_msg: ChatMessage = serde_json::from_str(&text).unwrap();
                ctx.notify(ClientMessage {
                    room: chat_msg.room,
                    content: chat_msg.content,
                });
            }
            Ok(ws::Message::Ping(ping)) => {
                ctx.pong(&ping);
            }
            Ok(ws::Message::Pong(_)) => {}
            Ok(ws::Message::Binary(_)) => {}
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            Ok(ws::Message::Continuation(_)) => {}
            Ok(ws::Message::Nop) => {}
            Err(_) => {
                ctx.stop();
            }
        }
    }
}

// Assuming you have a Handler implementation for ClientMessage
impl Handler<ClientMessage> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: ClientMessage, _ctx: &mut Self::Context) {
        // Handle the ClientMessage here, e.g., broadcast to room
        println!("Message in room {}: {}", msg.room, msg.content);
        // Add your broadcasting logic here
    }
}