import { data } from '../data'
import { go, lang, save, t, update } from '../state'

export function About() {
  const l = lang.value
  const de = l === 'de'
  return (
    <div class="panel credits">
      <h2>{t('about')}</h2>
      <p>
        {de
          ? 'Moneta ist ein Lernspiel zur Bestimmung römischer Münzen. Es basiert auf einem Python-Spiel von 2019 („Numismatic – The Game“) und wurde 2026 für den Browser neu gebaut.'
          : 'Moneta is an educational game about identifying Roman coins. It grew out of a Python game from 2019 (“Numismatic – The Game”) and was rebuilt for the browser in 2026.'}
      </p>
      <h3 style="margin-top:20px">{t('credits')}</h3>
      <p>
        {de ? 'Münztypen, Legenden und Beschreibungen: ' : 'Coin types, legends and descriptions: '}
        <a href="https://numismatics.org/ocre/" target="_blank" rel="noopener">
          Online Coins of the Roman Empire (OCRE)
        </a>
        , American Numismatic Society, {de ? 'über die Linked-Data-Schnittstelle von' : 'via the linked-data endpoint of'}{' '}
        <a href="https://nomisma.org/" target="_blank" rel="noopener">
          nomisma.org
        </a>
        . {de ? 'Die Typen folgen' : 'Types follow'} <i>Roman Imperial Coinage</i> (RIC).
      </p>
      <p>
        {de ? 'Münzfotos: ' : 'Coin photographs: '}
        <a href="https://numismatics.org/collection/" target="_blank" rel="noopener">
          American Numismatic Society
        </a>
        , {de ? 'Lizenz' : 'licensed'}{' '}
        <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">
          CC BY-NC 4.0
        </a>
        . {de ? `${data.coins.length} Typen mit je einem Exemplar; jede Münze verlinkt auf ihren Datensatz.` : `${data.coins.length} types, one specimen each; every coin links to its record.`}
      </p>
      <p>
        {de ? 'Landumrisse: Natural Earth (gemeinfrei). Schriften: Cinzel und Crimson Pro (SIL Open Font License).' : 'Land outlines: Natural Earth (public domain). Typefaces: Cinzel and Crimson Pro (SIL Open Font License).'}
      </p>
      <p>
        {de
          ? 'Die Texte zu Kaisern, Nominalen und Legenden sind eine Einführung, keine Fachpublikation. Für die wissenschaftliche Bestimmung gilt OCRE.'
          : 'The texts on emperors, denominations and legends are an introduction, not a reference work. For scholarly identification, OCRE is the authority.'}
      </p>
      <h3 style="margin-top:20px">{t('sound')}</h3>
      <p>
        <button class="btn" onClick={() => update({ sound: !save.value.sound })}>
          {t('sound')}: {save.value.sound ? t('on') : t('off')}
        </button>
      </p>
      <div class="row" style="margin-top:20px">
        <button class="btn" onClick={() => go({ name: 'title' })}>
          {t('back')}
        </button>
      </div>
    </div>
  )
}
