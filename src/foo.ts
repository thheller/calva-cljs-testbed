import * as vscode from "vscode";
import * as os from "os";
//import * as cljsLib from "../out/cljs-lib/out/cljs-lib.js";

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
