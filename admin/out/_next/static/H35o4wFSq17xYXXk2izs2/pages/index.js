(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{RNiq:function(e,t,a){"use strict";a.r(t);var n=a("ln6h"),r=a.n(n),u=a("O40h"),c=a("q1tI"),s=a.n(c),l=(a("MLBV"),a("rUpX"),a("QcfS")),o=a("tCWA"),i=a("obyI"),d=a("fIpK");function p(){return m.apply(this,arguments)}function m(){return(m=Object(u.a)(r.a.mark(function e(){var t,a,n,u,c;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(o.a)(i.a.apiPrefix+"/resources/services.json",{headers:Object(d.e)({"Content-Type":"application/json"})});case 3:if(!(t=e.sent).ok){e.next=23;break}return e.next=7,t.json();case 7:a=e.sent,n=0;case 9:if(!(n<a.length)){e.next=20;break}if(u=a[n],c=u.last_sync){e.next=14;break}return e.abrupt("continue",17);case 14:c.startString=c.start,c.start=Date.parse(c.start),c.end&&(c.endString=c.end,c.end=Date.parse(c.end));case 17:++n,e.next=9;break;case 20:return e.abrupt("return",a);case 23:return e.next=25,Object(d.d)(t);case 25:e.next=30;break;case 27:throw e.prev=27,e.t0=e.catch(0),"Could not complete fetch: "+e.t0;case 30:case"end":return e.stop()}},e,null,[[0,27]])}))).apply(this,arguments)}function k(e){return f.apply(this,arguments)}function f(){return(f=Object(u.a)(r.a.mark(function e(t){var a,n,u;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=i.a.apiPrefix+"/resources/service/sync.json?service="+t,e.next=3,Object(o.a)(a,{method:"POST",headers:Object(d.e)({"Content-Type":"application/json","X-CSRF-Token":Object(l.b)()}),credentials:"include"});case 3:if((n=e.sent).ok){e.next=7;break}return e.next=7,Object(d.d)(n);case 7:return e.next=9,n.json();case 9:return u=e.sent,e.abrupt("return",u);case 11:case"end":return e.stop()}},e)}))).apply(this,arguments)}function b(){return h.apply(this,arguments)}function h(){return(h=Object(u.a)(r.a.mark(function e(){var t,a,n,u,c;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(o.a)(i.a.apiPrefix+"/resources/targets.json",{headers:Object(d.e)({"Content-Type":"application/json"})});case 3:if(!(t=e.sent).ok){e.next=12;break}return e.next=7,t.json();case 7:for(a=e.sent,n=0;n<a.length;++n)u=a[n],c=u.url.split("://"),u.kind=c[0],u.path=decodeURIComponent("file"===u.kind?c[1].substring(1):c[1]);return e.abrupt("return",a);case 12:return e.next=14,Object(d.d)(t);case 14:e.next=19;break;case 16:throw e.prev=16,e.t0=e.catch(0),"Could not complete fetch: "+e.t0;case 19:case"end":return e.stop()}},e,null,[[0,16]])}))).apply(this,arguments)}function v(e,t){return g.apply(this,arguments)}function g(){return(g=Object(u.a)(r.a.mark(function e(t,a){var n,u;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=i.a.apiPrefix+"/resources/target/"+t+".json?url="+encodeURIComponent(a),u=null,e.prev=2,e.next=5,Object(o.a)(n,{method:"POST",headers:Object(d.e)({"Content-Type":"application/json","X-CSRF-Token":Object(l.b)()}),credentials:"include"});case 5:if((u=e.sent).ok){e.next=9;break}return e.next=9,Object(d.d)(u);case 9:e.next=14;break;case 11:throw e.prev=11,e.t0=e.catch(2),"Could not complete fetch: "+e.t0;case 14:return e.prev=14,e.next=17,u.json();case 17:return e.abrupt("return",e.sent);case 20:throw e.prev=20,e.t1=e.catch(14),"Could not parse JSON: "+e.t1;case 23:case"end":return e.stop()}},e,null,[[2,11],[14,20]])}))).apply(this,arguments)}function y(e){return N.apply(this,arguments)}function N(){return(N=Object(u.a)(r.a.mark(function e(t){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",v("remove",t));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function x(e){return w.apply(this,arguments)}function w(){return(w=Object(u.a)(r.a.mark(function e(t){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",v("add",t));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}var j=a("Wgwc"),O=a.n(j),C=a("klpT"),_=s.a.createElement;function S(e){var t=e.name,a=e.kind,n=e.item,r=e.onConfigureClick,u="service"===a?"download":"upload";return _(s.a.Fragment,null,n.needs_app?_("div",{className:"uk-alert-warning","uk-alert":"true"},_("p",null,"Before you can ",u," your photos, first you have to set up access. Please visit ",t," and ",_("a",{href:n.app_create_url,target:"_blank"},"create an app"),", then return here and enter the credentials in settings. Be sure to set the return url to:"," ",_("code",null,document.location.protocol+"//"+document.location.host+"/auth/"+(n.kind||n.metadata.id)+"/return")),_("div",{className:"uk-panel"},_("p",{className:"uk-align-right"},_("a",{href:n.credential_redirect_url,className:"uk-button uk-button-primary",onClick:r},"Configure ",t)))):null,!n.needs_app&&n.needs_credentials?_("div",{className:"uk-alert-primary","uk-alert":"true"},_("p",null,"It looks like your permission is required before we can sync this ",a," for you. Clicking this button will send you to ",t,"\u2019s website, where you can grant permission, and you\u2019ll be returned here afterwards."),_("div",{className:"uk-panel"},_("p",{className:"uk-align-right"},_("a",{href:n.credential_redirect_url,className:"uk-button uk-button-primary"},"Grant Permission")))):null)}var D=s.a.createElement;function I(){return(I=Object(u.a)(r.a.mark(function e(t){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k(t.metadata.id);case 2:case"end":return e.stop()}},e)}))).apply(this,arguments)}function T(e){var t=e.service,a=Object(c.useState)(!1),n=a[0],r=a[1],u=t.last_sync,s=u?O()(u.start).fromNow():"Never",l=u&&u.end?O()(u.end).add(t.hours_per_sync,"hour"):O()(),o=l?""+l:"",i=u?u.startString:null,d=Object(c.useCallback)(function(e){e.stopPropagation(),function(e){I.apply(this,arguments)}(t)},[t]),p=Object(c.useCallback)(function(e){e.preventDefault(),r(!0)},[]),m=t.app_create_url.split("/")[2];return D("div",{className:"uk-card uk-card-default uk-card-hover uk-margin"},D("div",{className:"uk-card-header"},D("div",{className:"uk-grid-small uk-flex-middle","uk-grid":"true"},D("div",{className:"uk-width-auto"},D("img",{className:"uk-border",width:"40",height:"40",src:"/static/images/logo-"+t.metadata.id+".png"})),D("div",{className:"uk-width-expand"},D("h3",{className:"uk-card-title uk-margin-remove-bottom"},t.metadata.name),D("p",{className:"uk-text-meta uk-margin-remove-top"},"Last synced: ",D("time",{dateTime:i},s)," ",u?"("+(u.fetch_count||0)+" downloaded) ":null,"\u2014 Next sync: ",D("time",{dateTime:o},l.fromNow()))),n||!t.needs_credentials&&!t.needs_app?null:D("a",{href:"#",onClick:p,"uk-icon":"icon: cog"}))),n?D("div",{className:"uk-card-body uk-padding-remove-vertical uk-margin"},t.needs_app?D("p",null,"Visit ",t.metadata.name," to",D("a",{href:t.app_create_url,"uk-tooltip":m,target:"_blank"},"create an app"),","," ","then return here and enter the credentials below. Be sure to set the return url to"," ",D("code",null,document.location.protocol+"//"+document.location.host+"/auth/"+t.metadata.id+"/return")):D("p",null,"You already have credentials set up for ",t.metadata.name,". If you would like to set new"," ","app credentials, head over to their site to"," ",D("a",{href:t.app_create_url,"uk-tooltip":m,target:"_blank"},"create or update your app"),","," ","then return here and enter the credentials below. Be sure to set the return url to"," ",D("code",null,document.location.protocol+"//"+document.location.host+"/auth/"+t.metadata.id+"/return")),D(C.a,{secretName:t.metadata.id,setShowing:r})):null,n||!t.needs_app&&!t.needs_credentials?null:D("div",{className:"uk-card-body uk-padding-remove-vertical uk-margin"},D(S,{kind:"service",name:t.metadata.name,item:t,onConfigureClick:p})),D("div",{className:"uk-card-footer"},D("a",{href:"#",className:"uk-button uk-button-text"},"View details"),D("p",{className:"uk-align-right"},t.needs_credentials?null:D("button",{className:"uk-button uk-button-primary",disabled:t.current_sync,onClick:d},t.current_sync?"Syncing...":"Sync now"))))}var E=s.a.createElement;function A(e){var t=e.target,a=e.onRemoveClick,n=Object(c.useCallback)(function(e){e.preventDefault(),a(t)},[t,a]);return E("div",{className:"uk-card uk-card-default uk-card-hover uk-margin ts"},E("div",{className:"uk-card-header"},E("div",{className:"uk-grid-small uk-flex-middle","uk-grid":"true"},E("div",{className:"uk-width-auto"},"file"===t.kind?E("span",{className:"uk-border","uk-icon":"icon: folder; ratio: 2"}):E("img",{width:"40",height:"40",className:"uk-border",src:"/static/images/logo-"+t.kind+".png",alt:"Dropbox logo"})),E("div",{className:"uk-width-expand"},E("h3",{className:"uk-card-title uk-margin-remove-bottom uk-text-middle"},t.path)),E("div",{className:"uk-width-auto"},E("a",{className:"uk-close-small","uk-close":"true",onClick:n})))))}var R=a("nk4I"),P=s.a.createElement;function B(e,t,a){e("file"),t(""),a(!1)}function X(){return(X=Object(u.a)(r.a.mark(function e(t,a,n,u,c){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,x(t);case 3:B(n,u,c),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),a(""+e.t0);case 9:case"end":return e.stop()}},e,null,[[0,6]])}))).apply(this,arguments)}function W(e){switch(e){case"file":return"Local Directory";case"gdrive":return"Google Drive";case"dropbox":return"Dropbox";case"s3":return"S3"}return"Unknown"}function q(e){switch(e){case"file":return"/path/to/your/media/directory";case"gdrive":case"dropbox":return"/Mediasummon";case"s3":return"bucketname"}return"Unknown"}function F(e){switch(e){case"gdrive":case"dropbox":return"/Mediasummon"}return""}function K(e,t){return U.apply(this,arguments)}function U(){return(U=Object(u.a)(r.a.mark(function e(t,a){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.t0=t,e.next=4,Object(R.a)();case 4:e.t1=e.sent,(0,e.t0)(e.t1),e.next=11;break;case 8:e.prev=8,e.t2=e.catch(0),a(e.t2);case 11:case"end":return e.stop()}},e,null,[[0,8]])}))).apply(this,arguments)}function L(e){var t=e.enabled,n=e.setIsAdding,r=Object(c.useState)(null),u=r[0],s=r[1],l=Object(c.useState)(null),o=l[0],i=l[1],d=Object(c.useState)("file"),p=d[0],m=d[1],k=Object(c.useState)(F(p)),f=k[0],b=k[1],h=Object(c.useState)(void 0),v=h[0],g=h[1],y=Object(c.useState)(!1),N=y[0],x=y[1],w=Object(c.useCallback)(function(){B(m,b,n)},[]);Object(c.useEffect)(function(){var e=o&&t,n=null;return o&&(n=a("gyNX").modal(o),o.addEventListener("hidden",w)),n&&e&&n.show(),function(){n&&e&&n.hide()}},[o,t]),Object(c.useEffect)(function(){K(g,s)},[t]);var j=Object(c.useCallback)(function(e){e.preventDefault(),B(m,b,n)},[]),O=Object(c.useCallback)(function(e){i(e)},[]),_=Object(c.useCallback)(function(e){m(e.target.value),x(!1),b(F(e.target.value))},[]),D=Object(c.useCallback)(function(e){b(e.target.value)},[]),I=Object(c.useCallback)(function(e){e.preventDefault(),function(e,t,a,n,r){X.apply(this,arguments)}(p+"://"+("file"===p?"/":"")+f,s,m,b,n)},[p,f]),T=Object(c.useCallback)(function(e){e.preventDefault(),x(!0)},[]),E=Object(c.useCallback)(function(e){x(e),e||K(g,s)},[]),A=v?v[p]:null,R=A?A.app_create_url.split("/")[2]:null,U="file"===p||A&&!A.needs_credentials,L=N||!A||A.needs_credentials||A.needs_app;return P("div",{"uk-modal":"true",ref:O},P("div",{className:"uk-modal-dialog"},P("button",{className:"uk-modal-close-default",type:"button","uk-close":"true"}),P("div",{className:"uk-modal-header"},P("h2",{className:"uk-modal-title"},"Summon your media to an additional location")),P("div",{className:"uk-modal-body"},u?P("div",{className:"uk-alert-danger","uk-alert":"true"},P("p",null,P("span",{"uk-icon":"warning"})," ",u)):null,N&&A?P("div",{className:"uk-margin"},"s3"===p?null:A.needs_app?P("p",null,"Visit ",p," to"," ",P("a",{href:A.app_create_url,"uk-tooltip":R,target:"_blank"},"create an app"),","," ","then return here and enter the credentials below. Be sure to set the return url to:"," ",P("code",null,document.location.protocol+"//"+document.location.host+"/auth/"+p+"/return")):P("p",null,"You already have credentials set up for ",p,". If you would like to set new"," ","app credentials, head over to their site to"," ",P("a",{href:A.app_create_url,"uk-tooltip":R,target:"_blank"},"create or update your app"),","," ","then return here and enter the credentials below.  Be sure to set the return url to:"," ",P("code",null,document.location.protocol+"//"+document.location.host+"/auth/"+p+"/return")),P(C.a,{secretName:p,setShowing:E})):null,!N&&A&&(A.needs_app||A.needs_credentials)?P("div",{className:"uk-margin"},P(S,{kind:"target",name:p,item:A,onConfigureClick:T})):null,P("p",null,"Choose the location where you would like to save your media:"),P("form",{className:"uk-form uk-flex",onSubmit:I},P("input",{type:"submit",onSubmit:I,style:{display:"none"}}),P("span",{className:"uk-width-auto","uk-form-custom":"target: true"},P("input",{className:"uk-input uk-width-auto",type:"text",placeholder:W(p)}),P("select",{className:"uk-select",onChange:_,value:p},P("option",{value:"file"},W("file")),P("option",{value:"s3"},W("s3")),P("option",{value:"dropbox"},W("dropbox")),P("option",{value:"gdrive"},W("gdrive")))),P("input",{type:"text",className:"uk-input uk-width-expand",placeholder:q(p),onChange:D,value:f,disabled:!U}),L?null:P("a",{href:"#",onClick:T,className:"uk-flex uk-flex-right uk-padding-small uk-padding-remove-vertical uk-padding-remove-right","uk-icon":"icon: cog"}))),P("div",{className:"uk-modal-footer uk-text-right"},P("button",{className:"uk-button uk-button-default",type:"button",onClick:j},"Cancel"),P("button",{className:"uk-button uk-button-primary",type:"button",onClick:I,disabled:!U},"Save"))))}var M=a("b0oO"),V=a("zYID"),Y=a("8lYe");a.d(t,"default",function(){return Q});var J=s.a.createElement;function G(){return(G=Object(u.a)(r.a.mark(function e(t,n,u,c){var s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=a("gyNX"),e.prev=1,e.next=4,s.modal.confirm("Are you sure you want to remove this sync target? ("+t.path+")");case 4:e.next=9;break;case 6:return e.prev=6,e.t0=e.catch(1),e.abrupt("return");case 9:return e.prev=9,e.next=12,y(t.url);case 12:e.sent,u(n.filter(function(e){return e.url!==t.url})),e.next=19;break;case 16:e.prev=16,e.t1=e.catch(9),c(""+e.t1);case 19:return e.abrupt("return",!1);case 20:case"end":return e.stop()}},e,null,[[1,6],[9,16]])}))).apply(this,arguments)}function z(){return(z=Object(u.a)(r.a.mark(function e(t,a,n){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,Object(l.a)(t),e.t0=a,e.next=5,b();case 5:e.t1=e.sent,(0,e.t0)(e.t1),e.next=12;break;case 9:e.prev=9,e.t2=e.catch(0),n(""+e.t2);case 12:case"end":return e.stop()}},e,null,[[0,9]])}))).apply(this,arguments)}function Q(){var e=Object(c.useState)([]),t=e[0],a=e[1],n=Object(c.useState)([]),s=n[0],o=n[1],i=Object(c.useState)(null),d=i[0],m=i[1],k=Object(c.useState)(!1),f=k[0],b=k[1],h=Object(l.c)(),v=h.userConfig,g=h.token;Object(c.useEffect)(function(){void 0!==v&&function(e,t,a){z.apply(this,arguments)}(g,o,m)},[v,g,f]),Object(c.useEffect)(function(){if(void 0!==v){var e=null;return e=setTimeout(t,1e3),function(){return clearTimeout(e)}}function t(){return n.apply(this,arguments)}function n(){return(n=Object(u.a)(r.a.mark(function n(){return r.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.t0=a,n.next=4,p();case 4:n.t1=n.sent,(0,n.t0)(n.t1),e=setTimeout(t,1e3),n.next=12;break;case 9:n.prev=9,n.t2=n.catch(0),m(""+n.t2);case 12:case"end":return n.stop()}},n,null,[[0,9]])}))).apply(this,arguments)}},[v]);var y=Object(c.useCallback)(function(e){!function(e,t,a,n){G.apply(this,arguments)}(e,s,o,m)},[s]),N=Object(c.useCallback)(function(e){e.preventDefault(),b(!0)},[]);return void 0===v?J("div",{"uk-spinner":"ratio: 3",className:"uk-flex uk-flex-center uk-margin-xxlarge"}):J("div",{className:"toplevel"},J("div",{className:"content"},J(V.a,{userConfig:v}),J("div",{className:"uk-container"},J(M.a,{title:"Mediasummon"}),J(L,{setIsAdding:b,enabled:f}),d?J("div",{className:"uk-alert-danger","uk-alert":"true"},J("a",{className:"uk-alert-close","uk-close":"true"}),J("p",null,J("span",{"uk-icon":"warning"})," ",d)):null,J("div",{className:""},J("h3",null,"Summoning your media to these locations"),0===s.length?J("div",{"uk-spinner":"ratio: 3",className:"uk-flex uk-flex-center uk-margin-xxlarge"}):null,s.map(function(e){return J(A,{key:e.url,target:e,onRemoveClick:y})}),J("div",{className:"uk-flex uk-flex-center"},J("a",{href:"#","uk-icon":"icon: plus-circle; ratio: 2",onClick:N}))),J("div",{className:"uk-margin"},J("h3",null,"Summoning media from these services"),0===t.length?J("div",{"uk-spinner":"ratio: 3",className:"uk-flex uk-flex-center uk-margin-xxlarge"}):null,t.map(function(e){return J(T,{key:e.metadata.id,service:e})})))),J(Y.a,null))}},klpT:function(e,t,a){"use strict";a.d(t,"a",function(){return d});var n=a("ln6h"),r=a.n(n),u=a("O40h"),c=a("q1tI"),s=a.n(c),l=a("nk4I"),o=s.a.createElement;function i(){return(i=Object(u.a)(r.a.mark(function e(t,a,n,u){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(l.d)(t,a);case 2:u(),n&&n(!1);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function d(e){var t=e.secretName,a=e.setShowing,n=Object(c.useState)(void 0),r=n[0],u=n[1],l=Object(c.useState)(void 0),d=l[0],p=l[1],m=Object(c.useState)(void 0),k=m[0],f=m[1],b=Object(c.useState)(!1),h=b[0],v=b[1],g=Object(c.useCallback)(function(){r&&(r.value=""),d&&(d.value=""),k&&(k.value=""),v(!1)},[r,d,k]),y=Object(c.useCallback)(function(e){e.preventDefault(),a&&a(!1)},[]),N=Object(c.useCallback)(function(e){e.preventDefault(),v(!0);var n=r?r.value:null,u=d?d.value:null,c=k?k.value:null;!function(e,t,a,n){i.apply(this,arguments)}(t,"s3"===t?{aws_access_key_id:n,aws_secret_access_key:u,region:c}:{client_id:n,client_secret:u},a,g)},[t,r,d]),x=Object(c.useCallback)(function(e){u(e)},[]),w=Object(c.useCallback)(function(e){p(e)},[]),j=Object(c.useCallback)(function(e){f(e)},[]);return o("form",{className:"uk-form-stacked",onSubmit:N},"s3"===t?o(s.a.Fragment,null,o("div",{className:"uk-margin"},o("label",{className:"uk-form-label"},"AWS Access Key ID"),o("div",{className:"uk-form-controls"},o("input",{className:"uk-input",type:"text",placeholder:"AWS Access Key ID",ref:x}))),o("div",{className:"uk-margin"},o("label",{className:"uk-form-label"},"AWS Secret Access Key"),o("div",{className:"uk-form-controls"},o("input",{className:"uk-input",type:"text",placeholder:"AWS Secret Access Key",ref:w}))),o("div",{className:"uk-margin"},o("label",{className:"uk-form-label"},"Region"),o("div",{className:"uk-form-controls"},o("input",{className:"uk-input",type:"text",placeholder:"Region",ref:j})))):o(s.a.Fragment,null,o("div",{className:"uk-margin"},o("label",{className:"uk-form-label"},"Client ID"),o("div",{className:"uk-form-controls"},o("input",{className:"uk-input",type:"text",placeholder:"Client ID",ref:x}))),o("div",{className:"uk-margin"},o("label",{className:"uk-form-label"},"Client Secret"),o("div",{className:"uk-form-controls"},o("input",{className:"uk-input",type:"text",placeholder:"Client Secret",ref:w})))),o("div",{className:"uk-flex uk-flex-right"},a?o("a",{href:"#",className:"uk-button",onClick:y},"Cancel"):null,o("input",{type:"submit",className:"uk-button uk-button-primary",onSubmit:N,value:"Save",disabled:h})))}},vlRD:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){var e=a("RNiq");return{page:e.default||e}}])}},[["vlRD",1,0]]]);