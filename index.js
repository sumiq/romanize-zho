const yonh = require("yonh");
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
      emcs.map(([syllable, tone]) => syllable.replace(/(?<=[iuyoea]{2})(?=[iuyoea])|(?<=[iuyoea]{2})|(?<=[iuyoea])/, ["\u0304", "\u0301", "\u0300", "\u030D"][tone]))
    ]
  })

const cmnSyllable = phonetic => {
  if (! /^[a-z]+[1-4]?$/.test(phonetic))
    return null;
  let [syllable, tone] = phonetic.match(/^([a-z]+)([1-4]?)$/).slice(1);

  syllable = [
    [/ng$/, "ŋ"],

    [/(?<=[zcs]h?|r)i/, ""],
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

const pinyin = require("pinyin");
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
                syllable = syllable.replace(/^(?=[iuyea](?!r))/, "ŋ");
              else if (emcs.some(emc => /^m/.test(emc[0])))
                syllable = syllable
                  .replace(/^u$/, "m'u")
                  .replace(/^u/, "mu");

              if (emcs.some(emc => /m$/.test(emc[0])))
                syllable = syllable
                  .replace(/n$/, "m")
            }

            // prettify
            syllable = syllable
              .replace(/e(?=[ŋnm])/, "")
              .replace(/(?<=[iu])e(?=[iuy])/, "");

            tone = ["\u0304", "\u0301", "\u030C", "\u0300", "",][tone];
            if (/[ea]/.test(syllable))
              phonetic = syllable.replace(/(?<=[ea])/, tone);
            else if (! /[eaiuy]/.test(syllable))
              phonetic = syllable.replace(/$/, tone);
            else if (/[iuy][iu]/.test(syllable))
              phonetic = syllable.replace(/(?<=[iuy][iu])/, tone);
            else
              phonetic = syllable.replace(/(?<=[iuy])/, tone);

            return phonetic.normalize("NFC");
          })
        ]
      }
    })

const yueSyllable = phonetic => {
  if (/[ktp]2/.test(phonetic))
    return null;

  let [syllable, tone] = phonetic.match(/^([a-z]+)([1-6])$/).slice(1);
  if (/[ktp]$/.test(syllable))
    tone = {
      "1": "7",
      "3": "7",
      "6": "8",
    }[tone]
  const voiced = ["4", "5", "6", "8"].includes(tone);

  syllable = syllable
    .replace(/k$/, "ng")
    .replace(/t$/, "n")
    .replace(/m$/, "m")

    .replace(/ng/g, "ŋ")
    .replace(/z/, "r")
    .replace(/h/, "x")
    .replace(/w/, "v")
    .replace(/yu/, "y")
    .replace(/oe|eo/, "ø")
    .replace(/a/g, "ə")
    .replace(/əə/, "a")

    .replace(/j(?=[iyø])/, "")
    .replace(/v(?=u)/, "")

    .replace(/(?<=[iyueøoəa])i$/, "j")
    .replace(/(?<=[iyueøoəa])u$/, "v")

    .replace(/^k/, "kx")
    .replace(/^g/, "k")
    .replace(/^t/, "tx")
    .replace(/^d/, "t")
    .replace(/^c/, "cx")
    .replace(/^r/, "c")
    .replace(/^p/, "px")
    .replace(/^b/, "p")

  if (voiced)
    syllable = syllable
      .replace(/^k/, "g")
      .replace(/^t/, "d")
      .replace(/^c/, "r")
      .replace(/^p/, "b")
      .replace(/^x/, "h")
      .replace(/^s/, "z")
      .replace(/^f/, "w")
  else
    syllable = syllable
      .replace(/^(?=[iyueøoəajvŋnml])/, "q")

  tone = [0, 1, 2, 0, 1, 2, 3, 3][parseInt(tone) - 1];
  //console.assert(/[iyueøoəa]|^[ŋm]$)$/.test(syllable), [phonetic, syllable]);
  //console.assert(0 <= tone && tone < 4, [phonetic, tone]);

  return [syllable, tone, voiced];
}

console.log("load jyutping.");
const jyutpingTableParser = require("jyutping-table-parser");
const yuesOf = jyutpingTableParser.parseJyutpingInput()
  .reduce((result, current) => {
    if (current.infoArray)
      result[current.ch] = current.infoArray.map(info => info.jyutping[0]);
    return result;
  }, {});
console.log("end.")

const unvoice = syllable =>
  syllable
    .replace(/^(?=[ŋnmljviyueøoəa])/, "q")
    .replace(/^g/, "k")
    .replace(/^d/, "t")
    .replace(/^r/, "c")
    .replace(/^b/, "p")
    .replace(/^h/, "x")
    .replace(/^z/, "s")
    .replace(/^w/, "f")

const yue = text =>
  [...text].map(c => [c,
    !yuesOf[c] ? null : yuesOf[c]
      .reduce((phonetics, phonetic) => {
        phonetic = yueSyllable(phonetic)
        if (!phonetic)
          return phonetics;
        let [syllable, tone, voiced] = phonetic;

        const emcs = emcsOf(c);
        if (emcs) {
          if (emcs.some(emc => /^([tc]x?|[dʒsz])[jr]/.test(emc[0])))
            syllable = syllable.replace(/(?<=^[crsz])/, "j")
          if (emcs.some(emc => /^[kgxh]/.test(emc[0])))
            syllable = syllable
              .replace(/^f/, "xv")
              .replace(/^w/, "hv")
              .replace(/^q(?=[jviyueøoəa])/, "x'")
              .replace(/^(?=[jviyueøoəa])/, "h'")

          if (emcs.some(emc => /^ŋ/.test(emc[0])))
            syllable = syllable.replace(/(?<=^q?)(?=[jviyueøoəa])/, "ŋ'")
          if (emcs.some(emc => /^n/.test(emc[0])))
            syllable = syllable.replace(/(?<=^q?)(?=[jviyueøoəa])/, "n'")
          if (emcs.some(emc => /^m/.test(emc[0])))
            syllable = syllable.replace(/(?<=^q?)(?=[jviyueøoəa])/, "m'")
        }

        syllable = syllable
          .replace(/(?<=ŋ)'(?=[jviyueøoəa])/, "")
          .replace(/(?<=[ŋnxh])'(?=[jy])/, "")
          .replace(/(?<=[h])'(?=[vi])/, "")

          //.replace(/(?<!^)ə(?!$)/, "")

          .replace(/(?<!^)jx/, "xj")
          .replace(/(?<!^)vx/, "xv")

        if (tone === 3) {
          syllable = syllable
            .replace(/ŋ$/, "k")
            .replace(/n$/, "t")
            .replace(/m$/, "p")
        }

        if (
          phonetics.some(([syllable1, tone1]) =>
            tone == tone1 && [
              syllable == syllable1,
              syllable == syllable1.replace(/(?<!^)v/, ""),

              syllable == syllable1.replace(/(?<=^)ŋ/, ""),

              syllable == syllable1.replace(/(?<=^)/, "ŋ"),
              syllable == syllable1.replace(/(?<=^q)ŋ/, ""),
              syllable == syllable1.replace(/(?<=^q)/, "ŋ"),
              syllable == syllable1.replace(/(?<=^q?)n/, "l"),

              syllable == syllable1.replace(/iŋ$/, "eŋ"),
              syllable == syllable1.replace(/eŋ$/, "iŋ"),
              syllable == syllable1.replace(/uŋ$/, "oŋ"),
              syllable == syllable1.replace(/oŋ$/, "uŋ"),
            ].some(x => x)
            || [
              syllable == syllable1.replace(/(?<=^[gdrb])/, "x"),
              syllable == syllable1.replace(/^(?=[ŋnml])/, "q"),
              syllable == syllable1.replace(/^/, "q") && tone == 1 && tone1 == 0,
              syllable == syllable1 && tone == 2 && tone1 == 0,
              !voiced && syllable == unvoice(syllable1) && tone == 1 && tone1 == 0,
            ].some(x => x)
          )
        )
          return phonetics;
        else
          return phonetics.concat([[syllable, tone]]);
      }, [])
      .map(([syllable, tone]) =>
        syllable
          .replace(/(?<=[iyueøoəa])|$/,
            //["\u0300", "\u0301", "\u0304", "\u030D"][tone]
            ["\u0300", "\u0301", "", ""][tone]
          )
          .replace(/i/g, "ı")
          .replace(/j/g, "ȷ")
          .normalize("NFC")
      )
  ])

const express = require('express');
const app = express();
app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "romanize chinese",
    text: req.query.text,
  });
});

app.get("/result", (req, res) => {
  const text = req.query.text;
  res.render("result", {
    title: "romanize chinese: result",
    emc: emc(text),
    cmn: cmn(text),
    yue: yue(text),
  });
});

const port = process.env.PORT || 8080;
console.log(`listen http://localhost:${port}.`);
app.listen(port);
