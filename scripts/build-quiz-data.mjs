import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve("data/book-pages-ocr.json");
const outputPath = path.resolve("data/quiz-data.js");

const sectionConfigs = [
  {
    id: "s1",
    pageStart: 1,
    pageEnd: 30,
    title: "Onsöz, Giris ve Inanc Temeli",
    description:
      "Ilk 30 sayfa; inanc ihtiyaci, dinin gerekliligi ve bilginin Islam dusuncesindeki yerini ozetler.",
  },
  {
    id: "s2",
    pageStart: 31,
    pageEnd: 60,
    title: "Inanc Dunyamiz ve Imanin Baslangici",
    description:
      "Bu kisim inancin hayati nasil yonlendirdigini, imanin kapsamýný ve Allah'a iman ile ilgili ilk kritik sorulari ele alir.",
  },
  {
    id: "s3",
    pageStart: 61,
    pageEnd: 90,
    title: "Iman, Sirk ve Allah'in Varligi",
    description:
      "Imanin korunmasi, sirkten sakýnma ve Allah'in varligini tanima bu aralikta yogunlasir.",
  },
  {
    id: "s4",
    pageStart: 91,
    pageEnd: 120,
    title: "Allah'i Bilmek ve Esmaul Husna",
    description:
      "Allah'in varligini bilmenin imkani, aklin rolu ve ilahi isimlerin anlam dunyasi bu bolumun merkezindedir.",
  },
  {
    id: "s5",
    pageStart: 121,
    pageEnd: 150,
    title: "Allah'in Isimleri ve Sifatlari",
    description:
      "Ilahi isimlerin insana verdigi ufuk ile Allah-insan iliskisine dair sorular bu bolumde toplanir.",
  },
  {
    id: "s6",
    pageStart: 151,
    pageEnd: 180,
    title: "Melekler ve Fizik Otesi Varliklar",
    description:
      "Meleklerin mahiyeti, gorevleri ve gorunmeyen aleme dair temel sorular burada yer alir.",
  },
  {
    id: "s7",
    pageStart: 181,
    pageEnd: 210,
    title: "Ruh, Cin ve Seytan",
    description:
      "Ruh, rüya, cinler ve seytanin etkisi ile ilgili sik sorulan sorular bu blokta derlenmistir.",
  },
  {
    id: "s8",
    pageStart: 211,
    pageEnd: 240,
    title: "Ilahi Kitaplar ve Peygamberlik",
    description:
      "Ilahi kitaplarin gonderilisi, vahiy ve peygamberligin gerekliligi bu sayfalarda islenir.",
  },
  {
    id: "s9",
    pageStart: 241,
    pageEnd: 270,
    title: "Peygamber Inanci",
    description:
      "Peygamberlerin ozellikleri, mucizeler ve Hz. Muhammed'in konumu bu bolumde odak noktasi olur.",
  },
  {
    id: "s10",
    pageStart: 271,
    pageEnd: 300,
    title: "Olum ve Ahirete Giris",
    description:
      "Olum gercegi, berzah, kiyâmet ve ahiret bilinci ile ilgili temel hazirlik bolumu.",
  },
  {
    id: "s11",
    pageStart: 301,
    pageEnd: 330,
    title: "Olum Sonrasi Hayat ve Kader",
    description:
      "Cennet, cehennem, siraat ve kader inancina gecis bu sayfa araliginda bir araya gelir.",
  },
  {
    id: "s12",
    pageStart: 331,
    pageEnd: 351,
    title: "Kader, Sonuc ve Tekrar",
    description:
      "Kader, irade ve sorumluluk meseleleri kitabin sonuc bolumuyle birlikte toparlanir.",
  },
];

const supplementalQuestions = {
  s1: [
    {
      prompt: "Insan neden inanmaya ihtiyac duyar?",
      answer:
        "Insan akil sahibi ve anlam arayan bir varliktir. Kendisini, dunyayi ve gelecegi anlamlandirabilmek icin bir inanc zeminine ihtiyac duyar.",
    },
    {
      prompt: "Din insan hayatinda hangi boslugu doldurur?",
      answer:
        "Din, insani anlamsizlik, yalnizlik ve guvensizlikten koruyarak ona kulluk, sorumluluk ve yon duygusu kazandirir.",
    },
    {
      prompt: "Islam'da bilgi neden vazgecilmez kabul edilir?",
      answer:
        "Cunku saglam inanc ve dogru amel bilgiye dayanir. Kur'an bilenlerle bilmeyenlerin bir olmadigini vurgular ve delile dayali bilgi ister.",
    },
    {
      prompt: "Kur'an bilgiye ulasmada insani hangi kaynaklara yonlendirir?",
      answer:
        "Kur'an vahye, akla, gozleme ve tefekkure yonlendirir. Insan evrene, kendi yaratilisina ve tarihe bakarak hakikati dusunmeye cagrilir.",
    },
    {
      prompt: "Zan ile bilgi arasindaki temel fark nedir?",
      answer:
        "Bilgi delile dayali kesinlik ifade eder. Zan ise kesinligi olmayan tahmin ve kanaattir; inanc konusunda zanna dayanarak konusmak dogru gorulmez.",
    },
    {
      prompt: "Inanc ile davranis arasindaki bag nasil aciklanir?",
      answer:
        "Inanc, ic dunyayi sekillendirir ve davranislari yonlendirir. Saglam inanc sorumluluk bilinci, guven ve guzel ahlak uretir.",
    },
    {
      prompt: "Diger iman esaslari neden once Allah'a iman temeline oturur?",
      answer:
        "Cunku kitaplar, peygamberler, melekler ve ahiret ancak Allah'in varligi ve birligi kabul edildiginde anlam kazanir.",
    },
  ],
  s2: [
    {
      prompt: "Iman neden guzel davranislarin temeli sayilir?",
      answer:
        "Iman insanin merkezini belirler; niyetleri, tercihleri ve ahlakini besler. Saglam temel olmadan kalici guzel davranis kurmak zordur.",
    },
    {
      prompt: "Kalp ile tasdik ve dil ile ikrar neden birlikte onemlidir?",
      answer:
        "Kalpteki tasdik imanin asli yonudur. Dil ile ikrar ise bu imanin disa vurulmasini, kisiye toplumsal olarak Musluman kimligi kazandirmasini saglar.",
    },
    {
      prompt: "Iman ile bilgi arasinda nasil bir iliski vardir?",
      answer:
        "Iman koru taklitten ibaret olmamali; bilgi, tefekkur ve delille desteklenmelidir. Bilgi, supheleri giderip kalbi tasdiki guclendirir.",
    },
  ],
  s4: [
    {
      prompt: "Allah'in varligini bilmede aklin rolu nedir?",
      answer:
        "Akil, yaratilanlardan hareketle yaraticiya ulasmada onemli bir imkandir. Kur'an insani aklini kullanmaya ve varlik uzerinde dusunmeye cagirir.",
    },
    {
      prompt: "Kur'an insaný Allah'i tanimak icin nelere bakmaya cagirir?",
      answer:
        "Goklere, yere, insanin kendi yaratilisine, tabiat duzenine ve tarihteki ibretlik olaylara bakmaya cagirir. Bu tefekkur Allah'in kudretine goturur.",
    },
    {
      prompt: "Esmaul husna neden onemlidir?",
      answer:
        "Cunku Allah'i isim ve sifatlariyla tanimak, iman bilincini derinlestirir. Insan dua, kulluk ve ahlakinda bu isimlerin anlam ufkundan yararlanir.",
    },
  ],
};

const questionPattern = /(\d+)\.\s+([^?.!]{5,180}\?)/g;

const rawBook = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const pages = rawBook.pages;

const sectionByPage = new Map();
for (const section of sectionConfigs) {
  for (let pageNumber = section.pageStart; pageNumber <= section.pageEnd; pageNumber += 1) {
    sectionByPage.set(pageNumber, section.id);
  }
}

const toAsciiSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

const cleanText = (value) =>
  value
    .replace(/([A-Za-zÀ-ÿ])\-\s+([A-Za-zÀ-ÿ])/g, "$1$2")
    .replace(/\b\d+\s*\|\s*Yeni Yüzyýlda Nasýl Ýnanmalý\??/gi, " ")
    .replace(/\b[A-ZÇÐÝÖÞÜ' ]+\s*\|\s*\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

const buildAnswer = (pageIndex, match) => {
  const combined = pages
    .slice(pageIndex, Math.min(pageIndex + 3, pages.length))
    .map((page) => page.text)
    .join(" ");
  const start = match.index + match[0].length;
  const tail = combined.slice(start);
  const nextQuestion = tail.match(/\s\d+\.\s+[^?.!]{5,180}\?/);
  const rawAnswer = nextQuestion ? tail.slice(0, nextQuestion.index) : tail.slice(0, 900);
  const cleaned = cleanText(rawAnswer).replace(/^[-,:;]+/, "").trim();
  if (!cleaned) {
    return "Bu soru icin cevap metni OCR sonucunda kismen eksik kaldi. Kitaptaki ilgili sayfayi da mutlaka kontrol et.";
  }
  if (cleaned.length <= 420) {
    return cleaned;
  }
  return `${cleaned.slice(0, 420).replace(/\s+\S*$/, "")}...`;
};

const extractedBySection = new Map(sectionConfigs.map((section) => [section.id, []]));

for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
  const page = pages[pageIndex];
  const sectionId = sectionByPage.get(page.pageNumber);
  if (!sectionId) {
    continue;
  }

  const matches = [...page.text.matchAll(questionPattern)];
  for (const match of matches) {
    const prompt = cleanText(match[2]);
    if (!prompt) {
      continue;
    }

    extractedBySection.get(sectionId).push({
      id: `${sectionId}-${page.pageNumber}-${toAsciiSlug(prompt)}`,
      prompt,
      answer: buildAnswer(pageIndex, match),
      sourcePage: page.pageNumber,
      sourceType: "book",
      statusHint: "Kitaptan cikarildi",
    });
  }
}

const sections = sectionConfigs.map((section) => {
  const supplemental = (supplementalQuestions[section.id] || []).map((item, index) => ({
    id: `${section.id}-custom-${index + 1}`,
    prompt: item.prompt,
    answer: item.answer,
    sourcePage: null,
    sourceType: "editorial",
    statusHint: "Bolum tekrar sorusu",
  }));

  const extracted = extractedBySection.get(section.id) || [];
  const questions = [...supplemental, ...extracted];

  return {
    id: section.id,
    label: `${section.pageStart}-${section.pageEnd}`,
    pageStart: section.pageStart,
    pageEnd: section.pageEnd,
    title: section.title,
    description: section.description,
    questionCount: questions.length,
    questions,
  };
});

const output = {
  title: "Ufka Yolculuk Calisma Uygulamasi",
  subtitle: "Kitap bolumlerine gore calisma ve kendini test etme alani",
  sourcePdf: rawBook.source,
  pageCount: rawBook.endPage || rawBook.pageCount || pages.length,
  sectionSize: 30,
  generatedAt: "2026-03-07",
  totalQuestions: sections.reduce((total, section) => total + section.questions.length, 0),
  sections,
};

fs.writeFileSync(outputPath, `window.UFKA_DATA = ${JSON.stringify(output, null, 2)};\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, totalQuestions: output.totalQuestions, sections: sections.length }, null, 2));
