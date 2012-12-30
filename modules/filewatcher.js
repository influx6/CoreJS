module.exports = (function(core,utility){

	var utility = utility, core = core;

	core.Modules.FileWatcherModule = core.Module.extend("FileWatcherModule",{
		
		init: function(channel,id,modules){
			this.Super(":default",channel,id,modules);
			this.watches = {};
		},

		default: function(){},

		watch: function(path){
			console.log(path);
		}
	});


});


