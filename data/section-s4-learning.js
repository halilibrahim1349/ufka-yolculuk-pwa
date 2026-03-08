(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s4");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s4-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore Allah'a iman, diger iman esaslarini anlamlandiran kurucu _____ olarak ele alinir.",
      answers: ["ilke", "esas ilke", "koku ilke", "kok ilke"],
      placeholder: "Tek kavram yaz",
      hint: "Metinde kok ve belirleyicilik vurgusuyla gecen kelime.",
      explanation:
        "Bolum, Allah'a imani diger esaslardan biri gibi degil; butun sistemi ayakta tutan kurucu ilke olarak konumlandirir.",
    },
    {
      id: "s4-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore bilim ile Allah inanci birbirini zorunlu olarak dislayan iki rakip alandir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, bilimi reddetmez; fakat surec aciklamasinin ilk sebep ve nihai anlam sorusunu tek basina tuketmedigini belirtir.",
    },
    {
      id: "s4-q027",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Evrenin yaratilmis ve baslangicli olusundan hareket eden delil, bu bolumde _____ delili olarak anilir.",
      answers: ["hudus", "hüdus"],
      placeholder: "Tek kavram yaz",
      hint: "Baslangiclilik vurgusuyla bilinen klasik delil.",
      explanation:
        "Hudus delili, evrenin ezeli olmayip sonradan var edilmis oldugunu merkeze alarak yaratici fikrine ulasir.",
    },
    {
      id: "s4-q028",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Imkan delili, mumkun varliklarin kendi basina zorunlu varlik statusu tasidigini savunur.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Imkan delili tam tersine, mumkun varliklarin kendi basina zorunlu olmadigini ve tercih edici iradeye ihtiyac duydugunu soyler.",
    },
    {
      id: "s4-q029",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Kainattaki olcu, uyum ve amaca dikkat ceken delil, bolumde gaye-_____ delili diye anilmaktadir.",
      answers: ["nizam"],
      placeholder: "Tek kavram yaz",
      hint: "Gaye ile birlikte kullanılan ikinci kelime.",
      explanation:
        "Gaye-nizam delili, kainattaki olculu duzeni ve amaca uygunlugu ilahi ilim ve hikmetle birlikte dusunur.",
    },
    {
      id: "s4-q030",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Haberi sifatlar konusunda bu bolum, Allah'i yaratilmislara birebir benzeten tesbihci yaklasimi benimser.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, haberi sifatlari ne inkar eder ne de yaratilmislara benzetir; tevhidi koruyan ve teshihsiz anlama cizgisini izler.",
    },
    {
      id: "s4-q031",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Allah'in hicbir seye benzememesi ve tevhidin korunmasi, bu bolumde ozellikle _____ ilkesini guclendirir.",
      answers: ["tenzih", "tenzih ilkesini"],
      placeholder: "Tek kavram yaz",
      hint: "Benzetmeyi reddeden kelami ilke.",
      explanation:
        "Bu bolumde Allah'in sifatlari konusulurken tenzih ilkesi esas alinir; Allah yaratilmislara benzetilmeden taninmaya calisilir.",
    },
    {
      id: "s4-q032",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Gayb bilgisi iddiasinda bulunan kahinleri dogrulamak, bu bolumde inanc acisindan risksiz ve normal bir tutum olarak anlatilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, gayb iddiasini ve kahin tasdikini tevhid acisindan sakincali gorur; bu tur iddialardan uzak durulmasini ister.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
