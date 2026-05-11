import { BrowserWindow as e, app as t, dialog as n, ipcMain as r } from "electron";
import i, { basename as a, join as o, posix as s, win32 as c } from "node:path";
import l from "node:fs/promises";
import { exec as ee } from "node:child_process";
import { promisify as te } from "node:util";
import ne, { EventEmitter as u } from "events";
import d from "fs";
import { EventEmitter as re } from "node:events";
import ie from "node:stream";
import { StringDecoder as ae } from "node:string_decoder";
import f from "node:fs";
import oe, { dirname as se, parse as ce } from "path";
import le from "assert";
import { Buffer as ue } from "buffer";
import * as de from "zlib";
import fe from "zlib";
import pe from "node:assert";
import { randomBytes as me } from "node:crypto";
import he from "node:os";
import { fileURLToPath as ge } from "node:url";
//#region node_modules/tar/dist/esm/index.min.js
var _e = Object.defineProperty, ve = (e, t) => {
	for (var n in t) _e(e, n, {
		get: t[n],
		enumerable: !0
	});
}, ye = typeof process == "object" && process ? process : {
	stdout: null,
	stderr: null
}, be = (e) => !!e && typeof e == "object" && (e instanceof Ze || e instanceof ie || xe(e) || Se(e)), xe = (e) => !!e && typeof e == "object" && e instanceof re && typeof e.pipe == "function" && e.pipe !== ie.Writable.prototype.pipe, Se = (e) => !!e && typeof e == "object" && e instanceof re && typeof e.write == "function" && typeof e.end == "function", p = Symbol("EOF"), m = Symbol("maybeEmitEnd"), h = Symbol("emittedEnd"), Ce = Symbol("emittingEnd"), we = Symbol("emittedError"), Te = Symbol("closed"), Ee = Symbol("read"), De = Symbol("flush"), Oe = Symbol("flushChunk"), g = Symbol("encoding"), ke = Symbol("decoder"), _ = Symbol("flowing"), Ae = Symbol("paused"), je = Symbol("resume"), v = Symbol("buffer"), y = Symbol("pipes"), b = Symbol("bufferLength"), Me = Symbol("bufferPush"), Ne = Symbol("bufferShift"), x = Symbol("objectMode"), S = Symbol("destroyed"), Pe = Symbol("error"), Fe = Symbol("emitData"), Ie = Symbol("emitEnd"), Le = Symbol("emitEnd2"), C = Symbol("async"), Re = Symbol("abort"), ze = Symbol("aborted"), Be = Symbol("signal"), Ve = Symbol("dataListeners"), w = Symbol("discarded"), He = (e) => Promise.resolve().then(e), Ue = (e) => e(), We = (e) => e === "end" || e === "finish" || e === "prefinish", Ge = (e) => e instanceof ArrayBuffer || !!e && typeof e == "object" && e.constructor && e.constructor.name === "ArrayBuffer" && e.byteLength >= 0, Ke = (e) => !Buffer.isBuffer(e) && ArrayBuffer.isView(e), qe = class {
	src;
	dest;
	opts;
	ondrain;
	constructor(e, t, n) {
		this.src = e, this.dest = t, this.opts = n, this.ondrain = () => e[je](), this.dest.on("drain", this.ondrain);
	}
	unpipe() {
		this.dest.removeListener("drain", this.ondrain);
	}
	proxyErrors(e) {}
	end() {
		this.unpipe(), this.opts.end && this.dest.end();
	}
}, Je = class extends qe {
	unpipe() {
		this.src.removeListener("error", this.proxyErrors), super.unpipe();
	}
	constructor(e, t, n) {
		super(e, t, n), this.proxyErrors = (e) => this.dest.emit("error", e), e.on("error", this.proxyErrors);
	}
}, Ye = (e) => !!e.objectMode, Xe = (e) => !e.objectMode && !!e.encoding && e.encoding !== "buffer", Ze = class extends re {
	[_] = !1;
	[Ae] = !1;
	[y] = [];
	[v] = [];
	[x];
	[g];
	[C];
	[ke];
	[p] = !1;
	[h] = !1;
	[Ce] = !1;
	[Te] = !1;
	[we] = null;
	[b] = 0;
	[S] = !1;
	[Be];
	[ze] = !1;
	[Ve] = 0;
	[w] = !1;
	writable = !0;
	readable = !0;
	constructor(...e) {
		let t = e[0] || {};
		if (super(), t.objectMode && typeof t.encoding == "string") throw TypeError("Encoding and objectMode may not be used together");
		Ye(t) ? (this[x] = !0, this[g] = null) : Xe(t) ? (this[g] = t.encoding, this[x] = !1) : (this[x] = !1, this[g] = null), this[C] = !!t.async, this[ke] = this[g] ? new ae(this[g]) : null, t && t.debugExposeBuffer === !0 && Object.defineProperty(this, "buffer", { get: () => this[v] }), t && t.debugExposePipes === !0 && Object.defineProperty(this, "pipes", { get: () => this[y] });
		let { signal: n } = t;
		n && (this[Be] = n, n.aborted ? this[Re]() : n.addEventListener("abort", () => this[Re]()));
	}
	get bufferLength() {
		return this[b];
	}
	get encoding() {
		return this[g];
	}
	set encoding(e) {
		throw Error("Encoding must be set at instantiation time");
	}
	setEncoding(e) {
		throw Error("Encoding must be set at instantiation time");
	}
	get objectMode() {
		return this[x];
	}
	set objectMode(e) {
		throw Error("objectMode must be set at instantiation time");
	}
	get async() {
		return this[C];
	}
	set async(e) {
		this[C] = this[C] || !!e;
	}
	[Re]() {
		this[ze] = !0, this.emit("abort", this[Be]?.reason), this.destroy(this[Be]?.reason);
	}
	get aborted() {
		return this[ze];
	}
	set aborted(e) {}
	write(e, t, n) {
		if (this[ze]) return !1;
		if (this[p]) throw Error("write after end");
		if (this[S]) return this.emit("error", Object.assign(/* @__PURE__ */ Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" })), !0;
		typeof t == "function" && (n = t, t = "utf8"), t ||= "utf8";
		let r = this[C] ? He : Ue;
		if (!this[x] && !Buffer.isBuffer(e)) {
			if (Ke(e)) e = Buffer.from(e.buffer, e.byteOffset, e.byteLength);
			else if (Ge(e)) e = Buffer.from(e);
			else if (typeof e != "string") throw Error("Non-contiguous data written to non-objectMode stream");
		}
		return this[x] ? (this[_] && this[b] !== 0 && this[De](!0), this[_] ? this.emit("data", e) : this[Me](e), this[b] !== 0 && this.emit("readable"), n && r(n), this[_]) : e.length ? (typeof e == "string" && !(t === this[g] && !this[ke]?.lastNeed) && (e = Buffer.from(e, t)), Buffer.isBuffer(e) && this[g] && (e = this[ke].write(e)), this[_] && this[b] !== 0 && this[De](!0), this[_] ? this.emit("data", e) : this[Me](e), this[b] !== 0 && this.emit("readable"), n && r(n), this[_]) : (this[b] !== 0 && this.emit("readable"), n && r(n), this[_]);
	}
	read(e) {
		if (this[S]) return null;
		if (this[w] = !1, this[b] === 0 || e === 0 || e && e > this[b]) return this[m](), null;
		this[x] && (e = null), this[v].length > 1 && !this[x] && (this[v] = [this[g] ? this[v].join("") : Buffer.concat(this[v], this[b])]);
		let t = this[Ee](e || null, this[v][0]);
		return this[m](), t;
	}
	[Ee](e, t) {
		if (this[x]) this[Ne]();
		else {
			let n = t;
			e === n.length || e === null ? this[Ne]() : typeof n == "string" ? (this[v][0] = n.slice(e), t = n.slice(0, e), this[b] -= e) : (this[v][0] = n.subarray(e), t = n.subarray(0, e), this[b] -= e);
		}
		return this.emit("data", t), !this[v].length && !this[p] && this.emit("drain"), t;
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, e = void 0), typeof t == "function" && (n = t, t = "utf8"), e !== void 0 && this.write(e, t), n && this.once("end", n), this[p] = !0, this.writable = !1, (this[_] || !this[Ae]) && this[m](), this;
	}
	[je]() {
		this[S] || (!this[Ve] && !this[y].length && (this[w] = !0), this[Ae] = !1, this[_] = !0, this.emit("resume"), this[v].length ? this[De]() : this[p] ? this[m]() : this.emit("drain"));
	}
	resume() {
		return this[je]();
	}
	pause() {
		this[_] = !1, this[Ae] = !0, this[w] = !1;
	}
	get destroyed() {
		return this[S];
	}
	get flowing() {
		return this[_];
	}
	get paused() {
		return this[Ae];
	}
	[Me](e) {
		this[x] ? this[b] += 1 : this[b] += e.length, this[v].push(e);
	}
	[Ne]() {
		return this[x] ? --this[b] : this[b] -= this[v][0].length, this[v].shift();
	}
	[De](e = !1) {
		do		;
while (this[Oe](this[Ne]()) && this[v].length);
		!e && !this[v].length && !this[p] && this.emit("drain");
	}
	[Oe](e) {
		return this.emit("data", e), this[_];
	}
	pipe(e, t) {
		if (this[S]) return e;
		this[w] = !1;
		let n = this[h];
		return t ||= {}, e === ye.stdout || e === ye.stderr ? t.end = !1 : t.end = t.end !== !1, t.proxyErrors = !!t.proxyErrors, n ? t.end && e.end() : (this[y].push(t.proxyErrors ? new Je(this, e, t) : new qe(this, e, t)), this[C] ? He(() => this[je]()) : this[je]()), e;
	}
	unpipe(e) {
		let t = this[y].find((t) => t.dest === e);
		t && (this[y].length === 1 ? (this[_] && this[Ve] === 0 && (this[_] = !1), this[y] = []) : this[y].splice(this[y].indexOf(t), 1), t.unpipe());
	}
	addListener(e, t) {
		return this.on(e, t);
	}
	on(e, t) {
		let n = super.on(e, t);
		if (e === "data") this[w] = !1, this[Ve]++, !this[y].length && !this[_] && this[je]();
		else if (e === "readable" && this[b] !== 0) super.emit("readable");
		else if (We(e) && this[h]) super.emit(e), this.removeAllListeners(e);
		else if (e === "error" && this[we]) {
			let e = t;
			this[C] ? He(() => e.call(this, this[we])) : e.call(this, this[we]);
		}
		return n;
	}
	removeListener(e, t) {
		return this.off(e, t);
	}
	off(e, t) {
		let n = super.off(e, t);
		return e === "data" && (this[Ve] = this.listeners("data").length, this[Ve] === 0 && !this[w] && !this[y].length && (this[_] = !1)), n;
	}
	removeAllListeners(e) {
		let t = super.removeAllListeners(e);
		return (e === "data" || e === void 0) && (this[Ve] = 0, !this[w] && !this[y].length && (this[_] = !1)), t;
	}
	get emittedEnd() {
		return this[h];
	}
	[m]() {
		!this[Ce] && !this[h] && !this[S] && this[v].length === 0 && this[p] && (this[Ce] = !0, this.emit("end"), this.emit("prefinish"), this.emit("finish"), this[Te] && this.emit("close"), this[Ce] = !1);
	}
	emit(e, ...t) {
		let n = t[0];
		if (e !== "error" && e !== "close" && e !== S && this[S]) return !1;
		if (e === "data") return !this[x] && !n ? !1 : this[C] ? (He(() => this[Fe](n)), !0) : this[Fe](n);
		if (e === "end") return this[Ie]();
		if (e === "close") {
			if (this[Te] = !0, !this[h] && !this[S]) return !1;
			let e = super.emit("close");
			return this.removeAllListeners("close"), e;
		} else if (e === "error") {
			this[we] = n, super.emit(Pe, n);
			let e = !this[Be] || this.listeners("error").length ? super.emit("error", n) : !1;
			return this[m](), e;
		} else if (e === "resume") {
			let e = super.emit("resume");
			return this[m](), e;
		} else if (e === "finish" || e === "prefinish") {
			let t = super.emit(e);
			return this.removeAllListeners(e), t;
		}
		let r = super.emit(e, ...t);
		return this[m](), r;
	}
	[Fe](e) {
		for (let t of this[y]) t.dest.write(e) === !1 && this.pause();
		let t = this[w] ? !1 : super.emit("data", e);
		return this[m](), t;
	}
	[Ie]() {
		return this[h] ? !1 : (this[h] = !0, this.readable = !1, this[C] ? (He(() => this[Le]()), !0) : this[Le]());
	}
	[Le]() {
		if (this[ke]) {
			let e = this[ke].end();
			if (e) {
				for (let t of this[y]) t.dest.write(e);
				this[w] || super.emit("data", e);
			}
		}
		for (let e of this[y]) e.end();
		let e = super.emit("end");
		return this.removeAllListeners("end"), e;
	}
	async collect() {
		let e = Object.assign([], { dataLength: 0 });
		this[x] || (e.dataLength = 0);
		let t = this.promise();
		return this.on("data", (t) => {
			e.push(t), this[x] || (e.dataLength += t.length);
		}), await t, e;
	}
	async concat() {
		if (this[x]) throw Error("cannot concat in objectMode");
		let e = await this.collect();
		return this[g] ? e.join("") : Buffer.concat(e, e.dataLength);
	}
	async promise() {
		return new Promise((e, t) => {
			this.on(S, () => t(/* @__PURE__ */ Error("stream destroyed"))), this.on("error", (e) => t(e)), this.on("end", () => e());
		});
	}
	[Symbol.asyncIterator]() {
		this[w] = !1;
		let e = !1, t = async () => (this.pause(), e = !0, {
			value: void 0,
			done: !0
		});
		return {
			next: () => {
				if (e) return t();
				let n = this.read();
				if (n !== null) return Promise.resolve({
					done: !1,
					value: n
				});
				if (this[p]) return t();
				let r, i, a = (e) => {
					this.off("data", o), this.off("end", s), this.off(S, c), t(), i(e);
				}, o = (e) => {
					this.off("error", a), this.off("end", s), this.off(S, c), this.pause(), r({
						value: e,
						done: !!this[p]
					});
				}, s = () => {
					this.off("error", a), this.off("data", o), this.off(S, c), t(), r({
						done: !0,
						value: void 0
					});
				}, c = () => a(/* @__PURE__ */ Error("stream destroyed"));
				return new Promise((e, t) => {
					i = t, r = e, this.once(S, c), this.once("error", a), this.once("end", s), this.once("data", o);
				});
			},
			throw: t,
			return: t,
			[Symbol.asyncIterator]() {
				return this;
			},
			[Symbol.asyncDispose]: async () => {}
		};
	}
	[Symbol.iterator]() {
		this[w] = !1;
		let e = !1, t = () => (this.pause(), this.off(Pe, t), this.off(S, t), this.off("end", t), e = !0, {
			done: !0,
			value: void 0
		});
		return this.once("end", t), this.once(Pe, t), this.once(S, t), {
			next: () => {
				if (e) return t();
				let n = this.read();
				return n === null ? t() : {
					done: !1,
					value: n
				};
			},
			throw: t,
			return: t,
			[Symbol.iterator]() {
				return this;
			},
			[Symbol.dispose]: () => {}
		};
	}
	destroy(e) {
		if (this[S]) return e ? this.emit("error", e) : this.emit(S), this;
		this[S] = !0, this[w] = !0, this[v].length = 0, this[b] = 0;
		let t = this;
		return typeof t.close == "function" && !this[Te] && t.close(), e ? this.emit("error", e) : this.emit(S), this;
	}
	static get isStream() {
		return be;
	}
}, Qe = d.writev, T = Symbol("_autoClose"), E = Symbol("_close"), $e = Symbol("_ended"), D = Symbol("_fd"), et = Symbol("_finished"), O = Symbol("_flags"), tt = Symbol("_flush"), nt = Symbol("_handleChunk"), rt = Symbol("_makeBuf"), it = Symbol("_mode"), at = Symbol("_needDrain"), ot = Symbol("_onerror"), st = Symbol("_onopen"), ct = Symbol("_onread"), lt = Symbol("_onwrite"), k = Symbol("_open"), A = Symbol("_path"), j = Symbol("_pos"), M = Symbol("_queue"), ut = Symbol("_read"), dt = Symbol("_readSize"), N = Symbol("_reading"), ft = Symbol("_remain"), pt = Symbol("_size"), mt = Symbol("_write"), ht = Symbol("_writing"), gt = Symbol("_defaultFlag"), _t = Symbol("_errored"), vt = class extends Ze {
	[_t] = !1;
	[D];
	[A];
	[dt];
	[N] = !1;
	[pt];
	[ft];
	[T];
	constructor(e, t) {
		if (t ||= {}, super(t), this.readable = !0, this.writable = !1, typeof e != "string") throw TypeError("path must be a string");
		this[_t] = !1, this[D] = typeof t.fd == "number" ? t.fd : void 0, this[A] = e, this[dt] = t.readSize || 16 * 1024 * 1024, this[N] = !1, this[pt] = typeof t.size == "number" ? t.size : Infinity, this[ft] = this[pt], this[T] = typeof t.autoClose == "boolean" ? t.autoClose : !0, typeof this[D] == "number" ? this[ut]() : this[k]();
	}
	get fd() {
		return this[D];
	}
	get path() {
		return this[A];
	}
	write() {
		throw TypeError("this is a readable stream");
	}
	end() {
		throw TypeError("this is a readable stream");
	}
	[k]() {
		d.open(this[A], "r", (e, t) => this[st](e, t));
	}
	[st](e, t) {
		e ? this[ot](e) : (this[D] = t, this.emit("open", t), this[ut]());
	}
	[rt]() {
		return Buffer.allocUnsafe(Math.min(this[dt], this[ft]));
	}
	[ut]() {
		if (!this[N]) {
			this[N] = !0;
			let e = this[rt]();
			if (e.length === 0) return process.nextTick(() => this[ct](null, 0, e));
			d.read(this[D], e, 0, e.length, null, (e, t, n) => this[ct](e, t, n));
		}
	}
	[ct](e, t, n) {
		this[N] = !1, e ? this[ot](e) : this[nt](t, n) && this[ut]();
	}
	[E]() {
		if (this[T] && typeof this[D] == "number") {
			let e = this[D];
			this[D] = void 0, d.close(e, (e) => e ? this.emit("error", e) : this.emit("close"));
		}
	}
	[ot](e) {
		this[N] = !0, this[E](), this.emit("error", e);
	}
	[nt](e, t) {
		let n = !1;
		return this[ft] -= e, e > 0 && (n = super.write(e < t.length ? t.subarray(0, e) : t)), (e === 0 || this[ft] <= 0) && (n = !1, this[E](), super.end()), n;
	}
	emit(e, ...t) {
		switch (e) {
			case "prefinish":
			case "finish": return !1;
			case "drain": return typeof this[D] == "number" && this[ut](), !1;
			case "error": return this[_t] ? !1 : (this[_t] = !0, super.emit(e, ...t));
			default: return super.emit(e, ...t);
		}
	}
}, yt = class extends vt {
	[k]() {
		let e = !0;
		try {
			this[st](null, d.openSync(this[A], "r")), e = !1;
		} finally {
			e && this[E]();
		}
	}
	[ut]() {
		let e = !0;
		try {
			if (!this[N]) {
				this[N] = !0;
				do {
					let e = this[rt](), t = e.length === 0 ? 0 : d.readSync(this[D], e, 0, e.length, null);
					if (!this[nt](t, e)) break;
				} while (!0);
				this[N] = !1;
			}
			e = !1;
		} finally {
			e && this[E]();
		}
	}
	[E]() {
		if (this[T] && typeof this[D] == "number") {
			let e = this[D];
			this[D] = void 0, d.closeSync(e), this.emit("close");
		}
	}
}, bt = class extends ne {
	readable = !1;
	writable = !0;
	[_t] = !1;
	[ht] = !1;
	[$e] = !1;
	[M] = [];
	[at] = !1;
	[A];
	[it];
	[T];
	[D];
	[gt];
	[O];
	[et] = !1;
	[j];
	constructor(e, t) {
		t ||= {}, super(t), this[A] = e, this[D] = typeof t.fd == "number" ? t.fd : void 0, this[it] = t.mode === void 0 ? 438 : t.mode, this[j] = typeof t.start == "number" ? t.start : void 0, this[T] = typeof t.autoClose == "boolean" ? t.autoClose : !0;
		let n = this[j] === void 0 ? "w" : "r+";
		this[gt] = t.flags === void 0, this[O] = t.flags === void 0 ? n : t.flags, this[D] === void 0 && this[k]();
	}
	emit(e, ...t) {
		if (e === "error") {
			if (this[_t]) return !1;
			this[_t] = !0;
		}
		return super.emit(e, ...t);
	}
	get fd() {
		return this[D];
	}
	get path() {
		return this[A];
	}
	[ot](e) {
		this[E](), this[ht] = !0, this.emit("error", e);
	}
	[k]() {
		d.open(this[A], this[O], this[it], (e, t) => this[st](e, t));
	}
	[st](e, t) {
		this[gt] && this[O] === "r+" && e && e.code === "ENOENT" ? (this[O] = "w", this[k]()) : e ? this[ot](e) : (this[D] = t, this.emit("open", t), this[ht] || this[tt]());
	}
	end(e, t) {
		return e && this.write(e, t), this[$e] = !0, !this[ht] && !this[M].length && typeof this[D] == "number" && this[lt](null, 0), this;
	}
	write(e, t) {
		return typeof e == "string" && (e = Buffer.from(e, t)), this[$e] ? (this.emit("error", /* @__PURE__ */ Error("write() after end()")), !1) : this[D] === void 0 || this[ht] || this[M].length ? (this[M].push(e), this[at] = !0, !1) : (this[ht] = !0, this[mt](e), !0);
	}
	[mt](e) {
		d.write(this[D], e, 0, e.length, this[j], (e, t) => this[lt](e, t));
	}
	[lt](e, t) {
		e ? this[ot](e) : (this[j] !== void 0 && typeof t == "number" && (this[j] += t), this[M].length ? this[tt]() : (this[ht] = !1, this[$e] && !this[et] ? (this[et] = !0, this[E](), this.emit("finish")) : this[at] && (this[at] = !1, this.emit("drain"))));
	}
	[tt]() {
		if (this[M].length === 0) this[$e] && this[lt](null, 0);
		else if (this[M].length === 1) this[mt](this[M].pop());
		else {
			let e = this[M];
			this[M] = [], Qe(this[D], e, this[j], (e, t) => this[lt](e, t));
		}
	}
	[E]() {
		if (this[T] && typeof this[D] == "number") {
			let e = this[D];
			this[D] = void 0, d.close(e, (e) => e ? this.emit("error", e) : this.emit("close"));
		}
	}
}, xt = class extends bt {
	[k]() {
		let e;
		if (this[gt] && this[O] === "r+") try {
			e = d.openSync(this[A], this[O], this[it]);
		} catch (e) {
			if (e?.code === "ENOENT") return this[O] = "w", this[k]();
			throw e;
		}
		else e = d.openSync(this[A], this[O], this[it]);
		this[st](null, e);
	}
	[E]() {
		if (this[T] && typeof this[D] == "number") {
			let e = this[D];
			this[D] = void 0, d.closeSync(e), this.emit("close");
		}
	}
	[mt](e) {
		let t = !0;
		try {
			this[lt](null, d.writeSync(this[D], e, 0, e.length, this[j])), t = !1;
		} finally {
			if (t) try {
				this[E]();
			} catch {}
		}
	}
}, St = new Map([
	["C", "cwd"],
	["f", "file"],
	["z", "gzip"],
	["P", "preservePaths"],
	["U", "unlink"],
	["strip-components", "strip"],
	["stripComponents", "strip"],
	["keep-newer", "newer"],
	["keepNewer", "newer"],
	["keep-newer-files", "newer"],
	["keepNewerFiles", "newer"],
	["k", "keep"],
	["keep-existing", "keep"],
	["keepExisting", "keep"],
	["m", "noMtime"],
	["no-mtime", "noMtime"],
	["p", "preserveOwner"],
	["L", "follow"],
	["h", "follow"],
	["onentry", "onReadEntry"]
]), Ct = (e) => !!e.sync && !!e.file, wt = (e) => !e.sync && !!e.file, Tt = (e) => !!e.sync && !e.file, Et = (e) => !e.sync && !e.file, Dt = (e) => !!e.file, Ot = (e) => St.get(e) || e, kt = (e = {}) => {
	if (!e) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		let e = Ot(n);
		t[e] = r;
	}
	return t.chmod === void 0 && t.noChmod === !1 && (t.chmod = !0), delete t.noChmod, t;
}, At = (e, t, n, r, i) => Object.assign((a = [], o, s) => {
	Array.isArray(a) && (o = a, a = {}), typeof o == "function" && (s = o, o = void 0), o = o ? Array.from(o) : [];
	let c = kt(a);
	if (i?.(c, o), Ct(c)) {
		if (typeof s == "function") throw TypeError("callback not supported for sync tar functions");
		return e(c, o);
	} else if (wt(c)) {
		let e = t(c, o);
		return s ? e.then(() => s(), s) : e;
	} else if (Tt(c)) {
		if (typeof s == "function") throw TypeError("callback not supported for sync tar functions");
		return n(c, o);
	} else if (Et(c)) {
		if (typeof s == "function") throw TypeError("callback only supported with file option");
		return r(c, o);
	}
	throw Error("impossible options??");
}, {
	syncFile: e,
	asyncFile: t,
	syncNoFile: n,
	asyncNoFile: r,
	validate: i
}), jt = fe.constants || { ZLIB_VERNUM: 4736 }, P = Object.freeze(Object.assign(Object.create(null), {
	Z_NO_FLUSH: 0,
	Z_PARTIAL_FLUSH: 1,
	Z_SYNC_FLUSH: 2,
	Z_FULL_FLUSH: 3,
	Z_FINISH: 4,
	Z_BLOCK: 5,
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_VERSION_ERROR: -6,
	Z_NO_COMPRESSION: 0,
	Z_BEST_SPEED: 1,
	Z_BEST_COMPRESSION: 9,
	Z_DEFAULT_COMPRESSION: -1,
	Z_FILTERED: 1,
	Z_HUFFMAN_ONLY: 2,
	Z_RLE: 3,
	Z_FIXED: 4,
	Z_DEFAULT_STRATEGY: 0,
	DEFLATE: 1,
	INFLATE: 2,
	GZIP: 3,
	GUNZIP: 4,
	DEFLATERAW: 5,
	INFLATERAW: 6,
	UNZIP: 7,
	BROTLI_DECODE: 8,
	BROTLI_ENCODE: 9,
	Z_MIN_WINDOWBITS: 8,
	Z_MAX_WINDOWBITS: 15,
	Z_DEFAULT_WINDOWBITS: 15,
	Z_MIN_CHUNK: 64,
	Z_MAX_CHUNK: Infinity,
	Z_DEFAULT_CHUNK: 16384,
	Z_MIN_MEMLEVEL: 1,
	Z_MAX_MEMLEVEL: 9,
	Z_DEFAULT_MEMLEVEL: 8,
	Z_MIN_LEVEL: -1,
	Z_MAX_LEVEL: 9,
	Z_DEFAULT_LEVEL: -1,
	BROTLI_OPERATION_PROCESS: 0,
	BROTLI_OPERATION_FLUSH: 1,
	BROTLI_OPERATION_FINISH: 2,
	BROTLI_OPERATION_EMIT_METADATA: 3,
	BROTLI_MODE_GENERIC: 0,
	BROTLI_MODE_TEXT: 1,
	BROTLI_MODE_FONT: 2,
	BROTLI_DEFAULT_MODE: 0,
	BROTLI_MIN_QUALITY: 0,
	BROTLI_MAX_QUALITY: 11,
	BROTLI_DEFAULT_QUALITY: 11,
	BROTLI_MIN_WINDOW_BITS: 10,
	BROTLI_MAX_WINDOW_BITS: 24,
	BROTLI_LARGE_MAX_WINDOW_BITS: 30,
	BROTLI_DEFAULT_WINDOW: 22,
	BROTLI_MIN_INPUT_BLOCK_BITS: 16,
	BROTLI_MAX_INPUT_BLOCK_BITS: 24,
	BROTLI_PARAM_MODE: 0,
	BROTLI_PARAM_QUALITY: 1,
	BROTLI_PARAM_LGWIN: 2,
	BROTLI_PARAM_LGBLOCK: 3,
	BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
	BROTLI_PARAM_SIZE_HINT: 5,
	BROTLI_PARAM_LARGE_WINDOW: 6,
	BROTLI_PARAM_NPOSTFIX: 7,
	BROTLI_PARAM_NDIRECT: 8,
	BROTLI_DECODER_RESULT_ERROR: 0,
	BROTLI_DECODER_RESULT_SUCCESS: 1,
	BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
	BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
	BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
	BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
	BROTLI_DECODER_NO_ERROR: 0,
	BROTLI_DECODER_SUCCESS: 1,
	BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
	BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
	BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
	BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
	BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
	BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
	BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
	BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
	BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
	BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
	BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
	BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
	BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
	BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
	BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
	BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
	BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
	BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
	BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
	BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
	BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
	BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
	BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
	BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
	BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
	BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
	BROTLI_DECODER_ERROR_UNREACHABLE: -31
}, jt)), Mt = ue.concat, Nt = Object.getOwnPropertyDescriptor(ue, "concat"), Pt = (e) => e, Ft = Nt?.writable === !0 || Nt?.set !== void 0 ? (e) => {
	ue.concat = e ? Pt : Mt;
} : (e) => {}, It = Symbol("_superWrite"), Lt = class extends Error {
	code;
	errno;
	constructor(e, t) {
		super("zlib: " + e.message, { cause: e }), this.code = e.code, this.errno = e.errno, this.code ||= "ZLIB_ERROR", this.message = "zlib: " + e.message, Error.captureStackTrace(this, t ?? this.constructor);
	}
	get name() {
		return "ZlibError";
	}
}, Rt = Symbol("flushFlag"), zt = class extends Ze {
	#e = !1;
	#t = !1;
	#n;
	#r;
	#i;
	#a;
	#o;
	get sawError() {
		return this.#e;
	}
	get handle() {
		return this.#a;
	}
	get flushFlag() {
		return this.#n;
	}
	constructor(e, t) {
		if (!e || typeof e != "object") throw TypeError("invalid options for ZlibBase constructor");
		if (super(e), this.#n = e.flush ?? 0, this.#r = e.finishFlush ?? 0, this.#i = e.fullFlushFlag ?? 0, typeof de[t] != "function") throw TypeError("Compression method not supported: " + t);
		try {
			this.#a = new de[t](e);
		} catch (e) {
			throw new Lt(e, this.constructor);
		}
		this.#o = (e) => {
			this.#e || (this.#e = !0, this.close(), this.emit("error", e));
		}, this.#a?.on("error", (e) => this.#o(new Lt(e))), this.once("end", () => this.close);
	}
	close() {
		this.#a && (this.#a.close(), this.#a = void 0, this.emit("close"));
	}
	reset() {
		if (!this.#e) return le(this.#a, "zlib binding closed"), this.#a.reset?.();
	}
	flush(e) {
		this.ended || (typeof e != "number" && (e = this.#i), this.write(Object.assign(ue.alloc(0), { [Rt]: e })));
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, t = void 0, e = void 0), typeof t == "function" && (n = t, t = void 0), e && (t ? this.write(e, t) : this.write(e)), this.flush(this.#r), this.#t = !0, super.end(n);
	}
	get ended() {
		return this.#t;
	}
	[It](e) {
		return super.write(e);
	}
	write(e, t, n) {
		if (typeof t == "function" && (n = t, t = "utf8"), typeof e == "string" && (e = ue.from(e, t)), this.#e) return;
		le(this.#a, "zlib binding closed");
		let r = this.#a._handle, i = r.close;
		r.close = () => {};
		let a = this.#a.close;
		this.#a.close = () => {}, Ft(!0);
		let o;
		try {
			let t = typeof e[Rt] == "number" ? e[Rt] : this.#n;
			o = this.#a._processChunk(e, t), Ft(!1);
		} catch (e) {
			Ft(!1), this.#o(new Lt(e, this.write));
		} finally {
			this.#a && (this.#a._handle = r, r.close = i, this.#a.close = a, this.#a.removeAllListeners("error"));
		}
		this.#a && this.#a.on("error", (e) => this.#o(new Lt(e, this.write)));
		let s;
		if (o) if (Array.isArray(o) && o.length > 0) {
			let e = o[0];
			s = this[It](ue.from(e));
			for (let e = 1; e < o.length; e++) s = this[It](o[e]);
		} else s = this[It](ue.from(o));
		return n && n(), s;
	}
}, Bt = class extends zt {
	#e;
	#t;
	constructor(e, t) {
		e ||= {}, e.flush = e.flush || P.Z_NO_FLUSH, e.finishFlush = e.finishFlush || P.Z_FINISH, e.fullFlushFlag = P.Z_FULL_FLUSH, super(e, t), this.#e = e.level, this.#t = e.strategy;
	}
	params(e, t) {
		if (!this.sawError) {
			if (!this.handle) throw Error("cannot switch params when binding is closed");
			if (!this.handle.params) throw Error("not supported in this implementation");
			if (this.#e !== e || this.#t !== t) {
				this.flush(P.Z_SYNC_FLUSH), le(this.handle, "zlib binding closed");
				let n = this.handle.flush;
				this.handle.flush = (e, t) => {
					typeof e == "function" && (t = e, e = this.flushFlag), this.flush(e), t?.();
				};
				try {
					this.handle.params(e, t);
				} finally {
					this.handle.flush = n;
				}
				this.handle && (this.#e = e, this.#t = t);
			}
		}
	}
}, Vt = class extends Bt {
	#e;
	constructor(e) {
		super(e, "Gzip"), this.#e = e && !!e.portable;
	}
	[It](e) {
		return this.#e ? (this.#e = !1, e[9] = 255, super[It](e)) : super[It](e);
	}
}, Ht = class extends Bt {
	constructor(e) {
		super(e, "Unzip");
	}
}, Ut = class extends zt {
	constructor(e, t) {
		e ||= {}, e.flush = e.flush || P.BROTLI_OPERATION_PROCESS, e.finishFlush = e.finishFlush || P.BROTLI_OPERATION_FINISH, e.fullFlushFlag = P.BROTLI_OPERATION_FLUSH, super(e, t);
	}
}, Wt = class extends Ut {
	constructor(e) {
		super(e, "BrotliCompress");
	}
}, Gt = class extends Ut {
	constructor(e) {
		super(e, "BrotliDecompress");
	}
}, Kt = class extends zt {
	constructor(e, t) {
		e ||= {}, e.flush = e.flush || P.ZSTD_e_continue, e.finishFlush = e.finishFlush || P.ZSTD_e_end, e.fullFlushFlag = P.ZSTD_e_flush, super(e, t);
	}
}, qt = class extends Kt {
	constructor(e) {
		super(e, "ZstdCompress");
	}
}, Jt = class extends Kt {
	constructor(e) {
		super(e, "ZstdDecompress");
	}
}, Yt = (e, t) => {
	if (Number.isSafeInteger(e)) e < 0 ? Zt(e, t) : Xt(e, t);
	else throw Error("cannot encode number outside of javascript safe integer range");
	return t;
}, Xt = (e, t) => {
	t[0] = 128;
	for (var n = t.length; n > 1; n--) t[n - 1] = e & 255, e = Math.floor(e / 256);
}, Zt = (e, t) => {
	t[0] = 255;
	var n = !1;
	e *= -1;
	for (var r = t.length; r > 1; r--) {
		var i = e & 255;
		e = Math.floor(e / 256), n ? t[r - 1] = tn(i) : i === 0 ? t[r - 1] = 0 : (n = !0, t[r - 1] = nn(i));
	}
}, Qt = (e) => {
	let t = e[0], n = t === 128 ? en(e.subarray(1, e.length)) : t === 255 ? $t(e) : null;
	if (n === null) throw Error("invalid base256 encoding");
	if (!Number.isSafeInteger(n)) throw Error("parsed number outside of javascript safe integer range");
	return n;
}, $t = (e) => {
	for (var t = e.length, n = 0, r = !1, i = t - 1; i > -1; i--) {
		var a = Number(e[i]), o;
		r ? o = tn(a) : a === 0 ? o = a : (r = !0, o = nn(a)), o !== 0 && (n -= o * 256 ** (t - i - 1));
	}
	return n;
}, en = (e) => {
	for (var t = e.length, n = 0, r = t - 1; r > -1; r--) {
		var i = Number(e[r]);
		i !== 0 && (n += i * 256 ** (t - r - 1));
	}
	return n;
}, tn = (e) => (255 ^ e) & 255, nn = (e) => (255 ^ e) + 1 & 255;
ve({}, {
	code: () => sn,
	isCode: () => rn,
	isName: () => an,
	name: () => on
});
var rn = (e) => on.has(e), an = (e) => sn.has(e), on = new Map([
	["0", "File"],
	["", "OldFile"],
	["1", "Link"],
	["2", "SymbolicLink"],
	["3", "CharacterDevice"],
	["4", "BlockDevice"],
	["5", "Directory"],
	["6", "FIFO"],
	["7", "ContiguousFile"],
	["g", "GlobalExtendedHeader"],
	["x", "ExtendedHeader"],
	["A", "SolarisACL"],
	["D", "GNUDumpDir"],
	["I", "Inode"],
	["K", "NextFileHasLongLinkpath"],
	["L", "NextFileHasLongPath"],
	["M", "ContinuationFile"],
	["N", "OldGnuLongPath"],
	["S", "SparseFile"],
	["V", "TapeVolumeHeader"],
	["X", "OldExtendedHeader"]
]), sn = new Map(Array.from(on).map((e) => [e[1], e[0]])), cn = class {
	cksumValid = !1;
	needPax = !1;
	nullBlock = !1;
	block;
	path;
	mode;
	uid;
	gid;
	size;
	cksum;
	#e = "Unsupported";
	linkpath;
	uname;
	gname;
	devmaj = 0;
	devmin = 0;
	atime;
	ctime;
	mtime;
	charset;
	comment;
	constructor(e, t = 0, n, r) {
		Buffer.isBuffer(e) ? this.decode(e, t || 0, n, r) : e && this.#t(e);
	}
	decode(e, t, n, r) {
		if (t ||= 0, !e || !(e.length >= t + 512)) throw Error("need 512 bytes for header");
		this.path = n?.path ?? un(e, t, 100), this.mode = n?.mode ?? r?.mode ?? F(e, t + 100, 8), this.uid = n?.uid ?? r?.uid ?? F(e, t + 108, 8), this.gid = n?.gid ?? r?.gid ?? F(e, t + 116, 8), this.size = n?.size ?? r?.size ?? F(e, t + 124, 12), this.mtime = n?.mtime ?? r?.mtime ?? dn(e, t + 136, 12), this.cksum = F(e, t + 148, 12), r && this.#t(r, !0), n && this.#t(n);
		let i = un(e, t + 156, 1);
		if (rn(i) && (this.#e = i || "0"), this.#e === "0" && this.path.slice(-1) === "/" && (this.#e = "5"), this.#e === "5" && (this.size = 0), this.linkpath = un(e, t + 157, 100), e.subarray(t + 257, t + 265).toString() === "ustar\x0000") if (this.uname = n?.uname ?? r?.uname ?? un(e, t + 265, 32), this.gname = n?.gname ?? r?.gname ?? un(e, t + 297, 32), this.devmaj = n?.devmaj ?? r?.devmaj ?? F(e, t + 329, 8) ?? 0, this.devmin = n?.devmin ?? r?.devmin ?? F(e, t + 337, 8) ?? 0, e[t + 475] !== 0) {
			let n = un(e, t + 345, 155);
			this.path = n + "/" + this.path;
		} else {
			let i = un(e, t + 345, 130);
			i && (this.path = i + "/" + this.path), this.atime = n?.atime ?? r?.atime ?? dn(e, t + 476, 12), this.ctime = n?.ctime ?? r?.ctime ?? dn(e, t + 488, 12);
		}
		let a = 256;
		for (let n = t; n < t + 148; n++) a += e[n];
		for (let n = t + 156; n < t + 512; n++) a += e[n];
		this.cksumValid = a === this.cksum, this.cksum === void 0 && a === 256 && (this.nullBlock = !0);
	}
	#t(e, t = !1) {
		Object.assign(this, Object.fromEntries(Object.entries(e).filter(([e, n]) => !(n == null || e === "path" && t || e === "linkpath" && t || e === "global"))));
	}
	encode(e, t = 0) {
		if (e ||= this.block = Buffer.alloc(512), this.#e === "Unsupported" && (this.#e = "0"), !(e.length >= t + 512)) throw Error("need 512 bytes for header");
		let n = this.ctime || this.atime ? 130 : 155, r = ln(this.path || "", n), i = r[0], a = r[1];
		this.needPax = !!r[2], this.needPax = xn(e, t, 100, i) || this.needPax, this.needPax = I(e, t + 100, 8, this.mode) || this.needPax, this.needPax = I(e, t + 108, 8, this.uid) || this.needPax, this.needPax = I(e, t + 116, 8, this.gid) || this.needPax, this.needPax = I(e, t + 124, 12, this.size) || this.needPax, this.needPax = yn(e, t + 136, 12, this.mtime) || this.needPax, e[t + 156] = Number(this.#e.codePointAt(0)), this.needPax = xn(e, t + 157, 100, this.linkpath) || this.needPax, e.write("ustar\x0000", t + 257, 8), this.needPax = xn(e, t + 265, 32, this.uname) || this.needPax, this.needPax = xn(e, t + 297, 32, this.gname) || this.needPax, this.needPax = I(e, t + 329, 8, this.devmaj) || this.needPax, this.needPax = I(e, t + 337, 8, this.devmin) || this.needPax, this.needPax = xn(e, t + 345, n, a) || this.needPax, e[t + 475] === 0 ? (this.needPax = xn(e, t + 345, 130, a) || this.needPax, this.needPax = yn(e, t + 476, 12, this.atime) || this.needPax, this.needPax = yn(e, t + 488, 12, this.ctime) || this.needPax) : this.needPax = xn(e, t + 345, 155, a) || this.needPax;
		let o = 256;
		for (let n = t; n < t + 148; n++) o += e[n];
		for (let n = t + 156; n < t + 512; n++) o += e[n];
		return this.cksum = o, I(e, t + 148, 8, this.cksum), this.cksumValid = !0, this.needPax;
	}
	get type() {
		return this.#e === "Unsupported" ? this.#e : on.get(this.#e);
	}
	get typeKey() {
		return this.#e;
	}
	set type(e) {
		let t = String(sn.get(e));
		if (rn(t) || t === "Unsupported") this.#e = t;
		else if (rn(e)) this.#e = e;
		else throw TypeError("invalid entry type: " + e);
	}
}, ln = (e, t) => {
	let n = e, r = "", i, a = s.parse(e).root || ".";
	if (Buffer.byteLength(n) < 100) i = [
		n,
		r,
		!1
	];
	else {
		r = s.dirname(n), n = s.basename(n);
		do
			Buffer.byteLength(n) <= 100 && Buffer.byteLength(r) <= t ? i = [
				n,
				r,
				!1
			] : Buffer.byteLength(n) > 100 && Buffer.byteLength(r) <= t ? i = [
				n.slice(0, 99),
				r,
				!0
			] : (n = s.join(s.basename(r), n), r = s.dirname(r));
		while (r !== a && i === void 0);
		i ||= [
			e.slice(0, 99),
			"",
			!0
		];
	}
	return i;
}, un = (e, t, n) => e.subarray(t, t + n).toString("utf8").replace(/\0.*/, ""), dn = (e, t, n) => fn(F(e, t, n)), fn = (e) => e === void 0 ? void 0 : /* @__PURE__ */ new Date(e * 1e3), F = (e, t, n) => Number(e[t]) & 128 ? Qt(e.subarray(t, t + n)) : mn(e, t, n), pn = (e) => isNaN(e) ? void 0 : e, mn = (e, t, n) => pn(parseInt(e.subarray(t, t + n).toString("utf8").replace(/\0.*$/, "").trim(), 8)), hn = {
	12: 8589934591,
	8: 2097151
}, I = (e, t, n, r) => r === void 0 ? !1 : r > hn[n] || r < 0 ? (Yt(r, e.subarray(t, t + n)), !0) : (gn(e, t, n, r), !1), gn = (e, t, n, r) => e.write(_n(r, n), t, n, "ascii"), _n = (e, t) => vn(Math.floor(e).toString(8), t), vn = (e, t) => (e.length === t - 1 ? e : Array(t - e.length - 1).join("0") + e + " ") + "\0", yn = (e, t, n, r) => r === void 0 ? !1 : I(e, t, n, r.getTime() / 1e3), bn = Array(156).join("\0"), xn = (e, t, n, r) => r === void 0 ? !1 : (e.write(r + bn, t, n, "utf8"), r.length !== Buffer.byteLength(r) || r.length > n), Sn = class e {
	atime;
	mtime;
	ctime;
	charset;
	comment;
	gid;
	uid;
	gname;
	uname;
	linkpath;
	dev;
	ino;
	nlink;
	path;
	size;
	mode;
	global;
	constructor(e, t = !1) {
		this.atime = e.atime, this.charset = e.charset, this.comment = e.comment, this.ctime = e.ctime, this.dev = e.dev, this.gid = e.gid, this.global = t, this.gname = e.gname, this.ino = e.ino, this.linkpath = e.linkpath, this.mtime = e.mtime, this.nlink = e.nlink, this.path = e.path, this.size = e.size, this.uid = e.uid, this.uname = e.uname;
	}
	encode() {
		let e = this.encodeBody();
		if (e === "") return Buffer.allocUnsafe(0);
		let t = Buffer.byteLength(e), n = 512 * Math.ceil(1 + t / 512), r = Buffer.allocUnsafe(n);
		for (let e = 0; e < 512; e++) r[e] = 0;
		new cn({
			path: ("PaxHeader/" + a(this.path ?? "")).slice(0, 99),
			mode: this.mode || 420,
			uid: this.uid,
			gid: this.gid,
			size: t,
			mtime: this.mtime,
			type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
			linkpath: "",
			uname: this.uname || "",
			gname: this.gname || "",
			devmaj: 0,
			devmin: 0,
			atime: this.atime,
			ctime: this.ctime
		}).encode(r), r.write(e, 512, t, "utf8");
		for (let e = t + 512; e < r.length; e++) r[e] = 0;
		return r;
	}
	encodeBody() {
		return this.encodeField("path") + this.encodeField("ctime") + this.encodeField("atime") + this.encodeField("dev") + this.encodeField("ino") + this.encodeField("nlink") + this.encodeField("charset") + this.encodeField("comment") + this.encodeField("gid") + this.encodeField("gname") + this.encodeField("linkpath") + this.encodeField("mtime") + this.encodeField("size") + this.encodeField("uid") + this.encodeField("uname");
	}
	encodeField(e) {
		if (this[e] === void 0) return "";
		let t = this[e], n = t instanceof Date ? t.getTime() / 1e3 : t, r = " " + (e === "dev" || e === "ino" || e === "nlink" ? "SCHILY." : "") + e + "=" + n + "\n", i = Buffer.byteLength(r), a = Math.floor(Math.log(i) / Math.log(10)) + 1;
		return i + a >= 10 ** a && (a += 1), a + i + r;
	}
	static parse(t, n, r = !1) {
		return new e(Cn(wn(t), n), r);
	}
}, Cn = (e, t) => t ? Object.assign({}, t, e) : e, wn = (e) => e.replace(/\n$/, "").split("\n").reduce(Tn, Object.create(null)), Tn = (e, t) => {
	let n = parseInt(t, 10);
	if (n !== Buffer.byteLength(t) + 1) return e;
	t = t.slice((n + " ").length);
	let r = t.split("="), i = r.shift();
	if (!i) return e;
	let a = i.replace(/^SCHILY\.(dev|ino|nlink)/, "$1"), o = r.join("=");
	return e[a] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(a) ? /* @__PURE__ */ new Date(Number(o) * 1e3) : /^[0-9]+$/.test(o) ? +o : o, e;
}, L = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32" ? (e) => e && e.replaceAll(/\\/g, "/") : (e) => e, En = class extends Ze {
	extended;
	globalExtended;
	header;
	startBlockSize;
	blockRemain;
	remain;
	type;
	meta = !1;
	ignore = !1;
	path;
	mode;
	uid;
	gid;
	uname;
	gname;
	size = 0;
	mtime;
	atime;
	ctime;
	linkpath;
	dev;
	ino;
	nlink;
	invalid = !1;
	absolute;
	unsupported = !1;
	constructor(e, t, n) {
		switch (super({}), this.pause(), this.extended = t, this.globalExtended = n, this.header = e, this.remain = e.size ?? 0, this.startBlockSize = 512 * Math.ceil(this.remain / 512), this.blockRemain = this.startBlockSize, this.type = e.type, this.type) {
			case "File":
			case "OldFile":
			case "Link":
			case "SymbolicLink":
			case "CharacterDevice":
			case "BlockDevice":
			case "Directory":
			case "FIFO":
			case "ContiguousFile":
			case "GNUDumpDir": break;
			case "NextFileHasLongLinkpath":
			case "NextFileHasLongPath":
			case "OldGnuLongPath":
			case "GlobalExtendedHeader":
			case "ExtendedHeader":
			case "OldExtendedHeader":
				this.meta = !0;
				break;
			default: this.ignore = !0;
		}
		if (!e.path) throw Error("no path provided for tar.ReadEntry");
		this.path = L(e.path), this.mode = e.mode, this.mode && (this.mode &= 4095), this.uid = e.uid, this.gid = e.gid, this.uname = e.uname, this.gname = e.gname, this.size = this.remain, this.mtime = e.mtime, this.atime = e.atime, this.ctime = e.ctime, this.linkpath = e.linkpath ? L(e.linkpath) : void 0, this.uname = e.uname, this.gname = e.gname, t && this.#e(t), n && this.#e(n, !0);
	}
	write(e) {
		let t = e.length;
		if (t > this.blockRemain) throw Error("writing more to entry than is appropriate");
		let n = this.remain, r = this.blockRemain;
		return this.remain = Math.max(0, n - t), this.blockRemain = Math.max(0, r - t), this.ignore ? !0 : n >= t ? super.write(e) : super.write(e.subarray(0, n));
	}
	#e(e, t = !1) {
		e.path &&= L(e.path), e.linkpath &&= L(e.linkpath), Object.assign(this, Object.fromEntries(Object.entries(e).filter(([e, n]) => !(n == null || e === "path" && t))));
	}
}, Dn = (e, t, n, r = {}) => {
	e.file && (r.file = e.file), e.cwd && (r.cwd = e.cwd), r.code = n instanceof Error && n.code || t, r.tarCode = t, !e.strict && r.recoverable !== !1 ? (n instanceof Error && (r = Object.assign(n, r), n = n.message), e.emit("warn", t, n, r)) : n instanceof Error ? e.emit("error", Object.assign(n, r)) : e.emit("error", Object.assign(/* @__PURE__ */ Error(`${t}: ${n}`), r));
}, On = 1024 * 1024, kn = Buffer.from([31, 139]), An = Buffer.from([
	40,
	181,
	47,
	253
]), jn = Math.max(kn.length, An.length), R = Symbol("state"), Mn = Symbol("writeEntry"), z = Symbol("readEntry"), Nn = Symbol("nextEntry"), Pn = Symbol("processEntry"), B = Symbol("extendedHeader"), Fn = Symbol("globalExtendedHeader"), V = Symbol("meta"), In = Symbol("emitMeta"), H = Symbol("buffer"), U = Symbol("queue"), W = Symbol("ended"), Ln = Symbol("emittedEnd"), Rn = Symbol("emit"), G = Symbol("unzip"), zn = Symbol("consumeChunk"), Bn = Symbol("consumeChunkSub"), Vn = Symbol("consumeBody"), Hn = Symbol("consumeMeta"), Un = Symbol("consumeHeader"), Wn = Symbol("consuming"), Gn = Symbol("bufferConcat"), Kn = Symbol("maybeEnd"), qn = Symbol("writing"), K = Symbol("aborted"), Jn = Symbol("onDone"), Yn = Symbol("sawValidEntry"), Xn = Symbol("sawNullBlock"), Zn = Symbol("sawEOF"), Qn = Symbol("closeStream"), $n = () => !0, er = class extends u {
	file;
	strict;
	maxMetaEntrySize;
	filter;
	brotli;
	zstd;
	writable = !0;
	readable = !1;
	[U] = [];
	[H];
	[z];
	[Mn];
	[R] = "begin";
	[V] = "";
	[B];
	[Fn];
	[W] = !1;
	[G];
	[K] = !1;
	[Yn];
	[Xn] = !1;
	[Zn] = !1;
	[qn] = !1;
	[Wn] = !1;
	[Ln] = !1;
	constructor(e = {}) {
		super(), this.file = e.file || "", this.on(Jn, () => {
			(this[R] === "begin" || this[Yn] === !1) && this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
		}), e.ondone ? this.on(Jn, e.ondone) : this.on(Jn, () => {
			this.emit("prefinish"), this.emit("finish"), this.emit("end");
		}), this.strict = !!e.strict, this.maxMetaEntrySize = e.maxMetaEntrySize || On, this.filter = typeof e.filter == "function" ? e.filter : $n;
		let t = e.file && (e.file.endsWith(".tar.br") || e.file.endsWith(".tbr"));
		this.brotli = !(e.gzip || e.zstd) && e.brotli !== void 0 ? e.brotli : t ? void 0 : !1;
		let n = e.file && (e.file.endsWith(".tar.zst") || e.file.endsWith(".tzst"));
		this.zstd = !(e.gzip || e.brotli) && e.zstd !== void 0 ? e.zstd : n ? !0 : void 0, this.on("end", () => this[Qn]()), typeof e.onwarn == "function" && this.on("warn", e.onwarn), typeof e.onReadEntry == "function" && this.on("entry", e.onReadEntry);
	}
	warn(e, t, n = {}) {
		Dn(this, e, t, n);
	}
	[Un](e, t) {
		this[Yn] === void 0 && (this[Yn] = !1);
		let n;
		try {
			n = new cn(e, t, this[B], this[Fn]);
		} catch (e) {
			return this.warn("TAR_ENTRY_INVALID", e);
		}
		if (n.nullBlock) this[Xn] ? (this[Zn] = !0, this[R] === "begin" && (this[R] = "header"), this[Rn]("eof")) : (this[Xn] = !0, this[Rn]("nullBlock"));
		else if (this[Xn] = !1, !n.cksumValid) this.warn("TAR_ENTRY_INVALID", "checksum failure", { header: n });
		else if (!n.path) this.warn("TAR_ENTRY_INVALID", "path is required", { header: n });
		else {
			let e = n.type;
			if (/^(Symbolic)?Link$/.test(e) && !n.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath required", { header: n });
			else if (!/^(Symbolic)?Link$/.test(e) && !/^(Global)?ExtendedHeader$/.test(e) && n.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header: n });
			else {
				let e = this[Mn] = new En(n, this[B], this[Fn]);
				this[Yn] || (e.remain ? e.on("end", () => {
					e.invalid || (this[Yn] = !0);
				}) : this[Yn] = !0), e.meta ? e.size > this.maxMetaEntrySize ? (e.ignore = !0, this[Rn]("ignoredEntry", e), this[R] = "ignore", e.resume()) : e.size > 0 && (this[V] = "", e.on("data", (e) => this[V] += e), this[R] = "meta") : (this[B] = void 0, e.ignore = e.ignore || !this.filter(e.path, e), e.ignore ? (this[Rn]("ignoredEntry", e), this[R] = e.remain ? "ignore" : "header", e.resume()) : (e.remain ? this[R] = "body" : (this[R] = "header", e.end()), this[z] ? this[U].push(e) : (this[U].push(e), this[Nn]())));
			}
		}
	}
	[Qn]() {
		queueMicrotask(() => this.emit("close"));
	}
	[Pn](e) {
		let t = !0;
		if (!e) this[z] = void 0, t = !1;
		else if (Array.isArray(e)) {
			let [t, ...n] = e;
			this.emit(t, ...n);
		} else this[z] = e, this.emit("entry", e), e.emittedEnd || (e.on("end", () => this[Nn]()), t = !1);
		return t;
	}
	[Nn]() {
		do		;
while (this[Pn](this[U].shift()));
		if (this[U].length === 0) {
			let e = this[z];
			!e || e.flowing || e.size === e.remain ? this[qn] || this.emit("drain") : e.once("drain", () => this.emit("drain"));
		}
	}
	[Vn](e, t) {
		let n = this[Mn];
		if (!n) throw Error("attempt to consume body without entry??");
		let r = n.blockRemain ?? 0, i = r >= e.length && t === 0 ? e : e.subarray(t, t + r);
		return n.write(i), n.blockRemain || (this[R] = "header", this[Mn] = void 0, n.end()), i.length;
	}
	[Hn](e, t) {
		let n = this[Mn], r = this[Vn](e, t);
		return !this[Mn] && n && this[In](n), r;
	}
	[Rn](e, t, n) {
		this[U].length === 0 && !this[z] ? this.emit(e, t, n) : this[U].push([
			e,
			t,
			n
		]);
	}
	[In](e) {
		switch (this[Rn]("meta", this[V]), e.type) {
			case "ExtendedHeader":
			case "OldExtendedHeader":
				this[B] = Sn.parse(this[V], this[B], !1);
				break;
			case "GlobalExtendedHeader":
				this[Fn] = Sn.parse(this[V], this[Fn], !0);
				break;
			case "NextFileHasLongPath":
			case "OldGnuLongPath": {
				let e = this[B] ?? Object.create(null);
				this[B] = e, e.path = this[V].replace(/\0.*/, "");
				break;
			}
			case "NextFileHasLongLinkpath": {
				let e = this[B] || Object.create(null);
				this[B] = e, e.linkpath = this[V].replace(/\0.*/, "");
				break;
			}
			default: throw Error("unknown meta: " + e.type);
		}
	}
	abort(e) {
		this[K] = !0, this.emit("abort", e), this.warn("TAR_ABORT", e, { recoverable: !1 });
	}
	write(e, t, n) {
		if (typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, typeof t == "string" ? t : "utf8")), this[K]) return n?.(), !1;
		if ((this[G] === void 0 || this.brotli === void 0 && this[G] === !1) && e) {
			if (this[H] && (e = Buffer.concat([this[H], e]), this[H] = void 0), e.length < jn) return this[H] = e, n?.(), !0;
			for (let t = 0; this[G] === void 0 && t < kn.length; t++) e[t] !== kn[t] && (this[G] = !1);
			let t = !1;
			if (this[G] === !1 && this.zstd !== !1) {
				t = !0;
				for (let n = 0; n < An.length; n++) if (e[n] !== An[n]) {
					t = !1;
					break;
				}
			}
			let r = this.brotli === void 0 && !t;
			if (this[G] === !1 && r) if (e.length < 512) if (this[W]) this.brotli = !0;
			else return this[H] = e, n?.(), !0;
			else try {
				new cn(e.subarray(0, 512)), this.brotli = !1;
			} catch {
				this.brotli = !0;
			}
			if (this[G] === void 0 || this[G] === !1 && (this.brotli || t)) {
				let r = this[W];
				this[W] = !1, this[G] = this[G] === void 0 ? new Ht({}) : t ? new Jt({}) : new Gt({}), this[G].on("data", (e) => this[zn](e)), this[G].on("error", (e) => this.abort(e)), this[G].on("end", () => {
					this[W] = !0, this[zn]();
				}), this[qn] = !0;
				let i = !!this[G][r ? "end" : "write"](e);
				return this[qn] = !1, n?.(), i;
			}
		}
		this[qn] = !0, this[G] ? this[G].write(e) : this[zn](e), this[qn] = !1;
		let r = this[U].length > 0 ? !1 : this[z] ? this[z].flowing : !0;
		return !r && this[U].length === 0 && this[z]?.once("drain", () => this.emit("drain")), n?.(), r;
	}
	[Gn](e) {
		e && !this[K] && (this[H] = this[H] ? Buffer.concat([this[H], e]) : e);
	}
	[Kn]() {
		if (this[W] && !this[Ln] && !this[K] && !this[Wn]) {
			this[Ln] = !0;
			let e = this[Mn];
			if (e && e.blockRemain) {
				let t = this[H] ? this[H].length : 0;
				this.warn("TAR_BAD_ARCHIVE", `Truncated input (needed ${e.blockRemain} more bytes, only ${t} available)`, { entry: e }), this[H] && e.write(this[H]), e.end();
			}
			this[Rn](Jn);
		}
	}
	[zn](e) {
		if (this[Wn] && e) this[Gn](e);
		else if (!e && !this[H]) this[Kn]();
		else if (e) {
			if (this[Wn] = !0, this[H]) {
				this[Gn](e);
				let t = this[H];
				this[H] = void 0, this[Bn](t);
			} else this[Bn](e);
			for (; this[H] && this[H]?.length >= 512 && !this[K] && !this[Zn];) {
				let e = this[H];
				this[H] = void 0, this[Bn](e);
			}
			this[Wn] = !1;
		}
		(!this[H] || this[W]) && this[Kn]();
	}
	[Bn](e) {
		let t = 0, n = e.length;
		for (; t + 512 <= n && !this[K] && !this[Zn];) switch (this[R]) {
			case "begin":
			case "header":
				this[Un](e, t), t += 512;
				break;
			case "ignore":
			case "body":
				t += this[Vn](e, t);
				break;
			case "meta":
				t += this[Hn](e, t);
				break;
			default: throw Error("invalid state: " + this[R]);
		}
		t < n && (this[H] = this[H] ? Buffer.concat([e.subarray(t), this[H]]) : e.subarray(t));
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, t = void 0, e = void 0), typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, t)), n && this.once("finish", n), this[K] || (this[G] ? (e && this[G].write(e), this[G].end()) : (this[W] = !0, (this.brotli === void 0 || this.zstd === void 0) && (e ||= Buffer.alloc(0)), e && this.write(e), this[Kn]())), this;
	}
}, tr = (e) => {
	let t = e.length - 1, n = -1;
	for (; t > -1 && e.charAt(t) === "/";) n = t, t--;
	return n === -1 ? e : e.slice(0, n);
}, nr = (e) => {
	let t = e.onReadEntry;
	e.onReadEntry = t ? (e) => {
		t(e), e.resume();
	} : (e) => e.resume();
}, rr = (e, t) => {
	let n = new Map(t.map((e) => [tr(e), !0])), r = e.filter, i = (e, t = "") => {
		let r = t || ce(e).root || ".", a;
		if (e === r) a = !1;
		else {
			let t = n.get(e);
			a = t === void 0 ? i(se(e), r) : t;
		}
		return n.set(e, a), a;
	};
	e.filter = r ? (e, t) => r(e, t) && i(tr(e)) : (e) => i(tr(e));
}, ir = At((e) => {
	let t = new er(e), n = e.file, r;
	try {
		r = f.openSync(n, "r");
		let i = f.fstatSync(r), a = e.maxReadSize || 16 * 1024 * 1024;
		if (i.size < a) {
			let e = Buffer.allocUnsafe(i.size), n = f.readSync(r, e, 0, i.size, 0);
			t.end(n === e.byteLength ? e : e.subarray(0, n));
		} else {
			let e = 0, n = Buffer.allocUnsafe(a);
			for (; e < i.size;) {
				let i = f.readSync(r, n, 0, a, e);
				if (i === 0) break;
				e += i, t.write(n.subarray(0, i));
			}
			t.end();
		}
	} finally {
		if (typeof r == "number") try {
			f.closeSync(r);
		} catch {}
	}
}, (e, t) => {
	let n = new er(e), r = e.maxReadSize || 16 * 1024 * 1024, i = e.file;
	return new Promise((e, t) => {
		n.on("error", t), n.on("end", e), f.stat(i, (e, a) => {
			if (e) t(e);
			else {
				let e = new vt(i, {
					readSize: r,
					size: a.size
				});
				e.on("error", t), e.pipe(n);
			}
		});
	});
}, (e) => new er(e), (e) => new er(e), (e, t) => {
	t?.length && rr(e, t), e.noResume || nr(e);
}), ar = (e, t, n) => (e &= 4095, n && (e = (e | 384) & -19), t && (e & 256 && (e |= 64), e & 32 && (e |= 8), e & 4 && (e |= 1)), e), { isAbsolute: or, parse: sr } = c, cr = (e) => {
	let t = "", n = sr(e);
	for (; or(e) || n.root;) {
		let r = e.charAt(0) === "/" && e.slice(0, 4) !== "//?/" ? "/" : n.root;
		e = e.slice(r.length), t += r, n = sr(e);
	}
	return [t, e];
}, lr = [
	"|",
	"<",
	">",
	"?",
	":"
], ur = lr.map((e) => String.fromCodePoint(61440 + Number(e.codePointAt(0)))), dr = new Map(lr.map((e, t) => [e, ur[t]])), fr = new Map(ur.map((e, t) => [e, lr[t]])), pr = (e) => lr.reduce((e, t) => e.split(t).join(dr.get(t)), e), mr = (e) => ur.reduce((e, t) => e.split(t).join(fr.get(t)), e), hr = (e, t) => t ? (e = L(e).replace(/^\.(\/|$)/, ""), tr(t) + "/" + e) : L(e), gr = 16 * 1024 * 1024, _r = Symbol("process"), vr = Symbol("file"), yr = Symbol("directory"), br = Symbol("symlink"), xr = Symbol("hardlink"), Sr = Symbol("header"), Cr = Symbol("read"), wr = Symbol("lstat"), Tr = Symbol("onlstat"), Er = Symbol("onread"), Dr = Symbol("onreadlink"), Or = Symbol("openfile"), kr = Symbol("onopenfile"), q = Symbol("close"), Ar = Symbol("mode"), jr = Symbol("awaitDrain"), Mr = Symbol("ondrain"), J = Symbol("prefix"), Nr = class extends Ze {
	path;
	portable;
	myuid = process.getuid && process.getuid() || 0;
	myuser = process.env.USER || "";
	maxReadSize;
	linkCache;
	statCache;
	preservePaths;
	cwd;
	strict;
	mtime;
	noPax;
	noMtime;
	prefix;
	fd;
	blockLen = 0;
	blockRemain = 0;
	buf;
	pos = 0;
	remain = 0;
	length = 0;
	offset = 0;
	win32;
	absolute;
	header;
	type;
	linkpath;
	stat;
	onWriteEntry;
	#e = !1;
	constructor(e, t = {}) {
		let n = kt(t);
		super(), this.path = L(e), this.portable = !!n.portable, this.maxReadSize = n.maxReadSize || gr, this.linkCache = n.linkCache || /* @__PURE__ */ new Map(), this.statCache = n.statCache || /* @__PURE__ */ new Map(), this.preservePaths = !!n.preservePaths, this.cwd = L(n.cwd || process.cwd()), this.strict = !!n.strict, this.noPax = !!n.noPax, this.noMtime = !!n.noMtime, this.mtime = n.mtime, this.prefix = n.prefix ? L(n.prefix) : void 0, this.onWriteEntry = n.onWriteEntry, typeof n.onwarn == "function" && this.on("warn", n.onwarn);
		let r = !1;
		if (!this.preservePaths) {
			let [e, t] = cr(this.path);
			e && typeof t == "string" && (this.path = t, r = e);
		}
		this.win32 = !!n.win32 || process.platform === "win32", this.win32 && (this.path = mr(this.path.replaceAll(/\\/g, "/")), e = e.replaceAll(/\\/g, "/")), this.absolute = L(n.absolute || oe.resolve(this.cwd, e)), this.path === "" && (this.path = "./"), r && this.warn("TAR_ENTRY_INFO", `stripping ${r} from absolute path`, {
			entry: this,
			path: r + this.path
		});
		let i = this.statCache.get(this.absolute);
		i ? this[Tr](i) : this[wr]();
	}
	warn(e, t, n = {}) {
		return Dn(this, e, t, n);
	}
	emit(e, ...t) {
		return e === "error" && (this.#e = !0), super.emit(e, ...t);
	}
	[wr]() {
		d.lstat(this.absolute, (e, t) => {
			if (e) return this.emit("error", e);
			this[Tr](t);
		});
	}
	[Tr](e) {
		this.statCache.set(this.absolute, e), this.stat = e, e.isFile() || (e.size = 0), this.type = Ir(e), this.emit("stat", e), this[_r]();
	}
	[_r]() {
		switch (this.type) {
			case "File": return this[vr]();
			case "Directory": return this[yr]();
			case "SymbolicLink": return this[br]();
			default: return this.end();
		}
	}
	[Ar](e) {
		return ar(e, this.type === "Directory", this.portable);
	}
	[J](e) {
		return hr(e, this.prefix);
	}
	[Sr]() {
		if (!this.stat) throw Error("cannot write header before stat");
		this.type === "Directory" && this.portable && (this.noMtime = !0), this.onWriteEntry?.(this), this.header = new cn({
			path: this[J](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[J](this.linkpath) : this.linkpath,
			mode: this[Ar](this.stat.mode),
			uid: this.portable ? void 0 : this.stat.uid,
			gid: this.portable ? void 0 : this.stat.gid,
			size: this.stat.size,
			mtime: this.noMtime ? void 0 : this.mtime || this.stat.mtime,
			type: this.type === "Unsupported" ? void 0 : this.type,
			uname: this.portable ? void 0 : this.stat.uid === this.myuid ? this.myuser : "",
			atime: this.portable ? void 0 : this.stat.atime,
			ctime: this.portable ? void 0 : this.stat.ctime
		}), this.header.encode() && !this.noPax && super.write(new Sn({
			atime: this.portable ? void 0 : this.header.atime,
			ctime: this.portable ? void 0 : this.header.ctime,
			gid: this.portable ? void 0 : this.header.gid,
			mtime: this.noMtime ? void 0 : this.mtime || this.header.mtime,
			path: this[J](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[J](this.linkpath) : this.linkpath,
			size: this.header.size,
			uid: this.portable ? void 0 : this.header.uid,
			uname: this.portable ? void 0 : this.header.uname,
			dev: this.portable ? void 0 : this.stat.dev,
			ino: this.portable ? void 0 : this.stat.ino,
			nlink: this.portable ? void 0 : this.stat.nlink
		}).encode());
		let e = this.header?.block;
		if (!e) throw Error("failed to encode header");
		super.write(e);
	}
	[yr]() {
		if (!this.stat) throw Error("cannot create directory entry without stat");
		this.path.slice(-1) !== "/" && (this.path += "/"), this.stat.size = 0, this[Sr](), this.end();
	}
	[br]() {
		d.readlink(this.absolute, (e, t) => {
			if (e) return this.emit("error", e);
			this[Dr](t);
		});
	}
	[Dr](e) {
		this.linkpath = L(e), this[Sr](), this.end();
	}
	[xr](e) {
		if (!this.stat) throw Error("cannot create link entry without stat");
		this.type = "Link", this.linkpath = L(oe.relative(this.cwd, e)), this.stat.size = 0, this[Sr](), this.end();
	}
	[vr]() {
		if (!this.stat) throw Error("cannot create file entry without stat");
		if (this.stat.nlink > 1) {
			let e = `${this.stat.dev}:${this.stat.ino}`, t = this.linkCache.get(e);
			if (t?.indexOf(this.cwd) === 0) return this[xr](t);
			this.linkCache.set(e, this.absolute);
		}
		if (this[Sr](), this.stat.size === 0) return this.end();
		this[Or]();
	}
	[Or]() {
		d.open(this.absolute, "r", (e, t) => {
			if (e) return this.emit("error", e);
			this[kr](t);
		});
	}
	[kr](e) {
		if (this.fd = e, this.#e) return this[q]();
		if (!this.stat) throw Error("should stat before calling onopenfile");
		this.blockLen = 512 * Math.ceil(this.stat.size / 512), this.blockRemain = this.blockLen;
		let t = Math.min(this.blockLen, this.maxReadSize);
		this.buf = Buffer.allocUnsafe(t), this.offset = 0, this.pos = 0, this.remain = this.stat.size, this.length = this.buf.length, this[Cr]();
	}
	[Cr]() {
		let { fd: e, buf: t, offset: n, length: r, pos: i } = this;
		if (e === void 0 || t === void 0) throw Error("cannot read file without first opening");
		d.read(e, t, n, r, i, (e, t) => {
			if (e) return this[q](() => this.emit("error", e));
			this[Er](t);
		});
	}
	[q](e = () => {}) {
		this.fd !== void 0 && d.close(this.fd, e);
	}
	[Er](e) {
		if (e <= 0 && this.remain > 0) {
			let e = Object.assign(/* @__PURE__ */ Error("encountered unexpected EOF"), {
				path: this.absolute,
				syscall: "read",
				code: "EOF"
			});
			return this[q](() => this.emit("error", e));
		}
		if (e > this.remain) {
			let e = Object.assign(/* @__PURE__ */ Error("did not encounter expected EOF"), {
				path: this.absolute,
				syscall: "read",
				code: "EOF"
			});
			return this[q](() => this.emit("error", e));
		}
		if (!this.buf) throw Error("should have created buffer prior to reading");
		if (e === this.remain) for (let t = e; t < this.length && e < this.blockRemain; t++) this.buf[t + this.offset] = 0, e++, this.remain++;
		let t = this.offset === 0 && e === this.buf.length ? this.buf : this.buf.subarray(this.offset, this.offset + e);
		this.write(t) ? this[Mr]() : this[jr](() => this[Mr]());
	}
	[jr](e) {
		this.once("drain", e);
	}
	write(e, t, n) {
		if (typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, typeof t == "string" ? t : "utf8")), this.blockRemain < e.length) {
			let e = Object.assign(/* @__PURE__ */ Error("writing more data than expected"), { path: this.absolute });
			return this.emit("error", e);
		}
		return this.remain -= e.length, this.blockRemain -= e.length, this.pos += e.length, this.offset += e.length, super.write(e, null, n);
	}
	[Mr]() {
		if (!this.remain) return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), this[q]((e) => e ? this.emit("error", e) : this.end());
		if (!this.buf) throw Error("buffer lost somehow in ONDRAIN");
		this.offset >= this.length && (this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length)), this.offset = 0), this.length = this.buf.length - this.offset, this[Cr]();
	}
}, Pr = class extends Nr {
	sync = !0;
	[wr]() {
		this[Tr](d.lstatSync(this.absolute));
	}
	[br]() {
		this[Dr](d.readlinkSync(this.absolute));
	}
	[Or]() {
		this[kr](d.openSync(this.absolute, "r"));
	}
	[Cr]() {
		let e = !0;
		try {
			let { fd: t, buf: n, offset: r, length: i, pos: a } = this;
			if (t === void 0 || n === void 0) throw Error("fd and buf must be set in READ method");
			let o = d.readSync(t, n, r, i, a);
			this[Er](o), e = !1;
		} finally {
			if (e) try {
				this[q](() => {});
			} catch {}
		}
	}
	[jr](e) {
		e();
	}
	[q](e = () => {}) {
		this.fd !== void 0 && d.closeSync(this.fd), e();
	}
}, Fr = class extends Ze {
	blockLen = 0;
	blockRemain = 0;
	buf = 0;
	pos = 0;
	remain = 0;
	length = 0;
	preservePaths;
	portable;
	strict;
	noPax;
	noMtime;
	readEntry;
	type;
	prefix;
	path;
	mode;
	uid;
	gid;
	uname;
	gname;
	header;
	mtime;
	atime;
	ctime;
	linkpath;
	size;
	onWriteEntry;
	warn(e, t, n = {}) {
		return Dn(this, e, t, n);
	}
	constructor(e, t = {}) {
		let n = kt(t);
		super(), this.preservePaths = !!n.preservePaths, this.portable = !!n.portable, this.strict = !!n.strict, this.noPax = !!n.noPax, this.noMtime = !!n.noMtime, this.onWriteEntry = n.onWriteEntry, this.readEntry = e;
		let { type: r } = e;
		if (r === "Unsupported") throw Error("writing entry that should be ignored");
		this.type = r, this.type === "Directory" && this.portable && (this.noMtime = !0), this.prefix = n.prefix, this.path = L(e.path), this.mode = e.mode === void 0 ? void 0 : this[Ar](e.mode), this.uid = this.portable ? void 0 : e.uid, this.gid = this.portable ? void 0 : e.gid, this.uname = this.portable ? void 0 : e.uname, this.gname = this.portable ? void 0 : e.gname, this.size = e.size, this.mtime = this.noMtime ? void 0 : n.mtime || e.mtime, this.atime = this.portable ? void 0 : e.atime, this.ctime = this.portable ? void 0 : e.ctime, this.linkpath = e.linkpath === void 0 ? void 0 : L(e.linkpath), typeof n.onwarn == "function" && this.on("warn", n.onwarn);
		let i = !1;
		if (!this.preservePaths) {
			let [e, t] = cr(this.path);
			e && typeof t == "string" && (this.path = t, i = e);
		}
		this.remain = e.size, this.blockRemain = e.startBlockSize, this.onWriteEntry?.(this), this.header = new cn({
			path: this[J](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[J](this.linkpath) : this.linkpath,
			mode: this.mode,
			uid: this.portable ? void 0 : this.uid,
			gid: this.portable ? void 0 : this.gid,
			size: this.size,
			mtime: this.noMtime ? void 0 : this.mtime,
			type: this.type,
			uname: this.portable ? void 0 : this.uname,
			atime: this.portable ? void 0 : this.atime,
			ctime: this.portable ? void 0 : this.ctime
		}), i && this.warn("TAR_ENTRY_INFO", `stripping ${i} from absolute path`, {
			entry: this,
			path: i + this.path
		}), this.header.encode() && !this.noPax && super.write(new Sn({
			atime: this.portable ? void 0 : this.atime,
			ctime: this.portable ? void 0 : this.ctime,
			gid: this.portable ? void 0 : this.gid,
			mtime: this.noMtime ? void 0 : this.mtime,
			path: this[J](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[J](this.linkpath) : this.linkpath,
			size: this.size,
			uid: this.portable ? void 0 : this.uid,
			uname: this.portable ? void 0 : this.uname,
			dev: this.portable ? void 0 : this.readEntry.dev,
			ino: this.portable ? void 0 : this.readEntry.ino,
			nlink: this.portable ? void 0 : this.readEntry.nlink
		}).encode());
		let a = this.header?.block;
		if (!a) throw Error("failed to encode header");
		super.write(a), e.pipe(this);
	}
	[J](e) {
		return hr(e, this.prefix);
	}
	[Ar](e) {
		return ar(e, this.type === "Directory", this.portable);
	}
	write(e, t, n) {
		typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, typeof t == "string" ? t : "utf8"));
		let r = e.length;
		if (r > this.blockRemain) throw Error("writing more to entry than is appropriate");
		return this.blockRemain -= r, super.write(e, n);
	}
	end(e, t, n) {
		return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), typeof e == "function" && (n = e, t = void 0, e = void 0), typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, t ?? "utf8")), n && this.once("finish", n), e ? super.end(e, n) : super.end(n), this;
	}
}, Ir = (e) => e.isFile() ? "File" : e.isDirectory() ? "Directory" : e.isSymbolicLink() ? "SymbolicLink" : "Unsupported", Lr = class e {
	tail;
	head;
	length = 0;
	static create(t = []) {
		return new e(t);
	}
	constructor(e = []) {
		for (let t of e) this.push(t);
	}
	*[Symbol.iterator]() {
		for (let e = this.head; e; e = e.next) yield e.value;
	}
	removeNode(e) {
		if (e.list !== this) throw Error("removing node which does not belong to this list");
		let t = e.next, n = e.prev;
		return t && (t.prev = n), n && (n.next = t), e === this.head && (this.head = t), e === this.tail && (this.tail = n), this.length--, e.next = void 0, e.prev = void 0, e.list = void 0, t;
	}
	unshiftNode(e) {
		if (e === this.head) return;
		e.list && e.list.removeNode(e);
		let t = this.head;
		e.list = this, e.next = t, t && (t.prev = e), this.head = e, this.tail ||= e, this.length++;
	}
	pushNode(e) {
		if (e === this.tail) return;
		e.list && e.list.removeNode(e);
		let t = this.tail;
		e.list = this, e.prev = t, t && (t.next = e), this.tail = e, this.head ||= e, this.length++;
	}
	push(...e) {
		for (let t = 0, n = e.length; t < n; t++) zr(this, e[t]);
		return this.length;
	}
	unshift(...e) {
		for (var t = 0, n = e.length; t < n; t++) Br(this, e[t]);
		return this.length;
	}
	pop() {
		if (!this.tail) return;
		let e = this.tail.value, t = this.tail;
		return this.tail = this.tail.prev, this.tail ? this.tail.next = void 0 : this.head = void 0, t.list = void 0, this.length--, e;
	}
	shift() {
		if (!this.head) return;
		let e = this.head.value, t = this.head;
		return this.head = this.head.next, this.head ? this.head.prev = void 0 : this.tail = void 0, t.list = void 0, this.length--, e;
	}
	forEach(e, t) {
		t ||= this;
		for (let n = this.head, r = 0; n; r++) e.call(t, n.value, r, this), n = n.next;
	}
	forEachReverse(e, t) {
		t ||= this;
		for (let n = this.tail, r = this.length - 1; n; r--) e.call(t, n.value, r, this), n = n.prev;
	}
	get(e) {
		let t = 0, n = this.head;
		for (; n && t < e; t++) n = n.next;
		if (t === e && n) return n.value;
	}
	getReverse(e) {
		let t = 0, n = this.tail;
		for (; n && t < e; t++) n = n.prev;
		if (t === e && n) return n.value;
	}
	map(t, n) {
		n ||= this;
		let r = new e();
		for (let e = this.head; e;) r.push(t.call(n, e.value, this)), e = e.next;
		return r;
	}
	mapReverse(t, n) {
		n ||= this;
		var r = new e();
		for (let e = this.tail; e;) r.push(t.call(n, e.value, this)), e = e.prev;
		return r;
	}
	reduce(e, t) {
		let n, r = this.head;
		if (arguments.length > 1) n = t;
		else if (this.head) r = this.head.next, n = this.head.value;
		else throw TypeError("Reduce of empty list with no initial value");
		for (var i = 0; r; i++) n = e(n, r.value, i), r = r.next;
		return n;
	}
	reduceReverse(e, t) {
		let n, r = this.tail;
		if (arguments.length > 1) n = t;
		else if (this.tail) r = this.tail.prev, n = this.tail.value;
		else throw TypeError("Reduce of empty list with no initial value");
		for (let t = this.length - 1; r; t--) n = e(n, r.value, t), r = r.prev;
		return n;
	}
	toArray() {
		let e = Array(this.length);
		for (let t = 0, n = this.head; n; t++) e[t] = n.value, n = n.next;
		return e;
	}
	toArrayReverse() {
		let e = Array(this.length);
		for (let t = 0, n = this.tail; n; t++) e[t] = n.value, n = n.prev;
		return e;
	}
	slice(t = 0, n = this.length) {
		n < 0 && (n += this.length), t < 0 && (t += this.length);
		let r = new e();
		if (n < t || n < 0) return r;
		t < 0 && (t = 0), n > this.length && (n = this.length);
		let i = this.head, a = 0;
		for (a = 0; i && a < t; a++) i = i.next;
		for (; i && a < n; a++, i = i.next) r.push(i.value);
		return r;
	}
	sliceReverse(t = 0, n = this.length) {
		n < 0 && (n += this.length), t < 0 && (t += this.length);
		let r = new e();
		if (n < t || n < 0) return r;
		t < 0 && (t = 0), n > this.length && (n = this.length);
		let i = this.length, a = this.tail;
		for (; a && i > n; i--) a = a.prev;
		for (; a && i > t; i--, a = a.prev) r.push(a.value);
		return r;
	}
	splice(e, t = 0, ...n) {
		e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
		let r = this.head;
		for (let t = 0; r && t < e; t++) r = r.next;
		let i = [];
		for (let e = 0; r && e < t; e++) i.push(r.value), r = this.removeNode(r);
		r ? r !== this.tail && (r = r.prev) : r = this.tail;
		for (let e of n) r = Rr(this, r, e);
		return i;
	}
	reverse() {
		let e = this.head, t = this.tail;
		for (let t = e; t; t = t.prev) {
			let e = t.prev;
			t.prev = t.next, t.next = e;
		}
		return this.head = t, this.tail = e, this;
	}
};
function Rr(e, t, n) {
	let r = new Vr(n, t, t ? t.next : e.head, e);
	return r.next === void 0 && (e.tail = r), r.prev === void 0 && (e.head = r), e.length++, r;
}
function zr(e, t) {
	e.tail = new Vr(t, e.tail, void 0, e), e.head ||= e.tail, e.length++;
}
function Br(e, t) {
	e.head = new Vr(t, void 0, e.head, e), e.tail ||= e.head, e.length++;
}
var Vr = class {
	list;
	next;
	prev;
	value;
	constructor(e, t, n, r) {
		this.list = r, this.value = e, t ? (t.next = this, this.prev = t) : this.prev = void 0, n ? (n.prev = this, this.next = n) : this.next = void 0;
	}
}, Hr = class {
	path;
	absolute;
	entry;
	stat;
	readdir;
	pending = !1;
	pendingLink = !1;
	ignore = !1;
	piped = !1;
	constructor(e, t) {
		this.path = e || "./", this.absolute = t;
	}
}, Ur = Buffer.alloc(1024), Wr = Symbol("onStat"), Gr = Symbol("ended"), Y = Symbol("queue"), Kr = Symbol("queue"), qr = Symbol("current"), Jr = Symbol("process"), Yr = Symbol("processing"), Xr = Symbol("processJob"), X = Symbol("jobs"), Zr = Symbol("jobDone"), Qr = Symbol("addFSEntry"), $r = Symbol("addTarEntry"), ei = Symbol("stat"), ti = Symbol("readdir"), ni = Symbol("onreaddir"), ri = Symbol("pipe"), ii = Symbol("entry"), ai = Symbol("entryOpt"), oi = Symbol("writeEntryClass"), si = Symbol("write"), ci = Symbol("ondrain"), li = class extends Ze {
	sync = !1;
	opt;
	cwd;
	maxReadSize;
	preservePaths;
	strict;
	noPax;
	prefix;
	linkCache;
	statCache;
	file;
	portable;
	zip;
	readdirCache;
	noDirRecurse;
	follow;
	noMtime;
	mtime;
	filter;
	jobs;
	[oi];
	onWriteEntry;
	[Y];
	[Kr] = /* @__PURE__ */ new Map();
	[X] = 0;
	[Yr] = !1;
	[Gr] = !1;
	constructor(e = {}) {
		if (super(), this.opt = e, this.file = e.file || "", this.cwd = e.cwd || process.cwd(), this.maxReadSize = e.maxReadSize, this.preservePaths = !!e.preservePaths, this.strict = !!e.strict, this.noPax = !!e.noPax, this.prefix = L(e.prefix || ""), this.linkCache = e.linkCache || /* @__PURE__ */ new Map(), this.statCache = e.statCache || /* @__PURE__ */ new Map(), this.readdirCache = e.readdirCache || /* @__PURE__ */ new Map(), this.onWriteEntry = e.onWriteEntry, this[oi] = Nr, typeof e.onwarn == "function" && this.on("warn", e.onwarn), this.portable = !!e.portable, e.gzip || e.brotli || e.zstd) {
			if (+!!e.gzip + +!!e.brotli + +!!e.zstd > 1) throw TypeError("gzip, brotli, zstd are mutually exclusive");
			if (e.gzip && (typeof e.gzip != "object" && (e.gzip = {}), this.portable && (e.gzip.portable = !0), this.zip = new Vt(e.gzip)), e.brotli && (typeof e.brotli != "object" && (e.brotli = {}), this.zip = new Wt(e.brotli)), e.zstd && (typeof e.zstd != "object" && (e.zstd = {}), this.zip = new qt(e.zstd)), !this.zip) throw Error("impossible");
			let t = this.zip;
			t.on("data", (e) => super.write(e)), t.on("end", () => super.end()), t.on("drain", () => this[ci]()), this.on("resume", () => t.resume());
		} else this.on("drain", this[ci]);
		this.noDirRecurse = !!e.noDirRecurse, this.follow = !!e.follow, this.noMtime = !!e.noMtime, e.mtime && (this.mtime = e.mtime), this.filter = typeof e.filter == "function" ? e.filter : () => !0, this[Y] = new Lr(), this[X] = 0, this.jobs = Number(e.jobs) || 4, this[Yr] = !1, this[Gr] = !1;
	}
	[si](e) {
		return super.write(e);
	}
	add(e) {
		return this.write(e), this;
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, e = void 0), typeof t == "function" && (n = t, t = void 0), e && this.add(e), this[Gr] = !0, this[Jr](), n && n(), this;
	}
	write(e) {
		if (this[Gr]) throw Error("write after end");
		return e instanceof En ? this[$r](e) : this[Qr](e), this.flowing;
	}
	[$r](e) {
		let t = L(oe.resolve(this.cwd, e.path));
		if (!this.filter(e.path, e)) e.resume();
		else {
			let n = new Hr(e.path, t);
			n.entry = new Fr(e, this[ai](n)), n.entry.on("end", () => this[Zr](n)), this[X] += 1, this[Y].push(n);
		}
		this[Jr]();
	}
	[Qr](e) {
		let t = L(oe.resolve(this.cwd, e));
		this[Y].push(new Hr(e, t)), this[Jr]();
	}
	[ei](e) {
		e.pending = !0, this[X] += 1, d[this.follow ? "stat" : "lstat"](e.absolute, (t, n) => {
			e.pending = !1, --this[X], t ? this.emit("error", t) : this[Wr](e, n);
		});
	}
	[Wr](e, t) {
		if (this.statCache.set(e.absolute, t), e.stat = t, !this.filter(e.path, t)) e.ignore = !0;
		else if (t.isFile() && t.nlink > 1 && !this.linkCache.get(`${t.dev}:${t.ino}`) && !this.sync) if (e === this[qr]) this[Xr](e);
		else {
			let n = `${t.dev}:${t.ino}`, r = this[Kr].get(n);
			r ? r.push(e) : this[Kr].set(n, [e]), e.pendingLink = !0, e.pending = !0;
		}
		this[Jr]();
	}
	[ti](e) {
		e.pending = !0, this[X] += 1, d.readdir(e.absolute, (t, n) => {
			if (e.pending = !1, --this[X], t) return this.emit("error", t);
			this[ni](e, n);
		});
	}
	[ni](e, t) {
		this.readdirCache.set(e.absolute, t), e.readdir = t, this[Jr]();
	}
	[Jr]() {
		if (!this[Yr]) {
			this[Yr] = !0;
			for (let e = this[Y].head; e && this[X] < this.jobs; e = e.next) if (this[Xr](e.value), e.value.ignore) {
				let t = e.next;
				this[Y].removeNode(e), e.next = t;
			}
			this[Yr] = !1, this[Gr] && this[Y].length === 0 && this[X] === 0 && (this.zip ? this.zip.end(Ur) : (super.write(Ur), super.end()));
		}
	}
	get [qr]() {
		return this[Y] && this[Y].head && this[Y].head.value;
	}
	[Zr](e) {
		this[Y].shift(), --this[X];
		let { stat: t } = e;
		if (t && t.isFile() && t.nlink > 1) {
			let e = `${t.dev}:${t.ino}`, n = this[Kr].get(e);
			if (n) {
				this[Kr].delete(e);
				for (let e of n) e.pending = !1, this[Xr](e);
			}
		}
		this[Jr]();
	}
	[Xr](e) {
		if (e.pending && e.pendingLink && e === this[qr] && (e.pending = !1, e.pendingLink = !1), !e.pending) {
			if (e.entry) {
				e === this[qr] && !e.piped && this[ri](e);
				return;
			}
			if (!e.stat) {
				let t = this.statCache.get(e.absolute);
				t ? this[Wr](e, t) : this[ei](e);
			}
			if (e.stat && !e.ignore) {
				if (!this.noDirRecurse && e.stat.isDirectory() && !e.readdir) {
					let t = this.readdirCache.get(e.absolute);
					if (t ? this[ni](e, t) : this[ti](e), !e.readdir) return;
				}
				if (e.entry = this[ii](e), !e.entry) {
					e.ignore = !0;
					return;
				}
				e === this[qr] && !e.piped && this[ri](e);
			}
		}
	}
	[ai](e) {
		return {
			onwarn: (e, t, n) => this.warn(e, t, n),
			noPax: this.noPax,
			cwd: this.cwd,
			absolute: e.absolute,
			preservePaths: this.preservePaths,
			maxReadSize: this.maxReadSize,
			strict: this.strict,
			portable: this.portable,
			linkCache: this.linkCache,
			statCache: this.statCache,
			noMtime: this.noMtime,
			mtime: this.mtime,
			prefix: this.prefix,
			onWriteEntry: this.onWriteEntry
		};
	}
	[ii](e) {
		this[X] += 1;
		try {
			return new this[oi](e.path, this[ai](e)).on("end", () => this[Zr](e)).on("error", (e) => this.emit("error", e));
		} catch (e) {
			this.emit("error", e);
		}
	}
	[ci]() {
		this[qr] && this[qr].entry && this[qr].entry.resume();
	}
	[ri](e) {
		e.piped = !0, e.readdir && e.readdir.forEach((t) => {
			let n = e.path, r = n === "./" ? "" : n.replace(/\/*$/, "/");
			this[Qr](r + t);
		});
		let t = e.entry, n = this.zip;
		if (!t) throw Error("cannot pipe without source");
		n ? t.on("data", (e) => {
			n.write(e) || t.pause();
		}) : t.on("data", (e) => {
			super.write(e) || t.pause();
		});
	}
	pause() {
		return this.zip && this.zip.pause(), super.pause();
	}
	warn(e, t, n = {}) {
		Dn(this, e, t, n);
	}
}, ui = class extends li {
	sync = !0;
	constructor(e) {
		super(e), this[oi] = Pr;
	}
	pause() {}
	resume() {}
	[ei](e) {
		let t = this.follow ? "statSync" : "lstatSync";
		this[Wr](e, d[t](e.absolute));
	}
	[ti](e) {
		this[ni](e, d.readdirSync(e.absolute));
	}
	[ri](e) {
		let t = e.entry, n = this.zip;
		if (e.readdir && e.readdir.forEach((t) => {
			let n = e.path, r = n === "./" ? "" : n.replace(/\/*$/, "/");
			this[Qr](r + t);
		}), !t) throw Error("Cannot pipe without source");
		n ? t.on("data", (e) => {
			n.write(e);
		}) : t.on("data", (e) => {
			super[si](e);
		});
	}
}, di = (e, t) => {
	let n = new ui(e), r = new xt(e.file, { mode: e.mode || 438 });
	n.pipe(r), pi(n, t);
}, fi = (e, t) => {
	let n = new li(e), r = new bt(e.file, { mode: e.mode || 438 });
	n.pipe(r);
	let i = new Promise((e, t) => {
		r.on("error", t), r.on("close", e), n.on("error", t);
	});
	return mi(n, t).catch((e) => n.emit("error", e)), i;
}, pi = (e, t) => {
	t.forEach((t) => {
		t.charAt(0) === "@" ? ir({
			file: i.resolve(e.cwd, t.slice(1)),
			sync: !0,
			noResume: !0,
			onReadEntry: (t) => e.add(t)
		}) : e.add(t);
	}), e.end();
}, mi = async (e, t) => {
	for (let n of t) n.charAt(0) === "@" ? await ir({
		file: i.resolve(String(e.cwd), n.slice(1)),
		noResume: !0,
		onReadEntry: (t) => {
			e.add(t);
		}
	}) : e.add(n);
	e.end();
};
At(di, fi, (e, t) => {
	let n = new ui(e);
	return pi(n, t), n;
}, (e, t) => {
	let n = new li(e);
	return mi(n, t).catch((e) => n.emit("error", e)), n;
}, (e, t) => {
	if (!t?.length) throw TypeError("no paths specified to add to archive");
});
var hi = (process.env.__FAKE_PLATFORM__ || process.platform) === "win32", { O_CREAT: gi, O_NOFOLLOW: _i, O_TRUNC: vi, O_WRONLY: yi } = d.constants, bi = Number(process.env.__FAKE_FS_O_FILENAME__) || d.constants.UV_FS_O_FILEMAP || 0, xi = hi && !!bi, Si = 512 * 1024, Ci = bi | vi | gi | yi, wi = !hi && typeof _i == "number" ? _i | vi | gi | yi : null, Ti = wi === null ? xi ? (e) => e < Si ? Ci : "w" : () => "w" : () => wi, Ei = (e, t, n) => {
	try {
		return f.lchownSync(e, t, n);
	} catch (e) {
		if (e?.code !== "ENOENT") throw e;
	}
}, Di = (e, t, n, r) => {
	f.lchown(e, t, n, (e) => {
		r(e && e?.code !== "ENOENT" ? e : null);
	});
}, Oi = (e, t, n, r, a) => {
	t.isDirectory() ? ki(i.resolve(e, t.name), n, r, (o) => {
		if (o) return a(o);
		Di(i.resolve(e, t.name), n, r, a);
	}) : Di(i.resolve(e, t.name), n, r, a);
}, ki = (e, t, n, r) => {
	f.readdir(e, { withFileTypes: !0 }, (i, a) => {
		if (i) {
			if (i.code === "ENOENT") return r();
			if (i.code !== "ENOTDIR" && i.code !== "ENOTSUP") return r(i);
		}
		if (i || !a.length) return Di(e, t, n, r);
		let o = a.length, s = null, c = (i) => {
			if (!s) {
				if (i) return r(s = i);
				if (--o === 0) return Di(e, t, n, r);
			}
		};
		for (let r of a) Oi(e, r, t, n, c);
	});
}, Ai = (e, t, n, r) => {
	t.isDirectory() && ji(i.resolve(e, t.name), n, r), Ei(i.resolve(e, t.name), n, r);
}, ji = (e, t, n) => {
	let r;
	try {
		r = f.readdirSync(e, { withFileTypes: !0 });
	} catch (r) {
		let i = r;
		if (i?.code === "ENOENT") return;
		if (i?.code === "ENOTDIR" || i?.code === "ENOTSUP") return Ei(e, t, n);
		throw i;
	}
	for (let i of r) Ai(e, i, t, n);
	return Ei(e, t, n);
}, Mi = class extends Error {
	path;
	code;
	syscall = "chdir";
	constructor(e, t) {
		super(`${t}: Cannot cd into '${e}'`), this.path = e, this.code = t;
	}
	get name() {
		return "CwdError";
	}
}, Ni = class extends Error {
	path;
	symlink;
	syscall = "symlink";
	code = "TAR_SYMLINK_ERROR";
	constructor(e, t) {
		super("TAR_SYMLINK_ERROR: Cannot extract through symbolic link"), this.symlink = e, this.path = t;
	}
	get name() {
		return "SymlinkError";
	}
}, Pi = (e, t) => {
	f.stat(e, (n, r) => {
		(n || !r.isDirectory()) && (n = new Mi(e, n?.code || "ENOTDIR")), t(n);
	});
}, Fi = (e, t, n) => {
	e = L(e);
	let r = t.umask ?? 18, a = t.mode | 448, o = (a & r) !== 0, s = t.uid, c = t.gid, ee = typeof s == "number" && typeof c == "number" && (s !== t.processUid || c !== t.processGid), te = t.preserve, ne = t.unlink, u = L(t.cwd), d = (t, r) => {
		t ? n(t) : r && ee ? ki(r, s, c, (e) => d(e)) : o ? f.chmod(e, a, n) : n();
	};
	if (e === u) return Pi(e, d);
	if (te) return l.mkdir(e, {
		mode: a,
		recursive: !0
	}).then((e) => d(null, e ?? void 0), d);
	Ii(u, L(i.relative(u, e)).split("/"), a, ne, u, void 0, d);
}, Ii = (e, t, n, r, a, o, s) => {
	if (t.length === 0) return s(null, o);
	let c = t.shift(), l = L(i.resolve(e + "/" + c));
	f.mkdir(l, n, Li(l, t, n, r, a, o, s));
}, Li = (e, t, n, r, i, a, o) => (s) => {
	s ? f.lstat(e, (c, l) => {
		if (c) c.path = c.path && L(c.path), o(c);
		else if (l.isDirectory()) Ii(e, t, n, r, i, a, o);
		else if (r) f.unlink(e, (s) => {
			if (s) return o(s);
			f.mkdir(e, n, Li(e, t, n, r, i, a, o));
		});
		else {
			if (l.isSymbolicLink()) return o(new Ni(e, e + "/" + t.join("/")));
			o(s);
		}
	}) : (a ||= e, Ii(e, t, n, r, i, a, o));
}, Ri = (e) => {
	let t = !1, n;
	try {
		t = f.statSync(e).isDirectory();
	} catch (e) {
		n = e?.code;
	} finally {
		if (!t) throw new Mi(e, n ?? "ENOTDIR");
	}
}, zi = (e, t) => {
	e = L(e);
	let n = t.umask ?? 18, r = t.mode | 448, a = (r & n) !== 0, o = t.uid, s = t.gid, c = typeof o == "number" && typeof s == "number" && (o !== t.processUid || s !== t.processGid), l = t.preserve, ee = t.unlink, te = L(t.cwd), ne = (t) => {
		t && c && ji(t, o, s), a && f.chmodSync(e, r);
	};
	if (e === te) return Ri(te), ne();
	if (l) return ne(f.mkdirSync(e, {
		mode: r,
		recursive: !0
	}) ?? void 0);
	let u = L(i.relative(te, e)).split("/"), d;
	for (let e = u.shift(), t = te; e && (t += "/" + e); e = u.shift()) {
		t = L(i.resolve(t));
		try {
			f.mkdirSync(t, r), d ||= t;
		} catch {
			let e = f.lstatSync(t);
			if (e.isDirectory()) continue;
			if (ee) {
				f.unlinkSync(t), f.mkdirSync(t, r), d ||= t;
				continue;
			} else if (e.isSymbolicLink()) return new Ni(t, t + "/" + u.join("/"));
		}
	}
	return ne(d);
}, Bi = Object.create(null), Vi = 1e4, Hi = /* @__PURE__ */ new Set(), Ui = (e) => {
	Hi.has(e) ? Hi.delete(e) : Bi[e] = e.normalize("NFD").toLocaleLowerCase("en").toLocaleUpperCase("en"), Hi.add(e);
	let t = Bi[e], n = Hi.size - Vi;
	if (n > Vi / 10) {
		for (let e of Hi) if (Hi.delete(e), delete Bi[e], --n <= 0) break;
	}
	return t;
}, Wi = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32", Gi = (e) => e.split("/").slice(0, -1).reduce((e, t) => {
	let n = e.at(-1);
	return n !== void 0 && (t = o(n, t)), e.push(t || "/"), e;
}, []), Ki = class {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Set();
	reserve(e, t) {
		e = Wi ? ["win32 parallelization disabled"] : e.map((e) => tr(o(Ui(e))));
		let n = new Set(e.map((e) => Gi(e)).reduce((e, t) => e.concat(t)));
		this.#t.set(t, {
			dirs: n,
			paths: e
		});
		for (let n of e) {
			let e = this.#e.get(n);
			e ? e.push(t) : this.#e.set(n, [t]);
		}
		for (let e of n) {
			let n = this.#e.get(e);
			if (!n) this.#e.set(e, [new Set([t])]);
			else {
				let e = n.at(-1);
				e instanceof Set ? e.add(t) : n.push(new Set([t]));
			}
		}
		return this.#i(t);
	}
	#r(e) {
		let t = this.#t.get(e);
		if (!t) throw Error("function does not have any path reservations");
		return {
			paths: t.paths.map((e) => this.#e.get(e)),
			dirs: [...t.dirs].map((e) => this.#e.get(e))
		};
	}
	check(e) {
		let { paths: t, dirs: n } = this.#r(e);
		return t.every((t) => t && t[0] === e) && n.every((t) => t && t[0] instanceof Set && t[0].has(e));
	}
	#i(e) {
		return this.#n.has(e) || !this.check(e) ? !1 : (this.#n.add(e), e(() => this.#a(e)), !0);
	}
	#a(e) {
		if (!this.#n.has(e)) return !1;
		let t = this.#t.get(e);
		if (!t) throw Error("invalid reservation");
		let { paths: n, dirs: r } = t, i = /* @__PURE__ */ new Set();
		for (let t of n) {
			let n = this.#e.get(t);
			if (!n || n?.[0] !== e) continue;
			let r = n[1];
			if (!r) {
				this.#e.delete(t);
				continue;
			}
			if (n.shift(), typeof r == "function") i.add(r);
			else for (let e of r) i.add(e);
		}
		for (let t of r) {
			let n = this.#e.get(t), r = n?.[0];
			if (!(!n || !(r instanceof Set))) if (r.size === 1 && n.length === 1) {
				this.#e.delete(t);
				continue;
			} else if (r.size === 1) {
				n.shift();
				let e = n[0];
				typeof e == "function" && i.add(e);
			} else r.delete(e);
		}
		return this.#n.delete(e), i.forEach((e) => this.#i(e)), !0;
	}
}, qi = () => process.umask(), Ji = Symbol("onEntry"), Yi = Symbol("checkFs"), Xi = Symbol("checkFs2"), Zi = Symbol("isReusable"), Z = Symbol("makeFs"), Qi = Symbol("file"), $i = Symbol("directory"), ea = Symbol("link"), ta = Symbol("symlink"), na = Symbol("hardlink"), ra = Symbol("ensureNoSymlink"), ia = Symbol("unsupported"), aa = Symbol("checkPath"), oa = Symbol("stripAbsolutePath"), Q = Symbol("mkdir"), $ = Symbol("onError"), sa = Symbol("pending"), ca = Symbol("pend"), la = Symbol("unpend"), ua = Symbol("ended"), da = Symbol("maybeClose"), fa = Symbol("skip"), pa = Symbol("doChown"), ma = Symbol("uid"), ha = Symbol("gid"), ga = Symbol("checkedCwd"), _a = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32", va = 1024, ya = (e, t) => {
	if (!_a) return f.unlink(e, t);
	let n = e + ".DELETE." + me(16).toString("hex");
	f.rename(e, n, (e) => {
		if (e) return t(e);
		f.unlink(n, t);
	});
}, ba = (e) => {
	if (!_a) return f.unlinkSync(e);
	let t = e + ".DELETE." + me(16).toString("hex");
	f.renameSync(e, t), f.unlinkSync(t);
}, xa = (e, t, n) => e !== void 0 && e === e >>> 0 ? e : t !== void 0 && t === t >>> 0 ? t : n, Sa = class extends er {
	[ua] = !1;
	[ga] = !1;
	[sa] = 0;
	reservations = new Ki();
	transform;
	writable = !0;
	readable = !1;
	uid;
	gid;
	setOwner;
	preserveOwner;
	processGid;
	processUid;
	maxDepth;
	forceChown;
	win32;
	newer;
	keep;
	noMtime;
	preservePaths;
	unlink;
	cwd;
	strip;
	processUmask;
	umask;
	dmode;
	fmode;
	chmod;
	constructor(e = {}) {
		if (e.ondone = () => {
			this[ua] = !0, this[da]();
		}, super(e), this.transform = e.transform, this.chmod = !!e.chmod, typeof e.uid == "number" || typeof e.gid == "number") {
			if (typeof e.uid != "number" || typeof e.gid != "number") throw TypeError("cannot set owner without number uid and gid");
			if (e.preserveOwner) throw TypeError("cannot preserve owner in archive and also set owner explicitly");
			this.uid = e.uid, this.gid = e.gid, this.setOwner = !0;
		} else this.uid = void 0, this.gid = void 0, this.setOwner = !1;
		this.preserveOwner = e.preserveOwner === void 0 && typeof e.uid != "number" ? !!(process.getuid && process.getuid() === 0) : !!e.preserveOwner, this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ? process.getuid() : void 0, this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ? process.getgid() : void 0, this.maxDepth = typeof e.maxDepth == "number" ? e.maxDepth : va, this.forceChown = e.forceChown === !0, this.win32 = !!e.win32 || _a, this.newer = !!e.newer, this.keep = !!e.keep, this.noMtime = !!e.noMtime, this.preservePaths = !!e.preservePaths, this.unlink = !!e.unlink, this.cwd = L(i.resolve(e.cwd || process.cwd())), this.strip = Number(e.strip) || 0, this.processUmask = this.chmod ? typeof e.processUmask == "number" ? e.processUmask : qi() : 0, this.umask = typeof e.umask == "number" ? e.umask : this.processUmask, this.dmode = e.dmode || 511 & ~this.umask, this.fmode = e.fmode || 438 & ~this.umask, this.on("entry", (e) => this[Ji](e));
	}
	warn(e, t, n = {}) {
		return (e === "TAR_BAD_ARCHIVE" || e === "TAR_ABORT") && (n.recoverable = !1), super.warn(e, t, n);
	}
	[da]() {
		this[ua] && this[sa] === 0 && (this.emit("prefinish"), this.emit("finish"), this.emit("end"));
	}
	[oa](e, t) {
		let n = e[t], { type: r } = e;
		if (!n || this.preservePaths) return !0;
		let [a, o] = cr(n), s = o.replaceAll(/\\/g, "/").split("/");
		if (s.includes("..") || _a && /^[a-z]:\.\.$/i.test(s[0] ?? "")) {
			if (t === "path" || r === "Link") return this.warn("TAR_ENTRY_ERROR", `${t} contains '..'`, {
				entry: e,
				[t]: n
			}), !1;
			let a = i.posix.dirname(e.path), o = i.posix.normalize(i.posix.join(a, s.join("/")));
			if (o.startsWith("../") || o === "..") return this.warn("TAR_ENTRY_ERROR", `${t} escapes extraction directory`, {
				entry: e,
				[t]: n
			}), !1;
		}
		return a && (e[t] = String(o), this.warn("TAR_ENTRY_INFO", `stripping ${a} from absolute ${t}`, {
			entry: e,
			[t]: n
		})), !0;
	}
	[aa](e) {
		let t = L(e.path), n = t.split("/");
		if (this.strip) {
			if (n.length < this.strip) return !1;
			if (e.type === "Link") {
				let t = L(String(e.linkpath)).split("/");
				if (t.length >= this.strip) e.linkpath = t.slice(this.strip).join("/");
				else return !1;
			}
			n.splice(0, this.strip), e.path = n.join("/");
		}
		if (isFinite(this.maxDepth) && n.length > this.maxDepth) return this.warn("TAR_ENTRY_ERROR", "path excessively deep", {
			entry: e,
			path: t,
			depth: n.length,
			maxDepth: this.maxDepth
		}), !1;
		if (!this[oa](e, "path") || !this[oa](e, "linkpath")) return !1;
		if (e.absolute = i.isAbsolute(e.path) ? L(i.resolve(e.path)) : L(i.resolve(this.cwd, e.path)), !this.preservePaths && typeof e.absolute == "string" && e.absolute.indexOf(this.cwd + "/") !== 0 && e.absolute !== this.cwd) return this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
			entry: e,
			path: L(e.path),
			resolvedPath: e.absolute,
			cwd: this.cwd
		}), !1;
		if (e.absolute === this.cwd && e.type !== "Directory" && e.type !== "GNUDumpDir") return !1;
		if (this.win32) {
			let { root: t } = i.win32.parse(String(e.absolute));
			e.absolute = t + pr(String(e.absolute).slice(t.length));
			let { root: n } = i.win32.parse(e.path);
			e.path = n + pr(e.path.slice(n.length));
		}
		return !0;
	}
	[Ji](e) {
		if (!this[aa](e)) return e.resume();
		switch (pe.equal(typeof e.absolute, "string"), e.type) {
			case "Directory":
			case "GNUDumpDir": e.mode && (e.mode |= 448);
			case "File":
			case "OldFile":
			case "ContiguousFile":
			case "Link":
			case "SymbolicLink": return this[Yi](e);
			default: return this[ia](e);
		}
	}
	[$](e, t) {
		e.name === "CwdError" ? this.emit("error", e) : (this.warn("TAR_ENTRY_ERROR", e, { entry: t }), this[la](), t.resume());
	}
	[Q](e, t, n) {
		Fi(L(e), {
			uid: this.uid,
			gid: this.gid,
			processUid: this.processUid,
			processGid: this.processGid,
			umask: this.processUmask,
			preserve: this.preservePaths,
			unlink: this.unlink,
			cwd: this.cwd,
			mode: t
		}, n);
	}
	[pa](e) {
		return this.forceChown || this.preserveOwner && (typeof e.uid == "number" && e.uid !== this.processUid || typeof e.gid == "number" && e.gid !== this.processGid) || typeof this.uid == "number" && this.uid !== this.processUid || typeof this.gid == "number" && this.gid !== this.processGid;
	}
	[ma](e) {
		return xa(this.uid, e.uid, this.processUid);
	}
	[ha](e) {
		return xa(this.gid, e.gid, this.processGid);
	}
	[Qi](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.fmode, r = new bt(String(e.absolute), {
			flags: Ti(e.size),
			mode: n,
			autoClose: !1
		});
		r.on("error", (n) => {
			r.fd && f.close(r.fd, () => {}), r.write = () => !0, this[$](n, e), t();
		});
		let i = 1, a = (n) => {
			if (n) {
				r.fd && f.close(r.fd, () => {}), this[$](n, e), t();
				return;
			}
			--i === 0 && r.fd !== void 0 && f.close(r.fd, (n) => {
				n ? this[$](n, e) : this[la](), t();
			});
		};
		r.on("finish", () => {
			let t = String(e.absolute), n = r.fd;
			if (typeof n == "number" && e.mtime && !this.noMtime) {
				i++;
				let r = e.atime || /* @__PURE__ */ new Date(), o = e.mtime;
				f.futimes(n, r, o, (e) => e ? f.utimes(t, r, o, (t) => a(t && e)) : a());
			}
			if (typeof n == "number" && this[pa](e)) {
				i++;
				let r = this[ma](e), o = this[ha](e);
				typeof r == "number" && typeof o == "number" && f.fchown(n, r, o, (e) => e ? f.chown(t, r, o, (t) => a(t && e)) : a());
			}
			a();
		});
		let o = this.transform && this.transform(e) || e;
		o !== e && (o.on("error", (n) => {
			this[$](n, e), t();
		}), e.pipe(o)), o.pipe(r);
	}
	[$i](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.dmode;
		this[Q](String(e.absolute), n, (n) => {
			if (n) {
				this[$](n, e), t();
				return;
			}
			let r = 1, i = () => {
				--r === 0 && (t(), this[la](), e.resume());
			};
			e.mtime && !this.noMtime && (r++, f.utimes(String(e.absolute), e.atime || /* @__PURE__ */ new Date(), e.mtime, i)), this[pa](e) && (r++, f.chown(String(e.absolute), Number(this[ma](e)), Number(this[ha](e)), i)), i();
		});
	}
	[ia](e) {
		e.unsupported = !0, this.warn("TAR_ENTRY_UNSUPPORTED", `unsupported entry type: ${e.type}`, { entry: e }), e.resume();
	}
	[ta](e, t) {
		let n = L(i.relative(this.cwd, i.resolve(i.dirname(String(e.absolute)), String(e.linkpath)))).split("/");
		this[ra](e, this.cwd, n, () => this[ea](e, String(e.linkpath), "symlink", t), (n) => {
			this[$](n, e), t();
		});
	}
	[na](e, t) {
		let n = L(i.resolve(this.cwd, String(e.linkpath))), r = L(String(e.linkpath)).split("/");
		this[ra](e, this.cwd, r, () => this[ea](e, n, "link", t), (n) => {
			this[$](n, e), t();
		});
	}
	[ra](e, t, n, r, a) {
		let o = n.shift();
		if (this.preservePaths || o === void 0) return r();
		let s = i.resolve(t, o);
		f.lstat(s, (t, o) => {
			if (t) return r();
			if (o?.isSymbolicLink()) return a(new Ni(s, i.resolve(s, n.join("/"))));
			this[ra](e, s, n, r, a);
		});
	}
	[ca]() {
		this[sa]++;
	}
	[la]() {
		this[sa]--, this[da]();
	}
	[fa](e) {
		this[la](), e.resume();
	}
	[Zi](e, t) {
		return e.type === "File" && !this.unlink && t.isFile() && t.nlink <= 1 && !_a;
	}
	[Yi](e) {
		this[ca]();
		let t = [e.path];
		e.linkpath && t.push(e.linkpath), this.reservations.reserve(t, (t) => this[Xi](e, t));
	}
	[Xi](e, t) {
		let n = (e) => {
			t(e);
		}, r = () => {
			this[Q](this.cwd, this.dmode, (t) => {
				if (t) {
					this[$](t, e), n();
					return;
				}
				this[ga] = !0, a();
			});
		}, a = () => {
			if (e.absolute !== this.cwd) {
				let t = L(i.dirname(String(e.absolute)));
				if (t !== this.cwd) return this[Q](t, this.dmode, (t) => {
					if (t) {
						this[$](t, e), n();
						return;
					}
					o();
				});
			}
			o();
		}, o = () => {
			f.lstat(String(e.absolute), (t, r) => {
				if (r && (this.keep || this.newer && r.mtime > (e.mtime ?? r.mtime))) {
					this[fa](e), n();
					return;
				}
				if (t || this[Zi](e, r)) return this[Z](null, e, n);
				if (r.isDirectory()) {
					if (e.type === "Directory") {
						let t = this.chmod && e.mode && (r.mode & 4095) !== e.mode, i = (t) => this[Z](t ?? null, e, n);
						return t ? f.chmod(String(e.absolute), Number(e.mode), i) : i();
					}
					if (e.absolute !== this.cwd) return f.rmdir(String(e.absolute), (t) => this[Z](t ?? null, e, n));
				}
				if (e.absolute === this.cwd) return this[Z](null, e, n);
				ya(String(e.absolute), (t) => this[Z](t ?? null, e, n));
			});
		};
		this[ga] ? a() : r();
	}
	[Z](e, t, n) {
		if (e) {
			this[$](e, t), n();
			return;
		}
		switch (t.type) {
			case "File":
			case "OldFile":
			case "ContiguousFile": return this[Qi](t, n);
			case "Link": return this[na](t, n);
			case "SymbolicLink": return this[ta](t, n);
			case "Directory":
			case "GNUDumpDir": return this[$i](t, n);
		}
	}
	[ea](e, t, n, r) {
		f[n](t, String(e.absolute), (t) => {
			t ? this[$](t, e) : (this[la](), e.resume()), r();
		});
	}
}, Ca = (e) => {
	try {
		return [null, e()];
	} catch (e) {
		return [e, null];
	}
}, wa = class extends Sa {
	sync = !0;
	[Z](e, t) {
		return super[Z](e, t, () => {});
	}
	[Yi](e) {
		if (!this[ga]) {
			let t = this[Q](this.cwd, this.dmode);
			if (t) return this[$](t, e);
			this[ga] = !0;
		}
		if (e.absolute !== this.cwd) {
			let t = L(i.dirname(String(e.absolute)));
			if (t !== this.cwd) {
				let n = this[Q](t, this.dmode);
				if (n) return this[$](n, e);
			}
		}
		let [t, n] = Ca(() => f.lstatSync(String(e.absolute)));
		if (n && (this.keep || this.newer && n.mtime > (e.mtime ?? n.mtime))) return this[fa](e);
		if (t || this[Zi](e, n)) return this[Z](null, e);
		if (n.isDirectory()) {
			if (e.type === "Directory") {
				let [t] = this.chmod && e.mode && (n.mode & 4095) !== e.mode ? Ca(() => {
					f.chmodSync(String(e.absolute), Number(e.mode));
				}) : [];
				return this[Z](t, e);
			}
			let [t] = Ca(() => f.rmdirSync(String(e.absolute)));
			this[Z](t, e);
		}
		let [r] = e.absolute === this.cwd ? [] : Ca(() => ba(String(e.absolute)));
		this[Z](r, e);
	}
	[Qi](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.fmode, r = (n) => {
			let r;
			try {
				f.closeSync(i);
			} catch (e) {
				r = e;
			}
			(n || r) && this[$](n || r, e), t();
		}, i;
		try {
			i = f.openSync(String(e.absolute), Ti(e.size), n);
		} catch (e) {
			return r(e);
		}
		let a = this.transform && this.transform(e) || e;
		a !== e && (a.on("error", (t) => this[$](t, e)), e.pipe(a)), a.on("data", (e) => {
			try {
				f.writeSync(i, e, 0, e.length);
			} catch (e) {
				r(e);
			}
		}), a.on("end", () => {
			let t = null;
			if (e.mtime && !this.noMtime) {
				let n = e.atime || /* @__PURE__ */ new Date(), r = e.mtime;
				try {
					f.futimesSync(i, n, r);
				} catch (i) {
					try {
						f.utimesSync(String(e.absolute), n, r);
					} catch {
						t = i;
					}
				}
			}
			if (this[pa](e)) {
				let n = this[ma](e), r = this[ha](e);
				try {
					f.fchownSync(i, Number(n), Number(r));
				} catch (i) {
					try {
						f.chownSync(String(e.absolute), Number(n), Number(r));
					} catch {
						t ||= i;
					}
				}
			}
			r(t);
		});
	}
	[$i](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.dmode, r = this[Q](String(e.absolute), n);
		if (r) {
			this[$](r, e), t();
			return;
		}
		if (e.mtime && !this.noMtime) try {
			f.utimesSync(String(e.absolute), e.atime || /* @__PURE__ */ new Date(), e.mtime);
		} catch {}
		if (this[pa](e)) try {
			f.chownSync(String(e.absolute), Number(this[ma](e)), Number(this[ha](e)));
		} catch {}
		t(), e.resume();
	}
	[Q](e, t) {
		try {
			return zi(L(e), {
				uid: this.uid,
				gid: this.gid,
				processUid: this.processUid,
				processGid: this.processGid,
				umask: this.processUmask,
				preserve: this.preservePaths,
				unlink: this.unlink,
				cwd: this.cwd,
				mode: t
			});
		} catch (e) {
			return e;
		}
	}
	[ra](e, t, n, r, a) {
		if (this.preservePaths || n.length === 0) return r();
		let o = t;
		for (let e of n) {
			o = i.resolve(o, e);
			let [s, c] = Ca(() => f.lstatSync(o));
			if (s) return r();
			if (c.isSymbolicLink()) return a(new Ni(o, i.resolve(t, n.join("/"))));
		}
		r();
	}
	[ea](e, t, n, r) {
		let i = `${n}Sync`;
		try {
			f[i](t, String(e.absolute)), r(), e.resume();
		} catch (t) {
			return this[$](t, e);
		}
	}
}, Ta = At((e) => {
	let t = new wa(e), n = e.file, r = f.statSync(n);
	new yt(n, {
		readSize: e.maxReadSize || 16 * 1024 * 1024,
		size: r.size
	}).pipe(t);
}, (e, t) => {
	let n = new Sa(e), r = e.maxReadSize || 16 * 1024 * 1024, i = e.file;
	return new Promise((e, t) => {
		n.on("error", t), n.on("close", e), f.stat(i, (e, a) => {
			if (e) t(e);
			else {
				let e = new vt(i, {
					readSize: r,
					size: a.size
				});
				e.on("error", t), e.pipe(n);
			}
		});
	});
}, (e) => new wa(e), (e) => new Sa(e), (e, t) => {
	t?.length && rr(e, t);
}), Ea = (e, t) => {
	let n = new ui(e), r = !0, i, a;
	try {
		try {
			i = f.openSync(e.file, "r+");
		} catch (t) {
			if (t?.code === "ENOENT") i = f.openSync(e.file, "w+");
			else throw t;
		}
		let o = f.fstatSync(i), s = Buffer.alloc(512);
		t: for (a = 0; a < o.size; a += 512) {
			for (let e = 0, t = 0; e < 512; e += t) {
				if (t = f.readSync(i, s, e, s.length - e, a + e), a === 0 && s[0] === 31 && s[1] === 139) throw Error("cannot append to compressed archives");
				if (!t) break t;
			}
			let t = new cn(s);
			if (!t.cksumValid) break;
			let n = 512 * Math.ceil((t.size || 0) / 512);
			if (a + n + 512 > o.size) break;
			a += n, e.mtimeCache && t.mtime && e.mtimeCache.set(String(t.path), t.mtime);
		}
		r = !1, Da(e, n, a, i, t);
	} finally {
		if (r) try {
			f.closeSync(i);
		} catch {}
	}
}, Da = (e, t, n, r, i) => {
	let a = new xt(e.file, {
		fd: r,
		start: n
	});
	t.pipe(a), ka(t, i);
}, Oa = (e, t) => {
	t = Array.from(t);
	let n = new li(e), r = (t, n, r) => {
		let i = (e, n) => {
			e ? f.close(t, (t) => r(e)) : r(null, n);
		}, a = 0;
		if (n === 0) return i(null, 0);
		let o = 0, s = Buffer.alloc(512), c = (r, l) => {
			if (r || l === void 0) return i(r);
			if (o += l, o < 512 && l) return f.read(t, s, o, s.length - o, a + o, c);
			if (a === 0 && s[0] === 31 && s[1] === 139) return i(/* @__PURE__ */ Error("cannot append to compressed archives"));
			if (o < 512) return i(null, a);
			let ee = new cn(s);
			if (!ee.cksumValid) return i(null, a);
			let te = 512 * Math.ceil((ee.size ?? 0) / 512);
			if (a + te + 512 > n || (a += te + 512, a >= n)) return i(null, a);
			e.mtimeCache && ee.mtime && e.mtimeCache.set(String(ee.path), ee.mtime), o = 0, f.read(t, s, 0, 512, a, c);
		};
		f.read(t, s, 0, 512, a, c);
	};
	return new Promise((i, a) => {
		n.on("error", a);
		let o = "r+", s = (c, l) => {
			if (c && c.code === "ENOENT" && o === "r+") return o = "w+", f.open(e.file, o, s);
			if (c || !l) return a(c);
			f.fstat(l, (o, s) => {
				if (o) return f.close(l, () => a(o));
				r(l, s.size, (r, o) => {
					if (r) return a(r);
					let s = new bt(e.file, {
						fd: l,
						start: o
					});
					n.pipe(s), s.on("error", a), s.on("close", i), Aa(n, t);
				});
			});
		};
		f.open(e.file, o, s);
	});
}, ka = (e, t) => {
	t.forEach((t) => {
		t.charAt(0) === "@" ? ir({
			file: i.resolve(e.cwd, t.slice(1)),
			sync: !0,
			noResume: !0,
			onReadEntry: (t) => e.add(t)
		}) : e.add(t);
	}), e.end();
}, Aa = async (e, t) => {
	for (let n of t) n.charAt(0) === "@" ? await ir({
		file: i.resolve(String(e.cwd), n.slice(1)),
		noResume: !0,
		onReadEntry: (t) => e.add(t)
	}) : e.add(n);
	e.end();
}, ja = At(Ea, Oa, () => {
	throw TypeError("file is required");
}, () => {
	throw TypeError("file is required");
}, (e, t) => {
	if (!Dt(e)) throw TypeError("file is required");
	if (e.gzip || e.brotli || e.zstd || e.file.endsWith(".br") || e.file.endsWith(".tbr")) throw TypeError("cannot append to compressed archives");
	if (!t?.length) throw TypeError("no paths specified to add/replace");
});
At(ja.syncFile, ja.asyncFile, ja.syncNoFile, ja.asyncNoFile, (e, t = []) => {
	ja.validate?.(e, t), Ma(e);
});
var Ma = (e) => {
	let t = e.filter;
	e.mtimeCache ||= /* @__PURE__ */ new Map(), e.filter = t ? (n, r) => t(n, r) && !((e.mtimeCache?.get(n) ?? r.mtime ?? 0) > (r.mtime ?? 0)) : (t, n) => !((e.mtimeCache?.get(t) ?? n.mtime ?? 0) > (n.mtime ?? 0));
}, Na = te(ee), Pa = i.dirname(ge(import.meta.url)), Fa = process.env.VITE_DEV_SERVER_URL, Ia = null;
function La() {
	if (Ia = new e({
		width: 900,
		height: 700,
		webPreferences: {
			preload: i.join(Pa, "preload.js"),
			nodeIntegration: !0,
			contextIsolation: !0
		},
		titleBarStyle: "hidden",
		title: "Rock_ET",
		backgroundColor: "#1a1a1a"
	}), Fa) Ia.loadURL(Fa);
	else {
		let e = i.join(Pa, "dist", "index.html");
		console.log("Final path check:", e), Ia.loadFile(e).catch((e) => {
			console.error("Failed to load index.html:", e), Ia?.loadURL(`file://${i.join(process.resourcesPath, "app.asar", "dist", "index.html")}`);
		});
	}
}
t.whenReady().then(La), r.handle("minimize-window", () => Ia?.minimize()), r.handle("close-window", () => Ia?.close()), r.handle("select-file", async () => {
	let e = await n.showOpenDialog({
		properties: ["openFile"],
		filters: [{
			name: "Rocket",
			extensions: ["rckt"]
		}]
	});
	return e.canceled ? null : e.filePaths[0];
}), r.handle("install-package", async (e, t, n) => {
	try {
		let e = i.join(he.tmpdir(), `rocket-${Date.now()}`);
		await l.mkdir(e, { recursive: !0 }), await Ta({
			file: t,
			cwd: e
		});
		let r = n === "global" ? "/usr/local/bin" : i.join(he.homedir(), ".rocket", "envs", n);
		await l.mkdir(r, { recursive: !0 });
		let a = i.join(e, "install.sh");
		return await l.chmod(a, 493), await Na(`bash ${a} "${r}"`, { cwd: e }), {
			success: !0,
			message: "Installed!"
		};
	} catch (e) {
		return {
			success: !1,
			error: e.message
		};
	}
});
//#endregion
