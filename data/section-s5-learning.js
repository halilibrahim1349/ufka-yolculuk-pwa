(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s5");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s5-q013",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore melekler, Allah'a isyan etmeyen ve kendilerine verilen _____ eksiksiz yerine getiren varliklardir.",
      answers: ["gorevleri", "gorevi"],
      placeholder: "Tek kelime veya kisa ifade yaz",
      hint: "Meleklerin islevini anlatan temel kelime.",
      explanation:
        "Bolumde melekler, ilahi emirle gorevlendirilen ve bu gorevleri eksiksiz yerine getiren varliklar olarak tanitilir.",
    },
    {
      id: "s5-q014",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore cinler hakkindaki her halk anlatisi, vahiy kadar guvenilir bilgi kaynagi sayilabilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, cinler hakkinda dogru bilginin halk anlatilarindan degil, kitap ve sunnetin cizdigi cerceveden alinmasi gerektigini vurgular.",
    },
    {
      id: "s5-q015",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Iblis'in secde emrine karsi cikisi, bu bolumde ozellikle kibir ve _____ ile aciklanir.",
      answers: ["kiskanclik", "kiskancligi"],
      placeholder: "Tek kavram yaz",
      hint: "Kibirle birlikte anilan ikinci olumsuz tutum.",
      explanation:
        "Metin, Iblis'in sapisini yalniz dis etkilerle degil; kibir ve kiskanclik gibi ic bozulmalarla aciklar.",
    },
    {
      id: "s5-q016",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore reenkarnasyon, Islam'in olum-dirilis-ahiret cizgisiyle uyumlu temel bir ogretidir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, reenkarnasyonu Islam'in tek dunya hayati, olum, dirilis ve ahiret cizgisiyle bagdasmayan bir dusunce olarak elestirir.",
    },
    {
      id: "s5-q017",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolum, gorunen ve gorunmeyen alanlari birlikte kusatan varlik anlayisini _____ bir bakis olarak niteler.",
      answers: ["butuncul"],
      placeholder: "Tek sifat yaz",
      hint: "Parcalamayan, birlikte ele alan anlaminda.",
      explanation:
        "Kur'an'in varlik tasavvuru, sadece duyularla algilanani degil gorunmeyen alemi de iceren butuncul bir yapi olarak sunulur.",
    },
    {
      id: "s5-q018",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore seytanin vesvesesi etkili olsa da insanin nefs ve tercihi sorumlulugu ortadan kalkmaz.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, kotulugu sadece dis etkilerle aciklamaz; insanin nefsi ve tercihi de sorumluluk alaninda tutulur.",
    },
    {
      id: "s5-q019",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Meleklerin fizik sinirlara insanlar gibi bagli olmamasi, bu bolumde onlari _____ varliklar olarak dusunmenin sonucudur.",
      answers: ["nurani", "nuranI"],
      placeholder: "Tek sifat yaz",
      hint: "Meleklerin yaratilis yapisini anlatan kelime.",
      explanation:
        "Bolumde melekler nurani varliklar olarak anlatildigi icin insanlarin bedensel sinirlari onlar icin zorunlu kabul edilmez.",
    },
    {
      id: "s5-q020",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore gorunmeyen aleme iman etmek, akli tumuyle devre disi birakmak anlamina gelir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, gorunmeyen alemi kabul etmenin akli terk etmek degil, vahyin bildirdigi kadariyla gercekligi daha genis kavramak oldugunu savunur.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
