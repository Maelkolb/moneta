# Numismatic – The Game

A browser game for learning to identify Roman imperial coins, rebuilt from the 2019 pygame project of the same name (repos `muenzbestikmmung2` and `coin_identification_py_to_js`). The village, the mage Gwen, her crystal that senses metal in the ground, the textbox dialogues and the book of emperor portraits are the original game; underneath it now runs on real coin types from [Online Coins of the Roman Empire (OCRE)](https://numismatics.org/ocre/) with specimen photographs from the [American Numismatic Society](https://numismatics.org/collection/).

Play it at https://maelkolb.github.io/moneta/

## How it plays

- **Title and prologue** as in the original: press space, Gwen introduces herself.
- **Village**: a tile map (the original `map.txt` and tiles), walk with arrows or WASD, on-screen pad on touch screens. Talk to Gwen at the statue for the lesson. Coins are hidden in the meadows; the crystal in the corner glows and a ring pulses around you as you come closer. Step on the spot to dig.
- **The tents can be entered.** Each has a room in the same tile style and a resident: the elder Brennus (why the tribe’s goddess is a Roman Juno Moneta, and a quest for a coin of Augustus), the smith Ada (how coins were struck, metals and weights, a denomination test), the trader Marcus (prices and wages in denarii, a metal test) and the seer Vara (why coins end up in the ground: stray losses, offerings, hoards; a reverse-type test; she can tell you where coins lie). Villagers wander outside with hints and lore, and every later site has its own residents with period-specific content: a veteran of the Eleventh Legion, a Carnuntum merchant, a Leptis priest, a widow who buried her hoard in 260, a Trier mint worker, a monk in Constantinople.
- **Identification**: the found coin, both sides, and a record sheet of multiple-choice questions generated from the OCRE record: metal, denomination, ruler, legend abbreviation, reverse type, date, mint. Chapter 1 asks three of these, chapter 7 all seven. Hints cost points; points are experience.
- **The book** (B or Tab, any time, also during identification): emperor portraits four to a page as in the original, denominations, legend glossary, reverse types, a two-page map of the mints with their mint marks, a timeline, and your cabinet with every coin found, linked to OCRE and the ANS.
- **Seven chapters**, each a dig site reached by the path out of the village: the village by the Lech, Vindonissa, Carnuntum, Leptis Magna, Cologne, Trier, Constantinople. 58 rulers, 580 coin types.
- **Practice** from Gwen’s menu: ten quick questions on one skill.
- English and German, progress saved in the browser. Your `town_theme` plays in the village, `battle_theme` during identification. M toggles music.

## Running it

```
npm install
npm run dev
```

`npm test` runs the unit tests (question generation and dataset integrity), `npm run build` type-checks and builds to `dist/`.

## Data pipeline

The dataset is committed (`src/data/coins.json`, `public/coins/*.webp`), so the game runs offline. To rebuild it:

```
npm run data:fetch   # SPARQL queries to nomisma.org, ~10 minutes, writes data/raw/
npm run data:build   # selects 10 types per ruler, downloads and resizes images
npm run data:map     # land outlines for the mint map, from world-atlas
```

`scripts/fetch_ocre.ts` pulls every OCRE type that has an ANS specimen photographed on both sides (about 12,000), with authority, portrait, denomination, material, mint, dates, legends and descriptions, plus English and German labels and mint coordinates. `scripts/build_dataset.ts` picks up to ten types per ruler listed in `src/data/chapters.ts`, favouring variety of denomination, mint and reverse.

Curated content lives in `src/data/`: chapters with story and lessons, rulers with notes, denominations, the legend glossary, personifications and mint marks. The tile maps are in `src/engine/sites.ts`.

## Deploying

`.github/workflows/pages.yml` builds and deploys to GitHub Pages on every push to `main`.

## Credits and licences

- Coin types, legends, descriptions: OCRE, American Numismatic Society, via [nomisma.org](https://nomisma.org/). Types follow *Roman Imperial Coinage*.
- Coin photographs: American Numismatic Society, [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
- Game art and music in `public/assets`: from the 2019 game.
- Land outlines: Natural Earth via `world-atlas` (public domain).
- Code: MIT.
