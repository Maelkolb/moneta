import type { Text } from './types'

export type MintMark = {
  mint: string
  marks: string[]
  modern: Text
  active: string
}

export const mintMarks: MintMark[] = [
  { mint: 'londinium', marks: ['LON', 'PLN', 'PLON', 'AVG'], modern: { en: 'London', de: 'London' }, active: '296–325, 383–388' },
  { mint: 'treveri', marks: ['TR', 'PTR', 'STR', 'TRP', 'TRS', 'SMTR', 'TRE'], modern: { en: 'Trier', de: 'Trier' }, active: '293–430' },
  { mint: 'lugdunum', marks: ['LG', 'PLG', 'SLG', 'LVG', 'LVGP'], modern: { en: 'Lyon', de: 'Lyon' }, active: '274–423' },
  { mint: 'arelate', marks: ['ARL', 'PARL', 'CON', 'CONST', 'KONSTAN'], modern: { en: 'Arles', de: 'Arles' }, active: '313–476' },
  { mint: 'ticinum', marks: ['T', 'PT', 'ST', 'TT', 'QT'], modern: { en: 'Pavia', de: 'Pavia' }, active: '274–326' },
  { mint: 'mediolanum', marks: ['MD', 'MED', 'MDPS', 'COMOB (gold)'], modern: { en: 'Milan', de: 'Mailand' }, active: '259–274, 364–476' },
  { mint: 'aquileia', marks: ['AQ', 'AQP', 'AQS', 'SMAQ'], modern: { en: 'Aquileia', de: 'Aquileia' }, active: '294–425' },
  { mint: 'roma', marks: ['R', 'RP', 'RS', 'RT', 'RQ', 'SMR', 'RM'], modern: { en: 'Rome', de: 'Rom' }, active: '294–476 (mint marks)' },
  { mint: 'ostia', marks: ['MOST', 'POST'], modern: { en: 'Ostia', de: 'Ostia' }, active: '308–313' },
  { mint: 'carthago', marks: ['PK', 'SK', 'TK', 'KART'], modern: { en: 'Carthage', de: 'Karthago' }, active: '296–311' },
  { mint: 'siscia', marks: ['SIS', 'SISC', 'ASIS', 'BSIS', 'ΓSIS'], modern: { en: 'Sisak', de: 'Sisak' }, active: '262–387' },
  { mint: 'sirmium', marks: ['SIRM', 'ASIRM'], modern: { en: 'Sremska Mitrovica', de: 'Sremska Mitrovica' }, active: '320–326, 351–364' },
  { mint: 'serdica', marks: ['SD', 'SERD', 'SMSD'], modern: { en: 'Sofia', de: 'Sofia' }, active: '303–308, 313–314' },
  { mint: 'thessalonica', marks: ['TS', 'TES', 'SMTS', 'TESA', 'THES'], modern: { en: 'Thessaloniki', de: 'Thessaloniki' }, active: '298–5th c.' },
  { mint: 'heraclea', marks: ['HT', 'HTA', 'SMH', 'SMHA', 'MHT'], modern: { en: 'Marmara Ereğlisi', de: 'Marmara Ereğlisi' }, active: '291–5th c.' },
  { mint: 'constantinopolis', marks: ['CON', 'CONS', 'CONSA', 'CONOB (gold)'], modern: { en: 'Istanbul', de: 'Istanbul' }, active: '326–1453' },
  { mint: 'nicomedia', marks: ['N', 'NIC', 'SMN', 'SMNA', 'MNA'], modern: { en: 'İzmit', de: 'İzmit' }, active: '294–5th c.' },
  { mint: 'cyzicus', marks: ['K', 'KA', 'CVZ', 'SMK', 'SMKA', 'MKV'], modern: { en: 'Erdek', de: 'Erdek' }, active: '260–5th c.' },
  { mint: 'antiochia_syria', marks: ['ANT', 'ANTA', 'SMAN', 'SMANT', 'ANB'], modern: { en: 'Antakya', de: 'Antakya' }, active: '217–5th c.' },
  { mint: 'alexandria', marks: ['ALE', 'SMAL', 'SMALA', 'ALEA'], modern: { en: 'Alexandria', de: 'Alexandria' }, active: '294–5th c.' },
  { mint: 'colonia_claudia_ara_agrippinensium', marks: ['(none, by style)'], modern: { en: 'Cologne', de: 'Köln' }, active: '257–274' },
  { mint: 'ravenna', marks: ['RV', 'RVPS', 'COMOB (gold)'], modern: { en: 'Ravenna', de: 'Ravenna' }, active: '402–476' },
]

export const mintMarkById = Object.fromEntries(mintMarks.map((m) => [m.mint, m]))
