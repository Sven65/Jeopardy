(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{445:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=n(49),i=function(e){return e&&e.__esModule?e:{default:e}}(r);var s=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),o(t,[{key:"render",value:function(){return i.default.createElement("button",{className:"btn "+this.props.className,type:this.props.type,name:this.props.name||"",id:this.props.id,onClick:this.props.onClick,ref:this.props.Ref},this.props.text,void 0!==this.props.icon&&i.default.createElement("span",{className:"icon is-right"},i.default.createElement("i",{className:"mdi mdi-"+this.props.icon})))}}]),t}();t.default=s}}]);