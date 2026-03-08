(function () {
  const section = (window.UFKA_DATA?.sections || []).find((item) => item.id === "s3");
  if (!section) {
    return;
  }

  const additions = [
    {
      id: "s3-q025",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Bolume gore imanin asli, kalp ile _____; toplumsal gorunurlugu ise dil ile ikrardir.",
      answers: ["tasdik"],
      placeholder: "Tek kavram yaz",
      hint: "Ikrar ile birlikte anilan temel unsur.",
      explanation:
        "Bu bolum, imanin merkezini kalbin tasdiki olarak kurar; dil ile ikrari ise bu ic onayin gorunur ifadesi sayar.",
    },
    {
      id: "s3-q026",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore buyuk gunah isleyen Musluman, gunahi helal saymadigi surece dogrudan imandan cikmis kabul edilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Ehl-i Sunnet cizgisinde buyuk gunah, gunahkar ve fasik bir durum dogurur; fakat kisi gunahi helal saymadigi surece imandan ciktigi soylenmez.",
    },
    {
      id: "s3-q027",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Taklidi imandan daha ust bir seviye olarak anlatilan ayrintili ve bilincli iman bicimi _____ imandir.",
      answers: ["tafsili", "tafsilî"],
      placeholder: "Tek sifat yaz",
      hint: "Taklidin karsisinda duran kavram.",
      explanation:
        "Bolum, taklidi imani gecersiz saymaz; ancak ayrintili, bilincli ve temellendirilmis imani tafsili iman olarak daha ust bir duzeyde konumlandirir.",
    },
    {
      id: "s3-q028",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bu bolume gore amel, imanin ayrilmaz ozu degil; onu tamamlayan ve guzellestiren boyut olarak degerlendirilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 0,
      explanation:
        "Metin, ameli imanin asli ile ozdeslestirmez; fakat onu tamamlayan, guclendiren ve disa tasiyan boyut olarak ele alir.",
    },
    {
      id: "s3-q029",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Kalpte karsiligi olmayan sozlu _____, bolume gore gercek iman sayilmaz.",
      answers: ["ikrar"],
      placeholder: "Tek kavram yaz",
      hint: "Tasdikin disa vuran dil boyutu.",
      explanation:
        "Bu bolum, dil ile ikrari onemser; ancak kalpte tasdik olmadiginda salt sozlu ikrarin yeterli olmayacagini acikca belirtir.",
    },
    {
      id: "s3-q030",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore imanda sayisal artma ve eksilme kabul edilir; buna karsilik kalite farki reddedilir.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Metin, sayisal artma-azalma yerine sevgi, yakin, teslimiyet ve bilinclilik bakimindan nitelik farkini kabul eder.",
    },
    {
      id: "s3-q031",
      type: "knowledge",
      interaction: "fill",
      difficulty: "Ogretici Pekistirme",
      stem: "Boslugu doldur: Buyuk gunah isleyen fakat bunu helal saymayan Musluman, bu bolumde gunahkar ve _____ olarak nitelenir.",
      answers: ["fasik", "fasık"],
      placeholder: "Tek kavram yaz",
      hint: "Ehl-i Sunnet kelamindaki niteleme.",
      explanation:
        "Bolum, buyuk gunah ile kufru ozdeslestirmez; fakat bu durumda kisiyi gunahkar ve fasik olarak niteleyen cizgiyi benimser.",
    },
    {
      id: "s3-q032",
      type: "knowledge",
      interaction: "true-false",
      difficulty: "Ogretici Pekistirme",
      stem: "Dogru / Yanlis: Bolume gore bilgi ile iman tamamen ozdestir; bir seyi bilen herkes zorunlu olarak o seyi iman konusu olarak benimsemis olur.",
      options: ["Dogru", "Yanlis"],
      correctIndex: 1,
      explanation:
        "Bu bolumde bilgi, imana giden yolu acan arac olarak degerli gorulur; fakat imanin belirleyici unsuru, bilginin kalpte tasdike donusmesidir.",
    },
  ];

  const existingIds = new Set(section.questions.map((question) => question.id));
  section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
})();
