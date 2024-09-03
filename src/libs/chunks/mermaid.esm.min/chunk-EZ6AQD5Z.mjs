import{a as c,b as s}from"./chunk-J73WXDYM.mjs";var o=s(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.BLANK_URL=e.relativeFirstCharacters=e.urlSchemeRegex=e.ctrlCharactersRegex=e.htmlCtrlEntityRegex=e.htmlEntitiesRegex=e.invalidProtocolRegex=void 0;e.invalidProtocolRegex=/^([^\w]*)(javascript|data|vbscript)/im;e.htmlEntitiesRegex=/&#(\w+)(^\w|;)?/g;e.htmlCtrlEntityRegex=/&(newline|tab);/gi;e.ctrlCharactersRegex=/[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;e.urlSchemeRegex=/^.+(:|&colon;)/gim;e.relativeFirstCharacters=[".","/"];e.BLANK_URL="about:blank"});var d=s(n=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.sanitizeUrl=void 0;var t=o();function R(a){return t.relativeFirstCharacters.indexOf(a[0])>-1}c(R,"isRelativeUrlWithoutProtocol");function g(a){var l=a.replace(t.ctrlCharactersRegex,"");return l.replace(t.htmlEntitiesRegex,function(i,r){return String.fromCharCode(r)})}c(g,"decodeHtmlCharacters");function m(a){if(!a)return t.BLANK_URL;var l,i=a;do i=g(i).replace(t.htmlCtrlEntityRegex,"").replace(t.ctrlCharactersRegex,"").trim(),l=i.match(t.ctrlCharactersRegex)||i.match(t.htmlEntitiesRegex)||i.match(t.htmlCtrlEntityRegex);while(l&&l.length>0);var r=i;if(!r)return t.BLANK_URL;if(R(r))return r;var u=r.match(t.urlSchemeRegex);if(!u)return r;var h=u[0];return t.invalidProtocolRegex.test(h)?t.BLANK_URL:r}c(m,"sanitizeUrl");n.sanitizeUrl=m});export{d as a};