var global = require('../exts/toolstack'),
	http = require('http'),
	url = require('url'),
	modules,Core;

	global.ExtInit(global);
	require('../src/core').Core(global);
	require('../modules/server.js').ServerModule(global.Core,global.ToolStack);

	Core = global.Core;
	modules = Core.Modules;


modules.ServerModule.make(__dirname+'/server_one.js',null,null,http).connect(8000);

modules.ServerModule.make(function(http){
	return http.createServer();
},null,null,http).use(function(server){
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

modules.ServerModule.make(':default',null,null).use(function(server){
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