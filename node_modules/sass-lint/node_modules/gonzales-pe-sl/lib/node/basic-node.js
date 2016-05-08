'use strict'; /**
 * @param {string} type
 * @param {array|string} content
 * @param {number} line
 * @param {number} column
 * @constructor
 */var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}var Node=(function(){function Node(options){_classCallCheck(this,Node);this.type = options.type;this.content = options.content;this.syntax = options.syntax;if(options.start)this.start = options.start;if(options.end)this.end = options.end;} /**
     * @param {String} type Node type
     * @return {Boolean} Whether there is a child node of given type
     */Node.prototype.contains = function contains(type){return this.content.some(function(node){return node.type === type;});}; /**
     * @param {String} type Node type
     * @param {Function} callback Function to call for every found node
     */Node.prototype.eachFor = function eachFor(type,callback){if(!Array.isArray(this.content))return;if(typeof type !== 'string'){callback = type;type = null;}var l=this.content.length;var breakLoop;for(var i=l;i--;) {if(breakLoop === null)break;if(!type || this.content[i] && this.content[i].type === type)breakLoop = callback(this.content[i],i,this);}if(breakLoop === null)return null;}; /**
     * @param {String} type
     * @return {?Node} First child node or `null` if nothing's been found.
     */Node.prototype.first = function first(type){if(!Array.isArray(this.content))return null;if(!type)return this.content[0];var i=0;var l=this.content.length;for(;i < l;i++) {if(this.content[i].type === type)return this.content[i];}return null;}; /**
     * @param {String} type Node type
     * @param {Function} callback Function to call for every found node
     */Node.prototype.forEach = function forEach(type,callback){if(!Array.isArray(this.content))return;if(typeof type !== 'string'){callback = type;type = null;}var i=0;var l=this.content.length;var breakLoop;for(;i < l;i++) {if(breakLoop === null)break;if(!type || this.content[i] && this.content[i].type === type)breakLoop = callback(this.content[i],i,this);}if(breakLoop === null)return null;}; /**
     * @param {Number} index
     * @return {?Node}
     */Node.prototype.get = function get(index){if(!Array.isArray(this.content))return null;var node=this.content[index];return node?node:null;}; /**
     * @param {Number} index
     * @param {Node} node
     */Node.prototype.insert = function insert(index,node){if(!Array.isArray(this.content))return;this.content.splice(index,0,node);}; /**
     * @param {String} type
     * @return {Boolean} Whether the node is of given type
     */Node.prototype.is = function is(type){return this.type === type;}; /**
     * @param {String} type
     * @return {?Node} Last child node or `null` if nothing's been found.
     */Node.prototype.last = function last(type){if(!Array.isArray(this.content))return null;var i=this.content.length - 1;if(!type)return this.content[i];for(;;i--) {if(this.content[i].type === type)return this.content[i];}return null;}; /**
     * Number of child nodes.
     * @type {number}
     */ /**
     * @param {Number} index
     * @return {Node}
     */Node.prototype.removeChild = function removeChild(index){if(!Array.isArray(this.content))return;var removedChild=this.content.splice(index,1);return removedChild;};Node.prototype.toJson = function toJson(){return JSON.stringify(this,false,2);};Node.prototype.toString = function toString(){var stringify=undefined;try{stringify = require('../' + this.syntax + '/stringify');}catch(e) {var message='Syntax "' + this.syntax + '" is not supported yet, sorry';return console.error(message);}return stringify(this);}; /**
     * @param {Function} callback
     */Node.prototype.traverse = function traverse(callback,index){var level=arguments.length <= 2 || arguments[2] === undefined?0:arguments[2];var parent=arguments.length <= 3 || arguments[3] === undefined?null:arguments[3];var breakLoop;var x;level++;callback(this,index,parent,level);if(!Array.isArray(this.content))return;for(var i=0,l=this.content.length;i < l;i++) {breakLoop = this.content[i].traverse(callback,i,level,this);if(breakLoop === null)break; // If some nodes were removed or added:
if(x = this.content.length - l){l += x;i += x;}}if(breakLoop === null)return null;};Node.prototype.traverseByType = function traverseByType(type,callback){this.traverse(function(node){if(node.type === type)callback.apply(node,arguments);});};Node.prototype.traverseByTypes = function traverseByTypes(types,callback){this.traverse(function(node){if(types.indexOf(node.type) !== -1)callback.apply(node,arguments);});};_createClass(Node,[{key:'length',get:function(){if(!Array.isArray(this.content))return 0;return this.content.length;}}]);return Node;})();module.exports = Node;