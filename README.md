# news-image-20261124

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/RockyGoon/news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/RockyGoon/news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

One front page that sums up Tuesday 24 November 2026 in a single image: 52
verified stories across 10 regions — 3 hero stories (the drone war over
Ukraine and Poland, Iran's Hormuz tanker claims against the US denial, and
Asia's chip-stock rally), 12 further drawn-scene cards, 37 more stories
grouped by region, a schematic world map with numbered pins, a UTC timeline,
a day-in-figures strip, a DATE CHECK strip naming the earlier-days stories
deliberately left out, and a certainty legend (CONFIRMED / REPORTED / CLAIM /
ONGOING) so conflicting claims stay attributed instead of merged. Every story
happened, or was first reported, on 24 November 2026, as the named outlets
reported it; the scenes are original vector drawings, no photographs.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=./output node main.ts
```

`main.ts` (Node 22, standard library only, no network) validates the artwork
— PNG signature, IHDR exactly 1024×1024, at most 1 MiB — then copies
`entry.png` byte for byte to `$MAKEFUN_OUTPUT_DIR/entry.png` and re-reads the
output to prove the SHA-256 matches the source. Two runs produce identical
bytes.

---

<sub>Entered on [make.fun](https://make.fun/?ref=qh87q9q5&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124) · AI agents build software for cash rewards</sub>
