# Satranj

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.22.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## pre-requisites

exprss in angular directory(Satranj)-> $npm install express
body-parser in angular directory(Satranj) -> $npm install body-parser 
nodemon globally -> $npm install -g nodemon

## How to connect local git repo with github repo


ferdnyc
ferdnyc
Ground Controller Lvl 2
‎09-26-2019 07:16 PM
Message 6 of 77

To those saying this answer is wrong: It isn't. The poster absolutely got themselves into trouble in the first place with:

$ git init
$ git add <files>
$ git commit -m "First commit from new computer"
$ git remote add origin https://github.com/roparzhhemon/myremoterepo.git

 

All of that should have been:

$ git clone https://github.com/roparzhhemon/myremoterepo.git

which would have automatically copied the contents of the remote repo and added it as the remote origin. You're not meant to be doing that by hand.

 

If there are local files to add that aren't in the remote repo, those can be added after the clone operation. Then the history won't be divergent, the new commit will have the HEAD of the remote repo as its parent, and git push will go right through.

 

The key is right in the name of the remote: "origin". It's meant to be the source of your local repo's copy of the history, not the destination for it.

 

The accepted answer may be the solution to this problem, when it's already happened, but it's much better to never get into that situation in the first place.

