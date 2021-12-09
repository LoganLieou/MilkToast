(ns myproject.core
    (:require
      [reagent.core :as r]
      [reagent.dom :as d]))

;; -------------------------
;; Views

(defn header []
  [:div [:h1 "Hello World!"]])

(defn home-page []
  [:div [header]
        [:hr]
        [:p "this is a paragraph"]
        [:p "will I ever use this again in the future"]])

;; -------------------------
;; Initialize app

(defn mount-root []
  (d/render [home-page] (.getElementById js/document "app")))

(defn ^:export init! []
  (mount-root))
