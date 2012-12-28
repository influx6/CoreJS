var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('Core',function(global){


		var Core = {},Module,ts = global.ToolStack,
		utility = ts.ToolChain;

		Core.Sandbox = function(){
			var box = function(){};
			box.fn = box.prototype;

			box.fn.moduleDir = "./modules";
			box.fn.register = function(name,module,permission){};
			box.fn.request = function(name,message){};
			box.fn.unregister = function(name);
			box.fn.require = function(name){

				
			}

			return new box;
		};

		Core.Modules = {};

		Core.Module = ts.Class.create('Module',{
				init: function(wo,id,modules){
					this.id = id || "PROCESS_ID";
					this.modules = modules;
					this.events = ts.Events();
					this.channel = Core.Sandbox;

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


		global.Core = Core;

});
