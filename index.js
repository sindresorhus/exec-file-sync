'use strict';
var spawnSync = require('spawn-sync');
var childProcess = require('child_process');
var util = require('util');

module.exports = childProcess.execFileSync || execFileSync;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

var _deprecatedCustomFds = util.deprecate(function(options) {
  options.stdio = options.customFds.map(function(fd) {
    return fd === -1 ? 'pipe' : fd;
  });
}, 'child_process: customFds option is deprecated, use stdio instead.');

function _convertCustomFds(options) {
  if (options && options.customFds && !options.stdio) {
    _deprecatedCustomFds(options);
  }
}


function normalizeSpawnArguments(file /*, args, options*/) {
  var args, options;

  if (Array.isArray(arguments[1])) {
    args = arguments[1].slice(0);
    options = arguments[2];
  } else if (arguments[1] !== undefined && !isObject(arguments[1])) {
    throw new TypeError('Incorrect value of args option');
  } else {
    args = [];
    options = arguments[1];
  }

  if (options === undefined)
    options = {};
  else if (!isObject(options))
    throw new TypeError('options argument must be an object');

  args.unshift(file);

  var env = options.env || process.env;
  var envPairs = [];

  for (var key in env) {
    envPairs.push(key + '=' + env[key]);
  }

  _convertCustomFds(options);

  return {
    file: file,
    args: args,
    options: options,
    envPairs: envPairs
  };
}

function checkExecSyncError(ret) {
  if (ret.error || ret.status !== 0) {
    var err = ret.error;
    ret.error = null;

    if (!err) {
      var msg = 'Command failed: ' +
        (ret.cmd ? ret.cmd : ret.args.join(' ')) +
          (ret.stderr ? '\n' + ret.stderr.toString() : '');
      err = new Error(msg);
    }

    util._extend(err, ret);
    return err;
  }

  return false;
}

function execFileSync(/*command, options*/) {
  var opts = normalizeSpawnArguments.apply(null, arguments);
  var inheritStderr = !opts.options.stdio;

  var ret = spawnSync(opts.file, opts.args.slice(1), opts.options);

  if (inheritStderr)
    process.stderr.write(ret.stderr);

  var err = checkExecSyncError(ret);

  if (err)
    throw err;
  else
    return ret.stdout;
}
exports.execFileSync = execFileSync;
