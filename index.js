console.log("Loading shadow devtools for node client");
require("./lib/shadow.cljs.devtools.client.node");

console.log("Loading extension entry point");

module.exports = require("./lib/calva_cljs.extension");
