var semver = require('semver'),
	exec   = require('child_process').exec,
	escape = require('any-shell-escape');

var getGitDescribe = function (branch, opts, cb) {
	var cmd = "git describe --tags --always " + escape([branch]);

	exec(cmd, opts, function (err, stdout, stdrr) {
		if (cb) { cb(stdout); }
	});
};

module.exports = function (branch, opts, cb) {
	if (!branch) { throw new Error('gulp-taggit: `last` requires a branch name'); }

	opts = opts || {};
	opts.cwd = opts.cwd || process.cwd;

	getGitDescribe(branch, opts, function (tag) {
		cb("tag found " + tag);
	});
};

