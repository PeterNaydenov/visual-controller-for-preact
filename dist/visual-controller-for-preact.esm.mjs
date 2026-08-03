import { h as e, hydrate as t, render as n } from "preact";
import r from "ask-for-promise";
//#region src/dim.js
function i() {
	let e = {}, t = {};
	function n(n, ...r) {
		let i = document.createTextNode(""), a = document.createTextNode(""), o = n({
			start: i,
			end: a
		}, ...r);
		if (!i.parentNode || !a.parentNode) throw Error("dim.set: callback must attach both \"start\" and \"end\" markers to the DOM");
		let s = document.createRange();
		s.setStartAfter(i), s.setEndBefore(a);
		let c = {
			isEmpty() {
				return !i.isConnected || !a.isConnected ? !0 : (s.setStartAfter(i), s.setEndBefore(a), s.collapsed);
			},
			getContext() {
				return i.isConnected && a.isConnected ? s.commonAncestorContainer : null;
			},
			destroy() {
				i.isConnected && i.parentNode.removeChild(i), a.isConnected && a.parentNode.removeChild(a);
			}
		};
		o && (t[o] = c), e[Object.keys(e).length] = c;
	}
	function r(n) {
		if (!(typeof n != "string" && !Array.isArray(n))) return typeof n == "string" && n.includes(",") && (n = n.split(",").map((e) => e.trim())), Array.isArray(n) ? n.map((n) => t[n] || e[n]) : t[n] || e[n];
	}
	function i() {
		let n = /* @__PURE__ */ new Set();
		for (let t of Object.values(e)) n.add(t);
		for (let e of Object.values(t)) n.add(e);
		for (let e of n) e.destroy();
		for (let t of Object.keys(e)) delete e[t];
		for (let e of Object.keys(t)) delete t[e];
	}
	function a() {
		return Object.keys(t);
	}
	return {
		set: n,
		get: r,
		reset: i,
		aliases: a
	};
}
//#endregion
//#region src/main.js
function a(a = {}) {
	let o = {}, s = /* @__PURE__ */ new Set(), c = {}, l = i();
	function u(e, ...t) {
		let n = null, r = null;
		l.set((t, ...i) => {
			r = t;
			let a = e(t, ...i);
			return typeof a == "string" && (n = a), a;
		}, ...t), n && (s.add(n), c[n] = r);
	}
	function d(i, s, l = {}, u = {}) {
		let d = r();
		if (!s) return console.error("Error: Component is undefined"), d.done(!1), d.promise;
		if (!i || typeof i != "string") return console.error("Error: Alias is missing or invalid"), d.done(!1), d.promise;
		let p = c[i];
		if (!p || !p.start.isConnected || !p.end.isConnected) return console.error(`Error: Region "${i}" was not defined or its markers are orphaned. Call html.set(...) first.`), d.done(!1), d.promise;
		o[i] && f(i);
		let m = [], h = p.start.nextSibling;
		for (; h && h !== p.end;) m.push(h), h = h.nextSibling;
		let g, _ = !1;
		if (m.length === 0) g = document.createElement("span"), g.style.display = "contents", p.end.parentNode.insertBefore(g, p.end), _ = !1;
		else if (m.length === 1 && m[0].nodeType === 1) g = m[0], _ = !0;
		else {
			let e = document.createElement("span");
			e.style.display = "contents", p.end.parentNode.insertBefore(e, p.end), m.forEach((t) => e.appendChild(t)), g = e, _ = !0;
		}
		let v = {
			app: null,
			mountSpan: g,
			setupUpdates: {}
		};
		o[i] = v;
		let y = {
			dependencies: a,
			data: l,
			setupUpdates: (e) => {
				v.setupUpdates = e;
			}
		}, b = r();
		return _ ? t(e(s, y), g) : n(e(s, y), g), setTimeout(() => b.done(), 0), b.onComplete(() => d.done(v.setupUpdates)), d.promise;
	}
	function f(e) {
		if (e === void 0) {
			let e = 0;
			for (let t of Object.keys(o)) f(t), e++;
			return e;
		}
		if (Array.isArray(e)) {
			let t = 0;
			for (let n of e) typeof n == "string" && o[n] && (f(n), t++);
			return t;
		}
		if (typeof e != "string") return console.error("Error: destroy() expects a string alias or an array of strings"), !1;
		let t = o[e];
		return t ? (n(null, t.mountSpan), t.mountSpan.parentNode && t.mountSpan.parentNode.removeChild(t.mountSpan), delete o[e], !0) : !1;
	}
	function p(e) {
		return !!o[e];
	}
	function m(e) {
		let t = o[e];
		return t ? t.setupUpdates : (console.error(`App with alias: "${e}" was not found.`), !1);
	}
	function h() {
		return Array.from(s);
	}
	function g(e) {
		if (!e || typeof e != "string") {
			console.error("Error: Alias is missing or invalid");
			return;
		}
		let t = l.get(e);
		if (!t) {
			console.error(`Region "${e}" was not defined. Call html.set(...) first.`);
			return;
		}
		return t.isEmpty();
	}
	function _() {
		for (let e of Object.keys(o)) f(e);
		s.clear();
		for (let e of Object.keys(c)) delete c[e];
		l.reset();
	}
	return {
		set: u,
		publish: d,
		destroy: f,
		has: p,
		getApp: m,
		isEmpty: g,
		list: h,
		reset: _
	};
}
//#endregion
export { a as default };
