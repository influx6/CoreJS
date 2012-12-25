var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('Core',function(global){


		var ts = global.ToolStack, Module;

		global.ExtInit(ts);
		
		Module = ts.Class.create('Module',{
				init: function(wo,channel,id,modules){
					this.id = id || "PROCESS_ID";
					this.modules = modules;
					this.execPath = _execPath; 
					this.events = ts.Events();

					//setiing up all relevant events
					this.events.set('connecting');
					this.events.set('connected');
					this.events.set('disconnecting');
					this.events.set('disconnected');

					//setup the events aliases
					this.on = utility.proxy(this.events.on,this.events);
					this.off = utility.proxy(this.events.off,this.events);

					//set of middleware to passon data too on requests;
		 			this.middleware = [];

					if(utility.isString(wo) && wo === ':default'){
						this.default(wo); return;
					}
					if(utility.isString(wo)){ this.wo = require(wo); return; }
					if(utility.isFunction(wo)){ this.wo = wo; return; }

					return;

				},

				default: function(wo){},

				send: function(message){},

				connect: function(){ },

				disconnect: function(){ },

				attach:function(plugin){}

		});


		var ns = ts.ns('Core.Module',Module,global);
		if(typeof module !== 'undefined' && typeof require !== 'undefined'){
			module.exports = ns;
		} 	

});

