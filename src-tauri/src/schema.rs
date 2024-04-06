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
