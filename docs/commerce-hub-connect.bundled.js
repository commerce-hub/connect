/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=r.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&r.set(i,t))}return t}toString(){return this.cssText}};const s=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:n,defineProperty:a,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:l}=Object,p=globalThis,u=p.trustedTypes,f=u?u.emptyScript:"",g=p.reactiveElementPolyfillSupport,b=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!n(t,e),v={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&a(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const s=r?.call(this);o?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=l(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(s(t))}else void 0!==t&&e.push(s(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,r)=>{if(e)i.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of r){const r=document.createElement("style"),o=t.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=e.cssText,i.appendChild(r)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=r;const s=o.fromAttribute(e,t.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(void 0!==t){const s=this.constructor;if(!1===r&&(o=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??y)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,g?.({ReactiveElement:w}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=t=>t,S=x.trustedTypes,k=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,T=`<${C}>`,z=document,R=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,I="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,_=/>/g,D=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),M=/'/g,N=/"/g,B=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),L=Symbol.for("lit-noChange"),H=Symbol.for("lit-nothing"),V=new WeakMap,F=z.createTreeWalker(z,129);function J(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,r=[];let o,s=2===e?"<svg>":3===e?"<math>":"",n=j;for(let e=0;e<i;e++){const i=t[e];let a,c,d=-1,h=0;for(;h<i.length&&(n.lastIndex=h,c=n.exec(i),null!==c);)h=n.lastIndex,n===j?"!--"===c[1]?n=U:void 0!==c[1]?n=_:void 0!==c[2]?(B.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=D):void 0!==c[3]&&(n=D):n===D?">"===c[0]?(n=o??j,d=-1):void 0===c[1]?d=-2:(d=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?D:'"'===c[3]?N:M):n===N||n===M?n=D:n===U||n===_?n=j:(n=D,o=void 0);const l=n===D&&t[e+1].startsWith("/>")?" ":"";s+=n===j?i+T:d>=0?(r.push(a),i.slice(0,d)+A+i.slice(d)+E+l):i+E+(-2===d?e:l)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class G{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,s=0;const n=t.length-1,a=this.parts,[c,d]=W(t,e);if(this.el=G.createElement(c,i),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=F.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(A)){const e=d[s++],i=r.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?Y:"?"===n[1]?tt:"@"===n[1]?et:X}),r.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),r.removeAttribute(t));if(B.test(r.tagName)){const t=r.textContent.split(E),e=t.length-1;if(e>0){r.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],R()),F.nextNode(),a.push({type:2,index:++o});r.append(t[e],R())}}}else if(8===r.nodeType)if(r.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=r.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,r){if(e===L)return e;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const s=O(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,r)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??z).importNode(e,!0);F.currentNode=r;let o=F.nextNode(),s=0,n=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new K(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new it(o,this,t)),this._$AV.push(e),a=i[++n]}s!==a?.index&&(o=F.nextNode(),s++)}return F.currentNode=z,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=H,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===H||null==t||""===t?(this._$AH!==H&&this._$AR(),this._$AH=H):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==H&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new Z(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new G(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new K(this.O(R()),this.O(R()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=H,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=H}_$AI(t,e=this,i,r){const o=this.strings;let s=!1;if(void 0===o)t=Q(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==L,s&&(this._$AH=t);else{const r=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Q(this,r[i+n],e,n),a===L&&(a=this._$AH[n]),s||=!O(a)||a!==this._$AH[n],a===H?t=H:t!==H&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}s&&!r&&this.j(t)}j(t){t===H?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===H?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==H)}}class et extends X{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??H)===L)return;const i=this._$AH,r=t===H&&i!==H||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==H&&(i===H||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(G,K),(x.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class st extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let o=r._$litPart$;if(void 0===o){const t=i?.renderBefore??null;r._$litPart$=o=new K(e.insertBefore(R(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}st._$litElement$=!0,st.finalized=!0,ot.litElementHydrateSupport?.({LitElement:st});const nt=ot.litElementPolyfillSupport;nt?.({LitElement:st}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:y},ct=(t=at,e,i)=>{const{kind:r,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,o,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const o=this[r];e.call(this,i),this.requestUpdate(r,o,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return dt({...t,state:!0,attribute:!1})}const lt=/\{[^{}]+\}/g;function pt(t){let{baseUrl:e="",Request:i=globalThis.Request,fetch:r=globalThis.fetch,querySerializer:o,bodySerializer:s,pathSerializer:n,headers:a,requestInitExt:c,...d}={...t};c="object"==typeof process&&Number.parseInt(process?.versions?.node?.substring(0,2))>=18&&process.versions.undici?c:void 0,e=wt(e);const h=[];async function l(t,l){const{baseUrl:p,fetch:u=r,Request:f=i,headers:g,params:b={},parseAs:m="json",querySerializer:y,bodySerializer:v=s??yt,pathSerializer:w,body:x,middleware:$=[],...S}=l||{};let k=e;p&&(k=wt(p)??e);let A="function"==typeof o?o:bt(o);y&&(A="function"==typeof y?y:bt({..."object"==typeof o?o:{},...y}));const E=w||n||mt,C=void 0===x?void 0:v(x,vt(a,g,b.header)),T=vt(void 0===C||C instanceof FormData?{}:{"Content-Type":"application/json"},a,g,b.header),z=[...h,...$],R={redirect:"follow",...d,...S,body:C,headers:T};let O,P,I,j=new f(function(t,e){let i=`${e.baseUrl}${t}`;e.params?.path&&(i=e.pathSerializer(i,e.params.path));let r=e.querySerializer(e.params.query??{});r.startsWith("?")&&(r=r.substring(1));r&&(i+=`?${r}`);return i}(t,{baseUrl:k,params:b,querySerializer:A,pathSerializer:E}),R);for(const t in S)t in j||(j[t]=S[t]);if(z.length){O=Math.random().toString(36).slice(2,11),P=Object.freeze({baseUrl:k,fetch:u,parseAs:m,querySerializer:A,bodySerializer:v,pathSerializer:E});for(const e of z)if(e&&"object"==typeof e&&"function"==typeof e.onRequest){const i=await e.onRequest({request:j,schemaPath:t,params:b,options:P,id:O});if(i){if(!(i instanceof f)){if(i instanceof Response){I=i;break}throw new Error("onRequest: must return new Request() or Response() when modifying the request")}j=i}}}if(!I){try{I=await u(j,c)}catch(e){let i=e;if(z.length)for(let e=z.length-1;e>=0;e--){const r=z[e];if(r&&"object"==typeof r&&"function"==typeof r.onError){const e=await r.onError({request:j,error:i,schemaPath:t,params:b,options:P,id:O});if(e){if(e instanceof Response){i=void 0,I=e;break}if(e instanceof Error){i=e;continue}throw new Error("onError: must return new Response() or instance of Error")}}}if(i)throw i}if(z.length)for(let e=z.length-1;e>=0;e--){const i=z[e];if(i&&"object"==typeof i&&"function"==typeof i.onResponse){const e=await i.onResponse({request:j,response:I,schemaPath:t,params:b,options:P,id:O});if(e){if(!(e instanceof Response))throw new Error("onResponse: must return new Response() when modifying the response");I=e}}}}const U=I.headers.get("Content-Length");if(204===I.status||"HEAD"===j.method||"0"===U&&!I.headers.get("Transfer-Encoding")?.includes("chunked"))return I.ok?{data:void 0,response:I}:{error:void 0,response:I};if(I.ok){const t=async()=>{if("stream"===m)return I.body;if("json"===m&&!U){const t=await I.text();return t?JSON.parse(t):void 0}return await I[m]()};return{data:await t(),response:I}}let _=await I.text();try{_=JSON.parse(_)}catch{}return{error:_,response:I}}return{request:(t,e,i)=>l(e,{...i,method:t.toUpperCase()}),GET:(t,e)=>l(t,{...e,method:"GET"}),PUT:(t,e)=>l(t,{...e,method:"PUT"}),POST:(t,e)=>l(t,{...e,method:"POST"}),DELETE:(t,e)=>l(t,{...e,method:"DELETE"}),OPTIONS:(t,e)=>l(t,{...e,method:"OPTIONS"}),HEAD:(t,e)=>l(t,{...e,method:"HEAD"}),PATCH:(t,e)=>l(t,{...e,method:"PATCH"}),TRACE:(t,e)=>l(t,{...e,method:"TRACE"}),use(...t){for(const e of t)if(e){if("object"!=typeof e||!("onRequest"in e||"onResponse"in e||"onError"in e))throw new Error("Middleware must be an object with one of `onRequest()`, `onResponse() or `onError()`");h.push(e)}},eject(...t){for(const e of t){const t=h.indexOf(e);-1!==t&&h.splice(t,1)}}}}function ut(t,e,i){if(null==e)return"";if("object"==typeof e)throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");return`${t}=${!0===i?.allowReserved?e:encodeURIComponent(e)}`}function ft(t,e,i){if(!e||"object"!=typeof e)return"";const r=[],o={simple:",",label:".",matrix:";"}[i.style]||"&";if("deepObject"!==i.style&&!1===i.explode){for(const t in e)r.push(t,!0===i.allowReserved?e[t]:encodeURIComponent(e[t]));const o=r.join(",");switch(i.style){case"form":return`${t}=${o}`;case"label":return`.${o}`;case"matrix":return`;${t}=${o}`;default:return o}}for(const o in e){const s="deepObject"===i.style?`${t}[${o}]`:o;r.push(ut(s,e[o],i))}const s=r.join(o);return"label"===i.style||"matrix"===i.style?`${o}${s}`:s}function gt(t,e,i){if(!Array.isArray(e))return"";if(!1===i.explode){const r={form:",",spaceDelimited:"%20",pipeDelimited:"|"}[i.style]||",",o=(!0===i.allowReserved?e:e.map(t=>encodeURIComponent(t))).join(r);switch(i.style){case"simple":return o;case"label":return`.${o}`;case"matrix":return`;${t}=${o}`;default:return`${t}=${o}`}}const r={simple:",",label:".",matrix:";"}[i.style]||"&",o=[];for(const r of e)"simple"===i.style||"label"===i.style?o.push(!0===i.allowReserved?r:encodeURIComponent(r)):o.push(ut(t,r,i));return"label"===i.style||"matrix"===i.style?`${r}${o.join(r)}`:o.join(r)}function bt(t){return function(e){const i=[];if(e&&"object"==typeof e)for(const r in e){const o=e[r];if(null!=o)if(Array.isArray(o)){if(0===o.length)continue;i.push(gt(r,o,{style:"form",explode:!0,...t?.array,allowReserved:t?.allowReserved||!1}))}else"object"!=typeof o?i.push(ut(r,o,t)):i.push(ft(r,o,{style:"deepObject",explode:!0,...t?.object,allowReserved:t?.allowReserved||!1}))}return i.join("&")}}function mt(t,e){let i=t;for(const r of t.match(lt)??[]){let t=r.substring(1,r.length-1),o=!1,s="simple";if(t.endsWith("*")&&(o=!0,t=t.substring(0,t.length-1)),t.startsWith(".")?(s="label",t=t.substring(1)):t.startsWith(";")&&(s="matrix",t=t.substring(1)),!e||void 0===e[t]||null===e[t])continue;const n=e[t];Array.isArray(n)?i=i.replace(r,gt(t,n,{style:s,explode:o})):i="object"!=typeof n?"matrix"!==s?i.replace(r,"label"===s?`.${encodeURIComponent(n)}`:encodeURIComponent(n)):i.replace(r,`;${ut(t,n)}`):i.replace(r,ft(t,n,{style:s,explode:o}))}return i}function yt(t,e){if(t instanceof FormData)return t;if(e){if("application/x-www-form-urlencoded"===(e.get instanceof Function?e.get("Content-Type")??e.get("content-type"):e["Content-Type"]??e["content-type"]))return new URLSearchParams(t).toString()}return JSON.stringify(t)}function vt(...t){const e=new Headers;for(const i of t){if(!i||"object"!=typeof i)continue;const t=i instanceof Headers?i.entries():Object.entries(i);for(const[i,r]of t)if(null===r)e.delete(i);else if(Array.isArray(r))for(const t of r)e.append(i,t);else void 0!==r&&e.set(i,r)}return e}function wt(t){return t.endsWith("/")?t.substring(0,t.length-1):t}const xt="http://localhost:8080",$t=t=>{const e=pt({baseUrl:t.baseUrl??xt}),i={async onRequest({request:e}){const i=new Headers(e.headers);return St(i,t.headers),t.getHeaders&&St(i,await t.getHeaders()),new Request(e,{headers:i})}};return e.use(i),e},St=(t,e)=>{new Headers(e).forEach((e,i)=>t.set(i,e))},kt=((t,...e)=>{const r=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new o(r,t,i)})`
  :host {
    --chc-text: #06103a;
    --chc-copy: #24304f;
    --chc-muted: #6b7288;
    --chc-placeholder: #7a849c;
    --chc-surface: #f7f9fc;
    --chc-soft-surface: #f1f4fa;
    --chc-border: #cbd3e3;
    --chc-border-strong: #b9c3d6;
    --chc-primary: #003de6;
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
    --chc-disabled-surface: #a9b8d8;
    --chc-font-family: 'Open Sans', Arial, sans-serif;
    --chc-radius-control: 8px;
    --chc-radius-card: 12px;
    --chc-radius-shell: 24px;
    --chc-input-height: 60px;
    --chc-button-height: 72px;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 16px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-shell {
    width: 100%;
    max-width: 520px;
    position: relative;
    padding: 72px 48px 34px;
    border-radius: var(--chc-radius-shell);
    background: #fff;
    text-align: center;
  }

  .widget-shell-wide {
    max-width: 616px;
  }

  .widget-close {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 32px;
    right: 28px;
    border: 0;
    background: transparent;
    color: var(--chc-text);
    font: inherit;
    font-size: 2.25em;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: #000;
    font-size: 2.125em;
    font-weight: 700;
    line-height: 1.2059;
  }

  .widget-subtitle {
    margin: 18px 0 0;
    color: var(--chc-copy);
    font-size: 1.25em;
    font-weight: 400;
    line-height: 1.5;
  }

  .widget-content {
    margin-top: 34px;
  }

  .primitive-stack {
    display: grid;
    gap: 16px;
  }

  .primitive-actions {
    display: grid;
    gap: 12px;
    margin-top: 24px;
  }

  .primitive-footer {
    display: grid;
    margin-top: 24px;
  }

  .otp-flow,
  .payment-flow {
    display: grid;
    gap: 18px;
  }

  .otp-resend-row {
    display: flex;
    min-height: 28px;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--chc-muted);
    font-size: 1em;
    line-height: 1.375;
  }

  .otp-resend-prefix {
    color: var(--chc-copy);
  }

  .otp-resend {
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .otp-resend:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .button {
    min-height: var(--chc-button-height);
    border: 1px solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0 24px;
    font: inherit;
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.25;
    cursor: pointer;
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: #fff;
    color: var(--chc-text);
  }

  .button:disabled {
    border-color: var(--chc-disabled-surface);
    background: var(--chc-disabled-surface);
    color: var(--chc-disabled-text);
    cursor: not-allowed;
  }

  .field {
    display: grid;
    gap: 8px;
    min-width: 0;
    text-align: left;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 600;
    line-height: 1.375;
  }

  .field-input {
    width: 100%;
    height: var(--chc-input-height);
    border: 1.4px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 20px;
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    font-size: 1.25em;
    line-height: 1.4;
    text-align: center;
  }

  .field-input::placeholder {
    color: var(--chc-placeholder);
  }

  .form-grid {
    display: grid;
    gap: 18px;
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
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .otp-inputs {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 68px));
    gap: 16px;
  }

  .otp-input {
    width: 68px;
    height: 72px;
    border: 1.4px solid var(--chc-border);
    border-radius: 10px;
    color: var(--chc-text);
    font: inherit;
    font-size: 2em;
    font-weight: 400;
    line-height: 1.3125;
    text-align: center;
  }

  .otp-input:focus {
    border-color: var(--chc-primary);
    outline: 1px solid var(--chc-primary);
  }

  .otp-group-error .otp-input {
    border-color: var(--chc-danger);
    color: var(--chc-danger);
  }

  .alert {
    min-height: 64px;
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: var(--chc-radius-control);
    padding: 12px 24px;
    font-size: 0.875em;
    font-weight: 600;
    line-height: 1.4286;
    text-align: left;
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
    min-width: 68px;
    min-height: 22px;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-radius: 999px;
    padding: 1px 10px;
    font-size: 0.6875em;
    font-weight: 600;
    line-height: 1.2727;
  }

  .status-verified {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .status-pending {
    border-color: #d0d5dd;
    background: var(--chc-disabled-surface);
    color: var(--chc-muted);
  }

  .status-unverified {
    min-width: 82px;
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .payment-method-row {
    width: 100%;
    min-height: 124px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    gap: 12px;
    align-items: center;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 15px 20px 16px 27px;
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .payment-method-row[aria-checked='true'] {
    border-color: var(--chc-primary);
    box-shadow: 0 0 0 1px var(--chc-primary);
  }

  .payment-method-row:disabled {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .payment-method-text {
    display: grid;
    min-width: 0;
  }

  .payment-method-eyebrow {
    color: var(--chc-copy);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.375;
  }

  .payment-method-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.4375em;
    font-weight: 700;
    line-height: 1.3044;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-holder {
    color: var(--chc-muted);
    font-size: 1.125em;
    font-weight: 400;
    line-height: 1.3889;
  }

  .payment-method-status {
    font-size: 1.0625em;
    font-weight: 400;
    line-height: 1.2941;
  }

  .status-text-verified {
    color: var(--chc-success);
  }

  .status-text-pending {
    color: var(--chc-warning);
  }

  .status-text-unverified {
    color: var(--chc-danger);
  }

  .payment-method-chevron {
    color: var(--chc-text);
    font-size: 2.125em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
  }

  .source-action {
    width: 100%;
    min-height: 86px;
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    align-items: center;
    gap: 24px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 16px 27px;
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .source-action:disabled {
    background: var(--chc-surface);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .source-action-icon {
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--chc-soft-surface);
    color: var(--chc-primary);
    font-size: 1.75em;
    font-weight: 700;
    line-height: 1.2143;
  }

  .source-action-copy {
    display: grid;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.4375em;
    font-weight: 700;
    line-height: 1.3044;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-subtitle {
    overflow: hidden;
    color: var(--chc-muted);
    font-size: 1.0625em;
    font-weight: 400;
    line-height: 1.4706;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail-list {
    display: grid;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: #fff;
    overflow: hidden;
    text-align: left;
  }

  .empty-state {
    display: grid;
    gap: 8px;
    border: 1px dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 28px 24px;
    background: var(--chc-surface);
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.375em;
    font-weight: 700;
    line-height: 1.3636;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-muted);
    font-size: 1em;
    line-height: 1.5;
  }

  .detail-row {
    min-height: 76px;
    display: grid;
    gap: 2px;
    padding: 12px 24px;
  }

  .detail-row + .detail-row {
    border-top: 1px solid var(--chc-border);
  }

  .detail-label {
    color: var(--chc-muted);
    font-size: 1em;
    font-weight: 600;
    line-height: 1.375;
  }

  .detail-value {
    color: var(--chc-text);
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1.4;
  }

  .upload-row {
    width: 100%;
    min-height: 78px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    border: 1px dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 0 22px;
    background: #fff;
    color: var(--chc-copy);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .upload-row-error {
    border-color: var(--chc-danger);
    background: var(--chc-danger-bg);
  }

  .upload-copy {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
  }

  .upload-icon {
    width: 32px;
    color: var(--chc-primary);
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
  }

  .upload-row-label {
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .upload-row-requirements {
    overflow: hidden;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.375;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-row-action {
    color: var(--chc-primary);
    font-size: 1.125em;
    font-weight: 700;
    line-height: 1.3333;
    white-space: nowrap;
  }

  .loading-row {
    min-height: 94px;
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: 20px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 18px 23px;
    background: #fff;
    text-align: left;
  }

  .loading-spinner {
    width: 56px;
    height: 56px;
    border: 7px solid #dbe3f1;
    border-right-color: var(--chc-primary);
    border-radius: 999px;
  }

  .loading-row-copy {
    display: grid;
    min-width: 0;
  }

  .loading-row-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.3125em;
    font-weight: 700;
    line-height: 1.3333;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .loading-row-helper {
    overflow: hidden;
    color: var(--chc-muted);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .powered-by-footer {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 28px;
    color: var(--chc-copy);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.375;
    white-space: nowrap;
  }

  .powered-by-brand {
    color: var(--chc-primary);
    font-weight: 700;
  }

  @media (max-width: 420px) {
    .widget-shell {
      padding: 64px 24px 28px;
      border-radius: 18px;
    }

    .widget-close {
      right: 16px;
    }

    .widget-title {
      font-size: 1.875em;
      line-height: 1.2;
    }

    .widget-subtitle {
      font-size: 1.125em;
      line-height: 1.5;
    }

    .otp-inputs {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 8px;
    }

    .otp-input {
      width: 100%;
      height: 62px;
    }

    .payment-method-row,
    .source-action,
    .upload-row,
    .loading-row {
      padding-right: 18px;
      padding-left: 18px;
    }

    .source-action-title,
    .payment-method-title {
      white-space: normal;
    }
  }
`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,At=({label:t,variant:e="primary",action:i,type:r="button",disabled:o=!1})=>q`
  <button
    class="button button-${e}"
    type=${r}
    data-action=${(t=>t??H)(i)}
    ?disabled=${o}
  >
    ${t}
  </button>
`,Et=({label:t,value:e="",length:i=6,disabled:r=!1,error:o=!1})=>{const s=Array.from({length:i},(t,i)=>e[i]??"");return q`
    <fieldset
      class="otp-group ${o?"otp-group-error":""}"
      aria-label=${t}
    >
      <legend class="otp-label">${t}</legend>
      <div class="otp-inputs">
        ${s.map((e,i)=>q`
            <input
              class="otp-input"
              aria-label=${`${t} digit ${i+1}`}
              inputmode="numeric"
              maxlength="1"
              pattern="[0-9]*"
              data-otp-index=${i}
              .value=${e}
              ?disabled=${r}
            />
          `)}
      </div>
    </fieldset>
  `},Ct=({variant:t,message:e})=>q`
  <div class="alert alert-${t}" role="alert">${e}</div>
`,Tt=({label:t,action:e,disabled:i=!1})=>q`
  <button
    class="otp-resend"
    type="button"
    data-action=${e}
    ?disabled=${i}
  >
    ${t}
  </button>
`,zt=({title:t,message:e})=>q`
  <div class="empty-state">
    <p class="empty-state-title">${t}</p>
    <p class="empty-state-message">${e}</p>
  </div>
`,Rt=({label:t,subtitle:e,action:i,icon:r,disabled:o=!1})=>q`
  <button
    class="source-action source-action-${r}"
    type="button"
    data-action=${i}
    ?disabled=${o}
  >
    <span class="source-action-icon" aria-hidden="true">+</span>
    <span class="source-action-copy">
      <span class="source-action-title">${t}</span>
      ${e?q`<span class="source-action-subtitle">${e}</span>`:""}
    </span>
  </button>
`,Ot=({title:t,subtitle:e,content:i,width:r="default",ariaLabel:o="CommerceHub Connect",closeAction:s="close",showClose:n=!0,showFooter:a=!0})=>q`
  <section
    class="widget-shell ${"wide"===r?"widget-shell-wide":""}"
    aria-label=${o}
  >
    ${n?q`
          <button
            class="widget-close"
            type="button"
            aria-label="Close CommerceHub Connect"
            data-action=${s}
          >
            ×
          </button>
        `:""}
    <h2 class="widget-title">${t}</h2>
    ${e?q`<p class="widget-subtitle">${e}</p>`:""}
    <div class="widget-content">${i}</div>
    ${a?q`
  <footer class="powered-by-footer">
    <span>Powered by</span>
    <strong class="powered-by-brand">CommerceHub Connect</strong>
  </footer>
`:""}
  </section>
`;var Pt=function(t,e,i,r){for(var o,s=arguments.length,n=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,i,n):o(e,i))||n);return s>3&&n&&Object.defineProperty(e,i,n),n};const It="onSuccess",jt="onError",Ut=[{id:"visa-1111",label:"James Anderson",type:"card",brand:"VISA",last4:"1111",status:"verified",selected:!0},{id:"amex-8000",label:"James Anderson",type:"card",brand:"AMEX",last4:"8000",status:"unverified"}];let _t=class extends st{constructor(){super(...arguments),this.otpValue="",this.handleClick=t=>{const e=Kt(t,"paymentMethodId");if(e)return void(this.selectedPaymentSourceId=e);const i=Kt(t,"action");i&&("verify-otp"!==i?"resend-otp"!==i?"attach-payment-source"!==i||this.attachPaymentSource():this.resendOtp():this.verifyOtp())},this.handleInput=t=>{const e=t.composedPath().find(t=>t instanceof HTMLInputElement&&t.classList.contains("otp-input"));if(!e)return;e.value=e.value.replace(/\D/g,"").slice(-1);const i=[...this.renderRoot.querySelectorAll(".otp-input")];this.otpValue=i.map(t=>t.value).join("").slice(0,6),this.otpErrorMessage=void 0;const r=i[Number(e.dataset.otpIndex)+1];e.value&&r&&r.focus()}}willUpdate(t){t.has("interactionResponse")&&this.interactionResponse&&(this.selectedPaymentSourceId=Gt(this.interactionResponse,this.selectedPaymentSourceId))}updated(t){t.has("designConfig")&&this.syncDesignConfigStyles()}render(){return q`
      <div @click=${this.handleClick} @input=${this.handleInput}>
        ${this.renderCurrentScreen()}
      </div>
    `}renderCurrentScreen(){const t=this.interactionResponse?.status;return"OTP_VALIDATION_PENDING"===t||"OTP_VALIDATION_FAILED"===t?this.renderOtpScreen(t):this.renderPaymentSourceScreen()}renderOtpScreen(t){const e=Mt(this.designConfig),i="OTP_VALIDATION_FAILED"===t,r="verify-otp"===this.pendingAction,o="resend-otp"===this.pendingAction,s=this.interactionResponse?.email;return Ot({title:e.title,subtitle:e.subtitle??Dt(s),content:q`
        <div class="otp-flow">
          ${i?Ct({variant:"danger",message:this.otpErrorMessage??e.failedMessage}):""}
          ${Et({label:"Verification code",value:this.otpValue,length:6,disabled:r,error:i})}
          <div class="otp-resend-row">
            <span class="otp-resend-prefix">${e.resendPrefix}</span>
            ${Tt({label:o?e.resendPendingButton:e.resendButton,action:"resend-otp",disabled:r||o})}
          </div>
          <div class="primitive-footer">
            ${At({label:r?e.verifyingButton:i?e.tryAgainButton:e.verifyButton,variant:"primary",action:"verify-otp",disabled:r||this.otpValue.length<6})}
          </div>
        </div>
      `})}renderPaymentSourceScreen(){const t=Nt(this.designConfig),e=Ht(this.interactionResponse,this.selectedPaymentSourceId);return e.length?Ot({title:t.title,subtitle:t.subtitle,content:q`
        <div class="payment-flow">
          <div
            class="primitive-stack"
            role="radiogroup"
            aria-label="Payment methods"
          >
            ${e.map(t=>(({id:t,label:e,status:i,type:r,eyebrow:o,brand:s,last4:n,selected:a=!1,disabled:c=!1})=>{const d={type:r,eyebrow:o,brand:s,last4:n};return q`
    <button
      class="payment-method-row"
      type="button"
      role="radio"
      aria-checked=${a?"true":"false"}
      aria-disabled=${c?"true":"false"}
      data-payment-method-id=${t}
      ?disabled=${c}
    >
      <span class="payment-method-text">
        <span class="payment-method-eyebrow"
          >${(({type:t,eyebrow:e})=>e||("bank"===t?"Saved bank account":"Saved credit card"))(d)}</span
        >
        <span class="payment-method-title">${(({brand:t,last4:e})=>`${t} •••• ${e}`)(d)}</span>
        <span class="payment-method-holder">${e}</span>
        <span class="payment-method-status status-text-${i}">
          ${(t=>"verified"===t?"Verified":"pending"===t?"Further info required":"Not verified")(i)}
        </span>
      </span>
      <span class="payment-method-chevron" aria-hidden="true">›</span>
    </button>
  `})(t))}
          </div>
          <div class="primitive-actions">
            ${Rt({label:t.addBankAccountTitle,subtitle:t.addBankAccountSubtitle,action:"add-bank-account",icon:"bank",disabled:"attach-payment-source"===this.pendingAction})}
            ${Rt({label:t.addCardTitle,subtitle:t.addCardSubtitle,action:"add-card",icon:"card",disabled:"attach-payment-source"===this.pendingAction})}
          </div>
          <div class="primitive-footer">
            ${At({label:"attach-payment-source"===this.pendingAction?t.continuingButton:t.continueButton,variant:"primary",action:"attach-payment-source",disabled:"attach-payment-source"===this.pendingAction||!this.selectedPaymentSourceId})}
          </div>
        </div>
      `}):this.renderNoSavedPaymentMethods()}renderNoSavedPaymentMethods(){const t=Bt(this.designConfig);return Ot({title:t.title,subtitle:t.subtitle,content:q`
        <div class="payment-flow">
          ${zt({title:t.emptyTitle,message:t.emptyMessage})}
          <div class="primitive-actions">
            ${Rt({label:t.addBankAccountTitle,subtitle:t.addBankAccountSubtitle,action:"add-bank-account",icon:"bank"})}
            ${Rt({label:t.addCardTitle,subtitle:t.addCardSubtitle,action:"add-card",icon:"card"})}
          </div>
        </div>
      `})}async verifyOtp(){if(this.otpValue.length<6)return;const t=this.requireInteractionId();if(t){this.pendingAction="verify-otp";try{const e=await this.createSdkClient(t).POST("/interaction/otp/validate",{body:{otp:this.otpValue,email:this.interactionResponse?.email,channel:"EMAIL"}}),i=Qt(e);this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk(i)}catch(t){this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk({...this.interactionResponse,status:"OTP_VALIDATION_FAILED"})}finally{this.pendingAction=void 0}}}async resendOtp(){const t=this.requireInteractionId();if(t){this.pendingAction="resend-otp";try{const e=await this.createSdkClient(t).POST("/interaction/otp/send/email"),i=Qt(e);this.otpErrorMessage=void 0,this.setInteractionResponseFromSdk(i)}catch(t){}finally{this.pendingAction=void 0}}}async attachPaymentSource(){const t=this.requireInteractionId();if(t&&this.selectedPaymentSourceId){this.pendingAction="attach-payment-source";try{const e=await this.createSdkClient(t).POST("/interaction/payment-source/{paymentSourceId}/attach",{params:{path:{paymentSourceId:this.selectedPaymentSourceId}}}),i=Qt(e);this.setInteractionResponseFromSdk(i)}catch(t){}finally{this.pendingAction=void 0}}}requireInteractionId(){const t=this.interactionResponse?.interactionId;if(t)return t}createSdkClient(t){return $t({getHeaders:()=>({"x-interaction-id":t})})}setInteractionResponseFromSdk(t){this.interactionResponse=t}syncDesignConfigStyles(){for(const t of Lt)this.style.removeProperty(t);const t=this.designConfig?.colors;if(t)for(const{field:e,property:i}of qt){const r=t[e];r&&this.style.setProperty(i,r)}const e=this.designConfig?.baseFontSize;e?this.style.fontSize=e:this.style.removeProperty("font-size")}};_t.styles=kt,Pt([dt({attribute:!1})],_t.prototype,"interactionResponse",void 0),Pt([dt({attribute:!1})],_t.prototype,"designConfig",void 0),Pt([ht()],_t.prototype,"selectedPaymentSourceId",void 0),Pt([ht()],_t.prototype,"otpValue",void 0),Pt([ht()],_t.prototype,"pendingAction",void 0),Pt([ht()],_t.prototype,"otpErrorMessage",void 0),_t=Pt([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("commerce-hub-connect")],_t);const Dt=t=>`Enter the 6-digit code sent to ${t??"your email address"}.`,Mt=t=>{const e=t?.copy?.otp;return{title:e?.title??"Verify your email",subtitle:e?.subtitle,failedMessage:e?.failedMessage??"The code does not match. Try again.",resendPrefix:e?.resendPrefix??"Did not receive a code?",resendButton:e?.resendButton??"Resend code in 30s",resendPendingButton:e?.resendPendingButton??"Sending code...",verifyButton:e?.verifyButton??"Verify code",verifyingButton:e?.verifyingButton??"Verifying...",tryAgainButton:e?.tryAgainButton??"Try again"}},Nt=t=>{const e=t?.copy?.paymentMethods;return{title:e?.title??"Payment methods",subtitle:e?.subtitle??"Use a saved bank account or credit card, or add a new payment method.",addBankAccountTitle:e?.addBankAccountTitle??"Add new bank account",addBankAccountSubtitle:e?.addBankAccountSubtitle??"Connect a different account",addCardTitle:e?.addCardTitle??"Add credit card",addCardSubtitle:e?.addCardSubtitle??"Use card number and CVV",continueButton:e?.continueButton??"Continue",continuingButton:e?.continuingButton??"Continuing..."}},Bt=t=>{const e=t?.copy?.noSavedPaymentMethods;return{title:e?.title??"Payment methods",subtitle:e?.subtitle??"Add a bank account or credit card to continue.",emptyTitle:e?.emptyTitle??"No saved payment methods",emptyMessage:e?.emptyMessage??"There are no reusable payment methods available for this interaction.",addBankAccountTitle:e?.addBankAccountTitle??"Add new bank account",addBankAccountSubtitle:e?.addBankAccountSubtitle??"Connect a different account",addCardTitle:e?.addCardTitle??"Add credit card",addCardSubtitle:e?.addCardSubtitle??"Use card number and CVV"}},qt=[{field:"primary",property:"--chc-primary"},{field:"text",property:"--chc-text"},{field:"copy",property:"--chc-copy"},{field:"muted",property:"--chc-muted"},{field:"placeholder",property:"--chc-placeholder"},{field:"surface",property:"--chc-surface"},{field:"softSurface",property:"--chc-soft-surface"},{field:"border",property:"--chc-border"},{field:"borderStrong",property:"--chc-border-strong"},{field:"success",property:"--chc-success"},{field:"successBackground",property:"--chc-success-bg"},{field:"successBorder",property:"--chc-success-border"},{field:"danger",property:"--chc-danger"},{field:"dangerBackground",property:"--chc-danger-bg"},{field:"dangerBorder",property:"--chc-danger-border"},{field:"warning",property:"--chc-warning"},{field:"warningBackground",property:"--chc-warning-bg"},{field:"warningBorder",property:"--chc-warning-border"},{field:"disabledText",property:"--chc-disabled-text"},{field:"disabledSurface",property:"--chc-disabled-surface"}],Lt=qt.map(({property:t})=>t),Ht=(t,e)=>{const i=t?.paymentSources;if(!i?.length)return"PAYMENT_SOURCE_REQUESTED"===t?.status?[]:Ut;const r=e??t?.selectedSource?.id;return i.map(t=>Vt(t,r))},Vt=(t,e)=>({id:t.id??t.name??t.tenderType,label:t.name??Ft(t),type:"BankAccount"===t.tenderType?"bank":"card",brand:Jt(t),last4:Wt(t),status:Yt(t.verificationInfo?.status),selected:Boolean(t.id&&t.id===e)}),Ft=t=>"Card"===t.tenderType?"Saved card":"BankAccount"===t.tenderType?"Saved bank account":"Dynamic session card",Jt=t=>"Card"===t.tenderType?t.card?.network??"Card":"BankAccount"===t.tenderType?t.bankAccount?.bankName??"Bank account":"DSC",Wt=t=>"Card"===t.tenderType?Xt(t.card?.cardNumber):"BankAccount"===t.tenderType?Xt(t.bankAccount?.accountNumber):Xt(t.id),Gt=(t,e)=>{const i=t?.paymentSources;if(i?.length)return e&&i.some(t=>t.id===e)?e:t?.selectedSource?.id??i[0].id},Qt=t=>{if(t.data)return t.data;throw new Error(Zt(t.error))},Zt=t=>"string"==typeof t?t:t&&"object"==typeof t&&"message"in t&&"string"==typeof t.message?t.message:"CommerceHub API request failed.",Kt=(t,e)=>{const i=t.composedPath().find(t=>t instanceof HTMLElement&&Boolean(t.dataset[e]));return i?.dataset[e]},Xt=t=>t&&t.length>=4?t.slice(-4):"----",Yt=t=>"VERIFIED"===t?"verified":"UNDER_REVIEW"===t||"REQUIRE_INFO"===t?"pending":"unverified";export{_t as CommerceHubConnect,xt as DEFAULT_COMMERCE_HUB_BASE_URL,jt as ON_ERROR_EVENT,It as ON_SUCCESS_EVENT,$t as createCommerceHubClient};
