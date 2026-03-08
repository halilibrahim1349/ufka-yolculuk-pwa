(() => {
  const STORAGE_KEY = "ufka-study-state-v3-reset";
  const LETTERS = ["A", "B", "C", "D", "E"];
  const SMART_REVIEW_LIMIT = 20;
  const EXAM_PRESETS = {
    mini: {
      mode: "exam-mini",
      count: 30,
      durationMinutes: 35,
      title: "30 Soruluk Deneme",
      description: "Karışık konu dağılımı ile süreli deneme oturumu.",
    },
    full: {
      mode: "exam-full",
      count: 50,
      durationMinutes: 60,
      title: "50 Soruluk Deneme",
      description: "Geniş kapsamlı süreli karışık deneme oturumu.",
    },
  };

  const baseData = window.UFKA_DATA;
  const bookData = window.UFKA_BOOK_DATA || { pages: [], sections: [] };
  const staticSectionById = new Map((baseData.sections || []).map((section) => [section.id, section]));
  const SEARCH_STOP_WORDS = new Set([
    "acaba",
    "ait",
    "ama",
    "ancak",
    "bir",
    "bu",
    "da",
    "de",
    "degil",
    "diye",
    "en",
    "gibi",
    "gore",
    "hangi",
    "icin",
    "ile",
    "ilemi",
    "mi",
    "midir",
    "mu",
    "mudur",
    "muhtemelen",
    "ne",
    "neden",
    "nedir",
    "nasil",
    "olan",
    "olarak",
    "olur",
    "ve",
    "ya",
    "yani",
  ]);

  const progressStrip = document.querySelector(".progress-strip");
  if (progressStrip && !document.getElementById("studySummaryPanel")) {
    progressStrip.insertAdjacentHTML(
      "afterend",
      `<section class="study-summary-panel hidden" id="studySummaryPanel"><p class="eyebrow">Bölüm Özeti</p><div class="study-summary-copy" id="studySummaryCopy"></div></section>`,
    );
  }

  const elements = {
    heroStats: document.getElementById("heroStats"),
    examStats: document.getElementById("examStats"),
    reviewStats: document.getElementById("reviewStats"),
    searchInput: document.getElementById("searchInput"),
    bookSearchInput: document.getElementById("bookSearchInput"),
    clearBookSearchButton: document.getElementById("clearBookSearchButton"),
    bookSearchResults: document.getElementById("bookSearchResults"),
    askBookInput: document.getElementById("askBookInput"),
    askBookButton: document.getElementById("askBookButton"),
    clearAskBookButton: document.getElementById("clearAskBookButton"),
    qaAnswer: document.getElementById("qaAnswer"),
    sectionGrid: document.getElementById("sectionGrid"),
    wrongOnlyButton: document.getElementById("wrongOnlyButton"),
    exportButton: document.getElementById("exportButton"),
    installAppButton: document.getElementById("installAppButton"),
    startMiniExamButton: document.getElementById("startMiniExamButton"),
    startFullExamButton: document.getElementById("startFullExamButton"),
    startAutoReviewButton: document.getElementById("startAutoReviewButton"),
    startWrongOnlyButton: document.getElementById("startWrongOnlyButton"),
    pwaNote: document.getElementById("pwaNote"),
    bottomNav: document.getElementById("bottomNav"),
    studyOverlay: document.getElementById("studyOverlay"),
    closeStudy: document.getElementById("closeStudy"),
    shuffleButton: document.getElementById("shuffleButton"),
    finishSessionButton: document.getElementById("finishSessionButton"),
    sectionWrongButton: document.getElementById("sectionWrongButton"),
    studyRange: document.getElementById("studyRange"),
    studyTitle: document.getElementById("studyTitle"),
    studyDescription: document.getElementById("studyDescription"),
    openSummaryButton: document.getElementById("openSummaryButton"),
    studySummaryPanel: document.getElementById("studySummaryPanel"),
    studySummaryCopy: document.getElementById("studySummaryCopy"),
    progressLabel: document.getElementById("progressLabel"),
    progressSummary: document.getElementById("progressSummary"),
    studyTimer: document.getElementById("studyTimer"),
    typeTag: document.getElementById("typeTag"),
    difficultyTag: document.getElementById("difficultyTag"),
    customTag: document.getElementById("customTag"),
    questionCard: document.getElementById("questionCard"),
    questionStem: document.getElementById("questionStem"),
    optionList: document.getElementById("optionList"),
    feedbackBox: document.getElementById("feedbackBox"),
    sessionSummary: document.getElementById("sessionSummary"),
    checkButton: document.getElementById("checkButton"),
    nextButton: document.getElementById("nextButton"),
    openAddModal: document.getElementById("openAddModal"),
    summaryModal: document.getElementById("summaryModal"),
    summaryTitle: document.getElementById("summaryTitle"),
    summaryRange: document.getElementById("summaryRange"),
    summaryBody: document.getElementById("summaryBody"),
    summaryStartButton: document.getElementById("summaryStartButton"),
    summaryCloseButton: document.getElementById("summaryCloseButton"),
    addModal: document.getElementById("addModal"),
    saveCustomQuestion: document.getElementById("saveCustomQuestion"),
    customStem: document.getElementById("customStem"),
    customType: document.getElementById("customType"),
    optionA: document.getElementById("optionA"),
    optionB: document.getElementById("optionB"),
    optionC: document.getElementById("optionC"),
    optionD: document.getElementById("optionD"),
    correctOption: document.getElementById("correctOption"),
    customExplanation: document.getElementById("customExplanation"),
  };

  const loadPersisted = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed || { results: {}, customQuestions: {}, examHistory: [] };
    } catch {
      return { results: {}, customQuestions: {}, examHistory: [] };
    }
  };

  const persisted = loadPersisted();
  persisted.results = persisted.results || {};
  persisted.customQuestions = persisted.customQuestions || {};
  persisted.examHistory = Array.isArray(persisted.examHistory) ? persisted.examHistory : [];

  const state = {
    query: "",
    activeMode: "section",
    activeSectionId: null,
    deck: [],
    index: 0,
    selectedIndex: null,
    typedAnswer: "",
    checked: false,
    sessionAnswers: {},
    sessionComplete: false,
    sessionConfig: null,
    summarySectionId: null,
    timerRemaining: 0,
    timerIntervalId: null,
    completionReason: "",
    navTarget: "homeSection",
  };

  let deferredInstallPrompt = null;

  const savePersisted = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  };

  const getSummaryParts = (summary) => (Array.isArray(summary) ? summary.filter(Boolean) : []);

  const getSummaryText = (summary) => getSummaryParts(summary).join(" ");

  const hasSummary = (summary) => getSummaryParts(summary).length > 0;

  const renderSummaryMarkup = (summary) =>
    getSummaryParts(summary)
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");

  const escapeHtml = (value) =>
    String(value || "").replace(/[&<>"']/g, (character) => {
      const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entityMap[character] || character;
    });

  const foldForLookup = (value) =>
    String(value || "")
      .toLocaleLowerCase("tr-TR")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u");

  const tokenizeSearchQuery = (value) =>
    foldForLookup(value)
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token));

  const splitIntoSentences = (value) =>
    String(value || "")
      .match(/[^.!?]+[.!?]?/g)
      ?.map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 18) || [];

  const cloneQuestion = (question, section) => ({
    ...question,
    sectionId: section.id,
    sectionTitle: section.title,
    pageRange: section.pageRange,
  });

  const getSections = () =>
    baseData.sections.map((section) => {
      const customQuestions = (persisted.customQuestions[section.id] || []).map((question) => ({
        ...question,
        isCustom: true,
      }));
      return {
        ...section,
        questions: [...section.questions, ...customQuestions],
      };
    });

  const getSectionById = (sectionId) => getSections().find((section) => section.id === sectionId);

  const getQuestionInteraction = (question) => question?.interaction || "multiple";

  const isLearningQuestion = (question) => ["fill", "true-false"].includes(getQuestionInteraction(question));

  const getSectionQuestionGroups = (section) => {
    const questions = section?.questions || [];
    return {
      primary: questions.filter((question) => !isLearningQuestion(question)),
      learning: questions.filter((question) => isLearningQuestion(question)),
    };
  };

  const getSectionDeckByCategory = (sectionId, category = "primary") => {
    const section = getSectionById(sectionId);
    if (!section) {
      return [];
    }
    const groups = getSectionQuestionGroups(section);
    const source = category === "learning" ? groups.learning : groups.primary;
    return source.map((question) => cloneQuestion(question, section));
  };

  const getAllQuestions = (category = "primary") =>
    getSections().flatMap((section) => {
      const groups = getSectionQuestionGroups(section);
      const source = category === "all" ? section.questions : category === "learning" ? groups.learning : groups.primary;
      return source.map((question) => cloneQuestion(question, section));
    });

  const buildKnowledgeRecords = () => {
    const summaryRecords = (baseData.sections || [])
      .filter((section) => hasSummary(section.summary))
      .map((section) => ({
        id: `summary-${section.id}`,
        recordType: "summary",
        sectionId: section.id,
        sectionIds: [section.id],
        title: `${section.title} Ozeti`,
        sectionLabel: section.title,
        locationLabel: section.pageRange,
        text: getSummaryText(section.summary),
      }));

    const pageRecords = (bookData.pages || [])
      .filter((page) => String(page.text || "").trim())
      .map((page) => {
        const primarySectionId = (page.sectionIds || []).find((sectionId) => staticSectionById.has(sectionId)) || null;
        const sectionTitles =
          (page.sectionTitles || []).filter(Boolean).length > 0
            ? page.sectionTitles.filter(Boolean)
            : primarySectionId
              ? [staticSectionById.get(primarySectionId)?.title].filter(Boolean)
              : [];

        return {
          id: `page-${page.pdfPage}`,
          recordType: "page",
          sectionId: primarySectionId,
          sectionIds: page.sectionIds || [],
          title: sectionTitles[0] || "Kitap Metni",
          sectionLabel: sectionTitles.join(" · ") || "Bolum eslesmesi bulunamadi",
          locationLabel: page.pageLabel ? `${page.pageLabel} · PDF ${page.pdfPage}` : `PDF ${page.pdfPage}`,
          text: page.text,
        };
      });

    return [...summaryRecords, ...pageRecords].map((record) => ({
      ...record,
      foldedText: foldForLookup(record.text),
      foldedMeta: foldForLookup(`${record.title} ${record.sectionLabel} ${record.locationLabel}`),
    }));
  };

  const knowledgeRecords = buildKnowledgeRecords();

  const scoreKnowledgeRecord = (record, rawQuery, queryTokens) => {
    const query = foldForLookup(rawQuery).trim();
    if (!query) {
      return 0;
    }

    let score = 0;

    if (record.foldedMeta.includes(query)) {
      score += 18;
    }

    if (record.foldedText.includes(query)) {
      score += 14;
    }

    for (const token of queryTokens) {
      if (record.foldedMeta.includes(token)) {
        score += 7;
      }
      if (record.foldedText.includes(token)) {
        score += 4;
      }
    }

    if (record.recordType === "summary") {
      score += 2;
    }

    return score;
  };

  const buildKnowledgeExcerpt = (text, rawQuery, queryTokens, radius = 210) => {
    const safeText = String(text || "").trim();
    if (!safeText) {
      return "";
    }

    const foldedText = foldForLookup(safeText);
    const foldedQuery = foldForLookup(rawQuery).trim();
    let matchIndex = foldedQuery ? foldedText.indexOf(foldedQuery) : -1;

    if (matchIndex < 0) {
      for (const token of queryTokens) {
        matchIndex = foldedText.indexOf(token);
        if (matchIndex >= 0) {
          break;
        }
      }
    }

    if (matchIndex < 0) {
      matchIndex = 0;
    }

    let start = Math.max(0, matchIndex - Math.floor(radius / 2));
    let end = Math.min(safeText.length, matchIndex + radius);
    const previousBreak = safeText.lastIndexOf(" ", start);
    const nextBreak = safeText.indexOf(" ", end);

    start = previousBreak >= 0 ? previousBreak + 1 : 0;
    end = nextBreak >= 0 ? nextBreak : safeText.length;

    const excerpt = safeText.slice(start, end).trim();
    return `${start > 0 ? "..." : ""}${excerpt}${end < safeText.length ? "..." : ""}`;
  };

  const getKnowledgeMatches = (rawQuery, limit = 8) => {
    const query = String(rawQuery || "").trim();
    if (!query) {
      return [];
    }

    const queryTokens = tokenizeSearchQuery(query);
    const minimumTokenCount = queryTokens.length ? Math.max(1, Math.ceil(queryTokens.length / 3)) : 0;

    const ranked = knowledgeRecords
      .map((record) => {
        const score = scoreKnowledgeRecord(record, query, queryTokens);
        const tokenHits = queryTokens.filter(
          (token) => record.foldedMeta.includes(token) || record.foldedText.includes(token),
        ).length;

        return {
          record,
          score,
          tokenHits,
          excerpt: buildKnowledgeExcerpt(record.text, query, queryTokens),
        };
      })
      .filter((item) => item.score > 0 && item.tokenHits >= minimumTokenCount)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }
        if (right.tokenHits !== left.tokenHits) {
          return right.tokenHits - left.tokenHits;
        }
        return left.record.recordType.localeCompare(right.record.recordType);
      });

    if (!ranked.length) {
      return [];
    }

    const scoreFloor = Math.max(10, Math.floor(ranked[0].score * 0.55));
    return ranked.filter((item) => item.score >= scoreFloor).slice(0, limit);
  };

  const buildQuestionAnswer = (rawQuery) => {
    const matches = getKnowledgeMatches(rawQuery, 6);
    if (!matches.length) {
      return null;
    }

    const query = String(rawQuery || "").trim();
    const queryTokens = tokenizeSearchQuery(query);
    const seenSentences = new Set();
    const rankedSentences = matches
      .flatMap((match, matchIndex) =>
        splitIntoSentences(match.record.text).map((sentence) => {
          const foldedSentence = foldForLookup(sentence);
          let score = match.score - matchIndex;

          if (foldedSentence.includes(foldForLookup(query))) {
            score += 14;
          }

          for (const token of queryTokens) {
            if (foldedSentence.includes(token)) {
              score += 5;
            }
          }

          if (match.record.recordType === "summary") {
            score += 3;
          }

          return {
            sentence: sentence.trim(),
            score,
          };
        }),
      )
      .filter((item) => {
        const signature = foldForLookup(item.sentence);
        if (!signature || seenSentences.has(signature)) {
          return false;
        }
        seenSentences.add(signature);
        return true;
      })
      .sort((left, right) => right.score - left.score);

    const answerText =
      rankedSentences
        .slice(0, 3)
        .map((item) => item.sentence)
        .join(" ")
        .trim() || matches[0].excerpt;

    return {
      answerText,
      matches: matches.slice(0, 3),
    };
  };

  const getDifficultyScore = (question) => {
    const difficulty = (question.difficulty || "").toLowerCase();
    if (difficulty.includes("çok zor")) return 4;
    if (difficulty.includes("ales")) return 3;
    if (difficulty.includes("zor")) return 2;
    return 1;
  };

  const shuffle = (items) => {
    const cloned = [...items];
    for (let i = cloned.length - 1; i > 0; i -= 1) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [cloned[i], cloned[swapIndex]] = [cloned[swapIndex], cloned[i]];
    }
    return cloned;
  };

  const uniqueQuestions = (questions) => {
    const seen = new Set();
    return questions.filter((question) => {
      if (seen.has(question.id)) {
        return false;
      }
      seen.add(question.id);
      return true;
    });
  };

  const sortByUpdatedDesc = (questions) =>
    [...questions].sort((left, right) => {
      const leftDate = new Date(persisted.results[left.id]?.updatedAt || 0).getTime();
      const rightDate = new Date(persisted.results[right.id]?.updatedAt || 0).getTime();
      return rightDate - leftDate;
    });

  const getWrongDeck = (sectionId = null, category = "primary") => {
    const sections = getSections();
    const scopedSections = sectionId ? sections.filter((section) => section.id === sectionId) : sections;
    return scopedSections.flatMap((section) =>
      (category === "all"
        ? section.questions
        : category === "learning"
          ? getSectionQuestionGroups(section).learning
          : getSectionQuestionGroups(section).primary)
        .filter((question) => persisted.results[question.id]?.correct === false)
        .map((question) => cloneQuestion(question, section)),
    );
  };

  const buildSectionDeck = (sectionId, category = "primary") => getSectionDeckByCategory(sectionId, category);

  const buildBalancedDeck = (count) => {
    const sectionPools = shuffle(
      getSections()
        .map((section) => ({
          section,
          questions: getSectionQuestionGroups(section).primary,
        }))
        .filter((item) => item.questions.length)
        .map(({ section, questions }) => ({
          id: section.id,
          pool: shuffle(questions.map((question) => cloneQuestion(question, section))),
        })),
    );

    const deck = [];
    let addedInRound = true;

    while (deck.length < count && addedInRound) {
      addedInRound = false;
      for (const section of sectionPools) {
        if (deck.length >= count) {
          break;
        }
        const nextQuestion = section.pool.pop();
        if (nextQuestion) {
          deck.push(nextQuestion);
          addedInRound = true;
        }
      }
    }

    return shuffle(deck).slice(0, count);
  };

  const getSectionMetrics = (section) => {
    const groups = getSectionQuestionGroups(section);
    const questions = groups.primary;
    const results = questions.map((question) => persisted.results[question.id]).filter(Boolean);
    return {
      total: questions.length,
      learningTotal: groups.learning.length,
      solved: results.length,
      correct: results.filter((item) => item.correct).length,
      wrong: results.filter((item) => item.correct === false).length,
      custom: questions.filter((item) => item.isCustom).length,
    };
  };

  const getWeakSections = (limit = 3) =>
    getSections()
      .map((section) => ({
        ...section,
        metrics: getSectionMetrics(section),
      }))
      .filter((section) => section.metrics.wrong || section.metrics.solved)
      .sort((left, right) => {
        if (right.metrics.wrong !== left.metrics.wrong) {
          return right.metrics.wrong - left.metrics.wrong;
        }
        return right.metrics.solved - left.metrics.solved;
      })
      .slice(0, limit);

  const buildSmartReviewDeck = (limit = SMART_REVIEW_LIMIT) => {
    const sections = getSections();

    const wrongQuestions = sortByUpdatedDesc(
      sections.flatMap((section) =>
        getSectionQuestionGroups(section).primary
          .filter((question) => persisted.results[question.id]?.correct === false)
          .map((question) => cloneQuestion(question, section)),
      ),
    );

    const weakQuestions = getWeakSections(sections.length).flatMap((section) =>
      getSectionQuestionGroups(section).primary
        .filter((question) => !persisted.results[question.id])
        .map((question) => cloneQuestion(question, section)),
    );

    const unsolvedHardQuestions = getAllQuestions().filter((question) => !persisted.results[question.id]);
    unsolvedHardQuestions.sort((left, right) => getDifficultyScore(right) - getDifficultyScore(left));

    const mixed = uniqueQuestions([
      ...wrongQuestions,
      ...weakQuestions.sort((left, right) => getDifficultyScore(right) - getDifficultyScore(left)),
      ...unsolvedHardQuestions,
    ]);

    if (mixed.length) {
      return mixed.slice(0, limit);
    }

    return buildBalancedDeck(Math.min(limit, getAllQuestions().length));
  };

  const getCurrentQuestion = () => state.deck[state.index] || null;

  const getSessionMetrics = () => {
    const answers = Object.values(state.sessionAnswers);
    const correct = answers.filter((answer) => answer.correct).length;
    const wrong = answers.filter((answer) => answer.correct === false).length;
    const answered = answers.length;
    const skipped = Math.max(0, state.deck.length - answered);
    const score = state.deck.length ? Math.round((correct / state.deck.length) * 100) : 0;
    return { correct, wrong, answered, skipped, score };
  };

  const getSessionWrongBreakdown = () => {
    const counter = new Map();
    for (const [questionId, answer] of Object.entries(state.sessionAnswers)) {
      if (answer.correct) {
        continue;
      }
      const question = state.deck.find((item) => item.id === questionId);
      if (!question) {
        continue;
      }
      const current = counter.get(question.sectionTitle) || 0;
      counter.set(question.sectionTitle, current + 1);
    }

    return [...counter.entries()]
      .map(([sectionTitle, count]) => ({ sectionTitle, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 3);
  };

  const getOptionLetter = (index) => (Number.isInteger(index) && LETTERS[index]) || "-";

  const getQuestionTypeLabel = (question) => {
    const interaction = getQuestionInteraction(question);
    if (interaction === "fill") {
      return "Bosluk Doldurma";
    }
    if (interaction === "true-false") {
      return "Dogru / Yanlis";
    }
    return question?.type === "paragraph" ? "Uzun Paragraf" : "Dogrudan Bilgi";
  };

  const normalizeFreeTextAnswer = (value) =>
    foldForLookup(value)
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const getAcceptedAnswers = (question) => {
    const answers = Array.isArray(question?.answers) && question.answers.length
      ? question.answers
      : [question?.answer || question?.correctText || ""];
    return answers.map((answer) => String(answer || "").trim()).filter(Boolean);
  };

  const getQuestionCorrectAnswerText = (question) => {
    if (!question) {
      return "";
    }

    if (getQuestionInteraction(question) === "fill") {
      return getAcceptedAnswers(question).join(" / ");
    }

    if (Array.isArray(question.options) && Number.isInteger(question.correctIndex)) {
      return `${getOptionLetter(question.correctIndex)} · ${question.options[question.correctIndex]}`;
    }

    return "";
  };

  const getQuestionUserAnswerText = (question, answer) => {
    if (!answer) {
      return "Bos";
    }

    if (getQuestionInteraction(question) === "fill") {
      return answer.textAnswer || "Bos";
    }

    if (Number.isInteger(answer.selectedIndex) && Array.isArray(question.options)) {
      return `${getOptionLetter(answer.selectedIndex)} · ${question.options[answer.selectedIndex]}`;
    }

    return "Bos";
  };

  const hasPendingResponse = (question) => {
    if (!question) {
      return false;
    }

    return getQuestionInteraction(question) === "fill" ? Boolean(state.typedAnswer.trim()) : state.selectedIndex !== null;
  };

  const isQuestionAnswerCorrect = (question) => {
    if (!question) {
      return false;
    }

    if (getQuestionInteraction(question) === "fill") {
      const normalizedInput = normalizeFreeTextAnswer(state.typedAnswer);
      return getAcceptedAnswers(question)
        .map((answer) => normalizeFreeTextAnswer(answer))
        .includes(normalizedInput);
    }

    return state.selectedIndex === question.correctIndex;
  };

  const getPendingNextButtonLabel = (question, finishing) =>
    hasPendingResponse(question) ? (finishing ? "Kaydet ve Bitir" : "Kaydet ve Geç") : (finishing ? "Boş Bırak ve Bitir" : "Boş Geç");

  const getSessionReviewItems = () =>
    state.deck
      .map((question, order) => {
        const answer = state.sessionAnswers[question.id] || null;
        return {
          order: order + 1,
          question,
          answer,
        };
      })
      .filter((item) => !item.answer || item.answer.correct === false);

  const clearTimer = () => {
    if (state.timerIntervalId) {
      window.clearInterval(state.timerIntervalId);
      state.timerIntervalId = null;
    }
  };

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
    const restSeconds = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${restSeconds}`;
  };

  const updateTimer = () => {
    elements.studyTimer.textContent = formatTime(state.timerRemaining);
  };

  const startTimer = (seconds) => {
    clearTimer();
    state.timerRemaining = seconds;
    updateTimer();
    state.timerIntervalId = window.setInterval(() => {
      state.timerRemaining = Math.max(0, state.timerRemaining - 1);
      updateTimer();
      if (state.timerRemaining === 0) {
        completeSession("time");
      }
    }, 1000);
  };

  const setStudyVisibility = (visible) => {
    elements.studyOverlay.classList.toggle("hidden", !visible);
    elements.studyOverlay.setAttribute("aria-hidden", visible ? "false" : "true");
  };

  const isExamMode = () => state.activeMode === "exam-mini" || state.activeMode === "exam-full";

  const startSession = ({
    deck,
    mode,
    sectionId = null,
    title,
    description,
    range,
    summary = [],
    timerSeconds = 0,
    allowCustom = false,
    allowShuffle = true,
    allowWrongButton = false,
    finite = true,
  }) => {
    clearTimer();
    state.activeMode = mode;
    state.activeSectionId = sectionId;
    state.deck = deck;
    state.index = 0;
    state.selectedIndex = null;
    state.typedAnswer = "";
    state.checked = false;
    state.sessionAnswers = {};
    state.sessionComplete = false;
    state.completionReason = "";
    state.timerRemaining = timerSeconds;
    state.sessionConfig = {
      title,
      description,
      range,
      summary,
      timerSeconds,
      allowCustom,
      allowShuffle,
      allowWrongButton,
      finite,
    };

    setStudyVisibility(true);
    if (timerSeconds > 0) {
      startTimer(timerSeconds);
    }
    renderStudy();
  };

  const openStudy = (sectionId, mode = "section") => {
    if (mode === "section") {
      const section = getSectionById(sectionId);
      startSession({
        deck: buildSectionDeck(sectionId, "primary"),
        mode,
        sectionId,
        title: section?.title || "Konu Testi",
        description: section?.description || "Konu bazlı ana test oturumu.",
        range: section?.pageRange || "Konu bölümü",
        summary: section?.summary || [],
        allowCustom: true,
        allowShuffle: true,
        allowWrongButton: true,
        finite: true,
      });
      return;
    }

    if (mode === "section-learning") {
      const section = getSectionById(sectionId);
      startSession({
        deck: buildSectionDeck(sectionId, "learning"),
        mode,
        sectionId,
        title: `${section?.title || "Konu"} · Öğretici Çalışma`,
        description: "Boşluk doldurma ve doğru/yanlış sorularını ayrı öğretici kategori olarak çözüyorsun.",
        range: section?.pageRange || "Konu bölümü",
        summary: section?.summary || [],
        allowCustom: false,
        allowShuffle: true,
        allowWrongButton: false,
        finite: true,
      });
      return;
    }

    if (mode === "wrong-global") {
      startSession({
        deck: getWrongDeck(null, "primary"),
        mode,
        title: "Yanlışlarım",
        description: "Ana test kategorisinde daha önce yanlış yaptığın soruları yeniden çözüyorsun.",
        range: "Yanlış havuzu",
        allowCustom: false,
        allowShuffle: true,
        allowWrongButton: false,
        finite: true,
      });
      return;
    }

    if (mode === "wrong-section") {
      const section = getSectionById(sectionId);
      startSession({
        deck: getWrongDeck(sectionId, "primary"),
        mode,
        sectionId,
        title: `${section?.title || "Konu"} · Yanlışlar`,
        description: "Bu konudaki ana test yanlışlarını peş peşe çözüyorsun.",
        range: section?.pageRange || "Konu bölümü",
        summary: section?.summary || [],
        allowCustom: false,
        allowShuffle: true,
        allowWrongButton: false,
        finite: true,
      });
    }
  };

  const startExam = (presetKey) => {
    const preset = EXAM_PRESETS[presetKey];
    const availableCount = Math.min(preset.count, getAllQuestions().length);
    const deck = buildBalancedDeck(availableCount);
    startSession({
      deck,
      mode: preset.mode,
      title: preset.title,
      description: `${preset.description} Süre: ${preset.durationMinutes} dakika.`,
      range: "Karışık konu dağılımı",
      timerSeconds: preset.durationMinutes * 60,
      allowCustom: false,
      allowShuffle: false,
      allowWrongButton: false,
      finite: true,
    });
  };

  const startSmartReview = () => {
    const deck = buildSmartReviewDeck();
    startSession({
      deck,
      mode: "smart-review",
      title: "Akıllı Tekrar",
      description: "Son yanlışların ve zayıf konularından seçilen karışık tekrar oturumu.",
      range: "Yanlış odaklı tekrar",
      allowCustom: false,
      allowShuffle: true,
      allowWrongButton: false,
      finite: true,
    });
  };

  const closeStudy = () => {
    clearTimer();
    setStudyVisibility(false);
    closeSummaryModal();
  };

  const closeSummaryModal = () => {
    state.summarySectionId = null;
    if (elements.summaryModal.open) {
      elements.summaryModal.close();
    }
  };

  const openSummaryModal = (sectionId) => {
    const section = getSectionById(sectionId);
    if (!section || !hasSummary(section.summary)) {
      return;
    }

    state.summarySectionId = section.id;
    elements.summaryTitle.textContent = section.title;
    elements.summaryRange.textContent = section.pageRange;
    elements.summaryBody.innerHTML = renderSummaryMarkup(section.summary);

    const returnToCurrentStudy =
      state.activeSectionId === section.id && !elements.studyOverlay.classList.contains("hidden");
    elements.summaryStartButton.textContent = returnToCurrentStudy ? "Teste Dön" : "Bu Konuyu Çöz";
    if (!elements.summaryModal.open) {
      elements.summaryModal.showModal();
    }
  };

  const setActiveNav = (targetId) => {
    state.navTarget = targetId;
    elements.bottomNav.querySelectorAll("[data-nav-target]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.navTarget === targetId);
    });
  };

  const renderHeroStats = () => {
    const sections = getSections();
    const allQuestions = sections.flatMap((section) => section.questions);
    const resultValues = Object.values(persisted.results);
    const cards = [
      { label: "Toplam Soru", value: allQuestions.length },
      { label: "Çözülen", value: resultValues.length },
      { label: "Bekleyen Yanlış", value: resultValues.filter((item) => item.correct === false).length },
      { label: "Özel Soru", value: allQuestions.filter((item) => item.isCustom).length },
    ];

    elements.heroStats.innerHTML = cards
      .map(
        (item) => `
          <article class="stat-card">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </article>
        `,
      )
      .join("");
  };

  const renderFeatureStats = () => {
    const lastExam = persisted.examHistory[0] || null;
    const averageScore = persisted.examHistory.length
      ? Math.round(persisted.examHistory.reduce((sum, exam) => sum + exam.score, 0) / persisted.examHistory.length)
      : 0;
    const weakSection = getWeakSections(1)[0] || null;
    const reviewDeck = buildSmartReviewDeck();
    const waitingWrongCount = getWrongDeck().length;

    const examCards = [
      { label: "Son Skor", value: lastExam ? `%${lastExam.score}` : "Hazır" },
      { label: "Deneme", value: persisted.examHistory.length || 0 },
      { label: "Ortalama", value: persisted.examHistory.length ? `%${averageScore}` : "-" },
    ];

    const reviewCards = [
      { label: "Tekrar Havuzu", value: `${reviewDeck.length} soru` },
      { label: "Yanlış", value: waitingWrongCount },
      { label: "Zayıf Konu", value: weakSection ? weakSection.title : "Dengeli" },
    ];

    elements.examStats.innerHTML = examCards
      .map(
        (item) => `
          <article class="feature-metric">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </article>
        `,
      )
      .join("");

    elements.reviewStats.innerHTML = reviewCards
      .map(
        (item) => `
          <article class="feature-metric">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </article>
        `,
      )
      .join("");
  };

  const bindKnowledgeActions = (container) => {
    if (!container) {
      return;
    }

    container.querySelectorAll("[data-open-knowledge-section]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.openKnowledgeSection, "section"));
    });

    container.querySelectorAll("[data-open-knowledge-summary]").forEach((button) => {
      button.addEventListener("click", () => openSummaryModal(button.dataset.openKnowledgeSummary));
    });
  };

  const renderKnowledgeCard = (item) => {
    const primarySectionId = item.record.sectionId || item.record.sectionIds?.[0] || null;
    const sectionMeta = primarySectionId ? staticSectionById.get(primarySectionId) : null;
    const typeLabel = item.record.recordType === "summary" ? "Ozetten" : "Metinden";
    const openSectionButton = primarySectionId
      ? `<button class="ghost-button" type="button" data-open-knowledge-section="${primarySectionId}">Konuyu Ac</button>`
      : "";
    const openSummaryButton =
      primarySectionId && sectionMeta && hasSummary(sectionMeta.summary)
        ? `<button class="ghost-button" type="button" data-open-knowledge-summary="${primarySectionId}">Ozeti Ac</button>`
        : "";

    return `
      <article class="search-result-card">
        <div class="search-result-card__top">
          <div class="metric-list">
            <span class="tag">${typeLabel}</span>
            <span class="tag muted">${escapeHtml(item.record.sectionLabel)}</span>
          </div>
          <span class="result-location">${escapeHtml(item.record.locationLabel)}</span>
        </div>
        <p class="search-result-card__title">${escapeHtml(item.record.title)}</p>
        <p class="search-result-card__excerpt">${escapeHtml(item.excerpt)}</p>
        <div class="search-result-card__actions">
          ${openSectionButton}
          ${openSummaryButton}
        </div>
      </article>
    `;
  };

  const renderBookSearchResults = () => {
    const query = String(elements.bookSearchInput?.value || "").trim();
    if (!query) {
      elements.bookSearchResults.innerHTML =
        '<div class="empty-state">Kitap metninde aramak icin bir kavram, ifade veya konu yaz.</div>';
      return;
    }

    const matches = getKnowledgeMatches(query, 8);
    if (!matches.length) {
      elements.bookSearchResults.innerHTML =
        '<div class="empty-state">Bu arama icin kitap metninde guclu bir eslesme bulunamadi.</div>';
      return;
    }

    elements.bookSearchResults.innerHTML = matches.map(renderKnowledgeCard).join("");
    bindKnowledgeActions(elements.bookSearchResults);
  };

  const clearQaAnswer = () => {
    elements.qaAnswer.classList.add("hidden");
    elements.qaAnswer.innerHTML = "";
  };

  const renderQaAnswer = () => {
    const query = String(elements.askBookInput?.value || "").trim();
    if (!query) {
      clearQaAnswer();
      return;
    }

    const answer = buildQuestionAnswer(query);
    elements.qaAnswer.classList.remove("hidden");

    if (!answer) {
      elements.qaAnswer.innerHTML =
        '<div class="empty-state">Bu soruya uygun dayanak metin bulunamadi. Soruyu daha acik anahtar kelimelerle yaz.</div>';
      return;
    }

    elements.qaAnswer.innerHTML = `
      <p class="eyebrow">Kisa Cevap</p>
      <p class="qa-answer__lead">${escapeHtml(answer.answerText)}</p>
      <p class="qa-answer__note">
        Cevap, kitabin gomulu metninden yuksek eslesmeli cumleler ve ozet parcalarindan derlenmistir. Dayanaklar asagidadir.
      </p>
      <div class="source-list">
        ${answer.matches.map(renderKnowledgeCard).join("")}
      </div>
    `;

    bindKnowledgeActions(elements.qaAnswer);
  };

  const renderSections = () => {
    const sections = getSections();
    const filtered = sections.filter((section) => {
      const haystack = `${section.title} ${section.description} ${section.pageRange} ${getSummaryText(section.summary)}`.toLowerCase();
      return haystack.includes(state.query.toLowerCase());
    });

    if (!filtered.length) {
      elements.sectionGrid.innerHTML = '<div class="empty-state">Aramanla eşleşen konu bulunamadı.</div>';
      return;
    }

    elements.sectionGrid.innerHTML = filtered
      .map((section) => {
        const metrics = getSectionMetrics(section);
        const hasLearningDeck = metrics.learningTotal > 0;
        const summaryMarkup = getSummaryParts(section.summary).length
          ? `
            <details class="section-summary">
              <summary>Bölüm Özeti</summary>
              <div class="section-summary__body">${renderSummaryMarkup(section.summary)}</div>
            </details>
          `
          : "";
        return `
          <article class="section-card">
            <div class="card-top">
              <div>
                <span class="card-range">${section.pageRange}</span>
                <h3>${section.title}</h3>
              </div>
              <span class="metric">${metrics.total + metrics.learningTotal} soru</span>
            </div>
            <p>${section.description}</p>
            ${summaryMarkup}
            <div class="metric-list">
              <span class="metric">${metrics.total} ana test</span>
              <span class="metric muted">${metrics.learningTotal} öğretici</span>
              <span class="metric">${metrics.correct} doğru</span>
              <span class="metric muted">${metrics.wrong} yanlış</span>
              <span class="metric muted">${metrics.custom} özel</span>
            </div>
            <div class="card-bottom">
              <button class="primary-button" data-open-section="${section.id}">Teste Başla</button>
              ${hasLearningDeck ? `<button class="ghost-button" data-open-learning="${section.id}">Öğretici</button>` : ""}
              <button class="ghost-button" data-open-summary="${section.id}">Özeti Aç</button>
              <button class="ghost-button" data-open-wrong="${section.id}">Yanlışlar</button>
            </div>
          </article>
        `;
      })
      .join("");

    elements.sectionGrid.querySelectorAll("[data-open-section]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.openSection, "section"));
    });

    elements.sectionGrid.querySelectorAll("[data-open-wrong]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.openWrong, "wrong-section"));
    });

    elements.sectionGrid.querySelectorAll("[data-open-summary]").forEach((button) => {
      button.addEventListener("click", () => openSummaryModal(button.dataset.openSummary));
    });

    elements.sectionGrid.querySelectorAll("[data-open-learning]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.openLearning, "section-learning"));
    });
  };

  const renderSessionSummary = () => {
    const metrics = getSessionMetrics();
    const breakdown = getSessionWrongBreakdown();
    const reviewItems = getSessionReviewItems();
    const isExam = isExamMode();
    const reasonText =
      state.completionReason === "time"
        ? "Süre doldu. Oturum mevcut cevaplarınla kapatıldı."
        : state.completionReason === "manual"
          ? "Oturumu sen bitirdin. Mevcut cevaplar üzerinden özet oluşturuldu."
          : isExam
            ? "Deneme tamamlandı. Şimdi sonuçlarını toplu olarak değerlendir."
            : "Test tamamlandı. Sonuçların toplu olarak aşağıda listelendi.";

    const breakdownText = breakdown.length
      ? `En çok zorlandığın konu: ${breakdown[0].sectionTitle}. Diğer öne çıkan alanlar: ${breakdown
          .slice(1)
          .map((item) => item.sectionTitle)
          .join(", ") || "yok"}.`
      : "Bu oturumda yanlış veya boş soru oluşmadı.";

    const reviewMarkup = reviewItems.length
      ? `
        <div class="review-list">
          <p class="eyebrow">Toplu Değerlendirme</p>
          ${reviewItems
            .map((item) => {
              const userChoice = escapeHtml(getQuestionUserAnswerText(item.question, item.answer));
              const correctChoice = escapeHtml(getQuestionCorrectAnswerText(item.question));
              const stateLabel = item.answer ? "Yanlış" : "Boş";
              const stateClass = item.answer ? "wrong" : "blank";
              return `
                <article class="review-card">
                  <div class="review-card__top">
                    <span class="tag ${stateClass}">${stateLabel}</span>
                    <span class="metric muted">Soru ${item.order} · ${item.question.sectionTitle}</span>
                  </div>
                  <p class="review-card__stem">${escapeHtml(item.question.stem)}</p>
                  <p class="review-card__meta"><strong>Senin cevabın:</strong> ${userChoice}</p>
                  <p class="review-card__meta"><strong>Doğru cevap:</strong> ${correctChoice}</p>
                  <p class="review-card__explanation">${escapeHtml(item.question.explanation)}</p>
                </article>
              `;
            })
            .join("")}
        </div>
      `
      : `
        <div class="review-list">
          <p class="eyebrow">Toplu Değerlendirme</p>
          <div class="summary-note">Bu oturumda yanlış veya boş soru kalmadı.</div>
        </div>
      `;

    elements.sessionSummary.innerHTML = `
      <div>
        <p class="eyebrow">${isExam ? "Deneme Özeti" : "Oturum Özeti"}</p>
        <h3>${state.sessionConfig?.title || "Oturum"}</h3>
        <p>${reasonText}</p>
      </div>
      <div class="summary-grid">
        <article class="summary-card">
          <span>Doğru</span>
          <strong>${metrics.correct}</strong>
        </article>
        <article class="summary-card">
          <span>Yanlış</span>
          <strong>${metrics.wrong}</strong>
        </article>
        <article class="summary-card">
          <span>Boş</span>
          <strong>${metrics.skipped}</strong>
        </article>
        <article class="summary-card">
          <span>Başarı</span>
          <strong>%${metrics.score}</strong>
        </article>
      </div>
      <p class="summary-note">${breakdownText}</p>
      ${reviewMarkup}
    `;
  };

  const renderStudy = () => {
    const config = state.sessionConfig;
    const current = getCurrentQuestion();
    const metrics = getSessionMetrics();

    elements.studyRange.textContent = config?.range || "";
    elements.studyTitle.textContent = config?.title || "Çalışma";
    elements.studyDescription.textContent = config?.description || "";
    const summaryMarkup = renderSummaryMarkup(config?.summary);
    elements.studySummaryPanel.classList.toggle("hidden", !summaryMarkup);
    elements.studySummaryCopy.innerHTML = summaryMarkup;
    elements.openSummaryButton.classList.toggle("hidden", !(state.activeSectionId && hasSummary(config?.summary)));
    elements.openAddModal.classList.toggle("hidden", !config?.allowCustom);
    elements.shuffleButton.classList.toggle("hidden", !config?.allowShuffle);
    elements.finishSessionButton.classList.toggle("hidden", !config?.finite || state.sessionComplete || !state.deck.length);
    elements.sectionWrongButton.classList.toggle("hidden", !config?.allowWrongButton);
    elements.studyTimer.classList.toggle("hidden", !(config?.timerSeconds > 0) || state.sessionComplete);

    if (config?.timerSeconds > 0 && !state.sessionComplete) {
      updateTimer();
    }

    if (state.sessionComplete) {
      elements.questionCard.classList.add("hidden");
      elements.sessionSummary.classList.remove("hidden");
      elements.feedbackBox.className = "feedback hidden";
      elements.progressLabel.textContent = "Oturum tamamlandı";
      elements.progressSummary.textContent = `${metrics.correct} doğru · ${metrics.wrong} yanlış · ${metrics.skipped} boş`;
      elements.checkButton.classList.add("hidden");
      elements.nextButton.disabled = false;
      elements.nextButton.textContent = "Kapat";
      renderSessionSummary();
      return;
    }

    elements.questionCard.classList.remove("hidden");
    elements.sessionSummary.classList.add("hidden");
    elements.checkButton.classList.remove("hidden");

    if (!current) {
      elements.progressLabel.textContent = "Soru 0 / 0";
      elements.progressSummary.textContent = "Hazır";
      elements.questionStem.innerHTML = '<div class="empty-state">Bu oturum için gösterilecek soru yok.</div>';
      elements.optionList.innerHTML = "";
      elements.feedbackBox.className = "feedback hidden";
      elements.typeTag.textContent = "";
      elements.difficultyTag.textContent = "";
      elements.customTag.textContent = "";
      elements.checkButton.disabled = true;
      elements.nextButton.disabled = false;
      elements.nextButton.textContent = "Kapat";
      return;
    }

    elements.progressLabel.textContent = `Soru ${state.index + 1} / ${state.deck.length}`;
    elements.progressSummary.textContent = `${metrics.answered} cevap kaydedildi · sonuç test sonunda gösterilecek`;
    elements.typeTag.textContent = getQuestionTypeLabel(current);
    elements.difficultyTag.textContent = current.difficulty;
    elements.customTag.textContent = current.isCustom ? "Özel Soru" : current.sectionTitle;
    elements.questionStem.textContent = current.stem;

    const finishing = state.index >= state.deck.length - 1 && config?.finite;
    if (!state.checked) {
      elements.nextButton.textContent = getPendingNextButtonLabel(current, finishing);
    } else {
      elements.nextButton.textContent = finishing ? "Bitir" : "Sonraki";
    }
    elements.nextButton.disabled = false;

    if (getQuestionInteraction(current) === "fill") {
      const placeholder = escapeHtml(current.placeholder || "Cevabini yaz");
      const hint = current.hint ? `<p class="fill-answer-hint">${escapeHtml(current.hint)}</p>` : "";
      elements.optionList.innerHTML = `
        <div class="fill-answer-card">
          <label class="search-box" for="fillAnswerInput">
            <span>Cevabini yaz</span>
            <input
              class="fill-answer-input"
              id="fillAnswerInput"
              type="text"
              value="${escapeHtml(state.typedAnswer)}"
              placeholder="${placeholder}"
              ${state.checked ? "disabled" : ""}
            />
          </label>
          ${hint}
        </div>
      `;

      const fillAnswerInput = document.getElementById("fillAnswerInput");
      if (fillAnswerInput) {
        fillAnswerInput.addEventListener("input", (event) => {
          if (state.checked) {
            return;
          }
          state.typedAnswer = event.target.value;
          elements.checkButton.disabled = !hasPendingResponse(current);
          elements.nextButton.textContent = getPendingNextButtonLabel(current, finishing);
        });
      }
    } else {
      elements.optionList.innerHTML = current.options
        .map((option, index) => {
          const isSelected = state.selectedIndex === index;
          const classes = ["option-button"];
          if (isSelected) classes.push("selected");
          if (state.checked) classes.push("locked");
          return `
            <button class="${classes.join(" ")}" data-option-index="${index}" type="button">
              <span class="option-letter">${LETTERS[index]}</span>
              <span>${option}</span>
            </button>
          `;
        })
        .join("");

      elements.optionList.querySelectorAll("[data-option-index]").forEach((button) => {
        button.addEventListener("click", () => {
          if (state.checked) {
            return;
          }
          state.selectedIndex = Number(button.dataset.optionIndex);
          renderStudy();
        });
      });
    }

    elements.feedbackBox.className = "feedback hidden";
    elements.feedbackBox.textContent = "";

    if (!state.checked) {
      elements.checkButton.textContent = "Cevabı Kaydet";
      elements.checkButton.disabled = !hasPendingResponse(current);
      return;
    }

    elements.checkButton.textContent = "Kaydedildi";
    elements.checkButton.disabled = true;
  };

  const completeSession = (reason = "completed") => {
    if (state.sessionComplete) {
      return;
    }

    clearTimer();
    state.sessionComplete = true;
    state.completionReason = reason;

    if (isExamMode()) {
      const metrics = getSessionMetrics();
      persisted.examHistory.unshift({
        mode: state.activeMode,
        title: state.sessionConfig?.title || "Deneme",
        correct: metrics.correct,
        wrong: metrics.wrong,
        skipped: metrics.skipped,
        score: metrics.score,
        total: state.deck.length,
        completedAt: new Date().toISOString(),
      });
      persisted.examHistory = persisted.examHistory.slice(0, 12);
      savePersisted();
    }

    renderHeroStats();
    renderFeatureStats();
    renderSections();
    renderStudy();
  };

  const saveCurrentAnswer = () => {
    const current = getCurrentQuestion();
    if (!current || !hasPendingResponse(current) || state.checked || state.sessionComplete) {
      return false;
    }

    const answerPayload = {
      selectedIndex: getQuestionInteraction(current) === "fill" ? null : state.selectedIndex,
      textAnswer: getQuestionInteraction(current) === "fill" ? state.typedAnswer.trim() : "",
      correct: isQuestionAnswerCorrect(current),
      updatedAt: new Date().toISOString(),
    };

    persisted.results[current.id] = answerPayload;
    state.sessionAnswers[current.id] = answerPayload;
    state.checked = true;
    savePersisted();
    renderHeroStats();
    renderFeatureStats();
    renderSections();
    return true;
  };

  const recordAnswer = () => {
    if (!saveCurrentAnswer()) {
      return;
    }
    renderStudy();
  };

  const goNext = () => {
    if (state.sessionComplete || !state.deck.length) {
      closeStudy();
      return;
    }

    const current = getCurrentQuestion();
    if (!state.checked && hasPendingResponse(current)) {
      saveCurrentAnswer();
    }

    if (state.index >= state.deck.length - 1) {
      if (state.sessionConfig?.finite) {
        completeSession("completed");
        return;
      }
      state.index = 0;
    } else {
      state.index += 1;
    }

    state.selectedIndex = null;
    state.typedAnswer = "";
    state.checked = false;
    renderStudy();
  };

  const shuffleCurrentDeck = () => {
    if (!state.sessionConfig?.allowShuffle || !state.deck.length || state.sessionComplete) {
      return;
    }
    state.deck = shuffle(state.deck);
    state.index = 0;
    state.selectedIndex = null;
    state.typedAnswer = "";
    state.checked = false;
    renderStudy();
  };

  const clearModal = () => {
    elements.customStem.value = "";
    elements.customType.value = "paragraph";
    elements.optionA.value = "";
    elements.optionB.value = "";
    elements.optionC.value = "";
    elements.optionD.value = "";
    elements.correctOption.value = "0";
    elements.customExplanation.value = "";
  };

  const saveCustomQuestion = () => {
    if (!state.activeSectionId) {
      return;
    }

    const payload = {
      stem: elements.customStem.value.trim(),
      type: elements.customType.value,
      options: [
        elements.optionA.value.trim(),
        elements.optionB.value.trim(),
        elements.optionC.value.trim(),
        elements.optionD.value.trim(),
      ],
      correctIndex: Number(elements.correctOption.value),
      explanation: elements.customExplanation.value.trim(),
    };

    if (!payload.stem || payload.options.some((option) => !option) || !payload.explanation) {
      return;
    }

    const sectionQuestions = persisted.customQuestions[state.activeSectionId] || [];
    sectionQuestions.push({
      id: `${state.activeSectionId}-custom-${Date.now()}`,
      difficulty: "Özel Soru",
      ...payload,
      isCustom: true,
    });
    persisted.customQuestions[state.activeSectionId] = sectionQuestions;
    savePersisted();
    clearModal();
    elements.addModal.close();
    renderHeroStats();
    renderFeatureStats();
    renderSections();
    openStudy(state.activeSectionId, "section");
  };

  const exportCustomQuestions = () => {
    const payload = JSON.stringify(persisted.customQuestions, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ufka-ozel-sorular.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  const updatePwaNote = ({
    message,
    ready = false,
    showInstallButton = false,
    disableInstallButton = false,
    buttonLabel = "Uygulamayı Yükle",
  }) => {
    if (!elements.pwaNote || !elements.installAppButton) {
      return;
    }

    elements.pwaNote.textContent = message;
    elements.pwaNote.classList.toggle("ready", ready);
    elements.installAppButton.classList.toggle("hidden", !showInstallButton);
    elements.installAppButton.disabled = disableInstallButton;
    elements.installAppButton.textContent = buttonLabel;
  };

  const registerPwa = async () => {
    if (!elements.pwaNote || !elements.installAppButton) {
      return;
    }

    if (isStandalone()) {
      updatePwaNote({
        message: "Uygulama ana ekrandan çalışıyor.",
        ready: true,
      });
    }

    if (!window.isSecureContext || !/^https?:$/.test(window.location.protocol)) {
      updatePwaNote({
        message: "PWA kurulumu için uygulamayı localhost veya HTTPS üzerinden aç.",
      });
      return;
    }

    if (!("serviceWorker" in navigator)) {
      updatePwaNote({
        message: "Bu tarayıcı PWA önbelleklemesini desteklemiyor.",
      });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js");
      await navigator.serviceWorker.ready;
      registration.update();
      updatePwaNote({
        message: "Çevrimdışı kullanım hazır. Destekleyen tarayıcılarda ana ekrana ekleyebilirsin.",
        ready: true,
      });
    } catch {
      updatePwaNote({
        message: "PWA kurulumu tamamlanamadı. Uygulamayı localhost veya HTTPS üzerinden yeniden aç.",
      });
    }
  };

  const observeNavigationTargets = () => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const targets = ["homeSection", "examSection", "reviewSection"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visible) {
          setActiveNav(visible.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.55],
      },
    );

    targets.forEach((target) => observer.observe(target));
  };

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderSections();
  });
  elements.bookSearchInput.addEventListener("input", renderBookSearchResults);
  elements.clearBookSearchButton.addEventListener("click", () => {
    elements.bookSearchInput.value = "";
    renderBookSearchResults();
    elements.bookSearchInput.focus();
  });
  elements.askBookButton.addEventListener("click", renderQaAnswer);
  elements.clearAskBookButton.addEventListener("click", () => {
    elements.askBookInput.value = "";
    clearQaAnswer();
    elements.askBookInput.focus();
  });
  elements.askBookInput.addEventListener("input", () => {
    if (!elements.askBookInput.value.trim()) {
      clearQaAnswer();
    }
  });
  elements.askBookInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      renderQaAnswer();
    }
  });

  elements.wrongOnlyButton.addEventListener("click", () => openStudy(null, "wrong-global"));
  elements.startWrongOnlyButton.addEventListener("click", () => openStudy(null, "wrong-global"));
  elements.startAutoReviewButton.addEventListener("click", startSmartReview);
  elements.startMiniExamButton.addEventListener("click", () => startExam("mini"));
  elements.startFullExamButton.addEventListener("click", () => startExam("full"));
  elements.exportButton.addEventListener("click", exportCustomQuestions);
  elements.closeStudy.addEventListener("click", closeStudy);
  elements.shuffleButton.addEventListener("click", shuffleCurrentDeck);
  elements.finishSessionButton.addEventListener("click", () => completeSession("manual"));
  elements.sectionWrongButton.addEventListener("click", () => {
    if (!state.activeSectionId) {
      return;
    }
    openStudy(state.activeSectionId, "wrong-section");
  });
  elements.openSummaryButton.addEventListener("click", () => {
    if (!state.activeSectionId) {
      return;
    }
    openSummaryModal(state.activeSectionId);
  });
  elements.checkButton.addEventListener("click", recordAnswer);
  elements.nextButton.addEventListener("click", goNext);
  elements.summaryCloseButton.addEventListener("click", closeSummaryModal);
  elements.summaryStartButton.addEventListener("click", () => {
    const sectionId = state.summarySectionId;
    const returnToCurrentStudy =
      state.activeSectionId === sectionId && !elements.studyOverlay.classList.contains("hidden");
    closeSummaryModal();
    if (!returnToCurrentStudy && sectionId) {
      openStudy(sectionId, "section");
    }
  });
  elements.summaryModal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSummaryModal();
  });
  elements.openAddModal.addEventListener("click", () => {
    if (!state.activeSectionId) {
      return;
    }
    elements.addModal.showModal();
  });
  elements.saveCustomQuestion.addEventListener("click", saveCustomQuestion);

  elements.bottomNav.querySelectorAll("[data-nav-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.navTarget);
      if (!target) {
        return;
      }
      setActiveNav(button.dataset.navTarget);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  elements.installAppButton.addEventListener("click", async () => {
    if (isStandalone()) {
      updatePwaNote({
        message: "Uygulama zaten ana ekrana eklenmiş durumda.",
        ready: true,
      });
      return;
    }

    if (!deferredInstallPrompt) {
      updatePwaNote({
        message: "Tarayıcı menüsündeki ana ekrana ekle seçeneğini de kullanabilirsin.",
        ready: true,
      });
      return;
    }

    elements.installAppButton.disabled = true;
    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    updatePwaNote({
      message:
        choice.outcome === "accepted"
          ? "Kurulum isteği alındı. Uygulamayı ana ekrandan açabilirsin."
          : "Kurulum iptal edildi. İstersen tekrar deneyebilirsin.",
      ready: choice.outcome === "accepted",
      showInstallButton: choice.outcome !== "accepted",
      disableInstallButton: false,
    });
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updatePwaNote({
      message: "Kurulum hazır. Butona basarak uygulamayı ana ekrana ekleyebilirsin.",
      ready: true,
      showInstallButton: true,
    });
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updatePwaNote({
      message: "Uygulama başarıyla ana ekrana eklendi.",
      ready: true,
    });
  });

  renderHeroStats();
  renderFeatureStats();
  renderBookSearchResults();
  clearQaAnswer();
  renderSections();
  setActiveNav("homeSection");
  observeNavigationTargets();
  registerPwa();
})();

