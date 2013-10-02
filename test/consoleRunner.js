// make require global for the shared config
global.requirejs = require('requirejs');

require('./requireTestConfig');

//make define available globally like it is in the browser
global.define = requirejs;

//make jasmine available globally like it is in the browser
jasmine = require('jasmine-node');

// map jasmine methods to global namespace
for (key in jasmine) {
    if (jasmine[key] instanceof Function) {
        global[key] = jasmine[key];
    }
}

//bring in and list all the tests to be run
requirejs(['allSpecs'], function() {
    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
    jasmine.getEnv().execute();
});