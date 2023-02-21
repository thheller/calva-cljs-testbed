import vscode from "vscode";
import os from "os";
//const cljsLib = require("cljs-lib");

export function hello() {
  return "hello";
}

export function platform() {
  return os.platform();
}

// export function cljsLibTestFunction() {
//   return cljsLib.testFunction("World");
// }

export function showMessage(message: string) {
  void vscode.window.showInformationMessage(message);
}
