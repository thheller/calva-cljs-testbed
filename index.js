console.log("Loading shadow devtools for node client");
require("shadow-cljs/shadow.cljs.devtools.client.node");
console.log("Loading extension entry point");
const extension = require("shadow-cljs/calva_cljs.extension");

exports.activate = extension.activate;
exports.deactivate = extension.deactivate;
