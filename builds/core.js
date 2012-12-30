module.exports = (function(toolstack){

		var Core = {},Module,ts = toolstack,utility = ts.ToolChain;

		Core.Sandbox = function(moduledir,appdir){
			var box = function(){
				this.apps = {};
			};
			box.fn = box.prototype;

			box.fn.moduleDir = moduledir || "./modules";
			box.fn.appDir = appdir || "./apps";


			box.fn.registerApp = function(name,config,permissions){
				if(!utility.isString(name) || this.apps[name]) return false;
				this.apps[name] = { 
					root: utility.fixPath(this.appDir,name),
					config: config,
					permissions: permissions
				};
			};

			box.fn.unregisterApp = function(name){
				if(!utility.isString(name) || !this.apps[name]) return false;
				delete this.apps[name];
			};

			box.fn.start = function(){

			};

			box.fn.stop = function(){

			};

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
		 			// this.middleware = [];

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

		return Core;
});
