import { h as e, hydrate as t, render as n } from "preact";
import r from "ask-for-promise";
//#region src/main.js
function i(i = {}) {
	let a = {}, o = {};
	function s(s, l = {}, u) {
		let d = !!a[u], f;
		if (!s) return console.error("Error: Component is undefined"), !1;
		if (d && c(u), f = document.getElementById(u), !f) return console.error(`Can't find node with id: "${u}"`), !1;
		o[u] = {};
		let p = r(), m = r(), h = {
			dependencies: i,
			data: l,
			setupUpdates: (e) => o[u] = e
		};
		return a[u] = {}, f.innerHTML.trim() ? t(e(s, h), f) : n(e(s, h), f), setTimeout(() => p.done(), 0), p.onComplete(() => m.done(o[u])), m.promise;
	}
	function c(e) {
		if (Object.keys(a).includes(e)) {
			let t = document.getElementById(e);
			return t && (n(null, t), t.innerHTML = ""), delete a[e], delete o[e], !0;
		} else return !1;
	}
	function l(e) {
		return o[e] || (console.error(`App with id: "${e}" was not found.`), !1);
	}
	function u(e) {
		return !!a[e];
	}
	return {
		publish: s,
		destroy: c,
		getApp: l,
		has: u
	};
}
//#endregion
export { i as default };
