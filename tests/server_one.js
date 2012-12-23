module.exports = (function(http){

	return http.createServer(function(req,res){
		res.writeHead(200,{'Content-Type':'text/plain'});
		res.end("Welcome to Server One");
	});

});