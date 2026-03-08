(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s9");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s9-q019",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore kader, Allah'in her seyi ilim, hikmet ve iradesiyle olculu bicimde bilip _____ etmesidir.",
      answers: ["takdir", "takdir etmesi"],
      placeholder: "Tek kavram yaz",
      hint: "Kaderle birlikte anilan temel fiil.",
      explanation:
        "Bolum kaderi, Allah'in her seyi ilim ve hikmetle bilip takdir etmesi olarak tanimlar.",
    },
    {
      id: "s9-q020",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore Allah'in gelecekteki tercihleri bilmesi, insani o tercihlere zorladigi anlamina gelir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, ilahi bilginin kusatici oldugunu; fakat bunun insan iradesini zorlayici sebebe donusmedigini belirtir.",
    },
    {
      id: "s9-q021",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Takdir edilen seyin zamani geldiginde fiilen gerceklesmesine bu bolumde _____ denir.",
      answers: ["kaza", "kazaa", "kada"],
      placeholder: "Tek kavram yaz",
      hint: "Kaderden sonra gelen gerceklesme safhasi.",
      explanation:
        "Bolum, kaza kavramini kaderde takdir edilen seyin vakti geldigi anda meydana gelmesi olarak aciklar.",
    },
    {
      id: "s9-q022",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore tevekkul, hicbir sebebe basvurmadan sonucu beklemek demektir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, tevekkulu sebebi terk etmek degil; gereken cabayi gosterdikten sonra sonucu Allah'a birakmak olarak tanimlar.",
    },
    {
      id: "s9-q023",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore ecel _____; olumun sekli onu degistirmez.",
      answers: ["tektir", "bir tanedir"],
      placeholder: "Kisa cevap yaz",
      hint: "Iki degil, tek oldugunu bildiren ifade.",
      explanation:
        "Bolum, kaza, hastalik ya da baska sebeplerle olse de insanin tek ecel icinde olumu tattigini vurgular.",
    },
    {
      id: "s9-q024",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore 'kahpe felek' gibi sozler, eger ilahi takdire isyan anlami tasiyorsa inanc acisindan risklidir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, bu tur sozlerin sadece kultur meselesi olmadigini; ilahi takdire bas kaldiri anlami tasiyabildigini soyler.",
    },
    {
      id: "s9-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore alin yazisi, Allah'in bilip takdir etmesini mecazi bicimde anlatan bir _____dir.",
      answers: ["ifade", "soz", "deyis"],
      placeholder: "Tek kelime yaz",
      hint: "Mecazi anlatim turu.",
      explanation:
        "Bolum alin yazisi tabirini, insan alnina yazili somut metin degil; Allah'in takdirini anlatan mecazi ifade olarak yorumlar.",
    },
    {
      id: "s9-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore yildizlara ve burclara kader belirleyici guc atfetmek, tevhid bakimindan problemli bir yaklasimdir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, astrolojik kader anlayisini hem tevhid hem de insan iradesi bakimindan sorunlu gorur.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
