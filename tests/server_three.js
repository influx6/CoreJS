module.exports = (function(http,URL){

	return http.createServer(function(req,res){
		var path = URL.parse(req.url);
		if(path.pathname === '/pants'){
			console.log("Making request to pants");
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write("pants.com");
		}
		res.end();
	});
	
});