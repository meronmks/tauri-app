# tauri-app
This is a [Tauri](https://tauri.studio) application.
The application name is tentative.

## Requirements (building)
- [Node.js] v20
- [npm]
- [cargo]
- [sqlite3]
- [diesel_cli]

[Node.js]: https://nodejs.org/en
[npm]: https://www.npmjs.com
[cargo]: https://doc.rust-lang.org/cargo/
[sqlite3]: https://www.sqlite.org/
[diesel_cli]: https://diesel.rs/

## DB Migration
Files for migration are located in `migrations` directory.
```pwsh
diesel migration generate <migration_name>
```

e.g.
```pwsh
diesel migration generate create_posts
```

Create a schema file in `src/schema.rs` and add the following code:
```pwsh
diesel migration run --database-url <database_url>
```

e.g.
```pwsh
diesel migration run --database-url AppSystem.db
```

## Building

```pwsh
npm run tauri build
```

## Development

```pwsh
npm run tauri dev
```
