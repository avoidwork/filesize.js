const i = {
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

function filesize(t, {bits: e = !1, pad: o = !1, base: n = -1, round: r = 2, locale: l = "", localeOptions: s = {}, separator: a = "", spacer: b = " ", symbols: p = {}, standard: c = "", output: u = "string", fullform: d = !1, fullforms: f = [], exponent: g = -1, roundingMethod: m = "round", precision: y = 0} = {}) {
  let B = g, h = Number(t), M = [], j = 0, x = "";
  -1 === n && 0 === c.length ? (n = 10, c = "jedec") : -1 === n && c.length > 0 ? n = "iec" == (c = "iec" === c ? "iec" : "jedec") ? 2 : 10 : c = 10 == (n = 2 === n ? 2 : 10) || "jedec" === c ? "jedec" : "iec";
  const w = 10 === n ? 1000 : 1024, E = !0 === d, z = h < 0, N = Math[m];
  if ("bigint" != typeof t && isNaN(t)) throw new TypeError("Invalid number");
  if ("function" != typeof N) throw new TypeError("Invalid rounding method");
  if (z && (h = -h), (-1 === B || isNaN(B)) && (B = Math.floor(Math.log(h) / Math.log(w)), 
  B < 0 && (B = 0)), B > 8 && (y > 0 && (y += 8 - B), B = 8), "exponent" === u) return B;
  if (0 === h) M[0] = 0, x = M[1] = i.symbol[c][e ? "bits" : "bytes"][B]; else {
    j = h / (2 === n ? Math.pow(2, 10 * B) : Math.pow(1000, B)), e && (j *= 8, j >= w && B < 8 && (j /= w, 
    B++));
    const t = Math.pow(10, B > 0 ? r : 0);
    M[0] = N(j * t) / t, M[0] === w && B < 8 && -1 === g && (M[0] = 1, B++), x = M[1] = 10 === n && 1 === B ? e ? "kbit" : "kB" : i.symbol[c][e ? "bits" : "bytes"][B];
  }
  if (z && (M[0] = -M[0]), y > 0 && (M[0] = M[0].toPrecision(y)), M[1] = p[M[1]] || M[1], 
  !0 === l ? M[0] = M[0].toLocaleString() : l.length > 0 ? M[0] = M[0].toLocaleString(l, s) : a.length > 0 && (M[0] = M[0].toString().replace(".", a)), 
  o && !1 === Number.isInteger(M[0]) && r > 0) {
    const i = a || ".", t = M[0].toString().split(i), e = t[1] || "", o = e.length;
    M[0] = `${t[0]}${i}${e.padEnd(o + (r - o), "0")}`;
  }
  return E && (M[1] = f[B] ? f[B] : i.fullform[c][B] + (e ? "bit" : "byte") + (1 === M[0] ? "" : "s")), 
  "array" === u ? M : "object" === u ? {
    value: M[0],
    symbol: M[1],
    exponent: B,
    unit: x
  } : M.join(b);
}

function partial({bits: i = !1, pad: t = !1, base: e = -1, round: o = 2, locale: n = "", localeOptions: r = {}, separator: l = "", spacer: s = " ", symbols: a = {}, standard: b = "", output: p = "string", fullform: c = !1, fullforms: u = [], exponent: d = -1, roundingMethod: f = "round", precision: g = 0} = {}) {
  return m => filesize(m, {
    bits: i,
    pad: t,
    base: e,
    round: o,
    locale: n,
    localeOptions: r,
    separator: l,
    spacer: s,
    symbols: a,
    standard: b,
    output: p,
    fullform: c,
    fullforms: u,
    exponent: d,
    roundingMethod: f,
    precision: g
  });
}

export { filesize as default, filesize, partial };
//# sourceMappingURL=filesize.esm.mjs.map
