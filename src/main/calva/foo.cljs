(ns calva.foo)

(defn ^:export test-function []
  (str "Hello from cljs-lib"))

(comment
  (test-function)
  :rcf)

