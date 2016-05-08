'use strict';var TokenType=require('../token-types');module.exports = (function(){ /**
  * Mark whitespaces and comments
  */function markSC(tokens){var tokensLength=tokens.length;var ws=-1; // Flag for whitespaces
var sc=-1; // Flag for whitespaces and comments
var t=undefined; // Current token
// For every token in the token list, mark spaces and line breaks
// as spaces (set both `ws` and `sc` flags). Mark multiline comments
// with `sc` flag.
// If there are several spaces or tabs or line breaks or multiline
// comments in a row, group them: take the last one's index number
// and save it to the first token in the group as a reference:
// e.g., `ws_last = 7` for a group of whitespaces or `sc_last = 9`
// for a group of whitespaces and comments.
for(var i=0;i < tokensLength;i++) {t = tokens[i];switch(t.type){case TokenType.Space:case TokenType.Tab:t.ws = true;t.sc = true;if(ws === -1)ws = i;if(sc === -1)sc = i;break;case TokenType.Newline:t.ws = true;t.sc = true;ws = ws === -1?i:ws;sc = sc === -1?i:ws;tokens[ws].ws_last = i - 1;tokens[sc].sc_last = i - 1;tokens[i].ws_last = i;tokens[i].sc_last = i;ws = -1;sc = -1;break;case TokenType.CommentML:case TokenType.CommentSL:if(ws !== -1){tokens[ws].ws_last = i - 1;ws = -1;}t.sc = true;break;default:if(ws !== -1){tokens[ws].ws_last = i - 1;ws = -1;}if(sc !== -1){tokens[sc].sc_last = i - 1;sc = -1;}}}if(ws !== -1)tokens[ws].ws_last = i - 1;if(sc !== -1)tokens[sc].sc_last = i - 1;} /**
  * Pair brackets
  */function markBrackets(tokens){var tokensLength=tokens.length;var ps=[]; // Parentheses
var sbs=[]; // Square brackets
var cbs=[]; // Curly brackets
var t=undefined; // Current token
// For every token in the token list, if we meet an opening (left)
// bracket, push its index number to a corresponding array.
// If we then meet a closing (right) bracket, look at the corresponding
// array. If there are any elements (records about previously met
// left brackets), take a token of the last left bracket (take
// the last index number from the array and find a token with
// this index number) and save right bracket's index as a reference:
for(var i=0;i < tokensLength;i++) {t = tokens[i];switch(t.type){case TokenType.LeftParenthesis:ps.push(i);break;case TokenType.RightParenthesis:if(ps.length){t.left = ps.pop();tokens[t.left].right = i;}break;case TokenType.LeftSquareBracket:sbs.push(i);break;case TokenType.RightSquareBracket:if(sbs.length){t.left = sbs.pop();tokens[t.left].right = i;}break;case TokenType.LeftCurlyBracket:cbs.push(i);break;case TokenType.RightCurlyBracket:if(cbs.length){t.left = cbs.pop();tokens[t.left].right = i;}break;}}}function markBlocks(tokens){var blocks={};var currentIL=0;var i=0;var l=tokens.length;var iw=undefined;for(;i !== l;i++) {if(!tokens[i - 1])continue; // Skip all tokens on current line:
if(tokens[i].type !== TokenType.Newline)continue;var end=getBlockEnd(tokens,i + 1,currentIL,iw);if(!iw)iw = end.iw;if(end.indent && end.indent === currentIL)continue; // Not found nested block.
if(end.end !== null){markBlocksWithIndent(tokens,blocks,end);for(var z=end.end + 1;z < l;z++) {if(tokens[z].type === TokenType.Space || tokens[z].type === TokenType.Tab || tokens[z].type === TokenType.CommentSL || tokens[z].type === TokenType.CommentML)continue;if(tokens[z].type === TokenType.Newline)i = z;break;}}if(!blocks[end.indent])blocks[end.indent] = [];blocks[end.indent].push(i + 1);currentIL = end.indent;}markBlocksWithIndent(tokens,blocks,{end:i - 1,indent:0});}function getBlockEnd(tokens,i,indent,iw,maybeEnd){var spaces='';if(!maybeEnd)maybeEnd = i - 1;if(!tokens[i])return {end:maybeEnd,indent:0};for(var l=tokens.length;i < l;i++) {if(tokens[i].type === TokenType.Space || tokens[i].type === TokenType.Tab || tokens[i].type === TokenType.CommentML || tokens[i].type === TokenType.CommentSL || tokens[i].type === TokenType.Newline){spaces += tokens[i].value;continue;} // Got all spaces.
// Find trailing spaces.
var lastNewline=spaces.lastIndexOf('\n');spaces = spaces.slice(lastNewline + 1); // Mark previous node as block end.
if(!spaces)return {end:maybeEnd,indent:0};if(!iw)iw = spaces.length;var newIndent=spaces.length / iw;if(newIndent < indent)return {end:maybeEnd,indent:newIndent,iw:iw};if(newIndent === indent){ // Look for line end
for(;i < l;i++) {if(tokens[i].type !== TokenType.Newline)continue;var end=getBlockEnd(tokens,i + 1,indent,iw,maybeEnd);return {end:end.end,indent:indent,iw:iw};}return {end:i - 1,indent:newIndent,iw:iw};}else { // If newIndent > indent
return {end:null,indent:newIndent,iw:iw};}}return {end:i - 1};}function markBlocksWithIndent(tokens,blocks,end){for(var indent in blocks) {if(indent < end.indent + 1)continue;var block=blocks[indent];if(!block)continue;for(var x=0;x < block.length;x++) {var y=block[x];tokens[y].block_end = end.end;}blocks[indent] = null;}}return function(tokens){markBrackets(tokens);markSC(tokens);markBlocks(tokens);};})();