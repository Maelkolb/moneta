import type { Text } from '../data/types'
import type { Skill } from '../data/chapters'

export type NpcSprite = 'gwen' | 'elder' | 'smith' | 'trader' | 'seer' | 'child' | 'farmer' | 'warrior' | 'legion' | 'woman' | 'monk'

export type NpcSpec = {
  id: string
  name: Text
  sprite: NpcSprite
  x: number
  y: number
  wander?: boolean
  facing?: 'up' | 'down'
}

export type Quiz = { skill: Skill; rounds: number }

export type Talk = {
  lines: Text[]
  quiz?: Quiz
  quest?: 'augustus'
  hint?: 'nearest' | 'count'
  questDone?: Text[]
  questReward?: number
}

const T = (en: string, de: string): Text => ({ en, de })

export const talks: Record<string, Talk> = {
  elder: {
    lines: [
      T('Sit, stranger. I am Brennus, elder of this tribe. You wonder about our goddess at the statue?', 'Setz dich, Fremder. Ich bin Brennus, der Älteste dieses Stammes. Du fragst dich, wer unsere Göttin an der Statue ist?'),
      T('My grandfather’s grandfather dug her out of the meadow. She came with the Romans. Her name was carved on the base: MONETA. The Romans kept their mint in her temple on the Capitol.', 'Der Großvater meines Großvaters hat sie aus der Wiese gegraben. Sie kam mit den Römern. Ihr Name stand auf dem Sockel: MONETA. Die Römer hatten ihre Münzstätte in ihrem Tempel auf dem Kapitol.'),
      T('That is why the coins answer to Gwen’s crystal. Moneta is the mother of money; the very word comes from her.', 'Deshalb antworten die Münzen auf Gwens Kristall. Moneta ist die Mutter des Geldes; das Wort selbst stammt von ihr.'),
      T('Bring me a coin with the face of Augustus, the first of their emperors, and I will tell you how the Romans came to our river.', 'Bring mir eine Münze mit dem Gesicht des Augustus, des ersten ihrer Kaiser, und ich erzähle dir, wie die Römer an unseren Fluss kamen.'),
    ],
    quest: 'augustus',
    questDone: [
      T('Augustus himself. Look at the young face: he was over seventy when he died, yet the coins never let him age.', 'Augustus selbst. Sieh das junge Gesicht: Er war über siebzig, als er starb, doch die Münzen ließen ihn nie altern.'),
      T('In the year 15 before their Christ his stepsons Tiberius and Drusus crossed the Alps and took our land. The road from Augusta Vindelicum passed right here, by the ford.', 'Im Jahr 15 vor ihrem Christus überquerten seine Stiefsöhne Tiberius und Drusus die Alpen und nahmen unser Land. Die Straße von Augusta Vindelicum führte genau hier vorbei, an der Furt.'),
      T('Soldiers, traders, travellers: every one of them dropped a coin now and then. Two thousand years of small losses. That is what you are digging up.', 'Soldaten, Händler, Reisende: Jeder von ihnen verlor hin und wieder eine Münze. Zweitausend Jahre kleiner Verluste. Das ist es, was du ausgräbst.'),
      T('Take this for your trouble: the tribe’s thanks, and a little of its knowledge.', 'Nimm dies für deine Mühe: den Dank des Stammes und ein wenig von seinem Wissen.'),
    ],
    questReward: 60,
  },
  elder_waiting: {
    lines: [
      T('No coin of Augustus yet? Keep looking in the meadow. His face is young, with a laurel wreath or a bare head, and the legend reads CAESAR AVGVSTVS.', 'Noch keine Münze des Augustus? Such weiter auf der Wiese. Sein Gesicht ist jung, mit Lorbeerkranz oder barhäuptig, und die Legende lautet CAESAR AVGVSTVS.'),
    ],
  },
  elder_after: {
    lines: [
      T('The Romans held this land for four hundred years, stranger. Every chapter of their story lies somewhere in the ground. Follow the road and you will find the rest.', 'Die Römer hielten dieses Land vierhundert Jahre, Fremder. Jedes Kapitel ihrer Geschichte liegt irgendwo im Boden. Folge der Straße, und du findest den Rest.'),
    ],
  },
  smith: {
    lines: [
      T('Mind the sparks. I am Ada, and I know metal better than anyone in this village.', 'Vorsicht, Funken. Ich bin Ada, und ich kenne Metall besser als jeder hier im Dorf.'),
      T('The Romans did not cast their coins, they struck them. A blank disc of metal, the flan, was heated, laid on a lower die with the portrait, and a worker brought down the upper die with a hammer. One blow, one coin.', 'Die Römer gossen ihre Münzen nicht, sie prägten sie. Ein Rohling aus Metall, der Schrötling, wurde erhitzt, auf den Unterstempel mit dem Porträt gelegt, und ein Arbeiter schlug den Oberstempel mit dem Hammer darauf. Ein Schlag, eine Münze.'),
      T('That is why no two coins are alike: the flan slips, the strike is weak, the die cracks. Look for the edge of the die, the centring, the flatness of the hair.', 'Deshalb gleicht keine Münze der anderen: Der Schrötling verrutscht, der Schlag ist schwach, der Stempel reißt. Achte auf den Stempelrand, die Zentrierung, die Flachheit der Haare.'),
      T('Gold keeps its colour forever. Silver turns grey, even black. Copper and brass go green in the ground. And weight tells you the denomination: an aureus near eight grams, a denarius near four, a sestertius twenty-five. Want to test your eye?', 'Gold behält seine Farbe für immer. Silber wird grau, sogar schwarz. Kupfer und Messing werden im Boden grün. Und das Gewicht verrät das Nominal: ein Aureus fast acht Gramm, ein Denar fast vier, ein Sesterz fünfundzwanzig. Willst du dein Auge prüfen?'),
    ],
    quiz: { skill: 'denomination', rounds: 4 },
  },
  trader: {
    lines: [
      T('Welcome, welcome. Marcus, dealer in salt, amber and anything that glitters. You want to know what a coin was worth?', 'Willkommen, willkommen. Marcus, Händler in Salz, Bernstein und allem, was glänzt. Du willst wissen, was eine Münze wert war?'),
      T('Under Augustus a legionary earned 225 denarii a year, about ten aurei. A loaf of bread cost two asses, a cup of plain wine one as, a mule a good two hundred denarii.', 'Unter Augustus verdiente ein Legionär 225 Denare im Jahr, etwa zehn Aurei. Ein Laib Brot kostete zwei Asse, ein Becher einfacher Wein ein As, ein Maultier gut zweihundert Denare.'),
      T('So the gold you dig up was never pocket money. Gold moved between generals and kings. The sestertius and the as were the coins of the market.', 'Das Gold, das du ausgräbst, war also nie Kleingeld. Gold wanderte zwischen Feldherren und Königen. Sesterz und As waren die Münzen des Marktes.'),
      T('Remember the ladder: one aureus, twenty-five denarii, a hundred sestertii, two hundred dupondii, four hundred asses. Shall I test you on it, with real coins?', 'Merk dir die Leiter: ein Aureus, fünfundzwanzig Denare, hundert Sesterze, zweihundert Dupondien, vierhundert Asse. Soll ich dich prüfen, mit echten Münzen?'),
    ],
    quiz: { skill: 'metal', rounds: 4 },
  },
  seer: {
    lines: [
      T('Come closer to the altar. I am Vara. The earth speaks to me, and it speaks of coins.', 'Komm näher an den Altar. Ich bin Vara. Die Erde spricht zu mir, und sie spricht von Münzen.'),
      T('Why are they in the ground at all? Three reasons. Stray losses: a coin slips from a purse on the road. Offerings: coins thrown into springs and rivers for the gods. And hoards: in times of war a family buries its savings in a pot and never returns.', 'Warum liegen sie überhaupt im Boden? Drei Gründe. Streufunde: Eine Münze rutscht unterwegs aus dem Beutel. Opfer: Münzen, in Quellen und Flüsse geworfen für die Götter. Und Horte: In Kriegszeiten vergräbt eine Familie ihr Erspartes in einem Topf und kehrt nie zurück.'),
      T('A hoard is a message. The newest coin in it tells you when it was buried, and the burying tells you of fear. Many hoards in our land date to the years around 233 and 260, when the Germanic tribes crossed the border.', 'Ein Hort ist eine Botschaft. Die jüngste Münze darin sagt dir, wann er vergraben wurde, und das Vergraben erzählt von Angst. Viele Horte in unserem Land stammen aus den Jahren um 233 und 260, als die germanischen Stämme die Grenze überschritten.'),
      T('I can read the reverse images as well: the gods and virtues the emperors put on their coins. Ask, and I will test you. Or ask the earth, and I will tell you where the coins lie today.', 'Auch die Bilder der Rückseiten kann ich lesen: die Götter und Tugenden, die die Kaiser auf ihre Münzen setzten. Frag, und ich prüfe dich. Oder frag die Erde, und ich sage dir, wo die Münzen heute liegen.'),
    ],
    quiz: { skill: 'reverse', rounds: 4 },
    hint: 'count',
  },
  child: {
    lines: [
      T('Are you the stranger? Gwen says you can find coins. I found a shiny thing once, but father says it was a bottle cap.', 'Bist du der Fremde? Gwen sagt, du kannst Münzen finden. Ich hab mal was Glänzendes gefunden, aber Vater sagt, es war ein Kronkorken.'),
      T('Want to know a secret? I watched the crystal glow yesterday. I think I know where something is buried.', 'Willst du ein Geheimnis wissen? Ich hab gestern den Kristall leuchten sehen. Ich glaube, ich weiß, wo etwas vergraben ist.'),
    ],
    hint: 'nearest',
  },
  farmer: {
    lines: [
      T('Every spring the plough turns up a coin or two. Green ones mostly, bronze. Once a silver one, with a woman holding corn ears. Gwen said: Annona, the grain goddess. Fitting for a field.', 'Jedes Frühjahr bringt der Pflug ein, zwei Münzen hoch. Meist grüne, Bronze. Einmal eine silberne, mit einer Frau, die Ähren hält. Gwen sagte: Annona, die Getreidegöttin. Passend für ein Feld.'),
      T('Most Roman coins ever found come from fields like mine, not from treasure. Keep that in mind when you dig: the common coin tells the true story.', 'Die meisten römischen Münzen überhaupt stammen von Feldern wie meinem, nicht aus Schätzen. Denk daran, wenn du gräbst: Die gewöhnliche Münze erzählt die wahre Geschichte.'),
    ],
  },
  warrior: {
    lines: [
      T('The path north leads to the old Roman road, stranger. Follow it and you reach the places where the legions camped, the cities they built, even the capital of their last emperors.', 'Der Weg nach Norden führt zur alten Römerstraße, Fremder. Folge ihr, und du erreichst die Lager der Legionen, die Städte, die sie bauten, sogar die Hauptstadt ihrer letzten Kaiser.'),
      T('But Gwen will not let you go before you have proven yourself here. Six coins, she said. Then the road is open.', 'Aber Gwen lässt dich nicht gehen, bevor du dich hier bewährt hast. Sechs Münzen, sagte sie. Dann ist die Straße frei.'),
    ],
  },
  gwen_outside: { lines: [T('…', '…')] },

  camp_veteran: {
    lines: [
      T('Twenty-five years I served with the Eleventh Legion. Pay day came three times a year: the stipendium, in denarii, minus deductions for boots, food and the burial fund.', 'Fünfundzwanzig Jahre diente ich bei der Elften Legion. Zahltag war dreimal im Jahr: das Stipendium, in Denaren, abzüglich Stiefel, Verpflegung und Begräbniskasse.'),
      T('Vespasian raised the empire from bankruptcy after the civil war. He even taxed the public latrines. When his son Titus complained, he held a coin under his nose: it does not stink. Pecunia non olet.', 'Vespasian hob das Reich nach dem Bürgerkrieg aus dem Bankrott. Er besteuerte sogar die öffentlichen Latrinen. Als sein Sohn Titus sich beschwerte, hielt er ihm eine Münze unter die Nase: Sie stinkt nicht. Pecunia non olet.'),
      T('The coins we lost in the camp latrine and the rubbish dump are still there. Thousands of them. That is why you came, is it not?', 'Die Münzen, die wir in der Lagerlatrine und auf dem Schutthügel verloren haben, liegen noch da. Tausende. Deshalb bist du doch hier, oder?'),
    ],
  },
  camp_clerk: {
    lines: [
      T('I kept the lists for the quartermaster. Every coin that passed through this camp was counted. Galba, Otho, Vitellius: in one year I had to learn three new faces on the silver.', 'Ich führte die Listen für den Quartiermeister. Jede Münze, die durch dieses Lager ging, wurde gezählt. Galba, Otho, Vitellius: In einem Jahr musste ich drei neue Gesichter auf dem Silber lernen.'),
      T('Here is a trick for the legends: IMP at the front means the emperor took Imperator as his first name. Vespasian started that. Before him, IMP at the end counted victories.', 'Ein Trick für die Legenden: IMP am Anfang heißt, der Kaiser nahm Imperator als Vornamen. Vespasian fing damit an. Vor ihm zählte IMP am Ende die Siege.'),
    ],
    quiz: { skill: 'legend', rounds: 3 },
  },
  river_merchant: {
    lines: [
      T('Amber from the Baltic, wine from Italy, slaves from across the river: Carnuntum is where it all changes hands, and all of it is paid in silver.', 'Bernstein von der Ostsee, Wein aus Italien, Sklaven von jenseits des Flusses: In Carnuntum wechselt alles den Besitzer, und alles wird in Silber bezahlt.'),
      T('The barbarians on the far bank want only good denarii, the old ones of Trajan and Hadrian with real silver in them. They know the difference. So should you.', 'Die Barbaren am anderen Ufer wollen nur gute Denare, die alten von Trajan und Hadrian mit echtem Silber darin. Sie kennen den Unterschied. Du solltest ihn auch kennen.'),
    ],
    quiz: { skill: 'ruler', rounds: 4 },
  },
  river_soldier: {
    lines: [
      T('The emperor himself is in the camp this winter, writing in a tent by lamplight. Marcus Aurelius. They say he writes to himself, about how to live.', 'Der Kaiser selbst ist diesen Winter im Lager und schreibt in einem Zelt bei Lampenlicht. Mark Aurel. Man sagt, er schreibe an sich selbst, darüber, wie man leben soll.'),
      T('On his coins you see him with the full beard of a philosopher. His adoptive father Antoninus Pius had the calm face; Hadrian the first beard; Trajan the straight fringe. Learn the faces and you have a hundred years.', 'Auf seinen Münzen siehst du ihn mit dem Vollbart eines Philosophen. Sein Adoptivvater Antoninus Pius hatte das ruhige Gesicht; Hadrian den ersten Bart; Trajan den geraden Pony. Lern die Gesichter, und du hast hundert Jahre.'),
    ],
  },
  desert_priest: {
    lines: [
      T('Septimius Severus was born in this city, and this city made him. When he became emperor, he paved its streets with marble and put his whole family on the coins.', 'Septimius Severus wurde in dieser Stadt geboren, und diese Stadt hat ihn gemacht. Als er Kaiser wurde, pflasterte er ihre Straßen mit Marmor und setzte seine ganze Familie auf die Münzen.'),
      T('His wife Julia Domna was a Syrian priest’s daughter. Her hair in rigid waves, her title IVLIA AVGVSTA. Learn her face: she appears on more silver than many emperors.', 'Seine Frau Julia Domna war die Tochter eines syrischen Priesters. Ihr Haar in strengen Wellen, ihr Titel IVLIA AVGVSTA. Lern ihr Gesicht: Sie erscheint auf mehr Silber als manche Kaiser.'),
    ],
    quiz: { skill: 'date', rounds: 3 },
  },
  desert_trader: {
    lines: [
      T('Silver, silver, always less silver. My grandfather’s denarius was nearly pure. Caracalla’s is half copper, and his new double denarius, the antoninianus, is a cheat: it weighs one and a half.', 'Silber, Silber, immer weniger Silber. Der Denar meines Großvaters war fast rein. Caracallas ist halb Kupfer, und sein neuer Doppeldenar, der Antoninian, ist ein Betrug: Er wiegt eineinhalb.'),
      T('You can see it on the coin: the radiate crown on the emperor’s head marks the double value. Dupondius against as, antoninianus against denarius. The crown is the price tag.', 'Du siehst es an der Münze: Die Strahlenkrone auf dem Kopf des Kaisers markiert den doppelten Wert. Dupondius gegen As, Antoninian gegen Denar. Die Krone ist das Preisschild.'),
    ],
  },
  forest_officer: {
    lines: [
      T('Postumus is our emperor now, not the one in Rome. Gaul, Germany, Britain and Spain follow him. The coins from the Cologne mint are the finest in the west: look at the full beard, the careful lettering.', 'Postumus ist jetzt unser Kaiser, nicht der in Rom. Gallien, Germanien, Britannien und Spanien folgen ihm. Die Münzen aus der Kölner Münzstätte sind die feinsten im Westen: Sieh den Vollbart, die sorgfältige Schrift.'),
      T('But the antoninianus is sinking. By the time of Tetricus it is a copper disc with a silver wash that rubs off in a week. Billon, the money changers call it.', 'Aber der Antoninian sinkt. Zur Zeit des Tetricus ist er eine Kupferscheibe mit einem Silbersud, der sich in einer Woche abreibt. Billon nennen es die Geldwechsler.'),
    ],
    quiz: { skill: 'ruler', rounds: 4 },
  },
  forest_woman: {
    lines: [
      T('We buried our savings under the hearth when the Franks came in 260. Four hundred antoniniani in a pot. My husband marked the spot; he did not come back from the wall.', 'Wir vergruben unser Erspartes unter dem Herd, als die Franken 260 kamen. Vierhundert Antoniniane in einem Topf. Mein Mann markierte die Stelle; von der Mauer kam er nicht zurück.'),
      T('That is a hoard, stranger. One day someone like you will find it and read the fear of that year from the newest coin in the pot.', 'Das ist ein Hort, Fremder. Eines Tages wird jemand wie du ihn finden und aus der jüngsten Münze im Topf die Angst jenes Jahres lesen.'),
    ],
  },
  city_mintworker: {
    lines: [
      T('I strike coins for the emperor at the Trier mint. See the letters under the figure on the back, in the exergue? TR, that is us. P or S in front of it: first or second workshop. Every mint in the empire signs its work now.', 'Ich präge Münzen für den Kaiser in der Trierer Münzstätte. Siehst du die Buchstaben unter der Figur auf der Rückseite, im Abschnitt? TR, das sind wir. P oder S davor: erste oder zweite Werkstatt. Jede Münzstätte im Reich signiert jetzt ihre Arbeit.'),
      T('Diocletian ordered it so that bad coin could be traced. Learn the marks and you can place a coin on the map without reading a single word of the legend.', 'Diokletian hat es so angeordnet, damit schlechte Münzen zurückverfolgt werden können. Lern die Zeichen, und du kannst eine Münze auf der Karte verorten, ohne ein Wort der Legende zu lesen.'),
    ],
    quiz: { skill: 'mint', rounds: 4 },
  },
  city_official: {
    lines: [
      T('Four emperors, two Augusti and two Caesars, and all of them with the same square jaw and short beard on the coins. That is deliberate: the tetrarchy is one body with four heads.', 'Vier Kaiser, zwei Augusti und zwei Caesares, und alle mit demselben kantigen Kinn und kurzen Bart auf den Münzen. Das ist Absicht: Die Tetrarchie ist ein Körper mit vier Köpfen.'),
      T('Then Constantine shaved. A clean face, eyes raised to heaven on the late coins, and a new gold coin, the solidus, that lasted seven hundred years. Read the name, not the face, in this age.', 'Dann rasierte sich Konstantin. Ein glattes Gesicht, auf den späten Münzen der Blick zum Himmel, und eine neue Goldmünze, der Solidus, die siebenhundert Jahre hielt. Lies in dieser Zeit den Namen, nicht das Gesicht.'),
    ],
  },
  coast_monk: {
    lines: [
      T('The gods have left the coins. In their place the cross, the chi-rho, the emperor with the labarum. Constantine’s sons made the empire Christian and the coins show it.', 'Die Götter haben die Münzen verlassen. An ihrer Stelle das Kreuz, das Christogramm, der Kaiser mit dem Labarum. Konstantins Söhne machten das Reich christlich, und die Münzen zeigen es.'),
      T('Count the G’s in AVGG on the reverse: each one is a reigning Augustus. Three G’s, three emperors. It is the simplest dating trick there is.', 'Zähl die G in AVGG auf der Rückseite: Jedes steht für einen regierenden Augustus. Drei G, drei Kaiser. Es ist der einfachste Datierungstrick, den es gibt.'),
    ],
    quiz: { skill: 'legend', rounds: 3 },
  },
  coast_sailor: {
    lines: [
      T('CONOB on the gold, see? Constantinople, pure gold. The solidus of this city is the one coin every port from Britain to India accepts without weighing.', 'CONOB auf dem Gold, siehst du? Konstantinopel, reines Gold. Der Solidus dieser Stadt ist die eine Münze, die jeder Hafen von Britannien bis Indien ungewogen annimmt.'),
      T('The bronze is another matter: tiny flakes, AE4 the scholars call them, that nobody bothers to pick up when they fall. Which is why you will find so many.', 'Die Bronze ist eine andere Sache: winzige Plättchen, AE4 nennen sie die Gelehrten, die niemand aufhebt, wenn sie fallen. Deshalb wirst du so viele finden.'),
    ],
  },
}
