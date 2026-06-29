/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let n=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=r.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(i,e))}return e}toString(){return this.cssText}};const a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:o,defineProperty:s,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:l,getPrototypeOf:h}=Object,u=globalThis,m=u.trustedTypes,p=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?p:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},g=(e,t)=>!o(e,t),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:g};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&s(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:n}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const a=r?.call(this);n?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...d(e),...l(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,r)=>{if(t)i.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of r){const r=document.createElement("style"),n=e.litNonce;void 0!==n&&r.setAttribute("nonce",n),r.textContent=t.cssText,i.appendChild(r)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=r;const a=n.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,i,r=!1,n){if(void 0!==e){const a=this.constructor;if(!1===r&&(n=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??g)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:n},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==n||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,f?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,$=e=>e,x=k.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,A=`<${z}>`,I=document,N=()=>I.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,q=Array.isArray,R="[ \t\n\f\r]",B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,O=/>/g,V=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,M=/"/g,P=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),j=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),_=new WeakMap,H=I.createTreeWalker(I,129);function W(e,t){if(!q(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const K=(e,t)=>{const i=e.length-1,r=[];let n,a=2===t?"<svg>":3===t?"<math>":"",o=B;for(let t=0;t<i;t++){const i=e[t];let s,c,d=-1,l=0;for(;l<i.length&&(o.lastIndex=l,c=o.exec(i),null!==c);)l=o.lastIndex,o===B?"!--"===c[1]?o=D:void 0!==c[1]?o=O:void 0!==c[2]?(P.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=V):void 0!==c[3]&&(o=V):o===V?">"===c[0]?(o=n??B,d=-1):void 0===c[1]?d=-2:(d=o.lastIndex-c[2].length,s=c[1],o=void 0===c[3]?V:'"'===c[3]?M:L):o===M||o===L?o=V:o===D||o===O?o=B:(o=V,n=void 0);const h=o===V&&e[t+1].startsWith("/>")?" ":"";a+=o===B?i+A:d>=0?(r.push(s),i.slice(0,d)+C+i.slice(d)+E+h):i+E+(-2===d?t:h)}return[W(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class Y{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let n=0,a=0;const o=e.length-1,s=this.parts,[c,d]=K(e,t);if(this.el=Y.createElement(c,i),H.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=H.nextNode())&&s.length<o;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(C)){const t=d[a++],i=r.getAttribute(e).split(E),o=/([.?@])?(.*)/.exec(t);s.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?X:"?"===o[1]?ee:"@"===o[1]?te:Q}),r.removeAttribute(e)}else e.startsWith(E)&&(s.push({type:6,index:n}),r.removeAttribute(e));if(P.test(r.tagName)){const e=r.textContent.split(E),t=e.length-1;if(t>0){r.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],N()),H.nextNode(),s.push({type:2,index:++n});r.append(e[t],N())}}}else if(8===r.nodeType)if(r.data===z)s.push({type:2,index:n});else{let e=-1;for(;-1!==(e=r.data.indexOf(E,e+1));)s.push({type:7,index:n}),e+=E.length-1}n++}}static createElement(e,t){const i=I.createElement("template");return i.innerHTML=e,i}}function G(e,t,i=e,r){if(t===j)return t;let n=void 0!==r?i._$Co?.[r]:i._$Cl;const a=T(t)?void 0:t._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),void 0===a?n=void 0:(n=new a(e),n._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=n:i._$Cl=n),void 0!==n&&(t=G(e,n._$AS(e,t.values),n,r)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??I).importNode(t,!0);H.currentNode=r;let n=H.nextNode(),a=0,o=0,s=i[0];for(;void 0!==s;){if(a===s.index){let t;2===s.type?t=new Z(n,n.nextSibling,this,e):1===s.type?t=new s.ctor(n,s.name,s.strings,this,e):6===s.type&&(t=new ie(n,this,e)),this._$AV.push(t),s=i[++o]}a!==s?.index&&(n=H.nextNode(),a++)}return H.currentNode=I,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),T(e)?e===U||null==e||""===e?(this._$AH!==U&&this._$AR(),this._$AH=U):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>q(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==U&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new J(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=_.get(e.strings);return void 0===t&&_.set(e.strings,t=new Y(e)),t}k(e){q(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const n of e)r===t.length?t.push(i=new Z(this.O(N()),this.O(N()),this,this.options)):i=t[r],i._$AI(n),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,n){this.type=1,this._$AH=U,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=U}_$AI(e,t=this,i,r){const n=this.strings;let a=!1;if(void 0===n)e=G(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==j,a&&(this._$AH=e);else{const r=e;let o,s;for(e=n[0],o=0;o<n.length-1;o++)s=G(this,r[i+o],t,o),s===j&&(s=this._$AH[o]),a||=!T(s)||s!==this._$AH[o],s===U?e=U:e!==U&&(e+=(s??"")+n[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===U?void 0:e}}class ee extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==U)}}class te extends Q{constructor(e,t,i,r,n){super(e,t,i,r,n),this.type=5}_$AI(e,t=this){if((e=G(this,e,t,0)??U)===j)return;const i=this._$AH,r=e===U&&i!==U||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==U&&(i===U||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const re=k.litHtmlPolyfillSupport;re?.(Y,Z),(k.litHtmlVersions??=[]).push("3.3.2");const ne=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ae extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let n=r._$litPart$;if(void 0===n){const e=i?.renderBefore??null;r._$litPart$=n=new Z(t.insertBefore(N(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}ae._$litElement$=!0,ae.finalized=!0,ne.litElementHydrateSupport?.({LitElement:ae});const oe=ne.litElementPolyfillSupport;oe?.({LitElement:ae}),(ne.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:g},ce=(e=se,t,i)=>{const{kind:r,metadata:n}=i;let a=globalThis.litPropertyMetadata.get(n);if(void 0===a&&globalThis.litPropertyMetadata.set(n,a=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,n,e,!0,i)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const n=this[r];t.call(this,i),this.requestUpdate(r,n,e,!0,i)}}throw Error("Unsupported decorator location: "+r)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function de(e){return(t,i)=>"object"==typeof i?ce(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function le(e){return de({...e,state:!0,attribute:!1})}const he=/\{[^{}]+\}/g;function ue(e){let{baseUrl:t="",Request:i=globalThis.Request,fetch:r=globalThis.fetch,querySerializer:n,bodySerializer:a,pathSerializer:o,headers:s,requestInitExt:c,...d}={...e};c="object"==typeof process&&Number.parseInt(process?.versions?.node?.substring(0,2))>=18&&process.versions.undici?c:void 0,t=we(t);const l=[];async function h(e,h){const{baseUrl:u,fetch:m=r,Request:p=i,headers:f,params:v={},parseAs:b="json",querySerializer:g,bodySerializer:y=a??ge,pathSerializer:w,body:k,middleware:$=[],...x}=h||{};let S=t;u&&(S=we(u)??t);let C="function"==typeof n?n:ve(n);g&&(C="function"==typeof g?g:ve({..."object"==typeof n?n:{},...g}));const E=w||o||be,z=void 0===k?void 0:y(k,ye(s,f,v.header)),A=ye(void 0===z||z instanceof FormData?{}:{"Content-Type":"application/json"},s,f,v.header),I=[...l,...$],N={redirect:"follow",...d,...x,body:z,headers:A};let T,q,R,B=new p(function(e,t){let i=`${t.baseUrl}${e}`;t.params?.path&&(i=t.pathSerializer(i,t.params.path));let r=t.querySerializer(t.params.query??{});r.startsWith("?")&&(r=r.substring(1));r&&(i+=`?${r}`);return i}(e,{baseUrl:S,params:v,querySerializer:C,pathSerializer:E}),N);for(const e in x)e in B||(B[e]=x[e]);if(I.length){T=Math.random().toString(36).slice(2,11),q=Object.freeze({baseUrl:S,fetch:m,parseAs:b,querySerializer:C,bodySerializer:y,pathSerializer:E});for(const t of I)if(t&&"object"==typeof t&&"function"==typeof t.onRequest){const i=await t.onRequest({request:B,schemaPath:e,params:v,options:q,id:T});if(i){if(!(i instanceof p)){if(i instanceof Response){R=i;break}throw new Error("onRequest: must return new Request() or Response() when modifying the request")}B=i}}}if(!R){try{R=await m(B,c)}catch(t){let i=t;if(I.length)for(let t=I.length-1;t>=0;t--){const r=I[t];if(r&&"object"==typeof r&&"function"==typeof r.onError){const t=await r.onError({request:B,error:i,schemaPath:e,params:v,options:q,id:T});if(t){if(t instanceof Response){i=void 0,R=t;break}if(t instanceof Error){i=t;continue}throw new Error("onError: must return new Response() or instance of Error")}}}if(i)throw i}if(I.length)for(let t=I.length-1;t>=0;t--){const i=I[t];if(i&&"object"==typeof i&&"function"==typeof i.onResponse){const t=await i.onResponse({request:B,response:R,schemaPath:e,params:v,options:q,id:T});if(t){if(!(t instanceof Response))throw new Error("onResponse: must return new Response() when modifying the response");R=t}}}}const D=R.headers.get("Content-Length");if(204===R.status||"HEAD"===B.method||"0"===D&&!R.headers.get("Transfer-Encoding")?.includes("chunked"))return R.ok?{data:void 0,response:R}:{error:void 0,response:R};if(R.ok){const e=async()=>{if("stream"===b)return R.body;if("json"===b&&!D){const e=await R.text();return e?JSON.parse(e):void 0}return await R[b]()};return{data:await e(),response:R}}let O=await R.text();try{O=JSON.parse(O)}catch{}return{error:O,response:R}}return{request:(e,t,i)=>h(t,{...i,method:e.toUpperCase()}),GET:(e,t)=>h(e,{...t,method:"GET"}),PUT:(e,t)=>h(e,{...t,method:"PUT"}),POST:(e,t)=>h(e,{...t,method:"POST"}),DELETE:(e,t)=>h(e,{...t,method:"DELETE"}),OPTIONS:(e,t)=>h(e,{...t,method:"OPTIONS"}),HEAD:(e,t)=>h(e,{...t,method:"HEAD"}),PATCH:(e,t)=>h(e,{...t,method:"PATCH"}),TRACE:(e,t)=>h(e,{...t,method:"TRACE"}),use(...e){for(const t of e)if(t){if("object"!=typeof t||!("onRequest"in t||"onResponse"in t||"onError"in t))throw new Error("Middleware must be an object with one of `onRequest()`, `onResponse() or `onError()`");l.push(t)}},eject(...e){for(const t of e){const e=l.indexOf(t);-1!==e&&l.splice(e,1)}}}}function me(e,t,i){if(null==t)return"";if("object"==typeof t)throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");return`${e}=${!0===i?.allowReserved?t:encodeURIComponent(t)}`}function pe(e,t,i){if(!t||"object"!=typeof t)return"";const r=[],n={simple:",",label:".",matrix:";"}[i.style]||"&";if("deepObject"!==i.style&&!1===i.explode){for(const e in t)r.push(e,!0===i.allowReserved?t[e]:encodeURIComponent(t[e]));const n=r.join(",");switch(i.style){case"form":return`${e}=${n}`;case"label":return`.${n}`;case"matrix":return`;${e}=${n}`;default:return n}}for(const n in t){const a="deepObject"===i.style?`${e}[${n}]`:n;r.push(me(a,t[n],i))}const a=r.join(n);return"label"===i.style||"matrix"===i.style?`${n}${a}`:a}function fe(e,t,i){if(!Array.isArray(t))return"";if(!1===i.explode){const r={form:",",spaceDelimited:"%20",pipeDelimited:"|"}[i.style]||",",n=(!0===i.allowReserved?t:t.map(e=>encodeURIComponent(e))).join(r);switch(i.style){case"simple":return n;case"label":return`.${n}`;case"matrix":return`;${e}=${n}`;default:return`${e}=${n}`}}const r={simple:",",label:".",matrix:";"}[i.style]||"&",n=[];for(const r of t)"simple"===i.style||"label"===i.style?n.push(!0===i.allowReserved?r:encodeURIComponent(r)):n.push(me(e,r,i));return"label"===i.style||"matrix"===i.style?`${r}${n.join(r)}`:n.join(r)}function ve(e){return function(t){const i=[];if(t&&"object"==typeof t)for(const r in t){const n=t[r];if(null!=n)if(Array.isArray(n)){if(0===n.length)continue;i.push(fe(r,n,{style:"form",explode:!0,...e?.array,allowReserved:e?.allowReserved||!1}))}else"object"!=typeof n?i.push(me(r,n,e)):i.push(pe(r,n,{style:"deepObject",explode:!0,...e?.object,allowReserved:e?.allowReserved||!1}))}return i.join("&")}}function be(e,t){let i=e;for(const r of e.match(he)??[]){let e=r.substring(1,r.length-1),n=!1,a="simple";if(e.endsWith("*")&&(n=!0,e=e.substring(0,e.length-1)),e.startsWith(".")?(a="label",e=e.substring(1)):e.startsWith(";")&&(a="matrix",e=e.substring(1)),!t||void 0===t[e]||null===t[e])continue;const o=t[e];Array.isArray(o)?i=i.replace(r,fe(e,o,{style:a,explode:n})):i="object"!=typeof o?"matrix"!==a?i.replace(r,"label"===a?`.${encodeURIComponent(o)}`:encodeURIComponent(o)):i.replace(r,`;${me(e,o)}`):i.replace(r,pe(e,o,{style:a,explode:n}))}return i}function ge(e,t){if(e instanceof FormData)return e;if(t){if("application/x-www-form-urlencoded"===(t.get instanceof Function?t.get("Content-Type")??t.get("content-type"):t["Content-Type"]??t["content-type"]))return new URLSearchParams(e).toString()}return JSON.stringify(e)}function ye(...e){const t=new Headers;for(const i of e){if(!i||"object"!=typeof i)continue;const e=i instanceof Headers?i.entries():Object.entries(i);for(const[i,r]of e)if(null===r)t.delete(i);else if(Array.isArray(r))for(const e of r)t.append(i,e);else void 0!==r&&t.set(i,r)}return t}function we(e){return e.endsWith("/")?e.substring(0,e.length-1):e}const ke="https://connect.fiservapis.com/chc",$e={DEV:"https://connect-dev.fiservapis.com/chc",QA:"https://connect-qa.fiservapis.com/chc",PROD:"https://connect.fiservapis.com/chc"},xe=e=>e?Ie(Ae(e)?$e[e]:e):ke,Se=e=>Ee(e),Ce=e=>Ee(e),Ee=e=>{const t=ue({baseUrl:xe(e.baseUrl??e.baseURL)}),i={async onRequest({request:t}){const i=new Headers(t.headers);return ze(i,e.headers),e.getHeaders&&ze(i,await e.getHeaders()),new Request(t,{headers:i})}};return t.use(i),t},ze=(e,t)=>{new Headers(t).forEach((t,i)=>e.set(i,t))},Ae=e=>Object.prototype.hasOwnProperty.call($e,e),Ie=e=>e.endsWith("/")?e.slice(0,-1):e;class Ne{constructor(e){this.host=e,e.addController(this)}hostConnected(){}get errorMessage(){return this.refreshErrorMessage}reset({requestUpdate:e=!0}={}){this.snapshotInteractionId=void 0,this.refreshInteractionId=void 0,this.refreshPromise=void 0,this.refreshErrorMessage=void 0,e&&this.host.requestUpdate()}shouldRefresh(e){const t=e?.interactionId;return!!t&&this.snapshotInteractionId!==t}shouldRenderSkeleton(e){const t=e?.interactionId;return!!t&&(!(!this.refreshPromise||this.refreshInteractionId!==t)||!this.refreshErrorMessage&&this.shouldRefresh(e))}shouldRenderError(e){const t=e?.interactionId;return Boolean(t&&this.refreshErrorMessage&&this.snapshotInteractionId!==t)}async refreshFromInteraction(e){const t=e.getCurrentInteractionResponse()?.interactionId;if(t&&this.shouldRefresh(e.getCurrentInteractionResponse()))try{await this.fetch(t,e)}catch(e){}}fetch(e,t){return this.refreshInteractionId===e&&this.refreshPromise||(this.refreshInteractionId=e,this.refreshErrorMessage=void 0,this.host.requestUpdate(),this.refreshPromise=t.requestInteraction(e).then(i=>{const r=t.mergeInteractionResponse(t.getCurrentInteractionResponse()??{interactionId:e},i,t.getSelectedPaymentSourceId());return this.snapshotInteractionId=e,t.setInteractionResponse(r),t.emitListPaymentMethods(r.paymentSources??[]),r}).catch(t=>{throw this.snapshotInteractionId!==e&&(this.refreshErrorMessage="We couldn't load payment methods. Try again.",this.host.requestUpdate()),t}).finally(()=>{this.refreshPromise=void 0,this.refreshInteractionId=void 0,this.host.requestUpdate()})),this.refreshPromise}}class Te{constructor(e){this.host=e,this.balanceMap={},this.loadingIds=[],e.addController(this)}hostConnected(){}get balances(){return this.balanceMap}get loadingSourceIds(){return this.loadingIds}reset({requestUpdate:e=!0}={}){this.fetchKey=void 0,this.queuedFetchKey=void 0,this.balanceMap={},this.loadingIds=[],e&&this.host.requestUpdate()}queueRefresh(e,t){const i=e(),r=i?.interactionId,n=qe(i);if(!r||0===n.length){const t=void 0!==this.fetchKey||void 0!==this.queuedFetchKey||Object.keys(this.balanceMap).length>0||this.loadingIds.length>0;if(this.queuedFetchKey=void 0,!t)return;return void queueMicrotask(()=>{0===qe(e()).length&&(this.fetchKey=void 0,this.balanceMap={},this.loadingIds=[],this.host.requestUpdate())})}const a=Re(r,n);this.fetchKey!==a&&this.queuedFetchKey!==a&&(this.queuedFetchKey=a,queueMicrotask(()=>{if(this.queuedFetchKey!==a)return;this.queuedFetchKey=void 0;const i=e(),r=i?.interactionId,n=qe(i);r&&0!==n.length&&Re(r,n)===a&&this.refresh(e,t)}))}async refresh(e,t){const i=e(),r=i?.interactionId,n=qe(i);if(!r||0===n.length)return void this.reset();const a=Re(r,n);if(this.fetchKey!==a){this.fetchKey=a,this.balanceMap={},this.loadingIds=n.map(De),this.host.requestUpdate();try{const e=await t(r);if(this.fetchKey!==a)return;this.balanceMap=e,this.host.requestUpdate()}catch(e){this.fetchKey===a&&(this.balanceMap={},this.host.requestUpdate())}finally{this.fetchKey===a&&(this.loadingIds=[],this.host.requestUpdate())}}}}const qe=e=>(e?.paymentSources??[]).filter(Oe),Re=(e,t)=>`${e}:${t.map(e=>Be(e).join(",")).join("|")}`,Be=e=>[e.id,e.account?.positionId,e.account?.token].map(e=>e?.trim()).filter(e=>Boolean(e)),De=e=>e.id?.trim()||e.name?.trim()||e.tenderType,Oe=e=>"NativeAccount"===e.tenderType||"NATIVE_ACCOUNT"===e.tenderType,Ve="__new__",Le=()=>({name:"",fullName:"",cardNumber:"",expirationDate:"",cvv:"",billingAddressValue:Ve,country:"",addressLine1:"",addressLine2:"",city:"",state:"",zip:""}),Me=e=>"cardNumber"===e||"cvv"===e,Pe=e=>e.replace(/\D/g,""),Fe=e=>e.replace(/\D/g,""),je=(e,t)=>"cardNumber"===e?Pe(t):Fe(t),Ue=e=>{const t=Pe(e).slice(0,19);return He(t,_e(t))},_e=e=>/^3[47]/.test(e)?[4,6,5]:/^3(?:0[0-5]|[68])/.test(e)?[4,6,4]:[4,4,4,4,3],He=(e,t)=>{const i=[];let r=0;for(const n of t){if(r>=e.length)break;i.push(e.slice(r,r+n)),r+=n}return r<e.length&&i.push(e.slice(r)),i.join(" ")},We=e=>{const t=e.replace(/\D/g,"").slice(0,6);return t.length<=2?2===t.length?`${t} / `:t:`${t.slice(0,2)} / ${t.slice(2)}`},Ke=e=>({name:e.name.trim(),fullName:e.fullName.trim(),cardNumber:e.cardNumber.trim(),expirationDate:e.expirationDate.trim(),cvv:e.cvv.trim(),billingAddressValue:e.billingAddressValue.trim()||Ve,country:e.country.trim(),addressLine1:e.addressLine1.trim(),addressLine2:e.addressLine2.trim(),city:e.city.trim(),state:e.state.trim(),zip:e.zip.trim()}),Ye=e=>{const t={};return e.name||(t.name="Enter a card name."),e.fullName||(t.fullName="Enter the full name."),et(e.cardNumber)||(t.cardNumber="Enter a valid card number."),it(e.expirationDate)||(t.expirationDate="Enter a valid expiration date."),tt(e.cvv)||(t.cvv="Enter a valid CVC."),e.billingAddressValue||(t.billingAddressValue="Select a billing address."),e.billingAddressValue===Ve&&(e.country||(t.country="Select a country or region."),e.addressLine1||(t.addressLine1="Enter an address."),e.city||(t.city="Enter a city."),e.state||(t.state="Select a state."),/^\d{5}(?:-\d{4})?$/.test(e.zip)||(t.zip="Enter a valid ZIP code.")),t},Ge=e=>"cardNumber"===e?"Unable to encrypt the card number. Try again.":"Unable to encrypt the CVC. Try again.",Je=(e,t)=>t?e.normalizedValue!==t||"encrypting"!==e.status&&"encrypted"!==e.status?{status:"dirty",normalizedValue:t}:e:{status:"idle",normalizedValue:""},Ze=(e,t)=>{const i={...e};return delete i[t],i},Qe=(e,t)=>{const i={};for(const r of["cardNumber","cvv"]){const n=je(r,e[r]),a=t[r];if(!n)continue;"encrypted"===a.status&&a.normalizedValue===n&&Boolean(a.encryptedValue)||(i[r]="failed"===a.status?Ge(r):"cardNumber"===r?"Encrypt the card number before saving.":"Encrypt the CVC before saving.")}return i},Xe=(e,t,i)=>{const r=je(e,t),n=i[e];if("encrypted"!==n.status||n.normalizedValue!==r||!n.encryptedValue)throw new Error("cardNumber"===e?"Card number encryption must complete before saving.":"CVC encryption must complete before saving.");return n.encryptedValue},et=e=>{const t=Pe(e);if(t.length<12||t.length>19)return!1;let i=0,r=!1;for(let e=t.length-1;e>=0;e-=1){let n=Number(t[e]);r&&(n*=2,n>9&&(n-=9)),i+=n,r=!r}return i%10==0},tt=e=>/^\d{3,4}$/.test(Fe(e)),it=e=>{const t=e.replace(/\D/g,""),i=t.slice(0,2),r=t.slice(2),n=Number(i);if(!(2!==i.length||n<1||n>12))return 2===r.length?{month:i,year:`20${r}`}:4===r.length?{month:i,year:r}:void 0},rt=e=>{const t=Pe(e);return/^4/.test(t)?"Visa":/^(5[1-5]|2[2-7])/.test(t)?"Mastercard":/^3[47]/.test(t)?"AmericanExpress":/^(6011|65|64[4-9])/.test(t)?"Discover":void 0};let nt=0;const at=()=>(nt+=1,`billing-address-${Date.now().toString(36)}-${nt.toString(36)}`),ot=e=>"routingNumber"===e||"accountNumber"===e||"accountNumberReEntered"===e,st=e=>e.replace(/\D/g,""),ct=(e,t)=>"encrypted"===t.status&&Boolean(t.normalizedValue)&&e===dt(t.normalizedValue),dt=e=>e.length<=4?e:`${"•".repeat(e.length-4)}${kt(e)}`,lt=(e,t,i)=>"routingNumber"===e||ct(t[e],i[e])?"text":"password",ht=(e,t)=>({name:e.name.trim(),routingNumber:ut("routingNumber",e,t),accountNumber:ut("accountNumber",e,t),accountNumberReEntered:ut("accountNumberReEntered",e,t)}),ut=(e,t,i)=>{const r=t[e],n=i[e];return ct(r,n)?n.normalizedValue:st(r)},mt=(e,t)=>({name:e.name,routingNumber:pt("routingNumber",e,t),accountNumber:pt("accountNumber",e,t),accountNumberReEntered:pt("accountNumberReEntered",e,t)}),pt=(e,t,i)=>{const r=t[e];return ct(r,i[e])?r:st(r)},ft=e=>{const t={},i=st(e.routingNumber),r=st(e.accountNumber),n=st(e.accountNumberReEntered);return i?9!==i.length&&(t.routingNumber="Enter a 9-digit routing number."):t.routingNumber="Enter a routing number.",r||(t.accountNumber="Enter an account number."),n?r&&n!==r&&(t.accountNumberReEntered="Account numbers must match."):t.accountNumberReEntered="Confirm the account number.",t},vt=(e,t)=>{const i=ht(e,t);return 0===Object.keys(ft(i)).length&&["routingNumber","accountNumber","accountNumberReEntered"].every(e=>{const r=t[e],n=i[e];return"encrypted"===r.status&&r.normalizedValue===n&&Boolean(r.encryptedValue)})},bt=e=>"routingNumber"===e?"Unable to encrypt the routing number. Try again.":"Unable to encrypt the account number. Try again.",gt=({draft:e,errors:t,encryption:i,field:r,value:n})=>{if(ot(r)&&ct(n,i[r])){const t={...e,[r]:n};return{draft:t,errors:ft(ht(t,i)),encryption:i}}const a=((e,t)=>"routingNumber"===e?st(t).slice(0,9):"accountNumber"===e||"accountNumberReEntered"===e?st(t).slice(0,17):t)(r,n),o={...e,[r]:a};let s=i;if(ot(r)){if(ct(a,i[r]))return{draft:e,errors:t,encryption:i};s={...i,[r]:Je(i[r],st(a))}}return{draft:o,encryption:s,errors:ft(ht(o,s))}},yt=(e,t,i)=>{const r=t[e],n=st(r),a=i[e],o=ct(r,a)||n===a.normalizedValue;if("encrypted"===a.status&&a.encryptedValue&&o)return a.encryptedValue;if(!n)return"";throw new Error("ACH detail encryption must complete before saving.")},wt=(e,t)=>e.trim()||`Bank Account xxxxxx${t}`,kt=e=>e?.replace(/\D/g,"").slice(-4)??"",$t=e=>e.replace(/\D/g,""),xt=[3,2,4],St=e=>e.replace(/\D/g,"").slice(0,9),Ct=e=>xt[e]??0,Et=(e,t)=>Boolean(e[t]?.trim()),zt=(e,t)=>Boolean(e[t]),At=e=>({fromSourceId:e.fromSourceId.trim(),toSourceId:e.toSourceId.trim(),amount:e.amount.trim()}),It=(e,t)=>{const i={},r=new Set(t.map(e=>e.id)),n=Number(e.amount);return e.fromSourceId?r.has(e.fromSourceId)||(i.fromSourceId="Select a verified bank or native account."):i.fromSourceId="Select a source account.",e.toSourceId?r.has(e.toSourceId)?e.toSourceId===e.fromSourceId&&(i.toSourceId="Select a different destination account."):i.toSourceId="Select a verified bank or native account.":i.toSourceId="Select a destination account.",e.amount?(!Number.isFinite(n)||n<=0)&&(i.amount="Enter an amount greater than zero."):i.amount="Enter an amount.",i},Nt=(e,t)=>0===Object.keys(It(At(e),t)).length,Tt=e=>`${Number(e.amount).toFixed(2)} USD`,qt={alipay:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m114.26 257.95c-4.8 0.6-13.203 2.399-18.004 6.6-14.403 12.599-6.001 34.798 23.406 34.798 16.803 0 33.607-10.8 46.81-27.6-19.204-8.999-34.808-15.6-52.212-13.8v2e-3z" fill="#2BA6DF"/><path d="m221.83 273.4c27.006 9 33.007 9.6 33.007 9.6v-95.998c0-16.2-13.203-29.399-30.006-29.399h-126.03c-16.204 0-30.007 13.2-30.007 29.4v126c0 16.199 13.203 29.398 30.007 29.398h126.03c16.203 0 30.006-13.2 30.006-29.4v-1.199s-48.01-19.799-72.616-31.799c-16.203 19.799-37.208 32.399-59.413 32.399-37.208 0-49.811-32.399-31.807-53.398 3.6-4.801 10.202-9 20.404-11.4 15.604-3.6 40.81 2.4 64.215 10.199 4.2-7.799 7.801-16.199 10.202-25.199h-72.616v-7.2h37.208v-14.4h-45.61v-7.2h45.61v-18.598s0-3 3-3h18.005v22.2h45.01v6.6h-45.01v13.2h36.608c-3.6 14.399-9.002 27.598-15.604 38.999 12.003 4.199 22.205 7.8 29.407 10.198z" fill="#2BA6DF"/><path d="m340.49 201.22l39.608 85.797h-21.005l-10.802-22.8h-32.408l-10.802 22.8h-13.803l40.209-83.398s1.199-2.4 3.6-2.4h5.402v1e-3zm-21.006 55.198h25.206l-12.603-27-12.603 27zm87.448 31.281h-19.204v-81.598c0-2.4 1.2-3.6 4.2-3.6h15.004v85.198zm36.007-0.558h-19.203v-61.798c0-2.4 1.199-3.6 4.199-3.6h15.004v65.398zm23.483-64.116h12.604v6c2.4-1.8 4.801-3.6 7.801-4.2 3.002-1.2 6.002-1.8 10.203-1.8 4.199 0 7.801 0.6 10.803 2.4 3.6 1.8 6 3.6 8.4 6.6s4.201 6 5.402 9.6c1.199 3.6 1.799 7.2 1.799 11.399 0 5.399-0.6 10.2-2.398 14.4-1.801 4.199-3.602 8.399-6.602 11.399-3.002 3-6.002 5.999-10.203 7.8-4.201 1.799-8.402 2.399-13.203 2.399h-6.602c-1.799 0-3.6-0.601-5.4-1.2v21.6h-19.206v-78.597c-0.599-7.8 2.401-7.8 6.602-7.8zm12.603 46.798c0 1.801 0 3 0.6 4.2s1.201 2.399 2.4 3.601c1.199 1.199 2.4 1.799 3.602 2.399 1.199 0.601 3 0.601 4.801 0.601 1.799 0 3-0.601 4.801-1.801 1.199-1.199 3-2.4 3.602-4.8 0.6-2.399 1.799-4.2 2.398-7.2 0.602-2.999 1.201-5.399 1.201-8.999 0-4.201 0-7.8-0.6-10.8-0.602-3-1.201-5.4-2.4-7.8-1.201-1.8-2.4-3.6-3.6-4.8-1.201-1.2-3.002-1.8-4.803-1.8-1.199 0-2.4 0-3.6 0.6-1.201 0.6-2.4 1.2-3.002 1.8-1.199 0.6-1.799 1.8-3 2.4-1.201 1.2-1.801 1.8-2.4 3v29.4-1e-3zm81.028-46.798c4.801 0 8.402 0.6 12.002 1.2 3 0.6 6.002 1.8 8.402 3.6s3.6 3.6 4.801 5.4c1.199 2.4 1.801 4.8 1.801 7.2v47.398h-19.205v-4.8c-1.199 1.2-2.398 1.8-3 2.399l-3.602 1.801c-1.199 0.6-2.4 1.199-4.199 1.199-1.801 0.601-3.602 0.601-5.402 0.601-3 0-5.4-0.601-7.803-1.2-2.398-0.6-4.199-1.8-6-3.6-1.801-1.2-3.002-3-3.602-5.4-0.6-1.8-1.199-4.199-1.199-6.6s0.6-4.801 1.199-6.6c0.6-1.801 2.4-3.601 3.602-5.4 1.199-1.8 3.6-3 5.4-4.2 2.4-1.2 4.201-2.4 7.203-3.6 2.398-1.199 4.799-1.799 7.801-3 2.4-0.6 5.4-1.8 7.801-2.4l2.4-0.6v-6.6c0-1.8 0-3.6-0.6-5.4l-1.801-3.6c-0.6-0.6-1.799-1.8-2.398-1.8-1.201-0.6-2.4-0.6-3.602-0.6 0 0-10.203 0-19.205 7.8l-4.201-6.6c-1.798 1.201 9.004-6.598 23.407-6.598zm6.599 31.799c-1.799 0.6-3.6 1.801-5.398 3l-5.402 3.6c-1.801 1.201-3 2.4-3.6 4.2-1.201 1.2-1.201 3-1.201 4.2s0 2.4 0.6 3.601c0.6 1.199 0.6 1.8 1.199 3 0.602 1.199 1.201 1.199 1.801 1.8 0.6 0.6 1.201 0.6 2.4 0.6 1.801 0 3.002-0.6 4.801-1.2l5.402-3.6v-19.2h-0.602zm46.555 53.998h-12.604l-0.6-11.399s15.604 0.6 20.404-5.4c1.801-2.4 3-8.999 3-8.999l-31.205-59.998h21.004l19.805 38.999 17.404-39h13.803l-31.807 70.799c-1.2 2.4-6.001 14.999-19.204 14.998z" fill="#3F3A39"/><ellipse cx="433.4" cy="204.1" rx="9.602" ry="8.5" fill="#2BA6DF"/><path d="m683.68 172.91h-6.602v-1.2h14.402v1.2h-6.6v18.599h-1.801v-18.599h0.601zm10.716-1.201h2.4l4.201 11.4 1.801 4.2c0.6-1.2 1.199-3 1.799-4.2l4.201-11.4h2.4v20.4h-2.398v-18l-1.801 4.8-4.201 12h-1.198l-4.201-12-1.801-4.8v18h-1.801v-20.4h0.599z" fill="#3F3A39"/></svg>',amex:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m575.61 145.11l-15.092 35.039h30.266l-15.174-35.039zm-174.15 21.713c2.845-1.422 4.52-4.515 4.52-8.356 0-3.764-1.76-6.49-4.604-7.771-2.591-1.42-6.577-1.584-10.399-1.584h-27v19.523h26.638c4.266 1e-3 7.831-0.059 10.845-1.812zm-345.97-21.713l-14.921 35.039h29.932l-15.011-35.039zm694.7 224.47h-42.344v-18.852h42.173c4.181 0 7.109-0.525 8.872-2.178 1.667-1.473 2.609-3.555 2.592-5.732 0-2.562-1.062-4.596-2.68-5.813-1.588-1.342-3.907-1.953-7.726-1.953-20.588-0.67-46.273 0.609-46.273-27.211 0-12.75 8.451-26.172 31.461-26.172h43.677v-17.492h-40.58c-12.246 0-21.144 2.81-27.443 7.181v-7.181h-60.022c-9.597 0-20.863 2.279-26.191 7.181v-7.181h-107.19v7.181c-8.529-5.897-22.925-7.181-29.565-7.181h-70.702v7.181c-6.747-6.262-21.758-7.181-30.902-7.181h-79.127l-18.104 18.775-16.959-18.775h-118.2v122.68h115.97l18.655-19.076 17.575 19.076 71.484 0.06v-28.859h7.03c9.484 0.146 20.67-0.223 30.542-4.311v33.106h58.962v-31.976h2.844c3.628 0 3.988 0.146 3.988 3.621v28.348h179.12c11.372 0 23.26-2.786 29.841-7.853v7.853h56.817c11.822 0 23.369-1.588 32.154-5.653v-22.853c-5.324 7.462-15.707 11.245-29.751 11.245zm-363.58-28.967h-27.36v29.488h-42.618l-27-29.102-28.058 29.102h-86.854v-87.914h88.19l26.976 28.818 27.89-28.818h70.064c17.401 0 36.952 4.617 36.952 28.963 0 24.422-19.016 29.463-38.182 29.463zm131.56-3.986c3.097 4.291 3.544 8.297 3.634 16.047v17.428h-22.016v-10.998c0-5.289 0.533-13.121-3.544-17.209-3.2-3.148-8.086-3.9-16.088-3.9h-23.432v32.107h-22.031v-87.914h50.62c11.105 0 19.188 0.473 26.384 4.148 6.92 4.006 11.275 9.494 11.275 19.523-2e-3 14.031-9.769 21.189-15.541 23.389 4.878 1.725 8.866 4.818 10.739 7.379zm90.575-36.258h-51.346v15.982h50.091v17.938h-50.091v17.492l51.346 0.078v18.242h-73.182v-87.914h73.182v18.182zm56.344 69.731h-42.705v-18.852h42.535c4.16 0 7.109-0.527 8.957-2.178 1.507-1.359 2.591-3.336 2.591-5.73 0-2.564-1.174-4.598-2.676-5.818-1.678-1.34-3.993-1.947-7.809-1.947-20.506-0.674-46.186 0.605-46.186-27.213 0-12.752 8.363-26.174 31.35-26.174h43.96v18.709h-40.225c-3.987 0-6.579 0.146-8.783 1.592-2.405 1.424-3.295 3.535-3.295 6.322 0 3.316 2.04 5.574 4.797 6.549 2.314 0.771 4.797 0.996 8.533 0.996l11.805 0.309c11.899 0.273 20.073 2.25 25.04 7.068 4.266 4.232 6.559 9.578 6.559 18.625-2e-3 18.913-12.335 27.742-34.448 27.742zm-170.06-68.313c-2.649-1.508-6.559-1.588-10.461-1.588h-27.001v19.744h26.64c4.265 0 7.892-0.145 10.822-1.812 2.842-1.646 4.543-4.678 4.543-8.438s-1.701-6.482-4.543-7.906zm244.99-1.59c-3.988 0-6.641 0.145-8.873 1.588-2.314 1.426-3.202 3.537-3.202 6.326 0 3.314 1.953 5.572 4.794 6.549 2.315 0.771 4.796 0.996 8.448 0.996l11.887 0.303c11.99 0.285 19.998 2.262 24.879 7.08 0.889 0.668 1.423 1.42 2.034 2.174v-25.014h-39.965l-2e-3 -2e-3zm-352.65 0h-28.59v22.391h28.336c8.424 0 13.663-4.006 13.667-11.611-4e-3 -7.688-5.497-10.78-13.413-10.78zm-190.81 0v15.984h48.136v17.938h-48.136v17.49h53.909l25.047-25.791-23.983-25.621h-54.973zm140.77 61.479v-70.482l-33.664 34.674 33.664 35.808zm-138.93-141.15v15.148h183.19l-0.085-32.046h3.545c2.483 0.083 3.205 0.302 3.205 4.229v27.818h94.748v-7.461c7.642 3.924 19.527 7.461 35.168 7.461h39.86l8.531-19.522h18.913l8.342 19.522h76.811v-18.544l11.629 18.543h61.555v-122.58h-60.915v14.477l-8.53-14.477h-62.507v14.477l-7.833-14.477h-84.434c-14.135 0-26.555 1.89-36.591 7.158v-7.158h-58.268v7.158c-6.387-5.43-15.089-7.158-24.762-7.158h-212.87l-14.282 31.662-14.668-31.662h-67.047v14.477l-7.367-14.477h-57.18l-26.553 58.284v46.621l39.264-87.894h32.579l37.29 83.217v-83.217h35.789l28.695 59.625 26.362-59.625h36.507v87.894h-22.475l-0.082-68.837-31.796 68.837h-19.252l-31.877-68.898v68.898h-44.6l-8.425-19.605h-45.654l-8.512 19.605h-23.814v17.682h37.466l8.447-19.523h18.914l8.425 19.523h73.713v-14.927l6.579 14.989h38.266l6.58-15.214zm288.67-80.176c7.085-7.015 18.188-10.25 33.298-10.25h21.227v18.833h-20.782c-7.998 0-12.521 1.14-16.871 5.208-3.74 3.7-6.304 10.696-6.304 19.908 0 9.417 1.955 16.206 6.028 20.641 3.376 3.478 9.513 4.533 15.283 4.533h9.851l30.902-69.12h32.853l37.124 83.134v-83.133h33.386l38.543 61.213v-61.213h22.46v87.891h-31.072l-41.562-65.968v65.968h-44.656l-8.532-19.605h-45.55l-8.278 19.605h-25.66c-10.657 0-24.151-2.258-31.793-9.722-7.707-7.462-11.713-17.571-11.713-33.553-4e-3 -13.037 2.389-24.953 11.818-34.37zm-45.101-10.249h22.372v87.894h-22.372v-87.894zm-100.87 0h50.432c11.203 0 19.464 0.285 26.553 4.21 6.936 3.926 11.095 9.658 11.095 19.46 0 14.015-9.763 21.254-15.448 23.429 4.796 1.75 8.896 4.841 10.849 7.401 3.096 4.372 3.629 8.277 3.629 16.126v17.267h-22.115l-0.083-11.084c0-5.29 0.528-12.896-3.461-17.122-3.203-3.09-8.088-3.763-15.983-3.763h-23.538v31.97h-21.927l-3e-3 -87.894zm-88.393 0h73.249v18.303h-51.32v15.843h50.088v18.017h-50.088v17.553h51.32v18.177h-73.249v-87.893z" fill="#2557D6"/></svg>',diners:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m599.93 251.45c0-99.416-82.979-168.13-173.9-168.1h-78.241c-92.003-0.033-167.73 68.705-167.73 168.1 0 90.931 75.729 165.64 167.73 165.2h78.241c90.913 0.437 173.9-74.293 173.9-165.2z" fill="#0079BE"/><path d="m348.28 97.432c-84.069 0.026-152.19 68.308-152.22 152.58 0.021 84.258 68.145 152.53 152.22 152.56 84.088-0.025 152.23-68.301 152.24-152.56-0.011-84.274-68.15-152.55-152.24-152.58z" fill="#fff"/><path d="m252.07 249.6c0.08-41.18 25.747-76.296 61.94-90.25v180.48c-36.193-13.946-61.861-49.044-61.94-90.229zm131 90.275v-180.52c36.208 13.921 61.915 49.057 61.98 90.256-0.066 41.212-25.772 76.322-61.98 90.269z" fill="#0079BE"/></svg>',discover:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m409.41 197.26c30.938 0 56.02 23.58 56.02 52.709v0.033c0 29.129-25.082 52.742-56.02 52.742-30.941 0-56.022-23.613-56.022-52.742v-0.033c0-29.129 25.081-52.709 56.022-52.709z" fill="#F47216"/><path d="m321.43 197.94c8.836 0 16.247 1.785 25.27 6.09v22.753c-8.544-7.863-15.955-11.154-25.757-11.154-19.265 0-34.413 15.015-34.413 34.051 0 20.074 14.681 34.195 35.368 34.195 9.312 0 16.586-3.12 24.802-10.856v22.764c-9.343 4.142-16.912 5.775-25.757 5.775-31.277 0-55.581-22.597-55.581-51.736-2e-3 -28.83 24.949-51.882 56.068-51.882zm-97.113 0.626c11.546 0 22.109 3.721 30.942 10.994l-10.748 13.248c-5.351-5.646-10.411-8.027-16.563-8.027-8.854 0-15.301 4.744-15.301 10.988 0 5.354 3.618 8.188 15.944 12.481 23.364 8.043 30.289 15.176 30.289 30.926 0 19.193-14.976 32.554-36.319 32.554-15.631 0-26.993-5.795-36.457-18.871l13.268-12.03c4.73 8.608 12.622 13.223 22.42 13.223 9.163 0 15.947-5.95 15.947-13.983 0-4.164-2.056-7.733-6.158-10.258-2.066-1.195-6.158-2.978-14.199-5.646-19.292-6.538-25.91-13.527-25.91-27.186-1e-3 -16.227 14.213-28.413 32.845-28.413zm234.72 1.729h22.436l28.084 66.592 28.447-66.592h22.267l-45.493 101.69h-11.054l-44.687-101.69zm-301.21 0.152h20.541v99.143h-20.541v-99.143zm411.73 0h58.253v16.799h-37.726v22.006h36.336v16.791h-36.336v26.762h37.726v16.785h-58.253v-99.143zm115.59 57.377c15.471-2.965 23.983-12.926 23.983-28.105 0-18.562-13.575-29.271-37.266-29.271h-30.454v99.144h20.516v-39.83h2.681l28.43 39.828h25.26l-33.15-41.766zm-17.218-11.736h-6.002v-30.025h6.326c12.791 0 19.744 5.049 19.744 14.697 2e-3 9.967-6.951 15.328-20.068 15.328zm-576.09-45.641h-30.149v99.143h29.992c15.946 0 27.465-3.543 37.573-11.445 12.014-9.359 19.117-23.467 19.117-38.057 1e-3 -29.259-23.221-49.641-56.533-49.641zm23.997 74.479c-6.454 5.484-14.837 7.879-28.108 7.879h-5.514v-65.559h5.513c13.271 0 21.323 2.238 28.108 8.018 7.104 5.956 11.377 15.184 11.377 24.682 1e-3 9.513-4.273 19.024-11.376 24.98z"/></svg>',elo:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m166.5 184.95c6.8-2.3 14.1-3.5 21.7-3.5 33.2 0 60.9 23.6 67.2 54.9l47-9.6c-10.8-53.2-57.8-93.3-114.2-93.3-12.9 0-25.3 2.1-36.9 6l15.2 45.5z" fill="#FFF100"/><path d="m111 337.35l31.8-36c-14.2-12.6-23.1-30.9-23.1-51.4 0-20.4 8.9-38.8 23.1-51.3l-31.8-35.9c-24.1 21.4-39.3 52.5-39.3 87.3 0 34.7 15.2 65.899 39.3 87.3z" fill="#00A3DF"/><path d="m255.4 263.75c-6.4 31.3-34 54.8-67.2 54.8-7.6 0-14.9-1.2-21.8-3.5l-15.2 45.5c11.6 3.899 24.1 6 37 6 56.4 0 103.4-40 114.2-93.2l-47-9.6z" fill="#EE4023"/><path d="m459 295.95c-7.799 7.601-18.299 12.2-29.9 12-8-0.1-15.398-2.5-21.6-6.5l-15.6 24.801c10.699 6.699 23.199 10.699 36.801 10.899 19.699 0.3 37.698-7.5 50.8-20.2l-20.501-21zm-28.199-101.1c-39.201-0.6-71.6 30.8-72.201 70-0.2 14.7 4 28.5 11.5 39.9l128.8-55.101c-7.199-30.899-34.798-54.199-68.098-54.799m-42.701 75.599c-0.2-1.6-0.3-3.3-0.3-5 0.4-23.1 19.401-41.6 42.5-41.2 12.6 0.2 23.799 5.9 31.299 14.9l-73.499 31.3zm151.3-107.6v137.3l23.801 9.9-11.301 27.1-23.6-9.8c-5.299-2.3-8.9-5.8-11.6-9.8-2.6-4-4.6-9.601-4.6-17v-137.7h27.3zm85.901 63.5c4.201-1.4 8.6-2.1 13.301-2.1 20.299 0 37.1 14.4 41 33.5l28.699-5.9c-6.6-32.5-35.299-56.9-69.699-56.9-7.9 0-15.5 1.3-22.5 3.6l9.199 27.8zm-33.901 92.9l19.4-21.9c-8.699-7.7-14.1-18.9-14.1-31.4s5.5-23.7 14.1-31.3l-19.4-21.9c-14.699 13-24 32.1-24 53.3s9.301 40.2 24 53.2zm88.202-44.801c-3.9 19.101-20.801 33.5-41 33.5-4.6 0-9.1-0.8-13.301-2.199l-9.299 27.8c7.1 2.399 14.699 3.7 22.6 3.7 34.4 0 63.1-24.4 69.699-56.9l-28.699-5.901z"/></svg>',generic:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><rect width="780" height="500" fill="#000C9D"/><rect x="66.908" y="106.91" width="110.32" height="99.679" fill="#9D9400"/><path d="m94.714 284.15v-3.795h-5.117v-11.27h-4.198l-0.402 11.27h-11.443l10.58-25.07-3.967-1.725-11.673 27.141v3.449h16.445v9.66h4.658v-9.66h5.117zm19.586-30.589c-4.025 0-7.878 1.381-11.213 4.6l2.588 2.934c2.645-2.473 5.002-3.68 8.395-3.68 4.197 0 7.532 2.357 7.532 6.727 0 4.773-3.737 6.959-7.532 6.959h-2.358l-0.575 3.795h3.335c4.658 0 8.223 1.84 8.223 7.531 0 4.945-3.278 8.107-8.855 8.107-3.22 0-6.555-1.322-8.798-3.967l-3.22 2.645c2.99 3.68 7.705 5.232 12.133 5.232 8.165 0 13.742-5.174 13.742-12.018 0-6.152-4.37-9.371-9.027-9.717 4.197-0.807 7.762-4.43 7.762-9.199 0-5.406-4.715-9.949-12.132-9.949zm34.477 0c-5.347 0-8.912 1.896-12.075 5.693l3.335 2.529c2.53-2.934 4.658-4.197 8.568-4.197 4.427 0 7.072 2.76 7.072 7.188 0 6.496-3.22 10.809-18.17 25.127v3.908h23.518l0.575-4.08h-18.63c13.052-11.904 17.71-17.826 17.71-25.07 0-6.325-4.428-11.098-11.903-11.098zm48.738 36.339h-8.28v-35.648h-4.198l-11.73 7.244 2.07 3.393 9.085-5.463v30.476h-9.775v3.908h22.828v-3.91zm69.587-5.75v-3.795h-5.117v-11.27h-4.198l-0.402 11.27h-11.443l10.58-25.07-3.967-1.725-11.673 27.141v3.449h16.445v9.66h4.658v-9.66h5.117zm19.585-30.589c-4.025 0-7.877 1.381-11.212 4.6l2.587 2.934c2.645-2.473 5.003-3.68 8.395-3.68 4.198 0 7.533 2.357 7.533 6.727 0 4.773-3.738 6.959-7.533 6.959h-2.357l-0.575 3.795h3.335c4.657 0 8.222 1.84 8.222 7.531 0 4.945-3.277 8.107-8.855 8.107-3.22 0-6.555-1.322-8.797-3.967l-3.22 2.645c2.99 3.68 7.705 5.232 12.132 5.232 8.165 0 13.743-5.174 13.743-12.018 0-6.152-4.37-9.371-9.028-9.717 4.198-0.807 7.763-4.43 7.763-9.199 0-5.406-4.715-9.949-12.133-9.949zm34.478 0c-5.348 0-8.913 1.896-12.075 5.693l3.335 2.529c2.53-2.934 4.657-4.197 8.567-4.197 4.428 0 7.073 2.76 7.073 7.188 0 6.496-3.221 10.809-18.171 25.127v3.908h23.518l0.575-4.08h-18.63c13.053-11.904 17.71-17.826 17.71-25.07 0-6.325-4.427-11.098-11.902-11.098zm48.737 36.339h-8.28v-35.648h-4.196l-11.729 7.244 2.069 3.393 9.085-5.463v30.476h-9.774v3.908h22.827l-2e-3 -3.91zm69.588-5.75v-3.795h-5.119v-11.27h-4.197l-0.401 11.27h-11.443l10.58-25.07-3.969-1.725-11.672 27.141v3.449h16.445v9.66h4.656v-9.66h5.12zm19.584-30.589c-4.023 0-7.877 1.381-11.213 4.6l2.588 2.934c2.646-2.473 5.002-3.68 8.396-3.68 4.195 0 7.531 2.357 7.531 6.727 0 4.773-3.736 6.959-7.531 6.959h-2.358l-0.574 3.795h3.334c4.658 0 8.225 1.84 8.225 7.531 0 4.945-3.278 8.107-8.854 8.107-3.222 0-6.556-1.322-8.799-3.967l-3.22 2.645c2.988 3.68 7.703 5.232 12.134 5.232 8.163 0 13.741-5.174 13.741-12.018 0-6.152-4.371-9.371-9.026-9.717 4.196-0.807 7.762-4.43 7.762-9.199-3e-3 -5.406-4.718-9.949-12.136-9.949zm34.479 0c-5.348 0-8.912 1.896-12.076 5.693l3.337 2.529c2.528-2.934 4.657-4.197 8.565-4.197 4.428 0 7.072 2.76 7.072 7.188 0 6.496-3.219 10.809-18.17 25.127v3.908h23.518l0.576-4.08h-18.631c13.053-11.904 17.711-17.826 17.711-25.07 0-6.326-4.428-11.098-11.904-11.098h2e-3zm48.736 36.339h-8.279v-35.648h-4.197l-11.729 7.244 2.07 3.393 9.084-5.463v30.476h-9.775v3.908h22.828l-2e-3 -3.91zm69.588-5.75v-3.795h-5.117v-11.27h-4.197l-0.401 11.27h-11.443l10.58-25.07-3.967-1.725-11.672 27.141v3.449h16.445v9.66h4.655v-9.66h5.117zm19.584-30.589c-4.023 0-7.877 1.381-11.211 4.6l2.588 2.934c2.646-2.473 5.002-3.68 8.396-3.68 4.196 0 7.532 2.357 7.532 6.727 0 4.773-3.737 6.959-7.532 6.959h-2.357l-0.574 3.795h3.334c4.658 0 8.224 1.84 8.224 7.531 0 4.945-3.277 8.107-8.855 8.107-3.219 0-6.555-1.322-8.797-3.967l-3.221 2.645c2.99 3.68 7.705 5.232 12.133 5.232 8.166 0 13.742-5.174 13.742-12.018 0-6.152-4.369-9.371-9.027-9.717 4.197-0.807 7.764-4.43 7.764-9.199 0-5.406-4.715-9.949-12.133-9.949h-6e-3zm34.478 0c-5.347 0-8.912 1.896-12.074 5.693l3.334 2.529c2.531-2.934 4.658-4.197 8.567-4.197 4.429 0 7.072 2.76 7.072 7.188 0 6.496-3.221 10.809-18.17 25.127v3.908h23.519l0.575-4.08h-18.631c13.054-11.904 17.711-17.826 17.711-25.07 2e-3 -6.325-4.428-11.098-11.903-11.098zm48.739 36.339h-8.278v-35.648h-4.2l-11.729 7.244 2.068 3.393 9.086-5.463v30.476h-9.775v3.908h22.828v-3.91z" fill="#fff"/><path d="m72.219 389.2h6.445v-22.246l-7.012 1.406v-3.594l6.973-1.406h3.945v25.84h6.446v3.32h-16.797v-3.32zm25.468 0h6.446v-22.246l-7.012 1.406v-3.594l6.973-1.406h3.945v25.84h6.445v3.32h-16.797v-3.32zm40.918 0h13.77v3.32h-18.516v-3.32c1.497-1.549 3.535-3.625 6.114-6.229 2.591-2.617 4.218-4.305 4.882-5.061 1.263-1.42 2.142-2.617 2.637-3.594 0.508-0.988 0.762-1.959 0.762-2.91 0-1.549-0.547-2.811-1.64-3.789-1.081-0.977-2.495-1.465-4.24-1.465-1.237 0-2.545 0.215-3.925 0.646-1.367 0.43-2.831 1.08-4.394 1.953v-3.986c1.588-0.637 3.072-1.119 4.453-1.443 1.38-0.326 2.643-0.486 3.789-0.486 3.021 0 5.429 0.754 7.226 2.264 1.797 1.512 2.696 3.529 2.696 6.055 0 1.199-0.228 2.338-0.684 3.418-0.442 1.068-1.256 2.332-2.441 3.789-0.326 0.377-1.361 1.471-3.106 3.281-1.745 1.796-4.206 4.315-7.383 7.557zm34.024-12.402c1.888 0.404 3.359 1.244 4.414 2.521 1.067 1.275 1.601 2.852 1.601 4.727 0 2.877-0.99 5.104-2.968 6.682-1.979 1.574-4.792 2.361-8.438 2.361-1.224 0-2.487-0.125-3.789-0.371-1.289-0.234-2.623-0.594-4.004-1.074v-3.809c1.093 0.639 2.292 1.119 3.594 1.445 1.302 0.324 2.663 0.488 4.082 0.488 2.474 0 4.356-0.488 5.645-1.465 1.302-0.979 1.953-2.396 1.953-4.26 0-1.719-0.605-3.061-1.817-4.021-1.198-0.979-2.872-1.465-5.02-1.465h-3.398v-3.242h3.555c1.94 0 3.425-0.385 4.453-1.152 1.029-0.781 1.543-1.9 1.543-3.359 0-1.496-0.534-2.645-1.601-3.438-1.055-0.809-2.572-1.211-4.551-1.211-1.081 0-2.24 0.117-3.477 0.354-1.237 0.232-2.597 0.598-4.082 1.092v-3.514c1.498-0.418 2.897-0.73 4.2-0.939 1.314-0.207 2.551-0.311 3.71-0.311 2.995 0 5.365 0.682 7.11 2.049 1.745 1.354 2.617 3.189 2.617 5.508 0 1.615-0.462 2.98-1.387 4.102-0.925 1.105-2.24 1.872-3.945 2.302zm26.289-13.438h15.488v3.32h-11.874v7.148c0.573-0.195 1.146-0.34 1.719-0.43 0.573-0.105 1.146-0.156 1.719-0.156 3.255 0 5.833 0.893 7.734 2.676s2.852 4.199 2.852 7.246c0 3.139-0.977 5.578-2.93 7.324-1.954 1.732-4.708 2.598-8.262 2.598-1.224 0-2.474-0.104-3.75-0.312-1.263-0.207-2.571-0.521-3.926-0.938v-3.965c1.172 0.639 2.383 1.113 3.633 1.426s2.572 0.469 3.965 0.469c2.253 0 4.037-0.594 5.352-1.777s1.972-2.793 1.972-4.824-0.657-3.639-1.972-4.824-3.099-1.775-5.352-1.775c-1.055 0-2.109 0.117-3.164 0.352-1.041 0.234-2.109 0.6-3.203 1.092l-1e-3 -14.65zm33.867 15.313c-1.875 0-3.353 0.502-4.434 1.506-1.067 1.002-1.601 2.383-1.601 4.141s0.534 3.137 1.601 4.139c1.082 1.004 2.56 1.506 4.434 1.506 1.875 0 3.354-0.502 4.434-1.504 1.08-1.016 1.62-2.396 1.62-4.141 0-1.758-0.54-3.139-1.62-4.141-1.068-1.004-2.546-1.506-4.434-1.506zm-3.945-1.68c-1.693-0.416-3.015-1.203-3.965-2.363-0.938-1.158-1.406-2.57-1.406-4.236 0-2.332 0.827-4.174 2.48-5.527 1.667-1.354 3.945-2.029 6.836-2.029 2.904 0 5.183 0.676 6.836 2.027 1.653 1.355 2.48 3.197 2.48 5.529 0 1.666-0.475 3.078-1.425 4.236-0.938 1.16-2.247 1.947-3.926 2.363 1.9 0.443 3.378 1.311 4.434 2.598 1.067 1.289 1.601 2.865 1.601 4.729 0 2.824-0.866 4.992-2.598 6.504-1.719 1.51-4.186 2.266-7.402 2.266s-5.69-0.756-7.422-2.266c-1.719-1.512-2.578-3.68-2.578-6.504 0-1.863 0.534-3.439 1.602-4.729 1.067-1.289 2.551-2.154 4.453-2.598zm-1.446-6.228c0 1.51 0.469 2.688 1.407 3.533 0.95 0.848 2.278 1.271 3.984 1.271 1.693 0 3.015-0.424 3.965-1.271 0.963-0.848 1.445-2.023 1.445-3.535 0-1.51-0.481-2.688-1.445-3.535-0.951-0.846-2.272-1.271-3.965-1.271-1.706 0-3.034 0.426-3.984 1.271-0.938 0.847-1.407 2.025-1.407 3.537z" fill="#fff" fill-opacity=".784"/><path d="m325.45 388.23h6.444v-22.246l-7.012 1.406v-3.594l6.973-1.406h3.946v25.84h6.444v3.32h-16.797l2e-3 -3.32zm36.738-12.404c1.889 0.404 3.359 1.244 4.415 2.521 1.067 1.275 1.602 2.852 1.602 4.727 0 2.877-0.989 5.105-2.969 6.68-1.979 1.576-4.791 2.363-8.438 2.363-1.224 0-2.487-0.123-3.79-0.371-1.288-0.232-2.622-0.592-4.003-1.074v-3.809c1.094 0.639 2.292 1.121 3.595 1.445 1.303 0.326 2.662 0.488 4.082 0.488 2.474 0 4.354-0.488 5.645-1.465 1.302-0.977 1.953-2.396 1.953-4.258 0-1.719-0.605-3.061-1.816-4.023-1.197-0.977-2.871-1.465-5.02-1.465h-3.398v-3.242h3.556c1.939 0 3.425-0.385 4.453-1.152 1.028-0.781 1.543-1.9 1.543-3.359 0-1.496-0.533-2.643-1.603-3.438-1.055-0.807-2.571-1.209-4.55-1.209-1.081 0-2.24 0.115-3.479 0.35-1.236 0.234-2.598 0.6-4.081 1.096v-3.518c1.497-0.416 2.896-0.729 4.198-0.938 1.315-0.209 2.553-0.312 3.71-0.312 2.996 0 5.365 0.686 7.11 2.053 1.744 1.354 2.616 3.189 2.616 5.508 0 1.613-0.462 2.98-1.386 4.102-0.923 1.103-2.239 1.872-3.945 2.3zm16.915 12.404h13.771v3.32h-18.518v-3.32c1.498-1.551 3.536-3.627 6.114-6.23 2.59-2.617 4.218-4.305 4.883-5.059 1.264-1.42 2.143-2.617 2.637-3.594 0.508-0.99 0.762-1.961 0.762-2.91 0-1.549-0.547-2.812-1.64-3.789-1.081-0.977-2.494-1.465-4.239-1.465-1.236 0-2.545 0.215-3.926 0.645-1.367 0.43-2.831 1.08-4.396 1.953v-3.984c1.589-0.639 3.073-1.119 4.453-1.445s2.645-0.488 3.789-0.488c3.021 0 5.43 0.756 7.227 2.268 1.797 1.51 2.695 3.527 2.695 6.055 0 1.195-0.227 2.336-0.684 3.418-0.441 1.066-1.256 2.33-2.441 3.789-0.325 0.377-1.36 1.471-3.104 3.279-1.746 1.796-4.206 4.315-7.383 7.557zm22.753 0h6.447v-22.246l-7.014 1.406v-3.594l6.975-1.406h3.943v25.84h6.445v3.32h-16.798l2e-3 -3.32zm49.472-12.404c1.889 0.404 3.358 1.244 4.414 2.521 1.067 1.275 1.604 2.852 1.604 4.727 0 2.877-0.99 5.105-2.971 6.68-1.979 1.576-4.791 2.363-8.438 2.363-1.223 0-2.485-0.123-3.788-0.371-1.289-0.232-2.623-0.592-4.005-1.074v-3.809c1.095 0.639 2.293 1.121 3.595 1.445 1.303 0.326 2.664 0.488 4.082 0.488 2.475 0 4.354-0.488 5.645-1.465 1.303-0.977 1.953-2.396 1.953-4.258 0-1.719-0.605-3.061-1.814-4.023-1.198-0.977-2.873-1.465-5.021-1.465h-3.396v-3.242h3.554c1.94 0 3.424-0.385 4.453-1.152 1.028-0.781 1.543-1.9 1.543-3.359 0-1.496-0.533-2.643-1.603-3.438-1.055-0.807-2.569-1.209-4.551-1.209-1.08 0-2.238 0.115-3.477 0.35-1.236 0.234-2.599 0.6-4.082 1.096v-3.518c1.497-0.416 2.897-0.729 4.2-0.938 1.314-0.209 2.552-0.312 3.709-0.312 2.996 0 5.365 0.686 7.109 2.053 1.746 1.354 2.617 3.189 2.617 5.508 0 1.613-0.461 2.98-1.387 4.102-0.923 1.103-2.238 1.872-3.945 2.3zm24.356-10l-9.959 15.568h9.959v-15.568zm-1.036-3.435h4.961v19.004h4.159v3.281h-4.159v6.875h-3.925v-6.875h-13.166v-3.811l12.132-18.477h-2e-3v3e-3zm15.706 0h15.486v3.32h-11.875v7.146c0.574-0.195 1.146-0.338 1.721-0.43 0.572-0.104 1.146-0.156 1.718-0.156 3.256 0 5.834 0.893 7.735 2.676 1.9 1.785 2.851 4.199 2.851 7.246 0 3.139-0.978 5.58-2.931 7.324-1.953 1.73-4.707 2.598-8.262 2.598-1.223 0-2.473-0.104-3.75-0.311-1.262-0.209-2.57-0.521-3.926-0.939v-3.965c1.172 0.639 2.383 1.113 3.633 1.426 1.25 0.314 2.572 0.469 3.967 0.469 2.252 0 4.035-0.592 5.351-1.775 1.315-1.186 1.973-2.793 1.973-4.824s-0.656-3.641-1.973-4.824c-1.314-1.186-3.099-1.777-5.351-1.777-1.055 0-2.108 0.117-3.164 0.352-1.043 0.234-2.11 0.6-3.203 1.094v-14.65zm25.466 0h15.489v3.32h-11.877v7.146c0.572-0.195 1.146-0.338 1.72-0.43 0.571-0.104 1.146-0.156 1.719-0.156 3.256 0 5.832 0.893 7.733 2.676 1.9 1.785 2.853 4.199 2.853 7.246 0 3.139-0.978 5.58-2.93 7.324-1.953 1.73-4.707 2.598-8.263 2.598-1.225 0-2.475-0.104-3.75-0.311-1.264-0.209-2.571-0.521-3.926-0.939v-3.965c1.172 0.639 2.383 1.113 3.633 1.426 1.25 0.314 2.572 0.469 3.965 0.469 2.252 0 4.037-0.592 5.353-1.775 1.313-1.186 1.973-2.793 1.973-4.824s-0.658-3.641-1.973-4.824c-1.316-1.186-3.101-1.777-5.353-1.777-1.055 0-2.108 0.117-3.164 0.352-1.043 0.234-2.108 0.6-3.202 1.094v-14.65z" fill="#fff" fill-opacity=".784"/></svg>',hiper:'<?xml version="1.0" encoding="utf-8"?> \x3c!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --\x3e <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 780 500" style="enable-background:new 0 0 780 500;" xml:space="preserve"> <style type="text/css"> .st0{fill:#F37421;} .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#FFE700;} .st2{fill-rule:evenodd;clip-rule:evenodd;fill:#F37421;} </style> <g> <polygon class="st0" points="99,138.9 99,313.9 138.7,313.9 138.7,240.7 203.9,240.7 203.9,313.9 243.4,313.9 243.4,138.9 203.9,138.9 203.9,206.2 138.7,206.2 138.7,138.9 99,138.9 "/> <path class="st0" d="M585.2,263c0.5-2.9,1.3-8.8,1.3-15.6c0-31.4-15.6-63.4-56.6-63.4c-44.1,0-64.1,35.6-64.1,67.8 c0,39.7,24.7,64.7,67.8,64.7c17.1,0,33-2.6,46-7.8l-5.2-26.7c-10.6,3.4-21.6,5.2-35.1,5.2c-18.4,0-34.5-7.8-35.8-24.1H585.2 L585.2,263z M503.1,236c1-10.6,7.8-25.7,24.4-25.7c18.2,0,22.3,16.1,22.3,25.7H503.1L503.1,236z"/> <path class="st0" d="M599.1,313.9h39.5v-64.4c0-3.1,0.3-6.2,0.8-8.8c2.6-12.2,12.5-20,27-20c4.4,0,7.8,0.5,10.6,1v-37.1 c-2.9-0.5-4.7-0.5-8.3-0.5c-12.2,0-27.8,7.8-34.3,26.2h-1l-1.3-23.4h-34c0.5,10.9,1,23.1,1,41.8V313.9L599.1,313.9z"/> <path class="st1" d="M283.5,131.9c11.2,0,20.3,9.1,20.3,20.3c0,11.2-9.1,20.3-20.3,20.3c-11.2,0-20.3-9.1-20.3-20.3 C263.2,141,272.3,131.9,283.5,131.9L283.5,131.9z"/> <path class="st2" d="M366.9,284.3h19.8c19.9,0,28.9-12.7,28.9-26c0-13.3-1-43.3-25.5-43.3c-28.2,0-23.7,37.3-23.5,56.8 C366.5,276,366.8,280.2,366.9,284.3L366.9,284.3z M263.2,186.8h40.6v71.6c0,13.3,7.4,26,23.7,26c0.1-32.2,0-65.4-1.1-97.6h33.9 c0.7,6.2,1.4,12.4,2,18.6c16-32,66.5-25,83.5,2.1c17.5,27.9,23.5,107.9-59.1,107.9h-19.2c0.2,16.2,0.2,32.5,0.2,48.8h-40.6 c0-15.6,0.1-32,0.2-48.8c-43.9-0.2-64.1-28-64.1-57V186.8L263.2,186.8z"/> </g> </svg>',hipercard:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M725,0H55C24.673,0,0,24.673,0,55v391c0,30.327,24.673,55,55,55h670c30.325,0,55-24.673,55-55V55 C780,24.673,755.325,0,725,0z" fill="none"/><path d="m223.05 201.42l2.104 7e-3 1.674-0.57 1.675-0.57 1.481-1.503 1.482-1.502 0.779-2.003 0.781-2.002 0.027-2.948 0.028-2.946-0.693-1.152-0.694-1.151-1.207-0.747-1.208-0.748h-5.214l-1.775 0.795-1.775 0.794-1.03 1.104-1.03 1.105-0.81 1.907-0.809 1.907-0.153 2.971-0.152 2.971 0.752 1.477 0.754 1.476 1.454 0.66 1.453 0.659 2.106 9e-3zm335.55 84.622h7.57v-4.633l0.871-5.746c0.481-3.16 1.272-8.166 1.761-11.121 0.487-2.957 1.095-6.701 1.35-8.324 0.256-1.621 0.932-5.131 1.503-7.801 0.573-2.671 1.286-5.557 1.587-6.416 0.301-0.858 0.549-1.759 0.552-2.001 5e-3 -0.242 0.649-1.8 1.435-3.462l1.429-3.023 1.886-2.505 1.886-2.504 2.062-1.551c1.134-0.854 2.959-1.985 4.055-2.516l1.992-0.965 4.334 0.03 4.335 0.031 1.707 0.547 1.706 0.548 0.288-0.178 0.287-0.178 0.016-1.106c8e-3 -0.609 0.378-2.873 0.824-5.033l0.812-3.926-0.912-0.357c-0.874-0.324-1.756-0.625-2.646-0.902l-1.733-0.547-3.121 9e-3 -3.121 7e-3 -2.544 0.896-2.544 0.894-1.91 1.152-1.909 1.152-2.483 2.601-2.483 2.6-1.334 2.018c-0.733 1.11-1.379 1.968-1.435 1.907-0.057-0.06 0.343-2.373 0.886-5.138 0.543-2.766 0.995-5.38 1.003-5.809l0.015-0.781h-12.831v0.222c0 0.121-0.319 2.345-0.711 4.941-0.391 2.597-1.177 7.608-1.744 11.137-0.682 4.221-1.373 8.44-2.072 12.658-0.608 3.646-1.247 7.288-1.915 10.923-0.481 2.574-1.336 7.102-1.9 10.057-0.564 2.957-1.49 7.717-2.058 10.578l-1.674 8.408-0.64 3.207h7.568zm-175.76 0h7.403l0.223-3.133c0.123-1.721 0.541-5.195 0.931-7.715 0.39-2.521 1.188-7.549 1.773-11.172 0.741-4.48 1.547-8.949 2.419-13.406 0.745-3.748 1.587-7.473 1.87-8.278 0.285-0.806 0.518-1.678 0.518-1.939 0-0.262 0.557-1.686 1.237-3.165s1.947-3.743 2.817-5.032l1.581-2.344 2.115-1.96 2.116-1.958 2.608-1.246 2.609-1.247 3.989 0.022 3.986 0.021 1.961 0.585c1.078 0.322 2.054 0.586 2.167 0.586 0.114 0 0.207-0.368 0.207-0.819 0-0.45 0.391-2.734 0.867-5.076 0.477-2.341 0.867-4.355 0.867-4.476s-1.131-0.564-2.514-0.984c-1.384-0.42-3.295-0.86-4.248-0.979l-1.734-0.214-2.254 0.399c-1.24 0.219-3.083 0.703-4.096 1.076-1.015 0.372-2.688 1.216-3.72 1.876-1.03 0.661-2.636 1.947-3.564 2.858-0.932 0.912-2.495 2.751-3.477 4.086-0.764 1.038-1.524 2.078-2.28 3.121l-0.496 0.693 0.301-1.386c0.166-0.764 0.628-3.261 1.026-5.549 0.397-2.289 0.809-4.436 0.908-4.768l0.186-0.608h-13.226v0.836c0 0.46-0.391 3.229-0.866 6.155-0.478 2.927-1.265 7.817-1.748 10.869-0.484 3.052-1.345 8.358-1.91 11.791-0.604 3.646-1.24 7.289-1.911 10.923-1.305 6.941-2.64 13.877-4.005 20.807-0.584 2.957-1.283 6.447-1.552 7.76-0.271 1.311-0.491 2.52-0.491 2.686v0.305h7.407v-1e-3zm-174.46 0h7.459l0.21-0.547c0.117-0.303 0.211-1.094 0.211-1.758 0-0.666 0.47-4.127 1.042-7.689 1.309-8.117 2.65-16.23 4.024-24.337 0.589-3.416 1.209-6.827 1.859-10.231 0.552-2.86 1.4-7.308 1.884-9.882 0.483-2.575 1.435-7.474 2.114-10.887s1.319-6.341 1.422-6.508l0.189-0.305-7.543 0.093-7.543 0.093-0.63 4.509c-0.344 2.48-1.1 7.396-1.678 10.923-0.577 3.529-1.451 8.914-1.942 11.964-0.594 3.648-1.228 7.29-1.9 10.925-0.555 2.955-1.405 7.48-1.89 10.055-0.484 2.576-1.353 7.102-1.931 10.059s-1.353 6.857-1.723 8.67c-0.371 1.812-0.768 3.645-0.884 4.074l-0.209 0.779h7.459zm-93.277 0h8.425l0.605-3.727c0.332-2.051 0.982-5.992 1.443-8.756l1.907-11.445c0.588-3.529 1.47-8.756 1.959-11.616 0.489-2.861 1.267-7.299 1.727-9.862 0.461-2.565 0.926-4.749 1.032-4.856l0.195-0.194h45.313l0.252 0.251 0.252 0.252-0.394 2.002c-0.215 1.102-0.854 4.499-1.419 7.551s-1.515 8.201-2.112 11.445c-0.627 3.412-1.265 6.822-1.914 10.23-0.458 2.383-1.384 7.377-2.058 11.096-0.673 3.719-1.223 6.957-1.221 7.197l4e-3 0.432h16.921l0.374-2.166c0.207-1.191 0.537-3.338 0.737-4.768 0.198-1.432 0.679-4.477 1.066-6.764s1.16-6.814 1.719-10.057c0.558-3.242 1.494-8.783 2.078-12.311 0.584-3.529 1.45-8.678 1.926-11.443 0.602-3.472 1.229-6.94 1.88-10.404 0.559-2.957 1.491-7.95 2.071-11.098 0.58-3.146 1.447-7.906 1.929-10.577 0.482-2.67 1.36-7.508 1.952-10.75s1.339-7.026 1.66-8.41l0.584-2.514h-17.133l-0.233 1.648c-0.127 0.905-0.541 3.442-0.919 5.635-0.379 2.194-1.065 6.094-1.527 8.669-0.462 2.576-1.306 7.491-1.876 10.925-0.559 3.363-1.097 6.729-1.614 10.099l-0.578 3.857-12.575 0.255-12.576 0.254-10.532-0.25c-5.793-0.137-10.565-0.278-10.605-0.31-0.039-0.034 0.158-1.381 0.438-2.995 0.369-2.081 0.762-4.157 1.179-6.229 0.532-2.656 1.049-5.315 1.55-7.977 0.485-2.574 1.033-5.773 1.22-7.108 0.186-1.335 0.577-3.559 0.868-4.943 0.291-1.382 0.843-4.295 1.227-6.472 0.383-2.177 0.792-4.206 0.909-4.508l0.21-0.55h-16.995l-0.543 3.035c-0.3 1.669-0.699 4.048-0.887 5.288-0.189 1.24-0.822 5.219-1.407 8.843s-1.449 9.008-1.92 11.964l-1.903 11.964c-0.669 4.167-1.375 8.329-2.116 12.484-0.617 3.413-1.246 6.823-1.887 10.231-0.451 2.384-1.31 6.909-1.91 10.058-0.629 3.297-1.278 6.592-1.945 9.883-0.47 2.289-0.989 4.941-1.153 5.895-0.166 0.953-0.702 3.705-1.194 6.113-0.491 2.408-0.893 4.631-0.893 4.941v0.562h8.427v1e-3zm504.47 1.687l3.294 0.043 3.122-0.508c1.717-0.277 3.901-0.727 4.855-0.996 0.953-0.271 2.671-0.971 3.813-1.557l2.082-1.066 1.79-1.576 1.789-1.576 1.886-2.512c1.037-1.385 1.976-2.748 2.086-3.035l0.201-0.521-0.175 1.734c-0.124 1.16-0.284 2.318-0.48 3.469-0.168 0.953-0.406 2.787-0.532 4.074l-0.23 2.34h13.606v-4.68l1.036-8.844c0.569-4.865 1.413-11.34 1.873-14.393s1.171-7.42 1.579-9.709c0.407-2.289 1.131-6.425 1.604-9.19 0.476-2.765 1.334-7.604 1.908-10.75 0.573-3.148 1.492-8.141 2.041-11.097 0.548-2.957 1.401-7.561 1.895-10.231s1.377-7.352 1.964-10.403c0.615-3.183 1.25-6.363 1.906-9.538 0.462-2.192 0.839-4.105 0.838-4.247v-0.261h-14.844l-0.219 2.168c-0.12 1.192-0.689 5.132-1.262 8.757-0.681 4.279-1.374 8.555-2.08 12.83-0.411 2.466-0.817 4.932-1.22 7.399l-0.186 1.156-0.585-0.249c-0.322-0.137-2.069-0.622-3.88-1.077l-3.294-0.827-4.509-0.351-4.509-0.351-3.814 0.355-3.814 0.356-3.468 0.877-3.468 0.876-3.294 1.607-3.297 1.607-2.427 1.796-2.427 1.797-2.097 2.249c-1.153 1.236-2.818 3.281-3.702 4.544l-1.604 2.296-1.886 3.922c-1.036 2.158-2.298 5.015-2.803 6.35-0.506 1.336-1.396 4.295-1.981 6.577l-1.061 4.15-0.523 5.388-0.522 5.387 0.392 4.334 0.395 4.336 0.463 1.561c0.257 0.857 0.794 2.387 1.196 3.396l0.732 1.84 1.335 1.807 1.336 1.807 1.524 1.248 1.523 1.25 2.081 1.033c1.146 0.566 3.064 1.303 4.266 1.631 1.201 0.33 3.152 0.725 4.336 0.879 1.185 0.153 3.634 0.298 5.446 0.319zm5.913-9.836l-2.619 0.137-1.766-0.318c-0.972-0.174-2.527-0.645-3.457-1.043l-1.689-0.723-1.422-1.166-1.421-1.164-2.112-4.045-0.482-2.254-0.48-2.256 0.041-4.508 0.04-4.508 0.56-3.988 0.559-3.988 0.869-2.774c0.479-1.526 0.872-2.966 0.874-3.2 4e-3 -0.233 0.474-1.481 1.049-2.773 0.672-1.495 1.382-2.973 2.13-4.431 0.599-1.145 1.717-2.928 2.483-3.964 0.769-1.036 2.138-2.597 3.042-3.469 0.904-0.87 2.341-2.014 3.196-2.539l1.552-0.955 2.727-0.944 2.727-0.944 5.722-3e-3h5.722l3.294 0.915c1.813 0.502 3.737 1.085 4.276 1.295l0.981 0.381-0.191 0.952c-0.104 0.524-0.518 2.825-0.916 5.113-0.398 2.289-1.184 6.659-1.745 9.711s-1.423 7.656-1.916 10.23c-0.492 2.574-1.205 5.852-1.585 7.281-0.39 1.471-0.786 2.938-1.189 4.404-0.275 0.99-0.93 2.709-1.454 3.814-0.525 1.107-1.444 2.715-2.042 3.572-0.599 0.859-1.608 2.049-2.246 2.643-0.639 0.596-2.02 1.652-3.068 2.35l-1.907 1.268-5.514 1.75-2.623 0.141zm-123.13 9.713l4.681-0.135 2.948-0.754 2.948-0.756 1.908-0.9c1.049-0.494 2.765-1.475 3.813-2.176 1.05-0.699 2.675-2.031 3.609-2.959s2.322-2.51 3.082-3.516c0.76-1.008 1.428-1.785 1.483-1.729 0.058 0.057-0.118 1.658-0.389 3.562-0.269 1.906-0.493 4.439-0.497 5.631l-6e-3 2.166h12.729l0.194-4.939 0.194-4.943 0.908-6.416c0.5-3.529 1.307-8.756 1.794-11.617 0.485-2.859 1.331-7.697 1.879-10.75 0.547-3.052 1.414-7.811 1.925-10.577l0.932-5.028 0.032-4.343 0.03-4.344-0.981-2.007-0.982-2.008-1.331-1.278-1.333-1.279-2.185-1.107-2.188-1.109-6.518-1.45-4.486-0.341-4.487-0.341-5.778 0.358c-3.181 0.196-7.652 0.584-9.941 0.863l-4.162 0.504-5.672 0.022-0.413 1.995c-0.227 1.096-0.858 3.701-1.401 5.79-0.545 2.088-0.938 3.846-0.877 3.908s1.578-0.283 3.37-0.765c1.792-0.483 5.601-1.275 8.462-1.763l5.201-0.886 4.682-0.192 4.682-0.194 6.032 1.058 2.012 0.993 2.013 0.994 1.127 1.68 1.128 1.679-0.016 2.648-0.017 2.649-0.598 2.906-0.598 2.907-12.479 0.045-12.478 0.044-4.083 1.12c-2.246 0.616-4.733 1.434-5.527 1.817-0.794 0.384-1.588 0.698-1.765 0.698-0.176 0-1.512 0.74-2.969 1.647l-2.648 1.645-2.085 2.082c-1.148 1.145-2.613 2.862-3.257 3.815-0.645 0.953-1.691 2.945-2.325 4.428l-1.154 2.693-0.529 3.027-0.53 3.029v6.355l0.505 2.645 0.507 2.645 0.938 1.727c0.517 0.947 1.466 2.338 2.106 3.088l1.168 1.365 2.073 1.26 2.074 1.26 2.375 0.67c1.306 0.369 3.293 0.818 4.417 0.996l2.042 0.322 4.682-0.135zm4.335-9.697l-2.774 0.145-1.838-0.469c-1.01-0.256-2.544-0.83-3.407-1.273l-1.569-0.809-0.858-1.018c-0.471-0.562-1.19-1.662-1.6-2.447l-0.743-1.428-0.145-3.332-0.147-3.334 0.588-2.023c0.323-1.111 1.082-3.043 1.687-4.289l1.098-2.266 2.104-2.088 2.102-2.088 2.232-1.075 2.231-1.074 2.774-0.66 2.774-0.659h17.34l0.549 0.227 0.548 0.226-0.461 2.722c-0.254 1.496-0.859 4.203-1.347 6.016-0.485 1.812-1.344 4.475-1.906 5.918-0.563 1.445-1.024 2.721-1.024 2.836 0 0.117-0.57 1.168-1.267 2.338l-1.267 2.127-2.079 2.061c-1.143 1.133-2.206 2.059-2.359 2.059s-0.854 0.393-1.558 0.869l-1.277 0.865-2.813 0.891-2.812 0.889-2.776 0.143zm-61.379 9.826l3.817 0.041 4.332-0.514c2.383-0.281 5.555-0.75 7.05-1.041 1.806-0.363 3.599-0.789 5.375-1.275 1.462-0.414 2.785-0.861 2.939-0.992 0.155-0.133 0.567-1.707 0.918-3.498s0.792-4.193 0.981-5.336c0.188-1.145 0.286-2.143 0.217-2.217-0.07-0.076-0.325 0.021-0.568 0.213-0.243 0.195-1.944 0.91-3.781 1.592l-3.339 1.24-4.756 0.922-4.756 0.92-4.042-0.137-4.043-0.139-2.297-0.797-2.297-0.797-1.774-1.551-1.773-1.553-1.178-2.145-1.177-2.143-0.562-2.869-0.561-2.867 5e-3 -3.721 3e-3 -3.721 0.681-4.508 0.682-4.509 0.721-2.428c0.396-1.335 0.846-2.895 0.997-3.467 0.152-0.573 0.787-2.211 1.413-3.642 0.625-1.43 1.741-3.641 2.479-4.913l1.342-2.311 1.649-1.709 1.648-1.709 1.745-1.082 1.747-1.083 2.242-0.691c1.233-0.38 3.413-0.873 4.843-1.095l2.602-0.406 3.813 0.192 3.815 0.191 4.508 0.903 4.509 0.901 1.833 0.684c1.008 0.376 1.877 0.685 1.932 0.685 0.054 0 0.296-1.288 0.537-2.862 0.242-1.573 0.672-4.162 0.956-5.752 0.285-1.592 0.449-2.962 0.364-3.045-0.083-0.084-1.438-0.299-3.01-0.478-1.573-0.179-5.848-0.497-9.498-0.708l-6.639-0.381-4.683 0.359-4.681 0.36-3.469 0.728-3.468 0.729-2.233 0.893c-1.229 0.491-3.027 1.378-3.998 1.97-0.931 0.566-1.846 1.156-2.745 1.77-0.54 0.382-2.176 1.87-3.638 3.308l-2.655 2.614-1.484 2.172c-0.814 1.195-2.225 3.685-3.134 5.536l-1.652 3.364-1.267 3.64c-0.696 2.003-1.669 5.28-2.16 7.283l-0.895 3.641-0.325 3.295-0.324 3.295 3e-3 4.334 4e-3 4.334 0.327 2.523 0.327 2.521 1.039 2.594 1.038 2.594 1.201 1.875 1.198 1.875 1.907 1.879 1.909 1.877 2.017 1.068 2.02 1.064 2.65 0.738c1.457 0.404 3.564 0.869 4.682 1.031 1.117 0.164 3.748 0.316 5.848 0.34h-3e-3zm-110.28-2e-3l3.815 0.043 3.813-0.348c2.1-0.191 5.532-0.59 7.629-0.887 2.1-0.295 5.724-0.957 8.056-1.469l4.239-0.932 0.212-1.564c0.115-0.859 0.592-3.418 1.058-5.686l0.847-4.125-0.188-0.186-0.187-0.186-1.296 0.625c-0.713 0.344-2.934 1.166-4.934 1.824l-3.638 1.197-3.818 0.742-3.818 0.738-6.068 0.014-6.069 0.01-2.081-0.664c-1.144-0.365-2.827-1.033-3.74-1.486l-1.659-0.82-2.739-2.477-1.069-1.867-1.069-1.869-0.67-2.342-0.67-2.344-4e-3 -4.336-5e-3 -4.336 0.594-3.867 0.597-3.869 10.436-0.488 19.291 0.125 19.29 0.123 0.582-2.47c0.321-1.359 0.811-4.168 1.089-6.242l0.506-3.772 0.011-3.172 0.012-3.173-0.549-2.369-0.551-2.368-0.908-1.568c-0.498-0.862-1.38-2.112-1.955-2.778-0.576-0.665-1.605-1.603-2.286-2.084-0.683-0.481-2.02-1.29-2.974-1.797l-1.733-0.922-3.029-0.73-3.03-0.729-3.731-0.357-3.734-0.357-3.467 0.226-3.468 0.225-4.162 0.799-4.161 0.8-2.602 1.039c-1.431 0.571-3.615 1.615-4.854 2.318-1.24 0.703-2.956 1.847-3.813 2.542-0.86 0.696-2.347 2.048-3.304 3.005-0.958 0.958-2.376 2.676-3.148 3.821-0.774 1.145-1.96 3.173-2.638 4.508-0.676 1.336-1.557 3.208-1.958 4.162-0.399 0.953-1.129 2.904-1.617 4.334-0.49 1.431-1.26 4.162-1.709 6.07-0.53 2.311-0.988 4.637-1.373 6.976l-0.554 3.51 6e-3 5.16 6e-3 5.16 0.526 2.254c0.289 1.24 0.845 3.113 1.231 4.162s1.104 2.609 1.593 3.469c0.488 0.857 1.532 2.238 2.318 3.07 0.785 0.83 2.21 2.092 3.164 2.801 0.952 0.709 2.65 1.709 3.771 2.219l2.039 0.928 2.843 0.688c1.563 0.379 3.923 0.826 5.244 0.996 1.318 0.17 4.115 0.33 6.212 0.353zm6.531-48.853c-9.6 0-17.455-0.068-17.455-0.153 0-0.083 0.41-1.293 0.911-2.688 0.5-1.394 1.38-3.468 1.953-4.61l1.045-2.077 2.293-2.281 2.294-2.283 2.255-1.077c1.239-0.593 2.878-1.239 3.641-1.435 0.764-0.196 2.947-0.456 4.854-0.577l3.469-0.223 2.664 0.343 2.662 0.342 1.936 0.886 1.936 0.886 1.062 1.145c0.583 0.629 1.278 1.556 1.546 2.059l0.483 0.916 0.32 2.032 0.321 2.032-0.367 3.381-0.366 3.382h-17.457zm-103.19 79.414l0.21-0.549c0.117-0.301 0.211-1.01 0.211-1.576 0-0.564 0.246-2.619 0.547-4.564 0.3-1.949 1.004-6.428 1.566-9.955 0.561-3.529 1.401-8.836 1.867-11.791 0.443-2.801 0.864-5.604 1.265-8.41 0.229-1.67 0.508-3.035 0.621-3.035 0.112 0 0.594 0.738 1.071 1.639l0.866 1.639 1.922 1.938 1.923 1.938 2.366 0.947 2.367 0.947 2.82 0.365 2.821 0.365 3.579-0.219 3.58-0.221 3.876-1.002 3.877-1.004 2.08-0.949c1.145-0.521 3.173-1.662 4.508-2.531l2.428-1.58 2.263-2.264c1.245-1.242 3.001-3.238 3.901-4.434 0.902-1.193 1.639-2.258 1.639-2.363 0-0.107 0.443-0.846 0.984-1.645 0.541-0.797 1.647-3.012 2.459-4.918 0.813-1.906 2.081-5.34 2.821-7.629l1.344-4.162 0.695-3.604c0.382-1.982 0.874-5.259 1.093-7.283l0.397-3.677-0.23-3.121-0.229-3.121-0.725-3.122-0.723-3.121-1.172-2.336-1.171-2.337-2.263-2.399-2.262-2.399-5.354-2.766-2.948-0.707-2.948-0.705-2.948-0.216-2.947-0.216-3.283 0.377-3.285 0.377-2.679 0.685-2.68 0.683-2.329 1.079c-1.28 0.591-3.144 1.598-4.14 2.236-0.997 0.638-2.026 1.371-2.286 1.63-0.259 0.259-0.882 0.74-1.382 1.066l-0.911 0.597 0.636-3.047c0.351-1.675 0.643-3.24 0.651-3.48l0.014-0.433h-12.716l-1.114 7.023c-0.614 3.863-1.582 9.831-2.152 13.265-1.257 7.574-2.529 15.145-3.816 22.714-0.567 3.336-1.504 8.643-2.083 11.791-0.579 3.146-1.426 7.75-1.884 10.23-0.457 2.479-1.319 7.16-1.913 10.402-0.701 3.816-1.409 7.631-2.124 11.445-0.677 3.586-1.369 7.168-2.074 10.75-0.568 2.859-1.116 5.553-1.221 5.98l-0.189 0.781h14.913zm21.749-39.92l-1.892-0.336-1.893-0.334-1.922-0.877-1.923-0.877-1.342-1.283-1.343-1.281-0.775-1.734c-0.427-0.953-0.974-2.574-1.217-3.602l-0.442-1.865 0.177-2.988 0.178-2.988 0.893-4.682c0.674-3.58 1.328-7.164 1.96-10.75 0.587-3.338 1.477-8.23 1.976-10.869l0.907-4.8 1.988-1.654c1.094-0.909 2.826-2.129 3.85-2.709l1.86-1.056 2.427-0.751 2.428-0.752 6.242-0.366 2.542 0.542 2.541 0.541 1.794 0.826 1.793 0.826 1.504 1.512 1.505 1.512 0.81 1.601c0.447 0.881 1.074 2.604 1.393 3.83l0.581 2.229-0.178 6.59-0.178 6.589-0.89 3.895c-0.49 2.143-1.422 5.42-2.072 7.281l-1.181 3.389-1.448 2.742c-0.796 1.51-2.023 3.547-2.727 4.529s-1.827 2.258-2.495 2.83c-0.809 0.688-1.637 1.352-2.484 1.992l-1.271 0.949-5.886 2.002-5.79 0.347z" fill="#B3131B"/></svg>',jcb:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m632.24 361.27c0 41.615-33.729 75.36-75.357 75.36h-409.13v-297.88c0-41.626 33.73-75.371 75.364-75.371h409.12l-1e-3 297.89z" fill="#fff"/><linearGradient id="c" x1="908.72" x2="909.72" y1="313.21" y2="313.21" gradientTransform="matrix(132.87 0 0 323.02 -1.2027e5 -1.0093e5)" gradientUnits="userSpaceOnUse"><stop stop-color="#007B40" offset="0"/><stop stop-color="#55B330" offset="1"/></linearGradient><path d="m498.86 256.54c11.686 0.254 23.438-0.516 35.077 0.4 11.787 2.199 14.628 20.043 4.156 25.887-7.145 3.85-15.633 1.434-23.379 2.113h-15.854v-28.4zm41.834-32.145c2.596 9.164-6.238 17.392-15.064 16.13h-26.77c0.188-8.642-0.367-18.022 0.272-26.209 10.724 0.302 21.547-0.616 32.209 0.48 4.581 1.151 8.415 4.917 9.353 9.599zm64.425-135.9c0.498 17.501 0.072 35.927 0.215 53.783-0.033 72.596 0.07 145.19-0.057 217.79-0.47 27.207-24.582 50.848-51.601 51.391-27.045 0.11-54.094 0.017-81.143 0.047v-109.75c29.471-0.152 58.957 0.309 88.416-0.23 13.666-0.858 28.635-9.875 29.271-24.914 1.609-15.104-12.631-25.551-26.151-27.201-5.197-0.135-5.045-1.515 0-2.117 12.895-2.787 23.021-16.133 19.227-29.499-3.233-14.058-18.771-19.499-31.695-19.472-26.352-0.179-52.709-0.025-79.062-0.077 0.17-20.489-0.355-41 0.283-61.474 2.088-26.716 26.807-48.748 53.446-48.27 26.287-4e-3 52.57-4e-3 78.851-5e-3z" fill="url(#c)"/><linearGradient id="b" x1="908.73" x2="909.73" y1="313.21" y2="313.21" gradientTransform="matrix(133.43 0 0 323.02 -1.2108e5 -1.0092e5)" gradientUnits="userSpaceOnUse"><stop stop-color="#1D2970" offset="0"/><stop stop-color="#006DBA" offset="1"/></linearGradient><path d="m174.74 139.54c0.673-27.164 24.888-50.611 51.872-51.008 26.945-0.083 53.894-0.012 80.839-0.036-0.074 90.885 0.146 181.78-0.111 272.66-1.038 26.834-24.989 49.834-51.679 50.309-26.996 0.098-53.995 0.014-80.992 0.041v-113.45c26.223 6.195 53.722 8.832 80.474 4.723 15.991-2.573 33.487-10.426 38.901-27.016 3.984-14.191 1.741-29.126 2.334-43.691v-33.825h-46.297c-0.208 22.371 0.426 44.781-0.335 67.125-1.248 13.734-14.849 22.46-27.802 21.994-16.064 0.17-47.897-11.642-47.897-11.642-0.08-41.914 0.466-94.405 0.693-136.18z" fill="url(#b)"/><linearGradient id="a" x1="908.72" x2="909.72" y1="313.21" y2="313.21" gradientTransform="matrix(132.96 0 0 323.03 -1.205e5 -1.0093e5)" gradientUnits="userSpaceOnUse"><stop stop-color="#6E2B2F" offset="0"/><stop stop-color="#E30138" offset="1"/></linearGradient><path d="m324.72 211.89c-2.437 0.517-0.49-8.301-1.113-11.646 0.166-21.15-0.347-42.323 0.283-63.458 2.082-26.829 26.991-48.916 53.738-48.288h78.768c-0.074 90.885 0.145 181.78-0.111 272.66-1.039 26.834-24.992 49.833-51.683 50.309-26.997 0.102-53.997 0.016-80.996 0.042v-124.3c18.439 15.129 43.5 17.484 66.472 17.525 17.318-6e-3 34.535-2.676 51.353-6.67v-22.772c-18.953 9.446-41.233 15.446-62.243 10.019-14.656-3.648-25.295-17.812-25.058-32.937-1.698-15.729 7.522-32.335 22.979-37.011 19.191-6.008 40.107-1.413 58.096 6.398 3.854 2.018 7.766 4.521 6.225-1.921v-17.899c-30.086-7.158-62.104-9.792-92.33-2.005-8.749 2.468-17.273 6.211-24.38 11.956z" fill="url(#a)"/></svg>',maestro:'<svg width="780" height="500" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M465.769 113.811H314.195V386.211H465.769V113.811Z" fill="#7673C0"/> <path d="M323.822 250.033C323.794 223.796 329.736 197.895 341.199 174.294C352.662 150.693 369.346 130.009 389.985 113.809C364.43 93.7255 333.74 81.2366 301.422 77.77C269.105 74.3033 236.464 79.9986 207.231 94.2052C177.997 108.412 153.35 130.556 136.107 158.108C118.863 185.66 109.719 217.507 109.719 250.009C109.719 282.512 118.863 314.359 136.107 341.911C153.35 369.462 177.997 391.607 207.231 405.814C236.464 420.02 269.105 425.715 301.422 422.249C333.74 418.782 364.43 406.293 389.985 386.21C369.352 370.015 352.673 349.339 341.21 325.746C329.747 302.154 323.801 276.263 323.822 250.033Z" fill="#EB001B"/> <path d="M670.228 250.034C670.22 282.531 661.072 314.37 643.827 341.914C626.583 369.459 601.939 391.597 572.71 405.8C543.482 420.002 510.847 425.697 478.536 422.233C446.224 418.769 415.538 406.286 389.984 386.21C410.609 370.001 427.284 349.32 438.75 325.726C450.216 302.132 456.173 276.243 456.173 250.01C456.173 223.778 450.216 197.888 438.75 174.295C427.284 150.701 410.609 130.019 389.984 113.81C415.538 93.7202 446.228 81.2253 478.547 77.7536C510.867 74.282 543.511 79.9737 572.748 94.1783C601.985 108.383 626.636 130.527 643.883 158.079C661.129 185.632 670.275 217.481 670.276 249.986L670.228 250.034Z" fill="#00A1DF"/> </svg>',mastercard:'<svg width="780" height="500" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M465.738 113.525H313.812V386.475H465.738V113.525Z" fill="#FF5A00"/> <path d="M323.926 250C323.926 194.545 349.996 145.326 390 113.525C360.559 90.3769 323.42 76.3867 282.91 76.3867C186.945 76.3867 109.297 154.035 109.297 250C109.297 345.965 186.945 423.614 282.91 423.614C323.42 423.614 360.559 409.623 390 386.475C349.94 355.123 323.926 305.455 323.926 250Z" fill="#EB001B"/> <path d="M670.711 250C670.711 345.965 593.062 423.614 497.098 423.614C456.588 423.614 419.449 409.623 390.008 386.475C430.518 354.618 456.082 305.455 456.082 250C456.082 194.545 430.012 145.326 390.008 113.525C419.393 90.3769 456.532 76.3867 497.041 76.3867C593.062 76.3867 670.711 154.541 670.711 250Z" fill="#F79E1B"/> </svg>',mir:'<?xml version="1.0" encoding="utf-8"?> \x3c!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --\x3e <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 780 500" style="enable-background:new 0 0 780 500;" xml:space="preserve"> <style type="text/css"> .st0{fill:#37A72E;} .st1{fill:url(#Combined-Shape_4_);} </style> <g id="Page-1"> <g id="Artboard" transform="translate(-91.000000, -154.000000)"> <g id="Group" transform="translate(91.000000, 154.000000)"> <path id="Combined-Shape" class="st0" d="M544.1,240.5v108h60v-64h68c28.6-0.2,52.9-18.5,62.1-44H544.1z"/> <linearGradient id="Combined-Shape_4_" gradientUnits="userSpaceOnUse" x1="362.4047" y1="275.4307" x2="363.4047" y2="275.4307" gradientTransform="matrix(201.7633 0 0 -79 -72583.8438 21950.0254)"> <stop offset="0" style="stop-color:#00A0E5"/> <stop offset="1" style="stop-color:#0077C3"/> </linearGradient> <path id="Combined-Shape_1_" class="st1" d="M536.1,151.5c3.5,44.1,45.3,79,96.3,79c0.2,0,104.3,0,104.3,0 c0.8-4,1.2-8.2,1.2-12.5c0-36.6-29.5-66.2-66-66.5L536.1,151.5z"/> <path id="Combined-Shape_2_" class="st0" d="M447.3,229.4l0-0.1L447.3,229.4c0.7-1.2,1.8-1.9,3.2-1.9c2,0,3.5,1.6,3.6,3.5l0,0 v116.5h60v-196h-60c-7.6,0.3-16.2,5.8-19.4,12.7L387,266.6c-0.1,0.4-0.3,0.8-0.5,1.2l0,0l0,0c-0.7,1-1.9,1.7-3.3,1.7 c-2.2,0-4-1.8-4-4v-114h-60v196h60v0c7.5-0.4,15.9-5.9,19.1-12.7l49-105.1C447.2,229.6,447.3,229.5,447.3,229.4L447.3,229.4z"/> <path id="Combined-Shape_3_" class="st0" d="M223.3,232.8l-35.1,114.7H145L110,232.7c-0.3-1.8-1.9-3.2-3.9-3.2 c-2.2,0-3.9,1.8-3.9,3.9c0,0,0,0,0,0l0,114h-60v-196h51.5H109c11,0,22.6,8.6,25.8,19.1l29.2,95.5c1.5,4.8,3.8,4.7,5.3,0 l29.2-95.5c3.2-10.6,14.8-19.1,25.8-19.1h15.3h51.5v196h-60v-114c0,0,0,0,0-0.1c0-2.2-1.8-3.9-3.9-3.9 C225.2,229.5,223.6,230.9,223.3,232.8L223.3,232.8z"/> </g> </g> </g> </svg>',paypal:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m168.38 169.35c-8.399-5.774-19.359-8.668-32.88-8.668h-52.346c-4.145 0-6.435 2.073-6.87 6.215l-21.264 133.48c-0.221 1.311 0.107 2.51 0.981 3.6 0.869 1.092 1.962 1.635 3.271 1.635h24.864c4.361 0 6.758-2.068 7.198-6.215l5.888-35.986c0.215-1.744 0.982-3.162 2.291-4.254 1.308-1.09 2.944-1.803 4.907-2.129 1.963-0.324 3.814-0.488 5.562-0.488 1.743 0 3.814 0.111 6.217 0.328 2.397 0.217 3.925 0.324 4.58 0.324 18.756 0 33.478-5.285 44.167-15.867 10.684-10.576 16.032-25.242 16.032-44.004 0-12.868-4.203-22.191-12.598-27.974zm-26.989 40.08c-1.094 7.635-3.926 12.649-8.506 15.049-4.581 2.403-11.124 3.599-19.629 3.599l-10.797 0.326 5.563-35.007c0.434-2.397 1.851-3.597 4.252-3.597h6.218c8.72 0 15.049 1.257 18.975 3.761 3.924 2.51 5.233 7.801 3.924 15.869z" fill="#003087"/><path d="m720.79 160.68h-24.207c-2.406 0-3.822 1.2-4.254 3.601l-21.266 136.1-0.328 0.654c0 1.096 0.436 2.127 1.311 3.109 0.867 0.98 1.963 1.471 3.27 1.471h21.596c4.137 0 6.428-2.068 6.871-6.215l21.264-133.81v-0.325c-1e-3 -3.055-1.423-4.581-4.257-4.581z" fill="#009CDE"/><path d="m428.31 213.36c0-1.088-0.438-2.126-1.305-3.105-0.875-0.981-1.857-1.475-2.945-1.475h-25.191c-2.404 0-4.367 1.096-5.891 3.271l-34.678 51.039-14.395-49.074c-1.096-3.487-3.492-5.236-7.197-5.236h-24.541c-1.093 0-2.074 0.492-2.941 1.475-0.875 0.979-1.309 2.019-1.309 3.105 0 0.439 2.127 6.871 6.379 19.303 4.252 12.436 8.832 25.85 13.74 40.246 4.908 14.393 7.469 22.031 7.688 22.896-17.886 24.432-26.825 37.518-26.825 39.26 0 2.838 1.415 4.254 4.253 4.254h25.191c2.398 0 4.36-1.088 5.89-3.27l83.427-120.4c0.433-0.432 0.65-1.192 0.65-2.29z" fill="#003087"/><path d="m662.89 208.78h-24.865c-3.057 0-4.904 3.6-5.559 10.799-5.678-8.722-16.031-13.089-31.084-13.089-15.703 0-29.064 5.89-40.076 17.668-11.016 11.778-16.521 25.632-16.521 41.552 0 12.871 3.762 23.121 11.285 30.752 7.525 7.639 17.611 11.451 30.266 11.451 6.324 0 12.758-1.311 19.301-3.926 6.543-2.617 11.664-6.105 15.379-10.469 0 0.219-0.223 1.197-0.654 2.941-0.441 1.748-0.656 3.061-0.656 3.926 0 3.494 1.414 5.234 4.254 5.234h22.576c4.139 0 6.541-2.068 7.193-6.215l13.416-85.39c0.215-1.31-0.111-2.507-0.982-3.599-0.877-1.088-1.965-1.635-3.273-1.635zm-42.694 64.454c-5.562 5.453-12.27 8.178-20.121 8.178-6.328 0-11.449-1.742-15.377-5.234-3.928-3.482-5.891-8.281-5.891-14.395 0-8.064 2.727-14.886 8.182-20.447 5.445-5.562 12.213-8.342 20.283-8.342 6.102 0 11.174 1.799 15.213 5.396 4.031 3.6 6.055 8.562 6.055 14.889-2e-3 7.851-2.783 14.505-8.344 19.955z" fill="#009CDE"/><path d="m291.23 208.78h-24.865c-3.058 0-4.908 3.6-5.563 10.799-5.889-8.722-16.25-13.089-31.081-13.089-15.704 0-29.065 5.89-40.078 17.668-11.016 11.778-16.521 25.632-16.521 41.552 0 12.871 3.763 23.121 11.288 30.752 7.525 7.639 17.61 11.451 30.262 11.451 6.104 0 12.433-1.311 18.975-3.926 6.543-2.617 11.778-6.105 15.704-10.469-0.875 2.615-1.309 4.906-1.309 6.867 0 3.494 1.417 5.234 4.253 5.234h22.574c4.141 0 6.543-2.068 7.198-6.215l13.413-85.39c0.215-1.31-0.111-2.507-0.981-3.599-0.873-1.088-1.962-1.635-3.269-1.635zm-42.695 64.616c-5.563 5.35-12.382 8.016-20.447 8.016-6.329 0-11.4-1.742-15.214-5.234-3.819-3.482-5.726-8.281-5.726-14.395 0-8.064 2.725-14.886 8.18-20.447 5.449-5.562 12.211-8.343 20.284-8.343 6.104 0 11.175 1.8 15.214 5.397 4.032 3.6 6.052 8.562 6.052 14.889-1e-3 8.07-2.781 14.779-8.343 20.117z" fill="#003087"/><path d="m540.04 169.35c-8.398-5.774-19.355-8.668-32.879-8.668h-52.02c-4.363 0-6.764 2.073-7.197 6.215l-21.266 133.48c-0.221 1.311 0.107 2.51 0.982 3.6 0.865 1.092 1.961 1.635 3.27 1.635h26.826c2.617 0 4.361-1.416 5.236-4.252l5.889-37.949c0.217-1.744 0.98-3.162 2.291-4.254 1.309-1.09 2.943-1.803 4.908-2.129 1.961-0.324 3.812-0.488 5.561-0.488 1.744 0 3.814 0.111 6.215 0.328 2.398 0.217 3.93 0.324 4.58 0.324 18.76 0 33.479-5.285 44.168-15.867 10.688-10.576 16.031-25.242 16.031-44.004 1e-3 -12.868-4.2-22.192-12.595-27.974zm-33.533 53.819c-4.799 3.271-11.998 4.906-21.592 4.906l-10.471 0.328 5.562-35.008c0.432-2.396 1.85-3.598 4.252-3.598h5.887c4.799 0 8.615 0.219 11.455 0.654 2.83 0.438 5.561 1.799 8.178 4.088 2.619 2.291 3.926 5.619 3.926 9.979 0 9.164-2.402 15.377-7.197 18.651z" fill="#009CDE"/></svg>',unionpay:'<svg width="780" height="500" enable-background="new 0 0 780 500" version="1.1" viewBox="0 0 780 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m216.4 69.791h142.39c19.87 0 32.287 16.406 27.63 36.47l-66.333 287.48c-4.656 20.063-24.629 36.47-44.498 36.47h-142.39c-19.87 0-32.287-16.406-27.63-36.47l66.331-287.48c4.657-20.168 24.526-36.47 44.395-36.47h0.104z" fill="#D10429"/><path d="m346.34 69.791h163.82c19.867 0 10.865 16.406 6.209 36.47l-66.334 287.48c-4.658 20.063-3.209 36.47-23.078 36.47h-163.81c-19.972 0-32.287-16.406-27.527-36.47l66.334-287.48c4.656-20.168 24.524-36.47 44.498-36.47h-0.104z" fill="#022E64"/><path d="m504.41 69.791h142.39c19.869 0 32.287 16.406 27.631 36.47l-66.334 287.48c-4.656 20.063-24.629 36.47-44.498 36.47h-142.39c-19.973 0-32.288-16.406-27.631-36.47l66.334-287.48c4.656-20.168 24.525-36.47 44.393-36.47h0.105z" fill="#076F74"/><path d="m480.5 340.81h13.453l3.828-13.063h-13.35l-3.931 13.063zm10.762-35.95l-4.658 15.467s5.072-2.613 7.865-3.449c2.795-0.627 6.934-1.15 6.934-1.15l3.207-10.763h-13.451l0.103-0.105zm6.726-22.153l-4.449 14.839s4.967-2.3 7.76-3.029c2.795-0.732 6.934-0.941 6.934-0.941l3.207-10.764h-13.348l-0.104-0.105zm29.7 0l-17.385 57.997h4.656l-3.621 12.018h-4.658l-1.137 3.657h-16.559l1.139-3.657h-33.529l3.311-11.076h3.416l17.594-58.938 3.518-11.913h16.867l-1.76 5.956s4.449-3.239 8.797-4.39c4.244-1.148 28.666-1.566 28.666-1.566l-3.623 11.809h-5.795l0.103 0.103z" fill="#FEFEFE"/><path d="m534.59 270.79h18.006l0.207 6.792c-0.102 1.149 0.828 1.672 3.002 1.672h3.621l-3.311 11.183h-9.729c-8.381 0.627-11.59-3.03-11.383-7.106l-0.311-12.437-0.102-0.104zm2.217 53.2h-17.178l2.896-9.927h19.662l2.793-9.092h-19.35l3.311-11.182h53.812l-3.312 11.182h-18.109l-2.793 9.092h18.109l-3.002 9.927h-19.559l-3.518 4.18h7.969l1.965 12.54c0.207 1.254 0.207 2.09 0.621 2.613 0.414 0.418 2.795 0.627 4.139 0.627h2.381l-3.725 12.227h-6.107c-0.93 0-2.379-0.104-4.346-0.104-1.863-0.21-3.104-1.255-4.346-1.882-1.139-0.522-2.793-1.881-3.207-4.284l-1.863-12.54-8.9 12.331c-2.795 3.866-6.621 6.897-13.143 6.897h-12.417l3.311-10.869h4.762c1.346 0 2.588-0.521 3.52-1.045 0.93-0.418 1.758-0.836 2.586-2.193l13.038-18.498zm-187.9-27.2h45.429l-3.312 10.973h-18.11l-2.793 9.299h18.627l-3.415 11.287h-18.524l-4.553 15.152c-0.517 1.672 4.45 1.881 6.209 1.881l9.313-1.254-3.726 12.54h-20.904c-1.654 0-2.896-0.209-4.76-0.627-1.76-0.418-2.587-1.254-3.311-2.403-0.726-1.254-1.968-2.195-1.14-4.912l6.002-20.063h-10.347l3.415-11.495h10.348l2.794-9.3h-10.347l3.312-10.974-0.207-0.104zm31.387-19.835h18.626l-3.414 11.39h-25.458l-2.794 2.404c-1.242 1.15-1.552 0.732-3.105 1.568-1.447 0.73-4.449 2.193-8.382 2.193h-8.175l3.311-10.972h2.484c2.07 0 3.52-0.21 4.243-0.627 0.828-0.522 1.76-1.672 2.69-3.554l4.656-8.568h18.526l-3.208 6.27v-0.104zm35.106 18.81s5.07-4.701 13.764-6.164c1.967-0.418 14.385-0.211 14.385-0.211l1.863-6.27h-26.182l-3.83 12.75v-0.105zm24.629 4.807h-25.975l-1.551 5.329h22.559c2.691-0.313 3.209 0.104 3.416-0.104l1.654-5.225h-0.103zm-33.734-29.678h15.832l-2.275 8.047s4.967-4.075 8.484-5.539c3.52-1.254 11.383-2.508 11.383-2.508l25.664-0.104-8.795 29.469c-1.449 5.016-3.209 8.256-4.244 9.823-0.93 1.463-2.07 2.821-4.346 4.075-2.172 1.15-4.141 1.881-6.002 1.986-1.656 0.104-4.346 0.209-7.865 0.209h-24.732l-6.934 23.303c-0.619 2.299-0.93 3.447-0.516 4.074 0.309 0.523 1.24 1.15 2.379 1.15l10.865-1.045-3.725 12.749h-12.211c-3.932 0-6.727-0.104-8.693-0.21-1.862-0.208-3.83 0-5.174-1.044-1.138-1.045-2.896-2.403-2.794-3.763 0.104-1.254 0.621-3.344 1.45-6.27l22.249-74.402z" fill="#FEFEFE"/><path d="m452.43 317.79l-1.449 7.105c-0.619 2.194-1.137 3.867-2.793 5.33-1.76 1.463-3.725 3.03-8.484 3.03l-8.797 0.418-0.104 7.942c-0.104 2.193 0.518 1.984 0.828 2.402 0.414 0.418 0.723 0.523 1.137 0.732l2.795-0.21 8.383-0.417-3.52 11.704h-9.623c-6.727 0-11.797-0.21-13.35-1.463-1.656-1.046-1.863-2.3-1.863-4.599l0.621-31.141h15.42l-0.207 6.374h3.725c1.242 0 2.174-0.104 2.691-0.418 0.516-0.313 0.828-0.836 1.035-1.567l1.551-5.016h12.109l-0.105-0.206zm-219.37-156c-0.517 2.508-10.451 48.592-10.451 48.592-2.174 9.3-3.726 15.989-8.9 20.273-3.001 2.508-6.52 3.657-10.555 3.657-6.52 0-10.245-3.239-10.866-9.404l-0.104-2.09s1.966-12.436 1.966-12.54c0 0 10.349-42.009 12.212-47.548 0.103-0.313 0.103-0.522 0.103-0.627-20.18 0.21-23.801 0-24.008-0.313-0.104 0.418-0.621 3.03-0.621 3.03l-10.556 47.34-0.932 3.97-1.758 13.168c0 3.866 0.724 7.105 2.277 9.718 4.863 8.569 18.627 9.823 26.388 9.823 10.038 0 19.455-2.195 25.767-6.061 11.073-6.584 13.97-16.929 16.454-26.02l1.242-4.703s10.659-43.576 12.522-49.219c0.103-0.314 0.103-0.523 0.207-0.627-14.695 0.104-18.938 0-20.387-0.314v-0.105zm59.029 86.623c-7.141-0.105-9.728-0.105-18.11 0.313l-0.311-0.627c0.724-3.24 1.552-6.374 2.173-9.614l1.035-4.389c1.552-6.792 3.001-14.839 3.208-17.242 0.207-1.463 0.62-5.12-3.519-5.12-1.759 0-3.518 0.835-5.38 1.671-1.036 3.658-3.002 13.899-4.037 18.497-2.07 9.823-2.173 10.972-3.104 15.78l-0.621 0.626c-7.347-0.104-9.934-0.104-18.42 0.314l-0.414-0.732c1.449-5.852 2.794-11.704 4.14-17.556 3.518-15.78 4.45-21.84 5.38-29.887l0.725-0.418c8.279-1.149 10.245-1.463 19.248-3.239l0.724 0.836-1.345 5.016c1.552-0.94 3.001-1.881 4.553-2.613 4.243-2.09 8.9-2.717 11.487-2.717 3.932 0 8.279 1.15 10.038 5.748 1.656 4.075 0.62 9.091-1.656 19.019l-1.138 5.016c-2.277 11.077-2.69 13.062-3.933 20.586l-0.827 0.627 0.104 0.105zm29.058 0.027c-4.346 0-7.14-0.104-9.83 0-2.691 0-5.278 0.21-9.314 0.314l-0.207-0.314-0.207-0.418c1.138-4.18 1.656-5.643 2.277-7.106 0.517-1.463 1.034-2.926 2.07-7.21 1.241-5.539 2.069-9.405 2.586-12.854 0.621-3.24 0.932-6.06 1.346-9.3l0.31-0.209 0.31-0.313c4.347-0.627 7.038-1.045 9.832-1.463s5.691-0.94 10.141-1.776l0.207 0.418 0.103 0.418-2.482 10.345c-0.828 3.449-1.656 6.897-2.38 10.346-1.554 7.315-2.277 10.032-2.587 12.017-0.414 1.881-0.519 2.822-1.14 6.584l-0.414 0.313-0.414 0.314-0.207-0.106zm45.941-25.675c-0.31 1.881-1.966 8.883-4.139 11.809-1.553 2.194-3.312 3.553-5.382 3.553-0.62 0-4.14 0-4.242-5.33 0-2.612 0.517-5.33 1.138-8.255 1.863-8.465 4.14-15.466 9.831-15.466 4.451 0 4.76 5.225 2.794 13.689zm18.731 0.836c2.483-11.077 0.518-16.302-1.862-19.437-3.726-4.807-10.348-6.374-17.178-6.374-4.141 0-13.867 0.418-21.525 7.524-5.484 5.12-8.071 12.122-9.52 18.81-1.554 6.792-3.312 19.019 7.864 23.617 3.414 1.463 8.382 1.88 11.59 1.88 8.176 0 16.558-2.298 22.87-8.986 4.863-5.434 7.036-13.585 7.864-17.034h-0.103zm174.43 26.08c-8.693-0.104-11.176-0.104-19.145 0.314l-0.518-0.627c2.174-8.256 4.346-16.616 6.312-24.976 2.484-10.868 3.105-15.466 3.934-21.84l0.619-0.522c8.59-1.254 10.971-1.567 19.973-3.239l0.207 0.731c-1.656 6.897-3.207 13.69-4.863 20.482-3.311 14.317-4.451 21.632-5.691 29.156l-0.828 0.627v-0.106z" fill="#FEFEFE"/><path d="m547.75 224.16c-0.414 1.776-2.07 8.882-4.242 11.808-1.449 2.09-4.967 3.449-6.934 3.449-0.621 0-4.035 0-4.242-5.225 0-2.613 0.516-5.33 1.137-8.256 1.863-8.255 4.141-15.257 9.832-15.257 4.449 0 6.416 5.12 4.449 13.585v-0.104zm17.076 0.836c2.482-11.077-7.658-0.94-9.211-4.598-2.484-5.748-0.932-17.243-10.865-21.109-3.83-1.568-12.832 0.418-20.49 7.524-5.381 5.016-8.072 12.017-9.52 18.705-1.555 6.688-3.312 19.02 7.76 23.304 3.52 1.567 6.727 1.985 9.934 1.776 11.178-0.627 19.662-17.661 25.977-24.349 4.86-5.329 5.689 1.986 6.415-1.253zm-129.94 23.413c-7.141-0.105-9.625-0.105-18.006 0.313l-0.311-0.627c0.725-3.24 1.553-6.374 2.275-9.614l0.932-4.389c1.553-6.792 3.105-14.839 3.207-17.242 0.207-1.463 0.621-5.12-3.414-5.12-1.76 0-3.621 0.835-5.381 1.671-0.932 3.658-3.002 13.899-4.037 18.497-1.965 9.823-2.172 10.972-3.104 15.78l-0.621 0.626c-7.346-0.104-9.934-0.104-18.419 0.314l-0.414-0.732c1.449-5.852 2.794-11.704 4.14-17.556 3.518-15.78 4.346-21.84 5.379-29.887l0.621-0.418c8.281-1.149 10.35-1.463 19.248-3.239l0.727 0.836-1.242 5.016c1.449-0.94 3-1.881 4.449-2.613 4.244-2.09 8.9-2.717 11.486-2.717 3.934 0 8.176 1.15 10.037 5.748 1.656 4.075 0.52 9.091-1.758 19.019l-1.139 5.016c-2.379 11.077-2.689 13.062-3.934 20.586l-0.826 0.627 0.105 0.105zm62-86.519l-6.002 0.105c-15.523 0.209-21.732 0.104-24.215-0.209-0.207 1.15-0.621 3.135-0.621 3.135s-5.588 25.916-5.588 26.02c0 0-13.246 55.176-13.867 57.788 13.557-0.209 19.041-0.209 21.422 0.105 0.518-2.613 3.621-17.974 3.725-17.974 0 0 2.691-11.286 2.795-11.704 0 0 0.826-1.15 1.654-1.672h1.242c11.695 0 24.836 0 35.186-7.628 7.037-5.225 11.797-13.063 13.971-22.468 0.516-2.299 0.93-5.016 0.93-7.837 0-3.658-0.723-7.21-2.793-10.032-5.279-7.42-15.732-7.524-27.839-7.629zm7.762 27.066c-1.242 5.747-4.967 10.659-9.727 12.958-3.934 1.985-8.693 2.194-13.66 2.194h-3.209l0.207-1.254s5.9-25.916 5.9-25.811l0.205-1.359 0.104-1.045 2.381 0.21s12.211 1.044 12.418 1.044c4.759 1.881 6.83 6.688 5.381 13.063zm127.21 8.666l-0.725-0.836c-8.795 1.776-10.451 2.09-18.523 3.24l-0.621 0.626c0 0.105-0.104 0.21-0.104 0.418v-0.104c-6.002 14.107-5.898 11.077-10.762 22.154 0-0.523 0-0.836-0.104-1.359l-1.242-24.035-0.725-0.836c-9.314 1.777-9.52 2.09-18.006 3.24l-0.621 0.627c-0.104 0.313-0.104 0.627-0.104 0.94l0.104 0.105c1.035 5.538 0.828 4.284 1.863 12.958 0.518 4.284 1.139 8.569 1.654 12.749 0.828 7.106 1.348 10.554 2.381 21.318-5.795 9.613-7.141 13.271-12.729 21.734l0.311 0.836c8.383-0.312 10.244-0.312 16.453-0.312l1.348-1.568c4.654-10.135 40.254-71.79 40.254-71.79l-0.102-0.105zm-302.72 6.922c4.76-3.344 5.38-7.942 1.345-10.345-4.036-2.404-11.176-1.672-15.937 1.672-4.76 3.24-5.277 7.837-1.241 10.345 3.932 2.3 11.073 1.672 15.833-1.672z" fill="#FEFEFE"/><path d="m590.33 270.9l-6.936 12.019c-2.172 4.075-6.311 7.21-12.727 7.21l-11.074-0.209 3.209-10.868h2.172c1.139 0 1.967-0.104 2.588-0.418 0.621-0.209 0.932-0.627 1.449-1.254l4.139-6.583h17.281l-0.101 0.103z" fill="#FEFEFE"/></svg>',visa:'<svg width="780" height="500" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M489.823 143.111C442.988 143.111 401.134 167.393 401.134 212.256C401.134 263.706 475.364 267.259 475.364 293.106C475.364 303.989 462.895 313.731 441.6 313.731C411.377 313.731 388.789 300.119 388.789 300.119L379.123 345.391C379.123 345.391 405.145 356.889 439.692 356.889C490.898 356.889 531.19 331.415 531.19 285.784C531.19 231.419 456.652 227.971 456.652 203.981C456.652 195.455 466.887 186.114 488.122 186.114C512.081 186.114 531.628 196.014 531.628 196.014L541.087 152.289C541.087 152.289 519.818 143.111 489.823 143.111ZM61.3294 146.411L60.1953 153.011C60.1953 153.011 79.8988 156.618 97.645 163.814C120.495 172.064 122.122 176.868 125.971 191.786L167.905 353.486H224.118L310.719 146.411H254.635L198.989 287.202L176.282 167.861C174.199 154.203 163.651 146.411 150.74 146.411H61.3294ZM333.271 146.411L289.275 353.486H342.756L386.598 146.411H333.271ZM631.554 146.411C618.658 146.411 611.825 153.318 606.811 165.386L528.458 353.486H584.542L595.393 322.136H663.72L670.318 353.486H719.805L676.633 146.411H631.554ZM638.848 202.356L655.473 280.061H610.935L638.848 202.356Z" fill="#1434CB"/> </svg>'},Rt={alipay:"alipay",amex:"amex",americanexpress:"amex",diners:"diners",dinersclub:"diners",discover:"discover",elo:"elo",generic:"generic",genericcard:"generic",card:"generic",hiper:"hiper",hipercard:"hipercard",jcb:"jcb",maestro:"maestro",master:"mastercard",mastercard:"mastercard",masterpass:"mastercard",mc:"mastercard",mir:"mir",paypal:"paypal",unionpay:"unionpay",upi:"unionpay",visa:"visa"},Bt=e=>"data:image/svg+xml;utf8,"+encodeURIComponent(e),Dt=({type:e,brand:t})=>"bank"===e?"bank":"native"===e?"native":(e=>{const t=e?.toLowerCase().replace(/[^a-z0-9]/g,"")??"";return Rt[t]??"generic"})(t),Ot=e=>{const t=Dt(e);return Bt("bank"===t?'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9L12 5L20 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 18H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>':"native"===t?'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 14H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>':qt[t])},Vt=((e,...t)=>{const r=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new n(r,e,i)})`
  :host {
    --chc-text: #111827;
    --chc-copy: #4b5565;
    --chc-muted: #6b7280;
    --chc-placeholder: #9ca3af;
    --chc-surface: #ffffff;
    --chc-widget-background: var(--chc-surface);
    --chc-soft-surface: #f8fafc;
    --chc-border: #d9e1ec;
    --chc-border-strong: #c6d0dd;
    --chc-payment-method-background: var(--chc-surface);
    --chc-primary: #1d4ed8;
    --chc-success: #047857;
    --chc-success-bg: #ecfdf3;
    --chc-success-border: #a6f4c5;
    --chc-danger: #f20d19;
    --chc-danger-bg: #fef3f2;
    --chc-danger-border: #fecdca;
    --chc-warning: #e88700;
    --chc-warning-bg: #fffaeb;
    --chc-warning-border: #fedf89;
    --chc-disabled-text: #ffffff;
    --chc-disabled-surface: #c5ccd8;
    --chc-font-family: Inter, 'Segoe UI', Arial, sans-serif;
    --chc-radius-control: 0.625rem;
    --chc-radius-card: 0.75rem;
    --chc-input-height: 2.5rem;
    --chc-font-weight: 400;
    --chc-divider: #ebeef2;
    --chc-focus-ring: rgba(29, 78, 216, 0.14);
    --chc-motion-fast: 120ms;
    --chc-motion-base: 180ms;
    --chc-motion-slow: 240ms;
    --chc-motion-provider: 300ms;
    --chc-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --chc-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
    --chc-spinner-duration: 900ms;
    --chc-shell-padding: 1.1875rem 1.1875rem 1rem;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 1rem;
    font-weight: var(--chc-font-weight);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-close,
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
    width: 100%;
    max-width: 25.25rem;
    position: relative;
    padding: var(--chc-shell-padding);
    border: 0;
    border-radius: 0;
    background: var(--chc-widget-background);
    text-align: left;
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
    font-size: 1.125rem;
    font-weight: inherit;
    letter-spacing: 0;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
  }

  .widget-header-action {
    flex: 0 0 auto;
  }

  .widget-header-action .text-link-button {
    color: var(--chc-primary);
    font-weight: inherit;
  }

  .widget-subtitle {
    margin: 0.375rem 0 0;
    color: var(--chc-copy);
    font-weight: inherit;
    font-size: 0.9375em;
    text-align: center;
  }

  .widget-divider {
    height: 0.0625rem;
    margin-top: 1rem;
    background: var(--chc-divider);
  }

  .widget-content {
    margin-top: 1.125rem;
    margin-right: auto;
    margin-left: auto;
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
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
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
  }

  .required-info-card {
    display: grid;
    gap: 0.75rem;
    min-height: 9.75rem;
    border-radius: min(1rem, calc(var(--chc-radius-card) * 1.5));
    border: 0.0625rem solid var(--chc-border);
    padding: 1rem;
    background: color-mix(
      in srgb,
      var(--chc-primary) 6%,
      var(--chc-surface)
    );
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
    background: color-mix(
      in srgb,
      var(--chc-primary) 6%,
      var(--chc-surface)
    );
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
    font-weight: inherit;
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
    color: var(--chc-text);
    font-weight: inherit;
    font-size: 0.875em;
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
    border: 0.0625rem solid var(--chc-border);
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
    border: 0.0625rem solid var(--chc-border);
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

  .field-control-card-form:focus-within {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .field-card-form.field-invalid .field-control-card-form {
    border-color: var(--chc-danger);
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
    gap: 0.625rem;
  }

  .card-form-screen .form-grid {
    gap: 0.75rem 0.625rem;
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
    border: 0.0625rem solid var(--chc-border);
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
    grid-template-columns: 2.75rem minmax(0, 1fr) auto;
    gap: 0.625rem;
    align-items: center;
    border-radius: var(--chc-radius-card);
    padding: 0.625rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    border: 0.0625rem solid var(--chc-border);
  }

  .payment-method-row-action {
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard);
    cursor: pointer;
  }

  .payment-method-row-edit {
    grid-template-columns: 2.75rem minmax(0, 1fr) auto;
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

  .selected-payment-method {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 92%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.625rem 1.125rem rgba(17, 24, 39, 0.05);
  }

  .payment-method-row-selected {
    border-color: color-mix(in srgb, var(--chc-primary) 24%, var(--chc-border));
    background: color-mix(
      in srgb,
      var(--chc-primary) 4%,
      var(--chc-payment-method-background)
    );
  }

  .payment-method-row-action:hover:not(:disabled),
  .payment-method-row-action:focus-visible {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 88%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.05);
  }

  .payment-method-row-action:focus-visible {
    outline: 0;
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

  .payment-method-delete-confirmation-group {
    max-width: min(20rem, 54vw);
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .payment-method-delete-confirmation {
    max-width: min(9rem, 28vw);
    color: var(--chc-danger);
    font-size: 0.75rem;
    font-weight: inherit;
    text-align: right;
    white-space: normal;
  }

  .payment-method-delete-confirmation-controls {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .payment-method-delete-confirm-button {
    min-height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.625rem;
    padding: 0 0.75rem;
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

  .payment-method-delete-icon {
    width: 1.25rem;
    height: 1.25rem;
    position: relative;
    display: inline-flex;
  }

  .payment-method-delete-icon::before,
  .payment-method-delete-icon::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .payment-method-delete-icon::before {
    top: 0.3125rem;
    width: 0.75rem;
    height: 0.6875rem;
    border: 0.09375rem solid currentColor;
    border-top: 0;
    border-radius: 0 0 0.15625rem 0.15625rem;
  }

  .payment-method-delete-icon::after {
    top: 0.1875rem;
    width: 0.9375rem;
    height: 0.125rem;
    background: currentColor;
    border-radius: 999rem;
    box-shadow: 0 -0.21875rem 0 -0.03125rem currentColor;
  }

  .payment-method-icon-chip {
    width: 2.75rem;
    height: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 0;
    color: var(--chc-primary);
  }

  .payment-method-icon-image {
    width: 2.75rem;
    height: 1.75rem;
    display: block;
    object-fit: contain;
  }

  .payment-method-copy {
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }

  .payment-method-title {
    min-width: 0;
    display: block;
    overflow: hidden;
    color: var(--chc-text);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-title-row {
    min-width: 0;
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
    font-weight: inherit;
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
    border: 0.0625rem solid;
    border-radius: 999rem;
    padding: 0.1875rem 0.5rem;
    font-size: 0.75em;
    font-weight: inherit;
  }

  .verification-status-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .verification-status-badge-success {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .verification-status-badge-warning {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
    color: var(--chc-warning);
  }

  .verification-status-badge-danger {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .source-action {
    width: 100%;
    min-height: 3.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.625rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.75rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
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

  .bank-provider-flow {
    display: grid;
    gap: 0.875rem;
  }

  .bank-provider-manual-link {
    display: flex;
    justify-content: center;
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

  .text-link-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-skeletons {
    display: grid;
    gap: 0.625rem;
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
    grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
    gap: 0.625rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.625rem;
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
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.6875rem;
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
    :host {
      --chc-shell-padding: 1rem 1rem 0.875rem;
    }

    .widget-shell {
      border-radius: 1rem;
    }

    .widget-close {
      right: 0.375rem;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .otp-inputs {
      width: 100%;
    }

    .payment-method-row,
    .source-action,
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
    .source-action-link-title,
    .payment-method-title {
      white-space: normal;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .widget-close,
    .button,
    .field-input,
    .field-control-card-form,
    .payment-method-row,
    .source-action-link,
    .payment-method-delete-button,
    .payment-method-delete-confirm-button {
      transition: none;
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
`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,Lt=e=>e??U,Mt=(...e)=>e.filter(Boolean).join(" "),Pt=e=>{const t=e?.trim();return t||void 0},Ft=e=>{const t=(e=>"verified"===e?{label:"Verified",tone:"success"}:"under-review"===e?{label:"Under review",tone:"warning"}:"require-info"===e?{label:"Need More Information",tone:"warning"}:"declined"===e?{label:"Can't Use",tone:"danger"}:{label:"Action Required",tone:"warning"})(e);return F`
    <span
      class="verification-status-badge verification-status-badge-${t.tone}"
      data-verification-status=${e}
    >
      <span class="verification-status-label">${t.label}</span>
    </span>
  `},jt=e=>{const t=Pt(e.accountLabel)??(({label:e,brand:t,last4:i})=>{const r=Pt(e),n=Pt(t);return i&&n&&n!==r?`${n} •••• ${i}`:i?`•••• ${i}`:n??""})(e),i=Pt(e.label)??t,r=Boolean(t);return F`
    <span class="payment-method-copy">
      <span class="payment-method-title-row">
        <span class="payment-method-title">${i}</span>
      </span>
      ${r?F`
            <span class="payment-method-meta-row">
              <span class="payment-method-meta">${t}</span>
              ${(e=>!1!==e.showVerificationStatus&&"verified"!==e.status)(e)?Ft(e.status):""}
            </span>
          `:""}
    </span>
  `},Ut=(e,t)=>F`
  <span class="payment-method-trailing">
    ${(({balanceLabel:e,balanceLoading:t})=>t?F`
      <span
        class="payment-method-balance-loading"
        role="status"
        aria-label="Loading balance"
      ></span>
    `:e?F`<span class="payment-method-balance">${e}</span>`:"")(e)}
    ${t?F`
          <span class="payment-method-chevron" aria-hidden="true">
            <span class="payment-method-chevron-icon"></span>
          </span>
        `:""}
  </span>
`,_t=(e,t)=>F`
  <span class="payment-method-icon-chip" aria-hidden="true">
    <img
      class="payment-method-icon-image"
      data-payment-method-icon=${Dt(e)}
      src=${Ot(e)}
      alt=""
    />
  </span>
  ${jt(e)} ${t}
`,Ht=({label:e,variant:t="primary",action:i,type:r="button",icon:n,disabled:a=!1,loading:o=!1})=>F`
  <button
    class=${Mt("button",`button-${t}`,o&&"button-loading")}
    part=${Lt("primary"===t?"primary-action":void 0)}
    type=${r}
    data-action=${Lt(i)}
    aria-busy=${o?"true":"false"}
    ?disabled=${a||o}
  >
    <span class="button-content">
      ${o?F`<span class="button-spinner" aria-hidden="true"></span>`:n?F`
            <span
              class="button-icon button-icon-${n}"
              aria-hidden="true"
            ></span>
          `:""}
      <span class="button-label">${e}</span>
    </span>
  </button>
`,Wt=({id:e,label:t,name:i,value:r="",placeholder:n,type:a="text",span:o="default",variant:s="default",autocomplete:c,inputmode:d,disabled:l=!1,dataField:h,dataFieldScope:u="card",error:m})=>{const p=Mt("field","full"===o&&"field-full","card-form"===s&&"field-card-form",m&&"field-invalid"),f=Mt("field-label","card-form"===s&&"field-label-card-form"),v=Mt("field-input","card-form"===s&&"field-input-card-form"),b=F`
    <input
      class=${v}
      id=${e}
      name=${Lt(i)}
      type=${a}
      .value=${r}
      placeholder=${Lt(n)}
      autocomplete=${Lt(c)}
      inputmode=${Lt(d)}
      data-card-field=${Lt("card"===u?h:void 0)}
      data-bank-account-field=${Lt("bankAccount"===u?h:void 0)}
      data-transfer-field=${Lt("transfer"===u?h:void 0)}
      aria-invalid=${m?"true":"false"}
      aria-describedby=${Lt(m?`${e}-error`:void 0)}
      ?disabled=${l}
    />
  `;return F`
    <div class=${p}>
      <label class=${f} for=${e}>${t}</label>
      ${"card-form"===s?F`
            <div class="field-control field-control-card-form">${b}</div>
          `:b}
      ${m?F`<p class="field-error" id=${`${e}-error`}>${m}</p>`:""}
    </div>
  `},Kt=({id:e,label:t,name:i,value:r="",options:n,span:a="default",variant:o="default",disabled:s=!1,dataField:c,dataFieldScope:d="card",error:l})=>{const h=Mt("field","card-form"!==o&&"field-with-select","full"===a&&"field-full","card-form"===o&&"field-card-form",l&&"field-invalid"),u=Mt("field-label","card-form"===o&&"field-label-card-form"),m=Mt("field-input","field-select","card-form"===o&&"field-input-card-form"),p=F`
    <select
      class=${m}
      id=${e}
      name=${Lt(i)}
      .value=${r}
      data-card-field=${Lt("card"===d?c:void 0)}
      data-bank-account-field=${Lt("bankAccount"===d?c:void 0)}
      data-transfer-field=${Lt("transfer"===d?c:void 0)}
      aria-invalid=${l?"true":"false"}
      aria-describedby=${Lt(l?`${e}-error`:void 0)}
      ?disabled=${s}
    >
      ${n.map(e=>F`
          <option value=${e.value} ?selected=${e.value===r}>
            ${e.label}
          </option>
        `)}
    </select>
  `;return F`
    <div class=${h}>
      <label class=${u} for=${e}>${t}</label>
      ${"card-form"===o?F`
            <div
              class="field-control field-control-card-form field-with-select"
            >
              ${p}
            </div>
          `:p}
      ${l?F`<p class="field-error" id=${`${e}-error`}>${l}</p>`:""}
    </div>
  `},Yt=({variant:e,message:t})=>F`
  <div class="alert alert-${e}" part="alert" role="alert">
    <span class="alert-message">${t}</span>
  </div>
`,Gt=({title:e,message:t})=>F`
  <div class="empty-state">
    <p class="empty-state-title">${e}</p>
    <p class="empty-state-message">${t}</p>
  </div>
`,Jt=({id:e,label:t,status:i,type:r,eyebrow:n,brand:a,accountLabel:o,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:l,disabled:h=!1},{variant:u="default",deleteDisabled:m=!1,confirmingDelete:p=!1,selected:f=!1,selectable:v=!0}={})=>{const b={id:e,label:t,status:i,type:r,eyebrow:n,brand:a,accountLabel:o,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:l,disabled:h};if("edit"===u){const i={...b,showVerificationStatus:!1};return F`
      <div
        class=${Mt("payment-method-row","payment-method-row-edit",p&&"payment-method-row-delete-confirming")}
        part="payment-method-row"
        aria-label=${t}
        data-payment-method-id=${e}
      >
        ${_t(i,((e,t,i=!1,r=!1)=>{const n=`Delete ${t}`;return r?F`
      <span class="payment-method-delete-action">
        <span class="payment-method-delete-confirmation-group">
          <span class="payment-method-delete-confirmation" role="status"
            >Remove this payment method?</span
          >
          <span class="payment-method-delete-confirmation-controls">
            <button
              class="payment-method-delete-confirm-button"
              type="button"
              aria-label=${`Cancel deleting ${t}`}
              data-action="cancel-delete-payment-source"
              data-payment-method-id=${e}
              ?disabled=${i}
            >
              Cancel
            </button>
            <button
              class="payment-method-delete-confirm-button payment-method-delete-confirm-button-danger"
              type="button"
              aria-label=${n}
              data-action="delete-payment-source"
              data-payment-method-id=${e}
              ?disabled=${i}
            >
              Delete
            </button>
          </span>
        </span>
      </span>
    `:F`
    <span class="payment-method-delete-action">
      <button
        class="payment-method-delete-button"
        type="button"
        aria-label=${n}
        data-action="delete-payment-source"
        data-payment-method-id=${e}
        ?disabled=${i}
      >
        <span class="payment-method-delete-icon" aria-hidden="true"></span>
      </button>
    </span>
  `})(e,t,m,p))}
      </div>
    `}return v&&(e=>{return"verified"===(t=e.status)||"require-info"===t||"not-verified"===t;var t})(b)?F`
      <button
        class=${Mt("payment-method-row","payment-method-row-action",f&&"payment-method-row-selected")}
        part="payment-method-row"
        type="button"
        aria-disabled=${h?"true":"false"}
        data-action=${"verified"===i?"attach-payment-source":"verify-payment-source"}
        data-payment-method-id=${e}
        ?disabled=${h}
      >
        ${_t(b,Ut(b,!0))}
      </button>
    `:F`
    <div
      class=${Mt("payment-method-row","payment-method-row-static")}
      part="payment-method-row"
      aria-label=${t}
      aria-disabled="true"
      data-payment-method-id=${e}
    >
      ${_t(b,Ut(b,!1))}
    </div>
  `},Zt=({id:e,label:t,status:i,type:r,eyebrow:n,brand:a,accountLabel:o,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:l})=>{const h={label:t,status:i,type:r,brand:a,accountLabel:o,balanceLabel:s,balanceLoading:c,last4:d,showVerificationStatus:l};return F`
    <div
      class="selected-payment-method"
      part="payment-method-row"
      aria-label=${t}
    >
      ${_t(h,Ut(h,!1))}
    </div>
  `},Qt=e=>"transfer"===e?F`
        <span
          class="source-action-icon source-action-icon-transfer"
          aria-hidden="true"
        >
          <span
            class="source-action-transfer-arrow source-action-transfer-arrow-forward"
          ></span>
          <span
            class="source-action-transfer-arrow source-action-transfer-arrow-back"
          ></span>
        </span>
      `:F`<span class="source-action-icon" aria-hidden="true">+</span>`,Xt=({label:e,subtitle:t,action:i,icon:r,variant:n="card",disabled:a=!1})=>"link"===n?F`
        <button
          class="source-action-link source-action-link-${r}"
          type="button"
          data-action=${i}
          ?disabled=${a}
        >
          ${Qt(r)}
          <span class="source-action-link-copy">
            <span class="source-action-link-title source-action-title">
              ${e}
            </span>
            ${t?F`
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
      `:F`
        <button
          class="source-action source-action-${r}"
          type="button"
          data-action=${i}
          ?disabled=${a}
        >
          ${Qt(r)}
          <span class="source-action-copy">
            <span class="source-action-title">${e}</span>
            ${t?F`<span class="source-action-subtitle">${t}</span>`:""}
          </span>
        </button>
      `,ei=({containerId:e,title:t,loadingLabel:i,loading:r=!1})=>F`
  <div
    class=${Mt("provider-frame",r&&"provider-frame-loading")}
    part="provider-frame"
    aria-busy=${r?"true":"false"}
  >
    ${t?F`
          <div class="provider-frame-header">
            ${t?F`<p class="provider-frame-title">${t}</p>`:""}
            ${r?"":F`
                  <p
                    class="provider-frame-status"
                    role="status"
                    aria-live="polite"
                  >
                    ${i}
                  </p>
                `}
          </div>
        `:""}
    <slot class="provider-frame-slot" name=${e}>
      <div
        class=${Mt("provider-frame-container",r&&"provider-frame-container-loading")}
        id=${e}
      ></div>
    </slot>
    ${r?F`
          <div
            class="provider-loading-overlay"
            role="status"
            aria-live="polite"
          >
            <span class="loading-spinner" aria-hidden="true"></span>
            <span class="provider-loading-label">
              ${i}
            </span>
          </div>
        `:""}
  </div>
`,ti=({variant:e,title:t,message:i,content:r,actions:n})=>F`
  <div class="outcome-shell outcome-${e}">
    <span class="outcome-icon" aria-hidden="true"></span>
    ${t?F`<p class="outcome-title">${t}</p>`:""}
    ${i?F`<p class="outcome-message">${i}</p>`:""}
    ${r?F`<div class="outcome-content">${r}</div>`:""}
    ${n?F`<div class="outcome-actions">${n}</div>`:""}
  </div>
`,ii=({label:e,action:t,disabled:i=!1})=>F`
  <button
    class="text-link-button"
    type="button"
    data-action=${t}
    ?disabled=${i}
  >
    ${e}
  </button>
`,ri=e=>F` <div class="form-grid">${e}</div> `,ni=({title:e,subtitle:t,content:i,headerAction:r,width:n="default",ariaLabel:a="Commerce Hub Connect",closeAction:o="close",showClose:s=!0,showDivider:c=!1,showFooter:d=!0,busy:l=!1,overlay:h})=>F`
  <section
    class=${Mt("widget-shell","wide"===n&&"widget-shell-wide",l&&"widget-shell-busy")}
    part="shell"
    aria-label=${a}
    aria-busy=${l?"true":"false"}
  >
    ${s?F`
          <button
            class="widget-close"
            type="button"
            aria-label="Close Commerce Hub Connect"
            data-action=${o}
          >
            ×
          </button>
        `:""}
    <div class="widget-header" part="header">
      <h2 class="widget-title" part="title">${e}</h2>
      ${r?F`<div class="widget-header-action">${r}</div>`:""}
    </div>
    ${t?F`<p class="widget-subtitle">${t}</p>`:""}
    ${c?F`<div class="widget-divider" aria-hidden="true"></div>`:""}
    <div class="widget-content" part="content">${i}</div>
    ${h?F`<div class="widget-loading-overlay">${h}</div>`:""}
    ${d?F`
  <footer class="powered-by-footer" part="footer">
    <span>Powered by</span>
    <strong class="powered-by-brand">Commerce Hub Connect</strong>
  </footer>
`:""}
  </section>
`,ai=e=>`We sent a one-time code to ${e??"your contact method"}.`,oi=e=>e.composedPath().find(e=>e instanceof HTMLInputElement&&e.classList.contains("otp-input")),si=({status:e,value:t,length:i,failedMessage:r,copy:n,submitting:a=!1,resending:o=!1})=>{const s="OTP_VALIDATION_FAILED"===e;return F`
    <div class="otp-flow">
      ${s?Yt({variant:"danger",message:r??n.failedMessage}):""}
      ${(({label:e,value:t="",length:i=6,disabled:r=!1,error:n=!1})=>{const a=Array.from({length:i},(e,i)=>t[i]??"");return F`
    <fieldset
      class="otp-group ${n?"otp-group-error":""}"
      aria-label=${e}
    >
      <legend class="otp-label">${e}</legend>
      <div class="otp-inputs">
        ${a.map((t,i)=>F`
            <input
              class="otp-input"
              aria-label=${`${e} digit ${i+1}`}
              inputmode="numeric"
              maxlength="1"
              pattern="[0-9]*"
              data-otp-index=${i}
              .value=${t}
              ?disabled=${r}
            />
          `)}
      </div>
    </fieldset>
  `})({label:"Verification code",value:t,length:i,disabled:a,error:s})}
      <div class="primitive-footer">
        ${Ht({label:a?n.verifyingButton:s?n.tryAgainButton:n.verifyButton,icon:a||s?void 0:"check",variant:"primary",action:"verify-otp",loading:a,disabled:a||t.length<i})}
      </div>
      <div class="otp-support">
        <p class="otp-support-copy otp-resend-prefix">${n.resendPrefix}</p>
        <div class="otp-support-actions">
          ${(({label:e,action:t,disabled:i=!1,loading:r=!1})=>F`
  <button
    class=${Mt("otp-resend",r&&"otp-resend-loading")}
    type="button"
    data-action=${t}
    aria-busy=${r?"true":"false"}
    ?disabled=${i||r}
  >
    ${r?F`<span class="otp-resend-spinner" aria-hidden="true"></span>`:""}
    <span class="otp-resend-label">${e}</span>
  </button>
`)({label:o?n.resendPendingButton:n.resendButton,action:"resend-otp",loading:o,disabled:a||o})}
        </div>
      </div>
    </div>
  `},ci=()=>F`
  <div class="payment-flow">
    ${(({count:e=3,label:t="Loading payment methods"}={})=>F`
  <div class="payment-method-skeletons" role="status" aria-live="polite">
    <span class="payment-method-skeleton-label">${t}</span>
    ${Array.from({length:e},()=>F`
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
`,di=({methods:e,allowedTenderOptions:t,canAddPaymentSources:i,canSelectPaymentSources:r,editing:n,actionPending:a,selectedPaymentSourceId:o,deleteConfirmationPaymentSourceId:s,copy:c,showTransferAction:d=!1})=>{const l=i&&(t.card||t.bankAccount);return F`
    <div class="payment-flow">
      <div class="primitive-stack" aria-label="Payment methods">
        ${e.map(e=>Jt({...e,disabled:e.disabled||a},{variant:n?"edit":"default",deleteDisabled:a,confirmingDelete:e.id===s,selected:e.id===o,selectable:r}))}
      </div>
      ${n||!l?"":F`
            <div class="payment-action-links">
              ${t.card?Xt({label:c.addCardTitle,action:"add-card",icon:"card",variant:"link",disabled:a}):""}
              ${t.bankAccount?Xt({label:c.addBankAccountTitle,action:"add-bank-account",icon:"bank",variant:"link",disabled:a}):""}
              ${d?Xt({label:"Transfer funds",action:"open-transfer",icon:"transfer",variant:"link",disabled:a}):""}
            </div>
          `}
    </div>
  `},li=({allowedTenderOptions:e,canAddPaymentSources:t,deletePending:i=!1,copy:r,showTransferAction:n=!1})=>{const a=Boolean(r.emptyTitle||r.emptyMessage),o=t&&(e.card||e.bankAccount);return F`
    <div class="payment-flow">
      ${a?Gt({title:r.emptyTitle,message:r.emptyMessage}):""}
      ${o?F`
            <div class="payment-action-links">
              ${e.card?Xt({label:r.addCardTitle,subtitle:r.addCardSubtitle,action:"add-card",icon:"card",variant:"link",disabled:i}):""}
              ${e.bankAccount?Xt({label:r.addBankAccountTitle,subtitle:r.addBankAccountSubtitle,action:"add-bank-account",icon:"bank",variant:"link",disabled:i}):""}
              ${n?Xt({label:"Transfer funds",action:"open-transfer",icon:"transfer",variant:"link",disabled:i}):""}
            </div>
          `:""}
    </div>
  `};var hi=function(e,t,i,r){for(var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r,s=e.length-1;s>=0;s--)(n=e[s])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};const ui="onSelect",mi="onAddPaymentMethod",pi="onVerifyPaymentMethod",fi="onDeletePaymentMethod",vi="onListPaymentMethods",bi="onTransfer",gi="onError",yi="commerce-hub-pbb-provider",wi="OTP_VALIDATION_SUCCESS",ki=[{value:"",label:"Select country or region"},{value:"US",label:"United States"}],$i=[{value:"",label:"Select state"},...[["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["DC","District of Columbia"]].map(([e,t])=>({value:e,label:t}))],xi={apiKey:"YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A",configId:"cce84049-0940-4926-9a54-9eaca0c09830",environment:"qa",locale:"en-US",paymentSdkUrl:"https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js"};let Si=class extends ae{constructor(){super(...arguments),this.otpValue="",this.bankLinkLoading=!1,this.bankAccountDraft={name:"",routingNumber:"",accountNumber:"",accountNumberReEntered:""},this.bankAccountDraftErrors={},this.bankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},accountNumberReEntered:{status:"idle",normalizedValue:""}},this.transferDraft={fromSourceId:"",toSourceId:"",amount:""},this.transferDraftErrors={},this.transferSubmitSuccess=!1,this.transferFlowActive=!1,this.transferFlowScreen="form",this.cardDraft=Le(),this.cardDraftErrors={},this.cardEncryption={cardNumber:{status:"idle",normalizedValue:""},cvv:{status:"idle",normalizedValue:""}},this.billingAddresses=[],this.billingAddressSelectorExpanded=!1,this.paymentSourceEditMode=!1,this.savedSourceVerificationFailed=!1,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoFiles={},this.interactionRefresh=new Ne(this),this.nativeBalance=new Te(this),this.minimumVerificationOverlayToken=0,this.handleClick=e=>{const t=fr(e,"action"),i=fr(e,"paymentMethodId");if(t)if("attach-payment-source"!==t){if("change-payment-source"===t)return this.resetRequiredInfo(),void this.showPaymentSourceList({refresh:!0});if("retry-interaction-refresh"!==t){if("toggle-payment-source-edit-mode"===t)return this.clearDeletePaymentSourceConfirmation(),void(this.paymentSourceEditMode=!this.paymentSourceEditMode);if("verify-payment-source"!==t)if("delete-payment-source"!==t)if("cancel-delete-payment-source"!==t){if("done-payment-source-verification"===t)return this.resetSavedSourceVerification(),void this.showPaymentSourceList({refresh:!0});if("open-required-info-file-picker"===t)return this.pendingRequiredInfoDocKey=fr(e,"requiredInfoDocKey")??this.firstRequiredInfoDocKey(),void this.renderRoot.querySelector(".required-info-file-input")?.click();if("submit-required-info"!==t){if("open-transfer"===t)return this.paymentSourceEditMode=!1,this.paymentSourceView="list",this.resetCardFlow(),this.resetBankFlow(),this.resetRequiredInfo(),this.resetTransferFlow(),void(this.transferFlowActive=!0);if("transfer"!==t)if("edit-transfer"!==t)if("confirm-transfer"!==t)if("verify-otp"!==t)if("resend-otp"!==t){if("add-bank-account"===t||"use-bank-account-instead"===t||"retry-bank-provider"===t||"back-to-bank-provider"===t||"use-different-bank-account"===t)return this.paymentSourceEditMode=!1,this.paymentSourceView="list",this.resetCardFlow(),this.resetRequiredInfo(),void this.startPayByBankFlow();if("add-ach-manually"===t)return this.paymentSourceEditMode=!1,this.paymentSourceView="list",this.resetCardFlow(),this.resetRequiredInfo(),void this.showManualBankAccountScreen();if("back-to-payment-methods"===t)return this.resetCardFlow(),this.resetBankFlow(),this.resetRequiredInfo(),void this.showPaymentSourceList({refresh:!0});if("continue-bank-outcome"===t||"done-bank-outcome"===t)return this.resetBankFlow(),void this.showPaymentSourceList({refresh:!0});if("add-card"===t)return this.paymentSourceEditMode=!1,this.paymentSourceView="list",this.resetRequiredInfo(),void this.showAddCardScreen();if("change-billing-address"!==t)if("save-card"!==t)if("save-ach-manual"!==t){if("edit-card-details"!==t)return"use-different-method"===t?(this.resetCardFlow(),this.resetRequiredInfo(),void this.showPaymentSourceList({refresh:!0})):void 0;this.cardFlowScreen="form"}else this.saveManualBankAccount();else this.saveCard();else this.billingAddressSelectorExpanded=!0}else this.resendOtp();else this.verifyOtp();else this.submitTransfer();else this.transferFlowScreen="form";else this.reviewTransfer()}else this.submitRequiredInfo()}else this.clearDeletePaymentSourceConfirmation();else i&&this.deletePaymentSource(i);else i&&(this.clearDeletePaymentSourceConfirmation(),this.paymentSourceEditMode=!1,this.verifySavedPaymentSource(i))}else this.retryInteractionRefresh()}else i&&(this.clearDeletePaymentSourceConfirmation(),this.paymentSourceEditMode=!1,this.selectedPaymentSourceId=i,this.paymentSourceView="selected",this.attachPaymentSource(i))},this.handleInput=e=>{const t=Ci(e);if(t)return void this.storeRequiredInfoSsnInput(t);const i=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.cardField));if(i)return void this.updateCardDraftField(i.dataset.cardField,i.value);const r=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.bankAccountField));if(r)return void this.updateBankAccountDraftField(r.dataset.bankAccountField,r.value);const n=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.transferField));if(n)return void this.updateTransferDraftField(n.dataset.transferField,n.value);const a=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.requiredInfoDocKey));if(a)return void this.storeRequiredInfoValue(a.dataset.requiredInfoDocKey,a.value);const o=e.composedPath().find(e=>e instanceof HTMLInputElement&&e.classList.contains("otp-input"));if(!o)return;const s=this.getOtpInputs(),c=Number(o.dataset.otpIndex),d=$t(o.value);if(!d)return o.value="",void this.syncOtpValueFromInputs(s);if(1===d.length)return o.value=d,this.syncOtpValueFromInputs(s),void this.focusOtpInput(s,c+1);const l=this.writeOtpDigits(s,c,d);this.syncOtpValueFromInputs(s),this.focusOtpInput(s,Math.min(c+d.length,s.length-1),l)},this.handleKeyDown=e=>{const t=oi(e);if(!t)return;const i=this.getOtpInputs(),r=Number(t.dataset.otpIndex);return"ArrowLeft"===e.key?(e.preventDefault(),void this.focusOtpInput(i,r-1)):"ArrowRight"===e.key?(e.preventDefault(),void this.focusOtpInput(i,r+1)):"Backspace"===e.key?(e.preventDefault(),t.value?t.value="":r>0&&(i[r-1].value=""),this.syncOtpValueFromInputs(i),void this.focusOtpInput(i,Math.max(r-1,0))):"Delete"===e.key?(e.preventDefault(),t.value="",void this.syncOtpValueFromInputs(i)):void(e.ctrlKey||e.metaKey||e.altKey||1!==e.key.length||/\d/.test(e.key)||e.preventDefault())},this.handleChange=e=>{const t=e.composedPath().find(e=>e instanceof HTMLInputElement&&Boolean(e.dataset.requiredInfoFileInput));if(t)return this.storeRequiredInfoSelectedFile(t.files?.[0]),void(t.value="");const i=e.composedPath().find(e=>e instanceof HTMLSelectElement&&Boolean(e.dataset.cardField));if(i)return void this.updateCardDraftField(i.dataset.cardField,i.value);const r=e.composedPath().find(e=>e instanceof HTMLSelectElement&&Boolean(e.dataset.bankAccountField));if(r)return void this.updateBankAccountDraftField(r.dataset.bankAccountField,r.value);const n=e.composedPath().find(e=>e instanceof HTMLSelectElement&&Boolean(e.dataset.transferField));n&&this.updateTransferDraftField(n.dataset.transferField,n.value)},this.handlePaste=e=>{const t=Ci(e);if(t)return void this.pasteRequiredInfoSsnInput(e,t);const i=oi(e);if(!i)return;const r=e,n="function"==typeof r.clipboardData?.getData?r.clipboardData.getData("text"):"",a=$t(n);if(!a)return;e.preventDefault();const o=this.getOtpInputs(),s=Number(i.dataset.otpIndex),c=this.writeOtpDigits(o,s,a);this.syncOtpValueFromInputs(o),this.focusOtpInput(o,Math.min(s+a.length,o.length-1),c)},this.handleFocusIn=e=>{const t=oi(e);t&&t.value&&requestAnimationFrame(()=>{this.renderRoot.contains(t)&&t.select()})},this.handleFocusLost=e=>{const t=e.composedPath().find(e=>e instanceof HTMLInputElement&&Me(e.dataset.cardField));if(t)return void this.encryptCardField(t.dataset.cardField,t.value);const i=e.composedPath().find(e=>e instanceof HTMLInputElement&&ot(e.dataset.bankAccountField));i&&this.encryptBankAccountField(i.dataset.bankAccountField,i.value)}}willUpdate(e){if(e.has("interactionResponse")&&this.interactionResponse){const t=e.get("interactionResponse");t?.interactionId!==this.interactionResponse.interactionId&&(this.clearDeletePaymentSourceConfirmation(),this.paymentSourceView=void 0,this.paymentSourceEditMode=!1,this.interactionRefresh.reset({requestUpdate:!1}),this.nativeBalance.reset({requestUpdate:!1}),this.billingAddresses=[],this.resetTransferFlow(),this.resetSavedSourceVerification(),this.resetRequiredInfo()),this.interactionResponse.paymentSources?.length||this.interactionResponse.selectedSource||(this.paymentSourceEditMode=!1),this.syncBillingAddressesFromInteractionResponse(this.interactionResponse),this.selectedPaymentSourceId=ar(this.interactionResponse,this.selectedPaymentSourceId)}}updated(e){e.has("designConfig")&&this.syncDesignConfigStyles(),e.has("interactionResponse")&&this.deleteConfirmationPaymentSourceId&&!this.findPaymentSourceById(this.deleteConfirmationPaymentSourceId)&&this.clearDeletePaymentSourceConfirmation(),e.has("interactionResponse")&&this.refreshPaymentSourcesFromInteraction()}render(){return F`
      <div
        @click=${this.handleClick}
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
        @change=${this.handleChange}
        @paste=${this.handlePaste}
        @focusin=${this.handleFocusIn}
        @focusout=${this.handleFocusLost}
        @blur=${this.handleFocusLost}
      >
        ${this.renderCurrentScreen()}
      </div>
    `}disconnectedCallback(){super.disconnectedCallback(),this.clearDeletePaymentSourceConfirmation(),this.removePayByBankProviderContainer(),Yr()}emitSdkEvent(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t}))}renderWidgetShell({busy:e=!1,overlay:t,...i}){const r=Cr(this.minimumVerificationOverlayAction);return ni({...i,busy:e||Boolean(r),overlay:t??r})}showMinimumVerificationOverlay(e){const t=this.minimumVerificationOverlayToken+=1;this.minimumVerificationOverlayAction=e,window.setTimeout(()=>{this.minimumVerificationOverlayToken===t&&(this.minimumVerificationOverlayAction=void 0)},2e3)}renderCurrentScreen(){if(!this.interactionResponse)return this.renderMissingInteractionResponseScreen();if("provider"===this.bankFlowScreen)return this.renderBankProviderScreen();if("outcome"===this.bankFlowScreen)return this.renderBankOutcomeScreen();if("manual"===this.bankFlowScreen)return this.renderManualBankAccountScreen();if("form"===this.cardFlowScreen)return this.renderAddCardScreen();if("error"===this.cardFlowScreen)return this.renderCardErrorScreen();if(this.requiredInfoSource)return this.renderRequiredInfoScreen();if(this.savedSourceVerificationSource)return this.renderSavedSourceVerificationOutcomeScreen();const e=this.interactionResponse?.status;return"OTP_VALIDATION_PENDING"===e||"OTP_VALIDATION_FAILED"===e?this.renderOtpScreen(e):this.shouldRenderTransferScreen()?this.renderTransferScreen():this.renderPaymentSourceScreen()}renderMissingInteractionResponseScreen(){return this.renderWidgetShell({title:"Configuration required",showClose:!1,showDivider:!1,content:F`
        <div class="payment-flow">
          ${Yt({variant:"danger",message:"CommerceHub Connect requires an interaction response before it can load payment methods."})}
        </div>
      `})}renderOtpScreen(e){const t=Ri(this.designConfig),i="verify-otp"===this.pendingAction,r="resend-otp"===this.pendingAction,n=qi(this.interactionResponse);let a;return i?a=Sr({title:"Verifying code",helper:"Verifying your code, please wait."}):r&&(a=Sr({title:"Sending code",helper:"Sending a new code, please wait."})),this.renderWidgetShell({title:t.title,subtitle:t.subtitle??ai(n),showClose:!1,showDivider:!1,busy:i||r,overlay:a,content:si({status:e,value:this.otpValue,length:6,failedMessage:this.otpErrorMessage,copy:t,submitting:i,resending:r})})}renderPaymentSourceScreen(){const e=Bi(this.designConfig),t=_i(this.interactionResponse,{nativeBalances:this.nativeBalance.balances,nativeBalanceLoadingSourceIds:this.nativeBalance.loadingSourceIds}),i=Hi(this.interactionResponse),r=cr(this.interactionResponse,"ADD_ACCOUNT"),n=cr(this.interactionResponse,"SELECT"),a=i.bankAccount&&lr(this.interactionResponse),o="attach-payment-source"===this.pendingAction||"verify-payment-source"===this.pendingAction||"delete-payment-source"===this.pendingAction,s=this.paymentSourceEditMode&&t.length>0;return this.shouldRenderPaymentSourceRefreshSkeleton()?this.renderWidgetShell({title:e.title,showClose:!1,content:ci()}):this.shouldRenderPaymentSourceRefreshError()?this.renderPaymentSourceRefreshErrorScreen():t.length?this.shouldRenderSelectedPaymentSourceScreen()?this.renderSelectedPaymentSourceScreen():(this.queueNativeAccountBalanceRefresh(),this.renderWidgetShell({title:e.title,headerAction:ii({label:s?"Done":"Edit",action:"toggle-payment-source-edit-mode",disabled:o}),showClose:!1,busy:o,overlay:Er(this.pendingAction),content:di({methods:t,allowedTenderOptions:i,canAddPaymentSources:r,canSelectPaymentSources:n,editing:s,actionPending:o,selectedPaymentSourceId:this.selectedPaymentSourceId,deleteConfirmationPaymentSourceId:this.deleteConfirmationPaymentSourceId,copy:e,showTransferAction:a})})):this.renderNoSavedPaymentMethods()}renderPaymentSourceRefreshErrorScreen(){return this.renderWidgetShell({title:"Payment methods unavailable",showClose:!1,content:F`
        <div class="payment-flow">
          ${Yt({variant:"danger",message:this.interactionRefresh.errorMessage??"We couldn't load payment methods. Try again."})}
          <div class="primitive-footer">
            ${Ht({label:"Try again",variant:"primary",action:"retry-interaction-refresh"})}
          </div>
        </div>
      `})}renderSelectedPaymentSourceScreen(){const e=or(this.interactionResponse,this.selectedPaymentSourceId);return e?this.renderWidgetShell({title:"Payment method saved",headerAction:ii({label:"Change",action:"change-payment-source",disabled:"attach-payment-source"===this.pendingAction}),showClose:!1,showDivider:!1,busy:"attach-payment-source"===this.pendingAction,overlay:"attach-payment-source"===this.pendingAction?Sr({title:jr(e)?"Saving bank account":"Saving payment method",helper:"Saving your payment method, please wait."}):void 0,content:F`
        <div class="payment-flow">
          ${Zt(Wi(e,{selected:!0,nativeBalances:this.nativeBalance.balances,nativeBalanceLoadingSourceIds:this.nativeBalance.loadingSourceIds}))}
        </div>
      `}):(this.paymentSourceView="list",this.renderPaymentSourceScreen())}shouldRenderSelectedPaymentSourceScreen(){return"list"!==this.paymentSourceView&&("PAYMENT_SOURCE_ATTACHED"===this.interactionResponse?.status||"selected"===this.paymentSourceView)}shouldRenderPaymentSourceRefreshSkeleton(){return this.interactionRefresh.shouldRenderSkeleton(this.interactionResponse)}shouldRenderPaymentSourceRefreshError(){return this.interactionRefresh.shouldRenderError(this.interactionResponse)}renderSavedSourceVerificationOutcomeScreen(){const e=this.savedSourceVerificationSource,t=Ar(e,this.savedSourceVerificationFailed),i="declined"===t.kind||"pending"===t.kind;return this.renderWidgetShell({title:t.title,headerAction:i?ii({label:"Back",action:"done-payment-source-verification"}):void 0,showClose:!1,showDivider:!1,content:F`
        <div class="verification-outcome-flow">
          ${Yt({variant:t.variant,message:t.message})}
          ${e?Mr(e):""}
          ${i?"":F`
                <div class="primitive-footer">
                  ${Ht({label:"Back to payment methods",action:"done-payment-source-verification"})}
                </div>
              `}
        </div>
      `})}renderRequiredInfoScreen(){const e=this.requiredInfoSource;if(!e)return this.renderPaymentSourceScreen();const t=Ir(e),i=Dr(t),r="submit-required-info"===this.pendingAction,n=this.canSubmitRequiredInfo();return this.renderWidgetShell({title:"Complete account verification",headerAction:ii({label:"Back",action:"back-to-payment-methods",disabled:r}),showClose:!1,showDivider:!1,busy:r,overlay:r?Sr({title:"Verifying account",helper:"Reviewing your verification information, please wait."}):void 0,content:F`
        <div class="required-info-flow">
          ${Mr(e)}
          ${this.requiredInfoSubmitError?Yt({variant:"danger",message:this.requiredInfoSubmitError}):""}

          <div class="required-info-documents">
            <p class="required-info-section-title">
              Information needed to complete verification
            </p>
            <div class="primitive-stack">
              ${t.map((e,t)=>{const i=Nr(e,t),n=Tr(e)?this.requiredInfoValues[i]:this.requiredInfoFileNames[i];return Tr(e)?Or({doc:e,key:i,value:n??""}):F`
                  <div
                    class="required-info-document required-document-text-row"
                    data-required-info-doc-key=${i}
                    data-required-info-requirement=${Rr(e)}
                  >
                    <div class="required-info-document-heading">
                      <span class="required-info-document-name"
                        >${Lr(e)}</span
                      >
                      ${Br(e)}
                    </div>
                    ${(({label:e,requirements:t,actionLabel:i,fileName:r,action:n,error:a=!1,disabled:o=!1})=>F`
  <button
    class="upload-row ${a?"upload-row-error":""}"
    type="button"
    data-action=${Lt(n)}
    ?disabled=${o}
    aria-label=${`${i}. ${e}. ${r??"No file chosen"}`}
  >
    <span class="upload-row-action">${i}</span>
    <span class="upload-row-file-name">${r??"No file chosen"}</span>
    <span class="upload-row-label">${e}</span>
    <span class="upload-row-requirements">${t}</span>
  </button>
`)({label:"Required document",requirements:Lr(e),actionLabel:"Choose file",fileName:n,action:"open-required-info-file-picker",disabled:r})}
                  </div>
                `})}
            </div>
          </div>

          ${i?F`
                <input
                  class="required-info-file-input"
                  type="file"
                  data-required-info-file-input="true"
                  hidden
                />
              `:""}

          <div
            class="primitive-footer"
            data-required-info-doc-key=${i??""}
          >
            ${Ht({label:r?"Verifying...":"Verify",action:"submit-required-info",loading:r,disabled:r||!n})}
          </div>
        </div>
      `})}renderNoSavedPaymentMethods(){const e=Di(this.designConfig),t="delete-payment-source"===this.pendingAction,i=Hi(this.interactionResponse),r=cr(this.interactionResponse,"ADD_ACCOUNT"),n=i.bankAccount&&lr(this.interactionResponse);return this.renderWidgetShell({title:e.title,subtitle:e.subtitle,showClose:!1,showDivider:!1,content:li({allowedTenderOptions:i,canAddPaymentSources:r,deletePending:t,copy:e,showTransferAction:n})})}shouldRenderTransferScreen(){const e=this.interactionResponse;return(this.transferFlowActive||dr(e))&&sr(e?.status)}renderTransferScreen(){const e=er(this.interactionResponse),t="transfer"===this.pendingAction,i=this.transferFlowActive?ii({label:"Back",action:"back-to-payment-methods",disabled:t}):void 0;if(e.length<2)return this.renderWidgetShell({title:"Transfer funds",headerAction:i,showClose:!1,showDivider:!1,content:F`
          <div class="payment-flow">
            ${Gt({title:"Transfer unavailable",message:"At least two verified bank or native accounts are required to transfer funds."})}
          </div>
        `});const r=[{value:"",label:"Select account"},...e.map(e=>({value:Qi(e),label:Ki(e)}))],n=At(this.transferDraft),a=e.find(e=>Qi(e)===n.fromSourceId),o=e.find(e=>Qi(e)===n.toSourceId);return"confirm"===this.transferFlowScreen&&a&&o&&Nt(n,e)?this.renderTransferConfirmationScreen(a,o,n,t):this.renderWidgetShell({title:"Transfer funds",headerAction:i,showClose:!1,showDivider:!1,busy:t,overlay:t?Sr({title:"Initiating transfer",helper:"Submitting your transfer, please wait."}):void 0,content:F`
        <div class="payment-flow card-form-screen">
          ${this.transferSubmitError?Yt({variant:"danger",message:this.transferSubmitError}):""}
          ${this.transferSubmitSuccess?Yt({variant:"success",message:"Transfer initiated."}):""}
          ${ri([Kt({id:"transfer-from-source",name:"fromSourceId",label:"From",value:this.transferDraft.fromSourceId,options:r,span:"full",variant:"card-form",dataField:"fromSourceId",dataFieldScope:"transfer",error:this.transferDraftErrors.fromSourceId,disabled:t}),Kt({id:"transfer-to-source",name:"toSourceId",label:"To",value:this.transferDraft.toSourceId,options:r,span:"full",variant:"card-form",dataField:"toSourceId",dataFieldScope:"transfer",error:this.transferDraftErrors.toSourceId,disabled:t}),Wt({id:"transfer-amount",name:"amount",label:"Amount",value:this.transferDraft.amount,variant:"card-form",inputmode:"decimal",dataField:"amount",dataFieldScope:"transfer",error:this.transferDraftErrors.amount,disabled:t})])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ht({label:t?"Transferring":"Transfer",action:"transfer",loading:t,disabled:t||!Nt(this.transferDraft,e)})}
            </div>
          </div>
        </div>
      `})}renderTransferConfirmationScreen(e,t,i,r){return this.renderWidgetShell({title:"Confirm transfer",headerAction:ii({label:"Back",action:"edit-transfer",disabled:r}),showClose:!1,showDivider:!1,busy:r,overlay:r?Sr({title:"Initiating transfer",helper:"Submitting your transfer, please wait."}):void 0,content:F`
        <div class="payment-flow card-form-screen">
          ${this.transferSubmitError?Yt({variant:"danger",message:this.transferSubmitError}):""}
          ${n=[{label:"From",value:Ki(e)},{label:"To",value:Ki(t)},{label:"Amount",value:Tt(i)}],F`
  <div class="detail-list detail-list-compact">
    ${n.map(e=>F`
        <div class="detail-row">
          <span class="detail-label">${e.label}</span>
          <span class="detail-value">${e.value}</span>
        </div>
      `)}
  </div>
`}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ht({label:r?"Transferring":"Confirm transfer",action:"confirm-transfer",loading:r,disabled:r})}
            </div>
            <div class="card-form-primary">
              ${Ht({label:"Edit",variant:"secondary",action:"edit-transfer",disabled:r})}
            </div>
          </div>
        </div>
      `});var n}renderAddCardScreen(){const e="save-card"===this.pendingAction,t="encrypting"===this.cardEncryption.cardNumber.status||"encrypting"===this.cardEncryption.cvv.status,i=[...this.billingAddresses.map(e=>({value:e.id??"",label:Ei(e)})),{value:Ve,label:"Add new billing address"}],r=this.billingAddresses.find(e=>e.id===this.cardDraft.billingAddressValue),n=Boolean(r)&&!this.billingAddressSelectorExpanded,a=!n&&this.cardDraft.billingAddressValue===Ve,o=[];return r&&n?o.push(F`
        <div class="billing-address-summary field field-full">
          <div class="billing-address-summary-heading">
            <span class="billing-address-summary-label field-label"
              >Billing address</span
            >
            ${ii({label:"Change",action:"change-billing-address",disabled:e})}
          </div>
          <p class="billing-address-summary-value">
            ${Ei(r)}
          </p>
        </div>
      `):o.push(Kt({id:"billing-address",name:"billingAddress",label:"Billing address",value:this.cardDraft.billingAddressValue,options:i,span:"full",variant:"card-form",dataField:"billingAddressValue",error:this.cardDraftErrors.billingAddressValue,disabled:e})),a&&o.push(Kt({id:"billing-country",name:"country",label:"Country or region",value:this.cardDraft.country,options:ki,span:"full",variant:"card-form",dataField:"country",error:this.cardDraftErrors.country,disabled:e}),Wt({id:"billing-address-line-1",name:"addressLine1",label:"Address",value:this.cardDraft.addressLine1,placeholder:"Street address",span:"full",variant:"card-form",autocomplete:"address-line1",dataField:"addressLine1",error:this.cardDraftErrors.addressLine1,disabled:e}),Wt({id:"billing-address-line-2",name:"addressLine2",label:"Address line 2",value:this.cardDraft.addressLine2,placeholder:"Apartment, suite, unit",span:"full",variant:"card-form",autocomplete:"address-line2",dataField:"addressLine2",error:this.cardDraftErrors.addressLine2,disabled:e}),Wt({id:"billing-city",name:"city",label:"City",value:this.cardDraft.city,span:"full",variant:"card-form",autocomplete:"address-level2",dataField:"city",error:this.cardDraftErrors.city,disabled:e}),Kt({id:"billing-state",name:"state",label:"State",value:this.cardDraft.state,options:$i,span:"full",variant:"card-form",dataField:"state",error:this.cardDraftErrors.state,disabled:e}),Wt({id:"billing-zip",name:"zip",label:"ZIP code",value:this.cardDraft.zip,placeholder:"ZIP code",span:"full",variant:"card-form",autocomplete:"postal-code",inputmode:"numeric",dataField:"zip",error:this.cardDraftErrors.zip,disabled:e})),this.renderWidgetShell({title:"Add card",headerAction:ii({label:"Back",action:"back-to-payment-methods",disabled:e}),showClose:!1,showDivider:!1,busy:e,overlay:e?Sr({title:"Saving card",helper:"Securely saving your card, please wait."}):void 0,content:F`
        <div class="payment-flow card-form-screen">
          ${this.cardSubmitError?Yt({variant:"danger",message:this.cardSubmitError}):""}
          ${ri([Wt({id:"card-label",name:"name",label:"Card Name",value:this.cardDraft.name,placeholder:"Corporate card",span:"full",variant:"card-form",dataField:"name",error:this.cardDraftErrors.name,disabled:e}),Wt({id:"card-number",name:"cardNumber",label:"Card number",value:this.cardDraft.cardNumber,placeholder:"1234 1234 1234 1234",span:"full",variant:"card-form",autocomplete:"cc-number",inputmode:"numeric",dataField:"cardNumber",error:this.cardDraftErrors.cardNumber,disabled:e}),Wt({id:"expiration-date",name:"expirationDate",label:"Expiration",value:this.cardDraft.expirationDate,placeholder:"MM / YY",variant:"card-form",autocomplete:"cc-exp",inputmode:"numeric",dataField:"expirationDate",error:this.cardDraftErrors.expirationDate,disabled:e}),Wt({id:"card-cvv",name:"cvv",label:"CVC",value:this.cardDraft.cvv,placeholder:"3 or 4 digits",variant:"card-form",autocomplete:"cc-csc",inputmode:"numeric",dataField:"cvv",error:this.cardDraftErrors.cvv,disabled:e}),Wt({id:"name-on-card",name:"fullName",label:"Full name",value:this.cardDraft.fullName,placeholder:"Name on card",span:"full",variant:"card-form",autocomplete:"cc-name",dataField:"fullName",error:this.cardDraftErrors.fullName,disabled:e}),...o])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ht({label:e?"Saving payment method":"Save card",action:"save-card",loading:e,disabled:e||t||(s=this.cardDraft,c=this.cardEncryption,!(0===Object.keys(Ye(Ke(s))).length&&0===Object.keys(Qe(s,c)).length))})}
            </div>
          </div>
        </div>
      `});var s,c}renderCardErrorScreen(){return this.renderWidgetShell({title:"Credit card not saved",subtitle:"We could not save this card. Check the card details or use a different payment method.",showClose:!1,showDivider:!1,content:ti({variant:"danger",content:this.cardSubmitError?Yt({variant:"danger",message:this.cardSubmitError}):void 0,actions:F`
          ${Ht({label:"Edit card details",action:"edit-card-details"})}
          ${ii({label:"Use a different method",action:"use-different-method"})}
        `})})}renderBankProviderScreen(){return this.renderWidgetShell({title:"Connect your bank",headerAction:ii({label:"Back",action:"back-to-payment-methods",disabled:this.bankLinkLoading}),showClose:!1,showDivider:!1,busy:this.bankLinkLoading,overlay:this.bankLinkLoading?Sr({title:"Connecting to your bank",helper:"Securely opening your bank connection, please wait."}):void 0,content:F`
        <div class="bank-provider-flow">
          ${ei({containerId:yi,loading:this.bankLinkLoading,loadingLabel:"Connecting to your bank"})}
          <div class="bank-provider-manual-link">
            ${ii({label:"Connect another way",action:"add-ach-manually",disabled:this.bankLinkLoading})}
          </div>
        </div>
      `})}renderManualBankAccountScreen(){const e="save-ach-manual"===this.pendingAction,t="encrypting"===this.bankAccountEncryption.routingNumber.status||"encrypting"===this.bankAccountEncryption.accountNumber.status||"encrypting"===this.bankAccountEncryption.accountNumberReEntered.status;return this.renderWidgetShell({title:"Enter bank details",headerAction:ii({label:"Back",action:"back-to-bank-provider",disabled:e}),showClose:!1,showDivider:!1,busy:e,overlay:e?Sr({title:"Saving bank account",helper:"Securely saving your bank account, please wait."}):void 0,content:F`
        <div class="payment-flow card-form-screen">
          ${this.bankAccountSubmitError?Yt({variant:"danger",message:this.bankAccountSubmitError}):""}
          ${ri([Wt({id:"ach-account-nickname",name:"name",label:"Account Nickname",value:this.bankAccountDraft.name,span:"full",variant:"card-form",autocomplete:"off",dataField:"name",dataFieldScope:"bankAccount",disabled:e}),Wt({id:"ach-routing-number",name:"routingNumber",label:"Routing number",value:this.bankAccountDraft.routingNumber,span:"full",variant:"card-form",autocomplete:"off",inputmode:"numeric",dataField:"routingNumber",dataFieldScope:"bankAccount",error:this.bankAccountDraftErrors.routingNumber,disabled:e}),Wt({id:"ach-account-number",name:"accountNumber",label:"Account number",value:this.bankAccountDraft.accountNumber,type:lt("accountNumber",this.bankAccountDraft,this.bankAccountEncryption),span:"full",variant:"card-form",autocomplete:"off",inputmode:"numeric",dataField:"accountNumber",dataFieldScope:"bankAccount",error:this.bankAccountDraftErrors.accountNumber,disabled:e}),Wt({id:"ach-account-number-confirm",name:"accountNumberReEntered",label:"Confirm account number",value:this.bankAccountDraft.accountNumberReEntered,type:lt("accountNumberReEntered",this.bankAccountDraft,this.bankAccountEncryption),span:"full",variant:"card-form",autocomplete:"off",inputmode:"numeric",dataField:"accountNumberReEntered",dataFieldScope:"bankAccount",error:this.bankAccountDraftErrors.accountNumberReEntered,disabled:e})])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${Ht({label:e?"Saving bank account":"Save bank account",action:"save-ach-manual",loading:e,disabled:e||t||!vt(this.bankAccountDraft,this.bankAccountEncryption)})}
            </div>
          </div>
        </div>
      `})}renderBankOutcomeScreen(){const e=zr(this.bankOutcomeSource),t="declined"===e.kind||"pending"===e.kind;return this.renderWidgetShell({title:e.title,headerAction:t?ii({label:"Done",action:"done-bank-outcome"}):void 0,showClose:!1,showDivider:!1,content:F`
        <div class="verification-outcome-flow">
          ${Yt({variant:e.variant,message:e.message})}
          ${this.bankOutcomeSource?Mr(this.bankOutcomeSource):""}
          ${t?"":F`
                <div class="primitive-footer">
                  ${"verified"===e.kind?Ht({label:"Continue",action:"continue-bank-outcome"}):"pending"===e.kind?Ht({label:"Done",action:"done-bank-outcome"}):F`
                        ${Ht({label:this.bankLinkLoading?"Retrying":"Try again",action:"retry-bank-provider",loading:this.bankLinkLoading,disabled:this.bankLinkLoading})}
                        ${ii({label:"Use a different account",action:"use-different-bank-account",disabled:this.bankLinkLoading})}
                      `}
                </div>
              `}
        </div>
      `})}getOtpInputs(){return[...this.renderRoot.querySelectorAll(".otp-input")]}getRequiredInfoSsnInputs(e){return[...this.renderRoot.querySelectorAll(".required-info-ssn-input")].filter(t=>t.dataset.requiredInfoDocKey===e)}storeRequiredInfoSsnInput(e){const t=e.dataset.requiredInfoDocKey;if(!t)return;const i=this.getRequiredInfoSsnInputs(t),r=i.indexOf(e),n=Ct(Number(e.dataset.requiredInfoSsnSegment)),a=St(e.value);if(!(r<0)){if(a.length>n){const e=this.writeRequiredInfoSsnDigits(i,r,a);return this.syncRequiredInfoSsnValue(t,i),void this.focusRequiredInfoSsnInput(i,e)}e.value=a.slice(0,n),this.syncRequiredInfoSsnValue(t,i),e.value.length>=n&&this.focusRequiredInfoSsnInput(i,r+1)}}pasteRequiredInfoSsnInput(e,t){const i=t.dataset.requiredInfoDocKey;if(!i)return;const r=e,n="function"==typeof r.clipboardData?.getData?r.clipboardData.getData("text"):"",a=St(n);if(!a)return;e.preventDefault();const o=this.getRequiredInfoSsnInputs(i),s=o.indexOf(t);if(s<0)return;const c=this.writeRequiredInfoSsnDigits(o,s,a);this.syncRequiredInfoSsnValue(i,o),this.focusRequiredInfoSsnInput(o,c)}writeRequiredInfoSsnDigits(e,t,i){let r=0,n=t;return e.forEach((e,a)=>{if(a<t)return;const o=Ct(Number(e.dataset.requiredInfoSsnSegment)),s=i.slice(r,r+o);e.value=s,s&&(n=a),r+=o}),n}syncRequiredInfoSsnValue(e,t){this.storeRequiredInfoValue(e,St(t.map(e=>e.value).join("")))}focusRequiredInfoSsnInput(e,t){e[Math.min(t,e.length-1)]?.focus()}syncOtpValueFromInputs(e=this.getOtpInputs()){this.otpValue=((e,t=6)=>$t(e.join("")).slice(0,t))(e.map(e=>e.value)),this.otpErrorMessage=void 0}writeOtpDigits(e,t,i){const r=(({values:e,startIndex:t,value:i})=>{const r=[...e],n=$t(i);let a=t;return n.slice(0,Math.max(r.length-t,0)).split("").forEach((e,i)=>{const n=t+i;n>=r.length||(r[n]=e,a=n)}),{values:r,lastWrittenIndex:a}})({values:e.map(e=>e.value),startIndex:t,value:i});return r.values.forEach((t,i)=>{e[i].value=t}),r.lastWrittenIndex}focusOtpInput(e,t,i=t){const r=e[t]??e[Math.max(0,Math.min(i,e.length-1))];r&&r.focus()}async showAddCardScreen(){this.clearDeletePaymentSourceConfirmation(),this.resetBankFlow(),this.cardFlowScreen="form",this.cardSubmitError=void 0,this.billingAddressSelectorExpanded=this.cardDraft.billingAddressValue===Ve||!this.billingAddresses.length;const e=this.interactionResponse?.interactionId,t=Boolean(this.interactionResponse?.selectedSource||this.interactionResponse?.paymentSources?.length);if(e&&t&&!this.billingAddresses.length&&void 0===this.interactionResponse?.billerAddress)try{await this.fetchInteraction(e)}catch(e){}}showManualBankAccountScreen(){this.clearDeletePaymentSourceConfirmation(),this.resetBankFlow(),this.bankFlowScreen="manual",this.bankAccountDraft={name:"",routingNumber:"",accountNumber:"",accountNumberReEntered:""},this.bankAccountDraftErrors={},this.bankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},accountNumberReEntered:{status:"idle",normalizedValue:""}},this.bankAccountSubmitError=void 0}updateTransferDraftField(e,t){const i=At({...this.transferDraft,[e]:t});this.transferDraft=i,this.transferDraftErrors=It(i,er(this.interactionResponse)),this.transferFlowScreen="form",this.transferSubmitError=void 0,this.transferSubmitSuccess=!1}updateBankAccountDraftField(e,t){const i=gt({draft:this.bankAccountDraft,errors:this.bankAccountDraftErrors,encryption:this.bankAccountEncryption,field:e,value:t});this.bankAccountDraft=i.draft,this.bankAccountEncryption=i.encryption,this.bankAccountDraftErrors=i.errors,this.bankAccountSubmitError=void 0}updateCardDraftField(e,t){const i=((e,t)=>"cardNumber"===e?Ue(t):"expirationDate"===e?We(t):"cvv"===e?Fe(t).slice(0,4):t)(e,t);this.cardDraft={...this.cardDraft,[e]:i},"billingAddressValue"===e&&(this.billingAddressSelectorExpanded=i===Ve),this.cardSubmitError=void 0,Me(e)&&(this.cardEncryption={...this.cardEncryption,[e]:Je(this.cardEncryption[e],je(e,i))})}async encryptCardField(e,t){this.updateCardDraftField(e,t);const i=je(e,t),r=((e,t)=>"cardNumber"===e?et(t)?void 0:"Enter a valid card number.":tt(t)?void 0:"Enter a valid CVC.")(e,t);if(!i)return this.cardDraftErrors=Ze(this.cardDraftErrors,e),void(this.cardEncryption={...this.cardEncryption,[e]:{status:"idle",normalizedValue:""}});if(r)return this.cardDraftErrors={...Ze(this.cardDraftErrors,e),[e]:r},void(this.cardEncryption={...this.cardEncryption,[e]:Je(this.cardEncryption[e],i)});const n=this.cardEncryption[e];if("encrypting"!==n.status&&"encrypted"!==n.status||n.normalizedValue!==i){this.cardDraftErrors=Ze(this.cardDraftErrors,e),this.cardEncryption={...this.cardEncryption,[e]:{status:"encrypting",normalizedValue:i}};try{const t=await this.maskSensitiveCardValue(e,i);if(je(e,this.cardDraft[e])!==i)return;this.cardDraftErrors=Ze(this.cardDraftErrors,e),this.cardEncryption={...this.cardEncryption,[e]:{status:"encrypted",normalizedValue:i,encryptedValue:t}}}catch(t){if(je(e,this.cardDraft[e])!==i)return;this.cardDraftErrors={...Ze(this.cardDraftErrors,e),[e]:Ge(e)},this.cardEncryption={...this.cardEncryption,[e]:{status:"failed",normalizedValue:i}}}}}async encryptBankAccountField(e,t){const i=this.bankAccountEncryption[e];if(ct(t,i))return this.bankAccountDraft={...this.bankAccountDraft,[e]:t},void(this.bankAccountSubmitError=void 0);this.updateBankAccountDraftField(e,t);const r=st(t);if(!r){const t={...this.bankAccountEncryption,[e]:{status:"idle",normalizedValue:""}};return this.bankAccountEncryption=t,void(this.bankAccountDraftErrors=ft(ht(this.bankAccountDraft,t)))}if("encrypting"!==i.status&&"encrypted"!==i.status||i.normalizedValue!==r){this.bankAccountDraftErrors=((e,t)=>{const i={...e};return delete i[t],i})(this.bankAccountDraftErrors,e),this.bankAccountEncryption={...this.bankAccountEncryption,[e]:{status:"encrypting",normalizedValue:r}};try{const t=await this.maskSensitiveBankAccountValue(e,r);if(st(this.bankAccountDraft[e])!==r)return;const i={...this.bankAccountDraft,[e]:dt(r)},n={...this.bankAccountEncryption,[e]:{status:"encrypted",normalizedValue:r,encryptedValue:t}};this.bankAccountDraft=i,this.bankAccountEncryption=n,this.bankAccountDraftErrors=ft(ht(i,n))}catch(t){if(st(this.bankAccountDraft[e])!==r)return;const i={...this.bankAccountEncryption,[e]:{status:"failed",normalizedValue:r}};this.bankAccountEncryption=i,this.bankAccountDraftErrors={...ft(ht(this.bankAccountDraft,i)),[e]:bt(e)}}}}async maskSensitiveCardValue(e,t){const i=this.requireInteractionId();if(!i)throw new Error("An interaction id is required to encrypt card details.");const r="cardNumber"===e?"card":"cvv",n=await this.requestCommerceHubJson(`/interaction/source/mask/${r}`,i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:t}),credentials:"include"}),a=n.value?.trim();if(!a)throw new Error("The card encryption response did not include a value.");return a}async maskSensitiveBankAccountValue(e,t){const i=this.requireInteractionId();if(!i)throw new Error("An interaction id is required to encrypt ACH details.");const r="routingNumber"===e?"rt":"bn",n=await this.requestCommerceHubJson(`/interaction/source/mask/${r}`,i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:t}),credentials:"include"}),a=n.value?.trim();if(!a)throw new Error("The ACH encryption response did not include a value.");return a}async saveCard(){if("save-card"===this.pendingAction)return;const e=this.requireInteractionId();if(!e)return;const t=Ke(this.cardDraft),i={...Ye(t),...Qe(t,this.cardEncryption)};if(Object.keys(i).length>0)return this.cardDraft=t,this.cardDraftErrors=i,void(this.cardSubmitError=void 0);this.pendingAction="save-card",this.cardDraft=t,this.cardDraftErrors={},this.cardSubmitError=void 0;try{const i=Xe("cardNumber",t.cardNumber,this.cardEncryption),r=Xe("cvv",t.cvv,this.cardEncryption),n=it(t.expirationDate);if(!n)return void(this.cardDraftErrors={expirationDate:"Enter a valid expiration date."});const a=await this.resolveBillingAddressId(e,t),o={id:"",tenderType:"CARD",name:t.name,billingAddressId:a,card:{nameOnCard:t.fullName,cardNumber:i,cvv:r,cardNumberEncrypted:i,cvvEncrypted:r,expirationMonth:n.month,expirationYear:n.year,network:rt(t.cardNumber)}},s=await this.requestCommerceHubJson("/interaction/source/card",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o),credentials:"include"}),c=this.sourceWithVerificationResponse(zi(o,t.cardNumber),s),d=Ni(s,"The card creation response did not include a source id."),l=this.interactionResponseWithAddedSource(e,c);if(this.cardFlowScreen=void 0,this.cardDraft=Le(),this.cardDraftErrors={},this.cardEncryption={cardNumber:{status:"idle",normalizedValue:""},cvv:{status:"idle",normalizedValue:""}},this.cardSubmitError=void 0,this.setInteractionResponseFromSdk(l),this.emitSdkEvent(mi,c),"VERIFIED"===c.verificationInfo?.status)return void await this.attachPaymentSource(d);this.showAddedPaymentSourceStatus(c)}catch(e){this.cardSubmitError=pr(e),this.cardFlowScreen="error"}finally{this.pendingAction=void 0}}async saveManualBankAccount(){if("save-ach-manual"===this.pendingAction)return;const e=this.requireInteractionId();if(!e)return;const t=ht(this.bankAccountDraft,this.bankAccountEncryption),i=ft(t);if(Object.keys(i).length>0)return this.bankAccountDraft=mt(this.bankAccountDraft,this.bankAccountEncryption),this.bankAccountDraftErrors=i,void(this.bankAccountSubmitError=void 0);this.pendingAction="save-ach-manual",this.bankAccountDraft=mt(this.bankAccountDraft,this.bankAccountEncryption),this.bankAccountDraftErrors={},this.bankAccountSubmitError=void 0;try{await this.encryptChangedBankAccountFields();const t=ht(this.bankAccountDraft,this.bankAccountEncryption),i=ft(t);if(Object.keys(i).length>0)return this.bankAccountDraftErrors=i,void(this.bankAccountSubmitError=void 0);const o=yt("routingNumber",this.bankAccountDraft,this.bankAccountEncryption),s=yt("accountNumber",this.bankAccountDraft,this.bankAccountEncryption),c=yt("accountNumberReEntered",this.bankAccountDraft,this.bankAccountEncryption),d=(r="accountNumber",n=this.bankAccountEncryption,a=t,kt(n[r].normalizedValue||a[r])),l={id:"",tenderType:"BANK_ACCOUNT",name:wt(this.bankAccountDraft.name,d),bankAccount:{routingNumber:o,accountNumber:s,accountNumberReEntered:c,routingNumberEncrypted:o,accountNumberEncrypted:s}},h=await this.requestCommerceHubJson("/interaction/source/ach",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l),credentials:"include"}),u=this.sourceWithVerificationResponse(Ai(l,d),h),m=Ni(h,"The bank account creation response did not include a source id."),p=this.interactionResponseWithAddedSource(e,u);if(this.bankFlowScreen=void 0,this.bankAccountDraft={name:"",routingNumber:"",accountNumber:"",accountNumberReEntered:""},this.bankAccountDraftErrors={},this.bankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},accountNumberReEntered:{status:"idle",normalizedValue:""}},this.bankAccountSubmitError=void 0,this.setInteractionResponseFromSdk(p),this.emitSdkEvent(mi,u),"VERIFIED"===u.verificationInfo?.status)return void await this.attachPaymentSource(m);this.showAddedPaymentSourceStatus(u)}catch(e){this.bankAccountSubmitError=pr(e)}finally{this.pendingAction=void 0}var r,n,a}reviewTransfer(){if("transfer"===this.pendingAction)return;const e=er(this.interactionResponse),t=At(this.transferDraft),i=It(t,e);if(Object.keys(i).length>0)return this.transferDraft=t,this.transferDraftErrors=i,this.transferSubmitError=void 0,void(this.transferSubmitSuccess=!1);this.transferDraft=t,this.transferDraftErrors={},this.transferSubmitError=void 0,this.transferSubmitSuccess=!1,this.transferFlowScreen="confirm"}async submitTransfer(){if("transfer"===this.pendingAction)return;const e=this.requireInteractionId();if(!e)return;const t=er(this.interactionResponse),i=At(this.transferDraft),r=It(i,t);if(Object.keys(r).length>0)return this.transferDraft=i,this.transferDraftErrors=r,this.transferFlowScreen="form",this.transferSubmitError=void 0,void(this.transferSubmitSuccess=!1);this.pendingAction="transfer",this.transferDraft=i,this.transferDraftErrors={},this.transferSubmitError=void 0,this.transferSubmitSuccess=!1;try{const t=await this.requestCommerceHubJson("/interaction/source/native/transfer",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fromSourceId:i.fromSourceId,toSourceId:i.toSourceId,amount:Number(i.amount),asset:{type:"CURRENCY",id:"USD"}}),credentials:"include"});this.transferFlowScreen="form",this.transferSubmitSuccess=!0,this.emitSdkEvent(bi,t)}catch(e){this.transferSubmitError=pr(e)}finally{this.pendingAction=void 0}}async encryptChangedBankAccountFields(){for(const e of["routingNumber","accountNumber","accountNumberReEntered"]){const t=this.bankAccountDraft[e],i=this.bankAccountEncryption[e];if(ct(t,i))continue;const r=st(t);if(!r)continue;"encrypted"===i.status&&i.normalizedValue===r&&Boolean(i.encryptedValue)||await this.encryptBankAccountField(e,t)}}async resolveBillingAddressId(e,t){if(t.billingAddressValue!==Ve)return t.billingAddressValue;const i=(e=>({id:at(),recipientNameOrAddress:e.fullName,country:e.country,street:e.addressLine1,houseNumberOrName:e.addressLine2||void 0,city:e.city,stateOrProvince:e.state,postalCode:e.zip}))(t),r=await this.requestCommerceHubJson("/interaction/billing-address",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),credentials:"include"}),n=r.value?.trim();if(!n)throw new Error("The billing address response did not include an id.");return n}async verifyOtp(){if("verify-otp"===this.pendingAction)return;if(this.otpValue.length<6)return;const e=this.requireInteractionId();if(e){this.pendingAction="verify-otp";try{const t=await this.createSdkClient(e).POST("/interaction/otp/validate",{body:{otp:this.otpValue,channel:"EMAIL"}}),i=mr(t);this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk(i)}catch(e){this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk({...this.interactionResponse,status:"OTP_VALIDATION_FAILED"})}finally{this.pendingAction=void 0}}}async resendOtp(){if("resend-otp"===this.pendingAction)return;const e=this.requireInteractionId();if(e){this.pendingAction="resend-otp";try{const t=await this.createSdkClient(e).POST("/interaction/otp/send/email"),i=mr(t);this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk(i)}catch(e){}finally{this.pendingAction=void 0}}}async attachPaymentSource(e){if("attach-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),i=this.findPaymentSourceById(e);if(t&&i&&"VERIFIED"===i.verificationInfo?.status){this.selectedPaymentSourceId=e,this.paymentSourceView="selected",this.pendingAction="attach-payment-source";try{const r=await this.requestCommerceHubJson(`/interaction/source/${encodeURIComponent(e)}/attach`,t,{method:"POST",credentials:"include"}),n=hr(this.interactionResponse??{interactionId:t},r,e),a=or(n,e)??n.paymentSources?.find(t=>t.id===e)??i;this.selectedPaymentSourceId=a.id,this.setInteractionResponseFromSdk(n),this.paymentSourceView="selected",this.emitSdkEvent(ui,a)}catch(e){}finally{this.pendingAction=void 0}}}async verifySavedPaymentSource(e){if("verify-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),i=this.findPaymentSourceById(e);if(t&&i){if(Pr(i))return this.savedSourceVerificationSource=void 0,this.savedSourceVerificationFailed=!1,this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",void this.showRequiredInfoSource(i);if("NOT_VERIFIED"===i.verificationInfo?.status){this.savedSourceVerificationSource=void 0,this.savedSourceVerificationFailed=!1,this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",this.pendingAction="verify-payment-source";try{const r=await this.verifyPaymentSourceStep1(t,{...i,id:e}),n=kr({...this.interactionResponse??{interactionId:t},selectedSource:this.interactionResponse?.selectedSource,status:wi},r);if(this.setInteractionResponseFromSdk(n),this.emitSdkEvent(pi,r),Pr(r))return void this.showRequiredInfoSource(r);if("VERIFIED"===r.verificationInfo?.status){const t=r.id?.trim()||e;return this.pendingAction=void 0,void await this.attachPaymentSource(t)}this.savedSourceVerificationSource=r,this.savedSourceVerificationFailed=!1}catch(e){this.savedSourceVerificationSource=i,this.savedSourceVerificationFailed=!0}finally{"verify-payment-source"===this.pendingAction&&(this.pendingAction=void 0)}}}}async deletePaymentSource(e){if("delete-payment-source"===this.pendingAction)return;const t=this.requireInteractionId(),i=this.findPaymentSourceById(e);if(t&&i)if(this.deleteConfirmationPaymentSourceId===e){this.clearDeletePaymentSourceConfirmation(),this.pendingAction="delete-payment-source";try{await this.requestCommerceHubJson(`/interaction/source/${encodeURIComponent(e)}`,t,{method:"DELETE",credentials:"include"});const i=ur(this.interactionResponse??{interactionId:t},e);i.paymentSources?.length||(this.paymentSourceEditMode=!1),this.setInteractionResponseFromSdk(i),this.emitSdkEvent(fi,e)}catch(e){}finally{this.pendingAction=void 0}}else this.armDeletePaymentSourceConfirmation(e)}armDeletePaymentSourceConfirmation(e){this.clearDeletePaymentSourceConfirmation(),this.deleteConfirmationPaymentSourceId=e,this.deleteConfirmationTimeoutId=window.setTimeout(()=>{this.deleteConfirmationPaymentSourceId===e&&this.clearDeletePaymentSourceConfirmation()},5e3)}clearDeletePaymentSourceConfirmation(){void 0!==this.deleteConfirmationTimeoutId&&(window.clearTimeout(this.deleteConfirmationTimeoutId),this.deleteConfirmationTimeoutId=void 0),this.deleteConfirmationPaymentSourceId=void 0}findPaymentSourceById(e){return(this.interactionResponse?.paymentSources??[]).find(t=>t.id===e)??(this.interactionResponse?.selectedSource?.id===e?this.interactionResponse.selectedSource:void 0)}resetSavedSourceVerification(){this.savedSourceVerificationSource=void 0,this.savedSourceVerificationFailed=!1}showPaymentSourceList({refresh:e=!1}={}){this.clearDeletePaymentSourceConfirmation(),this.paymentSourceEditMode=!1,this.paymentSourceView="list",this.resetTransferFlow(),e&&this.refreshPaymentSourcesForList()}async refreshPaymentSourcesForList(){const e=this.interactionResponse?.interactionId;if(e)try{await this.fetchInteraction(e)}catch(e){}}interactionResponseWithAddedSource(e,t){const i=t.id?.trim(),r=Boolean(i)&&xr(t),n={...this.interactionResponse??{interactionId:e},status:wi};return r?wr(n,t):kr({...n,selectedSource:this.interactionResponse?.selectedSource},t)}showAddedPaymentSourceStatus(e){const t=e.id?.trim();return this.resetSavedSourceVerification(),this.resetRequiredInfo(),Pr(e)?(this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",void this.showRequiredInfoSource(e)):"VERIFIED"===e.verificationInfo?.status?(this.selectedPaymentSourceId=t,void(this.paymentSourceView="selected")):(this.selectedPaymentSourceId=void 0,this.paymentSourceView="list",jr(e)?(this.bankOutcomeSource=e,void(this.bankFlowScreen="outcome")):(this.savedSourceVerificationSource=e,void(this.savedSourceVerificationFailed=!1)))}showRequiredInfoSource(e){this.requiredInfoSource=e,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoFiles={},this.requiredInfoSubmitError=void 0,this.pendingRequiredInfoDocKey=void 0}resetRequiredInfo(){this.requiredInfoSource=void 0,this.requiredInfoValues={},this.requiredInfoFileNames={},this.requiredInfoFiles={},this.requiredInfoSubmitError=void 0,this.pendingRequiredInfoDocKey=void 0}firstRequiredInfoDocKey(){return Dr(Ir(this.requiredInfoSource))??Nr(Ir(this.requiredInfoSource)[0],0)}storeRequiredInfoValue(e,t){this.requiredInfoValues=((e,t,i)=>({...e,[t]:i}))(this.requiredInfoValues,e,t),this.requiredInfoSubmitError=void 0}storeRequiredInfoSelectedFile(e){if(!this.requiredInfoSource||!e)return void(this.pendingRequiredInfoDocKey=void 0);const t=this.pendingRequiredInfoDocKey??this.firstRequiredInfoDocKey(),i=(({files:e,fileNames:t,key:i,file:r})=>({files:{...e,[i]:r},fileNames:{...t,[i]:r.name}}))({files:this.requiredInfoFiles,fileNames:this.requiredInfoFileNames,key:t,file:e});this.requiredInfoFiles=i.files,this.requiredInfoFileNames=i.fileNames,this.requiredInfoSubmitError=void 0,this.pendingRequiredInfoDocKey=void 0}canSubmitRequiredInfo(){const e=this.requiredInfoSource;return!!e?.id?.trim()&&Ir(e).some((e,t)=>{const i=Nr(e,t);return Tr(e)?Et(this.requiredInfoValues,i):zt(this.requiredInfoFiles,i)})}async submitRequiredInfo(){if("submit-required-info"===this.pendingAction)return;const e=this.requireInteractionId(),t=this.requiredInfoSource,i=t?.id?.trim();if(e&&t&&i)if(this.canSubmitRequiredInfo()){this.pendingAction="submit-required-info",this.requiredInfoSubmitError=void 0;try{const r=Ir(t),n=this.providedRequiredInfoEntries(r,!0),a=this.providedRequiredInfoEntries(r,!1);let o=t;n.length>0?(await this.uploadRequiredInfoEntries(e,i,n),o=this.sourceWithVerificationResponse(o,await this.verifyRequiredInfoStep2(e,i)),this.emitSdkEvent(pi,o),Pr(o)&&a.length>0&&(await this.uploadRequiredInfoEntries(e,i,a),o=this.sourceWithVerificationResponse(o,await this.verifyRequiredInfoStep2(e,i)),this.emitSdkEvent(pi,o))):(await this.uploadRequiredInfoEntries(e,i,a),o=this.sourceWithVerificationResponse(o,await this.verifyRequiredInfoStep2(e,i)),this.emitSdkEvent(pi,o));const s=kr({...this.interactionResponse??{interactionId:e},selectedSource:this.interactionResponse?.selectedSource,status:wi},o);if(this.setInteractionResponseFromSdk(s),"VERIFIED"===o.verificationInfo?.status){const e=o.id?.trim()||i;return this.resetRequiredInfo(),this.pendingAction=void 0,void await this.attachPaymentSource(e)}if(Pr(o))return this.requiredInfoSource=o,this.requiredInfoValues={},this.requiredInfoFileNames={},void(this.requiredInfoFiles={});this.resetRequiredInfo(),this.savedSourceVerificationSource=o,this.savedSourceVerificationFailed=!1,this.selectedPaymentSourceId=o.id,this.paymentSourceView="list"}catch(e){this.requiredInfoSubmitError=pr(e)||"We could not submit the required information. Please try again."}finally{"submit-required-info"===this.pendingAction&&(this.pendingAction=void 0)}}else this.requiredInfoSubmitError="Add required or optional information before verifying."}providedRequiredInfoEntries(e,t){return e.map((e,t)=>({doc:e,index:t})).filter(({doc:e,index:i})=>(t?!0===e.mandatory:!0!==e.mandatory)&&this.hasRequiredInfoValue(e,i))}hasRequiredInfoValue(e,t){const i=Nr(e,t);return Tr(e)?Et(this.requiredInfoValues,i):zt(this.requiredInfoFiles,i)}async uploadRequiredInfoEntries(e,t,i){for(const{doc:r,index:n}of i){const i=r.docType;if(!i)continue;const a=Nr(r,n);if(Tr(r)){const r=this.requiredInfoValues[a]?.trim();r&&await this.uploadRequiredInfoField(e,t,i,r);continue}const o=this.requiredInfoFiles[a];o&&await this.uploadRequiredInfoDocument(e,t,i,o)}}async verifyRequiredInfoStep2(e,t){return this.showMinimumVerificationOverlay("submit-required-info"),this.requestCommerceHubJson("/interaction/verify/step2",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:t}),credentials:"include"})}sourceWithVerificationResponse(e,t){const{sourceId:i,...r}=t,n=i?.trim();return{...e,id:n||e.id,verificationInfo:{...e.verificationInfo,...r}}}async uploadRequiredInfoField(e,t,i,r){await this.requestCommerceHubJson("/interaction/verify/uploadField",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({docType:i,value:t,docValue:r}),credentials:"include"})}async uploadRequiredInfoDocument(e,t,i,r){const n=new FormData;n.set("file",r),await this.requestCommerceHubJson(`/interaction/doc/upload/${encodeURIComponent(t)}/${encodeURIComponent(i)}`,e,{method:"POST",body:n,credentials:"include"})}async startPayByBankFlow(){if(this.bankLinkLoading)return;const e=this.requireInteractionId();if(e){this.bankFlowScreen="provider",this.bankOutcomeSource=void 0,this.bankLinkLoading=!0,this.ensurePayByBankProviderContainer(yi),await this.updateComplete;try{await this.launchPayByBankProvider(e,yi)}catch(e){console.error("CommerceHub Connect Pay by Bank failed",e),this.resetBankFlow(),this.showPaymentSourceList({refresh:!0})}finally{this.bankLinkLoading=!1}}}async launchPayByBankProvider(e,t){const i=await this.requestCommerceHubJson("/interaction/source/pbb/session",e,{method:"GET",credentials:"include"}),{aggregatorSessionId:r,accessToken:n,pToken:a,publicKey:o}=gr(i),s=Oi(this.designConfig?.payByBank);await Kr(s.paymentSdkUrl);const c=window.PaymentSDK;if(!c?.init)throw new Error("PaymentSDK.js loaded but PaymentSDK.init is not available on window.");await new Promise((i,d)=>{let l=!1;Yr(),c.init({apiKey:s.apiKey,accessToken:n,configId:s.configId,environment:s.environment,locale:s.locale,appearance:Vi(this.designConfig),publicKey:o,pToken:a,aggregatorSessionId:r,containerId:t,onEvent:async t=>{if(!l&&yr(t)){if(Yr(),"success"!==t.type)return l=!0,this.resetBankFlow(),this.showPaymentSourceList({refresh:!0}),void i();try{const t=await this.finalizePayByBankSession(e,r,a),n=Ii(t),o=n.id?.trim();if(!o)throw new Error("Connect your bank completed but the resolved bank payment source did not include an id.");const s=this.interactionResponseWithAddedSource(e,n);if(this.setInteractionResponseFromSdk(s),this.emitSdkEvent(mi,n),this.resetBankFlow(),"VERIFIED"===n.verificationInfo?.status)return await this.attachPaymentSource(o),l=!0,void i();this.showAddedPaymentSourceStatus(n),l=!0,i()}catch(e){l=!0,d(e)}}}}),this.bankLinkLoading=!1})}async refreshPaymentSourcesFromInteraction(){await this.interactionRefresh.refreshFromInteraction(this.interactionRefreshOptions())}queueNativeAccountBalanceRefresh(){this.nativeBalance.queueRefresh(()=>this.interactionResponse,e=>this.fetchNativeAccountBalances(e))}async fetchNativeAccountBalances(e){return(await this.createSdkClient(e).GET("/interaction/source/native/balances")).data??{}}async fetchInteraction(e){return this.interactionRefresh.fetch(e,this.interactionRefreshOptions())}async retryInteractionRefresh(){const e=this.interactionResponse?.interactionId;if(e)try{await this.fetchInteraction(e)}catch(e){}}interactionRefreshOptions(){return{getCurrentInteractionResponse:()=>this.interactionResponse,getSelectedPaymentSourceId:()=>this.selectedPaymentSourceId,requestInteraction:e=>this.createSdkClient(e).GET("/interaction").then(e=>mr(e)),mergeInteractionResponse:hr,setInteractionResponse:e=>this.setInteractionResponseFromSdk(e),emitListPaymentMethods:e=>this.emitSdkEvent(vi,e)}}syncBillingAddressesFromInteractionResponse(e){e.billerAddress&&(this.billingAddresses=e.billerAddress.filter(e=>Boolean(e.id?.trim())),this.cardDraft=((e,t)=>{const i=t.map(e=>e.id?.trim()).filter(e=>Boolean(e));if(!i.length)return{...e,billingAddressValue:Ve};if(i.includes(e.billingAddressValue))return e;const r=[e.country,e.addressLine1,e.addressLine2,e.city,e.state,e.zip].some(e=>e.trim());return e.billingAddressValue===Ve&&r?e:{...e,billingAddressValue:i[0]}})(this.cardDraft,this.billingAddresses),this.billingAddressSelectorExpanded=this.cardDraft.billingAddressValue===Ve)}async finalizePayByBankSession(e,t,i){return this.requestCommerceHubJson(`/interaction/source/pbb/session/${encodeURIComponent(t)}/${encodeURIComponent(i)}`,e,{method:"PUT",credentials:"include"})}async verifyPaymentSourceStep1(e,t){this.showMinimumVerificationOverlay("verify-payment-source");const i=await this.requestCommerceHubJson("/interaction/verify/step1",e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:t.id}),credentials:"include"});return this.sourceWithVerificationResponse(t,i)}async requestCommerceHubJson(e,t,i){const r=this.createInteractionHeaders(t,i.headers);r.has("Accept")||r.set("Accept","application/json");const n=new Request(`${xe(this.baseURL)}${e}`,{...i,headers:r}),a=await fetch(n),o=a.headers.get("content-type")??"",s=204===a.status?void 0:o.includes("application/json")?await a.json():await a.text();if(!a.ok)throw new Error(pr(s)||a.statusText);return s}resetBankFlow(){this.bankFlowScreen=void 0,this.bankOutcomeSource=void 0,this.bankLinkLoading=!1,this.bankAccountDraft={name:"",routingNumber:"",accountNumber:"",accountNumberReEntered:""},this.bankAccountDraftErrors={},this.bankAccountEncryption={routingNumber:{status:"idle",normalizedValue:""},accountNumber:{status:"idle",normalizedValue:""},accountNumberReEntered:{status:"idle",normalizedValue:""}},this.bankAccountSubmitError=void 0,this.removePayByBankProviderContainer()}resetCardFlow(){this.cardFlowScreen=void 0,this.cardDraft=Le(),this.cardDraftErrors={},this.cardEncryption={cardNumber:{status:"idle",normalizedValue:""},cvv:{status:"idle",normalizedValue:""}},this.cardSubmitError=void 0,this.billingAddressSelectorExpanded=!1}resetTransferFlow(){this.transferFlowActive=!1,this.transferFlowScreen="form",this.transferDraft={fromSourceId:"",toSourceId:"",amount:""},this.transferDraftErrors={},this.transferSubmitError=void 0,this.transferSubmitSuccess=!1}ensurePayByBankProviderContainer(e){const t=[...this.children].find(t=>t instanceof HTMLElement&&t.id===e),i=t??document.createElement("div");return i.id=e,i.slot=e,i.className="provider-frame-container",i.replaceChildren(),t||this.appendChild(i),i}removePayByBankProviderContainer(){[...this.children].filter(e=>e instanceof HTMLElement&&e.id===yi).forEach(e=>e.remove())}requireInteractionId(){const e=this.interactionResponse?.interactionId;if(e)return e}createSdkClient(e){return Se({baseURL:this.baseURL,getHeaders:()=>this.createInteractionHeaders(e)})}createInteractionHeaders(e,t){const i=new Headers(t),r=this.interactionResponse?.oauth?.access_token?.trim();return i.set("x-interaction-id",e),r&&!i.has("Authorization")&&i.set("Authorization",`Bearer ${r}`),i}setInteractionResponseFromSdk(e){this.interactionResponse=this.interactionResponseWithPreservedGatewayOAuth(e)}interactionResponseWithPreservedGatewayOAuth(e){if(e.oauth&&e.features)return e;const t=this.interactionResponse;return!t||t.interactionId&&e.interactionId&&t.interactionId!==e.interactionId?e:{...e,oauth:e.oauth??t.oauth,features:e.features??t.features}}syncDesignConfigStyles(){for(const e of Ui)this.style.removeProperty(e);const e=this.designConfig?.colors;if(e)for(const{field:t,property:i}of Pi){const r=e[t];r&&this.style.setProperty(i,r)}const t=this.designConfig?.baseFontSize;t?this.style.fontSize=t:this.style.removeProperty("font-size");const i=this.designConfig?.baseFontWeight?.trim();i?this.style.setProperty(Fi,i):this.style.removeProperty(Fi);const r=this.designConfig?.shellPadding?.trim();r?this.style.setProperty(ji,r):this.style.removeProperty(ji)}};Si.styles=Vt,hi([de({attribute:!1})],Si.prototype,"interactionResponse",void 0),hi([de({attribute:!1})],Si.prototype,"designConfig",void 0),hi([de({attribute:"base-url"})],Si.prototype,"baseURL",void 0),hi([le()],Si.prototype,"selectedPaymentSourceId",void 0),hi([le()],Si.prototype,"otpValue",void 0),hi([le()],Si.prototype,"pendingAction",void 0),hi([le()],Si.prototype,"minimumVerificationOverlayAction",void 0),hi([le()],Si.prototype,"otpErrorMessage",void 0),hi([le()],Si.prototype,"bankFlowScreen",void 0),hi([le()],Si.prototype,"bankLinkLoading",void 0),hi([le(),le()],Si.prototype,"bankOutcomeSource",void 0),hi([le()],Si.prototype,"bankAccountDraft",void 0),hi([le()],Si.prototype,"bankAccountDraftErrors",void 0),hi([le()],Si.prototype,"bankAccountEncryption",void 0),hi([le()],Si.prototype,"bankAccountSubmitError",void 0),hi([le()],Si.prototype,"transferDraft",void 0),hi([le()],Si.prototype,"transferDraftErrors",void 0),hi([le()],Si.prototype,"transferSubmitError",void 0),hi([le()],Si.prototype,"transferSubmitSuccess",void 0),hi([le()],Si.prototype,"transferFlowActive",void 0),hi([le()],Si.prototype,"transferFlowScreen",void 0),hi([le(),le()],Si.prototype,"cardFlowScreen",void 0),hi([le()],Si.prototype,"cardDraft",void 0),hi([le()],Si.prototype,"cardDraftErrors",void 0),hi([le()],Si.prototype,"cardEncryption",void 0),hi([le()],Si.prototype,"cardSubmitError",void 0),hi([le()],Si.prototype,"billingAddresses",void 0),hi([le()],Si.prototype,"billingAddressSelectorExpanded",void 0),hi([le()],Si.prototype,"paymentSourceView",void 0),hi([le()],Si.prototype,"paymentSourceEditMode",void 0),hi([le()],Si.prototype,"deleteConfirmationPaymentSourceId",void 0),hi([le()],Si.prototype,"savedSourceVerificationSource",void 0),hi([le()],Si.prototype,"savedSourceVerificationFailed",void 0),hi([le()],Si.prototype,"requiredInfoSource",void 0),hi([le()],Si.prototype,"requiredInfoValues",void 0),hi([le()],Si.prototype,"requiredInfoFileNames",void 0),hi([le()],Si.prototype,"requiredInfoSubmitError",void 0),Si=hi([(e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)})("commerce-hub-connect")],Si);const Ci=e=>e.composedPath().find(e=>e instanceof HTMLInputElement&&e.classList.contains("required-info-ssn-input")),Ei=e=>{const t=[e.stateOrProvince,e.postalCode].filter(Boolean).join(" "),i=[e.city,t].filter(Boolean).join(", ");return[e.street,i].filter(Boolean).join(", ")||e.id||"Saved billing address"},zi=(e,t)=>{const i=Pe(t??"").slice(-4);return{...e,tenderType:"Card",card:{...e.card,...i?{cardNumber:i}:{}}}},Ai=(e,t)=>{const i=st(t??"").slice(-4);return{...e,tenderType:"BankAccount",bankAccount:{...e.bankAccount,...i?{accountNumber:i}:{}}}},Ii=e=>({id:Ni(e,"Connect your bank completed but the verification response did not include a source id."),tenderType:"BankAccount",verificationInfo:Ti(e),bankAccount:{}}),Ni=(e,t)=>{const i=e.sourceId?.trim();if(!i)throw new Error(t);return i},Ti=e=>{const{sourceId:t,...i}=e;return i},qi=e=>{const t=e?.email?.trim();if(t)return t;const i=e?.phone?.countryCode?.trim(),r=e?.phone?.phoneNumber?.trim();return[i,r].filter(Boolean).join(" ")||void 0},Ri=e=>{const t=e?.copy?.otp;return{title:t?.title??"Enter verification code",subtitle:t?.subtitle,failedMessage:t?.failedMessage??"The code does not match. Try again.",resendPrefix:t?.resendPrefix??"Didn't receive the code?",resendButton:t?.resendButton??"Resend code",resendPendingButton:t?.resendPendingButton??"Sending code...",verifyButton:t?.verifyButton??"Verify",verifyingButton:t?.verifyingButton??"Verifying...",tryAgainButton:t?.tryAgainButton??"Try again"}},Bi=e=>{const t=e?.copy?.paymentMethods;return{title:t?.title??"Pay with",subtitle:t?.subtitle??"",addBankAccountTitle:t?.addBankAccountTitle??"Add bank account",addBankAccountSubtitle:t?.addBankAccountSubtitle??"",addCardTitle:t?.addCardTitle??"Add credit or debit card",addCardSubtitle:t?.addCardSubtitle??"",continueButton:t?.continueButton??"Confirm",continuingButton:t?.continuingButton??"Confirming..."}},Di=e=>{const t=e?.copy?.noSavedPaymentMethods;return{title:t?.title??"Add payment method",subtitle:t?.subtitle??"",emptyTitle:t?.emptyTitle??"",emptyMessage:t?.emptyMessage??"",addBankAccountTitle:t?.addBankAccountTitle??"Add bank account",addBankAccountSubtitle:t?.addBankAccountSubtitle??"",addCardTitle:t?.addCardTitle??"Add credit or debit card",addCardSubtitle:t?.addCardSubtitle??""}},Oi=e=>{const t=Object.fromEntries(Object.entries(e??{}).filter(([,e])=>void 0!==e));return{...xi,...t}},Vi=e=>{const t=e?.colors,i={};return Mi(i,"backgroundColor",Li(t?.widgetBackground,t?.surface)),Mi(i,"primaryColor",t?.primary),Mi(i,"buttonColor",t?.primary),Mi(i,"primaryTextColor",t?.text),Mi(i,"secondaryTextColor",Li(t?.copy,t?.muted)),Mi(i,"dangerColor",t?.danger),Mi(i,"successColor",t?.success),Mi(i,"borderColor",Li(t?.border,t?.widgetBorder,t?.borderBackground)),Mi(i,"placeholderColor",t?.placeholder),{branding:i}},Li=(...e)=>e.map(e=>e?.trim()).find(e=>Boolean(e)),Mi=(e,t,i)=>{const r=i?.trim();r&&(e[t]=r)},Pi=[{field:"primary",property:"--chc-primary"},{field:"text",property:"--chc-text"},{field:"copy",property:"--chc-copy"},{field:"muted",property:"--chc-muted"},{field:"placeholder",property:"--chc-placeholder"},{field:"surface",property:"--chc-surface"},{field:"widgetBackground",property:"--chc-widget-background"},{field:"borderBackground",property:"--chc-border"},{field:"widgetBorder",property:"--chc-border"},{field:"softSurface",property:"--chc-soft-surface"},{field:"paymentSelectionBackground",property:"--chc-payment-method-background"},{field:"paymentMethodBackground",property:"--chc-payment-method-background"},{field:"border",property:"--chc-border"},{field:"borderStrong",property:"--chc-border-strong"},{field:"success",property:"--chc-success"},{field:"successBackground",property:"--chc-success-bg"},{field:"successBorder",property:"--chc-success-border"},{field:"danger",property:"--chc-danger"},{field:"dangerBackground",property:"--chc-danger-bg"},{field:"dangerBorder",property:"--chc-danger-border"},{field:"warning",property:"--chc-warning"},{field:"warningBackground",property:"--chc-warning-bg"},{field:"warningBorder",property:"--chc-warning-border"},{field:"disabledText",property:"--chc-disabled-text"},{field:"disabledSurface",property:"--chc-disabled-surface"}],Fi="--chc-font-weight",ji="--chc-shell-padding",Ui=[...Pi.map(({property:e})=>e),Fi,ji],_i=(e,t={})=>{const i=e?.paymentSources;if(!i?.length){const i=or(e);return i?[Wi(i,{...t,selected:!0})]:[]}return i.map(e=>Wi(e,t))},Hi=e=>{const t=e?.allowedTenderTypes;return t?{card:t.includes("CARD"),bankAccount:t.includes("BANK_ACCOUNT"),nativeAccount:t.includes("NATIVE_ACCOUNT")}:{card:!0,bankAccount:!0,nativeAccount:!0}},Wi=(e,{selected:t=!1,nativeBalances:i={},nativeBalanceLoadingSourceIds:r=[]}={})=>{const n=Qi(e),a=_r(e)?tr(e,i):void 0,o=void 0===a?.balance?void 0:rr(a.balance);return{id:n,label:Ki(e,{selected:t}),type:Xi(e),brand:Gi(e),accountLabel:Ji(e),balanceLabel:o,balanceLoading:_r(e)&&r.includes(n),last4:Zi(e),status:br(e.verificationInfo?.status),showVerificationStatus:Boolean(e.verificationInfo?.status)}},Ki=(e,{selected:t=!1}={})=>Ur(e)?t?e.name?.trim()||e.card?.nameOnCard?.trim()||Yi(e):e.card?.nameOnCard?.trim()||e.name?.trim()||Yi(e):jr(e)?e.name?.trim()||e.bankAccount?.bankName?.trim()||Yi(e):_r(e)?e.account?.nickName?.trim()||e.name?.trim()||Yi(e):e.name?.trim()||Yi(e),Yi=e=>Ur(e)?"Saved card":jr(e)?e.bankAccount?.bankName??"Saved bank account":_r(e)?"Native account":"Dynamic session card",Gi=e=>Ur(e)?e.card?.network??"Card":jr(e)?e.bankAccount?.bankName??"Bank account":_r(e)?e.account?.productType??"Native account":"DSC",Ji=e=>{const t=`•••• ${Zi(e)}`;if(_r(e)){const i=e.account?.productType?.trim();return i?`${i} ${t}`:t}return t},Zi=e=>Ur(e)?vr(e.card?.cardNumber):jr(e)?vr(e.bankAccount?.accountNumber):_r(e)?vr(e.account?.positionId??e.account?.token):vr(e.id),Qi=e=>e.id?.trim()||e.name?.trim()||e.tenderType,Xi=e=>jr(e)?"bank":_r(e)?"native":"card",er=e=>(e?.paymentSources??[]).filter(e=>(jr(e)||_r(e))&&"VERIFIED"===e.verificationInfo?.status&&Boolean(Qi(e))),tr=(e,t)=>{for(const i of ir(e)){const e=t[i];if(e)return e}},ir=e=>[e.id,e.account?.positionId,e.account?.token].map(e=>e?.trim()).filter(e=>Boolean(e)),rr=e=>nr.format(e),nr=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}),ar=(e,t)=>{const i=e?.paymentSources;if(i?.length)return t&&i.some(e=>e.id===t)?t:e?.selectedSource?.id},or=(e,t)=>{if(t){const i=e?.paymentSources?.find(e=>e.id===t);if(i)return i}return e?.selectedSource},sr=e=>e===wi||"PAYMENT_SOURCE_REQUESTED"===e,cr=(e,t)=>Boolean(e?.features?.includes(t)),dr=e=>Boolean(cr(e,"TRANSFER")&&!cr(e,"ADD_ACCOUNT")&&!cr(e,"SELECT")),lr=e=>((e,t)=>t.every(t=>cr(e,t)))(e,["ADD_ACCOUNT","SELECT","TRANSFER"]),hr=(e,t,i)=>{const r={...e,...t},n=t.paymentSources??e.paymentSources??[],a=((e,t)=>{if(t){const i=e.find(e=>e.id===t);if(i)return i}})(n,i??t.selectedSource?.id)??t.selectedSource??e.selectedSource;return{...r,selectedSource:a,paymentSources:n}},ur=(e,t)=>{const i=(e.paymentSources??[]).filter(e=>e.id!==t),r=e.selectedSource?.id===t?void 0:e.selectedSource;return{...e,status:"PAYMENT_SOURCE_ATTACHED"!==e.status||r?e.status:wi,selectedSource:r,paymentSources:i}},mr=e=>{if(e.data)return e.data;throw new Error(pr(e.error))},pr=e=>"string"==typeof e?e:e&&"object"==typeof e&&"message"in e&&"string"==typeof e.message?e.message:"CommerceHub API request failed.",fr=(e,t)=>{const i=e.composedPath().find(e=>e instanceof HTMLElement&&Boolean(e.dataset[t]));return i?.dataset[t]},vr=e=>e&&e.length>=4?e.slice(-4):"----",br=e=>"VERIFIED"===e?"verified":"UNDER_REVIEW"===e?"under-review":"REQUIRE_INFO"===e?"require-info":"DECLINED"===e?"declined":"not-verified",gr=e=>{const t=e.aggregatorSessionId?.trim(),i=e.tokenID?.trim()||e.accessToken?.trim(),r=e.pToken?.trim(),n=e.publicKey?.trim();if(!(t&&i&&r&&n))throw new Error("The /interaction/source/pbb/session response is missing one or more required values.");return{aggregatorSessionId:t,accessToken:i,pToken:r,publicKey:n}},yr=e=>"success"===e.type||"cancel"===e.type||"failure"===e.type||"error"===e.type,wr=(e,t)=>{const i=$r(e.paymentSources??[],t);return{...e,selectedSource:t,paymentSources:i}},kr=(e,t)=>({...e,paymentSources:$r(e.paymentSources??[],t)}),$r=(e,t)=>e.some(e=>e.id===t.id)?e.map(e=>e.id===t.id?t:e):[t,...e],xr=e=>"VERIFIED"===e.verificationInfo?.status,Sr=({title:e,helper:t})=>F`
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
`,Cr=e=>"verify-payment-source"===e?Sr({title:"Verifying payment method",helper:"Verifying your payment method, please wait."}):"submit-required-info"===e?Sr({title:"Verifying account",helper:"Reviewing your verification information, please wait."}):void 0,Er=e=>"verify-payment-source"===e?Cr(e):"delete-payment-source"===e?Sr({title:"Deleting payment method",helper:"Deleting your payment method, please wait."}):"attach-payment-source"===e?Sr({title:"Saving payment method",helper:"Saving your payment method, please wait."}):void 0,zr=e=>{const t=e?.verificationInfo?.status;return"VERIFIED"===t?{kind:"verified",variant:"success",title:"Bank account verified",message:"Your bank account is connected and ready to use."}:"UNDER_REVIEW"===t?{kind:"pending",variant:"warning",title:"Bank account pending review",message:"We will update this bank account after review is complete."}:"REQUIRE_INFO"===t?{kind:"requires-info",variant:"warning",title:"Complete account verification",message:"Additional information is required before this bank account can be verified."}:"DECLINED"===t?{kind:"declined",variant:"danger",title:"Bank account verification failed",message:"This bank account could not be verified."}:{kind:"failed",variant:"danger",title:"Bank account not verified",message:"This bank account is not verified yet."}},Ar=(e,t=!1)=>{const i=Fr(e),r=i.toLowerCase(),n=e?.verificationInfo?.status;return t?{kind:"failed",variant:"danger",title:"Bank account"===i?"Bank account verification failed":`${i} not verified`,message:`We could not verify this ${r} right now.`}:"VERIFIED"===n?{kind:"verified",variant:"success",title:"Bank account"===i?"Bank account verified":`${i} saved`,message:`This ${r} is verified and ready to use.`}:"UNDER_REVIEW"===n?{kind:"pending",variant:"warning",title:"Bank account"===i?"Bank account pending review":"Verification pending review",message:`We will update this ${r} after review is complete.`}:"REQUIRE_INFO"===n?{kind:"requires-info",variant:"warning",title:"Complete account verification",message:`Additional information is required before this ${r} can be verified.`}:"DECLINED"===n?{kind:"declined",variant:"danger",title:"Bank account"===i?"Bank account verification failed":`${i} declined`,message:`This ${r} could not be verified.`}:{kind:"failed",variant:"danger",title:"Bank account"===i?"Bank account not verified":`${i} not verified`,message:`This ${r} is not verified yet.`}},Ir=e=>{const t=e?.verificationInfo?.docs??[];return t.length>0?t:[{}]},Nr=(e,t=0)=>`${e?.docType??"DOCUMENT"}-${t}`,Tr=e=>"DRIVER_LICENSE_NUMBER"===e.docType||"SOCIAL_SECURITY_NUMBER"===e.docType,qr=e=>!1!==e.mandatory,Rr=e=>qr(e)?"required":"optional",Br=e=>F`
  <span
    class="required-info-requirement-badge required-info-requirement-badge-${Rr(e)}"
  >
    ${(e=>qr(e)?"Required":"Optional")(e)}
  </span>
`,Dr=e=>{const t=e.findIndex(e=>!Tr(e));return t>=0?Nr(e[t],t):void 0},Or=({doc:e,key:t,value:i})=>{if("SOCIAL_SECURITY_NUMBER"===e.docType)return Vr({doc:e,key:t,value:i});const r=`required-info-${t}`;return F`
    <div
      class="required-info-document required-info-text-document required-document-text-row"
      data-required-info-doc-key=${t}
      data-required-info-requirement=${Rr(e)}
    >
      <div class="field field-full">
        <div class="field-label-row">
          <label class="field-label" for=${r}
            >${Lr(e)}</label
          >
          ${Br(e)}
        </div>
        <input
          class="field-input required-info-text-input"
          id=${r}
          name=${t}
          type=${(e=>"SOCIAL_SECURITY_NUMBER"===e.docType?"password":"text")(e)}
          .value=${i}
          autocomplete="off"
          inputmode=${(e=>"SOCIAL_SECURITY_NUMBER"===e.docType?"numeric":"text")(e)}
          data-required-info-doc-key=${t}
          aria-label=${Lr(e)}
        />
      </div>
    </div>
  `},Vr=({doc:e,key:t,value:i})=>{const r=Lr(e),n=(e=>{const t=St(e);return[t.slice(0,3),t.slice(3,5),t.slice(5,9)]})(i),a=`required-info-${t}-ssn-0`;return F`
    <div
      class="required-info-document required-info-text-document required-info-ssn-document required-document-text-row"
      data-required-info-doc-key=${t}
      data-required-info-requirement=${Rr(e)}
    >
      <div class="field field-full">
        <div class="field-label-row">
          <label class="field-label" for=${a}>${r}</label>
          ${Br(e)}
        </div>
        <div class="required-info-ssn-control" role="group" aria-label=${r}>
          ${xt.map((e,i)=>F`
              ${i>0?F`
                    <span class="required-info-ssn-separator" aria-hidden="true"
                      >-</span
                    >
                  `:""}
              <input
                class="field-input required-info-ssn-input"
                id=${`required-info-${t}-ssn-${i}`}
                name=${`${t}-${i}`}
                type="password"
                .value=${n[i]}
                autocomplete="off"
                inputmode="numeric"
                maxlength=${e}
                data-required-info-doc-key=${t}
                data-required-info-ssn-segment=${String(i)}
                aria-label=${`${r} part ${i+1}`}
              />
            `)}
        </div>
      </div>
    </div>
  `},Lr=e=>"BANK_STATEMENT"===e.docType?"Bank statement":"BANK_LETTER"===e.docType?"Bank letter":"BANK_CHECK"===e.docType?"Bank check":"DRIVER_LICENSE_PHOTO"===e.docType?"Driver license photo":"DRIVER_LICENSE_NUMBER"===e.docType?"Driver license number":"SOCIAL_SECURITY_NUMBER"===e.docType?"Social Security number":"Required document",Mr=e=>{const t=(e=>({type:Xi(e),brand:Gi(e)}))(e),i=Dt(t),r=(e=>{if(!Ur(e))return;const t=e.card?.expirationMonth?.trim(),i=e.card?.expirationYear?.trim();if(!t||!i)return;return`${t.padStart(2,"0")}/${i.slice(-2)}`})(e);return F`
    <div
      class="required-info-card"
      aria-label="Payment source requiring verification"
    >
      <div class="required-info-card-top">
        <div class="required-info-card-heading">
          <span class="required-info-card-label"
            >${(e=>jr(e)?"Bank account":Ur(e)?"Card":_r(e)?"Native account":"Dynamic session card")(e)}</span
          >
          <span
            class="required-info-card-field required-info-card-name"
            data-required-info-card-field="name"
            >${(e=>Ur(e)?e.card?.nameOnCard?.trim()||e.name?.trim()||Yi(e):jr(e)?e.name?.trim()||e.bankAccount?.bankName?.trim()||Yi(e):_r(e)?e.account?.nickName?.trim()||e.name?.trim()||Yi(e):e.name?.trim()||Yi(e))(e)}</span
          >
        </div>
        <span class="required-info-card-icon-chip" aria-hidden="true">
          <img
            class="required-info-card-icon-image"
            data-required-info-card-icon=${i}
            src=${Ot(t)}
            alt=""
          />
        </span>
      </div>

      <div
        class="required-info-card-field required-info-card-number"
        data-required-info-card-field="number"
      >
        ${(e=>Ur(e)?`•••• •••• •••• ${Zi(e)}`:`•••• ${Zi(e)}`)(e)}
      </div>

      <div class="required-info-card-bottom">
        <div class="required-info-card-detail">
          <span class="required-info-card-label">Status</span>
          <span class="required-info-card-status">
            ${Ft(br(e.verificationInfo?.status))}
          </span>
        </div>
        ${r?F`
              <div class="required-info-card-detail">
                <span class="required-info-card-label">Expiry</span>
                <span
                  class="required-info-card-field required-info-card-expiry"
                  data-required-info-card-field="expiry"
                  >${r}</span
                >
              </div>
            `:""}
      </div>
    </div>
  `},Pr=e=>"REQUIRE_INFO"===e.verificationInfo?.status,Fr=e=>e&&jr(e)?"Bank account":e&&_r(e)?"Native account":"Payment method",jr=e=>"BankAccount"===e.tenderType||"BANK_ACCOUNT"===e.tenderType,Ur=e=>"Card"===e.tenderType||"CARD"===e.tenderType,_r=e=>"NativeAccount"===e.tenderType||"NATIVE_ACCOUNT"===e.tenderType;let Hr,Wr;const Kr=async e=>{if(!window.PaymentSDK?.init)if(Hr&&Wr===e)await Hr;else if(Wr=e,Hr=new Promise((t,i)=>{const r=document.querySelector(`script[data-commerce-hub-pay-by-bank-sdk="true"][src="${e}"]`),n=r??document.createElement("script"),a=()=>{n.removeEventListener("load",o),n.removeEventListener("error",s)},o=()=>{a(),t()},s=()=>{a(),Hr=void 0,Wr=void 0,i(new Error(`Unable to load Connect your bank script: ${e}`))};n.addEventListener("load",o,{once:!0}),n.addEventListener("error",s,{once:!0}),r||(n.src=e,n.async=!0,n.dataset.commerceHubPayByBankSdk="true",document.head.appendChild(n))}),await Hr,!window.PaymentSDK?.init)throw new Error(`Connect your bank script loaded but window.PaymentSDK.init is unavailable: ${e}`)},Yr=()=>{try{window.PaymentSDK?.destroy?.()}catch{}};export{$e as COMMERCE_HUB_BASE_URLS,Si as CommerceHubConnect,ke as DEFAULT_COMMERCE_HUB_BASE_URL,mi as ON_ADD_PAYMENT_METHOD_EVENT,fi as ON_DELETE_PAYMENT_METHOD_EVENT,gi as ON_ERROR_EVENT,vi as ON_LIST_PAYMENT_METHODS_EVENT,ui as ON_SELECT_EVENT,bi as ON_TRANSFER_EVENT,pi as ON_VERIFY_PAYMENT_METHOD_EVENT,Se as createCommerceHubClient,Ce as createCommerceHubMerchantClient,xe as resolveCommerceHubBaseURL};
