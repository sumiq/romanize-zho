const fs = require("fs")
const jyutpingTableParser = require("jyutping-table-parser")

const jyutpingsOf = jyutpingTableParser.parseJyutpingInput()
  .reduce((result, current) => {
    let jyutpings = []

    if (current.infoArray)
      jyutpings = current.infoArray
        .filter(info => !info.sc || ! /1\.[1-6]/.test(info.sc))
        .filter(jyutping => ! /[ktp]2|ŋm|hŋ|hm|um|e[unm]|ə[1-6]|eo[1-6]/.test(jyutping))
        .map(info => info.jyutping[0]
          .replace(/ng/g, "ŋ")
          .replace(/a/g, "ə")
          .replace(/əə/, "a")
        )

    jyutpings = jyutpings
      .map(jyutping => jyutping
        .replace(/yu/g, "y")
        .replace(/oe|eo/, "ø")
        .replace(/j(?=[iyø])/g, "")
        .replace(/w(?=u)/g, "")

        .replace(/^z/, "ʒ")
        .replace(/^h/, "x")
        .replace(/w/, "v")

        .replace(/(?<=[iyueøoəa])i(?=[1-6]$)/, "j")
        .replace(/(?<=[iyueøoəa])u(?=[1-6]$)/, "v")

        .replace(/^k/, "kx")
        .replace(/^g/, "k")
        .replace(/^t/, "tx")
        .replace(/^d/, "t")
        .replace(/^c/, "cx")
        .replace(/^ʒ/, "c")
        .replace(/^p/, "px")
        .replace(/^b/, "p")
      )

    jyutpings = jyutpings
      .map(jyutping => {
        let [syllable, tone] = jyutping.match(/^(.+)([1-6])$/).slice(1)
        if (/[ktp]$/.test(syllable)) {
          tone = tone
            .replace(/1/, "7")
            .replace(/3/, "8")
            .replace(/6/, "9")
          syllable = syllable
            .replace(/k$/, "ŋ")
            .replace(/t$/, "n")
            .replace(/p$/, "m")
        }
        tone = [0, 1, 2, 4, 5, 6, 3, 3, 7][parseInt(tone) - 1]
        voiced = 4 <= tone

        return [syllable, tone % 4, voiced]
      })

    result[current.ch] = jyutpings
    return result
  }, {})

fs.writeFileSync("yue.json", JSON.stringify(jyutpingsOf, null, 2))
