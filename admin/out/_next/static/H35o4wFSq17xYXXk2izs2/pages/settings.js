(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"fC/G":function(e,a,t){"use strict";t.r(a);var n=t("q1tI"),s=t.n(n),u=(t("MLBV"),t("rUpX"),t("QcfS")),c=t("zYID"),l=t("b0oO"),r=t("ln6h"),i=t.n(r),o=t("O40h"),m=t("nk4I"),k=s.a.createElement;function f(){return(f=Object(o.a)(i.a.mark(function e(a,t,n){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t(!0),e.next=4,Object(m.e)(a);case 4:t(!1),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),n(""+e.t0),t(!1);case 11:case"end":return e.stop()}},e,null,[[0,7]])}))).apply(this,arguments)}function p(e){var a=e.userConfig,t=e.setErrorMessage,s=Object(n.useState)(""),u=s[0],c=s[1],l=Object(n.useState)(!1),r=l[0],i=l[1],o=a?a.username:void 0;Object(n.useEffect)(function(){o&&c(o)},[o]);var m=Object(n.useCallback)(function(e){c(e.target.value)},[]),p=Object(n.useCallback)(function(e){e.preventDefault(),function(e,a,t){f.apply(this,arguments)}(u,i,t)},[u]);return k("div",{className:"uk-section uk-section-default uk-padding-remove-vertical"},k("h3",null,"Change your username"),k("form",{className:"uk-form-stacked",onSubmit:p},k("div",{className:"uk-margin"},k("label",{className:"uk-form-label"},"Username"),k("div",{className:"uk-form-controls"},k("input",{className:"uk-input",type:"text",placeholder:"Username",value:u,onChange:m}))),k("input",{type:"submit",className:"uk-button uk-button-primary uk-align-right",onSubmit:p,value:"Save Username",disabled:r})))}var b=s.a.createElement;function d(){return(d=Object(o.a)(i.a.mark(function e(a,t,n){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t(!0),e.next=4,Object(m.c)(a);case 4:t(!1),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),n(""+e.t0),t(!1);case 11:case"end":return e.stop()}},e,null,[[0,7]])}))).apply(this,arguments)}function v(e){e.userConfig;var a=e.setErrorMessage,t=Object(n.useState)(""),s=t[0],u=t[1],c=Object(n.useState)(!1),l=c[0],r=c[1],i=Object(n.useCallback)(function(e){u(e.target.value)},[]),o=Object(n.useCallback)(function(e){e.preventDefault(),function(e,a,t){d.apply(this,arguments)}(s,r,a)},[s]);return b("div",{className:"uk-section uk-section-default uk-padding-remove-vertical"},b("h3",null,"Change your password"),b("form",{className:"uk-form-stacked",onSubmit:o},b("div",{className:"uk-margin"},b("label",{className:"uk-form-label"},"Password"),b("div",{className:"uk-form-controls"},b("input",{className:"uk-input",type:"password",placeholder:"Password",value:s,onChange:i}))),b("input",{type:"submit",className:"uk-button uk-button-primary uk-align-right",onSubmit:o,value:"Save Password",disabled:l})))}var N=t("klpT"),g=t("8lYe");t.d(a,"default",function(){return S});var h=s.a.createElement,O=["google","gdrive","facebook","dropbox","instagram","s3"];function S(){var e=Object(u.c)(),a=e.userConfig,t=e.token,s=Object(n.useState)(null),r=s[0],i=s[1];return Object(n.useEffect)(function(){Object(u.a)(t)},[t]),h("div",{className:"toplevel"},h("div",{className:"content"},h(c.a,{userConfig:a}),h("div",{className:"uk-container uk-margin uk-width-4-5@s uk-width-2-3@m"},h(l.a,{title:"Mediasummon Settings"}),r?h("div",{className:"uk-alert-danger","uk-alert":"true"},h("a",{className:"uk-alert-close","uk-close":"true"}),h("p",null,h("span",{"uk-icon":"warning"})," ",r)):null,h(p,{userConfig:a,setErrorMessage:i}),h(v,{userConfig:a,setErrorMessage:i}),h("hr",null),O.map(function(e){return h("div",{key:e,className:"uk-section uk-section-default uk-padding-remove-vertical"},h("h3",null,"Set new secrets for ",e),h(N.a,{secretName:e}))}))),h(g.a,null))}},klpT:function(e,a,t){"use strict";t.d(a,"a",function(){return m});var n=t("ln6h"),s=t.n(n),u=t("O40h"),c=t("q1tI"),l=t.n(c),r=t("nk4I"),i=l.a.createElement;function o(){return(o=Object(u.a)(s.a.mark(function e(a,t,n,u){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(r.d)(a,t);case 2:u(),n&&n(!1);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function m(e){var a=e.secretName,t=e.setShowing,n=Object(c.useState)(void 0),s=n[0],u=n[1],r=Object(c.useState)(void 0),m=r[0],k=r[1],f=Object(c.useState)(void 0),p=f[0],b=f[1],d=Object(c.useState)(!1),v=d[0],N=d[1],g=Object(c.useCallback)(function(){s&&(s.value=""),m&&(m.value=""),p&&(p.value=""),N(!1)},[s,m,p]),h=Object(c.useCallback)(function(e){e.preventDefault(),t&&t(!1)},[]),O=Object(c.useCallback)(function(e){e.preventDefault(),N(!0);var n=s?s.value:null,u=m?m.value:null,c=p?p.value:null;!function(e,a,t,n){o.apply(this,arguments)}(a,"s3"===a?{aws_access_key_id:n,aws_secret_access_key:u,region:c}:{client_id:n,client_secret:u},t,g)},[a,s,m]),S=Object(c.useCallback)(function(e){u(e)},[]),j=Object(c.useCallback)(function(e){k(e)},[]),w=Object(c.useCallback)(function(e){b(e)},[]);return i("form",{className:"uk-form-stacked",onSubmit:O},"s3"===a?i(l.a.Fragment,null,i("div",{className:"uk-margin"},i("label",{className:"uk-form-label"},"AWS Access Key ID"),i("div",{className:"uk-form-controls"},i("input",{className:"uk-input",type:"text",placeholder:"AWS Access Key ID",ref:S}))),i("div",{className:"uk-margin"},i("label",{className:"uk-form-label"},"AWS Secret Access Key"),i("div",{className:"uk-form-controls"},i("input",{className:"uk-input",type:"text",placeholder:"AWS Secret Access Key",ref:j}))),i("div",{className:"uk-margin"},i("label",{className:"uk-form-label"},"Region"),i("div",{className:"uk-form-controls"},i("input",{className:"uk-input",type:"text",placeholder:"Region",ref:w})))):i(l.a.Fragment,null,i("div",{className:"uk-margin"},i("label",{className:"uk-form-label"},"Client ID"),i("div",{className:"uk-form-controls"},i("input",{className:"uk-input",type:"text",placeholder:"Client ID",ref:S}))),i("div",{className:"uk-margin"},i("label",{className:"uk-form-label"},"Client Secret"),i("div",{className:"uk-form-controls"},i("input",{className:"uk-input",type:"text",placeholder:"Client Secret",ref:j})))),i("div",{className:"uk-flex uk-flex-right"},t?i("a",{href:"#",className:"uk-button",onClick:h},"Cancel"):null,i("input",{type:"submit",className:"uk-button uk-button-primary",onSubmit:O,value:"Save",disabled:v})))}},nkd9:function(e,a,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/settings",function(){var e=t("fC/G");return{page:e.default||e}}])}},[["nkd9",1,0]]]);