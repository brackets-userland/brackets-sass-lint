define(function (require, exports, module) {
    "use strict";
    var main = require("main");

    describe("Brackets Sass-Lint", function () {
        it("should expose a _handleLintASync method", function () {
            expect(main._handleLintASync).not.toBeNull();
        });

        it("should expose a _parseErrorsAndWarnings method", function () {
            expect(main._parseErrorsAndWarnings).not.toBeNull();
        });

        it("should lint a SASS file", function () {
            // FIX ME
        });

        it("should lint a SCSS file", function () {
            //FIX ME
        });
    });
});