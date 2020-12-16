const fs = require("fs");
const yonh = require("yonh");
const pinyin = require("pinyin");

const emcsOf = c => {
  let data = yonh.lookup(c);
  if (!Array.isArray(data))
    data = [data];

  if (!data.length)
    return null;

  return data.map(datum => [
    datum.roman
      .replace(/[xh]$/, "")
      .replace(/ng/g, "ŋ")
      .replace(/k$/, "ŋ")
      .replace(/t$/, "n")
      .replace(/p$/, "m")
      .replace(/^h/, "x")
      .replace(/^gh/, "h")
      .replace(/(?<!^)h/, "x")
      .replace(/^z(?!s)/, "ʒ")
      .replace(/^zs/, "z"),
    ["平聲", "上聲", "去聲", "入聲"].indexOf(datum.tone),
  ])
}

const emc = text =>
  [...text].map(c => {
    const emcs = emcsOf(c);
    return !emcs ? [c] : [c,
      emcs.map(([syllable, tone]) =>
        syllable
          .replace(/$/, ["", "q", "s", ""][tone])
          .replace(/[ŋnm]$/, x => tone == 3 ? { ŋ: "k", n: "t", m: "p" }[x] : x)
          //.replace(/ŋ/g, "v")
      )
    ]
  })

const cmnSyllable = phonetic => {
  if (! /^[a-z]+[1-4]?$/.test(phonetic))
    return null;
  let [syllable, tone] = phonetic.match(/^([a-z]+)([1-4]?)$/).slice(1);

  syllable = [
    [/ng$/, "ŋ"],

    [/(?<=[zcs]h?|r)i$/, ""],
    [/(?<=^[bpmf])o/, "uo"],
    [/(?<=^[jqx])u/, "v"],

    [/^j/, "g"],
    [/^q/, "k"],
    [/^x/, "h"],

    [/^zh/, "j"],
    [/^ch/, "q"],
    [/^sh/, "x"],

    [/^yi/, "i"],
    [/^wu/, "u"],
    [/^yu/, "v"],

    [/y/, "i"],
    [/v/, "y"],
    [/w/, "u"],

    [/ao/, "au"],
    [/ioŋ/, "yeŋ"],
    [/oŋ/, "ueŋ"],
    [/(?<=[iuy])(?=[iuŋn])/, "e"],

    [/o/, "e"],
  ]
    .reduce((value, [x, y]) => value.replace(x, y), syllable);

  tone = tone ? parseInt(tone) - 1 : 4;
  return [syllable, tone]
}

const cmn = text =>
  [].concat.apply([],
    text
      .split(/(?<=\p{sc=Han})(?!\p{sc=Han})|(?<!\p{sc=Han})(?=\p{sc=Han})/u)
      .map(s => /^\p{sc=Han}+$/u.test(s)
        ?
        pinyin(s, {
          style: pinyin.STYLE_TONE2,
          heteronym: true,
          segment: true,
        })
          .map((phonetics, i) =>
            phonetics.every(phonetic => /^[a-z]+[1-4]?$/.test(phonetic))
              ? [s[i], phonetics]
              : phonetics
          )
        : [...s].map(c => [c])
      )
  )
    .map(([c, phonetics]) => {
      if (!phonetics)
        return [c]
      else {
        return [c,
          phonetics.map(phonetic => {
            let [syllable, tone] = cmnSyllable(phonetic);

            let emcs = emcsOf(c);
            if (emcs) {
              if (emcs.some(emc => /^[cʒsz]/.test(emc[0])))
                syllable = syllable
                  .replace(/^g(?=[iy])/, "z")
                  .replace(/^k(?=[iy])/, "c")
                  .replace(/^h(?=[iy])/, "s");
              else if (emcs.some(emc => /^ŋ/.test(emc[0])))
                syllable = syllable.replace(/^(?=[iuyea])/, "ŋ");
              else if (emcs.some(emc => /^m/.test(emc[0])))
                syllable = syllable
                  .replace(/^u(?!$)/, "mu");

              if (emcs.some(emc => /m$/.test(emc[0])))
                syllable = syllable.replace(/n$/, "m")
            }

            // prettify
            syllable = syllable
              //.replace(/e(?=[ŋnm])/, "")
              //.replace(/(?<=.)e(?=r)/, "")
              .replace(/(?<=[iu])e(?=[iuyŋnm])/, "");

            tone = ["\u0304", "\u0301", "\u030C", "\u0300", "",][tone];
            if (/[ea]/.test(syllable))
              phonetic = syllable.replace(/(?<=[ea])/, tone);
            else if (! /[eaiuy]/.test(syllable))
              phonetic = syllable.replace(/$/, tone);
            else if (/[iuy][iu]/.test(syllable))
              phonetic = syllable.replace(/(?<=[iuy][iu])/, tone);
            else
              phonetic = syllable.replace(/(?<=[iuy])/, tone);

            return phonetic/*.replace(/ŋ/g, "v")*/.normalize("NFC");
          })
        ]
      }
    })

const cmnBpmf = text =>
  [].concat.apply([],
    text
      .split(/(?<=\p{sc=Han})(?!\p{sc=Han})|(?<!\p{sc=Han})(?=\p{sc=Han})/u)
      .map(s => /^\p{sc=Han}+$/u.test(s)
        ?
        pinyin(s, {
          style: pinyin.STYLE_TONE2,
          heteronym: true,
          segment: true,
        })
          .map((phonetics, i) =>
            phonetics.every(phonetic => /^[a-z]+[1-4]?$/.test(phonetic))
              ? [s[i], phonetics]
              : phonetics
          )
        : [...s].map(c => [c])
      )
  )
    .map(([c, phonetics]) => {
      if (!phonetics)
        return [c]
      else {
        return [c,
          phonetics.map(phonetic => {
            let [syllable, tone] = cmnSyllable(phonetic);

            let emcs = emcsOf(c);
            if (emcs) {
              if (emcs.some(emc => /^[cʒsz]/.test(emc[0])))
                syllable = syllable
                  .replace(/^g(?=[iy])/, "z")
                  .replace(/^k(?=[iy])/, "c")
                  .replace(/^h(?=[iy])/, "s");
              else if (emcs.some(emc => /^ŋ/.test(emc[0])))
                syllable = syllable.replace(/^(?=[iuyea])/, "ŋ");
              else if (emcs.some(emc => /^m/.test(emc[0])))
                syllable = syllable
                  .replace(/^u(?!$)/, "mu");
            }

            syllable = syllable
              .replace(/^b/, "ㄅ")
              .replace(/^p/, "ㄆ")
              .replace(/^m/, "ㄇ")
              .replace(/^f/, "ㄈ")

              .replace(/^d/, "ㄉ")
              .replace(/^t/, "ㄊ")
              .replace(/^n/, "ㄋ")
              .replace(/^l/, "ㄌ")

              .replace(/^g/, "ㄍ")
              .replace(/^k/, "ㄎ")
              .replace(/^ŋ/, "ㄫ")
              .replace(/^h/, "ㄏ")

              .replace(/^j/, "ㄓ")
              .replace(/^q/, "ㄔ")
              .replace(/^x/, "ㄕ")
              .replace(/^r/, "ㄖ")

              .replace(/^z/, "ㄗ")
              .replace(/^c/, "ㄘ")
              .replace(/^s/, "ㄙ")

              .replace(/er$/, "ㄦ")
              .replace(/ei$/, "ㄟ")
              .replace(/eu$/, "ㄡ")
              .replace(/en$/, "ㄣ")
              .replace(/eŋ$/, "ㄥ")
              .replace(/e$/, "ㄛ")

              .replace(/ai$/, "ㄞ")
              .replace(/au$/, "ㄠ")
              .replace(/an$/, "ㄢ")
              .replace(/aŋ$/, "ㄤ")
              .replace(/a$/, "ㄚ")

              .replace(/i/, "ㄧ")
              .replace(/u/, "ㄨ")
              .replace(/y/, "ㄩ")

            tone = ["ˉ", "ˊ", "ˇ", "ˋ", "˙",][tone];

            return syllable + tone;
          })
        ]
      }
    })


const jyutpingsOf = JSON.parse(fs.readFileSync("yue.json"))

const unvoice = syllable =>
  syllable
    .replace(/^(?=[ŋnmljviyueøoəa])/, "q")
    .replace(/^g/, "k")
    .replace(/^d/, "t")
    .replace(/^ʒ/, "c")
    .replace(/^b/, "p")
    .replace(/^h/, "x")
    .replace(/^z/, "s")
    .replace(/^w/, "f")

const yue = text =>
  [...text].map(c => [c,
    !jyutpingsOf[c] ? null : jyutpingsOf[c]
      .reduce((phonetics, [syllable, tone, voiced]) => {
        const emcs = emcsOf(c);
        if (emcs) {
          let filtered = emcs.filter(emc => /^[td]/.test(emc[0]))
          if (filtered.length && /^(tx?|d)r/.test(filtered[0][0]))
            syllable = syllable.replace(/(?<=[cs])/, "j")
          else {
            filtered = emcs.filter(emc => /^[cʒsz]/.test(emc[0]))
            if (filtered.length && /^(cx?|[ʒsz])[jr]/.test(filtered[0][0]))
              syllable = syllable.replace(/(?<=^[cs])/, "j")

            else if (emcs.some(emc => /^[kgxh]/.test(emc[0])) && !emcs.some(emc => /^[pb]/.test(emc[0])))
              syllable = syllable
                .replace(/^f/, "xv")

            if (emcs.some(emc => /^[xh]/.test(emc[0])) && !emcs.some(emc => /^[iyueoa]/.test(emc[0])))
              syllable = syllable
                .replace(/^(?=[jviyueøoəa])/, "x'")
          }

          if (emcs.some(emc => /^ŋ/.test(emc[0])))
            syllable = syllable.replace(/^(?=[jviyueøoəa])/, "ŋ")
          if (emcs.some(emc => /^n/.test(emc[0])))
            syllable = syllable
              .replace(/^(?=[jvy])/, "n")
              .replace(/^(?=ø)/, "nj")
              .replace(/^(?=[iueoəa])/, "n'")
          if (emcs.some(emc => /^m/.test(emc[0])))
            syllable = syllable
              .replace(/^(?=[jvyø])/, "m")
              .replace(/^(?=[iueoəa])/, "m'")

        }

        if (voiced)
          syllable = syllable
            .replace(/^k/, "g")
            .replace(/^t/, "d")
            .replace(/^c/, "ʒ")
            .replace(/^p/, "b")
            .replace(/^x/, "h")
            .replace(/^s/, "z")
            .replace(/^f/, "w")
        else
          syllable = syllable
            .replace(/^(?=[iyueøoəajvŋnml])/, "q")

        syllable = syllable
          .replace(/(?<=[xh])'(?=j|i$|u(?!ŋ))/, "")
          .replace(/(?<=h)'(?=[jviyø])/, "")

          .replace(/'(?=[iyø])/, "j")
          .replace(/'(?=u)/, "v")

          .replace(/(?<!^)jx/, "xj")
          .replace(/(?<!^)vx/, "xv")

        /*
        if (! /^(q?[nl]|[crszj])/.test(syllable)) {
          syllable = syllable
            .replace(/ej$/, "i")
        }
        if (! /^(q?v|[fkg])/.test(syllable)) {
          syllable = syllable
            .replace(/ov$/, "u")
        }
        */

        if (tone === 3) {
          syllable = syllable
            .replace(/ŋ$/, "k")
            .replace(/n$/, "t")
            .replace(/m$/, "p")
        }

        if ([0, 1].includes(tone))
          syllable = syllable
            .replace(/(?<=^[gdʒb])(?!x)/, "h")
            .replace(/(?<=^[gdʒb])x/, "")

        if (
          phonetics.some(([syllable1, tone1]) =>
            tone == tone1 && syllable == syllable1
            || /^[ŋnml]/.test(syllable1) && syllable == syllable1.replace(/^(?=[ŋnml])/, "q"),
          )
        )
          return phonetics;
        else
          return phonetics.concat([[syllable, tone]]);
      }, [])
      .map(([syllable, tone]) =>
        syllable
          .replace(/(?<=[iyueøoəa])|$/, ["\u0300", "\u0301", "", ""][tone])
          //.replace(/$/, ["", "q", "s", ""][tone])
          .replace(/i/g, "ı")
          .replace(/j/g, "ȷ")
          .normalize("NFC")
      )
  ])
    .map(([c, ps]) => ps ? [c, ps] : [c]);

const yueAsciify = data =>
  data.map(([c, ps]) =>
    [c, ps?.map(p =>
      p
        .normalize("NFD")
        .replace(/c/g, "ts")
        .replace(/ʒ/g, "dz")
        .replace(/g/g, "c")
        .replace(/ŋ/g, "g")
        .replace(/ø/g, "eo")
        .replace(/a/g, "aa")
        .replace(/ə/g, "a")
        .replace(/ı/g, "i")
        .replace(/ȷ/g, "j")
        .replace(/(?<=.*\u0300.*)$/g, "x")
        .replace(/(?<=.*\u0301.*)$/g, "h")
        .replace(/[\u0300\u0301]/g, "")
        .normalize("NFC")
    )]
  )

module.exports = { emc, yue, cmn, cmnBpmf, yueAsciify, };