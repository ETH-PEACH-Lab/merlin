"use strict";(self.webpackChunkonsenui_v2_react_minimum=self.webpackChunkonsenui_v2_react_minimum||[]).push([[8943],{68943:(e,t,a)=>{a.d(t,{diagram:()=>w});var l=a(36482),n=a(21894),s=(a(7100),a(56392),a(96404),a(73723),a(54413)),i=(a(1265),a(33615),a(41981)),o=(a(25070),a(64443)),r=(a(8605),a(6009)),d=(0,r.K2)((e=>o.Y2.sanitizeText(e,(0,o.D7)())),"sanitizeText"),c={dividerMargin:10,padding:5,textHeight:10,curve:void 0},p=(0,r.K2)((function(e,t,a,l){o.Rm.info("keys:",[...e.keys()]),o.Rm.info(e),e.forEach((function(e){const n={shape:"rect",id:e.id,domId:e.domId,labelText:d(e.id),labelStyle:"",style:"fill: none; stroke: black",padding:(0,o.D7)().flowchart?.padding??(0,o.D7)().class?.padding};t.setNode(e.id,n),b(e.classes,t,a,l,e.id),o.Rm.info("setNode",n)}))}),"addNamespaces"),b=(0,r.K2)((function(e,t,a,l,n){o.Rm.info("keys:",[...e.keys()]),o.Rm.info(e),[...e.values()].filter((e=>e.parent===n)).forEach((function(e){const a=e.cssClasses.join(" "),s=(0,i.sM)(e.styles),r=e.label??e.id,c={labelStyle:s.labelStyle,shape:"class_box",labelText:d(r),classData:e,rx:0,ry:0,class:a,style:s.style,id:e.id,domId:e.domId,tooltip:l.db.getTooltip(e.id,n)||"",haveCallback:e.haveCallback,link:e.link,width:"group"===e.type?500:void 0,type:e.type,padding:(0,o.D7)().flowchart?.padding??(0,o.D7)().class?.padding};t.setNode(e.id,c),n&&t.setParent(e.id,n),o.Rm.info("setNode",c)}))}),"addClasses"),f=(0,r.K2)((function(e,t,a,l){o.Rm.info(e),e.forEach((function(e,n){const s=e,r=s.text,p={labelStyle:"",shape:"note",labelText:d(r),noteData:s,rx:0,ry:0,class:"",style:"",id:s.id,domId:s.id,tooltip:"",type:"note",padding:(0,o.D7)().flowchart?.padding??(0,o.D7)().class?.padding};if(t.setNode(s.id,p),o.Rm.info("setNode",p),!s.class||!l.has(s.class))return;const b=a+n,f={id:`edgeNote${b}`,classes:"relation",pattern:"dotted",arrowhead:"none",startLabelRight:"",endLabelLeft:"",arrowTypeStart:"none",arrowTypeEnd:"none",style:"fill:none",labelStyle:"",curve:(0,i.Ib)(c.curve,o.AS)};t.setEdge(s.id,s.class,f,b)}))}),"addNotes"),y=(0,r.K2)((function(e,t){const a=(0,o.D7)().flowchart;let l=0;e.forEach((function(e){l++;const n={classes:"relation",pattern:1==e.relation.lineType?"dashed":"solid",id:(0,i.rY)(e.id1,e.id2,{prefix:"id",counter:l}),arrowhead:"arrow_open"===e.type?"none":"normal",startLabelRight:"none"===e.relationTitle1?"":e.relationTitle1,endLabelLeft:"none"===e.relationTitle2?"":e.relationTitle2,arrowTypeStart:h(e.relation.type1),arrowTypeEnd:h(e.relation.type2),style:"fill:none",labelStyle:"",curve:(0,i.Ib)(a?.curve,o.AS)};if(o.Rm.info(n,e),void 0!==e.style){const t=(0,i.sM)(e.style);n.style=t.style,n.labelStyle=t.labelStyle}e.text=e.title,void 0===e.text?void 0!==e.style&&(n.arrowheadStyle="fill: #333"):(n.arrowheadStyle="fill: #333",n.labelpos="c",(0,o.D7)().flowchart?.htmlLabels??(0,o.D7)().htmlLabels?(n.labelType="html",n.label='<span class="edgeLabel">'+e.text+"</span>"):(n.labelType="text",n.label=e.text.replace(o.Y2.lineBreakRegex,"\n"),void 0===e.style&&(n.style=n.style||"stroke: #333; stroke-width: 1.5px;fill:none"),n.labelStyle=n.labelStyle.replace("color:","fill:"))),t.setEdge(e.id1,e.id2,n,l)}))}),"addRelations"),g=(0,r.K2)((function(e){c={...c,...e}}),"setConf"),u=(0,r.K2)((async function(e,t,a,l){o.Rm.info("Drawing class - ",t);const r=(0,o.D7)().flowchart??(0,o.D7)().class,d=(0,o.D7)().securityLevel;o.Rm.info("config:",r);const c=r?.nodeSpacing??50,g=r?.rankSpacing??50,u=new s.T({multigraph:!0,compound:!0}).setGraph({rankdir:l.db.getDirection(),nodesep:c,ranksep:g,marginx:8,marginy:8}).setDefaultEdgeLabel((function(){return{}})),h=l.db.getNamespaces(),m=l.db.getClasses(),w=l.db.getRelations(),k=l.db.getNotes();let x;o.Rm.info(w),p(h,u,t,l),b(m,u,t,l),y(w,u),f(k,u,w.length+1,m),"sandbox"===d&&(x=(0,o.df)("#i"+t));const T="sandbox"===d?(0,o.df)(x.nodes()[0].contentDocument.body):(0,o.df)("body"),D=T.select(`[id="${t}"]`),v=T.select("#"+t+" g");if(await(0,n.X)(v,u,["aggregation","extension","composition","dependency","lollipop"],"classDiagram",t),i._K.insertTitle(D,"classTitleText",r?.titleTopMargin??5,l.db.getDiagramTitle()),(0,o.ot)(u,D,r?.diagramPadding,r?.useMaxWidth),!r?.htmlLabels){const e="sandbox"===d?x.nodes()[0].contentDocument:document,a=e.querySelectorAll('[id="'+t+'"] .edgeLabel .label');for(const t of a){const a=t.getBBox(),l=e.createElementNS("http://www.w3.org/2000/svg","rect");l.setAttribute("rx",0),l.setAttribute("ry",0),l.setAttribute("width",a.width),l.setAttribute("height",a.height),t.insertBefore(l,t.firstChild)}}}),"draw");function h(e){let t;switch(e){case 0:t="aggregation";break;case 1:t="extension";break;case 2:t="composition";break;case 3:t="dependency";break;case 4:t="lollipop";break;default:t="none"}return t}(0,r.K2)(h,"getArrowMarker");var m={setConf:g,draw:u},w={parser:l._$,db:l.z2,renderer:m,styles:l.tM,init:e=>{e.class||(e.class={}),e.class.arrowMarkerAbsolute=e.arrowMarkerAbsolute,l.z2.clear()}}}}]);