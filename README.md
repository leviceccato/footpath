# Footpath

A tool to help with editing, viewing and optimising SVGs. It is an SPA built with [Lustre](https://github.com/lustre-labs/lustre).

> [!WARNING]  
> This project is an alpha state. Many features are missing as the bulk of development is yet to be completed.

## Usage

### Requirements

- Bun 1
- Gleam 1.2

### Development

Install dependencies.

```shell
bun install
gleam deps download
```

Run development server on [http://localhost:5173](http://localhost:5173).

```shell
bun start
```

Build app into `dist` folder.

```shell
bun run build
```

## Conventions

### Tasks

`TODO.md` is used as a kanban-style task management document. Currently it is designed for a single user will likely be expanded once the project reaches stable.

## Licenses

All non-third-party source code is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
