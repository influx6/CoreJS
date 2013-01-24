module.exports = (function(core,ts){

    var utility = ts.Utility;
    
    core.Modules.FileWatcher = function FileWatcherSetup(){
      return function FileWatcher(channel,facade){};
    };

});

module.exports = (function(core,ts){
  
  var utility = ts.Utility, http = require('http');
  
  core.Modules.HttpServer = function HttpServerSetup(routes){

     return function HttpServer(channel,facade){
        
        var app = {
          server : http.createServer(),
          channel : channel
        };

        app.router = function(fn){
            var self = this;
            fn.call(self,self.server);
            return this;
        };

        app.start = function(port,ip){
            if(!port) throw new Error("Please supply a port for connection");
            if(!ip) ip = "127.0.0.1";

            this.server.listen(port,ip);
            return this;
        };

        app.stop = function(callback){
            this.server.close();
        };

        app.channel.add('bootup',function(){
            app.start.apply(app,arguments);
        });

        app.channel.add('reboot',function(){
            app.reboot.apply(app,arguments);
        });

        app.channel.add('shutdown',function(){
            app.shutdown.apply(app,arguments);
        });

        return app;
    };
  };


});
