import{E as K,Ja as ot,La as lt,Sa as ct,Ta as ht,b as S,h as R,ka as it,la as st,ma as at}from"./chunk-PZJP3F4K.mjs";import{a as o,c as Lt}from"./chunk-J73WXDYM.mjs";var Q=function(){var n=o(function(m,i,s,c){for(s=s||{},c=m.length;c--;s[m[c]]=i);return s},"o"),t=[6,8,10,11,12,14,16,17,20,21],e=[1,9],a=[1,10],r=[1,11],u=[1,12],h=[1,13],f=[1,16],g=[1,17],d={trace:o(function(){},"trace"),yy:{},symbols_:{error:2,start:3,timeline:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,period_statement:18,event_statement:19,period:20,event:21,$accept:0,$end:1},terminals_:{2:"error",4:"timeline",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",20:"period",21:"event"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,1],[18,1],[19,1]],performAction:o(function(i,s,c,p,y,l,E){var k=l.length-1;switch(y){case 1:return l[k-1];case 2:this.$=[];break;case 3:l[k-1].push(l[k]),this.$=l[k-1];break;case 4:case 5:this.$=l[k];break;case 6:case 7:this.$=[];break;case 8:p.getCommonDb().setDiagramTitle(l[k].substr(6)),this.$=l[k].substr(6);break;case 9:this.$=l[k].trim(),p.getCommonDb().setAccTitle(this.$);break;case 10:case 11:this.$=l[k].trim(),p.getCommonDb().setAccDescription(this.$);break;case 12:p.addSection(l[k].substr(8)),this.$=l[k].substr(8);break;case 15:p.addTask(l[k],0,""),this.$=l[k];break;case 16:p.addEvent(l[k].substr(2)),this.$=l[k];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},n(t,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:e,12:a,14:r,16:u,17:h,18:14,19:15,20:f,21:g},n(t,[2,7],{1:[2,1]}),n(t,[2,3]),{9:18,11:e,12:a,14:r,16:u,17:h,18:14,19:15,20:f,21:g},n(t,[2,5]),n(t,[2,6]),n(t,[2,8]),{13:[1,19]},{15:[1,20]},n(t,[2,11]),n(t,[2,12]),n(t,[2,13]),n(t,[2,14]),n(t,[2,15]),n(t,[2,16]),n(t,[2,4]),n(t,[2,9]),n(t,[2,10])],defaultActions:{},parseError:o(function(i,s){if(s.recoverable)this.trace(i);else{var c=new Error(i);throw c.hash=s,c}},"parseError"),parse:o(function(i){var s=this,c=[0],p=[],y=[null],l=[],E=this.table,k="",N=0,C=0,B=0,tt=2,L=1,v=l.slice.call(arguments,1),b=Object.create(this.lexer),T={yy:{}};for(var H in this.yy)Object.prototype.hasOwnProperty.call(this.yy,H)&&(T.yy[H]=this.yy[H]);b.setInput(i,T.yy),T.yy.lexer=b,T.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var $=b.yylloc;l.push($);var et=b.options&&b.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function nt(I){c.length=c.length-2*I,y.length=y.length-I,l.length=l.length-I}o(nt,"popStack");function Nt(){var I;return I=p.pop()||b.lex()||L,typeof I!="number"&&(I instanceof Array&&(p=I,I=p.pop()),I=s.symbols_[I]||I),I}o(Nt,"lex");for(var w,U,z,M,Jt,Z,V={},O,A,rt,j;;){if(z=c[c.length-1],this.defaultActions[z]?M=this.defaultActions[z]:((w===null||typeof w>"u")&&(w=Nt()),M=E[z]&&E[z][w]),typeof M>"u"||!M.length||!M[0]){var J="";j=[];for(O in E[z])this.terminals_[O]&&O>tt&&j.push("'"+this.terminals_[O]+"'");b.showPosition?J="Parse error on line "+(N+1)+`:
`+b.showPosition()+`
Expecting `+j.join(", ")+", got '"+(this.terminals_[w]||w)+"'":J="Parse error on line "+(N+1)+": Unexpected "+(w==L?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(J,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:$,expected:j})}if(M[0]instanceof Array&&M.length>1)throw new Error("Parse Error: multiple actions possible at state: "+z+", token: "+w);switch(M[0]){case 1:c.push(w),y.push(b.yytext),l.push(b.yylloc),c.push(M[1]),w=null,U?(w=U,U=null):(C=b.yyleng,k=b.yytext,N=b.yylineno,$=b.yylloc,B>0&&B--);break;case 2:if(A=this.productions_[M[1]][1],V.$=y[y.length-A],V._$={first_line:l[l.length-(A||1)].first_line,last_line:l[l.length-1].last_line,first_column:l[l.length-(A||1)].first_column,last_column:l[l.length-1].last_column},et&&(V._$.range=[l[l.length-(A||1)].range[0],l[l.length-1].range[1]]),Z=this.performAction.apply(V,[k,C,N,T.yy,M[1],y,l].concat(v)),typeof Z<"u")return Z;A&&(c=c.slice(0,-1*A*2),y=y.slice(0,-1*A),l=l.slice(0,-1*A)),c.push(this.productions_[M[1]][0]),y.push(V.$),l.push(V._$),rt=E[c[c.length-2]][c[c.length-1]],c.push(rt);break;case 3:return!0}}return!0},"parse")},x=function(){var m={EOF:1,parseError:o(function(s,c){if(this.yy.parser)this.yy.parser.parseError(s,c);else throw new Error(s)},"parseError"),setInput:function(i,s){return this.yy=s||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var s=i.match(/(?:\r\n?|\n).*/g);return s?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},unput:function(i){var s=i.length,c=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-s),this.offset-=s;var p=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var y=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===p.length?this.yylloc.first_column:0)+p[p.length-c.length].length-c[0].length:this.yylloc.first_column-s},this.options.ranges&&(this.yylloc.range=[y[0],y[0]+this.yyleng-s]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(i){this.unput(this.match.slice(i))},pastInput:function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var i=this.pastInput(),s=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+s+"^"},test_match:function(i,s){var c,p,y;if(this.options.backtrack_lexer&&(y={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(y.yylloc.range=this.yylloc.range.slice(0))),p=i[0].match(/(?:\r\n?|\n).*/g),p&&(this.yylineno+=p.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:p?p[p.length-1].length-p[p.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],c=this.performAction.call(this,this.yy,this,s,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),c)return c;if(this._backtrack){for(var l in y)this[l]=y[l];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,s,c,p;this._more||(this.yytext="",this.match="");for(var y=this._currentRules(),l=0;l<y.length;l++)if(c=this._input.match(this.rules[y[l]]),c&&(!s||c[0].length>s[0].length)){if(s=c,p=l,this.options.backtrack_lexer){if(i=this.test_match(c,y[l]),i!==!1)return i;if(this._backtrack){s=!1;continue}else return!1}else if(!this.options.flex)break}return s?(i=this.test_match(s,y[p]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:o(function(){var s=this.next();return s||this.lex()},"lex"),begin:o(function(s){this.conditionStack.push(s)},"begin"),popState:o(function(){var s=this.conditionStack.length-1;return s>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:o(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:o(function(s){return s=this.conditionStack.length-1-Math.abs(s||0),s>=0?this.conditionStack[s]:"INITIAL"},"topState"),pushState:o(function(s){this.begin(s)},"pushState"),stateStackSize:o(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:o(function(s,c,p,y){var l=y;switch(p){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;break;case 8:return this.popState(),"acc_title_value";break;case 9:return this.begin("acc_descr"),14;break;case 10:return this.popState(),"acc_descr_value";break;case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 21;case 16:return 20;case 17:return 6;case 18:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:timeline\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?::\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18],inclusive:!0}}};return m}();d.lexer=x;function _(){this.yy={}}return o(_,"Parser"),_.prototype=d,d.Parser=_,new _}();Q.parser=Q;var ut=Q;var Y={};Lt(Y,{addEvent:()=>kt,addSection:()=>gt,addTask:()=>bt,addTaskOrg:()=>_t,clear:()=>ft,default:()=>$t,getCommonDb:()=>yt,getSections:()=>mt,getTasks:()=>xt});var F="",pt=0,X=[],G=[],W=[],yt=o(()=>ct,"getCommonDb"),ft=o(function(){X.length=0,G.length=0,F="",W.length=0,lt()},"clear"),gt=o(function(n){F=n,X.push(n)},"addSection"),mt=o(function(){return X},"getSections"),xt=o(function(){let n=dt(),t=100,e=0;for(;!n&&e<t;)n=dt(),e++;return G.push(...W),G},"getTasks"),bt=o(function(n,t,e){let a={id:pt++,section:F,type:F,task:n,score:t||0,events:e?[e]:[]};W.push(a)},"addTask"),kt=o(function(n){W.find(e=>e.id===pt-1).events.push(n)},"addEvent"),_t=o(function(n){let t={section:F,type:F,description:n,task:n,classes:[]};G.push(t)},"addTaskOrg"),dt=o(function(){let n=o(function(e){return W[e].processed},"compileTask"),t=!0;for(let[e,a]of W.entries())n(e),t=t&&a.processed;return t},"compileTasks"),$t={clear:ft,getCommonDb:yt,addSection:gt,getSections:mt,getTasks:xt,addTask:bt,addTaskOrg:_t,addEvent:kt};var At=12,q=o(function(n,t){let e=n.append("rect");return e.attr("x",t.x),e.attr("y",t.y),e.attr("fill",t.fill),e.attr("stroke",t.stroke),e.attr("width",t.width),e.attr("height",t.height),e.attr("rx",t.rx),e.attr("ry",t.ry),t.class!==void 0&&e.attr("class",t.class),e},"drawRect"),Ht=o(function(n,t){let a=n.append("circle").attr("cx",t.cx).attr("cy",t.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),r=n.append("g");r.append("circle").attr("cx",t.cx-15/3).attr("cy",t.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),r.append("circle").attr("cx",t.cx+15/3).attr("cy",t.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function u(g){let d=K().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);g.append("path").attr("class","mouth").attr("d",d).attr("transform","translate("+t.cx+","+(t.cy+2)+")")}o(u,"smile");function h(g){let d=K().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);g.append("path").attr("class","mouth").attr("d",d).attr("transform","translate("+t.cx+","+(t.cy+7)+")")}o(h,"sad");function f(g){g.append("line").attr("class","mouth").attr("stroke",2).attr("x1",t.cx-5).attr("y1",t.cy+7).attr("x2",t.cx+5).attr("y2",t.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return o(f,"ambivalent"),t.score>3?u(r):t.score<3?h(r):f(r),a},"drawFace"),Pt=o(function(n,t){let e=n.append("circle");return e.attr("cx",t.cx),e.attr("cy",t.cy),e.attr("class","actor-"+t.pos),e.attr("fill",t.fill),e.attr("stroke",t.stroke),e.attr("r",t.r),e.class!==void 0&&e.attr("class",e.class),t.title!==void 0&&e.append("title").text(t.title),e},"drawCircle"),wt=o(function(n,t){let e=t.text.replace(/<br\s*\/?>/gi," "),a=n.append("text");a.attr("x",t.x),a.attr("y",t.y),a.attr("class","legend"),a.style("text-anchor",t.anchor),t.class!==void 0&&a.attr("class",t.class);let r=a.append("tspan");return r.attr("x",t.x+t.textMargin*2),r.text(e),a},"drawText"),Ct=o(function(n,t){function e(r,u,h,f,g){return r+","+u+" "+(r+h)+","+u+" "+(r+h)+","+(u+f-g)+" "+(r+h-g*1.2)+","+(u+f)+" "+r+","+(u+f)}o(e,"genPoints");let a=n.append("polygon");a.attr("points",e(t.x,t.y,50,20,7)),a.attr("class","labelBox"),t.y=t.y+t.labelMargin,t.x=t.x+.5*t.labelMargin,wt(n,t)},"drawLabel"),zt=o(function(n,t,e){let a=n.append("g"),r=D();r.x=t.x,r.y=t.y,r.fill=t.fill,r.width=e.width,r.height=e.height,r.class="journey-section section-type-"+t.num,r.rx=3,r.ry=3,q(a,r),St(e)(t.text,a,r.x,r.y,r.width,r.height,{class:"journey-section section-type-"+t.num},e,t.colour)},"drawSection"),vt=-1,Bt=o(function(n,t,e){let a=t.x+e.width/2,r=n.append("g");vt++;let u=300+5*30;r.append("line").attr("id","task"+vt).attr("x1",a).attr("y1",t.y).attr("x2",a).attr("y2",u).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),Ht(r,{cx:a,cy:300+(5-t.score)*30,score:t.score});let h=D();h.x=t.x,h.y=t.y,h.fill=t.fill,h.width=e.width,h.height=e.height,h.class="task task-type-"+t.num,h.rx=3,h.ry=3,q(r,h);let f=t.x+14;St(e)(t.task,r,h.x,h.y,h.width,h.height,{class:"task"},e,t.colour)},"drawTask"),Vt=o(function(n,t){q(n,{x:t.startx,y:t.starty,width:t.stopx-t.startx,height:t.stopy-t.starty,fill:t.fill,class:"rect"}).lower()},"drawBackgroundRect"),Rt=o(function(){return{x:0,y:0,fill:void 0,"text-anchor":"start",width:100,height:100,textMargin:0,rx:0,ry:0}},"getTextObj"),D=o(function(){return{x:0,y:0,width:100,anchor:"start",height:100,rx:0,ry:0}},"getNoteRect"),St=function(){function n(r,u,h,f,g,d,x,_){let m=u.append("text").attr("x",h+g/2).attr("y",f+d/2+5).style("font-color",_).style("text-anchor","middle").text(r);a(m,x)}o(n,"byText");function t(r,u,h,f,g,d,x,_,m){let{taskFontSize:i,taskFontFamily:s}=_,c=r.split(/<br\s*\/?>/gi);for(let p=0;p<c.length;p++){let y=p*i-i*(c.length-1)/2,l=u.append("text").attr("x",h+g/2).attr("y",f).attr("fill",m).style("text-anchor","middle").style("font-size",i).style("font-family",s);l.append("tspan").attr("x",h+g/2).attr("dy",y).text(c[p]),l.attr("y",f+d/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),a(l,x)}}o(t,"byTspan");function e(r,u,h,f,g,d,x,_){let m=u.append("switch"),s=m.append("foreignObject").attr("x",h).attr("y",f).attr("width",g).attr("height",d).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");s.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(r),t(r,m,h,f,g,d,x,_),a(s,x)}o(e,"byFo");function a(r,u){for(let h in u)h in u&&r.attr(h,u[h])}return o(a,"_setTextAttrs"),function(r){return r.textPlacement==="fo"?e:r.textPlacement==="old"?n:t}}(),Ft=o(function(n){n.append("defs").append("marker").attr("id","arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics");function Et(n,t){n.each(function(){var e=R(this),a=e.text().split(/(\s+|<br>)/).reverse(),r,u=[],h=1.1,f=e.attr("y"),g=parseFloat(e.attr("dy")),d=e.text(null).append("tspan").attr("x",0).attr("y",f).attr("dy",g+"em");for(let x=0;x<a.length;x++)r=a[a.length-1-x],u.push(r),d.text(u.join(" ").trim()),(d.node().getComputedTextLength()>t||r==="<br>")&&(u.pop(),d.text(u.join(" ").trim()),r==="<br>"?u=[""]:u=[r],d=e.append("tspan").attr("x",0).attr("y",f).attr("dy",h+"em").text(r))})}o(Et,"wrap");var Wt=o(function(n,t,e,a){let r=e%At-1,u=n.append("g");t.section=r,u.attr("class",(t.class?t.class+" ":"")+"timeline-node "+("section-"+r));let h=u.append("g"),f=u.append("g"),d=f.append("text").text(t.descr).attr("dy","1em").attr("alignment-baseline","middle").attr("dominant-baseline","middle").attr("text-anchor","middle").call(Et,t.width).node().getBBox(),x=a.fontSize&&a.fontSize.replace?a.fontSize.replace("px",""):a.fontSize;return t.height=d.height+x*1.1*.5+t.padding,t.height=Math.max(t.height,t.maxHeight),t.width=t.width+2*t.padding,f.attr("transform","translate("+t.width/2+", "+t.padding/2+")"),jt(h,t,r,a),t},"drawNode"),Ot=o(function(n,t,e){let a=n.append("g"),u=a.append("text").text(t.descr).attr("dy","1em").attr("alignment-baseline","middle").attr("dominant-baseline","middle").attr("text-anchor","middle").call(Et,t.width).node().getBBox(),h=e.fontSize&&e.fontSize.replace?e.fontSize.replace("px",""):e.fontSize;return a.remove(),u.height+h*1.1*.5+t.padding},"getVirtualNodeHeight"),jt=o(function(n,t,e){n.append("path").attr("id","node-"+t.id).attr("class","node-bkg node-"+t.type).attr("d",`M0 ${t.height-5} v${-t.height+2*5} q0,-5 5,-5 h${t.width-2*5} q5,0 5,5 v${t.height-5} H0 Z`),n.append("line").attr("class","node-line-"+e).attr("x1",0).attr("y1",t.height).attr("x2",t.width).attr("y2",t.height)},"defaultBkg"),P={drawRect:q,drawCircle:Pt,drawSection:zt,drawText:wt,drawLabel:Ct,drawTask:Bt,drawBackgroundRect:Vt,getTextObj:Rt,getNoteRect:D,initGraphics:Ft,drawNode:Wt,getVirtualNodeHeight:Ot};var Gt=o(function(n,t,e,a){let r=ht(),u=r.leftMargin??50;S.debug("timeline",a.db);let h=r.securityLevel,f;h==="sandbox"&&(f=R("#i"+t));let d=(h==="sandbox"?R(f.nodes()[0].contentDocument.body):R("body")).select("#"+t);d.append("g");let x=a.db.getTasks(),_=a.db.getCommonDb().getDiagramTitle();S.debug("task",x),P.initGraphics(d);let m=a.db.getSections();S.debug("sections",m);let i=0,s=0,c=0,p=0,y=50+u,l=50;p=50;let E=0,k=!0;m.forEach(function(L){let v={number:E,descr:L,section:E,width:150,padding:20,maxHeight:i},b=P.getVirtualNodeHeight(d,v,r);S.debug("sectionHeight before draw",b),i=Math.max(i,b+20)});let N=0,C=0;S.debug("tasks.length",x.length);for(let[L,v]of x.entries()){let b={number:L,descr:v,section:v.section,width:150,padding:20,maxHeight:s},T=P.getVirtualNodeHeight(d,b,r);S.debug("taskHeight before draw",T),s=Math.max(s,T+20),N=Math.max(N,v.events.length);let H=0;for(let $=0;$<v.events.length;$++){let nt={descr:v.events[$],section:v.section,number:v.section,width:150,padding:20,maxHeight:50};H+=P.getVirtualNodeHeight(d,nt,r)}C=Math.max(C,H)}S.debug("maxSectionHeight before draw",i),S.debug("maxTaskHeight before draw",s),m&&m.length>0?m.forEach(L=>{let v=x.filter($=>$.section===L),b={number:E,descr:L,section:E,width:200*Math.max(v.length,1)-50,padding:20,maxHeight:i};S.debug("sectionNode",b);let T=d.append("g"),H=P.drawNode(T,b,E,r);S.debug("sectionNode output",H),T.attr("transform",`translate(${y}, ${p})`),l+=i+50,v.length>0&&Tt(d,v,E,y,l,s,r,N,C,i,!1),y+=200*Math.max(v.length,1),l=p,E++}):(k=!1,Tt(d,x,E,y,l,s,r,N,C,i,!0));let B=d.node().getBBox();S.debug("bounds",B),_&&d.append("text").text(_).attr("x",B.width/2-u).attr("font-size","4ex").attr("font-weight","bold").attr("y",20),c=k?i+s+150:s+100,d.append("g").attr("class","lineWrapper").append("line").attr("x1",u).attr("y1",c).attr("x2",B.width+3*u).attr("y2",c).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#arrowhead)"),ot(void 0,d,r.timeline?.padding??50,r.timeline?.useMaxWidth??!1)},"draw"),Tt=o(function(n,t,e,a,r,u,h,f,g,d,x){for(let _ of t){let m={descr:_.task,section:e,number:e,width:150,padding:20,maxHeight:u};S.debug("taskNode",m);let i=n.append("g").attr("class","taskWrapper"),c=P.drawNode(i,m,e,h).height;if(S.debug("taskHeight after draw",c),i.attr("transform",`translate(${a}, ${r})`),u=Math.max(u,c),_.events){let p=n.append("g").attr("class","lineWrapper"),y=u;r+=100,y=y+qt(n,_.events,e,a,r,h),r-=100,p.append("line").attr("x1",a+190/2).attr("y1",r+u).attr("x2",a+190/2).attr("y2",r+u+(x?u:d)+g+120).attr("stroke-width",2).attr("stroke","black").attr("marker-end","url(#arrowhead)").attr("stroke-dasharray","5,5")}a=a+200,x&&!h.timeline?.disableMulticolor&&e++}r=r-10},"drawTasks"),qt=o(function(n,t,e,a,r,u){let h=0,f=r;r=r+100;for(let g of t){let d={descr:g,section:e,number:e,width:150,padding:20,maxHeight:50};S.debug("eventNode",d);let x=n.append("g").attr("class","eventWrapper"),m=P.drawNode(x,d,e,u).height;h=h+m,x.attr("transform",`translate(${a}, ${r})`),r=r+10+m}return r=f,h},"drawEvents"),It={setConf:()=>{},draw:Gt};var Ut=o(n=>{let t="";for(let e=0;e<n.THEME_COLOR_LIMIT;e++)n["lineColor"+e]=n["lineColor"+e]||n["cScaleInv"+e],it(n["lineColor"+e])?n["lineColor"+e]=st(n["lineColor"+e],20):n["lineColor"+e]=at(n["lineColor"+e],20);for(let e=0;e<n.THEME_COLOR_LIMIT;e++){let a=""+(17-3*e);t+=`
    .section-${e-1} rect, .section-${e-1} path, .section-${e-1} circle, .section-${e-1} path  {
      fill: ${n["cScale"+e]};
    }
    .section-${e-1} text {
     fill: ${n["cScaleLabel"+e]};
    }
    .node-icon-${e-1} {
      font-size: 40px;
      color: ${n["cScaleLabel"+e]};
    }
    .section-edge-${e-1}{
      stroke: ${n["cScale"+e]};
    }
    .edge-depth-${e-1}{
      stroke-width: ${a};
    }
    .section-${e-1} line {
      stroke: ${n["cScaleInv"+e]} ;
      stroke-width: 3;
    }

    .lineWrapper line{
      stroke: ${n["cScaleLabel"+e]} ;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }
    `}return t},"genSections"),Zt=o(n=>`
  .edge {
    stroke-width: 3;
  }
  ${Ut(n)}
  .section-root rect, .section-root path, .section-root circle  {
    fill: ${n.git0};
  }
  .section-root text {
    fill: ${n.gitBranchLabel0};
  }
  .icon-container {
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edge {
    fill: none;
  }
  .eventWrapper  {
   filter: brightness(120%);
  }
`,"getStyles"),Mt=Zt;var ye={db:Y,renderer:It,parser:ut,styles:Mt};export{ye as diagram};