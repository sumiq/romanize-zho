const fs = require("fs")
const { yueSyllable } = require("../convert.js")

const jyutpingsOf = JSON.parse(fs.readFileSync("yue.json"))

const data = {}
for (const [c, jyutpings] of Object.entries(jyutpingsOf)) {
  for (const jyutping of jyutpings) {
    const phonetic = yueSyllable(jyutping)
    if (phonetic) {
      let [syllable, tone, voiced] = phonetic
      if (/^q?[ŋm]$/.test(syllable))
        ""
      else {
        const [initial, nucleus, terminal] = syllable.match(/(.*)([iyueøoəa])(.?)/).slice(1)
        if (!data[initial])
          data[initial] = {}
        if (!data[initial][nucleus + terminal])
          data[initial][nucleus + terminal] = []

        data[initial][nucleus + terminal].push([c, tone])
      }
    }
  }
}

const initials = "p px b bx f w m t tx d dx n l c cx r rx s z k kx g gx ŋ kv kxv gv gxv j v".split(" ")
const nuclei = "i e u o e y ø ə a".split(" ")
const terminals = " j v ŋ n m".split(" ")

for (const nucleus of nuclei)
  for (const terminal of terminals)
    process.stdout.write(`\t${nucleus + terminal}`)
process.stdout.write(`\n`)

for (const initial of initials) {
  process.stdout.write(initial);
  for (const nucleus of nuclei)
    for (const terminal of terminals) {
      process.stdout.write(`\t`);
      try {
        process.stdout.write(`${data[initial][nucleus + terminal].length}`);
      } catch (e) {
      }
    }
  process.stdout.write(`\n`);

}

