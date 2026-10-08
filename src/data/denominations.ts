import type { Text } from './types'

export type Denomination = {
  id: string
  name: Text
  metal: 'av' | 'ar' | 'ae'
  period: Text
  value: Text
  size: string
  note: Text
}

export const denominations: Denomination[] = [
  { id: 'aureus', name: { en: 'Aureus', de: 'Aureus' }, metal: 'av', period: { en: '1st c. BC – AD 309', de: '1. Jh. v. Chr. – 309 n. Chr.' }, value: { en: '25 denarii', de: '25 Denare' }, size: '19–20 mm, 7.8 g (Augustus), 7.3 g (Nero)', note: { en: 'The standard gold coin. Soldiers were paid in it; few ever saw one.', de: 'Die Goldmünze schlechthin. Soldaten erhielten damit ihren Sold; die meisten Menschen sahen nie eine.' } },
  { id: 'quinarius_aureus', name: { en: 'Gold quinarius', de: 'Goldquinar' }, metal: 'av', period: { en: 'Augustus – 3rd c.', de: 'Augustus – 3. Jh.' }, value: { en: 'half an aureus', de: 'ein halber Aureus' }, size: '15 mm, 3.6 g', note: { en: 'Rare small gold.', de: 'Seltenes kleines Gold.' } },
  { id: 'solidus', name: { en: 'Solidus', de: 'Solidus' }, metal: 'av', period: { en: 'AD 309 – 11th c.', de: '309 n. Chr. – 11. Jh.' }, value: { en: '72 to the pound', de: '72 aufs Pfund' }, size: '20–21 mm, 4.5 g', note: { en: 'Constantine’s gold coin; the “bezant” of the Middle Ages.', de: 'Konstantins Goldmünze; der „Byzantiner“ des Mittelalters.' } },
  { id: 'tremissis', name: { en: 'Tremissis', de: 'Tremissis' }, metal: 'av', period: { en: 'AD 383 – 8th c.', de: '383 n. Chr. – 8. Jh.' }, value: { en: 'a third of a solidus', de: 'ein Drittel Solidus' }, size: '14 mm, 1.5 g', note: { en: 'Small gold of the late empire, copied by the Germanic kingdoms.', de: 'Kleines Gold des späten Reiches, von den germanischen Königreichen nachgeahmt.' } },
  { id: 'denarius', name: { en: 'Denarius', de: 'Denar' }, metal: 'ar', period: { en: '211 BC – AD 240s', de: '211 v. Chr. – 240er Jahre' }, value: { en: '16 asses, 4 sestertii', de: '16 Asse, 4 Sesterze' }, size: '18–19 mm, 3.9 g (Augustus), 3.4 g (Nero)', note: { en: 'A day’s wage for a labourer. Debased from 95 % silver under Augustus to about 45 % under Severus Alexander.', de: 'Ein Tageslohn für einen Arbeiter. Vom 95-prozentigen Silber des Augustus auf etwa 45 % unter Severus Alexander verschlechtert.' } },
  { id: 'quinarius', name: { en: 'Quinarius', de: 'Quinar' }, metal: 'ar', period: { en: 'Republic – 3rd c.', de: 'Republik – 3. Jh.' }, value: { en: 'half a denarius', de: 'ein halber Denar' }, size: '14 mm, 1.7 g', note: { en: 'Almost always Victory on the reverse.', de: 'Fast immer Victoria auf dem Revers.' } },
  { id: 'cistophorus', name: { en: 'Cistophorus', de: 'Kistophor' }, metal: 'ar', period: { en: 'Augustus – Hadrian', de: 'Augustus – Hadrian' }, value: { en: '3 denarii', de: '3 Denare' }, size: '26 mm, 11 g', note: { en: 'Large silver of the province of Asia, struck at Ephesus and Pergamum.', de: 'Großes Silber der Provinz Asia, geprägt in Ephesos und Pergamon.' } },
  { id: 'antoninianus', name: { en: 'Antoninianus', de: 'Antoninian' }, metal: 'ar', period: { en: 'AD 215 – 294', de: '215 – 294 n. Chr.' }, value: { en: '2 denarii (nominally)', de: '2 Denare (nominell)' }, size: '22 mm, 5 g, later 20 mm, 3 g', note: { en: 'Radiate crown on the emperor, crescent under empresses. Counted as silver in RIC, it started at 50 % silver and ended below 5 %, a bronze coin with a silver wash (billon).', de: 'Strahlenkrone beim Kaiser, Mondsichel bei Kaiserinnen. Im RIC als Silber geführt, begann er mit 50 % Silber und endete unter 5 %, eine Bronzemünze mit Silbersud (Billon).' } },
  { id: 'argenteus', name: { en: 'Argenteus', de: 'Argenteus' }, metal: 'ar', period: { en: 'AD 294 – 310s', de: '294 – 310er Jahre' }, value: { en: '96 to the pound', de: '96 aufs Pfund' }, size: '19 mm, 3.4 g', note: { en: 'Diocletian’s good silver, struck like the old denarius. Scarce.', de: 'Diokletians gutes Silber, geprägt wie der alte Denar. Selten.' } },
  { id: 'siliqua', name: { en: 'Siliqua', de: 'Siliqua' }, metal: 'ar', period: { en: 'AD 324 – 5th c.', de: '324 n. Chr. – 5. Jh.' }, value: { en: '1/24 solidus', de: '1/24 Solidus' }, size: '17 mm, 2 g', note: { en: 'Thin late silver, usually with VOT legends in a wreath. Often clipped.', de: 'Dünnes spätes Silber, meist mit VOT-Legenden im Kranz. Oft beschnitten.' } },
  { id: 'miliarense', name: { en: 'Miliarense', de: 'Miliarense' }, metal: 'ar', period: { en: 'AD 324 – 5th c.', de: '324 n. Chr. – 5. Jh.' }, value: { en: '1/18 solidus', de: '1/18 Solidus' }, size: '23 mm, 4.5 g', note: { en: 'Larger late silver, often ceremonial.', de: 'Größeres spätes Silber, oft zeremoniell.' } },
  { id: 'sestertius', name: { en: 'Sestertius', de: 'Sesterz' }, metal: 'ae', period: { en: 'Augustus – AD 260s', de: 'Augustus – 260er Jahre' }, value: { en: '4 asses, 1/4 denarius', de: '4 Asse, 1/4 Denar' }, size: '33–35 mm, 25 g', note: { en: 'Big brass (orichalcum) coin with S C. The unit of Roman accounting.', de: 'Große Messingmünze (Orichalcum) mit S C. Die Rechnungseinheit der Römer.' } },
  { id: 'dupondius', name: { en: 'Dupondius', de: 'Dupondius' }, metal: 'ae', period: { en: 'Augustus – AD 270s', de: 'Augustus – 270er Jahre' }, value: { en: '2 asses', de: '2 Asse' }, size: '27–28 mm, 12 g', note: { en: 'Brass; from Nero on the emperor wears a radiate crown to distinguish it from the as.', de: 'Messing; ab Nero trägt der Kaiser eine Strahlenkrone zur Unterscheidung vom As.' } },
  { id: 'as', name: { en: 'As', de: 'As' }, metal: 'ae', period: { en: 'Republic – AD 270s', de: 'Republik – 270er Jahre' }, value: { en: '1/16 denarius', de: '1/16 Denar' }, size: '25–27 mm, 11 g', note: { en: 'Copper, reddish when fresh. Laureate or bare head. The small change of daily life.', de: 'Kupfer, frisch rötlich. Lorbeer- oder barhäuptiger Kopf. Das Kleingeld des Alltags.' } },
  { id: 'semis', name: { en: 'Semis', de: 'Semis' }, metal: 'ae', period: { en: 'Augustus – Hadrian', de: 'Augustus – Hadrian' }, value: { en: 'half an as', de: 'ein halbes As' }, size: '18 mm, 4 g', note: { en: 'Small brass.', de: 'Kleines Messing.' } },
  { id: 'quadrans', name: { en: 'Quadrans', de: 'Quadrans' }, metal: 'ae', period: { en: 'Augustus – Antoninus Pius', de: 'Augustus – Antoninus Pius' }, value: { en: 'a quarter as', de: 'ein Viertel As' }, size: '15 mm, 3 g', note: { en: 'The smallest coin; the price of a bath.', de: 'Die kleinste Münze; der Preis eines Badbesuchs.' } },
  { id: 'nummus', name: { en: 'Nummus (follis)', de: 'Nummus (Follis)' }, metal: 'ae', period: { en: 'AD 294 – 340s', de: '294 – 340er Jahre' }, value: { en: 'reform coin of Diocletian', de: 'Reformmünze Diokletians' }, size: '27 mm, 10 g, shrinking to 17 mm, 2 g', note: { en: 'Silvered bronze with mint mark. GENIO POPVLI ROMANI, later Sol, camp gates, soldiers. RIC and OCRE list these by size as AE1 to AE3.', de: 'Versilberte Bronze mit Münzzeichen. GENIO POPVLI ROMANI, später Sol, Lagertore, Soldaten. RIC und OCRE führen sie nach Größe als AE1 bis AE3.' } },
  { id: 'ae1', name: { en: 'AE1', de: 'AE1' }, metal: 'ae', period: { en: 'AD 348 – 5th c.', de: '348 n. Chr. – 5. Jh.' }, value: { en: 'modern size class', de: 'moderne Größenklasse' }, size: 'over 25 mm', note: { en: 'Largest late bronze: Magnentius, Julian’s bull, Gratian.', de: 'Größte späte Bronze: Magnentius, Julians Stier, Gratian.' } },
  { id: 'ae2', name: { en: 'AE2', de: 'AE2' }, metal: 'ae', period: { en: 'AD 348 – 5th c.', de: '348 n. Chr. – 5. Jh.' }, value: { en: 'modern size class', de: 'moderne Größenklasse' }, size: '21–25 mm', note: { en: 'FEL TEMP REPARATIO falling horseman, GLORIA ROMANORVM.', de: 'FEL TEMP REPARATIO fallender Reiter, GLORIA ROMANORVM.' } },
  { id: 'ae3', name: { en: 'AE3', de: 'AE3' }, metal: 'ae', period: { en: 'AD 330 – 5th c.', de: '330 n. Chr. – 5. Jh.' }, value: { en: 'modern size class', de: 'moderne Größenklasse' }, size: '17–21 mm', note: { en: 'The commonest late Roman coin: GLORIA EXERCITVS, SECVRITAS REIPVBLICAE.', de: 'Die häufigste spätrömische Münze: GLORIA EXERCITVS, SECVRITAS REIPVBLICAE.' } },
  { id: 'ae4', name: { en: 'AE4', de: 'AE4' }, metal: 'ae', period: { en: 'AD 383 – 5th c.', de: '383 n. Chr. – 5. Jh.' }, value: { en: 'modern size class', de: 'moderne Größenklasse' }, size: 'under 17 mm', note: { en: 'Tiny; VICTORIA AVGGG, SALVS REIPVBLICAE. The last Roman coins in the west.', de: 'Winzig; VICTORIA AVGGG, SALVS REIPVBLICAE. Die letzten römischen Münzen im Westen.' } },
]

export const materialNames: Record<string, Text> = {
  av: { en: 'Gold', de: 'Gold' },
  ar: { en: 'Silver', de: 'Silber' },
  ae: { en: 'Bronze', de: 'Bronze' },
}

export const materialNote: Record<string, Text> = {
  av: { en: 'Yellow, heavy, never corrodes. Found as bright as the day it was lost.', de: 'Gelb, schwer, korrodiert nie. Wird so blank gefunden, wie es verloren ging.' },
  ar: { en: 'Grey-white; tarnishes dark. Tiny flan cracks from striking are common.', de: 'Grauweiß; läuft dunkel an. Kleine Schrötlingsrisse vom Prägen sind häufig.' },
  ae: { en: 'Copper or brass; green, brown or black patina after centuries in the soil.', de: 'Kupfer oder Messing; grüne, braune oder schwarze Patina nach Jahrhunderten im Boden.' },
}
