'use strict';
var test = require('ava');
var execFileSync = require('./');

test(function (t) {
	t.assert(execFileSync('node', ['fixture.js', 'unicorn'], {cwd: __dirname}).toString().trim() === 'unicorn');
	t.end();
});
