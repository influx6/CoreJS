var _g = require('global'), mod;
_g.toolstack.load(['class','toolchain','callbacks','events']);

mod = _g.root('module')(_g.toolstack,_g.http);


mod.ServerModule.make('./tests/server_one.js',null,null,_g.http).connect(8000);

mod.ServerModule.make(function(http){
	return http.createServer();
},null,null,_g.http).use(function(server){
	server.on('request',function(req,res){
		var path = _g.url.parse(req.url);
		if(path.pathname === '/slushers'){
			console.log("Making request to slushers");
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write("Slushers.com");
		}
		res.end();
	});
}).connect(8001,'127.0.0.1',function(){ console.log('got connected')});

mod.ServerModule.make(':default',null,null).use(function(server){
	server.on('request',function(req,res){
		var path = _g.url.parse(req.url);
		if(path.pathname === '/bugger'){
			console.log("Making request to bugger");
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write("bugger.com");
		}
		res.end();
	});
}).connect(8002,'127.0.0.1',function(){ console.log('bugger connected')});