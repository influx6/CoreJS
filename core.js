var module=module||{exports:{}};module.exports.Core=function(a){var b={},c=/^app:/,d=a,e=a.Helpers.HashMaps,f=d.Utility,g=d.Errors;return module.exports.Core=b,b.gpid=f.guid(),b.moduleDir="./modules/",b.appDir="./apps/",b.Errors={AppError:g.createError("AppError"),AppRegisterError:g.createError("AppRegisterError"),ChannelNotifyError:g.createError("ChannelNotifyError")},b.Sandbox=function(c,d,g){var h=function(){this.apps={},this.loaded={},this.gpid=b.gpid,this.pid=f.guid(),this.up=!1,this.permissions=g||{},b.Facade(this)};return h.fn=h.prototype,h.fn.channels=a.MessageAPI(!1,100),h.fn.events=a.Events(),h.fn.moduleDir=c||b.moduledir,h.fn.appDir=d||b.appDir,h.fn.addPermissions=function(a,b){if(b&&!f.isObject(b))throw Error(f.makeString(" ","Permission must be an object of action:state rules eg (app,admin,{ request: true })"));e.add.call(this.permissions,a,b)},h.fn.mergePermissions=function(a,b){var c=e.fetch.call(this.permissions,a);f.merge(c,b);return},h.fn.getPermissions=function(a,b){var c=e.fetch.call(this.permissions,a);return b?c[b]:c},h.fn.revokePermissions=function(a,b){var c=e.fetch.call(this.permissions,a);if(c&&c[b])return delete c[b];return},h.fn.registerApp=function(a,c,d){if(!f.isFunction(a))throw Error("Your App must be a function to be called!");if(!f.isString(c.name)||this.apps[c.name])return!1;var e=this,g=c.name,h;this.apps[g]=c,this.addPermissions(g,null,null);try{var i=this.apps[g];i.name=c.name,i.channel=g,i.id=f.guid(),this.channels.addChannel(g),i.app=a(i.channel,this.facade);var j=this.channels.getChannel(g);if(!j.exists("bootup")||!j.exists("reboot")||!j.exists("shutdown"))throw new b.Errors.AppError("App lacks valid channels: { bootup, reboot, shutdown}!",this);c.main&&(i.root=b.appDir.concat(c.main)),d&&this.mergePermissions(g,d),i.registered=!0,i.statebox={name:i.name,key:i.channel,running:!1,permissions:function(){return e.getPermissions(i.name)},bootargs:c.bootargs?f.isArray(c.bootargs)?c.bootargs:[c.bootargs]:[]},this.events.set(g.concat(":bootup")),this.events.set(g.concat(":shutdown")),c.beforeBoot&&f.isFunction(c.beforeBoot)&&c.beforeBoot({key:i.key,name:i.name,root:i.root,notify:function(a,b){var c=f.arranize(arguments);return e.facade.notify.apply(e,[i.name].concat(c))}})}catch(k){throw delete this.apps[g],new b.Errors.AppRegisterError("App does not confirm to core specification, please review \n	"+k.message)}return!0},h.fn.unregisterApp=function(a){if(!f.isString(a)||!this.apps[a])return!1;var b,c=this;this.loaded[a]&&delete this.loaded[a],this.deBoot(a,function(){delete c.apps[a],delete c.loaded[a],c.channels.removeChannel(a)})},h.fn.boot=function(){f.eachAsync(this.apps,function(a,b,c,d){if(!a)return;try{this.bootApp(b)}catch(a){d(a)}d(!1)},function(a){if(a)throw a;this.up=!0,this.channels.resume()},this)},h.fn.deBoot=function(){f.eachAsync(this.apps,function(a,b,c,d){if(!a)return;try{this.deBootApp(b)}catch(a){d(a)}d(!1)},function(a){if(a)throw a;this.up=!1,this.channels.pause(),this.channels.flush()},this)},h.fn.bootApp=function(a,b){var c=e.fetch.call(this.apps,a),d=e.fetch.call(this.loaded,a);return c?(d||(e.add.call(this.loaded,a,c.statebox),d=e.fetch.call(this.loaded,a)),d||d.running?!1:(d.running=!0,this.channels.notify.apply(this.channels,[a,"bootup"].concat(d.bootargs)),this.events.emit(a.concat(":bootup")),b&&f.isFunction(b)&&b.call(null),!0)):!1},h.fn.deBootApp=function(a,b){if(!e.exists.call(this.apps,a)||!e.exists.call(this.loaded,a))return!1;var c=e.fetch.call(this.loaded,a);return c.running?(c.running=!1,this.channels.notify(a,"shutdown"),this.emit(a.concat(":shutdown")),b&&f.isFunction(b)&&b.call(null),!0):!1},new h},b.createAppShell=function(a,b){var c={key:a,facade:b,channel:b.getChannel(a)};return c},b.Facade=function(a){if(!a||!a.gpid||a.gpid!==b.gpid||a.facade&&a.facade.isCreated)return!1;var c={};return f.createProperty(c,"isCreated",{get:function(){return!0},set:function(a){}}),c.on=f.proxy(a.channels.on,a.channels),c.off=f.proxy(a.channels.off,a.channels),c.registerApp=f.proxy(a.registerApp,a),c.modules=function(){return b.Modules},c.getChannel=f.proxy(a.channels.getChannel,a.channels),c.notify=function(b,c,d){var g=b,h=c,i=f.makeSplice(arguments,3,arguments.length);if(!e.exists.call(a.apps,c))return!1;if(!e.exists.call(a.apps,b))return!1;var j=e.fetch.call(a.permissions,b);if(!j)return!1;if(!j[c]||!j[c][d])return!1;a.channels.notify.apply(a.channels,[c,d].concat(i)),a.up&&a.channels.resume();return},a.facade=c,!0},b.Modules={},b},module.exports.FileWatcher=function(a){var b=require("ts").ToolStack,c=b.Utility,d=require("path"),e=require("fs"),f=b.Helpers.HashMaps,g=function(b,c){return Math.round(b*c/8e6)};a.Modules.FileWatcher=function(){return function(h,i){var j=a.createAppShell(h,i);return j.watchables={},j.ms=500,j.clock=null,j.watching=!1,j.rebooting=!1,j.up=!1,j.cycle=function(b){if(!this.watching&&!this.up||this.rebooting)return;b&&(this.ms=b);var d=this;return this.clock=c.delay(function(){c.eachAsync(d.watchables,function(a,b,c,d){var f=e.statSync(a.root),h=g(f.size,f.mtime);a.key!==h&&(a.fn(),a.key=h),d(!1)},function(a){if(a)return!1;d.cycle(d.ms)})},this.ms),!0},j.watch=function(b,c,h){if(!e.existsSync(c))return;var i=this,j=e.statSync(c),k=g(j.size,j.mtime);f.add.call(this.watchables,b,{key:k,root:d.normalize(c),fn:h})},j.bootup=function(){if(this.rebooting)return;return this.watching=!0,this.cycle(this.ms),this.up=!1,!0},j.reboot=function(){var b=this;this.up=this.watching=!1,this.rebooting=!0,console.log(this.clock,"rebooting",this.up,this.watching,this.rebooting),clearTimeout(this.clock),clock=c.delay(function(){b.bootup(),b.rebooting=!1},250)},j.shutdown=function(){this.isWatching=!1,this.isShutdown=!0,clearTimeout(this.clock)},j.channel.add("watch",function(a,b,c){j.watch(a,b,c)}),j.channel.add("bootup",function(){j.bootup.apply(j,arguments)}),j.channel.add("reboot",function(){j.reboot.apply(j,arguments)}),j.channel.add("shutdown",function(){j.shutdown.apply(j,arguments)}),j}}},module.exports.HttpServer=function(a){var b=require("ts").ToolStack,c=b.Utility,d=require("http");a.Modules.HttpServer=function(e){return function(f,g){var h=a.createAppShell(f,g);return h.server=d.createServer(),h.up=!1,h.router=function(a){return this.routes=a,a.call(null,this.server),this},h.bootup=function(a,b){if(!a)throw Error("Please supply a port for connection");b||(b="127.0.0.1");var c=this;return this.server.listen(a,b,function(){c.up=!0}),this.router(this.routes),this},h.reboot=function(a){this.up||this.bootup();var b=c.proxy(function(){this.bootup()},this);return this.shutdown(b)},h.shutdown=function(a){if(!this.up)return;return this.server.on("close",a),this.server.removeAllListeners("request"),this.server.close(),this.up=!1,!0},h.channel.add("bootup",function(){h.bootup.apply(h,arguments)}),h.channel.add("reboot",function(){h.reboot.apply(h,arguments)}),h.channel.add("shutdown",function(){h.shutdown.apply(h,arguments)}),h.router(e),h}}}