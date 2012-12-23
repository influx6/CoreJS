module.exports = (function(http,URL){

	return http.createServer(function(req,res){
		var path = URL.parse(req.url);
		if(path.pathname === '/boxers'){
			console.log("Making request to boxers");
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write("boxers.com");
		}
		res.end();
	});

});