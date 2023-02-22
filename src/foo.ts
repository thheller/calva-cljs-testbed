import vscode from "vscode";
import os from "os";
import cljsLib from "cljs-lib";

export function hello() {
  return "Hello from TypeScript";
}

export function platform() {
  return os.platform();
}

export function cljsLibTestFunction() {
  return cljsLib.testFunction();
}

export function showMessage(message: string) {
  void vscode.window.showInformationMessage(message);
}

//.. some comment
