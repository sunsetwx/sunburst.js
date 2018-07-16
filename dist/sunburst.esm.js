/* sunburst.js v2.1.1 | (c) SunsetWx, LLC. and other contributors | ISC License */
const defaults={TIMEOUT:30,EXPIRES_IN:604800,SCOPE:["predictions"],CLOCK_SKEW_OFFSET:300,BASE_URL:"https://sunburst.sunsetwx.com/v1"};var defaults_1=defaults,defaults$1=Object.freeze({default:defaults_1,__moduleExports:defaults_1});const userAgent=[];"undefined"!=typeof navigator&&navigator.userAgent&&userAgent.push(navigator.userAgent),"undefined"!=typeof process&&process.versions&&userAgent.push(Object.keys(process.versions).map(e=>`${e}/${process.versions[e]}`).join(" ")),userAgent.push("sunburst.js/2.1.1");const USER_AGENT=userAgent.join(" ");var userAgent_1=USER_AGENT,userAgent$1=Object.freeze({default:userAgent_1,__moduleExports:userAgent_1});class RequestError extends Error{constructor(e,t){super(),this.message=e.error,e.error_description&&(this.message=e.error_description),this.name="RequestError",this.statusCode=t,this.error=e.error,this.error_description=e.error_description}}var requestError=RequestError,requestError$1=Object.freeze({default:requestError,__moduleExports:requestError});const Base64={encode:e=>btoa(e)};var browser=Base64,browser$1=Object.freeze({default:browser,__moduleExports:browser});const Case={snakeToCamel:e=>e.replace(/_[a-zA-Z]/g,e=>e.toUpperCase().replace("_","")),camelToSnake:e=>e.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`),convertCaseKeys(e,t){if(Array.isArray(e)){const s=[];for(let r=0;r<e.length;r++)null===e[r]||!Array.isArray(e[r])&&"object"!=typeof e[r]?s[r]=e[r]:s[r]=this.convertCaseKeys(e[r],t);return s}if(e&&"object"==typeof e){const s={};return Object.keys(e).forEach(r=>{const a=t(r);null!==e[r]&&"object"==typeof e[r]?s[a]=this.convertCaseKeys(e[r],t):s[a]=e[r]}),s}return e}};var _case=Case,_case$1=Object.freeze({default:_case,__moduleExports:_case});const serialize=e=>Object.keys(e).map(t=>void 0!==e[t]?encodeURIComponent(t)+"="+encodeURIComponent(e[t]):null).join("&"),request=({uri:e,method:t="GET",headers:s={},qs:r,formData:a,body:o,timeout:n})=>new Promise((u,i)=>{try{o&&(o=JSON.stringify(o),s["content-type"]="application/json; charset=utf-8"),a&&(o=serialize(a),s["content-type"]="application/x-www-form-urlencoded; charset=utf-8"),r&&(e=`${e}?${serialize(r)}`)}catch(e){return i(e)}const c=new XMLHttpRequest;c.open(t,e),Object.keys(s).forEach(e=>c.setRequestHeader(e,s[e])),c.onerror=(()=>{if(c.readyState!==XMLHttpRequest.DONE||0!==c.status)return i(new Error(c.statusText||`unknown request error: ${e}`))}),c.onabort=(()=>i(new Error(`request timeout: ${e}`))),c.onload=(()=>u({response:c.response,statusCode:c.status})),n>0&&setTimeout(()=>c.abort(),1e3*n),c.send(o)});var browser$2=request,browser$3=Object.freeze({default:browser$2,__moduleExports:browser$2});const geo=e=>Array.isArray(e)?e.join(","):"object"==typeof e?e.coordinates.join(","):"string"==typeof e?e.replace(/\s+/g,""):e;var geo_1=geo,geo$1=Object.freeze({default:geo_1,__moduleExports:geo_1});const isoTimestamp=e=>e instanceof Date?e.toISOString():"number"==typeof e?new Date(e).toISOString():e;var isoTimestamp_1=isoTimestamp,isoTimestamp$1=Object.freeze({default:isoTimestamp_1,__moduleExports:isoTimestamp_1}),geo$2=geo$1&&geo_1||geo$1,isoTimestamp$2=isoTimestamp$1&&isoTimestamp_1||isoTimestamp$1;const get=e=>(e.geo=geo$2(e.geo),e.after=isoTimestamp$2(e.after),e),post=e=>e.map(e=>get(e));var quality={get:get,post:post},quality_1=quality.get,quality_2=quality.post,quality$1=Object.freeze({default:quality,__moduleExports:quality,get:quality_1,post:quality_2}),quality$2=quality$1&&quality||quality$1,params={quality:quality$2,location:location},params_1=params.quality,params_2=params.location,params$1=Object.freeze({default:params,__moduleExports:params,quality:params_1,location:params_2}),params$2=params$1&&params||params$1,parsers={params:params$2},parsers_1=parsers.params,parsers$1=Object.freeze({default:parsers,__moduleExports:parsers,params:parsers_1}),defaults$2=defaults$1&&defaults_1||defaults$1,USER_AGENT$1=userAgent$1&&userAgent_1||userAgent$1,RequestError$1=requestError$1&&requestError||requestError$1,Base64$1=browser$1&&browser||browser$1,Case$1=_case$1&&_case||_case$1,request$1=browser$3&&browser$2||browser$3,parsers$2=parsers$1&&parsers||parsers$1,asyncToGenerator=function(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,s){return function r(a,o){try{var n=t[a](o),u=n.value}catch(e){return void s(e)}if(!n.done)return Promise.resolve(u).then(function(e){r("next",e)},function(e){r("throw",e)});e(u)}("next")})}};class SunburstJS{constructor(e){const t={clientId:"",clientSecret:"",expiresIn:defaults$2.EXPIRES_IN,scope:defaults$2.SCOPE,origins:[],addresses:[],token:null,timeout:defaults$2.TIMEOUT,clockSkewOffset:defaults$2.CLOCK_SKEW_OFFSET,userAgent:USER_AGENT$1,baseUrl:defaults$2.BASE_URL};this._state=Object.assign({},t,e)}request(e={},t){var s=this;const{path:r,method:a="GET",headers:o={},qs:n,formData:u,body:i}=e;return new Promise((c=asyncToGenerator(function*(c,p){try{t&&(c=t.resolve,p=t.reject);const l={"user-agent":s._state.userAgent};if(!o.authorization){const{accessToken:e}=yield s.getToken({forceRefresh:t});l.authorization=`Bearer ${e}`}const d=yield request$1({method:a,uri:`${s._state.baseUrl}${r}`,headers:Object.assign({},l,o),qs:Case$1.convertCaseKeys(n,Case$1.camelToSnake),formData:Case$1.convertCaseKeys(u,Case$1.camelToSnake),body:Case$1.convertCaseKeys(i,Case$1.camelToSnake),timeout:s._state.timeout}),m=JSON.parse(d.response);return m.error?401!==d.statusCode||t?p(new RequestError$1(m,d.statusCode)):s.request(e,{resolve:c,reject:p}):c(Case$1.convertCaseKeys(m,Case$1.snakeToCamel))}catch(e){try{if("number"!=typeof e.statusCode)return p(e);const t=JSON.parse(e.message);return p(new RequestError$1(t||{error:e.message},e.statusCode))}catch(t){return p(e)}}}),function(e,t){return c.apply(this,arguments)}));var c}createSession({email:e,password:t,passcode:s,scope:r=defaults$2.SCOPE,type:a="permanent",params:o={}}){var n,u=this;return new Promise((n=asyncToGenerator(function*(n,i){try{const c={grant_type:"password",scope:r.join(" "),type:a,passcode:s},p=`${e}:${t}`,l=Base64$1.encode(p),{session:d}=yield u.request({method:"POST",path:"/login",headers:{authorization:`Basic ${l}`},formData:Object.assign({},c,o)});return d.scope=d.scope.split(" "),n(d)}catch(e){return i(e)}}),function(e,t){return n.apply(this,arguments)}))}getToken({forceRefresh:e,preventStore:t}){var s,r=this;return new Promise((s=asyncToGenerator(function*(s,a){if(!e&&r._state.token&&"object"==typeof r._state.token){const{token:e,clockSkewOffset:t}=r._state,{accessToken:a,expires:o}=e;if(o-1e3*t-(new Date).valueOf()>0)return s({accessToken:a,expires:o})}try{if(!r._state.clientId||!r._state.clientSecret)throw new Error("create a new instance of SunburstJS with both clientId and clientSecret options set");const e=`${r._state.clientId}:${r._state.clientSecret}`,o=Base64$1.encode(e),{accessToken:n,expiresIn:u}=yield r.request({method:"POST",path:"/login/session",headers:{authorization:`Basic ${o}`},formData:{grant_type:"client_credentials",expires_in:r._state.expiresIn,scope:r._state.scope.join(" "),origins:r._state.origins.join(" "),addresses:r._state.addresses.join(" ")}}),i=1e3*u+(new Date).valueOf();return t||(r._state.token={accessToken:n,expires:i}),s({accessToken:n,expires:i})}catch(e){return a(e)}}),function(e,t){return s.apply(this,arguments)}))}logout(){var e,t=this;return new Promise((e=asyncToGenerator(function*(e,s){try{const r=yield t.request({method:"POST",path:"/logout"});return t._state.token=null,e(r)}catch(e){return s(e)}}),function(t,s){return e.apply(this,arguments)}))}sessions(e={}){return this.request({path:"/account/sessions",qs:e})}deleteSessionById(e={id:""}){return this.request({method:"DELETE",path:`/account/session/${e.id}`,formData:e})}deleteSessions(e={}){return this.request({method:"DELETE",path:"/account/sessions",formData:e})}account(){return this.request({path:"/account"})}deleteAccount(e={}){return this.request({method:"DELETE",path:"/account",formData:e})}passwordReset(e={}){return this.request({method:"POST",path:"/account/password/reset",formData:e})}updateEmail(e={}){return this.request({method:"POST",path:"/account/email",formData:e})}updateMfa(e={}){return this.request({method:"POST",path:"/account/mfa",formData:e})}mfa(){return this.request({path:"/account/mfa"})}quality(e={}){return this.request({path:"/quality",qs:parsers$2.params.quality.get(e)})}batchQuality(e=[]){return this.request({method:"POST",path:"/quality",body:parsers$2.params.quality.post(e)})}}var sunburst=SunburstJS,sunburst$1=Object.freeze({default:sunburst,__moduleExports:sunburst}),SunburstJS$1=sunburst$1&&sunburst||sunburst$1,src=SunburstJS$1;export default src;
