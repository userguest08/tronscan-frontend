(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{1419:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAolBMVEUAAAD9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////+1tbW9vb35+fn29vbz8/Pu7u7U1NTw8PDj4+PQ0NDCwsK/v7/IyMjX19fn5+fd3d3Gxsa6urrh4eHZ2dnKysrExMTp6enMzMwjnaLvAAAAHXRSTlMA/QjdudlbT0oQzu7mtYxy4JchHBflm4tx8bTLntSLMkcAAAH3SURBVEjHxZbZeoIwEEYbC2LdcN/aMSAgICri8v6v1khiGCSCeuN/443nOzMTsnx9Kj9GV9NbhLR0rWv8VP+/Vu8QQCFavVYOmGMoZGyWQI1vUOa78UjRh4fpK0WjXyhJc1QkBllR6uIG98SwBxXpDe/6aEJlmvl+JvBEJrnpwlNpoLLuWveiwHVUI8hKmwGKtd4sr9kfrAIzk5IxErh0eQvFKg9Y2jdNHQtksMranQK4pi4QjQOOFODEruP49LTjVWpifxCOxMsHob4skPD9Y4BAAiWwX+MxGCkyBR668iJRWnECXsJ/uymykMj9ADZCYK331Ic0nRTRJSLWMeSCyJNzD3Y28OgpMs8QHsJUUnBgArQ8rRQBhIhY1OZz95mAs2KspAxhgpMUrNwTRuZFxKa26EAUSo9nXJiusgSZIAqDhLG4/YUCiZNMcOECPOSuqjCLj1cKyBkvpaFEmGDPBLI40b6R+yypjZAt6n7Lut8S+Vmijz/2vayXWAqSMIykX8tvMedCb5vXoo4QHKUgt8Vq7Vs9u4C6Dl+XtAMsEBu5eFw4/lVFqCU7wDGLh5LY5/QS+2GY2MpDCR99WBUet6qj7+UD9u+NY/z1y+LdKwln1Cy/+N69Xt+/xLHIbBeBtlmreJBoigdJ9bNn2uHPns6UPXs+lH/GLsFEEcCdEQAAAABJRU5ErkJggg=="},3473:function(e,t,a){"use strict";a.r(t);var n=a(37),r=a.n(n),s=a(204),c=a(2),i=a.n(c),o=a(6),l=a(8),d=a(16),m=a(15),u=a(21),p=a(20),g=a(0),v=a.n(g),b=a(90),h=a(23),E=a(28),f=a(18),A=a(3),y=a(3342),N=a.n(y),x=a(12),j=a.n(x),w=a(3420),O=a.n(w),k=a(1817),C=a(63),S=a(11),P=a(3424),M=a.n(P),L=a(130),U=a.n(L),B=function(e){Object(u.a)(w,e);var t,n,c,E,y,x=Object(p.a)(w);function w(){var e;return Object(d.a)(this,w),(e=x.call(this)).scrollTo=function(e){e.preventDefault(),e.stopPropagation(),U()("html, body").animate({scrollTop:U()(U()(e.target).closest("a").attr("href")).offset().top-15},500)},e.renderSidebar=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=e.state,r=n.address,s=n.files,c=n.sections,i=a(1419);return v.a.createElement("div",{style:Object(l.a)({},t)},v.a.createElement("div",{className:"card font-weight-bold mb-2"},v.a.createElement("img",{className:"card-img-top",src:s.logo,onError:function(e){e.target.onerror=null,e.target.src=i}}),v.a.createElement(O.a,{items:c.map(function(e){return e.id}),className:"list-group list-group-flush",currentClassName:"is-current"},c.map(function(t){return v.a.createElement("a",{key:t.id,className:"list-group-item",href:"#"+t.id,onClick:e.scrollTo},t.name)}),v.a.createElement(h.d,{className:" list-group-item",url:r.representative.url},"Website"))),v.a.createElement(C.a,{className:"btn btn-secondary btn-block mb-2",to:"/sr/votes"},v.a.createElement("i",{className:"fa fa-arrow-left mr-2"}),Object(A.c)("go_to_votelist")))},e.state={loading:!0,body:null,address:null,files:null,sections:[]},e}return Object(m.a)(w,[{key:"componentDidMount",value:function(){var e=this.props.match;this.loadAddress(e.params.id)}},{key:"componentDidUpdate",value:function(e){var t=this.props.match;t.params.id!==e.match.params.id&&this.loadAddress(t.params.id),e.activeLanguage!==this.props.activeLanguage&&this.reloadPages()}},{key:"getAddress",value:function(){return this.props.match.params.id}},{key:"loadPage",value:(y=Object(o.a)(i.a.mark(function e(t){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,j.a.get(t);case 3:return e.abrupt("return",e.sent);case 6:return e.prev=6,e.t0=e.catch(0),e.abrupt("return",{});case 9:case"end":return e.stop()}},e,null,[[0,6]])})),function(e){return y.apply(this,arguments)})},{key:"loadPages",value:(E=Object(o.a)(i.a.mark(function e(t){var a,n,r,c,o,l,d,m,u,p=arguments;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=1<p.length&&void 0!==p[1]?p[1]:"en",n="https://raw.githubusercontent.com/".concat(t,"/master"),"en"!==a&&(n+="/pages/".concat(a)),e.next=5,Promise.all([this.loadPage("".concat(n,"/INTRO.md")),this.loadPage("".concat(n,"/COMMUNITY_PLAN.md")),this.loadPage("".concat(n,"/TEAM.md")),this.loadPage("".concat(n,"/BUDGET_EXPENSES.md")),this.loadPage("".concat(n,"/SERVER_CONFIGURATION.md"))]);case 5:return r=e.sent,c=Object(s.a)(r,5),o=c[0].data,l=c[1].data,d=c[2].data,m=c[3].data,u=c[4].data,e.abrupt("return",{intro:o,communityPlan:l,team:d,budgetExpenses:m,serverConfiguration:u});case 13:case"end":return e.stop()}},e,this)})),function(e){return E.apply(this,arguments)})},{key:"loadGithubData",value:(c=Object(o.a)(i.a.mark(function e(t){var a,n,c,o,l,d,m,u,p,g,b,h,E,f;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.props.activeLanguage,n="https://raw.githubusercontent.com/".concat(t,"/master"),e.next=4,this.loadPages(t);case 4:if(c=e.sent,"en"!==a)return e.next=8,this.loadPages(t,a);e.next=10;break;case 8:for(o=e.sent,l=0,d=Object.entries(o);l<d.length;l++)m=Object(s.a)(d[l],2),u=m[0],p=m[1],""!==r()(p)&&(c[u]=p);case 10:g=c.intro,b=c.communityPlan,h=c.team,E=c.budgetExpenses,f=c.serverConfiguration,this.setState({url:n,files:{logo:n+"/logo.png",banner:n+"/banner.png"},sections:[{name:Object(A.c)("intro"),id:"intro",content:v.a.createElement(N.a,{source:g})},{name:Object(A.c)("team"),id:"team",content:v.a.createElement(N.a,{source:h})},{name:Object(A.c)("community_plan"),id:"community-plan",content:v.a.createElement(N.a,{source:b})},{name:Object(A.c)("server_configuration"),id:"server-configuration",content:v.a.createElement(N.a,{source:f})},{name:Object(A.c)("budget_expenses"),id:"budget-expenses",content:v.a.createElement(N.a,{source:E})}]});case 12:case"end":return e.stop()}},e,this)})),function(e){return c.apply(this,arguments)})},{key:"reloadPages",value:(n=Object(o.a)(i.a.mark(function e(){var t;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.b.getSuperRepresentative(this.getAddress());case 2:return t=e.sent,e.next=5,this.loadGithubData(t.data.githubLink);case 5:case"end":return e.stop()}},e,this)})),function(){return n.apply(this,arguments)})},{key:"loadAddress",value:(t=Object(o.a)(i.a.mark(function e(t){var a;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0,body:null,address:null,files:null}),e.prev=1,e.next=4,f.b.getAddress(t);case 4:return a=e.sent,e.next=7,this.reloadPages();case 7:this.setState({loading:!1,address:a}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),this.setState({body:v.a.createElement("main",{className:"container header-overlap"},v.a.createElement("div",{className:"card text-center"},v.a.createElement("div",{className:"card-body"},v.a.createElement(S.a,{color:"warning"},Object(A.c)("unable_load_representatives_page_message"))),v.a.createElement("p",null,v.a.createElement(C.a,{to:"/sr/votes",className:"btn btn-primary"},"Go Back"))))});case 13:case"end":return e.stop()}},e,this,[[1,10]])})),function(e){return t.apply(this,arguments)})},{key:"render",value:function(){var e=this,t=this.state,a=t.address,n=t.loading,r=t.files,s=t.sections;return t.body||(a?a.representative.enabled?v.a.createElement("main",{className:"container header-overlap representative-landing-page"},v.a.createElement(k.StickyContainer,{className:"row"},v.a.createElement("div",{className:"col-md-3"},v.a.createElement(M.a,{minWidth:768},v.a.createElement(k.Sticky,null,function(t){var a=t.style,n=t.isSticky;return e.renderSidebar(Object(l.a)({},a,{},n?{top:15}:{}))})),v.a.createElement(M.a,{maxWidth:768},this.renderSidebar())),v.a.createElement("div",{className:"col-md-9 representative-content"},n?v.a.createElement("div",{className:"card"},v.a.createElement(b.b,null,Object(A.c)("loading_representative")," ",a.address)):v.a.createElement(g.Fragment,null,v.a.createElement("div",{className:"card"},a.representative.enabled&&v.a.createElement("div",{className:"card-header text-center bg-info font-weight-bold text-white"},a.name||"Representative"),v.a.createElement("div",{className:"card-body text-center"},v.a.createElement("img",{src:r.banner,style:D.image}))),s.map(function(e){return v.a.createElement("div",{className:"card mt-3"},v.a.createElement("a",{id:e.id}),v.a.createElement("div",{className:"card-header bg-info text-center text-white font-weight-bold"},e.name),v.a.createElement("div",{className:"card-body"},e.content))}))))):v.a.createElement("main",{className:"container header-overlap"},v.a.createElement("div",{className:"card text-center"},v.a.createElement("div",{className:"card-body"},v.a.createElement(S.a,{color:"warning"},Object(A.c)("address_not_super_representative"))),v.a.createElement("p",null,v.a.createElement(C.a,{to:"/sr/votes",className:"btn btn-primary"},"Go Back")))):v.a.createElement("main",{className:"container header-overlap"},v.a.createElement("div",{className:"card text-center"},v.a.createElement(b.b,null,Object(A.c)("loading_representatives")))))}}]),w}(v.a.Component),D={image:{maxWidth:"100%",maxHeight:400}};t.default=Object(E.connect)(function(e){return{activeLanguage:e.app.activeLanguage}},{})(B)}}]);