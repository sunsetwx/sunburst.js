/* sunburst.js v1.1.0 | (c) SunsetWx, LLC. and other contributors | ISC License */
const TIMEOUT=30,EXPIRES_IN=604800,SCOPE=["predictions"],CLOCK_SKEW_OFFSET=300,BASE_URL="https://sunburst.sunsetwx.com/v1";var name="sunburst.js",version="1.1.0";const userAgent=[];"undefined"!=typeof navigator&&navigator.userAgent&&userAgent.push(navigator.userAgent),"undefined"!=typeof process&&process.versions&&userAgent.push(Object.keys(process.versions).map(e=>`${e}/${process.versions[e]}`).join(" ")),userAgent.push(`${name}/${version}`);const USER_AGENT=userAgent.join(" ");class RequestError extends Error{constructor(e,t){super(e),this.name="RequestError",this.statusCode=t}}var Base64={encode:e=>btoa(e)},Case={snakeToCamel:e=>e.replace(/_[a-zA-Z]/g,e=>e.toUpperCase().replace("_","")),camelToSnake:e=>e.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`),convertCaseKeys(e,t){if(Array.isArray(e)){const s=[];for(let r=0;r<e.length;r++)null===e[r]||!Array.isArray(e[r])&&"object"!=typeof e[r]?s[r]=e[r]:s[r]=this.convertCaseKeys(e[r],t);return s}if(e&&"object"==typeof e){const s={};return Object.keys(e).forEach(r=>{const o=t(r);null!==e[r]&&"object"==typeof e[r]?s[o]=this.convertCaseKeys(e[r],t):s[o]=e[r]}),s}return e}};const serialize=e=>Object.keys(e).map(t=>encodeURIComponent(t)+"="+encodeURIComponent(e[t])).join("&"),request=({uri:e,timeout:t,method:s="GET",headers:r={},qs:o,formData:n,body:a})=>new Promise((i,c)=>{try{a&&(a=JSON.stringify(a),r["content-type"]="application/json; charset=utf-8"),n&&(a=serialize(n),r["content-type"]="application/x-www-form-urlencoded; charset=utf-8"),o&&(e=`${e}?${serialize(o)}`)}catch(e){return c(e)}const u=new XMLHttpRequest;u.open(s,e),Object.keys(r).forEach(e=>u.setRequestHeader(e,r[e])),u.onerror=(()=>{if(u.readyState!==XMLHttpRequest.DONE||0!==u.status)return c(new Error(u.statusText||`unknown request error: ${e}`))}),u.onabort=(()=>c(new Error(`request timeout: ${e}`))),u.onload=(()=>i({response:u.response,statusCode:u.status})),t>0&&setTimeout(()=>u.abort(),1e3*t),u.send(a)}),geo=e=>Array.isArray(e)?e.join(","):"object"==typeof e?e.coordinates.join(","):e,isoTimestamp=e=>e instanceof Date?e.toISOString():"number"==typeof e?new Date(e).toISOString():e,get=e=>(e.geo=geo(e.geo),e.after=isoTimestamp(e.after),e),post=e=>e.map(e=>get(e));var quality=Object.freeze({get:get,post:post});const get$1=e=>(e.geo=geo(e.geo),e);var location=Object.freeze({get:get$1}),params={quality:quality,location:location},parsers={params:params},asyncToGenerator=function(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,s){return function r(o,n){try{var a=t[o](n),i=a.value}catch(e){return void s(e)}if(!a.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}("next")})}};class SunburstJS{constructor(e){const t={clientId:"",clientSecret:"",expiresIn:EXPIRES_IN,scope:SCOPE,origins:[],addresses:[],token:null,timeout:TIMEOUT,clockSkewOffset:CLOCK_SKEW_OFFSET,userAgent:USER_AGENT,baseUrl:BASE_URL};this._state=Object.assign({},t,e)}request(e={},t){var s=this;const{path:r,method:o="GET",headers:n={},qs:a,formData:i,body:c}=e;return new Promise((u=asyncToGenerator(function*(u,p){try{t&&(u=t.resolve,p=t.reject);const h={"user-agent":s._state.userAgent};if(!n.authorization){const{accessToken:e}=yield s.getToken({forceRefresh:t});h.authorization=`Bearer ${e}`}const l=yield request({method:o,uri:`${s._state.baseUrl}${r}`,headers:Object.assign({},h,n),qs:Case.convertCaseKeys(a,Case.camelToSnake),formData:Case.convertCaseKeys(i,Case.camelToSnake),body:Case.convertCaseKeys(c,Case.camelToSnake),timeout:s._state.timeout}),d=JSON.parse(l.response);return d.error?401!==l.statusCode||t?p(new RequestError(d.error,l.statusCode)):s.request(e,{resolve:u,reject:p}):u(Case.convertCaseKeys(d,Case.snakeToCamel))}catch(e){try{if("number"!=typeof e.statusCode)return p(e);const{error:t}=JSON.parse(e.message);return p(new RequestError(t||e.message,e.statusCode))}catch(t){return p(e)}}}),function(e,t){return u.apply(this,arguments)}));var u}createSession({email:e,password:t,passcode:s,scope:r,type:o="permanent",params:n={}}){var a,i=this;return new Promise((a=asyncToGenerator(function*(a,c){try{const u={grant_type:"password",scope:r.join(" "),type:o,passcode:s},p=`${e}:${t}`,h=Base64.encode(p),{session:l}=yield i.request({method:"POST",path:"/login",headers:{authorization:`Basic ${h}`},formData:Object.assign({},u,n)});return l.scope=l.scope.split(" "),a(l)}catch(e){return c(e)}}),function(e,t){return a.apply(this,arguments)}))}getToken({forceRefresh:e,preventStore:t}){var s,r=this;return new Promise((s=asyncToGenerator(function*(s,o){if(!e&&r._state.token&&"object"==typeof r._state.token){const{token:e,clockSkewOffset:t}=r._state,{accessToken:o,expires:n}=e;if(n-1e3*t-(new Date).valueOf()>0)return s({accessToken:o,expires:n})}try{if(!r._state.clientId||!r._state.clientSecret)throw new Error("create a new instance of SunburstJS with both clientId and clientSecret options set");const e=`${r._state.clientId}:${r._state.clientSecret}`,n=Base64.encode(e),{accessToken:a,expiresIn:i}=yield r.request({method:"POST",path:"/login/session",headers:{authorization:`Basic ${n}`},formData:{grant_type:"client_credentials",expires_in:r._state.expiresIn,scope:r._state.scope.join(" "),origins:r._state.origins.join(" "),addresses:r._state.addresses.join(" ")}}),c=1e3*i+(new Date).valueOf();return t||(r._state.token={accessToken:a,expires:c}),s({accessToken:a,expires:c})}catch(e){return o(e)}}),function(e,t){return s.apply(this,arguments)}))}logout(){var e,t=this;return new Promise((e=asyncToGenerator(function*(e,s){try{const r=yield t.request({method:"POST",path:"/logout"});return t._state.token=null,e(r)}catch(e){return s(e)}}),function(t,s){return e.apply(this,arguments)}))}sessions(e={}){return this.request({path:"/account/sessions",qs:e})}deleteSessionById(e={id:""}){return this.request({method:"DELETE",path:`/account/session/${e.id}`,formData:e})}deleteSessions(e={}){return this.request({method:"DELETE",path:"/account/sessions",formData:e})}account(){return this.request({path:"/account"})}deleteAccount(e={}){return this.request({method:"DELETE",path:"/account",formData:e})}passwordReset(e={}){return this.request({method:"POST",path:"/account/password/reset",formData:e})}updateEmail(e={}){return this.request({method:"POST",path:"/account/email",formData:e})}updateMfa(e={}){return this.request({method:"POST",path:"/account/mfa",formData:e})}totpSecret(){return this.request({path:"/account/mfa/totp"})}mfa(){return this.request({path:"/account/mfa"})}coordinates(e={}){return this.request({path:"/coordinates",qs:e})}location(e={}){return this.request({path:"/location",qs:parsers.params.location.get(e)})}quality(e={}){return this.request({path:"/quality",qs:parsers.params.quality.get(e)})}batchQuality(e=[]){return this.request({method:"POST",path:"/quality",body:parsers.params.quality.post(e)})}}export default SunburstJS;
