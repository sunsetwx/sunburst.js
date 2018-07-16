/* sunburst.js v2.1.1 | (c) SunsetWx, LLC. and other contributors | ISC License */
var SunburstJS=(function(){"use strict";var e={TIMEOUT:30,EXPIRES_IN:604800,SCOPE:["predictions"],CLOCK_SKEW_OFFSET:300,BASE_URL:"https://sunburst.sunsetwx.com/v1"},t=Object.freeze({default:e,__moduleExports:e});const r=[];"undefined"!=typeof navigator&&navigator.userAgent&&r.push(navigator.userAgent),"undefined"!=typeof process&&process.versions&&r.push(Object.keys(process.versions).map(e=>`${e}/${process.versions[e]}`).join(" ")),r.push("sunburst.js/2.1.1");var s=r.join(" "),o=Object.freeze({default:s,__moduleExports:s}),n=class extends Error{constructor(e,t){super(),this.message=e.error,e.error_description&&(this.message=e.error_description),this.name="RequestError",this.statusCode=t,this.error=e.error,this.error_description=e.error_description}},a=Object.freeze({default:n,__moduleExports:n}),c={encode:e=>btoa(e)},i=Object.freeze({default:c,__moduleExports:c}),u={snakeToCamel:e=>e.replace(/_[a-zA-Z]/g,e=>e.toUpperCase().replace("_","")),camelToSnake:e=>e.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`),convertCaseKeys(e,t){if(Array.isArray(e)){const r=[];for(let s=0;s<e.length;s++)null===e[s]||!Array.isArray(e[s])&&"object"!=typeof e[s]?r[s]=e[s]:r[s]=this.convertCaseKeys(e[s],t);return r}if(e&&"object"==typeof e){const r={};return Object.keys(e).forEach(s=>{const o=t(s);null!==e[s]&&"object"==typeof e[s]?r[o]=this.convertCaseKeys(e[s],t):r[o]=e[s]}),r}return e}},p=Object.freeze({default:u,__moduleExports:u});const d=e=>Object.keys(e).map(t=>void 0!==e[t]?encodeURIComponent(t)+"="+encodeURIComponent(e[t]):null).join("&");var l=({uri:e,method:t="GET",headers:r={},qs:s,formData:o,body:n,timeout:a})=>new Promise((c,i)=>{try{n&&(n=JSON.stringify(n),r["content-type"]="application/json; charset=utf-8"),o&&(n=d(o),r["content-type"]="application/x-www-form-urlencoded; charset=utf-8"),s&&(e=`${e}?${d(s)}`)}catch(e){return i(e)}const u=new XMLHttpRequest;u.open(t,e),Object.keys(r).forEach(e=>u.setRequestHeader(e,r[e])),u.onerror=(()=>{if(u.readyState!==XMLHttpRequest.DONE||0!==u.status)return i(new Error(u.statusText||`unknown request error: ${e}`))}),u.onabort=(()=>i(new Error(`request timeout: ${e}`))),u.onload=(()=>c({response:u.response,statusCode:u.status})),a>0&&setTimeout(()=>u.abort(),1e3*a),u.send(n)}),f=Object.freeze({default:l,__moduleExports:l}),h=e=>Array.isArray(e)?e.join(","):"object"==typeof e?e.coordinates.join(","):"string"==typeof e?e.replace(/\s+/g,""):e,m=Object.freeze({default:h,__moduleExports:h}),y=e=>e instanceof Date?e.toISOString():"number"==typeof e?new Date(e).toISOString():e,_=Object.freeze({default:y,__moduleExports:y}),E=m&&h||m,O=_&&y||_;const S=e=>(e.geo=E(e.geo),e.after=O(e.after),e);var b={get:S,post:e=>e.map(e=>S(e))},g=b.get,j=b.post,q=Object.freeze({default:b,__moduleExports:b,get:g,post:j}),v={quality:q&&b||q,location:location},T=v.quality,w=v.location,k=Object.freeze({default:v,__moduleExports:v,quality:T,location:w}),x={params:k&&v||k},C=x.params,D=Object.freeze({default:x,__moduleExports:x,params:C}),P=t&&e||t,I=o&&s||o,z=a&&n||a,$=i&&c||i,A=p&&u||p,R=f&&l||f,K=D&&x||D,L=function(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){return(function s(o,n){try{var a=t[o](n),c=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(c).then(function(e){s("next",e)},function(e){s("throw",e)});e(c)})("next")})}},U=class{constructor(e){const t={clientId:"",clientSecret:"",expiresIn:P.EXPIRES_IN,scope:P.SCOPE,origins:[],addresses:[],token:null,timeout:P.TIMEOUT,clockSkewOffset:P.CLOCK_SKEW_OFFSET,userAgent:I,baseUrl:P.BASE_URL};this._state=Object.assign({},t,e)}request(e={},t){var r=this;const{path:s,method:o="GET",headers:n={},qs:a,formData:c,body:i}=e;return new Promise((u=L(function*(u,p){try{t&&(u=t.resolve,p=t.reject);const d={"user-agent":r._state.userAgent};if(!n.authorization){const{accessToken:e}=yield r.getToken({forceRefresh:t});d.authorization=`Bearer ${e}`}const l=yield R({method:o,uri:`${r._state.baseUrl}${s}`,headers:Object.assign({},d,n),qs:A.convertCaseKeys(a,A.camelToSnake),formData:A.convertCaseKeys(c,A.camelToSnake),body:A.convertCaseKeys(i,A.camelToSnake),timeout:r._state.timeout}),f=JSON.parse(l.response);return f.error?401!==l.statusCode||t?p(new z(f,l.statusCode)):r.request(e,{resolve:u,reject:p}):u(A.convertCaseKeys(f,A.snakeToCamel))}catch(e){try{if("number"!=typeof e.statusCode)return p(e);const t=JSON.parse(e.message);return p(new z(t||{error:e.message},e.statusCode))}catch(t){return p(e)}}}),function(e,t){return u.apply(this,arguments)}));var u}createSession({email:e,password:t,passcode:r,scope:s=P.SCOPE,type:o="permanent",params:n={}}){var a,c=this;return new Promise((a=L(function*(a,i){try{const u={grant_type:"password",scope:s.join(" "),type:o,passcode:r},p=`${e}:${t}`,d=$.encode(p),{session:l}=yield c.request({method:"POST",path:"/login",headers:{authorization:`Basic ${d}`},formData:Object.assign({},u,n)});return l.scope=l.scope.split(" "),a(l)}catch(e){return i(e)}}),function(e,t){return a.apply(this,arguments)}))}getToken({forceRefresh:e,preventStore:t}){var r,s=this;return new Promise((r=L(function*(r,o){if(!e&&s._state.token&&"object"==typeof s._state.token){const{token:e,clockSkewOffset:t}=s._state,{accessToken:o,expires:n}=e;if(n-1e3*t-(new Date).valueOf()>0)return r({accessToken:o,expires:n})}try{if(!s._state.clientId||!s._state.clientSecret)throw new Error("create a new instance of SunburstJS with both clientId and clientSecret options set");const e=`${s._state.clientId}:${s._state.clientSecret}`,n=$.encode(e),{accessToken:a,expiresIn:c}=yield s.request({method:"POST",path:"/login/session",headers:{authorization:`Basic ${n}`},formData:{grant_type:"client_credentials",expires_in:s._state.expiresIn,scope:s._state.scope.join(" "),origins:s._state.origins.join(" "),addresses:s._state.addresses.join(" ")}}),i=1e3*c+(new Date).valueOf();return t||(s._state.token={accessToken:a,expires:i}),r({accessToken:a,expires:i})}catch(e){return o(e)}}),function(e,t){return r.apply(this,arguments)}))}logout(){var e,t=this;return new Promise((e=L(function*(e,r){try{const s=yield t.request({method:"POST",path:"/logout"});return t._state.token=null,e(s)}catch(e){return r(e)}}),function(t,r){return e.apply(this,arguments)}))}sessions(e={}){return this.request({path:"/account/sessions",qs:e})}deleteSessionById(e={id:""}){return this.request({method:"DELETE",path:`/account/session/${e.id}`,formData:e})}deleteSessions(e={}){return this.request({method:"DELETE",path:"/account/sessions",formData:e})}account(){return this.request({path:"/account"})}deleteAccount(e={}){return this.request({method:"DELETE",path:"/account",formData:e})}passwordReset(e={}){return this.request({method:"POST",path:"/account/password/reset",formData:e})}updateEmail(e={}){return this.request({method:"POST",path:"/account/email",formData:e})}updateMfa(e={}){return this.request({method:"POST",path:"/account/mfa",formData:e})}mfa(){return this.request({path:"/account/mfa"})}quality(e={}){return this.request({path:"/quality",qs:K.params.quality.get(e)})}batchQuality(e=[]){return this.request({method:"POST",path:"/quality",body:K.params.quality.post(e)})}},B=Object.freeze({default:U,__moduleExports:U});return B&&U||B})();
