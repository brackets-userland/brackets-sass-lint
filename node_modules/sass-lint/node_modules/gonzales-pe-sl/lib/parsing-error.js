'use strict';var parserPackage=require('../package.json'); /**
 * @param {Error} e
 * @param {String} css
 */function ParsingError(e,css){this.line = e.line;this.syntax = e.syntax;this.css_ = css;}ParsingError.prototype = Object.defineProperties({ /**
   * @type {String}
   * @private
   */customMessage_:'', /**
   * @type {Number}
   */line:null, /**
   * @type {String}
   */name:'Parsing error', /**
   * @type {String}
   */syntax:null, /**
   * @type {String}
   */version:parserPackage.version, /**
   * @return {String}
   */toString:function(){return [this.name + ': ' + this.message,'',this.context,'','Syntax: ' + this.syntax,'Gonzales PE version: ' + this.version].join('\n');}},{context:{ /**
   * @type {String}
   */get:function(){var LINES_AROUND=2;var result=[];var currentLineNumber=this.line;var start=currentLineNumber - 1 - LINES_AROUND;var end=currentLineNumber + LINES_AROUND;var lines=this.css_.split(/\r\n|\r|\n/);for(var i=start;i < end;i++) {var line=lines[i];if(!line)continue;var ln=i + 1;var mark=ln === currentLineNumber?'*':' ';result.push(ln + mark + '| ' + line);}return result.join('\n');},configurable:true,enumerable:true},message:{ /**
   * @type {String}
   */get:function(){if(this.customMessage_){return this.customMessage_;}else {var message='Please check validity of the block';if(typeof this.line === 'number')message += ' starting from line #' + this.line;return message;}},set:function(message){this.customMessage_ = message;},configurable:true,enumerable:true}});module.exports = ParsingError;