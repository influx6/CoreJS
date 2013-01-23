var module = module || { exports: {} };

module.exports.Core = (function(toolstack){
		
    var Core = {},appr = /^app:/,
    //path = mod.path,
    ts = toolstack,
    helpers = toolstack.Helpers,
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
            box.fn.channels = toolstack.MessageAPI();
            box.fn.events = ToolStack.Events();
            box.fn.moduleDir = moduledir || Core.moduledir;
            box.fn.appDir = appdir || Core.appDir;


            box.fn.registerApp = function(app,config,permissions){
                    if(!utility.isString(config.name) || this.apps[config.name]) return false;
                    
                    var name;
                    if(appr.test(config.name)) name = config.name;
                    else name = 'app:'.concat(config.name);

                    this.apps[name] = config;

                    var key = apps[name];
                    key.id = util.guid();
                    key.root = Core.appDir.concat(config.name);
                    key.permissions = permissions || {};
                    key.app = app;
                    key.channel = name;
                    key.registered = true; 

                    this.channels.addChannel(name);
          };

          box.fn.unregisterApp = function(name){
                  if(!utility.isString(name) || !this.apps[name]) return false;
                  var app,self = this;
                  delete this.apps[name];
                  var app = this.loaded[name];
                  if(app) app.stop();
                  delete app;
          };

          box.fn.startAll = function(){};
          box.fn.stopAll = function(){};

          box.fn.startApp = function(){

          };

          box.fn.stopApp = function(){

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
        facade.notify = function(caller,channel,command,data){
            //verify if it begins with 'app:'
            var orgcaller = caller, orgchannel = channel;

            if(!appr.test(caller)) caller = 'app:'.concat(caller);
            if(!appr.test(channel)) channel = 'app:'.concat(channel);

            //verify if channel does exists;
            if(!helpers.hashmaps.exists.call(core.apps,channel)) return false;
            if(!helpers.hashmaps.exists.call(core.apps,caller)) return false;
            
            var initor = helpers.hashmaps.find.call(core.apps,caller);

            if(!(initor.permissions['*all'] && initor.permissions['*all'][command]) &&
            !(initor.permissions[orgchannel] && initor.permissions[orgchannel][command])) return false;

            var dest = helpers.hashmaps.find.call(core.apps,channel);
            dest.command(command,data);

        };

        core.facade = facade;
        return true;

      };
      
      Core.Modules = {};
      Core.Module = ts.Class.create('Module',{
          init: function(wo,modules,channel){
                    this.modules = modules;
                    this.events = ts.Events();
                    this.messages = ts.MessageAPI();
                    this.channel = channel;
                    this.commands = {};

                    //setiing up all relevant events
                    this.events.set('bootup');
                    this.events.set('restart');
                    this.events.set('shutdown');

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

                expose: function(key,command){
                    if(this.exposables[key]) return false;
                    this.exposables[key] = command;
                },

                command: function(ḱey,data){
                   if(!this.commands[key]) return false;
                   return this.commands[key].apply(this,data);
                },

                default: function(wo){},

                send: function(message){},

                bootup: function(){ },
                
                reboot: function(){ },

                shutdown: function(){ },

                attach:function(plugin){}
            });

            return Core;
});

