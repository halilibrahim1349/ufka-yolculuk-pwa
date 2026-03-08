(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s2");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s2-q021",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bolume gore insan sadece bedenden ibaret degildir; bu nedenle ruhun da inanma ve _____ ihtiyaci vardir.",
      answers: ["guvenme", "guven"],
      placeholder: "Tek kavram yaz",
      hint: "Inanma ile birlikte anilan ikinci temel ihtiyac.",
      explanation:
        "Metin, ruh boyutunu vurgulayarak insanin sadece fiziksel degil; inanma ve guvenme ihtiyaci tasiyan bir varlik oldugunu belirtir.",
    },
    {
      id: "s2-q022",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore iman, on kabul ve ihtimal tasiyan zayif bir kanaat anlamina gelir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, on kabul ve ihtimal tasiyan zemini 'inanc' olarak ayirir; imani ise kuskudan arinmis kesinlik ve baglilik olarak tanimlar.",
    },
    {
      id: "s2-q023",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore iman, bilgiye, iradeye ve _____ tercihe dayanan kararli bir kalp fiilidir.",
      answers: ["bilincli", "bilinçli"],
      placeholder: "Tek sifat yaz",
      hint: "Rastgeleligi dislayan nitelik.",
      explanation:
        "Bolum, imani caresizlikten dogan bir siginak olarak degil; bilgi ve iradeyle birlikte bilincli tercihe dayanan bir yonelis olarak kurar.",
    },
    {
      id: "s2-q024",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore guzel davranislara donusmeyen bir iman, olgunlasmamis ve eksik bir gorunum sergiler.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, salih amel ve ahlaki davranislarin imanla bagini guclu kurar; disa yansimayan imani eksik bir gorunum olarak degerlendirir.",
    },
    {
      id: "s2-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Dijital cagda inanc alanindaki savrulmayi azaltmak icin bolum, temel kaynaklara donmeyi ve bir _____ danismayi onermektedir.",
      answers: ["bilene", "güvenilir bilene", "guvenilir bilene"],
      placeholder: "Kisa ifadeyi yaz",
      hint: "Metindeki ikili uyarinin ikinci parcasi.",
      explanation:
        "Bolum, bilgi bollugu icinde kontrolsuz hareket etmeyi riskli gorur; temel kaynaklara donmeyi ve bir bilene danismayi on plana cikarir.",
    },
    {
      id: "s2-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Tekfir konusunda bolum, farkli yorum sahibi olmayi tek basina yeterli sebep saymaktadir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bu bolumde tekfir, farkli yorumlar veya feri alanlar uzerinden degil; sabit iman esaslarinin acik inkari gibi agir durumlar uzerinden degerlendirilir.",
    },
    {
      id: "s2-q027",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Intihar meselesinde bolum, hayatin Allah'in bir _____ oldugunu hatirlatarak kisinin kendi hayatini sona erdirme yetkisini reddeder.",
      answers: ["emaneti", "emanet", "emaneti oldugunu"],
      placeholder: "Tek kavram yaz",
      hint: "Hayatin sahiplik degil sorumluluk yonunu anlatan kelime.",
      explanation:
        "Bolum, hayati Allah'in emaneti olarak gorur; boylece insanin kendi hayatini mutlak tasarruf konusu yapamayacagini savunur.",
    },
    {
      id: "s2-q028",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore iman, insanin psikolojik direncini azaltan ve onu sadece edilgen teselliye iten bir unsur olarak islenir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, imani edilgen bir avunma bicimi olarak degil; psikolojik dayanak, guven ve toparlanma zemini olarak anlatir.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
