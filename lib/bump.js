var semver = require('semver'),
	exec   = require('child_process').exec,
	escape = require('any-shell-escape'),
	gutil  = require('gulp-util'),
	last   = require('./last');

var addGitTag = function (commit, tag, opts, cb) {
	var cmd = "git tag " + escape([tag, commit]);

	exec(cmd, opts, function (err, stdout, stderr) {
		if (!err) {
			cb(stdout);
		} else {
			throw new Error(err);
		}
	});
};

module.exports = function (branch, bump, opts, cb) {
	if (!branch) { throw new Error('gulp-taggit: `bump` requires a branch name'); }
	if (!semver) { throw new Error('gulp-taggit: `bump` requires bump arg, eg: patch, minor, major'); }
	if (typeof(cb) !== 'function') { throw new Error('gulp-taggit: `bump` requires callback function'); }

	opts = opts || {};
	opts.cwd = opts.cwd || process.cwd;

	last(branch, opts, function (tag) {
		var newtag;

		if (tag) {
			newtag = semver.inc(tag, bump);

			if (opts.trimprerelease === true) {
				newtag = newtag.replace(/-\d+$/,'');
			}

			gutil.log('Creating git tag `' + newtag + '` on `' + branch + '`');

			addGitTag(branch, newtag, opts, cb);
		}
	});
};
