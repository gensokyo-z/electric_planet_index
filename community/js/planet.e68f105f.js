(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["planet"],{"10b9":function(t,n,e){"use strict";var i=e("d5d1"),a=e.n(i);a.a},"6e34":function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("section",{staticClass:"index"},[e("div",{staticClass:"layout"},[e("Header"),e("div",{staticClass:"layout-main"},[e("div",{staticClass:"community-container"},[e("div",{staticClass:"community-main"},[e("div",{staticClass:"card-list"},t._l(t.cardList,(function(n,i){return e("div",{key:i,staticClass:"planet-card",on:{click:function(e){return t.$router.push("/planetdetail?id="+n.id)}}},[e("div",{staticClass:"top"},[e("div",{staticClass:"left"},[e("img",{attrs:{src:n.avatar}})]),e("div",{staticClass:"rigth"},[e("div",{staticClass:"info"},[e("div",{staticClass:"name"},[t._v(t._s(n.name))]),e("div",{staticClass:"desc"},[t._v("已有"+t._s(n.users_count)+"人加入")])]),e("div",{class:["btn",{joined:!n.joined}],on:{click:function(e){return e.stopPropagation(),t.addPlanet(n)}}},[t._v("\n                    "+t._s(n.joined?"已加入":"加入")+"\n                  ")])])]),e("div",{staticClass:"buttom"},[t._v("\n                "+t._s(n.intro)+"\n              ")])])})),0)])])])],1)])},a=[],s=(e("96cf"),e("1da1")),r=(e("ac6a"),e("f489")),c=e("ca00"),o={name:"planet",data:function(){return{cardList:[]}},mounted:function(){this.getPlanetList()},methods:{getPlanetList:function(t){var n=this;this.$store.dispatch("getAllPlanetList").then((function(t){t.forEach((function(t){t.joined=n.$state.userPlanet.some((function(n){return n.id===t.id}))})),n.cardList=t}))},addPlanet:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(n){var e=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(c["a"].getcookie("TOKEN")||this.$store.dispatch("needAuth"),!n.joined){t.next=3;break}return t.abrupt("return",this.$router.push("/planetdetail?id=".concat(n.id)));case 3:this.$confirm("是否加入该星球","提示").then((function(){Object(r["e"])(n.id).then(function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(i){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(200!==i.code){t.next=4;break}return t.next=3,e.$store.dispatch("getUserPlanetList");case 3:e.$router.push("/planetdetail?id=".concat(n.id));case 4:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}())})).catch((function(){}));case 5:case"end":return t.stop()}}),t,this)})));function n(n){return t.apply(this,arguments)}return n}()}},u=o,d=(e("10b9"),e("2877")),l=Object(d["a"])(u,i,a,!1,null,"6cde54cb",null);n["default"]=l.exports},d5d1:function(t,n,e){}}]);