(() => {
  const patches = {
    s1: {
      extraQuestions: [
        {
          id: "s1-q021",
          type: "knowledge",
          difficulty: "Çok Zor Bilgi",
          stem: "Bölümde kalbin bilgi süreci içindeki yeri en uygun biçimde nasıl açıklanmaktadır?",
          options: [
            "Kalp, sadece duygusal tepkilerin merkezidir; bilgiyle ilgisi yoktur.",
            "Kalp, aklın yerini alan bağımsız ve mutlak bir bilgi kaynağıdır.",
            "Kalp, insanın anlama, yönelme ve tasdike açık iç merkezi olarak bilgi sürecinde rol oynar.",
            "Kalp, yalnız vahiy bilgisini kabul eder; duyu ve akıl verileriyle ilişki kurmaz.",
            "Kalbin bilgiyle ilgisi ancak ibadet anlarında ortaya çıkar.",
          ],
          correctIndex: 2,
          explanation:
            "Metin, kalbi sadece duygusal bir alan değil; anlama, yönelme ve imana açıklık taşıyan iç merkez olarak değerlendirir.",
        },
        {
          id: "s1-q022",
          type: "knowledge",
          difficulty: "Çok Zor Bilgi",
          stem: "Faydalı bilginin insan öldükten sonra da değer üretmeye devam etmesi bölümde hangi düşünceyle ilişkilendirilmektedir?",
          options: [
            "Bilginin sadece toplumsal prestij sağlamasıyla",
            "Bilginin, sahibinden sonra da insanlara yarar ulaştırabilmesiyle",
            "Bilginin bütün diğer ibadetlerin yerine geçmesiyle",
            "Bilginin yalnız yazılı metinlerde korunmasıyla",
            "Bilginin sadece dinî alanla sınırlı olmasıyla",
          ],
          correctIndex: 1,
          explanation:
            "Bölümde faydalı bilgi, insanın ölümünden sonra da başkalarına yarar ulaştırdığı için sevabı süren değer olarak anlatılır.",
        },
        {
          id: "s1-q023",
          type: "paragraph",
          difficulty: "ALES Seviyesi Çok Zor",
          stem: "Aklı bütünüyle devre dışı bırakan bir inanç, ilk bakışta teslimiyet gibi görünebilir; fakat yazar bunu sağlamlık göstergesi saymaz. Çünkü sorgulamadan benimsenen kabul, insanın zihnini ikna etmeden kalbini de tam anlamıyla yerleştirmez. Öte yandan aklı mutlaklaştırıp vahyi gereksiz görmek de aynı ölçüde eksiktir. Bölümün önerdiği yol, insanın düşünerek hakikate yaklaşması ve vahyin rehberliğiyle bunu sağlam zemine oturtmasıdır.\n\nBu parçadan çıkarılabilecek en uygun sonuç aşağıdakilerden hangisidir?",
          options: [
            "Aklı kullanan kişi vahye ihtiyaç duymaz.",
            "Vahiy, aklın yerine geçen bağımsız bir zorlamadır.",
            "Sağlam inanç, akıl yürütme ile vahiy rehberliğini karşı karşıya koymadan birlikte değerlendirir.",
            "Yazar, aklın din alanında tamamen etkisiz olduğunu savunmaktadır.",
            "İnanç, zihinsel açıklık gerektirmeyen bir alışkanlıktır.",
          ],
          correctIndex: 2,
          explanation:
            "Parça, akıl ile vahyi çatıştırmayan; ikisini birlikte işlevsel gören inanç anlayışını savunur.",
        },
        {
          id: "s1-q024",
          type: "paragraph",
          difficulty: "ALES Seviyesi Çok Zor",
          stem: "Bir toplumda herkes konuşuyor olabilir; ama çok seslilik, söylenenlerin bilgi değeri taşıdığını kendiliğinden göstermez. Yazarın dikkat çektiği nokta, özellikle din ve hakikat iddiası taşıyan alanlarda, kanaatin bilgi yerine geçirilmesinin ciddi savrulmalar doğuracağıdır. Çünkü zan ile kesin bilgi arasındaki çizgi silindiğinde, insan hem düşüncesini hem de dindarlığını sağlam temele oturtamaz. Bu yüzden bölüm, konuşma cesaretinden çok delil disiplinini öne çıkarır.\n\nBu parçaya göre bölümün asıl uyarısı aşağıdakilerden hangisidir?",
          options: [
            "Farklı görüşlerin bulunması başlı başına olumsuzdur.",
            "Bilgi değeri taşımayan kanaatlerin delil yerine geçirilmesi tehlikelidir.",
            "Dini konularda sadece sessizlik tercih edilmelidir.",
            "Her zayıf bilgi, zamanla kesin bilgiye dönüşür.",
            "Delil arayışı, insanı dinden uzaklaştırır.",
          ],
          correctIndex: 1,
          explanation:
            "Parça, kanaat ile kesin bilgi arasındaki farkın silinmesini ve delilsiz konuşmayı temel tehlike olarak gösterir.",
        },
      ],
    },
    s2: {
      extraQuestions: [
        {
          id: "s2-q017",
          type: "knowledge",
          difficulty: "Çok Zor Bilgi",
          stem: "Bölüme göre bir Müslümanı tekfir etme konusunda hangi ölçü esas alınmalıdır?",
          options: [
            "Farklı yorum ve içtihatlara sahip olması",
            "Toplumda tartışmalı bir görüş ileri sürmesi",
            "Kur'an ve Sünnet ile sabit iman esaslarından birini açıkça inkâr etmesi",
            "Ahlaki zayıflık göstermesi",
            "Dijital mecralarda hatalı bilgi paylaşması",
          ],
          correctIndex: 2,
          explanation:
            "Metin, farklı yorumları değil; Kur'an ve Sünnet ile sabit iman esaslarından birini açık inkâr etmeyi belirleyici ölçü sayar.",
        },
        {
          id: "s2-q018",
          type: "knowledge",
          difficulty: "Çok Zor Bilgi",
          stem: "Dijital çağda dinî bilgiyle ilişki konusunda bölümün temel uyarısı aşağıdakilerden hangisidir?",
          options: [
            "İnternetteki her içerik eşit derecede güvenilir kabul edilmelidir.",
            "Dijital ortam tamamen terk edilmeli, hiçbir kaynağa başvurulmamalıdır.",
            "Bilgi bolluğu içinde temel kaynaklara dönmek ve güvenilir rehberlikle hareket etmek gerekir.",
            "Tek başına arama motorları, dinî meseleler için yeterli otoritedir.",
            "Dijital çağ, inanç konusunda artık soru sormayı gereksiz kılmıştır.",
          ],
          correctIndex: 2,
          explanation:
            "Bölüm, dijital çağın fırsatlarını inkâr etmez; fakat güvenilir kaynak ve rehberlik olmadan savrulma riskine dikkat çeker.",
        },
        {
          id: "s2-q019",
          type: "paragraph",
          difficulty: "ALES Seviyesi Çok Zor",
          stem: "Bir insanın inançlı olduğunu söylemesi ile bu inancın onun davranışlarına yön vermesi aynı şey değildir. Yazarın rahatsız olduğu nokta da tam burada belirir: Eğer iman insanın en kararlı hâliyse, bunun hayata yansımaması yalnız bir eksiklik değil, aynı zamanda iç dünya ile dış dünya arasında bir kopukluk anlamı taşır. Bu yüzden ahlak, imanın süsü değil; görünür hale gelmiş tutarlılığıdır.\n\nBu parçadan çıkarılabilecek en uygun yargı aşağıdakilerden hangisidir?",
          options: [
            "Ahlak ile iman arasında zorunlu bir ilişki yoktur.",
            "İman yalnız kalpte kaldığında daha sahih olur.",
            "Ahlaki tutarlılık, imanın dış dünyadaki görünür karşılığıdır.",
            "Davranışların değeri, imandan tamamen bağımsızdır.",
            "Yazar, ahlaktan çok ibadet biçimlerine önem vermektedir.",
          ],
          correctIndex: 2,
          explanation:
            "Parça, ahlakı imanın dış dünyadaki görünür karşılığı ve tutarlılık ölçütü olarak konumlandırır.",
        },
        {
          id: "s2-q020",
          type: "paragraph",
          difficulty: "ALES Seviyesi Çok Zor",
          stem: "İnsan bazen yaşadığı bunalımın içinden bakınca geleceği bütünüyle kapanmış görür. Böyle anlarda hayat yalnız acının kendisiymiş gibi algılanabilir. Yazar, dinî inancın tam da bu karanlık eşiğe müdahale ettiğini söyler: Hayatı emanet, sıkıntıyı imtihan ve geleceği de bütünüyle kapalı olmayan bir ufuk olarak yorumlayan inanç, insanın yalnız duygusal olarak değil anlam düzeyinde de yeniden toparlanmasına yardım eder.\n\nBu parçaya göre dinî inancın intihar eğilimine karşı kurduğu temel direnç aşağıdakilerden hangisidir?",
          options: [
            "Acıyı yok saydırması",
            "Hayatı anlamsızlaştırması",
            "Hayata emanet ve imtihan bilinci kazandırarak anlam ufku açması",
            "İnsanı bütün toplumsal ilişkilerden koparması",
            "Sıkıntıyı sadece biyolojik sebeplerle açıklaması",
          ],
          correctIndex: 2,
          explanation:
            "Parça, dinî inancın hayatı emanet ve imtihan olarak yorumlayıp kişiye anlam ufku açarak direnç oluşturduğunu vurgular.",
        },
      ],
    },
    s3: {
      extraQuestions: [
        {
          id: "s3-q023",
          type: "knowledge",
          difficulty: "Çok Zor Bilgi",
          stem: "İmanda asıl olan unsur ile onun toplumsal görünürlüğünü sağlayan unsur bölümde hangi ikiliyle açıklanmaktadır?",
          options: [
            "Sevgi ve korku",
            "Kalp ile tasdik ve dil ile ikrar",
            "Bilgi ve sezgi",
            "Amel ve ahlak",
            "Akıl ve gelenek",
          ],
          correctIndex: 1,
          explanation:
            "Metin, imanın aslını kalp ile tasdik; toplumsal görünürlüğünü ise dil ile ikrar üzerinden açıklar.",
        },
        {
          id: "s3-q024",
          type: "paragraph",
          difficulty: "ALES Seviyesi Çok Zor",
          stem: "Bir şeyi bilmek ile onu tasdik etmek arasındaki fark, bölümün en kritik ayrımlarından biridir. Çünkü bilgi, insanı hakikate yaklaştırabilir; fakat kişi o hakikatin gerektirdiği iç onayı vermedikçe iman meydana gelmez. Yazarın vurgusu burada incelir: Cehaletle küfrü, bilgiyle imanı özdeş görmek kolaycıdır; oysa belirleyici olan, bilginin kalpte hangi kesinliğe ve kabule dönüştüğüdür.\n\nBu parçadan hareketle aşağıdakilerden hangisi söylenebilir?",
          options: [
            "Her bilen kişi zorunlu olarak mümindir.",
            "Bilgi ile iman tamamen özdeştir.",
            "İmanı belirleyen, bilginin kalpte tasdike dönüşmesidir.",
            "Cehalet, tek başına küfür anlamına gelir.",
            "Kalp, bilgi sürecinde hiçbir rol oynamaz.",
          ],
          correctIndex: 2,
          explanation:
            "Parça, bilginin tek başına iman olmadığını; belirleyici unsurun bilginin kalpte tasdike dönüşmesi olduğunu belirtir.",
        },
      ],
    },
  };

  const sections = window.UFKA_DATA?.sections || [];
  const byId = Object.fromEntries(sections.map((section) => [section.id, section]));

  for (const [sectionId, patch] of Object.entries(patches)) {
    const section = byId[sectionId];
    if (!section) {
      continue;
    }

    const existingIds = new Set(section.questions.map((question) => question.id));
    const additions = (patch.extraQuestions || []).filter((question) => !existingIds.has(question.id));
    section.questions = [...section.questions, ...additions];
  }

  if (window.UFKA_DATA) {
    window.UFKA_DATA.subtitle = "9 bölüm hazır · güçlendirilmiş soru bankası";
  }
})();
