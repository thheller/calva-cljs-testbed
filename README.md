# Calva CLJS Testbed <!-- omit in toc -->

## The End Goal

- Run the `Hello World` command, which calls a function in `src/main/calva/extension.cljs`, which in turn calls a function in in `src/ts/bar.ts`, output to `lib/bar.js`, which in turn calls a function from the `calva.foo` namespace, via the generated `lib/cljs/calva.foo.js`.
- Build and run a VSIX and verify that the `Hello World` command, as mentioned above, works.

## Running the Extension

1. Run `npm install`.
2. Run `npm run watch-ts`.
3. Run `npx shadow-cljs watch ext` or `npx shadow-cljs release ext`
4. Open VSCode, open Folder with this project
4. Hit `F5` to start the extension in a new VS Code window.
6. Run the "Hello World" command from the command palette if you want to check that the extension is working, and also if you want to connect to the extension build's repl, as this command activates the extension.

## The Setup Explained

Using a single `:node-library` build. Exporting the stuff needed for vscode extensions, eg. activate/deactivate.

`src/main` is ALL cljs sources, there is no separate lib. Namespaces provide the separation. If you really want the calva stuff in a separate lib is MUST BE a CLJS library, meaning NOT a npm package and NOT already compiled to CLJS.

The TS files where moved to `src/ts` and also follow CLJS naming convention. This is not needed, but made things cleaner for me. `src/gen` is the output of TS.

Most of the troubles of previous attempts came from trying to mix two builds, or in that case even three because of the TS.

## Problems

```
src/ts/bar.ts:3:21 - error TS2307: Cannot find module './cljs/calva.foo' or its corresponding type declarations.

3 import cljsLib from "./cljs/calva.foo";
                      ~~~~~~~~~~~~~~~~~~
```

I don't know how to teach tsc about files that only live in its output folder?