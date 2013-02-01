var module = module || { exports: {} };

module.exports.Core = (function(toolstack){
		
    var Core = {},appr = /^app:/,
    //path = mod.path,
    ts = toolstack,
    helpers = toolstack.Helpers.HashMaps,
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
            box.fn.events = toolstack.Events();
          
            box.fn.moduleDir = moduledir || Core.moduledir;
            box.fn.appDir = appdir || Core.appDir;

            box.fn.registerApp = function(app,config,permissions){
              if(!util.isFunction(app)) throw new Error("Your App must be a function to be called!");
              if(!utility.isString(config.name) || this.apps[config.name]) return false;
              
              var name,appd;
              if(appr.test(config.name)) name = config.name;
              else name = 'app:'.concat(config.name);

              this.apps[name] = config;
              
              //initialize the app with arguments supplied and check for proper methods
              try{

                // appd = app.apply(null,config.args || []);

                var key = apps[name];
                key.name = config.name;
                key.channel = name;
                key.id = util.guid();

                this.channels.addChannel(name);
                key.app = app(key.channel,this.facade);
                
                //test the app if 
                var test = this.channels.getChannel(name);
                if(!test.exists('bootup') || !test.exists('reboot') || !test.exists('shutdown')) throw new Error("Invalid App!");

                //setup permissions,directory and set app as registed
                key.root = Core.appDir.concat(config.name);
                key.permissions = permissions || {};
                key.registered = true; 

                // this.channels.getChannel(key.channel).add('bootup',function(){
                //     key.app.bootup.apply(key.app,arguments);
                // });
                // this.channels.getChannel(key.channel).add('reboot',function(){
                //     key.app.reboot.apply(key.app,arguments);
                // });
                // this.channels.getChannel(key.channel).add('shutdown',function(){
                //     key.app.shutdown.apply(key.app,arguments);
                // });

                if(config.setup && util.isFunction(config.setup))  config.setup(key.app,box.facade);

              }catch(e){
                 e.message = "App does not confirm to core specification, please review \n" + e.message;
                 throw e;
                 return false;
              };
              
              
              return true;
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
      
      Core.createAppShell = function(channel,facade){
        var app  = { 
          key: channel, 
          facade: facade,
          channel: facade.getChannels(channel),
        };

        return app;
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
        facade.getChannel = utility.proxy(core.channels.getChannel,core.channels);

        facade.notify = function(caller,channel,command,data){
            //verify if it begins with 'app:'
            var orgcaller = caller, orgchannel = channel;

            if(!appr.test(caller)) caller = 'app:'.concat(caller);
            if(!appr.test(channel)) channel = 'app:'.concat(channel);

            // //verify if channel does exists;
            // if(!helpers.hashmaps.exists.call(core.apps,channel)) return false;
            // if(!helpers.hashmaps.exists.call(core.apps,caller)) return false;
            // 
            // var initor = helpers.hashmaps.find.call(core.apps,caller);

            // if(!(initor.permissions['*all'] && initor.permissions['*all'][command]) &&
            // !(initor.permissions[orgchannel] && initor.permissions[orgchannel][command])) return false;

            // var dest = helpers.hashmaps.find.call(core.apps,channel);
            // dest.command(command,data);

        };

        core.facade = facade;
        return true;

      };
      
     Core.Modules = {};

     return Core;
});

