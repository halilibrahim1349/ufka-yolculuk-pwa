(function () {
  const sections = window.UFKA_DATA?.sections || [];
  if (!sections.length) {
    return;
  }

  const additionsBySection = {
    s1: [
      {
        id: "s1-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Metne gore eski akaid kitaplari kendi devirlerinin sorunlarina cevap vermis olsa da, bugun inanc konularinin daha _____ ve anlasilir bir dille yeniden anlatilmasi gerekir.",
        answers: ["guncel", "guncellenmis"],
        placeholder: "Ana kavrami yaz",
        hint: "Bugune hitap etme vurgusunu veren sifat.",
        explanation:
          "Ilk bolum, klasik akaid birikimini degerli bulur; ancak degisen bilgi ve iletisim ortaminda inanc konularinin guncel bir dille yeniden anlatilmasi gerektigini belirtir.",
      },
      {
        id: "s1-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Saglam inanc, onyargisiz akil ile _____ birlikte degerlendirilerek kurulur.",
        answers: ["vahiy"],
        placeholder: "Tek kavram yaz",
        hint: "Aklin tek basina birakilmadigi ilahi kaynak.",
        explanation:
          "Bolum, akli dislamadan ama onu vahiy ile birlikte dusunerek saglam inanca ulasilabilecegini vurgular.",
      },
      {
        id: "s1-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Akaid, halk arasinda cogu zaman '_____ sartlari' ifadesiyle hatirlanir.",
        answers: ["imanin", "iman"],
        placeholder: "Tek kelime yaz",
        hint: "Amentu basligiyla birlikte anilan temel kavram.",
        explanation:
          "Metin, akaid bilgisinin halk arasinda daha cok imanin sartlari veya amentu diliyle hatirlandigini belirtir.",
      },
      {
        id: "s1-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Metin, zanna ve delilsiz iddialara dayali kabulleri bilgi degeri tasiyan saglam zeminler arasinda sayar.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 1,
        explanation:
          "Ilk bolum, zanni ve delilsiz kabulleri elestirir; bilgi degerini delile dayali ve kuskudan arinmis olusa baglar.",
      },
    ],
    s2: [
      {
        id: "s2-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Insanin inanmaya yonelen yaratilisina _____ denir.",
        answers: ["fitrat"],
        placeholder: "Temel kavrami yaz",
        hint: "Yaratilistan gelen yonelis kavrami.",
        explanation:
          "Bu bolum, inanmanin insanin fitratinda bulundugunu ve inkarin bu dogal yonelise ters dustugunu savunur.",
      },
      {
        id: "s2-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Inanc ihtimal tasiyabilir; kuskudan arinmis kesin baglilik ise _____dir.",
        answers: ["iman"],
        placeholder: "Tek kavram yaz",
        hint: "Kesinlik ve guven ifade eden dini baglilik.",
        explanation:
          "Bolum, inanc ile imani ayirir; imani kuskudan arinmis kesinlik ve baglilik hali olarak tanimlar.",
      },
      {
        id: "s2-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Iman, rastgele bir siginak degil; bilgiye, iradeye ve bilincli _____ dayanan kararli bir kalp fiilidir.",
        answers: ["tercihe", "tercih"],
        placeholder: "Ana kelimeyi yaz",
        hint: "Iradeyle birlikte anilan secim boyutu.",
        explanation:
          "Metin, imani caresizlikle degil, bilgiye ve bilincli tercihe dayanan kararli bir kalp fiili olarak aciklar.",
      },
      {
        id: "s2-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Dijital cagda kafa karisikligini azaltmak icin bolum, temel kaynaklara donmeyi ve tekfirden kacinmayi oneren bir cizgi kurar.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 0,
        explanation:
          "Bu bolum, kontrolsuz bilgi akisina karsi temel kaynaklara donmeyi, bir bilene danismayi ve tekfirden kacinmayi oneren bir tutum sergiler.",
      },
    ],
    s3: [
      {
        id: "s3-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: En yaygin tanima gore iman, kalp ile _____ ve dil ile ikrardir.",
        answers: ["tasdik"],
        placeholder: "Temel kavrami yaz",
        hint: "Kalbin yaptigi asli fiil.",
        explanation:
          "Bolum, imanin en yaygin tanimini kalp ile tasdik ve dil ile ikrar seklinde verir.",
      },
      {
        id: "s3-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Kalpte karsiligi olmayan sozlu ikrar, gercek _____ sayilmaz.",
        answers: ["iman"],
        placeholder: "Tek kavram yaz",
        hint: "Kalbin tasdiki olmadan tamamlanmayan esas.",
        explanation:
          "Metin, kalpte tasdik bulunmadan yapilan ikrari gercek iman kabul etmez.",
      },
      {
        id: "s3-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Taklidi imandan daha ust seviye kabul edilen bilincli iman turu _____ imandir.",
        answers: ["tafsili"],
        placeholder: "Sifati yaz",
        hint: "Ayrintili ve bilincli iman duzeyi.",
        explanation:
          "Bolum, taklidi imani gecerli gorse de tafsili ve bilincli imani daha ust seviye olarak degerlendirir.",
      },
      {
        id: "s3-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Ehl-i Sunnet'e gore gunah isleyen Musluman, bu gunahi helal saymadigi surece imandan cikmaz.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 0,
        explanation:
          "Metin, gunahkar Muslumanin gunahi helal saymadigi surece imandan cikmayacagini; fakat gunahkar ve fasik olacagini belirtir.",
      },
    ],
    s4: [
      {
        id: "s4-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Allah'in varligini gosteren deliller arasinda yaratilmislik, imkan ve _____ delilleri one cikarilir.",
        answers: ["gaye-nizam", "gaye nizam"],
        placeholder: "Iki kelimelik ifadeyi yaz",
        hint: "Evrendeki duzen ve amaci birlikte anan delil.",
        explanation:
          "Bu bolum, Allah'in varligina dair delilleri yaratilmislik, imkan ve gaye-nizam ekseninde toplar.",
      },
      {
        id: "s4-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Allah'a iman, butun iman esaslarinin _____ ve belirleyici ilkesidir.",
        answers: ["koku"],
        placeholder: "Temel kelimeyi yaz",
        hint: "Temelini bildiren mecazi ifade.",
        explanation:
          "Metin, Allah'a imani diger iman esaslarinin kok ve merkez ilkesi olarak kurar.",
      },
      {
        id: "s4-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Tevhid ilkesi geregi Allah hicbir seye _____.",
        answers: ["benzemez"],
        placeholder: "Tek fiil yaz",
        hint: "Tesbih dilini kuran temel ifade.",
        explanation:
          "Allah'in isim ve sifatlari bahsinde tevhid korunur; Allah'in hicbir seye benzemedigi vurgulanir.",
      },
      {
        id: "s4-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Metin, bilimin surecleri aciklamasini degerli gorur; ancak ilk sebep ve nihai anlam disarida birakildiginda aciklamanin eksik kaldigini soyler.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 0,
        explanation:
          "Bolum, bilim ile Allah inancini karsitlastirmaz; fakat ilk sebep ve nihai anlam dislandiginda aciklamanin yetersiz kalacagini belirtir.",
      },
    ],
    s5: [
      {
        id: "s5-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Melekler, varliklari vahiy ile bildirilen _____ varliklardir.",
        answers: ["nurani"],
        placeholder: "Tek sifat yaz",
        hint: "Meleklerin yaratilis niteligini anlatan sifat.",
        explanation:
          "Bolum, melekleri duyularla algilanamayan ama vahiy ile bildirilen nurani varliklar olarak tanimlar.",
      },
      {
        id: "s5-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Cinler hakkindaki dogru bilgi, halk anlatilarindan degil _____ sinirlari icindeki bilgiden alinmalidir.",
        answers: ["vahyin", "vahiy"],
        placeholder: "Ana kaynagi yaz",
        hint: "Halk anlatilarina karsi temel referans.",
        explanation:
          "Metin, cinlerle ilgili bilginin halk anlatilarindan degil vahyin sinirlari icinde kalan bilgilerden alinmasi gerektigini soyler.",
      },
      {
        id: "s5-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Iblis'in secde emrine karsi cikisi bolumde _____ ve kibirle aciklanir.",
        answers: ["kiskanclik"],
        placeholder: "Tek kavram yaz",
        hint: "Kibirle birlikte anilan duygu.",
        explanation:
          "Bolum, Iblis'in karsi cikisini sadece dis etkiyle degil, kiskanclik ve kibirle aciklar.",
      },
      {
        id: "s5-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Bu bolum, reenkarnasyonu Islam'in tek dunya hayati, olum, dirilis ve ahiret cizgisiyle uyumlu gorur.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 1,
        explanation:
          "Bolum, reenkarne olus fikrini elestirir; Islam inancinin tek dunya hayati, olum, dirilis ve ahiret cizgisiyle kuruldugunu vurgular.",
      },
    ],
    s6: [
      {
        id: "s6-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Onceki vahiylere yonelen elestiri, vahyin kendisine degil metinlere yonelen insan _____ yoneltilir.",
        answers: ["mudahalesine", "mudahalesi"],
        placeholder: "Temel kavrami yaz",
        hint: "Degisime yol actigi vurgulanan insan fiili.",
        explanation:
          "Metin, onceki kitaplarla ilgili problemin vahiyde degil, insan mudahalesinde ortaya ciktigini soyler.",
      },
      {
        id: "s6-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Kur'an'in son kitap olarak ayirt edici yonlerinden biri Allah tarafindan _____ olmasidir.",
        answers: ["korunmus"],
        placeholder: "Sifati yaz",
        hint: "Muhafaza edilmis olma durumu.",
        explanation:
          "Bu bolum, Kur'an'in onceki kitaplardan ayrilan temel yonlerinden birinin Allah tarafindan korunmus olusu oldugunu vurgular.",
      },
      {
        id: "s6-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Kur'an'in yirmi uc yilda indirilmesi, ayetlerin yazdirilmasi ve kontrol edilmesi bolumde _____ temasini guclendiren unsurlar arasinda sayilir.",
        answers: ["korunmusluk"],
        placeholder: "Temayi yaz",
        hint: "Kur'an'in muhafazasi etrafinda kurulan ana kavram.",
        explanation:
          "Ayetlerin yazdirilmasi, kontrol edilmesi ve cemaat icinde yasatilmasi korunmusluk temasini destekleyen unsurlar olarak anlatilir.",
      },
      {
        id: "s6-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Bu bolum, savas ve kissa ayetlerinin baglamindan koparilarak yorumlanmasini dogru bir okuma bicimi olarak sunar.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 1,
        explanation:
          "Bolum, Kur'an ayetlerinin baglamdan koparilmasini elestirir; tarihselligi ve evrensel mesaji birlikte gormeyi onerir.",
      },
    ],
    s7: [
      {
        id: "s7-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Peygamberlerin zorunlu niteliklerinden biri olan _____, vahyi guvenilir bicimde tasimalariyla dogrudan ilgilidir.",
        answers: ["emanet"],
        placeholder: "Tek sifat yaz",
        hint: "Guvenilirlik boyutunu anlatan sifat.",
        explanation:
          "Peygamberlerin emanet sifati, vahyin guvenilir bicimde tasinmasi ve peygamberlige duyulan guven acisindan zorunlu gorulur.",
      },
      {
        id: "s7-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Peygamberlerin insan turunden olmasi, hayat icinde insanlara somut _____ sunabilmeleri icin gereklidir.",
        answers: ["orneklik"],
        placeholder: "Temel kavrami yaz",
        hint: "Model olabilme boyutu.",
        explanation:
          "Bolum, peygamberlerin insan olusunu rehberliklerinin ve orneklik sunabilmelerinin zaruri kosulu olarak aciklar.",
      },
      {
        id: "s7-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Hz. Muhammed'in kiyamete kadar suren surekli mucizesi olarak _____ gosterilir.",
        answers: ["kuran", "kur'an"],
        placeholder: "Tek kavram yaz",
        hint: "Surekli mucize olarak nitelenen ilahi kitap.",
        explanation:
          "Metin, Hz. Muhammed'in mucizesi olarak Kur'an'i ve onun surekli, kalici bir mucize olusunu one cikarir.",
      },
      {
        id: "s7-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Allah'a inanmak, O'nun gonderdigi son peygamberi ve getirdigi rehberligi kabul etmeyi de gerektirir.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 0,
        explanation:
          "Bolumun son cizgisi, Allah'a imanin O'nun son peygamberini ve onun getirdigi rehberligi kabulle tamamlandigidir.",
      },
    ],
    s8: [
      {
        id: "s8-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Olum, bu bolumde dunya hayatindan _____ hayatina gecis olarak yorumlanir.",
        answers: ["ahiret", "ahiret hayatina"],
        placeholder: "Temel kavrami yaz",
        hint: "Karsilik yurdunu ifade eden hayat safhasi.",
        explanation:
          "Metin, olumu yok olus degil, dunya hayatindan ahiret hayatina gecis olarak tanimlar.",
      },
      {
        id: "s8-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Kabir hayati, Munker ve Nekir sorgusu ve amel defteriyle birlikte anilan son asamalardan biri _____dir.",
        answers: ["mizan"],
        placeholder: "Tek kavram yaz",
        hint: "Amellerin tartildigi asama.",
        explanation:
          "Bolum, kabir hayati ve sorgudan sonra amel defteri ve mizan gibi hesap asamalarini da birlikte anlatir.",
      },
      {
        id: "s8-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Sefaatin gerceklesmesi, bolumde dogrudan Allah'in _____ baglanir.",
        answers: ["iznine", "izni"],
        placeholder: "Ana kelimeyi yaz",
        hint: "Baskasina bagli olmadigi vurgulanan ilahi yetki.",
        explanation:
          "Bu bolum, sefaatin bagimsiz bir guc olmadigini; ancak Allah'in izniyle gerceklesebilecegini vurgular.",
      },
      {
        id: "s8-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: Bolum, otenazi ve intihari kisinin kendi hayati uzerinde sinirsiz tasarruf hakkinin dogal sonucu olarak gorur.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 1,
        explanation:
          "Metin, hayatin Allah'in emaneti oldugunu ve kisinin kendi hayatini sona erdirme hakkinin bulunmadigini savunur.",
      },
    ],
    s9: [
      {
        id: "s9-m001",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Kader, Allah'in her seyi ilim, hikmet ve iradesiyle olculu bicimde bilip _____ etmesidir.",
        answers: ["takdir"],
        placeholder: "Tek kavram yaz",
        hint: "Olculu belirleme fiili.",
        explanation:
          "Bolum, kaderi Allah'in her seyi ilim, hikmet ve iradesiyle bilip takdir etmesi olarak tanimlar.",
      },
      {
        id: "s9-m002",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Ilahi planin zamani geldiginde gerceklesmesine _____ denir.",
        answers: ["kaza"],
        placeholder: "Tek kavram yaz",
        hint: "Kaderden sonra gelen gerceklesme boyutu.",
        explanation:
          "Metin, kadere ilahi takdir; kazaya ise bu planin zamani geldiginde fiilen gerceklesmesi anlamini verir.",
      },
      {
        id: "s9-m003",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "fill",
        difficulty: "Ezber Cok Zor",
        stem: "Boslugu doldur: Tevekkul, hicbir sey yapmadan beklemek degil; gereken _____ gosterip sonucu Allah'a havale etmektir.",
        answers: ["cabayi", "cabayi gostermeyi", "caba"],
        placeholder: "Temel kavrami yaz",
        hint: "Beklemekten once yerine getirilmesi gereken insan payi.",
        explanation:
          "Bu bolum, tevekkulu pasiflik degil; gerekli cabayi gosterdikten sonra sonucu Allah'a birakmak olarak tanimlar.",
      },
      {
        id: "s9-m004",
        type: "knowledge",
        studyCategory: "memorization",
        interaction: "true-false",
        difficulty: "Ezber Cok Zor",
        stem: "Dogru / Yanlis: 'Kahpe felek' gibi ifadeler, eger ilahi takdire isyan anlami tasiyorsa inanc acisindan riskli gorulur.",
        options: ["Dogru", "Yanlis"],
        correctIndex: 0,
        explanation:
          "Metin, bu tur ifadelerin ilahi takdire isyan anlami tasimasi halinde inanc acisindan risk olusturabilecegini belirtir.",
      },
    ],
  };

  Object.entries(additionsBySection).forEach(([sectionId, additions]) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section) {
      return;
    }

    const existingIds = new Set((section.questions || []).map((question) => question.id));
    section.questions = [...section.questions, ...additions.filter((question) => !existingIds.has(question.id))];
  });
})();
