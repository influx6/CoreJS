module.exports = (function(core,ts){

    var utility = ts.Utility, core = core;

    core.Modules.FileWatcherModule = core.Module.extend("FileWatcherModule",{
            
      init: function(modules,channel){
        this.Super(":default",modules,channel);
        this.watchables = {};
      },

      default: function(){},

      watch: function(title,path){
          
      },

      cycle: function(ms){
      
      },
            
    });

});

