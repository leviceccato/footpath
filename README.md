# Footpath

A tool to help with editing, viewing and optimising SVGs. It is an SPA built with [SolidJS](https://www.solidjs.com), [vanilla-extract](https://vanilla-extract.style), [Vite](https://vitejs.dev) and [Bun](https://bun.sh).

This project is an alpha state. Many features are missing as the bulk of development is yet to be completed.

## Usage

### Requirements

- Bun 1

### Development

Install dependencies.

```shell
bun install
```

Run development server on [http://localhost:5173](http://localhost:5173).

```shell
bun start
```

Build app into `dist` folder.

```shell
bun run build
```

Run tests.

```shell
bun test
```

### Git hooks

This project uses `lefthook` to manage git hooks. See [https://github.com/evilmartians/lefthook/tree/master#readme](https://github.com/evilmartians/lefthook/tree/master#readme) for more information. `bunx lefthook install` should be ran after making any changes to `lefthook.json`.

## Licenses

All non-third-party source code is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
