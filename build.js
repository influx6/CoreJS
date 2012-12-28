var js = require('jsconcat');	

js.compile({
	build_dir: "./builds",
	src_dir:"./src",
	name:"core.js",
	uglify: true,
	src:['core.js']
});