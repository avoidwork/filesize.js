/**
 * Copyright (c) 2012, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of abaaso.tabs nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JASON MULLIGAN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * abaaso.tabs
 * 
 * UI tabs module
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com
 * @requires abaaso 1.9.9
 * @requires abaaso.route
 * @version 1.3.3
 */
(function(a){"use strict";var b=function(){var b=a[abaaso.aliased],c,d;return d=function(a){var c=a.explode("/"),d=[],e="",f,g,h;return b(".active").removeClass("active"),b(".tab").addClass("hidden"),b(".root").removeClass("hidden"),c.first()==="#!"&&c.shift(),c.each(function(a){f='a[data-hash="'+a+'"]',g='ul.tab[data-hash="'+a+'"]',h='section.tab[data-hash="'+a+'"]',f=(e!==""?'ul.active[data-hash="'+e+'"] ':".root ")+f,g=(e!==""?'ul.active[data-hash="'+e+'"] ':".root ")+g,h=(e!==""?'section.active[data-hash="'+e+'"] ':".root ")+h,d.concat(b(f).addClass("active")),b(g).removeClass("hidden").addClass("active"),b(h).removeClass("hidden").addClass("active"),e=a}),d},c=function(a,c,d,e,f){var g,h,i,j,k,l,m,n;d instanceof Object?d["class"]="tab":d={"class":"tab"},e=typeof e=="undefined"?"":e,k=c instanceof Array,g=a.create("ul",d),l=a.create("section",{"class":"tab"}),f=typeof f=="undefined"||f===!0;switch(!0){case!e.isEmpty():n=e.replace(/^\/{1,1}/,""),g.attr("data-hash",n),l.attr("data-hash",n);break;case e.isEmpty():g.addClass("root"),l.addClass("root")}return m=function(a,c){var d,i,n;j=k?a:c,h=e+"/"+j.toLowerCase(),d=h.replace(/^\/{1,1}/,""),m=typeof a=="function"?a:function(){void 0},b.route.set(d,m),g.create("li").create("a",{href:"#!"+h,"data-hash":j.toLowerCase()}).html(j);switch(!0){case/function|string/.test(typeof a):case a===null:l.create("section",{"class":"tab hidden","data-hash":d});break;case typeof a=="object":l.tabs(a,null,h,f),i=b('section[data-hash="'+d+'"]'),a.each(function(a,b){var c=typeof a=="object"?b:a;i.create("section",{"class":"tab hidden","data-hash":c.toLowerCase()})})}},c instanceof Array?c.each(m):b.iterate(c,m),a},b.on("hash",function(a){d(a)},"tabs"),Element.prototype.tabs=function(a,b,d,e){return c(this,a,b,d,e)},{active:d,create:c}},c=function(){abaaso.module("tabs",b())};typeof define=="function"?define("abaaso.tabs",["abaaso","abaaso.route"],c):abaaso.on("init",c,"abaaso.tabs")})(window)