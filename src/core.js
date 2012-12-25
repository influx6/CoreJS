var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('Core',function(global){


		var Core = {},ts = global.ToolStack,utility;
		global.ExtInit(ts);
		utility = ts.ToolChain;

		utility.extends(Core,ts.Events);

		console.log(Core);


		var ns = ts.ns('Core.Core',Core,global);
		if(typeof module !== 'undefined' && typeof require !== 'undefined'){
			module.exports = ns;
		} 
});
