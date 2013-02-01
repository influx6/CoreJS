module.exports = (function(core,ts){
  
  var utility = ts.Utility, http = require('http');
  
  core.Modules.HttpServer = function HttpServerSetup(routes){


     return function HttpServer(channel,facade){
        
        var app = core.createAppShell(channel,facade);
        app.server = http.createServer();

        app.router = function(fn){
            var self = this;
            fn.call(null,self.server);
            return this;
        };

        app.bootup = function(port,ip){
            if(!port) throw new Error("Please supply a port for connection");
            if(!ip) ip = "127.0.0.1";

            this.server.listen(port,ip);
            return this;
        };

        app.reboot = function(callback){
            this.server.removeAllListeners();
            this.server.close();
        };

        app.shutdown = function(callback){
            this.server.close();
        };

        app.channel.add('bootup',function(){
            app.bootup.apply(app,arguments);
        });

        app.channel.add('reboot',function(){
            app.reboot.apply(app,arguments);
        });

        app.channel.add('shutdown',function(){
            app.shutdown.apply(app,arguments);
        });

        //initaite app with the routes;
        app.router(routes);

        return app;
    };
  };


});
