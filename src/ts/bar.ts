import vscode from "vscode";
import os from "os";
import * as cljsLib from "./cljs/calva.foo";

console.log("hello cljsLib", cljsLib);

export function hello() {
  return "Hello from TypeScript";
}

export function platform() {
  return os.platform();
}

export function cljsLibTestFunction() {
  return cljsLib.test_function();
}

export function showMessage(message: string) {
  void vscode.window.showInformationMessage(message);
}

//.. some comment
