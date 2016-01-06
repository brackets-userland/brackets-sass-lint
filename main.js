define(function (require, exports, module) {
    "use strict";

    var CodeInspection  = brackets.getModule('language/CodeInspection');
    var LanguageManager = brackets.getModule('language/LanguageManager');
    var ProjectManager  = brackets.getModule('project/ProjectManager');
    var ExtensionUtils  = brackets.getModule('utils/ExtensionUtils');
    var FileUtils       = brackets.getModule('file/FileUtils');
    var NodeDomain      = brackets.getModule('utils/NodeDomain');

    var SASS_LANGUAGE = LanguageManager.getLanguageForExtension('sass');
    var SCSS_LANGUAGE = LanguageManager.getLanguageForExtension('scss');
    var LINTER_NAME = 'Sass-Lint';
    var DOMAIN_NAME = 'petetnt.brackets-sass-lint';
    var TYPES = {
        "0": CodeInspection.Type.META,
        "1": CodeInspection.Type.WARNING,
        "2": CodeInspection.Type.ERROR
    };

    var nodeDomain = new NodeDomain(DOMAIN_NAME, ExtensionUtils.getModulePath(module, 'domain'));

    /**
     * Parses errors and warnings from results to CodeInspection formatted array
     * @param   {object} results - Results object
     * @returns {Array}  errorsAndWarnings - Array containing CodeInspection formatted errors and warnings
     */
    function _parseErrorsAndWarnings(results) {
        var messages = results.messages;
        var errorsAndWarnings = [];

        messages.forEach(function (message) {
            var formattedObject = {
                pos: {
                    line: message.line - 1,
                    ch: message.column - 1
                },
                message: message.message + ". [" + message.ruleId + "]",
                type: TYPES[message.severity]
            };

            errorsAndWarnings.push(formattedObject);
        });

        return errorsAndWarnings;
    }

    /**
     * @private
     * Lints the given file syncronously
     * @param   {string}     text     - Text of the given file
     * @param   {string}     fullPath - Full path to the file
     * @returns {$.Deferred} deferred - jQuery deferred promise which resolves to CodeInspection formatted array or error
     */
    function _handleLintASync(text, fullPath) {
        var deferred = new $.Deferred();
        var projectRoot = ProjectManager.getProjectRoot().fullPath;
        var fileName = FileUtils.getFilenameWithoutExtension(fullPath);
        var fileExt = FileUtils.getFileExtension(fullPath);

        // Execute linting in Node domain
        nodeDomain.exec('lintFile', text, fullPath, fileExt, projectRoot)
            .then(function (results) {
            return deferred.resolve({errors: _parseErrorsAndWarnings(results)});
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise();
    }

    // Register linter for Sass
    CodeInspection.register(SASS_LANGUAGE.getId(), {
        name: LINTER_NAME,
        scanFileAsync: _handleLintASync
    });

    // Register linter for Scss
    CodeInspection.register(SCSS_LANGUAGE.getId(), {
        name: LINTER_NAME,
        scanFileAsync: _handleLintASync
    });

    // For unit testing
    exports._handleLintASync = _handleLintASync;
    exports._parseErrorsAndWarnings = _parseErrorsAndWarnings;
});