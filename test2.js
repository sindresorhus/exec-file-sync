'use strict';
// https://github.com/nodejs/io.js/blob/f95f9ef6ea2eb3e7cc98c3dea372d74b4bb10910/test/sequential/test-child-process-execsync.js
var assert = require('assert');
var util = require('util');
var execFileSync = require('./');

var msg = 'foobar';
var msgBuf = new Buffer(msg + '\n');
var args = ['-e', util.format('console.log("%s");', msg)];

var ret = execFileSync(process.execPath, args);
assert.deepEqual(ret, msgBuf);

ret = execFileSync(process.execPath, args, {encoding: 'utf8'});
assert.strictEqual(ret, msg + '\n', 'execFileSync encoding result should match');
