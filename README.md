# romanize-chinese

https://romanize-zho.herokuapp.com/

```
npm i
node index
```

## mandarin

### consonant

|           | guttural | retroflex | dental | dental | labial |
| --------: | :------- | :-------- | :----- | :----- | :----- |
|    tenuis | g        | j         | d      | z      | b      |
| aspirated | k        | q         | t      | c      | p      |
| fricative | h        | x         |        | s      | f      |
|     nasal | v        |           | n      |        | m      |
|    liquid |          | r         | l      |        |        |

### glide

i u y

### vowel

e a

## yue

### consonant

|                                   | null | guttural | dental | dental | labial |
| --------------------------------: | :--- | :------- | :----- | :----- | :----- |
|                       high tenuis | q    | k        | t      | c      | p      |
|                    high aspirated |      | kx       | tx     | cx     | px     |
|         low (平\|上)-toned tenuis |      | gh       | dh     | rh     | bh     |
|      low (去\|入)-toned aspirated |      | gx       | dx     | rx     | bx     |
| remaining low tenuis or aspirated | ∅    | g        | d      | r      | b      |
|                    high fricative |      | x        |        | s      | f      |
|                     low fricative |      | h        |        | z      | w      |
|                      low sonorant |      | ŋ        | n      | l      | m      |
|                     high sonorant |      | qŋ       | qn     | ql     | qm     |


#### motivation
- MC: middle chinese
- basically, (unvoiced, voiced) initials in MC led to (high, low) tone in yue.
- (nasals, liquids, vowels) are essentially voiced
- voiced occlusive with (平 or 上, 去 or 入)-tone in MC led to low (unaspirated, aspirated) in yue

### glide

- v: appears only after
  - null
  - guttural occlusive
- ȷ: appears only after
  - null
  - dental occlusive
  - nasal

### vowel

|       | front | center | back |
| ----: | :---- | :----- | :--- |
| close | ı y   |        | u    |
|   mid | e ø   | ə      | o    |
|  open |       | a      |      |

### tone

|  平   |  上   |  去   |        入         |
| :---: | :---: | :---: | :---------------: |
|   ◌̀   |   ◌́   |       | ŋ, n, m ↦ k, t, p |

## taiwanese (not implemented)

|           | guttural | dental | dental | labial |
| --------: | :------- | :----- | :----- | :----- |
|    tenuis | k        | t      | c      | p      |
| aspirated | kh       | th     | ch     | ph     |
|    voiced | g        |        | r      | b      |
| fricative | h        |        | s      | f      |
|  sonorant | ŋ        | n      | l      | m      |

|       | front | center | back |
| ----: | :---- | :----- | :--- |
| close | i į   |        | u ų  |
|   mid | e ę   | y      | o ǫ  |
|  open | a ą   |        |      |

|      | 平   | 上   | 去   | 入             |
| ---: | :--- | :--- | :--- | :------------- |
|   陰 | ◌́    | ◌̂    | ◌̀    | ◌̀ (q, k, t, p) |
|   陽 | ◌̌    |      | ◌    | ◌́ (q, k, t, p) |

## references

- https://zh.wikipedia.org/wiki/User:Polyhedron/%E4%B8%AD%E5%8F%A4%E6%BC%A2%E8%AA%9E%E6%8B%BC%E9%9F%B3
- https://en.wikipedia.org/wiki/Cantonese_phonology#Historical_change
- http://www.for.aichi-pu.ac.jp/museum/pdf7/nakamura90.pdf
- http://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/