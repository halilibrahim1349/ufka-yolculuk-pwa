(() => {
  window.UFKA_SPECIAL_EXAMS = window.UFKA_SPECIAL_EXAMS || {};

  const directKnowledgeQuestion = (id, sectionId, stem, options, correctIndex, explanation) => ({
    id,
    sectionId,
    type: "knowledge",
    difficulty: "Bilgi Deneme Cok Zor",
    stem,
    options,
    correctIndex,
    explanation,
  });

  window.UFKA_SPECIAL_EXAMS.ufkaStyle100 = {
    id: "ufka-style-100",
    title: "Ufka Yolculuk Tarzi Sinav Sorulari",
    shortTitle: "Ufka Tarzi 100",
    durationMinutes: 100,
    questionCount: 100,
    range: "5 sikli - 100 soru - 100 dakika",
    description:
      "Resmi Ufka Yolculuk formatindaki 5 sikli ana sinav ve mini deneme yapisi incelenerek, uygulamadaki en guclu ana test sorularindan secilen 100 soruluk ozel deneme.",
    details: [
      "Kavram ayrimi, yorum, cikarim ve paragraf agirligi yuksek tutuldu.",
      "Resmi ana sinav mantigina benzer sekilde 5 sikli ve sureli akis kullanildi.",
      "Soru dagilimi butun konu katmanlarini kapsayacak sekilde sabit planla kuruldu.",
    ],
    sectionPlan: [
      { sectionId: "s1", knowledge: 5, paragraph: 7 },
      { sectionId: "s2", knowledge: 5, paragraph: 6 },
      { sectionId: "s3", knowledge: 5, paragraph: 6 },
      { sectionId: "s4", knowledge: 5, paragraph: 7 },
      { sectionId: "s5", knowledge: 4, paragraph: 6 },
      { sectionId: "s6", knowledge: 5, paragraph: 6 },
      { sectionId: "s7", knowledge: 5, paragraph: 6 },
      { sectionId: "s8", knowledge: 5, paragraph: 6 },
      { sectionId: "s9", knowledge: 5, paragraph: 6 },
    ],
  };

  window.UFKA_SPECIAL_EXAMS.bookKnowledge100 = {
    id: "book-knowledge-100",
    title: "Bilgi Deneme Testi",
    shortTitle: "Bilgi 100",
    durationMinutes: 100,
    questionCount: 100,
    range: "Dogrudan bilgi ve ezber - 100 soru - 100 dakika",
    description:
      "Yalniz kitaptaki bilgi omurgasi taranarak kurulan, paragraf yerine dogrudan kavram, tanim, ayirim ve ezber odakli 100 soruluk deneme oturumu.",
    details: [
      "Tum bolumlerden dogrudan bilgi sorulari icinde tutuldu.",
      "Mevcut knowledge havuzu taban alindi; eksik kalan kisim yine kitaptan turetilmis yeni bilgi sorulariyla tamamlandi.",
      "Yorumdan cok tanim, ayirt etme, isimlendirme ve temel baglanti olcumu hedeflendi.",
    ],
    sectionPlan: [
      { sectionId: "s1", knowledge: 10, paragraph: 0 },
      { sectionId: "s2", knowledge: 10, paragraph: 0 },
      { sectionId: "s3", knowledge: 12, paragraph: 0 },
      { sectionId: "s4", knowledge: 12, paragraph: 0 },
      { sectionId: "s5", knowledge: 6, paragraph: 0 },
      { sectionId: "s6", knowledge: 9, paragraph: 0 },
      { sectionId: "s7", knowledge: 9, paragraph: 0 },
      { sectionId: "s8", knowledge: 9, paragraph: 0 },
      { sectionId: "s9", knowledge: 9, paragraph: 0 },
    ],
    extraQuestions: [
      directKnowledgeQuestion(
        "bk100-q001",
        "s1",
        "Ilk bolume gore halk arasinda akaid bilgisi cogu zaman hangi ifadeyle hatirlanir?",
        ["Ahlakin esaslari", "Ibadetin sartlari", "Imanin sartlari", "Tasavvufun adabi", "Tefekkur yolları"],
        2,
        "Ilk bolum, akaid bilgisinin halk arasinda daha cok imanin sartlari diliyle hatirlandigini belirtir."
      ),
      directKnowledgeQuestion(
        "bk100-q002",
        "s1",
        "Metne gore insan olduktan sonra da deger uretmeyi surdurebilen bilgi hangisidir?",
        ["Faydali bilgi", "Siyasi bilgi", "Gecici bilgi", "Salt teorik bilgi", "Yarismaci bilgi"],
        0,
        "Bolum, faydali bilginin insan olduktan sonra bile deger uretmeye devam ettigini vurgular."
      ),
      directKnowledgeQuestion(
        "bk100-q003",
        "s2",
        "Ikinci bolume gore insan neden sadece bedensel ihtiyaclarla aciklanamaz?",
        ["Cunku sadece akildan ibarettir", "Cunku toplumsal bir varliktir", "Cunku ruhunun da inanma ve guvenme ihtiyaci vardir", "Cunku biyolojik ihtiyaclari yoktur", "Cunku duygulari gecicidir"],
        2,
        "Metin, insanin sadece bedenden ibaret olmadigini; ruhunun da inanma ve guvenme ihtiyaci tasidigini soyler."
      ),
      directKnowledgeQuestion(
        "bk100-q004",
        "s2",
        "Bolume gore hayat uzerindeki mutlak tasarruf hakkini insana vermeyen temel kavram hangisidir?",
        ["Mukellefiyet", "Emanet", "Kabiliyet", "Firsat", "Kisilik"],
        1,
        "Bolum, hayati Allah'in emaneti olarak gorur; bu da insanin mutlak tasarruf hakkina sahip olmadigini gosterir."
      ),
      directKnowledgeQuestion(
        "bk100-q005",
        "s3",
        "Imanin ozu ile amelin iliskisi ucuncu bolumde nasil kurulmustur?",
        ["Amel imanin yerine gecer", "Amel imanin asli degil, onu tamamlayan boyuttur", "Amel gereksiz ayrintidir", "Amel sadece toplumsal gorunumdur", "Amel imani zayiflatir"],
        1,
        "Metin, ameli imanin asli ile ozdeslestirmez; onu tamamlayan ve guzellestiren boyut olarak aciklar."
      ),
      directKnowledgeQuestion(
        "bk100-q006",
        "s3",
        "Ehl-i Sunnet cizgisinde buyuk gunah isleyen fakat bunu helal saymayan Musluman nasil nitelendirilir?",
        ["Peygamber", "Masum", "Fasik gunahkar", "Musrik", "Melek"],
        2,
        "Bolum, boyle bir kisinin imandan cikmayacagini; fakat gunahkar ve fasik olarak nitelenebilecegini belirtir."
      ),
      directKnowledgeQuestion(
        "bk100-q007",
        "s4",
        "Allah'in varligina dair deliller arasinda evrendeki duzen ve amaci birlikte one cikarani hangisidir?",
        ["Hudus delili", "Imkan delili", "Gaye-nizam delili", "Hissi delil", "Orf delili"],
        2,
        "Dorduncu bolumde gaye-nizam delili, evrendeki duzen ve amacin yaraticiya isaret ettigini anlatir."
      ),
      directKnowledgeQuestion(
        "bk100-q008",
        "s4",
        "Tevhid ilkesine gore Allah'in sifatlari konusunda korunmasi gereken temel cizgi hangisidir?",
        ["Allah'i yaratilmislara benzetmek", "Allah'i tamamen bilinmez saymak", "Allah'in hicbir seye benzemedigini korumak", "Sifatlari sadece mecaz kabul etmek", "Sifatlari ahlaka indirgemek"],
        2,
        "Metin, tevhid ilkesi geregi Allah'in hicbir seye benzemedigini ve sifatlarin bu cizgiyi bozmayacak sekilde anlasilmasi gerektigini soyler."
      ),
      directKnowledgeQuestion(
        "bk100-q009",
        "s5",
        "Besinci bolume gore reenkarnasyon dusuncesi neden uygun gorulmez?",
        ["Cunku melekleri reddeder", "Cunku Islam tek dunya hayati, olum, dirilis ve ahiret cizgisi kurar", "Cunku sadece filozoflar savunur", "Cunku bilim tamamen kanitlamistir", "Cunku ibadeti azaltir"],
        1,
        "Bolum, Islam inancisinin tek dunya hayati, olum, dirilis ve ahiret cizgisini esas aldigini belirtir."
      ),
      directKnowledgeQuestion(
        "bk100-q010",
        "s6",
        "Kur'an'in korunmuslugunu guclendiren unsurlardan biri alti bolume gore hangisidir?",
        ["Sadece sozlu aktarim", "Yirmi uc yilda indirilmesi, yazdirilmasi ve kontrol edilmesi", "Sadece hukuk ayetlerinden olusmasi", "Tek gecede ezberlenmesi", "Yalniz alimlere hitap etmesi"],
        1,
        "Metin, Kur'an'in tedrici nuzulunu, yazdirilmasini ve kontrol edilmesini korunmusluk temasinin parcasi sayar."
      ),
      directKnowledgeQuestion(
        "bk100-q011",
        "s7",
        "Yedinci bolume gore Hz. Muhammed'e verilen ve kiyamete kadar suren temel mucize hangisidir?",
        ["Mirac", "Ayin yarilmasi", "Kur'an", "Bedir zaferi", "Hicret"],
        2,
        "Bolum, Hz. Muhammed'in surekli ve kiyamete kadar devam eden temel mucizesini Kur'an olarak niteler."
      ),
      directKnowledgeQuestion(
        "bk100-q012",
        "s8",
        "Ahiret asamalarindan hangisi sekizinci bolumde olumle birlikte hesabin baslangic cizgisi icinde anilir?",
        ["Mizan ve kabir hayati", "Kabir sorgusu ve amel defteri", "Sadece cennet", "Sadece cehennem", "Sadece dunya hayati"],
        1,
        "Bolum, kabir hayati, sorgu ve amel defteri gibi asamalari insanin yaptiklarinin kayitsiz kalmadigini gosteren basliklar halinde anlatir."
      ),
      directKnowledgeQuestion(
        "bk100-q013",
        "s8",
        "Ru'yetullah konusunda sekizinci bolumde benimsenen gorus hangisidir?",
        ["Allah hicbir durumda gorulemez", "Ahirette Allah'in gorulebilmesi mumkundur", "Ru'yetullah sadece dunya icindir", "Yalniz melekler gorur", "Bu mesele imanla ilgisizdir"],
        1,
        "Bolum, muminlerin ahirette Allah'i gorebilecegini savunan cizgiyi benimser."
      ),
      directKnowledgeQuestion(
        "bk100-q014",
        "s9",
        "Dokuzuncu bolume gore alin yazisi kavrami en dogru nasil anlasilmalidir?",
        ["Alinda yazili somut metin olarak", "Burclarin yonettigi kader olarak", "Allah'in takdirini mecazi anlatan ifade olarak", "Sadece olum tarihi olarak", "Kismetten bagimsiz sans olarak"],
        2,
        "Bolum, alin yazisini Allah'in takdirini mecazi bicimde anlatan ifade olarak aciklar."
      ),
    ],
  };
})();
