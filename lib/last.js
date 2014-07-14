var semver = require('semver'),
	exec   = require('child_process').exec,
	escape = require('any-shell-escape');

var getGitDescribe = function (branch, opts, cb) {
	var cmd = "git describe --tags --always " + escape([branch]);

	exec(cmd, opts, function (err, stdout, stderr) {
		if (!err) {
			cb(stdout.replace(/[\r\n]/g, ''));
		} else {
			cb('');
		}
	});
};

module.exports = function (branch, opts, cb) {
	if (!branch) { throw new Error('gulp-taggit: `last` requires a branch name'); }
	if (typeof(cb) !== 'function') { throw new Error('gulp-taggit: third option must be a function for callback'); }

	opts = opts || {};
	opts.cwd = opts.cwd || process.cwd;

	getGitDescribe(branch, opts, function (tag) {
		cb((semver.valid(tag) && tag) || null);
	});
};

