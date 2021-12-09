## How to Use Reagent
The actual docs [here](http://reagent-project.github.io/) are quite good for learning how to write code if you already have reagent setup but it is quite confusing how to do this setup reagent so I wrote a quick section on how to do that below:

## Setup
1. First what you need to do is to install `lein` [here](https://leiningen.org/) you also need `npm` which I assume you already have but if you don't you can go [here](https://nodejs.org/en/) to install node which comes with npm. Last you actually need to install clojure `brew install clojure` actually though you can find out how to install clojure for your operating system [here](https://clojure.org/guides/getting_started).

2. Now that you have installed the deps you can actually get ready to use reagent; there's a template that you can use from lein which is essentially the reagenet equivelent of using `npx create-react-app` that command is `lein new reagent` or `lein new reagenet-frontend` depending on weather or not you would like to include the clojure backend or not, with `lein new reagenet-frontend` you you get the frontend if that's all you want to do.

3. Now that we have the template generated you can run the commands below in the helpful commands section unfortunately the documentation doesn't tell you about these commands and this is where most people get stuck, first you want to run `npm i` or `npm install` to install the node dependencies, then `npx shadow-cljs watch app` which will run shadow-cljs to watch your app this is effectively the same as running `react-scripts start` boom now you can navigate to `localhost:3000` and see your application and start editing the `core.cljs` file which contains your frontend code.

4. Using the documentation on reagent's website, just run through the examples you're basically using elm, to be honest it's just better elm if you've ever used elm if not it's react with slightly different more functional style.

## Helpful Commands
### Development Mode
```
npm install
npx shadow-cljs watch app
```
start a ClojureScript REPL
```
npx shadow-cljs browser-repl
```
### Building for production

```
npx shadow-cljs release app
```
