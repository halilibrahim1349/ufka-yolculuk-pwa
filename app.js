(() => {
  const STORAGE_KEY = "ufka-study-state-v3-reset";
  const LETTERS = ["A", "B", "C", "D", "E"];
  const SMART_REVIEW_LIMIT = 20;
  const READER_DEFAULTS = {
    theme: "paper",
    density: "relaxed",
    fontScale: 100,
    mode: "standard",
  };
  const READER_FONT_MIN = 88;
  const READER_FONT_MAX = 132;
  const READER_FONT_STEP = 4;
  const EXAM_PRESETS = {
    mini: {
      mode: "exam-mini",
      count: 30,
      durationMinutes: 35,
      title: "30 Soruluk Deneme",
      description: "Karisik konu dagilimi ile sureli deneme oturumu.",
    },
    full: {
      mode: "exam-full",
      count: 50,
      durationMinutes: 60,
      title: "50 Soruluk Deneme",
      description: "Genis kapsamli sureli karisik deneme oturumu.",
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
  const SECTION_CATEGORY_ORDER = ["all", "foundation", "faith", "guidance", "afterlife"];
  const SECTION_CATEGORY_META = {
    all: {
      id: "all",
      title: "Tum Konular",
      shortTitle: "Tum",
      description: "Tum bolumleri birlikte gez.",
    },
    foundation: {
      id: "foundation",
      title: "Temel Sorular",
      shortTitle: "Temel",
      description: "Inanma ihtiyaci, bilgi ve inancin gerekliligi.",
    },
    faith: {
      id: "faith",
      title: "Iman ve Tevhit",
      shortTitle: "Iman",
      description: "Imanin kapsami ve Allah'i bilme ekseni.",
    },
    guidance: {
      id: "guidance",
      title: "Gayb ve Rehberlik",
      shortTitle: "Rehberlik",
      description: "Melekler, kitaplar ve peygamberlik bolumleri.",
    },
    afterlife: {
      id: "afterlife",
      title: "Ahiret ve Kader",
      shortTitle: "Ahiret",
      description: "Olum sonrasi hayat ve kader konulari.",
    },
  };
  const SECTION_CATEGORY_BY_SECTION = {
    s1: "foundation",
    s2: "foundation",
    s3: "faith",
    s4: "faith",
    s5: "guidance",
    s6: "guidance",
    s7: "guidance",
    s8: "afterlife",
    s9: "afterlife",
  };

  const progressStrip = document.querySelector(".progress-strip");
  if (progressStrip && !document.getElementById("studySummaryPanel")) {
    progressStrip.insertAdjacentHTML(
      "afterend",
      `<section class="study-summary-panel hidden" id="studySummaryPanel"><p class="eyebrow">Bolum Ozeti</p><div class="study-summary-copy" id="studySummaryCopy"></div></section>`,
    );
  }

  const elements = {
    appShell: document.getElementById("appShell"),
    heroStats: document.getElementById("heroStats"),
    examStats: document.getElementById("examStats"),
    reviewStats: document.getElementById("reviewStats"),
    readerSection: document.getElementById("readerSection"),
    openReaderButton: document.getElementById("openReaderButton"),
    readerSectionSelect: document.getElementById("readerSectionSelect"),
    readerFilterInput: document.getElementById("readerFilterInput"),
    clearReaderFilterButton: document.getElementById("clearReaderFilterButton"),
    readerThemeControls: document.getElementById("readerThemeControls"),
    readerDensityControls: document.getElementById("readerDensityControls"),
    readerModeControls: document.getElementById("readerModeControls"),
    readerFontDecreaseButton: document.getElementById("readerFontDecreaseButton"),
    readerFontIncreaseButton: document.getElementById("readerFontIncreaseButton"),
    readerFontValue: document.getElementById("readerFontValue"),
    readerMeta: document.getElementById("readerMeta"),
    readerChapterList: document.getElementById("readerChapterList"),
    readerPrevButton: document.getElementById("readerPrevButton"),
    readerNextButton: document.getElementById("readerNextButton"),
    readerPageStatus: document.getElementById("readerPageStatus"),
    readerPageStrip: document.getElementById("readerPageStrip"),
    readerPageTitle: document.getElementById("readerPageTitle"),
    readerPageInfo: document.getElementById("readerPageInfo"),
    readerPageActions: document.getElementById("readerPageActions"),
    readerProgressFill: document.getElementById("readerProgressFill"),
    readerProgressLabel: document.getElementById("readerProgressLabel"),
    readerEmptyState: document.getElementById("readerEmptyState"),
    readerText: document.getElementById("readerText"),
    readerPageFooter: document.getElementById("readerPageFooter"),
    readerPageSurface: document.getElementById("readerPageSurface"),
    readerSwipeHint: document.getElementById("readerSwipeHint"),
    searchInput: document.getElementById("searchInput"),
    bookSearchInput: document.getElementById("bookSearchInput"),
    clearBookSearchButton: document.getElementById("clearBookSearchButton"),
    bookSearchResults: document.getElementById("bookSearchResults"),
    askBookInput: document.getElementById("askBookInput"),
    askBookButton: document.getElementById("askBookButton"),
    clearAskBookButton: document.getElementById("clearAskBookButton"),
    qaAnswer: document.getElementById("qaAnswer"),
    sectionCategoryRail: document.getElementById("sectionCategoryRail"),
    sectionCategorySummary: document.getElementById("sectionCategorySummary"),
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
    studyPanel: document.querySelector(".study-panel"),
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
    studySwipeHint: document.getElementById("studySwipeHint"),
    studyTimer: document.getElementById("studyTimer"),
    typeTag: document.getElementById("typeTag"),
    difficultyTag: document.getElementById("difficultyTag"),
    customTag: document.getElementById("customTag"),
    questionCard: document.getElementById("questionCard"),
    questionStem: document.getElementById("questionStem"),
    optionList: document.getElementById("optionList"),
    feedbackBox: document.getElementById("feedbackBox"),
    sessionSummary: document.getElementById("sessionSummary"),
    prevButton: document.getElementById("prevButton"),
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
      return parsed || { results: {}, customQuestions: {}, examHistory: [], readerPrefs: {}, readerState: {} };
    } catch {
      return { results: {}, customQuestions: {}, examHistory: [], readerPrefs: {}, readerState: {} };
    }
  };

  const persisted = loadPersisted();
  persisted.results = persisted.results || {};
  persisted.customQuestions = persisted.customQuestions || {};
  persisted.examHistory = Array.isArray(persisted.examHistory) ? persisted.examHistory : [];
  persisted.readerPrefs = { ...READER_DEFAULTS, ...(persisted.readerPrefs || {}) };
  persisted.readerState = persisted.readerState || {};

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
    navTarget: "homeScreen",
    bookView: "read",
    sectionCategory: "all",
    readerSectionId: persisted.readerState.sectionId || "all",
    readerQuery: persisted.readerState.query || "",
    readerPageId: persisted.readerState.pageId || null,
    readerTheme: persisted.readerPrefs.theme,
    readerDensity: persisted.readerPrefs.density,
    readerFontScale: persisted.readerPrefs.fontScale,
    readerMode: persisted.readerPrefs.mode,
  };

  state.readerFontScale = clamp(Number(state.readerFontScale) || READER_DEFAULTS.fontScale, READER_FONT_MIN, READER_FONT_MAX);
  if (!["paper", "sepia", "night"].includes(state.readerTheme)) {
    state.readerTheme = READER_DEFAULTS.theme;
  }
  if (!["compact", "relaxed", "airy"].includes(state.readerDensity)) {
    state.readerDensity = READER_DEFAULTS.density;
  }
  if (!["standard", "focus"].includes(state.readerMode)) {
    state.readerMode = READER_DEFAULTS.mode;
  }

  let deferredInstallPrompt = null;

  const savePersisted = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  };

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  const persistReaderPreferences = () => {
    persisted.readerPrefs = {
      theme: state.readerTheme,
      density: state.readerDensity,
      fontScale: state.readerFontScale,
      mode: state.readerMode,
    };
    savePersisted();
  };

  const persistReaderLocation = () => {
    persisted.readerState = {
      sectionId: state.readerSectionId,
      query: state.readerQuery,
      pageId: state.readerPageId,
    };
    savePersisted();
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
      .replace(/g/g, "g")
      .replace(/i/g, "i")
      .replace(/ö/g, "o")
      .replace(/s/g, "s")
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

  const getSectionCategoryId = (section) => SECTION_CATEGORY_BY_SECTION[section?.id] || "foundation";

  const getSectionCategoryMeta = (section) => SECTION_CATEGORY_META[getSectionCategoryId(section)] || SECTION_CATEGORY_META.foundation;

  const getVisibleSectionCategoryIds = (sections) =>
    SECTION_CATEGORY_ORDER.filter((categoryId) => categoryId !== "all").filter((categoryId) =>
      sections.some((section) => getSectionCategoryId(section) === categoryId),
    );

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
          pageId: page.id || `page-${page.pdfPage}`,
          bookPage: page.bookPage,
          pdfPage: page.pdfPage,
          pageLabel: page.pageLabel,
          sectionId: primarySectionId,
          sectionIds: page.sectionIds || [],
          title: sectionTitles[0] || "Kitap Metni",
          sectionLabel: sectionTitles.join(" - ") || "Bolum eslesmesi bulunamadi",
          locationLabel: page.pageLabel ? `${page.pageLabel} - PDF ${page.pdfPage}` : `PDF ${page.pdfPage}`,
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

  const readerPages = (bookData.pages || [])
    .filter((page) => String(page.text || "").trim())
    .map((page) => {
      const primarySectionId = (page.sectionIds || []).find((sectionId) => staticSectionById.has(sectionId)) || null;
      const sectionTitles =
        (page.sectionTitles || []).filter(Boolean).length > 0
          ? page.sectionTitles.filter(Boolean)
          : primarySectionId
            ? [staticSectionById.get(primarySectionId)?.title].filter(Boolean)
            : [];
      const title = sectionTitles[0] || page.pageLabel || "Kitap Sayfasi";
      const sectionLabel = sectionTitles.join(" - ") || "Bolum eslesmesi bulunamadi";
      const locationLabel = page.pageLabel ? `${page.pageLabel} - PDF ${page.pdfPage}` : `PDF ${page.pdfPage}`;

      return {
        ...page,
        primarySectionId,
        title,
        sectionLabel,
        locationLabel,
        foldedText: foldForLookup(page.text),
        foldedMeta: foldForLookup(`${title} ${sectionLabel} ${locationLabel}`),
      };
    })
    .sort((left, right) => {
      const leftOrder = Number.isFinite(left.bookPage) ? left.bookPage : left.pdfPage;
      const rightOrder = Number.isFinite(right.bookPage) ? right.bookPage : right.pdfPage;
      return leftOrder - rightOrder;
    });

  const readerSections = (bookData.sections || baseData.sections || []).map((section) => {
    const source = staticSectionById.get(section.id) || section;
    return {
      id: section.id,
      title: source.title || section.title,
      pageRange: source.pageRange || section.pageRange || "",
    };
  });

  const getReaderSectionMeta = (sectionId) =>
    staticSectionById.get(sectionId) || (bookData.sections || []).find((section) => section.id === sectionId) || null;

  const escapeRegExp = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightText = (value, rawQuery) => {
    const plainText = escapeHtml(value);
    const terms = [...new Set([String(rawQuery || "").trim(), ...tokenizeSearchQuery(rawQuery)])]
      .map((term) => term.trim())
      .filter((term) => term.length > 1)
      .sort((left, right) => right.length - left.length);

    if (!terms.length) {
      return plainText;
    }

    let highlighted = plainText;
    for (const term of terms) {
      highlighted = highlighted.replace(new RegExp(`(${escapeRegExp(term)})`, "gi"), "<mark>$1</mark>");
    }
    return highlighted;
  };

  const buildReaderParagraphs = (value) => {
    const normalized = String(value || "")
      .replace(/\s+\*\s+/g, "\n* ")
      .replace(/\r/g, " ")
      .replace(/[ \t]+/g, " ")
      .trim();

    if (!normalized) {
      return [];
    }

    return normalized
      .split(/\n+/)
      .flatMap((segment) => {
        const trimmed = segment.trim();
        if (!trimmed) {
          return [];
        }
        if (trimmed.startsWith("*")) {
          return [trimmed];
        }
        const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [
          trimmed,
        ];
        const chunks = [];
        for (let index = 0; index < sentences.length; index += 3) {
          chunks.push(sentences.slice(index, index + 3).join(" ").trim());
        }
        return chunks;
      })
      .filter(Boolean);
  };

  const getReaderStartPageId = (sectionId = state.readerSectionId) =>
    readerPages.find((page) => sectionId === "all" || page.sectionIds?.includes(sectionId))?.id || readerPages[0]?.id || null;

  const getReaderVisiblePages = () => {
    const query = foldForLookup(state.readerQuery).trim();
    const queryTokens = tokenizeSearchQuery(state.readerQuery);
    const minimumTokenCount = queryTokens.length ? Math.max(1, Math.ceil(queryTokens.length / 2)) : 0;

    return readerPages.filter((page) => {
      if (state.readerSectionId !== "all" && !(page.sectionIds || []).includes(state.readerSectionId)) {
        return false;
      }

      if (!query && !queryTokens.length) {
        return true;
      }

      const haystack = `${page.foldedMeta} ${page.foldedText}`;
      if (query && haystack.includes(query)) {
        return true;
      }

      const tokenHits = queryTokens.filter((token) => haystack.includes(token)).length;
      return tokenHits >= minimumTokenCount;
    });
  };

  const buildReaderPageWindow = (pages, currentIndex, radius = 5) => {
    if (pages.length <= radius * 2 + 3) {
      return pages.map((page) => ({ type: "page", page }));
    }

    const indexes = new Set([0, pages.length - 1]);
    for (let index = Math.max(0, currentIndex - radius); index <= Math.min(pages.length - 1, currentIndex + radius); index += 1) {
      indexes.add(index);
    }

    const sortedIndexes = [...indexes].sort((left, right) => left - right);
    const items = [];
    sortedIndexes.forEach((pageIndex, offset) => {
      items.push({ type: "page", page: pages[pageIndex] });
      const nextIndex = sortedIndexes[offset + 1];
      if (Number.isInteger(nextIndex) && nextIndex - pageIndex > 1) {
        items.push({ type: "gap", key: `gap-${pageIndex}-${nextIndex}` });
      }
    });
    return items;
  };

  const getReaderEstimatedMinutes = (wordCount) => Math.max(1, Math.round((Number(wordCount) || 0) / 185));

  const applyReaderPreferences = () => {
    if (!elements.readerSection) {
      return;
    }

    elements.readerSection.dataset.readerTheme = state.readerTheme;
    elements.readerSection.dataset.readerDensity = state.readerDensity;
    elements.readerSection.dataset.readerMode = state.readerMode;
    elements.readerSection.style.setProperty("--reader-font-scale", `${state.readerFontScale / 100}`);

    if (elements.readerFontValue) {
      elements.readerFontValue.textContent = `${state.readerFontScale}%`;
    }

    elements.readerThemeControls?.querySelectorAll("[data-reader-theme]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.readerTheme === state.readerTheme);
    });

    elements.readerDensityControls?.querySelectorAll("[data-reader-density]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.readerDensity === state.readerDensity);
    });

    elements.readerModeControls?.querySelectorAll("[data-reader-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.readerMode === state.readerMode);
    });

    if (elements.readerFontDecreaseButton) {
      elements.readerFontDecreaseButton.disabled = state.readerFontScale <= READER_FONT_MIN;
    }
    if (elements.readerFontIncreaseButton) {
      elements.readerFontIncreaseButton.disabled = state.readerFontScale >= READER_FONT_MAX;
    }
  };

  const renderReaderChapterList = (visiblePages, currentPage) => {
    if (!elements.readerChapterList) {
      return;
    }

    const chapterItems = readerSections
      .map((section) => {
        const pages = readerPages.filter((page) => (page.sectionIds || []).includes(section.id));
        const visibleCount = visiblePages.filter((page) => (page.sectionIds || []).includes(section.id)).length;
        return {
          section,
          pages,
          visibleCount,
          isActive:
            state.readerSectionId === section.id ||
            (state.readerSectionId === "all" && (currentPage?.sectionIds || []).includes(section.id)),
        };
      })
      .filter((item) => item.pages.length);

    elements.readerChapterList.innerHTML = chapterItems
      .map((item) => {
        const firstPage = item.pages[0];
        const pageCountLabel = `${item.pages.length} sayfa`;
        const visibleLabel =
          state.readerSectionId === "all" || !state.readerQuery ? pageCountLabel : `${item.visibleCount} eslesen sayfa`;
        return `
          <button
            class="reader-chapter-card ${item.isActive ? "is-active" : ""}"
            type="button"
            data-reader-chapter="${escapeHtml(item.section.id)}"
            data-reader-chapter-page="${escapeHtml(firstPage.id)}"
          >
            <span class="reader-chapter-card__range">${escapeHtml(item.section.pageRange || firstPage.pageLabel || "")}</span>
            <strong>${escapeHtml(item.section.title)}</strong>
            <span>${escapeHtml(visibleLabel)}</span>
          </button>
        `;
      })
      .join("");

    elements.readerChapterList.querySelectorAll("[data-reader-chapter]").forEach((button) => {
      button.addEventListener("click", () => {
        openReader({
          sectionId: button.dataset.readerChapter,
          pageId: button.dataset.readerChapterPage,
          query: "",
        });
      });
    });
  };

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
    if (difficulty.includes("cok zor")) return 4;
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

  const syncQuestionStateFromSession = () => {
    const current = getCurrentQuestion();
    const savedAnswer = current ? state.sessionAnswers[current.id] || null : null;
    state.selectedIndex = Number.isInteger(savedAnswer?.selectedIndex) ? savedAnswer.selectedIndex : null;
    state.typedAnswer = savedAnswer?.textAnswer || "";
    state.checked = Boolean(savedAnswer);
  };

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
      return `${getOptionLetter(question.correctIndex)} - ${question.options[question.correctIndex]}`;
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
      return `${getOptionLetter(answer.selectedIndex)} - ${question.options[answer.selectedIndex]}`;
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
    hasPendingResponse(question) ? (finishing ? "Kaydet ve Bitir" : "Kaydet ve Gec") : (finishing ? "Bos Birak ve Bitir" : "Bos Gec");

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
    document.body.classList.toggle("study-open", visible);
  };

  const bindHorizontalSwipe = (element, { isEnabled, onPrev, onNext }) => {
    if (!element) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let active = false;

    element.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1 || (typeof isEnabled === "function" && !isEnabled())) {
          active = false;
          return;
        }
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        active = true;
      },
      { passive: true },
    );

    element.addEventListener(
      "touchend",
      (event) => {
        if (!active || event.changedTouches.length !== 1) {
          active = false;
          return;
        }

        const deltaX = event.changedTouches[0].clientX - startX;
        const deltaY = event.changedTouches[0].clientY - startY;
        active = false;

        if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
          return;
        }

        if (deltaX > 0) {
          onPrev?.();
        } else {
          onNext?.();
        }
      },
      { passive: true },
    );
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
        description: section?.description || "Konu bazli ana test oturumu.",
        range: section?.pageRange || "Konu bolumu",
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
        title: `${section?.title || "Konu"} - Ogretici Calisma`,
        description: "Bosluk doldurma ve dogru/yanlis sorularini ayri Ogretici kategori olarak Cozuyorsun.",
        range: section?.pageRange || "Konu bolumu",
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
        title: "Yanlislarim",
        description: "Ana test kategorisinde daha once yanlis yaptigin sorulari yeniden Cozuyorsun.",
        range: "Yanlis havuzu",
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
        title: `${section?.title || "Konu"} - Yanlislar`,
        description: "Bu konudaki ana test yanlislarini pes pese Cozuyorsun.",
        range: section?.pageRange || "Konu bolumu",
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
      description: `${preset.description} Sure: ${preset.durationMinutes} dakika.`,
      range: "Karisik konu dagilimi",
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
      title: "Akilli Tekrar",
      description: "Son yanlislarin ve zayif konularindan secilen karisik tekrar oturumu.",
      range: "Yanlis odakli tekrar",
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
    elements.summaryStartButton.textContent = returnToCurrentStudy ? "Teste Don" : "Bu Konuyu Coz";
    if (!elements.summaryModal.open) {
      elements.summaryModal.showModal();
    }
  };

  const createScreenHeaderMarkup = (eyebrow, title, description) => `
    <header class="screen-head">
      <p class="eyebrow">${eyebrow}</p>
      <h2>${title}</h2>
      <p>${description}</p>
    </header>
  `;

  const setBookView = (viewId = "read") => {
    const nextView = ["read", "search", "ask"].includes(viewId) ? viewId : "read";
    state.bookView = nextView;

    document.querySelectorAll("[data-book-view]").forEach((button) => {
      const isActive = button.dataset.bookView === nextView;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    document.querySelectorAll("[data-book-panel]").forEach((panel) => {
      const isActive = panel.dataset.bookPanel === nextView;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  const initializeAppScreens = () => {
    if (!elements.appShell || document.getElementById("homeScreen")) {
      return;
    }

    const hero = elements.appShell.querySelector(".hero");
    const toolbar = elements.appShell.querySelector(".toolbar");
    const sectionBrowser = elements.appShell.querySelector(".section-browser");
    const featureGrid = elements.appShell.querySelector(".feature-grid");
    const knowledgeTools = elements.appShell.querySelector(".knowledge-tools");
    const knowledgeCards = Array.from(knowledgeTools?.querySelectorAll(".knowledge-card") || []);
    const [bookSearchCard, bookAskCard] = knowledgeCards;
    const examSection = document.getElementById("examSection");
    const reviewSection = document.getElementById("reviewSection");

    const homeScreen = document.createElement("section");
    homeScreen.className = "app-screen is-active";
    homeScreen.id = "homeScreen";
    if (hero) {
      homeScreen.appendChild(hero);
    }
    homeScreen.insertAdjacentHTML(
      "beforeend",
      `
        <section class="feature-grid home-grid">
          <article class="feature-card home-shortcuts">
            <div>
              <p class="eyebrow">Hizli Gecis</p>
              <h2>Uygulama Ekranlari</h2>
              <p>Alt sekmelerdeki alanlar burada da kisayol olarak sunulur. Mobilde tek dokunusla istedigin ekrana gecersin.</p>
            </div>
            <div class="shortcut-grid">
              <button class="shortcut-card" data-open-screen="sectionsScreen" type="button">
                <span class="shortcut-card__label">Bolumler</span>
                <strong>Konu katmanlarini ac</strong>
              </button>
              <button class="shortcut-card" data-open-screen="bookScreen" type="button">
                <span class="shortcut-card__label">Kitap</span>
                <strong>Okuyucu ekranina gec</strong>
              </button>
              <button class="shortcut-card" data-open-screen="examScreen" type="button">
                <span class="shortcut-card__label">Deneme</span>
                <strong>Sureli deneme baslat</strong>
              </button>
              <button class="shortcut-card" data-open-screen="reviewScreen" type="button">
                <span class="shortcut-card__label">Tekrar</span>
                <strong>Yanlis odakli calis</strong>
              </button>
            </div>
          </article>
        </section>
      `,
    );

    const sectionsScreen = document.createElement("section");
    sectionsScreen.className = "app-screen";
    sectionsScreen.id = "sectionsScreen";
    sectionsScreen.insertAdjacentHTML(
      "beforeend",
      createScreenHeaderMarkup(
        "Bolumler",
        "Konu Katmanlari",
        "Bolumler ayri bir mobil ekranda sunulur. Kategoriler arasinda gezip kartlari yatay serit halinde acabilirsin.",
      ),
    );
    if (toolbar) {
      sectionsScreen.appendChild(toolbar);
    }
    if (sectionBrowser) {
      sectionsScreen.appendChild(sectionBrowser);
    }

    const bookScreen = document.createElement("section");
    bookScreen.className = "app-screen";
    bookScreen.id = "bookScreen";
    bookScreen.insertAdjacentHTML(
      "beforeend",
      `${createScreenHeaderMarkup(
        "Kitap",
        "Mustakil Okuma Alani",
        "Kitap alani sade tutuldu. Okuma, arama ve soru sorma ayri gorunumlerde acilir.",
      )}
      <section class="book-workspace">
        <div class="book-view-switch" role="tablist" aria-label="Kitap araclari">
          <button class="book-view-button is-active" type="button" role="tab" aria-selected="true" data-book-view="read">Oku</button>
          <button class="book-view-button" type="button" role="tab" aria-selected="false" data-book-view="search">Ara</button>
          <button class="book-view-button" type="button" role="tab" aria-selected="false" data-book-view="ask">Sor</button>
        </div>
        <section class="book-panel is-active" data-book-panel="read"></section>
        <section class="book-panel" data-book-panel="search" hidden></section>
        <section class="book-panel" data-book-panel="ask" hidden></section>
      </section>`,
    );
    const bookReadPanel = bookScreen.querySelector('[data-book-panel="read"]');
    const bookSearchPanel = bookScreen.querySelector('[data-book-panel="search"]');
    const bookAskPanel = bookScreen.querySelector('[data-book-panel="ask"]');
    if (elements.readerSection && bookReadPanel) {
      elements.readerSection.classList.add("book-panel-card");
      bookReadPanel.appendChild(elements.readerSection);
    }
    if (bookSearchCard && bookSearchPanel) {
      bookSearchCard.classList.add("book-panel-card");
      bookSearchPanel.appendChild(bookSearchCard);
    }
    if (bookAskCard && bookAskPanel) {
      bookAskCard.classList.add("book-panel-card");
      bookAskPanel.appendChild(bookAskCard);
    }

    const examScreen = document.createElement("section");
    examScreen.className = "app-screen";
    examScreen.id = "examScreen";
    examScreen.insertAdjacentHTML(
      "beforeend",
      createScreenHeaderMarkup(
        "Deneme",
        "Sureli Deneme Ekrani",
        "Deneme bolumu ayri bir ekran olarak acilir. Sureli oturumlari burada baslatirsin.",
      ),
    );
    if (examSection) {
      examScreen.appendChild(examSection);
    }

    const reviewScreen = document.createElement("section");
    reviewScreen.className = "app-screen";
    reviewScreen.id = "reviewScreen";
    reviewScreen.insertAdjacentHTML(
      "beforeend",
      createScreenHeaderMarkup(
        "Tekrar",
        "Yanlis Odakli Tekrar",
        "Tekrar bolumu ayri ekrandadir. Yanlislar ve zayif alanlar icin dogrudan buraya gecersin.",
      ),
    );
    if (reviewSection) {
      reviewScreen.appendChild(reviewSection);
    }

    featureGrid?.remove();
    elements.appShell.replaceChildren(homeScreen, sectionsScreen, bookScreen, examScreen, reviewScreen);

    elements.appShell.querySelectorAll("[data-open-screen]").forEach((button) => {
      button.addEventListener("click", () => {
        setActiveNav(button.dataset.openScreen);
      });
    });

    bookScreen.querySelectorAll("[data-book-view]").forEach((button) => {
      button.addEventListener("click", () => {
        setBookView(button.dataset.bookView);
      });
    });
  };

  const setActiveNav = (targetId) => {
    const nextTarget = document.getElementById(targetId) ? targetId : "homeScreen";
    state.navTarget = nextTarget;
    document.querySelectorAll(".app-screen").forEach((screen) => {
      screen.classList.toggle("is-active", screen.id === nextTarget);
      if (screen.id === nextTarget) {
        screen.scrollTop = 0;
      }
    });
    elements.bottomNav.querySelectorAll("[data-nav-target]").forEach((button) => {
      const isActive = button.dataset.navTarget === nextTarget;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
    if (window.location.hash !== `#${nextTarget}`) {
      window.history.replaceState(null, "", `#${nextTarget}`);
    }
    window.scrollTo(0, 0);
  };

  const renderHeroStats = () => {
    const sections = getSections();
    const allQuestions = sections.flatMap((section) => section.questions);
    const resultValues = Object.values(persisted.results);
    const cards = [
      { label: "Toplam Soru", value: allQuestions.length },
      { label: "Cozulen", value: resultValues.length },
      { label: "Bekleyen Yanlis", value: resultValues.filter((item) => item.correct === false).length },
      { label: "Ozel Soru", value: allQuestions.filter((item) => item.isCustom).length },
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
      { label: "Son Skor", value: lastExam ? `%${lastExam.score}` : "Hazir" },
      { label: "Deneme", value: persisted.examHistory.length || 0 },
      { label: "Ortalama", value: persisted.examHistory.length ? `%${averageScore}` : "-" },
    ];

    const reviewCards = [
      { label: "Tekrar Havuzu", value: `${reviewDeck.length} soru` },
      { label: "Yanlis", value: waitingWrongCount },
      { label: "Zayif Konu", value: weakSection ? weakSection.title : "Dengeli" },
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

    container.querySelectorAll("[data-open-knowledge-page]").forEach((button) => {
      button.addEventListener("click", () =>
        openReader({
          pageId: button.dataset.openKnowledgePage,
          sectionId: button.dataset.openKnowledgeReaderSection || undefined,
          query: button.dataset.openKnowledgeQuery || "",
        }),
      );
    });

    container.querySelectorAll("[data-open-knowledge-section]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.openKnowledgeSection, "section"));
    });

    container.querySelectorAll("[data-open-knowledge-summary]").forEach((button) => {
      button.addEventListener("click", () => openSummaryModal(button.dataset.openKnowledgeSummary));
    });
  };

  const renderKnowledgeCard = (item, rawQuery = "") => {
    const primarySectionId = item.record.sectionId || item.record.sectionIds?.[0] || null;
    const sectionMeta = primarySectionId ? staticSectionById.get(primarySectionId) : null;
    const typeLabel = item.record.recordType === "summary" ? "Ozetten" : "Metinden";
    const readerTargetPageId =
      item.record.recordType === "page" ? item.record.pageId || item.record.id : primarySectionId ? getReaderStartPageId(primarySectionId) : "";
    const openReaderButton = readerTargetPageId
      ? `<button
          class="ghost-button"
          type="button"
          data-open-knowledge-page="${escapeHtml(readerTargetPageId)}"
          data-open-knowledge-reader-section="${escapeHtml(primarySectionId || "all")}"
          data-open-knowledge-query="${escapeHtml(rawQuery)}"
        >Metni Oku</button>`
      : "";
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
          ${openReaderButton}
          ${openSectionButton}
          ${openSummaryButton}
        </div>
      </article>
    `;
  };

  const renderReaderMetaLegacy = (visiblePages) => {
    const currentSectionLabel =
      state.readerSectionId === "all" ? "Tum kitap" : getReaderSectionMeta(state.readerSectionId)?.title || "Secili bolum";
    const cards = [
      { label: "Okuma Alani", value: currentSectionLabel },
      { label: "Eslesen Sayfa", value: visiblePages.length },
      { label: "Toplam Sayfa", value: readerPages.length },
    ];

    elements.readerMeta.innerHTML = cards
      .map(
        (item) => `
          <article class="feature-metric">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(String(item.value))}</strong>
          </article>
        `,
      )
      .join("");
  };

  const renderBookReaderLegacy = () => {
    if (!elements.readerSection) {
      return;
    }

    if (!readerPages.length) {
      elements.readerSection.classList.add("hidden");
      return;
    }

    elements.readerSection.classList.remove("hidden");

    const sectionOptions = [
      { id: "all", title: "Tum kitap", pageRange: `${readerPages.length} sayfa` },
      ...readerSections,
    ];

    elements.readerSectionSelect.innerHTML = sectionOptions
      .map(
        (section) =>
          `<option value="${escapeHtml(section.id)}">${escapeHtml(section.title)}${section.pageRange ? ` - ${escapeHtml(section.pageRange)}` : ""}</option>`,
      )
      .join("");

    elements.readerSectionSelect.value = state.readerSectionId;
    elements.readerFilterInput.value = state.readerQuery;

    const visiblePages = getReaderVisiblePages();
    renderReaderMeta(visiblePages);

    if (!visiblePages.length) {
      elements.readerPrevButton.disabled = true;
      elements.readerNextButton.disabled = true;
      elements.readerPageStatus.textContent = "Bu filtre icin okunabilir sayfa bulunamadi.";
      elements.readerPageStrip.innerHTML = "";
      elements.readerPageTitle.textContent = "Okunacak sayfa bulunamadi";
      elements.readerPageInfo.textContent = "Filtreyi temizleyerek veya baska bir bolum secerek devam edebilirsin.";
      elements.readerPageActions.innerHTML = "";
      elements.readerText.innerHTML = "";
      elements.readerEmptyState.classList.remove("hidden");
      elements.readerEmptyState.innerHTML =
        '<div class="empty-state">Bu filtre veya bolum secimi icin kitap metninde gosterilecek sayfa bulunamadi.</div>';
      return;
    }

    const currentPage = visiblePages.find((page) => page.id === state.readerPageId) || visiblePages[0];
    state.readerPageId = currentPage.id;
    const currentIndex = visiblePages.findIndex((page) => page.id === currentPage.id);
    const currentSection = currentPage.primarySectionId ? getReaderSectionMeta(currentPage.primarySectionId) : null;

    elements.readerPrevButton.disabled = currentIndex <= 0;
    elements.readerNextButton.disabled = currentIndex >= visiblePages.length - 1;
    elements.readerPageStatus.textContent = `Sayfa ${currentIndex + 1} / ${visiblePages.length} - ${currentPage.locationLabel}`;
    elements.readerPageTitle.textContent = currentPage.title || currentPage.pageLabel || "Kitap sayfasi";
    elements.readerPageInfo.textContent = `${currentPage.sectionLabel} - ${currentPage.wordCount || 0} kelime`;

    const pageWindow = buildReaderPageWindow(visiblePages, currentIndex);
    elements.readerPageStrip.innerHTML = pageWindow
      .map((item) => {
        if (item.type === "gap") {
          return '<span class="reader-page-gap">...</span>';
        }
        const page = item.page;
        const label = page.bookPage ? `s. ${page.bookPage}` : `PDF ${page.pdfPage}`;
        return `
          <button
            class="reader-page-chip ${page.id === currentPage.id ? "is-active" : ""}"
            type="button"
            data-reader-page="${escapeHtml(page.id)}"
          >
            ${escapeHtml(label)}
          </button>
        `;
      })
      .join("");

    const actionButtons = [];
    if (currentSection?.id) {
      actionButtons.push(
        `<button class="ghost-button" type="button" data-reader-open-summary="${escapeHtml(currentSection.id)}">Bolum Ozeti</button>`,
      );
      actionButtons.push(
        `<button class="ghost-button" type="button" data-reader-open-test="${escapeHtml(currentSection.id)}">Bu Konunun Testi</button>`,
      );
    }
    elements.readerPageActions.innerHTML = actionButtons.join("");

    const paragraphMarkup = buildReaderParagraphs(currentPage.text)
      .map((paragraph) => {
        const paragraphClass = paragraph.startsWith("*") ? "reader-text__bullet" : "";
        return `<p class="${paragraphClass}">${highlightText(paragraph, state.readerQuery)}</p>`;
      })
      .join("");

    elements.readerEmptyState.classList.add("hidden");
    elements.readerEmptyState.innerHTML = "";
    elements.readerText.innerHTML = paragraphMarkup || `<p>${highlightText(currentPage.text, state.readerQuery)}</p>`;
    elements.readerText.scrollTop = 0;

    elements.readerPageStrip.querySelectorAll("[data-reader-page]").forEach((button) => {
      button.addEventListener("click", () => {
        state.readerPageId = button.dataset.readerPage;
        renderBookReader();
      });
    });

    elements.readerPageActions.querySelectorAll("[data-reader-open-summary]").forEach((button) => {
      button.addEventListener("click", () => openSummaryModal(button.dataset.readerOpenSummary));
    });

    elements.readerPageActions.querySelectorAll("[data-reader-open-test]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.readerOpenTest, "section"));
    });
  };

  const openReaderLegacy = ({ sectionId, pageId, query, scroll = true } = {}) => {
    if (typeof sectionId === "string" && sectionId) {
      state.readerSectionId = sectionId;
    }

    if (typeof query === "string") {
      state.readerQuery = query;
    }

    if (typeof pageId === "string" && pageId) {
      state.readerPageId = pageId;
    } else if (!state.readerPageId || (sectionId && sectionId !== "all")) {
      state.readerPageId = getReaderStartPageId(state.readerSectionId);
    }

    renderBookReader();
    setActiveNav("bookScreen");
  };

  const renderReaderMeta = (visiblePages, currentPage, currentIndex) => {
    const currentSectionLabel =
      state.readerSectionId === "all" ? "Tum kitap" : getReaderSectionMeta(state.readerSectionId)?.title || "Secili bolum";
    const progressValue = visiblePages.length ? Math.round(((currentIndex + 1) / visiblePages.length) * 100) : 0;
    const cards = [
      { label: "Alan", value: currentSectionLabel },
      { label: "Sayfa", value: currentPage?.pageLabel || "-" },
      { label: "Ilerleme", value: `%${progressValue}` },
    ];

    elements.readerMeta.innerHTML = cards
      .map(
        (item) => `
          <article class="reader-meta-pill">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(String(item.value))}</strong>
          </article>
        `,
      )
      .join("");
  };

  const renderBookReader = () => {
    if (!elements.readerSection) {
      return;
    }

    if (!readerPages.length) {
      elements.readerSection.classList.add("hidden");
      return;
    }

    elements.readerSection.classList.remove("hidden");
    if (elements.openReaderButton) {
      elements.openReaderButton.textContent = state.readerPageId ? "Devam Et" : "Okumaya Basla";
    }
    applyReaderPreferences();

    const sectionOptions = [
      { id: "all", title: "Tum kitap", pageRange: `${readerPages.length} sayfa` },
      ...readerSections,
    ];

    elements.readerSectionSelect.innerHTML = sectionOptions
      .map(
        (section) =>
          `<option value="${escapeHtml(section.id)}">${escapeHtml(section.title)}${section.pageRange ? ` - ${escapeHtml(section.pageRange)}` : ""}</option>`,
      )
      .join("");

    elements.readerSectionSelect.value = sectionOptions.some((section) => section.id === state.readerSectionId)
      ? state.readerSectionId
      : "all";
    elements.readerFilterInput.value = state.readerQuery;

    const visiblePages = getReaderVisiblePages();

    if (!visiblePages.length) {
      renderReaderMeta([], null, 0);
      elements.readerChapterList.innerHTML = "";
      elements.readerPrevButton.disabled = true;
      elements.readerNextButton.disabled = true;
      elements.readerPageStatus.textContent = "Bu filtre icin okunabilir sayfa bulunamadi.";
      elements.readerPageStrip.innerHTML = "";
      elements.readerPageTitle.textContent = "Okunacak sayfa bulunamadi";
      elements.readerPageInfo.textContent = "Filtreyi temizleyerek veya baska bir bolum secerek devam edebilirsin.";
      elements.readerPageActions.innerHTML = "";
      elements.readerProgressFill.style.width = "0%";
      elements.readerProgressLabel.textContent = "Ilerleme gosterilemiyor";
      elements.readerSwipeHint.classList.add("hidden");
      elements.readerText.innerHTML = "";
      elements.readerPageFooter.innerHTML = "";
      elements.readerEmptyState.classList.remove("hidden");
      elements.readerEmptyState.innerHTML =
        '<div class="empty-state">Bu filtre veya bolum secimi icin kitap metninde gosterilecek sayfa bulunamadi.</div>';
      persistReaderLocation();
      return;
    }

    const currentPage = visiblePages.find((page) => page.id === state.readerPageId) || visiblePages[0];
    state.readerPageId = currentPage.id;
    const currentIndex = visiblePages.findIndex((page) => page.id === currentPage.id);
    const currentSection = currentPage.primarySectionId ? getReaderSectionMeta(currentPage.primarySectionId) : null;
    const progressPercent = visiblePages.length ? Math.round(((currentIndex + 1) / visiblePages.length) * 100) : 0;
    const estimatedMinutes = getReaderEstimatedMinutes(currentPage.wordCount);

    renderReaderMeta(visiblePages, currentPage, currentIndex);
    renderReaderChapterList(visiblePages, currentPage);
    elements.readerSwipeHint.classList.remove("hidden");

    elements.readerPrevButton.disabled = currentIndex <= 0;
    elements.readerNextButton.disabled = currentIndex >= visiblePages.length - 1;
    elements.readerPageStatus.textContent = `Sayfa ${currentIndex + 1} / ${visiblePages.length} - ${currentPage.locationLabel}`;
    elements.readerPageTitle.textContent = currentPage.title || currentPage.pageLabel || "Kitap sayfasi";
    elements.readerPageInfo.textContent = `${currentPage.sectionLabel} - ${currentPage.wordCount || 0} kelime - yaklasik ${estimatedMinutes} dk`;
    elements.readerProgressFill.style.width = `${progressPercent}%`;
    elements.readerProgressLabel.textContent = `Gorunur havuzda %${progressPercent} ilerleme - ${currentIndex + 1}/${visiblePages.length}`;

    const pageWindow = buildReaderPageWindow(visiblePages, currentIndex);
    elements.readerPageStrip.innerHTML = pageWindow
      .map((item) => {
        if (item.type === "gap") {
          return '<span class="reader-page-gap">...</span>';
        }
        const page = item.page;
        const label = page.bookPage ? `s. ${page.bookPage}` : `PDF ${page.pdfPage}`;
        return `
          <button
            class="reader-page-chip ${page.id === currentPage.id ? "is-active" : ""}"
            type="button"
            data-reader-page="${escapeHtml(page.id)}"
          >
            ${escapeHtml(label)}
          </button>
        `;
      })
      .join("");

    const actionButtons = [];
    if (currentSection?.id) {
      actionButtons.push(
        `<button class="ghost-button" type="button" data-reader-open-summary="${escapeHtml(currentSection.id)}">Bolum Ozeti</button>`,
      );
      actionButtons.push(
        `<button class="ghost-button" type="button" data-reader-open-test="${escapeHtml(currentSection.id)}">Bu Konunun Testi</button>`,
      );
    }
    elements.readerPageActions.innerHTML = actionButtons.join("");

    const paragraphMarkup = buildReaderParagraphs(currentPage.text)
      .map((paragraph, index) => {
        const classes = ["reader-text__paragraph"];
        if (paragraph.startsWith("*")) {
          classes.push("reader-text__bullet");
        } else if (index === 0) {
          classes.push("reader-text__lead");
        }
        return `<p class="${classes.join(" ")}">${highlightText(paragraph, state.readerQuery)}</p>`;
      })
      .join("");

    elements.readerEmptyState.classList.add("hidden");
    elements.readerEmptyState.innerHTML = "";
    elements.readerText.innerHTML = paragraphMarkup || `<p>${highlightText(currentPage.text, state.readerQuery)}</p>`;
    elements.readerPageFooter.innerHTML = `
      <span>${escapeHtml(currentPage.sectionLabel || "Kitap metni")}</span>
      <strong>${escapeHtml(currentPage.pageLabel || currentPage.locationLabel || "Sayfa")}</strong>
      <span>${escapeHtml(currentPage.locationLabel || "")}</span>
    `;
    persistReaderLocation();

    elements.readerPageStrip.querySelectorAll("[data-reader-page]").forEach((button) => {
      button.addEventListener("click", () => {
        state.readerPageId = button.dataset.readerPage;
        renderBookReader();
      });
    });

    elements.readerPageActions.querySelectorAll("[data-reader-open-summary]").forEach((button) => {
      button.addEventListener("click", () => openSummaryModal(button.dataset.readerOpenSummary));
    });

    elements.readerPageActions.querySelectorAll("[data-reader-open-test]").forEach((button) => {
      button.addEventListener("click", () => openStudy(button.dataset.readerOpenTest, "section"));
    });
  };

  const openReader = ({ sectionId, pageId, query, scroll = true } = {}) => {
    if (typeof sectionId === "string" && sectionId) {
      state.readerSectionId = sectionId;
    }

    if (typeof query === "string") {
      state.readerQuery = query;
    }

    if (typeof pageId === "string" && pageId) {
      state.readerPageId = pageId;
    } else if (!state.readerPageId || (sectionId && sectionId !== "all")) {
      state.readerPageId = getReaderStartPageId(state.readerSectionId);
    }

    renderBookReader();
    setBookView("read");
    setActiveNav("bookScreen");
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

    elements.bookSearchResults.innerHTML = matches.map((item) => renderKnowledgeCard(item, query)).join("");
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
        ${answer.matches.map((item) => renderKnowledgeCard(item, query)).join("")}
      </div>
    `;

    bindKnowledgeActions(elements.qaAnswer);
  };

  const renderSectionCardMarkup = (section) => {
    const metrics = getSectionMetrics(section);
    const hasLearningDeck = metrics.learningTotal > 0;
    const categoryMeta = getSectionCategoryMeta(section);
    const summaryMarkup = getSummaryParts(section.summary).length
      ? `
        <details class="section-summary">
          <summary>Bolum Ozeti</summary>
          <div class="section-summary__body">${renderSummaryMarkup(section.summary)}</div>
        </details>
      `
      : "";

    return `
      <article class="section-card section-card--lane">
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
          <span class="metric">${categoryMeta.shortTitle}</span>
          <span class="metric">${metrics.total} ana test</span>
          <span class="metric muted">${metrics.learningTotal} ogretici</span>
          <span class="metric">${metrics.correct} dogru</span>
          <span class="metric muted">${metrics.wrong} yanlis</span>
        </div>
        <div class="card-bottom">
          <button class="primary-button" data-open-section="${section.id}">Teste Basla</button>
          ${hasLearningDeck ? `<button class="ghost-button" data-open-learning="${section.id}">Ogretici</button>` : ""}
          <button class="ghost-button" data-open-summary="${section.id}">Ozeti Ac</button>
          <button class="ghost-button" data-open-wrong="${section.id}">Yanlislar</button>
        </div>
      </article>
    `;
  };

  const renderSectionCategoryRail = (filteredSections) => {
    if (!elements.sectionCategoryRail || !elements.sectionCategorySummary) {
      return;
    }

    const visibleCategoryIds = getVisibleSectionCategoryIds(filteredSections);
    const chips = ["all", ...visibleCategoryIds]
      .map((categoryId) => {
        const meta = SECTION_CATEGORY_META[categoryId];
        const count =
          categoryId === "all"
            ? filteredSections.length
            : filteredSections.filter((section) => getSectionCategoryId(section) === categoryId).length;
        return `
          <button
            class="section-category-chip ${state.sectionCategory === categoryId ? "is-active" : ""}"
            type="button"
            data-section-category="${meta.id}"
          >
            <span>${meta.shortTitle}</span>
            <strong>${count}</strong>
          </button>
        `;
      })
      .join("");

    elements.sectionCategoryRail.innerHTML = chips;

    const activeMeta = SECTION_CATEGORY_META[state.sectionCategory] || SECTION_CATEGORY_META.all;
    const activeCount =
      state.sectionCategory === "all"
        ? filteredSections.length
        : filteredSections.filter((section) => getSectionCategoryId(section) === state.sectionCategory).length;
    elements.sectionCategorySummary.textContent = `${activeMeta.title}: ${activeCount} konu. ${activeMeta.description}`;

    elements.sectionCategoryRail.querySelectorAll("[data-section-category]").forEach((button) => {
      button.addEventListener("click", () => {
        state.sectionCategory = button.dataset.sectionCategory || "all";
        renderSections();
      });
    });
  };

  const renderSectionsLegacy = () => {
    const sections = getSections();
    const filtered = sections.filter((section) => {
      const haystack = `${section.title} ${section.description} ${section.pageRange} ${getSummaryText(section.summary)}`.toLowerCase();
      return haystack.includes(state.query.toLowerCase());
    });

    if (!filtered.length) {
      elements.sectionGrid.innerHTML = '<div class="empty-state">Aramanla eslesen konu bulunamadi.</div>';
      return;
    }

    elements.sectionGrid.innerHTML = filtered
      .map((section) => {
        const metrics = getSectionMetrics(section);
        const hasLearningDeck = metrics.learningTotal > 0;
        const summaryMarkup = getSummaryParts(section.summary).length
          ? `
            <details class="section-summary">
              <summary>Bolum Ozeti</summary>
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
              <span class="metric muted">${metrics.learningTotal} Ogretici</span>
              <span class="metric">${metrics.correct} dogru</span>
              <span class="metric muted">${metrics.wrong} yanlis</span>
              <span class="metric muted">${metrics.custom} Ozel</span>
            </div>
            <div class="card-bottom">
              <button class="primary-button" data-open-section="${section.id}">Teste Basla</button>
              ${hasLearningDeck ? `<button class="ghost-button" data-open-learning="${section.id}">Ogretici</button>` : ""}
              <button class="ghost-button" data-open-summary="${section.id}">Ozeti Ac</button>
              <button class="ghost-button" data-open-wrong="${section.id}">Yanlislar</button>
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

  const renderSections = () => {
    const sections = getSections();
    const filtered = sections.filter((section) => {
      const haystack = `${section.title} ${section.description} ${section.pageRange} ${getSummaryText(section.summary)}`.toLowerCase();
      return haystack.includes(state.query.toLowerCase());
    });

    renderSectionCategoryRail(filtered);

    if (!filtered.length) {
      elements.sectionGrid.innerHTML = '<div class="empty-state">Aramanla eslesen konu bulunamadi.</div>';
      return;
    }

    const categoryIds =
      state.sectionCategory === "all"
        ? getVisibleSectionCategoryIds(filtered)
        : [state.sectionCategory].filter((categoryId) =>
            filtered.some((section) => getSectionCategoryId(section) === categoryId),
          );

    if (!categoryIds.length) {
      elements.sectionGrid.innerHTML = '<div class="empty-state">Bu kategori icinde gosterilecek konu kalmadi.</div>';
      return;
    }

    elements.sectionGrid.innerHTML = categoryIds
      .map((categoryId) => {
        const meta = SECTION_CATEGORY_META[categoryId];
        const categorySections = filtered.filter((section) => getSectionCategoryId(section) === categoryId);
        return `
          <section class="section-layer">
            <div class="section-layer__head">
              <div>
                <p class="eyebrow">${meta.shortTitle}</p>
                <h3>${meta.title}</h3>
                <p>${meta.description}</p>
              </div>
              <span class="metric">${categorySections.length} konu</span>
            </div>
            <div class="section-lane">
              ${categorySections.map((section) => renderSectionCardMarkup(section)).join("")}
            </div>
          </section>
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
        ? "Sure doldu. Oturum mevcut cevaplarinla kapatildi."
        : state.completionReason === "manual"
          ? "Oturumu sen bitirdin. Mevcut cevaplar uzerinden Ozet olusturuldu."
          : isExam
            ? "Deneme tamamlandi. Simdi sonuclarini toplu olarak degerlendir."
            : "Test tamamlandi. Sonuclarin toplu olarak asagida listelendi.";

    const breakdownText = breakdown.length
      ? `En cok zorlandigin konu: ${breakdown[0].sectionTitle}. Diger one cikan alanlar: ${breakdown
          .slice(1)
          .map((item) => item.sectionTitle)
          .join(", ") || "yok"}.`
      : "Bu oturumda yanlis veya bos soru olusmadi.";

    const reviewMarkup = reviewItems.length
      ? `
        <div class="review-list">
          <p class="eyebrow">Toplu Degerlendirme</p>
          ${reviewItems
            .map((item) => {
              const userChoice = escapeHtml(getQuestionUserAnswerText(item.question, item.answer));
              const correctChoice = escapeHtml(getQuestionCorrectAnswerText(item.question));
              const stateLabel = item.answer ? "Yanlis" : "Bos";
              const stateClass = item.answer ? "wrong" : "blank";
              return `
                <article class="review-card">
                  <div class="review-card__top">
                    <span class="tag ${stateClass}">${stateLabel}</span>
                    <span class="metric muted">Soru ${item.order} - ${item.question.sectionTitle}</span>
                  </div>
                  <p class="review-card__stem">${escapeHtml(item.question.stem)}</p>
                  <p class="review-card__meta"><strong>Senin cevabin:</strong> ${userChoice}</p>
                  <p class="review-card__meta"><strong>Dogru cevap:</strong> ${correctChoice}</p>
                  <p class="review-card__explanation">${escapeHtml(item.question.explanation)}</p>
                </article>
              `;
            })
            .join("")}
        </div>
      `
      : `
        <div class="review-list">
          <p class="eyebrow">Toplu Degerlendirme</p>
          <div class="summary-note">Bu oturumda yanlis veya bos soru kalmadi.</div>
        </div>
      `;

    elements.sessionSummary.innerHTML = `
      <div>
        <p class="eyebrow">${isExam ? "Deneme Ozeti" : "Oturum Ozeti"}</p>
        <h3>${state.sessionConfig?.title || "Oturum"}</h3>
        <p>${reasonText}</p>
      </div>
      <div class="summary-grid">
        <article class="summary-card">
          <span>Dogru</span>
          <strong>${metrics.correct}</strong>
        </article>
        <article class="summary-card">
          <span>Yanlis</span>
          <strong>${metrics.wrong}</strong>
        </article>
        <article class="summary-card">
          <span>Bos</span>
          <strong>${metrics.skipped}</strong>
        </article>
        <article class="summary-card">
          <span>Basari</span>
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
    elements.studyTitle.textContent = config?.title || "Calisma";
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
    elements.studySwipeHint.classList.toggle("hidden", state.sessionComplete || !state.deck.length);

    if (config?.timerSeconds > 0 && !state.sessionComplete) {
      updateTimer();
    }

    if (state.sessionComplete) {
      elements.questionCard.classList.add("hidden");
      elements.sessionSummary.classList.remove("hidden");
      elements.feedbackBox.className = "feedback hidden";
      elements.progressLabel.textContent = "Oturum tamamlandi";
      elements.progressSummary.textContent = `${metrics.correct} dogru - ${metrics.wrong} yanlis - ${metrics.skipped} bos`;
      elements.prevButton.disabled = true;
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
      elements.progressSummary.textContent = "Hazir";
      elements.questionStem.innerHTML = '<div class="empty-state">Bu oturum icin gosterilecek soru yok.</div>';
      elements.optionList.innerHTML = "";
      elements.feedbackBox.className = "feedback hidden";
      elements.typeTag.textContent = "";
      elements.difficultyTag.textContent = "";
      elements.customTag.textContent = "";
      elements.prevButton.disabled = true;
      elements.checkButton.disabled = true;
      elements.nextButton.disabled = false;
      elements.nextButton.textContent = "Kapat";
      return;
    }

    elements.progressLabel.textContent = `Soru ${state.index + 1} / ${state.deck.length}`;
    elements.progressSummary.textContent = `${metrics.answered} cevap kaydedildi - sonuc test sonunda gosterilecek`;
    elements.typeTag.textContent = getQuestionTypeLabel(current);
    elements.difficultyTag.textContent = current.difficulty;
    elements.customTag.textContent = current.isCustom ? "Ozel Soru" : current.sectionTitle;
    elements.questionStem.textContent = current.stem;
    elements.prevButton.disabled = state.index <= 0;
    elements.questionCard.scrollTop = 0;

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
      elements.checkButton.textContent = "Cevabi Kaydet";
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

  const goPrevious = () => {
    if (state.sessionComplete || !state.deck.length || state.index <= 0) {
      return;
    }

    const current = getCurrentQuestion();
    if (!state.checked && hasPendingResponse(current)) {
      saveCurrentAnswer();
    }

    state.index -= 1;
    syncQuestionStateFromSession();
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

    syncQuestionStateFromSession();
    renderStudy();
  };

  const shuffleCurrentDeck = () => {
    if (!state.sessionConfig?.allowShuffle || !state.deck.length || state.sessionComplete) {
      return;
    }
    state.deck = shuffle(state.deck);
    state.index = 0;
    syncQuestionStateFromSession();
    renderStudy();
  };

  const goReaderPrevious = () => {
    const visiblePages = getReaderVisiblePages();
    const currentIndex = visiblePages.findIndex((page) => page.id === state.readerPageId);
    if (currentIndex > 0) {
      state.readerPageId = visiblePages[currentIndex - 1].id;
      renderBookReader();
    }
  };

  const goReaderNext = () => {
    const visiblePages = getReaderVisiblePages();
    const currentIndex = visiblePages.findIndex((page) => page.id === state.readerPageId);
    if (currentIndex >= 0 && currentIndex < visiblePages.length - 1) {
      state.readerPageId = visiblePages[currentIndex + 1].id;
      renderBookReader();
    }
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
      difficulty: "Ozel Soru",
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
    buttonLabel = "Uygulamayi Yukle",
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
        message: "Uygulama ana ekrandan Calisiyor.",
        ready: true,
      });
    }

    if (!window.isSecureContext || !/^https?:$/.test(window.location.protocol)) {
      updatePwaNote({
        message: "PWA kurulumu icin uygulamayi localhost veya HTTPS uzerinden ac.",
      });
      return;
    }

    if (!("serviceWorker" in navigator)) {
      updatePwaNote({
        message: "Bu tarayici PWA onbelleklemesini desteklemiyor.",
      });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js");
      await navigator.serviceWorker.ready;
      registration.update();
      updatePwaNote({
        message: "Cevrimdisi kullanim hazir. Destekleyen tarayicilarda ana ekrana ekleyebilirsin.",
        ready: true,
      });
    } catch {
      updatePwaNote({
        message: "PWA kurulumu tamamlanamadi. Uygulamayi localhost veya HTTPS uzerinden yeniden ac.",
      });
    }
  };

  const observeNavigationTargets = () => {
    return;
  };

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderSections();
  });
  elements.openReaderButton.addEventListener("click", () => openReader());
  elements.readerSectionSelect.addEventListener("change", (event) => {
    state.readerSectionId = event.target.value || "all";
    state.readerPageId = getReaderStartPageId(state.readerSectionId);
    renderBookReader();
  });
  elements.readerFilterInput.addEventListener("input", (event) => {
    state.readerQuery = event.target.value;
    renderBookReader();
  });
  elements.clearReaderFilterButton.addEventListener("click", () => {
    state.readerQuery = "";
    state.readerFilterInput.value = "";
    renderBookReader();
    elements.readerFilterInput.focus();
  });
  elements.readerThemeControls?.querySelectorAll("[data-reader-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      state.readerTheme = button.dataset.readerTheme || READER_DEFAULTS.theme;
      persistReaderPreferences();
      renderBookReader();
    });
  });
  elements.readerDensityControls?.querySelectorAll("[data-reader-density]").forEach((button) => {
    button.addEventListener("click", () => {
      state.readerDensity = button.dataset.readerDensity || READER_DEFAULTS.density;
      persistReaderPreferences();
      renderBookReader();
    });
  });
  elements.readerModeControls?.querySelectorAll("[data-reader-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.readerMode = button.dataset.readerMode || READER_DEFAULTS.mode;
      persistReaderPreferences();
      renderBookReader();
    });
  });
  elements.readerFontDecreaseButton?.addEventListener("click", () => {
    state.readerFontScale = clamp(state.readerFontScale - READER_FONT_STEP, READER_FONT_MIN, READER_FONT_MAX);
    persistReaderPreferences();
    renderBookReader();
  });
  elements.readerFontIncreaseButton?.addEventListener("click", () => {
    state.readerFontScale = clamp(state.readerFontScale + READER_FONT_STEP, READER_FONT_MIN, READER_FONT_MAX);
    persistReaderPreferences();
    renderBookReader();
  });
  elements.readerPrevButton.addEventListener("click", goReaderPrevious);
  elements.readerNextButton.addEventListener("click", goReaderNext);
  document.addEventListener("keydown", (event) => {
    const targetTag = event.target?.tagName;
    if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") {
      return;
    }
    if (!elements.studyOverlay.classList.contains("hidden") && !state.sessionComplete) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }
    }
    if (state.navTarget !== "bookScreen") {
      return;
    }

    const visiblePages = getReaderVisiblePages();
    const currentIndex = visiblePages.findIndex((page) => page.id === state.readerPageId);

    if (event.key === "ArrowLeft" && currentIndex > 0) {
      event.preventDefault();
      state.readerPageId = visiblePages[currentIndex - 1].id;
      renderBookReader();
    }

    if (event.key === "ArrowRight" && currentIndex >= 0 && currentIndex < visiblePages.length - 1) {
      event.preventDefault();
      state.readerPageId = visiblePages[currentIndex + 1].id;
      renderBookReader();
    }

    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      state.readerMode = state.readerMode === "focus" ? "standard" : "focus";
      persistReaderPreferences();
      renderBookReader();
    }
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
  elements.prevButton.addEventListener("click", goPrevious);
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

  bindHorizontalSwipe(elements.questionCard, {
    isEnabled: () => !elements.studyOverlay.classList.contains("hidden") && !state.sessionComplete && state.deck.length > 0,
    onPrev: goPrevious,
    onNext: goNext,
  });

  bindHorizontalSwipe(elements.readerPageSurface, {
    isEnabled: () => !elements.readerSection.classList.contains("hidden"),
    onPrev: goReaderPrevious,
    onNext: goReaderNext,
  });

  elements.bottomNav.querySelectorAll("[data-nav-target]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveNav(button.dataset.navTarget);
    });
  });

  elements.installAppButton.addEventListener("click", async () => {
    if (isStandalone()) {
      updatePwaNote({
        message: "Uygulama zaten ana ekrana eklenmis durumda.",
        ready: true,
      });
      return;
    }

    if (!deferredInstallPrompt) {
      updatePwaNote({
        message: "Tarayici menusundeki ana ekrana ekle secenegini de kullanabilirsin.",
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
          ? "Kurulum istegi alindi. Uygulamayi ana ekrandan acabilirsin."
          : "Kurulum iptal edildi. Istersen tekrar deneyebilirsin.",
      ready: choice.outcome === "accepted",
      showInstallButton: choice.outcome !== "accepted",
      disableInstallButton: false,
    });
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updatePwaNote({
      message: "Kurulum hazir. Butona basarak uygulamayi ana ekrana ekleyebilirsin.",
      ready: true,
      showInstallButton: true,
    });
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updatePwaNote({
      message: "Uygulama basariyla ana ekrana eklendi.",
      ready: true,
    });
  });

  initializeAppScreens();
  setBookView(state.bookView);
  renderHeroStats();
  renderFeatureStats();
  state.readerPageId = getReaderStartPageId();
  renderBookReader();
  renderBookSearchResults();
  clearQaAnswer();
  renderSections();
  setActiveNav((window.location.hash || "").replace("#", "") || "homeScreen");
  observeNavigationTargets();
  registerPwa();
})();
