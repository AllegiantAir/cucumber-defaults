/**

This helper function takes in an array of arguments
that chains Gherkin step definitions properly to
synchronize step calls.

When calling a step in the chain, you will need to
specify the position of the arguments where the callback
should be passed. Take for example:

DefaultMapSteps.iGoToHomepage(function() {
  DefaultMapSteps.iFollow('Edit', callback, self);
}, self);

The array argument you must pass is then:

Chain([
        ['cb', self, DefaultMapSteps.iGoToHomepage],
        ['Edit', callback, self, DefaultMapSteps.iFollow]
      ]);

Chain will then automatically execute in order:

1) DefaultMapSteps.iGoToHomepage
2) DefaultMapSteps.iFollow

In the first array argument:
 ['cb', self, DefaultMapSteps.iGoToHomepage]

'cb' is a reserved key word used by chain to locate
where the callback, DefaultMapSteps.iFollow needs to be
sent. Essentially it will perform the following operation:

// 'cb' is replaced by the correct callback
DefaultMapSteps.iGoToHomepage( DefaultMapSteps.iFollow, self );

***** Important note ********
If you have preceding arguments your are passing into chain's
argument array, you must specify a 'cb' callback. Example:

// Wrong **** No 'cb' is declared
Chain([
  [function() {}, self, DefaultMapSteps.iGoToHomepage],
  ['Edit', callback, self, DefaultMapSteps.iFollow]
])

// Right 'cb' is declared
Chain([
  ['cb', self, DefaultMapSteps.iGoToHomepage],
  ['Edit', callback, self, DefaultMapSteps.iFollow]
])

// Right: There is no reason to declare 'cb'
// since you are not passing in a callback
Chain([
  [function() {}, self, DefaultMapSteps.iGoToHomepage]
])

**/
var _ = require('lodash')

Chain = function(args) {
  var i, index;
  for(i = args.length - 1; i > -1; i --) {
    var chArg = args[i];
    var index = _.indexOf(chArg,'cb');
    if( (typeof (f = chArg[chArg.length - 1])).toString().toLowerCase() != 'function') {
      console.log((typeof (f = chArg[chArg.length - 1])).toString().toLowerCase());
      console.log("Last argument of chained array must be a function!");
      console.log("    example: ");
      console.log("    chain([ ");
      console.log("      [arg1, arg2, 'cb', this_must_be_a_function ], ");
      console.log("      [arg1, this_must_be_another_function], ");
      console.log("    ]); ");
      throw new Error("Last argument of chained array is not a function!")
    }
    if(index < 0 && i < args.length - 1 ) {
      console.log("You must indicate where to pass your chained function as a callback with the keyword 'cb': ");
      console.log("    For example: ");
      console.log("    chain([ ");
      console.log("      [arg1, arg2, 'cb', your_function], ");
      console.log("      [arg1, your_function] ");
      console.log("    ]); ");
      throw new Error("Callback position not indicated!");
    }
    if(i < args.length -1) {
        var cl = i + 1;
        (function(x) {
          chArg[index] = function() {
            var c = args[x];
            c[c.length - 1].apply(null, c.splice(0,c.length - 1));
          }
        })(cl);
    }
  }
  chArg[chArg.length - 1].apply(null,chArg.splice(0, chArg.length - 1));
};

exports.Chain = Chain;