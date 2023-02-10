# Calva CLJS Testbed

This repo serves as a testbed for getting Calva into a state in which the extension is built with shadow-cljs, so that hot reloading of the TypeScript works and so that we can start porting the extension to ClojureScript incrementally.

The main branch aligns with the current state of the Calva `dev` branch as of commit `bdfcd416d2494cb165c01c02d45b26b2e64c2ee2`, except for some initial setup which doesn't yet aim to solve issues:

- The `:extension` build was added to shadow-cljs.edn
- `src/foo.ts` was added to serve as our TS layer test file
- `src/calva_cljs/extension.cljs` was added to serve as our extension entry point
- The `main` entry in package.json was changed to `./lib/main.js` so the compiled CLJS is used as the entry point

This branch should be left as-is, and efforts to set up Calva for being built by shadow-cljs should be done in separate branches, which could each represent a different approach.

The readme in each branch that represents an approach should describe issues that arose and how they were resolved so that we can track decisions and assumptions.

## Where The `main` Branch Leaves Off

The extension entrypoint is `src/calva_cljs/extension.cljs`, but doesn't yet try to import and call compiled TypeScript.

## The End Goal

- Run the `Hello World` command, which calls a function in `src/calva_cljs/extension.cljs`, which in turn calls a function in `src/foo.ts`, which in turn calls a function in `src/cljs-lib/src/calva/foo.cljs`.
- Build and run a VSIX and verify that the `Hello World` command, as mentioned above, works.

## Running the Extension

1. Run `npm install`.
2. Run `npm run compile-cljs`. This must be done before running the `watch-ts` script since the TypeScript needs to be able to import the compiled CLJS from `src/cljs-lib/src/calva`.
3. Run `npm run watch-ts`. This must be done before started the shadow-cljs watch process so that the compiled TypeScript files are on the classpath and can be imported by the CLJS code in `src/calva_cljs`.
4. Jack-in and choose shadow-cljs and the `extension` and `calva-lib` builds (or copy the jack-in commmand, run it, and connect to the shadow-cljs repl).
5. Hit `F5` to start the extension in a new VS Code window.
6. Run the "Hello World" command from the command palette if you want to check that the extension is working, and also if you want to connect to the extension build's repl, as this command activates the extension.

## `attempt_1` Issues and Solutions

When requiring `/foo.js` using `["/foo.js" :as foo]` and loading the file in the repl, evaluating `foo` throws an error:
  
```clojure
:repl/exception!
; 
; Execution error (ReferenceError) at (<cljs repl>:1).
; module$foo is not defined
```

If you set `moduleResolution` to `node16` in `tsconfig.json`, then load the `extension.clj` file in the repl and evaluate `foo`, you get:
  
```clojure
#js {:default #js {:hello nil, :platform nil, :showMessage nil}}
```

Trying to evaluate a call to any of those functions from `foo` throws an error, as expected since they're `nil`:

```clojure
:repl/exception!
; 
; Execution error (TypeError) at (<cljs repl>:1).
; module$foo.hello is not a function
```

If I then remove the `moduleResolution` setting and set `module` to `es6`, I get the following error from the TS compiler:

```text
src/test/runTest.ts:3:26 - error TS2792: Cannot find module '@vscode/test-electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?

3 import { runTests } from '@vscode/test-electron';
```

And I also get these errors from the shadow-cljs compiler:

```text
Closure compilation failed with 2 errors
--- foo.js:1
Namespace imports (goog:some.Namespace) cannot use import * as. Did you mean to import vscode from 'goog:shadow.js.shim.module$vscode';?
--- foo.js:2
Namespace imports (goog:some.Namespace) cannot use import * as. Did you mean to import os from 'goog:shadow.js.shim.module$os';?
```

If then set `moduleResolution` to `node16`, TS compilation succeeds, but the shadow-cljs compiler errors above still occur. [This Slack convo about the above error](https://clojurians.slack.com/archives/C6N245JGG/p1612767381070600) points toward using es2015 (es6) module output as the solution.

If I then set `module` in `tsconfig.json` to `es6`, I still get the same errors from shadow-cljs, but if I change the imports in `./out/foo.js` manually from:

```javascript
import * as vscode from "vscode";
import * os from "os";
```

to:

```javascript
import vscode from "vscode";
import os from "os";
```

then the shadow-cljs compilation succeeds, and after loading the `extension.clj` file in the repl and evaluating `foo`, I now get:

```clojure
#js
 {:hello #object [hello$$module$foo],
  :platform #object [platform$$module$foo],
  :showMessage #object [showMessage$$module$foo]}
```

and evaluating `(.. foo (hello))` succeeds, but when the TS is compiled again, the `import * as` syntax is added back to `./out/foo.js`, and the shadow-cljs compilation fails again.

So what happens if we change the imports as mentioned above in `foo.ts`? The TS compiler complains:

```text
src/foo.ts:1:8 - error TS1192: Module '"vscode"' has no default export.

1 import vscode from "vscode";
         ~~~~~~

src/foo.ts:2:8 - error TS1192: Module '"os"' has no default export.

2 import os from "os";
```

In the tsconfig docs, the [`allowSyntheticDefaultImports`](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) setting looks like it might be the solution. Setting this to `true` in `tsconfig.json` results in both the TS and CLJS compilation succeeding, and evaluating `(.. foo (hello))` in the repl succeeds.

