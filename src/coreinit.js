var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})('CoreInit',function(global){

	global.Core(global);
	global.CoreModule(global);
	global.CoreMessage(global);
	global.Core.Modules = {};

	delete global.CoreModule;
	delete global.CoreMessage;
	delete global.CoreInit;
});