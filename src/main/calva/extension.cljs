(ns calva.extension
  (:require
   ["vscode" :as vscode :refer [window]]
   [calva.foo :as calva-foo]))

(def bar (js/require "../bar.js"))

(comment
  (.hello bar)
  (.cljsLibTestFunction bar)
  (calva-foo/test-function)
  :rcf)

(defonce current-context (atom nil))
(defonce disposables (atom []))

(defn add-disposable! [disposable]
  (swap! disposables conj disposable))

(defn dispose-all!
  [disposables]
  (run! (fn [^js disposable]
          (.. disposable (dispose)))
        disposables))

(defn say-hello []
  (.. window (showInformationMessage "Hello world")))

(defn hello-cljs-lib []
  (.. window (showInformationMessage (.cljsLibTestFunction bar))))

(defn hello-typescript []
  (.. window (showInformationMessage (.hello bar))))

(defn register-command!
  [command-name command-function]
  (let [disposable (.. vscode -commands (registerCommand
                                         command-name
                                         command-function))]
    (add-disposable! disposable)))

(defn ^:export activate
  [^js context]
  (js/console.log "Activating Calva CLJS Testbed")
  (reset! current-context context)
  (register-command! "calvacljstestbed.helloWorld" say-hello)
  (register-command! "calvacljstestbed.helloTypeScript" hello-typescript)
  (register-command! "calvacljstestbed.helloCljsLib" hello-cljs-lib)
  (prn "Calva CLJS Testbed activated"))

(defn ^:export deactivate
  []
  (dispose-all! @disposables)
  (prn "Calva CLJS Testbed deactivated"))

(defn before-load-async [done]
  (prn "Running before-load-async")
  (deactivate)
  (done))

(defn after-load []
  (prn "Running after-load")
  (activate @current-context)
  (prn "Calva CLJS Testbed reloaded"))

