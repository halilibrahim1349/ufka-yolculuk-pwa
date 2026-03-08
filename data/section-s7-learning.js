(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s7");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s7-q019",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore peygamberlerin dogrulugunu ifade eden temel sifat _____ olarak adlandirilir.",
      answers: ["sidk", "sIdk"],
      placeholder: "Tek kavram yaz",
      hint: "Dogruluk anlamina gelen klasik sifat.",
      explanation:
        "Sidk, peygamberin soz ve haberinde tam dogruluk sahibi olmasini ifade eden temel niteliktir.",
    },
    {
      id: "s7-q020",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore peygamberlerin insan olusu, rehberliklerini zayiflatan bir eksikliktir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, peygamberlerin insan olusunu eksiklik degil, ornek olabilmelerinin temel sarti olarak gorur.",
    },
    {
      id: "s7-q021",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore vahyi insanlara eksiksiz ulastirma gorevi, peygamberlerin _____ sifatiyla ilgilidir.",
      answers: ["teblig"],
      placeholder: "Tek kavram yaz",
      hint: "Bildirme, ulastirma anlamindaki sifat.",
      explanation:
        "Teblig, peygamberin aldigi vahyi eksiltmeden ve gizlemeden insanlara ulastirmasi demektir.",
    },
    {
      id: "s7-q022",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore Allah'a iman ettigini soyleyen kimse, O'nun gonderdigi son peygamberi reddetse de inanc sistemi butunlugunu korur.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, Allah'a imanin O'nun bildirdigi son peygamberi de kabul etmeyi gerektirdigini vurgular.",
    },
    {
      id: "s7-q023",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Hz. Muhammed'e verilen ve kiyamete kadar suren temel mucize, bu bolume gore _____'dir.",
      answers: ["kuran", "kuran-i kerim", "kurani kerim"],
      placeholder: "Kisa cevap yaz",
      hint: "Surekli mucize olarak anilan vahiy.",
      explanation:
        "Bolum, Hz. Peygamber'in en buyuk ve surekli mucizesi olarak Kur'an'i one cikarir.",
    },
    {
      id: "s7-q024",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore sunnet, Kur'an'dan bagimsiz ikinci bir din kurdugu icin degil; Kur'an'in nasil yasanacagini gosterdigi icin vazgecilmezdir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, sunneti vahyin hayattaki gorunur uygulamasi ve yasama kilavuzu olarak tanimlar.",
    },
    {
      id: "s7-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore peygamberlerin vahyin guvenini zedeleyecek gunah ve hatalardan korunmuslugu _____ sifatiyla ifade edilir.",
      answers: ["ismet"],
      placeholder: "Tek kavram yaz",
      hint: "Korunmusluk anlamindaki sifat.",
      explanation:
        "Ismet, peygamberlerin vahyin guvenilirligini zedeleyecek gunah ve hatalardan korunmus olmalarini ifade eder.",
    },
    {
      id: "s7-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore butun peygamberlere iman etmek gerekir; muminin bazilarini secip bazilarini disarida birakma hakki yoktur.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Bolum, peygamberler arasinda iman bakimindan ayrim yapilmayacagini acikca savunur.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
