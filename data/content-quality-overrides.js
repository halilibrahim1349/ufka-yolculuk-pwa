(function () {
  const sections = window.UFKA_DATA?.sections || [];
  if (!sections.length) {
    return;
  }

  const buildTrueFalseStem = (question) => {
    const rawStem = String(question.stem || "").replace(/^Boslugu doldur:\s*/i, "").trim();
    const answer = String((question.answers && question.answers[0]) || question.answer || question.correctText || "").trim();
    const mergedStem = rawStem.replace(/_____+/g, answer).replace(/\s+([,.;:!?])/g, "$1");
    return `Dogru / Yanlis: ${polishTrueFalseText(mergedStem)}`;
  };

  const polishTrueFalseText = (value) => {
    const normalized = String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\ballah\b/gi, "Allah")
      .replace(/\bkur'an\b/gi, "Kur'an")
      .replace(/\bislam\b/gi, "Islam")
      .replace(/\bmusluman\b/gi, "Musluman")
      .replace(/\behl-i sunnet\b/gi, "Ehl-i Sunnet");

    if (!normalized) {
      return "";
    }

    return normalized.charAt(0).toLocaleUpperCase("tr-TR") + normalized.slice(1);
  };

  const falseOverrides = {
    "s1-q029": "Dogru / Yanlis: Bolume gore vahyin ilk emri 'yaz' oldugu icin bilgi arayisi esas olarak yazma eylemiyle sinirlanir.",
    "s1-m001": "Dogru / Yanlis: Metne gore eski akaid kitaplari bugunun inanc problemlerini aynen cozdugu icin inanc konularini guncel bir dille yeniden anlatmaya gerek yoktur.",
    "s2-q025": "Dogru / Yanlis: Dijital cagda inanc alanindaki savrulmayi azaltmak icin bolum, temel kaynaklar yerine sosyal medya akisina uyum saglamayi yeterli gorur.",
    "s2-m002": "Dogru / Yanlis: Bolume gore kuskudan arinmis kesin baglilik inanc olarak adlandirilir.",
    "s3-q031": "Dogru / Yanlis: Buyuk gunah isleyen ve bunu helal saymayan Musluman, bolume gore imandan cikar ve kafir sayilir.",
    "s3-m003": "Dogru / Yanlis: Taklidi imandan daha ust seviye kabul edilen bilincli iman turu icmali imandir.",
    "s4-q027": "Dogru / Yanlis: Evrenin yaratilmis ve baslangicli olusundan hareket eden delil, bu bolumde imkan delili olarak anilir.",
    "s4-m003": "Dogru / Yanlis: Tevhid ilkesi geregi Allah, yaratilmislara benzer sifatlarla dusunulebilir.",
    "s5-q017": "Dogru / Yanlis: Bu bolum, gorunen ve gorunmeyen alanlari birbirinden koparan varlik anlayisini tercih edilen dogru bakis olarak sunar.",
    "s5-m002": "Dogru / Yanlis: Cinler hakkindaki dogru bilgi, halk anlatilarindan ve korku hikayelerinden toplanmalidir.",
    "s6-q023": "Dogru / Yanlis: Bazi ayetleri baglamindan kopararak yorumlamak, bolume gore ayetin anlamini daha dogru ve daha evrensel hale getirir.",
    "s6-m002": "Dogru / Yanlis: Kur'an'in son kitap olarak ayirt edici yonlerinden biri insanlar tarafindan zamanla degistirilmis olmasidir.",
    "s7-q021": "Dogru / Yanlis: Vahyi insanlara eksiksiz ulastirma gorevi, peygamberlerin fetanet sifatiyla ilgilidir.",
    "s7-m001": "Dogru / Yanlis: Peygamberlerin zorunlu niteliklerinden emanet, vahyi gizleyebilme serbestisini ifade eder.",
    "s8-q023": "Dogru / Yanlis: Bu bolume gore insan hayati Allah'in bir emaneti degil, kisinin mutlak tasarrufundaki ozel alanidir.",
    "s8-m003": "Dogru / Yanlis: Sefaatin gerceklesmesi, bolumde dogrudan peygamberlerin bagimsiz ve sinirsiz yetkisine baglanir.",
    "s9-q023": "Dogru / Yanlis: Bu bolume gore ecel degisebilir; olumun sekli ecelin sayisini artirabilir.",
    "s9-m003": "Dogru / Yanlis: Tevekkul, bolume gore hicbir caba gostermeden sonucu beklemenin adidir.",
  };

  const summaryAppendices = {
    s1: [
      "Sinav acisindan bu bolumde en cok karistirilan nokta, bilimin dinin yerine gecip gecmedigi sorusudur. Metin bilimi reddetmez; tam tersine onun isleyisi aciklama gucunu teslim eder. Ancak bilimden, hayatin gayesi ve insanin neden sorumlu oldugu gibi sorulari tek basina cozmesi beklenirse alan asimi yapilmis olur.",
      "Bolumde bilgi kaynaklari sayilirken duyu, akil, guvenilir haber ve vahiy arasinda butunleyici bir cizgi kurulur. Bu vurgu, dinin akli susturan degil akli yerli yerine oturtan bir sistem oldugunu anlatmak icindir. Ozellikle vahyi bilgi kaynagi olarak gormeyen yorumlar, metnin butun cizgisiyle ters dusmektedir.",
      "Akaid bilgisinin gerekliligi yalnizca teorik ders niteliginde dusunulmez. Kisi neye inanacagini bildigi kadar, inancini asindiran soz ve tavirlari da tanimalidir. Bu yuzden bolum, saglam imani sadece dogru bilgiyle degil, o bilginin bilincli korunmasiyla birlikte dusunur.",
    ],
    s2: [
      "Bu bolumde fitrat kavrami yalniz biyolojik bir yatkinlik olarak degil, insanin derin varolus yonelimi olarak islenir. Inkarin elestirilmesi de bu yuzdendir; cunku metin inkari dogal olanin gelismis hali degil, ftratla gerilimli bir kopus olarak gormektedir.",
      "Inanc ile iman arasindaki ayrim sinav sorularinda ince bir ayrim olarak gelir. Inanc, ihtimal ve on kabul barindirabilir; iman ise guven, kesinlik, baglilik ve sevgi tasiyan daha yogun bir varolus halidir. Bu nedenle metin, imani psikolojik bir teselli degil bilincli ve iradeli bir baglanis olarak tanimlar.",
      "Bolumun guncel tarafi dijital bilgi duzensizligi uzerinden kurulur. Kontrolsuz bilgi, ozellikle inanc alaninda kisiyi dagitabilir; bu nedenle temel kaynaklara donmek, bir bilene danismak ve tekfir dilinden uzak durmak metnin koruyucu tavsiyeleri arasindadir.",
    ],
    s3: [
      "Bu bolumde imanin merkezi unsurunun kalbin tasdiki oldugu tekrar tekrar vurgulanir. Dil ile ikrar, toplum onundeki gorunurlugu saglar; fakat kalpte tasdik yoksa tek basina yeterli gorulmez. Bu ayrim, iman ile gorunus arasindaki farki anlamak acisindan temel onemdedir.",
      "Bolum bilgi ile imani ozdeslestirmez. Bilgi, imana giden yolu acar; fakat iman ancak kalbin bu bilgiyi benimsemesiyle tamamlanir. Bu yuzden metin, akli onemseyen ama kalbi de dislamayan dengeli bir tasdik anlayisi kurar.",
      "Ehl-i Sunnet cizgisinin belirginlestigi yerlerden biri buyuk gunah meselesidir. Gunah, kisiyi otomatik olarak kufre goturmez; fakat ahlaki ve dini zedelenme olusturur. Bu ayrim, hem asiri dislayici yorumlari hem de gunahi onemsizlestiren yaklasimlari reddeden bir denge sunar.",
    ],
    s4: [
      "Bu bolumde Allah'a iman, diger butun iman esaslarini anlamlandiran kurucu merkez olarak verilir. Allah inanci sarsildiginda melek, kitap, peygamber ve ahiret inanci da baglayici zeminini kaybeder. Bu yuzden bolum, Allah'a imani siradan bir baslik degil tum sistemin omurgasi olarak isler.",
      "Deliller bahsinde dikkat edilmesi gereken nokta, her delilin ayri bir yerden ayni sonuca yurumesidir. Hudus, imkan ve gaye-nizam delilleri farkli kapilar acsa da hepsi kainatin kendi kendine ve anlamsiz sekilde aciklanamayacagini gostermeye yonelir. Sinavlarda bu delillerin isimleri ve dayandiklari esas birlikte sorulabilir.",
      "Allah'in isim ve sifatlari konusunda metnin temel ilkesi tenzih ve tevhit dengesidir. Allah tanitilirken yaratilmislara benzetilmez; haberi sifatlar da bu cizgiyi bozmayacak sekilde ele alinir. Boylesi bir okuma hem benzetmeci dili hem de ilahi nitelikleri butunuyle islevsizlestiren asiri soyutlamayi engeller.",
    ],
    s5: [
      "Bolumun ana omurgasi, varlik anlayisinin yalniz gorunene indirgenemeyecegidir. Gorunmeyen alanin reddi, Kur'an'in sundugu butuncul gerceklik tasavvurunu daraltir. Melekler, cinler ve seytan ayni ontolojik cizginin farkli unsurlari olarak birlikte dusunulur.",
      "Meleklerle ilgili kisimda metin, insan bedenine ait fizik sinirlarin melekler icin zorunlu olmamasini onemli bir not olarak verir. Bu bilgi, vahiy tasima, farkli gorevleri yerine getirme ve gorunmeyen alemle iliski gibi konularin aklen imkansiz sayilamayacagini gostermek icin kullanilir.",
      "Cinler ve seytan bahsinde halk anlatilari ile vahyin verdigi bilginin birbirine karistirilmamasi istenir. Ozellikle korku hikayeleri, uydurma menkibeler ve batil uygulamalar yerine vahyin sinirlari icinde kalmak, bolumun koruyucu ve ayiklayici yonunu olusturur.",
    ],
    s6: [
      "Bu bolum ilahi kitaplarin tarih boyunca insanligi rehbersiz birakmayan ilahi rahmet cizgisi oldugunu anlatir. Peygamberler bir donemi tasir; fakat kitaplar o vahyin kalici basvuru kaynagi olmasi sebebiyle daha uzun sureli bir rehberlik sunar.",
      "Kur'an'in son kitap olarak ayirt edici niteliginde iki nokta bir araya gelir: onceki vahiyleri dogrulama ve onlari aciklayici, toparlayici bir merkez olma. Bu yuzden Kur'an, ne onceki kitaplardan kopuk ne de onlarla ozdes kabul edilir; onlarin hakikatini tasdike devam eden son ilahi hitap olarak konumlanir.",
      "Baglam vurgusu bu bolumun sinavlarda sikca donusturulen tarafidir. Ayetin oncesi, sonrasi, nuzul ortami ve hitap ettigi olay gorulmeden yapilan yorum, metnin mesajini carpitabilir. Bolum bu nedenle hem tarihselligi hem de evrensel mesaji birlikte gormeyi oneren bir okuma disiplini kurar.",
    ],
    s7: [
      "Peygamberlerin insan olusu, bu bolumde secilmisliklerine aykiri bir durum olarak degil rehberliklerinin zorunlu sarti olarak aciklanir. Ornek olunabilmesi, insan diliyle konusulabilmesi ve hayat icinde uygulanabilir model sunulabilmesi ancak boyle mumkundur.",
      "Sifatlardan sidk, emanet, teblig, fetanet ve ismet arasindaki ayrimlar sinavlarda ayrintili sekilde gelebilir. Her biri peygamberligin guvenilirligine farkli yonden hizmet eder: dogruluk, guven, vahyi eksiksiz aktarma, yuksek kavrayis ve vahyi zedeleyecek buyuk hatalardan korunmusluk.",
      "Hz. Muhammed'in peygamberligi anlatilirken Kur'an'in surekli mucize olusu ozel bir yer tutar. Gecici bir olaydan ibaret olmayan bu mucize, vahyin hem icerigiyle hem de tarihte tasidigi donusturucu gucle birlikte ele alinir.",
    ],
    s8: [
      "Bu bolum olum fikrini korku merkezli degil gecis merkezli okumayi onerir. Dunya hayati imtihan, ahiret ise karsilik yurdu olarak anlatildigi icin olum yok olus degil iki asamali varolusun ara kapisi haline gelir.",
      "Kabir hayati, sorgu, amel defteri, mizan, cennet, cehennem ve sefaat gibi basliklar ayni hesap mantigi icinde birbirine baglanir. Boylece ahiret anlatimi daigin motifler toplulugu olmaktan cikar; insanin yaptiklarinin kayit altina alindigi adil bir duzen fikrine donusur.",
      "Otenazi ve intihar gibi guncel sorularin bu bolume dahil edilmesi, ahiret inancinin yalniz gelecege dair bilgi olmadigini da gosterir. Hayatin emanet olusu, sabrin imtihanla iliskisi ve dunyadaki zorluklarin anlamsiz olmadigi fikri burada bir araya gelir.",
    ],
    s9: [
      "Bu bolum kader ile kazayi ayirarak dusunmenin neden gerekli oldugunu gostermeye calisir. Kader ilahi bilme ve takdir boyutunu, kaza ise bunun vakti geldigi anda gerceklesmesini anlatir. Bu ayirim yapilmadiginda sorularin cogu birbirine karistirilir.",
      "Kader meselesinde metnin en hassas oldugu nokta, ilahi bilgiyi insanin iradesini yok eden bir zorlamaya donusturmamaktir. Allah'in bilmesi baska, insanin o tercihi yapmaya mecbur birakilmasi baskadir. Bu ince fark, bolumun ozgurluk ve sorumluluk dengesini kurar.",
      "Tevekkul, kismet, alin yazisi ve ecel gibi kavramlar da ayni duzeltici cizgide yeniden tanimlanir. Pasif bekleyis tevekkul sayilmaz; ecel bir tanedir; alin yazisi ise mecazi bir anlatimdir. Boylesi bir duzeltme, halk dilindeki kader anlayisini akaid olculeriyle yeniden sinamayi hedefler.",
    ],
  };

  sections.forEach((section) => {
    const appendix = summaryAppendices[section.id] || [];
    const existingSummary = Array.isArray(section.summary) ? section.summary.filter(Boolean) : [];
    section.summary = [...existingSummary, ...appendix];

    section.questions = (section.questions || []).map((question) => {
      if (question.interaction !== "fill") {
        return question;
      }

      const falseStem = falseOverrides[question.id];
      const nextQuestion = {
        ...question,
        interaction: "true-false",
        options: ["Dogru", "Yanlis"],
        correctIndex: falseStem ? 1 : 0,
        stem: falseStem ? polishTrueFalseText(falseStem) : buildTrueFalseStem(question),
        difficulty:
          question.studyCategory === "memorization"
            ? "Ezber Ust Seviye"
            : "Ogretici Yuksek Seviye",
      };

      delete nextQuestion.answers;
      delete nextQuestion.answer;
      delete nextQuestion.correctText;
      delete nextQuestion.placeholder;
      delete nextQuestion.hint;

      return nextQuestion;
    });
  });
})();
