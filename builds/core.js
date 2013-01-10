var module = module || { exports: {} };

module.exports.Core = (function(toolstack){
		
		var Core = {},
		//path = mod.path,
		ts = toolstack,
		utility = ts.Utility;

		module.exports.Core = Core;

		Core.gpid = utility.guid();
		Core.moduleDir = "./modules/";
		Core.appDir = "./apps/";

		Core.Sandbox = function(moduledir,appdir){
			var box = function(){
				this.apps = {};
				this.loaded = {};
				this.gpid = Core.gpid;
				this.pid = utility.guid();

				Core.Facade(this);
			};

			box.fn = box.prototype;
			box.fn.channels = toolstack.Events();
			box.fn.moduleDir = moduledir || Core.moduledir;
			box.fn.appDir = appdir || Core.appDir;


			box.fn.registerApp = function(app,config,permissions){
				if(!utility.isString(config.name) || this.apps[config.name]) return false;
				this.apps[config.name] = { 
					root: Core.appDir.concat(config.name),
					config: config,
					permissions: permissions || {},
					app: app,
					registered: true
				};
				// app.channel =
				this.channels.set('app:'.concat(config.channel));
			};

			box.fn.unregisterApp = function(name){
				if(!utility.isString(name) || !this.apps[name]) return false;
				var app,self = this;
				delete this.apps[name];
				var app = this.loaded[name];
				if(app) app.stop();
				delete app;
			};

			box.fn.start = function(){

			};

			box.fn.stop = function(){

			};

			return new box;
		};

		//provides a nice facaded for access by modules and apps
		Core.Facade = function(core){
			if(!core || !core.gpid || (core.gpid !== Core.gpid) || (core.facade && core.facade.isCreated)) return false;
			var facade = {};
			utility.createProperty(facade,'isCreated',{
				get: function(){ return true },
				set: function(val){ }
			});

			facade.on = utility.proxy(core.channels.on,core.channels);
			facade.off = utility.proxy(core.channels.off,core.channels);
			facade.modules = function(){ return Core.Modules; };

			core.facade = facade;
			return true;

		};
		
		Core.Modules = {};
		Core.Module = ts.Class.create('Module',{
				init: function(wo,id,modules){
					this.id = id || "PROCESS_ID";
					this.modules = modules;
					this.events = ts.Events();
					// this.channel = channel;

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

				channel: function(channel){
					this.channel = channel;
					return this;
				},

				domain: function(){
					//returns a Domain or object that handles errors based on the context,
				},

				default: function(wo){},

				send: function(message){},

				start: function(){ },

				stop: function(){ },

				attach:function(plugin){}
		});

		return Core;
});

