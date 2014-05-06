DevOps Cucumber Defaults
========================

TL;DR
-----

add this module to your project then run:

```javascript
./node_modules/.bin/cucumberSetupDefaults
```

now put a feature file in the features folder, then run:

```javascript
cucumber.js
```

Setup
-----

This gives a project a default set of steps for Behavior Driven Development

On a clean (untested) project the above will output the following:

```
features/ created
features/step_definitions/ created
features/support/ created
features/step_definitions/defaultSteps.js written with defaults
features/support/defaultHooks.js written with defaults
features/support/world.js written with defaults
```
