module.exports = (function(core,utility,debug,domain){

  var Server = core.Module.extend('ServerModule',{

          init: function(wo,modules,channel){
            this.Super(wo,modules,channel);
            if(utility.isFunction(this.wo)){
                    utility.isArray(this.modules) ? this.wo = this.wo.apply(null,this.modules) : this.wo = this.wo.call(null,this.modules);
                    this.domain.add(this.wo);
                    return;
            }
          },

          domain: function(){ return this._domain; },

          router: function(fn){
                  var self = this;
                  fn.call(self,self.wo);
                  return this;
          },

          default: function(wo){
                  this.wo = require('http').createServer();
                  this.domain().add(this.wo);
          },

          start: function(port,ip,callback){
                  if(!port) throw new Error("Please supply a port for connection");
                  if(!ip) ip = "127.0.0.1";

                  this.events.emit('connecting',ip,port);
                  this.wo.listen(port,ip,utility.proxy(function(){
                          var args = utility.flatten(arguments,[ip,port]);
                          this.events.emit("connected",args);
                          if(callback) callback.apply(this,args);
                  },this));

                  return this;
          },

          stop: function(callback){
                  this.events.emit('disconnecting');
                  this.wo.close();
                  this.domain().dispose();
                  this.events.emit('disconnected');
          }
  });

  core.Modules.ServerModule = Server;

});
