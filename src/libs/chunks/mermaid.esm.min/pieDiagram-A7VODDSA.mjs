import{a as J}from"./chunk-FI6ZHBMQ.mjs";import{a as Z}from"./chunk-LSYTTYOM.mjs";import"./chunk-QNODZV7Q.mjs";import"./chunk-VYTLUDP2.mjs";import"./chunk-BSEW2AJO.mjs";import"./chunk-EFBUICDX.mjs";import"./chunk-Q7DGOWVW.mjs";import"./chunk-VXYEL6QL.mjs";import{a as H}from"./chunk-GCAN3TJ3.mjs";import"./chunk-VMDNBU76.mjs";import"./chunk-LEAL3RNQ.mjs";import{k as _,l as z}from"./chunk-EYGBHCO6.mjs";import"./chunk-EZ6AQD5Z.mjs";import{E as C,H as O,Ia as B,La as M,Ma as W,Na as I,Oa as L,Pa as q,Qa as N,Ra as U,Ta as V,b as m,l as F,pa as j}from"./chunk-PZJP3F4K.mjs";import"./chunk-RS46GSJM.mjs";import{a as t}from"./chunk-J73WXDYM.mjs";var K=j.pie,A={sections:new Map,showData:!1,config:K},u=A.sections,w=A.showData,ce=structuredClone(K),pe=t(()=>structuredClone(ce),"getConfig"),me=t(()=>{u=new Map,w=A.showData,M()},"clear"),le=t(({label:e,value:i})=>{u.has(e)||(u.set(e,i),m.debug(`added new section: ${e}, with value: ${i}`))},"addSection"),de=t(()=>u,"getSections"),fe=t(e=>{w=e},"setShowData"),ge=t(()=>w,"getShowData"),S={getConfig:pe,clear:me,setDiagramTitle:N,getDiagramTitle:U,setAccTitle:W,getAccTitle:I,setAccDescription:L,getAccDescription:q,addSection:le,getSections:de,setShowData:fe,getShowData:ge};var De=t((e,i)=>{J(e,i),i.setShowData(e.showData),e.sections.map(i.addSection)},"populateDb"),Q={parse:async e=>{let i=await Z("pie",e);m.debug(i),De(i,S)}};var ue=t(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),X=ue;var Se=t(e=>{let i=[...e.entries()].map(n=>({label:n[0],value:n[1]})).sort((n,s)=>s.value-n.value);return O().value(n=>n.value)(i)},"createPieArcs"),ye=t((e,i,ee,n)=>{m.debug(`rendering pie chart
`+e);let s=n.db,T=V(),b=z(s.getConfig(),T.pie),v=40,a=18,d=4,c=450,y=c,P=H(i),p=P.append("g");p.attr("transform","translate("+y/2+","+c/2+")");let{themeVariables:r}=T,[$]=_(r.pieOuterStrokeWidth);$??=2;let k=b.textPosition,f=Math.min(y,c)/2-v,te=C().innerRadius(0).outerRadius(f),ie=C().innerRadius(f*k).outerRadius(f*k);p.append("circle").attr("cx",0).attr("cy",0).attr("r",f+$/2).attr("class","pieOuterCircle");let E=s.getSections(),h=Se(E),re=[r.pie1,r.pie2,r.pie3,r.pie4,r.pie5,r.pie6,r.pie7,r.pie8,r.pie9,r.pie10,r.pie11,r.pie12],l=F(re);p.selectAll("mySlices").data(h).enter().append("path").attr("d",te).attr("fill",o=>l(o.data.label)).attr("class","pieCircle");let G=0;E.forEach(o=>{G+=o}),p.selectAll("mySlices").data(h).enter().append("text").text(o=>(o.data.value/G*100).toFixed(0)+"%").attr("transform",o=>"translate("+ie.centroid(o)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-(c-50)/2).attr("class","pieTitleText");let x=p.selectAll(".legend").data(l.domain()).enter().append("g").attr("class","legend").attr("transform",(o,g)=>{let D=a+d,ne=D*l.domain().length/2,ae=12*a,se=g*D-ne;return"translate("+ae+","+se+")"});x.append("rect").attr("width",a).attr("height",a).style("fill",l).style("stroke",l),x.data(h).append("text").attr("x",a+d).attr("y",a-d).text(o=>{let{label:g,value:D}=o.data;return s.getShowData()?`${g} [${D}]`:g});let oe=Math.max(...x.selectAll("text").nodes().map(o=>o?.getBoundingClientRect().width??0)),R=y+v+a+d+oe;P.attr("viewBox",`0 0 ${R} ${c}`),B(P,c,R,b.useMaxWidth)},"draw"),Y={draw:ye};var Ne={parser:Q,db:S,renderer:Y,styles:X};export{Ne as diagram};
