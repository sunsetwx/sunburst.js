/* sunburst.js v1.2.2 | (c) SunsetWx, LLC. and other contributors | ISC License */
var SunburstJS=(function(){"use strict";var e={TIMEOUT:30,EXPIRES_IN:604800,SCOPE:["predictions"],CLOCK_SKEW_OFFSET:300,BASE_URL:"https://sunburst.sunsetwx.com/v1"},t=Object.freeze({default:e,__moduleExports:e});const r=[];"undefined"!=typeof navigator&&navigator.userAgent&&r.push(navigator.userAgent),"undefined"!=typeof process&&process.versions&&r.push(Object.keys(process.versions).map(e=>`${e}/${process.versions[e]}`).join(" ")),r.push("sunburst.js/1.2.2");var s=r.join(" "),o=Object.freeze({default:s,__moduleExports:s}),n=class extends Error{constructor(e,t){super(e),this.name="RequestError",this.statusCode=t}},a=Object.freeze({default:n,__moduleExports:n}),c={encode:e=>btoa(e)},u=Object.freeze({default:c,__moduleExports:c}),i={snakeToCamel:e=>e.replace(/_[a-zA-Z]/g,e=>e.toUpperCase().replace("_","")),camelToSnake:e=>e.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`),convertCaseKeys(e,t){if(Array.isArray(e)){const r=[];for(let s=0;s<e.length;s++)null===e[s]||!Array.isArray(e[s])&&"object"!=typeof e[s]?r[s]=e[s]:r[s]=this.convertCaseKeys(e[s],t);return r}if(e&&"object"==typeof e){const r={};return Object.keys(e).forEach(s=>{const o=t(s);null!==e[s]&&"object"==typeof e[s]?r[o]=this.convertCaseKeys(e[s],t):r[o]=e[s]}),r}return e}},p=Object.freeze({default:i,__moduleExports:i});const l=e=>Object.keys(e).map(t=>void 0!==e[t]?encodeURIComponent(t)+"="+encodeURIComponent(e[t]):null).join("&");var d=({uri:e,method:t="GET",headers:r={},qs:s,formData:o,body:n,timeout:a})=>new Promise((c,u)=>{try{n&&(n=JSON.stringify(n),r["content-type"]="application/json; charset=utf-8"),o&&(n=l(o),r["content-type"]="application/x-www-form-urlencoded; charset=utf-8"),s&&(e=`${e}?${l(s)}`)}catch(e){return u(e)}const i=new XMLHttpRequest;i.open(t,e),Object.keys(r).forEach(e=>i.setRequestHeader(e,r[e])),i.onerror=(()=>{if(i.readyState!==XMLHttpRequest.DONE||0!==i.status)return u(new Error(i.statusText||`unknown request error: ${e}`))}),i.onabort=(()=>u(new Error(`request timeout: ${e}`))),i.onload=(()=>c({response:i.response,statusCode:i.status})),a>0&&setTimeout(()=>i.abort(),1e3*a),i.send(n)}),f=Object.freeze({default:d,__moduleExports:d}),h=e=>Array.isArray(e)?e.join(","):"object"==typeof e?e.coordinates.join(","):e,m=Object.freeze({default:h,__moduleExports:h}),y=e=>e instanceof Date?e.toISOString():"number"==typeof e?new Date(e).toISOString():e,_=Object.freeze({default:y,__moduleExports:y}),E=m&&h||m,O=_&&y||_;const S=e=>(e.geo=E(e.geo),e.after=O(e.after),e);var b={get:S,post:e=>e.map(e=>S(e))},g=b.get,q=b.post,j=Object.freeze({default:b,__moduleExports:b,get:g,post:q}),v={get:e=>(e.geo=E(e.geo),e)},T=v.get,w=Object.freeze({default:v,__moduleExports:v,get:T}),k={quality:j&&b||j,location:w&&v||w},x=k.quality,C=k.location,D=Object.freeze({default:k,__moduleExports:k,quality:x,location:C}),z={params:D&&k||D},I=z.params,P=Object.freeze({default:z,__moduleExports:z,params:I}),$=t&&e||t,A=o&&s||o,R=a&&n||a,K=u&&c||u,L=p&&i||p,U=f&&d||f,B=P&&z||P,N=function(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){return(function s(o,n){try{var a=t[o](n),c=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(c).then(function(e){s("next",e)},function(e){s("throw",e)});e(c)})("next")})}},J=class{constructor(e){const t={clientId:"",clientSecret:"",expiresIn:$.EXPIRES_IN,scope:$.SCOPE,origins:[],addresses:[],token:null,timeout:$.TIMEOUT,clockSkewOffset:$.CLOCK_SKEW_OFFSET,userAgent:A,baseUrl:$.BASE_URL};this._state=Object.assign({},t,e)}request(e={},t){var r=this;const{path:s,method:o="GET",headers:n={},qs:a,formData:c,body:u}=e;return new Promise((i=N(function*(i,p){try{t&&(i=t.resolve,p=t.reject);const l={"user-agent":r._state.userAgent};if(!n.authorization){const{accessToken:e}=yield r.getToken({forceRefresh:t});l.authorization=`Bearer ${e}`}const d=yield U({method:o,uri:`${r._state.baseUrl}${s}`,headers:Object.assign({},l,n),qs:L.convertCaseKeys(a,L.camelToSnake),formData:L.convertCaseKeys(c,L.camelToSnake),body:L.convertCaseKeys(u,L.camelToSnake),timeout:r._state.timeout}),f=JSON.parse(d.response);return f.error?401!==d.statusCode||t?p(new R(f.error,d.statusCode)):r.request(e,{resolve:i,reject:p}):i(L.convertCaseKeys(f,L.snakeToCamel))}catch(e){try{if("number"!=typeof e.statusCode)return p(e);const{error:t}=JSON.parse(e.message);return p(new R(t||e.message,e.statusCode))}catch(t){return p(e)}}}),function(e,t){return i.apply(this,arguments)}));var i}createSession({email:e,password:t,passcode:r,scope:s,type:o="permanent",params:n={}}){var a,c=this;return new Promise((a=N(function*(a,u){try{const i={grant_type:"password",scope:s.join(" "),type:o,passcode:r},p=`${e}:${t}`,l=K.encode(p),{session:d}=yield c.request({method:"POST",path:"/login",headers:{authorization:`Basic ${l}`},formData:Object.assign({},i,n)});return d.scope=d.scope.split(" "),a(d)}catch(e){return u(e)}}),function(e,t){return a.apply(this,arguments)}))}getToken({forceRefresh:e,preventStore:t}){var r,s=this;return new Promise((r=N(function*(r,o){if(!e&&s._state.token&&"object"==typeof s._state.token){const{token:e,clockSkewOffset:t}=s._state,{accessToken:o,expires:n}=e;if(n-1e3*t-(new Date).valueOf()>0)return r({accessToken:o,expires:n})}try{if(!s._state.clientId||!s._state.clientSecret)throw new Error("create a new instance of SunburstJS with both clientId and clientSecret options set");const e=`${s._state.clientId}:${s._state.clientSecret}`,n=K.encode(e),{accessToken:a,expiresIn:c}=yield s.request({method:"POST",path:"/login/session",headers:{authorization:`Basic ${n}`},formData:{grant_type:"client_credentials",expires_in:s._state.expiresIn,scope:s._state.scope.join(" "),origins:s._state.origins.join(" "),addresses:s._state.addresses.join(" ")}}),u=1e3*c+(new Date).valueOf();return t||(s._state.token={accessToken:a,expires:u}),r({accessToken:a,expires:u})}catch(e){return o(e)}}),function(e,t){return r.apply(this,arguments)}))}logout(){var e,t=this;return new Promise((e=N(function*(e,r){try{const s=yield t.request({method:"POST",path:"/logout"});return t._state.token=null,e(s)}catch(e){return r(e)}}),function(t,r){return e.apply(this,arguments)}))}sessions(e={}){return this.request({path:"/account/sessions",qs:e})}deleteSessionById(e={id:""}){return this.request({method:"DELETE",path:`/account/session/${e.id}`,formData:e})}deleteSessions(e={}){return this.request({method:"DELETE",path:"/account/sessions",formData:e})}account(){return this.request({path:"/account"})}deleteAccount(e={}){return this.request({method:"DELETE",path:"/account",formData:e})}passwordReset(e={}){return this.request({method:"POST",path:"/account/password/reset",formData:e})}updateEmail(e={}){return this.request({method:"POST",path:"/account/email",formData:e})}updateMfa(e={}){return this.request({method:"POST",path:"/account/mfa",formData:e})}totpSecret(){return this.request({path:"/account/mfa/totp"})}mfa(){return this.request({path:"/account/mfa"})}coordinates(e={}){return this.request({path:"/coordinates",qs:e})}location(e={}){return this.request({path:"/location",qs:B.params.location.get(e)})}quality(e={}){return this.request({path:"/quality",qs:B.params.quality.get(e)})}batchQuality(e=[]){return this.request({method:"POST",path:"/quality",body:B.params.quality.post(e)})}},M=Object.freeze({default:J,__moduleExports:J});return M&&J||M})();
