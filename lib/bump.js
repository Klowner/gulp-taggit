var semver = require('semver'),
	exec   = require('child_process').exec,
	escape = require('any-shell-escape'),
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
		var result;

		if (tag) {
			newtag = semver.inc(tag, bump);

			if (opts.trimprerelease === false) {
				newtag = newtag.replace(/-\d+$/,'');
			}

			addGitTag(branch, newtag, opts, cb);
		}
	});
};
