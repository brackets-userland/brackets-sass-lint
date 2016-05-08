// jscs:disable maximumLineLength
'use strict';var Node=require('../node/basic-node');var NodeType=require('../node/node-types');var TokenType=require('../token-types'); /**
 * @type {Array}
 */var tokens; /**
 * @type {Number}
 */var tokensLength; /**
 * @type {Number}
 */var pos;var contexts={'atkeyword':function(){return checkAtkeyword(pos) && getAtkeyword();},'atrule':function(){return checkAtrule(pos) && getAtrule();},'block':function(){return checkBlock(pos) && getBlock();},'brackets':function(){return checkBrackets(pos) && getBrackets();},'class':function(){return checkClass(pos) && getClass();},'combinator':function(){return checkCombinator(pos) && getCombinator();},'commentML':function(){return checkCommentML(pos) && getCommentML();},'declaration':function(){return checkDeclaration(pos) && getDeclaration();},'declDelim':function(){return checkDeclDelim(pos) && getDeclDelim();},'delim':function(){return checkDelim(pos) && getDelim();},'dimension':function(){return checkDimension(pos) && getDimension();},'expression':function(){return checkExpression(pos) && getExpression();},'function':function(){return checkFunction(pos) && getFunction();},'ident':function(){return checkIdent(pos) && getIdent();},'important':function(){return checkImportant(pos) && getImportant();},'namespace':function(){return checkNamespace(pos) && getNamespace();},'number':function(){return checkNumber(pos) && getNumber();},'operator':function(){return checkOperator(pos) && getOperator();},'parentheses':function(){return checkParentheses(pos) && getParentheses();},'percentage':function(){return checkPercentage(pos) && getPercentage();},'progid':function(){return checkProgid(pos) && getProgid();},'property':function(){return checkProperty(pos) && getProperty();},'propertyDelim':function(){return checkPropertyDelim(pos) && getPropertyDelim();},'pseudoc':function(){return checkPseudoc(pos) && getPseudoc();},'pseudoe':function(){return checkPseudoe(pos) && getPseudoe();},'ruleset':function(){return checkRuleset(pos) && getRuleset();},'s':function(){return checkS(pos) && getS();},'selector':function(){return checkSelector(pos) && getSelector();},'shash':function(){return checkShash(pos) && getShash();},'string':function(){return checkString(pos) && getString();},'stylesheet':function(){return checkStylesheet(pos) && getStylesheet();},'unary':function(){return checkUnary(pos) && getUnary();},'uri':function(){return checkUri(pos) && getUri();},'value':function(){return checkValue(pos) && getValue();},'vhash':function(){return checkVhash(pos) && getVhash();}}; /**
 * Stop parsing and display error.
 * @param {Number=} i Token's index number
 */function throwError(i){var ln=tokens[i].ln;throw {line:ln,syntax:'css'};} /**
 * @param {Object} exclude
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkExcluding(exclude,i){var start=i;while(i < tokensLength) {if(exclude[tokens[i++].type])break;}return i - start - 2;} /**
 * @param {Number} start
 * @param {Number} finish
 * @return {String}
 */function joinValues(start,finish){var s='';for(var i=start;i < finish + 1;i++) {s += tokens[i].value;}return s;} /**
 * @param {Number} start
 * @param {Number} num
 * @return {String}
 */function joinValues2(start,num){if(start + num - 1 >= tokensLength)return;var s='';for(var i=0;i < num;i++) {s += tokens[start + i].value;}return s;}function getLastPosition(content,line,column,colOffset){return typeof content === 'string'?getLastPositionForString(content,line,column,colOffset):getLastPositionForArray(content,line,column,colOffset);}function getLastPositionForString(content,line,column,colOffset){var position=[];if(!content){position = [line,column];if(colOffset)position[1] += colOffset - 1;return position;}var lastLinebreak=content.lastIndexOf('\n');var endsWithLinebreak=lastLinebreak === content.length - 1;var splitContent=content.split('\n');var linebreaksCount=splitContent.length - 1;var prevLinebreak=linebreaksCount === 0 || linebreaksCount === 1?-1:content.length - splitContent[linebreaksCount - 1].length - 2; // Line:
var offset=endsWithLinebreak?linebreaksCount - 1:linebreaksCount;position[0] = line + offset; // Column:
if(endsWithLinebreak){offset = prevLinebreak !== -1?content.length - prevLinebreak:content.length - 1;}else {offset = linebreaksCount !== 0?content.length - lastLinebreak - column - 1:content.length - 1;}position[1] = column + offset;if(!colOffset)return position;if(endsWithLinebreak){position[0]++;position[1] = colOffset;}else {position[1] += colOffset;}return position;}function getLastPositionForArray(content,line,column,colOffset){var position;if(content.length === 0){position = [line,column];}else {var c=content[content.length - 1];if(c.hasOwnProperty('end')){position = [c.end.line,c.end.column];}else {position = getLastPosition(c.content,line,column);}}if(!colOffset)return position;if(tokens[pos - 1].type !== 'Newline'){position[1] += colOffset;}else {position[0]++;position[1] = 1;}return position;}function newNode(type,content,line,column,end){if(!end)end = getLastPosition(content,line,column);return new Node({type:type,content:content,start:{line:line,column:column},end:{line:end[0],column:end[1]},syntax:'css'});} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkAny(i){var l;if(l = checkBrackets(i))tokens[i].any_child = 1;else if(l = checkParentheses(i))tokens[i].any_child = 2;else if(l = checkString(i))tokens[i].any_child = 3;else if(l = checkPercentage(i))tokens[i].any_child = 4;else if(l = checkDimension(i))tokens[i].any_child = 5;else if(l = checkNumber(i))tokens[i].any_child = 6;else if(l = checkUri(i))tokens[i].any_child = 7;else if(l = checkExpression(i))tokens[i].any_child = 8;else if(l = checkFunction(i))tokens[i].any_child = 9;else if(l = checkIdent(i))tokens[i].any_child = 10;else if(l = checkClass(i))tokens[i].any_child = 11;else if(l = checkUnary(i))tokens[i].any_child = 12;return l;} /**
 * @return {Node}
 */function getAny(){var childType=tokens[pos].any_child;if(childType === 1)return getBrackets();else if(childType === 2)return getParentheses();else if(childType === 3)return getString();else if(childType === 4)return getPercentage();else if(childType === 5)return getDimension();else if(childType === 6)return getNumber();else if(childType === 7)return getUri();else if(childType === 8)return getExpression();else if(childType === 9)return getFunction();else if(childType === 10)return getIdent();else if(childType === 11)return getClass();else if(childType === 12)return getUnary();} /**
 * Check if token is part of an @-word (e.g. `@import`, `@include`)
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkAtkeyword(i){var l; // Check that token is `@`:
if(i >= tokensLength || tokens[i++].type !== TokenType.CommercialAt)return 0;return (l = checkIdent(i))?l + 1:0;} /**
 * Get node with @-word
 * @return {Node}
 */function getAtkeyword(){var type=NodeType.AtkeywordType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];pos++;content.push(getIdent());return newNode(type,content,line,column);} /**
 * Check if token is a part of an @-rule
 * @param {Number} i Token's index number
 * @return {Number} Length of @-rule
 */function checkAtrule(i){var l;if(i >= tokensLength)return 0; // If token already has a record of being part of an @-rule,
// return the @-rule's length:
if(tokens[i].atrule_l !== undefined)return tokens[i].atrule_l; // If token is part of an @-rule, save the rule's type to token:
if(l = checkKeyframesRule(i))tokens[i].atrule_type = 4;else if(l = checkAtruler(i))tokens[i].atrule_type = 1; // @-rule with ruleset
else if(l = checkAtruleb(i))tokens[i].atrule_type = 2; // Block @-rule
else if(l = checkAtrules(i))tokens[i].atrule_type = 3; // Single-line @-rule
else return 0; // If token is part of an @-rule, save the rule's length to token:
tokens[i].atrule_l = l;return l;} /**
 * Get node with @-rule
 * @return {Node}
 */function getAtrule(){switch(tokens[pos].atrule_type){case 1:return getAtruler(); // @-rule with ruleset
case 2:return getAtruleb(); // Block @-rule
case 3:return getAtrules(); // Single-line @-rule
case 4:return getKeyframesRule();}} /**
 * Check if token is part of a block @-rule
 * @param {Number} i Token's index number
 * @return {Number} Length of the @-rule
 */function checkAtruleb(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkAtkeyword(i))i += l;else return 0;if(l = checkTsets(i))i += l;if(l = checkBlock(i))i += l;else return 0;return i - start;} /**
 * Get node with a block @-rule
 * @return {Node}
 */function getAtruleb(){var type=NodeType.AtruleType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getAtkeyword()].concat(getTsets()).concat([getBlock()]);return newNode(type,content,line,column);} /**
 * Check if token is part of an @-rule with ruleset
 * @param {Number} i Token's index number
 * @return {Number} Length of the @-rule
 */function checkAtruler(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkAtkeyword(i))i += l;else return 0;if(l = checkTsets(i))i += l;if(i < tokensLength && tokens[i].type === TokenType.LeftCurlyBracket)i++;else return 0;if(l = checkAtrulers(i))i += l;if(i < tokensLength && tokens[i].type === TokenType.RightCurlyBracket)i++;else return 0;return i - start;} /**
 * Get node with an @-rule with ruleset
 * @return {Node}
 */function getAtruler(){var type=NodeType.AtruleType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getAtkeyword()];content = content.concat(getTsets());content.push(getAtrulers());return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkAtrulers(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkSC(i))i += l;while(i < tokensLength) {if(l = checkSC(i))tokens[i].atrulers_child = 1;else if(l = checkAtrule(i))tokens[i].atrulers_child = 2;else if(l = checkRuleset(i))tokens[i].atrulers_child = 3;else break;i += l;}tokens[i].atrulers_end = 1;if(l = checkSC(i))i += l;return i - start;} /**
 * @return {Node}
 */function getAtrulers(){var type=NodeType.BlockType;var token=tokens[pos++];var line=token.ln;var column=token.col;var content=getSC();while(!tokens[pos].atrulers_end) {var childType=tokens[pos].atrulers_child;if(childType === 1)content = content.concat(getSC());else if(childType === 2)content.push(getAtrule());else if(childType === 3)content.push(getRuleset());}content = content.concat(getSC());var end=getLastPosition(content,line,column,1);pos++;return newNode(type,content,line,column,end);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkAtrules(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkAtkeyword(i))i += l;else return 0;if(l = checkTsets(i))i += l;return i - start;} /**
 * @return {Node}
 */function getAtrules(){var type=NodeType.AtruleType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getAtkeyword()].concat(getTsets());return newNode(type,content,line,column);} /**
 * Check if token is part of a block (e.g. `{...}`).
 * @param {Number} i Token's index number
 * @return {Number} Length of the block
 */function checkBlock(i){return i < tokensLength && tokens[i].type === TokenType.LeftCurlyBracket?tokens[i].right - i + 1:0;} /**
 * Get node with a block
 * @return {Node}
 */function getBlock(){var type=NodeType.BlockType;var token=tokens[pos];var line=token.ln;var column=token.col;var end=tokens[pos++].right;var content=[];while(pos < end) {if(checkBlockdecl(pos))content = content.concat(getBlockdecl());else throwError(pos);}var end_=getLastPosition(content,line,column,1);pos = end + 1;return newNode(type,content,line,column,end_);} /**
 * Check if token is part of a declaration (property-value pair)
 * @param {Number} i Token's index number
 * @return {Number} Length of the declaration
 */function checkBlockdecl(i){var l;if(i >= tokensLength)return 0;if(l = checkBlockdecl1(i))tokens[i].bd_type = 1;else if(l = checkBlockdecl2(i))tokens[i].bd_type = 2;else if(l = checkBlockdecl3(i))tokens[i].bd_type = 3;else if(l = checkBlockdecl4(i))tokens[i].bd_type = 4;else return 0;return l;} /**
 * @return {Array}
 */function getBlockdecl(){switch(tokens[pos].bd_type){case 1:return getBlockdecl1();case 2:return getBlockdecl2();case 3:return getBlockdecl3();case 4:return getBlockdecl4();}} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkBlockdecl1(i){var start=i;var l=undefined;if(l = checkSC(i))i += l;if(l = checkDeclaration(i))tokens[i].bd_kind = 1;else if(l = checkAtrule(i))tokens[i].bd_kind = 2;else return 0;i += l;if(l = checkSC(i))i += l;if(i < tokensLength && (l = checkDeclDelim(i)))i += l;else return 0;if(l = checkSC(i))i += l;else return 0;return i - start;} /**
 * @return {Array}
 */function getBlockdecl1(){var sc=getSC();var x=undefined;switch(tokens[pos].bd_kind){case 1:x = getDeclaration();break;case 2:x = getAtrule();break;}return sc.concat([x]).concat(getSC()).concat([getDeclDelim()]).concat(getSC());} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkBlockdecl2(i){var start=i;var l=undefined;if(l = checkSC(i))i += l;if(l = checkDeclaration(i))tokens[i].bd_kind = 1;else if(l = checkAtrule(i))tokens[i].bd_kind = 2;else return 0;i += l;if(l = checkSC(i))i += l;return i - start;} /**
 * @return {Array}
 */function getBlockdecl2(){var sc=getSC();var x=undefined;switch(tokens[pos].bd_kind){case 1:x = getDeclaration();break;case 2:x = getAtrule();break;}return sc.concat([x]).concat(getSC());} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkBlockdecl3(i){var start=i;var l=undefined;if(l = checkSC(i))i += l;if(l = checkDeclDelim(i))i += l;else return 0;if(l = checkSC(i))i += l;return i - start;} /**
 * @return {Array}
 */function getBlockdecl3(){return getSC().concat([getDeclDelim()]).concat(getSC());} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkBlockdecl4(i){return checkSC(i);} /**
 * @return {Array}
 */function getBlockdecl4(){return getSC();} /**
 * Check if token is part of text inside square brackets, e.g. `[1]`
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkBrackets(i){if(i >= tokensLength || tokens[i].type !== TokenType.LeftSquareBracket)return 0;return tokens[i].right - i + 1;} /**
 * Get node with text inside square brackets, e.g. `[1]`
 * @return {Node}
 */function getBrackets(){var type=NodeType.BracketsType;var token=tokens[pos];var line=token.ln;var column=token.col;pos++;var tsets=getTsets();var end=getLastPosition(tsets,line,column,1);pos++;return newNode(type,tsets,line,column,end);} /**
 * Check if token is part of a class selector (e.g. `.abc`)
 * @param {Number} i Token's index number
 * @return {Number} Length of the class selector
 */function checkClass(i){var l;if(i >= tokensLength)return 0;if(tokens[i].class_l)return tokens[i].class_l;if(tokens[i++].type === TokenType.FullStop && (l = checkIdent(i))){tokens[i].class_l = l + 1;return l + 1;}return 0;} /**
 * Get node with a class selector
 * @return {Node}
 */function getClass(){var type=NodeType.ClassType;var token=tokens[pos++];var line=token.ln;var column=token.col;var content=[getIdent()];return newNode(type,content,line,column);}function checkCombinator(i){if(i >= tokensLength)return 0;var l=undefined;if(l = checkCombinator1(i))tokens[i].combinatorType = 1;else if(l = checkCombinator2(i))tokens[i].combinatorType = 2;else if(l = checkCombinator3(i))tokens[i].combinatorType = 3;return l;}function getCombinator(){var type=tokens[pos].combinatorType;if(type === 1)return getCombinator1();if(type === 2)return getCombinator2();if(type === 3)return getCombinator3();} /**
 * (1) `||`
 */function checkCombinator1(i){if(tokens[i].type === TokenType.VerticalLine && tokens[i + 1].type === TokenType.VerticalLine)return 2;else return 0;}function getCombinator1(){var type=NodeType.CombinatorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content='||';pos += 2;return newNode(type,content,line,column);} /**
 * (1) `>`
 * (2) `+`
 * (3) `~`
 */function checkCombinator2(i){var type=tokens[i].type;if(type === TokenType.PlusSign || type === TokenType.GreaterThanSign || type === TokenType.Tilde)return 1;else return 0;}function getCombinator2(){var type=NodeType.CombinatorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=tokens[pos++].value;return newNode(type,content,line,column);} /**
 * (1) `/panda/`
 */function checkCombinator3(i){var start=i;if(tokens[i].type === TokenType.Solidus)i++;else return 0;var l=undefined;if(l = checkIdent(i))i += l;else return 0;if(tokens[i].type === TokenType.Solidus)i++;else return 0;return i - start;}function getCombinator3(){var type=NodeType.CombinatorType;var token=tokens[pos];var line=token.ln;var column=token.col; // Skip `/`.
pos++;var ident=getIdent(); // Skip `/`.
pos++;var content='/' + ident.content + '/';return newNode(type,content,line,column);} /**
 * Check if token is a multiline comment.
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is a multiline comment, otherwise `0`
 */function checkCommentML(i){return i < tokensLength && tokens[i].type === TokenType.CommentML?1:0;} /**
 * Get node with a multiline comment
 * @return {Node}
 */function getCommentML(){var type=NodeType.CommentMLType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=tokens[pos].value.substring(2);var l=content.length;if(content.charAt(l - 2) === '*' && content.charAt(l - 1) === '/')content = content.substring(0,l - 2);var end=getLastPosition(content,line,column,2);if(end[0] === line)end[1] += 2;pos++;return newNode(type,content,line,column,end);} /**
 * Check if token is part of a declaration (property-value pair)
 * @param {Number} i Token's index number
 * @return {Number} Length of the declaration
 */function checkDeclaration(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkProperty(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkPropertyDelim(i))i++;else return 0;if(l = checkSC(i))i += l;if(l = checkValue(i))i += l;else return 0;return i - start;} /**
 * Get node with a declaration
 * @return {Node}
 */function getDeclaration(){var type=NodeType.DeclarationType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getProperty()].concat(getSC()).concat([getPropertyDelim()]).concat(getSC()).concat([getValue()]);return newNode(type,content,line,column);} /**
 * Check if token is a semicolon
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is a semicolon, otherwise `0`
 */function checkDeclDelim(i){return i < tokensLength && tokens[i].type === TokenType.Semicolon?1:0;} /**
 * Get node with a semicolon
 * @return {Node}
 */function getDeclDelim(){var type=NodeType.DeclDelimType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=';';pos++;return newNode(type,content,line,column);} /**
 * Check if token is a comma
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is a comma, otherwise `0`
 */function checkDelim(i){return i < tokensLength && tokens[i].type === TokenType.Comma?1:0;} /**
 * Get node with a comma
 * @return {Node}
 */function getDelim(){var type=NodeType.DelimType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=',';pos++;return newNode(type,content,line,column);} /**
 * Check if token is part of a number with dimension unit (e.g. `10px`)
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkDimension(i){var ln=checkNumber(i);var li=undefined;if(i >= tokensLength || !ln || i + ln >= tokensLength)return 0;return (li = checkNmName2(i + ln))?ln + li:0;} /**
 * Get node of a number with dimension unit
 * @return {Node}
 */function getDimension(){var type=NodeType.DimensionType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getNumber()];token = tokens[pos];var ident=newNode(NodeType.IdentType,getNmName2(),token.ln,token.col);content.push(ident);return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkExpression(i){var start=i;if(i >= tokensLength || tokens[i++].value !== 'expression' || i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)return 0;return tokens[i].right - start + 1;} /**
 * @return {Node}
 */function getExpression(){var type=NodeType.ExpressionType;var token=tokens[pos];var line=token.ln;var column=token.col;pos++;var content=joinValues(pos + 1,tokens[pos].right - 1);var end=getLastPosition(content,line,column,1);if(end[0] === line)end[1] += 11;pos = tokens[pos].right + 1;return newNode(type,content,line,column,end);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkFunction(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;return i < tokensLength && tokens[i].type === TokenType.LeftParenthesis?tokens[i].right - start + 1:0;} /**
 * @return {Node}
 */function getFunction(){var type=NodeType.FunctionType;var token=tokens[pos];var line=token.ln;var column=token.col;var ident=getIdent();var content=[ident];content.push(getArguments());return newNode(type,content,line,column);} /**
 * @return {Node}
 */function getArguments(){var type=NodeType.ArgumentsType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];var body=undefined;pos++;while(pos < tokensLength && tokens[pos].type !== TokenType.RightParenthesis) {if(checkDeclaration(pos))content.push(getDeclaration());else if(checkArgument(pos)){body = getArgument();if(typeof body.content === 'string')content.push(body);else content = content.concat(body);}else if(checkClass(pos))content.push(getClass());else throwError(pos);}var end=getLastPosition(content,line,column,1);pos++;return newNode(type,content,line,column,end);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkArgument(i){var l;if(l = checkVhash(i))tokens[i].argument_child = 1;else if(l = checkAny(i))tokens[i].argument_child = 2;else if(l = checkSC(i))tokens[i].argument_child = 3;else if(l = checkOperator(i))tokens[i].argument_child = 4;return l;} /**
 * @return {Node}
 */function getArgument(){var childType=tokens[pos].argument_child;if(childType === 1)return getVhash();else if(childType === 2)return getAny();else if(childType === 3)return getSC();else if(childType === 4)return getOperator();} /**
 * Check if token is part of an identifier
 * @param {Number} i Token's index number
 * @return {Number} Length of the identifier
 */function checkIdent(i){var start=i;var wasIdent=undefined;if(i >= tokensLength)return 0; // Check if token is part of an identifier starting with `_`:
if(tokens[i].type === TokenType.LowLine)return checkIdentLowLine(i); // If token is a character, `-`, `$` or `*`, skip it & continue:
if(tokens[i].type === TokenType.HyphenMinus || tokens[i].type === TokenType.Identifier || tokens[i].type === TokenType.DollarSign || tokens[i].type === TokenType.Asterisk)i++;else return 0; // Remember if previous token's type was identifier:
wasIdent = tokens[i - 1].type === TokenType.Identifier;for(;i < tokensLength;i++) {if(i >= tokensLength)break;if(tokens[i].type !== TokenType.HyphenMinus && tokens[i].type !== TokenType.LowLine){if(tokens[i].type !== TokenType.Identifier && (tokens[i].type !== TokenType.DecimalNumber || !wasIdent))break;else wasIdent = true;}}if(!wasIdent && tokens[start].type !== TokenType.Asterisk)return 0;tokens[start].ident_last = i - 1;return i - start;} /**
 * Check if token is part of an identifier starting with `_`
 * @param {Number} i Token's index number
 * @return {Number} Length of the identifier
 */function checkIdentLowLine(i){var start=i;if(i++ >= tokensLength)return 0;for(;i < tokensLength;i++) {if(tokens[i].type !== TokenType.HyphenMinus && tokens[i].type !== TokenType.DecimalNumber && tokens[i].type !== TokenType.LowLine && tokens[i].type !== TokenType.Identifier)break;} // Save index number of the last token of the identifier:
tokens[start].ident_last = i - 1;return i - start;} /**
 * Get node with an identifier
 * @return {Node}
 */function getIdent(){var type=NodeType.IdentType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=joinValues(pos,tokens[pos].ident_last);pos = tokens[pos].ident_last + 1;return newNode(type,content,line,column);} /**
 * Check if token is part of `!important` word
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkImportant(i){var start=i;var l=undefined;if(i >= tokensLength || tokens[i++].type !== TokenType.ExclamationMark)return 0;if(l = checkSC(i))i += l;if(tokens[i].value === 'important'){tokens[start].importantEnd = i;return i - start + 1;}else {return 0;}} /**
 * Get node with `!important` word
 * @return {Node}
 */function getImportant(){var type=NodeType.ImportantType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=joinValues(pos,token.importantEnd);pos = token.importantEnd + 1;return newNode(type,content,line,column);}function checkKeyframesBlock(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkKeyframesSelector(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkBlock(i))i += l;else return 0;return i - start;}function getKeyframesBlock(){var type=NodeType.RulesetType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[].concat([getKeyframesSelector()],getSC(),[getBlock()]);return newNode(type,content,line,column);}function checkKeyframesBlocks(i){var start=i;var l=undefined;if(i < tokensLength && tokens[i].type === TokenType.LeftCurlyBracket)i++;else return 0;if(l = checkSC(i))i += l;if(l = checkKeyframesBlock(i))i += l;else return 0;while(tokens[i].type !== TokenType.RightCurlyBracket) {if(l = checkSC(i))i += l;else if(l = checkKeyframesBlock(i))i += l;else break;}if(i < tokensLength && tokens[i].type === TokenType.RightCurlyBracket)i++;else return 0;return i - start;}function getKeyframesBlocks(){var type=NodeType.BlockType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];var keyframesBlocksEnd=token.right; // Skip `{`.
pos++;while(pos < keyframesBlocksEnd) {if(checkSC(pos))content = content.concat(getSC());else if(checkKeyframesBlock(pos))content.push(getKeyframesBlock());}var end=getLastPosition(content,line,column,1); // Skip `}`.
pos++;return newNode(type,content,line,column,end);} /**
 * Check if token is part of a @keyframes rule.
 * @param {Number} i Token's index number
 * @return {Number} Length of the @keyframes rule
 */function checkKeyframesRule(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkAtkeyword(i))i += l;else return 0;var atruleName=joinValues2(i - l,l);if(atruleName.indexOf('keyframes') === -1)return 0;if(l = checkSC(i))i += l;else return 0;if(l = checkIdent(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkKeyframesBlocks(i))i += l;else return 0;return i - start;} /**
 * @return {Node}
 */function getKeyframesRule(){var type=NodeType.AtruleType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[].concat([getAtkeyword()],getSC(),[getIdent()],getSC(),[getKeyframesBlocks()]);return newNode(type,content,line,column);}function checkKeyframesSelector(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkIdent(i)){ // Valid selectors are only `from` and `to`.
var selector=joinValues2(i,l);if(selector !== 'from' && selector !== 'to')return 0;i += l;tokens[start].keyframesSelectorType = 1;}else if(l = checkPercentage(i)){i += l;tokens[start].keyframesSelectorType = 2;}else {return 0;}return i - start;}function getKeyframesSelector(){var keyframesSelectorType=NodeType.KeyframesSelectorType;var selectorType=NodeType.SelectorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];if(token.keyframesSelectorType === 1){content.push(getIdent());}else {content.push(getPercentage());}var keyframesSelector=newNode(keyframesSelectorType,content,line,column);return newNode(selectorType,[keyframesSelector],line,column);} /**
 * Check if token is a namespace sign (`|`)
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is `|`, `0` if not
 */function checkNamespace(i){return i < tokensLength && tokens[i].type === TokenType.VerticalLine?1:0;} /**
 * Get node with a namespace sign
 * @return {Node}
 */function getNamespace(){var type=NodeType.NamespaceType;var token=tokens[pos++];var line=token.ln;var column=token.col;var content='|';return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkNmName2(i){if(tokens[i].type === TokenType.Identifier)return 1;else if(tokens[i].type !== TokenType.DecimalNumber)return 0;i++;return i < tokensLength && tokens[i].type === TokenType.Identifier?2:1;} /**
 * @return {String}
 */function getNmName2(){var s=tokens[pos].value;if(tokens[pos++].type === TokenType.DecimalNumber && pos < tokensLength && tokens[pos].type === TokenType.Identifier)s += tokens[pos++].value;return s;} /**
 * Check if token is part of a number
 * @param {Number} i Token's index number
 * @return {Number} Length of number
 */function checkNumber(i){if(i >= tokensLength)return 0;if(tokens[i].number_l)return tokens[i].number_l; // `10`:
if(i < tokensLength && tokens[i].type === TokenType.DecimalNumber && (!tokens[i + 1] || tokens[i + 1] && tokens[i + 1].type !== TokenType.FullStop))return tokens[i].number_l = 1,tokens[i].number_l; // `10.`:
if(i < tokensLength && tokens[i].type === TokenType.DecimalNumber && tokens[i + 1] && tokens[i + 1].type === TokenType.FullStop && (!tokens[i + 2] || tokens[i + 2].type !== TokenType.DecimalNumber))return tokens[i].number_l = 2,tokens[i].number_l; // `.10`:
if(i < tokensLength && tokens[i].type === TokenType.FullStop && tokens[i + 1].type === TokenType.DecimalNumber)return tokens[i].number_l = 2,tokens[i].number_l; // `10.10`:
if(i < tokensLength && tokens[i].type === TokenType.DecimalNumber && tokens[i + 1] && tokens[i + 1].type === TokenType.FullStop && tokens[i + 2] && tokens[i + 2].type === TokenType.DecimalNumber)return tokens[i].number_l = 3,tokens[i].number_l;return 0;} /**
 * Get node with number
 * @return {Node}
 */function getNumber(){var type=NodeType.NumberType;var token=tokens[pos];var line=token.ln;var column=token.col;var content='';var l=tokens[pos].number_l;for(var j=0;j < l;j++) {content += tokens[pos + j].value;}pos += l;return newNode(type,content,line,column);} /**
 * Check if token is an operator (`/`, `,`, `:` or `=`).
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is an operator, otherwise `0`
 */function checkOperator(i){if(i >= tokensLength)return 0;switch(tokens[i].type){case TokenType.Solidus:case TokenType.Comma:case TokenType.Colon:case TokenType.EqualsSign:return 1;}return 0;} /**
 * Get node with an operator
 * @return {Node}
 */function getOperator(){var type=NodeType.OperatorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=token.value;pos++;return newNode(type,content,line,column);} /**
 * Check if token is part of text inside parentheses, e.g. `(1)`
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkParentheses(i){if(i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)return 0;return tokens[i].right - i + 1;} /**
 * Get node with text inside parentheses, e.g. `(1)`
 * @return {Node}
 */function getParentheses(){var type=NodeType.ParenthesesType;var token=tokens[pos];var line=token.ln;var column=token.col;pos++;var tsets=getTsets();var end=getLastPosition(tsets,line,column,1);pos++;return newNode(type,tsets,line,column,end);} /**
 * Check if token is part of a number with percent sign (e.g. `10%`)
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkPercentage(i){var x;if(i >= tokensLength)return 0;x = checkNumber(i);if(!x || i + x >= tokensLength)return 0;return tokens[i + x].type === TokenType.PercentSign?x + 1:0;} /**
 * Get node of number with percent sign
 * @return {Node}
 */function getPercentage(){var type=NodeType.PercentageType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getNumber()];var end=getLastPosition(content,line,column,1);pos++;return newNode(type,content,line,column,end);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkProgid(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(joinValues2(i,6) === 'progid:DXImageTransform.Microsoft.')i += 6;else return 0;if(l = checkIdent(i))i += l;else return 0;if(l = checkSC(i))i += l;if(tokens[i].type === TokenType.LeftParenthesis){tokens[start].progid_end = tokens[i].right;i = tokens[i].right + 1;}else return 0;return i - start;} /**
 * @return {Node}
 */function getProgid(){var type=NodeType.ProgidType;var token=tokens[pos];var line=token.ln;var column=token.col;var progid_end=token.progid_end;var content=joinValues(pos,progid_end);pos = progid_end + 1;return newNode(type,content,line,column);} /**
 * Check if token is part of a property
 * @param {Number} i Token's index number
 * @return {Number} Length of the property
 */function checkProperty(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;return i - start;} /**
 * Get node with a property
 * @return {Node}
 */function getProperty(){var type=NodeType.PropertyType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getIdent()];return newNode(type,content,line,column);} /**
 * Check if token is a colon
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is a colon, otherwise `0`
 */function checkPropertyDelim(i){return i < tokensLength && tokens[i].type === TokenType.Colon?1:0;} /**
 * Get node with a colon
 * @return {Node}
 */function getPropertyDelim(){var type=NodeType.PropertyDelimType;var token=tokens[pos++];var line=token.ln;var column=token.col;var content=':';return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkPseudo(i){return checkPseudoe(i) || checkPseudoc(i);} /**
 * @return {Node}
 */function getPseudo(){if(checkPseudoe(pos))return getPseudoe();if(checkPseudoc(pos))return getPseudoc();} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkPseudoe(i){var l;if(i >= tokensLength || tokens[i++].type !== TokenType.Colon || i >= tokensLength || tokens[i++].type !== TokenType.Colon)return 0;return (l = checkIdent(i))?l + 2:0;} /**
 * @return {Node}
 */function getPseudoe(){var type=NodeType.PseudoeType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];pos += 2;content.push(getIdent());return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkPseudoc(i){var l;if(i >= tokensLength || tokens[i].type !== TokenType.Colon)return 0;if(l = checkPseudoClass1(i))tokens[i].pseudoClassType = 1;else if(l = checkPseudoClass2(i))tokens[i].pseudoClassType = 2;else if(l = checkPseudoClass3(i))tokens[i].pseudoClassType = 3;else if(l = checkPseudoClass4(i))tokens[i].pseudoClassType = 4;else if(l = checkPseudoClass5(i))tokens[i].pseudoClassType = 5;else if(l = checkPseudoClass6(i))tokens[i].pseudoClassType = 6;else return 0;return l;} /**
 * @return {Node}
 */function getPseudoc(){var childType=tokens[pos].pseudoClassType;if(childType === 1)return getPseudoClass1();if(childType === 2)return getPseudoClass2();if(childType === 3)return getPseudoClass3();if(childType === 4)return getPseudoClass4();if(childType === 5)return getPseudoClass5();if(childType === 6)return getPseudoClass6();} /**
 * (1) `:panda(selector)`
 * (2) `:panda(selector, selector)`
 */function checkPseudoClass1(i){var start=i; // Skip `:`.
i++;var l=undefined;if(l = checkIdent(i))i += l;else return 0;if(i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)return 0;var right=tokens[i].right; // Skip `(`.
i++;if(l = checkSelectorsGroup(i))i += l;else return 0;if(i !== right)return 0;return i - start + 1;} /**
 * (-) `:not(panda)`
 */function getPseudoClass1(){var type=NodeType.PseudocType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `:`.
pos++;content.push(getIdent());{var _type=NodeType.ArgumentsType;var _token=tokens[pos];var _line=_token.ln;var _column=_token.col; // Skip `(`.
pos++;var selectors=getSelectorsGroup();var end=getLastPosition(selectors,_line,_column,1);var args=newNode(_type,selectors,_line,_column,end);content.push(args); // Skip `)`.
pos++;}return newNode(type,content,line,column);} /**
 * (1) `:nth-child(odd)`
 * (2) `:nth-child(even)`
 * (3) `:lang(de-DE)`
 */function checkPseudoClass2(i){var start=i;var l=0; // Skip `:`.
i++;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;if(i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)return 0;var right=tokens[i].right; // Skip `(`.
i++;if(l = checkSC(i))i += l;if(l = checkIdent(i))i += l;else return 0;if(l = checkSC(i))i += l;if(i !== right)return 0;return i - start + 1;}function getPseudoClass2(){var type=NodeType.PseudocType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `:`.
pos++;var ident=getIdent();content.push(ident); // Skip `(`.
pos++;var l=tokens[pos].ln;var c=tokens[pos].col;var value=[];value = value.concat(getSC());value.push(getIdent());value = value.concat(getSC());var end=getLastPosition(value,l,c,1);var args=newNode(NodeType.ArgumentsType,value,l,c,end);content.push(args); // Skip `)`.
pos++;return newNode(type,content,line,column);} /**
 * (-) `:nth-child(-3n + 2)`
 */function checkPseudoClass3(i){var start=i;var l=0; // Skip `:`.
i++;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;if(i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)return 0;var right=tokens[i].right; // Skip `(`.
i++;if(l = checkSC(i))i += l;if(l = checkUnary(i))i += l;if(i >= tokensLength)return 0;if(tokens[i].type === TokenType.DecimalNumber)i++;if(i >= tokensLength)return 0;if(tokens[i].value === 'n')i++;else return 0;if(l = checkSC(i))i += l;if(i >= tokensLength)return 0;if(tokens[i].value === '+' || tokens[i].value === '-')i++;else return 0;if(l = checkSC(i))i += l;if(tokens[i].type === TokenType.DecimalNumber)i++;else return 0;if(l = checkSC(i))i += l;if(i !== right)return 0;return i - start + 1;}function getPseudoClass3(){var type=NodeType.PseudocType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `:`.
pos++;var ident=getIdent();content.push(ident);var l=tokens[pos].ln;var c=tokens[pos].col;var value=[]; // Skip `(`.
pos++;if(checkUnary(pos))value.push(getUnary());if(checkNumber(pos))value.push(getNumber());{var _l=tokens[pos].ln;var _c=tokens[pos].col;var _content=tokens[pos].value;var _ident=newNode(NodeType.IdentType,_content,_l,_c);value.push(_ident);pos++;}value = value.concat(getSC());if(checkUnary(pos))value.push(getUnary());value = value.concat(getSC());if(checkNumber(pos))value.push(getNumber());value = value.concat(getSC());var end=getLastPosition(value,l,c,1);var args=newNode(NodeType.ArgumentsType,value,l,c,end);content.push(args); // Skip `)`.
pos++;return newNode(type,content,line,column);} /**
 * (-) `:nth-child(-3n)`
 */function checkPseudoClass4(i){var start=i;var l=0; // Skip `:`.
i++;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;if(i >= tokensLength)return 0;if(tokens[i].type !== TokenType.LeftParenthesis)return 0;var right=tokens[i].right; // Skip `(`.
i++;if(l = checkSC(i))i += l;if(l = checkUnary(i))i += l;if(tokens[i].type === TokenType.DecimalNumber)i++;if(tokens[i].value === 'n')i++;else return 0;if(l = checkSC(i))i += l;if(i !== right)return 0;return i - start + 1;}function getPseudoClass4(){var type=NodeType.PseudocType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `:`.
pos++;var ident=getIdent();content.push(ident); // Skip `(`.
pos++;var l=tokens[pos].ln;var c=tokens[pos].col;var value=[];if(checkUnary(pos))value.push(getUnary());if(checkNumber(pos))value.push(getNumber());if(checkIdent(pos))value.push(getIdent());value = value.concat(getSC());var end=getLastPosition(value,l,c,1);var args=newNode(NodeType.ArgumentsType,value,l,c,end);content.push(args); // Skip `)`.
pos++;return newNode(type,content,line,column);} /**
 * (-) `:nth-child(+8)`
 */function checkPseudoClass5(i){var start=i;var l=0; // Skip `:`.
i++;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;if(i >= tokensLength)return 0;if(tokens[i].type !== TokenType.LeftParenthesis)return 0;var right=tokens[i].right; // Skip `(`.
i++;if(l = checkSC(i))i += l;if(l = checkUnary(i))i += l;if(tokens[i].type === TokenType.DecimalNumber)i++;else return 0;if(l = checkSC(i))i += l;if(i !== right)return 0;return i - start + 1;}function getPseudoClass5(){var type=NodeType.PseudocType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `:`.
pos++;var ident=getIdent();content.push(ident); // Skip `(`.
pos++;var l=tokens[pos].ln;var c=tokens[pos].col;var value=[];if(checkUnary(pos))value.push(getUnary());if(checkNumber(pos))value.push(getNumber());value = value.concat(getSC());var end=getLastPosition(value,l,c,1);var args=newNode(NodeType.ArgumentsType,value,l,c,end);content.push(args); // Skip `)`.
pos++;return newNode(type,content,line,column);} /**
 * (-) `:checked`
 */function checkPseudoClass6(i){var start=i;var l=0; // Skip `:`.
i++;if(i >= tokensLength)return 0;if(l = checkIdent(i))i += l;else return 0;return i - start;}function getPseudoClass6(){var type=NodeType.PseudocType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `:`.
pos++;var ident=getIdent();content.push(ident);return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkRuleset(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkSelectorsGroup(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkBlock(i))i += l;else return 0;return i - start;} /**
 * @return {Node}
 */function getRuleset(){var type=NodeType.RulesetType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];content = content.concat(getSelectorsGroup());content = content.concat(getSC());content.push(getBlock());return newNode(type,content,line,column);} /**
 * Check if token is marked as a space (if it's a space or a tab
 *      or a line break).
 * @param {Number} i
 * @return {Number} Number of spaces in a row starting with the given token.
 */function checkS(i){return i < tokensLength && tokens[i].ws?tokens[i].ws_last - i + 1:0;} /**
 * Get node with spaces
 * @return {Node}
 */function getS(){var type=NodeType.SType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=joinValues(pos,tokens[pos].ws_last);pos = tokens[pos].ws_last + 1;return newNode(type,content,line,column);} /**
 * Check if token is a space or a comment.
 * @param {Number} i Token's index number
 * @return {Number} Number of similar (space or comment) tokens
 *      in a row starting with the given token.
 */function checkSC(i){var l=undefined;var lsc=0;while(i < tokensLength) {if(l = checkS(i))tokens[i].sc_child = 1;else if(l = checkCommentML(i))tokens[i].sc_child = 2;else break;i += l;lsc += l;}return lsc || 0;} /**
 * Get node with spaces and comments
 * @return {Array}
 */function getSC(){var sc=[];if(pos >= tokensLength)return sc;while(pos < tokensLength) {var childType=tokens[pos].sc_child;if(childType === 1)sc.push(getS());else if(childType === 2)sc.push(getCommentML());else break;}return sc;} /**
 * Check if token is part of a hexadecimal number (e.g. `#fff`) inside
 *      a simple selector
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkShash(i){var l;if(i >= tokensLength || tokens[i].type !== TokenType.NumberSign)return 0;return (l = checkIdent(i + 1))?l + 1:0;} /**
 * Get node with a hexadecimal number (e.g. `#fff`) inside a simple
 *      selector
 * @return {Node}
 */function getShash(){var type=NodeType.ShashType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];pos++;var ident=getIdent();content.push(ident);return newNode(type,content,line,column);} /**
 * Check if token is part of a string (text wrapped in quotes)
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is part of a string, `0` if not
 */function checkString(i){return i < tokensLength && (tokens[i].type === TokenType.StringSQ || tokens[i].type === TokenType.StringDQ)?1:0;} /**
 * Get string's node
 * @return {Array} `['string', x]` where `x` is a string (including
 *      quotes).
 */function getString(){var type=NodeType.StringType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=token.value;pos++;return newNode(type,content,line,column);} /**
 * Validate stylesheet: it should consist of any number (0 or more) of
 * rulesets (sets of rules with selectors), @-rules, whitespaces or
 * comments.
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkStylesheet(i){var start=i;var l=undefined; // Check every token:
while(i < tokensLength) {if(l = checkSC(i))tokens[i].stylesheet_child = 1;else if(l = checkRuleset(i))tokens[i].stylesheet_child = 2;else if(l = checkAtrule(i))tokens[i].stylesheet_child = 3;else if(l = checkDeclDelim(i))tokens[i].stylesheet_child = 4;else throwError(i);i += l;}return i - start;} /**
 * @return {Array} `['stylesheet', x]` where `x` is all stylesheet's
 *      nodes.
 */function getStylesheet(){var type=NodeType.StylesheetType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];var childType=undefined;while(pos < tokensLength) {childType = tokens[pos].stylesheet_child;if(childType === 1)content = content.concat(getSC());else if(childType === 2)content.push(getRuleset());else if(childType === 3)content.push(getAtrule());else if(childType === 4)content.push(getDeclDelim());}return newNode(type,content,line,column);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkTset(i){var l;if(l = checkVhash(i))tokens[i].tset_child = 1;else if(l = checkAny(i))tokens[i].tset_child = 2;else if(l = checkSC(i))tokens[i].tset_child = 3;else if(l = checkOperator(i))tokens[i].tset_child = 4;return l;} /**
 * @return {Array}
 */function getTset(){var childType=tokens[pos].tset_child;if(childType === 1)return getVhash();else if(childType === 2)return getAny();else if(childType === 3)return getSC();else if(childType === 4)return getOperator();} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkTsets(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;while(l = checkTset(i)) {i += l;}return i - start;} /**
 * @return {Array}
 */function getTsets(){var x=[];var t=undefined;while(checkTset(pos)) {t = getTset();if(typeof t.content === 'string')x.push(t);else x = x.concat(t);}return x;} /**
 * Check if token is an unary (arithmetical) sign (`+` or `-`)
 * @param {Number} i Token's index number
 * @return {Number} `1` if token is an unary sign, `0` if not
 */function checkUnary(i){return i < tokensLength && (tokens[i].type === TokenType.HyphenMinus || tokens[i].type === TokenType.PlusSign)?1:0;} /**
 * Get node with an unary (arithmetical) sign (`+` or `-`)
 * @return {Array} `['unary', x]` where `x` is an unary sign
 *      converted to string.
 */function getUnary(){var type=NodeType.OperatorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=token.value;pos++;return newNode(type,content,line,column);} /**
 * Check if token is part of URI (e.g. `url('/css/styles.css')`)
 * @param {Number} i Token's index number
 * @return {Number} Length of URI
 */function checkUri(i){var start=i;if(i >= tokensLength || tokens[i].value !== 'url')return 0;i += 1;if(i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)return 0;return tokens[i].right - start + 1;} /**
 * Get node with URI
 * @return {Array} `['uri', x]` where `x` is URI's nodes (without `url`
 *      and braces, e.g. `['string', ''/css/styles.css'']`).
 */function getUri(){var startPos=pos;var uriExcluding={};var uri=undefined;var l=undefined;var raw=undefined;var rawContent=undefined;var t=undefined;pos += 2;uriExcluding[TokenType.Space] = 1;uriExcluding[TokenType.Tab] = 1;uriExcluding[TokenType.Newline] = 1;uriExcluding[TokenType.LeftParenthesis] = 1;uriExcluding[TokenType.RightParenthesis] = 1;if(checkUri1(pos)){uri = [].concat(getSC()).concat([getString()]).concat(getSC());}else {uri = checkSC(pos)?getSC():[];l = checkExcluding(uriExcluding,pos);rawContent = joinValues(pos,pos + l);t = tokens[pos];raw = newNode(NodeType.RawType,rawContent,t.ln,t.col);uri.push(raw);pos += l + 1;if(checkSC(pos))uri = uri.concat(getSC());}t = tokens[startPos];var line=t.ln;var column=t.col;var end=getLastPosition(uri,line,column,1);pos++;return newNode(NodeType.UriType,uri,line,column,end);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkUri1(i){var start=i;var l=undefined;if(i >= tokensLength)return 0;if(l = checkSC(i))i += l;if(tokens[i].type !== TokenType.StringDQ && tokens[i].type !== TokenType.StringSQ)return 0;i++;if(l = checkSC(i))i += l;return i - start;} /**
 * Check if token is part of a value
 * @param {Number} i Token's index number
 * @return {Number} Length of the value
 */function checkValue(i){var start=i;var l=undefined;var s=undefined;var _i=undefined;while(i < tokensLength) {s = checkSC(i);_i = i + s;if(l = _checkValue(_i))i += l + s;else break;}tokens[start].value_end = i;return i - start;} /**
 * @return {Array}
 */function getValue(){var startPos=pos;var end=tokens[pos].value_end;var x=[];while(pos < end) {if(tokens[pos].value_child)x.push(_getValue());else x = x.concat(getSC());}var t=tokens[startPos];return newNode(NodeType.ValueType,x,t.ln,t.col);} /**
 * @param {Number} i Token's index number
 * @return {Number}
 */function _checkValue(i){var l;if(l = checkProgid(i))tokens[i].value_child = 1;else if(l = checkVhash(i))tokens[i].value_child = 2;else if(l = checkAny(i))tokens[i].value_child = 3;else if(l = checkOperator(i))tokens[i].value_child = 4;else if(l = checkImportant(i))tokens[i].value_child = 5;return l;} /**
 * @return {Array}
 */function _getValue(){var childType=tokens[pos].value_child;if(childType === 1)return getProgid();else if(childType === 2)return getVhash();else if(childType === 3)return getAny();else if(childType === 4)return getOperator();else if(childType === 5)return getImportant();} /**
 * Check if token is part of a hexadecimal number (e.g. `#fff`) inside
 *      some value
 * @param {Number} i Token's index number
 * @return {Number}
 */function checkVhash(i){var l;if(i >= tokensLength || tokens[i].type !== TokenType.NumberSign)return 0;return (l = checkNmName2(i + 1))?l + 1:0;} /**
 * Get node with a hexadecimal number (e.g. `#fff`) inside some value
 * @return {Array} `['vhash', x]` where `x` is a hexadecimal number
 *      converted to string (without `#`, e.g. `'fff'`).
 */function getVhash(){var type=NodeType.VhashType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=undefined;pos++;content = getNmName2();var end=getLastPosition(content,line,column + 1);return newNode(type,content,line,column,end);}module.exports = function(_tokens,context){tokens = _tokens;tokensLength = tokens.length;pos = 0;return contexts[context]();};function checkSelectorsGroup(i){if(i >= tokensLength)return 0;var start=i;var l=undefined;if(l = checkSelector(i))i += l;else return 0;while(i < tokensLength) {var sb=checkSC(i);var c=checkDelim(i + sb);if(!c)break;var sa=checkSC(i + sb + c);if(l = checkSelector(i + sb + c + sa))i += sb + c + sa + l;else break;}tokens[start].selectorsGroupEnd = i;return i - start;}function getSelectorsGroup(){var selectorsGroup=[];var selectorsGroupEnd=tokens[pos].selectorsGroupEnd;selectorsGroup.push(getSelector());while(pos < selectorsGroupEnd) {selectorsGroup = selectorsGroup.concat(getSC());selectorsGroup.push(getDelim());selectorsGroup = selectorsGroup.concat(getSC());selectorsGroup.push(getSelector());}return selectorsGroup;}function checkSelector(i){if(i >= tokensLength)return 0;var start=i;var l=undefined;if(l = checkCompoundSelector(i))i += l;else return 0;while(i < tokensLength) {var sb=checkSC(i);var c=checkCombinator(i + sb);if(!sb && !c)break;var sa=checkSC(i + sb + c);if(l = checkCompoundSelector(i + sb + c + sa))i += sb + c + sa + l;else break;}tokens[start].selectorEnd = i;return i - start;}function getSelector(){var type=NodeType.SelectorType;var token=tokens[pos];var line=token.ln;var column=token.col;var selectorEnd=token.selectorEnd;var content=undefined;content = getCompoundSelector();while(pos < selectorEnd) {content = content.concat(getSC());if(checkCombinator(pos))content.push(getCombinator());content = content.concat(getSC());content = content.concat(getCompoundSelector());}return newNode(type,content,line,column);}function checkCompoundSelector(i){var l=undefined;if(l = checkCompoundSelector1(i)){tokens[i].compoundSelectorType = 1;}else if(l = checkCompoundSelector2(i)){tokens[i].compoundSelectorType = 2;}return l;}function getCompoundSelector(){var type=tokens[pos].compoundSelectorType;if(type === 1)return getCompoundSelector1();if(type === 2)return getCompoundSelector2();}function checkCompoundSelector1(i){if(i >= tokensLength)return 0;var start=i;var l=undefined;if(l = checkTypeSelector(i))i += l;else return 0;while(i < tokensLength) {var _l2=checkShash(i) || checkClass(i) || checkAttributeSelector(i) || checkPseudo(i);if(_l2)i += _l2;else break;}tokens[start].compoundSelectorEnd = i;return i - start;}function getCompoundSelector1(){var sequence=[];var compoundSelectorEnd=tokens[pos].compoundSelectorEnd;sequence.push(getTypeSelector());while(pos < compoundSelectorEnd) {if(checkShash(pos))sequence.push(getShash());else if(checkClass(pos))sequence.push(getClass());else if(checkAttributeSelector(pos))sequence.push(getAttributeSelector());else if(checkPseudo(pos))sequence.push(getPseudo());}return sequence;}function checkCompoundSelector2(i){if(i >= tokensLength)return 0;var start=i;while(i < tokensLength) {var l=checkShash(i) || checkClass(i) || checkAttributeSelector(i) || checkPseudo(i);if(l)i += l;else break;}tokens[start].compoundSelectorEnd = i;return i - start;}function getCompoundSelector2(){var sequence=[];var compoundSelectorEnd=tokens[pos].compoundSelectorEnd;while(pos < compoundSelectorEnd) {if(checkShash(pos))sequence.push(getShash());else if(checkClass(pos))sequence.push(getClass());else if(checkAttributeSelector(pos))sequence.push(getAttributeSelector());else if(checkPseudo(pos))sequence.push(getPseudo());}return sequence;}function checkTypeSelector(i){if(i >= tokensLength)return 0;var start=i;var l=undefined;if(l = checkNamePrefix(i))i += l;if(tokens[i].type === TokenType.Asterisk)i++;else if(l = checkIdent(i))i += l;else return 0;return i - start;}function getTypeSelector(){var type=NodeType.TypeSelectorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];if(checkNamePrefix(pos))content.push(getNamePrefix());if(checkIdent(pos))content.push(getIdent());return newNode(type,content,line,column);}function checkAttributeSelector(i){var l=undefined;if(l = checkAttributeSelector1(i))tokens[i].attributeSelectorType = 1;else if(l = checkAttributeSelector2(i))tokens[i].attributeSelectorType = 2;return l;}function getAttributeSelector(){var type=tokens[pos].attributeSelectorType;if(type === 1)return getAttributeSelector1();else return getAttributeSelector2();} /**
 * (1) `[panda=nani]`
 * (2) `[panda='nani']`
 * (3) `[panda='nani' i]`
 *
 */function checkAttributeSelector1(i){var start=i;if(tokens[i].type === TokenType.LeftSquareBracket)i++;else return 0;var l=undefined;if(l = checkSC(i))i += l;if(l = checkAttributeName(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkAttributeMatch(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkAttributeValue(i))i += l;else return 0;if(l = checkSC(i))i += l;if(l = checkAttributeFlags(i)){i += l;if(l = checkSC(i))i += l;}if(tokens[i].type === TokenType.RightSquareBracket)i++;else return 0;return i - start;}function getAttributeSelector1(){var type=NodeType.AttributeSelectorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `[`.
pos++;content = content.concat(getSC());content.push(getAttributeName());content = content.concat(getSC());content.push(getAttributeMatch());content = content.concat(getSC());content.push(getAttributeValue());content = content.concat(getSC());if(checkAttributeFlags(pos)){content.push(getAttributeFlags());content = content.concat(getSC());} // Skip `]`.
pos++;var end=getLastPosition(content,line,column,1);return newNode(type,content,line,column,end);} /**
 * (1) `[panda]`
 */function checkAttributeSelector2(i){var start=i;if(tokens[i].type === TokenType.LeftSquareBracket)i++;else return 0;var l=undefined;if(l = checkSC(i))i += l;if(l = checkAttributeName(i))i += l;else return 0;if(l = checkSC(i))i += l;if(tokens[i].type === TokenType.RightSquareBracket)i++;else return 0;return i - start;}function getAttributeSelector2(){var type=NodeType.AttributeSelectorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[]; // Skip `[`.
pos++;content = content.concat(getSC());content.push(getAttributeName());content = content.concat(getSC()); // Skip `]`.
pos++;var end=getLastPosition(content,line,column,1);return newNode(type,content,line,column,end);}function checkAttributeName(i){var start=i;var l=undefined;if(l = checkNamePrefix(i))i += l;if(l = checkIdent(i))i += l;else return 0;return i - start;}function getAttributeName(){var type=NodeType.AttributeNameType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];if(checkNamePrefix(pos))content.push(getNamePrefix());content.push(getIdent());return newNode(type,content,line,column);}function checkAttributeMatch(i){var l=undefined;if(l = checkAttributeMatch1(i))tokens[i].attributeMatchType = 1;else if(l = checkAttributeMatch2(i))tokens[i].attributeMatchType = 2;return l;}function getAttributeMatch(){var type=tokens[pos].attributeMatchType;if(type === 1)return getAttributeMatch1();else return getAttributeMatch2();}function checkAttributeMatch1(i){var start=i;var type=tokens[i].type;if(type === TokenType.Tilde || type === TokenType.VerticalLine || type === TokenType.CircumflexAccent || type === TokenType.DollarSign || type === TokenType.Asterisk)i++;else return 0;if(tokens[i].type === TokenType.EqualsSign)i++;else return 0;return i - start;}function getAttributeMatch1(){var type=NodeType.AttributeMatchType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=tokens[pos].value + tokens[pos + 1].value;pos += 2;return newNode(type,content,line,column);}function checkAttributeMatch2(i){if(tokens[i].type === TokenType.EqualsSign)return 1;else return 0;}function getAttributeMatch2(){var type=NodeType.AttributeMatchType;var token=tokens[pos];var line=token.ln;var column=token.col;var content='=';pos++;return newNode(type,content,line,column);}function checkAttributeValue(i){return checkString(i) || checkIdent(i);}function getAttributeValue(){var type=NodeType.AttributeValueType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];if(checkString(pos))content.push(getString());else content.push(getIdent());return newNode(type,content,line,column);}function checkAttributeFlags(i){return checkIdent(i);}function getAttributeFlags(){var type=NodeType.AttributeFlagsType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getIdent()];return newNode(type,content,line,column);}function checkNamePrefix(i){if(i >= tokensLength)return 0;var l=undefined;if(l = checkNamePrefix1(i))tokens[i].namePrefixType = 1;else if(l = checkNamePrefix2(i))tokens[i].namePrefixType = 2;return l;}function getNamePrefix(){var type=tokens[pos].namePrefixType;if(type === 1)return getNamePrefix1();else return getNamePrefix2();} /**
 * (1) `panda|`
 * (2) `panda<comment>|`
 */function checkNamePrefix1(i){var start=i;var l=undefined;if(l = checkNamespacePrefix(i))i += l;else return 0;if(l = checkCommentML(i))i += l;if(l = checkNamespaceSeparator(i))i += l;else return 0;return i - start;}function getNamePrefix1(){var type=NodeType.NamePrefixType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];content.push(getNamespacePrefix());if(checkCommentML(pos))content.push(getCommentML());content.push(getNamespaceSeparator());return newNode(type,content,line,column);} /**
 * (1) `|`
 */function checkNamePrefix2(i){return checkNamespaceSeparator(i);}function getNamePrefix2(){var type=NodeType.NamePrefixType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[getNamespaceSeparator()];return newNode(type,content,line,column);} /**
 * (1) `*`
 * (2) `panda`
 */function checkNamespacePrefix(i){if(i >= tokensLength)return 0;var l=undefined;if(tokens[i].type === TokenType.Asterisk)return 1;else if(l = checkIdent(i))return l;else return 0;}function getNamespacePrefix(){var type=NodeType.NamespacePrefixType;var token=tokens[pos];var line=token.ln;var column=token.col;var content=[];if(checkIdent(pos))content.push(getIdent());return newNode(type,content,line,column);} /**
 * (1) `|`
 */function checkNamespaceSeparator(i){if(i >= tokensLength)return 0;if(tokens[i].type === TokenType.VerticalLine)return 1;else return 0;}function getNamespaceSeparator(){var type=NodeType.NamespaceSeparatorType;var token=tokens[pos];var line=token.ln;var column=token.col;var content='|';pos++;return newNode(type,content,line,column);}