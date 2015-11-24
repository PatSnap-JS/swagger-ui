/**
 * Created by wx on 11/20/15.
 */
'use strict';
var axios = require('axios');
var fs = require('fs');
var gulp = require("gulp");
var git = require("gulp-git");
var path = require('path');

var workspace = './workspace';
var repoGroup= 'git@git.patsnap.com:swagger-doc';
var gitHttpConf = require('./src/ps_main/gitHttpConf.js');
var clean = require('gulp-clean');

var gitUtils = require('./src/ps_main/gitUtils.js');



var cwdOpt = {cwd:workspace};


var swDocPath = path.join(workspace,'swagger-doc');

function getRepos(){
	return gitUtils.fetchProject()
}

function clone(url){
	return new Promise(function(res,rej){
		git.clone(url,{cwd:swDocPath}, function (err) {
			if (err){rej(err)}else{res()}
		});
	});
}
gulp.task('cleanWorkspace',function(){
	if (!fs.existsSync(swDocPath)){
		fs.mkdirSync(swDocPath);
	}
	return gulp.src([path.join(swDocPath,'**/*.*')], {read: false})
			.pipe(clean());
});

gulp.task('pullDocs',['cleanWorkspace'], function() {
	return getRepos()
		.then(function(projects){
			var pullList = projects.map(projectObj=>clone(projectObj.ssh_url_to_repo));
			return Promise.all(pullList);
		});
});

//gulp.start('pullDocs');