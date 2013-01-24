var js = require('jsconcat');	

js.compile({
	build_dir: "./builds",
	src_dir:"./modules/server",
	name:"servermodules.core.js",
	uglify: false,
	src:['module.filewatcher.js','module.server.js']
});

js.compile({
	build_dir: "./builds",
	src_dir:"./src",
	name:"core.js",
	uglify: false,
	src:['core.js']
});

