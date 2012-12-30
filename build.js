var js = require('jsconcat');	

js.compile({
	build_dir: "./builds",
	src_dir:"./src",
	name:"core.js",
	uglify: false,
	src:['core.js']
});

js.compile({
	build_dir: "./builds",
	src_dir:"./jaz",
	name:"core.spec",
	uglify: false,
	src:['sandbox.jaz','module.jaz']
});