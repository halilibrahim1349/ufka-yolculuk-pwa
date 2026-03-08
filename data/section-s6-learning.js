(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s6");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s6-q019",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore ilahi kitaplar, insanlarin ihtilafa dustugu anlarda basvurabilecegi kalici bir _____ kaynagidir.",
      answers: ["rehber", "olcu", "rehberlik"],
      placeholder: "Tek kelime veya kisa ifade yaz",
      hint: "Yolu gosteren kaynak anlaminda.",
      explanation:
        "Metin, ilahi kitaplari insanin yolunu bulmasi icin basvurabilecegi kalici rehberler olarak tanimlar.",
    },
    {
      id: "s6-q020",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore onceki kutsal metinlerle ilgili elestiri, vahyin kendisine degil tarih icindeki insan mudahalesine yoneliktir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Bolum, onceki vahiylerin asliyla degil; korunamama ve tahrif sorunu ile ilgilenir.",
    },
    {
      id: "s6-q021",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Kur'an'in yirmi uc yilda parca parca inmesi, bu bolumde onun korunmuslugunu destekleyen _____ inis sureci olarak degerlendirilir.",
      answers: ["tedrici", "asama asama"],
      placeholder: "Tek sifat yaz",
      hint: "Bir anda degil, asamali olma hali.",
      explanation:
        "Tedrici nuzul, yazdirma, ezberleme ve kontrol surecleriyle birlikte Kur'an'in korunmusluguna delil olarak sunulur.",
    },
    {
      id: "s6-q022",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore Kur'an'in acik bir kitap olmasi, butun ayetlerinin tek katmanli ve derinlikten yoksun oldugu anlamina gelir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, Kur'an'in ana hidayet mesaji bakimindan acik oldugunu; fakat kimi ayetlerde daha derin anlam katmanlari bulundugunu soyler.",
    },
    {
      id: "s6-q023",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bu bolume gore bazi ayetleri oncesi ve sonrasindan kopararak yorumlamak, ayetin _____ kaybettirir.",
      answers: ["baglamini", "baglam"],
      placeholder: "Tek kavram yaz",
      hint: "Bir sozun soylendigi butun cevre.",
      explanation:
        "Bolum, ayetlerin baglamdan koparilmasinin hitap ettigi durum ve anlami gorunmez kildigini vurgular.",
    },
    {
      id: "s6-q024",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore kissalarin asil islevi, gecmisi salt kronolojik ayrintilariyla belgelemektir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, kissalari yalniz kronoloji degil; tarihten evrensel mesaj ureten canli hitaplar olarak yorumlar.",
    },
    {
      id: "s6-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Kur'an'in onceki vahiylerle iliskisi bu bolumde 'dogrulayan ve _____' bir kitap olma ekseninde anlatilir.",
      answers: ["aciklayan", "tamamlayan"],
      placeholder: "Tek fiilimsI yaz",
      hint: "Dogrulamaya eklenen ikinci islev.",
      explanation:
        "Bolum, Kur'an'i onceki vahiylerin hakikatini dogrulayan ve aciklayici/toparlayici islev goren son kitap olarak konumlandirir.",
    },
    {
      id: "s6-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore mutesabih ayetlerin bulunmasi, Kur'an'in ana mesajinin genel olarak anlasilamaz oldugunu gosterir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bolum, mutesabih ayetlerin varligini Kur'an'in genel hidayet acikligina aykiri gormez; nihai kusaticiligin Allah'a ait oldugunu belirtir.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
