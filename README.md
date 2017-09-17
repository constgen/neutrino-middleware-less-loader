# Neutrino Less loader middleware

[![npm](https://img.shields.io/npm/v/neutrino-middleware-less-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-less-loader)
[![npm](https://img.shields.io/npm/dt/neutrino-middleware-less-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-less-loader)

`neutrino-middleware-less-loader` is a [Neutrino](https://neutrino.js.org) middleware for compiling styles with [Less](http://lesscss.org/). This middleware only transforms Less to CSS. It is recommended to have `neutrino-middleware-style-loader` (or its substitution) in the configuration to be able to compile Less styles to JavaScript modules.

## Requirements

* Node.js v6.9+
* Neutrino v5 or v6

## Installation

`neutrino-middleware-less-loader` can be installed from NPM.

```
❯ npm install --save neutrino-middleware-less-loader
```

## Usage

`neutrino-middleware-less-loader` can be consumed from the Neutrino API, middleware, or presets.

### In preset

Require this package and plug it into Neutrino. The following shows how you can pass an options object to the middleware, showing the defaults:

```js
const lessLoader = require('neutrino-middleware-less-loader')

neutrino.use(lessLoader, {
  compress: true,
  strictImports: true,
  insecure: true,
  maxLineLen: -1,
  ieCompat: false,
  paths: [],
  sourceMap: true,
  relativeUrls: true,
  strictMath: false,
  strictUnits: false,
  globalVars: {},
  modifyVars: {},
  urlArgs: '',
  plugins: []
})
```

The options Reference can be found in official [Less Documentation](http://lesscss.org/3.x/usage/#less-options)

It is recommended to call this middleware after the `neutrino.config.module.rule('style')` initialization to avoid unexpected overriding. More information about usage of Neutrino middlewares can be found in the [documentation](https://neutrino.js.org/middleware). More in-depth description about customization may be found in the [Less Loader Documentation](https://github.com/webpack-contrib/less-loader)

### In neutrinorc

The middleware also may be used together with another presets in Neutrino rc-file, e.g.:

**.neutrinorc.js**
```js
module.exports = {
  use: [
    [
      'neutrino-preset-web',
      'neutrino-middleware-less-loader'
    ]
  ]
}
```

## Rules

This is a list of rules that are used by `neutrino-middleware-less-loader`:

* `less`: Compiles Less styles to CSS styles. Contains a single loader named the same `less`.
* `style`: Only necessary file extension added. CSS loader should be provided to correctly compile styles to JavaScript.


