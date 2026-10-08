# Moneta

A browser game for learning to identify Roman imperial coins. You play a stranger who arrives at the village of Gwen, a mage whose tribe senses metal in the ground. She teaches you to find coins and, more importantly, to read them: metal, denomination, portrait, legend, reverse, date and mint.

Every coin in the game is a real type from [Online Coins of the Roman Empire (OCRE)](https://numismatics.org/ocre/), shown with a real specimen photographed by the [American Numismatic Society](https://numismatics.org/collection/). Every identified coin links back to its OCRE record.

Moneta is the rebuild of a 2019 pygame project (“Numismatic – The Game”, repos `muenzbestikmmung2` and `coin_identification_py_to_js`). The story, the mentor Gwen, the crystal that detects metal and the book of emperor portraits come from there; everything else is new.

## The game

- **Seven chapters**, each a dig site and a period: Julio-Claudians (village by the Lech), Four Emperors and Flavians (Vindonissa), Adoptive Emperors (Carnuntum), Severans (Leptis Magna), Crisis of the Third Century (Cologne), Tetrarchy and Constantine (Trier), Late Empire (Constantinople). 58 rulers, 580 coin types.
- **Lessons** by Gwen introduce one identification skill per chapter. The record sheet grows with the skills: chapter 1 asks for metal, denomination and ruler; chapter 7 asks for all seven.
- **Dig**: a tile field, a crystal whose glow and hum rise near buried metal, a daylight budget, junk finds (sherds, nails, fibulae).
- **Clean**: rub the soil off the found coin.
- **Identify**: a record sheet with multiple-choice questions generated from the OCRE data. Hints cost points. Correct answers give experience; experience gives ranks from Stranger to Master of the Mint.
- **Codex**: ruler portraits by dynasty, denominations with the value chain, a glossary of legend abbreviations, personifications on reverses, a map of mints with their mint marks, a timeline.
- **Cabinet**: everything you found, with full records and links to OCRE and the ANS; your accuracy per skill.
- **Practice**: ten quick questions on one skill, drawn from unlocked chapters.
- English and German. Progress is saved in the browser.

## Running it

```
npm install
npm run dev
```

`npm test` runs the unit tests (question generation, dig logic, dataset integrity). `npm run build` type-checks and builds to `dist/`.

## Data pipeline

The coin dataset is committed (`src/data/coins.json` and `public/coins/*.webp`), so the game runs without network access. To rebuild it:

```
npm run data:fetch   # SPARQL queries to nomisma.org, ~10 minutes, writes data/raw/
npm run data:build   # selects 10 types per ruler, downloads and resizes images
npm run data:map     # land outlines for the mint map, from world-atlas
```

`scripts/fetch_ocre.ts` pulls every OCRE type that has an ANS specimen with both sides photographed (about 12,000 types), with authority, portrait, denomination, material, mint, dates, legends and descriptions, plus labels in English and German and mint coordinates. `scripts/build_dataset.ts` picks up to ten types per ruler listed in `src/data/chapters.ts`, favouring variety of denomination, mint and reverse, and converts the images to 320 px WebP.

The curated content lives in `src/data/`: chapters with story and lessons, rulers with notes, denominations, the legend glossary, personifications and mint marks.

## Deploying

The workflow in `.github/workflows/pages.yml` builds and deploys to GitHub Pages on every push to `main`. Enable Pages with the “GitHub Actions” source in the repository settings. The build uses `MONETA_BASE=/<repo-name>/` as the base path.

## Credits and licences

- Coin types, legends, descriptions: OCRE, American Numismatic Society, via [nomisma.org](https://nomisma.org/). Types follow *Roman Imperial Coinage*.
- Coin photographs: American Numismatic Society, [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
- Land outlines: Natural Earth via `world-atlas` (public domain).
- Typefaces: Cinzel and Crimson Pro (SIL Open Font License), loaded from Google Fonts.
- Code: MIT.
