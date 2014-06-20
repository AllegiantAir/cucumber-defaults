"use strict";
// welcome to our world
var url = require('url');
var CONFIG = require('config').cucumber;

var World = function (callback) {
    this.browserOptions = CONFIG.browserOptions;
    this.serverOptions = CONFIG.serverOptions;
    this.baseUrl = CONFIG.baseUrl;

    this.url = function (uri) {
        return url.resolve(this.baseUrl, uri);
    };

    /* this magic idea came from the php project behat-mink */
    this.namedSelectors = {
        'fieldset': ".//fieldset[(./@id = %locator% or .//legend[contains(normalize-space(string(.)), %locator%)])]",
        'field': ".//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')]",
        'link': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//*[./@role = 'link'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
        'button': ".//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[((((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[./@role = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
        'link_or_button': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[(((./@id = %locator% or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[(./@role = 'button' or ./@role = 'link')][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
        'content': "./descendant-or-self::*[contains(normalize-space(.), %locator%)]",
        'node_with_content': "./descendant-or-self::text()[contains(normalize-space(.), %locator%)]/..",
        'tagname_content': ".//%tagname%[contains(normalize-space(.), %locator%)]",
        'select': ".//select[(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//select",
        'checkbox': ".//input[./@type = 'checkbox'][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//input[./@type = 'checkbox']",
        'radio': ".//input[./@type = 'radio'][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//input[./@type = 'radio']",
        'file': ".//input[./@type = 'file'][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//input[./@type = 'file']",
        'optgroup': ".//optgroup[contains(./@label, %locator%)]",
        'option': ".//option[(./@value = %locator% or contains(normalize-space(string(.)), %locator%))]",
        'table': ".//table[(./@id = %locator% or contains(.//caption, %locator%))]",
        'tagname': ".//%tagname%",

        getXPath: function (type, locator, tagname) {
            if (tagname && locator) {
                var XPath = this[type].replace(/%locator%/g, "'" + locator + "'");
                return console.log(XPath.replace(/%tagname%/, tagname));
            }

            if (tagname) {
                return console.log(this[type].replace(/%tagname%/, tagname));
            }

            return this[type].replace(/%locator%/g, "'" + locator + "'");
        }
    };

    callback(this);
};

exports.World = World;
exports.DefaultSteps = require('./steps').Steps;
exports.DefaultHooks = require('./hooks').Hooks;
exports.DefaultMapSteps = require('./map-steps').MapSteps;
exports.Chain = require('./chain').Chain;
exports.Helper = require('./helper').Helper;
