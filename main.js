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
    var LINTER_NAME = 'SASSLint';

    var domainName = 'petetnt.brackets-sass-lint';
    var nodeDomain = new NodeDomain(domainName, ExtensionUtils.getModulePath(module, 'domain'));

    /**
     * Lints the given file syncronously
     * @param   {string}     text     - Given text
     * @param   {string}     fullPath - Full path to the file
     * @returns {$.Deferred} deferred - jQuery deferred promise
     */
    function handleLintASync(text, fullPath) {
        var deferred = new $.Deferred();
        var projectRoot = ProjectManager.getProjectRoot().fullPath;
        var fileName = FileUtils.getFilenameWithoutExtension(fullPath);
        var fileExt = FileUtils.getFileExtension (fullPath);

        nodeDomain.exec('lintFile', text, fullPath, fileExt, projectRoot)
            .then(function (result) {
            console.log(result);
            return deferred.resolve(result);
        }, function (err) {
            console.error(err);
            deferred.reject(err);
        });

        return deferred.promise();
    }

    CodeInspection.register(SASS_LANGUAGE.getId(), {
        name: LINTER_NAME,
        scanFileAsync: handleLintASync
    });

    CodeInspection.register(SCSS_LANGUAGE.getId(), {
        name: LINTER_NAME,
        scanFileAsync: handleLintASync
    });
});