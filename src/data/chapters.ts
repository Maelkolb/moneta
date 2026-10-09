import type { Text } from './types'

export type Ruler = {
  id: string
  name: Text
  reign: string
  note: Text
}

export type Skill = 'metal' | 'denomination' | 'ruler' | 'legend' | 'reverse' | 'date' | 'mint'

export type Chapter = {
  number: number
  id: string
  title: Text
  period: Text
  site: Text
  siteNote: Text
  terrain: 'meadow' | 'camp' | 'river' | 'desert' | 'forest' | 'city' | 'coast'
  rulers: Ruler[]
  skills: Skill[]
  coinsToFind: number
  intro: Text[]
  lesson: Text[]
  outro: Text[]
}

export const chapters: Chapter[] = [
  {
    number: 1,
    id: 'julio-claudians',
    title: { en: 'The Julio-Claudians', de: 'Die Julisch-Claudier' },
    period: { en: '27 BC – AD 68', de: '27 v. Chr. – 68 n. Chr.' },
    site: { en: 'The village by the Lech', de: 'Das Dorf am Lech' },
    siteNote: {
      en: 'Gwen’s village lies in the foothills of Raetia, where the Roman road from Augusta Vindelicum crossed the river.',
      de: 'Gwens Dorf liegt im Alpenvorland Raetiens, wo die Römerstraße von Augusta Vindelicum den Fluss überquerte.',
    },
    terrain: 'meadow',
    coinsToFind: 6,
    skills: ['metal', 'denomination', 'ruler'],
    rulers: [
      { id: 'augustus', name: { en: 'Augustus', de: 'Augustus' }, reign: '27 BC – AD 14', note: { en: 'First emperor. Youthful, idealised portrait that never ages.', de: 'Erster Kaiser. Jugendliches, idealisiertes Porträt, das nie altert.' } },
      { id: 'tiberius', name: { en: 'Tiberius', de: 'Tiberius' }, reign: 'AD 14 – 37', note: { en: 'Stern profile; almost all his silver shows Livia as Pax (the “Tribute Penny”).', de: 'Strenges Profil; fast sein ganzes Silber zeigt Livia als Pax (der „Zinsgroschen“).' } },
      { id: 'gaius', name: { en: 'Caligula', de: 'Caligula' }, reign: 'AD 37 – 41', note: { en: 'Gaius; high forehead and receding hair. Rare in precious metal.', de: 'Gaius; hohe Stirn und zurückweichendes Haar. Selten in Edelmetall.' } },
      { id: 'claudius', name: { en: 'Claudius', de: 'Claudius' }, reign: 'AD 41 – 54', note: { en: 'Heavy neck, small mouth. Many base-metal issues.', de: 'Kräftiger Hals, kleiner Mund. Viele Bronzeprägungen.' } },
      { id: 'nero', name: { en: 'Nero', de: 'Nero' }, reign: 'AD 54 – 68', note: { en: 'Ages visibly: slim youth, then a fleshy, bearded chin. Reformed the weight of gold and silver in AD 64.', de: 'Altert sichtbar: schlanker Jüngling, dann fleischiges Kinn mit Backenbart. Reformierte 64 n. Chr. das Gewicht von Gold und Silber.' } },
    ],
    intro: [
      { en: 'Stranger, you really came. How wonderful. Welcome to our village.', de: 'Fremder, du bist tatsächlich hier. Wie schön. Willkommen in unserem Dorf.' },
      { en: 'Are you ready to learn more about Roman coins, their culture and their history?', de: 'Bist du bereit, mehr über römische Münzen, ihre Kultur und Geschichte zu lernen?' },
      { en: 'Wonderful! Before I can pass my gift of finding coins on to you, you must prove that you mean it and do not shy away from work.', de: 'Wunderbar! Bevor ich meine Gabe, Münzen zu finden, an dich weitergeben kann, musst du mir beweisen, dass du es ernst meinst und nicht vor Arbeit zurückschreckst.' },
    ],
    lesson: [
      { en: 'Once found, coins must be identified. Take a look at this specimen.', de: 'Nach dem Finden müssen Münzen bestimmt werden! Sieh dir einmal dieses Exemplar an!' },
      { en: 'The first question to ask when identifying a coin is what material it is made of. Roman coins fall into three metals: gold, silver and bronze.', de: 'Die erste Frage, die du dir bei der Bestimmung einer Münze stellen solltest, ist die nach dem verwendeten Material. Grundsätzlich lassen sich römische Münzen in drei Metalle gliedern: Gold, Silber und Bronze.' },
      { en: 'This coin, for instance, is gold. A more precise definition than the metal is the face value, the denomination. This one is an aureus.', de: 'Die Münze hier besteht beispielsweise aus Gold. Eine genauere Definition des Materials einer Münze ist ihr Nennwert, das sogenannte Nominal. In diesem Fall handelt es sich um einen Aureus.' },
      { en: 'But do not worry, you need not memorise every denomination. You will find an overview of the most important ones in this book. Press B to read it at any time on your journey.', de: 'Aber keine Sorge, du musst dir nicht alle Nominale merken. Eine Übersicht der wichtigsten findest du in diesem Buch. Drücke B, um jederzeit auf deiner Reise darin zu lesen.' },
      { en: 'Next you must understand how a coin is built. Let us start with the front, the obverse. From 31 BC on, the Roman emperors immortalised themselves with their portrait on the coins.', de: 'Als Nächstes gilt es, den Aufbau von Münzen zu verstehen. Beginnen wir mit der Vorderseite, auch Avers genannt. Ab dem Jahre 31 v. Chr. verewigten sich die römischen Kaiser mit ihrem Porträt auf den Münzen.' },
      { en: 'So you can roughly date a coin if you can identify the emperor of the portrait. A list of many Roman rulers and their portraits is in the book as well.', de: 'Somit kannst du die Münzen grob datieren, wenn du den Kaiser des Porträts identifizieren kannst. Eine Liste mit vielen römischen Herrschern und ihren Porträts findest du ebenfalls im Buch.' },
      { en: 'Stranger, take this magic crystal. It comes from our goddess and shows you metal in the ground. It glows the closer you come. I have hidden many coins in our village.', de: 'Fremder, nimm diesen magischen Kristall an dich. Er stammt von unserer Göttin und zeigt dir Metall im Boden an. Je näher du kommst, desto heller leuchtet er. Ich habe viele Münzen in unserem Dorf versteckt.' },
      { en: 'Once you have found and identified six coins, we continue your training. Good luck, stranger!', de: 'Wenn du sechs Münzen gefunden und bestimmt hast, fahren wir mit unserem Training fort! Viel Erfolg, Fremder!' },
    ],
    outro: [
      { en: 'You read gold, silver and bronze like a book now. The Julio-Claudian line ended with Nero in AD 68; what followed was a year of war.', de: 'Gold, Silber und Bronze liest du nun wie ein Buch. Die julisch-claudische Linie endete 68 n. Chr. mit Nero; was folgte, war ein Jahr des Krieges.' },
      { en: 'Pack your things. We travel west, to the legionary camp at Vindonissa.', de: 'Pack deine Sachen. Wir reisen nach Westen, zum Legionslager Vindonissa.' },
    ],
  },
  {
    number: 2,
    id: 'flavians',
    title: { en: 'Four Emperors and the Flavians', de: 'Vierkaiserjahr und Flavier' },
    period: { en: 'AD 68 – 96', de: '68 – 96 n. Chr.' },
    site: { en: 'Vindonissa legionary camp', de: 'Legionslager Vindonissa' },
    siteNote: {
      en: 'The camp of Legio XI Claudia on the Aare, abandoned around AD 101. Its rubbish dump preserved thousands of coins.',
      de: 'Das Lager der Legio XI Claudia an der Aare, um 101 n. Chr. aufgegeben. Sein Schutthügel bewahrte Tausende Münzen.',
    },
    terrain: 'camp',
    coinsToFind: 7,
    skills: ['metal', 'denomination', 'ruler', 'legend'],
    rulers: [
      { id: 'galba', name: { en: 'Galba', de: 'Galba' }, reign: 'AD 68 – 69', note: { en: 'Old, bald, hooked nose. Seven months of rule.', de: 'Alt, kahl, Hakennase. Sieben Monate Herrschaft.' } },
      { id: 'otho', name: { en: 'Otho', de: 'Otho' }, reign: 'AD 69', note: { en: 'Smooth wig-like hair. Only gold and silver, no Roman bronze.', de: 'Glattes, perückenartiges Haar. Nur Gold und Silber, keine stadtrömische Bronze.' } },
      { id: 'vitellius', name: { en: 'Vitellius', de: 'Vitellius' }, reign: 'AD 69', note: { en: 'Fleshy face, double chin.', de: 'Fleischiges Gesicht, Doppelkinn.' } },
      { id: 'vespasian', name: { en: 'Vespasian', de: 'Vespasian' }, reign: 'AD 69 – 79', note: { en: 'Founder of the Flavian dynasty. Lined, realistic face. IVDAEA CAPTA coinage.', de: 'Gründer der flavischen Dynastie. Faltiges, realistisches Gesicht. IVDAEA-CAPTA-Prägungen.' } },
      { id: 'titus', name: { en: 'Titus', de: 'Titus' }, reign: 'AD 79 – 81', note: { en: 'Looks like his father, but younger. Opened the Colosseum.', de: 'Sieht aus wie sein Vater, nur jünger. Eröffnete das Kolosseum.' } },
      { id: 'domitian', name: { en: 'Domitian', de: 'Domitian' }, reign: 'AD 81 – 96', note: { en: 'Long neck, prominent nose. Minerva on almost every denarius reverse.', de: 'Langer Hals, markante Nase. Minerva auf fast jedem Denar-Revers.' } },
    ],
    intro: [
      { en: 'Vindonissa. Here a legion lived, and soldiers lose coins: on the training ground, in the baths, in the latrines.', de: 'Vindonissa. Hier lebte eine Legion, und Soldaten verlieren Münzen: auf dem Exerzierplatz, im Bad, in der Latrine.' },
      { en: 'After Nero’s death four men wore the purple in a single year. Then Vespasian, the general from Judaea, founded a new house: the Flavians.', de: 'Nach Neros Tod trugen vier Männer in einem einzigen Jahr den Purpur. Dann gründete Vespasian, der Feldherr aus Judäa, ein neues Haus: die Flavier.' },
    ],
    lesson: [
      { en: 'Now we learn to read the legend. The words round the portrait are the emperor’s titles, heavily abbreviated.', de: 'Jetzt lernen wir, die Legende zu lesen. Die Worte um das Porträt sind die Titel des Kaisers, stark abgekürzt.' },
      { en: 'IMP is Imperator, CAES is Caesar, AVG is Augustus. P M is Pontifex Maximus, the chief priest. P P is Pater Patriae, father of the fatherland.', de: 'IMP heißt Imperator, CAES Caesar, AVG Augustus. P M ist Pontifex Maximus, der Oberpriester. P P ist Pater Patriae, Vater des Vaterlandes.' },
      { en: 'Two titles carry numbers: TR P, the tribunician power, renewed every year, and COS, the consulship. TR P VIII COS III means the eighth year of tribunician power, third consulship. With them you can date a coin to the year.', de: 'Zwei Titel tragen Zahlen: TR P, die tribunizische Gewalt, jährlich erneuert, und COS, der Konsulat. TR P VIII COS III heißt achtes Jahr der tribunizischen Gewalt, dritter Konsulat. Damit datierst du eine Münze aufs Jahr.' },
      { en: 'Letters are written in capitals, V stands for U, and words run together. Read slowly, and the Codex glossary will help.', de: 'Alles in Großbuchstaben, V steht für U, und die Wörter laufen ineinander. Lies langsam, das Glossar im Codex hilft.' },
    ],
    outro: [
      { en: 'Domitian was murdered in 96, and the Senate chose an old man, Nerva, who adopted a general. The age of the adoptive emperors begins.', de: 'Domitian wurde 96 ermordet, und der Senat wählte einen alten Mann, Nerva, der einen Feldherrn adoptierte. Das Zeitalter der Adoptivkaiser beginnt.' },
    ],
  },
  {
    number: 3,
    id: 'adoptive',
    title: { en: 'The Adoptive Emperors', de: 'Die Adoptivkaiser' },
    period: { en: 'AD 96 – 192', de: '96 – 192 n. Chr.' },
    site: { en: 'Carnuntum on the Danube', de: 'Carnuntum an der Donau' },
    siteNote: {
      en: 'Legionary fortress and provincial capital of Pannonia. Marcus Aurelius wrote part of his Meditations here during the Marcomannic Wars.',
      de: 'Legionslager und Hauptstadt Pannoniens. Mark Aurel schrieb hier während der Markomannenkriege an seinen Selbstbetrachtungen.',
    },
    terrain: 'river',
    coinsToFind: 8,
    skills: ['metal', 'denomination', 'ruler', 'legend', 'reverse'],
    rulers: [
      { id: 'nerva', name: { en: 'Nerva', de: 'Nerva' }, reign: 'AD 96 – 98', note: { en: 'Aquiline nose, thin face. Sixteen months.', de: 'Adlernase, hageres Gesicht. Sechzehn Monate.' } },
      { id: 'trajan', name: { en: 'Trajan', de: 'Trajan' }, reign: 'AD 98 – 117', note: { en: 'Straight fringe over the forehead. Dacian conquest; the empire at its largest.', de: 'Gerader Pony über der Stirn. Eroberung Dakiens; das Reich in größter Ausdehnung.' } },
      { id: 'hadrian', name: { en: 'Hadrian', de: 'Hadrian' }, reign: 'AD 117 – 138', note: { en: 'First emperor with a full beard. The “travel series” names the provinces he visited.', de: 'Erster Kaiser mit Vollbart. Die „Reiseserie“ nennt die Provinzen, die er besuchte.' } },
      { id: 'antoninus_pius', name: { en: 'Antoninus Pius', de: 'Antoninus Pius' }, reign: 'AD 138 – 161', note: { en: 'Calm bearded face. Long and peaceful reign; the most common Antonine coins.', de: 'Ruhiges bärtiges Gesicht. Lange Friedenszeit; die häufigsten antoninischen Münzen.' } },
      { id: 'marcus_aurelius', name: { en: 'Marcus Aurelius', de: 'Mark Aurel' }, reign: 'AD 161 – 180', note: { en: 'Curly hair and beard, the philosopher. Coins as Caesar show him young and beardless.', de: 'Lockiges Haar, Bart, der Philosoph. Als Caesar noch jung und bartlos.' } },
      { id: 'lucius_verus', name: { en: 'Lucius Verus', de: 'Lucius Verus' }, reign: 'AD 161 – 169', note: { en: 'Co-emperor with Marcus. Very curly, rather flat beard.', de: 'Mitkaiser des Marcus. Sehr lockig, eher flacher Bart.' } },
      { id: 'commodus', name: { en: 'Commodus', de: 'Commodus' }, reign: 'AD 180 – 192', note: { en: 'Marcus’ son. Late coins show him as Hercules with the lion skin.', de: 'Sohn des Marcus. Späte Münzen zeigen ihn als Hercules mit Löwenfell.' } },
    ],
    intro: [
      { en: 'The Danube. On the far bank the barbarian lands; on this side, the fortress of Carnuntum.', de: 'Die Donau. Am anderen Ufer das Barbaricum; diesseits das Lager Carnuntum.' },
      { en: 'For a hundred years each emperor adopted the best man as his successor. Historians call it the golden age of Rome.', de: 'Hundert Jahre lang adoptierte jeder Kaiser den Besten als Nachfolger. Historiker nennen es das goldene Zeitalter Roms.' },
    ],
    lesson: [
      { en: 'Turn the coin over. The reverse is the government’s message board: a god, a virtue, a victory, a building.', de: 'Dreh die Münze um. Der Revers ist die Botschaftstafel der Regierung: ein Gott, eine Tugend, ein Sieg, ein Bauwerk.' },
      { en: 'Virtues appear as women, the personifications: Pax with a branch, Victoria with wings, Fortuna with a rudder, Annona with corn ears, Salus feeding a snake.', de: 'Tugenden erscheinen als Frauen, die Personifikationen: Pax mit Zweig, Victoria mit Flügeln, Fortuna mit Steuerruder, Annona mit Ähren, Salus, die eine Schlange füttert.' },
      { en: 'The reverse legend names the figure or continues the titles. On bronze you will see the big letters S C, senatus consulto: struck by decree of the Senate.', de: 'Die Reverslegende benennt die Figur oder setzt die Titel fort. Auf Bronze siehst du die großen Buchstaben S C, senatus consulto: geprägt auf Beschluss des Senats.' },
      { en: 'From now on, describe the reverse too. Match the picture with the description in the Codex.', de: 'Ab jetzt beschreibst du auch den Revers. Ordne das Bild der Beschreibung im Codex zu.' },
    ],
    outro: [
      { en: 'Commodus was strangled on the last night of 192. Five men fought for the throne; the winner came from Africa.', de: 'Commodus wurde in der letzten Nacht des Jahres 192 erdrosselt. Fünf Männer kämpften um den Thron; der Sieger kam aus Afrika.' },
    ],
  },
  {
    number: 4,
    id: 'severans',
    title: { en: 'The Severans', de: 'Die Severer' },
    period: { en: 'AD 193 – 235', de: '193 – 235 n. Chr.' },
    site: { en: 'Leptis Magna', de: 'Leptis Magna' },
    siteNote: {
      en: 'Birthplace of Septimius Severus on the Libyan coast, lavishly rebuilt by its son.',
      de: 'Geburtsort des Septimius Severus an der libyschen Küste, von ihrem Sohn prächtig ausgebaut.',
    },
    terrain: 'desert',
    coinsToFind: 8,
    skills: ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date'],
    rulers: [
      { id: 'pertinax', name: { en: 'Pertinax', de: 'Pertinax' }, reign: 'AD 193', note: { en: 'Eighty-seven days. Long beard, old face.', de: 'Siebenundachtzig Tage. Langer Bart, altes Gesicht.' } },
      { id: 'septimius_severus', name: { en: 'Septimius Severus', de: 'Septimius Severus' }, reign: 'AD 193 – 211', note: { en: 'Forked beard, corkscrew curls on the forehead. Mints at Rome, Laodicea and Emesa.', de: 'Gegabelter Bart, Korkenzieherlocken über der Stirn. Münzstätten Rom, Laodicea und Emesa.' } },
      { id: 'julia_domna', name: { en: 'Julia Domna', de: 'Julia Domna' }, reign: 'AD 193 – 217', note: { en: 'Wife of Severus. Hair in rigid waves to a bun at the neck. Many Rome denarii.', de: 'Frau des Severus. Haar in strengen Wellen zum Nackenknoten. Viele Denare aus Rom.' } },
      { id: 'caracalla', name: { en: 'Caracalla', de: 'Caracalla' }, reign: 'AD 198 – 217', note: { en: 'Scowling, short beard. Introduced the antoninianus, a double denarius, in 215.', de: 'Finsterer Blick, kurzer Bart. Führte 215 den Antoninian ein, einen Doppeldenar.' } },
      { id: 'geta', name: { en: 'Geta', de: 'Geta' }, reign: 'AD 209 – 211', note: { en: 'Caracalla’s brother, murdered by him. Boyish portrait.', de: 'Caracallas Bruder, von ihm ermordet. Knabenhaftes Porträt.' } },
      { id: 'macrinus', name: { en: 'Macrinus', de: 'Macrinus' }, reign: 'AD 217 – 218', note: { en: 'First emperor who was not a senator. Short or long beard, two portrait styles.', de: 'Erster Kaiser, der kein Senator war. Kurz- oder Langbart, zwei Porträtstile.' } },
      { id: 'elagabalus', name: { en: 'Elagabalus', de: 'Elagabal' }, reign: 'AD 218 – 222', note: { en: 'Teenage priest of the Syrian sun god; a “horn” on later portraits.', de: 'Jugendlicher Priester des syrischen Sonnengottes; ein „Horn“ auf späteren Porträts.' } },
      { id: 'severus_alexander', name: { en: 'Severus Alexander', de: 'Severus Alexander' }, reign: 'AD 222 – 235', note: { en: 'Boy emperor who ages on the coins. Last of the Severans.', de: 'Knabenkaiser, der auf den Münzen altert. Letzter Severer.' } },
    ],
    intro: [
      { en: 'Sand and marble. Leptis Magna, where Septimius Severus was born and which he turned into a showcase.', de: 'Sand und Marmor. Leptis Magna, wo Septimius Severus geboren wurde und das er zur Prachtstadt machte.' },
      { en: 'The Severans ruled as a family: father, mother, two sons, and later the Syrian cousins. Their coins tell a dynastic story.', de: 'Die Severer regierten als Familie: Vater, Mutter, zwei Söhne, später die syrischen Vettern. Ihre Münzen erzählen eine dynastische Geschichte.' },
    ],
    lesson: [
      { en: 'Coins were struck for the whole family. Empresses have their own legends, IVLIA AVGVSTA, and reverses with goddesses of fertility and family.', de: 'Geprägt wurde für die ganze Familie. Kaiserinnen haben eigene Legenden, IVLIA AVGVSTA, und Reverse mit Göttinnen von Fruchtbarkeit und Familie.' },
      { en: 'Learn the rank words: a Caesar is the heir, an Augustus the reigning emperor. The same boy can appear first as CAES, then as AVG.', de: 'Lerne die Rangwörter: Ein Caesar ist der Thronfolger, ein Augustus der regierende Kaiser. Derselbe Knabe erscheint erst als CAES, dann als AVG.' },
      { en: 'Now put a date on your coins. Use the reign, the titles, and the numbers in TR P and COS. The Codex has the reigns of every emperor.', de: 'Datiere deine Münzen nun. Nutze die Regierungszeit, die Titel und die Zahlen in TR P und COS. Der Codex nennt die Regierungszeiten aller Kaiser.' },
      { en: 'Note the metal, too: the denarius was debased step by step, and the silver grows paler the later you look.', de: 'Achte auch auf das Metall: Der Denar wurde Schritt für Schritt verschlechtert, das Silber wird immer blasser.' },
    ],
    outro: [
      { en: 'With Severus Alexander dead, the army made and unmade emperors. Fifty years of chaos lie ahead.', de: 'Nach dem Tod des Severus Alexander machte und stürzte das Heer die Kaiser. Fünfzig Jahre Chaos stehen bevor.' },
    ],
  },
  {
    number: 5,
    id: 'crisis',
    title: { en: 'The Crisis of the Third Century', de: 'Die Reichskrise des 3. Jahrhunderts' },
    period: { en: 'AD 235 – 284', de: '235 – 284 n. Chr.' },
    site: { en: 'Colonia Agrippina', de: 'Colonia Agrippina' },
    siteNote: {
      en: 'Cologne, capital of the breakaway Gallic Empire under Postumus from AD 260.',
      de: 'Köln, Hauptstadt des abtrünnigen Gallischen Sonderreichs unter Postumus ab 260 n. Chr.',
    },
    terrain: 'forest',
    coinsToFind: 9,
    skills: ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date'],
    rulers: [
      { id: 'maximinus_thrax', name: { en: 'Maximinus Thrax', de: 'Maximinus Thrax' }, reign: 'AD 235 – 238', note: { en: 'The soldier-giant. Huge chin, short military beard.', de: 'Der Soldaten-Riese. Mächtiges Kinn, kurzer Militärbart.' } },
      { id: 'gordian_iii', name: { en: 'Gordian III', de: 'Gordian III.' }, reign: 'AD 238 – 244', note: { en: 'Boy emperor. Very common antoniniani with a radiate crown.', de: 'Knabenkaiser. Sehr häufige Antoniniane mit Strahlenkrone.' } },
      { id: 'philip_the_arab', name: { en: 'Philip the Arab', de: 'Philippus Arabs' }, reign: 'AD 244 – 249', note: { en: 'Celebrated Rome’s 1000th birthday in 248 with the SAECVLARES AVGG animals.', de: 'Feierte 248 Roms 1000. Geburtstag mit den SAECVLARES-AVGG-Tieren.' } },
      { id: 'trajan_decius', name: { en: 'Trajan Decius', de: 'Traianus Decius' }, reign: 'AD 249 – 251', note: { en: 'Fell against the Goths. Issued the “Divi” series honouring deified emperors.', de: 'Fiel gegen die Goten. Gab die „Divi“-Serie zu Ehren vergöttlichter Kaiser aus.' } },
      { id: 'trebonianus_gallus', name: { en: 'Trebonianus Gallus', de: 'Trebonianus Gallus' }, reign: 'AD 251 – 253', note: { en: 'Plague years; many coins of Apollo Salutaris.', de: 'Pestjahre; viele Münzen des Apollo Salutaris.' } },
      { id: 'valerian', name: { en: 'Valerian', de: 'Valerian' }, reign: 'AD 253 – 260', note: { en: 'Captured by the Persians in 260, the only emperor taken alive.', de: '260 von den Persern gefangen, der einzige lebend gefangene Kaiser.' } },
      { id: 'gallienus', name: { en: 'Gallienus', de: 'Gallienus' }, reign: 'AD 253 – 268', note: { en: 'The animal series for the gods; coins of almost no silver.', de: 'Die Tierserie für die Götter; Münzen fast ohne Silber.' } },
      { id: 'postumus', name: { en: 'Postumus', de: 'Postumus' }, reign: 'AD 260 – 269', note: { en: 'Gallic Empire. Full beard, fine style from the Cologne mint.', de: 'Gallisches Sonderreich. Vollbart, feiner Stil der Kölner Münzstätte.' } },
      { id: 'claudius_ii_gothicus', name: { en: 'Claudius II Gothicus', de: 'Claudius II. Gothicus' }, reign: 'AD 268 – 270', note: { en: 'Victor over the Goths; died of plague. Posthumous altar and eagle coins are everywhere.', de: 'Sieger über die Goten; starb an der Pest. Posthume Altar- und Adlermünzen sind überall.' } },
      { id: 'aurelian', name: { en: 'Aurelian', de: 'Aurelian' }, reign: 'AD 270 – 275', note: { en: 'Restorer of the world. Reformed the antoninianus; XXI in the exergue.', de: 'Wiederhersteller der Welt. Reformierte den Antoninian; XXI im Abschnitt.' } },
      { id: 'probus', name: { en: 'Probus', de: 'Probus' }, reign: 'AD 276 – 282', note: { en: 'Enormous variety of busts: helmeted, with spear and shield, in consular robes.', de: 'Enorme Vielfalt der Büsten: behelmt, mit Speer und Schild, im Konsulargewand.' } },
      { id: 'carus', name: { en: 'Carus', de: 'Carus' }, reign: 'AD 282 – 283', note: { en: 'Killed by lightning, or so they said, on the Persian campaign.', de: 'Vom Blitz erschlagen, hieß es, auf dem Perserfeldzug.' } },
    ],
    intro: [
      { en: 'Deep forest on the Rhine. In 260 the general Postumus made Cologne the capital of his own empire: Gaul, Germany, Britain and Spain.', de: 'Tiefer Wald am Rhein. 260 machte der General Postumus Köln zur Hauptstadt seines eigenen Reiches: Gallien, Germanien, Britannien und Spanien.' },
      { en: 'Plague, invasion, inflation. The coins shrink and lose their silver, but there are more of them than ever.', de: 'Pest, Einfälle, Inflation. Die Münzen schrumpfen und verlieren ihr Silber, aber es gibt mehr davon als je zuvor.' },
    ],
    lesson: [
      { en: 'Meet the antoninianus. Caracalla introduced it as a double denarius. You recognise it by the radiate crown on the emperor, and on empresses by the crescent under the bust.', de: 'Lerne den Antoninian kennen. Caracalla führte ihn als Doppeldenar ein. Du erkennst ihn an der Strahlenkrone des Kaisers, bei Kaiserinnen an der Mondsichel unter der Büste.' },
      { en: 'By 270 it contained two per cent silver, a bronze coin with a silver wash. Numismatists call such alloy billon.', de: 'Um 270 enthielt er zwei Prozent Silber, eine Bronzemünze mit Silbersud. Numismatiker nennen diese Legierung Billon.' },
      { en: 'Mints multiplied: Milan, Siscia, Antioch, Cologne, Trier. Look for marks in the exergue, the segment under the reverse figure.', de: 'Münzstätten vermehrten sich: Mailand, Siscia, Antiochia, Köln, Trier. Suche nach Zeichen im Abschnitt, dem Segment unter der Reversfigur.' },
      { en: 'Watch the legend for the Gallic emperors: Postumus, Victorinus, the two Tetrici. Their coins never left the west.', de: 'Achte in der Legende auf die gallischen Kaiser: Postumus, Victorinus, die beiden Tetrici. Ihre Münzen verließen den Westen nie.' },
    ],
    outro: [
      { en: 'In 284 an officer from Dalmatia took the throne and did something new: he shared it. His name was Diocletian.', de: '284 bestieg ein Offizier aus Dalmatien den Thron und tat etwas Neues: Er teilte ihn. Sein Name war Diokletian.' },
    ],
  },
  {
    number: 6,
    id: 'tetrarchy',
    title: { en: 'Tetrarchy and Constantine', de: 'Tetrarchie und Konstantin' },
    period: { en: 'AD 284 – 337', de: '284 – 337 n. Chr.' },
    site: { en: 'Augusta Treverorum', de: 'Augusta Treverorum' },
    siteNote: {
      en: 'Trier, imperial residence of the west with its own mint from AD 293. The mint mark is TR.',
      de: 'Trier, Kaiserresidenz des Westens mit eigener Münzstätte ab 293 n. Chr. Das Münzzeichen ist TR.',
    },
    terrain: 'city',
    coinsToFind: 9,
    skills: ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date', 'mint'],
    rulers: [
      { id: 'diocletian', name: { en: 'Diocletian', de: 'Diokletian' }, reign: 'AD 284 – 305', note: { en: 'Senior Augustus of the east. Reformed coinage in 294: argenteus and nummus.', de: 'Oberster Augustus des Ostens. Münzreform 294: Argenteus und Nummus.' } },
      { id: 'maximian', name: { en: 'Maximian', de: 'Maximian' }, reign: 'AD 286 – 305', note: { en: 'Augustus of the west, Diocletian’s colleague. Broad, bearded face.', de: 'Augustus des Westens, Diokletians Kollege. Breites, bärtiges Gesicht.' } },
      { id: 'constantius_chlorus', name: { en: 'Constantius I', de: 'Constantius I.' }, reign: 'AD 293 – 306', note: { en: 'Caesar of the west, Constantine’s father. Took back Britain in 296.', de: 'Caesar des Westens, Konstantins Vater. Holte 296 Britannien zurück.' } },
      { id: 'galerius', name: { en: 'Galerius', de: 'Galerius' }, reign: 'AD 293 – 311', note: { en: 'Caesar then Augustus of the east. Persecutor of the Christians.', de: 'Caesar, dann Augustus des Ostens. Christenverfolger.' } },
      { id: 'maxentius', name: { en: 'Maxentius', de: 'Maxentius' }, reign: 'AD 306 – 312', note: { en: 'Ruled Rome and Italy; drowned at the Milvian Bridge. Temple of Roma reverses.', de: 'Herrschte über Rom und Italien; ertrank an der Milvischen Brücke. Roma-Tempel-Reverse.' } },
      { id: 'licinius', name: { en: 'Licinius', de: 'Licinius' }, reign: 'AD 308 – 324', note: { en: 'Constantine’s eastern rival, defeated in 324. IOVI CONSERVATORI types.', de: 'Konstantins östlicher Rivale, 324 besiegt. IOVI-CONSERVATORI-Typen.' } },
      { id: 'constantine_i', name: { en: 'Constantine I', de: 'Konstantin I.' }, reign: 'AD 306 – 337', note: { en: 'Clean-shaven, eyes raised to heaven on late coins. Introduced the solidus; founded Constantinople.', de: 'Bartlos, auf späten Münzen der Blick zum Himmel. Führte den Solidus ein; gründete Konstantinopel.' } },
    ],
    intro: [
      { en: 'Trier. Palace, basilica, baths and a mint. From here Constantine ruled Gaul before he conquered the whole empire.', de: 'Trier. Palast, Basilika, Thermen und eine Münzstätte. Von hier regierte Konstantin Gallien, bevor er das ganze Reich eroberte.' },
      { en: 'Four emperors shared the world: two Augusti, two Caesars. Their coins look alike on purpose; the mint, not the face, tells them apart.', de: 'Vier Kaiser teilten sich die Welt: zwei Augusti, zwei Caesares. Ihre Münzen sehen absichtlich gleich aus; die Münzstätte, nicht das Gesicht, unterscheidet sie.' },
    ],
    lesson: [
      { en: 'Diocletian’s reform of 294 created the nummus, a large silvered bronze with GENIO POPVLI ROMANI, and the silver argenteus.', de: 'Diokletians Reform von 294 schuf den Nummus, eine große versilberte Bronze mit GENIO POPVLI ROMANI, und den silbernen Argenteus.' },
      { en: 'Every coin now carries a mint mark in the exergue. TR is Trier, LVG or PLG Lyon, SIS Siscia, ANT Antioch, CONS Constantinople. Letters before it, like P, S, T, Q, number the workshop, the officina.', de: 'Jede Münze trägt nun ein Münzzeichen im Abschnitt. TR ist Trier, LVG oder PLG Lyon, SIS Siscia, ANT Antiochia, CONS Konstantinopel. Buchstaben davor, etwa P, S, T, Q, zählen die Werkstatt, die Officina.' },
      { en: 'From now on, name the mint. The Codex has a map and a table of all the marks.', de: 'Ab jetzt nennst du auch die Münzstätte. Der Codex hat eine Karte und eine Tabelle aller Zeichen.' },
      { en: 'Constantine’s gold solidus of 309, struck at 72 to the pound, remained the gold standard of the Mediterranean for seven hundred years.', de: 'Konstantins goldener Solidus von 309, zu 72 Stück aufs Pfund, blieb siebenhundert Jahre lang der Goldstandard des Mittelmeerraums.' },
    ],
    outro: [
      { en: 'Constantine died in 337 and left the empire to his sons. The city he founded on the Bosporus is our last station.', de: 'Konstantin starb 337 und hinterließ das Reich seinen Söhnen. Die Stadt, die er am Bosporus gründete, ist unsere letzte Station.' },
    ],
  },
  {
    number: 7,
    id: 'late-empire',
    title: { en: 'The Late Empire', de: 'Das späte Reich' },
    period: { en: 'AD 337 – 491', de: '337 – 491 n. Chr.' },
    site: { en: 'Constantinopolis', de: 'Constantinopolis' },
    siteNote: {
      en: 'The New Rome. Its mint, marked CON or CONS, outlived the western empire by a thousand years.',
      de: 'Das Neue Rom. Seine Münzstätte, gekennzeichnet CON oder CONS, überlebte das Westreich um tausend Jahre.',
    },
    terrain: 'coast',
    coinsToFind: 10,
    skills: ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date', 'mint'],
    rulers: [
      { id: 'constantine_ii', name: { en: 'Constantine II', de: 'Konstantin II.' }, reign: 'AD 337 – 340', note: { en: 'Eldest son; killed attacking his brother Constans.', de: 'Ältester Sohn; fiel beim Angriff auf seinen Bruder Constans.' } },
      { id: 'constans', name: { en: 'Constans', de: 'Constans' }, reign: 'AD 337 – 350', note: { en: 'Ruled the west. Emperor on a galley with Victory, FEL TEMP REPARATIO.', de: 'Herrschte im Westen. Kaiser auf Galeere mit Victoria, FEL TEMP REPARATIO.' } },
      { id: 'constantius_ii', name: { en: 'Constantius II', de: 'Constantius II.' }, reign: 'AD 337 – 361', note: { en: 'Longest-reigning son. The “falling horseman” bronzes are the commonest Roman coins of all.', de: 'Längstregierender Sohn. Die „Fallender-Reiter“-Bronzen sind die häufigsten römischen Münzen überhaupt.' } },
      { id: 'magnentius', name: { en: 'Magnentius', de: 'Magnentius' }, reign: 'AD 350 – 353', note: { en: 'Western usurper. Large bronzes with a giant chi-rho.', de: 'Westlicher Usurpator. Große Bronzen mit riesigem Christogramm.' } },
      { id: 'julian_the_apostate', name: { en: 'Julian', de: 'Julian' }, reign: 'AD 360 – 363', note: { en: 'The philosopher with a beard; the bull on the reverse of his big bronzes.', de: 'Der Philosoph mit Bart; der Stier auf dem Revers seiner großen Bronzen.' } },
      { id: 'valentinian_i', name: { en: 'Valentinian I', de: 'Valentinian I.' }, reign: 'AD 364 – 375', note: { en: 'Soldier emperor of the west. GLORIA ROMANORVM, dragging a captive.', de: 'Soldatenkaiser des Westens. GLORIA ROMANORVM, einen Gefangenen schleifend.' } },
      { id: 'valens', name: { en: 'Valens', de: 'Valens' }, reign: 'AD 364 – 378', note: { en: 'Brother of Valentinian; fell at Adrianople against the Goths.', de: 'Bruder Valentinians; fiel bei Adrianopel gegen die Goten.' } },
      { id: 'gratian', name: { en: 'Gratian', de: 'Gratian' }, reign: 'AD 367 – 383', note: { en: 'Boy emperor who grew up on the coins. Trier his main mint.', de: 'Knabenkaiser, der auf den Münzen erwachsen wird. Trier seine Hauptmünzstätte.' } },
      { id: 'theodosius_i', name: { en: 'Theodosius I', de: 'Theodosius I.' }, reign: 'AD 379 – 395', note: { en: 'Last ruler of a united empire; Christianity becomes state religion.', de: 'Letzter Herrscher des ganzen Reiches; das Christentum wird Staatsreligion.' } },
      { id: 'arcadius', name: { en: 'Arcadius', de: 'Arcadius' }, reign: 'AD 383 – 408', note: { en: 'Eastern emperor. Tiny bronzes, fine solidi from Constantinople.', de: 'Ostkaiser. Winzige Bronzen, feine Solidi aus Konstantinopel.' } },
      { id: 'honorius', name: { en: 'Honorius', de: 'Honorius' }, reign: 'AD 393 – 423', note: { en: 'Western emperor at Ravenna while Rome was sacked in 410.', de: 'Westkaiser in Ravenna, während Rom 410 geplündert wurde.' } },
      { id: 'theodosius_ii', name: { en: 'Theodosius II', de: 'Theodosius II.' }, reign: 'AD 402 – 450', note: { en: 'Fifty years in Constantinople; the walls that bear his name.', de: 'Fünfzig Jahre in Konstantinopel; die Mauern tragen seinen Namen.' } },
      { id: 'zeno', name: { en: 'Zeno', de: 'Zenon' }, reign: 'AD 474 – 491', note: { en: 'Emperor in the east when the last western emperor was deposed in 476.', de: 'Kaiser im Osten, als 476 der letzte Westkaiser abgesetzt wurde.' } },
    ],
    intro: [
      { en: 'The sea wind of the Bosporus. Constantinople, the New Rome, where our journey ends.', de: 'Der Seewind des Bosporus. Konstantinopel, das Neue Rom, wo unsere Reise endet.' },
      { en: 'The emperors are now Christians. The gods leave the reverses; soldiers, standards, the cross and the chi-rho take their place.', de: 'Die Kaiser sind nun Christen. Die Götter verlassen die Reverse; Soldaten, Standarten, Kreuz und Christogramm nehmen ihren Platz ein.' },
    ],
    lesson: [
      { en: 'Late bronze has no ancient name, so we sort it by size: AE1 is the largest, AE4 the smallest, often under 15 mm.', de: 'Späte Bronze hat keinen antiken Namen, deshalb sortieren wir nach Größe: AE1 ist die größte, AE4 die kleinste, oft unter 15 mm.' },
      { en: 'Portraits become uniform, so rely on the legend and the reverse slogans: GLORIA EXERCITVS with two soldiers, FEL TEMP REPARATIO with the falling horseman, VICTORIA AVGGG with Victory and the globe.', de: 'Porträts werden einheitlich, also verlass dich auf die Legende und die Reversparolen: GLORIA EXERCITVS mit zwei Soldaten, FEL TEMP REPARATIO mit dem fallenden Reiter, VICTORIA AVGGG mit Victoria und Globus.' },
      { en: 'Count the G’s in AVGG: each stands for one reigning Augustus. AVGGG means three emperors shared the throne.', de: 'Zähle die G in AVGG: Jedes steht für einen regierenden Augustus. AVGGG heißt, drei Kaiser teilten sich den Thron.' },
      { en: 'Read the mint mark and the officina, and you have placed the coin within a few years and a few hundred miles. You are a numismatist now.', de: 'Lies das Münzzeichen und die Officina, und du hast die Münze auf wenige Jahre und wenige hundert Meilen eingegrenzt. Du bist jetzt Numismatiker.' },
    ],
    outro: [
      { en: 'That is the end of the road, stranger. Or the beginning: every coin in the ground still waits for a reader.', de: 'Das ist das Ende des Weges, Fremder. Oder der Anfang: Jede Münze im Boden wartet noch auf einen Leser.' },
      { en: 'Go back to the village whenever you like. The meadows there will always have something to find.', de: 'Komm zurück ins Dorf, wann immer du willst. Auf den Wiesen dort gibt es immer etwas zu finden.' },
    ],
  },
]

export const prologue: Text[] = [
  { en: 'Hello, stranger. My name is Gwen. Good to meet you.', de: 'Hallo Fremder! Mein Name ist Gwen. Schön, dich kennenzulernen.' },
  { en: 'You should know: I am a mage. I have the gift of sensing metal in the ground. My tribe and I use it to find coins buried deep in Mother Earth.', de: 'Du musst wissen: Ich bin eine Magierin. Ich besitze die Gabe, Metall im Boden aufzuspüren. Mein Stamm und ich nutzen diese Kraft, um Münzen zu finden, die tief in Mutter Erde begraben sind.' },
  { en: 'They are the remains of an ancient civilisation. We call them Romans. They once lived here on our sacred soil. They traded, travelled to the farthest places of the world, and praised their gods and rulers.', de: 'Überreste einer uralten Zivilisation – wir nennen sie Römer. Sie lebten einst hier auf unserem heiligen Boden. Sie trieben Handel, reisten an die entlegensten Orte der Welt und priesen ihre Götter und Herrscher.' },
  { en: 'In some places their influence has outlasted the millennia; elsewhere it is about to be swallowed by time and forgotten.', de: 'Mancherorts hat ihr Einfluss die Jahrtausende überdauert, andernorts droht er, vom Lauf der Zeit verschluckt und vergessen zu werden.' },
  { en: 'But the coins they struck tell us their story. They are only waiting to be discovered.', de: 'Die Münzen, die sie prägten, jedoch erzählen uns ihre Geschichte. Sie warten nur darauf, entdeckt zu werden.' },
  { en: 'If you wish, you too can learn the gift of my tribe, stranger. My village is not far. I will wait for you at the statue of our goddess.', de: 'Wenn du willst, kannst auch du die Gabe meines Stammes erlernen, Fremder! Mein Dorf ist nicht weit von hier. Ich warte an der Statue unserer Göttin auf dich.' },
]

export const ranks: { xp: number; title: Text }[] = [
  { xp: 0, title: { en: 'Stranger', de: 'Fremder' } },
  { xp: 150, title: { en: 'Apprentice', de: 'Lehrling' } },
  { xp: 500, title: { en: 'Coin finder', de: 'Münzsucher' } },
  { xp: 1200, title: { en: 'Numismatist', de: 'Numismatiker' } },
  { xp: 2500, title: { en: 'Keeper of the Cabinet', de: 'Hüter des Münzkabinetts' } },
  { xp: 5000, title: { en: 'Master of the Mint', de: 'Meister der Münze' } },
]

export const allRulerIds = chapters.flatMap((c) => c.rulers.map((r) => r.id))

export function chapterOfRuler(id: string): number | undefined {
  return chapters.find((c) => c.rulers.some((r) => r.id === id))?.number
}

export function rulerById(id: string): Ruler | undefined {
  for (const c of chapters) {
    const r = c.rulers.find((r) => r.id === id)
    if (r) return r
  }
  return undefined
}
