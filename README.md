# Satranj

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.22.


# How to connect local git repository with github repository(linux .deb)
1. install git in the specified directory or in root.(space)
    $ npm install git 
2. to set name and email for git globally.
    $ git config -global user.name "YOUR_NAME".
    $ git config -global user.email "YOUR_EMAIL".
2. Run the following commands : 
    $ git clone https://github.com/roparzhhemon/myremoterepo.git

<!-- 3. Go inside the directory ../Satranj and run the following commands:
    $ git init 
    <!-- $ git add -A
    $ git commit -m "First commit from new computer"
    $ git remote add origin https://github.com/roparzhhemon/myremoterepo.git -->

<!-- All of that should have been:



which would have automatically copied the contents of the remote repo and added it as the remote origin. You're not meant to be doing that by hand.

 

If there are local files to add that aren't in the remote repo, those can be added after the clone operation. Then the history won't be divergent, the new commit will have the HEAD of the remote repo as its parent, and git push will go right through.

 

The key is right in the name of the remote: "origin". It's meant to be the source of your local repo's copy of the history, not the destination for it.

 

The accepted answer may be the solution to this problem, when it's already happened, but it's much better to never get into that situation in the first place. -->

## pre-requisites

1. Install exprss in directory(Satranj)
     $npm install express
2. Install body-parser in directory(Satranj) 
     $npm install body-parser 
3. Install nodemon globally 
     $npm install -g nodemon


# Development server

We are using proxy configuration to connect with backend angular server- with backend node server;
1. Run 'nodemon server.js' in the directory '../Satranj/backend' which is running on port no. 4000.
2. 
    a. Run 'ng serve --proxy-config proxy.conf.json' to run the angular application. Open 127.0.0.1:4200 in your browser.
        Or
    b. run 'ng serve --proxy-config proxy.conf.json --port port_no' to run the application at the specified port. (eg. ng serve --proxy-config proxy.conf.json --port 4000).
3. 


# Additional Angular commands

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




## Basic git commands

# PULL before PUSH

1. git add

    Usage: git add [file]

    This command adds a file to the staging area.

2. git commit

    Usage: git commit -m “[ Type in the commit message]”

    This command records or snapshots the file permanently in the version history.

3. git diff

    Usage: git diff

    This command shows the file differences which are not yet staged.

4.git reset

    Usage: git reset [file]

    This command unstages the file, but it preserves the file contents.

5. git push

    Usage: git push [variable name] master

    This command sends the committed changes of master branch to your remote repository.

6. git pull

    Usage:  git pull [Repository Link]

    This command fetches and merges changes on the remote server to your working directory.
