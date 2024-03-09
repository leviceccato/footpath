# Footpath

A tool to help with editing, viewing and optimising SVGs. It is an SPA built with [SolidJS](https://www.solidjs.com).

> [!WARNING]  
> This project is an alpha state. Many features are missing as the bulk of development is yet to be completed.

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

### Git hooks

This project uses `lefthook` to manage git hooks. See [https://github.com/evilmartians/lefthook/tree/master#readme](https://github.com/evilmartians/lefthook/tree/master#readme) for more information. `bunx lefthook install` should be ran after making any changes to `lefthook.json`.

## Conventions

### Organisation

In this project a flat directory style encouraged. There should only be 1 level of depth within `src`. This should improve discoverability of files and ease decision making when it comes to creating new ones.

The exception to this rule is the `src/routes` directory. Arbitrary nesting is allowed here in order to reflect the routes in the app (pseudo filesystem routing). Currently, no official router is used but in the future as more routes are added the structure may change.

## Testing

### Unit testing

Unit tests are used for discrete sections of the codebase. They are prefered for pure functions, such as the ones you would find in `src/utils` that don't require complex mocks or environments. This project uses Buns test runner. Test files should be created alongside the file with the functions to be tested in the format `[file-name].test.ts`.

To run tests:

```shell
bun test
```

### E2E testing

Rather than using individual component testing this project instead relies on E2E testing through Playwright to test complex UI interactions and flows. Currently, this is not implemented as the main flows are interactions in the app are yet to be resolved.

## Licenses

All non-third-party source code is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
