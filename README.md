# Calva CLJS Testbed <!-- omit in toc -->

## The End Goal

- Run the `Hello World` command, which calls a function in `src/calva_cljs/extension.cljs`, which in turn calls a function in `src/foo.ts`, which in turn calls a function in `src/cljs-lib/src/calva/foo.cljs`.
- Build and run a VSIX and verify that the `Hello World` command, as mentioned above, works.

## Running the Extension

1. Run `npm install`.
2. Run `npm run watch-ts`. This must be done before the shadow-cljs watch process so that the compiled TypeScript files are on the classpath and can be imported by the CLJS code in `src/main/calva_cljs`.
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
src/ts/calva/foo.ts:3:21 - error TS2307: Cannot find module 'goog:calva.foo' or its corresponding type declarations.

3 import cljsLib from "goog:calva.foo";
                      ~~~~~~~~~~~~~~~~
```

`import from "goog:..."` is the way the closure compiler expects JS files to load Closure namespaces, which CLJS namespaces also are. I do not know how you tell tsc to ignore these.

It seems to work regardless, the files are written to `src/gen` as needed.

TS output is included by shadow-cljs, and passing through `:advanced`. This will very likely not work with the real extension, due to too much JS code without externs. Might need to stick with `:simple`? Or fight with externs, maybe its not actually that many. Have not checkout the real calva ts sources.