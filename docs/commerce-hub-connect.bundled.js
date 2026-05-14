/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:a,getOwnPropertyDescriptor:n,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:l}=Object,p=globalThis,u=p.trustedTypes,f=u?u.emptyScript:"",g=p.reactiveElementPolyfillSupport,b=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>!c(t,e),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:m};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&a(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=n(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=l(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??m)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[b("elementProperties")]=new Map,y[b("finalized")]=new Map,g?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=t=>t,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+A,_=`<${M}>`,z=document,E=()=>z.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,U="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,N=/>/g,R=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,L=/"/g,V=/^(?:script|style|textarea|title)$/i,Z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),D=Symbol.for("lit-noChange"),H=Symbol.for("lit-nothing"),B=new WeakMap,W=z.createTreeWalker(z,129);function J(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",c=j;for(let e=0;e<i;e++){const i=t[e];let a,n,h=-1,d=0;for(;d<i.length&&(c.lastIndex=d,n=c.exec(i),null!==n);)d=c.lastIndex,c===j?"!--"===n[1]?c=T:void 0!==n[1]?c=N:void 0!==n[2]?(V.test(n[2])&&(r=RegExp("</"+n[2],"g")),c=R):void 0!==n[3]&&(c=R):c===R?">"===n[0]?(c=r??j,h=-1):void 0===n[1]?h=-2:(h=c.lastIndex-n[2].length,a=n[1],c=void 0===n[3]?R:'"'===n[3]?L:I):c===L||c===I?c=R:c===T||c===N?c=j:(c=R,r=void 0);const l=c===R&&t[e+1].startsWith("/>")?" ":"";o+=c===j?i+_:h>=0?(s.push(a),i.slice(0,h)+C+i.slice(h)+A+l):i+A+(-2===h?e:l)}return[J(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const c=t.length-1,a=this.parts,[n,h]=q(t,e);if(this.el=K.createElement(n,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&a.length<c;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=h[o++],i=s.getAttribute(t).split(A),c=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:c[2],strings:i,ctor:"."===c[1]?Y:"?"===c[1]?tt:"@"===c[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(A)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(A),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],E()),W.nextNode(),a.push({type:2,index:++r});s.append(t[e],E())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(A,t+1));)a.push({type:7,index:r}),t+=A.length-1}r++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===D)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=P(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=X(t,r._$AS(t,e.values),r,s)),e}class F{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);W.currentNode=s;let r=W.nextNode(),o=0,c=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new G(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=i[++c]}o!==a?.index&&(r=W.nextNode(),o++)}return W.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=H,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),P(t)?t===H||null==t||""===t?(this._$AH!==H&&this._$AR(),this._$AH=H):t!==this._$AH&&t!==D&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==H&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new F(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new K(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new G(this.O(E()),this.O(E()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=H,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=H}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=X(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==D,o&&(this._$AH=t);else{const s=t;let c,a;for(t=r[0],c=0;c<r.length-1;c++)a=X(this,s[i+c],e,c),a===D&&(a=this._$AH[c]),o||=!P(a)||a!==this._$AH[c],a===H?t=H:t!==H&&(t+=(a??"")+r[c+1]),this._$AH[c]=a}o&&!s&&this.j(t)}j(t){t===H?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===H?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==H)}}class et extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??H)===D)return;const i=this._$AH,s=t===H&&i!==H||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==H&&(i===H||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(K,G),(w.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new G(e.insertBefore(E(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)})`
  :host {
    --chc-text: #101828;
    --chc-copy: #344054;
    --chc-muted: #667085;
    --chc-surface: #f3f5f8;
    --chc-border: #cbd5e1;
    --chc-badge-border: #e4e7ec;
    --chc-primary: #084acc;
    --chc-success: #047857;
    --chc-success-bg: #ecfdf3;
    --chc-success-border: #a6f4c5;
    --chc-danger: #b42318;
    --chc-danger-bg: #fef3f2;
    --chc-danger-border: #fecdca;
    --chc-warning: #b54708;
    --chc-warning-bg: #fffaeb;
    --chc-warning-border: #fedf89;
    --chc-disabled-text: #98a2b3;
    --chc-disabled-surface: #f2f4f7;
    --chc-page-bg: #edf2f7;
    --chc-font-family: 'Open Sans', Arial, sans-serif;
    --chc-radius-control: 8px;
    --chc-radius-shell: 12px;
    --chc-space-2: 8px;
    --chc-space-3: 12px;
    --chc-space-4: 16px;
    --chc-space-5: 20px;
    --chc-input-height: 42px;
    --chc-button-height: 44px;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-shell {
    width: 100%;
    max-width: 386px;
    padding: var(--chc-space-5);
    border-radius: var(--chc-radius-shell);
    background: #fff;
  }

  .widget-shell-wide {
    max-width: 430px;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
  }

  .widget-subtitle {
    margin: 4px 0 0;
    color: var(--chc-muted);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  .widget-content {
    margin-top: 18px;
  }

  .primitive-stack {
    display: grid;
    gap: var(--chc-space-2);
  }

  .primitive-actions {
    display: grid;
    gap: var(--chc-space-2);
    margin-top: var(--chc-space-3);
  }

  .primitive-footer {
    display: grid;
    margin-top: var(--chc-space-4);
  }

  .button {
    min-height: var(--chc-button-height);
    border: 1px solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0 var(--chc-space-4);
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: #fff;
    color: var(--chc-copy);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  .field {
    display: grid;
    gap: 7px;
    min-width: 0;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--chc-copy);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  .field-input {
    width: 100%;
    height: var(--chc-input-height);
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 var(--chc-space-3);
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    font-size: 14px;
    line-height: 20px;
  }

  .field-input::placeholder {
    color: var(--chc-muted);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 14px;
  }

  .otp-group {
    display: grid;
    gap: var(--chc-space-2);
  }

  .otp-label {
    color: var(--chc-copy);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  .otp-inputs {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 51px));
    gap: var(--chc-space-2);
  }

  .otp-input {
    width: 51px;
    height: 48px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    color: var(--chc-text);
    font: inherit;
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
  }

  .alert {
    min-height: 50px;
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: var(--chc-radius-control);
    padding: var(--chc-space-3);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
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
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
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
    min-height: 64px;
    display: grid;
    grid-template-columns: 18px 54px minmax(0, 1fr) auto;
    gap: var(--chc-space-3);
    align-items: center;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 12px;
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .payment-method-row[aria-checked='true'] {
    border-color: var(--chc-text);
  }

  .payment-method-row:disabled {
    border-color: #d0d5dd;
    background: #f9fafb;
    color: var(--chc-disabled-text);
    cursor: not-allowed;
    opacity: 0.62;
  }

  .payment-method-radio {
    width: 18px;
    height: 18px;
    border: 1px solid var(--chc-border);
    border-radius: 999px;
    background: #fff;
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    margin: 4px;
    border-radius: 999px;
    background: var(--chc-text);
  }

  .payment-method-brand {
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--chc-badge-border);
    border-radius: 6px;
    background: var(--chc-surface);
    color: var(--chc-primary);
    font-size: 11px;
    font-weight: 700;
    line-height: 14px;
  }

  .payment-method-row:disabled .payment-method-brand {
    border-color: #d0d5dd;
    background: var(--chc-disabled-surface);
    color: var(--chc-disabled-text);
  }

  .payment-method-text {
    min-width: 0;
  }

  .payment-method-label {
    overflow: hidden;
    color: currentColor;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-meta {
    color: var(--chc-muted);
    font-size: 12px;
    line-height: 16px;
  }

  .payment-method-row:disabled .payment-method-meta {
    color: var(--chc-disabled-text);
  }

  .source-action {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    gap: var(--chc-space-3);
    border: 0;
    border-radius: var(--chc-radius-control);
    padding: 0 var(--chc-space-3);
    background: #fff;
    color: var(--chc-primary);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    cursor: pointer;
  }

  .source-action-icon {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
  }

  .detail-list {
    display: grid;
    gap: var(--chc-space-2);
  }

  .detail-row {
    min-height: 58px;
    display: grid;
    gap: 2px;
    border: 1px solid var(--chc-badge-border);
    border-radius: var(--chc-radius-control);
    padding: 8px var(--chc-space-3);
    background: #fff;
  }

  .detail-label {
    color: var(--chc-muted);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  .detail-value {
    color: var(--chc-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  @media (max-width: 420px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .otp-inputs {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }

    .otp-input {
      width: 100%;
    }
  }
`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,nt=({label:t,variant:e="primary",action:i,type:s="button",disabled:r=!1})=>Z`
  <button
    class="button button-${e}"
    type=${s}
    data-action=${(t=>t??H)(i)}
    ?disabled=${r}
  >
    ${t}
  </button>
`,ht=({id:t,label:e,brand:i,last4:s,status:r,selected:o=!1,disabled:c=!1})=>Z`
  <button
    class="payment-method-row"
    type="button"
    role="radio"
    aria-checked=${o?"true":"false"}
    aria-disabled=${c?"true":"false"}
    data-payment-method-id=${t}
    ?disabled=${c}
  >
    <span class="payment-method-radio" aria-hidden="true"></span>
    <span class="payment-method-brand">${i}</span>
    <span class="payment-method-text">
      <span class="payment-method-label">${e}</span>
      <span class="payment-method-meta">•••• ${s}</span>
    </span>
    ${(({status:t})=>{return Z`
  <span class="status-pill status-${t}">${e=t,`${e.charAt(0).toUpperCase()}${e.slice(1)}`}</span>
`;var e})({status:r})}
  </button>
`,dt=({label:t,action:e,icon:i})=>Z`
  <button class="source-action" type="button" data-action=${e}>
    ${(t=>"card"===t?Z`
      <svg
        class="source-action-icon"
        viewBox="0 0 14 14"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="1"
          y="3"
          width="12"
          height="8"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
        ></rect>
        <path d="M3 5.5h8" stroke="currentColor" stroke-width="1.2"></path>
        <path
          d="M5.2 8.7h3.6M7 6.9v3.6"
          stroke="currentColor"
          stroke-width="1.1"
          stroke-linecap="round"
        ></path>
      </svg>
    `:Z`
    <svg
      class="source-action-icon"
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 5h10L7 2 2 5Z" fill="currentColor"></path>
      <path
        d="M3 6h1.5v4H3V6Zm3.25 0h1.5v4h-1.5V6ZM10 6h1.5v4H10V6Z"
        fill="currentColor"
      ></path>
      <path
        d="M2.2 11h9.6"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
      ></path>
    </svg>
  `)(i)}
    <span>${t}</span>
  </button>
`;var lt=function(t,e,i,s){for(var r,o=arguments.length,c=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s,a=t.length-1;a>=0;a--)(r=t[a])&&(c=(o<3?r(c):o>3?r(e,i,c):r(e,i))||c);return o>3&&c&&Object.defineProperty(e,i,c),c};const pt=[{id:"visa-1111",label:"Visa saved card",brand:"VISA",last4:"1111",status:"verified",selected:!0},{id:"amex-8000",label:"Amex corporate card",brand:"AMEX",last4:"8000",status:"unverified"}];let ut=class extends ot{render(){return(({title:t,subtitle:e,content:i,width:s="default",ariaLabel:r="CommerceHub Connect"})=>Z`
  <section
    class="widget-shell ${"wide"===s?"widget-shell-wide":""}"
    aria-label=${r}
  >
    <h2 class="widget-title">${t}</h2>
    ${Z`<p class="widget-subtitle">${e}</p>`}
    <div class="widget-content">${i}</div>
  </section>
`)({title:"Payment method",subtitle:"Choose a saved payment method or add a new one.",content:Z`
        <div
          class="primitive-stack"
          role="radiogroup"
          aria-label="Payment methods"
        >
          ${pt.map(t=>ht(t))}
        </div>
        <div class="primitive-actions">
          ${dt({label:"Add card",action:"add-card",icon:"card"})}
          ${dt({label:"Add bank account",action:"add-bank-account",icon:"bank"})}
        </div>
        <div class="primitive-footer">
          ${nt({label:"Confirm",variant:"primary",action:"confirm"})}
        </div>
      `})}};ut.styles=at,ut=lt([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("commerce-hub-connect")],ut);export{ut as CommerceHubConnect};
