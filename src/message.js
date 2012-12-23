var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('Core',function(global,callback){

	global.ToolStack.load(['Class','ToolChain'],function(ts){

		var Core = {};

		var ns = ts.ns('Core.Core',Core,global);
		if(callback) callback(global);

		if(typeof module !== 'undefined' && typeof require !== 'undefined'){
			module.exports = ns;
		} 
	});
});