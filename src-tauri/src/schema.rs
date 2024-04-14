// @generated automatically by Diesel CLI.

diesel::table! {
    accounts (id) {
        id -> Integer,
        userID -> Text,
        displayName -> Text,
        userName -> Text,
        serverDomain -> Text,
        accessToken -> Text,
    }
}

diesel::table! {
    timelines (id) {
        id -> Integer,
        accountID -> Nullable<Integer>,
        serverDomain -> Text,
        channel -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    accounts,
    timelines,
);
