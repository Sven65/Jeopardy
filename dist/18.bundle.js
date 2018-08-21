(window.webpackJsonp=window.webpackJsonp||[]).push([[18,22],{493:function(e,t,r){e.exports=r.p+"7db1d3a149acc0275be59a66f451d39f.wav"},494:function(e,t,r){e.exports=r.p+"8a947d61eccea81a80429d99ac46b1bb.wav"},495:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(49),a=function(e){return e&&e.__esModule?e:{default:e}}(o);var i=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r._percentColors=[{pct:0,color:{r:239,g:83,b:80}},{pct:.5,color:{r:255,g:167,b:38}},{pct:1,color:{r:102,g:187,b:106}}],r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),n(t,[{key:"getColorForPercentage",value:function(e){for(var t=1;t<this._percentColors.length-1&&!(e<this._percentColors[t].pct);t++);var r=this._percentColors[t-1],n=this._percentColors[t],o=n.pct-r.pct,a=(e-r.pct)/o,i=1-a,c=a,u={r:Math.floor(r.color.r*i+n.color.r*c),g:Math.floor(r.color.g*i+n.color.g*c),b:Math.floor(r.color.b*i+n.color.b*c)};return"rgb("+[u.r,u.g,u.b].join(",")+")"}},{key:"render",value:function(){var e=this.props.timeLeft/this.props.maxTime*100,t={width:e+"%",height:"5px",background:this.getColorForPercentage(e/100)};return a.default.createElement("div",{className:"timer",style:t})}}]),t}();t.default=i},496:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(49),a=l(o),i=l(r(495)),c=l(r(494)),u=l(r(493));function l(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.getClassName=r.getClassName.bind(r),r._tickAudio=a.default.createRef(),r._tockAudio=a.default.createRef(),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),n(t,[{key:"getClassName",value:function(){var e="";return this.props.isTurn&&(e+=" isTurn"),this.props.isRegistered&&(e+=" isRegistered"),e}},{key:"render",value:function(){var e=this;return 0===this.props.playAudio?this._tickAudio.play():1===this.props.playAudio&&this._tockAudio.play(),a.default.createElement("div",{className:"column user-card "+this.getClassName(),"data-userid":this.props.userID},a.default.createElement("div",{className:"card"},a.default.createElement("div",{className:"card-image"},a.default.createElement("figure",{className:"image is-192x192"},a.default.createElement("img",{src:this.props.image}),a.default.createElement(i.default,{timeLeft:this.props.timeLeft,maxTime:this.props.maxTime}),a.default.createElement("audio",{ref:function(t){return e._tickAudio=t},src:c.default}),a.default.createElement("audio",{ref:function(t){return e._tockAudio=t},src:u.default}))),a.default.createElement("div",{className:"media"},a.default.createElement("div",{className:"media-content"},a.default.createElement("p",{className:"title is-4"},this.props.username," - $",this.props.balance))),a.default.createElement("div",{className:"content"},this.props.extraContent)))}}]),t}();t.default=s},529:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r(49),a=c(o),i=c(r(496));function c(e){return e&&e.__esModule?e:{default:e}}var u=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),n(t,[{key:"getPlaceString",value:function(e){return["1st","2nd","3rd","4th"][e]}},{key:"render",value:function(){var e=this;return a.default.createElement("div",{className:"loader-holder"},a.default.createElement("div",{className:"absolute-center standings"},a.default.createElement("h2",null,"Game Over!"),a.default.createElement("div",{className:"standings-holder"},this.props.standings.map(function(t,r){return a.default.createElement(i.default,{userID:t.userID,image:t.image,username:t.username,balance:t.balance,extraContent:a.default.createElement("p",{className:"position"},"Position: ",e.getPlaceString(r))})}))))}}]),t}();t.default=u}}]);