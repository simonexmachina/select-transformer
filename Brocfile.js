/* jshint node:true */
var makeModules = require('broccoli-dist-es6-module');
var exportTree = require('broccoli-export-tree');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

var modules = makeModules('lib/', {
  global: 'SelectTransformer',
  packageName: 'select-transformer',
  main: 'select-transformer'
});
var dist = mergeTrees([modules, pickFiles('assets', {
  srcDir: '.',
  destDir: 'assets'
})]);

module.exports = mergeTrees([exportTree(dist, {
  destDir: 'dist'
}), dist]);
