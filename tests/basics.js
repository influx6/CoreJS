var toolstack = require('../exts/toolstack').ToolStack,
	http = require('http'),
	path = require('path'),
	domain = require('domain'),
	url = require('url'),
	core = null, modules = null;

	core = require('../src/core').Core(toolstack);
	
	require('../modules/server/module.server.js')(core,toolstack.Utility,domain);

 	modules = core.Modules;

modules.ServerModule.make(__dirname+'/server_one.js',null,null,http).connect(8000);

modules.ServerModule.make(function(http){
	return http.createServer();
},null,null,http).router(function(server){
	server.on('request',function(req,res){
		var path = url.parse(req.url);
		if(path.pathname === '/slushers'){
			console.log("Making request to slushers");
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write("Slushers.com");
		}
		res.end();
	});
}).connect(8001,'127.0.0.1',function(){ console.log('got connected')});

modules.ServerModule.make(':default',null,null).router(function(server){
	server.on('request',function(req,res){
		var path = url.parse(req.url);
		if(path.pathname === '/bugger'){
			console.log("Making request to bugger");
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write("bugger.com");
		}
		res.end();
	});
}).connect(8002,'127.0.0.1',function(){ console.log('bugger connected')});