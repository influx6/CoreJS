var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('ServerModule',function(core,toolstack){

	var utility = toolstack.ToolChain;

	core.Modules.ServerModule = core.Module.extend('ServerModule',{

		init: function(wo,channel,id,modules){
			this.Super(wo,channel,id,modules);
			if(utility.isFunction(this.wo)){
				utility.isArray(this.modules) ? this.wo = this.wo.apply(null,this.modules) : this.wo = this.wo.call(null,this.modules);
				return;
			}
		},

		use: function(fn){
			fn.call(this,this.wo);
			return this;
		},

		default: function(wo){
			this.wo = require('http').createServer();
		},

		connect: function(port,ip,callback){
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

		disconnect: function(callback){
			this.events.emit('disconnecting');
			this.wo.close();
			this.events.emit('disconnected');
		}
	});


});


