var ts = require('ts').ToolStack,
util = ts.Utility,
core = require('./builds/core').Core(ts),
cjz = require('./jaz/sandbox.jaz')(ts,core);

util.eachSync(cjz,function(e,i,o,fn){
	if(e && util.isObject(e)) e.run();
	fn(false);
});