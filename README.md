# Neutrino Less loader middleware

[![npm](https://img.shields.io/npm/v/neutrino-middleware-less-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-less-loader)
[![npm](https://img.shields.io/npm/dt/neutrino-middleware-less-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-less-loader)

`neutrino-middleware-less-loader` is a [Neutrino](https://neutrino.js.org) middleware for compiling styles with [Less](http://lesscss.org/). This middleware only transforms Less to CSS. It is recommended to have `@neutrinojs/style-loader` (or its substitution) in the configuration to be able to compile Less styles to JavaScript modules.

## Requirements

* Node.js v10.13+
* Neutrino v9

## Installation

`neutrino-middleware-less-loader` can be installed from NPM. You should install it to `"dependencies"` (--save) or `"devDependncies"` (--save-dev) depending on your goal.

```bash
npm install --save-dev neutrino-middleware-less-loader
```

## Usage

`neutrino-middleware-less-loader` can be consumed from the Neutrino API, middleware, or presets.

### In preset

Require this package and plug it into Neutrino. The following shows how you can pass an options object to the middleware, showing the defaults:

```js
let lessLoader = require('neutrino-middleware-less-loader')

neutrino.use(lessLoader({
   include: ['src', 'tests'],
   exclude: [],
   less   : {
      insecure   : true,
      paths      : [],
      rewriteUrls: 'all',
      math       : 'always',
      strictUnits: false,
      globalVars : {},
      modifyVars : {},
      urlArgs    : '',
      plugins    : []
   }
}))
```

* `include`: optional array of paths to include in the compilation. Maps to Webpack's rule.include.
* `exclude`: optional array of paths to exclude from the compilation. Maps to Webpack's rule.include.
* `less`: optional [Less options](http://lesscss.org/3.x/usage/#less-options) config that is passed to the loader.

It is recommended to call this middleware after the `neutrino.config.module.rule('style')` initialization to avoid unexpected overriding. More information about usage of Neutrino middlewares can be found in the [documentation](https://neutrino.js.org/middleware).

### In **neutrinorc**

The middleware also may be used together with another presets in Neutrino rc-file, e.g.:

**.neutrinorc.js**

```js
let web        = require('@neutrino/web')
let lessLoader = require('neutrino-middleware-less-loader')

module.exports = {
   use: [
      web(),
      lessLoader()
   ]
}
```

### Imports paths

The loader can resolve paths in one of two modes: Less or Webpack.

Webpack's resolver is used by default. To use its advantages to look up the `modules` you need to prepend `~` to the path:

```css
@import "~bootstrap/less/bootstrap";
```

Otherwise the path will be determined as a relative URL, `@import "file"` is the same as `@import "./file"`

If you specify the `paths` option, the Webpack's resolver will not be used. Modules, that can't be resolved in the local folder, will be searched in the given `paths`. This is Less' default behavior. `paths` should be an array with absolute paths:

```js
let lessLoader = require('neutrino-middleware-less-loader')

neutrino.use(lessLoader({
   less: {
      paths: [
         path.resolve(__dirname, 'node_modules')
      ]
   }
}))
```

### Importing variables from JS

LESS files can import variables from JS modules. Example:

**vars.js**

```js
module.exports = {
   'default-color': 'yellow',
   'border'       : '2px solid red'
}
```

**main.less**

```less
require('./vars.js');

@import "./other.less";

.box:extend(.darkgreen) {
  color: @default-color;
  border: @border;
  width: 200px;
  height: 200px;
}
```

It is recommended to `require` all JS modules before any `@import` rules.

### Plugins

In order to use LESS plugins, simply set the `plugins` option:

```js
let CleanCSSPlugin = require('less-plugin-clean-css')

neutrino.use(lessLoader({
   less: {
      plugins: [
         new CleanCSSPlugin({ advanced: true })
      ]
   }
}))
```

## Rules

This is a list of rules that are used by `neutrino-middleware-less-loader`:

* `less`: Compiles Less styles to CSS styles. Contains two loaders named: `less` and `less-var`.
* `style`: Only necessary file extension added. CSS loader should be provided to correctly compile styles to JavaScript.
