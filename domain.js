(function () {
    'use strict';

    var sassLint = require("sass-lint");
    var fs = require("fs");
    var CONFIG_FILE_NAME = ".sass-lint.yml";
    var DOMAIN_NAME = "petetnt.brackets-sass-lint";

    /**
     * Lints the given file with Sass-Lint
     * @private
     * @param {string}   text        - File to lint as text
     * @param {string}   fullPath    - Full path to file to lint
     * @param {string}   fileExt     - Extension of the file
     * @param {string}   projectRoot - Path to project root
     * @param {function} callback    - Callback
     * @returns {function} callback
     */
    function _lintFile(text, fullPath, fileExt, projectRoot, callback) {
        var configFilePath = projectRoot + CONFIG_FILE_NAME;

        try {
            var results = sassLint.lintText({
                text: text,
                format: fileExt,
                filename: fullPath
            }, {}, configFilePath);

            return callback(null, results);
        } catch (err) {
            return callback(err);
        }
    }

    /**
     * Inits the domain
     * @param {DomainManager} domainManager - NodeDomain manager
     */
    function init(domainManager) {
        if (!domainManager.hasDomain(DOMAIN_NAME)) {
            domainManager.registerDomain(DOMAIN_NAME, {major: 0, minor: 1});
        }

        domainManager.registerCommand(
            DOMAIN_NAME,
            "lintFile",
            _lintFile,
            true,
            "Lints the given file with Sass-Lint",
            [{
                name: "text",
                type: "string",
                description: "File in text format to lint"
            }, {
                name: "fullPath",
                type: "string",
                description: "Full path to file"
            }, {
                name: "fileExt",
                type: "string",
                description: "Extension of the current file"
            }, {
                name: "projectRoot",
                type: "string",
                description: "Path to project root"
            }],
            [{
                name: "result",
                type: "object",
                description: "The result of the execution"
            }]
        );
    }

    exports.init = init;
}());