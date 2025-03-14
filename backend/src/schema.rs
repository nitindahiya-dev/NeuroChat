// @generated automatically by Diesel CLI.

diesel::table! {
    groups (id) {
        id -> Uuid,
        name -> Text,
        description -> Nullable<Text>,
        owner -> Uuid,
        members -> Jsonb,
    }
}

diesel::table! {
    messages (id) {
        id -> Uuid,
        group_id -> Nullable<Uuid>,
        sender_id -> Nullable<Uuid>,
        content -> Text,
        timestamp -> Nullable<Timestamp>,
    }
}

diesel::table! {
    user_groups (user_id, group_id) {
        user_id -> Uuid,
        group_id -> Uuid,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        username -> Text,
        email -> Text,
        password_hash -> Text,
    }
}

diesel::joinable!(messages -> groups (group_id));
diesel::joinable!(messages -> users (sender_id));
diesel::joinable!(user_groups -> groups (group_id));
diesel::joinable!(user_groups -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    groups,
    messages,
    user_groups,
    users,
);
