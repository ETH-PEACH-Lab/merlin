import{a as ye,e as se,h as Ee,k as De,l as _e,m as we}from"./chunk-M4DHSCZ5.mjs";import"./chunk-WNGRW6ZO.mjs";import"./chunk-25QWRKWN.mjs";import{a as Le}from"./chunk-AUXUJQO7.mjs";import{e as me}from"./chunk-VMDNBU76.mjs";import"./chunk-LEAL3RNQ.mjs";import{d as xe}from"./chunk-EYGBHCO6.mjs";import"./chunk-EZ6AQD5Z.mjs";import{D as de,Fa as M,Ia as ke,La as Se,Ta as q,b as k,h as V,ha as pe,ia as fe,ja as be,l as ue}from"./chunk-PZJP3F4K.mjs";import"./chunk-RS46GSJM.mjs";import{a as u}from"./chunk-J73WXDYM.mjs";var ie=function(){var e=u(function(z,g,r,n){for(r=r||{},n=z.length;n--;r[z[n]]=g);return r},"o"),o=[1,7],c=[1,13],l=[1,14],s=[1,15],h=[1,19],a=[1,16],b=[1,17],p=[1,18],x=[8,30],S=[8,21,28,29,30,31,32,40,44,47],L=[1,23],D=[1,24],w=[8,15,16,21,28,29,30,31,32,40,44,47],f=[8,15,16,21,27,28,29,30,31,32,40,44,47],T=[1,49],B={trace:u(function(){},"trace"),yy:{},symbols_:{error:2,spaceLines:3,SPACELINE:4,NL:5,separator:6,SPACE:7,EOF:8,start:9,BLOCK_DIAGRAM_KEY:10,document:11,stop:12,statement:13,link:14,LINK:15,START_LINK:16,LINK_LABEL:17,STR:18,nodeStatement:19,columnsStatement:20,SPACE_BLOCK:21,blockStatement:22,classDefStatement:23,cssClassStatement:24,styleStatement:25,node:26,SIZE:27,COLUMNS:28,"id-block":29,end:30,block:31,NODE_ID:32,nodeShapeNLabel:33,dirList:34,DIR:35,NODE_DSTART:36,NODE_DEND:37,BLOCK_ARROW_START:38,BLOCK_ARROW_END:39,classDef:40,CLASSDEF_ID:41,CLASSDEF_STYLEOPTS:42,DEFAULT:43,class:44,CLASSENTITY_IDS:45,STYLECLASS:46,style:47,STYLE_ENTITY_IDS:48,STYLE_DEFINITION_DATA:49,$accept:0,$end:1},terminals_:{2:"error",4:"SPACELINE",5:"NL",7:"SPACE",8:"EOF",10:"BLOCK_DIAGRAM_KEY",15:"LINK",16:"START_LINK",17:"LINK_LABEL",18:"STR",21:"SPACE_BLOCK",27:"SIZE",28:"COLUMNS",29:"id-block",30:"end",31:"block",32:"NODE_ID",35:"DIR",36:"NODE_DSTART",37:"NODE_DEND",38:"BLOCK_ARROW_START",39:"BLOCK_ARROW_END",40:"classDef",41:"CLASSDEF_ID",42:"CLASSDEF_STYLEOPTS",43:"DEFAULT",44:"class",45:"CLASSENTITY_IDS",46:"STYLECLASS",47:"style",48:"STYLE_ENTITY_IDS",49:"STYLE_DEFINITION_DATA"},productions_:[0,[3,1],[3,2],[3,2],[6,1],[6,1],[6,1],[9,3],[12,1],[12,1],[12,2],[12,2],[11,1],[11,2],[14,1],[14,4],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[19,3],[19,2],[19,1],[20,1],[22,4],[22,3],[26,1],[26,2],[34,1],[34,2],[33,3],[33,4],[23,3],[23,3],[24,3],[25,3]],performAction:u(function(g,r,n,d,m,t,Y){var i=t.length-1;switch(m){case 4:d.getLogger().debug("Rule: separator (NL) ");break;case 5:d.getLogger().debug("Rule: separator (Space) ");break;case 6:d.getLogger().debug("Rule: separator (EOF) ");break;case 7:d.getLogger().debug("Rule: hierarchy: ",t[i-1]),d.setHierarchy(t[i-1]);break;case 8:d.getLogger().debug("Stop NL ");break;case 9:d.getLogger().debug("Stop EOF ");break;case 10:d.getLogger().debug("Stop NL2 ");break;case 11:d.getLogger().debug("Stop EOF2 ");break;case 12:d.getLogger().debug("Rule: statement: ",t[i]),typeof t[i].length=="number"?this.$=t[i]:this.$=[t[i]];break;case 13:d.getLogger().debug("Rule: statement #2: ",t[i-1]),this.$=[t[i-1]].concat(t[i]);break;case 14:d.getLogger().debug("Rule: link: ",t[i],g),this.$={edgeTypeStr:t[i],label:""};break;case 15:d.getLogger().debug("Rule: LABEL link: ",t[i-3],t[i-1],t[i]),this.$={edgeTypeStr:t[i],label:t[i-1]};break;case 18:let P=parseInt(t[i]),W=d.generateId();this.$={id:W,type:"space",label:"",width:P,children:[]};break;case 23:d.getLogger().debug("Rule: (nodeStatement link node) ",t[i-2],t[i-1],t[i]," typestr: ",t[i-1].edgeTypeStr);let G=d.edgeStrToEdgeData(t[i-1].edgeTypeStr);this.$=[{id:t[i-2].id,label:t[i-2].label,type:t[i-2].type,directions:t[i-2].directions},{id:t[i-2].id+"-"+t[i].id,start:t[i-2].id,end:t[i].id,label:t[i-1].label,type:"edge",directions:t[i].directions,arrowTypeEnd:G,arrowTypeStart:"arrow_open"},{id:t[i].id,label:t[i].label,type:d.typeStr2Type(t[i].typeStr),directions:t[i].directions}];break;case 24:d.getLogger().debug("Rule: nodeStatement (abc88 node size) ",t[i-1],t[i]),this.$={id:t[i-1].id,label:t[i-1].label,type:d.typeStr2Type(t[i-1].typeStr),directions:t[i-1].directions,widthInColumns:parseInt(t[i],10)};break;case 25:d.getLogger().debug("Rule: nodeStatement (node) ",t[i]),this.$={id:t[i].id,label:t[i].label,type:d.typeStr2Type(t[i].typeStr),directions:t[i].directions,widthInColumns:1};break;case 26:d.getLogger().debug("APA123",this?this:"na"),d.getLogger().debug("COLUMNS: ",t[i]),this.$={type:"column-setting",columns:t[i]==="auto"?-1:parseInt(t[i])};break;case 27:d.getLogger().debug("Rule: id-block statement : ",t[i-2],t[i-1]);let ge=d.generateId();this.$={...t[i-2],type:"composite",children:t[i-1]};break;case 28:d.getLogger().debug("Rule: blockStatement : ",t[i-2],t[i-1],t[i]);let H=d.generateId();this.$={id:H,type:"composite",label:"",children:t[i-1]};break;case 29:d.getLogger().debug("Rule: node (NODE_ID separator): ",t[i]),this.$={id:t[i]};break;case 30:d.getLogger().debug("Rule: node (NODE_ID nodeShapeNLabel separator): ",t[i-1],t[i]),this.$={id:t[i-1],label:t[i].label,typeStr:t[i].typeStr,directions:t[i].directions};break;case 31:d.getLogger().debug("Rule: dirList: ",t[i]),this.$=[t[i]];break;case 32:d.getLogger().debug("Rule: dirList: ",t[i-1],t[i]),this.$=[t[i-1]].concat(t[i]);break;case 33:d.getLogger().debug("Rule: nodeShapeNLabel: ",t[i-2],t[i-1],t[i]),this.$={typeStr:t[i-2]+t[i],label:t[i-1]};break;case 34:d.getLogger().debug("Rule: BLOCK_ARROW nodeShapeNLabel: ",t[i-3],t[i-2]," #3:",t[i-1],t[i]),this.$={typeStr:t[i-3]+t[i],label:t[i-2],directions:t[i-1]};break;case 35:case 36:this.$={type:"classDef",id:t[i-1].trim(),css:t[i].trim()};break;case 37:this.$={type:"applyClass",id:t[i-1].trim(),styleClass:t[i].trim()};break;case 38:this.$={type:"applyStyles",id:t[i-1].trim(),stylesStr:t[i].trim()};break}},"anonymous"),table:[{9:1,10:[1,2]},{1:[3]},{11:3,13:4,19:5,20:6,21:o,22:8,23:9,24:10,25:11,26:12,28:c,29:l,31:s,32:h,40:a,44:b,47:p},{8:[1,20]},e(x,[2,12],{13:4,19:5,20:6,22:8,23:9,24:10,25:11,26:12,11:21,21:o,28:c,29:l,31:s,32:h,40:a,44:b,47:p}),e(S,[2,16],{14:22,15:L,16:D}),e(S,[2,17]),e(S,[2,18]),e(S,[2,19]),e(S,[2,20]),e(S,[2,21]),e(S,[2,22]),e(w,[2,25],{27:[1,25]}),e(S,[2,26]),{19:26,26:12,32:h},{11:27,13:4,19:5,20:6,21:o,22:8,23:9,24:10,25:11,26:12,28:c,29:l,31:s,32:h,40:a,44:b,47:p},{41:[1,28],43:[1,29]},{45:[1,30]},{48:[1,31]},e(f,[2,29],{33:32,36:[1,33],38:[1,34]}),{1:[2,7]},e(x,[2,13]),{26:35,32:h},{32:[2,14]},{17:[1,36]},e(w,[2,24]),{11:37,13:4,14:22,15:L,16:D,19:5,20:6,21:o,22:8,23:9,24:10,25:11,26:12,28:c,29:l,31:s,32:h,40:a,44:b,47:p},{30:[1,38]},{42:[1,39]},{42:[1,40]},{46:[1,41]},{49:[1,42]},e(f,[2,30]),{18:[1,43]},{18:[1,44]},e(w,[2,23]),{18:[1,45]},{30:[1,46]},e(S,[2,28]),e(S,[2,35]),e(S,[2,36]),e(S,[2,37]),e(S,[2,38]),{37:[1,47]},{34:48,35:T},{15:[1,50]},e(S,[2,27]),e(f,[2,33]),{39:[1,51]},{34:52,35:T,39:[2,31]},{32:[2,15]},e(f,[2,34]),{39:[2,32]}],defaultActions:{20:[2,7],23:[2,14],50:[2,15],52:[2,32]},parseError:u(function(g,r){if(r.recoverable)this.trace(g);else{var n=new Error(g);throw n.hash=r,n}},"parseError"),parse:u(function(g){var r=this,n=[0],d=[],m=[null],t=[],Y=this.table,i="",P=0,W=0,G=0,ge=2,H=1,je=t.slice.call(arguments,1),E=Object.create(this.lexer),R={yy:{}};for(var Q in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Q)&&(R.yy[Q]=this.yy[Q]);E.setInput(g,R.yy),R.yy.lexer=E,R.yy.parser=this,typeof E.yylloc>"u"&&(E.yylloc={});var $=E.yylloc;t.push($);var We=E.options&&E.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Lt(N){n.length=n.length-2*N,m.length=m.length-N,t.length=t.length-N}u(Lt,"popStack");function Ge(){var N;return N=d.pop()||E.lex()||H,typeof N!="number"&&(N instanceof Array&&(d=N,N=d.pop()),N=r.symbols_[N]||N),N}u(Ge,"lex");for(var _,ee,v,C,yt,te,F={},U,A,he,X;;){if(v=n[n.length-1],this.defaultActions[v]?C=this.defaultActions[v]:((_===null||typeof _>"u")&&(_=Ge()),C=Y[v]&&Y[v][_]),typeof C>"u"||!C.length||!C[0]){var re="";X=[];for(U in Y[v])this.terminals_[U]&&U>ge&&X.push("'"+this.terminals_[U]+"'");E.showPosition?re="Parse error on line "+(P+1)+`:
`+E.showPosition()+`
Expecting `+X.join(", ")+", got '"+(this.terminals_[_]||_)+"'":re="Parse error on line "+(P+1)+": Unexpected "+(_==H?"end of input":"'"+(this.terminals_[_]||_)+"'"),this.parseError(re,{text:E.match,token:this.terminals_[_]||_,line:E.yylineno,loc:$,expected:X})}if(C[0]instanceof Array&&C.length>1)throw new Error("Parse Error: multiple actions possible at state: "+v+", token: "+_);switch(C[0]){case 1:n.push(_),m.push(E.yytext),t.push(E.yylloc),n.push(C[1]),_=null,ee?(_=ee,ee=null):(W=E.yyleng,i=E.yytext,P=E.yylineno,$=E.yylloc,G>0&&G--);break;case 2:if(A=this.productions_[C[1]][1],F.$=m[m.length-A],F._$={first_line:t[t.length-(A||1)].first_line,last_line:t[t.length-1].last_line,first_column:t[t.length-(A||1)].first_column,last_column:t[t.length-1].last_column},We&&(F._$.range=[t[t.length-(A||1)].range[0],t[t.length-1].range[1]]),te=this.performAction.apply(F,[i,W,P,R.yy,C[1],m,t].concat(je)),typeof te<"u")return te;A&&(n=n.slice(0,-1*A*2),m=m.slice(0,-1*A),t=t.slice(0,-1*A)),n.push(this.productions_[C[1]][0]),m.push(F.$),t.push(F._$),he=Y[n[n.length-2]][n[n.length-1]],n.push(he);break;case 3:return!0}}return!0},"parse")},O=function(){var z={EOF:1,parseError:u(function(r,n){if(this.yy.parser)this.yy.parser.parseError(r,n);else throw new Error(r)},"parseError"),setInput:function(g,r){return this.yy=r||this.yy||{},this._input=g,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var g=this._input[0];this.yytext+=g,this.yyleng++,this.offset++,this.match+=g,this.matched+=g;var r=g.match(/(?:\r\n?|\n).*/g);return r?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),g},unput:function(g){var r=g.length,n=g.split(/(?:\r\n?|\n)/g);this._input=g+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-r),this.offset-=r;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===d.length?this.yylloc.first_column:0)+d[d.length-n.length].length-n[0].length:this.yylloc.first_column-r},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-r]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(g){this.unput(this.match.slice(g))},pastInput:function(){var g=this.matched.substr(0,this.matched.length-this.match.length);return(g.length>20?"...":"")+g.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var g=this.match;return g.length<20&&(g+=this._input.substr(0,20-g.length)),(g.substr(0,20)+(g.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var g=this.pastInput(),r=new Array(g.length+1).join("-");return g+this.upcomingInput()+`
`+r+"^"},test_match:function(g,r){var n,d,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),d=g[0].match(/(?:\r\n?|\n).*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-d[d.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+g[0].length},this.yytext+=g[0],this.match+=g[0],this.matches=g,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(g[0].length),this.matched+=g[0],n=this.performAction.call(this,this.yy,this,r,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var t in m)this[t]=m[t];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var g,r,n,d;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),t=0;t<m.length;t++)if(n=this._input.match(this.rules[m[t]]),n&&(!r||n[0].length>r[0].length)){if(r=n,d=t,this.options.backtrack_lexer){if(g=this.test_match(n,m[t]),g!==!1)return g;if(this._backtrack){r=!1;continue}else return!1}else if(!this.options.flex)break}return r?(g=this.test_match(r,m[d]),g!==!1?g:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:u(function(){var r=this.next();return r||this.lex()},"lex"),begin:u(function(r){this.conditionStack.push(r)},"begin"),popState:u(function(){var r=this.conditionStack.length-1;return r>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:u(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:u(function(r){return r=this.conditionStack.length-1-Math.abs(r||0),r>=0?this.conditionStack[r]:"INITIAL"},"topState"),pushState:u(function(r){this.begin(r)},"pushState"),stateStackSize:u(function(){return this.conditionStack.length},"stateStackSize"),options:{},performAction:u(function(r,n,d,m){var t=m;switch(d){case 0:return 10;case 1:return r.getLogger().debug("Found space-block"),31;break;case 2:return r.getLogger().debug("Found nl-block"),31;break;case 3:return r.getLogger().debug("Found space-block"),29;break;case 4:r.getLogger().debug(".",n.yytext);break;case 5:r.getLogger().debug("_",n.yytext);break;case 6:return 5;case 7:return n.yytext=-1,28;break;case 8:return n.yytext=n.yytext.replace(/columns\s+/,""),r.getLogger().debug("COLUMNS (LEX)",n.yytext),28;break;case 9:this.pushState("md_string");break;case 10:return"MD_STR";case 11:this.popState();break;case 12:this.pushState("string");break;case 13:r.getLogger().debug("LEX: POPPING STR:",n.yytext),this.popState();break;case 14:return r.getLogger().debug("LEX: STR end:",n.yytext),"STR";break;case 15:return n.yytext=n.yytext.replace(/space\:/,""),r.getLogger().debug("SPACE NUM (LEX)",n.yytext),21;break;case 16:return n.yytext="1",r.getLogger().debug("COLUMNS (LEX)",n.yytext),21;break;case 17:return 43;case 18:return"LINKSTYLE";case 19:return"INTERPOLATE";case 20:return this.pushState("CLASSDEF"),40;break;case 21:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";break;case 22:return this.popState(),this.pushState("CLASSDEFID"),41;break;case 23:return this.popState(),42;break;case 24:return this.pushState("CLASS"),44;break;case 25:return this.popState(),this.pushState("CLASS_STYLE"),45;break;case 26:return this.popState(),46;break;case 27:return this.pushState("STYLE_STMNT"),47;break;case 28:return this.popState(),this.pushState("STYLE_DEFINITION"),48;break;case 29:return this.popState(),49;break;case 30:return this.pushState("acc_title"),"acc_title";break;case 31:return this.popState(),"acc_title_value";break;case 32:return this.pushState("acc_descr"),"acc_descr";break;case 33:return this.popState(),"acc_descr_value";break;case 34:this.pushState("acc_descr_multiline");break;case 35:this.popState();break;case 36:return"acc_descr_multiline_value";case 37:return 30;case 38:return this.popState(),r.getLogger().debug("Lex: (("),"NODE_DEND";break;case 39:return this.popState(),r.getLogger().debug("Lex: (("),"NODE_DEND";break;case 40:return this.popState(),r.getLogger().debug("Lex: ))"),"NODE_DEND";break;case 41:return this.popState(),r.getLogger().debug("Lex: (("),"NODE_DEND";break;case 42:return this.popState(),r.getLogger().debug("Lex: (("),"NODE_DEND";break;case 43:return this.popState(),r.getLogger().debug("Lex: (-"),"NODE_DEND";break;case 44:return this.popState(),r.getLogger().debug("Lex: -)"),"NODE_DEND";break;case 45:return this.popState(),r.getLogger().debug("Lex: (("),"NODE_DEND";break;case 46:return this.popState(),r.getLogger().debug("Lex: ]]"),"NODE_DEND";break;case 47:return this.popState(),r.getLogger().debug("Lex: ("),"NODE_DEND";break;case 48:return this.popState(),r.getLogger().debug("Lex: ])"),"NODE_DEND";break;case 49:return this.popState(),r.getLogger().debug("Lex: /]"),"NODE_DEND";break;case 50:return this.popState(),r.getLogger().debug("Lex: /]"),"NODE_DEND";break;case 51:return this.popState(),r.getLogger().debug("Lex: )]"),"NODE_DEND";break;case 52:return this.popState(),r.getLogger().debug("Lex: )"),"NODE_DEND";break;case 53:return this.popState(),r.getLogger().debug("Lex: ]>"),"NODE_DEND";break;case 54:return this.popState(),r.getLogger().debug("Lex: ]"),"NODE_DEND";break;case 55:return r.getLogger().debug("Lexa: -)"),this.pushState("NODE"),36;break;case 56:return r.getLogger().debug("Lexa: (-"),this.pushState("NODE"),36;break;case 57:return r.getLogger().debug("Lexa: ))"),this.pushState("NODE"),36;break;case 58:return r.getLogger().debug("Lexa: )"),this.pushState("NODE"),36;break;case 59:return r.getLogger().debug("Lex: ((("),this.pushState("NODE"),36;break;case 60:return r.getLogger().debug("Lexa: )"),this.pushState("NODE"),36;break;case 61:return r.getLogger().debug("Lexa: )"),this.pushState("NODE"),36;break;case 62:return r.getLogger().debug("Lexa: )"),this.pushState("NODE"),36;break;case 63:return r.getLogger().debug("Lexc: >"),this.pushState("NODE"),36;break;case 64:return r.getLogger().debug("Lexa: (["),this.pushState("NODE"),36;break;case 65:return r.getLogger().debug("Lexa: )"),this.pushState("NODE"),36;break;case 66:return this.pushState("NODE"),36;break;case 67:return this.pushState("NODE"),36;break;case 68:return this.pushState("NODE"),36;break;case 69:return this.pushState("NODE"),36;break;case 70:return this.pushState("NODE"),36;break;case 71:return this.pushState("NODE"),36;break;case 72:return this.pushState("NODE"),36;break;case 73:return r.getLogger().debug("Lexa: ["),this.pushState("NODE"),36;break;case 74:return this.pushState("BLOCK_ARROW"),r.getLogger().debug("LEX ARR START"),38;break;case 75:return r.getLogger().debug("Lex: NODE_ID",n.yytext),32;break;case 76:return r.getLogger().debug("Lex: EOF",n.yytext),8;break;case 77:this.pushState("md_string");break;case 78:this.pushState("md_string");break;case 79:return"NODE_DESCR";case 80:this.popState();break;case 81:r.getLogger().debug("Lex: Starting string"),this.pushState("string");break;case 82:r.getLogger().debug("LEX ARR: Starting string"),this.pushState("string");break;case 83:return r.getLogger().debug("LEX: NODE_DESCR:",n.yytext),"NODE_DESCR";break;case 84:r.getLogger().debug("LEX POPPING"),this.popState();break;case 85:r.getLogger().debug("Lex: =>BAE"),this.pushState("ARROW_DIR");break;case 86:return n.yytext=n.yytext.replace(/^,\s*/,""),r.getLogger().debug("Lex (right): dir:",n.yytext),"DIR";break;case 87:return n.yytext=n.yytext.replace(/^,\s*/,""),r.getLogger().debug("Lex (left):",n.yytext),"DIR";break;case 88:return n.yytext=n.yytext.replace(/^,\s*/,""),r.getLogger().debug("Lex (x):",n.yytext),"DIR";break;case 89:return n.yytext=n.yytext.replace(/^,\s*/,""),r.getLogger().debug("Lex (y):",n.yytext),"DIR";break;case 90:return n.yytext=n.yytext.replace(/^,\s*/,""),r.getLogger().debug("Lex (up):",n.yytext),"DIR";break;case 91:return n.yytext=n.yytext.replace(/^,\s*/,""),r.getLogger().debug("Lex (down):",n.yytext),"DIR";break;case 92:return n.yytext="]>",r.getLogger().debug("Lex (ARROW_DIR end):",n.yytext),this.popState(),this.popState(),"BLOCK_ARROW_END";break;case 93:return r.getLogger().debug("Lex: LINK","#"+n.yytext+"#"),15;break;case 94:return r.getLogger().debug("Lex: LINK",n.yytext),15;break;case 95:return r.getLogger().debug("Lex: LINK",n.yytext),15;break;case 96:return r.getLogger().debug("Lex: LINK",n.yytext),15;break;case 97:return r.getLogger().debug("Lex: START_LINK",n.yytext),this.pushState("LLABEL"),16;break;case 98:return r.getLogger().debug("Lex: START_LINK",n.yytext),this.pushState("LLABEL"),16;break;case 99:return r.getLogger().debug("Lex: START_LINK",n.yytext),this.pushState("LLABEL"),16;break;case 100:this.pushState("md_string");break;case 101:return r.getLogger().debug("Lex: Starting string"),this.pushState("string"),"LINK_LABEL";break;case 102:return this.popState(),r.getLogger().debug("Lex: LINK","#"+n.yytext+"#"),15;break;case 103:return this.popState(),r.getLogger().debug("Lex: LINK",n.yytext),15;break;case 104:return this.popState(),r.getLogger().debug("Lex: LINK",n.yytext),15;break;case 105:return r.getLogger().debug("Lex: COLON",n.yytext),n.yytext=n.yytext.slice(1),27;break}},"anonymous"),rules:[/^(?:block-beta\b)/,/^(?:block\s+)/,/^(?:block\n+)/,/^(?:block:)/,/^(?:[\s]+)/,/^(?:[\n]+)/,/^(?:((\u000D\u000A)|(\u000A)))/,/^(?:columns\s+auto\b)/,/^(?:columns\s+[\d]+)/,/^(?:["][`])/,/^(?:[^`"]+)/,/^(?:[`]["])/,/^(?:["])/,/^(?:["])/,/^(?:[^"]*)/,/^(?:space[:]\d+)/,/^(?:space\b)/,/^(?:default\b)/,/^(?:linkStyle\b)/,/^(?:interpolate\b)/,/^(?:classDef\s+)/,/^(?:DEFAULT\s+)/,/^(?:\w+\s+)/,/^(?:[^\n]*)/,/^(?:class\s+)/,/^(?:(\w+)+((,\s*\w+)*))/,/^(?:[^\n]*)/,/^(?:style\s+)/,/^(?:(\w+)+((,\s*\w+)*))/,/^(?:[^\n]*)/,/^(?:accTitle\s*:\s*)/,/^(?:(?!\n||)*[^\n]*)/,/^(?:accDescr\s*:\s*)/,/^(?:(?!\n||)*[^\n]*)/,/^(?:accDescr\s*\{\s*)/,/^(?:[\}])/,/^(?:[^\}]*)/,/^(?:end\b\s*)/,/^(?:\(\(\()/,/^(?:\)\)\))/,/^(?:[\)]\))/,/^(?:\}\})/,/^(?:\})/,/^(?:\(-)/,/^(?:-\))/,/^(?:\(\()/,/^(?:\]\])/,/^(?:\()/,/^(?:\]\))/,/^(?:\\\])/,/^(?:\/\])/,/^(?:\)\])/,/^(?:[\)])/,/^(?:\]>)/,/^(?:[\]])/,/^(?:-\))/,/^(?:\(-)/,/^(?:\)\))/,/^(?:\))/,/^(?:\(\(\()/,/^(?:\(\()/,/^(?:\{\{)/,/^(?:\{)/,/^(?:>)/,/^(?:\(\[)/,/^(?:\()/,/^(?:\[\[)/,/^(?:\[\|)/,/^(?:\[\()/,/^(?:\)\)\))/,/^(?:\[\\)/,/^(?:\[\/)/,/^(?:\[\\)/,/^(?:\[)/,/^(?:<\[)/,/^(?:[^\(\[\n\-\)\{\}\s\<\>:]+)/,/^(?:$)/,/^(?:["][`])/,/^(?:["][`])/,/^(?:[^`"]+)/,/^(?:[`]["])/,/^(?:["])/,/^(?:["])/,/^(?:[^"]+)/,/^(?:["])/,/^(?:\]>\s*\()/,/^(?:,?\s*right\s*)/,/^(?:,?\s*left\s*)/,/^(?:,?\s*x\s*)/,/^(?:,?\s*y\s*)/,/^(?:,?\s*up\s*)/,/^(?:,?\s*down\s*)/,/^(?:\)\s*)/,/^(?:\s*[xo<]?--+[-xo>]\s*)/,/^(?:\s*[xo<]?==+[=xo>]\s*)/,/^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/,/^(?:\s*~~[\~]+\s*)/,/^(?:\s*[xo<]?--\s*)/,/^(?:\s*[xo<]?==\s*)/,/^(?:\s*[xo<]?-\.\s*)/,/^(?:["][`])/,/^(?:["])/,/^(?:\s*[xo<]?--+[-xo>]\s*)/,/^(?:\s*[xo<]?==+[=xo>]\s*)/,/^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/,/^(?::\d+)/],conditions:{STYLE_DEFINITION:{rules:[29],inclusive:!1},STYLE_STMNT:{rules:[28],inclusive:!1},CLASSDEFID:{rules:[23],inclusive:!1},CLASSDEF:{rules:[21,22],inclusive:!1},CLASS_STYLE:{rules:[26],inclusive:!1},CLASS:{rules:[25],inclusive:!1},LLABEL:{rules:[100,101,102,103,104],inclusive:!1},ARROW_DIR:{rules:[86,87,88,89,90,91,92],inclusive:!1},BLOCK_ARROW:{rules:[77,82,85],inclusive:!1},NODE:{rules:[38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,78,81],inclusive:!1},md_string:{rules:[10,11,79,80],inclusive:!1},space:{rules:[],inclusive:!1},string:{rules:[13,14,83,84],inclusive:!1},acc_descr_multiline:{rules:[35,36],inclusive:!1},acc_descr:{rules:[33],inclusive:!1},acc_title:{rules:[31],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,12,15,16,17,18,19,20,24,27,30,32,34,37,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,93,94,95,96,97,98,99,105],inclusive:!0}}};return z}();B.lexer=O;function K(){this.yy={}}return u(K,"Parser"),K.prototype=B,B.Parser=K,new K}();ie.parser=ie;var Be=ie;var I=new Map,ae=[],ne=new Map,Ne="color",Te="fill",Ue="bgFill",Oe=",",Xe=q(),Z=new Map,qe=u(e=>pe.sanitizeText(e,Xe),"sanitizeText"),Ze=u(function(e,o=""){let c=Z.get(e);c||(c={id:e,styles:[],textStyles:[]},Z.set(e,c)),o?.split(Oe).forEach(l=>{let s=l.replace(/([^;]*);/,"$1").trim();if(l.match(Ne)){let a=s.replace(Te,Ue).replace(Ne,Te);c.textStyles.push(a)}c.styles.push(s)})},"addStyleClass"),Je=u(function(e,o=""){let c=I.get(e);o!=null&&(c.styles=o.split(Oe))},"addStyle2Node"),Qe=u(function(e,o){e.split(",").forEach(function(c){let l=I.get(c);if(l===void 0){let s=c.trim();l={id:s,type:"na",children:[]},I.set(s,l)}l.classes||(l.classes=[]),l.classes.push(o)})},"setCssClass"),Ie=u((e,o)=>{let c=e.flat(),l=[];for(let s of c){if(s.label&&(s.label=qe(s.label)),s.type==="classDef"){Ze(s.id,s.css);continue}if(s.type==="applyClass"){Qe(s.id,s?.styleClass||"");continue}if(s.type==="applyStyles"){s?.stylesStr&&Je(s.id,s?.stylesStr);continue}if(s.type==="column-setting")o.columns=s.columns||-1;else if(s.type==="edge"){let h=(ne.get(s.id)??0)+1;ne.set(s.id,h),s.id=h+"-"+s.id,ae.push(s)}else{s.label||(s.type==="composite"?s.label="":s.label=s.id);let h=I.get(s.id);if(h===void 0?I.set(s.id,s):(s.type!=="na"&&(h.type=s.type),s.label!==s.id&&(h.label=s.label)),s.children&&Ie(s.children,s),s.type==="space"){let a=s.width||1;for(let b=0;b<a;b++){let p=me(s);p.id=p.id+"-"+b,I.set(p.id,p),l.push(p)}}else h===void 0&&l.push(s)}}o.children=l},"populateBlockDatabase"),oe=[],j={id:"root",type:"composite",children:[],columns:-1},$e=u(()=>{k.debug("Clear called"),Se(),j={id:"root",type:"composite",children:[],columns:-1},I=new Map([["root",j]]),oe=[],Z=new Map,ae=[],ne=new Map},"clear");function et(e){switch(k.debug("typeStr2Type",e),e){case"[]":return"square";case"()":return k.debug("we have a round"),"round";case"(())":return"circle";case">]":return"rect_left_inv_arrow";case"{}":return"diamond";case"{{}}":return"hexagon";case"([])":return"stadium";case"[[]]":return"subroutine";case"[()]":return"cylinder";case"((()))":return"doublecircle";case"[//]":return"lean_right";case"[\\\\]":return"lean_left";case"[/\\]":return"trapezoid";case"[\\/]":return"inv_trapezoid";case"<[]>":return"block_arrow";default:return"na"}}u(et,"typeStr2Type");function tt(e){switch(k.debug("typeStr2Type",e),e){case"==":return"thick";default:return"normal"}}u(tt,"edgeTypeStr2Type");function rt(e){switch(e.trim()){case"--x":return"arrow_cross";case"--o":return"arrow_circle";default:return"arrow_point"}}u(rt,"edgeStrToEdgeData");var Ce=0,st=u(()=>(Ce++,"id-"+Math.random().toString(36).substr(2,12)+"-"+Ce),"generateId"),it=u(e=>{j.children=e,Ie(e,j),oe=j.children},"setHierarchy"),nt=u(e=>{let o=I.get(e);return o?o.columns?o.columns:o.children?o.children.length:-1:-1},"getColumns"),at=u(()=>[...I.values()],"getBlocksFlat"),ot=u(()=>oe||[],"getBlocks"),lt=u(()=>ae,"getEdges"),ct=u(e=>I.get(e),"getBlock"),gt=u(e=>{I.set(e.id,e)},"setBlock"),ht=u(()=>console,"getLogger"),ut=u(function(){return Z},"getClasses"),dt={getConfig:()=>M().block,typeStr2Type:et,edgeTypeStr2Type:tt,edgeStrToEdgeData:rt,getLogger:ht,getBlocksFlat:at,getBlocks:ot,getEdges:lt,setHierarchy:it,getBlock:ct,setBlock:gt,getColumns:nt,getClasses:ut,clear:$e,generateId:st},ze=dt;var J=u((e,o)=>{let c=be,l=c(e,"r"),s=c(e,"g"),h=c(e,"b");return fe(l,s,h,o)},"fade"),pt=u(e=>`.label {
    font-family: ${e.fontFamily};
    color: ${e.nodeTextColor||e.textColor};
  }
  .cluster-label text {
    fill: ${e.titleColor};
  }
  .cluster-label span,p {
    color: ${e.titleColor};
  }



  .label text,span,p {
    fill: ${e.nodeTextColor||e.textColor};
    color: ${e.nodeTextColor||e.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }
  .flowchart-label text {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${e.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    rect {
      opacity: 0.5;
      background-color: ${e.edgeLabelBackground};
      fill: ${e.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${J(e.edgeLabelBackground,.5)};
    // background-color:
  }

  .node .cluster {
    // fill: ${J(e.mainBkg,.5)};
    fill: ${J(e.clusterBkg,.5)};
    stroke: ${J(e.clusterBorder,.2)};
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  .cluster span,p {
    color: ${e.titleColor};
  }
  /* .cluster div {
    color: ${e.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.textColor};
  }
`,"getStyles"),Ae=pt;var y=q()?.block?.padding||8;function ft(e,o){if(e===0||!Number.isInteger(e))throw new Error("Columns must be an integer !== 0.");if(o<0||!Number.isInteger(o))throw new Error("Position must be a non-negative integer."+o);if(e<0)return{px:o,py:0};if(e===1)return{px:0,py:o};let c=o%e,l=Math.floor(o/e);return{px:c,py:l}}u(ft,"calculateBlockPosition");var bt=u(e=>{let o=0,c=0;for(let l of e.children){let{width:s,height:h,x:a,y:b}=l.size||{width:0,height:0,x:0,y:0};k.debug("getMaxChildSize abc95 child:",l.id,"width:",s,"height:",h,"x:",a,"y:",b,l.type),l.type!=="space"&&(s>o&&(o=s/(e.widthInColumns||1)),h>c&&(c=h))}return{width:o,height:c}},"getMaxChildSize");function le(e,o,c=0,l=0){k.debug("setBlockSizes abc95 (start)",e.id,e?.size?.x,"block width =",e?.size,"sieblingWidth",c),e?.size?.width||(e.size={width:c,height:l,x:0,y:0});let s=0,h=0;if(e.children?.length>0){for(let f of e.children)le(f,o);let a=bt(e);s=a.width,h=a.height,k.debug("setBlockSizes abc95 maxWidth of",e.id,":s children is ",s,h);for(let f of e.children)f.size&&(k.debug(`abc95 Setting size of children of ${e.id} id=${f.id} ${s} ${h} ${f.size}`),f.size.width=s*(f.widthInColumns||1)+y*((f.widthInColumns||1)-1),f.size.height=h,f.size.x=0,f.size.y=0,k.debug(`abc95 updating size of ${e.id} children child:${f.id} maxWidth:${s} maxHeight:${h}`));for(let f of e.children)le(f,o,s,h);let b=e.columns||-1,p=0;for(let f of e.children)p+=f.widthInColumns||1;let x=e.children.length;b>0&&b<p&&(x=b);let S=e.widthInColumns||1,L=Math.ceil(p/x),D=x*(s+y)+y,w=L*(h+y)+y;if(D<c){k.debug(`Detected to small siebling: abc95 ${e.id} sieblingWidth ${c} sieblingHeight ${l} width ${D}`),D=c,w=l;let f=(c-x*y-y)/x,T=(l-L*y-y)/L;k.debug("Size indata abc88",e.id,"childWidth",f,"maxWidth",s),k.debug("Size indata abc88",e.id,"childHeight",T,"maxHeight",h),k.debug("Size indata abc88 xSize",x,"padding",y);for(let B of e.children)B.size&&(B.size.width=f,B.size.height=T,B.size.x=0,B.size.y=0)}if(k.debug(`abc95 (finale calc) ${e.id} xSize ${x} ySize ${L} columns ${b}${e.children.length} width=${Math.max(D,e.size?.width||0)}`),D<(e?.size?.width||0)){D=e?.size?.width||0;let f=b>0?Math.min(e.children.length,b):e.children.length;if(f>0){let T=(D-f*y-y)/f;k.debug("abc95 (growing to fit) width",e.id,D,e.size?.width,T);for(let B of e.children)B.size&&(B.size.width=T)}}e.size={width:D,height:w,x:0,y:0}}k.debug("setBlockSizes abc94 (done)",e.id,e?.size?.x,e?.size?.width,e?.size?.y,e?.size?.height)}u(le,"setBlockSizes");function Re(e,o){k.debug(`abc85 layout blocks (=>layoutBlocks) ${e.id} x: ${e?.size?.x} y: ${e?.size?.y} width: ${e?.size?.width}`);let c=e.columns||-1;if(k.debug("layoutBlocks columns abc95",e.id,"=>",c,e),e.children&&e.children.length>0){let l=e?.children[0]?.size?.width||0,s=e.children.length*l+(e.children.length-1)*y;k.debug("widthOfChildren 88",s,"posX");let h=0;k.debug("abc91 block?.size?.x",e.id,e?.size?.x);let a=e?.size?.x?e?.size?.x+(-e?.size?.width/2||0):-y,b=0;for(let p of e.children){let x=e;if(!p.size)continue;let{width:S,height:L}=p.size,{px:D,py:w}=ft(c,h);if(w!=b&&(b=w,a=e?.size?.x?e?.size?.x+(-e?.size?.width/2||0):-y,k.debug("New row in layout for block",e.id," and child ",p.id,b)),k.debug(`abc89 layout blocks (child) id: ${p.id} Pos: ${h} (px, py) ${D},${w} (${x?.size?.x},${x?.size?.y}) parent: ${x.id} width: ${S}${y}`),x.size){let f=S/2;p.size.x=a+y+f,k.debug(`abc91 layout blocks (calc) px, pyid:${p.id} startingPos=X${a} new startingPosX${p.size.x} ${f} padding=${y} width=${S} halfWidth=${f} => x:${p.size.x} y:${p.size.y} ${p.widthInColumns} (width * (child?.w || 1)) / 2 ${S*(p?.widthInColumns||1)/2}`),a=p.size.x+f,p.size.y=x.size.y-x.size.height/2+w*(L+y)+L/2+y,k.debug(`abc88 layout blocks (calc) px, pyid:${p.id}startingPosX${a}${y}${f}=>x:${p.size.x}y:${p.size.y}${p.widthInColumns}(width * (child?.w || 1)) / 2${S*(p?.widthInColumns||1)/2}`)}p.children&&Re(p,o),h+=p?.widthInColumns||1,k.debug("abc88 columnsPos",p,h)}}k.debug(`layout blocks (<==layoutBlocks) ${e.id} x: ${e?.size?.x} y: ${e?.size?.y} width: ${e?.size?.width}`)}u(Re,"layoutBlocks");function ve(e,{minX:o,minY:c,maxX:l,maxY:s}={minX:0,minY:0,maxX:0,maxY:0}){if(e.size&&e.id!=="root"){let{x:h,y:a,width:b,height:p}=e.size;h-b/2<o&&(o=h-b/2),a-p/2<c&&(c=a-p/2),h+b/2>l&&(l=h+b/2),a+p/2>s&&(s=a+p/2)}if(e.children)for(let h of e.children)({minX:o,minY:c,maxX:l,maxY:s}=ve(h,{minX:o,minY:c,maxX:l,maxY:s}));return{minX:o,minY:c,maxX:l,maxY:s}}u(ve,"findBounds");function Pe(e){let o=e.getBlock("root");if(!o)return;le(o,e,0,0),Re(o,e),k.debug("getBlocks",JSON.stringify(o,null,2));let{minX:c,minY:l,maxX:s,maxY:h}=ve(o),a=h-l,b=s-c;return{x:c,y:l,width:b,height:a}}u(Pe,"layout");function Fe(e,o,c=!1){let l=e,s="default";(l?.classes?.length||0)>0&&(s=(l?.classes||[]).join(" ")),s=s+" flowchart-label";let h=0,a="",b={},p;switch(l.type){case"round":h=5,a="rect";break;case"composite":h=0,a="composite",p=0;break;case"square":a="rect";break;case"diamond":a="question",b={portConstraints:"FIXED_SIDE"};break;case"hexagon":a="hexagon";break;case"block_arrow":a="block_arrow";break;case"odd":a="rect_left_inv_arrow";break;case"lean_right":a="lean_right";break;case"lean_left":a="lean_left";break;case"trapezoid":a="trapezoid";break;case"inv_trapezoid":a="inv_trapezoid";break;case"rect_left_inv_arrow":a="rect_left_inv_arrow";break;case"circle":a="circle";break;case"ellipse":a="ellipse";break;case"stadium":a="stadium";break;case"subroutine":a="subroutine";break;case"cylinder":a="cylinder";break;case"group":a="rect";break;case"doublecircle":a="doublecircle";break;default:a="rect"}let x=xe(l?.styles||[]),S=l.label,L=l.size||{width:0,height:0,x:0,y:0};return{labelStyle:x.labelStyle,shape:a,labelText:S,rx:h,ry:h,class:s,style:x.style,id:l.id,directions:l.directions,width:L.width,height:L.height,x:L.x,y:L.y,positioned:c,intersect:void 0,type:l.type,padding:p??(M()?.block?.padding||0)}}u(Fe,"getNodeFromBlock");async function xt(e,o,c){let l=Fe(o,c,!1);if(l.type==="group")return;let s=await se(e,l),h=s.node().getBBox(),a=c.getBlock(l.id);a.size={width:h.width,height:h.height,x:0,y:0,node:s},c.setBlock(a),s.remove()}u(xt,"calculateBlockSize");async function kt(e,o,c){let l=Fe(o,c,!0);if(c.getBlock(l.id).type!=="space"){let h=await se(e,l);o.intersect=l?.intersect,Ee(l)}}u(kt,"insertBlockPositioned");async function ce(e,o,c,l){for(let s of o)await l(e,s,c),s.children&&await ce(e,s.children,c,l)}u(ce,"performOperations");async function Me(e,o,c){await ce(e,o,c,xt)}u(Me,"calculateBlockSizes");async function Ke(e,o,c){await ce(e,o,c,kt)}u(Ke,"insertBlocks");async function Ye(e,o,c,l,s){let h=new Le({multigraph:!0,compound:!0});h.setGraph({rankdir:"TB",nodesep:10,ranksep:10,marginx:8,marginy:8});for(let a of c)a.size&&h.setNode(a.id,{width:a.size.width,height:a.size.height,intersect:a.intersect});for(let a of o)if(a.start&&a.end){let b=l.getBlock(a.start),p=l.getBlock(a.end);if(b?.size&&p?.size){let x=b.size,S=p.size,L=[{x:x.x,y:x.y},{x:x.x+(S.x-x.x)/2,y:x.y+(S.y-x.y)/2},{x:S.x,y:S.y}];await we(e,{v:a.start,w:a.end,name:a.id},{...a,arrowTypeEnd:a.arrowTypeEnd,arrowTypeStart:a.arrowTypeStart,points:L,classes:"edge-thickness-normal edge-pattern-solid flowchart-link LS-a1 LE-b1"},void 0,"block",h,s),a.label&&(await De(e,{...a,label:a.label,labelStyle:"stroke: #333; stroke-width: 1.5px;fill:none;",arrowTypeEnd:a.arrowTypeEnd,arrowTypeStart:a.arrowTypeStart,points:L,classes:"edge-thickness-normal edge-pattern-solid flowchart-link LS-a1 LE-b1"}),await _e({...a,x:L[1].x,y:L[1].y},{originalPath:L}))}}}u(Ye,"insertEdges");var St=u(function(e,o){return o.db.getClasses()},"getClasses"),mt=u(async function(e,o,c,l){let{securityLevel:s,block:h}=M(),a=l.db,b;s==="sandbox"&&(b=V("#i"+o));let p=s==="sandbox"?V(b.nodes()[0].contentDocument.body):V("body"),x=s==="sandbox"?p.select(`[id="${o}"]`):V(`[id="${o}"]`);ye(x,["point","circle","cross"],l.type,o);let L=a.getBlocks(),D=a.getBlocksFlat(),w=a.getEdges(),f=x.insert("g").attr("class","block");await Me(f,L,a);let T=Pe(a);if(await Ke(f,L,a),await Ye(f,w,D,a,o),T){let O=T,K=Math.max(1,Math.round(.125*(O.width/O.height))),z=O.height+K+10,g=O.width+10,{useMaxWidth:r}=h;ke(x,z,g,!!r),k.debug("Here Bounds",T,O),x.attr("viewBox",`${O.x-5} ${O.y-5} ${O.width+10} ${O.height+10}`)}let B=ue(de)},"draw"),Ve={draw:mt,getClasses:St};var ir={parser:Be,db:ze,renderer:Ve,styles:Ae};export{ir as diagram};