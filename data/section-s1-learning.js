(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s1");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s1-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Metne gore bilim olup bitenin _____ aciklar, inanc ise hayati anlamlandirir.",
      answers: ["nasil isledigini", "isleyisini"],
      placeholder: "Kisa ifadeyi yaz",
      hint: "Iki kelimelik bir ifade bekleniyor.",
      explanation:
        "Bolumde bilim, olgularin nasil isledigini arastiran alan olarak; inanc ise hayatin anlam boyutunu kuran merkez olarak anlatilir.",
    },
    {
      id: "s1-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore insan bilgisi mutlak, kusatici ve sinirsizdir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, insan bilgisinin sinirli oldugunu; mutlak ve kusatici bilginin yalniz Allah'a ait bulundugunu vurgular.",
    },
    {
      id: "s1-q027",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Kur'an'a gore duyu ve aklin yani sira guvenilir _____ ve vahiy de bilgi kaynaklarindandir.",
      answers: ["haber"],
      placeholder: "Tek kavram yaz",
      hint: "Metinde vahiy ile birlikte anilan klasik bilgi kaynagi.",
      explanation:
        "Bolum, bilgiyi yalniz duyular ve akilla sinirlamaz; guvenilir haber ve vahyi de bilgi zemininin parcalari olarak sayar.",
    },
    {
      id: "s1-q028",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Metinde saglam inanc, akli butunuyle devre disi birakan kor baglilik olarak sunulur.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, saglam inanci akil ile vahyi karsitlastirmadan birlikte degerlendiren bir cizgide kurar.",
    },
    {
      id: "s1-q029",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Vahyin ilk emri olan '_____' bilgi arayisinin ertelenemez bir sorumluluk oldugunu hatirlatir.",
      answers: ["oku"],
      placeholder: "Tek kelime yaz",
      hint: "Ilk vahiyde gecen emir.",
      explanation:
        "Bolumde 'oku' emri, bilginin pesine dusmenin tavsiye degil sorumluluk oldugunu gosterir.",
    },
    {
      id: "s1-q030",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Ilk bolume gore Islam inanci sadece kalpte kalan bir kabul degil, hayata yon veren bir sorumluluk duzenidir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, inanci ibadetlerden toplumsal hayata uzanan sorumluluklar butunu icinde ele alir.",
    },
    {
      id: "s1-q031",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Metinde mutlak ve kusatici bilginin yalniz _____ ait oldugu vurgulanir.",
      answers: ["allah'a", "allah", "allaha"],
      placeholder: "Kisa cevabi yaz",
      hint: "Tek ozel isim bekleniyor.",
      explanation:
        "Bolum, insan bilgisini degerli ama sinirli; mutlak bilgiyi ise yalniz Allah'a ait kabul eder.",
    },
    {
      id: "s1-q032",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Delile dayanmayan zan ve kuruntu, bolumde bilgi degeri tasiyan saglam tutumlar arasinda sayilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, zanni ve delilsiz soylemleri elestirir; bilgi degerini delile dayali ve kuskudan arinmis olmaya baglar.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
