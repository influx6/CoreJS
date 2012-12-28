var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('CoreMessage',function(global){

	
		var Message = {},ts = global.ToolStack,utility;
		utility = ts.ToolChain;


		var ns = ts.ns('Core.Message',Message,global);
		if(typeof module !== 'undefined' && typeof require !== 'undefined'){
			module.exports = ns;
		};
});