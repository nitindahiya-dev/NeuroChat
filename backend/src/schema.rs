diesel::table! {
    users (id) {
        id -> Uuid,
        username -> Text,
        email -> Text,
        password_hash -> Text,
    }
}

diesel::table! {
    groups (id) {
        id -> Uuid,
        name -> Text,
        description -> Nullable<Text>,
    }
}

diesel::table! {
    user_groups (user_id, group_id) {
        user_id -> Uuid,
        group_id -> Uuid,
    }
}

// ✅ FIX: Define relationships properly
diesel::joinable!(user_groups -> users (user_id));
diesel::joinable!(user_groups -> groups (group_id));
diesel::allow_tables_to_appear_in_same_query!(users, groups, user_groups);
