#!/usr/bin/env node
/**
 * super duper easy cheesy create defaults creator
 */

var fs = require('fs');

var dirMode = '0755';

var featuresDir = 'features/';
var stepDefinitionsDir = featuresDir + 'step_definitions/'
var defaultStepsFile = stepDefinitionsDir + 'defaultSteps.js';

var supportDir = featuresDir + 'support/';
var defaultHooksFile = supportDir + 'defaultHooks.js';
var worldFile = supportDir + 'world.js';

var createDir = function (dirName, mode) {
    try {
        fs.mkdirSync(dirName, mode);
        console.log(dirName + ' created');
    } catch(e) {}
}

createDir(featuresDir, dirMode);
createDir(stepDefinitionsDir, dirMode);
createDir(supportDir, dirMode);

var writeDefaults = function(fileName, data) {
    fs.exists(fileName, function(exists) {
        if (!exists) {
            try {
                fs.writeFileSync(fileName, data);
                console.log(fileName + ' written with defaults');
            } catch(e) {}
        }
    });
}

writeDefaults(
    defaultStepsFile,
    "module.exports = require('devops-cucumber-defaults').DefaultSteps;\n"
);

writeDefaults(
    defaultHooksFile,
    "module.exports = require('devops-cucumber-defaults').DefaultHooks;\n"
);

writeDefaults(
    worldFile,
    "var devOpsCucumberDefaults = require('devops-cucumber-defaults');\n\nexports.World = devOpsCucumberDefaults.World;\n"
);
