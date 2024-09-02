import{a as _}from"./chunk-FI6ZHBMQ.mjs";import{a as F}from"./chunk-FIS47SDH.mjs";import"./chunk-H73OZ7ZT.mjs";import"./chunk-HEIBHV25.mjs";import"./chunk-Y7QOH3M5.mjs";import"./chunk-CA7AVOBT.mjs";import"./chunk-43SCXKFO.mjs";import"./chunk-SRTFYG2T.mjs";import{a as Y}from"./chunk-GCAN3TJ3.mjs";import"./chunk-VMDNBU76.mjs";import"./chunk-LEAL3RNQ.mjs";import{l as I}from"./chunk-EYGBHCO6.mjs";import"./chunk-EZ6AQD5Z.mjs";import{Fa as q,Ia as $,La as j,Ma as M,Na as L,Oa as R,Pa as T,Qa as z,Ra as W,b as B,h as w,pa as E}from"./chunk-PZJP3F4K.mjs";import"./chunk-RS46GSJM.mjs";import{a as e}from"./chunk-J73WXDYM.mjs";var N=[],A=[...N],Z=E.visslides,tt=e(()=>I({...Z,...q().visslides}),"getConfig"),et=e(()=>A,"getPages"),rt=e(t=>{A.push(t)},"addPage"),at=e(()=>{j(),A=[...N]},"clear"),P={getPages:et,addPage:rt,getConfig:tt,clear:at,setAccTitle:M,getAccTitle:L,setDiagramTitle:z,getDiagramTitle:W,getAccDescription:T,setAccDescription:R};var nt=e(t=>{_(t,P);for(let r of t.pages){let p=r.subDiagrams.map(l=>"elements"in l?{elements:l.elements.map(c=>({value:1}))}:{rows:l.rows.map(c=>({elements:c.elements.map(m=>({value:1}))}))});P.addPage({subDiagrams:p})}},"populate"),O={parse:async t=>{let r=await F("visslides",t);B.debug(r),nt(r)}};var U=e((t,r,p,l)=>{let c=t.append("g").attr("transform",`translate(0, ${p})`);r.elements.forEach((m,n)=>{it(c,m,n,l,r.showIndex||!1)})},"drawArrayDiagram"),it=e((t,r,p,{elementColor:l,borderColor:c,borderWidth:m,labelColor:n,labelFontSize:f},d)=>{let s=t.append("g"),a=p*50+50,i=50,b=ot(r.color);if(r.arrow){let D=i-40,V=i-10;s.append("line").attr("x1",a+20).attr("y1",D).attr("x2",a+20).attr("y2",V).attr("stroke","black").attr("marker-end","url(#arrowhead)"),r.context&&s.append("text").attr("x",a+20).attr("y",D-10).attr("fill",n).attr("font-size",f).attr("dominant-baseline","hanging").attr("text-anchor","middle").attr("class","arrowContext").text(r.context)}s.append("rect").attr("x",a).attr("y",i).attr("width",40).attr("height",40).style("fill",b).attr("stroke","#191970").attr("stroke-width","2px").attr("class","arrayElement"),s.append("text").attr("x",a+20).attr("y",i+20).attr("fill",n).attr("font-size",f).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","elementLabel").text(r.value),d&&s.append("text").attr("x",a+20).attr("y",i+60).attr("fill",n).attr("font-size",25).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","indexLabel").text(p)},"drawElement"),ot=e(t=>{switch(t){case"blue":return"rgba(0, 0, 255, 0.3)";case"green":return"rgba(0, 255, 0, 0.3)";case"red":return"rgba(255, 0, 0, 0.3)";default:return"none"}},"getColor");var X=e((t,r,p,l)=>{let c=t.append("g").attr("transform",`translate(0, ${p})`);r.rows.forEach((m,n)=>{m.elements.forEach((f,d)=>{st(c,f,n,d,l)})})},"drawMatrixDiagram"),st=e((t,r,p,l,{borderColor:c,borderWidth:m,labelColor:n,labelFontSize:f})=>{let d=t.append("g"),s=l*50+50,a=p*50+50,i=lt(r.color);d.append("rect").attr("x",s).attr("y",a).attr("width",48).attr("height",48).style("fill",i).attr("stroke","#191970").attr("stroke-width","1.5px").attr("class","matrixElement"),d.append("text").attr("x",s+20).attr("y",a+20).attr("fill",n).attr("font-size",f).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","elementLabel").text(r.value.toString())},"drawElement"),lt=e(t=>{switch(t){case"blue":return"rgba(0, 0, 255, 0.3)";case"green":return"rgba(0, 255, 0, 0.3)";case"red":return"rgba(255, 0, 0, 0.3)";default:return"none"}},"getColor");var ct=e((t,r,p,l)=>{let c=l.db,m=c.getConfig(),n=c.getPages(),f=c.getDiagramTitle(),d=800,s=1e3,a=Y(r),i=0,b=null,D=e(u=>{a.selectAll("g.page").attr("display","none"),a.select(`#page${u}`).attr("display","inline"),a.select("#prevButton").attr("fill",u>0?"#007bff":"#c0c0c0"),a.select("#nextButton").attr("fill",u<n.length-1?"#007bff":"#c0c0c0"),a.select("#pageIndicator").text(`${u+1} / ${n.length}`)},"renderPage"),V=e((u,v)=>{let x=u.append("g").attr("class","navigation-buttons"),o=40,g=20,y=10,S=s/2-(o*1.5+y),h=d-60,C=x.append("g").attr("id","prevButtonGroup").attr("cursor","pointer");C.append("rect").attr("id","prevButton").attr("x",S).attr("y",h).attr("width",o).attr("height",g).attr("fill","#c0c0c0"),C.append("text").text("<").attr("x",S+o/2).attr("y",h+g/2).attr("fill","white").attr("text-anchor","middle").attr("alignment-baseline","middle");let G=x.append("g").attr("id","playButtonGroup").attr("cursor","pointer");G.append("rect").attr("id","playButton").attr("x",S+o+y).attr("y",h).attr("width",o).attr("height",g).attr("fill","#007bff"),G.append("text").text("\u25B6").attr("x",S+o+y+o/2).attr("y",h+g/2).attr("fill","white").attr("text-anchor","middle").attr("alignment-baseline","middle");let k=x.append("g").attr("id","nextButtonGroup").attr("cursor","pointer");k.append("rect").attr("id","nextButton").attr("x",S+2*(o+y)).attr("y",h).attr("width",o).attr("height",g).attr("fill","#007bff"),k.append("text").text(">").attr("x",S+2*(o+y)+o/2).attr("y",h+g/2).attr("fill","white").attr("text-anchor","middle").attr("alignment-baseline","middle"),x.append("text").attr("id","pageIndicator").attr("x",s-50).attr("y",d-50).attr("fill","black").attr("text-anchor","middle").attr("alignment-baseline","middle").text(`1 / ${v}`),C.node()?.addEventListener("click",()=>{i>0&&(i-=1,D(i))}),k.node()?.addEventListener("click",()=>{i<v-1&&(i+=1,D(i))}),G.node()?.addEventListener("click",()=>{b?(clearInterval(b),b=null,w("#playButton text").text("\u25B6"),w("#playButton").attr("fill","#007bff")):(b=1e3,w("#playButton text").text("\u275A\u275A"),w("#playButton").attr("fill","#c0c0c0"))})},"addNavigationButtons"),K=e((u,v,x)=>{let o=u.append("g").attr("id",`page${x}`).attr("class","page").attr("display",x===0?"inline":"none");f&&o.append("text").text(f).attr("x",s/2).attr("y",25).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","pageTitle");let g=50;for(let y of v.subDiagrams)y.elements?(U(o,y,g,m),g+=100):(X(o,y,g,m),g+=200)},"drawPage");a.attr("viewBox",`0 0 ${s} ${d}`),$(a,d,s,m.useMaxWidth),n.forEach((u,v)=>{K(a,u,v)}),V(a,n.length),D(i);let Q=`
    (function() {
      const svg = document.getElementById('${r}');
      let currentPage = 0;
      const totalPages = ${n.length};
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
          svg.querySelector('#playButton text').textContent = '\u25B6';
          svg.querySelector('#playButton').setAttribute('fill', '#007bff');
        } else {
          playInterval = setInterval(() => {
            if (currentPage < totalPages - 1) {
              currentPage += 1;
            } else {
              currentPage = 0;
            }
            renderPage(currentPage);
          }, 1000);
          svg.querySelector('#playButton text').textContent = '\u275A\u275A';
          svg.querySelector('#playButton').setAttribute('fill', '#c0c0c0');
        }
      });

      renderPage(currentPage);
    })();
  `;a.append("script").attr("type","text/javascript").text(Q)},"draw"),H={draw:ct};var J=e((t={})=>(B.debug({options:t}),`
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
  `),"styles");var zt={parser:O,db:P,renderer:H,styles:J};export{zt as diagram};
