var module = module || { exports: {} };

module.exports.Core = (function(toolstack){
		
    var Core = {},appr = /^app:/,
    //path = mod.path,
    ts = toolstack,
    helpers = toolstack.Helpers.HashMaps,
    util = ts.Utility,
    eutil = ts.Errors;

    module.exports.Core = Core;

    Core.gpid = util.guid();
    Core.moduleDir = "./modules/";
    Core.appDir = "./apps/";
    Core.Errors = {
      AppError: eutil.createError('AppError'),
      AppRegisterError: eutil.createError('AppRegisterError'),
      ChannelNotifyError: eutil.createError('ChannelNotifyError'),
    };


    Core.Sandbox = function(moduledir,appdir){
            var box = function(){
              this.apps = {};
              this.loaded = {};
              this.gpid = Core.gpid;
              this.pid = util.guid();
              this.up = false;

              Core.Facade(this);
            };

            box.fn = box.prototype;

            box.fn.channels = toolstack.MessageAPI();
            box.fn.events = toolstack.Events();
          
            box.fn.moduleDir = moduledir || Core.moduledir;
            box.fn.appDir = appdir || Core.appDir;

            box.fn.registerApp = function(app,config,permissions){
              if(!util.isFunction(app)) throw new Error("Your App must be a function to be called!");
              if(!util.isString(config.name) || this.apps[config.name]) return false;
              
              var name,appd;
              if(appr.test(config.name)) name = config.name;
              else name = 'app:'.concat(config.name);

              this.apps[name] = config;
              
              //initialize the app with arguments supplied and check for proper methods
              try{

                // appd = app.apply(null,config.args || []);

                var key = this.apps[name];
                key.name = config.name;
                key.channel = name;
                key.id = util.guid();

                this.channels.addChannel(name);
                key.app = app(key.channel,this.facade);
                
                //test the app if 
                var test = this.channels.getChannel(name);
                if(!test.exists('bootup') || !test.exists('reboot') || !test.exists('shutdown')) throw new Core.Errors.AppError("App lacks valid channels: { bootup, reboot, shutdown}!",this);

                //setup permissions,directory and set app as registed
                if(config.main) key.root = Core.appDir.concat(config.main);
                key.permissions = permissions || {};
                key.registered = true;

                var btags = (config.bootargs ? (util.isArray(config.bootargs) ? config.bootargs : [config.bootargs]) : []);
                key.statebox = {
                  key: key.channel, state: false, permissions: key.permissions, bootargs: btags
                };

                this.events.set(name.concat(':bootup'));
                this.events.set(name.concat(':shutdown'));
                // this.channels.getChannel(key.channel).add('bootup',function(){
                //     key.app.bootup.apply(key.app,arguments);
                // });
                // this.channels.getChannel(key.channel).add('reboot',function(){
                //     key.app.reboot.apply(key.app,arguments);
                // });
                // this.channels.getChannel(key.channel).add('shutdown',function(){
                //     key.app.shutdown.apply(key.app,arguments);
                // });

                if(config.setup && util.isFunction(config.setup))  config.setup({ key: key.key,name: key.name,root: key.root });

              }catch(e){
                //remove the app from the cache
                delete this.apps[name];
                //throw error to ensure they know whats wrong
                throw e;
                // throw new Core.Errors.AppRegisterError("App does not confirm to core specification, please review \n\t" + e.message,e);
                return false;
              };
              
              
              return true;
          };

          box.fn.unregisterApp = function(name){
            if(!util.isString(name) || !this.apps[name]) return false;
            var app,self = this;

            if(!appr.test(name)) name = 'app:'.concat(name);
            if(this.loaded[name]) delete this.loaded[name];

            this.deBoot(name,function(){
              delete self.apps[name];
              delete self.loaded[name];
            });

          };


          box.fn.boot = function(){
            util.eachAsync(this.apps,function(e,i,o,fn){
                if(!e) return;
                try{ this.bootApp(i); }catch(e){ fn(e); }
                fn(false)
            },function(err){
              if(err) throw e;
              this.up = true;
            },this);
          };

          box.fn.deBoot = function(){
            util.eachAsync(this.apps,function(e,i,o,fn){
                if(!e) return;
                try{ this.deBootApp(i); }catch(e){ fn(e); }
                fn(false)
            },function(err){
              if(err) throw e;
              this.up = false;
            },this);
          };

          box.fn.bootApp = function(channel,after){
            if(!appr.test(channel)) channel = 'app:'.concat(channel);

            var app = helpers.fetch.call(this.apps,channel),
            loadd = helpers.fetch.call(this.loaded,channel);
            //check exisitng and state of app

            if(!app) return false;
            if(loadd || loadd.state) return false;

            if(!loadd) helpers.add.call(this.loaded,channel,app.statebox);

            loadd = helpers.fetch.call(this.loaded,channel);

            loadd.state = true;

            this.channels.notify.apply(this.channels,[channel,'bootup'].concat(loadd.bootargs));
            this.events.emit(channel.concat(':bootup'));

            if(after && util.isFunction(after)) after.call(null);

            return true;
          };

          box.fn.deBootApp= function(channel,after){
            if(!appr.test(name)) channel = 'app:'.concat(channel);

            //check exisitng and state of app
            if(!helpers.exists.call(this.apps,channel) || !helpers.exists.call(this.loaded,channel)) return false;

            var app = helpers.fetch.call(this.loaded,channel);
            if(!app.state) return false;

            app.state = false;
            this.channels.notify(channel,'shutdown');
            this.emit(channel.concat(':shutdown'));

            if(after && util.isFunction(after)) after.call(null);

            return true;
          };

          return new box;
      };
      
      Core.createAppShell = function(channel,facade){
        var app  = { 
          key: channel, 
          facade: facade,
          channel: facade.getChannel(channel),
        };

        return app;
      };

      //provides a nice facaded for access by modules and apps
      Core.Facade = function(core){
        if(!core || !core.gpid || (core.gpid !== Core.gpid) || (core.facade && core.facade.isCreated)) return false;

        var facade = {};
        util.createProperty(facade,'isCreated',{
                get: function(){ return true },
                set: function(val){ }
        });

        facade.on = util.proxy(core.channels.on,core.channels);
        facade.off = util.proxy(core.channels.off,core.channels);
        facade.registerApp = util.proxy(core.registerApp,core);
        facade.modules = function(){ return Core.Modules; };
        facade.getChannel = util.proxy(core.channels.getChannel,core.channels);

        facade.notify = function(caller,channel,command){
            //verify if it begins with 'app:'
            var orgcaller = caller, orgchannel = channel,
            args = util.makeSplice(arguments,3,arguments.length);

            if(!appr.test(caller)) caller = 'app:'.concat(caller);
            if(!appr.test(channel)) channel = 'app:'.concat(channel);

            //verify if channel does exists;
            if(!helpers.exists.call(core.apps,channel)) return false;
            if(!helpers.exists.call(core.apps,caller)) return false;
            
            var initor = helpers.fetch.call((core.up ? core.loaded : core.apps),caller);

            if(!initor) return false;

            if(!(initor.permissions['*'] && initor.permissions['*'][command]) &&
            !(initor.permissions[channel] && initor.permissions[channel][command])) return false;

            return core.channels.notify.apply(core.channels,[channel,command].concat(args));
        };

        core.facade = facade;
        return true;

      };
      
     Core.Modules = {};

     return Core;
});

