# Lacey

A tool to help with editing, viewing and optimising SVGs. It is an SPA built with [SolidJS](https://www.solidjs.com), [vanilla-extract](https://vanilla-extract.style), [Vite](https://vitejs.dev) and [Bun](https://bun.sh). Check it out at [lacey.onrender.com](https://lacey.onrender.com).

This project is an alpha state. Many features are missing as the bulk of development is yet to be completed.

## Usage

### Requirements

- Bun 1

### Development

Install dependencies.

```shell
bun install
```

Install git hooks. See [https://github.com/evilmartians/lefthook/tree/master#readme](https://github.com/evilmartians/lefthook/tree/master#readme) for more information. This command should be re-run after making any changes to the lefthook configuration.

```shell
bun run install-hooks
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

## Deployment

This app is hosted on Render. Deploys must be manually triggered from the [Render dashboard](https://dashboard.render.com).

## Licenses

All non-third-party source code is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
