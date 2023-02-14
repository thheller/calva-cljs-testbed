# Calva CLJS Testbed <!-- omit in toc -->

- [Where The `main` Branch Leaves Off](#where-the-main-branch-leaves-off)
- [The End Goal](#the-end-goal)
- [Running the Extension](#running-the-extension)
- [`attempt_1` Issues and Solutions](#attempt_1-issues-and-solutions)
  - [Importing Compiled `foo.ts` in the :extension Build CLJS](#importing-compiled-foots-in-the-extension-build-cljs)
  - [Importing the cljs-lib Code in `foo.ts`](#importing-the-cljs-lib-code-in-foots)
- [Using the :npm-module Target for the calva-lib Build](#using-the-npm-module-target-for-the-calva-lib-build)


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

### Importing Compiled `foo.ts` in the :extension Build CLJS

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

If we then remove the `moduleResolution` setting and set `module` to `es6`, we get the following error from the TS compiler:

```text
src/test/runTest.ts:3:26 - error TS2792: Cannot find module '@vscode/test-electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?

3 import { runTests } from '@vscode/test-electron';
```

And we also get these errors from the shadow-cljs compiler:

```text
Closure compilation failed with 2 errors
--- foo.js:1
Namespace imports (goog:some.Namespace) cannot use import * as. Did you mean to import vscode from 'goog:shadow.js.shim.module$vscode';?
--- foo.js:2
Namespace imports (goog:some.Namespace) cannot use import * as. Did you mean to import os from 'goog:shadow.js.shim.module$os';?
```

If then set `moduleResolution` to `node16`, TS compilation succeeds, but the shadow-cljs compiler errors above still occur. [This Slack convo about the above error](https://clojurians.slack.com/archives/C6N245JGG/p1612767381070600) points toward using es2015 (es6) module output as the solution.

If we then set `module` in `tsconfig.json` to `es6`, we still get the same errors from shadow-cljs, but if we change the imports in `./out/foo.js` manually from:

```javascript
import * as vscode from "vscode";
import * os from "os";
```

to:

```javascript
import vscode from "vscode";
import os from "os";
```

then the shadow-cljs compilation succeeds, and after loading the `extension.clj` file in the repl and evaluating `foo`, we now get:

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

### Importing the cljs-lib Code in `foo.ts`

Now it's time to try importing the cljs-lib code in `foo.ts` and calling a function from it.

We add the following import to `foo.ts`:

```typescript
import * as cljsLib from "../out/cljs-lib/cljs-lib";
```

and the compilation for both TS and CLJS succeeds, but shadow-cljs reports the following warning:

```text
------ WARNING #1 -  -----------------------------------------------------------
 Resource: 
 Failed to resolve sourcemap at foo.js.map: foo.js.map
--------------------------------------------------------------------------------
```

If we set `inlineSourceMap` to `true` in `tsconfig.json`, the warning goes away.

Now let's try to call a function from the cljs-lib code. We add the following to `foo.ts`:

```typescript
export function cljsLibTestFunction() {
  return cljsLib.testFunction("World");
}
```

Now we get the following error from the shadow-cljs watch process:

```text
Cannot access "../out/cljs-lib/cljs-lib" from "foo.js".
Access outside the classpath is not allowed for relative requires.
```

It seems that the `..`, to shadow-cljs, means going up outside the classpath. Nodejs wants relative file path imports, but shadow-cljs wants classpath imports.

Maybe if we make the cljs-lib code a nodejs module, we can import it from node_modules instead of using a relative file path. We run `npm init` in the `src/cljs-lib` directory to create a `package.json` file and set it's `main` property to `"out/cljs-lib.js"`. resulting in the following file contents:

```json
{
  "name": "cljs-lib",
  "version": "1.0.0",
  "description": "",
  "main": "out/cljs-lib.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

Next we run `npm install ./src/cljs-lib` in the top level directory to install the cljs-lib code as a nodejs module in Calva. This adds the following entry to Calva's dependencies in `package.json`:

```json
"cljs-lib": "file:src/cljs-lib"
```

We then change the `:output-to` value for the `:calva-cljs` build in `shadow-cljs.edn` to `"src/cljs-lib/out/cljs-lib.js"`, and then run `npm run compile-cljs`.

Now, back in `foo.ts`, we change the import to:

```typescript
import * as cljsLib from "cljs-lib";
```

We then get the following info and exception from the shadow-cljs compiler:

```text
[2023-02-11 19:48:41.611 - INFO] :shadow.build.npm/js-invalid-requires - {:resource-name "node_modules/cljs-lib/out/cljs-lib.js", :requires [{:line 899, :column 6}]}
[:extension] Build failure:
no output for id: [:shadow.build.classpath/resource "foo.js"]
{:resource-id [:shadow.build.classpath/resource "foo.js"]}
ExceptionInfo: no output for id: [:shadow.build.classpath/resource "foo.js"]
        shadow.build.data/get-output! (data.clj:202)
        shadow.build.data/get-output! (data.clj:198)
        shadow.build.warnings/get-source-excerpts-for-rc (warnings.clj:50)
        shadow.build.warnings/get-source-excerpts-for-rc (warnings.clj:47)
        shadow.build.warnings/get-source-excerpt-for-rc (warnings.clj:55)
        shadow.build.warnings/get-source-excerpt-for-rc (warnings.clj:54)
        shadow.build.closure/js-error-xf/fn--13477 (closure.clj:620)
        ...
```

If we comment out the `cljsLibTestFunction` function in `foo.ts`, the cljs compilation succeeds:

```typescript
// export function cljsLibTestFunction() {
//   return cljsLib.testFunction("World");
// }
```

So it seems there's something about the compiled cljs-lib code that shadow-cljs doesn't like.

If we change the import statement in `foo.ts` to:

```typescript
import cljsLib from 'cljs-lib';
```

then the shadow-cljs build fails with the following errors:

```text
Closure compilation failed with 3 errors
--- node_modules/cljs-lib/out/cljs-lib.js:299
Closure primitive methods (goog.provide, goog.require, goog.define, etc) must be called at file scope.
--- node_modules/cljs-lib/out/cljs-lib.js:300
Closure primitive methods (goog.provide, goog.require, goog.define, etc) must be called at file scope.
--- node_modules/cljs-lib/out/cljs-lib.js:301
Closure primitive methods (goog.provide, goog.require, goog.define, etc) must be called at file scope.
```

Looking at `node_modules/cljs-lib/out/cljs-lib.js`, we see at line 299:

```javascript
goog.forwardDeclare("XMLHttpRequest");
```

All the code in that file is wrapped in a function that is immediately invoked, so it seems that the `goog.forwardDeclare` call is not at file scope, but that probably isn't the real problem here.

If shadow-cljs is building the cljs-lib code, then it should be able to later compile the TS code that imports it, so maybe there's something we need to change with the way shadow-cljs builds the cljs-lib code, or there's something we need to change in the `:extension` build in `shadow-cljs.edn` to make shadow-cljs bypass compiling the cljs-lib code, which seems like a redundant step anyway.

At this point, let's upgrade the shadow-cljs version to `^2.20.20` and see if that helps... Nope, same error. Let's keep it at this currently latest version, though.

## Using the :npm-module Target for the calva-lib Build

If we set the `:calva-lib` build config to the following:

```edn
                {:target    :npm-module
                 :entries [calva.foo]
                 :output-dir "node_modules/shadow-cljs"}
```

then change the import in `foo.ts` to:

```typescript
import cljsLib from "shadow-cljs/calva.foo";
```

then the `:calva-lib` compilation and the TS compilation both succeed, but when we try to compile the `:extension` build, we get the following error:

```text
[2023-02-14 14:01:37.418 - INFO] :shadow.build.npm/js-invalid-requires - {:resource-name "node_modules/shadow-cljs/cljs_env.js", :requires [{:line 792, :column 6}]}
[:extension] Build failure:
Closure compilation failed with 109 errors
--- node_modules/shadow-cljs/cljs.core.js:15
Required namespace "goog.math.Long" never defined.
--- node_modules/shadow-cljs/cljs.core.js:16
Required namespace "goog.object" never defined.
... (many more errors like the above)
```

If we remove `:js-provider :shadow` from the `:extension` build, then the `:extension` build succeeds, but when we run the extension host and run the "Hello World" command to activate the extension, we get the following error popup:

```text
Activating extension 'undefined_publisher.calvacljstestbed' failed: Namespace "goog.debug.Error" already declared..
```

and in the debug console we get this error:

```text
SHADOW import error /Users/brandon/development/calvacljstestbed/lib/js/cljs-runtime/shadow.js.shim.module$shadow_cljs$calva_foo.js
```

At this point we removed the changes for trying the `:npm-module` target.
