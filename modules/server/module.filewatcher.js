module.exports = (function(core,utility){

    var utility = utility, core = core;

    core.Modules.FileWatcherModule = core.Module.extend("FileWatcherModule",{
            
      init: function(modules,channel){
        this.Super(":default",modules,channel);
        this.watches = {};
      },

      default: function(){},

      watch: function(path){
      },

      cycle: function(ms){},
            
    });

});

