(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{RNiq:function(t,e,n){"use strict";n.r(e);var r=n("ln6h"),a=n.n(r),c=n("eVuF"),u=n.n(c);function o(t,e,n,r,a,c,o){try{var i=t[c](o),s=i.value}catch(f){return void n(f)}i.done?e(s):u.a.resolve(s).then(r,a)}var i=n("q1tI"),s=n.n(i),f="function"===typeof fetch;function p(){return f?fetch.apply(this,arguments):u.a.reject("fetch() is not implemented in this JavaScript environment")}var l={isProduction:!0,apiPrefix:""};n.d(e,"default",function(){return h});var v=s.a.createElement;function h(){var t=Object(i.useState)([]),e=t[0],n=t[1],r=Object(i.useState)(null),c=r[0],s=r[1];return Object(i.useEffect)(function(){function t(){var e;return e=a.a.mark(function t(){var e;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,p(l.apiPrefix+"/resources/services.json");case 3:if(!(e=t.sent).ok){t.next=13;break}return t.t0=n,t.next=8,e.text();case 8:t.t1=t.sent,t.t2=[t.t1],(0,t.t0)(t.t2),t.next=14;break;case 13:s("Completed fetch but got bad status from resource: "+e.status);case 14:t.next=19;break;case 16:t.prev=16,t.t3=t.catch(0),s("Could not complete fetch: "+t.t3);case 19:case"end":return t.stop()}},t,null,[[0,16]])}),(t=function(){var t=this,n=arguments;return new u.a(function(r,a){var c=e.apply(t,n);function u(t){o(c,r,a,u,i,"next",t)}function i(t){o(c,r,a,u,i,"throw",t)}u(void 0)})}).apply(this,arguments)}!function(){t.apply(this,arguments)}()},[]),v("div",null,"Welcome to Next.js! ",e.length?""+e[0]:null," ",c)}},vlRD:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){var t=n("RNiq");return{page:t.default||t}}])}},[["vlRD",1,0]]]);