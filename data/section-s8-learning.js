(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s8");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s8-q019",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore olum, yok olus degil dunya hayatindan _____ hayatina gecistir.",
      answers: ["ahiret", "ahiret hayatina"],
      placeholder: "Tek kavram yaz",
      hint: "Dunya sonrasi safha.",
      explanation:
        "Metin olumu yok olus olarak degil, ahiret hayatina acilan bir gecis olarak yorumlar.",
    },
    {
      id: "s8-q020",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore ahiret inanci dunya hayatinin ciddiyetini azaltir ve sorumluluk duygusunu zayiflatir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, ahiret inancinin dunya hayatina amac, yon ve hesap bilinci kazandirdigini soyler.",
    },
    {
      id: "s8-q021",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Kabirde oluyu sorguya cekecek melekler bu bolumde Munker ve _____ olarak anilir.",
      answers: ["nekir"],
      placeholder: "Tek isim yaz",
      hint: "Munker ile birlikte anilan ikinci isim.",
      explanation:
        "Munker ve Nekir, kabir sorgusuyla iliskilendirilen iki melek olarak anlatilir.",
    },
    {
      id: "s8-q022",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore dirilisin nasil gerceklesecegini tam bilememek, onun aklen imkansiz oldugunu gosterir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, ayrintiyi bilememeyi imkansizlik saymaz; ilk yaratilis mumkun olduguna gore yeniden yaratilis da aklen reddedilmez.",
    },
    {
      id: "s8-q023",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore insan hayati Allah'in bir _____ oldugu icin kisi onu keyfine gore sonlandiramaz.",
      answers: ["emaneti", "emanet"],
      placeholder: "Tek kavram yaz",
      hint: "Insana teslim edilmis sorumluluk anlaminda.",
      explanation:
        "Bolum, hayati ilahi emanet olarak gorur; o nedenle intihar ve otenazi meselesine bu eksenden itiraz eder.",
    },
    {
      id: "s8-q024",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore intihar buyuk gunah olsa da kisi imani varsa dogrudan kufurle ozdeslestirilmez.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, intihari agir gunah sayar; ancak bunu otomatik olarak kufur hukmuyle aynilastirmaz.",
    },
    {
      id: "s8-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Allah'i ahirette gorme meselesi, bu bolumde _____ olarak bilinen baslik altinda ele alinir.",
      answers: ["ruyetullah", "ru yetullah"],
      placeholder: "Tek kavram yaz",
      hint: "Ahirette Allah'i gorme konusu.",
      explanation:
        "Bolumde ruyetullah, dunya gorus sartlarina indirgenmeden ahirette mumkun gorulen bir mesele olarak islenir.",
    },
    {
      id: "s8-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore sefaat mutlak ve bagimsiz bir yetkidir; Allah'in izni olmadan da gerceklesebilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, sefaatin ancak Allah'in izni ve onayi ile gerceklesecegini vurgular.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
