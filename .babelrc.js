const path = require('path');
const pkg = require('./package.json');
const projPkg = require(path.join(process.cwd(), 'package.json'));

module.exports = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: projPkg.browserslist || pkg.browserslist,
        },
        modules: 'commonjs',
        useBuiltIns: false,
        debug: false,
      },
    ],
    'stage-0',
    'react'
  ]
}