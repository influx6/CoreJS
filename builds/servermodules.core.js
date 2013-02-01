module.exports = (function(core,ts){

    var util = ts.Utility, 
        path = require('path'), fs = require('fs'),
        helper = ts.Helpers.HashMaps,
        pumelrized = function(size,time){
          return (size * time * 2);
        };
    
    core.Modules.FileWatcher = function FileWatcherSetup(){
      return function FileWatcher(channel,facade){
          var app = Core.createAppShell(channel,facade);
          app.watchables = {};
          app.ms = 500;
          app.isShutdown = false;
          app.isWatching = false;
          
          app.cycle = function Cycle(ms){
              if(!this.isWatching || this.isShutdown) return;

              if(ms) this.ms = ms;

              return util.delay(function(){
                
              },this.ms);
          };

          app.watch = function Watch(name,path){
            if(path.existsSync(path)) return;
            
            var self = this,
                stat = fs.statSync(path), 
                key = pulmerized(stat.size,stat.mtime);

            helper.add.call(this.watchables,name,{
                key: key, root: path.normalize(path),
                fn: function(){
                }
            });
          };

          app.bootup = function Bootup(){};
          app.reboot = function Reboot(){};
          app.shutdown = function Shutdown(){};
          
          app.channel.add('watch',function(name,path,fn){
              app.watch(name,path,function(){
                app.facade.notify(app.key,name,'reboot');
              });
          });
          
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

module.exports = (function(core,ts){
  
  var utility = ts.Utility, http = require('http');
  
  core.Modules.HttpServer = function HttpServerSetup(routes){

     return function HttpServer(channel,facade){
        
        var app = Core.createAppShell(channel,facade);
        app.server = http.createServer();

        app.router = function(fn){
            var self = this;
            fn.call(self,self.server);
            return this;
        };

        app.bootup = function(port,ip){
            if(!port) throw new Error("Please supply a port for connection");
            if(!ip) ip = "127.0.0.1";

            this.server.listen(port,ip);
            return this;
        };

        app.reboot = function(callback){
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

        return app;
    };
  };


});
