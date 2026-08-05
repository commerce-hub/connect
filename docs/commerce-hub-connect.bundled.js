var e,t,r,n,i,o,a,s,c,d,u,l,h,f,m,p,v,b,g,y,w,$,k,x,C,E,j,S,A,O,I,_,z,N,R,T,M,P,L,D,B,q,V,F,U,H,W,K,G,Y,J,Z,Q,X,ee,te,re,ne,ie,oe,ae="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function se(e){return e&&e.m&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function ce(){if(t)return e;t=1;var r=Object.prototype;return e=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||r)}}function de(){if(n)return r;return n=1,r=function(e,t){return function(r){return e(t(r))}}}function ue(){if(s)return a;s=1;var e=ce(),t=function(){if(o)return i;o=1;var e=de()(Object.keys,Object);return i=e}(),r=Object.prototype.hasOwnProperty;return a=function(n){if(!e(n))return t(n);var i=[];for(var o in Object(n))r.call(n,o)&&"constructor"!=o&&i.push(o);return i}}function le(){if(d)return c;d=1;var e="object"==typeof ae&&ae&&ae.Object===Object&&ae;return c=e}function he(){if(l)return u;l=1;var e=le(),t="object"==typeof self&&self&&self.Object===Object&&self,r=e||t||Function("return this")();return u=r}function fe(){if(f)return h;f=1;var e=he().Symbol;return h=e}function me(){if(y)return g;y=1;var e=fe(),t=function(){if(p)return m;p=1;var e=fe(),t=Object.prototype,r=t.hasOwnProperty,n=t.toString,i=e?e.toStringTag:void 0;return m=function(e){var t=r.call(e,i),o=e[i];try{e[i]=void 0;var a=!0}catch(e){}var s=n.call(e);return a&&(t?e[i]=o:delete e[i]),s}}(),r=function(){if(b)return v;b=1;var e=Object.prototype.toString;return v=function(t){return e.call(t)}}(),n=e?e.toStringTag:void 0;return g=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":n&&n in Object(e)?t(e):r(e)}}function pe(){if($)return w;return $=1,w=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)},w}function ve(){if(x)return k;x=1;var e=me(),t=pe();return k=function(r){if(!t(r))return!1;var n=e(r);return"[object Function]"==n||"[object GeneratorFunction]"==n||"[object AsyncFunction]"==n||"[object Proxy]"==n}}function be(){if(S)return j;S=1;var e,t=function(){if(E)return C;E=1;var e=he()["v"];return C=e}(),r=(e=/[^.]+$/.exec(t&&t.keys&&t.keys.IE_PROTO||""))?"Symbol(src)_1."+e:"";return j=function(e){return!!r&&r in e}}function ge(){if(O)return A;O=1;var e=Function.prototype.toString;return A=function(t){if(null!=t){try{return e.call(t)}catch(e){}try{return t+""}catch(e){}}return""}}function ye(){if(T)return R;T=1;var e=function(){if(_)return I;_=1;var e=ve(),t=be(),r=pe(),n=ge(),i=/^\[object .+?Constructor\]$/,o=Function.prototype,a=Object.prototype,s=o.toString,c=a.hasOwnProperty,d=RegExp("^"+s.call(c).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");return I=function(o){return!(!r(o)||t(o))&&(e(o)?d:i).test(n(o))}}(),t=N?z:(N=1,z=function(e,t){return null==e?void 0:e[t]});return R=function(r,n){var i=t(r,n);return e(i)?i:void 0}}function we(){if(D)return L;D=1;var e=ye()(he(),"Map");return L=e}function $e(){if(H)return U;H=1;var e=ye()(he(),"WeakMap");return U=e}function ke(){if(K)return W;K=1;var e=function(){if(P)return M;P=1;var e=ye()(he(),"DataView");return M=e}(),t=we(),r=function(){if(q)return B;q=1;var e=ye()(he(),"Promise");return B=e}(),n=function(){if(F)return V;F=1;var e=ye()(he(),"Set");return V=e}(),i=$e(),o=me(),a=ge(),s="[object Map]",c="[object Promise]",d="[object Set]",u="[object WeakMap]",l="[object DataView]",h=a(e),f=a(t),m=a(r),p=a(n),v=a(i),b=o;return(e&&b(new e(new ArrayBuffer(1)))!=l||t&&b(new t)!=s||r&&b(r.resolve())!=c||n&&b(new n)!=d||i&&b(new i)!=u)&&(b=function(e){var t=o(e),r="[object Object]"==t?e.constructor:void 0,n=r?a(r):"";if(n)switch(n){case h:return l;case f:return s;case m:return c;case p:return d;case v:return u}return t}),W=b}function xe(){if(Y)return G;return Y=1,G=function(e){return null!=e&&"object"==typeof e}}function Ce(){if(X)return Q;X=1;var e=function(){if(Z)return J;Z=1;var e=me(),t=xe();return J=function(r){return t(r)&&"[object Arguments]"==e(r)}}(),t=xe(),r=Object.prototype,n=r.hasOwnProperty,i=r.propertyIsEnumerable,o=e(function(){return arguments}())?e:function(e){return t(e)&&n.call(e,"callee")&&!i.call(e,"callee")};return Q=o}function Ee(){if(te)return ee;te=1;var e=Array.isArray;return ee=e}function je(){if(ne)return re;ne=1;return re=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991}}function Se(){if(oe)return ie;oe=1;var e=ve(),t=je();return ie=function(r){return null!=r&&t(r.length)&&!e(r)}}var Ae,Oe,Ie,_e,ze,Ne,Re,Te={exports:{}};function Me(){return Ie||(Ie=1,function(e,t){var r=he(),n=Oe?Ae:(Oe=1,Ae=function(){return!1}),i=t&&!t.nodeType&&t,o=i&&e&&!e.nodeType&&e,a=o&&o.exports===i?r.Buffer:void 0,s=(a?a.isBuffer:void 0)||n;e.exports=s}(Te,Te.exports)),Te.exports}function Pe(){if(Re)return Ne;return Re=1,Ne=function(e){return function(t){return e(t)}}}var Le,De,Be,qe,Ve,Fe={exports:{}};function Ue(){return Le||(Le=1,e=Fe,t=Fe.exports,r=le(),n=t&&!t.nodeType&&t,i=n&&e&&!e.nodeType&&e,o=i&&i.exports===n&&r.process,a=function(){try{var e=i&&i.require&&i.require("util").types;return e||o&&o.binding&&o.binding("util")}catch(e){}}(),e.exports=a),Fe.exports;var e,t,r,n,i,o,a}function He(){if(Be)return De;Be=1;var e=function(){if(ze)return _e;ze=1;var e=me(),t=je(),r=xe(),n={};return n["[object Float32Array]"]=n["[object Float64Array]"]=n["[object Int8Array]"]=n["[object Int16Array]"]=n["[object Int32Array]"]=n["[object Uint8Array]"]=n["[object Uint8ClampedArray]"]=n["[object Uint16Array]"]=n["[object Uint32Array]"]=!0,n["[object Arguments]"]=n["[object Array]"]=n["[object ArrayBuffer]"]=n["[object Boolean]"]=n["[object DataView]"]=n["[object Date]"]=n["[object Error]"]=n["[object Function]"]=n["[object Map]"]=n["[object Number]"]=n["[object Object]"]=n["[object RegExp]"]=n["[object Set]"]=n["[object String]"]=n["[object WeakMap]"]=!1,_e=function(i){return r(i)&&t(i.length)&&!!n[e(i)]}}(),t=Pe(),r=Ue(),n=r&&r.isTypedArray,i=n?t(n):e;return De=i}var We,Ke,Ge,Ye,Je,Ze,Qe,Xe,et,tt,rt,nt,it,ot,at,st,ct,dt,ut,lt,ht,ft,mt,pt,vt,bt,gt,yt,wt,$t,kt,xt,Ct,Et,jt,St,At,Ot,It,_t,zt,Nt,Rt,Tt,Mt=function(){if(Ve)return qe;Ve=1;var e=ue(),t=ke(),r=Ce(),n=Ee(),i=Se(),o=Me(),a=ce(),s=He(),c=Object.prototype.hasOwnProperty;return qe=function(d){if(null==d)return!0;if(i(d)&&(n(d)||"string"==typeof d||"function"==typeof d.splice||o(d)||s(d)||r(d)))return!d.length;var u=t(d);if("[object Map]"==u||"[object Set]"==u)return!d.size;if(a(d))return!e(d).length;for(var l in d)if(c.call(d,l))return!1;return!0}}(),Pt=se(Mt);function Lt(){if(Ke)return We;return Ke=1,We=function(e,t,r,n){var i=-1,o=null==e?0:e.length;for(n&&o&&(r=e[++i]);++i<o;)r=t(r,e[i],i,e);return r}}function Dt(){if(Ze)return Je;Ze=1;var e=(Ye?Ge:(Ye=1,Ge=function(e){return function(t){return null==e?void 0:e[t]}}))({À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"});return Je=e}function Bt(){if(Xe)return Qe;return Xe=1,Qe=function(e,t){for(var r=-1,n=null==e?0:e.length,i=Array(n);++r<n;)i[r]=t(e[r],r,e);return i}}function qt(){if(tt)return et;tt=1;var e=me(),t=xe();return et=function(r){return"symbol"==typeof r||t(r)&&"[object Symbol]"==e(r)}}function Vt(){if(nt)return rt;nt=1;var e=fe(),t=Bt(),r=Ee(),n=qt(),i=e?e.prototype:void 0,o=i?i.toString:void 0;return rt=function e(i){if("string"==typeof i)return i;if(r(i))return t(i,e)+"";if(n(i))return o?o.call(i):"";var a=i+"";return"0"==a&&1/i==-1/0?"-0":a},rt}function Ft(){if(ot)return it;ot=1;var e=Vt();return it=function(t){return null==t?"":e(t)}}function Ut(){if(pt)return mt;pt=1;var e=function(){if(dt)return ct;dt=1;var e=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;return ct=function(t){return t.match(e)||[]}}(),t=function(){if(lt)return ut;lt=1;var e=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;return ut=function(t){return e.test(t)}}(),r=Ft(),n=function(){if(ft)return ht;ft=1;var e="\\ud800-\\udfff",t="\\u2700-\\u27bf",r="a-z\\xdf-\\xf6\\xf8-\\xff",n="A-Z\\xc0-\\xd6\\xd8-\\xde",i="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",o="["+i+"]",a="\\d+",s="["+t+"]",c="["+r+"]",d="[^"+e+i+a+t+r+n+"]",u="(?:\\ud83c[\\udde6-\\uddff]){2}",l="[\\ud800-\\udbff][\\udc00-\\udfff]",h="["+n+"]",f="(?:"+c+"|"+d+")",m="(?:"+h+"|"+d+")",p="(?:['’](?:d|ll|m|re|s|t|ve))?",v="(?:['’](?:D|LL|M|RE|S|T|VE))?",b="(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?",g="[\\ufe0e\\ufe0f]?",y=g+b+"(?:\\u200d(?:"+["[^"+e+"]",u,l].join("|")+")"+g+b+")*",w="(?:"+[s,u,l].join("|")+")"+y,$=RegExp([h+"?"+c+"+"+p+"(?="+[o,h,"$"].join("|")+")",m+"+"+v+"(?="+[o,h+f,"$"].join("|")+")",h+"?"+f+"+"+p,h+"+"+v,"\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",a,w].join("|"),"g");return ht=function(e){return e.match($)||[]}}();return mt=function(i,o,a){return i=r(i),void 0===(o=a?void 0:o)?t(i)?n(i):e(i):i.match(o)||[]},mt}function Ht(){if(bt)return vt;bt=1;var e=Lt(),t=function(){if(st)return at;st=1;var e=Dt(),t=Ft(),r=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,n=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]","g");return at=function(i){return(i=t(i))&&i.replace(r,e).replace(n,"")}}(),r=Ut(),n=RegExp("['’]","g");return vt=function(i){return function(o){return e(r(t(o).replace(n,"")),i,"")}}}function Wt(){if(yt)return gt;return yt=1,gt=function(e,t,r){var n=-1,i=e.length;t<0&&(t=-t>i?0:i+t),(r=r>i?i:r)<0&&(r+=i),i=t>r?0:r-t>>>0,t>>>=0;for(var o=Array(i);++n<i;)o[n]=e[n+t];return o}}function Kt(){if(xt)return kt;xt=1;var e=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");return kt=function(t){return e.test(t)}}function Gt(){if(Ot)return At;Ot=1;var e=Et?Ct:(Et=1,Ct=function(e){return e.split("")}),t=Kt(),r=function(){if(St)return jt;St=1;var e="\\ud800-\\udfff",t="["+e+"]",r="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",n="\\ud83c[\\udffb-\\udfff]",i="[^"+e+"]",o="(?:\\ud83c[\\udde6-\\uddff]){2}",a="[\\ud800-\\udbff][\\udc00-\\udfff]",s="(?:"+r+"|"+n+")?",c="[\\ufe0e\\ufe0f]?",d=c+s+"(?:\\u200d(?:"+[i,o,a].join("|")+")"+c+s+")*",u="(?:"+[i+r+"?",r,o,a,t].join("|")+")",l=RegExp(n+"(?="+n+")|"+u+d,"g");return jt=function(e){return e.match(l)||[]}}();return At=function(n){return t(n)?r(n):e(n)}}function Yt(){if(_t)return It;_t=1;var e=function(){if($t)return wt;$t=1;var e=Wt();return wt=function(t,r,n){var i=t.length;return n=void 0===n?i:n,!r&&n>=i?t:e(t,r,n)}}(),t=Kt(),r=Gt(),n=Ft();return It=function(i){return function(o){o=n(o);var a=t(o)?r(o):void 0,s=a?a[0]:o.charAt(0),c=a?e(a,1).join(""):o.slice(1);return s[i]()+c}}}var Jt,Zt,Qt,Xt,er,tr,rr,nr,ir=function(){if(Tt)return Rt;Tt=1;var e=Ht(),t=function(){if(Nt)return zt;Nt=1;var e=Yt()("toUpperCase");return zt=e}(),r=e(function(e,r,n){return e+(n?" ":"")+t(r)});return Rt=r}(),or=se(ir);function ar(){if(Xt)return Qt;Xt=1;var e=/^(?:0|[1-9]\d*)$/;return Qt=function(t,r){var n=typeof t;return!!(r=r??9007199254740991)&&("number"==n||"symbol"!=n&&e.test(t))&&t>-1&&t%1==0&&t<r},Qt}function sr(){if(tr)return er;tr=1;var e=(Zt||(Zt=1,Jt=function(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}),Jt),t=Ce(),r=Ee(),n=Me(),i=ar(),o=He(),a=Object.prototype.hasOwnProperty;return er=function(s,c){var d=r(s),u=!d&&t(s),l=!d&&!u&&n(s),h=!d&&!u&&!l&&o(s),f=d||u||l||h,m=f?e(s.length,String):[],p=m.length;for(var v in s)!c&&!a.call(s,v)||f&&("length"==v||l&&("offset"==v||"parent"==v)||h&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||i(v,p))||m.push(v);return m}}function cr(){if(nr)return rr;nr=1;var e=sr(),t=ue(),r=Se();return rr=function(n){return r(n)?e(n):t(n)}}var dr,ur,lr,hr,fr,mr,pr,vr,br,gr,yr,wr,$r,kr,xr,Cr,Er,jr,Sr=se(cr());function Ar(){if(hr)return lr;return hr=1,lr=function(e,t){return e===t||e!=e&&t!=t}}function Or(){if(mr)return fr;mr=1;var e=Ar(),t=Se(),r=ar(),n=pe();return fr=function(i,o,a){if(!n(a))return!1;var s=typeof o;return!!("number"==s?t(a)&&r(o,a.length):"string"==s&&o in a)&&e(a[o],i)},fr}function Ir(){if(gr)return br;gr=1;var e=function(){if(vr)return pr;vr=1;var e=/\s/;return pr=function(t){for(var r=t.length;r--&&e.test(t.charAt(r)););return r}}(),t=/^\s+/;return br=function(r){return r?r.slice(0,e(r)+1).replace(t,""):r}}function _r(){if(kr)return $r;kr=1;var e=function(){if(wr)return yr;wr=1;var e=Ir(),t=pe(),r=qt(),n=/^[-+]0x[0-9a-f]+$/i,i=/^0b[01]+$/i,o=/^0o[0-7]+$/i,a=parseInt;return yr=function(s){if("number"==typeof s)return s;if(r(s))return NaN;if(t(s)){var c="function"==typeof s.valueOf?s.valueOf():s;s=t(c)?c+"":c}if("string"!=typeof s)return 0===s?s:+s;s=e(s);var d=i.test(s);return d||o.test(s)?a(s.slice(2),d?2:8):n.test(s)?NaN:+s}}(),t=1/0;return $r=function(r){return r?(r=e(r))===t||r===-1/0?17976931348623157e292*(r<0?-1:1):r==r?r:0:0===r?r:0}}function zr(){if(Cr)return xr;Cr=1;var e=function(){if(ur)return dr;ur=1;var e=Math.ceil,t=Math.max;return dr=function(r,n,i,o){for(var a=-1,s=t(e((n-r)/(i||1)),0),c=Array(s);s--;)c[o?s:++a]=r,r+=i;return c}}(),t=Or(),r=_r();return xr=function(n){return function(i,o,a){return a&&"number"!=typeof a&&t(i,o,a)&&(o=a=void 0),i=r(i),void 0===o?(o=i,i=0):o=r(o),a=void 0===a?i<o?1:-1:r(a),e(i,o,a,n)}}}var Nr,Rr,Tr,Mr,Pr,Lr,Dr,Br,qr,Vr,Fr,Ur,Hr,Wr,Kr,Gr,Yr,Jr,Zr,Qr,Xr,en,tn,rn,nn,on,an,sn,cn,dn,un,ln,hn,fn,mn,pn,vn,bn,gn,yn,wn,$n,kn,xn,Cn,En,jn,Sn,An,On,In,_n,zn,Nn,Rn,Tn,Mn,Pn,Ln,Dn,Bn=function(){if(jr)return Er;jr=1;var e=zr()();return Er=e}(),qn=se(Bn);function Vn(){if(Rr)return Nr;Rr=1;var e=Ee(),t=qt(),r=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,n=/^\w*$/;return Nr=function(i,o){if(e(i))return!1;var a=typeof i;return!("number"!=a&&"symbol"!=a&&"boolean"!=a&&null!=i&&!t(i))||(n.test(i)||!r.test(i)||null!=o&&i in Object(o))},Nr}function Fn(){if(Mr)return Tr;Mr=1;var e=ye()(Object,"create");return Tr=e}function Un(){if(Gr)return Kr;Gr=1;var e=function(){if(Lr)return Pr;Lr=1;var e=Fn();return Pr=function(){this.S=e?e(null):{},this.size=0}}(),t=Br?Dr:(Br=1,Dr=function(e){var t=this.has(e)&&delete this.S[e];return this.size-=t?1:0,t}),r=function(){if(Vr)return qr;Vr=1;var e=Fn(),t=Object.prototype.hasOwnProperty;return qr=function(r){var n=this.S;if(e){var i=n[r];return"__lodash_hash_undefined__"===i?void 0:i}return t.call(n,r)?n[r]:void 0}}(),n=function(){if(Ur)return Fr;Ur=1;var e=Fn(),t=Object.prototype.hasOwnProperty;return Fr=function(r){var n=this.S;return e?void 0!==n[r]:t.call(n,r)}}(),i=function(){if(Wr)return Hr;Wr=1;var e=Fn();return Hr=function(t,r){var n=this.S;return this.size+=this.has(t)?0:1,n[t]=e&&void 0===r?"__lodash_hash_undefined__":r,this}}();function o(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}return o.prototype.clear=e,o.prototype.delete=t,o.prototype.get=r,o.prototype.has=n,o.prototype.set=i,Kr=o}function Hn(){if(Qr)return Zr;Qr=1;var e=Ar();return Zr=function(t,r){for(var n=t.length;n--;)if(e(t[n][0],r))return n;return-1}}function Wn(){if(dn)return cn;dn=1;var e=Jr?Yr:(Jr=1,Yr=function(){this.S=[],this.size=0}),t=function(){if(en)return Xr;en=1;var e=Hn(),t=Array.prototype.splice;return Xr=function(r){var n=this.S,i=e(n,r);return!(i<0||(i==n.length-1?n.pop():t.call(n,i,1),--this.size,0))}}(),r=function(){if(rn)return tn;rn=1;var e=Hn();return tn=function(t){var r=this.S,n=e(r,t);return n<0?void 0:r[n][1]}}(),n=function(){if(on)return nn;on=1;var e=Hn();return nn=function(t){return e(this.S,t)>-1}}(),i=function(){if(sn)return an;sn=1;var e=Hn();return an=function(t,r){var n=this.S,i=e(n,t);return i<0?(++this.size,n.push([t,r])):n[i][1]=r,this}}();function o(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}return o.prototype.clear=e,o.prototype.delete=t,o.prototype.get=r,o.prototype.has=n,o.prototype.set=i,cn=o}function Kn(){if(pn)return mn;pn=1;var e=(fn||(fn=1,hn=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}),hn);return mn=function(t,r){var n=t.S;return e(r)?n["string"==typeof r?"string":"hash"]:n.map}}function Gn(){if(En)return Cn;En=1;var e=function(){if(ln)return un;ln=1;var e=Un(),t=Wn(),r=we();return un=function(){this.size=0,this.S={hash:new e,map:new(r||t),string:new e}}}(),t=function(){if(bn)return vn;bn=1;var e=Kn();return vn=function(t){var r=e(this,t).delete(t);return this.size-=r?1:0,r}}(),r=function(){if(yn)return gn;yn=1;var e=Kn();return gn=function(t){return e(this,t).get(t)}}(),n=function(){if($n)return wn;$n=1;var e=Kn();return wn=function(t){return e(this,t).has(t)}}(),i=function(){if(xn)return kn;xn=1;var e=Kn();return kn=function(t,r){var n=e(this,t),i=n.size;return n.set(t,r),this.size+=n.size==i?0:1,this}}();function o(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}return o.prototype.clear=e,o.prototype.delete=t,o.prototype.get=r,o.prototype.has=n,o.prototype.set=i,Cn=o}function Yn(){if(On)return An;On=1;var e=function(){if(Sn)return jn;Sn=1;var e=Gn();function t(r,n){if("function"!=typeof r||null!=n&&"function"!=typeof n)throw new TypeError("Expected a function");var i=function(){var e=arguments,t=n?n.apply(this,e):e[0],o=i.cache;if(o.has(t))return o.get(t);var a=r.apply(this,e);return i.cache=o.set(t,a)||o,a};return i.cache=new(t.Cache||e),i}return t.Cache=e,jn=t}();return An=function(t){var r=e(t,function(e){return 500===n.size&&n.clear(),e}),n=r.cache;return r}}function Jn(){if(_n)return In;_n=1;var e=Yn(),t=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,r=/\\(\\)?/g,n=e(function(e){var n=[];return 46===e.charCodeAt(0)&&n.push(""),e.replace(t,function(e,t,i,o){n.push(i?o.replace(r,"$1"):t||e)}),n});return In=n}function Zn(){if(Nn)return zn;Nn=1;var e=Ee(),t=Vn(),r=Jn(),n=Ft();return zn=function(i,o){return e(i)?i:t(i,o)?[i]:r(n(i))}}function Qn(){if(Tn)return Rn;Tn=1;var e=qt();return Rn=function(t){if("string"==typeof t||e(t))return t;var r=t+"";return"0"==r&&1/t==-1/0?"-0":r}}function Xn(){if(Pn)return Mn;Pn=1;var e=Zn(),t=Qn();return Mn=function(r,n){for(var i=0,o=(n=e(n,r)).length;null!=r&&i<o;)r=r[t(n[i++])];return i&&i==o?r:void 0}}function ei(){if(Dn)return Ln;Dn=1;var e=Xn();return Ln=function(t,r,n){var i=null==t?void 0:e(t,r);return void 0===i?n:i}}var ti,ri,ni,ii,oi,ai,si=se(ei());function ci(){if(ii)return ni;ii=1;var e=Zn(),t=Ce(),r=Ee(),n=ar(),i=je(),o=Qn();return ni=function(a,s,c){for(var d=-1,u=(s=e(s,a)).length,l=!1;++d<u;){var h=o(s[d]);if(!(l=null!=a&&c(a,h)))break;a=a[h]}return l||++d!=u?l:!!(u=null==a?0:a.length)&&i(u)&&n(h,u)&&(r(a)||t(a))}}var di,ui,li,hi,fi,mi,pi,vi,bi,gi,yi,wi,$i,ki,xi,Ci,Ei,ji,Si,Ai,Oi,Ii,_i,zi,Ni,Ri,Ti,Mi,Pi,Li,Di,Bi,qi,Vi,Fi,Ui,Hi,Wi,Ki,Gi,Yi,Ji,Zi,Qi,Xi,eo,to,ro,no,io,oo,ao,so,co,uo,lo,ho,fo,mo,po,vo,bo,go,yo,wo,$o,ko,xo,Co,Eo,jo,So,Ao,Oo,Io,_o,zo,No,Ro,To,Mo,Po,Lo,Do,Bo,qo,Vo=se(function(){if(ai)return oi;ai=1;var e=function(){if(ri)return ti;ri=1;var e=Object.prototype.hasOwnProperty;return ti=function(t,r){return null!=t&&e.call(t,r)}}(),t=ci();return oi=function(r,n){return null!=r&&t(r,n,e)}}());function Fo(){if(wi)return yi;wi=1;var e=Wn(),t=function(){if(ui)return di;ui=1;var e=Wn();return di=function(){this.S=new e,this.size=0}}(),r=hi?li:(hi=1,li=function(e){var t=this.S,r=t.delete(e);return this.size=t.size,r}),n=mi?fi:(mi=1,fi=function(e){return this.S.get(e)}),i=vi?pi:(vi=1,pi=function(e){return this.S.has(e)}),o=function(){if(gi)return bi;gi=1;var e=Wn(),t=we(),r=Gn();return bi=function(n,i){var o=this.S;if(o instanceof e){var a=o.S;if(!t||a.length<199)return a.push([n,i]),this.size=++o.size,this;o=this.S=new r(a)}return o.set(n,i),this.size=o.size,this}}();function a(t){var r=this.S=new e(t);this.size=r.size}return a.prototype.clear=t,a.prototype.delete=r,a.prototype.get=n,a.prototype.has=i,a.prototype.set=o,yi=a}function Uo(){if(ji)return Ei;ji=1;var e=Gn(),t=ki?$i:(ki=1,$i=function(e){return this.S.set(e,"__lodash_hash_undefined__"),this}),r=Ci?xi:(Ci=1,xi=function(e){return this.S.has(e)});function n(t){var r=-1,n=null==t?0:t.length;for(this.S=new e;++r<n;)this.add(t[r])}return n.prototype.add=n.prototype.push=t,n.prototype.has=r,Ei=n}function Ho(){if(zi)return _i;zi=1;var e=Uo(),t=Ai?Si:(Ai=1,Si=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n;)if(t(e[r],r,e))return!0;return!1}),r=Ii?Oi:(Ii=1,Oi=function(e,t){return e.has(t)});return _i=function(n,i,o,a,s,c){var d=1&o,u=n.length,l=i.length;if(u!=l&&!(d&&l>u))return!1;var h=c.get(n),f=c.get(i);if(h&&f)return h==i&&f==n;var m=-1,p=!0,v=2&o?new e:void 0;for(c.set(n,i),c.set(i,n);++m<u;){var b=n[m],g=i[m];if(a)var y=d?a(g,b,m,i,n,c):a(b,g,m,n,i,c);if(void 0!==y){if(y)continue;p=!1;break}if(v){if(!t(i,function(e,t){if(!r(v,t)&&(b===e||s(b,e,o,a,c)))return v.push(t)})){p=!1;break}}else if(b!==g&&!s(b,g,o,a,c)){p=!1;break}}return c.delete(n),c.delete(i),p}}function Wo(){if(Ri)return Ni;Ri=1;var e=he().Uint8Array;return Ni=e}function Ko(){if(Mi)return Ti;return Mi=1,Ti=function(e){var t=-1,r=Array(e.size);return e.forEach(function(e,n){r[++t]=[n,e]}),r}}function Go(){if(Bi)return Di;Bi=1;var e=fe(),t=Wo(),r=Ar(),n=Ho(),i=Ko(),o=(Li||(Li=1,Pi=function(e){var t=-1,r=Array(e.size);return e.forEach(function(e){r[++t]=e}),r}),Pi),a=e?e.prototype:void 0,s=a?a.valueOf:void 0;return Di=function(e,a,c,d,u,l,h){switch(c){case"[object DataView]":if(e.byteLength!=a.byteLength||e.byteOffset!=a.byteOffset)return!1;e=e.buffer,a=a.buffer;case"[object ArrayBuffer]":return!(e.byteLength!=a.byteLength||!l(new t(e),new t(a)));case"[object Boolean]":case"[object Date]":case"[object Number]":return r(+e,+a);case"[object Error]":return e.name==a.name&&e.message==a.message;case"[object RegExp]":case"[object String]":return e==a+"";case"[object Map]":var f=i;case"[object Set]":var m=1&d;if(f||(f=o),e.size!=a.size&&!m)return!1;var p=h.get(e);if(p)return p==a;d|=2,h.set(e,a);var v=n(f(e),f(a),d,u,l,h);return h.delete(e),v;case"[object Symbol]":if(s)return s.call(e)==s.call(a)}return!1}}function Yo(){if(Vi)return qi;return Vi=1,qi=function(e,t){for(var r=-1,n=t.length,i=e.length;++r<n;)e[i+r]=t[r];return e}}function Jo(){if(Ui)return Fi;Ui=1;var e=Yo(),t=Ee();return Fi=function(r,n,i){var o=n(r);return t(r)?o:e(o,i(r))}}function Zo(){if(Wi)return Hi;return Wi=1,Hi=function(e,t){for(var r=-1,n=null==e?0:e.length,i=0,o=[];++r<n;){var a=e[r];t(a,r,e)&&(o[i++]=a)}return o}}function Qo(){if(Gi)return Ki;return Gi=1,Ki=function(){return[]}}function Xo(){if(Ji)return Yi;Ji=1;var e=Zo(),t=Qo(),r=Object.prototype.propertyIsEnumerable,n=Object.getOwnPropertySymbols;return Yi=n?function(t){return null==t?[]:(t=Object(t),e(n(t),function(e){return r.call(t,e)}))}:t}function ea(){if(Qi)return Zi;Qi=1;var e=Jo(),t=Xo(),r=cr();return Zi=function(n){return e(n,r,t)}}function ta(){if(ro)return to;ro=1;var e=Fo(),t=Ho(),r=Go(),n=function(){if(eo)return Xi;eo=1;var e=ea(),t=Object.prototype.hasOwnProperty;return Xi=function(r,n,i,o,a,s){var c=1&i,d=e(r),u=d.length;if(u!=e(n).length&&!c)return!1;for(var l=u;l--;){var h=d[l];if(!(c?h in n:t.call(n,h)))return!1}var f=s.get(r),m=s.get(n);if(f&&m)return f==n&&m==r;var p=!0;s.set(r,n),s.set(n,r);for(var v=c;++l<u;){var b=r[h=d[l]],g=n[h];if(o)var y=c?o(g,b,h,n,r,s):o(b,g,h,r,n,s);if(!(void 0===y?b===g||a(b,g,i,o,s):y)){p=!1;break}v||(v="constructor"==h)}if(p&&!v){var w=r.constructor,$=n.constructor;w==$||!("constructor"in r)||!("constructor"in n)||"function"==typeof w&&w instanceof w&&"function"==typeof $&&$ instanceof $||(p=!1)}return s.delete(r),s.delete(n),p}}(),i=ke(),o=Ee(),a=Me(),s=He(),c="[object Arguments]",d="[object Array]",u="[object Object]",l=Object.prototype.hasOwnProperty;return to=function(h,f,m,p,v,b){var g=o(h),y=o(f),w=g?d:i(h),$=y?d:i(f),k=(w=w==c?u:w)==u,x=($=$==c?u:$)==u,C=w==$;if(C&&a(h)){if(!a(f))return!1;g=!0,k=!1}if(C&&!k)return b||(b=new e),g||s(h)?t(h,f,m,p,v,b):r(h,f,w,m,p,v,b);if(!(1&m)){var E=k&&l.call(h,"__wrapped__"),j=x&&l.call(f,"__wrapped__");if(E||j){var S=E?h.value():h,A=j?f.value():f;return b||(b=new e),v(S,A,m,p,b)}}return!!C&&(b||(b=new e),n(h,f,m,p,v,b))}}function ra(){if(io)return no;io=1;var e=ta(),t=xe();return no=function r(n,i,o,a,s){return n===i||(null==n||null==i||!t(n)&&!t(i)?n!=n&&i!=i:e(n,i,o,a,r,s))},no}function na(){if(co)return so;co=1;var e=pe();return so=function(t){return t==t&&!e(t)}}function ia(){if(fo)return ho;return fo=1,ho=function(e,t){return function(r){return null!=r&&(r[e]===t&&(void 0!==t||e in Object(r)))}}}function oa(){if(po)return mo;po=1;var e=function(){if(ao)return oo;ao=1;var e=Fo(),t=ra();return oo=function(r,n,i,o){var a=i.length,s=a,c=!o;if(null==r)return!s;for(r=Object(r);a--;){var d=i[a];if(c&&d[2]?d[1]!==r[d[0]]:!(d[0]in r))return!1}for(;++a<s;){var u=(d=i[a])[0],l=r[u],h=d[1];if(c&&d[2]){if(void 0===l&&!(u in r))return!1}else{var f=new e;if(o)var m=o(l,h,u,r,n,f);if(!(void 0===m?t(h,l,3,o,f):m))return!1}}return!0}}(),t=function(){if(lo)return uo;lo=1;var e=na(),t=cr();return uo=function(r){for(var n=t(r),i=n.length;i--;){var o=n[i],a=r[o];n[i]=[o,a,e(a)]}return n}}(),r=ia();return mo=function(n){var i=t(n);return 1==i.length&&i[0][2]?r(i[0][0],i[0][1]):function(t){return t===n||e(t,n,i)}}}function aa(){if(yo)return go;yo=1;var e=bo?vo:(bo=1,vo=function(e,t){return null!=e&&t in Object(e)}),t=ci();return go=function(r,n){return null!=r&&t(r,n,e)}}function sa(){if(xo)return ko;return xo=1,ko=function(e){return e}}function ca(){if(Oo)return Ao;Oo=1;var e=Eo?Co:(Eo=1,Co=function(e){return function(t){return null==t?void 0:t[e]}}),t=function(){if(So)return jo;So=1;var e=Xn();return jo=function(t){return function(r){return e(r,t)}}}(),r=Vn(),n=Qn();return Ao=function(i){return r(i)?e(n(i)):t(i)}}function da(){if(_o)return Io;_o=1;var e=oa(),t=function(){if($o)return wo;$o=1;var e=ra(),t=ei(),r=aa(),n=Vn(),i=na(),o=ia(),a=Qn();return wo=function(s,c){return n(s)&&i(c)?o(a(s),c):function(n){var i=t(n,s);return void 0===i&&i===c?r(n,s):e(c,i,3)}}}(),r=sa(),n=Ee(),i=ca();return Io=function(o){return"function"==typeof o?o:null==o?r:"object"==typeof o?n(o)?t(o[0],o[1]):e(o):i(o)}}function ua(){if(To)return Ro;return To=1,Ro=function(e,t,r,n){for(var i=e.length,o=r+(n?1:-1);n?o--:++o<i;)if(t(e[o],o,e))return o;return-1}}function la(){if(Po)return Mo;Po=1;var e=_r();return Mo=function(t){var r=e(t),n=r%1;return r==r?n?r-n:r:0}}var ha,fa,ma,pa,va,ba,ga,ya,wa,$a,ka,xa,Ca,Ea,ja=function(){if(qo)return Bo;qo=1;var e=function(){if(No)return zo;No=1;var e=da(),t=Se(),r=cr();return zo=function(n){return function(i,o,a){var s=Object(i);if(!t(i)){var c=e(o,3);i=r(i),o=function(e){return c(s[e],e,s)}}var d=n(i,o,a);return d>-1?s[c?i[d]:d]:void 0}}}(),t=e(function(){if(Do)return Lo;Do=1;var e=ua(),t=da(),r=la(),n=Math.max;return Lo=function(i,o,a){var s=null==i?0:i.length;if(!s)return-1;var c=null==a?0:r(a);return c<0&&(c=n(s+c,0)),e(i,t(o,3),c)}}());return Bo=t}(),Sa=se(ja);function Aa(){if(ba)return va;ba=1;var e=ua(),t=fa?ha:(fa=1,ha=function(e){return e!=e}),r=pa?ma:(pa=1,ma=function(e,t,r){for(var n=r-1,i=e.length;++n<i;)if(e[n]===t)return n;return-1});return va=function(n,i,o){return i==i?r(n,i,o):e(n,t,o)}}function Oa(){if(xa)return ka;xa=1;var e=function(){if($a)return wa;$a=1;var e=Bt();return wa=function(t,r){return e(r,function(e){return t[e]})}}(),t=cr();return ka=function(r){return null==r?[]:e(r,t(r))}}var Ia,_a=se(function(){if(Ea)return Ca;Ea=1;var e=Aa(),t=Se(),r=function(){if(ya)return ga;ya=1;var e=me(),t=Ee(),r=xe();return ga=function(n){return"string"==typeof n||!t(n)&&r(n)&&"[object String]"==e(n)}}(),n=la(),i=Oa(),o=Math.max;return Ca=function(a,s,c,d){a=t(a)?a:i(a),c=c&&!d?n(c):0;var u=a.length;return c<0&&(c=o(u+c,0)),r(a)?c<=u&&a.indexOf(s,c)>-1:!!u&&e(a,s,c)>-1}}()),za={exports:{}},Na={},Ra={},Ta={},Ma={},Pa={},La={};function Da(){return Ia||(Ia=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.regexpCode=e.getEsmExportName=e.getProperty=e.safeStringify=e.stringify=e.strConcat=e.addCodeArg=e.str=e._=e.nil=e._Code=e.Name=e.IDENTIFIER=e._CodeOrName=void 0;class t{}e._CodeOrName=t,e.IDENTIFIER=/^[a-z$_][a-z$_0-9]*$/i;class r extends t{constructor(t){if(super(),!e.IDENTIFIER.test(t))throw new Error("CodeGen: name must be a valid identifier");this.str=t}toString(){return this.str}emptyStr(){return!1}get names(){return{[this.str]:1}}}e.Name=r;class n extends t{constructor(e){super(),this._items="string"==typeof e?[e]:e}toString(){return this.str}emptyStr(){if(this._items.length>1)return!1;const e=this._items[0];return""===e||'""'===e}get str(){var e;return null!==(e=this._str)&&void 0!==e?e:this._str=this._items.reduce((e,t)=>`${e}${t}`,"")}get names(){var e;return null!==(e=this._names)&&void 0!==e?e:this._names=this._items.reduce((e,t)=>(t instanceof r&&(e[t.str]=(e[t.str]||0)+1),e),{})}}function i(e,...t){const r=[e[0]];let i=0;for(;i<t.length;)s(r,t[i]),r.push(e[++i]);return new n(r)}e._Code=n,e.nil=new n(""),e._=i;const o=new n("+");function a(e,...t){const r=[d(e[0])];let i=0;for(;i<t.length;)r.push(o),s(r,t[i]),r.push(o,d(e[++i]));return function(e){let t=1;for(;t<e.length-1;){if(e[t]===o){const r=c(e[t-1],e[t+1]);if(void 0!==r){e.splice(t-1,3,r);continue}e[t++]="+"}t++}}(r),new n(r)}function s(e,t){t instanceof n?e.push(...t._items):t instanceof r?e.push(t):e.push(function(e){return"number"==typeof e||"boolean"==typeof e||null===e?e:d(Array.isArray(e)?e.join(","):e)}(t))}function c(e,t){if('""'===t)return e;if('""'===e)return t;if("string"==typeof e){if(t instanceof r||'"'!==e[e.length-1])return;return"string"!=typeof t?`${e.slice(0,-1)}${t}"`:'"'===t[0]?e.slice(0,-1)+t.slice(1):void 0}return"string"!=typeof t||'"'!==t[0]||e instanceof r?void 0:`"${e}${t.slice(1)}`}function d(e){return JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}e.str=a,e.addCodeArg=s,e.strConcat=function(e,t){return t.emptyStr()?e:e.emptyStr()?t:a`${e}${t}`},e.stringify=function(e){return new n(d(e))},e.safeStringify=d,e.getProperty=function(t){return"string"==typeof t&&e.IDENTIFIER.test(t)?new n(`.${t}`):i`[${t}]`},e.getEsmExportName=function(t){if("string"==typeof t&&e.IDENTIFIER.test(t))return new n(`${t}`);throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`)},e.regexpCode=function(e){return new n(e.toString())}}(La)),La}var Ba,qa,Va={};function Fa(){return Ba||(Ba=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.ValueScope=e.ValueScopeName=e.Scope=e.varKinds=e.UsedValueState=void 0;const t=Da();class r extends Error{constructor(e){super(`CodeGen: "code" for ${e} not defined`),this.value=e.value}}var n;!function(e){e[e.Started=0]="Started",e[e.Completed=1]="Completed"}(n||(e.UsedValueState=n={})),e.varKinds={const:new t.Name("const"),let:new t.Name("let"),var:new t.Name("var")};class i{constructor({prefixes:e,parent:t}={}){this._names={},this._prefixes=e,this._parent=t}toName(e){return e instanceof t.Name?e:this.name(e)}name(e){return new t.Name(this._newName(e))}_newName(e){return`${e}${(this._names[e]||this._nameGroup(e)).index++}`}_nameGroup(e){var t,r;if((null===(r=null===(t=this._parent)||void 0===t?void 0:t._prefixes)||void 0===r?void 0:r.has(e))||this._prefixes&&!this._prefixes.has(e))throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);return this._names[e]={prefix:e,index:0}}}e.Scope=i;class o extends t.Name{constructor(e,t){super(t),this.prefix=e}setValue(e,{property:r,itemIndex:n}){this.value=e,this.scopePath=t._`.${new t.Name(r)}[${n}]`}}e.ValueScopeName=o;const a=t._`\n`;e.ValueScope=class extends i{constructor(e){super(e),this._values={},this._scope=e.scope,this.opts={...e,_n:e.lines?a:t.nil}}get(){return this._scope}name(e){return new o(e,this._newName(e))}value(e,t){var r;if(void 0===t.ref)throw new Error("CodeGen: ref must be passed in value");const n=this.toName(e),{prefix:i}=n,o=null!==(r=t.key)&&void 0!==r?r:t.ref;let a=this._values[i];if(a){const e=a.get(o);if(e)return e}else a=this._values[i]=new Map;a.set(o,n);const s=this._scope[i]||(this._scope[i]=[]),c=s.length;return s[c]=t.ref,n.setValue(t,{property:i,itemIndex:c}),n}getValue(e,t){const r=this._values[e];if(r)return r.get(t)}scopeRefs(e,r=this._values){return this._reduceValues(r,r=>{if(void 0===r.scopePath)throw new Error(`CodeGen: name "${r}" has no value`);return t._`${e}${r.scopePath}`})}scopeCode(e=this._values,t,r){return this._reduceValues(e,e=>{if(void 0===e.value)throw new Error(`CodeGen: name "${e}" has no value`);return e.value.code},t,r)}_reduceValues(i,o,a={},s){let c=t.nil;for(const d in i){const u=i[d];if(!u)continue;const l=a[d]=a[d]||new Map;u.forEach(i=>{if(l.has(i))return;l.set(i,n.Started);let a=o(i);if(a){const r=this.opts.es5?e.varKinds.var:e.varKinds.const;c=t._`${c}${r} ${i} = ${a};${this.opts._n}`}else{if(!(a=null==s?void 0:s(i)))throw new r(i);c=t._`${c}${a}${this.opts._n}`}l.set(i,n.Completed)})}return c}}}(Va)),Va}function Ua(){return qa||(qa=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.or=e.and=e.not=e.CodeGen=e.operators=e.varKinds=e.ValueScopeName=e.ValueScope=e.Scope=e.Name=e.regexpCode=e.stringify=e.getProperty=e.nil=e.strConcat=e.str=e._=void 0;const t=Da(),r=Fa();var n=Da();Object.defineProperty(e,"_",{enumerable:!0,get:function(){return n._}}),Object.defineProperty(e,"str",{enumerable:!0,get:function(){return n.str}}),Object.defineProperty(e,"strConcat",{enumerable:!0,get:function(){return n.strConcat}}),Object.defineProperty(e,"nil",{enumerable:!0,get:function(){return n.nil}}),Object.defineProperty(e,"getProperty",{enumerable:!0,get:function(){return n.getProperty}}),Object.defineProperty(e,"stringify",{enumerable:!0,get:function(){return n.stringify}}),Object.defineProperty(e,"regexpCode",{enumerable:!0,get:function(){return n.regexpCode}}),Object.defineProperty(e,"Name",{enumerable:!0,get:function(){return n.Name}});var i=Fa();Object.defineProperty(e,"Scope",{enumerable:!0,get:function(){return i.Scope}}),Object.defineProperty(e,"ValueScope",{enumerable:!0,get:function(){return i.ValueScope}}),Object.defineProperty(e,"ValueScopeName",{enumerable:!0,get:function(){return i.ValueScopeName}}),Object.defineProperty(e,"varKinds",{enumerable:!0,get:function(){return i.varKinds}}),e.operators={GT:new t._Code(">"),GTE:new t._Code(">="),LT:new t._Code("<"),LTE:new t._Code("<="),EQ:new t._Code("==="),NEQ:new t._Code("!=="),NOT:new t._Code("!"),OR:new t._Code("||"),AND:new t._Code("&&"),ADD:new t._Code("+")};class o{optimizeNodes(){return this}optimizeNames(e,t){return this}}class a extends o{constructor(e,t,r){super(),this.varKind=e,this.name=t,this.rhs=r}render({es5:e,_n:t}){const n=e?r.varKinds.var:this.varKind,i=void 0===this.rhs?"":` = ${this.rhs}`;return`${n} ${this.name}${i};`+t}optimizeNames(e,t){if(e[this.name.str])return this.rhs&&(this.rhs=O(this.rhs,e,t)),this}get names(){return this.rhs instanceof t._CodeOrName?this.rhs.names:{}}}class s extends o{constructor(e,t,r){super(),this.lhs=e,this.rhs=t,this.sideEffects=r}render({_n:e}){return`${this.lhs} = ${this.rhs};`+e}optimizeNames(e,r){if(!(this.lhs instanceof t.Name)||e[this.lhs.str]||this.sideEffects)return this.rhs=O(this.rhs,e,r),this}get names(){return A(this.lhs instanceof t.Name?{}:{...this.lhs.names},this.rhs)}}class c extends s{constructor(e,t,r,n){super(e,r,n),this.op=t}render({_n:e}){return`${this.lhs} ${this.op}= ${this.rhs};`+e}}class d extends o{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`${this.label}:`+e}}class u extends o{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`break${this.label?` ${this.label}`:""};`+e}}class l extends o{constructor(e){super(),this.error=e}render({_n:e}){return`throw ${this.error};`+e}get names(){return this.error.names}}class h extends o{constructor(e){super(),this.code=e}render({_n:e}){return`${this.code};`+e}optimizeNodes(){return`${this.code}`?this:void 0}optimizeNames(e,t){return this.code=O(this.code,e,t),this}get names(){return this.code instanceof t._CodeOrName?this.code.names:{}}}class f extends o{constructor(e=[]){super(),this.nodes=e}render(e){return this.nodes.reduce((t,r)=>t+r.render(e),"")}optimizeNodes(){const{nodes:e}=this;let t=e.length;for(;t--;){const r=e[t].optimizeNodes();Array.isArray(r)?e.splice(t,1,...r):r?e[t]=r:e.splice(t,1)}return e.length>0?this:void 0}optimizeNames(e,t){const{nodes:r}=this;let n=r.length;for(;n--;){const i=r[n];i.optimizeNames(e,t)||(I(e,i.names),r.splice(n,1))}return r.length>0?this:void 0}get names(){return this.nodes.reduce((e,t)=>S(e,t.names),{})}}class m extends f{render(e){return"{"+e._n+super.render(e)+"}"+e._n}}class p extends f{}class v extends m{}v.kind="else";class b extends m{constructor(e,t){super(t),this.condition=e}render(e){let t=`if(${this.condition})`+super.render(e);return this.else&&(t+="else "+this.else.render(e)),t}optimizeNodes(){super.optimizeNodes();const e=this.condition;if(!0===e)return this.nodes;let t=this.else;if(t){const e=t.optimizeNodes();t=this.else=Array.isArray(e)?new v(e):e}return t?!1===e?t instanceof b?t:t.nodes:this.nodes.length?this:new b(_(e),t instanceof b?[t]:t.nodes):!1!==e&&this.nodes.length?this:void 0}optimizeNames(e,t){var r;if(this.else=null===(r=this.else)||void 0===r?void 0:r.optimizeNames(e,t),super.optimizeNames(e,t)||this.else)return this.condition=O(this.condition,e,t),this}get names(){const e=super.names;return A(e,this.condition),this.else&&S(e,this.else.names),e}}b.kind="if";class g extends m{}g.kind="for";class y extends g{constructor(e){super(),this.iteration=e}render(e){return`for(${this.iteration})`+super.render(e)}optimizeNames(e,t){if(super.optimizeNames(e,t))return this.iteration=O(this.iteration,e,t),this}get names(){return S(super.names,this.iteration.names)}}class w extends g{constructor(e,t,r,n){super(),this.varKind=e,this.name=t,this.from=r,this.to=n}render(e){const t=e.es5?r.varKinds.var:this.varKind,{name:n,from:i,to:o}=this;return`for(${t} ${n}=${i}; ${n}<${o}; ${n}++)`+super.render(e)}get names(){const e=A(super.names,this.from);return A(e,this.to)}}class $ extends g{constructor(e,t,r,n){super(),this.loop=e,this.varKind=t,this.name=r,this.iterable=n}render(e){return`for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})`+super.render(e)}optimizeNames(e,t){if(super.optimizeNames(e,t))return this.iterable=O(this.iterable,e,t),this}get names(){return S(super.names,this.iterable.names)}}class k extends m{constructor(e,t,r){super(),this.name=e,this.args=t,this.async=r}render(e){return`${this.async?"async ":""}function ${this.name}(${this.args})`+super.render(e)}}k.kind="func";class x extends f{render(e){return"return "+super.render(e)}}x.kind="return";class C extends m{render(e){let t="try"+super.render(e);return this.catch&&(t+=this.catch.render(e)),this.finally&&(t+=this.finally.render(e)),t}optimizeNodes(){var e,t;return super.optimizeNodes(),null===(e=this.catch)||void 0===e||e.optimizeNodes(),null===(t=this.finally)||void 0===t||t.optimizeNodes(),this}optimizeNames(e,t){var r,n;return super.optimizeNames(e,t),null===(r=this.catch)||void 0===r||r.optimizeNames(e,t),null===(n=this.finally)||void 0===n||n.optimizeNames(e,t),this}get names(){const e=super.names;return this.catch&&S(e,this.catch.names),this.finally&&S(e,this.finally.names),e}}class E extends m{constructor(e){super(),this.error=e}render(e){return`catch(${this.error})`+super.render(e)}}E.kind="catch";class j extends m{render(e){return"finally"+super.render(e)}}j.kind="finally";function S(e,t){for(const r in t)e[r]=(e[r]||0)+(t[r]||0);return e}function A(e,r){return r instanceof t._CodeOrName?S(e,r.names):e}function O(e,r,n){return e instanceof t.Name?i(e):function(e){return e instanceof t._Code&&e._items.some(e=>e instanceof t.Name&&1===r[e.str]&&void 0!==n[e.str])}(e)?new t._Code(e._items.reduce((e,r)=>(r instanceof t.Name&&(r=i(r)),r instanceof t._Code?e.push(...r._items):e.push(r),e),[])):e;function i(e){const t=n[e.str];return void 0===t||1!==r[e.str]?e:(delete r[e.str],t)}}function I(e,t){for(const r in t)e[r]=(e[r]||0)-(t[r]||0)}function _(e){return"boolean"==typeof e||"number"==typeof e||null===e?!e:t._`!${T(e)}`}e.CodeGen=class{constructor(e,t={}){this._values={},this._blockStarts=[],this._constants={},this.opts={...t,_n:t.lines?"\n":""},this._extScope=e,this._scope=new r.Scope({parent:e}),this._nodes=[new p]}toString(){return this._root.render(this.opts)}name(e){return this._scope.name(e)}scopeName(e){return this._extScope.name(e)}scopeValue(e,t){const r=this._extScope.value(e,t);return(this._values[r.prefix]||(this._values[r.prefix]=new Set)).add(r),r}getScopeValue(e,t){return this._extScope.getValue(e,t)}scopeRefs(e){return this._extScope.scopeRefs(e,this._values)}scopeCode(){return this._extScope.scopeCode(this._values)}_def(e,t,r,n){const i=this._scope.toName(t);return void 0!==r&&n&&(this._constants[i.str]=r),this._leafNode(new a(e,i,r)),i}const(e,t,n){return this._def(r.varKinds.const,e,t,n)}let(e,t,n){return this._def(r.varKinds.let,e,t,n)}var(e,t,n){return this._def(r.varKinds.var,e,t,n)}assign(e,t,r){return this._leafNode(new s(e,t,r))}add(t,r){return this._leafNode(new c(t,e.operators.ADD,r))}code(e){return"function"==typeof e?e():e!==t.nil&&this._leafNode(new h(e)),this}object(...e){const r=["{"];for(const[n,i]of e)r.length>1&&r.push(","),r.push(n),(n!==i||this.opts.es5)&&(r.push(":"),(0,t.addCodeArg)(r,i));return r.push("}"),new t._Code(r)}if(e,t,r){if(this._blockNode(new b(e)),t&&r)this.code(t).else().code(r).endIf();else if(t)this.code(t).endIf();else if(r)throw new Error('CodeGen: "else" body without "then" body');return this}elseIf(e){return this._elseNode(new b(e))}else(){return this._elseNode(new v)}endIf(){return this._endBlockNode(b,v)}_for(e,t){return this._blockNode(e),t&&this.code(t).endFor(),this}for(e,t){return this._for(new y(e),t)}forRange(e,t,n,i,o=(this.opts.es5?r.varKinds.var:r.varKinds.let)){const a=this._scope.toName(e);return this._for(new w(o,a,t,n),()=>i(a))}forOf(e,n,i,o=r.varKinds.const){const a=this._scope.toName(e);if(this.opts.es5){const e=n instanceof t.Name?n:this.var("_arr",n);return this.forRange("_i",0,t._`${e}.length`,r=>{this.var(a,t._`${e}[${r}]`),i(a)})}return this._for(new $("of",o,a,n),()=>i(a))}forIn(e,n,i,o=(this.opts.es5?r.varKinds.var:r.varKinds.const)){if(this.opts.ownProperties)return this.forOf(e,t._`Object.keys(${n})`,i);const a=this._scope.toName(e);return this._for(new $("in",o,a,n),()=>i(a))}endFor(){return this._endBlockNode(g)}label(e){return this._leafNode(new d(e))}break(e){return this._leafNode(new u(e))}return(e){const t=new x;if(this._blockNode(t),this.code(e),1!==t.nodes.length)throw new Error('CodeGen: "return" should have one node');return this._endBlockNode(x)}try(e,t,r){if(!t&&!r)throw new Error('CodeGen: "try" without "catch" and "finally"');const n=new C;if(this._blockNode(n),this.code(e),t){const e=this.name("e");this._currNode=n.catch=new E(e),t(e)}return r&&(this._currNode=n.finally=new j,this.code(r)),this._endBlockNode(E,j)}throw(e){return this._leafNode(new l(e))}block(e,t){return this._blockStarts.push(this._nodes.length),e&&this.code(e).endBlock(t),this}endBlock(e){const t=this._blockStarts.pop();if(void 0===t)throw new Error("CodeGen: not in self-balancing block");const r=this._nodes.length-t;if(r<0||void 0!==e&&r!==e)throw new Error(`CodeGen: wrong number of nodes: ${r} vs ${e} expected`);return this._nodes.length=t,this}func(e,r=t.nil,n,i){return this._blockNode(new k(e,r,n)),i&&this.code(i).endFunc(),this}endFunc(){return this._endBlockNode(k)}optimize(e=1){for(;e-- >0;)this._root.optimizeNodes(),this._root.optimizeNames(this._root.names,this._constants)}_leafNode(e){return this._currNode.nodes.push(e),this}_blockNode(e){this._currNode.nodes.push(e),this._nodes.push(e)}_endBlockNode(e,t){const r=this._currNode;if(r instanceof e||t&&r instanceof t)return this._nodes.pop(),this;throw new Error(`CodeGen: not in block "${t?`${e.kind}/${t.kind}`:e.kind}"`)}_elseNode(e){const t=this._currNode;if(!(t instanceof b))throw new Error('CodeGen: "else" without "if"');return this._currNode=t.else=e,this}get _root(){return this._nodes[0]}get _currNode(){const e=this._nodes;return e[e.length-1]}set _currNode(e){const t=this._nodes;t[t.length-1]=e}},e.not=_;const z=R(e.operators.AND);e.and=function(...e){return e.reduce(z)};const N=R(e.operators.OR);function R(e){return(r,n)=>r===t.nil?n:n===t.nil?r:t._`${T(r)} ${e} ${T(n)}`}function T(e){return e instanceof t.Name?e:t._`(${e})`}e.or=function(...e){return e.reduce(N)}}(Pa)),Pa}var Ha,Wa={};function Ka(){if(Ha)return Wa;Ha=1,Object.defineProperty(Wa,"m",{value:!0}),Wa.checkStrictMode=Wa.getErrorPath=Wa.Type=Wa.useFunc=Wa.setEvaluated=Wa.evaluatedPropsToName=Wa.mergeEvaluated=Wa.eachItem=Wa.unescapeJsonPointer=Wa.escapeJsonPointer=Wa.escapeFragment=Wa.unescapeFragment=Wa.schemaRefOrVal=Wa.schemaHasRulesButRef=Wa.schemaHasRules=Wa.checkUnknownRules=Wa.alwaysValidSchema=Wa.toHash=void 0;const e=Ua(),t=Da();function r(e,t=e.schema){const{opts:r,self:n}=e;if(!r.strictSchema)return;if("boolean"==typeof t)return;const i=n.RULES.keywords;for(const r in t)i[r]||l(e,`unknown keyword: "${r}"`)}function n(e,t){if("boolean"==typeof e)return!e;for(const r in e)if(t[r])return!0;return!1}function i(e){return"number"==typeof e?`${e}`:e.replace(/~/g,"~0").replace(/\//g,"~1")}function o(e){return e.replace(/~1/g,"/").replace(/~0/g,"~")}function a({mergeNames:t,mergeToName:r,mergeValues:n,resultToName:i}){return(o,a,s,c)=>{const d=void 0===s?a:s instanceof e.Name?(a instanceof e.Name?t(o,a,s):r(o,a,s),s):a instanceof e.Name?(r(o,s,a),a):n(a,s);return c!==e.Name||d instanceof e.Name?d:i(o,d)}}function s(t,r){if(!0===r)return t.var("props",!0);const n=t.var("props",e._`{}`);return void 0!==r&&c(t,n,r),n}function c(t,r,n){Object.keys(n).forEach(n=>t.assign(e._`${r}${(0,e.getProperty)(n)}`,!0))}Wa.toHash=function(e){const t={};for(const r of e)t[r]=!0;return t},Wa.alwaysValidSchema=function(e,t){return"boolean"==typeof t?t:0===Object.keys(t).length||(r(e,t),!n(t,e.self.RULES.all))},Wa.checkUnknownRules=r,Wa.schemaHasRules=n,Wa.schemaHasRulesButRef=function(e,t){if("boolean"==typeof e)return!e;for(const r in e)if("$ref"!==r&&t.all[r])return!0;return!1},Wa.schemaRefOrVal=function({topSchemaRef:t,schemaPath:r},n,i,o){if(!o){if("number"==typeof n||"boolean"==typeof n)return n;if("string"==typeof n)return e._`${n}`}return e._`${t}${r}${(0,e.getProperty)(i)}`},Wa.unescapeFragment=function(e){return o(decodeURIComponent(e))},Wa.escapeFragment=function(e){return encodeURIComponent(i(e))},Wa.escapeJsonPointer=i,Wa.unescapeJsonPointer=o,Wa.eachItem=function(e,t){if(Array.isArray(e))for(const r of e)t(r);else t(e)},Wa.mergeEvaluated={props:a({mergeNames:(t,r,n)=>t.if(e._`${n} !== true && ${r} !== undefined`,()=>{t.if(e._`${r} === true`,()=>t.assign(n,!0),()=>t.assign(n,e._`${n} || {}`).code(e._`Object.assign(${n}, ${r})`))}),mergeToName:(t,r,n)=>t.if(e._`${n} !== true`,()=>{!0===r?t.assign(n,!0):(t.assign(n,e._`${n} || {}`),c(t,n,r))}),mergeValues:(e,t)=>!0===e||{...e,...t},resultToName:s}),items:a({mergeNames:(t,r,n)=>t.if(e._`${n} !== true && ${r} !== undefined`,()=>t.assign(n,e._`${r} === true ? true : ${n} > ${r} ? ${n} : ${r}`)),mergeToName:(t,r,n)=>t.if(e._`${n} !== true`,()=>t.assign(n,!0===r||e._`${n} > ${r} ? ${n} : ${r}`)),mergeValues:(e,t)=>!0===e||Math.max(e,t),resultToName:(e,t)=>e.var("items",t)})},Wa.evaluatedPropsToName=s,Wa.setEvaluated=c;const d={};var u;function l(e,t,r=e.opts.strictSchema){if(r){if(t=`strict mode: ${t}`,!0===r)throw new Error(t);e.self.logger.warn(t)}}return Wa.useFunc=function(e,r){return e.scopeValue("func",{ref:r,code:d[r.code]||(d[r.code]=new t._Code(r.code))})},function(e){e[e.Num=0]="Num",e[e.Str=1]="Str"}(u||(Wa.Type=u={})),Wa.getErrorPath=function(t,r,n){if(t instanceof e.Name){const i=r===u.Num;return n?i?e._`"[" + ${t} + "]"`:e._`"['" + ${t} + "']"`:i?e._`"/" + ${t}`:e._`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`}return n?(0,e.getProperty)(t).toString():"/"+i(t)},Wa.checkStrictMode=l,Wa}var Ga,Ya,Ja,Za={};function Qa(){if(Ga)return Za;Ga=1,Object.defineProperty(Za,"m",{value:!0});const e=Ua(),t={data:new e.Name("data"),valCxt:new e.Name("valCxt"),instancePath:new e.Name("instancePath"),parentData:new e.Name("parentData"),parentDataProperty:new e.Name("parentDataProperty"),rootData:new e.Name("rootData"),dynamicAnchors:new e.Name("dynamicAnchors"),vErrors:new e.Name("vErrors"),errors:new e.Name("errors"),this:new e.Name("this"),self:new e.Name("self"),scope:new e.Name("scope"),json:new e.Name("json"),jsonPos:new e.Name("jsonPos"),jsonLen:new e.Name("jsonLen"),jsonPart:new e.Name("jsonPart")};return Za.default=t,Za}function Xa(){return Ya||(Ya=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.extendErrors=e.resetErrorsCount=e.reportExtraError=e.reportError=e.keyword$DataError=e.keywordError=void 0;const t=Ua(),r=Ka(),n=Qa();function i(e,r){const i=e.const("err",r);e.if(t._`${n.default.vErrors} === null`,()=>e.assign(n.default.vErrors,t._`[${i}]`),t._`${n.default.vErrors}.push(${i})`),e.code(t._`${n.default.errors}++`)}function o(e,r){const{gen:n,validateName:i,schemaEnv:o}=e;o.$async?n.throw(t._`new ${e.ValidationError}(${r})`):(n.assign(t._`${i}.errors`,r),n.return(!1))}e.keywordError={message:({keyword:e})=>t.str`must pass "${e}" keyword validation`},e.keyword$DataError={message:({keyword:e,schemaType:r})=>r?t.str`"${e}" keyword must be ${r} ($data)`:t.str`"${e}" keyword is invalid ($data)`},e.reportError=function(r,n=e.keywordError,a,c){const{it:d}=r,{gen:u,compositeRule:l,allErrors:h}=d,f=s(r,n,a);(null!=c?c:l||h)?i(u,f):o(d,t._`[${f}]`)},e.reportExtraError=function(t,r=e.keywordError,a){const{it:c}=t,{gen:d,compositeRule:u,allErrors:l}=c;i(d,s(t,r,a)),u||l||o(c,n.default.vErrors)},e.resetErrorsCount=function(e,r){e.assign(n.default.errors,r),e.if(t._`${n.default.vErrors} !== null`,()=>e.if(r,()=>e.assign(t._`${n.default.vErrors}.length`,r),()=>e.assign(n.default.vErrors,null)))},e.extendErrors=function({gen:e,keyword:r,schemaValue:i,data:o,errsCount:a,it:s}){if(void 0===a)throw new Error("ajv implementation error");const c=e.name("err");e.forRange("i",a,n.default.errors,a=>{e.const(c,t._`${n.default.vErrors}[${a}]`),e.if(t._`${c}.instancePath === undefined`,()=>e.assign(t._`${c}.instancePath`,(0,t.strConcat)(n.default.instancePath,s.errorPath))),e.assign(t._`${c}.schemaPath`,t.str`${s.errSchemaPath}/${r}`),s.opts.verbose&&(e.assign(t._`${c}.schema`,i),e.assign(t._`${c}.data`,o))})};const a={keyword:new t.Name("keyword"),schemaPath:new t.Name("schemaPath"),params:new t.Name("params"),propertyName:new t.Name("propertyName"),message:new t.Name("message"),schema:new t.Name("schema"),parentSchema:new t.Name("parentSchema")};function s(e,r,i){const{createErrors:o}=e.it;return!1===o?t._`{}`:function(e,r,i={}){const{gen:o,it:s}=e,u=[c(s,i),d(e,i)];return function(e,{params:r,message:i},o){const{keyword:s,data:c,schemaValue:d,it:u}=e,{opts:l,propertyName:h,topSchemaRef:f,schemaPath:m}=u;o.push([a.keyword,s],[a.params,"function"==typeof r?r(e):r||t._`{}`]),l.messages&&o.push([a.message,"function"==typeof i?i(e):i]);l.verbose&&o.push([a.schema,d],[a.parentSchema,t._`${f}${m}`],[n.default.data,c]);h&&o.push([a.propertyName,h])}(e,r,u),o.object(...u)}(e,r,i)}function c({errorPath:e},{instancePath:i}){const o=i?t.str`${e}${(0,r.getErrorPath)(i,r.Type.Str)}`:e;return[n.default.instancePath,(0,t.strConcat)(n.default.instancePath,o)]}function d({keyword:e,it:{errSchemaPath:n}},{schemaPath:i,parentSchema:o}){let s=o?n:t.str`${n}/${e}`;return i&&(s=t.str`${s}${(0,r.getErrorPath)(i,r.Type.Str)}`),[a.schemaPath,s]}}(Ma)),Ma}function es(){if(Ja)return Ta;Ja=1,Object.defineProperty(Ta,"m",{value:!0}),Ta.boolOrEmptySchema=Ta.topBoolOrEmptySchema=void 0;const e=Xa(),t=Ua(),r=Qa(),n={message:"boolean schema is false"};function i(t,r){const{gen:i,data:o}=t,a={gen:i,keyword:"false schema",data:o,schema:!1,schemaCode:!1,schemaValue:!1,params:{},it:t};(0,e.reportError)(a,n,void 0,r)}return Ta.topBoolOrEmptySchema=function(e){const{gen:n,schema:o,validateName:a}=e;!1===o?i(e,!1):"object"==typeof o&&!0===o.$async?n.return(r.default.data):(n.assign(t._`${a}.errors`,null),n.return(!0))},Ta.boolOrEmptySchema=function(e,t){const{gen:r,schema:n}=e;!1===n?(r.var(t,!1),i(e)):r.var(t,!0)},Ta}var ts,rs={},ns={};function is(){if(ts)return ns;ts=1,Object.defineProperty(ns,"m",{value:!0}),ns.getRules=ns.isJSONType=void 0;const e=new Set(["string","number","integer","boolean","null","object","array"]);return ns.isJSONType=function(t){return"string"==typeof t&&e.has(t)},ns.getRules=function(){const e={number:{type:"number",rules:[]},string:{type:"string",rules:[]},array:{type:"array",rules:[]},object:{type:"object",rules:[]}};return{types:{...e,integer:!0,boolean:!0,null:!0},rules:[{rules:[]},e.number,e.string,e.array,e.object],post:{rules:[]},all:{},keywords:{}}},ns}var os,as,ss={};function cs(){if(os)return ss;function e(e,r){return r.rules.some(r=>t(e,r))}function t(e,t){var r;return void 0!==e[t.keyword]||(null===(r=t.definition.implements)||void 0===r?void 0:r.some(t=>void 0!==e[t]))}return os=1,Object.defineProperty(ss,"m",{value:!0}),ss.shouldUseRule=ss.shouldUseGroup=ss.schemaHasRulesForType=void 0,ss.schemaHasRulesForType=function({schema:t,self:r},n){const i=r.RULES.types[n];return i&&!0!==i&&e(t,i)},ss.shouldUseGroup=e,ss.shouldUseRule=t,ss}function ds(){if(as)return rs;as=1,Object.defineProperty(rs,"m",{value:!0}),rs.reportTypeError=rs.checkDataTypes=rs.checkDataType=rs.coerceAndCheckDataType=rs.getJSONTypes=rs.getSchemaTypes=rs.DataType=void 0;const e=is(),t=cs(),r=Xa(),n=Ua(),i=Ka();var o;function a(t){const r=Array.isArray(t)?t:t?[t]:[];if(r.every(e.isJSONType))return r;throw new Error("type must be JSONType or JSONType[]: "+r.join(","))}!function(e){e[e.Correct=0]="Correct",e[e.Wrong=1]="Wrong"}(o||(rs.DataType=o={})),rs.getSchemaTypes=function(e){const t=a(e.type);if(t.includes("null")){if(!1===e.nullable)throw new Error("type: null contradicts nullable: false")}else{if(!t.length&&void 0!==e.nullable)throw new Error('"nullable" cannot be used without "type"');!0===e.nullable&&t.push("null")}return t},rs.getJSONTypes=a,rs.coerceAndCheckDataType=function(e,r){const{gen:i,data:a,opts:c}=e,u=function(e,t){return t?e.filter(e=>s.has(e)||"array"===t&&"array"===e):[]}(r,c.coerceTypes),h=r.length>0&&!(0===u.length&&1===r.length&&(0,t.schemaHasRulesForType)(e,r[0]));if(h){const t=d(r,a,c.strictNumbers,o.Wrong);i.if(t,()=>{u.length?function(e,t,r){const{gen:i,data:o,opts:a}=e,c=i.let("dataType",n._`typeof ${o}`),u=i.let("coerced",n._`undefined`);"array"===a.coerceTypes&&i.if(n._`${c} == 'object' && Array.isArray(${o}) && ${o}.length == 1`,()=>i.assign(o,n._`${o}[0]`).assign(c,n._`typeof ${o}`).if(d(t,o,a.strictNumbers),()=>i.assign(u,o)));i.if(n._`${u} !== undefined`);for(const e of r)(s.has(e)||"array"===e&&"array"===a.coerceTypes)&&h(e);function h(e){switch(e){case"string":return void i.elseIf(n._`${c} == "number" || ${c} == "boolean"`).assign(u,n._`"" + ${o}`).elseIf(n._`${o} === null`).assign(u,n._`""`);case"number":return void i.elseIf(n._`${c} == "boolean" || ${o} === null
              || (${c} == "string" && ${o} && ${o} == +${o})`).assign(u,n._`+${o}`);case"integer":return void i.elseIf(n._`${c} === "boolean" || ${o} === null
              || (${c} === "string" && ${o} && ${o} == +${o} && !(${o} % 1))`).assign(u,n._`+${o}`);case"boolean":return void i.elseIf(n._`${o} === "false" || ${o} === 0 || ${o} === null`).assign(u,!1).elseIf(n._`${o} === "true" || ${o} === 1`).assign(u,!0);case"null":return i.elseIf(n._`${o} === "" || ${o} === 0 || ${o} === false`),void i.assign(u,null);case"array":i.elseIf(n._`${c} === "string" || ${c} === "number"
              || ${c} === "boolean" || ${o} === null`).assign(u,n._`[${o}]`)}}i.else(),l(e),i.endIf(),i.if(n._`${u} !== undefined`,()=>{i.assign(o,u),function({gen:e,parentData:t,parentDataProperty:r},i){e.if(n._`${t} !== undefined`,()=>e.assign(n._`${t}[${r}]`,i))}(e,u)})}(e,r,u):l(e)})}return h};const s=new Set(["string","number","integer","boolean","null"]);function c(e,t,r,i=o.Correct){const a=i===o.Correct?n.operators.EQ:n.operators.NEQ;let s;switch(e){case"null":return n._`${t} ${a} null`;case"array":s=n._`Array.isArray(${t})`;break;case"object":s=n._`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;break;case"integer":s=c(n._`!(${t} % 1) && !isNaN(${t})`);break;case"number":s=c();break;default:return n._`typeof ${t} ${a} ${e}`}return i===o.Correct?s:(0,n.not)(s);function c(e=n.nil){return(0,n.and)(n._`typeof ${t} == "number"`,e,r?n._`isFinite(${t})`:n.nil)}}function d(e,t,r,o){if(1===e.length)return c(e[0],t,r,o);let a;const s=(0,i.toHash)(e);if(s.array&&s.object){const e=n._`typeof ${t} != "object"`;a=s.null?e:n._`!${t} || ${e}`,delete s.null,delete s.array,delete s.object}else a=n.nil;s.number&&delete s.integer;for(const e in s)a=(0,n.and)(a,c(e,t,r,o));return a}rs.checkDataType=c,rs.checkDataTypes=d;const u={message:({schema:e})=>`must be ${e}`,params:({schema:e,schemaValue:t})=>"string"==typeof e?n._`{type: ${e}}`:n._`{type: ${t}}`};function l(e){const t=function(e){const{gen:t,data:r,schema:n}=e,o=(0,i.schemaRefOrVal)(e,n,"type");return{gen:t,keyword:"type",data:r,schema:n.type,schemaCode:o,schemaValue:o,parentSchema:n,params:{},it:e}}(e);(0,r.reportError)(t,u)}return rs.reportTypeError=l,rs}var us,ls={};function hs(){if(us)return ls;us=1,Object.defineProperty(ls,"m",{value:!0}),ls.assignDefaults=void 0;const e=Ua(),t=Ka();function r(r,n,i){const{gen:o,compositeRule:a,data:s,opts:c}=r;if(void 0===i)return;const d=e._`${s}${(0,e.getProperty)(n)}`;if(a)return void(0,t.checkStrictMode)(r,`default is ignored for: ${d}`);let u=e._`${d} === undefined`;"empty"===c.useDefaults&&(u=e._`${u} || ${d} === null || ${d} === ""`),o.if(u,e._`${d} = ${(0,e.stringify)(i)}`)}return ls.assignDefaults=function(e,t){const{properties:n,items:i}=e.schema;if("object"===t&&n)for(const t in n)r(e,t,n[t].default);else"array"===t&&Array.isArray(i)&&i.forEach((t,n)=>r(e,n,t.default))},ls}var fs,ms,ps={},vs={};function bs(){if(fs)return vs;fs=1,Object.defineProperty(vs,"m",{value:!0}),vs.validateUnion=vs.validateArray=vs.usePattern=vs.callValidateCode=vs.schemaProperties=vs.allSchemaProperties=vs.noPropertyInData=vs.propertyInData=vs.isOwnProperty=vs.hasPropFunc=vs.reportMissingProp=vs.checkMissingProp=vs.checkReportMissingProp=void 0;const e=Ua(),t=Ka(),r=Qa(),n=Ka();function i(t){return t.scopeValue("func",{ref:Object.prototype.hasOwnProperty,code:e._`Object.prototype.hasOwnProperty`})}function o(t,r,n){return e._`${i(t)}.call(${r}, ${n})`}function a(t,r,n,i){const a=e._`${r}${(0,e.getProperty)(n)} === undefined`;return i?(0,e.or)(a,(0,e.not)(o(t,r,n))):a}function s(e){return e?Object.keys(e).filter(e=>"__proto__"!==e):[]}vs.checkReportMissingProp=function(t,r){const{gen:n,data:i,it:o}=t;n.if(a(n,i,r,o.opts.ownProperties),()=>{t.setParams({missingProperty:e._`${r}`},!0),t.error()})},vs.checkMissingProp=function({gen:t,data:r,it:{opts:n}},i,o){return(0,e.or)(...i.map(i=>(0,e.and)(a(t,r,i,n.ownProperties),e._`${o} = ${i}`)))},vs.reportMissingProp=function(e,t){e.setParams({missingProperty:t},!0),e.error()},vs.hasPropFunc=i,vs.isOwnProperty=o,vs.propertyInData=function(t,r,n,i){const a=e._`${r}${(0,e.getProperty)(n)} !== undefined`;return i?e._`${a} && ${o(t,r,n)}`:a},vs.noPropertyInData=a,vs.allSchemaProperties=s,vs.schemaProperties=function(e,r){return s(r).filter(n=>!(0,t.alwaysValidSchema)(e,r[n]))},vs.callValidateCode=function({schemaCode:t,data:n,it:{gen:i,topSchemaRef:o,schemaPath:a,errorPath:s},it:c},d,u,l){const h=l?e._`${t}, ${n}, ${o}${a}`:n,f=[[r.default.instancePath,(0,e.strConcat)(r.default.instancePath,s)],[r.default.parentData,c.parentData],[r.default.parentDataProperty,c.parentDataProperty],[r.default.rootData,r.default.rootData]];c.opts.dynamicRef&&f.push([r.default.dynamicAnchors,r.default.dynamicAnchors]);const m=e._`${h}, ${i.object(...f)}`;return u!==e.nil?e._`${d}.call(${u}, ${m})`:e._`${d}(${m})`};const c=e._`new RegExp`;return vs.usePattern=function({gen:t,it:{opts:r}},i){const o=r.unicodeRegExp?"u":"",{regExp:a}=r.code,s=a(i,o);return t.scopeValue("pattern",{key:s.toString(),ref:s,code:e._`${"new RegExp"===a.code?c:(0,n.useFunc)(t,a)}(${i}, ${o})`})},vs.validateArray=function(r){const{gen:n,data:i,keyword:o,it:a}=r,s=n.name("valid");if(a.allErrors){const e=n.let("valid",!0);return c(()=>n.assign(e,!1)),e}return n.var(s,!0),c(()=>n.break()),s;function c(a){const c=n.const("len",e._`${i}.length`);n.forRange("i",0,c,i=>{r.subschema({keyword:o,dataProp:i,dataPropType:t.Type.Num},s),n.if((0,e.not)(s),a)})}},vs.validateUnion=function(r){const{gen:n,schema:i,keyword:o,it:a}=r;if(!Array.isArray(i))throw new Error("ajv implementation error");if(i.some(e=>(0,t.alwaysValidSchema)(a,e))&&!a.opts.unevaluated)return;const s=n.let("valid",!1),c=n.name("_valid");n.block(()=>i.forEach((t,i)=>{const a=r.subschema({keyword:o,schemaProp:i,compositeRule:!0},c);n.assign(s,e._`${s} || ${c}`);r.mergeValidEvaluated(a,c)||n.if((0,e.not)(s))})),r.result(s,()=>r.reset(),()=>r.error(!0))},vs}function gs(){if(ms)return ps;ms=1,Object.defineProperty(ps,"m",{value:!0}),ps.validateKeywordUsage=ps.validSchemaType=ps.funcKeywordCode=ps.macroKeywordCode=void 0;const e=Ua(),t=Qa(),r=bs(),n=Xa();function i(t){const{gen:r,data:n,it:i}=t;r.if(i.parentData,()=>r.assign(n,e._`${i.parentData}[${i.parentDataProperty}]`))}function o(t,r,n){if(void 0===n)throw new Error(`keyword "${r}" failed to compile`);return t.scopeValue("keyword","function"==typeof n?{ref:n}:{ref:n,code:(0,e.stringify)(n)})}return ps.macroKeywordCode=function(t,r){const{gen:n,keyword:i,schema:a,parentSchema:s,it:c}=t,d=r.macro.call(c.self,a,s,c),u=o(n,i,d);!1!==c.opts.validateSchema&&c.self.validateSchema(d,!0);const l=n.name("valid");t.subschema({schema:d,schemaPath:e.nil,errSchemaPath:`${c.errSchemaPath}/${i}`,topSchemaRef:u,compositeRule:!0},l),t.pass(l,()=>t.error(!0))},ps.funcKeywordCode=function(a,s){var c;const{gen:d,keyword:u,schema:l,parentSchema:h,$data:f,it:m}=a;!function({schemaEnv:e},t){if(t.async&&!e.$async)throw new Error("async keyword in sync schema")}(m,s);const p=!f&&s.compile?s.compile.call(m.self,l,h,m):s.validate,v=o(d,u,p),b=d.let("valid");function g(n=(s.async?e._`await `:e.nil)){const i=m.opts.passContext?t.default.this:t.default.self,o=!("compile"in s&&!f||!1===s.schema);d.assign(b,e._`${n}${(0,r.callValidateCode)(a,v,i,o)}`,s.modifying)}function y(t){var r;d.if((0,e.not)(null!==(r=s.valid)&&void 0!==r?r:b),t)}a.block$data(b,function(){if(!1===s.errors)g(),s.modifying&&i(a),y(()=>a.error());else{const r=s.async?function(){const t=d.let("ruleErrs",null);return d.try(()=>g(e._`await `),r=>d.assign(b,!1).if(e._`${r} instanceof ${m.ValidationError}`,()=>d.assign(t,e._`${r}.errors`),()=>d.throw(r))),t}():function(){const t=e._`${v}.errors`;return d.assign(t,null),g(e.nil),t}();s.modifying&&i(a),y(()=>function(r,i){const{gen:o}=r;o.if(e._`Array.isArray(${i})`,()=>{o.assign(t.default.vErrors,e._`${t.default.vErrors} === null ? ${i} : ${t.default.vErrors}.concat(${i})`).assign(t.default.errors,e._`${t.default.vErrors}.length`),(0,n.extendErrors)(r)},()=>r.error())}(a,r))}}),a.ok(null!==(c=s.valid)&&void 0!==c?c:b)},ps.validSchemaType=function(e,t,r=!1){return!t.length||t.some(t=>"array"===t?Array.isArray(e):"object"===t?e&&"object"==typeof e&&!Array.isArray(e):typeof e==t||r&&void 0===e)},ps.validateKeywordUsage=function({schema:e,opts:t,self:r,errSchemaPath:n},i,o){if(Array.isArray(i.keyword)?!i.keyword.includes(o):i.keyword!==o)throw new Error("ajv implementation error");const a=i.dependencies;if(null==a?void 0:a.some(t=>!Object.prototype.hasOwnProperty.call(e,t)))throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);if(i.validateSchema){if(!i.validateSchema(e[o])){const e=`keyword "${o}" value is invalid at path "${n}": `+r.errorsText(i.validateSchema.errors);if("log"!==t.validateSchema)throw new Error(e);r.logger.error(e)}}},ps}var ys,ws={};function $s(){if(ys)return ws;ys=1,Object.defineProperty(ws,"m",{value:!0}),ws.extendSubschemaMode=ws.extendSubschemaData=ws.getSubschema=void 0;const e=Ua(),t=Ka();return ws.getSubschema=function(r,{keyword:n,schemaProp:i,schema:o,schemaPath:a,errSchemaPath:s,topSchemaRef:c}){if(void 0!==n&&void 0!==o)throw new Error('both "keyword" and "schema" passed, only one allowed');if(void 0!==n){const o=r.schema[n];return void 0===i?{schema:o,schemaPath:e._`${r.schemaPath}${(0,e.getProperty)(n)}`,errSchemaPath:`${r.errSchemaPath}/${n}`}:{schema:o[i],schemaPath:e._`${r.schemaPath}${(0,e.getProperty)(n)}${(0,e.getProperty)(i)}`,errSchemaPath:`${r.errSchemaPath}/${n}/${(0,t.escapeFragment)(i)}`}}if(void 0!==o){if(void 0===a||void 0===s||void 0===c)throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');return{schema:o,schemaPath:a,topSchemaRef:c,errSchemaPath:s}}throw new Error('either "keyword" or "schema" must be passed')},ws.extendSubschemaData=function(r,n,{dataProp:i,dataPropType:o,data:a,dataTypes:s,propertyName:c}){if(void 0!==a&&void 0!==i)throw new Error('both "data" and "dataProp" passed, only one allowed');const{gen:d}=n;if(void 0!==i){const{errorPath:a,dataPathArr:s,opts:c}=n;u(d.let("data",e._`${n.data}${(0,e.getProperty)(i)}`,!0)),r.errorPath=e.str`${a}${(0,t.getErrorPath)(i,o,c.jsPropertySyntax)}`,r.parentDataProperty=e._`${i}`,r.dataPathArr=[...s,r.parentDataProperty]}if(void 0!==a){u(a instanceof e.Name?a:d.let("data",a,!0)),void 0!==c&&(r.propertyName=c)}function u(e){r.data=e,r.dataLevel=n.dataLevel+1,r.dataTypes=[],n.definedProperties=new Set,r.parentData=n.data,r.dataNames=[...n.dataNames,e]}s&&(r.dataTypes=s)},ws.extendSubschemaMode=function(e,{jtdDiscriminator:t,jtdMetadata:r,compositeRule:n,createErrors:i,allErrors:o}){void 0!==n&&(e.compositeRule=n),void 0!==i&&(e.createErrors=i),void 0!==o&&(e.allErrors=o),e.jtdDiscriminator=t,e.jtdMetadata=r},ws}var ks,xs,Cs={};function Es(){return xs||(xs=1,ks=function e(t,r){if(t===r)return!0;if(t&&r&&"object"==typeof t&&"object"==typeof r){if(t.constructor!==r.constructor)return!1;var n,i,o;if(Array.isArray(t)){if((n=t.length)!=r.length)return!1;for(i=n;0!==i--;)if(!e(t[i],r[i]))return!1;return!0}if(t.constructor===RegExp)return t.source===r.source&&t.flags===r.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===r.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===r.toString();if((n=(o=Object.keys(t)).length)!==Object.keys(r).length)return!1;for(i=n;0!==i--;)if(!Object.prototype.hasOwnProperty.call(r,o[i]))return!1;for(i=n;0!==i--;){var a=o[i];if(!e(t[a],r[a]))return!1}return!0}return t!=t&&r!=r}),ks}var js,Ss,As,Os={exports:{}};function Is(){if(js)return Os.exports;js=1;var e=Os.exports=function(e,r,n){"function"==typeof r&&(n=r,r={}),t(r,"function"==typeof(n=r.cb||n)?n:n.pre||function(){},n.post||function(){},e,"",e)};function t(n,i,o,a,s,c,d,u,l,h){if(a&&"object"==typeof a&&!Array.isArray(a)){for(var f in i(a,s,c,d,u,l,h),a){var m=a[f];if(Array.isArray(m)){if(f in e.arrayKeywords)for(var p=0;p<m.length;p++)t(n,i,o,m[p],s+"/"+f+"/"+p,c,s,f,a,p)}else if(f in e.propsKeywords){if(m&&"object"==typeof m)for(var v in m)t(n,i,o,m[v],s+"/"+f+"/"+r(v),c,s,f,a,v)}else(f in e.keywords||n.allKeys&&!(f in e.skipKeywords))&&t(n,i,o,m,s+"/"+f,c,s,f,a)}o(a,s,c,d,u,l,h)}}function r(e){return e.replace(/~/g,"~0").replace(/\//g,"~1")}return e.keywords={additionalItems:!0,items:!0,contains:!0,additionalProperties:!0,propertyNames:!0,not:!0,if:!0,then:!0,else:!0},e.arrayKeywords={items:!0,allOf:!0,anyOf:!0,oneOf:!0},e.propsKeywords={$defs:!0,definitions:!0,properties:!0,patternProperties:!0,dependencies:!0},e.skipKeywords={default:!0,enum:!0,const:!0,required:!0,maximum:!0,minimum:!0,exclusiveMaximum:!0,exclusiveMinimum:!0,multipleOf:!0,maxLength:!0,minLength:!0,pattern:!0,format:!0,maxItems:!0,minItems:!0,uniqueItems:!0,maxProperties:!0,minProperties:!0},Os.exports}function _s(){if(Ss)return Cs;Ss=1,Object.defineProperty(Cs,"m",{value:!0}),Cs.getSchemaRefs=Cs.resolveUrl=Cs.normalizeId=Cs._getFullPath=Cs.getFullPath=Cs.inlineRef=void 0;const e=Ka(),t=Es(),r=Is(),n=new Set(["type","format","pattern","maxLength","minLength","maxProperties","minProperties","maxItems","minItems","maximum","minimum","uniqueItems","multipleOf","required","enum","const"]);Cs.inlineRef=function(e,t=!0){return"boolean"==typeof e||(!0===t?!o(e):!!t&&a(e)<=t)};const i=new Set(["$ref","$recursiveRef","$recursiveAnchor","$dynamicRef","$dynamicAnchor"]);function o(e){for(const t in e){if(i.has(t))return!0;const r=e[t];if(Array.isArray(r)&&r.some(o))return!0;if("object"==typeof r&&o(r))return!0}return!1}function a(t){let r=0;for(const i in t){if("$ref"===i)return 1/0;if(r++,!n.has(i)&&("object"==typeof t[i]&&(0,e.eachItem)(t[i],e=>r+=a(e)),r===1/0))return 1/0}return r}function s(e,t="",r){!1!==r&&(t=u(t));const n=e.parse(t);return c(e,n)}function c(e,t){return e.serialize(t).split("#")[0]+"#"}Cs.getFullPath=s,Cs._getFullPath=c;const d=/#\/?$/;function u(e){return e?e.replace(d,""):""}Cs.normalizeId=u,Cs.resolveUrl=function(e,t,r){return r=u(r),e.resolve(t,r)};const l=/^[a-z_][-a-z0-9._]*$/i;return Cs.getSchemaRefs=function(e,n){if("boolean"==typeof e)return{};const{schemaId:i,uriResolver:o}=this.opts,a=u(e[i]||n),c={"":a},d=s(o,a,!1),h={},f=new Set;return r(e,{allKeys:!0},(e,t,r,n)=>{if(void 0===n)return;const o=d+t;let a=c[n];function s(t){const r=this.opts.uriResolver.resolve;if(t=u(a?r(a,t):t),f.has(t))throw p(t);f.add(t);let n=this.refs[t];return"string"==typeof n&&(n=this.refs[n]),"object"==typeof n?m(e,n.schema,t):t!==u(o)&&("#"===t[0]?(m(e,h[t],t),h[t]=e):this.refs[t]=o),t}function v(e){if("string"==typeof e){if(!l.test(e))throw new Error(`invalid anchor "${e}"`);s.call(this,`#${e}`)}}"string"==typeof e[i]&&(a=s.call(this,e[i])),v.call(this,e.$anchor),v.call(this,e.$dynamicAnchor),c[t]=a}),h;function m(e,r,n){if(void 0!==r&&!t(e,r))throw p(n)}function p(e){return new Error(`reference "${e}" resolves to more than one schema`)}},Cs}function zs(){if(As)return Ra;As=1,Object.defineProperty(Ra,"m",{value:!0}),Ra.getData=Ra.KeywordCxt=Ra.validateFunctionCode=void 0;const e=es(),t=ds(),r=cs(),n=ds(),i=hs(),o=gs(),a=$s(),s=Ua(),c=Qa(),d=_s(),u=Ka(),l=Xa();function h({gen:e,validateName:t,schema:r,schemaEnv:n,opts:i},o){i.code.es5?e.func(t,s._`${c.default.data}, ${c.default.valCxt}`,n.$async,()=>{e.code(s._`"use strict"; ${f(r,i)}`),function(e,t){e.if(c.default.valCxt,()=>{e.var(c.default.instancePath,s._`${c.default.valCxt}.${c.default.instancePath}`),e.var(c.default.parentData,s._`${c.default.valCxt}.${c.default.parentData}`),e.var(c.default.parentDataProperty,s._`${c.default.valCxt}.${c.default.parentDataProperty}`),e.var(c.default.rootData,s._`${c.default.valCxt}.${c.default.rootData}`),t.dynamicRef&&e.var(c.default.dynamicAnchors,s._`${c.default.valCxt}.${c.default.dynamicAnchors}`)},()=>{e.var(c.default.instancePath,s._`""`),e.var(c.default.parentData,s._`undefined`),e.var(c.default.parentDataProperty,s._`undefined`),e.var(c.default.rootData,c.default.data),t.dynamicRef&&e.var(c.default.dynamicAnchors,s._`{}`)})}(e,i),e.code(o)}):e.func(t,s._`${c.default.data}, ${function(e){return s._`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${e.dynamicRef?s._`, ${c.default.dynamicAnchors}={}`:s.nil}}={}`}(i)}`,n.$async,()=>e.code(f(r,i)).code(o))}function f(e,t){const r="object"==typeof e&&e[t.schemaId];return r&&(t.code.source||t.code.process)?s._`/*# sourceURL=${r} */`:s.nil}function m(t,r){v(t)&&(b(t),p(t))?function(e,t){const{schema:r,gen:n,opts:i}=e;i.$comment&&r.$comment&&y(e);(function(e){const t=e.schema[e.opts.schemaId];t&&(e.baseId=(0,d.resolveUrl)(e.opts.uriResolver,e.baseId,t))})(e),function(e){if(e.schema.$async&&!e.schemaEnv.$async)throw new Error("async schema in sync schema")}(e);const o=n.const("_errs",c.default.errors);g(e,o),n.var(t,s._`${o} === ${c.default.errors}`)}(t,r):(0,e.boolOrEmptySchema)(t,r)}function p({schema:e,self:t}){if("boolean"==typeof e)return!e;for(const r in e)if(t.RULES.all[r])return!0;return!1}function v(e){return"boolean"!=typeof e.schema}function b(e){(0,u.checkUnknownRules)(e),function(e){const{schema:t,errSchemaPath:r,opts:n,self:i}=e;t.$ref&&n.ignoreKeywordsWithRef&&(0,u.schemaHasRulesButRef)(t,i.RULES)&&i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`)}(e)}function g(e,r){if(e.opts.jtd)return w(e,[],!1,r);const n=(0,t.getSchemaTypes)(e.schema);w(e,n,!(0,t.coerceAndCheckDataType)(e,n),r)}function y({gen:e,schemaEnv:t,schema:r,errSchemaPath:n,opts:i}){const o=r.$comment;if(!0===i.$comment)e.code(s._`${c.default.self}.logger.log(${o})`);else if("function"==typeof i.$comment){const r=s.str`${n}/$comment`,i=e.scopeValue("root",{ref:t.root});e.code(s._`${c.default.self}.opts.$comment(${o}, ${r}, ${i}.schema)`)}}function w(e,t,i,o){const{gen:a,schema:d,data:l,allErrors:h,opts:f,self:m}=e,{RULES:p}=m;function v(u){(0,r.shouldUseGroup)(d,u)&&(u.type?(a.if((0,n.checkDataType)(u.type,l,f.strictNumbers)),$(e,u),1===t.length&&t[0]===u.type&&i&&(a.else(),(0,n.reportTypeError)(e)),a.endIf()):$(e,u),h||a.if(s._`${c.default.errors} === ${o||0}`))}!d.$ref||!f.ignoreKeywordsWithRef&&(0,u.schemaHasRulesButRef)(d,p)?(f.jtd||function(e,t){if(e.schemaEnv.meta||!e.opts.strictTypes)return;(function(e,t){if(!t.length)return;if(!e.dataTypes.length)return void(e.dataTypes=t);t.forEach(t=>{x(e.dataTypes,t)||C(e,`type "${t}" not allowed by context "${e.dataTypes.join(",")}"`)}),function(e,t){const r=[];for(const n of e.dataTypes)x(t,n)?r.push(n):t.includes("integer")&&"number"===n&&r.push("integer");e.dataTypes=r}(e,t)})(e,t),e.opts.allowUnionTypes||function(e,t){t.length>1&&(2!==t.length||!t.includes("null"))&&C(e,"use allowUnionTypes to allow union type keyword")}(e,t);!function(e,t){const n=e.self.RULES.all;for(const i in n){const o=n[i];if("object"==typeof o&&(0,r.shouldUseRule)(e.schema,o)){const{type:r}=o.definition;r.length&&!r.some(e=>k(t,e))&&C(e,`missing type "${r.join(",")}" for keyword "${i}"`)}}}(e,e.dataTypes)}(e,t),a.block(()=>{for(const e of p.rules)v(e);v(p.post)})):a.block(()=>j(e,"$ref",p.all.$ref.definition))}function $(e,t){const{gen:n,schema:o,opts:{useDefaults:a}}=e;a&&(0,i.assignDefaults)(e,t.type),n.block(()=>{for(const n of t.rules)(0,r.shouldUseRule)(o,n)&&j(e,n.keyword,n.definition,t.type)})}function k(e,t){return e.includes(t)||"number"===t&&e.includes("integer")}function x(e,t){return e.includes(t)||"integer"===t&&e.includes("number")}function C(e,t){t+=` at "${e.schemaEnv.baseId+e.errSchemaPath}" (strictTypes)`,(0,u.checkStrictMode)(e,t,e.opts.strictTypes)}Ra.validateFunctionCode=function(t){v(t)&&(b(t),p(t))?function(e){const{schema:t,opts:r,gen:n}=e;h(e,()=>{r.$comment&&t.$comment&&y(e),function(e){const{schema:t,opts:r}=e;void 0!==t.default&&r.useDefaults&&r.strictSchema&&(0,u.checkStrictMode)(e,"default is ignored in the schema root")}(e),n.let(c.default.vErrors,null),n.let(c.default.errors,0),r.unevaluated&&function(e){const{gen:t,validateName:r}=e;e.evaluated=t.const("evaluated",s._`${r}.evaluated`),t.if(s._`${e.evaluated}.dynamicProps`,()=>t.assign(s._`${e.evaluated}.props`,s._`undefined`)),t.if(s._`${e.evaluated}.dynamicItems`,()=>t.assign(s._`${e.evaluated}.items`,s._`undefined`))}(e),g(e),function(e){const{gen:t,schemaEnv:r,validateName:n,ValidationError:i,opts:o}=e;r.$async?t.if(s._`${c.default.errors} === 0`,()=>t.return(c.default.data),()=>t.throw(s._`new ${i}(${c.default.vErrors})`)):(t.assign(s._`${n}.errors`,c.default.vErrors),o.unevaluated&&function({gen:e,evaluated:t,props:r,items:n}){r instanceof s.Name&&e.assign(s._`${t}.props`,r);n instanceof s.Name&&e.assign(s._`${t}.items`,n)}(e),t.return(s._`${c.default.errors} === 0`))}(e)})}(t):h(t,()=>(0,e.topBoolOrEmptySchema)(t))};class E{constructor(e,t,r){if((0,o.validateKeywordUsage)(e,t,r),this.gen=e.gen,this.allErrors=e.allErrors,this.keyword=r,this.data=e.data,this.schema=e.schema[r],this.$data=t.$data&&e.opts.$data&&this.schema&&this.schema.$data,this.schemaValue=(0,u.schemaRefOrVal)(e,this.schema,r,this.$data),this.schemaType=t.schemaType,this.parentSchema=e.schema,this.params={},this.it=e,this.def=t,this.$data)this.schemaCode=e.gen.const("vSchema",O(this.$data,e));else if(this.schemaCode=this.schemaValue,!(0,o.validSchemaType)(this.schema,t.schemaType,t.allowUndefined))throw new Error(`${r} value must be ${JSON.stringify(t.schemaType)}`);("code"in t?t.trackErrors:!1!==t.errors)&&(this.errsCount=e.gen.const("_errs",c.default.errors))}result(e,t,r){this.failResult((0,s.not)(e),t,r)}failResult(e,t,r){this.gen.if(e),r?r():this.error(),t?(this.gen.else(),t(),this.allErrors&&this.gen.endIf()):this.allErrors?this.gen.endIf():this.gen.else()}pass(e,t){this.failResult((0,s.not)(e),void 0,t)}fail(e){if(void 0===e)return this.error(),void(this.allErrors||this.gen.if(!1));this.gen.if(e),this.error(),this.allErrors?this.gen.endIf():this.gen.else()}fail$data(e){if(!this.$data)return this.fail(e);const{schemaCode:t}=this;this.fail(s._`${t} !== undefined && (${(0,s.or)(this.invalid$data(),e)})`)}error(e,t,r){if(t)return this.setParams(t),this._error(e,r),void this.setParams({});this._error(e,r)}_error(e,t){(e?l.reportExtraError:l.reportError)(this,this.def.error,t)}$dataError(){(0,l.reportError)(this,this.def.$dataError||l.keyword$DataError)}reset(){if(void 0===this.errsCount)throw new Error('add "trackErrors" to keyword definition');(0,l.resetErrorsCount)(this.gen,this.errsCount)}ok(e){this.allErrors||this.gen.if(e)}setParams(e,t){t?Object.assign(this.params,e):this.params=e}block$data(e,t,r=s.nil){this.gen.block(()=>{this.check$data(e,r),t()})}check$data(e=s.nil,t=s.nil){if(!this.$data)return;const{gen:r,schemaCode:n,schemaType:i,def:o}=this;r.if((0,s.or)(s._`${n} === undefined`,t)),e!==s.nil&&r.assign(e,!0),(i.length||o.validateSchema)&&(r.elseIf(this.invalid$data()),this.$dataError(),e!==s.nil&&r.assign(e,!1)),r.else()}invalid$data(){const{gen:e,schemaCode:t,schemaType:r,def:i,it:o}=this;return(0,s.or)(function(){if(r.length){if(!(t instanceof s.Name))throw new Error("ajv implementation error");const e=Array.isArray(r)?r:[r];return s._`${(0,n.checkDataTypes)(e,t,o.opts.strictNumbers,n.DataType.Wrong)}`}return s.nil}(),function(){if(i.validateSchema){const r=e.scopeValue("validate$data",{ref:i.validateSchema});return s._`!${r}(${t})`}return s.nil}())}subschema(e,t){const r=(0,a.getSubschema)(this.it,e);(0,a.extendSubschemaData)(r,this.it,e),(0,a.extendSubschemaMode)(r,e);const n={...this.it,...r,items:void 0,props:void 0};return m(n,t),n}mergeEvaluated(e,t){const{it:r,gen:n}=this;r.opts.unevaluated&&(!0!==r.props&&void 0!==e.props&&(r.props=u.mergeEvaluated.props(n,e.props,r.props,t)),!0!==r.items&&void 0!==e.items&&(r.items=u.mergeEvaluated.items(n,e.items,r.items,t)))}mergeValidEvaluated(e,t){const{it:r,gen:n}=this;if(r.opts.unevaluated&&(!0!==r.props||!0!==r.items))return n.if(t,()=>this.mergeEvaluated(e,s.Name)),!0}}function j(e,t,r,n){const i=new E(e,r,t);"code"in r?r.code(i,n):i.$data&&r.validate?(0,o.funcKeywordCode)(i,r):"macro"in r?(0,o.macroKeywordCode)(i,r):(r.compile||r.validate)&&(0,o.funcKeywordCode)(i,r)}Ra.KeywordCxt=E;const S=/^\/(?:[^~]|~0|~1)*$/,A=/^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;function O(e,{dataLevel:t,dataNames:r,dataPathArr:n}){let i,o;if(""===e)return c.default.rootData;if("/"===e[0]){if(!S.test(e))throw new Error(`Invalid JSON-pointer: ${e}`);i=e,o=c.default.rootData}else{const a=A.exec(e);if(!a)throw new Error(`Invalid JSON-pointer: ${e}`);const s=+a[1];if(i=a[2],"#"===i){if(s>=t)throw new Error(l("property/index",s));return n[t-s]}if(s>t)throw new Error(l("data",s));if(o=r[t-s],!i)return o}let a=o;const d=i.split("/");for(const e of d)e&&(o=s._`${o}${(0,s.getProperty)((0,u.unescapeJsonPointer)(e))}`,a=s._`${a} && ${o}`);return a;function l(e,r){return`Cannot access ${e} ${r} levels up, current level is ${t}`}}return Ra.getData=O,Ra}var Ns,Rs={};function Ts(){if(Ns)return Rs;Ns=1,Object.defineProperty(Rs,"m",{value:!0});class e extends Error{constructor(e){super("validation failed"),this.errors=e,this.ajv=this.validation=!0}}return Rs.default=e,Rs}var Ms,Ps={};function Ls(){if(Ms)return Ps;Ms=1,Object.defineProperty(Ps,"m",{value:!0});const e=_s();class t extends Error{constructor(t,r,n,i){super(i||`can't resolve reference ${n} from id ${r}`),this.missingRef=(0,e.resolveUrl)(t,r,n),this.missingSchema=(0,e.normalizeId)((0,e.getFullPath)(t,this.missingRef))}}return Ps.default=t,Ps}var Ds,Bs={};function qs(){if(Ds)return Bs;Ds=1,Object.defineProperty(Bs,"m",{value:!0}),Bs.resolveSchema=Bs.getCompilingSchema=Bs.resolveRef=Bs.compileSchema=Bs.SchemaEnv=void 0;const e=Ua(),t=Ts(),r=Qa(),n=_s(),i=Ka(),o=zs();class a{constructor(e){var t;let r;this.refs={},this.dynamicAnchors={},"object"==typeof e.schema&&(r=e.schema),this.schema=e.schema,this.schemaId=e.schemaId,this.root=e.root||this,this.baseId=null!==(t=e.baseId)&&void 0!==t?t:(0,n.normalizeId)(null==r?void 0:r[e.schemaId||"$id"]),this.schemaPath=e.schemaPath,this.localRefs=e.localRefs,this.meta=e.meta,this.$async=null==r?void 0:r.$async,this.refs={}}}function s(i){const a=d.call(this,i);if(a)return a;const s=(0,n.getFullPath)(this.opts.uriResolver,i.root.baseId),{es5:c,lines:u}=this.opts.code,{ownProperties:l}=this.opts,h=new e.CodeGen(this.scope,{es5:c,lines:u,ownProperties:l});let f;i.$async&&(f=h.scopeValue("Error",{ref:t.default,code:e._`require("ajv/dist/runtime/validation_error").default`}));const m=h.scopeName("validate");i.validateName=m;const p={gen:h,allErrors:this.opts.allErrors,data:r.default.data,parentData:r.default.parentData,parentDataProperty:r.default.parentDataProperty,dataNames:[r.default.data],dataPathArr:[e.nil],dataLevel:0,dataTypes:[],definedProperties:new Set,topSchemaRef:h.scopeValue("schema",!0===this.opts.code.source?{ref:i.schema,code:(0,e.stringify)(i.schema)}:{ref:i.schema}),validateName:m,ValidationError:f,schema:i.schema,schemaEnv:i,rootId:s,baseId:i.baseId||s,schemaPath:e.nil,errSchemaPath:i.schemaPath||(this.opts.jtd?"":"#"),errorPath:e._`""`,opts:this.opts,self:this};let v;try{this._compilations.add(i),(0,o.validateFunctionCode)(p),h.optimize(this.opts.code.optimize);const t=h.toString();v=`${h.scopeRefs(r.default.scope)}return ${t}`,this.opts.code.process&&(v=this.opts.code.process(v,i));const n=new Function(`${r.default.self}`,`${r.default.scope}`,v)(this,this.scope.get());if(this.scope.value(m,{ref:n}),n.errors=null,n.schema=i.schema,n.schemaEnv=i,i.$async&&(n.$async=!0),!0===this.opts.code.source&&(n.source={validateName:m,validateCode:t,scopeValues:h._values}),this.opts.unevaluated){const{props:t,items:r}=p;n.evaluated={props:t instanceof e.Name?void 0:t,items:r instanceof e.Name?void 0:r,dynamicProps:t instanceof e.Name,dynamicItems:r instanceof e.Name},n.source&&(n.source.evaluated=(0,e.stringify)(n.evaluated))}return i.validate=n,i}catch(e){throw delete i.validate,delete i.validateName,v&&this.logger.error("Error compiling schema, function code:",v),e}finally{this._compilations.delete(i)}}function c(e){return(0,n.inlineRef)(e.schema,this.opts.inlineRefs)?e.schema:e.validate?e:s.call(this,e)}function d(e){for(const t of this._compilations)if(u(t,e))return t}function u(e,t){return e.schema===t.schema&&e.root===t.root&&e.baseId===t.baseId}function l(e,t){let r;for(;"string"==typeof(r=this.refs[t]);)t=r;return r||this.schemas[t]||h.call(this,e,t)}function h(e,t){const r=this.opts.uriResolver.parse(t),i=(0,n._getFullPath)(this.opts.uriResolver,r);let o=(0,n.getFullPath)(this.opts.uriResolver,e.baseId,void 0);if(Object.keys(e.schema).length>0&&i===o)return m.call(this,r,e);const c=(0,n.normalizeId)(i),d=this.refs[c]||this.schemas[c];if("string"==typeof d){const t=h.call(this,e,d);if("object"!=typeof(null==t?void 0:t.schema))return;return m.call(this,r,t)}if("object"==typeof(null==d?void 0:d.schema)){if(d.validate||s.call(this,d),c===(0,n.normalizeId)(t)){const{schema:t}=d,{schemaId:r}=this.opts,i=t[r];return i&&(o=(0,n.resolveUrl)(this.opts.uriResolver,o,i)),new a({schema:t,schemaId:r,root:e,baseId:o})}return m.call(this,r,d)}}Bs.SchemaEnv=a,Bs.compileSchema=s,Bs.resolveRef=function(e,t,r){var i;r=(0,n.resolveUrl)(this.opts.uriResolver,t,r);const o=e.refs[r];if(o)return o;let s=l.call(this,e,r);if(void 0===s){const n=null===(i=e.localRefs)||void 0===i?void 0:i[r],{schemaId:o}=this.opts;n&&(s=new a({schema:n,schemaId:o,root:e,baseId:t}))}return void 0!==s?e.refs[r]=c.call(this,s):void 0},Bs.getCompilingSchema=d,Bs.resolveSchema=h;const f=new Set(["properties","patternProperties","enum","dependencies","definitions"]);function m(e,{baseId:t,schema:r,root:o}){var s;if("/"!==(null===(s=e.fragment)||void 0===s?void 0:s[0]))return;for(const o of e.fragment.slice(1).split("/")){if("boolean"==typeof r)return;const e=r[(0,i.unescapeFragment)(o)];if(void 0===e)return;const a="object"==typeof(r=e)&&r[this.opts.schemaId];!f.has(o)&&a&&(t=(0,n.resolveUrl)(this.opts.uriResolver,t,a))}let c;if("boolean"!=typeof r&&r.$ref&&!(0,i.schemaHasRulesButRef)(r,this.RULES)){const e=(0,n.resolveUrl)(this.opts.uriResolver,t,r.$ref);c=h.call(this,o,e)}const{schemaId:d}=this.opts;return c=c||new a({schema:r,schemaId:d,root:o,baseId:t}),c.schema!==c.root.schema?c:void 0}return Bs}var Vs,Fs,Us,Hs,Ws,Ks,Gs,Ys={$id:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",description:"Meta-schema for $data reference (JSON AnySchema extension proposal)",type:"object",required:["$data"],properties:{$data:{type:"string",anyOf:[{format:"relative-json-pointer"},{format:"json-pointer"}]}},additionalProperties:!1},Js={},Zs={exports:{}};function Qs(){if(Fs)return Vs;Fs=1;const e=RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu),t=RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u),r=RegExp.prototype.test.bind(/^[\da-f]{2}$/iu),n=RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu),i=RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);function o(e){let t="",r=0,n=0;for(n=0;n<e.length;n++)if(r=e[n].charCodeAt(0),48!==r){if(!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";t+=e[n];break}for(n+=1;n<e.length;n++){if(r=e[n].charCodeAt(0),!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";t+=e[n]}return t}const a=RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);function s(e){return e.length=0,!0}function c(e,t,r){if(e.length){const n=o(e);if(""===n)return r.error=!0,!1;t.push(n),e.length=0}return!0}function d(e){if(function(e,t){let r=0;for(let n=0;n<e.length;n++)e[n]===t&&r++;return r}(e,":")<2)return{host:e,isIPV6:!1};const t=function(e){let t=0;const r={error:!1,address:"",zone:""},n=[],i=[];let a=!1,d=!1,u=c;for(let o=0;o<e.length;o++){const c=e[o];if("["!==c&&"]"!==c)if(":"!==c)if("%"===c){if(!u(i,n,r))break;u=s}else i.push(c);else{if(!0===a&&(d=!0),!u(i,n,r))break;if(++t>7){r.error=!0;break}o>0&&":"===e[o-1]&&(a=!0),n.push(":")}}return i.length&&(u===s?r.zone=i.join(""):d?n.push(i.join("")):n.push(o(i))),r.address=n.join(""),r}(e);if(t.error)return{host:e,isIPV6:!1};{let e=t.address,r=t.address;return t.zone&&(e+="%"+t.zone,r+="%25"+t.zone),{host:e,isIPV6:!0,escapedHost:r}}}const u={"@":"%40","/":"%2F","?":"%3F","#":"%23",":":"%3A"},l=/[@/?#:]/g,h=/[@/?#]/g;function f(e,t){const r=t?h:l;return r.lastIndex=0,e.replace(r,e=>u[e])}return Vs={nonSimpleDomain:a,recomposeAuthority:function(e){const r=[];if(void 0!==e.userinfo&&(r.push(e.userinfo),r.push("@")),void 0!==e.host){let n=unescape(e.host);if(!t(n)){const e=d(n);n=!0===e.isIPV6?`[${e.escapedHost}]`:f(n,!1)}r.push(n)}return"number"!=typeof e.port&&"string"!=typeof e.port||(r.push(":"),r.push(String(e.port))),r.length?r.join(""):void 0},reescapeHostDelimiters:f,normalizePercentEncoding:function(e,t=!1){if(-1===e.indexOf("%"))return e;let i="";for(let o=0;o<e.length;o++){if("%"===e[o]&&o+2<e.length){const a=e.slice(o+1,o+3);if(r(a)){const e=a.toUpperCase(),r=String.fromCharCode(parseInt(e,16));t&&n(r)?i+=r:i+="%"+e,o+=2;continue}}i+=e[o]}return i},normalizePathEncoding:function(e){let t="";for(let o=0;o<e.length;o++){if("%"===e[o]&&o+2<e.length){const i=e.slice(o+1,o+3);if(r(i)){const e=i.toUpperCase(),r=String.fromCharCode(parseInt(e,16));"."!==r&&n(r)?t+=r:t+="%"+e,o+=2;continue}}i(e[o])?t+=e[o]:t+=escape(e[o])}return t},escapePreservingEscapes:function(e){let t="";for(let n=0;n<e.length;n++){if("%"===e[n]&&n+2<e.length){const i=e.slice(n+1,n+3);if(r(i)){t+="%"+i.toUpperCase(),n+=2;continue}}t+=escape(e[n])}return t},removeDotSegments:function(e){let t=e;const r=[];let n=-1,i=0;for(;i=t.length;){if(1===i){if("."===t)break;if("/"===t){r.push("/");break}r.push(t);break}if(2===i){if("."===t[0]){if("."===t[1])break;if("/"===t[1]){t=t.slice(2);continue}}else if("/"===t[0]&&("."===t[1]||"/"===t[1])){r.push("/");break}}else if(3===i&&"/.."===t){0!==r.length&&r.pop(),r.push("/");break}if("."===t[0]){if("."===t[1]){if("/"===t[2]){t=t.slice(3);continue}}else if("/"===t[1]){t=t.slice(2);continue}}else if("/"===t[0]&&"."===t[1]){if("/"===t[2]){t=t.slice(2);continue}if("."===t[2]&&"/"===t[3]){t=t.slice(3),0!==r.length&&r.pop();continue}}if(-1===(n=t.indexOf("/",1))){r.push(t);break}r.push(t.slice(0,n)),t=t.slice(n)}return r.join("")},isIPv4:t,isUUID:e,normalizeIPv6:d,stringArrayToHexStripped:o},Vs}function Xs(){if(Ws)return Zs.exports;Ws=1;const{normalizeIPv6:e,removeDotSegments:t,recomposeAuthority:r,normalizePercentEncoding:n,normalizePathEncoding:i,escapePreservingEscapes:o,reescapeHostDelimiters:a,isIPv4:s,nonSimpleDomain:c}=Qs(),{SCHEMES:d,getSchemeHandler:u}=function(){if(Hs)return Us;Hs=1;const{isUUID:e}=Qs(),t=/([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu,r=["http","https","ws","wss","urn","urn:uuid"];function n(e){return!0===e.secure||!1!==e.secure&&!!e.scheme&&!(3!==e.scheme.length||"w"!==e.scheme[0]&&"W"!==e.scheme[0]||"s"!==e.scheme[1]&&"S"!==e.scheme[1]||"s"!==e.scheme[2]&&"S"!==e.scheme[2])}function i(e){return e.host||(e.error=e.error||"HTTP URIs must have a host."),e}function o(e){const t="https"===String(e.scheme).toLowerCase();return e.port!==(t?443:80)&&""!==e.port||(e.port=void 0),e.path||(e.path="/"),e}const a={scheme:"http",domainHost:!0,parse:i,serialize:o},s={scheme:"ws",domainHost:!0,parse:function(e){return e.secure=n(e),e.resourceName=(e.path||"/")+(e.query?"?"+e.query:""),e.path=void 0,e.query=void 0,e},serialize:function(e){if(e.port!==(n(e)?443:80)&&""!==e.port||(e.port=void 0),"boolean"==typeof e.secure&&(e.scheme=e.secure?"wss":"ws",e.secure=void 0),e.resourceName){const[t,r]=e.resourceName.split("?");e.path=t&&"/"!==t?t:void 0,e.query=r,e.resourceName=void 0}return e.fragment=void 0,e}},c={http:a,https:{scheme:"https",domainHost:a.domainHost,parse:i,serialize:o},ws:s,wss:{scheme:"wss",domainHost:s.domainHost,parse:s.parse,serialize:s.serialize},urn:{scheme:"urn",parse:function(e,r){if(!e.path)return e.error="URN can not be parsed",e;const n=e.path.match(t);if(n){const t=r.scheme||e.scheme||"urn";e.nid=n[1].toLowerCase(),e.nss=n[2];const i=d(`${t}:${r.nid||e.nid}`);e.path=void 0,i&&(e=i.parse(e,r))}else e.error=e.error||"URN can not be parsed.";return e},serialize:function(e,t){if(void 0===e.nid)throw new Error("URN without nid cannot be serialized");const r=t.scheme||e.scheme||"urn",n=e.nid.toLowerCase(),i=d(`${r}:${t.nid||n}`);i&&(e=i.serialize(e,t));const o=e,a=e.nss;return o.path=`${n||t.nid}:${a}`,t.skipEscape=!0,o},skipNormalize:!0},"urn:uuid":{scheme:"urn:uuid",parse:function(t,r){const n=t;return n.uuid=n.nss,n.nss=void 0,r.tolerant||n.uuid&&e(n.uuid)||(n.error=n.error||"UUID is not valid."),n},serialize:function(e){const t=e;return t.nss=(e.uuid||"").toLowerCase(),t},skipNormalize:!0}};function d(e){return e&&(c[e]||c[e.toLowerCase()])||void 0}return Object.setPrototypeOf(c,null),Us={wsIsSecure:n,SCHEMES:c,isValidSchemeName:function(e){return-1!==r.indexOf(e)},getSchemeHandler:d}}();function l(e,r,n,i){const o={};return i||(e=p(h(e,n),n),r=p(h(r,n),n)),!(n=n||{}).tolerant&&r.scheme?(o.scheme=r.scheme,o.userinfo=r.userinfo,o.host=r.host,o.port=r.port,o.path=t(r.path||""),o.query=r.query):(void 0!==r.userinfo||void 0!==r.host||void 0!==r.port?(o.userinfo=r.userinfo,o.host=r.host,o.port=r.port,o.path=t(r.path||""),o.query=r.query):(r.path?("/"===r.path[0]?o.path=t(r.path):(void 0===e.userinfo&&void 0===e.host&&void 0===e.port||e.path?e.path?o.path=e.path.slice(0,e.path.lastIndexOf("/")+1)+r.path:o.path=r.path:o.path="/"+r.path,o.path=t(o.path)),o.query=r.query):(o.path=e.path,void 0!==r.query?o.query=r.query:o.query=e.query),o.userinfo=e.userinfo,o.host=e.host,o.port=e.port),o.scheme=e.scheme),o.fragment=r.fragment,o}function h(e,i){const a={host:e.host,scheme:e.scheme,userinfo:e.userinfo,port:e.port,path:e.path,query:e.query,nid:e.nid,nss:e.nss,uuid:e.uuid,fragment:e.fragment,reference:e.reference,resourceName:e.resourceName,secure:e.secure,error:""},s=Object.assign({},i),c=[],d=u(s.scheme||a.scheme);d&&d.serialize&&d.serialize(a,s),void 0!==a.path&&(s.skipEscape?a.path=n(a.path):(a.path=o(a.path),void 0!==a.scheme&&(a.path=a.path.split("%3A").join(":")))),"suffix"!==s.reference&&a.scheme&&c.push(a.scheme,":");const l=r(a);if(void 0!==l&&("suffix"!==s.reference&&c.push("//"),c.push(l),a.path&&"/"!==a.path[0]&&c.push("/")),void 0!==a.path){let e=a.path;s.absolutePath||d&&d.absolutePath||(e=t(e)),void 0===l&&"/"===e[0]&&"/"===e[1]&&(e="/%2F"+e.slice(2)),c.push(e)}return void 0!==a.query&&c.push("?",a.query),void 0!==a.fragment&&c.push("#",a.fragment),c.join("")}const f=/^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;function m(t,r){const n=Object.assign({},r),o={scheme:void 0,userinfo:void 0,host:"",port:void 0,path:"",query:void 0,fragment:void 0};let d=!1,l=!1;"suffix"===n.reference&&(t=n.scheme?n.scheme+":"+t:"//"+t);const h=t.match(f);if(h){o.scheme=h[1],o.userinfo=h[3],o.host=h[4],o.port=parseInt(h[5],10),o.path=h[6]||"",o.query=h[7],o.fragment=h[8],isNaN(o.port)&&(o.port=h[5]);const r=function(e,t){return void 0!==t[2]&&e.path&&"/"!==e.path[0]?'URI path must start with "/" when authority is present.':"number"==typeof e.port&&(e.port<0||e.port>65535)?"URI port is malformed.":void 0}(o,h);if(void 0!==r&&(o.error=o.error||r,d=!0),o.host){if(!1===s(o.host)){const t=e(o.host);o.host=t.host.toLowerCase(),l=t.isIPV6}else l=!0}void 0!==o.scheme||void 0!==o.userinfo||void 0!==o.host||void 0!==o.port||void 0!==o.query||o.path?void 0===o.scheme?o.reference="relative":void 0===o.fragment?o.reference="absolute":o.reference="uri":o.reference="same-document",n.reference&&"suffix"!==n.reference&&n.reference!==o.reference&&(o.error=o.error||"URI is not a "+n.reference+" reference.");const f=u(n.scheme||o.scheme);if(!(n.unicodeSupport||f&&f.unicodeSupport)&&o.host&&(n.domainHost||f&&f.domainHost)&&!1===l&&c(o.host))try{o.host=new URL("http://"+o.host).hostname}catch(e){o.error=o.error||"Host's domain name can not be converted to ASCII: "+e}if((!f||f&&!f.skipNormalize)&&(-1!==t.indexOf("%")&&(void 0!==o.scheme&&(o.scheme=unescape(o.scheme)),void 0!==o.host&&(o.host=a(unescape(o.host),l))),o.path&&(o.path=i(o.path)),o.fragment))try{o.fragment=encodeURI(decodeURIComponent(o.fragment))}catch{o.error=o.error||"URI malformed"}f&&f.parse&&f.parse(o,n)}else o.error=o.error||"URI can not be parsed.";return{parsed:o,malformedAuthorityOrPort:d}}function p(e,t){return m(e,t).parsed}function v(e,t){const{parsed:r,malformedAuthorityOrPort:n}=m(e,t);return{normalized:n?e:h(r,t),malformedAuthorityOrPort:n}}function b(e,t){if("string"==typeof e){const{normalized:r,malformedAuthorityOrPort:n}=v(e,t);return n?void 0:r}if("object"==typeof e)return h(e,t)}const g={SCHEMES:d,normalize:function(e,t){return"string"==typeof e?e=function(e,t){return v(e,t).normalized}(e,t):"object"==typeof e&&(e=p(h(e,t),t)),e},resolve:function(e,t,r){const n=r?Object.assign({scheme:"null"},r):{scheme:"null"},i=l(p(e,n),p(t,n),n,!0);return n.skipEscape=!0,h(i,n)},resolveComponent:l,equal:function(e,t,r){const n=b(e,r),i=b(t,r);return void 0!==n&&void 0!==i&&n.toLowerCase()===i.toLowerCase()},serialize:h,parse:p};return Zs.exports=g,Zs.exports.default=g,Zs.exports.fastUri=g,Zs.exports}function ec(){if(Ks)return Js;Ks=1,Object.defineProperty(Js,"m",{value:!0});const e=Xs();return e.code='require("ajv/dist/runtime/uri").default',Js.default=e,Js}function tc(){return Gs||(Gs=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.CodeGen=e.Name=e.nil=e.stringify=e.str=e._=e.KeywordCxt=void 0;var t=zs();Object.defineProperty(e,"KeywordCxt",{enumerable:!0,get:function(){return t.KeywordCxt}});var r=Ua();Object.defineProperty(e,"_",{enumerable:!0,get:function(){return r._}}),Object.defineProperty(e,"str",{enumerable:!0,get:function(){return r.str}}),Object.defineProperty(e,"stringify",{enumerable:!0,get:function(){return r.stringify}}),Object.defineProperty(e,"nil",{enumerable:!0,get:function(){return r.nil}}),Object.defineProperty(e,"Name",{enumerable:!0,get:function(){return r.Name}}),Object.defineProperty(e,"CodeGen",{enumerable:!0,get:function(){return r.CodeGen}});const n=Ts(),i=Ls(),o=is(),a=qs(),s=Ua(),c=_s(),d=ds(),u=Ka(),l=Ys,h=ec(),f=(e,t)=>new RegExp(e,t);f.code="new RegExp";const m=["removeAdditional","useDefaults","coerceTypes"],p=new Set(["validate","serialize","parse","wrapper","root","schema","keyword","pattern","formats","validate$data","func","obj","Error"]),v={errorDataPath:"",format:"`validateFormats: false` can be used instead.",nullable:'"nullable" keyword is supported by default.',jsonPointers:"Deprecated jsPropertySyntax can be used instead.",extendRefs:"Deprecated ignoreKeywordsWithRef can be used instead.",missingRefs:"Pass empty schema with $id that should be ignored to ajv.addSchema.",processCode:"Use option `code: {process: (code, schemaEnv: object) => string}`",sourceCode:"Use option `code: {source: true}`",strictDefaults:"It is default now, see option `strict`.",strictKeywords:"It is default now, see option `strict`.",uniqueItems:'"uniqueItems" keyword is always validated.',unknownFormats:"Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",cache:"Map is used as cache, schema object as key.",serialize:"Map is used as cache, schema object as key.",ajvErrors:"It is default now."},b={ignoreKeywordsWithRef:"",jsPropertySyntax:"",unicode:'"minLength"/"maxLength" account for unicode characters by default.'};function g(e){var t,r,n,i,o,a,s,c,d,u,l,m,p,v,b,g,y,w,$,k,x,C,E,j,S;const A=e.strict,O=null===(t=e.code)||void 0===t?void 0:t.optimize,I=!0===O||void 0===O?1:O||0,_=null!==(n=null===(r=e.code)||void 0===r?void 0:r.regExp)&&void 0!==n?n:f,z=null!==(i=e.uriResolver)&&void 0!==i?i:h.default;return{strictSchema:null===(a=null!==(o=e.strictSchema)&&void 0!==o?o:A)||void 0===a||a,strictNumbers:null===(c=null!==(s=e.strictNumbers)&&void 0!==s?s:A)||void 0===c||c,strictTypes:null!==(u=null!==(d=e.strictTypes)&&void 0!==d?d:A)&&void 0!==u?u:"log",strictTuples:null!==(m=null!==(l=e.strictTuples)&&void 0!==l?l:A)&&void 0!==m?m:"log",strictRequired:null!==(v=null!==(p=e.strictRequired)&&void 0!==p?p:A)&&void 0!==v&&v,code:e.code?{...e.code,optimize:I,regExp:_}:{optimize:I,regExp:_},loopRequired:null!==(b=e.loopRequired)&&void 0!==b?b:200,loopEnum:null!==(g=e.loopEnum)&&void 0!==g?g:200,meta:null===(y=e.meta)||void 0===y||y,messages:null===(w=e.messages)||void 0===w||w,inlineRefs:null===($=e.inlineRefs)||void 0===$||$,schemaId:null!==(k=e.schemaId)&&void 0!==k?k:"$id",addUsedSchema:null===(x=e.addUsedSchema)||void 0===x||x,validateSchema:null===(C=e.validateSchema)||void 0===C||C,validateFormats:null===(E=e.validateFormats)||void 0===E||E,unicodeRegExp:null===(j=e.unicodeRegExp)||void 0===j||j,int32range:null===(S=e.int32range)||void 0===S||S,uriResolver:z}}class y{constructor(e={}){this.schemas={},this.refs={},this.formats=Object.create(null),this._compilations=new Set,this._loading={},this._cache=new Map,e=this.opts={...e,...g(e)};const{es5:t,lines:r}=this.opts.code;this.scope=new s.ValueScope({scope:{},prefixes:p,es5:t,lines:r}),this.logger=function(e){if(!1===e)return j;if(void 0===e)return console;if(e.log&&e.warn&&e.error)return e;throw new Error("logger must implement log, warn and error methods")}(e.logger);const n=e.validateFormats;e.validateFormats=!1,this.RULES=(0,o.getRules)(),w.call(this,v,e,"NOT SUPPORTED"),w.call(this,b,e,"DEPRECATED","warn"),this._metaOpts=E.call(this),e.formats&&x.call(this),this._addVocabularies(),this._addDefaultMetaSchema(),e.keywords&&C.call(this,e.keywords),"object"==typeof e.meta&&this.addMetaSchema(e.meta),k.call(this),e.validateFormats=n}_addVocabularies(){this.addKeyword("$async")}_addDefaultMetaSchema(){const{$data:e,meta:t,schemaId:r}=this.opts;let n=l;"id"===r&&(n={...l},n.id=n.$id,delete n.$id),t&&e&&this.addMetaSchema(n,n[r],!1)}defaultMeta(){const{meta:e,schemaId:t}=this.opts;return this.opts.defaultMeta="object"==typeof e?e[t]||e:void 0}validate(e,t){let r;if("string"==typeof e){if(r=this.getSchema(e),!r)throw new Error(`no schema with key or ref "${e}"`)}else r=this.compile(e);const n=r(t);return"$async"in r||(this.errors=r.errors),n}compile(e,t){const r=this._addSchema(e,t);return r.validate||this._compileSchemaEnv(r)}compileAsync(e,t){if("function"!=typeof this.opts.loadSchema)throw new Error("options.loadSchema should be a function");const{loadSchema:r}=this.opts;return n.call(this,e,t);async function n(e,t){await o.call(this,e.$schema);const r=this._addSchema(e,t);return r.validate||a.call(this,r)}async function o(e){e&&!this.getSchema(e)&&await n.call(this,{$ref:e},!0)}async function a(e){try{return this._compileSchemaEnv(e)}catch(t){if(!(t instanceof i.default))throw t;return s.call(this,t),await c.call(this,t.missingSchema),a.call(this,e)}}function s({missingSchema:e,missingRef:t}){if(this.refs[e])throw new Error(`AnySchema ${e} is loaded but ${t} cannot be resolved`)}async function c(e){const r=await d.call(this,e);this.refs[e]||await o.call(this,r.$schema),this.refs[e]||this.addSchema(r,e,t)}async function d(e){const t=this._loading[e];if(t)return t;try{return await(this._loading[e]=r(e))}finally{delete this._loading[e]}}}addSchema(e,t,r,n=this.opts.validateSchema){if(Array.isArray(e)){for(const t of e)this.addSchema(t,void 0,r,n);return this}let i;if("object"==typeof e){const{schemaId:t}=this.opts;if(i=e[t],void 0!==i&&"string"!=typeof i)throw new Error(`schema ${t} must be string`)}return t=(0,c.normalizeId)(t||i),this._checkUnique(t),this.schemas[t]=this._addSchema(e,r,t,n,!0),this}addMetaSchema(e,t,r=this.opts.validateSchema){return this.addSchema(e,t,!0,r),this}validateSchema(e,t){if("boolean"==typeof e)return!0;let r;if(r=e.$schema,void 0!==r&&"string"!=typeof r)throw new Error("$schema must be a string");if(r=r||this.opts.defaultMeta||this.defaultMeta(),!r)return this.logger.warn("meta-schema not available"),this.errors=null,!0;const n=this.validate(r,e);if(!n&&t){const e="schema is invalid: "+this.errorsText();if("log"!==this.opts.validateSchema)throw new Error(e);this.logger.error(e)}return n}getSchema(e){let t;for(;"string"==typeof(t=$.call(this,e));)e=t;if(void 0===t){const{schemaId:r}=this.opts,n=new a.SchemaEnv({schema:{},schemaId:r});if(t=a.resolveSchema.call(this,n,e),!t)return;this.refs[e]=t}return t.validate||this._compileSchemaEnv(t)}removeSchema(e){if(e instanceof RegExp)return this._removeAllSchemas(this.schemas,e),this._removeAllSchemas(this.refs,e),this;switch(typeof e){case"undefined":return this._removeAllSchemas(this.schemas),this._removeAllSchemas(this.refs),this._cache.clear(),this;case"string":{const t=$.call(this,e);return"object"==typeof t&&this._cache.delete(t.schema),delete this.schemas[e],delete this.refs[e],this}case"object":{const t=e;this._cache.delete(t);let r=e[this.opts.schemaId];return r&&(r=(0,c.normalizeId)(r),delete this.schemas[r],delete this.refs[r]),this}default:throw new Error("ajv.removeSchema: invalid parameter")}}addVocabulary(e){for(const t of e)this.addKeyword(t);return this}addKeyword(e,t){let r;if("string"==typeof e)r=e,"object"==typeof t&&(this.logger.warn("these parameters are deprecated, see docs for addKeyword"),t.keyword=r);else{if("object"!=typeof e||void 0!==t)throw new Error("invalid addKeywords parameters");if(r=(t=e).keyword,Array.isArray(r)&&!r.length)throw new Error("addKeywords: keyword must be string or non-empty array")}if(A.call(this,r,t),!t)return(0,u.eachItem)(r,e=>O.call(this,e)),this;_.call(this,t);const n={...t,type:(0,d.getJSONTypes)(t.type),schemaType:(0,d.getJSONTypes)(t.schemaType)};return(0,u.eachItem)(r,0===n.type.length?e=>O.call(this,e,n):e=>n.type.forEach(t=>O.call(this,e,n,t))),this}getKeyword(e){const t=this.RULES.all[e];return"object"==typeof t?t.definition:!!t}removeKeyword(e){const{RULES:t}=this;delete t.keywords[e],delete t.all[e];for(const r of t.rules){const t=r.rules.findIndex(t=>t.keyword===e);t>=0&&r.rules.splice(t,1)}return this}addFormat(e,t){return"string"==typeof t&&(t=new RegExp(t)),this.formats[e]=t,this}errorsText(e=this.errors,{separator:t=", ",dataVar:r="data"}={}){return e&&0!==e.length?e.map(e=>`${r}${e.instancePath} ${e.message}`).reduce((e,r)=>e+t+r):"No errors"}$dataMetaSchema(e,t){const r=this.RULES.all;e=JSON.parse(JSON.stringify(e));for(const n of t){const t=n.split("/").slice(1);let i=e;for(const e of t)i=i[e];for(const e in r){const t=r[e];if("object"!=typeof t)continue;const{$data:n}=t.definition,o=i[e];n&&o&&(i[e]=N(o))}}return e}_removeAllSchemas(e,t){for(const r in e){const n=e[r];t&&!t.test(r)||("string"==typeof n?delete e[r]:n&&!n.meta&&(this._cache.delete(n.schema),delete e[r]))}}_addSchema(e,t,r,n=this.opts.validateSchema,i=this.opts.addUsedSchema){let o;const{schemaId:s}=this.opts;if("object"==typeof e)o=e[s];else{if(this.opts.jtd)throw new Error("schema must be object");if("boolean"!=typeof e)throw new Error("schema must be object or boolean")}let d=this._cache.get(e);if(void 0!==d)return d;r=(0,c.normalizeId)(o||r);const u=c.getSchemaRefs.call(this,e,r);return d=new a.SchemaEnv({schema:e,schemaId:s,meta:t,baseId:r,localRefs:u}),this._cache.set(d.schema,d),i&&!r.startsWith("#")&&(r&&this._checkUnique(r),this.refs[r]=d),n&&this.validateSchema(e,!0),d}_checkUnique(e){if(this.schemas[e]||this.refs[e])throw new Error(`schema with key or id "${e}" already exists`)}_compileSchemaEnv(e){if(e.meta?this._compileMetaSchema(e):a.compileSchema.call(this,e),!e.validate)throw new Error("ajv implementation error");return e.validate}_compileMetaSchema(e){const t=this.opts;this.opts=this._metaOpts;try{a.compileSchema.call(this,e)}finally{this.opts=t}}}function w(e,t,r,n="error"){for(const i in e){const o=i;o in t&&this.logger[n](`${r}: option ${i}. ${e[o]}`)}}function $(e){return e=(0,c.normalizeId)(e),this.schemas[e]||this.refs[e]}function k(){const e=this.opts.schemas;if(e)if(Array.isArray(e))this.addSchema(e);else for(const t in e)this.addSchema(e[t],t)}function x(){for(const e in this.opts.formats){const t=this.opts.formats[e];t&&this.addFormat(e,t)}}function C(e){if(Array.isArray(e))this.addVocabulary(e);else{this.logger.warn("keywords option as map is deprecated, pass array");for(const t in e){const r=e[t];r.keyword||(r.keyword=t),this.addKeyword(r)}}}function E(){const e={...this.opts};for(const t of m)delete e[t];return e}y.ValidationError=n.default,y.MissingRefError=i.default,e.default=y;const j={log(){},warn(){},error(){}};const S=/^[a-z_$][a-z0-9_$:-]*$/i;function A(e,t){const{RULES:r}=this;if((0,u.eachItem)(e,e=>{if(r.keywords[e])throw new Error(`Keyword ${e} is already defined`);if(!S.test(e))throw new Error(`Keyword ${e} has invalid name`)}),t&&t.$data&&!("code"in t)&&!("validate"in t))throw new Error('$data keyword must have "code" or "validate" function')}function O(e,t,r){var n;const i=null==t?void 0:t.post;if(r&&i)throw new Error('keyword with "post" flag cannot have "type"');const{RULES:o}=this;let a=i?o.post:o.rules.find(({type:e})=>e===r);if(a||(a={type:r,rules:[]},o.rules.push(a)),o.keywords[e]=!0,!t)return;const s={keyword:e,definition:{...t,type:(0,d.getJSONTypes)(t.type),schemaType:(0,d.getJSONTypes)(t.schemaType)}};t.before?I.call(this,a,s,t.before):a.rules.push(s),o.all[e]=s,null===(n=t.implements)||void 0===n||n.forEach(e=>this.addKeyword(e))}function I(e,t,r){const n=e.rules.findIndex(e=>e.keyword===r);n>=0?e.rules.splice(n,0,t):(e.rules.push(t),this.logger.warn(`rule ${r} is not defined`))}function _(e){let{metaSchema:t}=e;void 0!==t&&(e.$data&&this.opts.$data&&(t=N(t)),e.validateSchema=this.compile(t,!0))}const z={$ref:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"};function N(e){return{anyOf:[e,z]}}}(Na)),Na}var rc,nc={},ic={},oc={};function ac(){if(rc)return oc;rc=1,Object.defineProperty(oc,"m",{value:!0});const e={keyword:"id",code(){throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')}};return oc.default=e,oc}var sc,cc,dc={};function uc(){if(sc)return dc;sc=1,Object.defineProperty(dc,"m",{value:!0}),dc.callRef=dc.getValidate=void 0;const e=Ls(),t=bs(),r=Ua(),n=Qa(),i=qs(),o=Ka(),a={keyword:"$ref",schemaType:"string",code(t){const{gen:n,schema:o,it:a}=t,{baseId:d,schemaEnv:u,validateName:l,opts:h,self:f}=a,{root:m}=u;if(("#"===o||"#/"===o)&&d===m.baseId)return function(){if(u===m)return c(t,l,u,u.$async);const e=n.scopeValue("root",{ref:m});return c(t,r._`${e}.validate`,m,m.$async)}();const p=i.resolveRef.call(f,m,d,o);if(void 0===p)throw new e.default(a.opts.uriResolver,d,o);return p instanceof i.SchemaEnv?function(e){const r=s(t,e);c(t,r,e,e.$async)}(p):function(e){const i=n.scopeValue("schema",!0===h.code.source?{ref:e,code:(0,r.stringify)(e)}:{ref:e}),a=n.name("valid"),s=t.subschema({schema:e,dataTypes:[],schemaPath:r.nil,topSchemaRef:i,errSchemaPath:o},a);t.mergeEvaluated(s),t.ok(a)}(p)}};function s(e,t){const{gen:n}=e;return t.validate?n.scopeValue("validate",{ref:t.validate}):r._`${n.scopeValue("wrapper",{ref:t})}.validate`}function c(e,i,a,s){const{gen:c,it:d}=e,{allErrors:u,schemaEnv:l,opts:h}=d,f=h.passContext?n.default.this:r.nil;function m(e){const t=r._`${e}.errors`;c.assign(n.default.vErrors,r._`${n.default.vErrors} === null ? ${t} : ${n.default.vErrors}.concat(${t})`),c.assign(n.default.errors,r._`${n.default.vErrors}.length`)}function p(e){var t;if(!d.opts.unevaluated)return;const n=null===(t=null==a?void 0:a.validate)||void 0===t?void 0:t.evaluated;if(!0!==d.props)if(n&&!n.dynamicProps)void 0!==n.props&&(d.props=o.mergeEvaluated.props(c,n.props,d.props));else{const t=c.var("props",r._`${e}.evaluated.props`);d.props=o.mergeEvaluated.props(c,t,d.props,r.Name)}if(!0!==d.items)if(n&&!n.dynamicItems)void 0!==n.items&&(d.items=o.mergeEvaluated.items(c,n.items,d.items));else{const t=c.var("items",r._`${e}.evaluated.items`);d.items=o.mergeEvaluated.items(c,t,d.items,r.Name)}}s?function(){if(!l.$async)throw new Error("async schema referenced by sync schema");const n=c.let("valid");c.try(()=>{c.code(r._`await ${(0,t.callValidateCode)(e,i,f)}`),p(i),u||c.assign(n,!0)},e=>{c.if(r._`!(${e} instanceof ${d.ValidationError})`,()=>c.throw(e)),m(e),u||c.assign(n,!1)}),e.ok(n)}():e.result((0,t.callValidateCode)(e,i,f),()=>p(i),()=>m(i))}return dc.getValidate=s,dc.callRef=c,dc.default=a,dc}function lc(){if(cc)return ic;cc=1,Object.defineProperty(ic,"m",{value:!0});const e=ac(),t=uc(),r=["$schema","$id","$defs","$vocabulary",{keyword:"$comment"},"definitions",e.default,t.default];return ic.default=r,ic}var hc,fc={},mc={};function pc(){if(hc)return mc;hc=1,Object.defineProperty(mc,"m",{value:!0});const e=Ua(),t=e.operators,r={maximum:{okStr:"<=",ok:t.LTE,fail:t.GT},minimum:{okStr:">=",ok:t.GTE,fail:t.LT},exclusiveMaximum:{okStr:"<",ok:t.LT,fail:t.GTE},exclusiveMinimum:{okStr:">",ok:t.GT,fail:t.LTE}},n={message:({keyword:t,schemaCode:n})=>e.str`must be ${r[t].okStr} ${n}`,params:({keyword:t,schemaCode:n})=>e._`{comparison: ${r[t].okStr}, limit: ${n}}`},i={keyword:Object.keys(r),type:"number",schemaType:"number",$data:!0,error:n,code(t){const{keyword:n,data:i,schemaCode:o}=t;t.fail$data(e._`${i} ${r[n].fail} ${o} || isNaN(${i})`)}};return mc.default=i,mc}var vc,bc={};function gc(){if(vc)return bc;vc=1,Object.defineProperty(bc,"m",{value:!0});const e=Ua(),t={keyword:"multipleOf",type:"number",schemaType:"number",$data:!0,error:{message:({schemaCode:t})=>e.str`must be multiple of ${t}`,params:({schemaCode:t})=>e._`{multipleOf: ${t}}`},code(t){const{gen:r,data:n,schemaCode:i,it:o}=t,a=o.opts.multipleOfPrecision,s=r.let("res"),c=a?e._`Math.abs(Math.round(${s}) - ${s}) > 1e-${a}`:e._`${s} !== parseInt(${s})`;t.fail$data(e._`(${i} === 0 || (${s} = ${n}/${i}, ${c}))`)}};return bc.default=t,bc}var yc,wc,$c={},kc={};function xc(){if(yc)return kc;function e(e){const t=e.length;let r,n=0,i=0;for(;i<t;)n++,r=e.charCodeAt(i++),r>=55296&&r<=56319&&i<t&&(r=e.charCodeAt(i),56320==(64512&r)&&i++);return n}return yc=1,Object.defineProperty(kc,"m",{value:!0}),kc.default=e,e.code='require("ajv/dist/runtime/ucs2length").default',kc}function Cc(){if(wc)return $c;wc=1,Object.defineProperty($c,"m",{value:!0});const e=Ua(),t=Ka(),r=xc(),n={message({keyword:t,schemaCode:r}){const n="maxLength"===t?"more":"fewer";return e.str`must NOT have ${n} than ${r} characters`},params:({schemaCode:t})=>e._`{limit: ${t}}`},i={keyword:["maxLength","minLength"],type:"string",schemaType:"number",$data:!0,error:n,code(n){const{keyword:i,data:o,schemaCode:a,it:s}=n,c="maxLength"===i?e.operators.GT:e.operators.LT,d=!1===s.opts.unicode?e._`${o}.length`:e._`${(0,t.useFunc)(n.gen,r.default)}(${o})`;n.fail$data(e._`${d} ${c} ${a}`)}};return $c.default=i,$c}var Ec,jc={};function Sc(){if(Ec)return jc;Ec=1,Object.defineProperty(jc,"m",{value:!0});const e=bs(),t=Ka(),r=Ua(),n={keyword:"pattern",type:"string",schemaType:"string",$data:!0,error:{message:({schemaCode:e})=>r.str`must match pattern "${e}"`,params:({schemaCode:e})=>r._`{pattern: ${e}}`},code(n){const{gen:i,data:o,$data:a,schema:s,schemaCode:c,it:d}=n,u=d.opts.unicodeRegExp?"u":"";if(a){const{regExp:e}=d.opts.code,a="new RegExp"===e.code?r._`new RegExp`:(0,t.useFunc)(i,e),s=i.let("valid");i.try(()=>i.assign(s,r._`${a}(${c}, ${u}).test(${o})`),()=>i.assign(s,!1)),n.fail$data(r._`!${s}`)}else{const t=(0,e.usePattern)(n,s);n.fail$data(r._`!${t}.test(${o})`)}}};return jc.default=n,jc}var Ac,Oc={};function Ic(){if(Ac)return Oc;Ac=1,Object.defineProperty(Oc,"m",{value:!0});const e=Ua(),t={message({keyword:t,schemaCode:r}){const n="maxProperties"===t?"more":"fewer";return e.str`must NOT have ${n} than ${r} properties`},params:({schemaCode:t})=>e._`{limit: ${t}}`},r={keyword:["maxProperties","minProperties"],type:"object",schemaType:"number",$data:!0,error:t,code(t){const{keyword:r,data:n,schemaCode:i}=t,o="maxProperties"===r?e.operators.GT:e.operators.LT;t.fail$data(e._`Object.keys(${n}).length ${o} ${i}`)}};return Oc.default=r,Oc}var _c,zc={};function Nc(){if(_c)return zc;_c=1,Object.defineProperty(zc,"m",{value:!0});const e=bs(),t=Ua(),r=Ka(),n={keyword:"required",type:"object",schemaType:"array",$data:!0,error:{message:({params:{missingProperty:e}})=>t.str`must have required property '${e}'`,params:({params:{missingProperty:e}})=>t._`{missingProperty: ${e}}`},code(n){const{gen:i,schema:o,schemaCode:a,data:s,$data:c,it:d}=n,{opts:u}=d;if(!c&&0===o.length)return;const l=o.length>=u.loopRequired;if(d.allErrors?function(){if(l||c)n.block$data(t.nil,h);else for(const t of o)(0,e.checkReportMissingProp)(n,t)}():function(){const r=i.let("missing");if(l||c){const o=i.let("valid",!0);n.block$data(o,()=>function(r,o){n.setParams({missingProperty:r}),i.forOf(r,a,()=>{i.assign(o,(0,e.propertyInData)(i,s,r,u.ownProperties)),i.if((0,t.not)(o),()=>{n.error(),i.break()})},t.nil)}(r,o)),n.ok(o)}else i.if((0,e.checkMissingProp)(n,o,r)),(0,e.reportMissingProp)(n,r),i.else()}(),u.strictRequired){const e=n.parentSchema.properties,{definedProperties:t}=n.it;for(const n of o)if(void 0===(null==e?void 0:e[n])&&!t.has(n)){const e=`required property "${n}" is not defined at "${d.schemaEnv.baseId+d.errSchemaPath}" (strictRequired)`;(0,r.checkStrictMode)(d,e,d.opts.strictRequired)}}function h(){i.forOf("prop",a,t=>{n.setParams({missingProperty:t}),i.if((0,e.noPropertyInData)(i,s,t,u.ownProperties),()=>n.error())})}}};return zc.default=n,zc}var Rc,Tc={};function Mc(){if(Rc)return Tc;Rc=1,Object.defineProperty(Tc,"m",{value:!0});const e=Ua(),t={message({keyword:t,schemaCode:r}){const n="maxItems"===t?"more":"fewer";return e.str`must NOT have ${n} than ${r} items`},params:({schemaCode:t})=>e._`{limit: ${t}}`},r={keyword:["maxItems","minItems"],type:"array",schemaType:"number",$data:!0,error:t,code(t){const{keyword:r,data:n,schemaCode:i}=t,o="maxItems"===r?e.operators.GT:e.operators.LT;t.fail$data(e._`${n}.length ${o} ${i}`)}};return Tc.default=r,Tc}var Pc,Lc,Dc={},Bc={};function qc(){if(Pc)return Bc;Pc=1,Object.defineProperty(Bc,"m",{value:!0});const e=Es();return e.code='require("ajv/dist/runtime/equal").default',Bc.default=e,Bc}function Vc(){if(Lc)return Dc;Lc=1,Object.defineProperty(Dc,"m",{value:!0});const e=ds(),t=Ua(),r=Ka(),n=qc(),i={message:({params:{i:e,j:r}})=>t.str`must NOT have duplicate items (items ## ${r} and ${e} are identical)`,params:({params:{i:e,j:r}})=>t._`{i: ${e}, j: ${r}}`},o={keyword:"uniqueItems",type:"array",schemaType:"boolean",$data:!0,error:i,code(i){const{gen:o,data:a,$data:s,schema:c,parentSchema:d,schemaCode:u,it:l}=i;if(!s&&!c)return;const h=o.let("valid"),f=d.items?(0,e.getSchemaTypes)(d.items):[];function m(r,n){const s=o.name("item"),c=(0,e.checkDataTypes)(f,s,l.opts.strictNumbers,e.DataType.Wrong),d=o.const("indices",t._`{}`);o.for(t._`;${r}--;`,()=>{o.let(s,t._`${a}[${r}]`),o.if(c,t._`continue`),f.length>1&&o.if(t._`typeof ${s} == "string"`,t._`${s} += "_"`),o.if(t._`typeof ${d}[${s}] == "number"`,()=>{o.assign(n,t._`${d}[${s}]`),i.error(),o.assign(h,!1).break()}).code(t._`${d}[${s}] = ${r}`)})}function p(e,s){const c=(0,r.useFunc)(o,n.default),d=o.name("outer");o.label(d).for(t._`;${e}--;`,()=>o.for(t._`${s} = ${e}; ${s}--;`,()=>o.if(t._`${c}(${a}[${e}], ${a}[${s}])`,()=>{i.error(),o.assign(h,!1).break(d)})))}i.block$data(h,function(){const e=o.let("i",t._`${a}.length`),r=o.let("j");i.setParams({i:e,j:r}),o.assign(h,!0),o.if(t._`${e} > 1`,()=>(f.length>0&&!f.some(e=>"object"===e||"array"===e)?m:p)(e,r))},t._`${u} === false`),i.ok(h)}};return Dc.default=o,Dc}var Fc,Uc={};function Hc(){if(Fc)return Uc;Fc=1,Object.defineProperty(Uc,"m",{value:!0});const e=Ua(),t=Ka(),r=qc(),n={keyword:"const",$data:!0,error:{message:"must be equal to constant",params:({schemaCode:t})=>e._`{allowedValue: ${t}}`},code(n){const{gen:i,data:o,$data:a,schemaCode:s,schema:c}=n;a||c&&"object"==typeof c?n.fail$data(e._`!${(0,t.useFunc)(i,r.default)}(${o}, ${s})`):n.fail(e._`${c} !== ${o}`)}};return Uc.default=n,Uc}var Wc,Kc,Gc={};function Yc(){if(Wc)return Gc;Wc=1,Object.defineProperty(Gc,"m",{value:!0});const e=Ua(),t=Ka(),r=qc(),n={keyword:"enum",schemaType:"array",$data:!0,error:{message:"must be equal to one of the allowed values",params:({schemaCode:t})=>e._`{allowedValues: ${t}}`},code(n){const{gen:i,data:o,$data:a,schema:s,schemaCode:c,it:d}=n;if(!a&&0===s.length)throw new Error("enum must have non-empty array");const u=s.length>=d.opts.loopEnum;let l;const h=()=>null!=l?l:l=(0,t.useFunc)(i,r.default);let f;if(u||a)f=i.let("valid"),n.block$data(f,function(){i.assign(f,!1),i.forOf("v",c,t=>i.if(e._`${h()}(${o}, ${t})`,()=>i.assign(f,!0).break()))});else{if(!Array.isArray(s))throw new Error("ajv implementation error");const t=i.const("vSchema",c);f=(0,e.or)(...s.map((r,n)=>function(t,r){const n=s[r];return"object"==typeof n&&null!==n?e._`${h()}(${o}, ${t}[${r}])`:e._`${o} === ${n}`}(t,n)))}n.pass(f)}};return Gc.default=n,Gc}function Jc(){if(Kc)return fc;Kc=1,Object.defineProperty(fc,"m",{value:!0});const e=pc(),t=gc(),r=Cc(),n=Sc(),i=Ic(),o=Nc(),a=Mc(),s=Vc(),c=Hc(),d=Yc(),u=[e.default,t.default,r.default,n.default,i.default,o.default,a.default,s.default,{keyword:"type",schemaType:["string","array"]},{keyword:"nullable",schemaType:"boolean"},c.default,d.default];return fc.default=u,fc}var Zc,Qc={},Xc={};function ed(){if(Zc)return Xc;Zc=1,Object.defineProperty(Xc,"m",{value:!0}),Xc.validateAdditionalItems=void 0;const e=Ua(),t=Ka(),r={keyword:"additionalItems",type:"array",schemaType:["boolean","object"],before:"uniqueItems",error:{message:({params:{len:t}})=>e.str`must NOT have more than ${t} items`,params:({params:{len:t}})=>e._`{limit: ${t}}`},code(e){const{parentSchema:r,it:i}=e,{items:o}=r;Array.isArray(o)?n(e,o):(0,t.checkStrictMode)(i,'"additionalItems" is ignored when "items" is not an array of schemas')}};function n(r,n){const{gen:i,schema:o,data:a,keyword:s,it:c}=r;c.items=!0;const d=i.const("len",e._`${a}.length`);if(!1===o)r.setParams({len:n.length}),r.pass(e._`${d} <= ${n.length}`);else if("object"==typeof o&&!(0,t.alwaysValidSchema)(c,o)){const o=i.var("valid",e._`${d} <= ${n.length}`);i.if((0,e.not)(o),()=>function(o){i.forRange("i",n.length,d,n=>{r.subschema({keyword:s,dataProp:n,dataPropType:t.Type.Num},o),c.allErrors||i.if((0,e.not)(o),()=>i.break())})}(o)),r.ok(o)}}return Xc.validateAdditionalItems=n,Xc.default=r,Xc}var td,rd,nd={},id={};function od(){if(td)return id;td=1,Object.defineProperty(id,"m",{value:!0}),id.validateTuple=void 0;const e=Ua(),t=Ka(),r=bs(),n={keyword:"items",type:"array",schemaType:["object","array","boolean"],before:"uniqueItems",code(e){const{schema:n,it:o}=e;if(Array.isArray(n))return i(e,"additionalItems",n);o.items=!0,(0,t.alwaysValidSchema)(o,n)||e.ok((0,r.validateArray)(e))}};function i(r,n,i=r.schema){const{gen:o,parentSchema:a,data:s,keyword:c,it:d}=r;!function(e){const{opts:r,errSchemaPath:o}=d,a=i.length,s=a===e.minItems&&(a===e.maxItems||!1===e[n]);if(r.strictTuples&&!s){const e=`"${c}" is ${a}-tuple, but minItems or maxItems/${n} are not specified or different at path "${o}"`;(0,t.checkStrictMode)(d,e,r.strictTuples)}}(a),d.opts.unevaluated&&i.length&&!0!==d.items&&(d.items=t.mergeEvaluated.items(o,i.length,d.items));const u=o.name("valid"),l=o.const("len",e._`${s}.length`);i.forEach((n,i)=>{(0,t.alwaysValidSchema)(d,n)||(o.if(e._`${l} > ${i}`,()=>r.subschema({keyword:c,schemaProp:i,dataProp:i},u)),r.ok(u))})}return id.validateTuple=i,id.default=n,id}function ad(){if(rd)return nd;rd=1,Object.defineProperty(nd,"m",{value:!0});const e=od(),t={keyword:"prefixItems",type:"array",schemaType:["array"],before:"uniqueItems",code:t=>(0,e.validateTuple)(t,"items")};return nd.default=t,nd}var sd,cd={};function dd(){if(sd)return cd;sd=1,Object.defineProperty(cd,"m",{value:!0});const e=Ua(),t=Ka(),r=bs(),n=ed(),i={keyword:"items",type:"array",schemaType:["object","boolean"],before:"uniqueItems",error:{message:({params:{len:t}})=>e.str`must NOT have more than ${t} items`,params:({params:{len:t}})=>e._`{limit: ${t}}`},code(e){const{schema:i,parentSchema:o,it:a}=e,{prefixItems:s}=o;a.items=!0,(0,t.alwaysValidSchema)(a,i)||(s?(0,n.validateAdditionalItems)(e,s):e.ok((0,r.validateArray)(e)))}};return cd.default=i,cd}var ud,ld={};function hd(){if(ud)return ld;ud=1,Object.defineProperty(ld,"m",{value:!0});const e=Ua(),t=Ka(),r={keyword:"contains",type:"array",schemaType:["object","boolean"],before:"uniqueItems",trackErrors:!0,error:{message:({params:{min:t,max:r}})=>void 0===r?e.str`must contain at least ${t} valid item(s)`:e.str`must contain at least ${t} and no more than ${r} valid item(s)`,params:({params:{min:t,max:r}})=>void 0===r?e._`{minContains: ${t}}`:e._`{minContains: ${t}, maxContains: ${r}}`},code(r){const{gen:n,schema:i,parentSchema:o,data:a,it:s}=r;let c,d;const{minContains:u,maxContains:l}=o;s.opts.next?(c=void 0===u?1:u,d=l):c=1;const h=n.const("len",e._`${a}.length`);if(r.setParams({min:c,max:d}),void 0===d&&0===c)return void(0,t.checkStrictMode)(s,'"minContains" == 0 without "maxContains": "contains" keyword ignored');if(void 0!==d&&c>d)return(0,t.checkStrictMode)(s,'"minContains" > "maxContains" is always invalid'),void r.fail();if((0,t.alwaysValidSchema)(s,i)){let t=e._`${h} >= ${c}`;return void 0!==d&&(t=e._`${t} && ${h} <= ${d}`),void r.pass(t)}s.items=!0;const f=n.name("valid");function m(){const t=n.name("_valid"),r=n.let("count",0);p(t,()=>n.if(t,()=>function(t){n.code(e._`${t}++`),void 0===d?n.if(e._`${t} >= ${c}`,()=>n.assign(f,!0).break()):(n.if(e._`${t} > ${d}`,()=>n.assign(f,!1).break()),1===c?n.assign(f,!0):n.if(e._`${t} >= ${c}`,()=>n.assign(f,!0)))}(r)))}function p(e,i){n.forRange("i",0,h,n=>{r.subschema({keyword:"contains",dataProp:n,dataPropType:t.Type.Num,compositeRule:!0},e),i()})}void 0===d&&1===c?p(f,()=>n.if(f,()=>n.break())):0===c?(n.let(f,!0),void 0!==d&&n.if(e._`${a}.length > 0`,m)):(n.let(f,!1),m()),r.result(f,()=>r.reset())}};return ld.default=r,ld}var fd,md={};function pd(){return fd||(fd=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.validateSchemaDeps=e.validatePropertyDeps=e.error=void 0;const t=Ua(),r=Ka(),n=bs();e.error={message:({params:{property:e,depsCount:r,deps:n}})=>{const i=1===r?"property":"properties";return t.str`must have ${i} ${n} when property ${e} is present`},params:({params:{property:e,depsCount:r,deps:n,missingProperty:i}})=>t._`{property: ${e},
    missingProperty: ${i},
    depsCount: ${r},
    deps: ${n}}`};const i={keyword:"dependencies",type:"object",schemaType:"object",error:e.error,code(e){const[t,r]=function({schema:e}){const t={},r={};for(const n in e){if("__proto__"===n)continue;(Array.isArray(e[n])?t:r)[n]=e[n]}return[t,r]}(e);o(e,t),a(e,r)}};function o(e,r=e.schema){const{gen:i,data:o,it:a}=e;if(0===Object.keys(r).length)return;const s=i.let("missing");for(const c in r){const d=r[c];if(0===d.length)continue;const u=(0,n.propertyInData)(i,o,c,a.opts.ownProperties);e.setParams({property:c,depsCount:d.length,deps:d.join(", ")}),a.allErrors?i.if(u,()=>{for(const t of d)(0,n.checkReportMissingProp)(e,t)}):(i.if(t._`${u} && (${(0,n.checkMissingProp)(e,d,s)})`),(0,n.reportMissingProp)(e,s),i.else())}}function a(e,t=e.schema){const{gen:i,data:o,keyword:a,it:s}=e,c=i.name("valid");for(const d in t)(0,r.alwaysValidSchema)(s,t[d])||(i.if((0,n.propertyInData)(i,o,d,s.opts.ownProperties),()=>{const t=e.subschema({keyword:a,schemaProp:d},c);e.mergeValidEvaluated(t,c)},()=>i.var(c,!0)),e.ok(c))}e.validatePropertyDeps=o,e.validateSchemaDeps=a,e.default=i}(md)),md}var vd,bd={};function gd(){if(vd)return bd;vd=1,Object.defineProperty(bd,"m",{value:!0});const e=Ua(),t=Ka(),r={keyword:"propertyNames",type:"object",schemaType:["object","boolean"],error:{message:"property name must be valid",params:({params:t})=>e._`{propertyName: ${t.propertyName}}`},code(r){const{gen:n,schema:i,data:o,it:a}=r;if((0,t.alwaysValidSchema)(a,i))return;const s=n.name("valid");n.forIn("key",o,t=>{r.setParams({propertyName:t}),r.subschema({keyword:"propertyNames",data:t,dataTypes:["string"],propertyName:t,compositeRule:!0},s),n.if((0,e.not)(s),()=>{r.error(!0),a.allErrors||n.break()})}),r.ok(s)}};return bd.default=r,bd}var yd,wd={};function $d(){if(yd)return wd;yd=1,Object.defineProperty(wd,"m",{value:!0});const e=bs(),t=Ua(),r=Qa(),n=Ka(),i={keyword:"additionalProperties",type:["object"],schemaType:["boolean","object"],allowUndefined:!0,trackErrors:!0,error:{message:"must NOT have additional properties",params:({params:e})=>t._`{additionalProperty: ${e.additionalProperty}}`},code(i){const{gen:o,schema:a,parentSchema:s,data:c,errsCount:d,it:u}=i;if(!d)throw new Error("ajv implementation error");const{allErrors:l,opts:h}=u;if(u.props=!0,"all"!==h.removeAdditional&&(0,n.alwaysValidSchema)(u,a))return;const f=(0,e.allSchemaProperties)(s.properties),m=(0,e.allSchemaProperties)(s.patternProperties);function p(e){o.code(t._`delete ${c}[${e}]`)}function v(e){if("all"===h.removeAdditional||h.removeAdditional&&!1===a)p(e);else{if(!1===a)return i.setParams({additionalProperty:e}),i.error(),void(l||o.break());if("object"==typeof a&&!(0,n.alwaysValidSchema)(u,a)){const r=o.name("valid");"failing"===h.removeAdditional?(b(e,r,!1),o.if((0,t.not)(r),()=>{i.reset(),p(e)})):(b(e,r),l||o.if((0,t.not)(r),()=>o.break()))}}}function b(e,t,r){const o={keyword:"additionalProperties",dataProp:e,dataPropType:n.Type.Str};!1===r&&Object.assign(o,{compositeRule:!0,createErrors:!1,allErrors:!1}),i.subschema(o,t)}o.forIn("key",c,r=>{f.length||m.length?o.if(function(r){let a;if(f.length>8){const t=(0,n.schemaRefOrVal)(u,s.properties,"properties");a=(0,e.isOwnProperty)(o,t,r)}else a=f.length?(0,t.or)(...f.map(e=>t._`${r} === ${e}`)):t.nil;return m.length&&(a=(0,t.or)(a,...m.map(n=>t._`${(0,e.usePattern)(i,n)}.test(${r})`))),(0,t.not)(a)}(r),()=>v(r)):v(r)}),i.ok(t._`${d} === ${r.default.errors}`)}};return wd.default=i,wd}var kd,xd={};function Cd(){if(kd)return xd;kd=1,Object.defineProperty(xd,"m",{value:!0});const e=zs(),t=bs(),r=Ka(),n=$d(),i={keyword:"properties",type:"object",schemaType:"object",code(i){const{gen:o,schema:a,parentSchema:s,data:c,it:d}=i;"all"===d.opts.removeAdditional&&void 0===s.additionalProperties&&n.default.code(new e.KeywordCxt(d,n.default,"additionalProperties"));const u=(0,t.allSchemaProperties)(a);for(const e of u)d.definedProperties.add(e);d.opts.unevaluated&&u.length&&!0!==d.props&&(d.props=r.mergeEvaluated.props(o,(0,r.toHash)(u),d.props));const l=u.filter(e=>!(0,r.alwaysValidSchema)(d,a[e]));if(0===l.length)return;const h=o.name("valid");for(const e of l)f(e)?m(e):(o.if((0,t.propertyInData)(o,c,e,d.opts.ownProperties)),m(e),d.allErrors||o.else().var(h,!0),o.endIf()),i.it.definedProperties.add(e),i.ok(h);function f(e){return d.opts.useDefaults&&!d.compositeRule&&void 0!==a[e].default}function m(e){i.subschema({keyword:"properties",schemaProp:e,dataProp:e},h)}}};return xd.default=i,xd}var Ed,jd={};function Sd(){if(Ed)return jd;Ed=1,Object.defineProperty(jd,"m",{value:!0});const e=bs(),t=Ua(),r=Ka(),n=Ka(),i={keyword:"patternProperties",type:"object",schemaType:"object",code(i){const{gen:o,schema:a,data:s,parentSchema:c,it:d}=i,{opts:u}=d,l=(0,e.allSchemaProperties)(a),h=l.filter(e=>(0,r.alwaysValidSchema)(d,a[e]));if(0===l.length||h.length===l.length&&(!d.opts.unevaluated||!0===d.props))return;const f=u.strictSchema&&!u.allowMatchingProperties&&c.properties,m=o.name("valid");!0===d.props||d.props instanceof t.Name||(d.props=(0,n.evaluatedPropsToName)(o,d.props));const{props:p}=d;function v(e){for(const t in f)new RegExp(e).test(t)&&(0,r.checkStrictMode)(d,`property ${t} matches pattern ${e} (use allowMatchingProperties)`)}function b(r){o.forIn("key",s,a=>{o.if(t._`${(0,e.usePattern)(i,r)}.test(${a})`,()=>{const e=h.includes(r);e||i.subschema({keyword:"patternProperties",schemaProp:r,dataProp:a,dataPropType:n.Type.Str},m),d.opts.unevaluated&&!0!==p?o.assign(t._`${p}[${a}]`,!0):e||d.allErrors||o.if((0,t.not)(m),()=>o.break())})})}!function(){for(const e of l)f&&v(e),d.allErrors?b(e):(o.var(m,!0),b(e),o.if(m))}()}};return jd.default=i,jd}var Ad,Od={};function Id(){if(Ad)return Od;Ad=1,Object.defineProperty(Od,"m",{value:!0});const e=Ka(),t={keyword:"not",schemaType:["object","boolean"],trackErrors:!0,code(t){const{gen:r,schema:n,it:i}=t;if((0,e.alwaysValidSchema)(i,n))return void t.fail();const o=r.name("valid");t.subschema({keyword:"not",compositeRule:!0,createErrors:!1,allErrors:!1},o),t.failResult(o,()=>t.reset(),()=>t.error())},error:{message:"must NOT be valid"}};return Od.default=t,Od}var _d,zd={};function Nd(){if(_d)return zd;_d=1,Object.defineProperty(zd,"m",{value:!0});const e={keyword:"anyOf",schemaType:"array",trackErrors:!0,code:bs().validateUnion,error:{message:"must match a schema in anyOf"}};return zd.default=e,zd}var Rd,Td={};function Md(){if(Rd)return Td;Rd=1,Object.defineProperty(Td,"m",{value:!0});const e=Ua(),t=Ka(),r={keyword:"oneOf",schemaType:"array",trackErrors:!0,error:{message:"must match exactly one schema in oneOf",params:({params:t})=>e._`{passingSchemas: ${t.passing}}`},code(r){const{gen:n,schema:i,parentSchema:o,it:a}=r;if(!Array.isArray(i))throw new Error("ajv implementation error");if(a.opts.discriminator&&o.discriminator)return;const s=i,c=n.let("valid",!1),d=n.let("passing",null),u=n.name("_valid");r.setParams({passing:d}),n.block(function(){s.forEach((i,o)=>{let s;(0,t.alwaysValidSchema)(a,i)?n.var(u,!0):s=r.subschema({keyword:"oneOf",schemaProp:o,compositeRule:!0},u),o>0&&n.if(e._`${u} && ${c}`).assign(c,!1).assign(d,e._`[${d}, ${o}]`).else(),n.if(u,()=>{n.assign(c,!0),n.assign(d,o),s&&r.mergeEvaluated(s,e.Name)})})}),r.result(c,()=>r.reset(),()=>r.error(!0))}};return Td.default=r,Td}var Pd,Ld={};function Dd(){if(Pd)return Ld;Pd=1,Object.defineProperty(Ld,"m",{value:!0});const e=Ka(),t={keyword:"allOf",schemaType:"array",code(t){const{gen:r,schema:n,it:i}=t;if(!Array.isArray(n))throw new Error("ajv implementation error");const o=r.name("valid");n.forEach((r,n)=>{if((0,e.alwaysValidSchema)(i,r))return;const a=t.subschema({keyword:"allOf",schemaProp:n},o);t.ok(o),t.mergeEvaluated(a)})}};return Ld.default=t,Ld}var Bd,qd={};function Vd(){if(Bd)return qd;Bd=1,Object.defineProperty(qd,"m",{value:!0});const e=Ua(),t=Ka(),r={keyword:"if",schemaType:["object","boolean"],trackErrors:!0,error:{message:({params:t})=>e.str`must match "${t.ifClause}" schema`,params:({params:t})=>e._`{failingKeyword: ${t.ifClause}}`},code(r){const{gen:i,parentSchema:o,it:a}=r;void 0===o.then&&void 0===o.else&&(0,t.checkStrictMode)(a,'"if" without "then" and "else" is ignored');const s=n(a,"then"),c=n(a,"else");if(!s&&!c)return;const d=i.let("valid",!0),u=i.name("_valid");if(function(){const e=r.subschema({keyword:"if",compositeRule:!0,createErrors:!1,allErrors:!1},u);r.mergeEvaluated(e)}(),r.reset(),s&&c){const e=i.let("ifClause");r.setParams({ifClause:e}),i.if(u,l("then",e),l("else",e))}else s?i.if(u,l("then")):i.if((0,e.not)(u),l("else"));function l(t,n){return()=>{const o=r.subschema({keyword:t},u);i.assign(d,u),r.mergeValidEvaluated(o,d),n?i.assign(n,e._`${t}`):r.setParams({ifClause:t})}}r.pass(d,()=>r.error(!0))}};function n(e,r){const n=e.schema[r];return void 0!==n&&!(0,t.alwaysValidSchema)(e,n)}return qd.default=r,qd}var Fd,Ud,Hd={};function Wd(){if(Fd)return Hd;Fd=1,Object.defineProperty(Hd,"m",{value:!0});const e=Ka(),t={keyword:["then","else"],schemaType:["object","boolean"],code({keyword:t,parentSchema:r,it:n}){void 0===r.if&&(0,e.checkStrictMode)(n,`"${t}" without "if" is ignored`)}};return Hd.default=t,Hd}function Kd(){if(Ud)return Qc;Ud=1,Object.defineProperty(Qc,"m",{value:!0});const e=ed(),t=ad(),r=od(),n=dd(),i=hd(),o=pd(),a=gd(),s=$d(),c=Cd(),d=Sd(),u=Id(),l=Nd(),h=Md(),f=Dd(),m=Vd(),p=Wd();return Qc.default=function(v=!1){const b=[u.default,l.default,h.default,f.default,m.default,p.default,a.default,s.default,o.default,c.default,d.default];return v?b.push(t.default,n.default):b.push(e.default,r.default),b.push(i.default),b},Qc}var Gd,Yd,Jd={},Zd={};function Qd(){if(Gd)return Zd;Gd=1,Object.defineProperty(Zd,"m",{value:!0});const e=Ua(),t={keyword:"format",type:["number","string"],schemaType:"string",$data:!0,error:{message:({schemaCode:t})=>e.str`must match format "${t}"`,params:({schemaCode:t})=>e._`{format: ${t}}`},code(t,r){const{gen:n,data:i,$data:o,schema:a,schemaCode:s,it:c}=t,{opts:d,errSchemaPath:u,schemaEnv:l,self:h}=c;d.validateFormats&&(o?function(){const o=n.scopeValue("formats",{ref:h.formats,code:d.code.formats}),a=n.const("fDef",e._`${o}[${s}]`),c=n.let("fType"),u=n.let("format");n.if(e._`typeof ${a} == "object" && !(${a} instanceof RegExp)`,()=>n.assign(c,e._`${a}.type || "string"`).assign(u,e._`${a}.validate`),()=>n.assign(c,e._`"string"`).assign(u,a)),t.fail$data((0,e.or)(!1===d.strictSchema?e.nil:e._`${s} && !${u}`,function(){const t=l.$async?e._`(${a}.async ? await ${u}(${i}) : ${u}(${i}))`:e._`${u}(${i})`,n=e._`(typeof ${u} == "function" ? ${t} : ${u}.test(${i}))`;return e._`${u} && ${u} !== true && ${c} === ${r} && !${n}`}()))}():function(){const o=h.formats[a];if(!o)return void function(){if(!1===d.strictSchema)return void h.logger.warn(e());throw new Error(e());function e(){return`unknown format "${a}" ignored in schema at path "${u}"`}}();if(!0===o)return;const[s,c,f]=function(t){const r=t instanceof RegExp?(0,e.regexpCode)(t):d.code.formats?e._`${d.code.formats}${(0,e.getProperty)(a)}`:void 0,i=n.scopeValue("formats",{key:a,ref:t,code:r});if("object"==typeof t&&!(t instanceof RegExp))return[t.type||"string",t.validate,e._`${i}.validate`];return["string",t,i]}(o);s===r&&t.pass(function(){if("object"==typeof o&&!(o instanceof RegExp)&&o.async){if(!l.$async)throw new Error("async format in sync schema");return e._`await ${f}(${i})`}return"function"==typeof c?e._`${f}(${i})`:e._`${f}.test(${i})`}())}())}};return Zd.default=t,Zd}function Xd(){if(Yd)return Jd;Yd=1,Object.defineProperty(Jd,"m",{value:!0});const e=[Qd().default];return Jd.default=e,Jd}var eu,tu,ru={};function nu(){return eu||(eu=1,Object.defineProperty(ru,"m",{value:!0}),ru.contentVocabulary=ru.metadataVocabulary=void 0,ru.metadataVocabulary=["title","description","default","deprecated","readOnly","writeOnly","examples"],ru.contentVocabulary=["contentMediaType","contentEncoding","contentSchema"]),ru}function iu(){if(tu)return nc;tu=1,Object.defineProperty(nc,"m",{value:!0});const e=lc(),t=Jc(),r=Kd(),n=Xd(),i=nu(),o=[e.default,t.default,(0,r.default)(),n.default,i.metadataVocabulary,i.contentVocabulary];return nc.default=o,nc}var ou,au,su={},cu={};function du(){return ou||(ou=1,Object.defineProperty(cu,"m",{value:!0}),cu.DiscrError=void 0,function(e){e.Tag="tag",e.Mapping="mapping"}(e||(cu.DiscrError=e={}))),cu;var e}function uu(){if(au)return su;au=1,Object.defineProperty(su,"m",{value:!0});const e=Ua(),t=du(),r=qs(),n=Ls(),i=Ka(),o={keyword:"discriminator",type:"object",schemaType:"object",error:{message:({params:{discrError:e,tagName:r}})=>e===t.DiscrError.Tag?`tag "${r}" must be string`:`value of tag "${r}" must be in oneOf`,params:({params:{discrError:t,tag:r,tagName:n}})=>e._`{error: ${t}, tag: ${n}, tagValue: ${r}}`},code(o){const{gen:a,data:s,schema:c,parentSchema:d,it:u}=o,{oneOf:l}=d;if(!u.opts.discriminator)throw new Error("discriminator: requires discriminator option");const h=c.propertyName;if("string"!=typeof h)throw new Error("discriminator: requires propertyName");if(c.mapping)throw new Error("discriminator: mapping is not supported");if(!l)throw new Error("discriminator: requires oneOf keyword");const f=a.let("valid",!1),m=a.const("tag",e._`${s}${(0,e.getProperty)(h)}`);function p(t){const r=a.name("valid"),n=o.subschema({keyword:"oneOf",schemaProp:t},r);return o.mergeEvaluated(n,e.Name),r}a.if(e._`typeof ${m} == "string"`,()=>function(){const s=function(){var e;const t={},o=s(d);let a=!0;for(let t=0;t<l.length;t++){let d=l[t];if((null==d?void 0:d.$ref)&&!(0,i.schemaHasRulesButRef)(d,u.self.RULES)){const e=d.$ref;if(d=r.resolveRef.call(u.self,u.schemaEnv.root,u.baseId,e),d instanceof r.SchemaEnv&&(d=d.schema),void 0===d)throw new n.default(u.opts.uriResolver,u.baseId,e)}const f=null===(e=null==d?void 0:d.properties)||void 0===e?void 0:e[h];if("object"!=typeof f)throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${h}"`);a=a&&(o||s(d)),c(f,t)}if(!a)throw new Error(`discriminator: "${h}" must be required`);return t;function s({required:e}){return Array.isArray(e)&&e.includes(h)}function c(e,t){if(e.const)f(e.const,t);else{if(!e.enum)throw new Error(`discriminator: "properties/${h}" must have "const" or "enum"`);for(const r of e.enum)f(r,t)}}function f(e,r){if("string"!=typeof e||e in t)throw new Error(`discriminator: "${h}" values must be unique strings`);t[e]=r}}();a.if(!1);for(const t in s)a.elseIf(e._`${m} === ${t}`),a.assign(f,p(s[t]));a.else(),o.error(!1,{discrError:t.DiscrError.Mapping,tag:m,tagName:h}),a.endIf()}(),()=>o.error(!1,{discrError:t.DiscrError.Tag,tag:m,tagName:h})),o.ok(f)}};return su.default=o,su}var lu,hu={$schema:"http://json-schema.org/draft-07/schema#",$id:"http://json-schema.org/draft-07/schema#",title:"Core schema meta-schema",definitions:{schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},nonNegativeInteger:{type:"integer",minimum:0},nonNegativeIntegerDefault0:{allOf:[{$ref:"#/definitions/nonNegativeInteger"},{default:0}]},simpleTypes:{enum:["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},uniqueItems:!0,default:[]}},type:["object","boolean"],properties:{$id:{type:"string",format:"uri-reference"},$schema:{type:"string",format:"uri"},$ref:{type:"string",format:"uri-reference"},$comment:{type:"string"},title:{type:"string"},description:{type:"string"},default:!0,readOnly:{type:"boolean",default:!1},examples:{type:"array",items:!0},multipleOf:{type:"number",exclusiveMinimum:0},maximum:{type:"number"},exclusiveMaximum:{type:"number"},minimum:{type:"number"},exclusiveMinimum:{type:"number"},maxLength:{$ref:"#/definitions/nonNegativeInteger"},minLength:{$ref:"#/definitions/nonNegativeIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{$ref:"#"},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],default:!0},maxItems:{$ref:"#/definitions/nonNegativeInteger"},minItems:{$ref:"#/definitions/nonNegativeIntegerDefault0"},uniqueItems:{type:"boolean",default:!1},contains:{$ref:"#"},maxProperties:{$ref:"#/definitions/nonNegativeInteger"},minProperties:{$ref:"#/definitions/nonNegativeIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{$ref:"#"},definitions:{type:"object",additionalProperties:{$ref:"#"},default:{}},properties:{type:"object",additionalProperties:{$ref:"#"},default:{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},propertyNames:{format:"regex"},default:{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},propertyNames:{$ref:"#"},const:!0,enum:{type:"array",items:!0,minItems:1,uniqueItems:!0},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:!0}]},format:{type:"string"},contentMediaType:{type:"string"},contentEncoding:{type:"string"},if:{$ref:"#"},then:{$ref:"#"},else:{$ref:"#"},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},default:!0};function fu(){return lu||(lu=1,function(e,t){Object.defineProperty(t,"m",{value:!0}),t.MissingRefError=t.ValidationError=t.CodeGen=t.Name=t.nil=t.stringify=t.str=t._=t.KeywordCxt=t.Ajv=void 0;const r=tc(),n=iu(),i=uu(),o=hu,a=["/properties"],s="http://json-schema.org/draft-07/schema";class c extends r.default{_addVocabularies(){super._addVocabularies(),n.default.forEach(e=>this.addVocabulary(e)),this.opts.discriminator&&this.addKeyword(i.default)}_addDefaultMetaSchema(){if(super._addDefaultMetaSchema(),!this.opts.meta)return;const e=this.opts.$data?this.$dataMetaSchema(o,a):o;this.addMetaSchema(e,s,!1),this.refs["http://json-schema.org/schema"]=s}defaultMeta(){return this.opts.defaultMeta=super.defaultMeta()||(this.getSchema(s)?s:void 0)}}t.Ajv=c,e.exports=t=c,e.exports.Ajv=c,Object.defineProperty(t,"m",{value:!0}),t.default=c;var d=zs();Object.defineProperty(t,"KeywordCxt",{enumerable:!0,get:function(){return d.KeywordCxt}});var u=Ua();Object.defineProperty(t,"_",{enumerable:!0,get:function(){return u._}}),Object.defineProperty(t,"str",{enumerable:!0,get:function(){return u.str}}),Object.defineProperty(t,"stringify",{enumerable:!0,get:function(){return u.stringify}}),Object.defineProperty(t,"nil",{enumerable:!0,get:function(){return u.nil}}),Object.defineProperty(t,"Name",{enumerable:!0,get:function(){return u.Name}}),Object.defineProperty(t,"CodeGen",{enumerable:!0,get:function(){return u.CodeGen}});var l=Ts();Object.defineProperty(t,"ValidationError",{enumerable:!0,get:function(){return l.default}});var h=Ls();Object.defineProperty(t,"MissingRefError",{enumerable:!0,get:function(){return h.default}})}(za,za.exports)),za.exports}var mu,pu=se(fu()),vu={exports:{}},bu={};var gu,yu,wu={};var $u,ku,xu,Cu,Eu,ju,Su,Au,Ou,Iu,_u,zu,Nu,Ru,Tu=(yu||(yu=1,function(e,t){Object.defineProperty(t,"m",{value:!0});const r=(mu||(mu=1,function(e){function t(e,t){return{validate:e,compare:t}}Object.defineProperty(e,"m",{value:!0}),e.formatNames=e.fastFormats=e.fullFormats=void 0,e.fullFormats={date:t(i,o),time:t(s,c),"date-time":t(function(e){const t=e.split(d);return 2===t.length&&i(t[0])&&s(t[1],!0)},u),duration:/^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,uri:function(e){return l.test(e)&&h.test(e)},"uri-reference":/^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,"uri-template":/^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,url:/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,email:/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,hostname:/^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,ipv4:/^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,ipv6:/^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,regex:function(e){if(b.test(e))return!1;try{return new RegExp(e),!0}catch(e){return!1}},uuid:/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,"json-pointer":/^(?:\/(?:[^~/]|~0|~1)*)*$/,"json-pointer-uri-fragment":/^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,"relative-json-pointer":/^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,byte:function(e){return f.lastIndex=0,f.test(e)},int32:{type:"number",validate:function(e){return Number.isInteger(e)&&e<=p&&e>=m}},int64:{type:"number",validate:function(e){return Number.isInteger(e)}},float:{type:"number",validate:v},double:{type:"number",validate:v},password:!0,binary:!0},e.fastFormats={...e.fullFormats,date:t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/,o),time:t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,c),"date-time":t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,u),uri:/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,"uri-reference":/^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,email:/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i},e.formatNames=Object.keys(e.fullFormats);const r=/^(\d\d\d\d)-(\d\d)-(\d\d)$/,n=[0,31,28,31,30,31,30,31,31,30,31,30,31];function i(e){const t=r.exec(e);if(!t)return!1;const i=+t[1],o=+t[2],a=+t[3];return o>=1&&o<=12&&a>=1&&a<=(2===o&&function(e){return e%4==0&&(e%100!=0||e%400==0)}(i)?29:n[o])}function o(e,t){if(e&&t)return e>t?1:e<t?-1:0}const a=/^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;function s(e,t){const r=a.exec(e);if(!r)return!1;const n=+r[1],i=+r[2],o=+r[3],s=r[5];return(n<=23&&i<=59&&o<=59||23===n&&59===i&&60===o)&&(!t||""!==s)}function c(e,t){if(!e||!t)return;const r=a.exec(e),n=a.exec(t);return r&&n?(e=r[1]+r[2]+r[3]+(r[4]||""))>(t=n[1]+n[2]+n[3]+(n[4]||""))?1:e<t?-1:0:void 0}const d=/t|\s/i;function u(e,t){if(!e||!t)return;const[r,n]=e.split(d),[i,a]=t.split(d),s=o(r,i);return void 0!==s?s||c(n,a):void 0}const l=/\/|:/,h=/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,f=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm,m=-2147483648,p=2**31-1;function v(){return!0}const b=/[^\\]\\Z/}(bu)),bu),n=(gu||(gu=1,function(e){Object.defineProperty(e,"m",{value:!0}),e.formatLimitDefinition=void 0;const t=fu(),r=Ua(),n=r.operators,i={formatMaximum:{okStr:"<=",ok:n.LTE,fail:n.GT},formatMinimum:{okStr:">=",ok:n.GTE,fail:n.LT},formatExclusiveMaximum:{okStr:"<",ok:n.LT,fail:n.GTE},formatExclusiveMinimum:{okStr:">",ok:n.GT,fail:n.LTE}},o={message:({keyword:e,schemaCode:t})=>r.str`should be ${i[e].okStr} ${t}`,params:({keyword:e,schemaCode:t})=>r._`{comparison: ${i[e].okStr}, limit: ${t}}`};e.formatLimitDefinition={keyword:Object.keys(i),type:"string",schemaType:"string",$data:!0,error:o,code(e){const{gen:n,data:o,schemaCode:a,keyword:s,it:c}=e,{opts:d,self:u}=c;if(!d.validateFormats)return;const l=new t.KeywordCxt(c,u.RULES.all.format.definition,"format");function h(e){return r._`${e}.compare(${o}, ${a}) ${i[s].fail} 0`}l.$data?function(){const t=n.scopeValue("formats",{ref:u.formats,code:d.code.formats}),i=n.const("fmt",r._`${t}[${l.schemaCode}]`);e.fail$data(r.or(r._`typeof ${i} != "object"`,r._`${i} instanceof RegExp`,r._`typeof ${i}.compare != "function"`,h(i)))}():function(){const t=l.schema,i=u.formats[t];if(!i||!0===i)return;if("object"!=typeof i||i instanceof RegExp||"function"!=typeof i.compare)throw new Error(`"${s}": format "${t}" does not define "compare" function`);const o=n.scopeValue("formats",{key:t,ref:i,code:d.code.formats?r._`${d.code.formats}${r.getProperty(t)}`:void 0});e.fail$data(h(o))}()},dependencies:["format"]},e.default=t=>(t.addKeyword(e.formatLimitDefinition),t)}(wu)),wu),i=Ua(),o=new i.Name("fullFormats"),a=new i.Name("fastFormats"),s=(e,t={keywords:!0})=>{if(Array.isArray(t))return c(e,t,r.fullFormats,o),e;const[i,s]="fast"===t.mode?[r.fastFormats,a]:[r.fullFormats,o];return c(e,t.formats||r.formatNames,i,s),t.keywords&&n.default(e),e};function c(e,t,r,n){var o,a;null!==(o=(a=e.opts.code).formats)&&void 0!==o||(a.formats=i._`require("ajv-formats/dist/formats").${n}`);for(const n of t)e.addFormat(n,r[n])}s.get=(e,t="full")=>{const n=("fast"===t?r.fastFormats:r.fullFormats)[e];if(!n)throw new Error(`Unknown format "${e}"`);return n},e.exports=t=s,Object.defineProperty(t,"m",{value:!0}),t.default=s}(vu,vu.exports)),vu.exports),Mu=se(Tu);function Pu(){if(Cu)return xu;Cu=1;var e=(ku?$u:(ku=1,$u=function(e){return function(t,r,n){for(var i=-1,o=Object(t),a=n(t),s=a.length;s--;){var c=a[e?s:++i];if(!1===r(o[c],c,o))break}return t}}))();return xu=e}function Lu(){if(Iu)return Ou;Iu=1;var e=function(){if(ju)return Eu;ju=1;var e=Pu(),t=cr();return Eu=function(r,n){return r&&e(r,n,t)}}(),t=function(){if(Au)return Su;Au=1;var e=Se();return Su=function(t,r){return function(n,i){if(null==n)return n;if(!e(n))return t(n,i);for(var o=n.length,a=r?o:-1,s=Object(n);(r?a--:++a<o)&&!1!==i(s[a],a,s););return n}}}()(e);return Ou=t}var Du,Bu,qu=se(function(){if(Ru)return Nu;Ru=1;var e=Zo(),t=function(){if(zu)return _u;zu=1;var e=Lu();return _u=function(t,r){var n=[];return e(t,function(e,t,i){r(e,t,i)&&n.push(e)}),n}}(),r=da(),n=Ee();return Nu=function(i,o){return(n(i)?e:t)(i,r(o,3))}}());var Vu,Fu,Uu,Hu,Wu,Ku,Gu=se(function(){if(Bu)return Du;Bu=1;var e=ra();return Du=function(t,r){return e(t,r)}}());function Yu(){if(Fu)return Vu;Fu=1;var e=ye(),t=function(){try{var t=e(Object,"defineProperty");return t({},"",{}),t}catch(e){}}();return Vu=t}function Ju(){if(Hu)return Uu;Hu=1;var e=Yu();return Uu=function(t,r,n){"__proto__"==r&&e?e(t,r,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[r]=n}}function Zu(){if(Ku)return Wu;Ku=1;var e=Ju(),t=Ar();return Wu=function(r,n,i){(void 0!==i&&!t(r[n],i)||void 0===i&&!(n in r))&&e(r,n,i)}}var Qu,Xu,el,tl,rl,nl,il,ol,al,sl,cl,dl,ul,ll,hl,fl,ml,pl,vl,bl,gl,yl,wl,$l,kl,xl,Cl,El,jl,Sl,Al,Ol,Il,_l,zl,Nl,Rl,Tl,Ml,Pl,Ll,Dl,Bl,ql,Vl,Fl,Ul,Hl,Wl,Kl,Gl,Yl,Jl,Zl={exports:{}};function Ql(){return Qu||(Qu=1,e=Zl,t=Zl.exports,r=he(),n=t&&!t.nodeType&&t,i=n&&e&&!e.nodeType&&e,o=i&&i.exports===n?r.Buffer:void 0,a=o?o.allocUnsafe:void 0,e.exports=function(e,t){if(t)return e.slice();var r=e.length,n=a?a(r):new e.constructor(r);return e.copy(n),n}),Zl.exports;var e,t,r,n,i,o,a}function Xl(){if(el)return Xu;el=1;var e=Wo();return Xu=function(t){var r=new t.constructor(t.byteLength);return new e(r).set(new e(t)),r}}function eh(){if(rl)return tl;rl=1;var e=Xl();return tl=function(t,r){var n=r?e(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)}}function th(){if(il)return nl;return il=1,nl=function(e,t){var r=-1,n=e.length;for(t||(t=Array(n));++r<n;)t[r]=e[r];return t}}function rh(){if(al)return ol;al=1;var e=pe(),t=Object.create,r=function(){function r(){}return function(n){if(!e(n))return{};if(t)return t(n);r.prototype=n;var i=new r;return r.prototype=void 0,i}}();return ol=r}function nh(){if(cl)return sl;cl=1;var e=de()(Object.getPrototypeOf,Object);return sl=e}function ih(){if(ul)return dl;ul=1;var e=rh(),t=nh(),r=ce();return dl=function(n){return"function"!=typeof n.constructor||r(n)?{}:e(t(n))}}function oh(){if(ml)return fl;ml=1;var e=me(),t=nh(),r=xe(),n=Function.prototype,i=Object.prototype,o=n.toString,a=i.hasOwnProperty,s=o.call(Object);return fl=function(n){if(!r(n)||"[object Object]"!=e(n))return!1;var i=t(n);if(null===i)return!0;var c=a.call(i,"constructor")&&i.constructor;return"function"==typeof c&&c instanceof c&&o.call(c)==s}}function ah(){if(vl)return pl;return vl=1,pl=function(e,t){if(("constructor"!==t||"function"!=typeof e[t])&&"__proto__"!=t)return e[t]}}function sh(){if(gl)return bl;gl=1;var e=Ju(),t=Ar(),r=Object.prototype.hasOwnProperty;return bl=function(n,i,o){var a=n[i];r.call(n,i)&&t(a,o)&&(void 0!==o||i in n)||e(n,i,o)}}function ch(){if(wl)return yl;wl=1;var e=sh(),t=Ju();return yl=function(r,n,i,o){var a=!i;i||(i={});for(var s=-1,c=n.length;++s<c;){var d=n[s],u=o?o(i[d],r[d],d,i,r):void 0;void 0===u&&(u=r[d]),a?t(i,d,u):e(i,d,u)}return i}}function dh(){if(Cl)return xl;Cl=1;var e=pe(),t=ce(),r=kl?$l:(kl=1,$l=function(e){var t=[];if(null!=e)for(var r in Object(e))t.push(r);return t}),n=Object.prototype.hasOwnProperty;return xl=function(i){if(!e(i))return r(i);var o=t(i),a=[];for(var s in i)("constructor"!=s||!o&&n.call(i,s))&&a.push(s);return a}}function uh(){if(jl)return El;jl=1;var e=sr(),t=dh(),r=Se();return El=function(n){return r(n)?e(n,!0):t(n)}}function lh(){if(Il)return Ol;Il=1;var e=Zu(),t=Ql(),r=eh(),n=th(),i=ih(),o=Ce(),a=Ee(),s=function(){if(hl)return ll;hl=1;var e=Se(),t=xe();return ll=function(r){return t(r)&&e(r)}}(),c=Me(),d=ve(),u=pe(),l=oh(),h=He(),f=ah(),m=function(){if(Al)return Sl;Al=1;var e=ch(),t=uh();return Sl=function(r){return e(r,t(r))}}();return Ol=function(p,v,b,g,y,w,$){var k=f(p,b),x=f(v,b),C=$.get(x);if(C)e(p,b,C);else{var E=w?w(k,x,b+"",p,v,$):void 0,j=void 0===E;if(j){var S=a(x),A=!S&&c(x),O=!S&&!A&&h(x);E=x,S||A||O?a(k)?E=k:s(k)?E=n(k):A?(j=!1,E=t(x,!0)):O?(j=!1,E=r(x,!0)):E=[]:l(x)||o(x)?(E=k,o(k)?E=m(k):u(k)&&!d(k)||(E=i(x))):j=!1}j&&($.set(x,E),y(E,x,g,w,$),$.delete(x)),e(p,b,E)}}}function hh(){if(Rl)return Nl;return Rl=1,Nl=function(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}}function fh(){if(Ml)return Tl;Ml=1;var e=hh(),t=Math.max;return Tl=function(r,n,i){return n=t(void 0===n?r.length-1:n,0),function(){for(var o=arguments,a=-1,s=t(o.length-n,0),c=Array(s);++a<s;)c[a]=o[n+a];a=-1;for(var d=Array(n+1);++a<n;)d[a]=o[a];return d[n]=i(c),e(r,this,d)}},Tl}function mh(){if(Bl)return Dl;Bl=1;var e=Ll?Pl:(Ll=1,Pl=function(e){return function(){return e}}),t=Yu(),r=sa();return Dl=t?function(r,n){return t(r,"toString",{configurable:!0,enumerable:!1,value:e(n),writable:!0})}:r}function ph(){if(Vl)return ql;Vl=1;var e=Date.now;return ql=function(t){var r=0,n=0;return function(){var i=e(),o=16-(i-n);if(n=i,o>0){if(++r>=800)return arguments[0]}else r=0;return t.apply(void 0,arguments)}},ql}function vh(){if(Ul)return Fl;Ul=1;var e=mh(),t=ph()(e);return Fl=t}function bh(){if(Gl)return Kl;Gl=1;var e=function(){if(Wl)return Hl;Wl=1;var e=sa(),t=fh(),r=vh();return Hl=function(n,i){return r(t(n,i,e),n+"")}}(),t=Or();return Kl=function(r){return e(function(e,n){var i=-1,o=n.length,a=o>1?n[o-1]:void 0,s=o>2?n[2]:void 0;for(a=r.length>3&&"function"==typeof a?(o--,a):void 0,s&&t(n[0],n[1],s)&&(a=o<3?void 0:a,o=1),e=Object(e);++i<o;){var c=n[i];c&&r(e,c,i,a)}return e})}}var gh,yh,wh,$h,kh,xh,Ch,Eh,jh,Sh,Ah,Oh,Ih,_h,zh,Nh,Rh,Th,Mh,Ph,Lh,Dh,Bh,qh,Vh,Fh,Uh,Hh,Wh,Kh,Gh,Yh,Jh,Zh,Qh,Xh,ef=function(){if(Jl)return Yl;Jl=1;var e=function(){if(zl)return _l;zl=1;var e=Fo(),t=Zu(),r=Pu(),n=lh(),i=pe(),o=uh(),a=ah();return _l=function s(c,d,u,l,h){c!==d&&r(d,function(r,o){if(h||(h=new e),i(r))n(c,d,o,u,s,l,h);else{var f=l?l(a(c,o),r,o+"",c,d,h):void 0;void 0===f&&(f=r),t(c,o,f)}},o)},_l}(),t=bh()(function(t,r,n){e(t,r,n)});return Yl=t}(),tf=se(ef);function rf(){if(yh)return gh;return yh=1,gh=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n&&!1!==t(e[r],r,e););return e}}function nf(){if($h)return wh;$h=1;var e=ch(),t=cr();return wh=function(r,n){return r&&e(n,t(n),r)}}function of(){if(Sh)return jh;Sh=1;var e=Yo(),t=nh(),r=Xo(),n=Qo(),i=Object.getOwnPropertySymbols;return jh=i?function(n){for(var i=[];n;)e(i,r(n)),n=t(n);return i}:n}function af(){if(qh)return Bh;qh=1;var e=Xl(),t=function(){if(Th)return Rh;Th=1;var e=Xl();return Rh=function(t,r){var n=r?e(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}}(),r=function(){if(Ph)return Mh;Ph=1;var e=/\w*$/;return Mh=function(t){var r=new t.constructor(t.source,e.exec(t));return r.lastIndex=t.lastIndex,r}}(),n=function(){if(Dh)return Lh;Dh=1;var e=fe(),t=e?e.prototype:void 0,r=t?t.valueOf:void 0;return Lh=function(e){return r?Object(r.call(e)):{}}}(),i=eh();return Bh=function(o,a,s){var c=o.constructor;switch(a){case"[object ArrayBuffer]":return e(o);case"[object Boolean]":case"[object Date]":return new c(+o);case"[object DataView]":return t(o,s);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return i(o,s);case"[object Map]":case"[object Set]":return new c;case"[object Number]":case"[object String]":return new c(o);case"[object RegExp]":return r(o);case"[object Symbol]":return n(o)}}}function sf(){if(Hh)return Uh;Hh=1;var e=function(){if(Fh)return Vh;Fh=1;var e=ke(),t=xe();return Vh=function(r){return t(r)&&"[object Map]"==e(r)}}(),t=Pe(),r=Ue(),n=r&&r.isMap,i=n?t(n):e;return Uh=i}function cf(){if(Yh)return Gh;Yh=1;var e=function(){if(Kh)return Wh;Kh=1;var e=ke(),t=xe();return Wh=function(r){return t(r)&&"[object Set]"==e(r)}}(),t=Pe(),r=Ue(),n=r&&r.isSet,i=n?t(n):e;return Gh=i}function df(){if(Zh)return Jh;Zh=1;var e=Fo(),t=rf(),r=sh(),n=nf(),i=function(){if(xh)return kh;xh=1;var e=ch(),t=uh();return kh=function(r,n){return r&&e(n,t(n),r)}}(),o=Ql(),a=th(),s=function(){if(Eh)return Ch;Eh=1;var e=ch(),t=Xo();return Ch=function(r,n){return e(r,t(r),n)}}(),c=function(){if(Oh)return Ah;Oh=1;var e=ch(),t=of();return Ah=function(r,n){return e(r,t(r),n)}}(),d=ea(),u=function(){if(_h)return Ih;_h=1;var e=Jo(),t=of(),r=uh();return Ih=function(n){return e(n,r,t)}}(),l=ke(),h=function(){if(Nh)return zh;Nh=1;var e=Object.prototype.hasOwnProperty;return zh=function(t){var r=t.length,n=new t.constructor(r);return r&&"string"==typeof t[0]&&e.call(t,"index")&&(n.index=t.index,n.input=t.input),n}}(),f=af(),m=ih(),p=Ee(),v=Me(),b=sf(),g=pe(),y=cf(),w=cr(),$=uh(),k="[object Arguments]",x="[object Function]",C="[object Object]",E={};return E[k]=E["[object Array]"]=E["[object ArrayBuffer]"]=E["[object DataView]"]=E["[object Boolean]"]=E["[object Date]"]=E["[object Float32Array]"]=E["[object Float64Array]"]=E["[object Int8Array]"]=E["[object Int16Array]"]=E["[object Int32Array]"]=E["[object Map]"]=E["[object Number]"]=E[C]=E["[object RegExp]"]=E["[object Set]"]=E["[object String]"]=E["[object Symbol]"]=E["[object Uint8Array]"]=E["[object Uint8ClampedArray]"]=E["[object Uint16Array]"]=E["[object Uint32Array]"]=!0,E["[object Error]"]=E[x]=E["[object WeakMap]"]=!1,Jh=function j(S,A,O,I,_,z){var N,R=1&A,T=2&A,M=4&A;if(O&&(N=_?O(S,I,_,z):O(S)),void 0!==N)return N;if(!g(S))return S;var P=p(S);if(P){if(N=h(S),!R)return a(S,N)}else{var L=l(S),D=L==x||"[object GeneratorFunction]"==L;if(v(S))return o(S,R);if(L==C||L==k||D&&!_){if(N=T||D?{}:m(S),!R)return T?c(S,i(N,S)):s(S,n(N,S))}else{if(!E[L])return _?S:{};N=f(S,L,R)}}z||(z=new e);var B=z.get(S);if(B)return B;z.set(S,N),y(S)?S.forEach(function(e){N.add(j(e,A,O,e,S,z))}):b(S)&&S.forEach(function(e,t){N.set(t,j(e,A,O,t,S,z))});var q=P?void 0:(M?T?u:d:T?$:w)(S);return t(q||S,function(e,t){q&&(e=S[t=e]),r(N,t,j(e,A,O,t,S,z))}),N},Jh}var uf,lf,hf,ff,mf,pf,vf,bf,gf,yf,wf,$f,kf,xf,Cf,Ef,jf,Sf,Af,Of,If,_f,zf,Nf,Rf,Tf,Mf,Pf,Lf,Df,Bf,qf,Vf,Ff,Uf,Hf,Wf,Kf,Gf,Yf,Jf,Zf,Qf,Xf,em,tm,rm,nm,im,om,am,sm,cm,dm,um,lm,hm,fm,mm,pm,vm,bm,gm,ym,wm,$m,km,xm,Cm,Em,jm,Sm,Am,Om,Im,_m,zm,Nm,Rm,Tm,Mm,Pm,Lm,Dm,Bm,qm,Vm,Fm,Um,Hm,Wm,Km,Gm,Ym,Jm,Zm,Qm,Xm,ep,tp,rp,np,ip,op=se(function(){if(Xh)return Qh;Xh=1;var e=df();return Qh=function(t){return e(t,5)}}()),ap={};function sp(){return hf?lf:(hf=1,lf={})}function cp(){if(mf)return ff;mf=1;var e,t=(uf||(uf=1,(e=ap).aliasToReal={each:"forEach",eachRight:"forEachRight",entries:"toPairs",entriesIn:"toPairsIn",extend:"assignIn",extendAll:"assignInAll",extendAllWith:"assignInAllWith",extendWith:"assignInWith",first:"head",conforms:"conformsTo",matches:"isMatch",property:"get",A:"placeholder",F:"stubFalse",T:"stubTrue",all:"every",allPass:"overEvery",always:"constant",any:"some",anyPass:"overSome",apply:"spread",assoc:"set",assocPath:"set",complement:"negate",compose:"flowRight",contains:"includes",dissoc:"unset",dissocPath:"unset",dropLast:"dropRight",dropLastWhile:"dropRightWhile",equals:"isEqual",identical:"eq",indexBy:"keyBy",init:"initial",invertObj:"invert",juxt:"over",omitAll:"omit",nAry:"ary",path:"get",pathEq:"matchesProperty",pathOr:"getOr",paths:"at",pickAll:"pick",pipe:"flow",pluck:"map",prop:"get",propEq:"matchesProperty",propOr:"getOr",props:"at",symmetricDifference:"xor",symmetricDifferenceBy:"xorBy",symmetricDifferenceWith:"xorWith",takeLast:"takeRight",takeLastWhile:"takeRightWhile",unapply:"rest",unnest:"flatten",useWith:"overArgs",where:"conformsTo",whereEq:"isMatch",zipObj:"zipObject"},e.aryMethod={1:["assignAll","assignInAll","attempt","castArray","ceil","create","curry","curryRight","defaultsAll","defaultsDeepAll","floor","flow","flowRight","fromPairs","invert","iteratee","memoize","method","mergeAll","methodOf","mixin","nthArg","over","overEvery","overSome","rest","reverse","round","runInContext","spread","template","trim","trimEnd","trimStart","uniqueId","words","zipAll"],2:["add","after","ary","assign","assignAllWith","assignIn","assignInAllWith","at","before","bind","bindAll","bindKey","chunk","cloneDeepWith","cloneWith","concat","conformsTo","countBy","curryN","curryRightN","debounce","defaults","defaultsDeep","defaultTo","delay","difference","divide","drop","dropRight","dropRightWhile","dropWhile","endsWith","eq","every","filter","find","findIndex","findKey","findLast","findLastIndex","findLastKey","flatMap","flatMapDeep","flattenDepth","forEach","forEachRight","forIn","forInRight","forOwn","forOwnRight","get","groupBy","gt","gte","has","hasIn","includes","indexOf","intersection","invertBy","invoke","invokeMap","isEqual","isMatch","join","keyBy","lastIndexOf","lt","lte","map","mapKeys","mapValues","matchesProperty","maxBy","meanBy","merge","mergeAllWith","minBy","multiply","nth","omit","omitBy","overArgs","pad","padEnd","padStart","parseInt","partial","partialRight","partition","pick","pickBy","propertyOf","pull","pullAll","pullAt","random","range","rangeRight","rearg","reject","remove","repeat","restFrom","result","sampleSize","some","sortBy","sortedIndex","sortedIndexOf","sortedLastIndex","sortedLastIndexOf","sortedUniqBy","split","spreadFrom","startsWith","subtract","sumBy","take","takeRight","takeRightWhile","takeWhile","tap","throttle","thru","times","trimChars","trimCharsEnd","trimCharsStart","truncate","union","uniqBy","uniqWith","unset","unzipWith","without","wrap","xor","zip","zipObject","zipObjectDeep"],3:["assignInWith","assignWith","clamp","differenceBy","differenceWith","findFrom","findIndexFrom","findLastFrom","findLastIndexFrom","getOr","includesFrom","indexOfFrom","inRange","intersectionBy","intersectionWith","invokeArgs","invokeArgsMap","isEqualWith","isMatchWith","flatMapDepth","lastIndexOfFrom","mergeWith","orderBy","padChars","padCharsEnd","padCharsStart","pullAllBy","pullAllWith","rangeStep","rangeStepRight","reduce","reduceRight","replace","set","slice","sortedIndexBy","sortedLastIndexBy","transform","unionBy","unionWith","update","xorBy","xorWith","zipWith"],4:["fill","setWith","updateWith"]},e.aryRearg={2:[1,0],3:[2,0,1],4:[3,2,0,1]},e.iterateeAry={dropRightWhile:1,dropWhile:1,every:1,filter:1,find:1,findFrom:1,findIndex:1,findIndexFrom:1,findKey:1,findLast:1,findLastFrom:1,findLastIndex:1,findLastIndexFrom:1,findLastKey:1,flatMap:1,flatMapDeep:1,flatMapDepth:1,forEach:1,forEachRight:1,forIn:1,forInRight:1,forOwn:1,forOwnRight:1,map:1,mapKeys:1,mapValues:1,partition:1,reduce:2,reduceRight:2,reject:1,remove:1,some:1,takeRightWhile:1,takeWhile:1,times:1,transform:2},e.iterateeRearg={mapKeys:[1],reduceRight:[1,0]},e.methodRearg={assignInAllWith:[1,0],assignInWith:[1,2,0],assignAllWith:[1,0],assignWith:[1,2,0],differenceBy:[1,2,0],differenceWith:[1,2,0],getOr:[2,1,0],intersectionBy:[1,2,0],intersectionWith:[1,2,0],isEqualWith:[1,2,0],isMatchWith:[2,1,0],mergeAllWith:[1,0],mergeWith:[1,2,0],padChars:[2,1,0],padCharsEnd:[2,1,0],padCharsStart:[2,1,0],pullAllBy:[2,1,0],pullAllWith:[2,1,0],rangeStep:[1,2,0],rangeStepRight:[1,2,0],setWith:[3,1,2,0],sortedIndexBy:[2,1,0],sortedLastIndexBy:[2,1,0],unionBy:[1,2,0],unionWith:[1,2,0],updateWith:[3,1,2,0],xorBy:[1,2,0],xorWith:[1,2,0],zipWith:[1,2,0]},e.methodSpread={assignAll:{start:0},assignAllWith:{start:0},assignInAll:{start:0},assignInAllWith:{start:0},defaultsAll:{start:0},defaultsDeepAll:{start:0},invokeArgs:{start:2},invokeArgsMap:{start:2},mergeAll:{start:0},mergeAllWith:{start:0},partial:{start:1},partialRight:{start:1},without:{start:1},zipAll:{start:0}},e.mutate={array:{fill:!0,pull:!0,pullAll:!0,pullAllBy:!0,pullAllWith:!0,pullAt:!0,remove:!0,reverse:!0},object:{assign:!0,assignAll:!0,assignAllWith:!0,assignIn:!0,assignInAll:!0,assignInAllWith:!0,assignInWith:!0,assignWith:!0,defaults:!0,defaultsAll:!0,defaultsDeep:!0,defaultsDeepAll:!0,merge:!0,mergeAll:!0,mergeAllWith:!0,mergeWith:!0},set:{set:!0,setWith:!0,unset:!0,update:!0,updateWith:!0}},e.realToAlias=function(){var t=Object.prototype.hasOwnProperty,r=e.aliasToReal,n={};for(var i in r){var o=r[i];t.call(n,o)?n[o].push(i):n[o]=[i]}return n}(),e.remap={assignAll:"assign",assignAllWith:"assignWith",assignInAll:"assignIn",assignInAllWith:"assignInWith",curryN:"curry",curryRightN:"curryRight",defaultsAll:"defaults",defaultsDeepAll:"defaultsDeep",findFrom:"find",findIndexFrom:"findIndex",findLastFrom:"findLast",findLastIndexFrom:"findLastIndex",getOr:"get",includesFrom:"includes",indexOfFrom:"indexOf",invokeArgs:"invoke",invokeArgsMap:"invokeMap",lastIndexOfFrom:"lastIndexOf",mergeAll:"merge",mergeAllWith:"mergeWith",padChars:"pad",padCharsEnd:"padEnd",padCharsStart:"padStart",propertyOf:"get",rangeStep:"range",rangeStepRight:"rangeRight",restFrom:"rest",spreadFrom:"spread",trimChars:"trim",trimCharsEnd:"trimEnd",trimCharsStart:"trimStart",zipAll:"zip"},e.skipFixed={castArray:!0,flow:!0,flowRight:!0,iteratee:!0,mixin:!0,rearg:!0,runInContext:!0},e.skipRearg={add:!0,assign:!0,assignIn:!0,bind:!0,bindKey:!0,concat:!0,difference:!0,divide:!0,eq:!0,gt:!0,gte:!0,isEqual:!0,lt:!0,lte:!0,matchesProperty:!0,merge:!0,multiply:!0,overArgs:!0,partial:!0,partialRight:!0,propertyOf:!0,random:!0,range:!0,rangeRight:!0,subtract:!0,zip:!0,zipObject:!0,zipObjectDeep:!0}),ap),r=sp(),n=Array.prototype.push;function i(e,t){return 2==t?function(t,r){return e(t,r)}:function(t){return e(t)}}function o(e){for(var t=e?e.length:0,r=Array(t);t--;)r[t]=e[t];return r}function a(e,t){return function(){var r=arguments.length;if(r){for(var n=Array(r);r--;)n[r]=arguments[r];var i=n[0]=t.apply(void 0,n);return e.apply(void 0,n),i}}}return ff=function e(s,c,d,u){var l="function"==typeof c,h=c===Object(c);if(h&&(u=d,d=c,c=void 0),null==d)throw new TypeError;u||(u={});var f=!("cap"in u)||u.cap,m=!("curry"in u)||u.curry,p=!("fixed"in u)||u.fixed,v=!("immutable"in u)||u.immutable,b=!("rearg"in u)||u.rearg,g=l?d:r,y="curry"in u&&u.curry,w="fixed"in u&&u.fixed,$="rearg"in u&&u.rearg,k=l?d.runInContext():void 0,x=l?d:{ary:s.ary,assign:s.assign,clone:s.clone,curry:s.curry,forEach:s.forEach,isArray:s.isArray,isError:s.isError,isFunction:s.isFunction,isWeakMap:s.isWeakMap,iteratee:s.iteratee,keys:s.keys,rearg:s.rearg,toInteger:s.toInteger,toPath:s.toPath},C=x.ary,E=x.assign,j=x.clone,S=x.curry,A=x.forEach,O=x.isArray,I=x.isError,_=x.isFunction,z=x.isWeakMap,N=x.keys,R=x.rearg,T=x.toInteger,M=x.toPath,P=N(t.aryMethod),L={castArray:function(e){return function(){var t=arguments[0];return O(t)?e(o(t)):e.apply(void 0,arguments)}},iteratee:function(e){return function(){var t=arguments[1],r=e(arguments[0],t),n=r.length;return f&&"number"==typeof t?(t=t>2?t-2:1,n&&n<=t?r:i(r,t)):r}},mixin:function(e){return function(t){var r=this;if(!_(r))return e(r,Object(t));var n=[];return A(N(t),function(e){_(t[e])&&n.push([e,r.prototype[e]])}),e(r,Object(t)),A(n,function(e){var t=e[1];_(t)?r.prototype[e[0]]=t:delete r.prototype[e[0]]}),r}},nthArg:function(e){return function(t){var r=t<0?1:T(t)+1;return S(e(t),r)}},rearg:function(e){return function(t,r){var n=r?r.length:0;return S(e(t,r),n)}},runInContext:function(t){return function(r){return e(s,t(r),u)}}};function D(e,r){if(f){var n=t.iterateeRearg[e];if(n)return function(e,t){return U(e,function(e){var r=t.length;return function(e,t){return 2==t?function(t,r){return e.apply(void 0,arguments)}:function(t){return e.apply(void 0,arguments)}}(R(i(e,r),t),r)})}(r,n);var o=!l&&t.iterateeAry[e];if(o)return function(e,t){return U(e,function(e){return"function"==typeof e?i(e,t):e})}(r,o)}return r}function B(e,r,i){if(p&&(w||!t.skipFixed[e])){var o=t.methodSpread[e],a=o&&o.start;return void 0===a?C(r,i):function(e,t){return function(){for(var r=arguments.length,i=r-1,o=Array(r);r--;)o[r]=arguments[r];var a=o[t],s=o.slice(0,t);return a&&n.apply(s,a),t!=i&&n.apply(s,o.slice(t+1)),e.apply(this,s)}}(r,a)}return r}function q(e,r,n){return b&&n>1&&($||!t.skipRearg[e])?R(r,t.methodRearg[e]||t.aryRearg[n]):r}function V(e,t){for(var r=-1,n=(t=M(t)).length,i=n-1,o=j(Object(e)),a=o;null!=a&&++r<n;){var s=t[r],c=a[s];null==c||_(c)||I(c)||z(c)||(a[s]=j(r==i?c:Object(c))),a=a[s]}return o}function F(r,n){var i=t.aliasToReal[r]||r,o=t.remap[i]||i,a=u;return function(t){var r=l?k:x,s=l?k[o]:n,c=E(E({},a),t);return e(r,i,s,c)}}function U(e,t){return function(){var r=arguments.length;if(!r)return e();for(var n=Array(r);r--;)n[r]=arguments[r];var i=b?0:r-1;return n[i]=t(n[i]),e.apply(void 0,n)}}function H(e,r,n){var i,s=t.aliasToReal[e]||e,c=r,d=L[s];return d?c=d(r):v&&(t.mutate.array[s]?c=a(r,o):t.mutate.object[s]?c=a(r,function(e){return function(t){return e({},t)}}(r)):t.mutate.set[s]&&(c=a(r,V))),A(P,function(e){return A(t.aryMethod[e],function(r){if(s==r){var n=t.methodSpread[s],o=n&&n.afterRearg;return i=o?B(s,q(s,c,e),e):q(s,B(s,c,e),e),i=function(e,t,r){return y||m&&r>1?S(t,r):t}(0,i=D(s,i),e),!1}}),!i}),i||(i=c),i==r&&(i=y?S(i,1):function(){return r.apply(this,arguments)}),i.convert=F(s,r),i.placeholder=r.placeholder=n,i}if(!h)return H(c,d,g);var W=d,K=[];return A(P,function(e){A(t.aryMethod[e],function(e){var r=W[t.remap[e]||e];r&&K.push([e,H(e,r,W)])})}),A(N(W),function(e){var t=W[e];if("function"==typeof t){for(var r=K.length;r--;)if(K[r][0]==e)return;t.convert=F(e,t),K.push([e,t])}}),A(K,function(e){W[e[0]]=e[1]}),W.convert=function(e){return W.runInContext.convert(e)(void 0)},W.placeholder=W,A(N(W),function(e){A(t.realToAlias[e]||[],function(t){W[t]=W[e]})}),W},ff}function dp(){if(vf)return pf;vf=1;var e=$e(),t=e&&new e;return pf=t}function up(){if(gf)return bf;gf=1;var e=sa(),t=dp();return bf=t?function(e,r){return t.set(e,r),e}:e}function lp(){if(wf)return yf;wf=1;var e=rh(),t=pe();return yf=function(r){return function(){var n=arguments;switch(n.length){case 0:return new r;case 1:return new r(n[0]);case 2:return new r(n[0],n[1]);case 3:return new r(n[0],n[1],n[2]);case 4:return new r(n[0],n[1],n[2],n[3]);case 5:return new r(n[0],n[1],n[2],n[3],n[4]);case 6:return new r(n[0],n[1],n[2],n[3],n[4],n[5]);case 7:return new r(n[0],n[1],n[2],n[3],n[4],n[5],n[6])}var i=e(r.prototype),o=r.apply(i,n);return t(o)?o:i}},yf}function hp(){if(Cf)return xf;Cf=1;var e=Math.max;return xf=function(t,r,n,i){for(var o=-1,a=t.length,s=n.length,c=-1,d=r.length,u=e(a-s,0),l=Array(d+u),h=!i;++c<d;)l[c]=r[c];for(;++o<s;)(h||o<a)&&(l[n[o]]=t[o]);for(;u--;)l[c++]=t[o++];return l}}function fp(){if(jf)return Ef;jf=1;var e=Math.max;return Ef=function(t,r,n,i){for(var o=-1,a=t.length,s=-1,c=n.length,d=-1,u=r.length,l=e(a-c,0),h=Array(l+u),f=!i;++o<l;)h[o]=t[o];for(var m=o;++d<u;)h[m+d]=r[d];for(;++s<c;)(f||o<a)&&(h[m+n[s]]=t[o++]);return h}}function mp(){if(If)return Of;return If=1,Of=function(){}}function pp(){if(zf)return _f;zf=1;var e=rh(),t=mp();function r(e){this.I=e,this.N=[],this.R=1,this.M=!1,this.P=[],this.L=4294967295,this.D=[]}return r.prototype=e(t.prototype),r.prototype.constructor=r,_f=r}function vp(){if(Mf)return Tf;Mf=1;var e=dp(),t=Rf?Nf:(Rf=1,Nf=function(){});return Tf=e?function(t){return e.get(t)}:t}function bp(){if(Bf)return Df;Bf=1;var e=Lf?Pf:(Lf=1,Pf={}),t=Object.prototype.hasOwnProperty;return Df=function(r){for(var n=r.name+"",i=e[n],o=t.call(e,n)?i.length:0;o--;){var a=i[o],s=a.func;if(null==s||s==r)return a.name}return n}}function gp(){if(Vf)return qf;Vf=1;var e=rh(),t=mp();function r(e,t){this.I=e,this.N=[],this.B=!!t,this.q=0,this.V=void 0}return r.prototype=e(t.prototype),r.prototype.constructor=r,qf=r}function yp(){if(Wf)return Hf;Wf=1;var e=pp(),t=gp(),r=mp(),n=Ee(),i=xe(),o=function(){if(Uf)return Ff;Uf=1;var e=pp(),t=gp(),r=th();return Ff=function(n){if(n instanceof e)return n.clone();var i=new t(n.I,n.B);return i.N=r(n.N),i.q=n.q,i.V=n.V,i}}(),a=Object.prototype.hasOwnProperty;function s(r){if(i(r)&&!n(r)&&!(r instanceof e)){if(r instanceof t)return r;if(a.call(r,"__wrapped__"))return o(r)}return new t(r)}return s.prototype=r.prototype,s.prototype.constructor=s,Hf=s}function wp(){if(Jf)return Yf;Jf=1;var e=up(),t=ph()(e);return Yf=t}function $p(){if(im)return nm;im=1;var e=rf(),t=function(){if(rm)return tm;rm=1;var e=Aa();return tm=function(t,r){return!(null==t||!t.length)&&e(t,r,0)>-1}}(),r=[["ary",128],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",32],["partialRight",64],["rearg",256]];return nm=function(n,i){return e(r,function(e){var r="_."+e[0];i&e[1]&&!t(n,r)&&n.push(r)}),n.sort()}}function kp(){if(am)return om;am=1;var e=function(){if(Qf)return Zf;Qf=1;var e=/\{\n\/\* \[wrapped with (.+)\] \*/,t=/,? & /;return Zf=function(r){var n=r.match(e);return n?n[1].split(t):[]}}(),t=function(){if(em)return Xf;em=1;var e=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;return Xf=function(t,r){var n=r.length;if(!n)return t;var i=n-1;return r[i]=(n>1?"& ":"")+r[i],r=r.join(n>2?", ":" "),t.replace(e,"{\n/* [wrapped with "+r+"] */\n")}}(),r=vh(),n=$p();return om=function(i,o,a){var s=o+"";return r(i,t(s,n(e(s),a)))}}function xp(){if(cm)return sm;cm=1;var e=function(){if(Gf)return Kf;Gf=1;var e=pp(),t=vp(),r=bp(),n=yp();return Kf=function(i){var o=r(i),a=n[o];if("function"!=typeof a||!(o in e.prototype))return!1;if(i===a)return!0;var s=t(a);return!!s&&i===s[0]}}(),t=wp(),r=kp();return sm=function(n,i,o,a,s,c,d,u,l,h){var f=8&i;i|=f?32:64,4&(i&=~(f?64:32))||(i&=-4);var m=[n,i,s,f?c:void 0,f?d:void 0,f?void 0:c,f?void 0:d,u,l,h],p=o.apply(void 0,m);return e(n)&&t(p,m),p.placeholder=a,r(p,n,i)},sm}function Cp(){if(um)return dm;return um=1,dm=function(e){return e.placeholder}}function Ep(){if(mm)return fm;mm=1;var e="__lodash_placeholder__";return fm=function(t,r){for(var n=-1,i=t.length,o=0,a=[];++n<i;){var s=t[n];s!==r&&s!==e||(t[n]=e,a[o++]=n)}return a},fm}function jp(){if(vm)return pm;vm=1;var e=hp(),t=fp(),r=(Af||(Af=1,Sf=function(e,t){for(var r=e.length,n=0;r--;)e[r]===t&&++n;return n}),Sf),n=lp(),i=xp(),o=Cp(),a=function(){if(hm)return lm;hm=1;var e=th(),t=ar(),r=Math.min;return lm=function(n,i){for(var o=n.length,a=r(i.length,o),s=e(n);a--;){var c=i[a];n[a]=t(c,o)?s[c]:void 0}return n}}(),s=Ep(),c=he();return pm=function d(u,l,h,f,m,p,v,b,g,y){var w=128&l,$=1&l,k=2&l,x=24&l,C=512&l,E=k?void 0:n(u);return function j(){for(var S=arguments.length,A=Array(S),O=S;O--;)A[O]=arguments[O];if(x)var I=o(j),_=r(A,I);if(f&&(A=e(A,f,m,x)),p&&(A=t(A,p,v,x)),S-=_,x&&S<y){var z=s(A,I);return i(u,l,d,j.placeholder,h,A,z,b,g,y-S)}var N=$?h:this,R=k?N[u]:u;return S=A.length,b?A=a(A,b):C&&S>1&&A.reverse(),w&&g<S&&(A.length=g),this&&this!==c&&this instanceof j&&(R=E||n(R)),R.apply(N,A)}},pm}function Sp(){if(Cm)return xm;Cm=1;var e=up(),t=function(){if(kf)return $f;kf=1;var e=lp(),t=he();return $f=function(r,n,i){var o=1&n,a=e(r);return function e(){return(this&&this!==t&&this instanceof e?a:r).apply(o?i:this,arguments)}},$f}(),r=function(){if(gm)return bm;gm=1;var e=hh(),t=lp(),r=jp(),n=xp(),i=Cp(),o=Ep(),a=he();return bm=function(s,c,d){var u=t(s);return function t(){for(var l=arguments.length,h=Array(l),f=l,m=i(t);f--;)h[f]=arguments[f];var p=l<3&&h[0]!==m&&h[l-1]!==m?[]:o(h,m);return(l-=p.length)<d?n(s,c,r,t.placeholder,void 0,h,p,void 0,void 0,d-l):e(this&&this!==a&&this instanceof t?u:s,this,h)}},bm}(),n=jp(),i=function(){if(wm)return ym;wm=1;var e=hh(),t=lp(),r=he();return ym=function(n,i,o,a){var s=1&i,c=t(n);return function t(){for(var i=-1,d=arguments.length,u=-1,l=a.length,h=Array(l+d),f=this&&this!==r&&this instanceof t?c:n;++u<l;)h[u]=a[u];for(;d--;)h[u++]=arguments[++i];return e(f,s?o:this,h)}},ym}(),o=vp(),a=function(){if(km)return $m;km=1;var e=hp(),t=fp(),r=Ep(),n="__lodash_placeholder__",i=128,o=Math.min;return $m=function(a,s){var c=a[1],d=s[1],u=c|d,l=u<131,h=d==i&&8==c||d==i&&256==c&&a[7].length<=s[8]||384==d&&s[7].length<=s[8]&&8==c;if(!l&&!h)return a;1&d&&(a[2]=s[2],u|=1&c?0:4);var f=s[3];if(f){var m=a[3];a[3]=m?e(m,f,s[4]):f,a[4]=m?r(a[3],n):s[4]}return(f=s[5])&&(m=a[5],a[5]=m?t(m,f,s[6]):f,a[6]=m?r(a[5],n):s[6]),(f=s[7])&&(a[7]=f),d&i&&(a[8]=null==a[8]?s[8]:o(a[8],s[8])),null==a[9]&&(a[9]=s[9]),a[0]=s[0],a[1]=u,a}}(),s=wp(),c=kp(),d=la(),u=Math.max;return xm=function(l,h,f,m,p,v,b,g){var y=2&h;if(!y&&"function"!=typeof l)throw new TypeError("Expected a function");var w=m?m.length:0;if(w||(h&=-97,m=p=void 0),b=void 0===b?b:u(d(b),0),g=void 0===g?g:d(g),w-=p?p.length:0,64&h){var $=m,k=p;m=p=void 0}var x=y?void 0:o(l),C=[l,h,f,m,p,$,k,v,b,g];if(x&&a(C,x),l=C[0],h=C[1],f=C[2],m=C[3],p=C[4],!(g=C[9]=void 0===C[9]?y?0:l.length:u(C[9]-w,0))&&24&h&&(h&=-25),h&&1!=h)E=8==h||16==h?r(l,h,g):32!=h&&33!=h||p.length?n.apply(void 0,C):i(l,h,f,m);else var E=t(l,h,f);return c((x?e:s)(E,C),l,h)}}function Ap(){if(jm)return Em;jm=1;var e=Sp();return Em=function(t,r,n){return r=n?void 0:r,r=t&&null==r?t.length:r,e(t,128,void 0,void 0,void 0,void 0,r)},Em}function Op(){if(Am)return Sm;Am=1;var e=df();return Sm=function(t){return e(t,4)}}function Ip(){if(Im)return Om;Im=1;var e=Sp();function t(r,n,i){var o=e(r,8,void 0,void 0,void 0,void 0,void 0,n=i?void 0:n);return o.placeholder=t.placeholder,o}return t.placeholder={},Om=t}function _p(){if(zm)return _m;zm=1;var e=me(),t=xe(),r=oh();return _m=function(n){if(!t(n))return!1;var i=e(n);return"[object Error]"==i||"[object DOMException]"==i||"string"==typeof n.message&&"string"==typeof n.name&&!r(n)}}function zp(){if(Rm)return Nm;Rm=1;var e=ke(),t=xe();return Nm=function(r){return t(r)&&"[object WeakMap]"==e(r)}}function Np(){if(Mm)return Tm;Mm=1;var e=df(),t=da();return Tm=function(r){return t("function"==typeof r?r:e(r,1))}}function Rp(){if(Bm)return Dm;Bm=1;var e=Yo(),t=function(){if(Lm)return Pm;Lm=1;var e=fe(),t=Ce(),r=Ee(),n=e?e.isConcatSpreadable:void 0;return Pm=function(e){return r(e)||t(e)||!!(n&&e&&e[n])}}();return Dm=function r(n,i,o,a,s){var c=-1,d=n.length;for(o||(o=t),s||(s=[]);++c<d;){var u=n[c];i>0&&o(u)?i>1?r(u,i-1,o,a,s):e(s,u):a||(s[s.length]=u)}return s},Dm}function Tp(){if(Um)return Fm;Um=1;var e=function(){if(Vm)return qm;Vm=1;var e=Rp();return qm=function(t){return null!=t&&t.length?e(t,1):[]}}(),t=fh(),r=vh();return Fm=function(n){return r(t(n,void 0,e),n+"")}}function Mp(){if(Wm)return Hm;Wm=1;var e=Sp(),t=Tp(),r=t(function(t,r){return e(t,256,void 0,void 0,void 0,r)});return Hm=r}function Pp(){if(Gm)return Km;Gm=1;var e=Bt(),t=th(),r=Ee(),n=qt(),i=Jn(),o=Qn(),a=Ft();return Km=function(s){return r(s)?e(s,o):n(s)?[s]:t(i(a(s)))}}function Lp(){if(Qm)return Zm;Qm=1;var e=cp(),t=Jm?Ym:(Jm=1,Ym={ary:Ap(),assign:nf(),clone:Op(),curry:Ip(),forEach:rf(),isArray:Ee(),isError:_p(),isFunction:ve(),isWeakMap:zp(),iteratee:Np(),keys:ue(),rearg:Mp(),toInteger:la(),toPath:Pp()});return Zm=function(r,n,i){return e(t,r,n,i)}}function Dp(){if(rp)return tp;rp=1;var e=function(){if(ep)return Xm;ep=1;var e=sh(),t=Zn(),r=ar(),n=pe(),i=Qn();return Xm=function(o,a,s,c){if(!n(o))return o;for(var d=-1,u=(a=t(a,o)).length,l=u-1,h=o;null!=h&&++d<u;){var f=i(a[d]),m=s;if("__proto__"===f||"constructor"===f||"prototype"===f)return o;if(d!=l){var p=h[f];void 0===(m=c?c(p,f,h):void 0)&&(m=n(p)?p:r(a[d+1])?[]:{})}e(h,f,m),h=h[f]}return o}}();return tp=function(t,r,n){return null==t?t:e(t,r,n)}}var Bp,qp,Vp,Fp,Up,Hp,Wp,Kp,Gp,Yp,Jp=se(function(){if(ip)return np;ip=1;var e=Lp()("set",Dp());return e.placeholder=sp(),np=e}());function Zp(){if(qp)return Bp;return qp=1,Bp=function(e){var t=null==e?0:e.length;return t?e[t-1]:void 0}}function Qp(){if(Hp)return Up;Hp=1;var e=Zn(),t=Zp(),r=function(){if(Fp)return Vp;Fp=1;var e=Xn(),t=Wt();return Vp=function(r,n){return n.length<2?r:e(r,t(n,0,-1))}}(),n=Qn(),i=Object.prototype.hasOwnProperty;return Up=function(o,a){var s=-1,c=(a=e(a,o)).length;if(!c)return!0;for(;++s<c;){var d=n(a[s]);if("__proto__"===d&&!i.call(o,"__proto__"))return!1;if(("constructor"===d||"prototype"===d)&&s<c-1)return!1}var u=r(o,a);return null==u||delete u[n(t(a))]}}var Xp,ev,tv,rv,nv,iv,ov,av,sv,cv,dv=se(function(){if(Yp)return Gp;Yp=1;var e=Lp()("unset",function(){if(Kp)return Wp;Kp=1;var e=Qp();return Wp=function(t,r){return null==t||e(t,r)}}());return e.placeholder=sp(),Gp=e}()),uv=se(ve());!function(){if(iv)return nv;iv=1;var e=function(){if(ev)return Xp;ev=1;var e=qt();return Xp=function(t,r,n){for(var i=-1,o=t.length;++i<o;){var a=t[i],s=r(a);if(null!=s&&(void 0===c?s==s&&!e(s):n(s,c)))var c=s,d=a}return d}}(),t=rv?tv:(rv=1,tv=function(e,t){return e>t}),r=da();nv=function(n,i){return n&&n.length?e(n,r(i,2),t):void 0}}();var lv,hv,fv,mv,pv=se(function(){if(cv)return sv;cv=1;var e=da(),t=function(){if(av)return ov;av=1;var e=Qp(),t=ar(),r=Array.prototype.splice;return ov=function(n,i){for(var o=n?i.length:0,a=o-1;o--;){var s=i[o];if(o==a||s!==c){var c=s;t(s)?r.call(n,s,1):e(n,s)}}return n}}();return sv=function(r,n){var i=[];if(!r||!r.length)return i;var o=-1,a=[],s=r.length;for(n=e(n,3);++o<s;){var c=r[o];n(c,o,r)&&(i.push(c),a.push(o))}return t(r,a),i}}());var vv,bv,gv,yv,wv,$v,kv,xv,Cv,Ev,jv,Sv,Av=se(function(){if(mv)return fv;mv=1;var e=hv?lv:(hv=1,lv=function(e,t,r){return e==e&&(void 0!==r&&(e=e<=r?e:r),void 0!==t&&(e=e>=t?e:t)),e}),t=Vt(),r=la(),n=Ft();return fv=function(i,o,a){i=n(i),o=t(o);var s=i.length,c=a=void 0===a?s:e(r(a),0,s);return(a-=o.length)>=0&&i.slice(a,c)==o}}());function Ov(){if(Ev)return Cv;Ev=1;var e=function(){if($v)return wv;$v=1;var e=Bt();return wv=function(t,r){return e(r,function(e){return[e,t[e]]})}}(),t=ke(),r=Ko(),n=(xv||(xv=1,kv=function(e){var t=-1,r=Array(e.size);return e.forEach(function(e){r[++t]=[e,e]}),r}),kv);return Cv=function(i){return function(o){var a=t(o);return"[object Map]"==a?r(o):"[object Set]"==a?n(o):e(o,i(o))}}}Zp(),function(){if(yv)return gv;yv=1;var e=Lt(),t=Lu(),r=da(),n=bv?vv:(bv=1,vv=function(e,t,r,n,i){return i(e,function(e,i,o){r=n?(n=!1,e):t(r,e,i,o)}),r}),i=Ee();gv=function(o,a,s){var c=i(o)?e:n,d=arguments.length<3;return c(o,r(a,4),s,d,t)}}(),function(){if(Sv)return jv;Sv=1;var e=Ov()(cr());jv=e}();const Iv="additionalProperties",_v="required";class zv{constructor(e){this.findOption=e,this.schemaObject=e=>{const t=this.properties(e),r={type:"object",properties:t,additionalProperties:this.findOption(t)(Iv)},n=this.findOption(t)(_v);return n.length>0&&(r.required=n),r},this.properties=e=>Object.keys(e).reduce((t,r)=>(t[r]=this.property(e[r]),t),{}),this.property=e=>{switch(typeof e){case"string":return{type:"string"};case"boolean":return{type:"boolean"};case"number":return Number.isInteger(e)?{type:"integer"}:{type:"number"};case"object":return null==e?{type:"null"}:this.schemaObjectOrArray(e);default:return{}}},this.schemaObjectOrArray=e=>e instanceof Array?this.schemaArray(e):this.schemaObject(e),this.schemaArray=e=>{if(e.length>0){const t=((e,t)=>{const r={};return e.filter(e=>{const n=t(e);return!Object.prototype.hasOwnProperty.call(r,n)&&(r[n]=!0,!0)})})(e.map(this.property),e=>JSON.stringify(e));return 1===t.length?{type:"array",items:t[0]}:{type:"array",items:{oneOf:t}}}return{type:"array",items:{}}}}}const Nv=new Map,Rv=new Map,Tv=(e,t)=>t<=1?e:e+t.toString(),Mv=e=>{void 0===e&&(e="undefined");let t=Rv.get(e);void 0===t&&(t={used:new Set,next:0},Rv.set(e,t));let r=t.next;for(;t.used.has(r)||Nv.has(Tv(e,r));)r++;const n=Tv(e,r);return t.used.add(r),t.next=r+1,Nv.set(n,{prefix:e,index:r}),n},Pv=e=>{const t=Nv.get(e);if(void 0===t)return!1;Nv.delete(e);const r=Rv.get(t.prefix);return void 0!==r&&(r.used.delete(t.index),t.index<r.next&&(r.next=t.index),0===r.used.size&&Rv.delete(t.prefix)),!0},Lv=e=>e?.replace(/~1/g,"/").replace(/~0/,"~"),Dv=(e,t)=>{if(t&&"string"==typeof t.title)return t.title;if("string"==typeof e.scope){const t=e.scope,r=Lv(t.substr(t.lastIndexOf("/")+1));return or(r)}return""},Bv=(e,t)=>({text:e,show:t}),qv=(e,t)=>{if(Pt(t))return e;return t.split(".").reduce((e,t)=>{if(e&&Object.prototype.hasOwnProperty.call(e,t))return e[t]},e)},Vv=(e,t,r)=>Fv(e,t,{rootSchema:r,resolutionMap:new Map}),Fv=(e,t,r)=>{let n;if(e&&"string"==typeof e.$ref){const i=Uv(r.rootSchema,e.$ref,r);void 0!==i&&(n=Uv(i,t,r))}return void 0===n&&(n=Uv(e,t,r)),n},Uv=(e,t,r)=>{let n=r.resolutionMap.get(e);if(n||(n=new Set,r.resolutionMap.set(e,n)),n.has(t))return;n.add(t);const i=Hv(e,t?.split("/").map(Lv),r);return n.delete(t),i},Hv=(e,t,r)=>{if(!t||0===t.length)return e;if(Pt(e))return;const n=Wv(e,t,r);if(void 0!==n)return n;const i=[].concat(e.oneOf??[],e.allOf??[],e.anyOf??[],e.then??[],e.else??[]);for(const e of i){let n=e;e&&"string"==typeof e.$ref&&(n=Fv(r.rootSchema,e.$ref,r));const i=Hv(n,t,r);if(i)return i}},Wv=(e,t,r)=>{if(!t||0===t.length)return e;if(Pt(e))return;const n=Kv(e,t);return n.schema&&"string"==typeof n.schema.$ref&&(n.schema=Fv(r.rootSchema,n.schema.$ref,r)),Hv(n.schema,n.remainingPathSegments,r)},Kv=(e,t)=>{if(!t||0===t.length)return{schema:e,remainingPathSegments:[]};if(Pt(e))return{schema:void 0,remainingPathSegments:t};const[r,...n]=t;if("#"===(i=r)||void 0===i||""===i)return Kv(e,n);var i;return{schema:si(e,r),remainingPathSegments:n,resolvedSegment:r}};var Gv;!function(e){e.HIDE="HIDE",e.SHOW="SHOW",e.ENABLE="ENABLE",e.DISABLE="DISABLE",e.READONLY="READONLY",e.WRITABLE="WRITABLE"}(Gv||(Gv={}));const Yv=(e,t)=>{if(!Zv(e))return t??"";const r=(e=>{const t=e.replace(/(anyOf|allOf|oneOf)\/[\d]+\//g,"").replace(/(then|else)\//g,"").split("/").map(Lv),r="#"===t[0]||""===t[0];return qn(r?2:1,t.length,2).map(e=>t[e])})(e.scope);return Pt(r)?t??"":((e,t)=>{let r=e;return Pt(e)||Pt(t)||t.startsWith("[")||(r=e+"."),Pt(r)?t:Pt(t)?r:`${r}${t}`})(t,r.join("."))},Jv=e=>"object"==typeof e&&null!==e&&"string"==typeof e.i18n,Zv=e=>(e=>!!e&&"object"==typeof e)(e)&&"string"==typeof e.scope,Qv=(e,t)=>Yv(e,t),Xv=(e,t,r,n,i,o)=>{if((e=>"AND"===e.type)(r))return r.conditions.reduce((r,a)=>r&&Xv(e,t,a,n,i,o),!0);if((e=>"OR"===e.type)(r))return r.conditions.reduce((r,a)=>r||Xv(e,t,a,n,i,o),!1);if((e=>"LEAF"===e.type)(r)){return qv(e,Qv(r,n))===r.expectedValue}if((e=>Vo(e,"schema"))(r)){const t=qv(e,Qv(r,n));return(!r.failWhenUndefined||void 0!==t)&&i.validate(r.schema,t)}if((e=>Vo(e,"validate")&&"function"==typeof e.validate)(r)){const i={data:qv(e,Qv(r,n)),fullData:e,path:n,uischemaElement:t,config:o};return r.validate(i)}return!0},eb=(e,t,r,n,i)=>{const o=e.rule.condition;return Xv(t,e,o,r,n,i)},tb=e=>!(!e.rule||e.rule.effect!==Gv.SHOW&&e.rule.effect!==Gv.HIDE),rb=(e,t,r=void 0,n,i)=>!e.rule||((e,t,r,n,i)=>{const o=eb(e,t,r,n,i);switch(e.rule.effect){case Gv.HIDE:return!o;case Gv.SHOW:return o;default:return!0}})(e,t,r,n,i),nb=(e,t,r=void 0,n,i)=>!e.rule||((e,t,r,n,i)=>{const o=eb(e,t,r,n,i);switch(e.rule.effect){case Gv.DISABLE:return!o;case Gv.ENABLE:return o;default:return!0}})(e,t,r,n,i),ib=(e,t,r=void 0,n,i)=>!!e.rule&&((e,t,r,n,i)=>{const o=eb(e,t,r,n,i);switch(e.rule.effect){case Gv.WRITABLE:return!o;case Gv.READONLY:return o;default:return!1}})(e,t,r,n,i),ob=e=>!!e&&Object.prototype.hasOwnProperty.call(e,"oneOf")&&e.oneOf&&e.oneOf.every(e=>void 0!==e.const),ab=(e,t)=>_a(sb(e),t),sb=e=>{if(Pt(e))return[];if(!Pt(e.type)&&"string"==typeof e.type)return[e.type];if(Array.isArray(e.type))return e.type;if(!Pt(e.properties)||!Pt(e.additionalProperties))return["object"];if(!Pt(e.items))return["array"];if(!Pt(e.enum)){const t=new Set;return e.enum.forEach(e=>{"string"==typeof e?t.add("string"):sb(e).forEach(e=>t.add(e))}),Array.from(t)}if(!Pt(e.allOf)){const t=Sa(e.allOf,e=>0!==sb(e).length);if(t)return sb(t)}return[]},cb=Vv,db=qv,ub=(e,t)=>{if(void 0===e)return[];return e(t)?[]:e.errors},lb=e=>{let t=e.dataPath||e.instancePath||"";t=t.replace(/\//g,".");const r=(e=>{switch(e.keyword){case"required":case"dependencies":return e.params.missingProperty;case"additionalProperties":return e.params.additionalProperty;default:return}})(e);return void 0!==r&&(t=`${t}.${r}`),t=t.replace(/^\./,""),t=Lv(t),t},hb=e=>"object"===e?.type||!!e?.properties,fb=["additionalProperties","allOf","anyOf","oneOf"],mb=e=>({type:e,elements:[]}),pb=e=>({type:"Control",scope:e}),vb=(e,t,r,n,i,o)=>{if(!Pt(e)&&void 0!==e.$ref)return vb(Vv(o,e.$ref,o),t,r,n,i,o);if((e=>!(Pt(e)||Pt(e.oneOf)&&Pt(e.anyOf)&&Pt(e.allOf)))(e)){const e=pb(r);return t.push(e),e}const a=sb(e);if(0===a.length)return null;const s=a.filter(e=>"null"!==e),c=s.length>0?s:a;if(c.length>1){const e=pb(r);return t.push(e),e}if("#"===r&&"object"===c[0]){const a=mb(i);if(t.push(a),e.properties&&Sr(e.properties).length>1&&((e,t)=>{if(!Pt(t)){const r=or(t);if((e=>"Group"===e.type)(e))e.label=r;else{const t={type:"Label",text:r};e.elements.push(t)}}})(a,n),!Pt(e.properties)){const t=r+"/properties";Object.keys(e.properties).map(r=>{let n=e.properties[r];const s=`${t}/${c=r,c?.replace(/~/g,"~0").replace(/\//g,"~1")}`;var c;void 0!==n.$ref&&(n=Vv(o,n.$ref,o)),vb(n,a.elements,s,r,i,o)})}return a}switch(c[0]){case"object":case"array":case"string":case"number":case"integer":case"null":case"boolean":{const e=pb(r);return t.push(e),e}default:throw new Error("Unknown type: "+JSON.stringify(e))}},bb=(e,t="VerticalLayout",r="#",n=e)=>((e,t)=>{if(!Pt(e)&&!(e=>void 0!==e.elements)(e)){const r=mb(t);return r.elements.push(e),r}return e})(vb(e,[],r,"",t,n),t),gb="jsonforms/INIT",yb="jsonforms/UPDATE_CORE",wb="jsonforms/SET_AJV",$b="jsonforms/UPDATE",kb="jsonforms/UPDATE_ERRORS",xb="jsonforms/ADD_RENDERER",Cb="jsonforms/REMOVE_RENDERER",Eb="jsonforms/ADD_CELL",jb="jsonforms/REMOVE_CELL",Sb="jsonforms/SET_CONFIG",Ab="jsonforms/ADD_UI_SCHEMA",Ob="jsonforms/REMOVE_UI_SCHEMA",Ib="jsonforms/SET_SCHEMA",_b="jsonforms/SET_UISCHEMA",zb="jsonforms/SET_VALIDATION_MODE",Nb="jsonforms/SET_LOCALE",Rb="jsonforms/SET_TRANSLATOR",Tb="jsonforms/UPDATE_I18N",Mb="jsonforms/ADD_DEFAULT_DATA",Pb="jsonforms/REMOVE_DEFAULT_DATA";var Lb=Object.freeze({__proto__:null,INIT:gb,UPDATE_CORE:yb,SET_AJV:wb,UPDATE_DATA:$b,UPDATE_ERRORS:kb,VALIDATE:"jsonforms/VALIDATE",ADD_RENDERER:xb,REMOVE_RENDERER:Cb,ADD_CELL:Eb,REMOVE_CELL:jb,SET_CONFIG:Sb,ADD_UI_SCHEMA:Ab,REMOVE_UI_SCHEMA:Ob,SET_SCHEMA:Ib,SET_UISCHEMA:_b,SET_VALIDATION_MODE:zb,SET_LOCALE:Nb,SET_TRANSLATOR:Rb,UPDATE_I18N:Tb,ADD_DEFAULT_DATA:Mb,REMOVE_DEFAULT_DATA:Pb,isUpdateArrayContext:e=>{if(!("type"in e))return!1;if("string"!=typeof e.type)return!1;switch(e.type){case"ADD":return"values"in e&&Array.isArray(e.values)&&e.values.length>0;case"REMOVE":return"indices"in e&&Array.isArray(e.indices)&&e.indices.length>0&&e.indices.every(e=>"number"==typeof e);case"MOVE":return"moves"in e&&Array.isArray(e.moves)&&e.moves.length>0&&e.moves.every(e=>"object"==typeof e&&null!==e&&"from"in e&&"to"in e&&"number"==typeof e.from&&"number"==typeof e.to);default:return!1}},init:(e,t=((e,t={})=>new zv(e=>r=>{switch(r){case Iv:return!Object.prototype.hasOwnProperty.call(t,Iv)||t[Iv];case _v:return Object.prototype.hasOwnProperty.call(t,_v)?t[_v](e):Object.keys(e);default:return}}).schemaObject(e))(e),r,n)=>({type:gb,data:e,schema:t,uischema:"object"==typeof r?r:bb(t),options:n}),updateCore:(e,t,r,n)=>({type:yb,data:e,schema:t,uischema:r,options:n}),registerDefaultData:(e,t)=>({type:Mb,schemaPath:e,data:t}),unregisterDefaultData:e=>({type:Pb,schemaPath:e}),setAjv:e=>({type:wb,ajv:e}),update:(e,t,r)=>({type:$b,path:e,updater:t,context:r}),updateErrors:e=>({type:kb,errors:e}),registerRenderer:(e,t)=>({type:xb,tester:e,renderer:t}),registerCell:(e,t)=>({type:Eb,tester:e,cell:t}),unregisterCell:(e,t)=>({type:jb,tester:e,cell:t}),unregisterRenderer:(e,t)=>({type:Cb,tester:e,renderer:t}),setConfig:e=>({type:Sb,config:e}),setValidationMode:e=>({type:zb,validationMode:e}),registerUISchema:(e,t)=>({type:Ab,tester:e,uischema:t}),unregisterUISchema:e=>({type:Ob,tester:e}),setLocale:e=>({type:Nb,locale:e}),setSchema:e=>({type:Ib,schema:e}),setTranslator:(e,t)=>({type:Rb,translator:e,errorTranslator:t}),updateI18n:(e,t,r)=>({type:Tb,locale:e,translator:t,errorTranslator:r}),setUISchema:e=>({type:_b,uischema:e})});const Db={restrict:!1,trim:!1,showUnfocusedDescription:!1,hideRequiredAsterisk:!1,separateReadonlyFromDisabled:!1},Bb=(e={})=>tf({},Db,e),qb={data:{},schema:{},uischema:void 0,errors:[],validator:void 0,ajv:void 0,validationMode:"ValidateAndShow",additionalErrors:[]},Vb=(e,t)=>t&&Fb(t.options)?t.options.validationMode:e.validationMode,Fb=e=>!!e&&void 0!==e.validationMode,Ub=(e,t)=>{return t&&((r=t.options)&&void 0!==r.additionalErrors)?t.options.additionalErrors:e.additionalErrors;var r},Hb=(e,t)=>{if(t){if(Wb(t.options))return t.options.ajv;if(void 0!==t.options&&uv(t.options.compile))return t.options}return e.ajv?e.ajv:(e=>{const t=new pu({allErrors:!0,verbose:!0,strict:!1,addUsedSchema:!1,...e});return Mu(t),t})()},Wb=e=>!!e&&void 0!==e.ajv;var Kb,Gb;!function(e){e.addTooltip="addTooltip",e.addAriaLabel="addAriaLabel",e.removeTooltip="removeTooltip",e.upAriaLabel="upAriaLabel",e.downAriaLabel="downAriaLabel",e.noSelection="noSelection",e.removeAriaLabel="removeAriaLabel",e.noDataMessage="noDataMessage",e.deleteDialogTitle="deleteDialogTitle",e.deleteDialogMessage="deleteDialogMessage",e.deleteDialogAccept="deleteDialogAccept",e.deleteDialogDecline="deleteDialogDecline",e.up="up",e.down="down"}(Kb||(Kb={})),Kb.addTooltip,Kb.addAriaLabel,Kb.removeTooltip,Kb.removeAriaLabel,Kb.upAriaLabel,Kb.up,Kb.down,Kb.downAriaLabel,Kb.noDataMessage,Kb.noSelection,Kb.deleteDialogTitle,Kb.deleteDialogMessage,Kb.deleteDialogAccept,Kb.deleteDialogDecline,function(e){e.clearDialogTitle="clearDialogTitle",e.clearDialogMessage="clearDialogMessage",e.clearDialogAccept="clearDialogAccept",e.clearDialogDecline="clearDialogDecline"}(Gb||(Gb={})),Gb.clearDialogTitle,Gb.clearDialogMessage,Gb.clearDialogAccept,Gb.clearDialogDecline;const Yb=(e,t)=>Jv(t)?t.i18n:e?.i18n??void 0,Jb=(e,t,r)=>Yb(e,t)??(e=>e?.split(".").filter(e=>!/^\d+$/.test(e)).join(".")||"root")(r),Zb=(e,t,r,n)=>`${Jb(e,t,r)}.${n}`,Qb=(Xb=(e,t)=>t,(e,t,r)=>{const n=Xb(e,t,r);return void 0===n?t:n});var Xb;const eg=(e,t,r)=>{const n=t(Zb(e.parentSchema,r,lb(e),`error.${e.keyword}`),void 0,{error:e});if(void 0!==n)return n;const i=t(`error.${e.keyword}`,void 0,{error:e});if(void 0!==i)return i;const o=t(e.message,void 0,{error:e});return void 0!==o?o:"required"===e.keyword&&e.message?.startsWith("must have required property")?t("is a required property","is a required property",{error:e}):e.message},tg=()=>e=>(e=>void 0===e?Qb:e.translate)(si(e,"jsonforms.i18n")),rg=()=>e=>(e=>void 0===e?eg:e.translateError)(si(e,"jsonforms.i18n")),ng={locale:"en",translate:Qb,translateError:eg},ig=e=>!Pt(e)&&void 0!==e.scope,og=e=>(t,r,n)=>{if(Pt(t)||!ig(t))return!1;if(Pt(r))return!1;const i=t.scope;if(Pt(i))return!1;let o=r;return ab(r,"object")&&(o=Vv(r,i,n?.rootSchema)),void 0!==o&&e(o,n?.rootSchema)},ag=(e,t)=>(r,n,i)=>{if(Pt(r)||!ig(r))return!1;const o=r.scope;let a=n;return ab(n,"object")&&(a=Vv(n,o,i?.rootSchema)),a=si(a,e),void 0!==a&&t(a,i?.rootSchema)},sg=e=>og(t=>!Pt(t)&&ab(t,e)),cg=e=>og(t=>!Pt(t)&&t.format===e&&ab(t,"string")),dg=e=>t=>!Pt(t)&&t.type===e,ug=(e,t)=>r=>{if(Pt(r))return!1;const n=r.options;return!Pt(n)&&n[e]===t},lg=e=>t=>!(Pt(e)||!ig(t))&&Av(t.scope,e),hg=(...e)=>(t,r,n)=>e.reduce((e,i)=>e&&i(t,r,n),!0),fg=(...e)=>(t,r,n)=>e.reduce((e,i)=>e||i(t,r,n),!1),mg=(e,t)=>(r,n,i)=>t(r,n,i)?e:-1,pg=hg(dg("Control"),sg("boolean"));hg(dg("Control"),sg("object")),hg(dg("Control"),og(e=>Object.prototype.hasOwnProperty.call(e,"allOf"))),hg(dg("Control"),og(e=>Object.prototype.hasOwnProperty.call(e,"anyOf"))),hg(dg("Control"),og(e=>Object.prototype.hasOwnProperty.call(e,"oneOf")));const vg=hg(dg("Control"),og(e=>(e=>!!e&&"object"==typeof e&&(Object.prototype.hasOwnProperty.call(e,"enum")||Object.prototype.hasOwnProperty.call(e,"const")))(e)));hg(dg("Control"),og(e=>ob(e)));const bg=hg(dg("Control"),sg("integer")),gg=hg(dg("Control"),sg("number")),yg=hg(dg("Control"),sg("string"));hg(dg("Control"),ug("multi",!0)),hg(dg("Control"),fg(cg("date"),ug("format","date"))),hg(dg("Control"),fg(cg("time"),ug("format","time"))),hg(dg("Control"),fg(cg("date-time"),ug("format","date-time")));const wg=hg(og((e,t)=>ab(e,"array")&&!Array.isArray(Vv(e,"items",t))),ag("items",(e,t)=>{const r=e.$ref?Vv(t,e.$ref,t):e;return ab(r,"object")}));hg(dg("Control"),wg),hg(dg("Control"),og((e,t)=>0!==sb(e).length&&!Array.isArray(Vv(e,"items",t))),ag("items",(e,t)=>{const r=e.$ref?Vv(t,e.$ref,t):e,n=sb(r);return 1===n.length&&_a(["integer","number","boolean","string"],n[0])})),hg(dg("Control"),fg(sg("number"),sg("integer")),og(e=>Object.prototype.hasOwnProperty.call(e,"maximum")&&Object.prototype.hasOwnProperty.call(e,"minimum")&&Object.prototype.hasOwnProperty.call(e,"default")),ug("slider",!0)),hg(dg("Control"),sg("integer"),ug("format",!0));const $g=(e=qb,t)=>{switch(t.type){case gb:{const r=Hb(e,t),n=Vb(e,t),i="NoValidation"===n?void 0:r.compile(t.schema),o=ub(i,t.data),a=Ub(e,t);return{...e,data:t.data,schema:t.schema,uischema:t.uischema,additionalErrors:a,errors:o,validator:i,ajv:r,validationMode:n}}case yb:{const r=Hb(e,t),n=Vb(e,t);let i=e.validator,o=e.errors;e.schema!==t.schema||e.validationMode!==n||e.ajv!==r?(i="NoValidation"===n?void 0:r.compile(t.schema),o=ub(i,t.data)):e.data!==t.data&&(o=ub(i,t.data));const a=Ub(e,t);return e.data!==t.data||e.schema!==t.schema||e.uischema!==t.uischema||e.ajv!==r||e.errors!==o||e.validator!==i||e.validationMode!==n||e.additionalErrors!==a?{...e,data:t.data,schema:t.schema,uischema:t.uischema,ajv:r,errors:Gu(o,e.errors)?e.errors:o,validator:i,validationMode:n,additionalErrors:a}:e}case wb:{const r=t.ajv,n="NoValidation"===e.validationMode?void 0:r.compile(e.schema),i=ub(n,e.data);return{...e,validator:n,errors:i}}case Ib:{const r=t.schema&&e.ajv&&"NoValidation"!==e.validationMode?e.ajv.compile(t.schema):e.validator,n=ub(r,e.data);return{...e,validator:r,schema:t.schema,errors:n}}case _b:return{...e,uischema:t.uischema};case $b:if(void 0===t.path||null===t.path)return e;if(""===t.path){const r=t.updater(op(e.data)),n=ub(e.validator,r);return{...e,data:r,errors:n}}{const r=si(e.data,t.path),n=t.updater(op(r));let i;i=void 0!==n?Jp(t.path,n,void 0===e.data?{}:e.data):dv(t.path,void 0===e.data?{}:e.data);const o=ub(e.validator,i);return{...e,data:i,errors:o}}case kb:return{...e,errors:t.errors};case zb:if(e.validationMode===t.validationMode)return e;if("NoValidation"===t.validationMode){const r=ub(void 0,e.data);return{...e,errors:r,validationMode:t.validationMode}}if("NoValidation"===e.validationMode){const r=e.ajv.compile(e.schema),n=ub(r,e.data);return{...e,validator:r,errors:n,validationMode:t.validationMode}}return{...e,validationMode:t.validationMode};default:return e}},kg=(e=[],t)=>{switch(t.type){case xb:return e.concat([{tester:t.tester,renderer:t.renderer}]);case Cb:return e.filter(e=>e.tester!==t.tester);default:return e}},xg=(e=[],{type:t,tester:r,cell:n})=>{switch(t){case Eb:return e.concat([{tester:r,cell:n}]);case jb:return e.filter(e=>e.tester!==r);default:return e}},Cg=(e=Bb(),t)=>t.type===Sb?Bb(t.config):e,Eg=(e=[],t)=>{switch(t.type){case Ab:return e.slice().concat({tester:t.tester,uischema:t.uischema});case Ob:{const r=e.slice();return pv(r,e=>e.tester===t.tester),r}default:return e}},jg=(e=ng,t)=>{switch(t.type){case Tb:{const r=t.locale??ng.locale,n=t.translator??ng.translate,i=t.errorTranslator??ng.translateError;return r!==e.locale||n!==e.translate||i!==e.translateError?{...e,locale:r,translate:n,translateError:i}:e}case Rb:return{...e,translate:t.translator??Qb,translateError:t.errorTranslator??eg};case Nb:return{...e,locale:t.locale??navigator.languages[0]};default:return e}},Sg=(e,t,r)=>n=>{const i=n.errors??[],o=n.additionalErrors??[];return((e,t,r)=>n=>{const i=qu(n,e=>"oneOf"===e.keyword||"anyOf"===e.keyword).map(e=>lb(e));return qu(n,n=>{if(-1!==fb.indexOf(n.keyword)&&!ob(n.parentSchema))return!1;const o=lb(n);let a=r(o);const s=n.parentSchema;return!a||hb(s)||ob(s)||-1===i.findIndex(t=>e.startsWith(t))||(a=a&&Gu(s,t)),a})})(e,t,r)("ValidateAndHide"===n.validationMode?o:[...i,...o])},Ag=(e,t)=>r=>((e,t)=>Sg(e,t,t=>t===e))(e,t)(r.jsonforms.core),Og=e=>Tg(si(e,"jsonforms.core")),Ig=e=>Mg(si(e,"jsonforms.core")),_g=e=>Pg(si(e,"jsonforms.core")),zg=e=>Lg(si(e,"jsonforms.core")),Ng=e=>si(e,"jsonforms.renderers"),Rg=e=>si(e,"jsonforms.cells"),Tg=e=>si(e,"data"),Mg=e=>si(e,"schema"),Pg=e=>si(e,"uischema"),Lg=e=>si(e,"ajv"),Dg=e=>e.jsonforms.config,Bg=(e,t,r,n,i,o)=>{if(!o?.separateReadonlyFromDisabled&&e?.jsonforms?.readonly)return!1;if(r&&(e=>!(!e.rule||e.rule.effect!==Gv.ENABLE&&e.rule.effect!==Gv.DISABLE))(r))return nb(r,i,t?.path,zg(e),o);if(!o?.separateReadonlyFromDisabled){if("boolean"==typeof r?.options?.readonly)return!r.options.readonly;if("boolean"==typeof r?.options?.readOnly)return!r.options.readOnly;if("boolean"==typeof o?.readonly)return!o.readonly;if("boolean"==typeof o?.readOnly)return!o.readOnly;if(!0===n?.readOnly)return!1}return"boolean"!=typeof t?.enabled||t.enabled},qg=(e,t,r,n,i,o)=>!!e?.jsonforms?.readonly||(r&&(e=>!(!e.rule||e.rule.effect!==Gv.READONLY&&e.rule.effect!==Gv.WRITABLE))(r)?ib(r,i,t?.path,zg(e),o):"boolean"==typeof r?.options?.readonly?r.options.readonly:"boolean"==typeof r?.options?.readOnly?r.options.readOnly:"boolean"==typeof o?.readonly?o.readonly:"boolean"==typeof o?.readOnly?o.readOnly:!0===n?.readOnly||"boolean"==typeof t?.readonly&&t.readonly),Vg=(e,t)=>{const{uischema:r}=t,n=Og(e),i=Yv(r,t.path),o=Dg(e),a=void 0===t.visible||tb(r)?rb(r,n,t.path,zg(e),o):t.visible,s=r,c=t.id,d=Ig(e),u=void 0!==s.scope&&((e,t,r)=>{const n=t.split("/"),i=Lv(n[n.length-1]),o=n.slice(0,n.length-2).join("/"),a=cb(e,o,r);return void 0!==a&&void 0!==a.required&&-1!==a.required.indexOf(i)})(t.schema,s.scope,d),l=cb(t.schema||d,s.scope,d),h=Ag(i,l)(e),f=void 0!==l?l.description:"",m=db(n,i),p=((e,t)=>{const r=e.label;if("boolean"==typeof r)return Bv(Dv(e,t),r);if("string"==typeof r)return Bv(r,!0);if("object"==typeof r){const n="string"==typeof r.text?r.text:Dv(e,t),i="boolean"!=typeof r.show||r.show;return Bv(n,i)}return Bv(Dv(e,t),!0)})(r,l),v=p.show?p.text:"",b=Bg(e,t,r,l||d,n,o),g=qg(e,t,r,l||d,n,o),y=l??d,w=tg()(e),$=rg()(e),k=Jb(y,r,i),x=w(Zb(y,r,i,"label"),v,{schema:y,uischema:r,path:i,errors:h}),C=w(Zb(y,r,i,"description"),f,{schema:y,uischema:r,path:i,errors:h}),E=((e,t,r,n,i,o)=>{if(e.length>0&&r){const t=Zb(n,i,o,"error.custom"),a=r(t,void 0,{schema:n,uischema:i,path:o,errors:e});if(void 0!==a)return a}return(e=>null==e?"":e.join("\n"))(e.map(e=>t(e,r,i)))})(h,$,w,y,r,i);return{data:m,description:C,errors:E,label:x,visible:a,enabled:b,readonly:g,id:c,path:i,required:u,uischema:r,schema:y,config:Dg(e),cells:t.cells||e.jsonforms.cells,rootSchema:d,i18nKeyPrefix:k}},Fg={visible:!0,enabled:!0,path:"",direction:"column"},Ug=e=>"HorizontalLayout"===e.type?"row":"VerticalLayout"===e.type?"column":Fg.direction,Hg=(e,t)=>{const r=Og(e),{uischema:n}=t,i=void 0===t.visible||tb(n)?rb(t.uischema,r,t.path,zg(e),Dg(e)):t.visible,o=db(r,t.path),a=Dg(e),s=Bg(e,t,n,void 0,r,a),c=qg(e,t,n,void 0,r,a),d=tg()(e),u=(l=n)&&"object"==typeof l?((e,t)=>{if(!1===e.label)return;if((void 0===e.label||null===e.label||!0===e.label)&&!Jv(e))return;const r="string"==typeof e.label?e.label:JSON.stringify(e.label),n=Yb(void 0,e);return t("string"==typeof n?`${n}.label`:r,r,{uischema:e})})(n,d):void 0;var l;return{...Fg,renderers:t.renderers||Ng(e),cells:t.cells||Rg(e),visible:i,enabled:s,readonly:c,path:t.path,data:o,uischema:t.uischema,schema:t.schema,direction:t.direction??Ug(n),config:a,label:u}},Wg=(e,t)=>({renderers:t.renderers||si(e.jsonforms,"renderers"),cells:t.cells||si(e.jsonforms,"cells"),schema:t.schema||Ig(e),rootSchema:Ig(e),uischema:t.uischema||_g(e),path:t.path,enabled:t.enabled,config:Dg(e)}),Kg=globalThis,Gg=Kg.ShadowRoot&&(void 0===Kg.ShadyCSS||Kg.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Yg=Symbol(),Jg=new WeakMap;let Zg=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Yg)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Gg&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=Jg.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Jg.set(t,e))}return e}toString(){return this.cssText}};const Qg=(e,...t)=>{const r=1===e.length?e[0]:t.reduce((t,r,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[n+1],e[0]);return new Zg(r,e,Yg)},Xg=Gg?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new Zg("string"==typeof e?e:e+"",void 0,Yg))(t)})(e):e,{is:ey,defineProperty:ty,getOwnPropertyDescriptor:ry,getOwnPropertyNames:ny,getOwnPropertySymbols:iy,getPrototypeOf:oy}=Object,ay=globalThis,sy=ay.trustedTypes,cy=sy?sy.emptyScript:"",dy=ay.reactiveElementPolyfillSupport,uy=(e,t)=>e,ly={toAttribute(e,t){switch(t){case Boolean:e=e?cy:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},hy=(e,t)=>!ey(e,t),fy={attribute:!0,type:String,converter:ly,reflect:!1,useDefault:!1,hasChanged:hy};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),ay.litPropertyMetadata??=new WeakMap;let my=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=fy){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(e,r,t);void 0!==n&&ty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){const{get:n,set:i}=ry(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const o=n?.call(this);i?.call(this,t),this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??fy}static _$Ei(){if(this.hasOwnProperty(uy("elementProperties")))return;const e=oy(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(uy("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(uy("properties"))){const e=this.properties,t=[...ny(e),...iy(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(Xg(e))}else void 0!==e&&t.push(Xg(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(Gg)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const r of t){const t=document.createElement("style"),n=Kg.litNonce;void 0!==n&&t.setAttribute("nonce",n),t.textContent=r.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(void 0!==n&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:ly).toAttribute(t,r.type);this._$Em=e,null==i?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,t){const r=this.constructor,n=r._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=r.getPropertyOptions(n),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:ly;this._$Em=n;const o=i.fromAttribute(t,e.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(e,t,r,n=!1,i){if(void 0!==e){const o=this.constructor;if(!1===n&&(i=this[e]),r??=o.getPropertyOptions(e),!((r.hasChanged??hy)(i,t)||r.useDefault&&r.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:n,wrapped:i},o){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==i||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,r,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};my.elementStyles=[],my.shadowRootOptions={mode:"open"},my[uy("elementProperties")]=new Map,my[uy("finalized")]=new Map,dy?.({ReactiveElement:my}),(ay.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const py=globalThis,vy=e=>e,by=py.trustedTypes,gy=by?by.createPolicy("lit-html",{createHTML:e=>e}):void 0,yy="$lit$",wy=`lit$${Math.random().toFixed(9).slice(2)}$`,$y="?"+wy,ky=`<${$y}>`,xy=document,Cy=()=>xy.createComment(""),Ey=e=>null===e||"object"!=typeof e&&"function"!=typeof e,jy=Array.isArray,Sy="[ \t\n\f\r]",Ay=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oy=/-->/g,Iy=/>/g,_y=RegExp(`>|${Sy}(?:([^\\s"'>=/]+)(${Sy}*=${Sy}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),zy=/'/g,Ny=/"/g,Ry=/^(?:script|style|textarea|title)$/i,Ty=(e=>(t,...r)=>({_$litType$:e,strings:t,values:r}))(1),My=Symbol.for("lit-noChange"),Py=Symbol.for("lit-nothing"),Ly=new WeakMap,Dy=xy.createTreeWalker(xy,129);function By(e,t){if(!jy(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==gy?gy.createHTML(t):t}const qy=(e,t)=>{const r=e.length-1,n=[];let i,o=2===t?"<svg>":3===t?"<math>":"",a=Ay;for(let t=0;t<r;t++){const r=e[t];let s,c,d=-1,u=0;for(;u<r.length&&(a.lastIndex=u,c=a.exec(r),null!==c);)u=a.lastIndex,a===Ay?"!--"===c[1]?a=Oy:void 0!==c[1]?a=Iy:void 0!==c[2]?(Ry.test(c[2])&&(i=RegExp("</"+c[2],"g")),a=_y):void 0!==c[3]&&(a=_y):a===_y?">"===c[0]?(a=i??Ay,d=-1):void 0===c[1]?d=-2:(d=a.lastIndex-c[2].length,s=c[1],a=void 0===c[3]?_y:'"'===c[3]?Ny:zy):a===Ny||a===zy?a=_y:a===Oy||a===Iy?a=Ay:(a=_y,i=void 0);const l=a===_y&&e[t+1].startsWith("/>")?" ":"";o+=a===Ay?r+ky:d>=0?(n.push(s),r.slice(0,d)+yy+r.slice(d)+wy+l):r+wy+(-2===d?t:l)}return[By(e,o+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Vy{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let i=0,o=0;const a=e.length-1,s=this.parts,[c,d]=qy(e,t);if(this.el=Vy.createElement(c,r),Dy.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Dy.nextNode())&&s.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(yy)){const t=d[o++],r=n.getAttribute(e).split(wy),a=/([.?@])?(.*)/.exec(t);s.push({type:1,index:i,name:a[2],strings:r,ctor:"."===a[1]?Ky:"?"===a[1]?Gy:"@"===a[1]?Yy:Wy}),n.removeAttribute(e)}else e.startsWith(wy)&&(s.push({type:6,index:i}),n.removeAttribute(e));if(Ry.test(n.tagName)){const e=n.textContent.split(wy),t=e.length-1;if(t>0){n.textContent=by?by.emptyScript:"";for(let r=0;r<t;r++)n.append(e[r],Cy()),Dy.nextNode(),s.push({type:2,index:++i});n.append(e[t],Cy())}}}else if(8===n.nodeType)if(n.data===$y)s.push({type:2,index:i});else{let e=-1;for(;-1!==(e=n.data.indexOf(wy,e+1));)s.push({type:7,index:i}),e+=wy.length-1}i++}}static createElement(e,t){const r=xy.createElement("template");return r.innerHTML=e,r}}function Fy(e,t,r=e,n){if(t===My)return t;let i=void 0!==n?r._$Co?.[n]:r._$Cl;const o=Ey(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(e),i._$AT(e,r,n)),void 0!==n?(r._$Co??=[])[n]=i:r._$Cl=i),void 0!==i&&(t=Fy(e,i._$AS(e,t.values),i,n)),t}class Uy{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,n=(e?.creationScope??xy).importNode(t,!0);Dy.currentNode=n;let i=Dy.nextNode(),o=0,a=0,s=r[0];for(;void 0!==s;){if(o===s.index){let t;2===s.type?t=new Hy(i,i.nextSibling,this,e):1===s.type?t=new s.ctor(i,s.name,s.strings,this,e):6===s.type&&(t=new Jy(i,this,e)),this._$AV.push(t),s=r[++a]}o!==s?.index&&(i=Dy.nextNode(),o++)}return Dy.currentNode=xy,n}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class Hy{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,n){this.type=2,this._$AH=Py,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Fy(this,e,t),Ey(e)?e===Py||null==e||""===e?(this._$AH!==Py&&this._$AR(),this._$AH=Py):e!==this._$AH&&e!==My&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>jy(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Py&&Ey(this._$AH)?this._$AA.nextSibling.data=e:this.T(xy.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,n="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Vy.createElement(By(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new Uy(n,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=Ly.get(e.strings);return void 0===t&&Ly.set(e.strings,t=new Vy(e)),t}k(e){jy(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,n=0;for(const i of e)n===t.length?t.push(r=new Hy(this.O(Cy()),this.O(Cy()),this,this.options)):r=t[n],r._$AI(i),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=vy(e).nextSibling;vy(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Wy{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,n,i){this.type=1,this._$AH=Py,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=Py}_$AI(e,t=this,r,n){const i=this.strings;let o=!1;if(void 0===i)e=Fy(this,e,t,0),o=!Ey(e)||e!==this._$AH&&e!==My,o&&(this._$AH=e);else{const n=e;let a,s;for(e=i[0],a=0;a<i.length-1;a++)s=Fy(this,n[r+a],t,a),s===My&&(s=this._$AH[a]),o||=!Ey(s)||s!==this._$AH[a],s===Py?e=Py:e!==Py&&(e+=(s??"")+i[a+1]),this._$AH[a]=s}o&&!n&&this.j(e)}j(e){e===Py?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ky extends Wy{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Py?void 0:e}}class Gy extends Wy{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Py)}}class Yy extends Wy{constructor(e,t,r,n,i){super(e,t,r,n,i),this.type=5}_$AI(e,t=this){if((e=Fy(this,e,t,0)??Py)===My)return;const r=this._$AH,n=e===Py&&r!==Py||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==Py&&(r===Py||n);n&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Jy{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Fy(this,e)}}const Zy=py.litHtmlPolyfillSupport;Zy?.(Vy,Hy),(py.litHtmlVersions??=[]).push("3.3.3");const Qy=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Xy extends my{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const n=r?.renderBefore??t;let i=n._$litPart$;if(void 0===i){const e=r?.renderBefore??null;n._$litPart$=i=new Hy(t.insertBefore(Cy(),e),e,void 0,r??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return My}}Xy._$litElement$=!0,Xy.finalized=!0,Qy.litElementHydrateSupport?.({LitElement:Xy});const ew=Qy.litElementPolyfillSupport;ew?.({LitElement:Xy}),(Qy.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tw=e=>(t,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},rw={attribute:!0,type:String,converter:ly,reflect:!1,hasChanged:hy},nw=(e=rw,t,r)=>{const{kind:n,metadata:i}=r;let o=globalThis.litPropertyMetadata.get(i);if(void 0===o&&globalThis.litPropertyMetadata.set(i,o=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),o.set(r.name,e),"accessor"===n){const{name:n}=r;return{set(r){const i=t.get.call(this);t.set.call(this,r),this.requestUpdate(n,i,e,!0,r)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=r;return function(r){const i=this[n];t.call(this,r),this.requestUpdate(n,i,e,!0,r)}}throw Error("Unsupported decorator location: "+n)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function iw(e){return(t,r)=>"object"==typeof r?nw(e,t,r):((e,t,r)=>{const n=t.hasOwnProperty(r);return t.constructor.createProperty(r,e),n?Object.getOwnPropertyDescriptor(t,r):void 0})(e,t,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ow(e){return iw({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const aw=e=>e??Py,sw=/\{[^{}]+\}/g;function cw(e){let{baseUrl:t="",Request:r=globalThis.Request,fetch:n=globalThis.fetch,querySerializer:i,bodySerializer:o,pathSerializer:a,headers:s,requestInitExt:c,...d}={...e};c="object"==typeof process&&Number.parseInt(process?.versions?.node?.substring(0,2))>=18&&process.versions.undici?c:void 0,t=vw(t);const u=[];async function l(e,l){const{baseUrl:h,fetch:f=n,Request:m=r,headers:p,params:v={},parseAs:b="json",querySerializer:g,bodySerializer:y=o??mw,pathSerializer:w,body:$,middleware:k=[],...x}=l||{};let C=t;h&&(C=vw(h)??t);let E="function"==typeof i?i:hw(i);g&&(E="function"==typeof g?g:hw({..."object"==typeof i?i:{},...g}));const j=w||a||fw,S=void 0===$?void 0:y($,pw(s,p,v.header)),A=pw(void 0===S||S instanceof FormData?{}:{"Content-Type":"application/json"},s,p,v.header),O=[...u,...k],I={redirect:"follow",...d,...x,body:S,headers:A};let _,z,N,R=new m(function(e,t){let r=`${t.baseUrl}${e}`;t.params?.path&&(r=t.pathSerializer(r,t.params.path));let n=t.querySerializer(t.params.query??{});n.startsWith("?")&&(n=n.substring(1));n&&(r+=`?${n}`);return r}(e,{baseUrl:C,params:v,querySerializer:E,pathSerializer:j}),I);for(const e in x)e in R||(R[e]=x[e]);if(O.length){_=Math.random().toString(36).slice(2,11),z=Object.freeze({baseUrl:C,fetch:f,parseAs:b,querySerializer:E,bodySerializer:y,pathSerializer:j});for(const t of O)if(t&&"object"==typeof t&&"function"==typeof t.onRequest){const r=await t.onRequest({request:R,schemaPath:e,params:v,options:z,id:_});if(r){if(!(r instanceof m)){if(r instanceof Response){N=r;break}throw new Error("onRequest: must return new Request() or Response() when modifying the request")}R=r}}}if(!N){try{N=await f(R,c)}catch(t){let r=t;if(O.length)for(let t=O.length-1;t>=0;t--){const n=O[t];if(n&&"object"==typeof n&&"function"==typeof n.onError){const t=await n.onError({request:R,error:r,schemaPath:e,params:v,options:z,id:_});if(t){if(t instanceof Response){r=void 0,N=t;break}if(t instanceof Error){r=t;continue}throw new Error("onError: must return new Response() or instance of Error")}}}if(r)throw r}if(O.length)for(let t=O.length-1;t>=0;t--){const r=O[t];if(r&&"object"==typeof r&&"function"==typeof r.onResponse){const t=await r.onResponse({request:R,response:N,schemaPath:e,params:v,options:z,id:_});if(t){if(!(t instanceof Response))throw new Error("onResponse: must return new Response() when modifying the response");N=t}}}}const T=N.headers.get("Content-Length");if(204===N.status||"HEAD"===R.method||"0"===T&&!N.headers.get("Transfer-Encoding")?.includes("chunked"))return N.ok?{data:void 0,response:N}:{error:void 0,response:N};if(N.ok){const e=async()=>{if("stream"===b)return N.body;if("json"===b&&!T){const e=await N.text();return e?JSON.parse(e):void 0}return await N[b]()};return{data:await e(),response:N}}let M=await N.text();try{M=JSON.parse(M)}catch{}return{error:M,response:N}}return{request:(e,t,r)=>l(t,{...r,method:e.toUpperCase()}),GET:(e,t)=>l(e,{...t,method:"GET"}),PUT:(e,t)=>l(e,{...t,method:"PUT"}),POST:(e,t)=>l(e,{...t,method:"POST"}),DELETE:(e,t)=>l(e,{...t,method:"DELETE"}),OPTIONS:(e,t)=>l(e,{...t,method:"OPTIONS"}),HEAD:(e,t)=>l(e,{...t,method:"HEAD"}),PATCH:(e,t)=>l(e,{...t,method:"PATCH"}),TRACE:(e,t)=>l(e,{...t,method:"TRACE"}),use(...e){for(const t of e)if(t){if("object"!=typeof t||!("onRequest"in t||"onResponse"in t||"onError"in t))throw new Error("Middleware must be an object with one of `onRequest()`, `onResponse() or `onError()`");u.push(t)}},eject(...e){for(const t of e){const e=u.indexOf(t);-1!==e&&u.splice(e,1)}}}}function dw(e,t,r){if(null==t)return"";if("object"==typeof t)throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");return`${e}=${!0===r?.allowReserved?t:encodeURIComponent(t)}`}function uw(e,t,r){if(!t||"object"!=typeof t)return"";const n=[],i={simple:",",label:".",matrix:";"}[r.style]||"&";if("deepObject"!==r.style&&!1===r.explode){for(const e in t)n.push(e,!0===r.allowReserved?t[e]:encodeURIComponent(t[e]));const i=n.join(",");switch(r.style){case"form":return`${e}=${i}`;case"label":return`.${i}`;case"matrix":return`;${e}=${i}`;default:return i}}for(const i in t){const o="deepObject"===r.style?`${e}[${i}]`:i;n.push(dw(o,t[i],r))}const o=n.join(i);return"label"===r.style||"matrix"===r.style?`${i}${o}`:o}function lw(e,t,r){if(!Array.isArray(t))return"";if(!1===r.explode){const n={form:",",spaceDelimited:"%20",pipeDelimited:"|"}[r.style]||",",i=(!0===r.allowReserved?t:t.map(e=>encodeURIComponent(e))).join(n);switch(r.style){case"simple":return i;case"label":return`.${i}`;case"matrix":return`;${e}=${i}`;default:return`${e}=${i}`}}const n={simple:",",label:".",matrix:";"}[r.style]||"&",i=[];for(const n of t)"simple"===r.style||"label"===r.style?i.push(!0===r.allowReserved?n:encodeURIComponent(n)):i.push(dw(e,n,r));return"label"===r.style||"matrix"===r.style?`${n}${i.join(n)}`:i.join(n)}function hw(e){return function(t){const r=[];if(t&&"object"==typeof t)for(const n in t){const i=t[n];if(null!=i)if(Array.isArray(i)){if(0===i.length)continue;r.push(lw(n,i,{style:"form",explode:!0,...e?.array,allowReserved:e?.allowReserved||!1}))}else"object"!=typeof i?r.push(dw(n,i,e)):r.push(uw(n,i,{style:"deepObject",explode:!0,...e?.object,allowReserved:e?.allowReserved||!1}))}return r.join("&")}}function fw(e,t){let r=e;for(const n of e.match(sw)??[]){let e=n.substring(1,n.length-1),i=!1,o="simple";if(e.endsWith("*")&&(i=!0,e=e.substring(0,e.length-1)),e.startsWith(".")?(o="label",e=e.substring(1)):e.startsWith(";")&&(o="matrix",e=e.substring(1)),!t||void 0===t[e]||null===t[e])continue;const a=t[e];Array.isArray(a)?r=r.replace(n,lw(e,a,{style:o,explode:i})):r="object"!=typeof a?"matrix"!==o?r.replace(n,"label"===o?`.${encodeURIComponent(a)}`:encodeURIComponent(a)):r.replace(n,`;${dw(e,a)}`):r.replace(n,uw(e,a,{style:o,explode:i}))}return r}function mw(e,t){if(e instanceof FormData)return e;if(t){if("application/x-www-form-urlencoded"===(t.get instanceof Function?t.get("Content-Type")??t.get("content-type"):t["Content-Type"]??t["content-type"]))return new URLSearchParams(e).toString()}return JSON.stringify(e)}function pw(...e){const t=new Headers;for(const r of e){if(!r||"object"!=typeof r)continue;const e=r instanceof Headers?r.entries():Object.entries(r);for(const[r,n]of e)if(null===n)t.delete(r);else if(Array.isArray(n))for(const e of n)t.append(r,e);else void 0!==n&&t.set(r,n)}return t}function vw(e){return e.endsWith("/")?e.substring(0,e.length-1):e}const bw="https://connect.fiservapis.com/chc",gw={DEV:"https://connect-dev.fiservapis.com/chc",QA:"https://connect-qa.fiservapis.com/chc",PROD:"https://connect.fiservapis.com/chc"},yw=e=>e?jw(Ew(e)?gw[e]:e):bw,ww=e=>xw(e),$w=e=>xw(e),kw=e=>xw(e),xw=e=>{const t=cw({baseUrl:yw(e.baseUrl??e.baseURL)}),r={async onRequest({request:t}){const r=new Headers(t.headers);return Cw(r,e.headers),e.getHeaders&&Cw(r,await e.getHeaders()),new Request(t,{headers:r})}};return t.use(r),t},Cw=(e,t)=>{new Headers(t).forEach((t,r)=>e.set(r,t))},Ew=e=>Object.prototype.hasOwnProperty.call(gw,e),jw=e=>e.endsWith("/")?e.slice(0,-1):e;class Sw extends Error{constructor(e){super(`Interaction refresh for ${e} became stale.`),this.name="StaleInteractionRefreshError"}}class Aw{constructor(e){this.host=e,this.generation=0,e.addController(this)}hostConnected(){}get errorMessage(){return this.refreshErrorMessage}reset({requestUpdate:e=!0}={}){this.generation+=1,this.snapshotInteractionId=void 0,this.refreshInteractionId=void 0,this.refreshPromise=void 0,this.refreshErrorMessage=void 0,e&&this.host.requestUpdate()}shouldRefresh(e){const t=e?.interactionId;return!!t&&this.snapshotInteractionId!==t}shouldRenderSkeleton(e){const t=e?.interactionId;return!!t&&(!(!this.refreshPromise||this.refreshInteractionId!==t)||!this.refreshErrorMessage&&this.shouldRefresh(e))}shouldRenderError(e){const t=e?.interactionId;return Boolean(t&&this.refreshErrorMessage&&this.snapshotInteractionId!==t)}async refreshFromInteraction(e){const t=e.getCurrentInteractionResponse()?.interactionId;if(t&&this.shouldRefresh(e.getCurrentInteractionResponse()))try{await this.fetch(t,e)}catch(e){}}fetch(e,t){if(this.refreshInteractionId===e&&this.refreshPromise)return this.refreshPromise;this.refreshInteractionId=e,this.refreshErrorMessage=void 0,this.host.requestUpdate();const r=this.generation,n=t.requestInteraction(e).then(n=>{if(r!==this.generation||t.getCurrentInteractionResponse()?.interactionId!==e)throw new Sw(e);const i=t.mergeInteractionResponse(t.getCurrentInteractionResponse()??{interactionId:e},n,t.getSelectedPaymentSourceId());return this.snapshotInteractionId=e,t.setInteractionResponse(i),t.emitListPaymentMethods(i.paymentSources??[]),i}).catch(n=>{if(r!==this.generation||t.getCurrentInteractionResponse()?.interactionId!==e)throw new Sw(e);throw n instanceof Sw||this.snapshotInteractionId===e||(this.refreshErrorMessage="We couldn't load payment methods. Try again.",this.host.requestUpdate()),n}).finally(()=>{r===this.generation&&this.refreshPromise===n&&(this.refreshPromise=void 0,this.refreshInteractionId=void 0,this.host.requestUpdate())});return this.refreshPromise=n,n}async fetchFresh(e,t){const r=this.generation;this.assertCurrentRefresh(r,e,t);const n=this.refreshInteractionId===e?this.refreshPromise:void 0;if(n)try{await n}catch(e){}return this.assertCurrentRefresh(r,e,t),this.fetch(e,t)}assertCurrentRefresh(e,t,r){if(e!==this.generation||r.getCurrentInteractionResponse()?.interactionId!==t)throw new Sw(t)}}class Ow{constructor(e){this.host=e,this.balanceMap={},this.loadingIds=[],e.addController(this)}hostConnected(){}get balances(){return this.balanceMap}get loadingSourceIds(){return this.loadingIds}reset({requestUpdate:e=!0}={}){this.fetchKey=void 0,this.queuedFetchKey=void 0,this.balanceMap={},this.loadingIds=[],e&&this.host.requestUpdate()}queueRefresh(e,t){const r=e(),n=r?.interactionId,i=Iw(r);if(!n||0===i.length){const t=void 0!==this.fetchKey||void 0!==this.queuedFetchKey||Object.keys(this.balanceMap).length>0||this.loadingIds.length>0;if(this.queuedFetchKey=void 0,!t)return;return void queueMicrotask(()=>{0===Iw(e()).length&&(this.fetchKey=void 0,this.balanceMap={},this.loadingIds=[],this.host.requestUpdate())})}const o=_w(n,i);this.fetchKey!==o&&this.queuedFetchKey!==o&&(this.queuedFetchKey=o,queueMicrotask(()=>{if(this.queuedFetchKey!==o)return;this.queuedFetchKey=void 0;const r=e(),n=r?.interactionId,i=Iw(r);n&&0!==i.length&&_w(n,i)===o&&this.refresh(e,t)}))}async refresh(e,t){const r=e(),n=r?.interactionId,i=Iw(r);if(!n||0===i.length)return void this.reset();const o=_w(n,i);if(this.fetchKey!==o){this.fetchKey=o,this.balanceMap={},this.loadingIds=i.map(Nw),this.host.requestUpdate();try{const e=await t(n);if(this.fetchKey!==o)return;this.balanceMap=e,this.host.requestUpdate()}catch(e){this.fetchKey===o&&(this.balanceMap={},this.host.requestUpdate())}finally{this.fetchKey===o&&(this.loadingIds=[],this.host.requestUpdate())}}}}const Iw=e=>(e?.paymentSources??[]).filter(Rw),_w=(e,t)=>`${e}:${t.map(e=>zw(e).join(",")).join("|")}`,zw=e=>[e.id,e.account?.positionId,e.account?.token].map(e=>e?.trim()).filter(e=>Boolean(e)),Nw=e=>e.id?.trim()||e.name?.trim()||e.tenderType,Rw=e=>"NativeAccount"===e.tenderType||"NATIVE_ACCOUNT"===e.tenderType,Tw="__new__",Mw=()=>({name:"",fullName:"",cardNumber:"",expirationDate:"",cvv:"",billingAddressValue:Tw,country:"",addressLine1:"",addressLine2:"",city:"",state:"",zip:""}),Pw=e=>"cardNumber"===e||"cvv"===e,Lw=e=>e.replace(/\D/g,""),Dw=e=>e.replace(/\D/g,""),Bw=(e,t)=>"cardNumber"===e?Lw(t):Dw(t),qw=e=>{const t=Lw(e).slice(0,19);return Fw(t,Vw(t))},Vw=e=>/^3[47]/.test(e)?[4,6,5]:/^3(?:0[0-5]|[68])/.test(e)?[4,6,4]:[4,4,4,4,3],Fw=(e,t)=>{const r=[];let n=0;for(const i of t){if(n>=e.length)break;r.push(e.slice(n,n+i)),n+=i}return n<e.length&&r.push(e.slice(n)),r.join(" ")},Uw=e=>{const t=e.replace(/\D/g,"").slice(0,6);return t.length<=2?2===t.length?`${t} / `:t:`${t.slice(0,2)} / ${t.slice(2)}`},Hw=e=>({name:e.name.trim(),fullName:e.fullName.trim(),cardNumber:e.cardNumber.trim(),expirationDate:e.expirationDate.trim(),cvv:e.cvv.trim(),billingAddressValue:e.billingAddressValue.trim()||Tw,country:e.country.trim(),addressLine1:e.addressLine1.trim(),addressLine2:e.addressLine2.trim(),city:e.city.trim(),state:e.state.trim(),zip:e.zip.trim()}),Ww=e=>{const t={};return e.name||(t.name="Enter a card name."),e.fullName||(t.fullName="Enter the full name."),Xw(e.cardNumber)||(t.cardNumber="Enter a valid card number."),t$(e.expirationDate)||(t.expirationDate="Enter a valid expiration date."),e$(e.cvv)||(t.cvv="Enter a valid CVC."),e.billingAddressValue||(t.billingAddressValue="Select a billing address."),e.billingAddressValue===Tw&&(e.country||(t.country="Select a country or region."),e.addressLine1||(t.addressLine1="Enter an address."),e.city||(t.city="Enter a city."),e.state||(t.state="Select a state."),/^\d{5}(?:-\d{4})?$/.test(e.zip)||(t.zip="Enter a valid ZIP code.")),t},Kw=e=>{const t=[e.name,e.fullName,e.cardNumber,e.expirationDate,e.cvv,e.billingAddressValue];return e.billingAddressValue===Tw&&t.push(e.country,e.addressLine1,e.city,e.state,e.zip),t.every(e=>Boolean(e.trim()))},Gw=e=>"cardNumber"===e?"Unable to encrypt the card number. Try again.":"Unable to encrypt the CVC. Try again.",Yw=(e,t)=>t?e.normalizedValue!==t||"encrypting"!==e.status&&"encrypted"!==e.status?{status:"dirty",normalizedValue:t}:e:{status:"idle",normalizedValue:""},Jw=(e,t)=>{const r={...e};return delete r[t],r},Zw=(e,t)=>{const r={};for(const n of["cardNumber","cvv"]){const i=Bw(n,e[n]),o=t[n];if(!i)continue;"encrypted"===o.status&&o.normalizedValue===i&&Boolean(o.encryptedValue)||(r[n]="failed"===o.status?Gw(n):"cardNumber"===n?"Encrypt the card number before saving.":"Encrypt the CVC before saving.")}return r},Qw=(e,t,r)=>{const n=Bw(e,t),i=r[e];if("encrypted"!==i.status||i.normalizedValue!==n||!i.encryptedValue)throw new Error("cardNumber"===e?"Card number encryption must complete before saving.":"CVC encryption must complete before saving.");return i.encryptedValue},Xw=e=>{const t=Lw(e);if(t.length<12||t.length>19)return!1;let r=0,n=!1;for(let e=t.length-1;e>=0;e-=1){let i=Number(t[e]);n&&(i*=2,i>9&&(i-=9)),r+=i,n=!n}return r%10==0},e$=e=>/^\d{3,4}$/.test(Dw(e)),t$=e=>{const t=e.replace(/\D/g,""),r=t.slice(0,2),n=t.slice(2),i=Number(r);if(!(2!==r.length||i<1||i>12))return 2===n.length?{month:r,year:`20${n}`}:4===n.length?{month:r,year:n}:void 0},r$=e=>{const t=Lw(e);return/^4/.test(t)?"Visa":/^(5[1-5]|2[2-7])/.test(t)?"Mastercard":/^3[47]/.test(t)?"AmericanExpress":/^(6011|65|64[4-9])/.test(t)?"Discover":void 0};let n$=0;const i$=()=>(n$+=1,`billing-address-${Date.now().toString(36)}-${n$.toString(36)}`),o$={type:"object",properties:{accountNickname:{type:"string",minLength:3,description:"Please enter the account nickname",title:"Account Nickname","x-errorMessages":{required:"Enter an account nickname of at least 3 characters.",minLength:"Enter an account nickname of at least 3 characters."}},routingNumber:{type:"string",description:"Please enter the routing number",title:"Routing number","x-errorMessages":{required:"Enter a routing number."}},accountNumber:{type:"string",description:"Please enter the account number",title:"Account number","x-errorMessages":{required:"Enter an account number."}},confirmAccountNumber:{type:"string",description:"Confirm the account number",title:"Confirm account number","x-equalsField":"accountNumber","x-errorMessages":{required:"Confirm the account number.",equals:"Account numbers must match."}}},required:["accountNickname","routingNumber","accountNumber","confirmAccountNumber"]},a$=["accountNickname","routingNumber","accountNumber","confirmAccountNumber"],s$=e=>"string"==typeof e&&a$.includes(e),c$=e=>"routingNumber"===e||"accountNumber"===e||"confirmAccountNumber"===e,d$=e=>e.replace(/\D/g,""),u$=(e,t)=>"encrypted"===t.status&&Boolean(t.normalizedValue)&&e===l$(t.normalizedValue),l$=e=>e.length<=4?e:`${"•".repeat(e.length-4)}${C$(e)}`,h$=(e,t)=>({accountNickname:e.accountNickname.trim(),routingNumber:f$("routingNumber",e,t),accountNumber:f$("accountNumber",e,t),confirmAccountNumber:f$("confirmAccountNumber",e,t)}),f$=(e,t,r)=>{const n=t[e],i=r[e];return u$(n,i)?i.normalizedValue:d$(n)},m$=(e,t)=>({accountNickname:e.accountNickname,routingNumber:p$("routingNumber",e,t),accountNumber:p$("accountNumber",e,t),confirmAccountNumber:p$("confirmAccountNumber",e,t)}),p$=(e,t,r)=>{const n=t[e];return u$(n,r[e])?n:d$(n)},v$=(e,t)=>{const r={};for(const n of t.required??[]){if(!s$(n))continue;const i=b$(n,e[n]);if(!i){r[n]=j$(t,n,"required","Enter a value.");continue}const o=g$(n,i,t);o&&(r[n]=o)}for(const n of t.required??[]){if(!s$(n))continue;if(r[n])continue;const i=S$(t,n);if(void 0===i)continue;const o=b$(n,e[n]),a=b$(i,e[i]);a&&o!==a&&(r[n]=j$(t,n,"equals","Values must match."))}return r},b$=(e,t)=>"accountNickname"===e?t.trim():d$(t),g$=(e,t,r)=>{const n=E$(r,e);return void 0!==n.minLength&&t.length<n.minLength?j$(r,e,"minLength",y$(e)):void 0!==n.maxLength&&t.length>n.maxLength?j$(r,e,"maxLength",y$(e)):void 0===n.pattern||new RegExp(n.pattern).test(t)?void 0:j$(r,e,"pattern",y$(e))},y$=e=>"routingNumber"===e?"Enter a 9-digit routing number.":"Enter a 9-digit account number.",w$=e=>"routingNumber"===e?"Unable to encrypt the routing number. Try again.":"Unable to encrypt the account number. Try again.",$$=({draft:e,errors:t,encryption:r,schema:n,field:i,value:o})=>{if(c$(i)&&u$(o,r[i])){const t={...e,[i]:o};return{draft:t,errors:v$(h$(t,r),n),encryption:r}}const a=((e,t)=>c$(e)?d$(t):t)(i,o),s={...e,[i]:a};let c=r;if(c$(i)){if(u$(a,r[i]))return{draft:e,errors:t,encryption:r};c={...r,[i]:Yw(r[i],d$(a))}}return{draft:s,encryption:c,errors:v$(h$(s,c),n)}},k$=(e,t,r)=>{const n=t[e],i=d$(n),o=r[e],a=u$(n,o)||i===o.normalizedValue;if("encrypted"===o.status&&o.encryptedValue&&a)return o.encryptedValue;if(!i)return"";throw new Error("ACH detail encryption must complete before saving.")},x$=(e,t)=>e.trim()||`Bank Account xxxxxx${t}`,C$=e=>e?.replace(/\D/g,"").slice(-4)??"",E$=(e,t)=>e.properties[t]??{type:"string"},j$=(e,t,r,n)=>E$(e,t)["x-errorMessages"]?.[r]??n,S$=(e,t)=>{const r=E$(e,t)["x-equalsField"];return s$(r)?r:void 0},A$=e=>Object.entries(e).map(([e,t])=>({keyword:"bankAccountDraft",instancePath:`/${e}`,schemaPath:`#/properties/${e}`,params:{},message:t})),O$=new Set(["jsonforms/INIT","jsonforms/UPDATE_CORE","jsonforms/SET_AJV","jsonforms/UPDATE","jsonforms/UPDATE_ERRORS","jsonforms/SET_SCHEMA","jsonforms/SET_UISCHEMA","jsonforms/SET_VALIDATION_MODE"]),I$=()=>jg(void 0,{type:"@@jsonforms-lit/INIT"});class _${constructor(e={}){this.state={jsonforms:{renderers:[],cells:[],uischemas:[],config:{},i18n:I$(),readonly:!1}},this.subscribers=new Set,this.middleware=(e,t,r)=>r(e,t),this.explicitUiSchema=!1,this.validationMode="ValidateAndShow",this.additionalErrors=[],this.middleware=e.middleware??this.middleware,this.explicitUiSchema=void 0!==e.uischema,this.validationMode=e.validationMode??this.validationMode,this.ajv=e.ajv,this.additionalErrors=e.additionalErrors??[],this.state={jsonforms:{renderers:e.renderers??[],cells:e.cells??[],uischemas:e.uischemas??[],readonly:e.readonly??!1,config:e.config??{},i18n:{...I$(),...e.i18n}}};const t=e.schema??{},r=e.uischema??bb(t,"VerticalLayout");this.reduceCore(Lb.init(e.data??{},t,r,this.coreOptions()))}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}getState(){return this.state}dispatch(e){const t=this.state.jsonforms;let r=t;switch(O$.has(e.type)&&(r={...r,core:this.middleware(r.core,e,$g)}),e.type){case"jsonforms/ADD_RENDERER":case"jsonforms/REMOVE_RENDERER":r={...r,renderers:kg(r.renderers,e)};break;case"jsonforms/ADD_CELL":case"jsonforms/REMOVE_CELL":r={...r,cells:xg(r.cells,e)};break;case"jsonforms/SET_CONFIG":r={...r,config:Cg(r.config,e)};break;case"jsonforms/ADD_UI_SCHEMA":case"jsonforms/REMOVE_UI_SCHEMA":r={...r,uischemas:Eg(r.uischemas,e)};break;case"jsonforms/SET_LOCALE":case"jsonforms/SET_TRANSLATOR":case"jsonforms/UPDATE_I18N":r={...r,i18n:jg(r.i18n,e)}}r!==t&&(this.state={jsonforms:r},this.notify())}setData(e){this.updateCoreState({data:e})}setSchema(e){this.updateCoreState({schema:e})}setUiSchema(e){this.explicitUiSchema=void 0!==e,this.updateCoreState({uischema:e})}setRenderers(e=[]){this.assignState({renderers:e})}setCells(e=[]){this.assignState({cells:e})}setUiSchemas(e=[]){this.assignState({uischemas:e})}setReadonly(e){this.assignState({readonly:e})}setConfig(e){this.assignState({config:e})}setI18n(e={}){this.assignState({i18n:{...I$(),...e}})}setValidationMode(e){this.validationMode=e,this.dispatch(Lb.setValidationMode(e))}setAjv(e){this.ajv=e,void 0!==e?this.dispatch(Lb.setAjv(e)):this.updateCoreState({})}setAdditionalErrors(e=[]){this.additionalErrors=e,this.updateCoreState({})}updateCoreState(e){const t=this.state.jsonforms.core,r=e.schema??t?.schema??{},n=!this.explicitUiSchema&&void 0===e.uischema?bb(r,"VerticalLayout"):e.uischema??t?.uischema;this.reduceCore(Lb.updateCore(e.data??t?.data??{},r,n,this.coreOptions()))}reduceCore(e){const t=this.state.jsonforms,r=this.middleware(t.core,e,$g);r!==t.core&&(this.state={jsonforms:{...t,core:r}},this.notify())}coreOptions(){return{ajv:this.ajv,validationMode:this.validationMode,additionalErrors:this.additionalErrors}}assignState(e){this.state={jsonforms:{...this.state.jsonforms,...e}},this.notify()}notify(){for(const e of this.subscribers)e()}}var z$=function(e,t,r,n){for(var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n,s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const N$=new Set(["store","uischema","schema","path","enabled","readonly","visible","renderers","cells","uischemas","id"]);class R$ extends Xy{constructor(){super(...arguments),this.path="",this.enabled=!0,this.readonly=!1,this.visible=!0,this.id=""}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncSubscription(),this.updateMappedProps()}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=void 0,super.disconnectedCallback()}updated(e){[...e.keys()].some(e=>N$.has(e))&&(this.syncSubscription(),this.updateMappedProps())}mapStateToProps(e){return Wg(e,this.ownProps())}updateMappedProps(){void 0!==this.store&&(this.rendererProps=this.mapStateToProps(this.store.getState()))}ownProps(){return{uischema:this.uischema,schema:this.schema,path:this.path,enabled:this.enabled,readonly:this.readonly,visible:this.visible,renderers:this.renderers,cells:this.cells,uischemas:this.uischemas}}syncSubscription(){this.unsubscribe?.(),this.unsubscribe=void 0,void 0!==this.store&&this.isConnected&&(this.unsubscribe=this.store.subscribe(()=>this.updateMappedProps()))}}z$([iw({attribute:!1})],R$.prototype,"store",void 0),z$([iw({attribute:!1})],R$.prototype,"uischema",void 0),z$([iw({attribute:!1})],R$.prototype,"schema",void 0),z$([iw({type:String})],R$.prototype,"path",void 0),z$([iw({type:Boolean})],R$.prototype,"enabled",void 0),z$([iw({type:Boolean})],R$.prototype,"readonly",void 0),z$([iw({type:Boolean})],R$.prototype,"visible",void 0),z$([iw({attribute:!1})],R$.prototype,"renderers",void 0),z$([iw({attribute:!1})],R$.prototype,"cells",void 0),z$([iw({attribute:!1})],R$.prototype,"uischemas",void 0),z$([iw({type:String})],R$.prototype,"id",void 0),z$([ow()],R$.prototype,"rendererProps",void 0);class T$ extends R${connectedCallback(){super.connectedCallback(),this.ensureId()}disconnectedCallback(){void 0!==this.generatedId&&(Pv(this.generatedId),this.generatedId=void 0),super.disconnectedCallback()}updated(e){super.updated(e),[...e.keys()].some(e=>N$.has(e))&&(this.ensureId(),this.updateMappedProps())}mapStateToProps(e){return{...Vg(e,this.controlOwnProps()),handleChange:(e,t)=>{this.store?.dispatch(Lb.update(e,()=>t))}}}updateMappedProps(){void 0!==this.store&&(this.controlProps=this.mapStateToProps(this.store.getState()),this.rendererProps=this.controlProps)}controlOwnProps(){return{...this.ownProps(),id:this.id,uischema:this.uischema}}ensureId(){this.id||void 0===this.uischema||(this.generatedId=Mv(this.path||"jsonforms-control"),this.id=this.generatedId)}}z$([ow()],T$.prototype,"controlProps",void 0);class M$ extends R${mapStateToProps(e){return Hg(e,{...this.ownProps(),uischema:this.uischema})}updateMappedProps(){void 0!==this.store&&(this.layoutProps=this.mapStateToProps(this.store.getState()),this.rendererProps=this.layoutProps)}}z$([ow()],M$.prototype,"layoutProps",void 0);class P$ extends R${mapStateToProps(e){return((e,t)=>{const{uischema:r}=t,n=void 0===t.visible||tb(r)?rb(t.uischema,Og(e),t.path,zg(e),Dg(e)):t.visible,i=r.text,o=tg()(e),a=Yb(void 0,r);return{text:o(a?`${a}.text`:i??"",i,{uischema:r}),visible:n,config:Dg(e),renderers:t.renderers||Ng(e),cells:t.cells||Rg(e),uischema:r}})(e,{...this.ownProps(),uischema:this.uischema})}updateMappedProps(){void 0!==this.store&&(this.labelProps=this.mapStateToProps(this.store.getState()),this.rendererProps=this.labelProps)}}z$([ow()],P$.prototype,"labelProps",void 0);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L$=Symbol.for(""),D$=e=>{if(e?.r===L$)return e?._$litStatic$},B$=new Map,q$=(e=>(t,...r)=>{const n=r.length;let i,o;const a=[],s=[];let c,d=0,u=!1;for(;d<n;){for(c=t[d];d<n&&void 0!==(o=r[d],i=D$(o));)c+=i+t[++d],u=!0;d!==n&&s.push(o),a.push(c),d++}if(d===n&&a.push(t[n]),u){const e=a.join("$$lit$$");void 0===(t=B$.get(e))&&(a.raw=a,B$.set(e,t=a)),r=s}return e(t,...r)})(Ty);var V$=function(e,t,r,n){for(var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n,s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let F$=class extends Xy{constructor(){super(...arguments),this.path="",this.enabled=!0,this.readonly=!1,this.visible=!0}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncSubscription(),this.updateRenderer()}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=void 0,super.disconnectedCallback()}updated(e){e.has("store")&&this.syncSubscription(),e.size>0&&this.updateRenderer()}render(){if(void 0===this.store)return Ty``;const e=Wg(this.store.getState(),{uischema:this.uischema,schema:this.schema,path:this.path,enabled:this.enabled,readonly:this.readonly,visible:this.visible,renderers:this.renderers,cells:this.cells,uischemas:this.uischemas});if(void 0===e.uischema||!1===e.visible)return Ty``;const t=(e=>({_$litStatic$:e,r:L$}))(this.selectedRenderer??"jsonforms-lit-unknown-renderer");return q$`
      <${t}
        .store=${this.store}
        .uischema=${e.uischema}
        .schema=${e.schema}
        .path=${e.path??""}
        .enabled=${e.enabled??!0}
        .readonly=${e.readonly??this.readonly}
        .visible=${e.visible??!0}
        .renderers=${e.renderers}
        .cells=${e.cells}
        .uischemas=${this.uischemas}
      ></${t}>
    `}updateRenderer(){if(void 0===this.store)return void(this.selectedRenderer=void 0);const e=Wg(this.store.getState(),{uischema:this.uischema,schema:this.schema,path:this.path,enabled:this.enabled,readonly:this.readonly,visible:this.visible,renderers:this.renderers,cells:this.cells,uischemas:this.uischemas});if(void 0===e.uischema)return void(this.selectedRenderer=void 0);let t,r=-1;const n=e.renderers??[];for(const i of n){const n=i.tester(e.uischema,e.schema??{},{rootSchema:e.rootSchema,config:e.config});n>r&&(r=n,t=i.renderer)}this.selectedRenderer=-1===r?void 0:t}syncSubscription(){this.unsubscribe?.(),this.unsubscribe=void 0,void 0!==this.store&&this.isConnected&&(this.unsubscribe=this.store.subscribe(()=>{this.updateRenderer(),this.requestUpdate()}))}};V$([iw({attribute:!1})],F$.prototype,"store",void 0),V$([iw({attribute:!1})],F$.prototype,"uischema",void 0),V$([iw({attribute:!1})],F$.prototype,"schema",void 0),V$([iw({type:String})],F$.prototype,"path",void 0),V$([iw({type:Boolean})],F$.prototype,"enabled",void 0),V$([iw({type:Boolean})],F$.prototype,"readonly",void 0),V$([iw({type:Boolean})],F$.prototype,"visible",void 0),V$([iw({attribute:!1})],F$.prototype,"renderers",void 0),V$([iw({attribute:!1})],F$.prototype,"cells",void 0),V$([iw({attribute:!1})],F$.prototype,"uischemas",void 0),V$([ow()],F$.prototype,"selectedRenderer",void 0),F$=V$([tw("jsonforms-lit-dispatch")],F$);const U$=(e,t)=>{if(!e)return"";const r=[...e];let n=-1;for(let e=r.length-1;e>=0;e-=1)if(" "!==r[e]){n=e;break}return r.map((e,r)=>" "===e?" ":t&&r===n?e:"•").join("")},H$=e=>Ty`
  <svg
    class="field-reveal-icon"
    viewBox="0 0 640 640"
    aria-hidden="true"
    focusable="false"
  >
    <path d=${e?"M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM357.3 459.1C345.4 462.3 332.9 464 320 464C240.5 464 176 399.5 176 320C176 307.1 177.7 294.6 180.9 282.7L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L357.4 459.2z":"M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"}></path>
  </svg>
`,W$=e=>e?"Hide value":"Show value";var K$=function(e,t,r,n){for(var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n,s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const G$="jsonforms-layout jsonforms-layout-vertical",Y$="jsonforms-layout jsonforms-layout-horizontal",J$="jsonforms-layout jsonforms-group";let Z$=class extends M${render(){return this.renderLayout(G$)}renderLayout(e){const t=this.layoutProps;if(void 0===t||!1===t.visible)return Ty``;const r=t.uischema;return Ty`
      <div class=${e}>
        ${t.label?Ty`<div class="jsonforms-group-label">${t.label}</div>`:""}
        ${r.elements?.map(e=>Ty`
            <jsonforms-lit-dispatch
              .store=${this.store}
              .uischema=${e}
              .schema=${t.schema}
              .path=${t.path??""}
              .enabled=${t.enabled??!0}
              .readonly=${t.readonly??!1}
              .renderers=${t.renderers}
              .cells=${t.cells}
            ></jsonforms-lit-dispatch>
          `)}
      </div>
    `}};Z$=K$([tw("jsonforms-lit-vertical-layout")],Z$);let Q$=class extends Z${render(){return this.renderLayout(Y$)}};Q$=K$([tw("jsonforms-lit-horizontal-layout")],Q$);let X$=class extends Z${render(){return this.renderLayout(J$)}};X$=K$([tw("jsonforms-lit-group-layout")],X$);let ek=class extends P${render(){return void 0===this.labelProps||!1===this.labelProps.visible?Ty``:Ty`<span class="jsonforms-label">${this.labelProps.text}</span>`}};ek=K$([tw("jsonforms-lit-label")],ek);let tk=class extends T${render(){const e=this.controlProps;if(void 0===e||!1===e.visible)return Ty``;const t=Array.isArray(e.errors)?e.errors.length>0:Boolean(e.errors),r=e.description?`${e.id}-description`:void 0,n=t?`${e.id}-error`:void 0,i=[r,n].filter(Boolean).join(" ");return Ty`
      <div class="jsonforms-control">
        ${this.renderLabel(e.label,e.required)}
        <input
          id=${e.id}
          name=${e.path}
          type="text"
          .value=${e.data??""}
          ?disabled=${!e.enabled||e.readonly}
          ?required=${e.required}
          aria-invalid=${t?"true":"false"}
          aria-describedby=${aw(i||void 0)}
          @input=${t=>e.handleChange(e.path,t.currentTarget.value)}
        />
        ${this.renderDescription(e.description,r)}
        ${this.renderErrors(e.errors,n)}
      </div>
    `}renderLabel(e,t){return Ty`<label for=${this.controlProps?.id??""}>
      ${e}${t&&!e.endsWith("*")?"*":""}
    </label>`}renderDescription(e,t){return e?Ty`<div class="jsonforms-description" id=${aw(t)}>
          ${e}
        </div>`:Ty``}renderErrors(e,t){const r=Array.isArray(e)?e.join("\n"):e;return r?Ty`<div class="jsonforms-error" id=${aw(t)}>${r}</div>`:Ty``}};tk=K$([tw("jsonforms-lit-text-control")],tk);let rk=class extends tk{constructor(){super(...arguments),this.revealed=!1,this.revealLastChar=!1}disconnectedCallback(){super.disconnectedCallback(),this.clearLastCharReveal()}armLastCharReveal(){this.revealLastChar=!0,void 0!==this.revealLastCharTimeoutId&&window.clearTimeout(this.revealLastCharTimeoutId),this.revealLastCharTimeoutId=window.setTimeout(()=>{this.revealLastChar=!1,this.revealLastCharTimeoutId=void 0},1500)}clearLastCharReveal(){void 0!==this.revealLastCharTimeoutId&&(window.clearTimeout(this.revealLastCharTimeoutId),this.revealLastCharTimeoutId=void 0),this.revealLastChar=!1}render(){const e=this.controlProps;if(void 0===e||!1===e.visible)return Ty``;const t=Array.isArray(e.errors)?e.errors.length>0:Boolean(e.errors),r=t?`${e.id}-error`:void 0,n=String(e.data??""),i=!e.enabled||e.readonly,o=!this.revealed&&""!==n,a=this.revealed?"":U$(n,this.revealLastChar);return Ty`
      <div class="jsonforms-control jsonforms-control-sensitive">
        ${this.renderLabel(e.label,e.required)}
        <div class="jsonforms-mask-control">
          <div class="jsonforms-mask-wrap">
            <input
              class=${o?"jsonforms-mask-input field-input-mask-hidden":"jsonforms-mask-input"}
              id=${e.id}
              name=${e.path}
              type="text"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              .value=${n}
              ?disabled=${i}
              ?required=${e.required}
              aria-invalid=${t?"true":"false"}
              aria-describedby=${aw(r)}
              @input=${t=>{e.handleChange(e.path,t.currentTarget.value),this.armLastCharReveal()}}
              @blur=${()=>this.clearLastCharReveal()}
            />
            <span class="jsonforms-mask-overlay" aria-hidden="true"
              >${a}</span
            >
          </div>
          <button
            class="field-reveal-toggle"
            type="button"
            aria-label=${W$(this.revealed)}
            aria-pressed=${this.revealed?"true":"false"}
            aria-controls=${e.id}
            ?disabled=${i}
            @mousedown=${e=>e.preventDefault()}
            @click=${()=>{this.revealed=!this.revealed}}
          >
            ${H$(this.revealed)}
          </button>
        </div>
        ${this.renderErrors(e.errors,r)}
      </div>
    `}};K$([ow()],rk.prototype,"revealed",void 0),K$([ow()],rk.prototype,"revealLastChar",void 0),rk=K$([tw("jsonforms-lit-sensitive-text-control")],rk);let nk=class extends tk{render(){const e=this.controlProps;return void 0===e||!1===e.visible?Ty``:Ty`
      <div class="jsonforms-control">
        ${this.renderLabel(e.label,e.required)}
        <input
          id=${e.id}
          name=${e.path}
          type="number"
          .value=${e.data??""}
          ?disabled=${!e.enabled||e.readonly}
          @input=${t=>{const r=t.currentTarget.value;e.handleChange(e.path,""===r?void 0:Number(r))}}
        />
        ${this.renderDescription(e.description)}
        ${this.renderErrors(e.errors)}
      </div>
    `}};nk=K$([tw("jsonforms-lit-number-control")],nk);let ik=class extends tk{render(){const e=this.controlProps;return void 0===e||!1===e.visible?Ty``:Ty`
      <div class="jsonforms-control jsonforms-control-checkbox">
        <label for=${e.id}>
          <input
            id=${e.id}
            name=${e.path}
            type="checkbox"
            .checked=${Boolean(e.data)}
            ?disabled=${!e.enabled||e.readonly}
            @change=${t=>e.handleChange(e.path,t.currentTarget.checked)}
          />
          ${e.label}${e.required&&!e.label.endsWith("*")?"*":""}
        </label>
        ${this.renderDescription(e.description)}
        ${this.renderErrors(e.errors)}
      </div>
    `}};ik=K$([tw("jsonforms-lit-boolean-control")],ik);let ok=class extends tk{render(){const e=this.controlProps;if(void 0===e||!1===e.visible)return Ty``;const t=e.schema.enum??[];return Ty`
      <div class="jsonforms-control">
        ${this.renderLabel(e.label,e.required)}
        <select
          id=${e.id}
          name=${e.path}
          .value=${e.data??""}
          ?disabled=${!e.enabled||e.readonly}
          @change=${t=>e.handleChange(e.path,t.currentTarget.value)}
        >
          ${t.map(t=>Ty`
              <option
                value=${String(t)}
                ?selected=${t===e.data}
              >
                ${String(t)}
              </option>
            `)}
        </select>
        ${this.renderDescription(e.description)}
        ${this.renderErrors(e.errors)}
      </div>
    `}};ok=K$([tw("jsonforms-lit-enum-control")],ok);let ak=class extends P${render(){const e=this.uischema?.type??"unknown";return Ty`<div class="jsonforms-unknown-renderer">
      No renderer found for ${e}
    </div>`}};ak=K$([tw("jsonforms-lit-unknown-renderer")],ak);const sk=[{tester:mg(1,dg("VerticalLayout")),renderer:"jsonforms-lit-vertical-layout"},{tester:mg(1,dg("HorizontalLayout")),renderer:"jsonforms-lit-horizontal-layout"},{tester:mg(1,dg("Group")),renderer:"jsonforms-lit-group-layout"},{tester:mg(1,dg("Label")),renderer:"jsonforms-lit-label"},{tester:mg(4,vg),renderer:"jsonforms-lit-enum-control"},{tester:mg(3,yg),renderer:"jsonforms-lit-text-control"},{tester:mg(3,hg(gg,dg("Control"))),renderer:"jsonforms-lit-number-control"},{tester:mg(3,hg(bg,dg("Control"))),renderer:"jsonforms-lit-number-control"},{tester:mg(3,pg),renderer:"jsonforms-lit-boolean-control"}];var ck=function(e,t,r,n){for(var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n,s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let dk=class extends Xy{constructor(){super(...arguments),this.renderers=sk,this.readonly=!1,this.validationMode="ValidateAndShow",this.store=new _$({renderers:sk})}connectedCallback(){super.connectedCallback(),this.unsubscribe=this.store.subscribe(()=>this.onStoreChange()),this.captureCoreRefs()}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=void 0,super.disconnectedCallback()}willUpdate(e){e.has("middleware")?this.recreateStore():(e.has("schema")&&this.store.setSchema(this.schema??{}),e.has("uischema")&&this.store.setUiSchema(this.uischema),e.has("data")&&this.store.setData(this.data??{}),e.has("renderers")&&this.store.setRenderers(this.renderers??[]),e.has("cells")&&this.store.setCells(this.cells??[]),e.has("uischemas")&&this.store.setUiSchemas(this.uischemas??[]),e.has("readonly")&&this.store.setReadonly(this.readonly),e.has("validationMode")&&this.store.setValidationMode(this.validationMode),e.has("ajv")&&this.store.setAjv(this.ajv),e.has("config")&&this.store.setConfig(this.config??{}),e.has("i18n")&&this.store.setI18n(this.i18n??{}),e.has("additionalErrors")&&this.store.setAdditionalErrors(this.additionalErrors??[]))}render(){const e=this.store.getState().jsonforms.core;return Ty`
      <jsonforms-lit-dispatch
        .store=${this.store}
        .schema=${e?.schema}
        .uischema=${e?.uischema}
        .path=${""}
        .enabled=${!0}
        .readonly=${this.readonly}
        .renderers=${this.renderers}
        .cells=${this.cells}
        .uischemas=${this.uischemas}
      ></jsonforms-lit-dispatch>
    `}recreateStore(){this.unsubscribe?.(),this.store=new _$({data:this.data??{},schema:this.schema??{},uischema:this.uischema,renderers:this.renderers??[],cells:this.cells??[],uischemas:this.uischemas??[],readonly:this.readonly,validationMode:this.validationMode,ajv:this.ajv,config:this.config??{},i18n:this.i18n??{},additionalErrors:this.additionalErrors??[],middleware:this.middleware}),this.unsubscribe=this.store.subscribe(()=>this.onStoreChange()),this.captureCoreRefs()}onStoreChange(){const e=this.store.getState().jsonforms.core;void 0!==e&&(e.data!==this.lastData&&(this.lastData=e.data,this.dispatchEvent(new CustomEvent("data-change",{detail:{data:e.data,errors:e.errors??[]}}))),e.errors!==this.lastErrors&&(this.lastErrors=e.errors,this.dispatchEvent(new CustomEvent("errors-change",{detail:{errors:e.errors??[]}}))),this.requestUpdate())}captureCoreRefs(){const e=this.store.getState().jsonforms.core;this.lastData=e?.data,this.lastErrors=e?.errors}};dk.styles=Qg`
    :host {
      display: block;
      color: #1f2933;
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.4;
    }

    .jsonforms-layout {
      display: flex;
      gap: 12px;
    }

    .jsonforms-layout-vertical,
    .jsonforms-group {
      flex-direction: column;
    }

    .jsonforms-layout-horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .jsonforms-group {
      border: 1px solid #d8dee4;
      border-radius: 6px;
      padding: 12px;
    }

    .jsonforms-group-label {
      font-weight: 600;
    }

    .jsonforms-control {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 180px;
    }

    label {
      font-weight: 600;
    }

    input,
    select {
      box-sizing: border-box;
      min-height: 36px;
      border: 1px solid #c9d1d9;
      border-radius: 6px;
      padding: 6px 8px;
      font: inherit;
    }

    input[type='checkbox'] {
      min-height: auto;
    }

    input:disabled,
    select:disabled {
      background: #f6f8fa;
      color: #57606a;
    }

    .jsonforms-control-checkbox label {
      display: inline-flex;
      gap: 8px;
      align-items: center;
    }

    .jsonforms-description {
      color: #57606a;
      font-size: 12px;
    }

    .jsonforms-error,
    .jsonforms-unknown-renderer {
      color: #b42318;
      font-size: 12px;
    }
  `,ck([iw({attribute:!1})],dk.prototype,"data",void 0),ck([iw({attribute:!1})],dk.prototype,"schema",void 0),ck([iw({attribute:!1})],dk.prototype,"uischema",void 0),ck([iw({attribute:!1})],dk.prototype,"renderers",void 0),ck([iw({attribute:!1})],dk.prototype,"cells",void 0),ck([iw({attribute:!1})],dk.prototype,"uischemas",void 0),ck([iw({type:Boolean})],dk.prototype,"readonly",void 0),ck([iw({type:String})],dk.prototype,"validationMode",void 0),ck([iw({attribute:!1})],dk.prototype,"ajv",void 0),ck([iw({attribute:!1})],dk.prototype,"config",void 0),ck([iw({attribute:!1})],dk.prototype,"i18n",void 0),ck([iw({attribute:!1})],dk.prototype,"additionalErrors",void 0),ck([iw({attribute:!1})],dk.prototype,"middleware",void 0),ck([ow()],dk.prototype,"store",void 0),dk=ck([tw("jsonforms-lit")],dk);var uk=function(e,t,r,n){for(var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n,s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const lk={accountNickname:"ach-account-nickname",routingNumber:"ach-routing-number",accountNumber:"ach-account-number",confirmAccountNumber:"ach-account-number-confirm"},hk=new Set(["routingNumber","accountNumber","confirmAccountNumber"]),fk=e=>hk.has(e);let mk=class extends T${constructor(){super(...arguments),this.revealed=!1,this.revealLastChar=!1}disconnectedCallback(){super.disconnectedCallback(),this.clearLastCharReveal()}armLastCharReveal(){this.revealLastChar=!0,void 0!==this.revealLastCharTimeoutId&&window.clearTimeout(this.revealLastCharTimeoutId),this.revealLastCharTimeoutId=window.setTimeout(()=>{this.revealLastChar=!1,this.revealLastCharTimeoutId=void 0},1500)}clearLastCharReveal(){void 0!==this.revealLastCharTimeoutId&&(window.clearTimeout(this.revealLastCharTimeoutId),this.revealLastCharTimeoutId=void 0),this.revealLastChar=!1}render(){const e=this.controlProps,t=e?.path;if(void 0===e||!1===e.visible||void 0===t||!(e=>e in lk)(t))return Ty``;const r=e.config,n=r?.draft,i=r?.encryption,o=n?.[t]??e.data??"",a=r?.errors?.[t],s=Boolean(r?.disabled)||!e.enabled||Boolean(e.readonly),c=n&&i&&fk(t)?((e,t,r)=>"routingNumber"===e||u$(t[e],r[e])?"text":"password")(t,n,i):"text",d="password"===c,u=d?"text":c,l=String(o),h=d&&!this.revealed&&""!==l,f=this.revealed?"":U$(l,this.revealLastChar),m=fk(t)?"numeric":void 0,p=["field","field-full","field-card-form"];a&&p.push("field-invalid");const v=["field-control","field-control-card-form"];d&&v.push("field-control-reveal");const b=Ty`
      <input
        class=${h?"field-input field-input-card-form field-input-mask-hidden":"field-input field-input-card-form"}
        id=${lk[t]}
        name=${t}
        type=${u}
        .value=${l}
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        data-lpignore="true"
        inputmode=${aw(m)}
        data-bank-account-field=${t}
        aria-invalid=${a?"true":"false"}
        aria-describedby=${aw(a?`${lk[t]}-error`:void 0)}
        ?disabled=${s}
        @input=${t=>{e.handleChange(e.path,t.currentTarget.value),d&&this.armLastCharReveal()}}
        @blur=${()=>{d&&this.clearLastCharReveal()}}
      />
    `;return Ty`
      <div class=${p.join(" ")}>
        <label
          class="field-label field-label-card-form"
          for=${lk[t]}
        >
          ${e.label}
        </label>
        <div class=${v.join(" ")}>
          ${d?Ty`
                <div class="field-input-mask-wrap">
                  ${b}
                  <span class="field-input-mask-overlay" aria-hidden="true"
                    >${f}</span
                  >
                </div>
              `:b}
          ${d?Ty`
                <button
                  class="field-reveal-toggle"
                  type="button"
                  aria-label=${W$(this.revealed)}
                  aria-pressed=${this.revealed?"true":"false"}
                  aria-controls=${lk[t]}
                  ?disabled=${s}
                  @click=${()=>{this.revealed=!this.revealed}}
                >
                  ${H$(this.revealed)}
                </button>
              `:""}
        </div>
        ${a?Ty`
              <p
                class="field-error"
                id=${`${lk[t]}-error`}
              >
                ${a}
              </p>
            `:""}
      </div>
    `}};uk([ow()],mk.prototype,"revealed",void 0),uk([ow()],mk.prototype,"revealLastChar",void 0),mk=uk([tw("commerce-hub-bank-account-control")],mk);let pk=class extends T${render(){const e=this.controlProps?.config;return e?.billingAddressTemplate??Ty``}};pk=uk([tw("commerce-hub-bank-billing-address-control")],pk);const vk=[...sk,{tester:mg(20,lg("__bankBillingAddress")),renderer:"commerce-hub-bank-billing-address-control"}],bk=[...vk,{tester:mg(10,lg("accountNickname")),renderer:"commerce-hub-bank-account-control"},{tester:mg(10,lg("routingNumber")),renderer:"commerce-hub-bank-account-control"},{tester:mg(10,lg("accountNumber")),renderer:"commerce-hub-bank-account-control"},{tester:mg(10,lg("confirmAccountNumber")),renderer:"commerce-hub-bank-account-control"}],gk=[...vk,{tester:mg(20,fg(...["accountNumber","bsbCode","interacAccount"].map(e=>lg(e)))),renderer:"jsonforms-lit-sensitive-text-control"}],yk=e=>"object"==typeof e&&null!==e&&!Array.isArray(e),wk=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),$k=e=>"string"==typeof e&&e.trim().length>0,kk=e=>{const t=e?.trim();return t||void 0},xk=e=>void 0===e||"number"==typeof e&&Number.isInteger(e)&&e>=0,Ck=e=>e.length>=8&&e.startsWith("$re$")&&e.endsWith("$re$")?`^(?:${e.slice(4,-4)})$`:e,Ek=e=>{return yk(e)&&"string"===e.type&&$k(e.title)&&(t=e.minLength,r=e.maxLength,xk(t)&&xk(r)&&!("number"==typeof t&&"number"==typeof r&&t>r))&&(e=>{if(void 0===e)return!0;if("string"!=typeof e)return!1;try{return new RegExp(Ck(e),"u"),!0}catch{return!1}})(e.pattern)&&(e=>yk(e)&&$k(e.required)&&Object.values(e).every($k))(e["x-errorMessages"]);var t,r},jk=e=>e.split("."),Sk=new Set(["prototype",...Object.getOwnPropertyNames(Object.prototype)]),Ak=e=>{const t=e.map(jk);return!t.some(e=>e.some(e=>0===e.length||Sk.has(e)))&&!t.some((e,r)=>t.some((t,n)=>n!==r&&t.length<e.length&&t.every((t,r)=>t===e[r])))},Ok=e=>{if(!Ak(Object.keys(e.properties)))throw new Error("Instrument schema contains an unsafe property path.")},Ik=e=>{if(!(yk(e)&&$k(e.bavSupportedCode)&&"string"==typeof e.productId&&"string"==typeof e.countryCode&&"string"==typeof e.currencyCode&&"string"==typeof e.currencyName&&"object"===e.type&&yk(e.properties)&&Array.isArray(e.required)))return!1;const t=Object.keys(e.properties);return t.length>0&&Ak(t)&&Object.values(e.properties).every(Ek)&&e.required.every(e=>"string"==typeof e&&t.includes(e))},_k=()=>({type:"object",properties:{}}),zk=(e,t,r,n=!1)=>{let i=e;for(const e of t.slice(0,-1)){const t=(wk(i.properties,e)?i.properties[e]:void 0)??_k();i.properties[e]=t,i=t}i.properties[t[t.length-1]]=((e,t=!1)=>{const r={type:"string",title:e.title,"x-errorMessages":{...e["x-errorMessages"]}};return void 0!==e.minLength&&(r.minLength=e.minLength),void 0!==e.maxLength&&(r.maxLength=e.maxLength),void 0!==e.pattern&&(r.pattern=Ck(e.pattern)),t&&(r.readOnly=!0),r})(r,n)},Nk=(e,t)=>{let r=e;t.forEach((e,n)=>{r.required??=[],r.required.includes(e)||r.required.push(e),n<t.length-1&&(r=r.properties[e])})},Rk=(e,t)=>yk(t)?(e.required??[]).every(r=>{const n=t[r],i=e.properties?.[r];return yk(i)&&"object"===i.type?Rk(i,n):"string"==typeof n?Boolean(n.trim()):null!=n}):0===(e.required?.length??0),Tk=e=>e.replace(/~/gu,"~0").replace(/\//gu,"~1"),Mk=new Map([["accountHolderName",0],["accountNumber",1],["institutionNumber",2],["transitNumber",3],["interacAccount",4],["address.firstLine",100],["address.city",101],["address.state",102],["address.postCode",103],["address.country",104]]),Pk=e=>Mk.get(e)??("address"===e||e.startsWith("address.")?200:50),Lk=e=>Object.keys(e.properties).map((e,t)=>({path:e,index:t})).sort((e,t)=>Pk(e.path)-Pk(t.path)||e.index-t.index).map(({path:e})=>e),Dk=e=>`/${jk(e).map(Tk).join("/")}`,Bk=e=>{const t=new Map(Object.entries(e.properties).map(([e,t])=>[Dk(e),t["x-errorMessages"]]));return(e,r,n)=>{const i=((e,t,r)=>"required"!==t||"string"!=typeof r.missingProperty?e:`${e}/${Tk(r.missingProperty)}`)(e.instancePath,e.keyword,e.params),o=t.get(i)?.[e.keyword];return o??eg(e,r,n)}},qk=/^([^-]+)-(.+)-([BP])$/u,Vk=e=>{const t=e.flatMap(e=>{const t=(e=>{const t=qk.exec(e.bavSupportedCode.trim()),r=e.currencyCode.trim().toUpperCase(),n=e.currencyName.trim(),i=t?.[1].trim().toUpperCase(),o=t?.[2].trim(),a=t?.[3];if(i&&o&&n&&i===r)return{schema:e,currencyCode:i,currencyName:n,accountType:"B"===a?"BUSINESS":"PERSONAL",paymentType:o}})(e);return t?[t]:[]}),r=new Map,n=e=>[e.currencyCode,e.accountType,e.paymentType].join("\0");for(const e of t){const t=n(e);r.set(t,(r.get(t)??0)+1)}return t.filter(e=>1===r.get(n(e)))},Fk=(e,t=({value:e})=>e)=>{const r=new Set;return e.filter(e=>{const n=t(e);return!r.has(n)&&(r.add(n),!0)})},Uk="__bankBillingAddress",Hk=["accountNumber","routingCode","bsbCode","interacAccount"],Wk=e=>"string"==typeof e?e.trim():"",Kk=(e,...t)=>{for(const r of t){const t=Wk(e[r]);if(t)return t}return""},Gk=({data:e,schema:t,addressSelection:r,id:n})=>{const i=n.trim();if(!i)throw new Error("The bank account request requires an id.");const o={...e},a="object"!=typeof(s=e.address)||null===s||Array.isArray(s)?void 0:{...e.address};var s;if(delete o[Uk],delete o.accountNumberReEntered,"existing"===r.kind){const e=r.id.trim();if(!e)throw new Error("Select a billing address.");o.address={id:e}}else a?o.address=a:delete o.address;return{...o,id:i,name:Kk(e,"accountHolderName","accountNickname"),tenderType:"BANK_ACCOUNT",bavSupportedCode:t.bavSupportedCode.trim(),productId:t.productId.trim(),countryCode:t.countryCode.trim().toUpperCase(),currencyCode:t.currencyCode.trim().toUpperCase()}},Yk=e=>e.replace(/\D/g,""),Jk=[3,2,4],Zk=e=>e.replace(/\D/g,"").slice(0,9),Qk=e=>Jk[e]??0,Xk=e=>({fromSourceId:e.fromSourceId.trim(),toSourceId:e.toSourceId.trim(),amount:e.amount.trim()}),ex=(e,t)=>{const r={},n=new Set(t.map(e=>e.id)),i=Number(e.amount);return e.fromSourceId?n.has(e.fromSourceId)||(r.fromSourceId="Select a verified bank or native account."):r.fromSourceId="Select a source account.",e.toSourceId?n.has(e.toSourceId)?e.toSourceId===e.fromSourceId&&(r.toSourceId="Select a different destination account."):r.toSourceId="Select a verified bank or native account.":r.toSourceId="Select a destination account.",e.amount?(!Number.isFinite(i)||i<=0)&&(r.amount="Enter an amount greater than zero."):r.amount="Enter an amount.",r},tx=(e,t)=>0===Object.keys(ex(Xk(e),t)).length,rx=e=>`${Number(e.amount).toFixed(2)} USD`,nx={alipay:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m114.26 257.95c-4.8 0.6-13.203 2.399-18.004 6.6-14.403 12.599-6.001 34.798 23.406 34.798 16.803 0 33.607-10.8 46.81-27.6-19.204-8.999-34.808-15.6-52.212-13.8v2e-3z" fill="#2BA6DF"/><path d="m221.83 273.4c27.006 9 33.007 9.6 33.007 9.6v-95.998c0-16.2-13.203-29.399-30.006-29.399h-126.03c-16.204 0-30.007 13.2-30.007 29.4v126c0 16.199 13.203 29.398 30.007 29.398h126.03c16.203 0 30.006-13.2 30.006-29.4v-1.199s-48.01-19.799-72.616-31.799c-16.203 19.799-37.208 32.399-59.413 32.399-37.208 0-49.811-32.399-31.807-53.398 3.6-4.801 10.202-9 20.404-11.4 15.604-3.6 40.81 2.4 64.215 10.199 4.2-7.799 7.801-16.199 10.202-25.199h-72.616v-7.2h37.208v-14.4h-45.61v-7.2h45.61v-18.598s0-3 3-3h18.005v22.2h45.01v6.6h-45.01v13.2h36.608c-3.6 14.399-9.002 27.598-15.604 38.999 12.003 4.199 22.205 7.8 29.407 10.198z" fill="#2BA6DF"/><path d="m340.49 201.22l39.608 85.797h-21.005l-10.802-22.8h-32.408l-10.802 22.8h-13.803l40.209-83.398s1.199-2.4 3.6-2.4h5.402v1e-3zm-21.006 55.198h25.206l-12.603-27-12.603 27zm87.448 31.281h-19.204v-81.598c0-2.4 1.2-3.6 4.2-3.6h15.004v85.198zm36.007-0.558h-19.203v-61.798c0-2.4 1.199-3.6 4.199-3.6h15.004v65.398zm23.483-64.116h12.604v6c2.4-1.8 4.801-3.6 7.801-4.2 3.002-1.2 6.002-1.8 10.203-1.8 4.199 0 7.801 0.6 10.803 2.4 3.6 1.8 6 3.6 8.4 6.6s4.201 6 5.402 9.6c1.199 3.6 1.799 7.2 1.799 11.399 0 5.399-0.6 10.2-2.398 14.4-1.801 4.199-3.602 8.399-6.602 11.399-3.002 3-6.002 5.999-10.203 7.8-4.201 1.799-8.402 2.399-13.203 2.399h-6.602c-1.799 0-3.6-0.601-5.4-1.2v21.6h-19.206v-78.597c-0.599-7.8 2.401-7.8 6.602-7.8zm12.603 46.798c0 1.801 0 3 0.6 4.2s1.201 2.399 2.4 3.601c1.199 1.199 2.4 1.799 3.602 2.399 1.199 0.601 3 0.601 4.801 0.601 1.799 0 3-0.601 4.801-1.801 1.199-1.199 3-2.4 3.602-4.8 0.6-2.399 1.799-4.2 2.398-7.2 0.602-2.999 1.201-5.399 1.201-8.999 0-4.201 0-7.8-0.6-10.8-0.602-3-1.201-5.4-2.4-7.8-1.201-1.8-2.4-3.6-3.6-4.8-1.201-1.2-3.002-1.8-4.803-1.8-1.199 0-2.4 0-3.6 0.6-1.201 0.6-2.4 1.2-3.002 1.8-1.199 0.6-1.799 1.8-3 2.4-1.201 1.2-1.801 1.8-2.4 3v29.4-1e-3zm81.028-46.798c4.801 0 8.402 0.6 12.002 1.2 3 0.6 6.002 1.8 8.402 3.6s3.6 3.6 4.801 5.4c1.199 2.4 1.801 4.8 1.801 7.2v47.398h-19.205v-4.8c-1.199 1.2-2.398 1.8-3 2.399l-3.602 1.801c-1.199 0.6-2.4 1.199-4.199 1.199-1.801 0.601-3.602 0.601-5.402 0.601-3 0-5.4-0.601-7.803-1.2-2.398-0.6-4.199-1.8-6-3.6-1.801-1.2-3.002-3-3.602-5.4-0.6-1.8-1.199-4.199-1.199-6.6s0.6-4.801 1.199-6.6c0.6-1.801 2.4-3.601 3.602-5.4 1.199-1.8 3.6-3 5.4-4.2 2.4-1.2 4.201-2.4 7.203-3.6 2.398-1.199 4.799-1.799 7.801-3 2.4-0.6 5.4-1.8 7.801-2.4l2.4-0.6v-6.6c0-1.8 0-3.6-0.6-5.4l-1.801-3.6c-0.6-0.6-1.799-1.8-2.398-1.8-1.201-0.6-2.4-0.6-3.602-0.6 0 0-10.203 0-19.205 7.8l-4.201-6.6c-1.798 1.201 9.004-6.598 23.407-6.598zm6.599 31.799c-1.799 0.6-3.6 1.801-5.398 3l-5.402 3.6c-1.801 1.201-3 2.4-3.6 4.2-1.201 1.2-1.201 3-1.201 4.2s0 2.4 0.6 3.601c0.6 1.199 0.6 1.8 1.199 3 0.602 1.199 1.201 1.199 1.801 1.8 0.6 0.6 1.201 0.6 2.4 0.6 1.801 0 3.002-0.6 4.801-1.2l5.402-3.6v-19.2h-0.602zm46.555 53.998h-12.604l-0.6-11.399s15.604 0.6 20.404-5.4c1.801-2.4 3-8.999 3-8.999l-31.205-59.998h21.004l19.805 38.999 17.404-39h13.803l-31.807 70.799c-1.2 2.4-6.001 14.999-19.204 14.998z" fill="#3F3A39"/><ellipse cx="433.4" cy="204.1" rx="9.602" ry="8.5" fill="#2BA6DF"/><path d="m683.68 172.91h-6.602v-1.2h14.402v1.2h-6.6v18.599h-1.801v-18.599h0.601zm10.716-1.201h2.4l4.201 11.4 1.801 4.2c0.6-1.2 1.199-3 1.799-4.2l4.201-11.4h2.4v20.4h-2.398v-18l-1.801 4.8-4.201 12h-1.198l-4.201-12-1.801-4.8v18h-1.801v-20.4h0.599z" fill="#3F3A39"/></svg>',amex:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m575.61 145.11l-15.092 35.039h30.266l-15.174-35.039zm-174.15 21.713c2.845-1.422 4.52-4.515 4.52-8.356 0-3.764-1.76-6.49-4.604-7.771-2.591-1.42-6.577-1.584-10.399-1.584h-27v19.523h26.638c4.266 1e-3 7.831-0.059 10.845-1.812zm-345.97-21.713l-14.921 35.039h29.932l-15.011-35.039zm694.7 224.47h-42.344v-18.852h42.173c4.181 0 7.109-0.525 8.872-2.178 1.667-1.473 2.609-3.555 2.592-5.732 0-2.562-1.062-4.596-2.68-5.813-1.588-1.342-3.907-1.953-7.726-1.953-20.588-0.67-46.273 0.609-46.273-27.211 0-12.75 8.451-26.172 31.461-26.172h43.677v-17.492h-40.58c-12.246 0-21.144 2.81-27.443 7.181v-7.181h-60.022c-9.597 0-20.863 2.279-26.191 7.181v-7.181h-107.19v7.181c-8.529-5.897-22.925-7.181-29.565-7.181h-70.702v7.181c-6.747-6.262-21.758-7.181-30.902-7.181h-79.127l-18.104 18.775-16.959-18.775h-118.2v122.68h115.97l18.655-19.076 17.575 19.076 71.484 0.06v-28.859h7.03c9.484 0.146 20.67-0.223 30.542-4.311v33.106h58.962v-31.976h2.844c3.628 0 3.988 0.146 3.988 3.621v28.348h179.12c11.372 0 23.26-2.786 29.841-7.853v7.853h56.817c11.822 0 23.369-1.588 32.154-5.653v-22.853c-5.324 7.462-15.707 11.245-29.751 11.245zm-363.58-28.967h-27.36v29.488h-42.618l-27-29.102-28.058 29.102h-86.854v-87.914h88.19l26.976 28.818 27.89-28.818h70.064c17.401 0 36.952 4.617 36.952 28.963 0 24.422-19.016 29.463-38.182 29.463zm131.56-3.986c3.097 4.291 3.544 8.297 3.634 16.047v17.428h-22.016v-10.998c0-5.289 0.533-13.121-3.544-17.209-3.2-3.148-8.086-3.9-16.088-3.9h-23.432v32.107h-22.031v-87.914h50.62c11.105 0 19.188 0.473 26.384 4.148 6.92 4.006 11.275 9.494 11.275 19.523-2e-3 14.031-9.769 21.189-15.541 23.389 4.878 1.725 8.866 4.818 10.739 7.379zm90.575-36.258h-51.346v15.982h50.091v17.938h-50.091v17.492l51.346 0.078v18.242h-73.182v-87.914h73.182v18.182zm56.344 69.731h-42.705v-18.852h42.535c4.16 0 7.109-0.527 8.957-2.178 1.507-1.359 2.591-3.336 2.591-5.73 0-2.564-1.174-4.598-2.676-5.818-1.678-1.34-3.993-1.947-7.809-1.947-20.506-0.674-46.186 0.605-46.186-27.213 0-12.752 8.363-26.174 31.35-26.174h43.96v18.709h-40.225c-3.987 0-6.579 0.146-8.783 1.592-2.405 1.424-3.295 3.535-3.295 6.322 0 3.316 2.04 5.574 4.797 6.549 2.314 0.771 4.797 0.996 8.533 0.996l11.805 0.309c11.899 0.273 20.073 2.25 25.04 7.068 4.266 4.232 6.559 9.578 6.559 18.625-2e-3 18.913-12.335 27.742-34.448 27.742zm-170.06-68.313c-2.649-1.508-6.559-1.588-10.461-1.588h-27.001v19.744h26.64c4.265 0 7.892-0.145 10.822-1.812 2.842-1.646 4.543-4.678 4.543-8.438s-1.701-6.482-4.543-7.906zm244.99-1.59c-3.988 0-6.641 0.145-8.873 1.588-2.314 1.426-3.202 3.537-3.202 6.326 0 3.314 1.953 5.572 4.794 6.549 2.315 0.771 4.796 0.996 8.448 0.996l11.887 0.303c11.99 0.285 19.998 2.262 24.879 7.08 0.889 0.668 1.423 1.42 2.034 2.174v-25.014h-39.965l-2e-3 -2e-3zm-352.65 0h-28.59v22.391h28.336c8.424 0 13.663-4.006 13.667-11.611-4e-3 -7.688-5.497-10.78-13.413-10.78zm-190.81 0v15.984h48.136v17.938h-48.136v17.49h53.909l25.047-25.791-23.983-25.621h-54.973zm140.77 61.479v-70.482l-33.664 34.674 33.664 35.808zm-138.93-141.15v15.148h183.19l-0.085-32.046h3.545c2.483 0.083 3.205 0.302 3.205 4.229v27.818h94.748v-7.461c7.642 3.924 19.527 7.461 35.168 7.461h39.86l8.531-19.522h18.913l8.342 19.522h76.811v-18.544l11.629 18.543h61.555v-122.58h-60.915v14.477l-8.53-14.477h-62.507v14.477l-7.833-14.477h-84.434c-14.135 0-26.555 1.89-36.591 7.158v-7.158h-58.268v7.158c-6.387-5.43-15.089-7.158-24.762-7.158h-212.87l-14.282 31.662-14.668-31.662h-67.047v14.477l-7.367-14.477h-57.18l-26.553 58.284v46.621l39.264-87.894h32.579l37.29 83.217v-83.217h35.789l28.695 59.625 26.362-59.625h36.507v87.894h-22.475l-0.082-68.837-31.796 68.837h-19.252l-31.877-68.898v68.898h-44.6l-8.425-19.605h-45.654l-8.512 19.605h-23.814v17.682h37.466l8.447-19.523h18.914l8.425 19.523h73.713v-14.927l6.579 14.989h38.266l6.58-15.214zm288.67-80.176c7.085-7.015 18.188-10.25 33.298-10.25h21.227v18.833h-20.782c-7.998 0-12.521 1.14-16.871 5.208-3.74 3.7-6.304 10.696-6.304 19.908 0 9.417 1.955 16.206 6.028 20.641 3.376 3.478 9.513 4.533 15.283 4.533h9.851l30.902-69.12h32.853l37.124 83.134v-83.133h33.386l38.543 61.213v-61.213h22.46v87.891h-31.072l-41.562-65.968v65.968h-44.656l-8.532-19.605h-45.55l-8.278 19.605h-25.66c-10.657 0-24.151-2.258-31.793-9.722-7.707-7.462-11.713-17.571-11.713-33.553-4e-3 -13.037 2.389-24.953 11.818-34.37zm-45.101-10.249h22.372v87.894h-22.372v-87.894zm-100.87 0h50.432c11.203 0 19.464 0.285 26.553 4.21 6.936 3.926 11.095 9.658 11.095 19.46 0 14.015-9.763 21.254-15.448 23.429 4.796 1.75 8.896 4.841 10.849 7.401 3.096 4.372 3.629 8.277 3.629 16.126v17.267h-22.115l-0.083-11.084c0-5.29 0.528-12.896-3.461-17.122-3.203-3.09-8.088-3.763-15.983-3.763h-23.538v31.97h-21.927l-3e-3 -87.894zm-88.393 0h73.249v18.303h-51.32v15.843h50.088v18.017h-50.088v17.553h51.32v18.177h-73.249v-87.893z" fill="#2557D6"/></svg>',diners:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m599.93 251.45c0-99.416-82.979-168.13-173.9-168.1h-78.241c-92.003-0.033-167.73 68.705-167.73 168.1 0 90.931 75.729 165.64 167.73 165.2h78.241c90.913 0.437 173.9-74.293 173.9-165.2z" fill="#0079BE"/><path d="m348.28 97.432c-84.069 0.026-152.19 68.308-152.22 152.58 0.021 84.258 68.145 152.53 152.22 152.56 84.088-0.025 152.23-68.301 152.24-152.56-0.011-84.274-68.15-152.55-152.24-152.58z" fill="#fff"/><path d="m252.07 249.6c0.08-41.18 25.747-76.296 61.94-90.25v180.48c-36.193-13.946-61.861-49.044-61.94-90.229zm131 90.275v-180.52c36.208 13.921 61.915 49.057 61.98 90.256-0.066 41.212-25.772 76.322-61.98 90.269z" fill="#0079BE"/></svg>',discover:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m409.41 197.26c30.938 0 56.02 23.58 56.02 52.709v0.033c0 29.129-25.082 52.742-56.02 52.742-30.941 0-56.022-23.613-56.022-52.742v-0.033c0-29.129 25.081-52.709 56.022-52.709z" fill="#F47216"/><path d="m321.43 197.94c8.836 0 16.247 1.785 25.27 6.09v22.753c-8.544-7.863-15.955-11.154-25.757-11.154-19.265 0-34.413 15.015-34.413 34.051 0 20.074 14.681 34.195 35.368 34.195 9.312 0 16.586-3.12 24.802-10.856v22.764c-9.343 4.142-16.912 5.775-25.757 5.775-31.277 0-55.581-22.597-55.581-51.736-2e-3 -28.83 24.949-51.882 56.068-51.882zm-97.113 0.626c11.546 0 22.109 3.721 30.942 10.994l-10.748 13.248c-5.351-5.646-10.411-8.027-16.563-8.027-8.854 0-15.301 4.744-15.301 10.988 0 5.354 3.618 8.188 15.944 12.481 23.364 8.043 30.289 15.176 30.289 30.926 0 19.193-14.976 32.554-36.319 32.554-15.631 0-26.993-5.795-36.457-18.871l13.268-12.03c4.73 8.608 12.622 13.223 22.42 13.223 9.163 0 15.947-5.95 15.947-13.983 0-4.164-2.056-7.733-6.158-10.258-2.066-1.195-6.158-2.978-14.199-5.646-19.292-6.538-25.91-13.527-25.91-27.186-1e-3 -16.227 14.213-28.413 32.845-28.413zm234.72 1.729h22.436l28.084 66.592 28.447-66.592h22.267l-45.493 101.69h-11.054l-44.687-101.69zm-301.21 0.152h20.541v99.143h-20.541v-99.143zm411.73 0h58.253v16.799h-37.726v22.006h36.336v16.791h-36.336v26.762h37.726v16.785h-58.253v-99.143zm115.59 57.377c15.471-2.965 23.983-12.926 23.983-28.105 0-18.562-13.575-29.271-37.266-29.271h-30.454v99.144h20.516v-39.83h2.681l28.43 39.828h25.26l-33.15-41.766zm-17.218-11.736h-6.002v-30.025h6.326c12.791 0 19.744 5.049 19.744 14.697 2e-3 9.967-6.951 15.328-20.068 15.328zm-576.09-45.641h-30.149v99.143h29.992c15.946 0 27.465-3.543 37.573-11.445 12.014-9.359 19.117-23.467 19.117-38.057 1e-3 -29.259-23.221-49.641-56.533-49.641zm23.997 74.479c-6.454 5.484-14.837 7.879-28.108 7.879h-5.514v-65.559h5.513c13.271 0 21.323 2.238 28.108 8.018 7.104 5.956 11.377 15.184 11.377 24.682 1e-3 9.513-4.273 19.024-11.376 24.98z"/></svg>',elo:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m166.5 184.95c6.8-2.3 14.1-3.5 21.7-3.5 33.2 0 60.9 23.6 67.2 54.9l47-9.6c-10.8-53.2-57.8-93.3-114.2-93.3-12.9 0-25.3 2.1-36.9 6l15.2 45.5z" fill="#FFF100"/><path d="m111 337.35l31.8-36c-14.2-12.6-23.1-30.9-23.1-51.4 0-20.4 8.9-38.8 23.1-51.3l-31.8-35.9c-24.1 21.4-39.3 52.5-39.3 87.3 0 34.7 15.2 65.899 39.3 87.3z" fill="#00A3DF"/><path d="m255.4 263.75c-6.4 31.3-34 54.8-67.2 54.8-7.6 0-14.9-1.2-21.8-3.5l-15.2 45.5c11.6 3.899 24.1 6 37 6 56.4 0 103.4-40 114.2-93.2l-47-9.6z" fill="#EE4023"/><path d="m459 295.95c-7.799 7.601-18.299 12.2-29.9 12-8-0.1-15.398-2.5-21.6-6.5l-15.6 24.801c10.699 6.699 23.199 10.699 36.801 10.899 19.699 0.3 37.698-7.5 50.8-20.2l-20.501-21zm-28.199-101.1c-39.201-0.6-71.6 30.8-72.201 70-0.2 14.7 4 28.5 11.5 39.9l128.8-55.101c-7.199-30.899-34.798-54.199-68.098-54.799m-42.701 75.599c-0.2-1.6-0.3-3.3-0.3-5 0.4-23.1 19.401-41.6 42.5-41.2 12.6 0.2 23.799 5.9 31.299 14.9l-73.499 31.3zm151.3-107.6v137.3l23.801 9.9-11.301 27.1-23.6-9.8c-5.299-2.3-8.9-5.8-11.6-9.8-2.6-4-4.6-9.601-4.6-17v-137.7h27.3zm85.901 63.5c4.201-1.4 8.6-2.1 13.301-2.1 20.299 0 37.1 14.4 41 33.5l28.699-5.9c-6.6-32.5-35.299-56.9-69.699-56.9-7.9 0-15.5 1.3-22.5 3.6l9.199 27.8zm-33.901 92.9l19.4-21.9c-8.699-7.7-14.1-18.9-14.1-31.4s5.5-23.7 14.1-31.3l-19.4-21.9c-14.699 13-24 32.1-24 53.3s9.301 40.2 24 53.2zm88.202-44.801c-3.9 19.101-20.801 33.5-41 33.5-4.6 0-9.1-0.8-13.301-2.199l-9.299 27.8c7.1 2.399 14.699 3.7 22.6 3.7 34.4 0 63.1-24.4 69.699-56.9l-28.699-5.901z"/></svg>',generic:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><rect width="780" height="500" fill="#000C9D"/><rect x="66.908" y="106.91" width="110.32" height="99.679" fill="#9D9400"/><path d="m94.714 284.15v-3.795h-5.117v-11.27h-4.198l-0.402 11.27h-11.443l10.58-25.07-3.967-1.725-11.673 27.141v3.449h16.445v9.66h4.658v-9.66h5.117zm19.586-30.589c-4.025 0-7.878 1.381-11.213 4.6l2.588 2.934c2.645-2.473 5.002-3.68 8.395-3.68 4.197 0 7.532 2.357 7.532 6.727 0 4.773-3.737 6.959-7.532 6.959h-2.358l-0.575 3.795h3.335c4.658 0 8.223 1.84 8.223 7.531 0 4.945-3.278 8.107-8.855 8.107-3.22 0-6.555-1.322-8.798-3.967l-3.22 2.645c2.99 3.68 7.705 5.232 12.133 5.232 8.165 0 13.742-5.174 13.742-12.018 0-6.152-4.37-9.371-9.027-9.717 4.197-0.807 7.762-4.43 7.762-9.199 0-5.406-4.715-9.949-12.132-9.949zm34.477 0c-5.347 0-8.912 1.896-12.075 5.693l3.335 2.529c2.53-2.934 4.658-4.197 8.568-4.197 4.427 0 7.072 2.76 7.072 7.188 0 6.496-3.22 10.809-18.17 25.127v3.908h23.518l0.575-4.08h-18.63c13.052-11.904 17.71-17.826 17.71-25.07 0-6.325-4.428-11.098-11.903-11.098zm48.738 36.339h-8.28v-35.648h-4.198l-11.73 7.244 2.07 3.393 9.085-5.463v30.476h-9.775v3.908h22.828v-3.91zm69.587-5.75v-3.795h-5.117v-11.27h-4.198l-0.402 11.27h-11.443l10.58-25.07-3.967-1.725-11.673 27.141v3.449h16.445v9.66h4.658v-9.66h5.117zm19.585-30.589c-4.025 0-7.877 1.381-11.212 4.6l2.587 2.934c2.645-2.473 5.003-3.68 8.395-3.68 4.198 0 7.533 2.357 7.533 6.727 0 4.773-3.738 6.959-7.533 6.959h-2.357l-0.575 3.795h3.335c4.657 0 8.222 1.84 8.222 7.531 0 4.945-3.277 8.107-8.855 8.107-3.22 0-6.555-1.322-8.797-3.967l-3.22 2.645c2.99 3.68 7.705 5.232 12.132 5.232 8.165 0 13.743-5.174 13.743-12.018 0-6.152-4.37-9.371-9.028-9.717 4.198-0.807 7.763-4.43 7.763-9.199 0-5.406-4.715-9.949-12.133-9.949zm34.478 0c-5.348 0-8.913 1.896-12.075 5.693l3.335 2.529c2.53-2.934 4.657-4.197 8.567-4.197 4.428 0 7.073 2.76 7.073 7.188 0 6.496-3.221 10.809-18.171 25.127v3.908h23.518l0.575-4.08h-18.63c13.053-11.904 17.71-17.826 17.71-25.07 0-6.325-4.427-11.098-11.902-11.098zm48.737 36.339h-8.28v-35.648h-4.196l-11.729 7.244 2.069 3.393 9.085-5.463v30.476h-9.774v3.908h22.827l-2e-3 -3.91zm69.588-5.75v-3.795h-5.119v-11.27h-4.197l-0.401 11.27h-11.443l10.58-25.07-3.969-1.725-11.672 27.141v3.449h16.445v9.66h4.656v-9.66h5.12zm19.584-30.589c-4.023 0-7.877 1.381-11.213 4.6l2.588 2.934c2.646-2.473 5.002-3.68 8.396-3.68 4.195 0 7.531 2.357 7.531 6.727 0 4.773-3.736 6.959-7.531 6.959h-2.358l-0.574 3.795h3.334c4.658 0 8.225 1.84 8.225 7.531 0 4.945-3.278 8.107-8.854 8.107-3.222 0-6.556-1.322-8.799-3.967l-3.22 2.645c2.988 3.68 7.703 5.232 12.134 5.232 8.163 0 13.741-5.174 13.741-12.018 0-6.152-4.371-9.371-9.026-9.717 4.196-0.807 7.762-4.43 7.762-9.199-3e-3 -5.406-4.718-9.949-12.136-9.949zm34.479 0c-5.348 0-8.912 1.896-12.076 5.693l3.337 2.529c2.528-2.934 4.657-4.197 8.565-4.197 4.428 0 7.072 2.76 7.072 7.188 0 6.496-3.219 10.809-18.17 25.127v3.908h23.518l0.576-4.08h-18.631c13.053-11.904 17.711-17.826 17.711-25.07 0-6.326-4.428-11.098-11.904-11.098h2e-3zm48.736 36.339h-8.279v-35.648h-4.197l-11.729 7.244 2.07 3.393 9.084-5.463v30.476h-9.775v3.908h22.828l-2e-3 -3.91zm69.588-5.75v-3.795h-5.117v-11.27h-4.197l-0.401 11.27h-11.443l10.58-25.07-3.967-1.725-11.672 27.141v3.449h16.445v9.66h4.655v-9.66h5.117zm19.584-30.589c-4.023 0-7.877 1.381-11.211 4.6l2.588 2.934c2.646-2.473 5.002-3.68 8.396-3.68 4.196 0 7.532 2.357 7.532 6.727 0 4.773-3.737 6.959-7.532 6.959h-2.357l-0.574 3.795h3.334c4.658 0 8.224 1.84 8.224 7.531 0 4.945-3.277 8.107-8.855 8.107-3.219 0-6.555-1.322-8.797-3.967l-3.221 2.645c2.99 3.68 7.705 5.232 12.133 5.232 8.166 0 13.742-5.174 13.742-12.018 0-6.152-4.369-9.371-9.027-9.717 4.197-0.807 7.764-4.43 7.764-9.199 0-5.406-4.715-9.949-12.133-9.949h-6e-3zm34.478 0c-5.347 0-8.912 1.896-12.074 5.693l3.334 2.529c2.531-2.934 4.658-4.197 8.567-4.197 4.429 0 7.072 2.76 7.072 7.188 0 6.496-3.221 10.809-18.17 25.127v3.908h23.519l0.575-4.08h-18.631c13.054-11.904 17.711-17.826 17.711-25.07 2e-3 -6.325-4.428-11.098-11.903-11.098zm48.739 36.339h-8.278v-35.648h-4.2l-11.729 7.244 2.068 3.393 9.086-5.463v30.476h-9.775v3.908h22.828v-3.91z" fill="#fff"/><path d="m72.219 389.2h6.445v-22.246l-7.012 1.406v-3.594l6.973-1.406h3.945v25.84h6.446v3.32h-16.797v-3.32zm25.468 0h6.446v-22.246l-7.012 1.406v-3.594l6.973-1.406h3.945v25.84h6.445v3.32h-16.797v-3.32zm40.918 0h13.77v3.32h-18.516v-3.32c1.497-1.549 3.535-3.625 6.114-6.229 2.591-2.617 4.218-4.305 4.882-5.061 1.263-1.42 2.142-2.617 2.637-3.594 0.508-0.988 0.762-1.959 0.762-2.91 0-1.549-0.547-2.811-1.64-3.789-1.081-0.977-2.495-1.465-4.24-1.465-1.237 0-2.545 0.215-3.925 0.646-1.367 0.43-2.831 1.08-4.394 1.953v-3.986c1.588-0.637 3.072-1.119 4.453-1.443 1.38-0.326 2.643-0.486 3.789-0.486 3.021 0 5.429 0.754 7.226 2.264 1.797 1.512 2.696 3.529 2.696 6.055 0 1.199-0.228 2.338-0.684 3.418-0.442 1.068-1.256 2.332-2.441 3.789-0.326 0.377-1.361 1.471-3.106 3.281-1.745 1.796-4.206 4.315-7.383 7.557zm34.024-12.402c1.888 0.404 3.359 1.244 4.414 2.521 1.067 1.275 1.601 2.852 1.601 4.727 0 2.877-0.99 5.104-2.968 6.682-1.979 1.574-4.792 2.361-8.438 2.361-1.224 0-2.487-0.125-3.789-0.371-1.289-0.234-2.623-0.594-4.004-1.074v-3.809c1.093 0.639 2.292 1.119 3.594 1.445 1.302 0.324 2.663 0.488 4.082 0.488 2.474 0 4.356-0.488 5.645-1.465 1.302-0.979 1.953-2.396 1.953-4.26 0-1.719-0.605-3.061-1.817-4.021-1.198-0.979-2.872-1.465-5.02-1.465h-3.398v-3.242h3.555c1.94 0 3.425-0.385 4.453-1.152 1.029-0.781 1.543-1.9 1.543-3.359 0-1.496-0.534-2.645-1.601-3.438-1.055-0.809-2.572-1.211-4.551-1.211-1.081 0-2.24 0.117-3.477 0.354-1.237 0.232-2.597 0.598-4.082 1.092v-3.514c1.498-0.418 2.897-0.73 4.2-0.939 1.314-0.207 2.551-0.311 3.71-0.311 2.995 0 5.365 0.682 7.11 2.049 1.745 1.354 2.617 3.189 2.617 5.508 0 1.615-0.462 2.98-1.387 4.102-0.925 1.105-2.24 1.872-3.945 2.302zm26.289-13.438h15.488v3.32h-11.874v7.148c0.573-0.195 1.146-0.34 1.719-0.43 0.573-0.105 1.146-0.156 1.719-0.156 3.255 0 5.833 0.893 7.734 2.676s2.852 4.199 2.852 7.246c0 3.139-0.977 5.578-2.93 7.324-1.954 1.732-4.708 2.598-8.262 2.598-1.224 0-2.474-0.104-3.75-0.312-1.263-0.207-2.571-0.521-3.926-0.938v-3.965c1.172 0.639 2.383 1.113 3.633 1.426s2.572 0.469 3.965 0.469c2.253 0 4.037-0.594 5.352-1.777s1.972-2.793 1.972-4.824-0.657-3.639-1.972-4.824-3.099-1.775-5.352-1.775c-1.055 0-2.109 0.117-3.164 0.352-1.041 0.234-2.109 0.6-3.203 1.092l-1e-3 -14.65zm33.867 15.313c-1.875 0-3.353 0.502-4.434 1.506-1.067 1.002-1.601 2.383-1.601 4.141s0.534 3.137 1.601 4.139c1.082 1.004 2.56 1.506 4.434 1.506 1.875 0 3.354-0.502 4.434-1.504 1.08-1.016 1.62-2.396 1.62-4.141 0-1.758-0.54-3.139-1.62-4.141-1.068-1.004-2.546-1.506-4.434-1.506zm-3.945-1.68c-1.693-0.416-3.015-1.203-3.965-2.363-0.938-1.158-1.406-2.57-1.406-4.236 0-2.332 0.827-4.174 2.48-5.527 1.667-1.354 3.945-2.029 6.836-2.029 2.904 0 5.183 0.676 6.836 2.027 1.653 1.355 2.48 3.197 2.48 5.529 0 1.666-0.475 3.078-1.425 4.236-0.938 1.16-2.247 1.947-3.926 2.363 1.9 0.443 3.378 1.311 4.434 2.598 1.067 1.289 1.601 2.865 1.601 4.729 0 2.824-0.866 4.992-2.598 6.504-1.719 1.51-4.186 2.266-7.402 2.266s-5.69-0.756-7.422-2.266c-1.719-1.512-2.578-3.68-2.578-6.504 0-1.863 0.534-3.439 1.602-4.729 1.067-1.289 2.551-2.154 4.453-2.598zm-1.446-6.228c0 1.51 0.469 2.688 1.407 3.533 0.95 0.848 2.278 1.271 3.984 1.271 1.693 0 3.015-0.424 3.965-1.271 0.963-0.848 1.445-2.023 1.445-3.535 0-1.51-0.481-2.688-1.445-3.535-0.951-0.846-2.272-1.271-3.965-1.271-1.706 0-3.034 0.426-3.984 1.271-0.938 0.847-1.407 2.025-1.407 3.537z" fill="#fff" fill-opacity=".784"/><path d="m325.45 388.23h6.444v-22.246l-7.012 1.406v-3.594l6.973-1.406h3.946v25.84h6.444v3.32h-16.797l2e-3 -3.32zm36.738-12.404c1.889 0.404 3.359 1.244 4.415 2.521 1.067 1.275 1.602 2.852 1.602 4.727 0 2.877-0.989 5.105-2.969 6.68-1.979 1.576-4.791 2.363-8.438 2.363-1.224 0-2.487-0.123-3.79-0.371-1.288-0.232-2.622-0.592-4.003-1.074v-3.809c1.094 0.639 2.292 1.121 3.595 1.445 1.303 0.326 2.662 0.488 4.082 0.488 2.474 0 4.354-0.488 5.645-1.465 1.302-0.977 1.953-2.396 1.953-4.258 0-1.719-0.605-3.061-1.816-4.023-1.197-0.977-2.871-1.465-5.02-1.465h-3.398v-3.242h3.556c1.939 0 3.425-0.385 4.453-1.152 1.028-0.781 1.543-1.9 1.543-3.359 0-1.496-0.533-2.643-1.603-3.438-1.055-0.807-2.571-1.209-4.55-1.209-1.081 0-2.24 0.115-3.479 0.35-1.236 0.234-2.598 0.6-4.081 1.096v-3.518c1.497-0.416 2.896-0.729 4.198-0.938 1.315-0.209 2.553-0.312 3.71-0.312 2.996 0 5.365 0.686 7.11 2.053 1.744 1.354 2.616 3.189 2.616 5.508 0 1.613-0.462 2.98-1.386 4.102-0.923 1.103-2.239 1.872-3.945 2.3zm16.915 12.404h13.771v3.32h-18.518v-3.32c1.498-1.551 3.536-3.627 6.114-6.23 2.59-2.617 4.218-4.305 4.883-5.059 1.264-1.42 2.143-2.617 2.637-3.594 0.508-0.99 0.762-1.961 0.762-2.91 0-1.549-0.547-2.812-1.64-3.789-1.081-0.977-2.494-1.465-4.239-1.465-1.236 0-2.545 0.215-3.926 0.645-1.367 0.43-2.831 1.08-4.396 1.953v-3.984c1.589-0.639 3.073-1.119 4.453-1.445s2.645-0.488 3.789-0.488c3.021 0 5.43 0.756 7.227 2.268 1.797 1.51 2.695 3.527 2.695 6.055 0 1.195-0.227 2.336-0.684 3.418-0.441 1.066-1.256 2.33-2.441 3.789-0.325 0.377-1.36 1.471-3.104 3.279-1.746 1.796-4.206 4.315-7.383 7.557zm22.753 0h6.447v-22.246l-7.014 1.406v-3.594l6.975-1.406h3.943v25.84h6.445v3.32h-16.798l2e-3 -3.32zm49.472-12.404c1.889 0.404 3.358 1.244 4.414 2.521 1.067 1.275 1.604 2.852 1.604 4.727 0 2.877-0.99 5.105-2.971 6.68-1.979 1.576-4.791 2.363-8.438 2.363-1.223 0-2.485-0.123-3.788-0.371-1.289-0.232-2.623-0.592-4.005-1.074v-3.809c1.095 0.639 2.293 1.121 3.595 1.445 1.303 0.326 2.664 0.488 4.082 0.488 2.475 0 4.354-0.488 5.645-1.465 1.303-0.977 1.953-2.396 1.953-4.258 0-1.719-0.605-3.061-1.814-4.023-1.198-0.977-2.873-1.465-5.021-1.465h-3.396v-3.242h3.554c1.94 0 3.424-0.385 4.453-1.152 1.028-0.781 1.543-1.9 1.543-3.359 0-1.496-0.533-2.643-1.603-3.438-1.055-0.807-2.569-1.209-4.551-1.209-1.08 0-2.238 0.115-3.477 0.35-1.236 0.234-2.599 0.6-4.082 1.096v-3.518c1.497-0.416 2.897-0.729 4.2-0.938 1.314-0.209 2.552-0.312 3.709-0.312 2.996 0 5.365 0.686 7.109 2.053 1.746 1.354 2.617 3.189 2.617 5.508 0 1.613-0.461 2.98-1.387 4.102-0.923 1.103-2.238 1.872-3.945 2.3zm24.356-10l-9.959 15.568h9.959v-15.568zm-1.036-3.435h4.961v19.004h4.159v3.281h-4.159v6.875h-3.925v-6.875h-13.166v-3.811l12.132-18.477h-2e-3v3e-3zm15.706 0h15.486v3.32h-11.875v7.146c0.574-0.195 1.146-0.338 1.721-0.43 0.572-0.104 1.146-0.156 1.718-0.156 3.256 0 5.834 0.893 7.735 2.676 1.9 1.785 2.851 4.199 2.851 7.246 0 3.139-0.978 5.58-2.931 7.324-1.953 1.73-4.707 2.598-8.262 2.598-1.223 0-2.473-0.104-3.75-0.311-1.262-0.209-2.57-0.521-3.926-0.939v-3.965c1.172 0.639 2.383 1.113 3.633 1.426 1.25 0.314 2.572 0.469 3.967 0.469 2.252 0 4.035-0.592 5.351-1.775 1.315-1.186 1.973-2.793 1.973-4.824s-0.656-3.641-1.973-4.824c-1.314-1.186-3.099-1.777-5.351-1.777-1.055 0-2.108 0.117-3.164 0.352-1.043 0.234-2.11 0.6-3.203 1.094v-14.65zm25.466 0h15.489v3.32h-11.877v7.146c0.572-0.195 1.146-0.338 1.72-0.43 0.571-0.104 1.146-0.156 1.719-0.156 3.256 0 5.832 0.893 7.733 2.676 1.9 1.785 2.853 4.199 2.853 7.246 0 3.139-0.978 5.58-2.93 7.324-1.953 1.73-4.707 2.598-8.263 2.598-1.225 0-2.475-0.104-3.75-0.311-1.264-0.209-2.571-0.521-3.926-0.939v-3.965c1.172 0.639 2.383 1.113 3.633 1.426 1.25 0.314 2.572 0.469 3.965 0.469 2.252 0 4.037-0.592 5.353-1.775 1.313-1.186 1.973-2.793 1.973-4.824s-0.658-3.641-1.973-4.824c-1.316-1.186-3.101-1.777-5.353-1.777-1.055 0-2.108 0.117-3.164 0.352-1.043 0.234-2.108 0.6-3.202 1.094v-14.65z" fill="#fff" fill-opacity=".784"/></svg>',hiper:'<?xml version="1.0" encoding="utf-8"?> \x3c!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --\x3e <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 780 500" style="enable-background:new 0 0 780 500;" xml:space="preserve"> <style type="text/css"> .st0{fill:#F37421;} .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#FFE700;} .st2{fill-rule:evenodd;clip-rule:evenodd;fill:#F37421;} </style> <g> <polygon class="st0" points="99,138.9 99,313.9 138.7,313.9 138.7,240.7 203.9,240.7 203.9,313.9 243.4,313.9 243.4,138.9 203.9,138.9 203.9,206.2 138.7,206.2 138.7,138.9 99,138.9 "/> <path class="st0" d="M585.2,263c0.5-2.9,1.3-8.8,1.3-15.6c0-31.4-15.6-63.4-56.6-63.4c-44.1,0-64.1,35.6-64.1,67.8 c0,39.7,24.7,64.7,67.8,64.7c17.1,0,33-2.6,46-7.8l-5.2-26.7c-10.6,3.4-21.6,5.2-35.1,5.2c-18.4,0-34.5-7.8-35.8-24.1H585.2 L585.2,263z M503.1,236c1-10.6,7.8-25.7,24.4-25.7c18.2,0,22.3,16.1,22.3,25.7H503.1L503.1,236z"/> <path class="st0" d="M599.1,313.9h39.5v-64.4c0-3.1,0.3-6.2,0.8-8.8c2.6-12.2,12.5-20,27-20c4.4,0,7.8,0.5,10.6,1v-37.1 c-2.9-0.5-4.7-0.5-8.3-0.5c-12.2,0-27.8,7.8-34.3,26.2h-1l-1.3-23.4h-34c0.5,10.9,1,23.1,1,41.8V313.9L599.1,313.9z"/> <path class="st1" d="M283.5,131.9c11.2,0,20.3,9.1,20.3,20.3c0,11.2-9.1,20.3-20.3,20.3c-11.2,0-20.3-9.1-20.3-20.3 C263.2,141,272.3,131.9,283.5,131.9L283.5,131.9z"/> <path class="st2" d="M366.9,284.3h19.8c19.9,0,28.9-12.7,28.9-26c0-13.3-1-43.3-25.5-43.3c-28.2,0-23.7,37.3-23.5,56.8 C366.5,276,366.8,280.2,366.9,284.3L366.9,284.3z M263.2,186.8h40.6v71.6c0,13.3,7.4,26,23.7,26c0.1-32.2,0-65.4-1.1-97.6h33.9 c0.7,6.2,1.4,12.4,2,18.6c16-32,66.5-25,83.5,2.1c17.5,27.9,23.5,107.9-59.1,107.9h-19.2c0.2,16.2,0.2,32.5,0.2,48.8h-40.6 c0-15.6,0.1-32,0.2-48.8c-43.9-0.2-64.1-28-64.1-57V186.8L263.2,186.8z"/> </g> </svg>',hipercard:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M725,0H55C24.673,0,0,24.673,0,55v391c0,30.327,24.673,55,55,55h670c30.325,0,55-24.673,55-55V55 C780,24.673,755.325,0,725,0z" fill="none"/><path d="m223.05 201.42l2.104 7e-3 1.674-0.57 1.675-0.57 1.481-1.503 1.482-1.502 0.779-2.003 0.781-2.002 0.027-2.948 0.028-2.946-0.693-1.152-0.694-1.151-1.207-0.747-1.208-0.748h-5.214l-1.775 0.795-1.775 0.794-1.03 1.104-1.03 1.105-0.81 1.907-0.809 1.907-0.153 2.971-0.152 2.971 0.752 1.477 0.754 1.476 1.454 0.66 1.453 0.659 2.106 9e-3zm335.55 84.622h7.57v-4.633l0.871-5.746c0.481-3.16 1.272-8.166 1.761-11.121 0.487-2.957 1.095-6.701 1.35-8.324 0.256-1.621 0.932-5.131 1.503-7.801 0.573-2.671 1.286-5.557 1.587-6.416 0.301-0.858 0.549-1.759 0.552-2.001 5e-3 -0.242 0.649-1.8 1.435-3.462l1.429-3.023 1.886-2.505 1.886-2.504 2.062-1.551c1.134-0.854 2.959-1.985 4.055-2.516l1.992-0.965 4.334 0.03 4.335 0.031 1.707 0.547 1.706 0.548 0.288-0.178 0.287-0.178 0.016-1.106c8e-3 -0.609 0.378-2.873 0.824-5.033l0.812-3.926-0.912-0.357c-0.874-0.324-1.756-0.625-2.646-0.902l-1.733-0.547-3.121 9e-3 -3.121 7e-3 -2.544 0.896-2.544 0.894-1.91 1.152-1.909 1.152-2.483 2.601-2.483 2.6-1.334 2.018c-0.733 1.11-1.379 1.968-1.435 1.907-0.057-0.06 0.343-2.373 0.886-5.138 0.543-2.766 0.995-5.38 1.003-5.809l0.015-0.781h-12.831v0.222c0 0.121-0.319 2.345-0.711 4.941-0.391 2.597-1.177 7.608-1.744 11.137-0.682 4.221-1.373 8.44-2.072 12.658-0.608 3.646-1.247 7.288-1.915 10.923-0.481 2.574-1.336 7.102-1.9 10.057-0.564 2.957-1.49 7.717-2.058 10.578l-1.674 8.408-0.64 3.207h7.568zm-175.76 0h7.403l0.223-3.133c0.123-1.721 0.541-5.195 0.931-7.715 0.39-2.521 1.188-7.549 1.773-11.172 0.741-4.48 1.547-8.949 2.419-13.406 0.745-3.748 1.587-7.473 1.87-8.278 0.285-0.806 0.518-1.678 0.518-1.939 0-0.262 0.557-1.686 1.237-3.165s1.947-3.743 2.817-5.032l1.581-2.344 2.115-1.96 2.116-1.958 2.608-1.246 2.609-1.247 3.989 0.022 3.986 0.021 1.961 0.585c1.078 0.322 2.054 0.586 2.167 0.586 0.114 0 0.207-0.368 0.207-0.819 0-0.45 0.391-2.734 0.867-5.076 0.477-2.341 0.867-4.355 0.867-4.476s-1.131-0.564-2.514-0.984c-1.384-0.42-3.295-0.86-4.248-0.979l-1.734-0.214-2.254 0.399c-1.24 0.219-3.083 0.703-4.096 1.076-1.015 0.372-2.688 1.216-3.72 1.876-1.03 0.661-2.636 1.947-3.564 2.858-0.932 0.912-2.495 2.751-3.477 4.086-0.764 1.038-1.524 2.078-2.28 3.121l-0.496 0.693 0.301-1.386c0.166-0.764 0.628-3.261 1.026-5.549 0.397-2.289 0.809-4.436 0.908-4.768l0.186-0.608h-13.226v0.836c0 0.46-0.391 3.229-0.866 6.155-0.478 2.927-1.265 7.817-1.748 10.869-0.484 3.052-1.345 8.358-1.91 11.791-0.604 3.646-1.24 7.289-1.911 10.923-1.305 6.941-2.64 13.877-4.005 20.807-0.584 2.957-1.283 6.447-1.552 7.76-0.271 1.311-0.491 2.52-0.491 2.686v0.305h7.407v-1e-3zm-174.46 0h7.459l0.21-0.547c0.117-0.303 0.211-1.094 0.211-1.758 0-0.666 0.47-4.127 1.042-7.689 1.309-8.117 2.65-16.23 4.024-24.337 0.589-3.416 1.209-6.827 1.859-10.231 0.552-2.86 1.4-7.308 1.884-9.882 0.483-2.575 1.435-7.474 2.114-10.887s1.319-6.341 1.422-6.508l0.189-0.305-7.543 0.093-7.543 0.093-0.63 4.509c-0.344 2.48-1.1 7.396-1.678 10.923-0.577 3.529-1.451 8.914-1.942 11.964-0.594 3.648-1.228 7.29-1.9 10.925-0.555 2.955-1.405 7.48-1.89 10.055-0.484 2.576-1.353 7.102-1.931 10.059s-1.353 6.857-1.723 8.67c-0.371 1.812-0.768 3.645-0.884 4.074l-0.209 0.779h7.459zm-93.277 0h8.425l0.605-3.727c0.332-2.051 0.982-5.992 1.443-8.756l1.907-11.445c0.588-3.529 1.47-8.756 1.959-11.616 0.489-2.861 1.267-7.299 1.727-9.862 0.461-2.565 0.926-4.749 1.032-4.856l0.195-0.194h45.313l0.252 0.251 0.252 0.252-0.394 2.002c-0.215 1.102-0.854 4.499-1.419 7.551s-1.515 8.201-2.112 11.445c-0.627 3.412-1.265 6.822-1.914 10.23-0.458 2.383-1.384 7.377-2.058 11.096-0.673 3.719-1.223 6.957-1.221 7.197l4e-3 0.432h16.921l0.374-2.166c0.207-1.191 0.537-3.338 0.737-4.768 0.198-1.432 0.679-4.477 1.066-6.764s1.16-6.814 1.719-10.057c0.558-3.242 1.494-8.783 2.078-12.311 0.584-3.529 1.45-8.678 1.926-11.443 0.602-3.472 1.229-6.94 1.88-10.404 0.559-2.957 1.491-7.95 2.071-11.098 0.58-3.146 1.447-7.906 1.929-10.577 0.482-2.67 1.36-7.508 1.952-10.75s1.339-7.026 1.66-8.41l0.584-2.514h-17.133l-0.233 1.648c-0.127 0.905-0.541 3.442-0.919 5.635-0.379 2.194-1.065 6.094-1.527 8.669-0.462 2.576-1.306 7.491-1.876 10.925-0.559 3.363-1.097 6.729-1.614 10.099l-0.578 3.857-12.575 0.255-12.576 0.254-10.532-0.25c-5.793-0.137-10.565-0.278-10.605-0.31-0.039-0.034 0.158-1.381 0.438-2.995 0.369-2.081 0.762-4.157 1.179-6.229 0.532-2.656 1.049-5.315 1.55-7.977 0.485-2.574 1.033-5.773 1.22-7.108 0.186-1.335 0.577-3.559 0.868-4.943 0.291-1.382 0.843-4.295 1.227-6.472 0.383-2.177 0.792-4.206 0.909-4.508l0.21-0.55h-16.995l-0.543 3.035c-0.3 1.669-0.699 4.048-0.887 5.288-0.189 1.24-0.822 5.219-1.407 8.843s-1.449 9.008-1.92 11.964l-1.903 11.964c-0.669 4.167-1.375 8.329-2.116 12.484-0.617 3.413-1.246 6.823-1.887 10.231-0.451 2.384-1.31 6.909-1.91 10.058-0.629 3.297-1.278 6.592-1.945 9.883-0.47 2.289-0.989 4.941-1.153 5.895-0.166 0.953-0.702 3.705-1.194 6.113-0.491 2.408-0.893 4.631-0.893 4.941v0.562h8.427v1e-3zm504.47 1.687l3.294 0.043 3.122-0.508c1.717-0.277 3.901-0.727 4.855-0.996 0.953-0.271 2.671-0.971 3.813-1.557l2.082-1.066 1.79-1.576 1.789-1.576 1.886-2.512c1.037-1.385 1.976-2.748 2.086-3.035l0.201-0.521-0.175 1.734c-0.124 1.16-0.284 2.318-0.48 3.469-0.168 0.953-0.406 2.787-0.532 4.074l-0.23 2.34h13.606v-4.68l1.036-8.844c0.569-4.865 1.413-11.34 1.873-14.393s1.171-7.42 1.579-9.709c0.407-2.289 1.131-6.425 1.604-9.19 0.476-2.765 1.334-7.604 1.908-10.75 0.573-3.148 1.492-8.141 2.041-11.097 0.548-2.957 1.401-7.561 1.895-10.231s1.377-7.352 1.964-10.403c0.615-3.183 1.25-6.363 1.906-9.538 0.462-2.192 0.839-4.105 0.838-4.247v-0.261h-14.844l-0.219 2.168c-0.12 1.192-0.689 5.132-1.262 8.757-0.681 4.279-1.374 8.555-2.08 12.83-0.411 2.466-0.817 4.932-1.22 7.399l-0.186 1.156-0.585-0.249c-0.322-0.137-2.069-0.622-3.88-1.077l-3.294-0.827-4.509-0.351-4.509-0.351-3.814 0.355-3.814 0.356-3.468 0.877-3.468 0.876-3.294 1.607-3.297 1.607-2.427 1.796-2.427 1.797-2.097 2.249c-1.153 1.236-2.818 3.281-3.702 4.544l-1.604 2.296-1.886 3.922c-1.036 2.158-2.298 5.015-2.803 6.35-0.506 1.336-1.396 4.295-1.981 6.577l-1.061 4.15-0.523 5.388-0.522 5.387 0.392 4.334 0.395 4.336 0.463 1.561c0.257 0.857 0.794 2.387 1.196 3.396l0.732 1.84 1.335 1.807 1.336 1.807 1.524 1.248 1.523 1.25 2.081 1.033c1.146 0.566 3.064 1.303 4.266 1.631 1.201 0.33 3.152 0.725 4.336 0.879 1.185 0.153 3.634 0.298 5.446 0.319zm5.913-9.836l-2.619 0.137-1.766-0.318c-0.972-0.174-2.527-0.645-3.457-1.043l-1.689-0.723-1.422-1.166-1.421-1.164-2.112-4.045-0.482-2.254-0.48-2.256 0.041-4.508 0.04-4.508 0.56-3.988 0.559-3.988 0.869-2.774c0.479-1.526 0.872-2.966 0.874-3.2 4e-3 -0.233 0.474-1.481 1.049-2.773 0.672-1.495 1.382-2.973 2.13-4.431 0.599-1.145 1.717-2.928 2.483-3.964 0.769-1.036 2.138-2.597 3.042-3.469 0.904-0.87 2.341-2.014 3.196-2.539l1.552-0.955 2.727-0.944 2.727-0.944 5.722-3e-3h5.722l3.294 0.915c1.813 0.502 3.737 1.085 4.276 1.295l0.981 0.381-0.191 0.952c-0.104 0.524-0.518 2.825-0.916 5.113-0.398 2.289-1.184 6.659-1.745 9.711s-1.423 7.656-1.916 10.23c-0.492 2.574-1.205 5.852-1.585 7.281-0.39 1.471-0.786 2.938-1.189 4.404-0.275 0.99-0.93 2.709-1.454 3.814-0.525 1.107-1.444 2.715-2.042 3.572-0.599 0.859-1.608 2.049-2.246 2.643-0.639 0.596-2.02 1.652-3.068 2.35l-1.907 1.268-5.514 1.75-2.623 0.141zm-123.13 9.713l4.681-0.135 2.948-0.754 2.948-0.756 1.908-0.9c1.049-0.494 2.765-1.475 3.813-2.176 1.05-0.699 2.675-2.031 3.609-2.959s2.322-2.51 3.082-3.516c0.76-1.008 1.428-1.785 1.483-1.729 0.058 0.057-0.118 1.658-0.389 3.562-0.269 1.906-0.493 4.439-0.497 5.631l-6e-3 2.166h12.729l0.194-4.939 0.194-4.943 0.908-6.416c0.5-3.529 1.307-8.756 1.794-11.617 0.485-2.859 1.331-7.697 1.879-10.75 0.547-3.052 1.414-7.811 1.925-10.577l0.932-5.028 0.032-4.343 0.03-4.344-0.981-2.007-0.982-2.008-1.331-1.278-1.333-1.279-2.185-1.107-2.188-1.109-6.518-1.45-4.486-0.341-4.487-0.341-5.778 0.358c-3.181 0.196-7.652 0.584-9.941 0.863l-4.162 0.504-5.672 0.022-0.413 1.995c-0.227 1.096-0.858 3.701-1.401 5.79-0.545 2.088-0.938 3.846-0.877 3.908s1.578-0.283 3.37-0.765c1.792-0.483 5.601-1.275 8.462-1.763l5.201-0.886 4.682-0.192 4.682-0.194 6.032 1.058 2.012 0.993 2.013 0.994 1.127 1.68 1.128 1.679-0.016 2.648-0.017 2.649-0.598 2.906-0.598 2.907-12.479 0.045-12.478 0.044-4.083 1.12c-2.246 0.616-4.733 1.434-5.527 1.817-0.794 0.384-1.588 0.698-1.765 0.698-0.176 0-1.512 0.74-2.969 1.647l-2.648 1.645-2.085 2.082c-1.148 1.145-2.613 2.862-3.257 3.815-0.645 0.953-1.691 2.945-2.325 4.428l-1.154 2.693-0.529 3.027-0.53 3.029v6.355l0.505 2.645 0.507 2.645 0.938 1.727c0.517 0.947 1.466 2.338 2.106 3.088l1.168 1.365 2.073 1.26 2.074 1.26 2.375 0.67c1.306 0.369 3.293 0.818 4.417 0.996l2.042 0.322 4.682-0.135zm4.335-9.697l-2.774 0.145-1.838-0.469c-1.01-0.256-2.544-0.83-3.407-1.273l-1.569-0.809-0.858-1.018c-0.471-0.562-1.19-1.662-1.6-2.447l-0.743-1.428-0.145-3.332-0.147-3.334 0.588-2.023c0.323-1.111 1.082-3.043 1.687-4.289l1.098-2.266 2.104-2.088 2.102-2.088 2.232-1.075 2.231-1.074 2.774-0.66 2.774-0.659h17.34l0.549 0.227 0.548 0.226-0.461 2.722c-0.254 1.496-0.859 4.203-1.347 6.016-0.485 1.812-1.344 4.475-1.906 5.918-0.563 1.445-1.024 2.721-1.024 2.836 0 0.117-0.57 1.168-1.267 2.338l-1.267 2.127-2.079 2.061c-1.143 1.133-2.206 2.059-2.359 2.059s-0.854 0.393-1.558 0.869l-1.277 0.865-2.813 0.891-2.812 0.889-2.776 0.143zm-61.379 9.826l3.817 0.041 4.332-0.514c2.383-0.281 5.555-0.75 7.05-1.041 1.806-0.363 3.599-0.789 5.375-1.275 1.462-0.414 2.785-0.861 2.939-0.992 0.155-0.133 0.567-1.707 0.918-3.498s0.792-4.193 0.981-5.336c0.188-1.145 0.286-2.143 0.217-2.217-0.07-0.076-0.325 0.021-0.568 0.213-0.243 0.195-1.944 0.91-3.781 1.592l-3.339 1.24-4.756 0.922-4.756 0.92-4.042-0.137-4.043-0.139-2.297-0.797-2.297-0.797-1.774-1.551-1.773-1.553-1.178-2.145-1.177-2.143-0.562-2.869-0.561-2.867 5e-3 -3.721 3e-3 -3.721 0.681-4.508 0.682-4.509 0.721-2.428c0.396-1.335 0.846-2.895 0.997-3.467 0.152-0.573 0.787-2.211 1.413-3.642 0.625-1.43 1.741-3.641 2.479-4.913l1.342-2.311 1.649-1.709 1.648-1.709 1.745-1.082 1.747-1.083 2.242-0.691c1.233-0.38 3.413-0.873 4.843-1.095l2.602-0.406 3.813 0.192 3.815 0.191 4.508 0.903 4.509 0.901 1.833 0.684c1.008 0.376 1.877 0.685 1.932 0.685 0.054 0 0.296-1.288 0.537-2.862 0.242-1.573 0.672-4.162 0.956-5.752 0.285-1.592 0.449-2.962 0.364-3.045-0.083-0.084-1.438-0.299-3.01-0.478-1.573-0.179-5.848-0.497-9.498-0.708l-6.639-0.381-4.683 0.359-4.681 0.36-3.469 0.728-3.468 0.729-2.233 0.893c-1.229 0.491-3.027 1.378-3.998 1.97-0.931 0.566-1.846 1.156-2.745 1.77-0.54 0.382-2.176 1.87-3.638 3.308l-2.655 2.614-1.484 2.172c-0.814 1.195-2.225 3.685-3.134 5.536l-1.652 3.364-1.267 3.64c-0.696 2.003-1.669 5.28-2.16 7.283l-0.895 3.641-0.325 3.295-0.324 3.295 3e-3 4.334 4e-3 4.334 0.327 2.523 0.327 2.521 1.039 2.594 1.038 2.594 1.201 1.875 1.198 1.875 1.907 1.879 1.909 1.877 2.017 1.068 2.02 1.064 2.65 0.738c1.457 0.404 3.564 0.869 4.682 1.031 1.117 0.164 3.748 0.316 5.848 0.34h-3e-3zm-110.28-2e-3l3.815 0.043 3.813-0.348c2.1-0.191 5.532-0.59 7.629-0.887 2.1-0.295 5.724-0.957 8.056-1.469l4.239-0.932 0.212-1.564c0.115-0.859 0.592-3.418 1.058-5.686l0.847-4.125-0.188-0.186-0.187-0.186-1.296 0.625c-0.713 0.344-2.934 1.166-4.934 1.824l-3.638 1.197-3.818 0.742-3.818 0.738-6.068 0.014-6.069 0.01-2.081-0.664c-1.144-0.365-2.827-1.033-3.74-1.486l-1.659-0.82-2.739-2.477-1.069-1.867-1.069-1.869-0.67-2.342-0.67-2.344-4e-3 -4.336-5e-3 -4.336 0.594-3.867 0.597-3.869 10.436-0.488 19.291 0.125 19.29 0.123 0.582-2.47c0.321-1.359 0.811-4.168 1.089-6.242l0.506-3.772 0.011-3.172 0.012-3.173-0.549-2.369-0.551-2.368-0.908-1.568c-0.498-0.862-1.38-2.112-1.955-2.778-0.576-0.665-1.605-1.603-2.286-2.084-0.683-0.481-2.02-1.29-2.974-1.797l-1.733-0.922-3.029-0.73-3.03-0.729-3.731-0.357-3.734-0.357-3.467 0.226-3.468 0.225-4.162 0.799-4.161 0.8-2.602 1.039c-1.431 0.571-3.615 1.615-4.854 2.318-1.24 0.703-2.956 1.847-3.813 2.542-0.86 0.696-2.347 2.048-3.304 3.005-0.958 0.958-2.376 2.676-3.148 3.821-0.774 1.145-1.96 3.173-2.638 4.508-0.676 1.336-1.557 3.208-1.958 4.162-0.399 0.953-1.129 2.904-1.617 4.334-0.49 1.431-1.26 4.162-1.709 6.07-0.53 2.311-0.988 4.637-1.373 6.976l-0.554 3.51 6e-3 5.16 6e-3 5.16 0.526 2.254c0.289 1.24 0.845 3.113 1.231 4.162s1.104 2.609 1.593 3.469c0.488 0.857 1.532 2.238 2.318 3.07 0.785 0.83 2.21 2.092 3.164 2.801 0.952 0.709 2.65 1.709 3.771 2.219l2.039 0.928 2.843 0.688c1.563 0.379 3.923 0.826 5.244 0.996 1.318 0.17 4.115 0.33 6.212 0.353zm6.531-48.853c-9.6 0-17.455-0.068-17.455-0.153 0-0.083 0.41-1.293 0.911-2.688 0.5-1.394 1.38-3.468 1.953-4.61l1.045-2.077 2.293-2.281 2.294-2.283 2.255-1.077c1.239-0.593 2.878-1.239 3.641-1.435 0.764-0.196 2.947-0.456 4.854-0.577l3.469-0.223 2.664 0.343 2.662 0.342 1.936 0.886 1.936 0.886 1.062 1.145c0.583 0.629 1.278 1.556 1.546 2.059l0.483 0.916 0.32 2.032 0.321 2.032-0.367 3.381-0.366 3.382h-17.457zm-103.19 79.414l0.21-0.549c0.117-0.301 0.211-1.01 0.211-1.576 0-0.564 0.246-2.619 0.547-4.564 0.3-1.949 1.004-6.428 1.566-9.955 0.561-3.529 1.401-8.836 1.867-11.791 0.443-2.801 0.864-5.604 1.265-8.41 0.229-1.67 0.508-3.035 0.621-3.035 0.112 0 0.594 0.738 1.071 1.639l0.866 1.639 1.922 1.938 1.923 1.938 2.366 0.947 2.367 0.947 2.82 0.365 2.821 0.365 3.579-0.219 3.58-0.221 3.876-1.002 3.877-1.004 2.08-0.949c1.145-0.521 3.173-1.662 4.508-2.531l2.428-1.58 2.263-2.264c1.245-1.242 3.001-3.238 3.901-4.434 0.902-1.193 1.639-2.258 1.639-2.363 0-0.107 0.443-0.846 0.984-1.645 0.541-0.797 1.647-3.012 2.459-4.918 0.813-1.906 2.081-5.34 2.821-7.629l1.344-4.162 0.695-3.604c0.382-1.982 0.874-5.259 1.093-7.283l0.397-3.677-0.23-3.121-0.229-3.121-0.725-3.122-0.723-3.121-1.172-2.336-1.171-2.337-2.263-2.399-2.262-2.399-5.354-2.766-2.948-0.707-2.948-0.705-2.948-0.216-2.947-0.216-3.283 0.377-3.285 0.377-2.679 0.685-2.68 0.683-2.329 1.079c-1.28 0.591-3.144 1.598-4.14 2.236-0.997 0.638-2.026 1.371-2.286 1.63-0.259 0.259-0.882 0.74-1.382 1.066l-0.911 0.597 0.636-3.047c0.351-1.675 0.643-3.24 0.651-3.48l0.014-0.433h-12.716l-1.114 7.023c-0.614 3.863-1.582 9.831-2.152 13.265-1.257 7.574-2.529 15.145-3.816 22.714-0.567 3.336-1.504 8.643-2.083 11.791-0.579 3.146-1.426 7.75-1.884 10.23-0.457 2.479-1.319 7.16-1.913 10.402-0.701 3.816-1.409 7.631-2.124 11.445-0.677 3.586-1.369 7.168-2.074 10.75-0.568 2.859-1.116 5.553-1.221 5.98l-0.189 0.781h14.913zm21.749-39.92l-1.892-0.336-1.893-0.334-1.922-0.877-1.923-0.877-1.342-1.283-1.343-1.281-0.775-1.734c-0.427-0.953-0.974-2.574-1.217-3.602l-0.442-1.865 0.177-2.988 0.178-2.988 0.893-4.682c0.674-3.58 1.328-7.164 1.96-10.75 0.587-3.338 1.477-8.23 1.976-10.869l0.907-4.8 1.988-1.654c1.094-0.909 2.826-2.129 3.85-2.709l1.86-1.056 2.427-0.751 2.428-0.752 6.242-0.366 2.542 0.542 2.541 0.541 1.794 0.826 1.793 0.826 1.504 1.512 1.505 1.512 0.81 1.601c0.447 0.881 1.074 2.604 1.393 3.83l0.581 2.229-0.178 6.59-0.178 6.589-0.89 3.895c-0.49 2.143-1.422 5.42-2.072 7.281l-1.181 3.389-1.448 2.742c-0.796 1.51-2.023 3.547-2.727 4.529s-1.827 2.258-2.495 2.83c-0.809 0.688-1.637 1.352-2.484 1.992l-1.271 0.949-5.886 2.002-5.79 0.347z" fill="#B3131B"/></svg>',jcb:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m632.24 361.27c0 41.615-33.729 75.36-75.357 75.36h-409.13v-297.88c0-41.626 33.73-75.371 75.364-75.371h409.12l-1e-3 297.89z" fill="#fff"/><linearGradient id="c" x1="908.72" x2="909.72" y1="313.21" y2="313.21" gradientTransform="matrix(132.87 0 0 323.02 -1.2027e5 -1.0093e5)" gradientUnits="userSpaceOnUse"><stop stop-color="#007B40" offset="0"/><stop stop-color="#55B330" offset="1"/></linearGradient><path d="m498.86 256.54c11.686 0.254 23.438-0.516 35.077 0.4 11.787 2.199 14.628 20.043 4.156 25.887-7.145 3.85-15.633 1.434-23.379 2.113h-15.854v-28.4zm41.834-32.145c2.596 9.164-6.238 17.392-15.064 16.13h-26.77c0.188-8.642-0.367-18.022 0.272-26.209 10.724 0.302 21.547-0.616 32.209 0.48 4.581 1.151 8.415 4.917 9.353 9.599zm64.425-135.9c0.498 17.501 0.072 35.927 0.215 53.783-0.033 72.596 0.07 145.19-0.057 217.79-0.47 27.207-24.582 50.848-51.601 51.391-27.045 0.11-54.094 0.017-81.143 0.047v-109.75c29.471-0.152 58.957 0.309 88.416-0.23 13.666-0.858 28.635-9.875 29.271-24.914 1.609-15.104-12.631-25.551-26.151-27.201-5.197-0.135-5.045-1.515 0-2.117 12.895-2.787 23.021-16.133 19.227-29.499-3.233-14.058-18.771-19.499-31.695-19.472-26.352-0.179-52.709-0.025-79.062-0.077 0.17-20.489-0.355-41 0.283-61.474 2.088-26.716 26.807-48.748 53.446-48.27 26.287-4e-3 52.57-4e-3 78.851-5e-3z" fill="url(#c)"/><linearGradient id="b" x1="908.73" x2="909.73" y1="313.21" y2="313.21" gradientTransform="matrix(133.43 0 0 323.02 -1.2108e5 -1.0092e5)" gradientUnits="userSpaceOnUse"><stop stop-color="#1D2970" offset="0"/><stop stop-color="#006DBA" offset="1"/></linearGradient><path d="m174.74 139.54c0.673-27.164 24.888-50.611 51.872-51.008 26.945-0.083 53.894-0.012 80.839-0.036-0.074 90.885 0.146 181.78-0.111 272.66-1.038 26.834-24.989 49.834-51.679 50.309-26.996 0.098-53.995 0.014-80.992 0.041v-113.45c26.223 6.195 53.722 8.832 80.474 4.723 15.991-2.573 33.487-10.426 38.901-27.016 3.984-14.191 1.741-29.126 2.334-43.691v-33.825h-46.297c-0.208 22.371 0.426 44.781-0.335 67.125-1.248 13.734-14.849 22.46-27.802 21.994-16.064 0.17-47.897-11.642-47.897-11.642-0.08-41.914 0.466-94.405 0.693-136.18z" fill="url(#b)"/><linearGradient id="a" x1="908.72" x2="909.72" y1="313.21" y2="313.21" gradientTransform="matrix(132.96 0 0 323.03 -1.205e5 -1.0093e5)" gradientUnits="userSpaceOnUse"><stop stop-color="#6E2B2F" offset="0"/><stop stop-color="#E30138" offset="1"/></linearGradient><path d="m324.72 211.89c-2.437 0.517-0.49-8.301-1.113-11.646 0.166-21.15-0.347-42.323 0.283-63.458 2.082-26.829 26.991-48.916 53.738-48.288h78.768c-0.074 90.885 0.145 181.78-0.111 272.66-1.039 26.834-24.992 49.833-51.683 50.309-26.997 0.102-53.997 0.016-80.996 0.042v-124.3c18.439 15.129 43.5 17.484 66.472 17.525 17.318-6e-3 34.535-2.676 51.353-6.67v-22.772c-18.953 9.446-41.233 15.446-62.243 10.019-14.656-3.648-25.295-17.812-25.058-32.937-1.698-15.729 7.522-32.335 22.979-37.011 19.191-6.008 40.107-1.413 58.096 6.398 3.854 2.018 7.766 4.521 6.225-1.921v-17.899c-30.086-7.158-62.104-9.792-92.33-2.005-8.749 2.468-17.273 6.211-24.38 11.956z" fill="url(#a)"/></svg>',maestro:'<svg width="780" height="500" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M465.769 113.811H314.195V386.211H465.769V113.811Z" fill="#7673C0"/> <path d="M323.822 250.033C323.794 223.796 329.736 197.895 341.199 174.294C352.662 150.693 369.346 130.009 389.985 113.809C364.43 93.7255 333.74 81.2366 301.422 77.77C269.105 74.3033 236.464 79.9986 207.231 94.2052C177.997 108.412 153.35 130.556 136.107 158.108C118.863 185.66 109.719 217.507 109.719 250.009C109.719 282.512 118.863 314.359 136.107 341.911C153.35 369.462 177.997 391.607 207.231 405.814C236.464 420.02 269.105 425.715 301.422 422.249C333.74 418.782 364.43 406.293 389.985 386.21C369.352 370.015 352.673 349.339 341.21 325.746C329.747 302.154 323.801 276.263 323.822 250.033Z" fill="#EB001B"/> <path d="M670.228 250.034C670.22 282.531 661.072 314.37 643.827 341.914C626.583 369.459 601.939 391.597 572.71 405.8C543.482 420.002 510.847 425.697 478.536 422.233C446.224 418.769 415.538 406.286 389.984 386.21C410.609 370.001 427.284 349.32 438.75 325.726C450.216 302.132 456.173 276.243 456.173 250.01C456.173 223.778 450.216 197.888 438.75 174.295C427.284 150.701 410.609 130.019 389.984 113.81C415.538 93.7202 446.228 81.2253 478.547 77.7536C510.867 74.282 543.511 79.9737 572.748 94.1783C601.985 108.383 626.636 130.527 643.883 158.079C661.129 185.632 670.275 217.481 670.276 249.986L670.228 250.034Z" fill="#00A1DF"/> </svg>',mastercard:'<svg width="780" height="500" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M465.738 113.525H313.812V386.475H465.738V113.525Z" fill="#FF5A00"/> <path d="M323.926 250C323.926 194.545 349.996 145.326 390 113.525C360.559 90.3769 323.42 76.3867 282.91 76.3867C186.945 76.3867 109.297 154.035 109.297 250C109.297 345.965 186.945 423.614 282.91 423.614C323.42 423.614 360.559 409.623 390 386.475C349.94 355.123 323.926 305.455 323.926 250Z" fill="#EB001B"/> <path d="M670.711 250C670.711 345.965 593.062 423.614 497.098 423.614C456.588 423.614 419.449 409.623 390.008 386.475C430.518 354.618 456.082 305.455 456.082 250C456.082 194.545 430.012 145.326 390.008 113.525C419.393 90.3769 456.532 76.3867 497.041 76.3867C593.062 76.3867 670.711 154.541 670.711 250Z" fill="#F79E1B"/> </svg>',mir:'<?xml version="1.0" encoding="utf-8"?> \x3c!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --\x3e <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 780 500" style="enable-background:new 0 0 780 500;" xml:space="preserve"> <style type="text/css"> .st0{fill:#37A72E;} .st1{fill:url(#Combined-Shape_4_);} </style> <g id="Page-1"> <g id="Artboard" transform="translate(-91.000000, -154.000000)"> <g id="Group" transform="translate(91.000000, 154.000000)"> <path id="Combined-Shape" class="st0" d="M544.1,240.5v108h60v-64h68c28.6-0.2,52.9-18.5,62.1-44H544.1z"/> <linearGradient id="Combined-Shape_4_" gradientUnits="userSpaceOnUse" x1="362.4047" y1="275.4307" x2="363.4047" y2="275.4307" gradientTransform="matrix(201.7633 0 0 -79 -72583.8438 21950.0254)"> <stop offset="0" style="stop-color:#00A0E5"/> <stop offset="1" style="stop-color:#0077C3"/> </linearGradient> <path id="Combined-Shape_1_" class="st1" d="M536.1,151.5c3.5,44.1,45.3,79,96.3,79c0.2,0,104.3,0,104.3,0 c0.8-4,1.2-8.2,1.2-12.5c0-36.6-29.5-66.2-66-66.5L536.1,151.5z"/> <path id="Combined-Shape_2_" class="st0" d="M447.3,229.4l0-0.1L447.3,229.4c0.7-1.2,1.8-1.9,3.2-1.9c2,0,3.5,1.6,3.6,3.5l0,0 v116.5h60v-196h-60c-7.6,0.3-16.2,5.8-19.4,12.7L387,266.6c-0.1,0.4-0.3,0.8-0.5,1.2l0,0l0,0c-0.7,1-1.9,1.7-3.3,1.7 c-2.2,0-4-1.8-4-4v-114h-60v196h60v0c7.5-0.4,15.9-5.9,19.1-12.7l49-105.1C447.2,229.6,447.3,229.5,447.3,229.4L447.3,229.4z"/> <path id="Combined-Shape_3_" class="st0" d="M223.3,232.8l-35.1,114.7H145L110,232.7c-0.3-1.8-1.9-3.2-3.9-3.2 c-2.2,0-3.9,1.8-3.9,3.9c0,0,0,0,0,0l0,114h-60v-196h51.5H109c11,0,22.6,8.6,25.8,19.1l29.2,95.5c1.5,4.8,3.8,4.7,5.3,0 l29.2-95.5c3.2-10.6,14.8-19.1,25.8-19.1h15.3h51.5v196h-60v-114c0,0,0,0,0-0.1c0-2.2-1.8-3.9-3.9-3.9 C225.2,229.5,223.6,230.9,223.3,232.8L223.3,232.8z"/> </g> </g> </g> </svg>',paypal:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m168.38 169.35c-8.399-5.774-19.359-8.668-32.88-8.668h-52.346c-4.145 0-6.435 2.073-6.87 6.215l-21.264 133.48c-0.221 1.311 0.107 2.51 0.981 3.6 0.869 1.092 1.962 1.635 3.271 1.635h24.864c4.361 0 6.758-2.068 7.198-6.215l5.888-35.986c0.215-1.744 0.982-3.162 2.291-4.254 1.308-1.09 2.944-1.803 4.907-2.129 1.963-0.324 3.814-0.488 5.562-0.488 1.743 0 3.814 0.111 6.217 0.328 2.397 0.217 3.925 0.324 4.58 0.324 18.756 0 33.478-5.285 44.167-15.867 10.684-10.576 16.032-25.242 16.032-44.004 0-12.868-4.203-22.191-12.598-27.974zm-26.989 40.08c-1.094 7.635-3.926 12.649-8.506 15.049-4.581 2.403-11.124 3.599-19.629 3.599l-10.797 0.326 5.563-35.007c0.434-2.397 1.851-3.597 4.252-3.597h6.218c8.72 0 15.049 1.257 18.975 3.761 3.924 2.51 5.233 7.801 3.924 15.869z" fill="#003087"/><path d="m720.79 160.68h-24.207c-2.406 0-3.822 1.2-4.254 3.601l-21.266 136.1-0.328 0.654c0 1.096 0.436 2.127 1.311 3.109 0.867 0.98 1.963 1.471 3.27 1.471h21.596c4.137 0 6.428-2.068 6.871-6.215l21.264-133.81v-0.325c-1e-3 -3.055-1.423-4.581-4.257-4.581z" fill="#009CDE"/><path d="m428.31 213.36c0-1.088-0.438-2.126-1.305-3.105-0.875-0.981-1.857-1.475-2.945-1.475h-25.191c-2.404 0-4.367 1.096-5.891 3.271l-34.678 51.039-14.395-49.074c-1.096-3.487-3.492-5.236-7.197-5.236h-24.541c-1.093 0-2.074 0.492-2.941 1.475-0.875 0.979-1.309 2.019-1.309 3.105 0 0.439 2.127 6.871 6.379 19.303 4.252 12.436 8.832 25.85 13.74 40.246 4.908 14.393 7.469 22.031 7.688 22.896-17.886 24.432-26.825 37.518-26.825 39.26 0 2.838 1.415 4.254 4.253 4.254h25.191c2.398 0 4.36-1.088 5.89-3.27l83.427-120.4c0.433-0.432 0.65-1.192 0.65-2.29z" fill="#003087"/><path d="m662.89 208.78h-24.865c-3.057 0-4.904 3.6-5.559 10.799-5.678-8.722-16.031-13.089-31.084-13.089-15.703 0-29.064 5.89-40.076 17.668-11.016 11.778-16.521 25.632-16.521 41.552 0 12.871 3.762 23.121 11.285 30.752 7.525 7.639 17.611 11.451 30.266 11.451 6.324 0 12.758-1.311 19.301-3.926 6.543-2.617 11.664-6.105 15.379-10.469 0 0.219-0.223 1.197-0.654 2.941-0.441 1.748-0.656 3.061-0.656 3.926 0 3.494 1.414 5.234 4.254 5.234h22.576c4.139 0 6.541-2.068 7.193-6.215l13.416-85.39c0.215-1.31-0.111-2.507-0.982-3.599-0.877-1.088-1.965-1.635-3.273-1.635zm-42.694 64.454c-5.562 5.453-12.27 8.178-20.121 8.178-6.328 0-11.449-1.742-15.377-5.234-3.928-3.482-5.891-8.281-5.891-14.395 0-8.064 2.727-14.886 8.182-20.447 5.445-5.562 12.213-8.342 20.283-8.342 6.102 0 11.174 1.799 15.213 5.396 4.031 3.6 6.055 8.562 6.055 14.889-2e-3 7.851-2.783 14.505-8.344 19.955z" fill="#009CDE"/><path d="m291.23 208.78h-24.865c-3.058 0-4.908 3.6-5.563 10.799-5.889-8.722-16.25-13.089-31.081-13.089-15.704 0-29.065 5.89-40.078 17.668-11.016 11.778-16.521 25.632-16.521 41.552 0 12.871 3.763 23.121 11.288 30.752 7.525 7.639 17.61 11.451 30.262 11.451 6.104 0 12.433-1.311 18.975-3.926 6.543-2.617 11.778-6.105 15.704-10.469-0.875 2.615-1.309 4.906-1.309 6.867 0 3.494 1.417 5.234 4.253 5.234h22.574c4.141 0 6.543-2.068 7.198-6.215l13.413-85.39c0.215-1.31-0.111-2.507-0.981-3.599-0.873-1.088-1.962-1.635-3.269-1.635zm-42.695 64.616c-5.563 5.35-12.382 8.016-20.447 8.016-6.329 0-11.4-1.742-15.214-5.234-3.819-3.482-5.726-8.281-5.726-14.395 0-8.064 2.725-14.886 8.18-20.447 5.449-5.562 12.211-8.343 20.284-8.343 6.104 0 11.175 1.8 15.214 5.397 4.032 3.6 6.052 8.562 6.052 14.889-1e-3 8.07-2.781 14.779-8.343 20.117z" fill="#003087"/><path d="m540.04 169.35c-8.398-5.774-19.355-8.668-32.879-8.668h-52.02c-4.363 0-6.764 2.073-7.197 6.215l-21.266 133.48c-0.221 1.311 0.107 2.51 0.982 3.6 0.865 1.092 1.961 1.635 3.27 1.635h26.826c2.617 0 4.361-1.416 5.236-4.252l5.889-37.949c0.217-1.744 0.98-3.162 2.291-4.254 1.309-1.09 2.943-1.803 4.908-2.129 1.961-0.324 3.812-0.488 5.561-0.488 1.744 0 3.814 0.111 6.215 0.328 2.398 0.217 3.93 0.324 4.58 0.324 18.76 0 33.479-5.285 44.168-15.867 10.688-10.576 16.031-25.242 16.031-44.004 1e-3 -12.868-4.2-22.192-12.595-27.974zm-33.533 53.819c-4.799 3.271-11.998 4.906-21.592 4.906l-10.471 0.328 5.562-35.008c0.432-2.396 1.85-3.598 4.252-3.598h5.887c4.799 0 8.615 0.219 11.455 0.654 2.83 0.438 5.561 1.799 8.178 4.088 2.619 2.291 3.926 5.619 3.926 9.979 0 9.164-2.402 15.377-7.197 18.651z" fill="#009CDE"/></svg>',unionpay:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m216.4 69.791h142.39c19.87 0 32.287 16.406 27.63 36.47l-66.333 287.48c-4.656 20.063-24.629 36.47-44.498 36.47h-142.39c-19.87 0-32.287-16.406-27.63-36.47l66.331-287.48c4.657-20.168 24.526-36.47 44.395-36.47h0.104z" fill="#D10429"/><path d="m346.34 69.791h163.82c19.867 0 10.865 16.406 6.209 36.47l-66.334 287.48c-4.658 20.063-3.209 36.47-23.078 36.47h-163.81c-19.972 0-32.287-16.406-27.527-36.47l66.334-287.48c4.656-20.168 24.524-36.47 44.498-36.47h-0.104z" fill="#022E64"/><path d="m504.41 69.791h142.39c19.869 0 32.287 16.406 27.631 36.47l-66.334 287.48c-4.656 20.063-24.629 36.47-44.498 36.47h-142.39c-19.973 0-32.288-16.406-27.631-36.47l66.334-287.48c4.656-20.168 24.525-36.47 44.393-36.47h0.105z" fill="#076F74"/><path d="m480.5 340.81h13.453l3.828-13.063h-13.35l-3.931 13.063zm10.762-35.95l-4.658 15.467s5.072-2.613 7.865-3.449c2.795-0.627 6.934-1.15 6.934-1.15l3.207-10.763h-13.451l0.103-0.105zm6.726-22.153l-4.449 14.839s4.967-2.3 7.76-3.029c2.795-0.732 6.934-0.941 6.934-0.941l3.207-10.764h-13.348l-0.104-0.105zm29.7 0l-17.385 57.997h4.656l-3.621 12.018h-4.658l-1.137 3.657h-16.559l1.139-3.657h-33.529l3.311-11.076h3.416l17.594-58.938 3.518-11.913h16.867l-1.76 5.956s4.449-3.239 8.797-4.39c4.244-1.148 28.666-1.566 28.666-1.566l-3.623 11.809h-5.795l0.103 0.103z" fill="#FEFEFE"/><path d="m534.59 270.79h18.006l0.207 6.792c-0.102 1.149 0.828 1.672 3.002 1.672h3.621l-3.311 11.183h-9.729c-8.381 0.627-11.59-3.03-11.383-7.106l-0.311-12.437-0.102-0.104zm2.217 53.2h-17.178l2.896-9.927h19.662l2.793-9.092h-19.35l3.311-11.182h53.812l-3.312 11.182h-18.109l-2.793 9.092h18.109l-3.002 9.927h-19.559l-3.518 4.18h7.969l1.965 12.54c0.207 1.254 0.207 2.09 0.621 2.613 0.414 0.418 2.795 0.627 4.139 0.627h2.381l-3.725 12.227h-6.107c-0.93 0-2.379-0.104-4.346-0.104-1.863-0.21-3.104-1.255-4.346-1.882-1.139-0.522-2.793-1.881-3.207-4.284l-1.863-12.54-8.9 12.331c-2.795 3.866-6.621 6.897-13.143 6.897h-12.417l3.311-10.869h4.762c1.346 0 2.588-0.521 3.52-1.045 0.93-0.418 1.758-0.836 2.586-2.193l13.038-18.498zm-187.9-27.2h45.429l-3.312 10.973h-18.11l-2.793 9.299h18.627l-3.415 11.287h-18.524l-4.553 15.152c-0.517 1.672 4.45 1.881 6.209 1.881l9.313-1.254-3.726 12.54h-20.904c-1.654 0-2.896-0.209-4.76-0.627-1.76-0.418-2.587-1.254-3.311-2.403-0.726-1.254-1.968-2.195-1.14-4.912l6.002-20.063h-10.347l3.415-11.495h10.348l2.794-9.3h-10.347l3.312-10.974-0.207-0.104zm31.387-19.835h18.626l-3.414 11.39h-25.458l-2.794 2.404c-1.242 1.15-1.552 0.732-3.105 1.568-1.447 0.73-4.449 2.193-8.382 2.193h-8.175l3.311-10.972h2.484c2.07 0 3.52-0.21 4.243-0.627 0.828-0.522 1.76-1.672 2.69-3.554l4.656-8.568h18.526l-3.208 6.27v-0.104zm35.106 18.81s5.07-4.701 13.764-6.164c1.967-0.418 14.385-0.211 14.385-0.211l1.863-6.27h-26.182l-3.83 12.75v-0.105zm24.629 4.807h-25.975l-1.551 5.329h22.559c2.691-0.313 3.209 0.104 3.416-0.104l1.654-5.225h-0.103zm-33.734-29.678h15.832l-2.275 8.047s4.967-4.075 8.484-5.539c3.52-1.254 11.383-2.508 11.383-2.508l25.664-0.104-8.795 29.469c-1.449 5.016-3.209 8.256-4.244 9.823-0.93 1.463-2.07 2.821-4.346 4.075-2.172 1.15-4.141 1.881-6.002 1.986-1.656 0.104-4.346 0.209-7.865 0.209h-24.732l-6.934 23.303c-0.619 2.299-0.93 3.447-0.516 4.074 0.309 0.523 1.24 1.15 2.379 1.15l10.865-1.045-3.725 12.749h-12.211c-3.932 0-6.727-0.104-8.693-0.21-1.862-0.208-3.83 0-5.174-1.044-1.138-1.045-2.896-2.403-2.794-3.763 0.104-1.254 0.621-3.344 1.45-6.27l22.249-74.402z" fill="#FEFEFE"/><path d="m452.43 317.79l-1.449 7.105c-0.619 2.194-1.137 3.867-2.793 5.33-1.76 1.463-3.725 3.03-8.484 3.03l-8.797 0.418-0.104 7.942c-0.104 2.193 0.518 1.984 0.828 2.402 0.414 0.418 0.723 0.523 1.137 0.732l2.795-0.21 8.383-0.417-3.52 11.704h-9.623c-6.727 0-11.797-0.21-13.35-1.463-1.656-1.046-1.863-2.3-1.863-4.599l0.621-31.141h15.42l-0.207 6.374h3.725c1.242 0 2.174-0.104 2.691-0.418 0.516-0.313 0.828-0.836 1.035-1.567l1.551-5.016h12.109l-0.105-0.206zm-219.37-156c-0.517 2.508-10.451 48.592-10.451 48.592-2.174 9.3-3.726 15.989-8.9 20.273-3.001 2.508-6.52 3.657-10.555 3.657-6.52 0-10.245-3.239-10.866-9.404l-0.104-2.09s1.966-12.436 1.966-12.54c0 0 10.349-42.009 12.212-47.548 0.103-0.313 0.103-0.522 0.103-0.627-20.18 0.21-23.801 0-24.008-0.313-0.104 0.418-0.621 3.03-0.621 3.03l-10.556 47.34-0.932 3.97-1.758 13.168c0 3.866 0.724 7.105 2.277 9.718 4.863 8.569 18.627 9.823 26.388 9.823 10.038 0 19.455-2.195 25.767-6.061 11.073-6.584 13.97-16.929 16.454-26.02l1.242-4.703s10.659-43.576 12.522-49.219c0.103-0.314 0.103-0.523 0.207-0.627-14.695 0.104-18.938 0-20.387-0.314v-0.105zm59.029 86.623c-7.141-0.105-9.728-0.105-18.11 0.313l-0.311-0.627c0.724-3.24 1.552-6.374 2.173-9.614l1.035-4.389c1.552-6.792 3.001-14.839 3.208-17.242 0.207-1.463 0.62-5.12-3.519-5.12-1.759 0-3.518 0.835-5.38 1.671-1.036 3.658-3.002 13.899-4.037 18.497-2.07 9.823-2.173 10.972-3.104 15.78l-0.621 0.626c-7.347-0.104-9.934-0.104-18.42 0.314l-0.414-0.732c1.449-5.852 2.794-11.704 4.14-17.556 3.518-15.78 4.45-21.84 5.38-29.887l0.725-0.418c8.279-1.149 10.245-1.463 19.248-3.239l0.724 0.836-1.345 5.016c1.552-0.94 3.001-1.881 4.553-2.613 4.243-2.09 8.9-2.717 11.487-2.717 3.932 0 8.279 1.15 10.038 5.748 1.656 4.075 0.62 9.091-1.656 19.019l-1.138 5.016c-2.277 11.077-2.69 13.062-3.933 20.586l-0.827 0.627 0.104 0.105zm29.058 0.027c-4.346 0-7.14-0.104-9.83 0-2.691 0-5.278 0.21-9.314 0.314l-0.207-0.314-0.207-0.418c1.138-4.18 1.656-5.643 2.277-7.106 0.517-1.463 1.034-2.926 2.07-7.21 1.241-5.539 2.069-9.405 2.586-12.854 0.621-3.24 0.932-6.06 1.346-9.3l0.31-0.209 0.31-0.313c4.347-0.627 7.038-1.045 9.832-1.463s5.691-0.94 10.141-1.776l0.207 0.418 0.103 0.418-2.482 10.345c-0.828 3.449-1.656 6.897-2.38 10.346-1.554 7.315-2.277 10.032-2.587 12.017-0.414 1.881-0.519 2.822-1.14 6.584l-0.414 0.313-0.414 0.314-0.207-0.106zm45.941-25.675c-0.31 1.881-1.966 8.883-4.139 11.809-1.553 2.194-3.312 3.553-5.382 3.553-0.62 0-4.14 0-4.242-5.33 0-2.612 0.517-5.33 1.138-8.255 1.863-8.465 4.14-15.466 9.831-15.466 4.451 0 4.76 5.225 2.794 13.689zm18.731 0.836c2.483-11.077 0.518-16.302-1.862-19.437-3.726-4.807-10.348-6.374-17.178-6.374-4.141 0-13.867 0.418-21.525 7.524-5.484 5.12-8.071 12.122-9.52 18.81-1.554 6.792-3.312 19.019 7.864 23.617 3.414 1.463 8.382 1.88 11.59 1.88 8.176 0 16.558-2.298 22.87-8.986 4.863-5.434 7.036-13.585 7.864-17.034h-0.103zm174.43 26.08c-8.693-0.104-11.176-0.104-19.145 0.314l-0.518-0.627c2.174-8.256 4.346-16.616 6.312-24.976 2.484-10.868 3.105-15.466 3.934-21.84l0.619-0.522c8.59-1.254 10.971-1.567 19.973-3.239l0.207 0.731c-1.656 6.897-3.207 13.69-4.863 20.482-3.311 14.317-4.451 21.632-5.691 29.156l-0.828 0.627v-0.106z" fill="#FEFEFE"/><path d="m547.75 224.16c-0.414 1.776-2.07 8.882-4.242 11.808-1.449 2.09-4.967 3.449-6.934 3.449-0.621 0-4.035 0-4.242-5.225 0-2.613 0.516-5.33 1.137-8.256 1.863-8.255 4.141-15.257 9.832-15.257 4.449 0 6.416 5.12 4.449 13.585v-0.104zm17.076 0.836c2.482-11.077-7.658-0.94-9.211-4.598-2.484-5.748-0.932-17.243-10.865-21.109-3.83-1.568-12.832 0.418-20.49 7.524-5.381 5.016-8.072 12.017-9.52 18.705-1.555 6.688-3.312 19.02 7.76 23.304 3.52 1.567 6.727 1.985 9.934 1.776 11.178-0.627 19.662-17.661 25.977-24.349 4.86-5.329 5.689 1.986 6.415-1.253zm-129.94 23.413c-7.141-0.105-9.625-0.105-18.006 0.313l-0.311-0.627c0.725-3.24 1.553-6.374 2.275-9.614l0.932-4.389c1.553-6.792 3.105-14.839 3.207-17.242 0.207-1.463 0.621-5.12-3.414-5.12-1.76 0-3.621 0.835-5.381 1.671-0.932 3.658-3.002 13.899-4.037 18.497-1.965 9.823-2.172 10.972-3.104 15.78l-0.621 0.626c-7.346-0.104-9.934-0.104-18.419 0.314l-0.414-0.732c1.449-5.852 2.794-11.704 4.14-17.556 3.518-15.78 4.346-21.84 5.379-29.887l0.621-0.418c8.281-1.149 10.35-1.463 19.248-3.239l0.727 0.836-1.242 5.016c1.449-0.94 3-1.881 4.449-2.613 4.244-2.09 8.9-2.717 11.486-2.717 3.934 0 8.176 1.15 10.037 5.748 1.656 4.075 0.52 9.091-1.758 19.019l-1.139 5.016c-2.379 11.077-2.689 13.062-3.934 20.586l-0.826 0.627 0.105 0.105zm62-86.519l-6.002 0.105c-15.523 0.209-21.732 0.104-24.215-0.209-0.207 1.15-0.621 3.135-0.621 3.135s-5.588 25.916-5.588 26.02c0 0-13.246 55.176-13.867 57.788 13.557-0.209 19.041-0.209 21.422 0.105 0.518-2.613 3.621-17.974 3.725-17.974 0 0 2.691-11.286 2.795-11.704 0 0 0.826-1.15 1.654-1.672h1.242c11.695 0 24.836 0 35.186-7.628 7.037-5.225 11.797-13.063 13.971-22.468 0.516-2.299 0.93-5.016 0.93-7.837 0-3.658-0.723-7.21-2.793-10.032-5.279-7.42-15.732-7.524-27.839-7.629zm7.762 27.066c-1.242 5.747-4.967 10.659-9.727 12.958-3.934 1.985-8.693 2.194-13.66 2.194h-3.209l0.207-1.254s5.9-25.916 5.9-25.811l0.205-1.359 0.104-1.045 2.381 0.21s12.211 1.044 12.418 1.044c4.759 1.881 6.83 6.688 5.381 13.063zm127.21 8.666l-0.725-0.836c-8.795 1.776-10.451 2.09-18.523 3.24l-0.621 0.626c0 0.105-0.104 0.21-0.104 0.418v-0.104c-6.002 14.107-5.898 11.077-10.762 22.154 0-0.523 0-0.836-0.104-1.359l-1.242-24.035-0.725-0.836c-9.314 1.777-9.52 2.09-18.006 3.24l-0.621 0.627c-0.104 0.313-0.104 0.627-0.104 0.94l0.104 0.105c1.035 5.538 0.828 4.284 1.863 12.958 0.518 4.284 1.139 8.569 1.654 12.749 0.828 7.106 1.348 10.554 2.381 21.318-5.795 9.613-7.141 13.271-12.729 21.734l0.311 0.836c8.383-0.312 10.244-0.312 16.453-0.312l1.348-1.568c4.654-10.135 40.254-71.79 40.254-71.79l-0.102-0.105zm-302.72 6.922c4.76-3.344 5.38-7.942 1.345-10.345-4.036-2.404-11.176-1.672-15.937 1.672-4.76 3.24-5.277 7.837-1.241 10.345 3.932 2.3 11.073 1.672 15.833-1.672z" fill="#FEFEFE"/><path d="m590.33 270.9l-6.936 12.019c-2.172 4.075-6.311 7.21-12.727 7.21l-11.074-0.209 3.209-10.868h2.172c1.139 0 1.967-0.104 2.588-0.418 0.621-0.209 0.932-0.627 1.449-1.254l4.139-6.583h17.281l-0.101 0.103z" fill="#FEFEFE"/></svg>',visa:'<svg width="780" height="500" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M489.823 143.111C442.988 143.111 401.134 167.393 401.134 212.256C401.134 263.706 475.364 267.259 475.364 293.106C475.364 303.989 462.895 313.731 441.6 313.731C411.377 313.731 388.789 300.119 388.789 300.119L379.123 345.391C379.123 345.391 405.145 356.889 439.692 356.889C490.898 356.889 531.19 331.415 531.19 285.784C531.19 231.419 456.652 227.971 456.652 203.981C456.652 195.455 466.887 186.114 488.122 186.114C512.081 186.114 531.628 196.014 531.628 196.014L541.087 152.289C541.087 152.289 519.818 143.111 489.823 143.111ZM61.3294 146.411L60.1953 153.011C60.1953 153.011 79.8988 156.618 97.645 163.814C120.495 172.064 122.122 176.868 125.971 191.786L167.905 353.486H224.118L310.719 146.411H254.635L198.989 287.202L176.282 167.861C174.199 154.203 163.651 146.411 150.74 146.411H61.3294ZM333.271 146.411L289.275 353.486H342.756L386.598 146.411H333.271ZM631.554 146.411C618.658 146.411 611.825 153.318 606.811 165.386L528.458 353.486H584.542L595.393 322.136H663.72L670.318 353.486H719.805L676.633 146.411H631.554ZM638.848 202.356L655.473 280.061H610.935L638.848 202.356Z" fill="#1434CB"/> </svg>'},ix={alipay:"alipay",amex:"amex",americanexpress:"amex",diners:"diners",dinersclub:"diners",discover:"discover",elo:"elo",generic:"generic",genericcard:"generic",card:"generic",hiper:"hiper",hipercard:"hipercard",jcb:"jcb",maestro:"maestro",master:"mastercard",mastercard:"mastercard",masterpass:"mastercard",mc:"mastercard",mir:"mir",paypal:"paypal",unionpay:"unionpay",upi:"unionpay",visa:"visa"},ox=e=>"data:image/svg+xml;utf8,"+encodeURIComponent(e),ax=({type:e,brand:t})=>"bank"===e?"bank":"native"===e?"native":(e=>{const t=e?.toLowerCase().replace(/[^a-z0-9]/g,"")??"";return ix[t]??"generic"})(t),sx=e=>{const t=ax(e);return ox("bank"===t?'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9L12 5L20 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 18H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>':"native"===t?'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 14H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>':nx[t])},cx="M64 192L64 224L576 224L576 192C576 156.7 547.3 128 512 128L128 128C92.7 128 64 156.7 64 192zM64 272L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 272L64 272zM128 424C128 410.7 138.7 400 152 400L200 400C213.3 400 224 410.7 224 424C224 437.3 213.3 448 200 448L152 448C138.7 448 128 437.3 128 424zM272 424C272 410.7 282.7 400 296 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L296 448C282.7 448 272 437.3 272 424z",dx="M335.9 84.2C326.1 78.6 314 78.6 304.1 84.2L80.1 212.2C67.5 219.4 61.3 234.2 65 248.2C68.7 262.2 81.5 272 96 272L128 272L128 480L128 480L76.8 518.4C68.7 524.4 64 533.9 64 544C64 561.7 78.3 576 96 576L544 576C561.7 576 576 561.7 576 544C576 533.9 571.3 524.4 563.2 518.4L512 480L512 272L544 272C558.5 272 571.2 262.2 574.9 248.2C578.6 234.2 572.4 219.4 559.8 212.2L335.8 84.2zM464 272L464 480L400 480L400 272L464 272zM352 272L352 480L288 480L288 272L352 272zM240 272L240 480L176 480L176 272L240 272zM320 160C337.7 160 352 174.3 352 192C352 209.7 337.7 224 320 224C302.3 224 288 209.7 288 192C288 174.3 302.3 160 320 160z",ux=e=>"BankAccount"===e.tenderType||"BANK_ACCOUNT"===e.tenderType,lx=e=>{const t=e.recipient?.status?.trim();return t?t.toUpperCase():void 0},hx=e=>"VERIFIED"===e.verificationInfo?.status&&(!ux(e)||"PROVISIONED"===lx(e)),fx=e=>{if("VERIFIED"!==e.verificationInfo?.status)return;if(!ux(e))return"Verified";const t=lx(e);return t?"PROVISIONED"===t?"Verified, Provisioned":"Verified, Pending":"Verified"},mx=async(e,t)=>{const r=await crypto.subtle.importKey("spki",px(t),{name:"RSA-OAEP",hash:"SHA-512"},!1,["encrypt"]),n=await crypto.subtle.encrypt({name:"RSA-OAEP"},r,(new TextEncoder).encode(e));return vx(n)},px=e=>{const t=e.trim().replace(/-----BEGIN [^-]+-----/g,"").replace(/-----END [^-]+-----/g,"").replace(/\s/g,"").replace(/-/g,"+").replace(/_/g,"/"),r=t.padEnd(t.length+(4-t.length%4)%4,"="),n=atob(r),i=new Uint8Array(n.length);for(let e=0;e<n.length;e+=1)i[e]=n.charCodeAt(e);return i.buffer},vx=e=>{const t=new Uint8Array(e);let r="";for(const e of t)r+=String.fromCharCode(e);return btoa(r)},bx=Qg`
  :host {
    --chc-text: #061b31;
    --chc-copy: #50617a;
    --chc-muted: #50617a;
    --chc-placeholder: #9ca3af;
    --chc-surface: #ffffff;
    --chc-widget-background: var(--chc-surface);
    --chc-soft-surface: #f8fafd;
    --chc-border: #e5edf5;
    --chc-border-strong: #8596a8;
    --chc-payment-method-background: var(--chc-surface);
    --chc-primary: #533afd;
    --chc-success: #047857;
    --chc-success-bg: #ecfdf3;
    --chc-success-border: #a6f4c5;
    --chc-danger: #c2410c;
    --chc-danger-bg: #fef3f2;
    --chc-danger-border: #fecdca;
    --chc-warning: #c2410c;
    --chc-warning-bg: #fffaeb;
    --chc-warning-border: #fedf89;
    --chc-disabled-text: #ffffff;
    --chc-disabled-surface: #c5ccd8;
    --chc-font-family: sohne-var, 'SF Pro Display', system-ui, -apple-system,
      'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    --chc-radius-control: 0.5rem;
    --chc-radius-card: 0.5rem;
    --chc-input-height: 2.75rem;
    --chc-font-weight: 400;
    --chc-divider: #ebeef2;
    --chc-focus-ring: rgba(83, 58, 253, 0.2);
    --chc-motion-fast: 150ms;
    --chc-motion-base: 220ms;
    --chc-motion-slow: 260ms;
    --chc-motion-sheet: 300ms;
    --chc-motion-provider: 300ms;
    --chc-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --chc-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
    --chc-spinner-duration: 900ms;
    --chc-shell-padding: 0;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 1rem;
    font-weight: var(--chc-font-weight);
  }

  .widget-frame {
    width: fit-content;
    position: relative;
    display: inline-grid;
    border-radius: 0.5rem;
    vertical-align: top;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .screen-reader-status {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .widget-close,
  .widget-back-button,
  .otp-resend,
  .button,
  .field-input,
  .payment-method-row,
  .selected-payment-method,
  .source-action,
  .source-action-link,
  .upload-row,
  .text-link-button {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
  }

  .widget-shell {
    width: min(24.125rem, calc(100vw - 1.5rem));
    height: min(35.25rem, calc(100dvh - 1.5rem));
    min-height: 20rem;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    position: relative;
    padding: var(--chc-shell-padding);
    overflow: hidden;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.5rem;
    background: var(--chc-widget-background);
    box-shadow: 0 1.5rem 5rem
      color-mix(in srgb, var(--chc-text) 10%, transparent);
    text-align: left;
    animation: chc-shell-enter var(--chc-motion-base) var(--chc-ease-emphasized)
      both;
  }

  .widget-shell-busy {
    overflow: hidden;
  }

  .widget-shell-wide {
    max-width: 40rem;
  }

  .widget-close {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 0.875rem;
    right: 0.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999rem;
    background: color-mix(in srgb, var(--chc-soft-surface) 88%, white);
    color: var(--chc-muted);
    font-size: 1.25em;
    font-weight: inherit;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
    padding: 0.875rem;
    border-bottom: 0.0625rem solid var(--chc-border);
  }

  .widget-heading {
    min-width: 0;
  }

  .widget-heading-row {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .widget-title-action {
    flex: 0 0 auto;
    align-self: center;
    margin-left: auto;
  }

  .widget-title-action .text-link-button {
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
  }

  .widget-header:has(.widget-back-button) {
    padding-left: 0;
  }

  .widget-back-button {
    width: 2.75rem;
    height: 2.75rem;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: -0.5rem 0;
    border: 0;
    border-radius: 999rem;
    background: transparent;
    color: var(--chc-primary);
    cursor: pointer;
    touch-action: manipulation;
  }

  .widget-back-button:hover:not(:disabled) {
    background: var(--chc-soft-surface);
  }

  .widget-back-button:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .widget-back-button:disabled {
    color: var(--chc-disabled-text);
    cursor: not-allowed;
  }

  .widget-back-icon {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
    stroke: none;
  }

  .widget-header-action {
    flex: 0 0 auto;
  }

  .widget-header-action .text-link-button {
    color: var(--chc-primary);
    font-weight: inherit;
  }

  .widget-subtitle {
    margin: 0.25rem 0 0;
    color: var(--chc-copy);
    font-weight: inherit;
    font-size: 0.9375em;
    text-align: left;
  }

  .widget-divider {
    height: 0.0625rem;
    margin-top: 1rem;
    background: var(--chc-divider);
  }

  .widget-content {
    min-height: 0;
    margin: 0;
    padding: 0.75rem 0.875rem;
    overflow: auto;
    overscroll-behavior: contain;
  }

  .widget-action-footer {
    display: grid;
    gap: 0.5rem;
    padding: 0.75rem 0.875rem;
    border-top: 0.0625rem solid var(--chc-border);
    background: var(--chc-surface);
  }

  .payment-method-add-footer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.5rem;
  }

  .payment-method-add-footer
    .button-secondary[data-action='open-add-payment-source']:not(:disabled) {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    color: var(--chc-primary);
  }

  .add-payment-sheet-layer {
    position: absolute;
    z-index: 20;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    border-radius: 0.5rem;
    padding: 0.75rem 0.75rem 0;
  }

  .add-payment-sheet-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.48);
  }

  .add-payment-sheet {
    width: min(100%, 32rem);
    max-height: calc(100% - 0.75rem);
    position: relative;
    z-index: 1;
    display: grid;
    gap: 1rem;
    overflow: auto;
    border: 0.0625rem solid var(--chc-border);
    border-bottom: 0;
    border-radius: 1.25rem 1.25rem 0 0;
    padding: 1.25rem;
    background: var(--chc-surface);
    box-shadow: 0 -0.75rem 2.5rem rgba(15, 23, 42, 0.2);
    transform-origin: bottom center;
    animation: chc-sheet-enter var(--chc-motion-sheet)
      var(--chc-ease-emphasized) both;
  }

  .add-payment-sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .add-payment-sheet-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .add-payment-sheet-close {
    width: 2.75rem;
    min-width: 2.75rem;
    height: 2.75rem;
    min-height: 2.75rem;
    display: inline-grid;
    place-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 999rem;
    padding: 0;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    cursor: pointer;
  }

  .add-payment-sheet-close svg {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }

  .add-payment-sheet-options {
    display: grid;
    gap: 0.75rem;
  }

  .add-payment-sheet-option {
    width: 100%;
    min-height: 4.5rem;
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr) 1rem;
    gap: 0.875rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.875rem;
    padding: 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    font-family: inherit;
    font-size: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard),
      transform var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .add-payment-sheet-option:hover,
  .add-payment-sheet-option:focus-visible {
    border-color: var(--chc-primary);
    background: color-mix(in srgb, var(--chc-primary) 4%, var(--chc-surface));
    transform: translateY(-0.0625rem);
  }

  .add-payment-sheet-close:focus-visible,
  .add-payment-sheet-option:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .add-payment-sheet-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-grid;
    place-items: center;
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--chc-primary) 10%, var(--chc-surface));
    color: var(--chc-primary);
  }

  .add-payment-sheet-icon svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }

  .add-payment-sheet-option-copy {
    min-width: 0;
    display: grid;
    gap: 0.1875rem;
  }

  .add-payment-sheet-option-title {
    font-weight: 600;
  }

  .add-payment-sheet-option-subtitle {
    color: var(--chc-copy);
    font-size: 0.8125rem;
  }

  .add-payment-sheet-option-chevron {
    color: var(--chc-muted);
    font-size: 1.5rem;
    justify-self: end;
  }

  .payment-method-radio {
    width: 1.125rem;
    height: 1.125rem;
    margin: 0;
    display: grid;
    appearance: none;
    place-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 999rem;
    background: var(--chc-surface);
    cursor: pointer;
  }

  .payment-method-radio::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999rem;
    background: var(--chc-primary);
    opacity: 0;
    transform: scale(0.65);
    transition: opacity var(--chc-motion-fast) var(--chc-ease-emphasized),
      transform var(--chc-motion-fast) var(--chc-ease-emphasized);
  }

  .payment-method-radio:checked {
    border-color: var(--chc-primary);
  }

  .payment-method-radio:checked::before {
    opacity: 1;
    transform: scale(1);
  }

  .payment-method-row-radio:has(.payment-method-radio:focus-visible) {
    outline: 0.1875rem solid var(--chc-focus-ring);
    outline-offset: 0.0625rem;
  }

  .widget-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.625rem;
  }

  .widget-toolbar .text-link-button,
  .widget-header-action > .text-link-button {
    min-height: 2rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 0.625rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .widget-shell-payment-methods .widget-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.625rem;
  }

  .widget-shell-payment-methods .widget-title {
    font-size: 1.375rem;
    letter-spacing: -0.02em;
  }

  .widget-shell-payment-methods .widget-heading-row {
    width: 100%;
    align-items: center;
  }

  .widget-shell-payment-methods .widget-header-action,
  .widget-shell-payment-methods .widget-toolbar {
    width: 100%;
  }

  .payment-method-toolbar-skeleton {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .payment-method-toolbar-skeleton span {
    min-height: 2.25rem;
    display: block;
    border-radius: var(--chc-radius-control);
    background: var(--chc-border);
    animation: chc-skeleton-shimmer var(--chc-motion-provider)
      var(--chc-ease-standard) infinite alternate;
  }

  .widget-shell-payment-methods .widget-toolbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .widget-shell-payment-methods .widget-toolbar .text-link-button {
    width: 100%;
    min-height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 0.75rem;
    letter-spacing: 0.02em;
  }

  .widget-shell-payment-methods .widget-toolbar .text-link-button-primary {
    border-color: var(--chc-primary);
    background: var(--chc-primary);
    color: #fff;
  }

  .text-link-button-icon {
    width: 1rem;
    height: 1rem;
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
  }

  .text-link-button-icon-add::before,
  .text-link-button-icon-add::after {
    content: '';
    width: 0.6875rem;
    height: 0.09375rem;
    position: absolute;
    border-radius: 999rem;
    background: currentColor;
  }

  .text-link-button-icon-add::after {
    transform: rotate(90deg);
  }

  .text-link-button-icon-edit {
    fill: currentColor;
  }

  .text-link-button-icon-transfer::before,
  .text-link-button-icon-transfer::after {
    content: '→';
    position: absolute;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .text-link-button-icon-transfer::after {
    content: '←';
    transform: translateY(0.3125rem);
  }

  .widget-shell-payment-methods .widget-content {
    overflow: hidden;
  }

  .widget-shell-payment-methods .widget-content > .payment-flow,
  .widget-shell-payment-methods .widget-content .primitive-stack {
    min-height: 0;
    height: 100%;
  }

  .widget-shell-payment-methods .widget-content > .payment-flow {
    display: grid;
    align-content: start;
  }

  .widget-shell-payment-methods .payment-method-skeletons {
    align-content: start;
  }

  .widget-shell-payment-methods .widget-content .primitive-stack {
    position: relative;
    display: grid;
    gap: 0.0625rem;
    padding: 0.5rem 0 3rem;
    overflow: auto;
    overscroll-behavior: contain;
    isolation: isolate;
    scroll-padding-bottom: 3rem;
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 0,
      #000 calc(100% - 1.5rem),
      rgba(0, 0, 0, 0.55) 100%
    );
    mask-image: linear-gradient(
      to bottom,
      #000 0,
      #000 calc(100% - 1.5rem),
      rgba(0, 0, 0, 0.55) 100%
    );
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }

  .widget-shell-payment-methods
    .widget-content
    .primitive-stack.primitive-stack-menu-open {
    -webkit-mask: none;
    mask: none;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .primitive-stack {
    display: grid;
    gap: 0.625rem;
  }

  .primitive-actions {
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
  }

  .primitive-footer {
    position: sticky;
    bottom: -0.75rem;
    z-index: 1;
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
    margin-right: -0.875rem;
    margin-left: -0.875rem;
    padding: 0.625rem 0.875rem 0.75rem;
    border-top: 0.0625rem solid var(--chc-border);
    background: var(--chc-surface);
  }

  .card-form-back-header,
  .bank-provider-back-header {
    display: inline-flex;
    align-items: center;
  }

  .card-form-back-header .text-link-button,
  .bank-provider-back-header .text-link-button {
    min-height: 1.875rem;
    display: inline-flex;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 999rem;
    padding: 0 0.625rem;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    font-size: 0.875em;
    font-weight: inherit;
  }

  .card-form-back-header .text-link-button:disabled,
  .bank-provider-back-header .text-link-button:disabled {
    color: var(--chc-muted);
  }

  .card-form-back-header .text-link-button::before,
  .bank-provider-back-header .text-link-button::before {
    content: '←';
    margin-right: 0.375rem;
  }

  .card-form-primary {
    display: grid;
  }

  .payment-action-links {
    display: grid;
    gap: 0.625rem;
    margin-top: 0;
    justify-items: stretch;
  }

  .otp-flow,
  .payment-flow,
  .required-info-flow {
    display: grid;
    gap: 0.75rem;
    margin: 0;
    border: 0;
    padding: 0;
  }

  .required-info-card {
    display: grid;
    gap: 0.75rem;
    min-height: 9.75rem;
    border-radius: min(1rem, calc(var(--chc-radius-card) * 1.5));
    border: 0.0625rem solid var(--chc-border);
    padding: 1rem;
    background: color-mix(in srgb, var(--chc-primary) 6%, var(--chc-surface));
    color: var(--chc-text);
    overflow: hidden;
  }

  .required-info-card-top,
  .required-info-card-bottom {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .required-info-card-heading,
  .required-info-card-detail {
    display: grid;
    min-width: 0;
    gap: 0.25rem;
  }

  .required-info-card-label {
    color: var(--chc-copy);
    font-size: 0.8125em;
    font-weight: inherit;
    letter-spacing: 0;
  }

  .required-info-card-field {
    min-width: 0;
    overflow: hidden;
    color: var(--chc-text);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .required-info-card-name {
    font-size: 1.0625em;
  }

  .required-info-card-number {
    font-size: 1.25em;
    letter-spacing: 0.12em;
  }

  .required-info-card-expiry {
    font-size: 1em;
  }

  .required-info-card-icon-chip {
    width: 3.75rem;
    height: 2.375rem;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--chc-primary) 6%, var(--chc-surface));
    color: var(--chc-primary);
    box-shadow: none;
  }

  .required-info-card-icon-image {
    max-width: 4rem;
    max-height: 3rem;
    display: block;
  }

  .required-info-card-icon-image[data-required-info-card-icon='bank'] {
    width: 1.625rem;
    height: 1.625rem;
    opacity: 0.78;
  }

  .required-info-card-status {
    display: inline-flex;
  }

  .required-info-card-status .verification-status-badge {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
  }

  .required-info-documents {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .required-info-section-title {
    margin: 0;
    color: var(--chc-text);
    font-weight: inherit;
  }

  .required-info-document {
    display: grid;
    gap: 0.375rem;
  }

  .required-document-row {
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.5rem;
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 80%,
      var(--chc-surface)
    );
  }

  .required-info-ssn-control {
    display: grid;
    grid-template-columns:
      minmax(0, 4.5rem) auto minmax(0, 3.5rem) auto
      minmax(0, 5.5rem);
    max-width: 17rem;
    align-items: center;
    gap: 0.375rem;
  }

  .required-info-ssn-input {
    text-align: center;
  }

  .required-info-ssn-separator {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .required-info-selected-file {
    margin: 0;
    overflow: hidden;
    color: var(--chc-copy);
    font-size: 0.875em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .otp-support {
    display: grid;
    justify-items: center;
    gap: 0.1875rem;
    text-align: center;
  }

  .otp-support-copy {
    margin: 0;
    color: var(--chc-copy);
  }

  .otp-support-actions {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
  }

  .otp-resend-prefix {
    color: var(--chc-copy);
  }

  .otp-resend {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font-weight: inherit;
    cursor: pointer;
  }

  .otp-resend:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .button {
    width: 100%;
    min-height: var(--chc-input-height);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard),
      transform var(--chc-motion-fast) var(--chc-ease-emphasized);
    cursor: pointer;
  }

  .button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.1875rem;
  }

  .button-icon {
    width: 1em;
    height: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875em;
  }

  .button-icon-plus {
    width: 1.5em;
    height: 1.5em;
    flex: 0 0 auto;
    fill: currentColor;
  }

  .button-content:has(.button-icon-plus) {
    gap: 0.375rem;
  }

  .button-content:has(.button-icon-plus) .button-label {
    white-space: nowrap;
  }

  .button-spinner,
  .otp-resend-spinner {
    width: 1em;
    height: 1em;
    display: inline-flex;
    flex: 0 0 auto;
    border: 0.125rem solid color-mix(in srgb, currentColor 28%, transparent);
    border-right-color: currentColor;
    border-radius: 999rem;
    animation: chc-spinner-rotate var(--chc-spinner-duration) linear infinite;
  }

  .otp-resend-spinner {
    width: 0.875em;
    height: 0.875em;
  }

  .button-icon-check::before {
    content: '✓';
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .widget-action-footer .button {
    min-height: 2.5rem;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    color: var(--chc-text);
  }

  .button:hover:not(:disabled) {
    transform: translateY(-0.0625rem);
  }

  .button:disabled {
    border-color: var(--chc-disabled-surface);
    background: var(--chc-disabled-surface);
    color: var(--chc-disabled-text);
    cursor: not-allowed;
  }

  .field {
    display: grid;
    gap: 0.3125rem;
    min-width: 0;
    text-align: left;
  }

  .field-control {
    min-width: 0;
  }

  .field-with-select {
    position: relative;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .billing-address-summary {
    gap: 0.375rem;
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.5rem;
    background: var(--chc-soft-surface);
  }

  .billing-address-summary-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .billing-address-summary-value {
    margin: 0;
    color: var(--chc-copy);
    font-size: 0.875em;
  }

  .field-label {
    color: var(--chc-copy);
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }

  .field-label-row,
  .required-info-document-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .required-info-document-name {
    min-width: 0;
    overflow: hidden;
    color: var(--chc-text);
    font-size: 0.875em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .required-info-requirement-badge {
    display: inline-flex;
    flex: 0 0 auto;
    border-radius: 999rem;
    padding: 0.125rem 0.4375rem;
    font-size: 0.6875em;
    font-weight: inherit;
  }

  .required-info-requirement-badge-required {
    background: color-mix(
      in srgb,
      var(--chc-warning) 12%,
      var(--chc-warning-bg)
    );
    color: var(--chc-warning);
  }

  .required-info-requirement-badge-optional {
    background: color-mix(
      in srgb,
      var(--chc-muted) 10%,
      var(--chc-soft-surface)
    );
    color: var(--chc-muted);
  }

  .field-input {
    width: 100%;
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    text-align: left;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .field-input:focus {
    border-color: var(--chc-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .field-select {
    appearance: auto;
    text-align: left;
  }

  .field-card-form {
    gap: 0.1875rem;
  }

  .field-label-card-form {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .field-control-card-form {
    width: 100%;
    min-height: var(--chc-input-height);
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: var(--chc-radius-control);
    background: var(--chc-surface);
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .field-control-card-form:focus-within {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .field-card-form.field-invalid .field-control-card-form {
    border-color: var(--chc-danger);
  }

  .field-control-reveal {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .field-control-reveal .field-input {
    flex: 1 1 auto;
    min-width: 0;
  }

  .field-reveal-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--chc-radius-control);
    background: transparent;
    color: var(--chc-muted);
    cursor: pointer;
    transition: color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .field-reveal-toggle:hover {
    color: var(--chc-text);
  }

  .field-reveal-toggle:focus-visible {
    outline: 0;
    color: var(--chc-primary);
    box-shadow: 0 0 0 0.1875rem var(--chc-focus-ring);
  }

  .field-reveal-toggle:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .field-reveal-icon {
    width: 1.125rem;
    height: 1.125rem;
    fill: currentColor;
  }

  .field-input-mask-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
  }

  .field-input-mask-wrap .field-input {
    flex: 1 1 auto;
    min-width: 0;
    /* Monospace keeps digit and bullet advances equal so the (transparent)
       caret stays aligned with the visible overlay characters. */
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    letter-spacing: 0;
  }

  .field-input-mask-hidden {
    color: transparent;
    caret-color: var(--chc-text);
  }

  .field-input-mask-hidden::selection {
    color: transparent;
  }

  .field-input-mask-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
    font: inherit;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    letter-spacing: 0;
    color: var(--chc-text);
    white-space: pre;
    overflow: hidden;
  }

  .field-card-form .field-input {
    min-height: 0;
    border: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .field-card-form .field-input:focus {
    border-color: transparent;
    box-shadow: none;
  }

  .field-control-card-form.field-with-select::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 1rem;
    width: 0.45rem;
    aspect-ratio: 1;
    border-right: 0.09375rem solid var(--chc-copy);
    border-bottom: 0.09375rem solid var(--chc-copy);
    transform: translateY(-65%) rotate(45deg);
    pointer-events: none;
  }

  .field-card-form .field-select {
    appearance: none;
    padding-right: 1.5rem;
  }

  .field-input::placeholder {
    color: var(--chc-placeholder);
  }

  .field-input[aria-invalid='true'] {
    border-color: var(--chc-danger);
  }

  .field-error {
    margin: 0;
    color: var(--chc-danger);
    font-weight: inherit;
    font-size: 0.875em;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.875rem;
  }

  .card-form-screen .form-grid {
    gap: 0.875rem;
  }

  .bank-account-jsonforms .jsonforms-layout-vertical {
    display: grid;
    gap: 0.75rem;
  }

  .bank-account-jsonforms .jsonforms-control {
    display: grid;
    gap: 0.1875rem;
  }

  .bank-account-jsonforms .jsonforms-control label {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .bank-account-jsonforms .jsonforms-control input {
    box-sizing: border-box;
    width: 100%;
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    color: var(--chc-text);
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .bank-account-jsonforms .jsonforms-control input:focus {
    border-color: var(--chc-primary);
    outline: 0;
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .bank-account-jsonforms .jsonforms-control input:disabled {
    border-color: var(--chc-border);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 85%,
      var(--chc-border-strong)
    );
    color: var(--chc-muted);
    cursor: not-allowed;
    opacity: 1;
  }

  .bank-account-jsonforms .jsonforms-mask-control {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: var(--chc-input-height);
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: var(--chc-radius-control);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .bank-account-jsonforms .jsonforms-mask-control:focus-within {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .bank-account-jsonforms .jsonforms-mask-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
  }

  .bank-account-jsonforms .jsonforms-control input.jsonforms-mask-input {
    width: 100%;
    min-height: 0;
    border: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    letter-spacing: 0;
  }

  .bank-account-jsonforms .jsonforms-control input.jsonforms-mask-input:focus {
    border: 0;
    box-shadow: none;
    background: transparent;
  }

  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input.field-input-mask-hidden {
    color: transparent;
    caret-color: var(--chc-text);
  }

  .bank-account-jsonforms .jsonforms-mask-overlay {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    pointer-events: none;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    font-size: inherit;
    letter-spacing: 0;
    color: var(--chc-text);
    white-space: pre;
    overflow: hidden;
  }

  .bank-account-jsonforms .jsonforms-description {
    color: var(--chc-muted);
    font-size: 0.875em;
  }

  .bank-account-jsonforms .jsonforms-error {
    color: var(--chc-danger);
    font-size: 0.875em;
  }

  .otp-group {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    border: 0;
    min-inline-size: 0;
  }

  .otp-label {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .otp-inputs {
    display: grid;
    width: min(100%, 17.5rem);
    margin: 0 auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .otp-input {
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.625rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    font-style: inherit;
    font-variant: inherit;
    font-stretch: inherit;
    font-family: inherit;
    font-optical-sizing: inherit;
    font-variation-settings: inherit;
    font-size: inherit;
    font-size-adjust: inherit;
    font-kerning: inherit;
    font-language-override: inherit;
    font-feature-settings: inherit;
    font-weight: inherit;
    text-align: center;
    padding: 0;
  }

  .otp-input:focus {
    border-color: var(--chc-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .otp-group-error .otp-input {
    border-color: var(--chc-danger);
    color: var(--chc-danger);
  }

  .alert {
    min-height: 0;
    display: block;
    border: 0.0625rem solid;
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
    font-weight: inherit;
    text-align: left;
  }

  .alert-message {
    min-width: 0;
  }

  .alert-success {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .alert-danger {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .alert-warning {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
    color: var(--chc-warning);
  }

  .status-pill {
    display: inline-flex;
    min-width: 4rem;
    min-height: 1.5rem;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid;
    border-radius: 999rem;
    padding: 0.0625rem 0.5625rem;
    font-weight: inherit;
    font-size: 0.8125em;
  }

  .status-verified {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .status-pending {
    border-color: #d0d5dd;
    background: var(--chc-soft-surface);
    color: var(--chc-muted);
  }

  .status-unverified {
    min-width: 5.125rem;
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .payment-method-row,
  .selected-payment-method {
    width: 100%;
    display: grid;
    gap: 0.625rem;
    align-items: center;
    border-radius: var(--chc-radius-card);
    padding: 0.5625rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    border: 0.0625rem solid transparent;
  }

  .payment-method-row {
    position: relative;
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.625rem;
    column-gap: 0.5rem;
  }

  .payment-method-row-has-overflow {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .payment-method-row-has-affordance:not(.payment-method-row-has-overflow) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .payment-method-row-has-overflow.payment-method-row-has-affordance {
    grid-template-columns: minmax(0, 1fr) auto auto;
    column-gap: 0.1875rem;
  }

  .payment-method-row-has-overflow-without-affordance {
    grid-template-columns: minmax(0, 1fr) auto 1rem;
    column-gap: 0.1875rem;
  }

  .payment-method-row-menu-open {
    z-index: 5;
  }

  .selected-payment-method {
    grid-template-columns: 2.375rem minmax(0, 1fr) auto;
  }

  .payment-method-row-main {
    min-width: 0;
    display: grid;
    grid-template-columns: 2.375rem minmax(0, 1fr) auto;
    gap: 0.625rem;
    align-items: center;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-style: inherit;
    font-size: inherit;
    font-weight: inherit;
    text-align: left;
  }

  .payment-method-row-main-radio {
    grid-template-columns: 2.375rem minmax(0, 1fr) auto;
  }

  .payment-method-row-main-action {
    cursor: pointer;
  }

  .payment-method-row-main-action:focus-visible {
    outline: 0;
  }

  .payment-method-row-action {
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard),
      transform var(--chc-motion-fast) var(--chc-ease-standard);
    cursor: pointer;
  }

  .payment-method-row-edit {
    grid-template-columns: minmax(0, 1fr) auto;
    cursor: default;
  }

  .payment-method-row-delete-confirming {
    border-color: var(--chc-danger-border);
    background: color-mix(
      in srgb,
      var(--chc-danger-bg) 70%,
      var(--chc-payment-method-background)
    );
  }

  .payment-method-row-static {
    cursor: default;
  }

  .payment-method-row-selected {
    border-color: var(--chc-primary);
    background: var(--chc-soft-surface);
    box-shadow: 0 0 0 0.0625rem
      color-mix(in srgb, var(--chc-primary) 12%, transparent);
  }

  .selected-payment-method {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 92%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.625rem 1.125rem rgba(17, 24, 39, 0.05);
  }

  .payment-flow .selected-payment-method {
    min-height: 15rem;
    grid-template-columns: 1fr;
    justify-items: center;
    align-content: center;
    text-align: center;
  }

  .payment-flow .selected-payment-method .payment-method-icon-chip {
    width: 3.25rem;
    height: 3.25rem;
  }

  .payment-flow .selected-payment-method .payment-method-icon-image {
    width: 2rem;
    height: 2rem;
  }

  .payment-flow .selected-payment-method .payment-method-copy {
    justify-items: center;
  }

  .payment-method-row-action:hover:not(:disabled),
  .payment-method-row-action:focus-visible {
    border-color: var(--chc-border);
    background: var(--chc-soft-surface);
    transform: translateY(-0.0625rem);
  }

  .payment-method-row-action:focus-visible {
    outline: 0;
  }

  .payment-method-row-action:has(
      .payment-method-row-main-action:focus-visible
    ) {
    border-color: var(--chc-border);
    background: var(--chc-soft-surface);
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .payment-method-row-action:disabled {
    border-color: var(--chc-border);
    background: var(--chc-payment-method-background);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .payment-method-row-spacer {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
  }

  .payment-method-trailing {
    width: auto;
    min-width: 1rem;
    min-height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.375rem;
    justify-self: end;
  }

  .payment-method-overflow {
    position: relative;
    display: grid;
    align-items: center;
    align-self: stretch;
    gap: 0.375rem;
    justify-self: end;
  }

  .payment-method-row-affordance {
    min-width: 1rem;
    min-height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    align-self: stretch;
    justify-self: end;
  }

  .payment-method-row-affordance-radio {
    min-width: 1.125rem;
    min-height: 2.5rem;
  }

  .payment-method-overflow-button {
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    display: inline-grid;
    place-items: center;
    border: 0;
    border-radius: 0.75rem;
    padding: 0;
    background: transparent;
    color: var(--chc-copy);
    cursor: pointer;
    touch-action: manipulation;
  }

  .payment-method-overflow-button svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }

  .payment-method-overflow-button:hover:not(:disabled),
  .payment-method-overflow-button:focus-visible,
  .payment-method-menu button:hover:not(:disabled),
  .payment-method-menu button:focus-visible {
    background: var(--chc-soft-surface);
  }

  .payment-method-overflow-button:focus-visible,
  .payment-method-menu button:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .payment-method-overflow-button:disabled,
  .payment-method-menu button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-menu {
    position: absolute;
    z-index: 4;
    top: calc(100% + 0.25rem);
    right: 0;
    min-width: 10rem;
    display: grid;
    gap: 0.125rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.75rem;
    padding: 0.375rem;
    background: var(--chc-surface);
    box-shadow: 0 0.625rem 1.5rem rgba(16, 24, 40, 0.16);
  }

  .payment-method-menu-above {
    top: auto;
    bottom: calc(100% + 0.25rem);
  }

  .payment-method-menu button {
    min-height: 2.5rem;
    border: 0;
    border-radius: 0.5rem;
    padding: 0 0.75rem;
    background: transparent;
    color: var(--chc-text);
    font-family: inherit;
    font-style: inherit;
    font-size: inherit;
    font-weight: inherit;
    text-align: left;
    cursor: pointer;
  }

  .payment-method-default-label {
    flex: 0 0 auto;
    margin-left: auto;
    min-height: 1.375rem;
    display: inline-flex;
    align-items: center;
    border: 0.0625rem solid
      color-mix(in srgb, var(--chc-primary) 28%, transparent);
    border-radius: 999rem;
    padding: 0.125rem 0.5rem;
    background: color-mix(in srgb, var(--chc-primary) 8%, white);
    color: var(--chc-primary);
    font-size: 0.6875rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .payment-method-balance {
    display: inline-flex;
    justify-content: flex-end;
    color: var(--chc-text);
    font-size: 0.875em;
    font-weight: inherit;
    text-align: right;
    white-space: nowrap;
  }

  .payment-method-balance-loading {
    width: 3.75rem;
    height: 0.875rem;
    display: inline-flex;
    border-radius: 999rem;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--chc-border) 70%, transparent),
      color-mix(in srgb, var(--chc-soft-surface) 96%, white),
      color-mix(in srgb, var(--chc-border) 70%, transparent)
    );
    background-size: 200% 100%;
    animation: chc-skeleton-shimmer var(--chc-motion-provider)
      var(--chc-ease-standard) infinite;
  }

  .payment-method-chevron {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--chc-muted);
    pointer-events: none;
  }

  .payment-method-chevron-icon {
    width: 0.5rem;
    height: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .payment-method-chevron-icon::before {
    content: '';
    width: 0.4375rem;
    height: 0.4375rem;
    border-right: 0.09375rem solid currentColor;
    border-bottom: 0.09375rem solid currentColor;
    transform: rotate(-45deg);
  }

  .payment-method-delete-button {
    width: 2.75rem;
    min-width: 2.75rem;
    height: 2.75rem;
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
    border: 0;
    border-radius: 0.75rem;
    padding: 0;
    background: transparent;
    color: var(--chc-danger);
    cursor: pointer;
    transition: background-color var(--chc-motion-fast) var(--chc-ease-standard),
      color var(--chc-motion-fast) var(--chc-ease-standard);
    touch-action: manipulation;
  }

  .payment-method-delete-button:hover:not(:disabled),
  .payment-method-delete-button:focus-visible {
    background: color-mix(in srgb, var(--chc-danger) 10%, transparent);
  }

  .payment-method-delete-button:focus-visible {
    outline: 0.125rem solid
      color-mix(in srgb, var(--chc-danger) 24%, transparent);
    outline-offset: 0.125rem;
  }

  .payment-method-delete-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-delete-action {
    min-width: 0;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .payment-method-delete-confirm-button {
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.625rem;
    padding: 0;
    background: var(--chc-surface);
    color: var(--chc-copy);
    font-family: inherit;
    font-style: inherit;
    font-size: 0.8125rem;
    font-weight: inherit;
    cursor: pointer;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard),
      color var(--chc-motion-fast) var(--chc-ease-standard);
    touch-action: manipulation;
  }

  .payment-method-delete-confirm-button:hover:not(:disabled),
  .payment-method-delete-confirm-button:focus-visible {
    border-color: var(--chc-border-strong);
    background: var(--chc-soft-surface);
    color: var(--chc-text);
  }

  .payment-method-delete-confirm-button:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .payment-method-delete-confirm-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-delete-confirm-button-danger {
    border-color: var(--chc-danger);
    background: var(--chc-danger);
    color: #ffffff;
  }

  .payment-method-delete-confirm-button-danger:hover:not(:disabled),
  .payment-method-delete-confirm-button-danger:focus-visible {
    border-color: color-mix(in srgb, var(--chc-danger) 84%, black);
    background: color-mix(in srgb, var(--chc-danger) 84%, black);
    color: #ffffff;
  }

  .payment-method-delete-confirm-button-danger:disabled {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-border);
    color: var(--chc-muted);
  }

  .payment-method-delete-action-icon {
    width: 1.125rem;
    height: 1.125rem;
    fill: currentColor;
  }

  .payment-method-icon-chip {
    width: 2.375rem;
    height: 2.375rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-soft-surface);
    color: var(--chc-text);
  }

  .payment-method-icon-image {
    width: 1.375rem;
    height: 1.375rem;
    display: block;
    object-fit: contain;
  }

  .payment-method-copy {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .payment-method-title {
    min-width: 0;
    display: block;
    overflow: hidden;
    color: var(--chc-text);
    font-size: 0.875rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-title-row {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.4375rem;
  }

  .payment-method-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.375rem;
    min-width: 0;
    flex-wrap: nowrap;
  }

  .payment-method-meta {
    flex: 1 1 auto;
    min-width: 0;
    display: block;
    overflow: hidden;
    color: var(--chc-copy);
    text-overflow: ellipsis;
    font-size: 0.8125rem;
    font-weight: 400;
    white-space: nowrap;
  }

  .payment-method-status {
    display: inline-flex;
    flex: 0 0 auto;
    margin-left: auto;
  }

  .verification-status-badge {
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    border: 0.0625rem solid transparent;
    flex: 0 0 auto;
    border-radius: var(--chc-radius-control);
    padding: 0.0625rem 0.4375rem;
    background: color-mix(in srgb, var(--chc-soft-surface) 85%, white);
    color: var(--chc-text);
    font-size: 0.575rem;
    font-weight: 400;
    letter-spacing: 0.005em;
  }

  .verification-status-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .verification-status-badge-success {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge-warning {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge-danger {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge[data-verification-status='require-info'] {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge[data-verification-status='not-verified'] {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .source-action {
    width: 100%;
    min-height: 4.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.875rem 1rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
  }

  .source-action-card,
  .source-action-bank {
    border-width: 0.125rem;
    border-style: dashed;
    border-color: var(--chc-border-strong);
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard);
  }

  .source-action-card:hover:not(:disabled),
  .source-action-card:focus-visible,
  .source-action-bank:hover:not(:disabled),
  .source-action-bank:focus-visible {
    border-color: var(--chc-border-strong);
    border-style: dashed;
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 90%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.04);
  }

  .source-action-card:focus-visible,
  .source-action-bank:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .source-action:disabled {
    background: var(--chc-payment-method-background);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .source-action-icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--chc-primary);
    font-size: 1.5rem;
    font-weight: inherit;
  }

  .source-action-icon svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: currentColor;
  }

  .source-action-card .source-action-icon,
  .source-action-bank .source-action-icon {
    font-size: 3rem;
  }

  .source-action-card .source-action-icon svg,
  .source-action-bank .source-action-icon svg {
    width: 2.5rem;
    height: 2.5rem;
  }

  .source-action-icon-transfer {
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0;
  }

  .source-action-transfer-arrow {
    position: absolute;
    width: 0.875rem;
    height: 0.4375rem;
    border-top: 0.125rem solid currentColor;
  }

  .source-action-transfer-arrow::after {
    content: '';
    position: absolute;
    top: -0.3125rem;
    width: 0.4375rem;
    height: 0.4375rem;
    border-top: 0.125rem solid currentColor;
    border-right: 0.125rem solid currentColor;
  }

  .source-action-transfer-arrow-forward {
    top: 0.4375rem;
    left: 0.25rem;
  }

  .source-action-transfer-arrow-forward::after {
    right: -0.0625rem;
    transform: rotate(45deg);
  }

  .source-action-transfer-arrow-back {
    right: 0.25rem;
    bottom: 0.3125rem;
    transform: rotate(180deg);
  }

  .source-action-transfer-arrow-back::after {
    right: -0.0625rem;
    transform: rotate(45deg);
  }

  .source-action-copy {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-subtitle {
    overflow: hidden;
    color: var(--chc-muted);
    font-weight: inherit;
    font-size: 0.875em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-link {
    width: 100%;
    min-height: var(--chc-input-height);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.625rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-style: dashed;
    border-radius: var(--chc-radius-card);
    padding: 0.625rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard);
  }

  .source-action-link:hover:not(:disabled),
  .source-action-link:focus-visible {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 90%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.04);
  }

  .source-action-link:focus-visible {
    outline: 0;
  }

  .source-action-link:disabled {
    background: var(--chc-payment-method-background);
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .source-action:disabled .source-action-icon,
  .source-action-link:disabled .source-action-icon {
    color: var(--chc-muted);
  }

  .source-action-link-copy {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .source-action-link-title {
    color: currentColor;
    font-weight: inherit;
  }

  .source-action-link-subtitle {
    color: var(--chc-copy);
    font-size: 0.875em;
  }

  .source-action-link-chevron {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
    color: var(--chc-muted);
  }

  .source-action-link-chevron-icon {
    width: 0.5rem;
    height: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .source-action-link-chevron-icon::before {
    content: '';
    width: 0.4375rem;
    height: 0.4375rem;
    border-right: 0.09375rem solid currentColor;
    border-bottom: 0.09375rem solid currentColor;
    transform: rotate(-45deg);
  }

  .source-action-link:disabled .source-action-link-subtitle {
    color: var(--chc-muted);
  }

  .detail-list {
    display: grid;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-payment-method-background);
    overflow: hidden;
    text-align: left;
  }

  .detail-list-compact {
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
  }

  .empty-state {
    display: grid;
    gap: 0.25rem;
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: inherit;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-copy);
  }

  .detail-row {
    min-height: 0;
    display: grid;
    gap: 0.125rem;
    padding: 0.625rem 0.75rem;
  }

  .detail-row + .detail-row {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .detail-label {
    color: var(--chc-muted);
    font-weight: inherit;
  }

  .detail-value {
    color: var(--chc-text);
    font-weight: inherit;
  }

  .upload-row {
    width: 100%;
    min-height: 2.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0;
    overflow: hidden;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.5rem;
    padding: 0;
    background: var(--chc-payment-method-background);
    color: var(--chc-copy);
    text-align: left;
    cursor: pointer;
  }

  .upload-row-error {
    border-color: var(--chc-danger);
    background: var(--chc-danger-bg);
  }

  .upload-row-label,
  .upload-row-requirements {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .upload-row-file-name {
    min-width: 0;
    overflow: hidden;
    padding: 0 0.75rem;
    color: var(--chc-copy);
    font-size: 0.8125em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-row-action {
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    padding: 0 0.75rem;
    background: var(--chc-soft-surface);
    color: var(--chc-primary);
    font-weight: inherit;
    white-space: nowrap;
  }

  .loading-row {
    min-height: 0;
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.875rem 1rem;
    background: var(--chc-payment-method-background);
    text-align: left;
  }

  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 0.3125rem solid #dbe3f1;
    border-right-color: var(--chc-primary);
    border-radius: 999rem;
    animation: chc-spinner-rotate var(--chc-spinner-duration) linear infinite;
  }

  .loading-spinner-small {
    width: 1.25rem;
    height: 1.25rem;
    border-width: 0.15625rem;
  }

  .loading-row-copy {
    display: grid;
    min-width: 0;
  }

  .loading-row-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.125em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .loading-row-helper {
    overflow: hidden;
    color: var(--chc-muted);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .provider-frame {
    display: grid;
    position: relative;
    gap: 0.875rem;
    text-align: left;
  }

  .provider-frame-loading {
    min-height: 31.25rem;
  }

  .bank-provider-manual-link {
    display: flex;
    justify-content: center;
  }

  .instrument-schema-selection {
    display: grid;
    gap: 0.875rem;
  }

  .instrument-schema-options {
    display: grid;
    gap: 0.625rem;
    margin: 0;
    border: 0;
    padding: 0;
  }

  .instrument-schema-options legend {
    margin-bottom: 0.25rem;
    padding: 0;
    color: var(--chc-muted);
    font-size: 0.875em;
  }

  .instrument-schema-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 3rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    cursor: pointer;
  }

  .instrument-schema-option:focus-within {
    border-color: var(--chc-primary);
    box-shadow: 0 0 0 0.125rem
      color-mix(in srgb, var(--chc-primary) 20%, transparent);
  }

  .instrument-schema-option input {
    width: 1rem;
    height: 1rem;
    margin: 0;
  }

  .verification-outcome-flow {
    display: grid;
    gap: 0.75rem;
  }

  .provider-frame-header {
    display: grid;
    gap: 0.25rem;
  }

  .provider-frame-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: inherit;
  }

  .provider-frame-status {
    margin: 0;
    color: var(--chc-muted);
  }

  .provider-frame-slot {
    display: block;
  }

  .provider-frame-container,
  ::slotted(.provider-frame-container) {
    width: 100%;
    min-height: 23.75rem;
    background: var(--chc-soft-surface);
    overflow: hidden;
  }

  .provider-frame-container-loading,
  .provider-frame-loading ::slotted(.provider-frame-container) {
    min-height: 31.25rem;
  }

  .provider-loading-overlay,
  .widget-loading-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: inherit;
    background: var(--chc-surface);
    color: var(--chc-text);
    text-align: center;
  }

  .provider-loading-overlay {
    align-content: center;
    gap: 0.75rem;
  }

  .provider-loading-label {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .widget-loading-status {
    max-width: 15rem;
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    padding: 1rem;
  }

  .widget-loading-animation {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-height: 1rem;
  }

  .widget-loading-animation-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999rem;
    background: var(--chc-primary);
    animation: chc-loading-dot 900ms var(--chc-ease-standard) infinite;
  }

  .widget-loading-animation-dot:nth-child(2) {
    animation-delay: 150ms;
  }

  .widget-loading-animation-dot:nth-child(3) {
    animation-delay: 300ms;
  }

  .widget-loading-copy {
    display: grid;
    gap: 0.25rem;
  }

  .widget-loading-title {
    color: var(--chc-text);
    font-weight: inherit;
  }

  .widget-loading-helper {
    color: var(--chc-copy);
    font-size: 0.875em;
  }

  .outcome-shell {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  .outcome-icon {
    width: 3.75rem;
    height: 3.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.125rem solid;
    border-radius: 999rem;
    font-size: 1.75em;
    font-weight: inherit;
  }

  .outcome-success .outcome-icon {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .outcome-success .outcome-icon::before {
    content: '✓';
  }

  .outcome-warning .outcome-icon {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
    color: var(--chc-warning);
  }

  .outcome-warning .outcome-icon::before {
    content: '!';
  }

  .outcome-danger .outcome-icon {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .outcome-danger .outcome-icon::before {
    content: '×';
  }

  .outcome-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.1875em;
    font-weight: inherit;
  }

  .outcome-message {
    margin: 0;
    color: var(--chc-copy);
  }

  .outcome-content,
  .outcome-actions {
    width: 100%;
  }

  .outcome-actions {
    display: grid;
    gap: 0.625rem;
  }

  .verification-details {
    display: grid;
    width: 100%;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-surface);
    overflow: hidden;
    text-align: left;
  }

  .verification-detail-row {
    min-height: 0;
    display: grid;
    gap: 0.125rem;
    padding: 0.75rem 1rem;
  }

  .verification-detail-row + .verification-detail-row {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .verification-detail-label {
    color: var(--chc-muted);
    font-weight: inherit;
  }

  .verification-detail-value {
    color: var(--chc-text);
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    font-weight: inherit;
  }

  .text-link-button {
    min-height: 0;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font-weight: inherit;
    cursor: pointer;
  }

  .text-link-button:hover:not(:disabled) {
    transform: translateY(-0.0625rem);
  }

  .text-link-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .text-link-button-secondary {
    gap: 0.25rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 0.75rem;
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    color: var(--chc-primary);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .payment-method-skeletons {
    display: grid;
    gap: 0;
  }

  .payment-method-skeleton-label {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .payment-method-skeleton-row {
    width: 100%;
    min-height: 3.625rem;
    display: grid;
    grid-template-columns: 2.375rem minmax(0, 1fr) 1.125rem;
    gap: 0.625rem;
    align-items: center;
    border: 0;
    border-bottom: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.5625rem;
    background: var(--chc-payment-method-background);
  }

  .payment-method-skeleton-icon,
  .payment-method-skeleton-line,
  .payment-method-skeleton-trailing {
    display: block;
    border-radius: 999rem;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--chc-soft-surface) 92%, var(--chc-border)),
      color-mix(in srgb, var(--chc-border) 72%, var(--chc-surface)),
      color-mix(in srgb, var(--chc-soft-surface) 92%, var(--chc-border))
    );
    background-size: 200% 100%;
    animation: chc-skeleton-shimmer var(--chc-motion-provider)
      var(--chc-ease-standard) infinite alternate;
  }

  .payment-method-skeleton-icon {
    width: 2.375rem;
    height: 2.375rem;
    border-radius: var(--chc-radius-card);
  }

  .payment-method-skeleton-copy {
    display: grid;
    gap: 0.375rem;
  }

  .payment-method-skeleton-title {
    width: 60%;
    height: 0.75rem;
  }

  .payment-method-skeleton-meta {
    width: 82%;
    height: 0.625rem;
  }

  .payment-method-skeleton-trailing {
    width: 1rem;
    height: 1rem;
  }

  @keyframes chc-spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes chc-skeleton-shimmer {
    to {
      background-position: -100% 0;
    }
  }

  @keyframes chc-loading-dot {
    0%,
    80%,
    100% {
      opacity: 0.42;
      transform: translateY(0);
    }

    40% {
      opacity: 1;
      transform: translateY(-0.25rem);
    }
  }

  @keyframes chc-shell-enter {
    from {
      opacity: 0;
      transform: translateY(0.5rem) scale(0.99);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes chc-sheet-enter {
    from {
      transform: translateY(100%);
    }

    to {
      transform: none;
    }
  }

  .powered-by-footer {
    display: flex;
    justify-content: center;
    gap: 0.3125rem;
    margin-top: 1rem;
    color: var(--chc-copy);
    font-size: 0.75em;
    font-weight: inherit;
    white-space: nowrap;
  }

  .powered-by-brand {
    font-weight: inherit;
  }

  @media (max-width: 26.25rem) {
    .widget-shell {
      width: calc(100vw - 1rem);
      height: calc(100dvh - 1rem);
      border-radius: 0.5rem;
    }

    .widget-close {
      right: 0.375rem;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .payment-method-add-footer {
      grid-template-columns: minmax(0, 1fr);
    }

    .add-payment-sheet-layer {
      padding: 0;
    }

    .add-payment-sheet {
      width: 100%;
      max-height: calc(100dvh - 1rem);
      border-right: 0;
      border-bottom: 0;
      border-left: 0;
      border-radius: 1.25rem 1.25rem 0 0;
      padding: 1rem;
    }

    .widget-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .widget-header-action,
    .widget-toolbar {
      width: 100%;
    }

    .widget-toolbar > * {
      flex: 1 1 0;
    }

    .otp-inputs {
      width: 100%;
    }

    .payment-method-row,
    .source-action-link,
    .upload-row,
    .loading-row {
      padding-right: 0.75rem;
      padding-left: 0.75rem;
    }

    .provider-frame-container,
    ::slotted(.provider-frame-container) {
      min-height: 22.5rem;
    }

    .source-action-title,
    .source-action-subtitle,
    .source-action-link-title,
    .payment-method-title {
      white-space: normal;
    }

    .source-action-subtitle {
      overflow: visible;
      text-overflow: clip;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .widget-shell,
    .widget-close,
    .button,
    .field-input,
    .field-control-card-form,
    .payment-method-row,
    .source-action-link,
    .payment-method-delete-button,
    .payment-method-delete-confirm-button {
      transition: none;
      animation: none;
    }

    .add-payment-sheet,
    .add-payment-sheet-option {
      transition: none;
      animation: none;
    }

    .button:hover:not(:disabled) {
      transform: none;
    }

    .loading-spinner,
    .button-spinner,
    .otp-resend-spinner,
    .widget-loading-animation-dot,
    .payment-method-skeleton-icon,
    .payment-method-skeleton-line,
    .payment-method-skeleton-trailing,
    .payment-method-balance-loading {
      animation: none;
    }
  }
`,gx=(...e)=>e.filter(Boolean).join(" "),yx=e=>{const t=e?.trim();return t||void 0},wx=(e,t)=>{const r=((e,t)=>"verified"===e?{label:t??"Ready",tone:"success"}:"under-review"===e?{label:"Needs review",tone:"warning"}:"require-info"===e?{label:"Needs info",tone:"warning"}:"declined"===e?{label:"Can't use",tone:"danger"}:{label:"Needs info",tone:"warning"})(e,t);return Ty`
    <span
      class="verification-status-badge verification-status-badge-${r.tone}"
      data-verification-status=${e}
    >
      <span class="verification-status-label">${r.label}</span>
    </span>
  `},$x=e=>{return"require-info"===(t=e.status)||"not-verified"===t;var t},kx=e=>{const t=yx(e.accountLabel)??(({label:e,brand:t,last4:r})=>{const n=yx(e),i=yx(t);return r&&i&&i!==n?`${i} •••• ${r}`:r?`•••• ${r}`:i??""})(e),r=yx(e.label)??t,n=Boolean(t)||e.isDefault;return Ty`
    <span class="payment-method-copy">
      <span class="payment-method-title-row">
        <span class="payment-method-title">${r}</span>
        ${(e=>!1!==e.showVerificationStatus)(e)?wx(e.status,e.verificationLabel):""}
      </span>
      ${n?Ty`
            <span class="payment-method-meta-row">
              ${t?Ty`<span class="payment-method-meta">${t}</span>`:""}
              ${e.isDefault?Ty`<span class="payment-method-default-label"
                    >Default</span
                  >`:""}
            </span>
          `:""}
    </span>
  `},xx=({balanceLabel:e,balanceLoading:t})=>t?Ty`
      <span
        class="payment-method-balance-loading"
        role="status"
        aria-label="Loading balance"
      ></span>
    `:e?Ty`<span class="payment-method-balance">${e}</span>`:"",Cx=(e,t)=>Ty`
  <span class="payment-method-trailing">
    ${xx(e)}
  </span>
`,Ex=(e,t)=>Ty`
  <span class="payment-method-icon-chip" aria-hidden="true">
    <img
      class="payment-method-icon-image"
      data-payment-method-icon=${ax(e)}
      src=${sx(e)}
      alt=""
    />
  </span>
  ${kx(e)} ${t}
`,jx=(e,t=$x(e))=>{const r=Ex(e,Cx(e));return t?Ty`
      <button
        class="payment-method-row-main payment-method-row-main-action"
        type="button"
        data-action="verify-payment-source"
        data-payment-method-id=${e.id}
        ?disabled=${e.disabled}
      >
        ${r}
      </button>
    `:Ty`<span class="payment-method-row-main">${r}</span>`},Sx=e=>`payment-method-radio-${e.replace(/[^a-zA-Z0-9_-]/g,"-")}`,Ax=(e,t)=>{const r=t&&!e.isDefault&&"verified"===e.status,n=!e.isDefault;return r||n},Ox=({label:e,variant:t="primary",action:r,type:n="button",icon:i,disabled:o=!1,loading:a=!1})=>Ty`
  <button
    class=${gx("button",`button-${t}`,a&&"button-loading")}
    part=${aw("primary"===t?"primary-action":void 0)}
    type=${n}
    data-action=${aw(r)}
    aria-busy=${a?"true":"false"}
    ?disabled=${o||a}
  >
    <span class="button-content">
      ${a?Ty`<span class="button-spinner" aria-hidden="true"></span>`:"plus"===i?Ty`
            <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
            <svg
              class="button-icon button-icon-plus"
              viewBox="0 0 640 640"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"
              ></path>
            </svg>
          `:i?Ty`
            <span
              class="button-icon button-icon-${i}"
              aria-hidden="true"
            ></span>
          `:""}
      <span class="button-label">${e}</span>
    </span>
  </button>
`,Ix=({id:e,label:t,name:r,value:n="",placeholder:i,type:o="text",span:a="default",variant:s="default",autocomplete:c,inputmode:d,disabled:u=!1,dataField:l,dataFieldScope:h="card",error:f,maskable:m=!1,revealed:p=!1,onToggleReveal:v,maskReveal:b})=>{const g=gx("field","full"===a&&"field-full","card-form"===s&&"field-card-form",f&&"field-invalid"),y=gx("field-label","card-form"===s&&"field-label-card-form"),w=gx("field-input","card-form"===s&&"field-input-card-form"),$=m&&void 0!==b,k=m,x=k?"off":c,C=$?"text":m&&!p?"password":o,E=Ty`
    <input
      class=${gx(w,$&&!p&&""!==n&&"field-input-mask-hidden")}
      id=${e}
      name=${aw(r)}
      type=${C}
      .value=${n}
      placeholder=${aw(i)}
      autocomplete=${aw(x)}
      autocapitalize=${aw(k?"off":void 0)}
      autocorrect=${aw(k?"off":void 0)}
      spellcheck=${aw(k?"false":void 0)}
      data-lpignore=${aw(k?"true":void 0)}
      inputmode=${aw(d)}
      data-card-field=${aw("card"===h?l:void 0)}
      data-bank-account-field=${aw("bankAccount"===h?l:void 0)}
      data-transfer-field=${aw("transfer"===h?l:void 0)}
      aria-invalid=${f?"true":"false"}
      aria-describedby=${aw(f?`${e}-error`:void 0)}
      ?disabled=${u}
    />
  `,j=$?Ty`
        <div class="field-input-mask-wrap">
          ${E}
          <span class="field-input-mask-overlay" aria-hidden="true"
            >${p?"":b}</span
          >
        </div>
      `:E,S=m&&v?Ty`
          <button
            class="field-reveal-toggle"
            type="button"
            aria-label=${W$(p)}
            aria-pressed=${p?"true":"false"}
            aria-controls=${e}
            ?disabled=${u}
            @mousedown=${e=>e.preventDefault()}
            @click=${()=>v()}
          >
            ${H$(p)}
          </button>
        `:"",A=gx("field-control","field-control-card-form",m&&"field-control-reveal");return Ty`
    <div class=${g}>
      <label class=${y} for=${e}>${t}</label>
      ${"card-form"===s||m?Ty`
            <div class=${A}>${j}${S}</div>
          `:j}
      ${f?Ty`<p class="field-error" id=${`${e}-error`}>${f}</p>`:""}
    </div>
  `},_x=({id:e,label:t,name:r,value:n="",options:i,span:o="default",variant:a="default",disabled:s=!1,dataField:c,dataFieldScope:d="card",error:u})=>{const l=gx("field","card-form"!==a&&"field-with-select","full"===o&&"field-full","card-form"===a&&"field-card-form",u&&"field-invalid"),h=gx("field-label","card-form"===a&&"field-label-card-form"),f=gx("field-input","field-select","card-form"===a&&"field-input-card-form"),m=Ty`
    <select
      class=${f}
      id=${e}
      name=${aw(r)}
      .value=${n}
      data-card-field=${aw("card"===d?c:void 0)}
      data-bank-account-field=${aw("bankAccount"===d?c:void 0)}
      data-transfer-field=${aw("transfer"===d?c:void 0)}
      aria-invalid=${u?"true":"false"}
      aria-describedby=${aw(u?`${e}-error`:void 0)}
      ?disabled=${s}
    >
      ${i.map(e=>Ty`
          <option value=${e.value} ?selected=${e.value===n}>
            ${e.label}
          </option>
        `)}
    </select>
  `;return Ty`
    <div class=${l}>
      <label class=${h} for=${e}>${t}</label>
      ${"card-form"===a?Ty`
            <div
              class="field-control field-control-card-form field-with-select"
            >
              ${m}
            </div>
          `:m}
      ${u?Ty`<p class="field-error" id=${`${e}-error`}>${u}</p>`:""}
    </div>
  `},zx=({variant:e,message:t})=>Ty`
  <div class="alert alert-${e}" part="alert" role="alert">
    <span class="alert-message">${t}</span>
  </div>
`,Nx=({title:e,message:t})=>Ty`
  <div class="empty-state">
    <p class="empty-state-title">${e}</p>
    <p class="empty-state-message">${t}</p>
  </div>
`,Rx=({id:e,label:t,status:r,type:n,eyebrow:i,brand:o,accountLabel:a,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:u,verificationLabel:l,selectionEligible:h,isDefault:f,disabled:m=!1},{deleteDisabled:p=!1,confirmingDelete:v=!1,menuOpen:b=!1,menuPlacement:g="below",selected:y=!1,selectable:w=!1,showMarkAsDefault:$=!1}={})=>{const k={id:e,label:t,status:r,type:n,brand:o,accountLabel:a,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:u,verificationLabel:l,selectionEligible:h,isDefault:f,disabled:m};if(v&&!k.isDefault)return Ty`
      <div
        class=${gx("payment-method-row","payment-method-row-edit","payment-method-row-delete-confirming")}
        part="payment-method-row"
        aria-label=${t}
        data-payment-method-id=${e}
      >
        ${jx(k,!1)}
        ${((e,t,r=!1)=>Ty`
    <span class="payment-method-delete-action">
      <button
        class="payment-method-delete-confirm-button payment-method-delete-confirm-button-danger"
        type="button"
        aria-label=${`Delete ${t}`}
        data-action="delete-payment-source"
        data-payment-method-id=${e}
        ?disabled=${r}
      >
        <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
        <svg
          class="payment-method-delete-action-icon"
          viewBox="0 0 640 640"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"
          ></path>
        </svg>
      </button>
    </span>
  `)(e,t,p)}
      </div>
    `;const x=w&&(e=>e.selectionEligible??"verified"===e.status)(k),C=Ax(k,$),E=x||$x(k),j=C&&!E;return Ty`
    <div
      class=${gx("payment-method-row",x||$x(k)?"payment-method-row-action":"payment-method-row-static",x&&"payment-method-row-radio",C&&"payment-method-row-has-overflow",E&&"payment-method-row-has-affordance",j&&"payment-method-row-has-overflow-without-affordance",y&&x&&"payment-method-row-selected",k.isDefault&&"payment-method-row-default",b&&!k.isDefault&&"payment-method-row-menu-open")}
      part="payment-method-row"
      aria-label=${t}
      aria-disabled=${m?"true":"false"}
      data-payment-method-id=${e}
    >
      ${x?((e,t)=>Ty`
  <label
    class="payment-method-row-main payment-method-row-main-action payment-method-row-main-radio"
    for=${t}
  >
    ${Ex(e,Ty`<span class="payment-method-trailing">
        ${xx(e)}
      </span>`)}
  </label>
`)(k,Sx(k.id)):jx(k)}
      ${((e,{menuOpen:t,menuPlacement:r,showMarkAsDefault:n})=>{const i=`payment-method-menu-${e.id}`,o=n&&!e.isDefault&&"verified"===e.status,a=!e.isDefault;return Ax(e,n)?Ty`
    <span class="payment-method-overflow">
      <button
        class="payment-method-overflow-button"
        type="button"
        aria-label=${`More actions for ${e.label}`}
        aria-haspopup="true"
        aria-expanded=${t?"true":"false"}
        aria-controls=${i}
        data-action="toggle-payment-source-menu"
        data-payment-method-id=${e.id}
        ?disabled=${e.disabled}
      >
        <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
        <svg viewBox="0 0 640 640" aria-hidden="true">
          <path
            d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"
          ></path>
        </svg>
      </button>
      ${t?Ty`
            <span
              class=${gx("payment-method-menu","above"===r&&"payment-method-menu-above")}
              id=${i}
              role="menu"
            >
              ${o?Ty`
                    <button
                      type="button"
                      role="menuitem"
                      data-action="mark-payment-source-default"
                      data-payment-method-id=${e.id}
                      ?disabled=${e.disabled}
                    >
                      Mark as default
                    </button>
                  `:""}
              ${a?Ty`
                    <button
                      type="button"
                      role="menuitem"
                      data-action="delete-payment-source"
                      data-payment-method-id=${e.id}
                      ?disabled=${e.disabled}
                    >
                      Remove
                    </button>
                  `:""}
            </span>
          `:""}
    </span>
  `:Ty``})(k,{menuOpen:b,menuPlacement:g,showMarkAsDefault:$})}
      ${j?Ty`<span class="payment-method-row-spacer" aria-hidden="true"></span>`:""}
      ${((e,{rendersRadio:t,selected:r})=>t?Ty`
      <span
        class="payment-method-row-affordance payment-method-row-affordance-radio"
      >
        <input
          class="payment-method-radio"
          id=${Sx(e.id)}
          type="radio"
          name="payment-method"
          value=${e.id}
          data-payment-method-radio="true"
          aria-label=${`Select ${e.label}`}
          .checked=${r}
          ?disabled=${e.disabled}
        />
      </span>
    `:$x(e)?Ty`
      <span
        class="payment-method-row-affordance payment-method-row-affordance-chevron"
      >
        <span class="payment-method-chevron" aria-hidden="true">
          <span class="payment-method-chevron-icon"></span>
        </span>
      </span>
    `:"")(k,{rendersRadio:x,selected:y})}
    </div>
  `},Tx=({id:e,label:t,status:r,type:n,eyebrow:i,brand:o,accountLabel:a,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:u,verificationLabel:l,selectionEligible:h})=>{const f={label:t,status:r,type:n,brand:o,accountLabel:a,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:u,verificationLabel:l};return Ty`
    <div
      class="selected-payment-method"
      part="payment-method-row"
      aria-label=${t}
    >
      ${Ex(f,Cx(f))}
    </div>
  `},Mx=e=>"transfer"===e?Ty`
      <span
        class="source-action-icon source-action-icon-transfer"
        data-source-action-icon=${e}
        aria-hidden="true"
      >
        <span
          class="source-action-transfer-arrow source-action-transfer-arrow-forward"
        ></span>
        <span
          class="source-action-transfer-arrow source-action-transfer-arrow-back"
        ></span>
      </span>
    `:Ty`
    <span
      class="source-action-icon"
      data-source-action-icon=${e}
      aria-hidden="true"
    >
      <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
      <svg viewBox="0 0 640 640" focusable="false">
        <path
          d=${"card"===e?cx:dx}
        ></path>
      </svg>
    </span>
  `,Px=({label:e,subtitle:t,action:r,icon:n,variant:i="card",disabled:o=!1})=>"link"===i?Ty`
        <button
          class="source-action-link source-action-link-${n}"
          type="button"
          data-action=${r}
          ?disabled=${o}
        >
          ${Mx(n)}
          <span class="source-action-link-copy">
            <span class="source-action-link-title source-action-title">
              ${e}
            </span>
            ${t?Ty`
                  <span
                    class="source-action-link-subtitle source-action-subtitle"
                  >
                    ${t}
                  </span>
                `:""}
          </span>
          <span class="source-action-link-chevron" aria-hidden="true">
            <span class="source-action-link-chevron-icon"></span>
          </span>
        </button>
      `:Ty`
        <button
          class="source-action source-action-${n}"
          type="button"
          data-action=${r}
          ?disabled=${o}
        >
          ${Mx(n)}
          <span class="source-action-copy">
            <span class="source-action-title">${e}</span>
            ${t?Ty`<span class="source-action-subtitle">${t}</span>`:""}
          </span>
        </button>
      `,Lx=e=>Ty`
  <div class="detail-list detail-list-compact">
    ${e.map(e=>Ty`
        <div class="detail-row">
          <span class="detail-label">${e.label}</span>
          <span class="detail-value">${e.value}</span>
        </div>
      `)}
  </div>
`,Dx=({containerId:e,title:t,loadingLabel:r,loading:n=!1})=>Ty`
  <div
    class=${gx("provider-frame",n&&"provider-frame-loading")}
    part="provider-frame"
    aria-busy=${n?"true":"false"}
  >
    ${t?Ty`
          <div class="provider-frame-header">
            ${t?Ty`<p class="provider-frame-title">${t}</p>`:""}
            ${n?"":Ty`
                  <p
                    class="provider-frame-status"
                    role="status"
                    aria-live="polite"
                  >
                    ${r}
                  </p>
                `}
          </div>
        `:""}
    <slot class="provider-frame-slot" name=${e}>
      <div
        class=${gx("provider-frame-container",n&&"provider-frame-container-loading")}
        id=${e}
      ></div>
    </slot>
    ${n?Ty`
          <div
            class="provider-loading-overlay"
            role="status"
            aria-live="polite"
          >
            <span class="loading-spinner" aria-hidden="true"></span>
            <span class="provider-loading-label">
              ${r}
            </span>
          </div>
        `:""}
  </div>
`,Bx=({variant:e,title:t,message:r,content:n,actions:i})=>Ty`
  <div class="outcome-shell outcome-${e}">
    <span class="outcome-icon" aria-hidden="true"></span>
    ${t?Ty`<p class="outcome-title">${t}</p>`:""}
    ${r?Ty`<p class="outcome-message">${r}</p>`:""}
    ${n?Ty`<div class="outcome-content">${n}</div>`:""}
    ${i?Ty`<div class="outcome-actions">${i}</div>`:""}
  </div>
`,qx=({label:e,action:t,icon:r,variant:n="default",disabled:i=!1})=>Ty`
  <button
    class=${gx("text-link-button",`text-link-button-${n}`,r&&`text-link-button-${r}`)}
    type="button"
    data-action=${t}
    ?disabled=${i}
  >
    ${"edit"===r?Ty`
          <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
          <svg
            class="text-link-button-icon text-link-button-icon-edit"
            viewBox="0 0 640 640"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"
            ></path>
          </svg>
        `:r?Ty`<span
          class=${`text-link-button-icon text-link-button-icon-${r}`}
          aria-hidden="true"
        ></span>`:""}
    <span>${e}</span>
  </button>
`,Vx=e=>Ty` <div class="form-grid">${e}</div> `,Fx=e=>`We sent a one-time code to ${e??"your contact method"}.`,Ux=e=>e.composedPath().find(e=>e instanceof HTMLInputElement&&e.classList.contains("otp-input")),Hx=({status:e,value:t,length:r,failedMessage:n,copy:i,submitting:o=!1,resending:a=!1})=>{const s="OTP_VALIDATION_FAILED"===e;return Ty`
    <form class="otp-flow" data-submit-action="verify-otp">
      ${s?zx({variant:"danger",message:n??i.failedMessage}):""}
      ${(({label:e,value:t="",length:r=6,disabled:n=!1,error:i=!1})=>{const o=Array.from({length:r},(e,r)=>t[r]??"");return Ty`
    <fieldset
      class="otp-group ${i?"otp-group-error":""}"
      aria-label=${e}
    >
      <legend class="otp-label">${e}</legend>
      <div class="otp-inputs">
        ${o.map((t,r)=>Ty`
            <input
              class="otp-input"
              aria-label=${`${e} digit ${r+1}`}
              inputmode="numeric"
              maxlength="1"
              pattern="[0-9]*"
              data-otp-index=${r}
              .value=${t}
              ?disabled=${n}
            />
          `)}
      </div>
    </fieldset>
  `})({label:"Verification code",value:t,length:r,disabled:o,error:s})}
      <div class="primitive-footer">
        ${Ox({label:o?i.verifyingButton:s?i.tryAgainButton:i.verifyButton,icon:o||s?void 0:"check",variant:"primary",action:"verify-otp",type:"submit",loading:o,disabled:o||t.length<r})}
      </div>
      <div class="otp-support">
        <p class="otp-support-copy otp-resend-prefix">${i.resendPrefix}</p>
        <div class="otp-support-actions">
          ${(({label:e,action:t,disabled:r=!1,loading:n=!1})=>Ty`
  <button
    class=${gx("otp-resend",n&&"otp-resend-loading")}
    type="button"
    data-action=${t}
    aria-busy=${n?"true":"false"}
    ?disabled=${r||n}
  >
    ${n?Ty`<span class="otp-resend-spinner" aria-hidden="true"></span>`:""}
    <span class="otp-resend-label">${e}</span>
  </button>
`)({label:a?i.resendPendingButton:i.resendButton,action:"resend-otp",loading:a,disabled:o||a})}
        </div>
      </div>
    </form>
  `},Wx=()=>Ty`
  <div class="payment-flow">
    ${(({count:e=3,label:t="Loading payment methods"}={})=>Ty`
  <div class="payment-method-skeletons" role="status" aria-live="polite">
    <span class="payment-method-skeleton-label">${t}</span>
    ${Array.from({length:e},()=>Ty`
        <div class="payment-method-skeleton-row" aria-hidden="true">
          <span class="payment-method-skeleton-icon"></span>
          <span class="payment-method-skeleton-copy">
            <span
              class="payment-method-skeleton-line payment-method-skeleton-title"
            ></span>
            <span
              class="payment-method-skeleton-line payment-method-skeleton-meta"
            ></span>
          </span>
          <span class="payment-method-skeleton-trailing"></span>
        </div>
      `)}
  </div>
`)({count:3,label:"Loading payment methods"})}
  </div>
`,Kx=({methods:e,canAddPaymentSources:t,canSelectPaymentSources:r,actionPending:n,selectedPaymentSourceId:i,openPaymentSourceMenuId:o,paymentSourceMenuPlacement:a="below",deleteConfirmationPaymentSourceId:s})=>{const c=e.some(e=>e.id===o&&!e.isDefault);return Ty`
    <div class="payment-flow">
      <div
        class=${c?"primitive-stack primitive-stack-menu-open":"primitive-stack"}
        aria-label="Payment methods"
      >
        ${e.map(e=>Rx({...e,disabled:e.disabled||n},{deleteDisabled:n,confirmingDelete:e.id===s,menuOpen:e.id===o,menuPlacement:a,selected:e.id===i,selectable:r,showMarkAsDefault:r||t}))}
      </div>
    </div>
  `},Gx=({allowedTenderOptions:e,canAddPaymentSources:t,deletePending:r=!1,copy:n,showTransferAction:i=!1})=>{const o=Boolean(n.emptyTitle||n.emptyMessage),a=t&&(e.card||e.bankAccount);return Ty`
    <div class="payment-flow">
      ${o?Nx({title:n.emptyTitle,message:n.emptyMessage}):""}
      ${a?Ty`
            <div class="payment-action-links">
              ${e.card?Px({label:n.addCardTitle,subtitle:n.addCardSubtitle,action:"add-card",icon:"card",disabled:r}):""}
              ${e.bankAccount?Px({label:n.addBankAccountTitle,subtitle:n.addBankAccountSubtitle,action:"add-bank-account",icon:"bank",disabled:r}):""}
              ${i?Px({label:"Transfer funds",action:"open-transfer",icon:"transfer",variant:"link",disabled:r}):""}
            </div>
          `:""}
    </div>
  `};var Yx=function(e,t,r,n){for(var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n,s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const Jx="onSelect",Zx="onAddPaymentMethod",Qx="onVerifyPaymentMethod",Xx="onDeletePaymentMethod",eC="onListPaymentMethods",tC="onTransfer",rC="onError",nC="onEvent",iC="commerce-hub-pbb-provider",oC=bb(o$,"VerticalLayout");let aC=class extends dk{createRenderRoot(){return this}};aC=Yx([tw("commerce-hub-bank-account-jsonforms")],aC);const sC="OTP_VALIDATION_SUCCESS",cC=[{value:"",label:"Select country or region"},{value:"US",label:"United States"}],dC=[{value:"",label:"Select state"},...[["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["DC","District of Columbia"]].map(([e,t])=>({value:e,label:t}))],uC={apiKey:"YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A",configId:"cce84049-0940-4926-9a54-9eaca0c09830",environment:"qa",locale:"en-US",paymentSdkUrl:"https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js"};let lC=class extends Xy{constructor(){super(...arguments),this.otpValue="",this.bankLinkLoading=!1,this.bankAccountInstrumentSchemas=[],this.selectedBankCurrencyCode="",this.selectedBankAccountType="",this.selectedBankPaymentType="",this.bankAccountFormData={},this.bankAccountFormValid=!1,this.bankAccountValidationAttempted=!1,this.bankBillingAddressValue="",this.bankBillingAddressSelectorExpanded=!1,this.legacyBankAccountDraft={accountNickname:"",routingNumber:"",accountNumber:"",confirmAccountNumber:""},this.legacyBankAccountDraftErrors={},this.legacyBankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},confirmAccountNumber:{status:"idle",normalizedValue:""}},this.bankAccountConfigRequestToken=0,this.bankProviderRequestToken=0,this.transferDraft={fromSourceId:"",toSourceId:"",amount:""},this.transferDraftErrors={},this.transferValidationAttempted=!1,this.transferSubmitSuccess=!1,this.transferFlowActive=!1,this.transferFlowScreen="form",this.cardDraft=Mw(),this.cardDraftErrors={},this.cardValidationAttempted=!1,this.cardEncryption={cardNumber:{status:"idle",normalizedValue:""},cvv:{status:"idle",normalizedValue:""}},this.cardEncryptionTasks={},this.revealedCardFields=new Set,this.cardFieldsRevealingLastChar=new Set,this.cardRevealTimeoutIds={},this.billingAddresses=[],this.billingAddressSelectorExpanded=!1,this.paymentSourceMenuPlacement="below",this.addLauncherActive=!1,this.savedSourceVerificationFailed=!1,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoValidationAttempted=!1,this.requiredInfoFiles={},this.interactionRefresh=new Aw(this),this.nativeBalance=new Ow(this),this.minimumVerificationOverlayToken=0,this.handleSubmit=e=>{e.preventDefault();const t=sE(e,"submitAction");"verify-otp"===t?this.verifyOtp():"submit-required-info"===t?this.submitRequiredInfo():"transfer"===t?this.reviewTransfer():"confirm-transfer"===t?this.submitTransfer():"save-card"===t?this.saveCard():"save-bank-account"===t&&this.saveManualBankAccount()},this.handleClick=e=>{const t=sE(e,"action"),r=sE(e,"paymentMethodId");if(!t){const t=e.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains("payment-method-overflow"));return void(this.openPaymentSourceMenuId&&!t&&(this.openPaymentSourceMenuId=void 0))}if(this.emitActionEvent({type:"action",name:t,screen:this.resolveCurrentScreenName(),isBackAction:hE(t)}),"toggle-payment-source-menu"!==t)if(this.openPaymentSourceMenuId=void 0,"mark-payment-source-default"!==t){if("attach-payment-source"===t){const e=r??this.selectedPaymentSourceId;return void(e&&(this.clearDeletePaymentSourceConfirmation(),this.attachPaymentSource(e)))}if("open-add-payment-source"===t){const e=TC(this.interactionResponse);return this.attachmentError=void 0,void(e.card&&e.bankAccount?(this.addLauncherActive=!0,this.focusAfterUpdate('[data-action="close-add-payment-source"]')):e.card?this.showAddCardScreen():e.bankAccount&&this.startBankAccountFlow())}if("close-add-payment-source"!==t){if("change-payment-source"===t)return this.resetRequiredInfo(),void this.showPaymentSourceList({refresh:!0});if("retry-interaction-refresh"!==t)if("verify-payment-source"!==t)if("delete-payment-source"!==t){if("done-payment-source-verification"===t)return this.resetSavedSourceVerification(),void this.showPaymentSourceList({refresh:!0});if("open-required-info-file-picker"===t)return this.pendingRequiredInfoDocKey=sE(e,"requiredInfoDocKey")??this.firstRequiredInfoDocKey(),void this.renderRoot.querySelector(".required-info-file-input")?.click();if("submit-required-info"!==t){if("open-transfer"===t)return this.paymentSourceView="list",this.resetCardFlow(),this.resetBankFlow(),this.resetRequiredInfo(),this.resetTransferFlow(),void(this.transferFlowActive=!0);if("transfer"!==t)if("edit-transfer"!==t)if("confirm-transfer"!==t)if("verify-otp"!==t)if("resend-otp"!==t)if("select-instrument-schema"!==t)if("save-bank-account"!==t){if("back-to-instrument-schema-selection"===t)return this.clearManualBankAccountForm(),void(this.bankFlowScreen="manual-schema-selection");if("add-bank-account"===t||"use-bank-account-instead"===t||"retry-bank-provider"===t||"use-different-bank-account"===t)return this.addLauncherActive=!1,this.paymentSourceView="list",this.resetCardFlow(),this.resetRequiredInfo(),this.resetBankFlow(),void this.startBankAccountFlow();if("back-to-bank-provider"===t)return this.paymentSourceView="list",this.resetCardFlow(),this.resetRequiredInfo(),this.resetBankFlow(),void this.startPayByBankFlow();if("add-ach-manually"===t)return this.paymentSourceView="list",this.resetCardFlow(),this.resetRequiredInfo(),void this.showManualBankAccountScreen();if("back-to-payment-methods"===t)return this.addLauncherActive=!1,this.resetCardFlow(),this.resetBankFlow(),this.resetRequiredInfo(),void this.showPaymentSourceList({refresh:!0});if("continue-bank-outcome"===t||"done-bank-outcome"===t)return this.resetBankFlow(),void this.showPaymentSourceList({refresh:!0});if("add-card"===t)return this.addLauncherActive=!1,this.paymentSourceView="list",this.resetRequiredInfo(),void this.showAddCardScreen();if("change-billing-address"!==t)if("change-bank-billing-address"!==t)if("save-card"!==t){if("edit-card-details"!==t)return"use-different-method"===t?(this.resetCardFlow(),this.resetRequiredInfo(),void this.showPaymentSourceList({refresh:!0})):void 0;this.cardFlowScreen="form"}else this.saveCard();else this.bankBillingAddressSelectorExpanded=!0;else this.billingAddressSelectorExpanded=!0}else this.saveManualBankAccount();else this.initializeManualBankAccountScreen();else this.resendOtp();else this.verifyOtp();else this.submitTransfer();else this.transferFlowScreen="form";else this.reviewTransfer()}else this.submitRequiredInfo()}else r&&this.deletePaymentSource(r);else r&&(this.clearDeletePaymentSourceConfirmation(),this.verifySavedPaymentSource(r));else this.retryInteractionRefresh()}else this.closeAddPaymentSourceSheet()}else r&&(this.clearDeletePaymentSourceConfirmation(),this.markPaymentSourceDefault(r));else if(r){const t=this.openPaymentSourceMenuId!==r,n=e.composedPath().find(e=>e instanceof HTMLElement&&"toggle-payment-source-menu"===e.dataset.action);this.clearDeletePaymentSourceConfirmation(),this.paymentSourceMenuPlacement=t&&this.shouldOpenPaymentSourceMenuAbove(n)?"above":"below",this.openPaymentSourceMenuId=t?r:void 0}},this.handleInput=e=>{const t=hC(e);if(t)return void this.storeRequiredInfoSsnInput(t);const r=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.cardField));if(r){const e=r.dataset.cardField;return this.updateCardDraftField(e,r.value),void(Pw(e)&&this.armCardFieldLastCharReveal(e))}const n=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.bankAccountField));if(n)return void this.updateLegacyBankAccountDraftField(n.dataset.bankAccountField,n.value);const i=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.transferField));if(i)return void this.updateTransferDraftField(i.dataset.transferField,i.value);const o=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.requiredInfoDocKey));if(o)return void this.storeRequiredInfoValue(o.dataset.requiredInfoDocKey,o.value);const a=e.composedPath().find(e=>e instanceof HTMLInputElement&&e.classList.contains("otp-input"));if(!a)return;const s=this.getOtpInputs(),c=Number(a.dataset.otpIndex),d=Yk(a.value);if(!d)return a.value="",void this.syncOtpValueFromInputs(s);if(1===d.length)return a.value=d,this.syncOtpValueFromInputs(s),void this.focusOtpInput(s,c+1);const u=this.writeOtpDigits(s,c,d);this.syncOtpValueFromInputs(s),this.focusOtpInput(s,Math.min(c+d.length,s.length-1),u)},this.handleKeyDown=e=>{if("Escape"===e.key&&this.openPaymentSourceMenuId&&!this.pendingAction){const t=this.openPaymentSourceMenuId;return e.preventDefault(),this.openPaymentSourceMenuId=void 0,void this.updateComplete.then(()=>{this.renderRoot.querySelector(`[data-action="toggle-payment-source-menu"][data-payment-method-id="${CSS.escape(t)}"]`)?.focus()})}if(this.addLauncherActive&&"Tab"===e.key){const t=[...this.renderRoot.querySelectorAll(".add-payment-sheet button:not(:disabled)")],r=t[0],n=t[t.length-1],i=this.shadowRoot?.activeElement;if(!r||!n)return;return void(e.shiftKey&&i===r?(e.preventDefault(),n.focus()):(e.shiftKey||i!==n)&&t.includes(i)||(e.preventDefault(),r.focus()))}if(this.addLauncherActive&&"Escape"===e.key&&!this.pendingAction)return e.preventDefault(),void this.closeAddPaymentSourceSheet();if("Escape"===e.key&&!this.pendingAction&&(this.addLauncherActive||this.cardFlowScreen||this.bankFlowScreen||this.requiredInfoSource||this.savedSourceVerificationSource||this.transferFlowActive))return e.preventDefault(),this.addLauncherActive=!1,this.resetCardFlow(),this.resetBankFlow(),this.resetRequiredInfo(),this.resetSavedSourceVerification(),void this.showPaymentSourceList();const t=e.composedPath().find(e=>e instanceof HTMLButtonElement&&"tab"===e.getAttribute("role"));if(t&&("ArrowLeft"===e.key||"ArrowRight"===e.key||"Home"===e.key||"End"===e.key)){const r=[...this.renderRoot.querySelectorAll('[role="tab"]')],n=r.indexOf(t),i=r["Home"===e.key?0:"End"===e.key?r.length-1:(n+("ArrowRight"===e.key?1:-1)+r.length)%r.length];return e.preventDefault(),void(i&&i!==t&&(i.focus(),i.click()))}const r=Ux(e);if(!r)return;const n=this.getOtpInputs(),i=Number(r.dataset.otpIndex);return"ArrowLeft"===e.key?(e.preventDefault(),void this.focusOtpInput(n,i-1)):"ArrowRight"===e.key?(e.preventDefault(),void this.focusOtpInput(n,i+1)):"Backspace"===e.key?(e.preventDefault(),r.value?r.value="":i>0&&(n[i-1].value=""),this.syncOtpValueFromInputs(n),void this.focusOtpInput(n,Math.max(i-1,0))):"Delete"===e.key?(e.preventDefault(),r.value="",void this.syncOtpValueFromInputs(n)):void(e.ctrlKey||e.metaKey||e.altKey||1!==e.key.length||/\d/.test(e.key)||e.preventDefault())},this.handleChange=e=>{const t=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.paymentMethodRadio));if(t)return this.selectedPaymentSourceId=t.value,void(this.attachmentError=void 0);const r=e.composedPath().find(e=>e instanceof HTMLSelectElement&&["instrumentSchemaCurrency","instrumentSchemaAccountType","instrumentSchemaPaymentType"].includes(e.name));if("instrumentSchemaCurrency"===r?.name)return this.selectedBankCurrencyCode=r.value,this.selectedBankAccountType="",this.selectedBankPaymentType="",void(this.selectedBankAccountInstrumentSchemaCode=void 0);if("instrumentSchemaAccountType"===r?.name)return this.selectedBankAccountType="BUSINESS"===r.value||"PERSONAL"===r.value?r.value:"",this.selectedBankPaymentType="",void(this.selectedBankAccountInstrumentSchemaCode=void 0);if("instrumentSchemaPaymentType"===r?.name){this.selectedBankPaymentType=r.value;const e=((e,t,r,n)=>{const i=e.filter(e=>e.currencyCode===t&&e.accountType===r&&e.paymentType===n);return 1===i.length?i[0].schema:void 0})(Vk(this.bankAccountInstrumentSchemas),this.selectedBankCurrencyCode,this.selectedBankAccountType,this.selectedBankPaymentType);return void(this.selectedBankAccountInstrumentSchemaCode=e?.bavSupportedCode)}const n=e.composedPath().find(e=>e instanceof HTMLSelectElement&&"bankBillingAddress"===e.name);if(n)return void this.updateBankBillingAddress(n.value);const i=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.requiredInfoFileInput));if(i)return this.storeRequiredInfoSelectedFile(i.files?.[0]),void(i.value="");const o=e.composedPath().find(e=>e instanceof HTMLSelectElement&&Boolean(e.dataset.cardField));if(o)return void this.updateCardDraftField(o.dataset.cardField,o.value);const a=e.composedPath().find(e=>e instanceof HTMLSelectElement&&Boolean(e.dataset.transferField));a&&this.updateTransferDraftField(a.dataset.transferField,a.value)},this.handleBankAccountFormDataChange=e=>{const t=e.detail.data;this.bankAccountFormData="object"!=typeof t||null===t||Array.isArray(t)?{}:t,this.bankAccountFormValid=0===(e.detail.errors?.length??0),this.bankAccountSubmitError=void 0},this.handleBankAccountFormErrorsChange=e=>{this.bankAccountFormValid=0===(e.detail.errors?.length??0)},this.handlePaste=e=>{const t=hC(e);if(t)return void this.pasteRequiredInfoSsnInput(e,t);const r=Ux(e);if(!r)return;const n=e,i="function"==typeof n.clipboardData?.getData?n.clipboardData.getData("text"):"",o=Yk(i);if(!o)return;e.preventDefault();const a=this.getOtpInputs(),s=Number(r.dataset.otpIndex),c=this.writeOtpDigits(a,s,o);this.syncOtpValueFromInputs(a),this.focusOtpInput(a,Math.min(s+o.length,a.length-1),c)},this.handleFocusIn=e=>{const t=Ux(e);t&&t.value&&requestAnimationFrame(()=>{this.renderRoot.contains(t)&&t.select()})},this.handleFocusLost=e=>{const t=e.composedPath().find(e=>e instanceof HTMLInputElement&&Pw(e.dataset.cardField));if(t){const e=t.dataset.cardField;return this.clearCardFieldLastCharReveal(e),void this.trackCardFieldEncryption(e,t.value)}const r=e.composedPath().find(e=>e instanceof HTMLInputElement&&c$(e.dataset.bankAccountField));r&&this.encryptLegacyBankAccountField(r.dataset.bankAccountField,r.value)}}willUpdate(e){if(e.has("interactionResponse")&&this.interactionResponse){const t=e.get("interactionResponse");t?.interactionId!==this.interactionResponse.interactionId&&(this.pendingAction=void 0,this.clearDeletePaymentSourceConfirmation(),this.paymentSourceView=void 0,this.openPaymentSourceMenuId=void 0,this.interactionRefresh.reset({requestUpdate:!1}),this.nativeBalance.reset({requestUpdate:!1}),this.billingAddresses=[],this.resetBankFlow(),this.resetTransferFlow(),this.resetSavedSourceVerification(),this.resetRequiredInfo(),this.lastReportedScreen=void 0),this.interactionResponse.paymentSources?.length||this.interactionResponse.selectedSource||(this.openPaymentSourceMenuId=void 0),this.syncBillingAddressesFromInteractionResponse(this.interactionResponse),this.selectedPaymentSourceId=JC(this.interactionResponse,this.selectedPaymentSourceId)}}updated(e){e.has("designConfig")&&this.syncDesignConfigStyles(),e.has("interactionResponse")&&this.deleteConfirmationPaymentSourceId&&!this.findPaymentSourceById(this.deleteConfirmationPaymentSourceId)&&this.clearDeletePaymentSourceConfirmation(),e.has("interactionResponse")&&this.refreshPaymentSourcesFromInteraction(),this.emitScreenLoadEvent()}render(){return Ty`
      <div
        class="widget-frame"
        @click=${this.handleClick}
        @submit=${this.handleSubmit}
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
        @change=${this.handleChange}
        @paste=${this.handlePaste}
        @focusin=${this.handleFocusIn}
        @focusout=${this.handleFocusLost}
        @blur=${this.handleFocusLost}
      >
        <span class="screen-reader-status" role="status" aria-live="polite"
          >${wE(this.pendingAction)}</span
        >
        ${this.renderCurrentScreen()}
        ${this.addLauncherActive?this.renderAddPaymentSourceSheet():""}
      </div>
    `}disconnectedCallback(){super.disconnectedCallback(),this.clearDeletePaymentSourceConfirmation(),this.clearAllCardFieldLastCharReveal(),this.resetBankFlow()}emitSdkEvent(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t}))}emitActionEvent(e){this.emitSdkEvent(nC,e)}emitScreenLoadEvent(){const e=this.resolveCurrentScreenName();if(e===this.lastReportedScreen)return;const t=this.lastReportedScreen;this.lastReportedScreen=e,this.emitActionEvent({type:"view",name:"view_loaded",screen:e,previousScreen:t})}resolveCurrentScreenName(){if(!this.interactionResponse)return"missing-interaction";if("provider"===this.bankFlowScreen)return"pay-by-bank-provider";if("outcome"===this.bankFlowScreen)return"pay-by-bank-outcome";if("manual-config-loading"===this.bankFlowScreen)return"manual-bank-config-loading";if("manual-config-error"===this.bankFlowScreen)return"manual-bank-config-error";if("manual-schema-selection"===this.bankFlowScreen)return"manual-bank-schema-selection";if("manual"===this.bankFlowScreen)return"manual-bank-form";if("form"===this.cardFlowScreen)return"card-form";if("error"===this.cardFlowScreen)return"card-error";if(this.requiredInfoSource)return"required-info";if(this.savedSourceVerificationSource)return"saved-source-verification";if("OTP_VALIDATION_PENDING"===this.interactionResponse?.status||"OTP_VALIDATION_FAILED"===this.interactionResponse?.status)return"otp";if(this.shouldRenderTransferScreen()){const e=HC(this.interactionResponse),t=Xk(this.transferDraft),r=e.find(e=>FC(e)===t.fromSourceId),n=e.find(e=>FC(e)===t.toSourceId);return"confirm"===this.transferFlowScreen&&r&&n&&tx(t,e)?"transfer-confirm":"transfer-form"}return this.shouldRenderSelectedPaymentSourceScreen()?"selected-payment-method":"payment-methods-list"}focusAfterUpdate(...e){this.updateComplete.then(()=>{for(const t of e){const e=this.renderRoot.querySelector(t);if(e)return void e.focus()}})}renderWidgetShell({busy:e=!1,overlay:t,...r}){const n=gE(this.minimumVerificationOverlayAction);return(({title:e,subtitle:t,content:r,backAction:n,backDisabled:i=!1,titleAction:o,headerAction:a,footer:s,width:c="default",layout:d="default",ariaLabel:u="Commerce Hub Connect",closeAction:l="close",showClose:h=!0,showDivider:f=!1,showFooter:m=!0,busy:p=!1,overlay:v})=>Ty`
  <section
    class=${gx("widget-shell","wide"===c&&"widget-shell-wide","payment-methods"===d&&"widget-shell-payment-methods",p&&"widget-shell-busy")}
    part="shell"
    aria-label=${u}
    aria-busy=${p?"true":"false"}
  >
    ${h?Ty`
          <button
            class="widget-close"
            type="button"
            aria-label="Close Commerce Hub Connect"
            data-action=${l}
          >
            ×
          </button>
        `:""}
    <div class="widget-header" part="header">
      <div class="widget-heading-row">
        ${n?Ty`
              <button
                class="widget-back-button"
                type="button"
                aria-label="Back"
                data-action=${n}
                ?disabled=${i}
              >
                <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
                <svg
                  class="widget-back-icon"
                  viewBox="0 0 640 640"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
                  ></path>
                </svg>
              </button>
            `:""}
        <div class="widget-heading">
          <h2 class="widget-title" part="title">${e}</h2>
          ${t?Ty`<p class="widget-subtitle">${t}</p>`:""}
        </div>
        ${o?Ty`<div class="widget-title-action">${o}</div>`:""}
      </div>
      ${a?Ty`<div class="widget-header-action">${a}</div>`:""}
    </div>
    ${f?Ty`<div class="widget-divider" aria-hidden="true"></div>`:""}
    <div class="widget-content" part="content">${r}</div>
    ${s&&m?Ty`<div class="widget-action-footer" part="footer">${s}</div>`:""}
    ${v?Ty`<div class="widget-loading-overlay">${v}</div>`:""}
  </section>
`)({...r,busy:e||Boolean(n),overlay:t??n})}showMinimumVerificationOverlay(e){const t=this.minimumVerificationOverlayToken+=1;this.minimumVerificationOverlayAction=e,window.setTimeout(()=>{this.minimumVerificationOverlayToken===t&&(this.minimumVerificationOverlayAction=void 0)},2e3)}renderCurrentScreen(){if(!this.interactionResponse)return this.renderMissingInteractionResponseScreen();if("provider"===this.bankFlowScreen)return this.renderBankProviderScreen();if("outcome"===this.bankFlowScreen)return this.renderBankOutcomeScreen();if("manual-config-loading"===this.bankFlowScreen)return this.renderManualBankAccountConfigLoadingScreen();if("manual-config-error"===this.bankFlowScreen)return this.renderManualBankAccountConfigErrorScreen();if("manual-schema-selection"===this.bankFlowScreen)return this.renderManualBankAccountSchemaSelectionScreen();if("manual"===this.bankFlowScreen)return this.renderManualBankAccountScreen();if("form"===this.cardFlowScreen)return this.renderAddCardScreen();if("error"===this.cardFlowScreen)return this.renderCardErrorScreen();if(this.requiredInfoSource)return this.renderRequiredInfoScreen();if(this.savedSourceVerificationSource)return this.renderSavedSourceVerificationOutcomeScreen();const e=this.interactionResponse?.status;return"OTP_VALIDATION_PENDING"===e||"OTP_VALIDATION_FAILED"===e?this.renderOtpScreen(e):this.shouldRenderTransferScreen()?this.renderTransferScreen():this.renderPaymentSourceScreen()}renderMissingInteractionResponseScreen(){return this.renderWidgetShell({title:"Configuration required",showClose:!1,showDivider:!1,content:Ty`
        <div class="payment-flow">
          ${zx({variant:"danger",message:"CommerceHub Connect requires an interaction response before it can load payment methods."})}
        </div>
      `})}renderOtpScreen(e){const t=xC(this.designConfig),r="verify-otp"===this.pendingAction,n="resend-otp"===this.pendingAction,i=kC(this.interactionResponse);let o;return r?o=bE({title:"Verifying code",helper:"Verifying your code, please wait."}):n&&(o=bE({title:"Sending code",helper:"Sending a new code, please wait."})),this.renderWidgetShell({title:t.title,subtitle:t.subtitle??Fx(i),showClose:!1,showDivider:!1,busy:r||n,overlay:o,content:Hx({status:e,value:this.otpValue,length:6,failedMessage:this.otpErrorMessage,copy:t,submitting:r,resending:n})})}renderPaymentSourceScreen(){const e=CC(this.designConfig),t=RC(this.interactionResponse,{nativeBalances:this.nativeBalance.balances,nativeBalanceLoadingSourceIds:this.nativeBalance.loadingSourceIds}),r=TC(this.interactionResponse),n=tE(this.interactionResponse,"ADD_ACCOUNT")&&(r.card||r.bankAccount),i=tE(this.interactionResponse,"SELECT"),o=tE(this.interactionResponse,"TRANSFER")&&HC(this.interactionResponse).length>=2,a="attach-payment-source"===this.pendingAction||"verify-payment-source"===this.pendingAction||"delete-payment-source"===this.pendingAction;if(this.shouldRenderPaymentSourceRefreshSkeleton())return this.renderWidgetShell({title:e.title,layout:"payment-methods",headerAction:Ty`
          <div
            class="payment-method-toolbar-skeleton"
            role="status"
            aria-label="Loading payment method actions"
          >
            <span></span><span></span><span></span>
          </div>
        `,showClose:!1,content:Wx()});if(this.shouldRenderPaymentSourceRefreshError())return this.renderPaymentSourceRefreshErrorScreen();if(!t.length)return this.renderNoSavedPaymentMethods();if(this.shouldRenderSelectedPaymentSourceScreen())return this.renderSelectedPaymentSourceScreen();this.queueNativeAccountBalanceRefresh();const s=o?Ty`
          <div class="widget-toolbar" aria-label="Payment method actions">
            ${qx({label:"Transfer",action:"open-transfer",icon:"transfer",disabled:a})}
          </div>
        `:void 0;return this.renderWidgetShell({title:e.title,layout:"payment-methods",headerAction:s,showClose:!1,busy:a,overlay:yE(this.pendingAction),content:Ty`
        ${this.attachmentError?zx({variant:"danger",message:this.attachmentError}):""}
        ${Kx({methods:t,canAddPaymentSources:n,canSelectPaymentSources:i,actionPending:a,selectedPaymentSourceId:this.selectedPaymentSourceId,openPaymentSourceMenuId:this.openPaymentSourceMenuId,paymentSourceMenuPlacement:this.paymentSourceMenuPlacement,deleteConfirmationPaymentSourceId:this.deleteConfirmationPaymentSourceId})}
      `,footer:n||i?Ty`
              <div
                class="payment-method-add-footer"
                aria-label="Payment method actions"
              >
                ${i?Ox({label:"attach-payment-source"===this.pendingAction?e.continuingButton:e.continueButton,action:"attach-payment-source",loading:"attach-payment-source"===this.pendingAction,disabled:!this.selectedPaymentSourceId||a}):""}
                ${n?Ox({label:"Add payment method",action:"open-add-payment-source",icon:"plus",disabled:a}):""}
              </div>
            `:void 0})}renderAddPaymentSourceSheet(){const e=TC(this.interactionResponse);return Ty`
      <div class="add-payment-sheet-layer">
        <div
          class="add-payment-sheet-backdrop"
          data-action="close-add-payment-source"
          aria-hidden="true"
        ></div>
        <section
          class="add-payment-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-payment-sheet-title"
        >
          <div class="add-payment-sheet-header">
            <h2 class="add-payment-sheet-title" id="add-payment-sheet-title">
              Add payment method
            </h2>
            <button
              class="add-payment-sheet-close"
              type="button"
              data-action="close-add-payment-source"
              aria-label="Close add payment method"
            >
              <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
              <svg viewBox="0 0 640 640" aria-hidden="true" focusable="false">
                <path
                  d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="add-payment-sheet-options">
            ${e.card?this.renderAddPaymentSourceOption({action:"add-card",title:"Credit or debit card",subtitle:"Add your card details",icon:"card"}):""}
            ${e.bankAccount?this.renderAddPaymentSourceOption({action:"add-bank-account",title:"Bank account",subtitle:"Connect or enter an account",icon:"bank"}):""}
          </div>
        </section>
      </div>
    `}renderAddPaymentSourceOption({action:e,title:t,subtitle:r,icon:n}){return Ty`
      <button
        class="add-payment-sheet-option"
        type="button"
        data-action=${e}
      >
        <span class="add-payment-sheet-icon" aria-hidden="true">
          <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
          <svg viewBox="0 0 640 640" focusable="false">
            <path
              d=${"card"===n?cx:dx}
            ></path>
          </svg>
        </span>
        <span class="add-payment-sheet-option-copy">
          <span class="add-payment-sheet-option-title">${t}</span>
          <span class="add-payment-sheet-option-subtitle">${r}</span>
        </span>
        <span class="add-payment-sheet-option-chevron" aria-hidden="true"
          >›</span
        >
      </button>
    `}renderPaymentSourceRefreshErrorScreen(){return this.renderWidgetShell({title:"Payment methods unavailable",showClose:!1,content:Ty`
        <div class="payment-flow">
          ${zx({variant:"danger",message:this.interactionRefresh.errorMessage??"We couldn't load payment methods. Try again."})}
          <div class="primitive-footer">
            ${Ox({label:"Try again",variant:"primary",action:"retry-interaction-refresh"})}
          </div>
        </div>
      `})}renderSelectedPaymentSourceScreen(){const e=ZC(this.interactionResponse,this.selectedPaymentSourceId);return e?this.renderWidgetShell({title:"Payment method saved",headerAction:qx({label:"Change",action:"change-payment-source",disabled:"attach-payment-source"===this.pendingAction}),showClose:!1,showDivider:!1,busy:"attach-payment-source"===this.pendingAction,overlay:"attach-payment-source"===this.pendingAction?bE({title:PE(e)?"Saving bank account":"Saving payment method",helper:"Saving your payment method, please wait."}):void 0,content:Ty`
        <div class="payment-flow">
          ${Tx(PC(e,{selected:!0,nativeBalances:this.nativeBalance.balances,nativeBalanceLoadingSourceIds:this.nativeBalance.loadingSourceIds}))}
        </div>
      `}):(this.paymentSourceView="list",this.renderPaymentSourceScreen())}shouldRenderSelectedPaymentSourceScreen(){return"list"!==this.paymentSourceView&&("PAYMENT_SOURCE_ATTACHED"===this.interactionResponse?.status||"selected"===this.paymentSourceView)}shouldRenderPaymentSourceRefreshSkeleton(){return this.interactionRefresh.shouldRenderSkeleton(this.interactionResponse)}shouldRenderPaymentSourceRefreshError(){return this.interactionRefresh.shouldRenderError(this.interactionResponse)}renderSavedSourceVerificationOutcomeScreen(){const e=this.savedSourceVerificationSource,t=kE(e,this.savedSourceVerificationFailed);return this.renderWidgetShell({title:t.title,backAction:"done-payment-source-verification",showClose:!1,showDivider:!1,content:Ty`
        <div class="verification-outcome-flow">
          ${zx({variant:t.variant,message:t.message})}
          ${e?RE(e):""}
        </div>
      `})}renderRequiredInfoScreen(){const e=this.requiredInfoSource;if(!e)return this.renderPaymentSourceScreen();const t=xE(e),r=OE(t),n="submit-required-info"===this.pendingAction,i=this.canSubmitRequiredInfo();return this.renderWidgetShell({title:"Complete account verification",backAction:"back-to-payment-methods",backDisabled:n,showClose:!1,showDivider:!1,busy:n,overlay:n?bE({title:"Verifying account",helper:"Reviewing your verification information, please wait."}):void 0,content:Ty`
        <form
          class="required-info-flow"
          data-submit-action="submit-required-info"
        >
          ${RE(e)}
          ${this.requiredInfoSubmitError?zx({variant:"danger",message:this.requiredInfoSubmitError}):""}

          <div class="required-info-documents">
            <p class="required-info-section-title">
              Information needed to complete verification
            </p>
            <div class="primitive-stack">
              ${t.map((e,t)=>{const r=CE(e,t),i=EE(e)?this.requiredInfoValues[r]:this.requiredInfoFileNames[r],o=this.visibleRequiredInfoError(e,t);return EE(e)?IE({doc:e,key:r,value:i??"",error:o}):Ty`
                  <div
                    class="required-info-document required-document-text-row"
                    data-required-info-doc-key=${r}
                    data-required-info-requirement=${SE(e)}
                  >
                    <div class="required-info-document-heading">
                      <span class="required-info-document-name"
                        >${zE(e)}</span
                      >
                      ${AE(e)}
                    </div>
                    ${(({label:e,requirements:t,actionLabel:r,fileName:n,action:i,error:o=!1,disabled:a=!1})=>Ty`
  <button
    class="upload-row ${o?"upload-row-error":""}"
    type="button"
    data-action=${aw(i)}
    ?disabled=${a}
    aria-label=${`${r}. ${e}. ${n??"No file chosen"}`}
  >
    <span class="upload-row-action">${r}</span>
    <span class="upload-row-file-name">${n??"No file chosen"}</span>
    <span class="upload-row-label">${e}</span>
    <span class="upload-row-requirements">${t}</span>
  </button>
`)({label:"Required document",requirements:zE(e),actionLabel:"Choose file",fileName:i,action:"open-required-info-file-picker",disabled:n})}
                    ${o?Ty`<p
                          class="field-error"
                          id=${`required-info-${r}-error`}
                          role="alert"
                        >
                          ${o}
                        </p>`:""}
                  </div>
                `})}
            </div>
          </div>

          ${r?Ty`
                <input
                  class="required-info-file-input"
                  type="file"
                  data-required-info-file-input="true"
                  hidden
                />
              `:""}

          <div
            class="primitive-footer"
            data-required-info-doc-key=${r??""}
          >
            ${Ox({label:n?"Verifying...":"Verify",action:"submit-required-info",type:"submit",loading:n,disabled:n||!i||this.hasBlockingRequiredInfoValidationErrors()})}
          </div>
        </form>
      `})}renderNoSavedPaymentMethods(){const e=EC(this.designConfig),t="delete-payment-source"===this.pendingAction,r=TC(this.interactionResponse),n=tE(this.interactionResponse,"ADD_ACCOUNT")&&(r.card||r.bankAccount);return this.renderWidgetShell({title:e.title,subtitle:e.subtitle,showClose:!1,showDivider:!1,content:Gx({allowedTenderOptions:r,canAddPaymentSources:n,deletePending:t,copy:e})})}shouldRenderTransferScreen(){const e=this.interactionResponse;return(this.transferFlowActive||rE(e))&&eE(e?.status)}renderTransferScreen(){const e=HC(this.interactionResponse),t="transfer"===this.pendingAction,r=this.transferFlowActive?"back-to-payment-methods":void 0;if(e.length<2)return this.renderWidgetShell({title:"Transfer funds",backAction:r,backDisabled:t,showClose:!1,showDivider:!1,content:Ty`
          <div class="payment-flow">
            ${Nx({title:"Transfer unavailable",message:"At least two verified bank or native accounts are required to transfer funds."})}
          </div>
        `});const n=[{value:"",label:"Select account"},...e.map(e=>({value:FC(e),label:LC(e)}))],i=Xk(this.transferDraft),o=e.find(e=>FC(e)===i.fromSourceId),a=e.find(e=>FC(e)===i.toSourceId);return"confirm"===this.transferFlowScreen&&o&&a&&tx(i,e)?this.renderTransferConfirmationScreen(o,a,i,t):this.renderWidgetShell({title:"Transfer funds",backAction:r,backDisabled:t,showClose:!1,showDivider:!1,busy:t,overlay:t?bE({title:"Initiating transfer",helper:"Submitting your transfer, please wait."}):void 0,content:Ty`
        <form
          class="payment-flow card-form-screen"
          data-submit-action="transfer"
        >
          ${this.transferSubmitError?zx({variant:"danger",message:this.transferSubmitError}):""}
          ${this.transferSubmitSuccess?zx({variant:"success",message:"Transfer initiated."}):""}
          ${Vx([_x({id:"transfer-from-source",name:"fromSourceId",label:"From",value:this.transferDraft.fromSourceId,options:n,span:"full",variant:"card-form",dataField:"fromSourceId",dataFieldScope:"transfer",error:this.transferValidationAttempted?this.transferDraftErrors.fromSourceId:void 0,disabled:t}),_x({id:"transfer-to-source",name:"toSourceId",label:"To",value:this.transferDraft.toSourceId,options:n,span:"full",variant:"card-form",dataField:"toSourceId",dataFieldScope:"transfer",error:this.transferValidationAttempted?this.transferDraftErrors.toSourceId:void 0,disabled:t}),Ix({id:"transfer-amount",name:"amount",label:"Amount",value:this.transferDraft.amount,variant:"card-form",inputmode:"decimal",dataField:"amount",dataFieldScope:"transfer",error:this.transferValidationAttempted?this.transferDraftErrors.amount:void 0,disabled:t})])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ox({label:t?"Transferring":"Transfer",action:"transfer",type:"submit",loading:t,disabled:t||(s=this.transferDraft,![s.fromSourceId,s.toSourceId,s.amount].every(e=>Boolean(e.trim())))||this.hasBlockingTransferValidationErrors()})}
            </div>
          </div>
        </form>
      `});var s}renderTransferConfirmationScreen(e,t,r,n){return this.renderWidgetShell({title:"Confirm transfer",backAction:"edit-transfer",backDisabled:n,showClose:!1,showDivider:!1,busy:n,overlay:n?bE({title:"Initiating transfer",helper:"Submitting your transfer, please wait."}):void 0,content:Ty`
        <form
          class="payment-flow card-form-screen"
          data-submit-action="confirm-transfer"
        >
          ${this.transferSubmitError?zx({variant:"danger",message:this.transferSubmitError}):""}
          ${Lx([{label:"From",value:LC(e)},{label:"To",value:LC(t)},{label:"Amount",value:rx(r)}])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ox({label:n?"Transferring":"Confirm transfer",action:"confirm-transfer",type:"submit",loading:n,disabled:n})}
            </div>
            <div class="card-form-primary">
              ${Ox({label:"Edit",variant:"secondary",action:"edit-transfer",disabled:n})}
            </div>
          </div>
        </form>
      `})}renderAddCardScreen(){const e="save-card"===this.pendingAction,t="encrypting"===this.cardEncryption.cardNumber.status||"encrypting"===this.cardEncryption.cvv.status,r=[...this.billingAddresses.map(e=>({value:e.id??"",label:fC(e)})),{value:Tw,label:"Add new billing address"}],n=this.billingAddresses.find(e=>e.id===this.cardDraft.billingAddressValue),i=Boolean(n)&&!this.billingAddressSelectorExpanded,o=!i&&this.cardDraft.billingAddressValue===Tw,a=[];return n&&i?a.push(Ty`
        <div class="billing-address-summary field field-full">
          <div class="billing-address-summary-heading">
            <span class="billing-address-summary-label field-label"
              >Billing address</span
            >
            ${qx({label:"Change",action:"change-billing-address",disabled:e})}
          </div>
          <p class="billing-address-summary-value">
            ${fC(n)}
          </p>
        </div>
      `):a.push(_x({id:"billing-address",name:"billingAddress",label:"Billing address",value:this.cardDraft.billingAddressValue,options:r,span:"full",variant:"card-form",dataField:"billingAddressValue",error:this.visibleCardDraftError("billingAddressValue"),disabled:e})),o&&a.push(_x({id:"billing-country",name:"country",label:"Country or region",value:this.cardDraft.country,options:cC,span:"full",variant:"card-form",dataField:"country",error:this.visibleCardDraftError("country"),disabled:e}),Ix({id:"billing-address-line-1",name:"addressLine1",label:"Address",value:this.cardDraft.addressLine1,placeholder:"Street address",span:"full",variant:"card-form",autocomplete:"address-line1",dataField:"addressLine1",error:this.visibleCardDraftError("addressLine1"),disabled:e}),Ix({id:"billing-address-line-2",name:"addressLine2",label:"Address line 2",value:this.cardDraft.addressLine2,placeholder:"Apartment, suite, unit",span:"full",variant:"card-form",autocomplete:"address-line2",dataField:"addressLine2",error:this.visibleCardDraftError("addressLine2"),disabled:e}),Ix({id:"billing-city",name:"city",label:"City",value:this.cardDraft.city,span:"full",variant:"card-form",autocomplete:"address-level2",dataField:"city",error:this.visibleCardDraftError("city"),disabled:e}),_x({id:"billing-state",name:"state",label:"State",value:this.cardDraft.state,options:dC,span:"full",variant:"card-form",dataField:"state",error:this.visibleCardDraftError("state"),disabled:e}),Ix({id:"billing-zip",name:"zip",label:"ZIP code",value:this.cardDraft.zip,placeholder:"ZIP code",span:"full",variant:"card-form",autocomplete:"postal-code",inputmode:"numeric",dataField:"zip",error:this.visibleCardDraftError("zip"),disabled:e})),this.renderWidgetShell({title:"Add card",backAction:"back-to-payment-methods",backDisabled:e,showClose:!1,showDivider:!1,busy:e,overlay:e?bE({title:"Saving card",helper:"Securely saving your card, please wait."}):void 0,content:Ty`
        <form
          class="payment-flow card-form-screen"
          data-submit-action="save-card"
        >
          ${this.cardSubmitError?zx({variant:"danger",message:this.cardSubmitError}):""}
          ${Vx([Ix({id:"card-label",name:"name",label:"Card Name",value:this.cardDraft.name,placeholder:"Corporate card",span:"full",variant:"card-form",dataField:"name",error:this.visibleCardDraftError("name"),disabled:e}),Ix({id:"card-number",name:"cardNumber",label:"Card number",value:this.cardDraft.cardNumber,placeholder:"1234 1234 1234 1234",span:"full",variant:"card-form",autocomplete:"cc-number",inputmode:"numeric",dataField:"cardNumber",error:this.visibleCardDraftError("cardNumber"),disabled:e,maskable:!0,revealed:this.revealedCardFields.has("cardNumber"),onToggleReveal:()=>this.toggleCardFieldReveal("cardNumber"),maskReveal:U$(this.cardDraft.cardNumber,this.cardFieldsRevealingLastChar.has("cardNumber"))}),Ix({id:"expiration-date",name:"expirationDate",label:"Expiration",value:this.cardDraft.expirationDate,placeholder:"MM / YY",variant:"card-form",autocomplete:"cc-exp",inputmode:"numeric",dataField:"expirationDate",error:this.visibleCardDraftError("expirationDate"),disabled:e}),Ix({id:"card-cvv",name:"cvv",label:"CVC",value:this.cardDraft.cvv,placeholder:"3 or 4 digits",variant:"card-form",autocomplete:"cc-csc",inputmode:"numeric",dataField:"cvv",error:this.visibleCardDraftError("cvv"),disabled:e,maskable:!0,revealed:this.revealedCardFields.has("cvv"),onToggleReveal:()=>this.toggleCardFieldReveal("cvv"),maskReveal:U$(this.cardDraft.cvv,this.cardFieldsRevealingLastChar.has("cvv"))}),Ix({id:"name-on-card",name:"fullName",label:"Full name",value:this.cardDraft.fullName,placeholder:"Name on card",span:"full",variant:"card-form",autocomplete:"cc-name",dataField:"fullName",error:this.visibleCardDraftError("fullName"),disabled:e}),...a])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ox({label:e?"Saving payment method":"Save card",action:"save-card",type:"submit",loading:e,disabled:e||t||!Kw(this.cardDraft)||this.hasBlockingCardValidationErrors()})}
            </div>
          </div>
        </form>
      `})}renderCardErrorScreen(){return this.renderWidgetShell({title:"Credit card not saved",subtitle:"We could not save this card. Check the card details or use a different payment method.",showClose:!1,showDivider:!1,content:Bx({variant:"danger",content:this.cardSubmitError?zx({variant:"danger",message:this.cardSubmitError}):void 0,actions:Ty`
          ${Ox({label:"Edit card details",action:"edit-card-details"})}
          ${qx({label:"Use a different method",action:"use-different-method"})}
        `})})}renderBankProviderScreen(){return this.renderWidgetShell({title:"Connect your bank",backAction:"back-to-payment-methods",backDisabled:this.bankLinkLoading,showClose:!1,showDivider:!1,busy:this.bankLinkLoading,overlay:this.bankLinkLoading?bE({title:"Connecting to your bank",helper:"Securely opening your bank connection, please wait."}):void 0,content:Dx({containerId:iC,loading:this.bankLinkLoading,loadingLabel:"Connecting to your bank"}),footer:Ty`
        <div class="bank-provider-manual-link">
          ${qx({label:"Connect another way",action:"add-ach-manually",disabled:this.bankLinkLoading})}
        </div>
      `})}renderManualBankAccountConfigLoadingScreen(){return this.renderWidgetShell({title:"Select bank account type",backAction:this.manualBankAccountExitAction(),backDisabled:!0,showClose:!1,showDivider:!1,busy:!0,overlay:bE({title:"Loading instrument schemas",helper:"Loading the available bank account options, please wait."}),content:Ty`<div class="payment-flow card-form-screen"></div>`})}renderManualBankAccountConfigErrorScreen(){return this.renderWidgetShell({title:"Select bank account type",backAction:this.manualBankAccountExitAction(),showClose:!1,showDivider:!1,content:Ty`
        <div class="payment-flow card-form-screen">
          ${zx({variant:"danger",message:this.bankAccountConfigError??"Unable to load instrument schemas. Try again."})}
          <div class="primitive-footer card-form-primary">
            ${Ox({label:"Try again",action:"add-ach-manually"})}
          </div>
        </div>
      `})}renderManualBankAccountSchemaSelectionScreen(){const e=Vk(this.bankAccountInstrumentSchemas),t=(e=>Fk(e.map(({currencyCode:e,currencyName:t})=>({value:e,label:t})),({label:e})=>e))(e),r=this.selectedBankCurrencyCode?((e,t)=>Fk(e.filter(e=>e.currencyCode===t).map(({accountType:e})=>({value:e,label:"BUSINESS"===e?"Business":"Personal"}))))(e,this.selectedBankCurrencyCode):[],n=this.selectedBankAccountType?((e,t,r)=>Fk(e.filter(e=>e.currencyCode===t&&e.accountType===r).map(({paymentType:e,schema:t})=>({value:e,label:t.productId}))))(e,this.selectedBankCurrencyCode,this.selectedBankAccountType):[];return this.renderWidgetShell({title:"Select bank account type",backAction:this.manualBankAccountExitAction(),showClose:!1,showDivider:!1,content:Ty`
        <div class="instrument-schema-selection payment-flow card-form-screen">
          ${_x({id:"instrument-schema-currency",name:"instrumentSchemaCurrency",label:"Currency",value:this.selectedBankCurrencyCode,options:[{value:"",label:"Select currency"},...t],span:"full",variant:"card-form"})}
          ${this.selectedBankCurrencyCode?_x({id:"instrument-schema-account-type",name:"instrumentSchemaAccountType",label:"Account type",value:this.selectedBankAccountType,options:[{value:"",label:"Select account type"},...r],span:"full",variant:"card-form"}):""}
          ${this.selectedBankAccountType?_x({id:"instrument-schema-payment-type",name:"instrumentSchemaPaymentType",label:"Payment type",value:this.selectedBankPaymentType,options:[{value:"",label:"Select payment type"},...n],span:"full",variant:"card-form"}):""}
          <div class="primitive-footer card-form-primary">
            ${Ox({label:"Continue",action:"select-instrument-schema",disabled:!this.selectedBankAccountInstrumentSchemaCode})}
          </div>
        </div>
      `})}renderManualBankAccountScreen(){if("legacy"===this.manualBankAccountFormMode)return this.renderLegacyManualBankAccountScreen();const e=this.bankAccountFormSchema,t=this.bankAccountFormUiSchema;if(!e||!t)return this.renderManualBankAccountConfigErrorScreen();const r="save-bank-account"===this.pendingAction;return this.renderWidgetShell({title:"Enter bank details",backAction:"back-to-instrument-schema-selection",showClose:!1,showDivider:!1,content:Ty`
        <form
          class="payment-flow card-form-screen"
          data-submit-action="save-bank-account"
        >
          <commerce-hub-bank-account-jsonforms
            class="bank-account-jsonforms"
            .schema=${e}
            .uischema=${t}
            .data=${this.bankAccountFormData}
            .i18n=${this.bankAccountFormI18n}
            .renderers=${gk}
            .config=${{billingAddressTemplate:this.renderBankBillingAddressControl(r)}}
            .readonly=${r}
            .validationMode=${this.bankAccountValidationAttempted?"ValidateAndShow":"ValidateAndHide"}
            @data-change=${this.handleBankAccountFormDataChange}
            @errors-change=${this.handleBankAccountFormErrorsChange}
          ></commerce-hub-bank-account-jsonforms>
          ${this.bankAccountSubmitError?zx({variant:"danger",message:this.bankAccountSubmitError}):""}
          <div class="primitive-footer card-form-primary">
            ${Ox({label:r?"Saving bank account":"Save bank account",action:"save-bank-account",type:"submit",loading:r,disabled:r||this.hasBlockingConfigBankValidationErrors()||!Rk(e,this.bankAccountFormData)})}
          </div>
        </form>
      `})}renderBankBillingAddressControl(e){const t=[...this.billingAddresses.map(e=>({value:e.id??"",label:fC(e)})),{value:Tw,label:"Add new billing address"}],r=this.billingAddresses.find(e=>e.id===this.bankBillingAddressValue);return r&&!this.bankBillingAddressSelectorExpanded?Ty`
        <div class="billing-address-summary field field-full">
          <div class="billing-address-summary-heading">
            <span class="billing-address-summary-label field-label"
              >Billing address</span
            >
            ${qx({label:"Change",action:"change-bank-billing-address",disabled:e})}
          </div>
          <p class="billing-address-summary-value">
            ${fC(r)}
          </p>
        </div>
      `:_x({id:"bank-billing-address",name:"bankBillingAddress",label:"Billing address",value:this.bankBillingAddressValue,options:t,span:"full",variant:"card-form",disabled:e})}renderLegacyManualBankAccountScreen(){const e="save-bank-account"===this.pendingAction,t=Object.values(this.legacyBankAccountEncryption).some(e=>"encrypting"===e.status);return this.renderWidgetShell({title:"Enter bank details",backAction:this.manualBankAccountExitAction(),backDisabled:e,showClose:!1,showDivider:!1,busy:e,overlay:e?bE({title:"Saving bank account",helper:"Securely saving your bank account, please wait."}):void 0,content:Ty`
        <form
          class="payment-flow card-form-screen"
          data-submit-action="save-bank-account"
        >
          ${this.bankAccountSubmitError?zx({variant:"danger",message:this.bankAccountSubmitError}):""}
          <commerce-hub-bank-account-jsonforms
            class="bank-account-jsonforms"
            .schema=${o$}
            .uischema=${oC}
            .data=${this.legacyBankAccountDraft}
            .renderers=${bk}
            .readonly=${e}
            .config=${{draft:this.legacyBankAccountDraft,errors:this.bankAccountValidationAttempted?this.legacyBankAccountDraftErrors:{},encryption:this.legacyBankAccountEncryption,disabled:e}}
            .additionalErrors=${this.bankAccountValidationAttempted?A$(this.legacyBankAccountDraftErrors):[]}
            .validationMode=${this.bankAccountValidationAttempted?"ValidateAndShow":"ValidateAndHide"}
          ></commerce-hub-bank-account-jsonforms>
          <div class="primitive-footer card-form-primary">
            ${Ox({label:e?"Saving bank account":"Save bank account",action:"save-bank-account",type:"submit",loading:e,disabled:e||t||this.hasBlockingLegacyBankValidationErrors()||(r=this.legacyBankAccountDraft,n=o$,!(n.required??[]).every(e=>!s$(e)||Boolean(r[e].trim())))})}
          </div>
        </form>
      `});var r,n}renderBankOutcomeScreen(){const e=$E(this.bankOutcomeSource),t="declined"===e.kind||"pending"===e.kind;return this.renderWidgetShell({title:e.title,headerAction:t?qx({label:"Done",action:"done-bank-outcome"}):void 0,showClose:!1,showDivider:!1,content:Ty`
        <div class="verification-outcome-flow">
          ${zx({variant:e.variant,message:e.message})}
          ${this.bankOutcomeSource?RE(this.bankOutcomeSource):""}
          ${t?"":Ty`
                <div class="primitive-footer">
                  ${"verified"===e.kind?Ox({label:"Continue",action:"continue-bank-outcome"}):"pending"===e.kind?Ox({label:"Done",action:"done-bank-outcome"}):Ty`
                        ${Ox({label:this.bankLinkLoading?"Retrying":"Try again",action:"retry-bank-provider",loading:this.bankLinkLoading,disabled:this.bankLinkLoading})}
                        ${qx({label:"Use a different account",action:"use-different-bank-account",disabled:this.bankLinkLoading})}
                      `}
                </div>
              `}
        </div>
      `})}getOtpInputs(){return[...this.renderRoot.querySelectorAll(".otp-input")]}getRequiredInfoSsnInputs(e){return[...this.renderRoot.querySelectorAll(".required-info-ssn-input")].filter(t=>t.dataset.requiredInfoDocKey===e)}storeRequiredInfoSsnInput(e){const t=e.dataset.requiredInfoDocKey;if(!t)return;const r=this.getRequiredInfoSsnInputs(t),n=r.indexOf(e),i=Qk(Number(e.dataset.requiredInfoSsnSegment)),o=Zk(e.value);if(!(n<0)){if(o.length>i){const e=this.writeRequiredInfoSsnDigits(r,n,o);return this.syncRequiredInfoSsnValue(t,r),void this.focusRequiredInfoSsnInput(r,e)}e.value=o.slice(0,i),this.syncRequiredInfoSsnValue(t,r),e.value.length>=i&&this.focusRequiredInfoSsnInput(r,n+1)}}pasteRequiredInfoSsnInput(e,t){const r=t.dataset.requiredInfoDocKey;if(!r)return;const n=e,i="function"==typeof n.clipboardData?.getData?n.clipboardData.getData("text"):"",o=Zk(i);if(!o)return;e.preventDefault();const a=this.getRequiredInfoSsnInputs(r),s=a.indexOf(t);if(s<0)return;const c=this.writeRequiredInfoSsnDigits(a,s,o);this.syncRequiredInfoSsnValue(r,a),this.focusRequiredInfoSsnInput(a,c)}writeRequiredInfoSsnDigits(e,t,r){let n=0,i=t;return e.forEach((e,o)=>{if(o<t)return;const a=Qk(Number(e.dataset.requiredInfoSsnSegment)),s=r.slice(n,n+a);e.value=s,s&&(i=o),n+=a}),i}syncRequiredInfoSsnValue(e,t){this.storeRequiredInfoValue(e,Zk(t.map(e=>e.value).join("")))}focusRequiredInfoSsnInput(e,t){e[Math.min(t,e.length-1)]?.focus()}syncOtpValueFromInputs(e=this.getOtpInputs()){this.otpValue=((e,t=6)=>Yk(e.join("")).slice(0,t))(e.map(e=>e.value)),this.otpErrorMessage=void 0,"OTP_VALIDATION_FAILED"===this.interactionResponse?.status&&this.setInteractionResponseFromSdk({...this.interactionResponse,status:"OTP_VALIDATION_PENDING"})}writeOtpDigits(e,t,r){const n=(({values:e,startIndex:t,value:r})=>{const n=[...e],i=Yk(r);let o=t;return i.slice(0,Math.max(n.length-t,0)).split("").forEach((e,r)=>{const i=t+r;i>=n.length||(n[i]=e,o=i)}),{values:n,lastWrittenIndex:o}})({values:e.map(e=>e.value),startIndex:t,value:r});return n.values.forEach((t,r)=>{e[r].value=t}),n.lastWrittenIndex}focusOtpInput(e,t,r=t){const n=e[t]??e[Math.max(0,Math.min(r,e.length-1))];n&&n.focus()}async showAddCardScreen(){this.clearDeletePaymentSourceConfirmation(),this.resetBankFlow(),this.cardFlowScreen="form",this.cardSubmitError=void 0,this.billingAddressSelectorExpanded=this.cardDraft.billingAddressValue===Tw||!this.billingAddresses.length;const e=this.interactionResponse?.interactionId,t=Boolean(this.interactionResponse?.selectedSource||this.interactionResponse?.paymentSources?.length);if(e&&t&&!this.billingAddresses.length&&void 0===this.interactionResponse?.billerAddress)try{await this.fetchInteraction(e)}catch(e){}this.focusAfterUpdate("#card-label")}async showManualBankAccountScreen(){const e=this.requireInteractionId(),t=this.interactionResponse?.country?.trim();this.clearDeletePaymentSourceConfirmation(),this.resetBankFlow();const r=++this.bankAccountConfigRequestToken;if(this.bankFlowScreen="manual-config-loading",!e)return this.bankAccountConfigError="CommerceHub Connect requires an interaction response before bank details can load.",void(this.bankFlowScreen="manual-config-error");if(!t)return this.bankAccountConfigError="Bank account details are not available because the interaction response is missing a country.",void(this.bankFlowScreen="manual-config-error");try{const i=await this.fetchManualBankAccountCountryConfig(e,t);if(!this.isCurrentManualBankAccountConfigRequest(r,e,t))return void(r===this.bankAccountConfigRequestToken&&this.resetBankFlow());const o=i.instrumentSchemas;if(void 0===o||Array.isArray(o)&&0===o.length)return void this.initializeLegacyManualBankAccountScreen();const a=(n=o,(Array.isArray(n)?n:yk(n)&&Array.isArray(n.instrumentSchemas)?n.instrumentSchemas:[]).filter(Ik));if(0===a.length||0===Vk(a).length)return this.bankAccountConfigError="No instrument schemas are available for this country. Try again.",void(this.bankFlowScreen="manual-config-error");this.bankAccountInstrumentSchemas=a,this.bankAccountConfigError=void 0,this.bankFlowScreen="manual-schema-selection"}catch(n){if(!this.isCurrentManualBankAccountConfigRequest(r,e,t))return void(r===this.bankAccountConfigRequestToken&&this.resetBankFlow());this.bankAccountConfigError=oE(n),this.bankFlowScreen="manual-config-error"}var n}manualBankAccountExitAction(){return MC(this.interactionResponse?.country)?"back-to-bank-provider":"back-to-payment-methods"}isCurrentManualBankAccountConfigRequest(e,t,r){return e===this.bankAccountConfigRequestToken&&Boolean(t)&&Boolean(r)&&this.interactionResponse?.interactionId===t&&this.interactionResponse?.country?.trim()===r}initializeManualBankAccountScreen(){const e=this.bankAccountInstrumentSchemas.find(e=>e.bavSupportedCode===this.selectedBankAccountInstrumentSchemaCode);e&&(this.bankAccountValidationAttempted=!1,this.reconcileBankBillingAddressSelection(),this.manualBankAccountFormMode="instrument-schema",this.bankFlowScreen="manual",this.configureManualBankAccountForm(e,!0),this.bankAccountSubmitError=void 0,this.bankAccountFormI18n={translateError:Bk(e)},this.bankAccountConfigError=void 0)}configureManualBankAccountForm(e,t){const r=this.bankBillingAddressValue===Tw?e:(e=>{const t=Object.fromEntries(Object.entries(e.properties).filter(([e])=>"address"!==e&&!e.startsWith("address."))),r=e.required.filter(e=>"address"!==e&&!e.startsWith("address."));return{...e,properties:t,required:r}})(e),n=this.interactionResponse?.country,i=((e,t)=>{Ok(e);const r={};for(const t of Object.keys(e.properties)){let e=r;for(const r of jk(t).slice(0,-1)){const t=wk(e,r)?e[r]:void 0,n=yk(t)?t:{};e[r]=n,e=n}}const n=kk(t);if(wk(e.properties,"address.country")&&void 0!==n){const e=yk(r.address)?r.address:{};e.country=n,r.address=e}return r})(r,n);var o;this.bankAccountFormSchema=this.instrumentSchemaWithBillingAddressControl(((e,t)=>{Ok(e);const r={type:"object",properties:{}},n=kk(t);for(const[t,i]of Object.entries(e.properties))zk(r,jk(t),i,"address.country"===t&&void 0!==n);for(const t of e.required)Nk(r,jk(t));return r})(r,n)),this.bankAccountFormUiSchema=((e,t)=>{const r=e,n=r.elements??[],i=n.filter(e=>(e=>e.scope??"")(e).startsWith("#/properties/address/")),o=n.filter(e=>!i.includes(e)),a={type:"Control",scope:t};return{...r,elements:[...o,a,...i]}})((Ok(o=r),{type:"VerticalLayout",elements:Lk(o).map(e=>({type:"Control",scope:`#/properties/${jk(e).map(Tk).join("/properties/")}`}))}),"#/properties/__bankBillingAddress"),this.bankAccountFormData=t?{...i,[Uk]:this.bankBillingAddressValue}:{...i,...this.bankAccountFormData,[Uk]:this.bankBillingAddressValue},this.bankAccountFormValid=!1}instrumentSchemaWithBillingAddressControl(e){return{...e,properties:{...e.properties??{},[Uk]:{type:"string",title:"Billing address"}}}}updateBankBillingAddress(e){if(!(e===Tw||this.billingAddresses.some(t=>t.id===e)))return;this.bankBillingAddressValue=e,this.bankBillingAddressSelectorExpanded=e===Tw,this.bankAccountSubmitError=void 0;const t=this.bankAccountInstrumentSchemas.find(e=>e.bavSupportedCode===this.selectedBankAccountInstrumentSchemaCode);t&&"instrument-schema"===this.manualBankAccountFormMode&&this.configureManualBankAccountForm(t,!1)}reconcileBankBillingAddressSelection(){if(this.bankBillingAddressValue===Tw)return void(this.bankBillingAddressSelectorExpanded=!0);this.billingAddresses.some(e=>e.id===this.bankBillingAddressValue)||(this.bankBillingAddressValue=this.billingAddresses[0]?.id??Tw,this.bankBillingAddressSelectorExpanded=this.bankBillingAddressValue===Tw)}initializeLegacyManualBankAccountScreen(){this.bankAccountValidationAttempted=!1,this.manualBankAccountFormMode="legacy",this.bankFlowScreen="manual",this.legacyBankAccountDraft={accountNickname:"",routingNumber:"",accountNumber:"",confirmAccountNumber:""},this.legacyBankAccountDraftErrors={},this.legacyBankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},confirmAccountNumber:{status:"idle",normalizedValue:""}},this.bankAccountSubmitError=void 0,this.bankAccountConfigError=void 0}clearManualBankAccountForm(){this.manualBankAccountFormMode=void 0,this.bankAccountValidationAttempted=!1,this.bankAccountFormSchema=void 0,this.bankAccountFormUiSchema=void 0,this.bankAccountFormData={},this.bankAccountFormValid=!1,this.bankAccountSubmitError=void 0,this.bankAccountFormI18n=void 0,this.legacyBankAccountDraft={accountNickname:"",routingNumber:"",accountNumber:"",confirmAccountNumber:""},this.legacyBankAccountDraftErrors={},this.legacyBankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},confirmAccountNumber:{status:"idle",normalizedValue:""}}}updateTransferDraftField(e,t){const r=Xk({...this.transferDraft,[e]:t});this.transferDraft=r,this.transferDraftErrors=ex(r,HC(this.interactionResponse)),this.transferFlowScreen="form",this.transferSubmitError=void 0,this.transferSubmitSuccess=!1}visibleCardDraftError(e){return this.cardValidationAttempted?this.cardDraftErrors[e]:void 0}hasBlockingTransferValidationErrors(){return!!this.transferValidationAttempted&&Object.values(this.transferDraftErrors).some(e=>Boolean(e))}hasBlockingCardValidationErrors(){return!!this.cardValidationAttempted&&Object.values(this.cardDraftErrors).some(e=>Boolean(e))}hasBlockingConfigBankValidationErrors(){return this.bankAccountValidationAttempted&&!this.bankAccountFormValid}hasBlockingLegacyBankValidationErrors(){return!!this.bankAccountValidationAttempted&&Object.values(this.legacyBankAccountDraftErrors).some(e=>Boolean(e))}hasBlockingRequiredInfoValidationErrors(){return!(!this.requiredInfoValidationAttempted||!this.requiredInfoSource)&&xE(this.requiredInfoSource).some((e,t)=>Boolean(this.requiredInfoValidationError(e,t)))}updateLegacyBankAccountDraftField(e,t){if("legacy"!==this.manualBankAccountFormMode)return;const r=$$({draft:this.legacyBankAccountDraft,errors:this.legacyBankAccountDraftErrors,encryption:this.legacyBankAccountEncryption,schema:o$,field:e,value:t});this.legacyBankAccountDraft=r.draft,this.legacyBankAccountEncryption=r.encryption,this.legacyBankAccountDraftErrors=r.errors,this.bankAccountSubmitError=void 0}toggleCardFieldReveal(e){const t=new Set(this.revealedCardFields);t.has(e)?t.delete(e):t.add(e),this.revealedCardFields=t}armCardFieldLastCharReveal(e){const t=new Set(this.cardFieldsRevealingLastChar);t.add(e),this.cardFieldsRevealingLastChar=t;const r=this.cardRevealTimeoutIds[e];void 0!==r&&window.clearTimeout(r),this.cardRevealTimeoutIds[e]=window.setTimeout(()=>{this.clearCardFieldLastCharReveal(e)},1500)}clearCardFieldLastCharReveal(e){const t=this.cardRevealTimeoutIds[e];if(void 0!==t&&(window.clearTimeout(t),delete this.cardRevealTimeoutIds[e]),this.cardFieldsRevealingLastChar.has(e)){const t=new Set(this.cardFieldsRevealingLastChar);t.delete(e),this.cardFieldsRevealingLastChar=t}}clearAllCardFieldLastCharReveal(){Object.values(this.cardRevealTimeoutIds).forEach(e=>{void 0!==e&&window.clearTimeout(e)}),this.cardRevealTimeoutIds={},this.cardFieldsRevealingLastChar.size>0&&(this.cardFieldsRevealingLastChar=new Set)}updateCardDraftField(e,t){const r=((e,t)=>"cardNumber"===e?qw(t):"expirationDate"===e?Uw(t):"cvv"===e?Dw(t).slice(0,4):t)(e,t),n={...this.cardDraft,[e]:r};if(this.cardDraft=n,"billingAddressValue"===e&&(this.billingAddressSelectorExpanded=r===Tw),this.cardSubmitError=void 0,this.cardValidationAttempted){const t=Ww(Hw(n))[e],r=Jw(this.cardDraftErrors,e);this.cardDraftErrors=t?{...r,[e]:t}:r}Pw(e)&&(this.cardEncryption={...this.cardEncryption,[e]:Yw(this.cardEncryption[e],Bw(e,r))})}async encryptCardField(e,t){this.updateCardDraftField(e,t);const r=Bw(e,t),n=((e,t)=>"cardNumber"===e?Xw(t)?void 0:"Enter a valid card number.":e$(t)?void 0:"Enter a valid CVC.")(e,t);if(!r){const t=Jw(this.cardDraftErrors,e);return this.cardDraftErrors=this.cardValidationAttempted&&n?{...t,[e]:n}:t,void(this.cardEncryption={...this.cardEncryption,[e]:{status:"idle",normalizedValue:""}})}if(n)return this.cardDraftErrors={...Jw(this.cardDraftErrors,e),[e]:n},void(this.cardEncryption={...this.cardEncryption,[e]:Yw(this.cardEncryption[e],r)});const i=this.cardEncryption[e];if("encrypting"!==i.status&&"encrypted"!==i.status||i.normalizedValue!==r){this.cardDraftErrors=Jw(this.cardDraftErrors,e),this.cardEncryption={...this.cardEncryption,[e]:{status:"encrypting",normalizedValue:r}};try{const t=await this.encryptSensitiveSourceValue(r);if(Bw(e,this.cardDraft[e])!==r)return;this.cardDraftErrors=Jw(this.cardDraftErrors,e),this.cardEncryption={...this.cardEncryption,[e]:{status:"encrypted",normalizedValue:r,encryptedValue:t}}}catch(t){if(Bw(e,this.cardDraft[e])!==r)return;this.cardDraftErrors={...Jw(this.cardDraftErrors,e),[e]:Gw(e)},this.cardEncryption={...this.cardEncryption,[e]:{status:"failed",normalizedValue:r}}}}}async encryptLegacyBankAccountField(e,t){if("legacy"!==this.manualBankAccountFormMode)return;const r=this.legacyBankAccountEncryption[e];if(u$(t,r))return this.legacyBankAccountDraft={...this.legacyBankAccountDraft,[e]:t},void(this.bankAccountSubmitError=void 0);this.updateLegacyBankAccountDraftField(e,t);const n=d$(t);if(!n){const t={...this.legacyBankAccountEncryption,[e]:{status:"idle",normalizedValue:""}};return this.legacyBankAccountEncryption=t,void(this.legacyBankAccountDraftErrors=v$(h$(this.legacyBankAccountDraft,t),o$))}if("encrypting"!==r.status&&"encrypted"!==r.status||r.normalizedValue!==n){this.legacyBankAccountDraftErrors=((e,t)=>{const r={...e};return delete r[t],r})(this.legacyBankAccountDraftErrors,e),this.legacyBankAccountEncryption={...this.legacyBankAccountEncryption,[e]:{status:"encrypting",normalizedValue:n}};try{const t=await this.encryptSensitiveSourceValue(n);if("legacy"!==this.manualBankAccountFormMode||d$(this.legacyBankAccountDraft[e])!==n)return;const r={...this.legacyBankAccountDraft,[e]:l$(n)},i={...this.legacyBankAccountEncryption,[e]:{status:"encrypted",normalizedValue:n,encryptedValue:t}};this.legacyBankAccountDraft=r,this.legacyBankAccountEncryption=i,this.legacyBankAccountDraftErrors=v$(h$(r,i),o$)}catch(t){if("legacy"!==this.manualBankAccountFormMode||d$(this.legacyBankAccountDraft[e])!==n)return;const r={...this.legacyBankAccountEncryption,[e]:{status:"failed",normalizedValue:n}};this.legacyBankAccountEncryption=r,this.legacyBankAccountDraftErrors={...v$(h$(this.legacyBankAccountDraft,r),o$),[e]:w$(e)}}}}async encryptSensitiveSourceValue(e){const t=this.requireSourceCreateContext();return mx(e,t.publicKey)}trackCardFieldEncryption(e,t){const r=this.encryptCardField(e,t);this.cardEncryptionTasks[e]=r;const n=()=>{this.cardEncryptionTasks[e]===r&&delete this.cardEncryptionTasks[e]};return r.then(n,n),r}async ensureSensitiveCardFieldsEncrypted(){await Promise.all(["cardNumber","cvv"].map(async e=>{const t=this.cardEncryptionTasks[e];t&&await t;const r=this.cardDraft[e],n=Bw(e,r);if(!n)return;const i=this.cardEncryption[e];"encrypted"===i.status&&i.normalizedValue===n&&Boolean(i.encryptedValue)||await this.trackCardFieldEncryption(e,r)}))}async saveCard(){if("save-card"===this.pendingAction)return;const e=this.requireInteractionId();if(!e)return;this.cardValidationAttempted=!0,await this.ensureSensitiveCardFieldsEncrypted();const t=Hw(this.cardDraft),r={...Zw(t,this.cardEncryption),...Ww(t)};if(Object.keys(r).length>0)return this.cardDraft=t,this.cardDraftErrors=r,void(this.cardSubmitError=void 0);let n;try{n=this.requireSourceCreateContext()}catch(e){return this.cardDraft=t,this.cardDraftErrors={},void(this.cardSubmitError=oE(e))}this.pendingAction="save-card",this.cardDraft=t,this.cardDraftErrors={},this.cardSubmitError=void 0;try{const r=Qw("cardNumber",t.cardNumber,this.cardEncryption),i=Qw("cvv",t.cvv,this.cardEncryption),o=t$(t.expirationDate);if(!o)return void(this.cardDraftErrors={expirationDate:"Enter a valid expiration date."});const a=await this.resolveBillingAddressId(e,t),s={id:"",tenderType:"CARD",name:t.name,billingAddressId:a,card:{nameOnCard:t.fullName,cardNumber:r,cvv:i,cardNumberEncrypted:r,cvvEncrypted:i,expirationMonth:o.month,expirationYear:o.year,network:r$(t.cardNumber)}},c=await this.requestCommerceHubJson("/interaction/source/card",e,{method:"POST",headers:this.createSourceCreateHeaders(e,n,{"Content-Type":"application/json"}),body:JSON.stringify(s),credentials:"include"});this.assertCurrentInteraction(e);const d=this.sourceWithVerificationResponse(mC(s,t.cardNumber),c);yC(c,"The card creation response did not include a source id.");const u=this.interactionResponseWithAddedSource(e,d);this.cardFlowScreen=void 0,this.cardDraft=Mw(),this.cardDraftErrors={},this.cardValidationAttempted=!1,this.cardEncryption={cardNumber:{status:"idle",normalizedValue:""},cvv:{status:"idle",normalizedValue:""}},this.cardSubmitError=void 0,this.setInteractionResponseFromSdk(u),this.emitSdkEvent(Zx,d);const l=await this.refreshInteractionAfterMutation(e),h=this.findPaymentSourceInInteraction(l,d.id)??d;this.showAddedPaymentSourceStatus(h)}catch(t){if(this.isStaleMutationFailure(e,t))return;this.cardSubmitError=oE(t),this.cardFlowScreen="error"}finally{this.clearPendingMutationAction(e,"save-card")}}async saveManualBankAccount(){if("legacy"===this.manualBankAccountFormMode)return void await this.saveLegacyManualBankAccount();if("save-bank-account"===this.pendingAction)return;if(this.bankAccountValidationAttempted=!0,!this.bankAccountFormValid)return;const e=this.requireInteractionId(),t=this.bankAccountInstrumentSchemas.find(e=>e.bavSupportedCode===this.selectedBankAccountInstrumentSchemaCode);if(!e||!t)return;let r;try{r=this.requireSourceCreateContext()}catch(e){return void(this.bankAccountSubmitError=oE(e))}this.pendingAction="save-bank-account",this.bankAccountSubmitError=void 0;try{const n=Gk({data:this.bankAccountFormData,schema:t,addressSelection:this.bankBillingAddressValue===Tw?{kind:"new"}:{kind:"existing",id:this.bankBillingAddressValue},id:aE()}),i=await(async(e,t)=>{const r=await Promise.all(Hk.flatMap(r=>{const n=Wk(e[r]);return n?[t(n).then(e=>[r,e])]:[]})),n=Object.fromEntries(r),i=n.accountNumber;return{...e,...n,..."string"==typeof i&&i.trim()?{accountNumberReEntered:i}:{}}})(n,e=>mx(e,r.publicKey)),o=await this.requestCommerceHubJson(`/interaction/source/v2/ach?currencyCode=${encodeURIComponent(n.currencyCode)}`,e,{method:"POST",headers:this.createSourceCreateHeaders(e,r,{"Content-Type":"application/json"}),body:JSON.stringify(i),credentials:"include"});this.assertCurrentInteraction(e);const a=wC(o);let s,c;if(a)c=this.sourceWithVerificationResponse(bC(n),a);else{const t=await this.resolveConfigDrivenBankSourceFromInteraction(e,n);c=t.source,s=t.interactionResponse}const d=this.interactionResponseWithAddedSource(e,c);this.setInteractionResponseFromSdk(d),this.emitSdkEvent(Zx,c),this.resetBankFlow(),s??=await this.refreshInteractionAfterMutation(e);const u=this.findPaymentSourceInInteraction(s,c.id)??c;this.showAddedPaymentSourceStatus(u)}catch(t){if(this.isStaleMutationFailure(e,t))return;this.bankAccountSubmitError=oE(t)}finally{this.clearPendingMutationAction(e,"save-bank-account")}}async resolveConfigDrivenBankSourceFromInteraction(e,t){const r=await this.fetchFreshInteraction(e),n=(r.paymentSources??[]).filter(PE).find(e=>e.id?.trim()===t.id),i=n?.id?.trim();if(!n||!i)throw new Error("The bank account was created but could not be resolved from the interaction.");const o=bC(t);return{source:{...n,...o,id:i,verificationInfo:n.verificationInfo,bankAccount:{...n.bankAccount,...o.bankAccount}},interactionResponse:r}}async saveLegacyManualBankAccount(){if("save-bank-account"===this.pendingAction)return;const e=this.requireInteractionId();if(!e||"legacy"!==this.manualBankAccountFormMode)return;this.bankAccountValidationAttempted=!0;const t=h$(this.legacyBankAccountDraft,this.legacyBankAccountEncryption),r=v$(t,o$);if(Object.keys(r).length>0)return this.legacyBankAccountDraft=m$(this.legacyBankAccountDraft,this.legacyBankAccountEncryption),this.legacyBankAccountDraftErrors=r,void(this.bankAccountSubmitError=void 0);let n;try{n=this.requireSourceCreateContext()}catch(e){return this.legacyBankAccountDraft=m$(this.legacyBankAccountDraft,this.legacyBankAccountEncryption),this.legacyBankAccountDraftErrors={},void(this.bankAccountSubmitError=oE(e))}this.pendingAction="save-bank-account",this.legacyBankAccountDraft=m$(this.legacyBankAccountDraft,this.legacyBankAccountEncryption),this.legacyBankAccountDraftErrors={},this.bankAccountSubmitError=void 0;try{await this.encryptChangedLegacyBankAccountFields();const t=h$(this.legacyBankAccountDraft,this.legacyBankAccountEncryption),r=v$(t,o$);if(Object.keys(r).length>0)return void(this.legacyBankAccountDraftErrors=r);const s=k$("routingNumber",this.legacyBankAccountDraft,this.legacyBankAccountEncryption),c=k$("accountNumber",this.legacyBankAccountDraft,this.legacyBankAccountEncryption),d=k$("confirmAccountNumber",this.legacyBankAccountDraft,this.legacyBankAccountEncryption),u=(i="accountNumber",o=this.legacyBankAccountEncryption,a=t,C$(o[i].normalizedValue||a[i])),l={id:"",tenderType:"BANK_ACCOUNT",productCode:"POACH",name:x$(this.legacyBankAccountDraft.accountNickname,u),bankAccount:{routingNumber:s,accountNumber:c,accountNumberReEntered:d,routingNumberEncrypted:s,accountNumberEncrypted:c,asset:{type:"CURRENCY",id:"USD"}}},h=await this.requestCommerceHubJson("/interaction/source/ach",e,{method:"POST",headers:this.createSourceCreateHeaders(e,n,{"Content-Type":"application/json"}),body:JSON.stringify(l),credentials:"include"});this.assertCurrentInteraction(e);const f=this.sourceWithVerificationResponse(gC(l,u),h);yC(h,"The bank account creation response did not include a source id.");const m=this.interactionResponseWithAddedSource(e,f);this.setInteractionResponseFromSdk(m),this.emitSdkEvent(Zx,f),this.resetBankFlow();const p=await this.refreshInteractionAfterMutation(e),v=this.findPaymentSourceInInteraction(p,f.id)??f;this.showAddedPaymentSourceStatus(v)}catch(t){if(this.isStaleMutationFailure(e,t))return;this.bankAccountSubmitError=oE(t)}finally{this.clearPendingMutationAction(e,"save-bank-account")}var i,o,a}async encryptChangedLegacyBankAccountFields(){for(const e of["routingNumber","accountNumber","confirmAccountNumber"]){const t=this.legacyBankAccountDraft[e],r=this.legacyBankAccountEncryption[e];if(u$(t,r))continue;const n=d$(t);if(!n)continue;"encrypted"===r.status&&r.normalizedValue===n&&Boolean(r.encryptedValue)||await this.encryptLegacyBankAccountField(e,t)}}reviewTransfer(){if("transfer"===this.pendingAction)return;this.transferValidationAttempted=!0;const e=HC(this.interactionResponse),t=Xk(this.transferDraft),r=ex(t,e);if(Object.keys(r).length>0)return this.transferDraft=t,this.transferDraftErrors=r,this.transferSubmitError=void 0,void(this.transferSubmitSuccess=!1);this.transferDraft=t,this.transferDraftErrors={},this.transferSubmitError=void 0,this.transferSubmitSuccess=!1,this.transferFlowScreen="confirm"}async submitTransfer(){if("transfer"===this.pendingAction)return;const e=this.requireInteractionId();if(!e)return;const t=HC(this.interactionResponse),r=Xk(this.transferDraft),n=ex(r,t);if(Object.keys(n).length>0)return this.transferDraft=r,this.transferDraftErrors=n,this.transferFlowScreen="form",this.transferSubmitError=void 0,void(this.transferSubmitSuccess=!1);this.pendingAction="transfer",this.transferDraft=r,this.transferDraftErrors={},this.transferSubmitError=void 0,this.transferSubmitSuccess=!1;try{const t=await this.requestCommerceHubJson("/interaction/source/native/transfer",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fromSourceId:r.fromSourceId,toSourceId:r.toSourceId,amount:Number(r.amount),asset:{type:"CURRENCY",id:"USD"}}),credentials:"include"});this.transferFlowScreen="form",this.transferValidationAttempted=!1,this.transferSubmitSuccess=!0,this.emitSdkEvent(tC,t)}catch(e){this.transferSubmitError=oE(e)}finally{this.pendingAction=void 0}}async resolveBillingAddressId(e,t){if(t.billingAddressValue!==Tw)return t.billingAddressValue;const r=(e=>({id:i$(),recipientNameOrAddress:e.fullName,country:e.country,street:e.addressLine1,houseNumberOrName:e.addressLine2||void 0,city:e.city,stateOrProvince:e.state,postalCode:e.zip}))(t),n=await this.requestCommerceHubJson("/interaction/billing-address",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),credentials:"include"}),i=n.value?.trim();if(!i)throw new Error("The billing address response did not include an id.");return i}async verifyOtp(){if("verify-otp"===this.pendingAction)return;if(this.otpValue.length<6)return;const e=this.requireInteractionId();if(e){this.pendingAction="verify-otp";try{const t=await this.createSdkClient(e).POST("/interaction/otp/validate",{body:{otp:this.otpValue,channel:"EMAIL"}}),r=iE(t);this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk(r)}catch(e){this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk({...this.interactionResponse,status:"OTP_VALIDATION_FAILED"})}finally{this.pendingAction=void 0}}}async resendOtp(){if("resend-otp"===this.pendingAction)return;const e=this.requireInteractionId();if(e){this.pendingAction="resend-otp";try{const t=await this.createSdkClient(e).POST("/interaction/otp/send/email"),r=iE(t);this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk(r)}catch(e){}finally{this.pendingAction=void 0}}}async attachPaymentSource(e){if("attach-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),r=this.findPaymentSourceById(e);if(t&&r&&hx(r)){this.selectedPaymentSourceId=e,this.paymentSourceView="list",this.attachmentError=void 0,this.pendingAction="attach-payment-source";try{const n=await this.requestCommerceHubJson(`/interaction/source/${encodeURIComponent(e)}/attach`,t,{method:"POST",credentials:"include"});this.assertCurrentInteraction(t);const i=nE(this.interactionResponse??{interactionId:t},n,e);this.setInteractionResponseFromSdk(i);const o=await this.refreshInteractionAfterMutation(t),a=this.findPaymentSourceInInteraction(o,e)??this.findPaymentSourceInInteraction(i,e)??r;this.selectedPaymentSourceId=a.id,this.paymentSourceView="list",this.emitSdkEvent(Jx,a),this.focusAfterUpdate(".payment-method-radio:checked")}catch(e){if(this.isStaleMutationFailure(t,e))return;this.paymentSourceView="list",this.attachmentError=oE(e)||"We couldn't save this payment method. Please try again."}finally{this.clearPendingMutationAction(t,"attach-payment-source")}}}async markPaymentSourceDefault(e){if("attach-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),r=this.findPaymentSourceById(e);if(t&&r&&(e=>"VERIFIED"===e.verificationInfo?.status)(r)){this.selectedPaymentSourceId=e,this.paymentSourceView="list",this.attachmentError=void 0,this.pendingAction="attach-payment-source";try{await this.requestCommerceHubJson(`/interaction/source/${encodeURIComponent(e)}`,t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isDefault:!0}),credentials:"include"}),this.assertCurrentInteraction(t);const n=this.interactionResponse??{interactionId:t},i=nE(n,{...n,status:"PAYMENT_SOURCE_ATTACHED"},e);this.setInteractionResponseFromSdk(i);const o=await this.refreshInteractionAfterMutation(t),a=this.findPaymentSourceInInteraction(o,e)??this.findPaymentSourceInInteraction(i,e)??r;this.selectedPaymentSourceId=a.id,this.paymentSourceView="list"}catch(e){if(this.isStaleMutationFailure(t,e))return;this.paymentSourceView="list",this.attachmentError=oE(e)||"We couldn't update the default payment method. Please try again."}finally{this.clearPendingMutationAction(t,"attach-payment-source")}}}async verifySavedPaymentSource(e){if("verify-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),r=this.findPaymentSourceById(e);if(t&&r){if(TE(r))return this.savedSourceVerificationSource=void 0,this.savedSourceVerificationFailed=!1,this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",void this.showRequiredInfoSource(r);if("NOT_VERIFIED"===r.verificationInfo?.status){this.savedSourceVerificationSource=void 0,this.savedSourceVerificationFailed=!1,this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",this.pendingAction="verify-payment-source";try{const n=await this.verifyPaymentSourceStep1(t,{...r,id:e}),i=mE({...this.interactionResponse??{interactionId:t},selectedSource:this.interactionResponse?.selectedSource,status:sC},n);if(this.setInteractionResponseFromSdk(i),this.emitSdkEvent(Qx,n),TE(n))return void this.showRequiredInfoSource(n);if("VERIFIED"===n.verificationInfo?.status)return this.pendingAction=void 0,this.selectedPaymentSourceId=hx(n)?n.id?.trim()||e:void 0,void(this.paymentSourceView="list");this.savedSourceVerificationSource=n,this.savedSourceVerificationFailed=!1}catch(e){this.savedSourceVerificationSource=r,this.savedSourceVerificationFailed=!0}finally{"verify-payment-source"===this.pendingAction&&(this.pendingAction=void 0)}}}}async deletePaymentSource(e){if("delete-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),r=this.findPaymentSourceById(e);if(t&&r)if("PAYMENT_SOURCE_ATTACHED"!==this.interactionResponse?.status||this.interactionResponse.selectedSource?.id!==e)if(this.deleteConfirmationPaymentSourceId===e){this.clearDeletePaymentSourceConfirmation(),this.pendingAction="delete-payment-source";try{await this.requestCommerceHubJson(`/interaction/source/${encodeURIComponent(e)}`,t,{method:"DELETE",credentials:"include"}),await this.refreshInteractionAfterMutation(t),this.emitSdkEvent(Xx,e)}catch(e){if(this.isStaleMutationFailure(t,e))return}finally{this.clearPendingMutationAction(t,"delete-payment-source")}}else this.armDeletePaymentSourceConfirmation(e);else this.clearDeletePaymentSourceConfirmation()}armDeletePaymentSourceConfirmation(e){this.clearDeletePaymentSourceConfirmation(),this.deleteConfirmationPaymentSourceId=e,this.deleteConfirmationTimeoutId=window.setTimeout(()=>{this.deleteConfirmationPaymentSourceId===e&&this.clearDeletePaymentSourceConfirmation()},1e4)}clearDeletePaymentSourceConfirmation(){void 0!==this.deleteConfirmationTimeoutId&&(window.clearTimeout(this.deleteConfirmationTimeoutId),this.deleteConfirmationTimeoutId=void 0),this.deleteConfirmationPaymentSourceId=void 0}findPaymentSourceById(e){return(this.interactionResponse?.paymentSources??[]).find(t=>t.id===e)??(this.interactionResponse?.selectedSource?.id===e?this.interactionResponse.selectedSource:void 0)}findPaymentSourceInInteraction(e,t){return(e?.selectedSource?.id===t?e.selectedSource:void 0)??e?.paymentSources?.find(e=>e.id===t)}resetSavedSourceVerification(){this.savedSourceVerificationSource=void 0,this.savedSourceVerificationFailed=!1}showPaymentSourceList({refresh:e=!0}={}){this.clearDeletePaymentSourceConfirmation(),this.openPaymentSourceMenuId=void 0,this.paymentSourceView="list",this.addLauncherActive=!1,this.resetTransferFlow(),e?this.refreshPaymentSourcesForList().finally(()=>{this.focusPaymentSourceList()}):this.focusPaymentSourceList()}focusPaymentSourceList(){this.focusAfterUpdate('[data-action="open-add-payment-source"]','[data-action="toggle-payment-source-menu"]','[data-action="add-card"]','[data-action="add-bank-account"]')}shouldOpenPaymentSourceMenuAbove(e){const t=e?.closest(".primitive-stack"),r=e?.closest(".payment-method-row");if(!t||!r)return!1;const n=t.getBoundingClientRect(),i=r.getBoundingClientRect(),o=6*(Number.parseFloat(getComputedStyle(this).fontSize)||16),a=n.bottom-i.bottom,s=i.top-n.top;return a<o&&s>a}closeAddPaymentSourceSheet(){this.addLauncherActive=!1,this.focusAfterUpdate('[data-action="open-add-payment-source"]')}async refreshPaymentSourcesForList(){const e=this.interactionResponse?.interactionId;if(e)try{await this.fetchInteraction(e)}catch(e){}}async refreshInteractionAfterMutation(e){try{return await this.fetchFreshInteraction(e)}catch(e){if(e instanceof Sw)throw e;return}}assertCurrentInteraction(e){if(this.interactionResponse?.interactionId!==e)throw new Sw(e)}isStaleMutationFailure(e,t){return this.interactionResponse?.interactionId!==e||t instanceof Sw}clearPendingMutationAction(e,t){this.interactionResponse?.interactionId===e&&this.pendingAction===t&&(this.pendingAction=void 0)}fetchFreshInteraction(e){return this.interactionRefresh.fetchFresh(e,this.interactionRefreshOptions())}interactionResponseWithAddedSource(e,t){const r=t.id?.trim(),n=Boolean(r)&&vE(t),i={...this.interactionResponse??{interactionId:e},status:sC};return n?fE(i,t):mE({...i,selectedSource:this.interactionResponse?.selectedSource},t)}showAddedPaymentSourceStatus(e){const t=e.id?.trim();return this.resetSavedSourceVerification(),this.resetRequiredInfo(),TE(e)?(this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",void this.showRequiredInfoSource(e)):"VERIFIED"===e.verificationInfo?.status?(this.selectedPaymentSourceId=hx(e)?t:void 0,void(this.paymentSourceView="list")):(this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",PE(e)?(this.bankOutcomeSource=e,void(this.bankFlowScreen="outcome")):(this.savedSourceVerificationSource=e,void(this.savedSourceVerificationFailed=!1)))}showRequiredInfoSource(e){this.requiredInfoSource=e,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoFiles={},this.requiredInfoSubmitError=void 0,this.requiredInfoValidationAttempted=!1,this.pendingRequiredInfoDocKey=void 0}resetRequiredInfo(){this.requiredInfoSource=void 0,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoFiles={},this.requiredInfoSubmitError=void 0,this.requiredInfoValidationAttempted=!1,this.pendingRequiredInfoDocKey=void 0}firstRequiredInfoDocKey(){return OE(xE(this.requiredInfoSource))??CE(xE(this.requiredInfoSource)[0],0)}storeRequiredInfoValue(e,t){this.requiredInfoValues=((e,t,r)=>({...e,[t]:r}))(this.requiredInfoValues,e,t),this.requiredInfoSubmitError=void 0}storeRequiredInfoSelectedFile(e){if(!this.requiredInfoSource||!e)return void(this.pendingRequiredInfoDocKey=void 0);const t=this.pendingRequiredInfoDocKey??this.firstRequiredInfoDocKey(),r=(({files:e,fileNames:t,key:r,file:n})=>({files:{...e,[r]:n},fileNames:{...t,[r]:n.name}}))({files:this.requiredInfoFiles,fileNames:this.requiredInfoFileNames,key:t,file:e});this.requiredInfoFiles=r.files,this.requiredInfoFileNames=r.fileNames,this.requiredInfoSubmitError=void 0,this.pendingRequiredInfoDocKey=void 0}canSubmitRequiredInfo(){const e=this.requiredInfoSource;if(!e?.id?.trim())return!1;const t=xE(e),r=t.map((e,t)=>({doc:e,index:t})).filter(({doc:e})=>jE(e));return r.length>0?r.every(({doc:e,index:t})=>this.hasRequiredInfoValue(e,t)):t.some((e,t)=>this.hasRequiredInfoValue(e,t))}visibleRequiredInfoError(e,t){return this.requiredInfoValidationAttempted?this.requiredInfoValidationError(e,t):void 0}requiredInfoValidationError(e,t){return this.hasRequiredInfoValue(e,t)?"SOCIAL_SECURITY_NUMBER"===e.docType?(r=this.requiredInfoValues[CE(e,t)]??"",9===Zk(r).length?void 0:"Enter a 9-digit Social Security number."):void 0:jE(e)?NE(e):void 0;var r}async submitRequiredInfo(){if("submit-required-info"===this.pendingAction)return;const e=this.requireInteractionId(),t=this.requiredInfoSource,r=t?.id?.trim();if(e&&t&&r)if(this.requiredInfoValidationAttempted=!0,xE(t).some((e,t)=>Boolean(this.requiredInfoValidationError(e,t))))this.requiredInfoSubmitError=void 0;else if(this.canSubmitRequiredInfo()){this.pendingAction="submit-required-info",this.requiredInfoSubmitError=void 0;try{const n=xE(t),i=this.providedRequiredInfoEntries(n,!0),o=this.providedRequiredInfoEntries(n,!1);let a=t;i.length>0?(await this.uploadRequiredInfoEntries(e,r,i),a=this.sourceWithVerificationResponse(a,await this.verifyRequiredInfoStep2(e,r)),this.emitSdkEvent(Qx,a),TE(a)&&o.length>0&&(await this.uploadRequiredInfoEntries(e,r,o),a=this.sourceWithVerificationResponse(a,await this.verifyRequiredInfoStep2(e,r)),this.emitSdkEvent(Qx,a))):(await this.uploadRequiredInfoEntries(e,r,o),a=this.sourceWithVerificationResponse(a,await this.verifyRequiredInfoStep2(e,r)),this.emitSdkEvent(Qx,a));const s=mE({...this.interactionResponse??{interactionId:e},selectedSource:this.interactionResponse?.selectedSource,status:sC},a);if(this.setInteractionResponseFromSdk(s),"VERIFIED"===a.verificationInfo?.status)return this.resetRequiredInfo(),this.pendingAction=void 0,this.selectedPaymentSourceId=hx(a)?a.id?.trim()||r:void 0,void this.showPaymentSourceList({refresh:!0});if(TE(a))return this.requiredInfoSource=a,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoFiles={},void(this.requiredInfoValidationAttempted=!1);this.resetRequiredInfo(),this.savedSourceVerificationSource=a,this.savedSourceVerificationFailed=!1,this.selectedPaymentSourceId=a.id,this.paymentSourceView="list"}catch(e){this.requiredInfoSubmitError=oE(e)||"We could not submit the required information. Please try again."}finally{"submit-required-info"===this.pendingAction&&(this.pendingAction=void 0)}}else this.requiredInfoSubmitError="Add required or optional information before verifying."}providedRequiredInfoEntries(e,t){return e.map((e,t)=>({doc:e,index:t})).filter(({doc:e,index:r})=>(t?jE(e):!jE(e))&&this.hasRequiredInfoValue(e,r))}hasRequiredInfoValue(e,t){const r=CE(e,t);return EE(e)?((e,t)=>Boolean(e[t]?.trim()))(this.requiredInfoValues,r):((e,t)=>Boolean(e[t]))(this.requiredInfoFiles,r)}async uploadRequiredInfoEntries(e,t,r){for(const{doc:n,index:i}of r){const r=n.docType;if(!r)continue;const o=CE(n,i);if(EE(n)){const n=this.requiredInfoValues[o]?.trim();n&&await this.uploadRequiredInfoField(e,t,r,n);continue}const a=this.requiredInfoFiles[o];a&&await this.uploadRequiredInfoDocument(e,t,r,a)}}async verifyRequiredInfoStep2(e,t){return this.showMinimumVerificationOverlay("submit-required-info"),this.requestCommerceHubJson("/interaction/verify/step2",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:t}),credentials:"include"})}sourceWithVerificationResponse(e,t){const{sourceId:r,...n}=t,i=r?.trim();return{...e,id:i||e.id,verificationInfo:{...e.verificationInfo,...n}}}async uploadRequiredInfoField(e,t,r,n){await this.requestCommerceHubJson("/interaction/verify/uploadField",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({docType:r,value:t,docValue:n}),credentials:"include"})}async uploadRequiredInfoDocument(e,t,r,n){const i=new FormData;i.set("file",n),await this.requestCommerceHubJson(`/interaction/doc/upload/${encodeURIComponent(t)}/${encodeURIComponent(r)}`,e,{method:"POST",body:i,credentials:"include"})}async startPayByBankFlow(){if(this.bankLinkLoading)return;const e=this.requireInteractionId();if(!e)return;const t=++this.bankProviderRequestToken;this.bankFlowScreen="provider",this.bankOutcomeSource=void 0,this.bankLinkLoading=!0,this.ensurePayByBankProviderContainer(iC),await this.updateComplete;try{await this.launchPayByBankProvider(e,iC,t)}catch(r){if(!this.isCurrentPayByBankProviderRequest(t,e))return;console.error("CommerceHub Connect Pay by Bank failed",r),this.resetBankFlow(),this.showPaymentSourceList({refresh:!0})}finally{t===this.bankProviderRequestToken&&(this.cancelPayByBankLaunch=void 0,this.bankLinkLoading=!1)}}async startBankAccountFlow(){MC(this.interactionResponse?.country)?await this.startPayByBankFlow():await this.showManualBankAccountScreen()}isCurrentPayByBankProviderRequest(e,t){return this.isConnected&&e===this.bankProviderRequestToken&&this.interactionResponse?.interactionId===t&&"provider"===this.bankFlowScreen}async launchPayByBankProvider(e,t,r){const n=await this.requestCommerceHubJson("/interaction/source/pbb/session",e,{method:"GET",credentials:"include"});if(!this.isCurrentPayByBankProviderRequest(r,e))return;const{aggregatorSessionId:i,accessToken:o,pToken:a,publicKey:s}=uE(n),c=jC(this.designConfig?.payByBank);if(await VE(c.paymentSdkUrl),!this.isCurrentPayByBankProviderRequest(r,e))return;const d=window.PaymentSDK;if(!d?.init)throw new Error("PaymentSDK.js loaded but PaymentSDK.init is not available on window.");await new Promise((n,u)=>{let l=!1;this.cancelPayByBankLaunch=()=>{l=!0,n()},FE(),d.init({apiKey:c.apiKey,accessToken:o,configId:c.configId,environment:c.environment,locale:c.locale,appearance:SC(this.designConfig),publicKey:s,pToken:a,aggregatorSessionId:i,containerId:t,onEvent:async t=>{if(!l&&lE(t)&&this.isCurrentPayByBankProviderRequest(r,e)){if(l=!0,this.bankLinkLoading=!0,FE(),"success"!==t.type)return this.resetBankFlow(),this.showPaymentSourceList({refresh:!0}),void n();try{const t=await this.finalizePayByBankSession(e,i,a);if(!this.isCurrentPayByBankProviderRequest(r,e))return void n();const o=pC(t),s=o.id?.trim();if(!s)throw new Error("Connect your bank completed but the resolved bank payment source did not include an id.");const c=this.interactionResponseWithAddedSource(e,o);this.setInteractionResponseFromSdk(c),this.emitSdkEvent(Zx,o);const d=await this.refreshInteractionAfterMutation(e);if(!this.isCurrentPayByBankProviderRequest(r,e))return void n();const u=this.findPaymentSourceInInteraction(d,s)??o;this.resetBankFlow(),this.showAddedPaymentSourceStatus(u),n()}catch(t){if(!this.isCurrentPayByBankProviderRequest(r,e))return void n();u(t)}}}}),!l&&this.isCurrentPayByBankProviderRequest(r,e)&&(this.bankLinkLoading=!1)})}async refreshPaymentSourcesFromInteraction(){await this.interactionRefresh.refreshFromInteraction(this.interactionRefreshOptions())}queueNativeAccountBalanceRefresh(){this.nativeBalance.queueRefresh(()=>this.interactionResponse,e=>this.fetchNativeAccountBalances(e))}async fetchNativeAccountBalances(e){return(await this.createSdkClient(e).GET("/interaction/source/native/balances")).data??{}}async fetchInteraction(e){return this.interactionRefresh.fetch(e,this.interactionRefreshOptions())}async retryInteractionRefresh(){const e=this.interactionResponse?.interactionId;if(e)try{await this.fetchInteraction(e)}catch(e){}}interactionRefreshOptions(){return{getCurrentInteractionResponse:()=>this.interactionResponse,getSelectedPaymentSourceId:()=>this.interactionResponse?.selectedSource?.id,requestInteraction:e=>this.createSdkClient(e).GET("/interaction").then(e=>iE(e)),mergeInteractionResponse:nE,setInteractionResponse:e=>this.setInteractionResponseFromSdk(e),emitListPaymentMethods:e=>this.emitSdkEvent(eC,e)}}syncBillingAddressesFromInteractionResponse(e){if(!e.billerAddress)return;this.billingAddresses=e.billerAddress.filter(e=>Boolean(e.id?.trim())),this.cardDraft=((e,t)=>{const r=t.map(e=>e.id?.trim()).filter(e=>Boolean(e));if(!r.length)return{...e,billingAddressValue:Tw};if(r.includes(e.billingAddressValue))return e;const n=[e.country,e.addressLine1,e.addressLine2,e.city,e.state,e.zip].some(e=>e.trim());return e.billingAddressValue===Tw&&n?e:{...e,billingAddressValue:r[0]}})(this.cardDraft,this.billingAddresses),this.billingAddressSelectorExpanded=this.cardDraft.billingAddressValue===Tw,this.reconcileBankBillingAddressSelection();const t=this.bankAccountInstrumentSchemas.find(e=>e.bavSupportedCode===this.selectedBankAccountInstrumentSchemaCode);t&&"instrument-schema"===this.manualBankAccountFormMode&&this.configureManualBankAccountForm(t,!1)}async finalizePayByBankSession(e,t,r){return this.requestCommerceHubJson(`/interaction/source/pbb/session/${encodeURIComponent(t)}/${encodeURIComponent(r)}`,e,{method:"PUT",credentials:"include"})}async verifyPaymentSourceStep1(e,t){this.showMinimumVerificationOverlay("verify-payment-source");const r=await this.requestCommerceHubJson("/interaction/verify/step1",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:t.id}),credentials:"include"});return this.sourceWithVerificationResponse(t,r)}async requestCommerceHubJson(e,t,r){const n=this.createInteractionHeaders(t,r.headers);n.has("Accept")||n.set("Accept","application/json");const i=new Request(`${yw(this.baseURL)}${e}`,{...r,headers:n}),o=await fetch(i),a=await(async e=>{if(204===e.status)return;const t=await e.text();return""!==t.trim()?(e=>{const t=e.split(";",1)[0].trim().toLowerCase();return"application/json"===t||t.endsWith("+json")})(e.headers.get("content-type")??"")?JSON.parse(t):t:void 0})(o);if(!o.ok)throw new Error(oE(a)||o.statusText);return a}async fetchManualBankAccountCountryConfig(e,t){return this.requestCommerceHubJson("/party/configuration-inquiry",e,{method:"POST",headers:{"Client-Id":aE(),"Content-Type":"application/json","User-Id":aE()},body:JSON.stringify({configurationType:"COUNTRY_TENDER",country:t}),credentials:"include"})}resetBankFlow(){this.bankAccountConfigRequestToken+=1,this.cancelPayByBankProvider(),this.bankFlowScreen=void 0,this.bankOutcomeSource=void 0,this.bankLinkLoading=!1,this.bankAccountInstrumentSchemas=[],this.selectedBankAccountInstrumentSchemaCode=void 0,this.selectedBankCurrencyCode="",this.selectedBankAccountType="",this.selectedBankPaymentType="",this.bankBillingAddressValue="",this.bankBillingAddressSelectorExpanded=!1,this.clearManualBankAccountForm(),this.bankAccountConfigError=void 0,this.removePayByBankProviderContainer()}cancelPayByBankProvider(){this.bankProviderRequestToken+=1,this.cancelPayByBankLaunch?.(),this.cancelPayByBankLaunch=void 0,FE()}resetCardFlow(){this.cardFlowScreen=void 0,this.cardDraft=Mw(),this.cardDraftErrors={},this.cardValidationAttempted=!1,this.cardEncryption={cardNumber:{status:"idle",normalizedValue:""},cvv:{status:"idle",normalizedValue:""}},this.cardSubmitError=void 0,this.billingAddressSelectorExpanded=!1}resetTransferFlow(){this.transferFlowActive=!1,this.transferFlowScreen="form",this.transferDraft={fromSourceId:"",toSourceId:"",amount:""},this.transferDraftErrors={},this.transferValidationAttempted=!1,this.transferSubmitError=void 0,this.transferSubmitSuccess=!1}ensurePayByBankProviderContainer(e){const t=[...this.children].find(t=>t instanceof HTMLElement&&t.id===e),r=t??document.createElement("div");return r.id=e,r.slot=e,r.className="provider-frame-container",r.replaceChildren(),t||this.appendChild(r),r}removePayByBankProviderContainer(){[...this.children].filter(e=>e instanceof HTMLElement&&e.id===iC).forEach(e=>e.remove())}requireInteractionId(){const e=this.interactionResponse?.interactionId;if(e)return e}createSdkClient(e){return ww({baseURL:this.baseURL,getHeaders:()=>this.createInteractionHeaders(e)})}createInteractionHeaders(e,t){const r=new Headers(t),n=this.interactionResponse?.oauth?.access_token?.trim();return r.set("x-interaction-id",e),n&&!r.has("Authorization")&&r.set("Authorization",`Bearer ${n}`),r}createSourceCreateHeaders(e,t,r){const n=this.createInteractionHeaders(e,r);return n.set("Api-Key",t.clientId),n.set("Auth-Token-Type",t.tokenType),n.set("x-key-id",t.keyId),n}requireSourceCreateContext(){const e=this.interactionResponse?.publicKey?.trim(),t=this.interactionResponse?.keyId?.trim(),r=this.interactionResponse?.oauth,n=r?.client_id?.trim(),i=r?.token_type?.trim(),o=r?.access_token?.trim();if(!(e&&t&&n&&i&&o))throw new Error("Payment source encryption is not configured. Try again later.");return{publicKey:e,keyId:t,clientId:n,tokenType:i,accessToken:o}}setInteractionResponseFromSdk(e){this.interactionResponse=this.interactionResponseWithPreservedGatewayOAuth(e)}interactionResponseWithPreservedGatewayOAuth(e){if(e.oauth&&e.features)return e;const t=this.interactionResponse;return!t||t.interactionId&&e.interactionId&&t.interactionId!==e.interactionId?e:{...e,oauth:e.oauth??t.oauth,features:e.features??t.features}}syncDesignConfigStyles(){for(const e of NC)this.style.removeProperty(e);const e=this.designConfig?.colors;if(e)for(const{field:t,property:r}of IC){const n=e[t];n&&this.style.setProperty(r,n)}const t=this.designConfig?.baseFontSize;t?this.style.fontSize=t:this.style.removeProperty("font-size");const r=this.designConfig?.baseFontWeight?.trim();r?this.style.setProperty(_C,r):this.style.removeProperty(_C);const n=this.designConfig?.shellPadding?.trim();n?this.style.setProperty(zC,n):this.style.removeProperty(zC)}};lC.styles=bx,Yx([iw({attribute:!1})],lC.prototype,"interactionResponse",void 0),Yx([iw({attribute:!1})],lC.prototype,"designConfig",void 0),Yx([iw({attribute:"base-url"})],lC.prototype,"baseURL",void 0),Yx([ow()],lC.prototype,"selectedPaymentSourceId",void 0),Yx([ow()],lC.prototype,"otpValue",void 0),Yx([ow()],lC.prototype,"pendingAction",void 0),Yx([ow()],lC.prototype,"minimumVerificationOverlayAction",void 0),Yx([ow()],lC.prototype,"otpErrorMessage",void 0),Yx([ow()],lC.prototype,"bankFlowScreen",void 0),Yx([ow()],lC.prototype,"bankLinkLoading",void 0),Yx([ow(),ow()],lC.prototype,"bankOutcomeSource",void 0),Yx([ow()],lC.prototype,"bankAccountInstrumentSchemas",void 0),Yx([ow()],lC.prototype,"manualBankAccountFormMode",void 0),Yx([ow()],lC.prototype,"selectedBankAccountInstrumentSchemaCode",void 0),Yx([ow()],lC.prototype,"selectedBankCurrencyCode",void 0),Yx([ow()],lC.prototype,"selectedBankAccountType",void 0),Yx([ow()],lC.prototype,"selectedBankPaymentType",void 0),Yx([ow()],lC.prototype,"bankAccountFormSchema",void 0),Yx([ow()],lC.prototype,"bankAccountFormUiSchema",void 0),Yx([ow()],lC.prototype,"bankAccountFormData",void 0),Yx([ow()],lC.prototype,"bankAccountFormValid",void 0),Yx([ow()],lC.prototype,"bankAccountValidationAttempted",void 0),Yx([ow()],lC.prototype,"bankBillingAddressValue",void 0),Yx([ow()],lC.prototype,"bankBillingAddressSelectorExpanded",void 0),Yx([ow()],lC.prototype,"bankAccountSubmitError",void 0),Yx([ow()],lC.prototype,"legacyBankAccountDraft",void 0),Yx([ow()],lC.prototype,"legacyBankAccountDraftErrors",void 0),Yx([ow()],lC.prototype,"legacyBankAccountEncryption",void 0),Yx([ow()],lC.prototype,"bankAccountConfigError",void 0),Yx([ow()],lC.prototype,"transferDraft",void 0),Yx([ow()],lC.prototype,"transferDraftErrors",void 0),Yx([ow()],lC.prototype,"transferValidationAttempted",void 0),Yx([ow()],lC.prototype,"transferSubmitError",void 0),Yx([ow()],lC.prototype,"transferSubmitSuccess",void 0),Yx([ow()],lC.prototype,"transferFlowActive",void 0),Yx([ow()],lC.prototype,"transferFlowScreen",void 0),Yx([ow(),ow()],lC.prototype,"cardFlowScreen",void 0),Yx([ow()],lC.prototype,"cardDraft",void 0),Yx([ow()],lC.prototype,"cardDraftErrors",void 0),Yx([ow()],lC.prototype,"cardValidationAttempted",void 0),Yx([ow()],lC.prototype,"cardEncryption",void 0),Yx([ow()],lC.prototype,"revealedCardFields",void 0),Yx([ow()],lC.prototype,"cardFieldsRevealingLastChar",void 0),Yx([ow()],lC.prototype,"cardSubmitError",void 0),Yx([ow()],lC.prototype,"billingAddresses",void 0),Yx([ow()],lC.prototype,"billingAddressSelectorExpanded",void 0),Yx([ow()],lC.prototype,"paymentSourceView",void 0),Yx([ow()],lC.prototype,"openPaymentSourceMenuId",void 0),Yx([ow()],lC.prototype,"paymentSourceMenuPlacement",void 0),Yx([ow()],lC.prototype,"addLauncherActive",void 0),Yx([ow()],lC.prototype,"attachmentError",void 0),Yx([ow()],lC.prototype,"deleteConfirmationPaymentSourceId",void 0),Yx([ow()],lC.prototype,"savedSourceVerificationSource",void 0),Yx([ow()],lC.prototype,"savedSourceVerificationFailed",void 0),Yx([ow()],lC.prototype,"requiredInfoSource",void 0),Yx([ow()],lC.prototype,"requiredInfoValues",void 0),Yx([ow()],lC.prototype,"requiredInfoFileNames",void 0),Yx([ow()],lC.prototype,"requiredInfoSubmitError",void 0),Yx([ow()],lC.prototype,"requiredInfoValidationAttempted",void 0),lC=Yx([tw("commerce-hub-connect")],lC);const hC=e=>e.composedPath().find(e=>e instanceof HTMLInputElement&&e.classList.contains("required-info-ssn-input")),fC=e=>{const t=[e.stateOrProvince,e.postalCode].filter(Boolean).join(" "),r=[e.city,t].filter(Boolean).join(", ");return[e.street,r].filter(Boolean).join(", ")||e.id||"Saved billing address"},mC=(e,t)=>{const r=Lw(t??"").slice(-4);return{...e,tenderType:"Card",card:{...e.card,...r?{cardNumber:r}:{}}}},pC=e=>({id:yC(e,"Connect your bank completed but the verification response did not include a source id."),tenderType:"BankAccount",verificationInfo:$C(e),bankAccount:{}}),vC=(e,t)=>{const r=e[t];return"string"==typeof r&&r.trim()?r.trim():void 0},bC=e=>{const t=vC(e,"bankName"),r=vC(e,"bankAccountType"),n=vC(e,"accountNumber")??vC(e,"interacAccount"),i=(e=>{const t=/-([BP])$/u.exec(e.trim())?.[1];if("B"===t)return"BUSINESS";if("P"===t)return"PERSONAL";throw new Error("The selected instrument schema does not identify a business or personal account.")})(e.bavSupportedCode);return{id:e.id,name:e.name,tenderType:"BankAccount",accountHolderType:i,bankAccount:{...t?{bankName:t}:{},...r?{accountType:r}:{},...n?{accountNumber:cE(n)}:{},asset:{type:"CURRENCY",id:e.currencyCode},country:e.countryCode}}},gC=(e,t)=>{const r=d$(t??"").slice(-4);return{...e,tenderType:"BankAccount",bankAccount:{...e.bankAccount,...r?{accountNumber:r}:{}}}},yC=(e,t)=>{const r=e.sourceId?.trim();if(!r)throw new Error(t);return r},wC=e=>{if("object"!=typeof e||null===e||Array.isArray(e))return;const t=e;return t.sourceId?.trim()?t:void 0},$C=e=>{const{sourceId:t,...r}=e;return r},kC=e=>{const t=e?.email?.trim();if(t)return t;const r=e?.phone?.countryCode?.trim(),n=e?.phone?.phoneNumber?.trim();return[r,n].filter(Boolean).join(" ")||void 0},xC=e=>{const t=e?.copy?.otp;return{title:t?.title??"Enter verification code",subtitle:t?.subtitle,failedMessage:t?.failedMessage??"The code does not match. Try again.",resendPrefix:t?.resendPrefix??"Didn't receive the code?",resendButton:t?.resendButton??"Resend code",resendPendingButton:t?.resendPendingButton??"Sending code...",verifyButton:t?.verifyButton??"Verify",verifyingButton:t?.verifyingButton??"Verifying...",tryAgainButton:t?.tryAgainButton??"Try again"}},CC=e=>{const t=e?.copy?.paymentMethods;return{title:t?.title??"Payment methods",subtitle:t?.subtitle??"",addBankAccountTitle:t?.addBankAccountTitle??"Add bank account",addBankAccountSubtitle:t?.addBankAccountSubtitle??"",addCardTitle:t?.addCardTitle??"Add credit or debit card",addCardSubtitle:t?.addCardSubtitle??"",continueButton:t?.continueButton??"Use selected method",continuingButton:t?.continuingButton??"Saving..."}},EC=e=>{const t=e?.copy?.noSavedPaymentMethods;return{title:t?.title??"Payment methods",subtitle:t?.subtitle??"",emptyTitle:t?.emptyTitle??"",emptyMessage:t?.emptyMessage??"",addBankAccountTitle:t?.addBankAccountTitle??"Add bank account",addBankAccountSubtitle:t?.addBankAccountSubtitle??"Connect or enter an account",addCardTitle:t?.addCardTitle??"Add credit or debit card",addCardSubtitle:t?.addCardSubtitle??"Add your card details"}},jC=e=>{const t=Object.fromEntries(Object.entries(e??{}).filter(([,e])=>void 0!==e));return{...uC,...t}},SC=e=>{const t=e?.colors,r={};return OC(r,"backgroundColor",AC(t?.widgetBackground,t?.surface)),OC(r,"primaryColor",t?.primary),OC(r,"buttonColor",t?.primary),OC(r,"primaryTextColor",t?.text),OC(r,"secondaryTextColor",AC(t?.copy,t?.muted)),OC(r,"dangerColor",t?.danger),OC(r,"successColor",t?.success),OC(r,"borderColor",AC(t?.border,t?.widgetBorder,t?.borderBackground)),OC(r,"placeholderColor",t?.placeholder),{branding:r}},AC=(...e)=>e.map(e=>e?.trim()).find(e=>Boolean(e)),OC=(e,t,r)=>{const n=r?.trim();n&&(e[t]=n)},IC=[{field:"primary",property:"--chc-primary"},{field:"text",property:"--chc-text"},{field:"copy",property:"--chc-copy"},{field:"muted",property:"--chc-muted"},{field:"placeholder",property:"--chc-placeholder"},{field:"surface",property:"--chc-surface"},{field:"widgetBackground",property:"--chc-widget-background"},{field:"borderBackground",property:"--chc-border"},{field:"widgetBorder",property:"--chc-border"},{field:"softSurface",property:"--chc-soft-surface"},{field:"paymentSelectionBackground",property:"--chc-payment-method-background"},{field:"paymentMethodBackground",property:"--chc-payment-method-background"},{field:"border",property:"--chc-border"},{field:"borderStrong",property:"--chc-border-strong"},{field:"success",property:"--chc-success"},{field:"successBackground",property:"--chc-success-bg"},{field:"successBorder",property:"--chc-success-border"},{field:"danger",property:"--chc-danger"},{field:"dangerBackground",property:"--chc-danger-bg"},{field:"dangerBorder",property:"--chc-danger-border"},{field:"warning",property:"--chc-warning"},{field:"warningBackground",property:"--chc-warning-bg"},{field:"warningBorder",property:"--chc-warning-border"},{field:"disabledText",property:"--chc-disabled-text"},{field:"disabledSurface",property:"--chc-disabled-surface"}],_C="--chc-font-weight",zC="--chc-shell-padding",NC=[...IC.map(({property:e})=>e),_C,zC],RC=(e,t={})=>{const r=XC(e),n=r?.paymentSources;if(!n?.length){const e=ZC(r);return e?[PC(e,{...t,selected:!0,isDefault:"PAYMENT_SOURCE_ATTACHED"===r?.status})]:[]}const i="PAYMENT_SOURCE_ATTACHED"===r?.status?r.selectedSource?.id:void 0;return n.map(e=>PC(e,{...t,isDefault:Boolean(i&&e.id===i)}))},TC=e=>{const t=e?.allowedTenderTypes;return t?{card:t.includes("CARD"),bankAccount:t.includes("BANK_ACCOUNT"),nativeAccount:t.includes("NATIVE_ACCOUNT")}:{card:!0,bankAccount:!0,nativeAccount:!0}},MC=e=>{const t=e?.trim().toUpperCase();return"US"===t||"USA"===t},PC=(e,{selected:t=!1,isDefault:r=!1,nativeBalances:n={},nativeBalanceLoadingSourceIds:i=[]}={})=>{const o=FC(e),a=DE(e)?WC(e,n):void 0,s=void 0===a?.balance?void 0:GC(a.balance);return{id:o,label:LC(e,{selected:t}),type:UC(e),brand:BC(e),accountLabel:qC(e),balanceLabel:s,balanceLoading:DE(e)&&i.includes(o),last4:VC(e),status:dE(e.verificationInfo?.status),showVerificationStatus:Boolean(e.verificationInfo?.status),verificationLabel:fx(e),selectionEligible:hx(e),isDefault:r}},LC=(e,{selected:t=!1}={})=>{if(LE(e))return t?e.name?.trim()||e.card?.nameOnCard?.trim()||DC(e):e.card?.nameOnCard?.trim()||e.name?.trim()||DC(e);if(PE(e)){const t=e.bankAccount?.bankName?.trim();return t||e.name?.trim()||DC(e)}return DE(e)?e.account?.nickName?.trim()||e.name?.trim()||DC(e):e.name?.trim()||DC(e)},DC=e=>LE(e)?"Saved card":PE(e)?e.bankAccount?.bankName?.trim()||"Saved bank account":DE(e)?"Native account":"Dynamic session card",BC=e=>LE(e)?e.card?.network??"Card":PE(e)?e.bankAccount?.bankName?.trim()||"Bank account":DE(e)?e.account?.productType??"Native account":"DSC",qC=e=>{const t=VC(e);if(LE(e))return`${e.card?.network?.trim()||"Card"} xx ${t}`;if(PE(e))return`${e.bankAccount?.accountType?.trim()||"Bank account"} xx ${t}`;if(DE(e)){const r=e.account?.productType?.trim();return`${r||"Native account"} xx ${t}`}return`Card xx ${t}`},VC=e=>LE(e)?cE(e.card?.cardNumber):PE(e)?cE(e.bankAccount?.accountNumber):DE(e)?cE(e.account?.positionId??e.account?.token):cE(e.id),FC=e=>e.id?.trim()||e.name?.trim()||e.tenderType,UC=e=>PE(e)?"bank":DE(e)?"native":"card",HC=e=>(XC(e)?.paymentSources??[]).filter(e=>(PE(e)||DE(e))&&"VERIFIED"===e.verificationInfo?.status&&Boolean(FC(e))),WC=(e,t)=>{for(const r of KC(e)){const e=t[r];if(e)return e}},KC=e=>[e.id,e.account?.positionId,e.account?.token].map(e=>e?.trim()).filter(e=>Boolean(e)),GC=e=>YC.format(e),YC=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}),JC=(e,t)=>{const r=XC(e),n=r?.paymentSources;if(!n?.length)return;const i=n.filter(hx);if(t&&i.some(e=>e.id===t))return t;const o=r?.selectedSource?.id;return o&&i.some(e=>e.id===o)?o:i[0]?.id},ZC=(e,t)=>{const r=XC(e);if(t){const e=r?.paymentSources?.find(e=>e.id===t);if(e)return e}return r?.selectedSource},QC=["VERIFIED","REQUIRE_INFO","NOT_VERIFIED"],XC=e=>{const t=(()=>{if("undefined"==typeof window)return"off";if("localhost"!==(e=window.location.hostname)&&"127.0.0.1"!==e&&"::1"!==e)return"off";var e;const t=new URLSearchParams(window.location.search),r=t.get("chc_local_non_verified_testing")?.trim().toLowerCase();return"show-all"===r||"mixed"===r?"show-all":"all"===r?"all":"1"===r||"true"===r?"single":"off"})();if(!e||"off"===t)return e;const r=e.paymentSources??[],n=new Set;let i=0;const o=r.map(e=>{if("VERIFIED"!==e.verificationInfo?.status)return e;if("single"===t&&n.size>0)return e;const r="show-all"===t?QC[i%QC.length]:"UNDER_REVIEW";return i+=1,"VERIFIED"===r?e:(n.add(FC(e)),{...e,verificationInfo:{...e.verificationInfo,status:r}})});if(0===n.size)return e;const a=e.selectedSource&&n.has(FC(e.selectedSource))?{...e.selectedSource,verificationInfo:{...e.selectedSource.verificationInfo,status:"UNDER_REVIEW"}}:e.selectedSource;return{...e,paymentSources:o,selectedSource:a}},eE=e=>e===sC||"PAYMENT_SOURCE_REQUESTED"===e,tE=(e,t)=>Boolean(e?.features?.includes(t)),rE=e=>Boolean(tE(e,"TRANSFER")&&!tE(e,"ADD_ACCOUNT")&&!tE(e,"SELECT")),nE=(e,t,r)=>{const n={...e,...t},i=void 0!==t.paymentSources,o=i?t.paymentSources??[]:e.paymentSources??[],a=((e,t)=>{if(t){const r=e.find(e=>e.id===t);if(r)return r}})(o,r??t.selectedSource?.id)??t.selectedSource??(i?void 0:e.selectedSource);return{...n,selectedSource:a,paymentSources:o}},iE=e=>{if(e.data)return e.data;throw new Error(oE(e.error))},oE=e=>"string"==typeof e?e:e&&"object"==typeof e&&"message"in e&&"string"==typeof e.message&&e.message.trim()?e.message:"CommerceHub API request failed.",aE=()=>{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();const e=new Uint8Array(16);globalThis.crypto?.getRandomValues(e),e[6]=15&e[6]|64,e[8]=63&e[8]|128;const t=[...e].map(e=>e.toString(16).padStart(2,"0"));return`${t.slice(0,4).join("")}-${t.slice(4,6).join("")}-${t.slice(6,8).join("")}-${t.slice(8,10).join("")}-${t.slice(10,16).join("")}`},sE=(e,t)=>{const r=e.composedPath().find(e=>e instanceof HTMLElement&&Boolean(e.dataset[t]));return r?.dataset[t]},cE=e=>e&&e.length>=4?e.slice(-4):"----",dE=e=>"VERIFIED"===e?"verified":"UNDER_REVIEW"===e?"under-review":"REQUIRE_INFO"===e?"require-info":"DECLINED"===e?"declined":"not-verified",uE=e=>{const t=e.aggregatorSessionId?.trim(),r=e.tokenID?.trim()||e.accessToken?.trim(),n=e.pToken?.trim(),i=e.publicKey?.trim();if(!(t&&r&&n&&i))throw new Error("The /interaction/source/pbb/session response is missing one or more required values.");return{aggregatorSessionId:t,accessToken:r,pToken:n,publicKey:i}},lE=e=>"success"===e.type||"cancel"===e.type||"failure"===e.type||"error"===e.type,hE=e=>e.startsWith("back-to-")||"change-payment-source"===e,fE=(e,t)=>{const r=pE(e.paymentSources??[],t);return{...e,selectedSource:t,paymentSources:r}},mE=(e,t)=>({...e,paymentSources:pE(e.paymentSources??[],t)}),pE=(e,t)=>e.some(e=>e.id===t.id)?e.map(e=>e.id===t.id?t:e):[t,...e],vE=e=>hx(e),bE=({title:e,helper:t})=>Ty`
  <div class="widget-loading-status" role="status" aria-live="polite">
    <span class="widget-loading-animation" aria-hidden="true">
      <span class="widget-loading-animation-dot"></span>
      <span class="widget-loading-animation-dot"></span>
      <span class="widget-loading-animation-dot"></span>
    </span>
    <span class="widget-loading-copy">
      <span class="widget-loading-title">${e}</span>
      <span class="widget-loading-helper">${t}</span>
    </span>
  </div>
`,gE=e=>"verify-payment-source"===e?bE({title:"Verifying payment method",helper:"Verifying your payment method, please wait."}):"submit-required-info"===e?bE({title:"Verifying account",helper:"Reviewing your verification information, please wait."}):void 0,yE=e=>"verify-payment-source"===e?gE(e):"delete-payment-source"===e?bE({title:"Deleting payment method",helper:"Deleting your payment method, please wait."}):"attach-payment-source"===e?bE({title:"Saving payment method",helper:"Saving your payment method, please wait."}):void 0,wE=e=>{switch(e){case"attach-payment-source":return"Saving the selected payment method.";case"verify-payment-source":case"submit-required-info":return"Verifying the payment method.";case"delete-payment-source":return"Deleting the payment method.";case"verify-otp":return"Verifying the code.";case"resend-otp":return"Sending a new code.";case"save-card":return"Saving the card.";case"save-bank-account":return"Saving the bank account.";case"transfer":return"Submitting the transfer.";default:return""}},$E=e=>{const t=e?.verificationInfo?.status;return"VERIFIED"===t?{kind:"verified",variant:"success",title:"Bank account verified",message:"Your bank account is connected and ready to use."}:"UNDER_REVIEW"===t?{kind:"pending",variant:"warning",title:"Bank account pending review",message:"We will update this bank account after review is complete."}:"REQUIRE_INFO"===t?{kind:"requires-info",variant:"warning",title:"Complete account verification",message:"Additional information is required before this bank account can be verified."}:"DECLINED"===t?{kind:"declined",variant:"danger",title:"Bank account verification failed",message:"This bank account could not be verified."}:{kind:"failed",variant:"danger",title:"Bank account not verified",message:"This bank account is not verified yet."}},kE=(e,t=!1)=>{const r=ME(e),n=r.toLowerCase(),i=e?.verificationInfo?.status;return t?{kind:"failed",variant:"danger",title:"Bank account"===r?"Bank account verification failed":`${r} not verified`,message:`We could not verify this ${n} right now.`}:"VERIFIED"===i?{kind:"verified",variant:"success",title:"Bank account"===r?"Bank account verified":`${r} saved`,message:`This ${n} is verified and ready to use.`}:"UNDER_REVIEW"===i?{kind:"pending",variant:"warning",title:"Bank account"===r?"Bank account pending review":"Verification pending review",message:`We will update this ${n} after review is complete.`}:"REQUIRE_INFO"===i?{kind:"requires-info",variant:"warning",title:"Complete account verification",message:`Additional information is required before this ${n} can be verified.`}:"DECLINED"===i?{kind:"declined",variant:"danger",title:"Bank account"===r?"Bank account verification failed":`${r} declined`,message:`This ${n} could not be verified.`}:{kind:"failed",variant:"danger",title:"Bank account"===r?"Bank account not verified":`${r} not verified`,message:`This ${n} is not verified yet.`}},xE=e=>{const t=e?.verificationInfo?.docs??[];return t.length>0?t:[{}]},CE=(e,t=0)=>`${e?.docType??"DOCUMENT"}-${t}`,EE=e=>"DRIVER_LICENSE_NUMBER"===e.docType||"SOCIAL_SECURITY_NUMBER"===e.docType,jE=e=>!1!==e.mandatory,SE=e=>jE(e)?"required":"optional",AE=e=>Ty`
  <span
    class="required-info-requirement-badge required-info-requirement-badge-${SE(e)}"
  >
    ${(e=>jE(e)?"Required":"Optional")(e)}
  </span>
`,OE=e=>{const t=e.findIndex(e=>!EE(e));return t>=0?CE(e[t],t):void 0},IE=({doc:e,key:t,value:r,error:n})=>{if("SOCIAL_SECURITY_NUMBER"===e.docType)return _E({doc:e,key:t,value:r,error:n});const i=`required-info-${t}`,o=`${i}-error`;return Ty`
    <div
      class="required-info-document required-info-text-document required-document-text-row"
      data-required-info-doc-key=${t}
      data-required-info-requirement=${SE(e)}
    >
      <div class="field field-full">
        <div class="field-label-row">
          <label class="field-label" for=${i}
            >${zE(e)}</label
          >
          ${AE(e)}
        </div>
        <input
          class="field-input required-info-text-input"
          id=${i}
          name=${t}
          type=${(e=>"SOCIAL_SECURITY_NUMBER"===e.docType?"password":"text")(e)}
          .value=${r}
          autocomplete="off"
          inputmode=${(e=>"SOCIAL_SECURITY_NUMBER"===e.docType?"numeric":"text")(e)}
          data-required-info-doc-key=${t}
          aria-label=${zE(e)}
          aria-invalid=${n?"true":"false"}
          aria-describedby=${aw(n?o:void 0)}
        />
        ${n?Ty`<p class="field-error" id=${o} role="alert">${n}</p>`:""}
      </div>
    </div>
  `},_E=({doc:e,key:t,value:r,error:n})=>{const i=zE(e),o=(e=>{const t=Zk(e);return[t.slice(0,3),t.slice(3,5),t.slice(5,9)]})(r),a=`required-info-${t}-ssn-0`,s=`required-info-${t}-error`;return Ty`
    <div
      class="required-info-document required-info-text-document required-info-ssn-document required-document-text-row"
      data-required-info-doc-key=${t}
      data-required-info-requirement=${SE(e)}
    >
      <div class="field field-full">
        <div class="field-label-row">
          <label class="field-label" for=${a}>${i}</label>
          ${AE(e)}
        </div>
        <div class="required-info-ssn-control" role="group" aria-label=${i}>
          ${Jk.map((e,r)=>Ty`
              ${r>0?Ty`
                    <span class="required-info-ssn-separator" aria-hidden="true"
                      >-</span
                    >
                  `:""}
              <input
                class="field-input required-info-ssn-input"
                id=${`required-info-${t}-ssn-${r}`}
                name=${`${t}-${r}`}
                type="password"
                .value=${o[r]}
                autocomplete="off"
                inputmode="numeric"
                maxlength=${e}
                data-required-info-doc-key=${t}
                data-required-info-ssn-segment=${String(r)}
                aria-label=${`${i} part ${r+1}`}
                aria-invalid=${n?"true":"false"}
                aria-describedby=${aw(n?s:void 0)}
              />
            `)}
        </div>
        ${n?Ty`<p class="field-error" id=${s} role="alert">${n}</p>`:""}
      </div>
    </div>
  `},zE=e=>"BANK_STATEMENT"===e.docType?"Bank statement":"BANK_LETTER"===e.docType?"Bank letter":"BANK_CHECK"===e.docType?"Bank check":"DRIVER_LICENSE_PHOTO"===e.docType?"Driver license photo":"DRIVER_LICENSE_NUMBER"===e.docType?"Driver license number":"SOCIAL_SECURITY_NUMBER"===e.docType?"Social Security number":"Required document",NE=e=>{const t=zE(e);return"SOCIAL_SECURITY_NUMBER"===e.docType?"Enter a Social Security number.":EE(e)?`Enter a ${t.toLowerCase()}.`:`Choose a ${t.toLowerCase()}.`},RE=e=>{const t=(e=>({type:UC(e),brand:BC(e)}))(e),r=ax(t),n=(e=>{if(!LE(e))return;const t=e.card?.expirationMonth?.trim(),r=e.card?.expirationYear?.trim();if(!t||!r)return;return`${t.padStart(2,"0")}/${r.slice(-2)}`})(e);return Ty`
    <div
      class="required-info-card"
      aria-label="Payment source requiring verification"
    >
      <div class="required-info-card-top">
        <div class="required-info-card-heading">
          <span class="required-info-card-label"
            >${(e=>PE(e)?"Bank account":LE(e)?"Card":DE(e)?"Native account":"Dynamic session card")(e)}</span
          >
          <span
            class="required-info-card-field required-info-card-name"
            data-required-info-card-field="name"
            >${(e=>{if(LE(e))return e.card?.nameOnCard?.trim()||e.name?.trim()||DC(e);if(PE(e)){const t=e.bankAccount?.bankName?.trim();return t||e.name?.trim()||DC(e)}return DE(e)?e.account?.nickName?.trim()||e.name?.trim()||DC(e):e.name?.trim()||DC(e)})(e)}</span
          >
        </div>
        <span class="required-info-card-icon-chip" aria-hidden="true">
          <img
            class="required-info-card-icon-image"
            data-required-info-card-icon=${r}
            src=${sx(t)}
            alt=""
          />
        </span>
      </div>

      <div
        class="required-info-card-field required-info-card-number"
        data-required-info-card-field="number"
      >
        ${(e=>LE(e)?`•••• •••• •••• ${VC(e)}`:`•••• ${VC(e)}`)(e)}
      </div>

      <div class="required-info-card-bottom">
        <div class="required-info-card-detail">
          <span class="required-info-card-label">Status</span>
          <span class="required-info-card-status">
            ${wx(dE(e.verificationInfo?.status))}
          </span>
        </div>
        ${n?Ty`
              <div class="required-info-card-detail">
                <span class="required-info-card-label">Expiry</span>
                <span
                  class="required-info-card-field required-info-card-expiry"
                  data-required-info-card-field="expiry"
                  >${n}</span
                >
              </div>
            `:""}
      </div>
    </div>
  `},TE=e=>"REQUIRE_INFO"===e.verificationInfo?.status,ME=e=>e&&PE(e)?"Bank account":e&&DE(e)?"Native account":"Payment method",PE=e=>"BankAccount"===e.tenderType||"BANK_ACCOUNT"===e.tenderType,LE=e=>"Card"===e.tenderType||"CARD"===e.tenderType,DE=e=>"NativeAccount"===e.tenderType||"NATIVE_ACCOUNT"===e.tenderType;let BE,qE;const VE=async e=>{if(!window.PaymentSDK?.init)if(BE&&qE===e)await BE;else if(qE=e,BE=new Promise((t,r)=>{const n=document.querySelector(`script[data-commerce-hub-pay-by-bank-sdk="true"][src="${e}"]`),i=n??document.createElement("script"),o=()=>{i.removeEventListener("load",a),i.removeEventListener("error",s)},a=()=>{o(),t()},s=()=>{o(),BE=void 0,qE=void 0,r(new Error(`Unable to load Connect your bank script: ${e}`))};i.addEventListener("load",a,{once:!0}),i.addEventListener("error",s,{once:!0}),n||(i.src=e,i.async=!0,i.dataset.commerceHubPayByBankSdk="true",document.head.appendChild(i))}),await BE,!window.PaymentSDK?.init)throw new Error(`Connect your bank script loaded but window.PaymentSDK.init is unavailable: ${e}`)},FE=()=>{try{window.PaymentSDK?.destroy?.()}catch{}};export{gw as COMMERCE_HUB_BASE_URLS,lC as CommerceHubConnect,bw as DEFAULT_COMMERCE_HUB_BASE_URL,Zx as ON_ADD_PAYMENT_METHOD_EVENT,Xx as ON_DELETE_PAYMENT_METHOD_EVENT,rC as ON_ERROR_EVENT,nC as ON_EVENT_EVENT,eC as ON_LIST_PAYMENT_METHODS_EVENT,Jx as ON_SELECT_EVENT,tC as ON_TRANSFER_EVENT,Qx as ON_VERIFY_PAYMENT_METHOD_EVENT,ww as createCommerceHubClient,kw as createCommerceHubConfigClient,$w as createCommerceHubMerchantClient,yw as resolveCommerceHubBaseURL};
