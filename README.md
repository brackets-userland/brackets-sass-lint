# Brackets Sass Lint

Brackets extension for pure Node.js linting of `sass` and `scss` syntaxed files, powered by [Sass-Lint](https://github.com/sasstools/sass-lint).
No external dependencies needed!

## Installation

You can always find the latest version of `brackets-sass-lint` from the Brackets Extension Manager.

1. Open Brackets
2. Select `File -> Extension Manager`
3. Search for `brackets-sass-lint`
4. Click `Install`
5. Close the Extension Manager window

Alternatively you can install it straight from this GitHub repo

1. Open Brackets
2. Select `File -> Extension Manager`
3. Click `Install from URL...`
4. Enter the following URL: `https://github.com/petetnt/brackets-sass-lint`
5. Click `Install`
6. Close the Extension Manager window

Or you can just clone the repo to `%Brackets Extension Folder%/user/` with 

``` bash
git clone https://github.com/petetnt/brackets-sass-lint
```

The package is also available on [`brackets-npm-registry`](https://github.com/zaggino/brackets-npm-registry). 

To install it, follow the following steps:

1. Install `brackets-npm-registry`
2. Click the `npm`-button on your taskbar
3. Install `brackets-sass-lint`.

## Rules

By default, the linter uses built-in default, similar to those set in this projects `.sass-lint.yml`.

To override these defaults, create file called `.sass-lint.yml` on your project root. You can use [this sample config](https://github.com/sasstools/sass-lint/blob/develop/docs/sass-lint.yml) as the base for your own configurations.

## Todo

 - [ ] Finish writing the unit tests under `unittests.js`

## Versions

- 1.11.1
  - Version bump
  - Updated `sass-lint` to 1.10.0

- 1.10.0
  - Version bump
  - Updated `sass-lint` to 1.10.0

- 1.0.0
  - Version bump
  - Update `sass-lint` to 1.7.0

- 0.0.2
  - Release on `brackets-npm-registry` because of on-going issue with the `brackets-registry`

- 0.0.1
  - First release!
  - Lint your SASS and SCSS files with ease!

## Contributing

Contributions are welcome! Send a PR or submit an issue! Make sure your changes pass ESLint and create new unit tests if needed.

## Releasing as a zip file

Generate the `petetnt.brackets-sass-lint` zip file by bumping up the version number in `package.json`, committing your changes and running `npm run release`. You can then find the new zip file under `release/`.

## License

MIT
