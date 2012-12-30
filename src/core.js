module.exports = (function(toolstack,path){

		var Core = {},
		path = path,
		ts = toolstack,utility = ts.ToolChain;

		Core.moduleDir = "./modules";
		Core.appDir = "./apps";

		Core.Sandbox = function(moduledir,appdir){
			var box = function(){
				this.apps = {};
				this.loaded = {};
			};
			box.fn = box.prototype;

			box.fn.channels = toolstack.Events();
			box.fn.moduleDir = moduledir || Core.moduledir;
			box.fn.appDir = appdir || Core.appDir;


			box.fn.registerApp = function(name,config,permissions){
				if(!utility.isString(name) || this.apps[name]) return false;
				this.apps[name] = { 
					root: path.resolve(this.appDir,name),
					config: config,
					permissions: permissions,
					registered: true
				};
				this.process(this.apps[name]);
			};

			box.fn.unregisterApp = function(name){
				if(!utility.isString(name) || !this.apps[name]) return false;
				var app,self = this;
				delete this.apps[name];
				var app = this.loaded[name];
				if(app) app.stop();
				delete app;
			};

			box.fn.process = function(app){
				//setup message channel of app
				this.channels.set('app:'.concat(app.channel));
				var main = app.root.concat('/').concat(app.config.main);
				this.loaded[app.name] = require(main).apply(null,app.config.modules);
				console.log(this.loaded[app.name]);
			};

			box.fn.start = function(){

			};

			box.fn.stop = function(){

			};

			return new box;
		};

		Core.Modules = {};
		Core.Module = ts.Class.create('Module',{
				init: function(wo,id,channel,modules){
					this.id = id || "PROCESS_ID";
					this.modules = modules;
					this.events = ts.Events();
					this.channel = channel;

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
				},

				default: function(wo){},

				send: function(message){},

				connect: function(){ },

				disconnect: function(){ },

				attach:function(plugin){}
		});

		return Core;
});
