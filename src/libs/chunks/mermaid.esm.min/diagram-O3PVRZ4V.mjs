import{a as V}from"./chunk-FI6ZHBMQ.mjs";import{a as j}from"./chunk-O6RXMC2Z.mjs";import"./chunk-RLDXWZHR.mjs";import"./chunk-2PLC5FB4.mjs";import"./chunk-PO33TU2Q.mjs";import"./chunk-6UMARAD3.mjs";import"./chunk-V7KTAHBL.mjs";import"./chunk-QZ4PXIAY.mjs";import{a as R}from"./chunk-GCAN3TJ3.mjs";import"./chunk-VMDNBU76.mjs";import"./chunk-LEAL3RNQ.mjs";import{l as P}from"./chunk-EYGBHCO6.mjs";import"./chunk-EZ6AQD5Z.mjs";import{Fa as C,Ia as G,La as k,Ma as T,Na as I,Oa as E,Pa as q,Qa as $,Ra as L,b,pa as A}from"./chunk-PZJP3F4K.mjs";import"./chunk-RS46GSJM.mjs";import{a as r}from"./chunk-J73WXDYM.mjs";var z={slides:[]},B=structuredClone(z),N=A.array,U=r(()=>P({...N,...C().array}),"getConfig"),H=r(()=>B.slides,"getSlides"),O=r(t=>{B.slides.push(t)},"addSlide"),X=r(()=>{k(),B=structuredClone(z)},"clear"),y={addSlide:O,getSlides:H,getConfig:U,clear:X,setAccTitle:T,getAccTitle:I,setDiagramTitle:$,getDiagramTitle:L,getAccDescription:q,setAccDescription:E};var J=r(t=>{V(t,y);for(let n of t.pages){let g=n.elements.map(s=>({value:s.value,arrow:s.arrow==="arrow",context:s.context,color:s.color}));y.addSlide({showIndex:!!n.showIndex,elements:g})}},"populate"),F={parse:async t=>{let n=await j("testslides",t);b.debug(n),J(n)}};var K=r((t,n,g,s)=>{let m=s.db,x=m.getConfig(),l=m.getSlides(),u=m.getDiagramTitle(),o=500,a=600,e=R(n),c=0,w=null,v=r(i=>{e.selectAll("g.page").attr("style","display: none"),e.select(`#page${i}`).attr("style","display: inline"),e.select("#prevButton").attr("fill",i>0?"#007bff":"#c0c0c0"),e.select("#nextButton").attr("fill",i<l.length-1?"#007bff":"#c0c0c0"),e.select("#pageIndicator").text(`${i+1} / ${l.length}`)},"renderPage"),D=r((i,p)=>{let d=i.append("g").attr("class","navigation-buttons"),f=d.append("g").attr("id","prevButtonGroup").attr("cursor","pointer");f.append("rect").attr("id","prevButton").attr("x",a/2-120).attr("y",o-50).attr("width",60).attr("height",30).attr("fill","#c0c0c0"),f.append("text").text("<").attr("x",a/2-90).attr("y",o-30).attr("fill","white").attr("text-anchor","middle").attr("alignment-baseline","middle");let h=d.append("g").attr("id","nextButtonGroup").attr("cursor","pointer");h.append("rect").attr("id","nextButton").attr("x",a/2+60).attr("y",o-50).attr("width",60).attr("height",30).attr("fill","#007bff"),h.append("text").text(">").attr("x",a/2+90).attr("y",o-30).attr("fill","white").attr("text-anchor","middle").attr("alignment-baseline","middle");let S=d.append("g").attr("id","playButtonGroup").attr("cursor","pointer");S.append("rect").attr("id","playButton").attr("x",a/2-30).attr("y",o-50).attr("width",60).attr("height",30).attr("fill","#007bff"),S.append("text").text("\u25B6").attr("x",a/2).attr("y",o-30).attr("fill","white").attr("text-anchor","middle").attr("alignment-baseline","middle"),d.append("text").attr("id","pageIndicator").attr("x",a-50).attr("y",o-30).attr("fill","black").attr("text-anchor","middle").attr("alignment-baseline","middle").text(`1 / ${p}`)},"addNavigationButtons"),W=r((i,p,d)=>{let f=i.append("g").attr("id",`page${d}`).attr("class","page").attr("style",d===0?"display: inline":"display: none");u&&f.append("text").text(u).attr("x",a/2).attr("y",25).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","arrayTitle");for(let[h,S]of p.elements.entries())Z(f,S,h,x,p.showIndex)},"drawSlide");e.attr("viewBox",`0 0 ${a} ${o}`),G(e,o,a,x.useMaxWidth),tt(e),l.forEach((i,p)=>{W(e,i,p)}),D(e,l.length),v(c);let M=`
    const svg = document.getElementById('${n}');
    let currentPage = 0;
    const totalPages = ${l.length};
    let playInterval = null;

    function renderPage(pageIndex) {
      const pages = svg.querySelectorAll('g.page');
      pages.forEach(page => {
        page.style.display = 'none';
      });
      svg.querySelector('#page' + pageIndex).style.display = 'inline';

      const prevButton = svg.querySelector('#prevButton');
      const nextButton = svg.querySelector('#nextButton');
      
      if (prevButton) prevButton.setAttribute('fill', pageIndex > 0 ? '#007bff' : '#c0c0c0');
      if (nextButton) nextButton.setAttribute('fill', pageIndex < totalPages - 1 ? '#007bff' : '#c0c0c0');

      // Update current page display
      svg.querySelector('#pageIndicator').textContent = (pageIndex + 1) + ' / ' + totalPages;
    }

    svg.querySelector('#prevButtonGroup').addEventListener('click', function() {
      if (currentPage > 0) {
        currentPage -= 1;
        renderPage(currentPage);
      }
    });

    svg.querySelector('#nextButtonGroup').addEventListener('click', function() {
      if (currentPage < totalPages - 1) {
        currentPage += 1;
        renderPage(currentPage);
      }
    });

    svg.querySelector('#playButtonGroup').addEventListener('click', function() {
      if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
        svg.querySelector('#playButton').setAttribute('fill', '#007bff');
        svg.querySelector('#playButton text').textContent = '\u25B6';
      } else {
        playInterval = setInterval(() => {
          if (currentPage < totalPages - 1) {
            currentPage += 1;
          } else {
            currentPage = 0;
          }
          renderPage(currentPage);
        }, 1000);
        svg.querySelector('#playButton').setAttribute('fill', '#c0c0c0');
        svg.querySelector('#playButton text').textContent = '\u275A\u275A';
      }
    });

    renderPage(currentPage);
  `;e.append("script").attr("type","text/ecmascript").text(M)},"draw"),Q=r(t=>{switch(t){case"blue":return"rgba(0, 0, 255, 0.3)";case"green":return"rgba(0, 255, 0, 0.3)";case"red":return"rgba(255, 0, 0, 0.3)";default:return"none"}},"getColor"),Z=r((t,n,g,{elementColor:s,borderColor:m,borderWidth:x,labelColor:l,labelFontSize:u},o)=>{let a=t.append("g"),e=g*50+50,c=100,w=Q(n.color);if(n.arrow){let v=c-40,D=c-10;a.append("line").attr("x1",e+20).attr("y1",v).attr("x2",e+20).attr("y2",D).attr("stroke","black").attr("marker-end","url(#arrowhead)"),n.context&&a.append("text").attr("x",e+20).attr("y",v-10).attr("fill",l).attr("font-size",u).attr("dominant-baseline","hanging").attr("text-anchor","middle").attr("class","arrowContext").text(n.context)}a.append("rect").attr("x",e).attr("y",c).attr("width",40).attr("height",40).style("fill",w).attr("stroke",m).attr("stroke-width",x).attr("class","arrayElement"),a.append("text").attr("x",e+20).attr("y",c+20).attr("fill",l).attr("font-size",u).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","elementLabel").text(n.value),o&&a.append("text").attr("x",e+20).attr("y",c+60).attr("fill",l).attr("font-size",25).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","indexLabel").text(g)},"drawElement"),tt=r(t=>{t.append("defs").append("marker").attr("id","arrowhead").attr("viewBox","0 0 10 10").attr("refX","5").attr("refY","5").attr("markerWidth","6").attr("markerHeight","6").attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("fill","black")},"defineArrowhead"),Y={draw:K};var _=r((t={})=>(b.debug({options:t}),`
    .element {
      font-size: ${t.array?.elementFontSize??"10px"};
      fill: ${t.array?.valueColor??"black"};
    }
    .element.index {
      fill: ${t.array?.indexColor??"black"};
    }
    .element {
      stroke: ${t.array?.elementStrokeColor??"black"};
      stroke-width: ${t.array?.elementStrokeWidth??"1"};
      fill: ${t.array?.elementFillColor??"#efefef"};
    }
  `),"styles");var wt={parser:F,db:y,renderer:Y,styles:_};export{wt as diagram};
