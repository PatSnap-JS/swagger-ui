/**
 * Created by wx on 11/20/15.
 */
'use strict';
var axios = require('axios');
var co = require('co');
var fs = require('fs');
var gulp = require("gulp");
var git = require("gulp-git");
var path = require('path');
var flatten = require('gulp-flatten');
var glob = require("glob");


var workspace = path.join(__dirname,'./workspace');
var repoGroup= 'git@git.patsnap.com:swagger-doc';
var gitHttpConf = require('./src/ps_main/gitHttpConf.js');
var clean = require('gulp-clean');

var gitUtils = require('./src/ps_main/gitUtils.js');


function exec(str){
	var cmd = require('child_process').exec;
	return new Promise(function(res,rej){
		cmd(str, function (err, stdout, stderr) {
			if(err || stderr){
				rej(err || stderr)
			}
			if(stdout){
				res(stdout)
			}
		});
	});
}


var cwdOpt = {cwd:workspace};


var swDocPath = path.join(workspace,'swagger-doc');
var swDocPathTemp = path.join(workspace,'swagger-doc-temp');
var swServPath = path.join(workspace,'swagger-serv');

function getRepos(){
	return gitUtils.fetchProject()
}




function clone(url){
	return new Promise(function(res,rej){
		git.clone(url,{cwd:swDocPathTemp}, function (err) {
			if (err){rej(err)}else{res()}
		});
	});
}
gulp.task('cleanWorkspace',function(){
	if (!fs.existsSync(swDocPath)){
		fs.mkdirSync(swDocPath);
	}
	if (!fs.existsSync(swServPath)){
		fs.mkdirSync(swServPath);
	}
	if (!fs.existsSync(swDocPathTemp)){
		fs.mkdirSync(swDocPathTemp);
	}
	return gulp.src([
			path.join(swDocPath,'*'),
			path.join(swServPath,'*'),
			path.join(swDocPathTemp,'*')
	], {read: false})
			.pipe(clean());
});


function promisfyStream(stream){
	return new Promise(function(res,rej){
		stream.on('end',res);
		stream.on('error',rej);
	})
}

function copyFromServTemp(folderName){
	var stream = gulp.src(['./swagger-serv-template/**/*'])
			.pipe(gulp.dest(path.join(swServPath,folderName)));

	return promisfyStream(stream);
}

function replaceFile(fileFullPath){

	function addFakeRoute(oriJson){
		const _ = require('lodash');
		const fakeKey = 'x-swagger-router-controller';
		var jsonPaths = Object.keys(oriJson.paths);
		jsonPaths.forEach(function(pthName){
			var pth = oriJson.paths[pthName];
			Object.keys(pth).forEach(function(method){
				if(!pth[method][fakeKey]){
					pth[method][fakeKey] = _.uniqueId('fakeCtrlByGulp')
				}
			})
		});
		return oriJson;
	}

	return new Promise(function(res,rej){

		var fileName = path.basename(fileFullPath,'.json');

		var json = require(path.join(swDocPath,`${fileName}.json`));
		json = addFakeRoute(json);
		var json2yaml = require('json2yaml');
		var yamlText = json2yaml.stringify(json);


		fs.writeFile(path.join(swServPath,fileName,'api','swagger',`swagger.yaml`),yamlText,function(err){
			if(err){
				rej(err);
			}else{
				res(yamlText)
			}
		});
	});

}


gulp.task('nodeService',['cleanWorkspace'], function() {


	function *pullRunner(projectLists){//doc
		var pullList = projectLists.map(projectObj=>clone(projectObj.ssh_url_to_repo));
		yield Promise.all(pullList);
	}


	function *projectCreateRunner(fileList){//serv
		var createJobs = fileList.map(function(fileFullPath){
			var name = path.basename(fileFullPath,'.json');
			return copyFromServTemp(name)
				.then(function(){
					return replaceFile(fileFullPath)
				});
		});
		yield Promise.all(createJobs);
	}

	function projectUpRunner(fileList){//servUpper
		var upJobs = fileList.map(function(fileFullPath){
			var name = path.basename(fileFullPath,'.json');
			return exec(`cd ${path.join(swServPath,name)};npm run mock;`)
		});
		return Promise.all(upJobs);
	}

	function *copyDocOut(){
		var targetPath = path.join(swDocPathTemp,'**/*.json');
		var stream = gulp.src([targetPath])
				.pipe(flatten())
				.pipe(gulp.dest(path.join(swDocPath)));
		yield promisfyStream(stream);
		return new Promise(function(res,rej){
			glob(targetPath, function (err, files) {
				if(err){rej(err)}
				if(files){res(files)}
			})
		})
	}

	function removeDocTemp(){
		var stream = gulp.src([path.join(swDocPathTemp,'/')], {read: false})
				.pipe(clean());
		return promisfyStream(stream);
	}

	function *runner(){
		var projectLists = yield getRepos();
		yield pullRunner(projectLists);
		var fileList = yield copyDocOut();
		console.log(fileList);

		removeDocTemp();




		yield projectCreateRunner(fileList);

		projectUpRunner(fileList);

	}

	return co(runner())
		.catch((err)=>console.log(err))
});

//replaceFile('test');
gulp.start('nodeService');