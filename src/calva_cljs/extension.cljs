(ns calva-cljs.extension
  (:require
   ["vscode" :as vscode :refer [window]]
   ["/foo.js" :as foo]))

(comment
  (.. foo (hello))
  (.. foo (cljsLibTestFunction))
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
  (.. window (showInformationMessage "Hello world!")))

(defn register-command!
  [command-name command-function]
  (let [disposable (.. vscode -commands (registerCommand
                                         command-name
                                         command-function))]
    (add-disposable! disposable)))

(defn activate
  [^js context]
  (js/console.log "Activating Calva CLJS Testbed")
  (reset! current-context context)
  (register-command! "calvacljstestbed.helloWorld" say-hello)
  (prn "Calva CLJS Testbed activated"))

(defn deactivate
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

