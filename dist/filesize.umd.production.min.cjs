!function(e) {
  "function" == typeof define && define.amd ? define(e) : e();
}((function() {
  "use strict";
  const e = "bits", i = "bytes", t = "iec", o = "jedec", n = "round", r = "string", l = {
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
  function filesize(s, {bits: a = !1, pad: b = !1, base: f = -1, round: p = 2, locale: u = "", localeOptions: c = {}, separator: d = "", spacer: y = " ", symbols: g = {}, standard: m = "", output: B = r, fullform: h = !1, fullforms: M = [], exponent: z = -1, roundingMethod: j = n, precision: P = 0} = {}) {
    let x = z, v = Number(s), w = [], E = 0, O = "";
    -1 === f && 0 === m.length ? (f = 10, m = o) : -1 === f && m.length > 0 ? f = (m = m === t ? t : o) === t ? 2 : 10 : m = 10 == (f = 2 === f ? 2 : 10) || m === o ? o : t;
    const N = 10 === f ? 1000 : 1024, T = !0 === h, k = v < 0, G = Math[j];
    if ("bigint" != typeof s && isNaN(s)) throw new TypeError("Invalid number");
    if ("function" != typeof G) throw new TypeError("Invalid rounding method");
    if (k && (v = -v), (-1 === x || isNaN(x)) && (x = Math.floor(Math.log(v) / Math.log(N)), 
    x < 0 && (x = 0)), x > 8 && (P > 0 && (P += 8 - x), x = 8), "exponent" === B) return x;
    if (0 === v) w[0] = 0, O = w[1] = l.symbol[m][a ? e : i][x]; else {
      E = v / (2 === f ? Math.pow(2, 10 * x) : Math.pow(1000, x)), a && (E *= 8, E >= N && x < 8 && (E /= N, 
      x++));
      const t = Math.pow(10, x > 0 ? p : 0);
      w[0] = G(E * t) / t, w[0] === N && x < 8 && -1 === z && (w[0] = 1, x++), O = w[1] = 10 === f && 1 === x ? a ? "kbit" : "kB" : l.symbol[m][a ? e : i][x];
    }
    if (k && (w[0] = -w[0]), P > 0 && (w[0] = w[0].toPrecision(P)), w[1] = g[w[1]] || w[1], 
    !0 === u ? w[0] = w[0].toLocaleString() : u.length > 0 ? w[0] = w[0].toLocaleString(u, c) : d.length > 0 && (w[0] = w[0].toString().replace(".", d)), 
    b && !1 === Number.isInteger(w[0]) && p > 0) {
      const e = d || ".", i = w[0].toString().split(e), t = i[1] || "", o = t.length;
      w[0] = `${i[0]}${e}${t.padEnd(o + (p - o), "0")}`;
    }
    return T && (w[1] = M[x] ? M[x] : l.fullform[m][x] + (a ? "bit" : "byte") + (1 === w[0] ? "" : "s")), 
    "array" === B ? w : "object" === B ? {
      value: w[0],
      symbol: w[1],
      exponent: x,
      unit: O
    } : w.join(y);
  }
  Object.defineProperty(filesize, "__esModule", {
    value: !0
  }), Object.defineProperty(filesize, "filesize", {
    value: filesize
  }), Object.defineProperty(filesize, "default", {
    value: filesize
  }), Object.defineProperty(filesize, "partial", {
    value: function partial({bits: e = !1, pad: i = !1, base: t = -1, round: o = 2, locale: l = "", localeOptions: s = {}, separator: a = "", spacer: b = " ", symbols: f = {}, standard: p = "", output: u = r, fullform: c = !1, fullforms: d = [], exponent: y = -1, roundingMethod: g = n, precision: m = 0} = {}) {
      return n => filesize(n, {
        bits: e,
        pad: i,
        base: t,
        round: o,
        locale: l,
        localeOptions: s,
        separator: a,
        spacer: b,
        symbols: f,
        standard: p,
        output: u,
        fullform: c,
        fullforms: d,
        exponent: y,
        roundingMethod: g,
        precision: m
      });
    }
  }), exports = filesize;
}));
//# sourceMappingURL=filesize.umd.production.min.cjs.map
