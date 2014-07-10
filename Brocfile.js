/* jshint node:true */
var makeModules = require('broccoli-dist-es6-module');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

var modules = makeModules('lib/', {
  global: 'SelectTransformer',
  packageName: 'select-transformer',
  main: 'select-transformer'
});

module.exports = mergeTrees([modules, pickFiles('assets', {
  srcDir: '.',
  destDir: 'assets'
})]);
