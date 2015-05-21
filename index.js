'use strict';
var syncExec = require('sync-exec');
var childProcess = require('child_process');

module.exports = function () {
	if ('execFileSync' in childProcess) {
		return childProcess.execFileSync.apply(childProcess, arguments);
	}

	var args = [].slice.call(arguments);

	// normalize optional args into the first command argument
	if (Array.isArray(args[1])) {
		args[0] = args[0] + ' ' + args[1].join(' ');
		args.splice(1, 1);
	}

	return new Buffer(syncExec(args.shift(), args).stdout);
};
