"use strict";

const e = {
  symbol: {
    iec: {
      bits: [ "bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit" ],
      bytes: [ "B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB" ]
    },
    jedec: {
      bits: [ "bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit" ],
      bytes: [ "B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ]
    }
  },
  fullform: {
    iec: [ "", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi" ],
    jedec: [ "", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta" ]
  }
};

function filesize(i, {bits: t = !1, pad: o = !1, base: r = -1, round: l = 2, locale: n = "", localeOptions: s = {}, separator: a = "", spacer: b = " ", symbols: f = {}, standard: p = "", output: c = "string", fullform: u = !1, fullforms: d = [], exponent: g = -1, roundingMethod: y = "round", precision: m = 0} = {}) {
  let B = g, h = Number(i), M = [], j = 0, z = "";
  -1 === r && 0 === p.length ? (r = 10, p = "jedec") : -1 === r && p.length > 0 ? r = "iec" == (p = "iec" === p ? "iec" : "jedec") ? 2 : 10 : p = 10 == (r = 2 === r ? 2 : 10) || "jedec" === p ? "jedec" : "iec";
  const P = 10 === r ? 1000 : 1024, x = !0 === u, v = h < 0, w = Math[y];
  if ("bigint" != typeof i && isNaN(i)) throw new TypeError("Invalid number");
  if ("function" != typeof w) throw new TypeError("Invalid rounding method");
  if (v && (h = -h), (-1 === B || isNaN(B)) && (B = Math.floor(Math.log(h) / Math.log(P)), 
  B < 0 && (B = 0)), B > 8 && (m > 0 && (m += 8 - B), B = 8), "exponent" === c) return B;
  if (0 === h) M[0] = 0, z = M[1] = e.symbol[p][t ? "bits" : "bytes"][B]; else {
    j = h / (2 === r ? Math.pow(2, 10 * B) : Math.pow(1000, B)), t && (j *= 8, j >= P && B < 8 && (j /= P, 
    B++));
    const i = Math.pow(10, B > 0 ? l : 0);
    M[0] = w(j * i) / i, M[0] === P && B < 8 && -1 === g && (M[0] = 1, B++), z = M[1] = 10 === r && 1 === B ? t ? "kbit" : "kB" : e.symbol[p][t ? "bits" : "bytes"][B];
  }
  if (v && (M[0] = -M[0]), m > 0 && (M[0] = M[0].toPrecision(m)), M[1] = f[M[1]] || M[1], 
  !0 === n ? M[0] = M[0].toLocaleString() : n.length > 0 ? M[0] = M[0].toLocaleString(n, s) : a.length > 0 && (M[0] = M[0].toString().replace(".", a)), 
  o && !1 === Number.isInteger(M[0]) && l > 0) {
    const e = a || ".", i = M[0].toString().split(e), t = i[1] || "", o = t.length;
    M[0] = `${i[0]}${e}${t.padEnd(o + (l - o), "0")}`;
  }
  return x && (M[1] = d[B] ? d[B] : e.fullform[p][B] + (t ? "bit" : "byte") + (1 === M[0] ? "" : "s")), 
  "array" === c ? M : "object" === c ? {
    value: M[0],
    symbol: M[1],
    exponent: B,
    unit: z
  } : M.join(b);
}

Object.defineProperty(filesize, "__esModule", {
  value: !0
}), Object.defineProperty(filesize, "filesize", {
  value: filesize
}), Object.defineProperty(filesize, "default", {
  value: filesize
}), Object.defineProperty(filesize, "partial", {
  value: function partial({bits: e = !1, pad: i = !1, base: t = -1, round: o = 2, locale: r = "", localeOptions: l = {}, separator: n = "", spacer: s = " ", symbols: a = {}, standard: b = "", output: f = "string", fullform: p = !1, fullforms: c = [], exponent: u = -1, roundingMethod: d = "round", precision: g = 0} = {}) {
    return y => filesize(y, {
      bits: e,
      pad: i,
      base: t,
      round: o,
      locale: r,
      localeOptions: l,
      separator: n,
      spacer: s,
      symbols: a,
      standard: b,
      output: f,
      fullform: p,
      fullforms: c,
      exponent: u,
      roundingMethod: d,
      precision: g
    });
  }
}), exports = filesize;
//# sourceMappingURL=filesize.cjs.production.min.cjs.map
