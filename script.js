/**
 * 국가보훈부 소개 웹 앱 인터랙션 스크립트 (script.js)
 * - 순수 바닐라 자바스크립트로 파일 더블클릭(file://) 환경 완벽 지원
 * - 탭 전환, 실시간 뉴스 검색 및 필터링, 상식 퀴즈, 맞춤 상황별 안내, FAQ 아코디언
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 주요 업무 탭 전환
  initTabs();

  // 2. 뉴스 필터링 및 키워드 검색
  initNewsFilterAndSearch();

  // 3. 1분 보훈 퀴즈
  initQuiz();

  // 4. 상황별 보훈 서비스 바로찾기
  initSituationFinder();

  // 5. 자주 묻는 질문(FAQ) 아코디언
  initAccordion();

  // 6. 맞춤 혜택 진단 설문 & 체크리스트 (신규 추가)
  initBenefitChecker();
});

/* ==========================================================
   1. 탭 전환 기능
========================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // 탭 버튼 active 토글
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // 탭 패널 활성화
      const targetId = button.getAttribute("data-tab");
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add("active");
        } else {
          pane.classList.remove("active");
        }
      });
    });
  });
}

/* ==========================================================
   2. 뉴스 카테고리 필터 & 실시간 키워드 검색
========================================================== */
function initNewsFilterAndSearch() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("newsSearchInput");
  const newsCards = document.querySelectorAll(".news-card");
  const resultCount = document.getElementById("searchResultCount");

  let currentCategory = "all";
  let searchQuery = "";

  function updateNewsView() {
    let visibleCount = 0;

    newsCards.forEach(card => {
      const cardCategory = card.getAttribute("data-category");
      const title = card.querySelector(".news-title").textContent.toLowerCase();
      const summary = card.querySelector(".news-summary").textContent.toLowerCase();

      const matchesCategory = (currentCategory === "all") || (cardCategory === currentCategory);
      const matchesSearch = !searchQuery || title.includes(searchQuery) || summary.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultCount) {
      resultCount.textContent = `총 ${visibleCount}건 표시 중`;
    }
  }

  // 필터 버튼 클릭
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-filter");
      updateNewsView();
    });
  });

  // 검색어 입력
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      updateNewsView();
    });
  }
}

/* ==========================================================
   3. 1분 보훈 퀴즈
========================================================== */
const quizData = [
  {
    question: "대한민국 '국가보훈처'가 장관급 정규 부처인 '국가보훈부'로 공식 승격 출범한 날짜는 언제일까요?",
    options: [
      "2023년 6월 5일",
      "2021년 8월 15일",
      "2022년 1월 1일",
      "2020년 3월 1일"
    ],
    answer: 0,
    explanation: "국가보훈부는 2023년 6월 5일 정부조직법 개편에 따라 장관급 정부 부처로 공식 승격 출범했습니다."
  },
  {
    question: "국가유공자가 집 근처에서 편리하게 진료받을 수 있도록 민간 병·의원과 협약한 의료시설을 무엇이라 부를까요?",
    options: [
      "보훈 위탁병원",
      "군사 병원",
      "국립 보건소",
      "지정 한의원"
    ],
    answer: 0,
    explanation: "국가보훈부는 거동이 불편하거나 고령인 보훈가족을 위해 전국 각지에 '보훈 위탁병원'을 2,000개소까지 확충하고 있습니다."
  },
  {
    question: "아시아 최초로 대한민국 대전광역시에서 2029년 개최가 확정된 전 세계 상이군경 체육대회의 명칭은?",
    options: [
      "인빅터스 게임 (Invictus Games)",
      "패럴림픽 (Paralympic Games)",
      "월드 솔저 챔피언십",
      "유엔 참전국 평화올림픽"
    ],
    answer: 0,
    explanation: "영국 해리 왕자가 창설한 국제 상이군경 스포츠 축제인 '인빅터스 게임'이 2029년 아시아 최초로 대한민국 대전에서 개최됩니다."
  },
  {
    question: "군인, 경찰, 소방관, 해양경찰 등 제복을 입고 국민의 안전을 지키는 이들을 통칭하는 보훈부의 존중 브랜드 용어는?",
    options: [
      "제복근무자 (Men In Uniform, MIU)",
      "국가수호대",
      "특수방위관",
      "공공보호대"
    ],
    answer: 0,
    explanation: "'제복근무자(MIU)'는 군인, 경찰관, 소방관 등 제복을 입고 헌신하는 분들에 대한 존경과 예우를 확산하기 위한 캠페인 브랜드입니다."
  }
];

function initQuiz() {
  let currentQuizIndex = 0;
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("nextQuizBtn");

  if (!questionEl || !optionsEl) return;

  function loadQuiz(index) {
    const data = quizData[index];
    questionEl.textContent = `Q${index + 1}. ${data.question}`;
    optionsEl.innerHTML = "";
    feedbackEl.className = "quiz-feedback";
    feedbackEl.style.display = "none";
    feedbackEl.textContent = "";
    nextBtn.style.display = "none";

    data.options.forEach((opt, optIdx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.textContent = `${optIdx + 1}) ${opt}`;
      btn.addEventListener("click", () => handleAnswer(optIdx, data.answer, data.explanation));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(selected, correct, explanation) {
    const buttons = optionsEl.querySelectorAll(".quiz-opt-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correct) {
        btn.classList.add("correct");
      } else if (idx === selected) {
        btn.classList.add("wrong");
      }
    });

    feedbackEl.style.display = "block";
    if (selected === correct) {
      feedbackEl.className = "quiz-feedback show success";
      feedbackEl.innerHTML = `<strong>정답입니다! 🎉</strong><br>${explanation}`;
    } else {
      feedbackEl.className = "quiz-feedback show fail";
      feedbackEl.innerHTML = `<strong>아쉽지만 오답입니다.</strong><br>${explanation}`;
    }

    if (currentQuizIndex < quizData.length - 1) {
      nextBtn.textContent = "다음 문제 풀기 ➔";
      nextBtn.style.display = "inline-block";
    } else {
      nextBtn.textContent = "처음 문제부터 다시 풀기 ↺";
      nextBtn.style.display = "inline-block";
    }
  }

  nextBtn.addEventListener("click", () => {
    currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
    loadQuiz(currentQuizIndex);
  });

  loadQuiz(0);
}

/* ==========================================================
   4. 맞춤 상황별 안내 서비스 바로찾기
========================================================== */
function initSituationFinder() {
  const select = document.getElementById("userSituation");
  const resultDiv = document.getElementById("situationResult");

  const situationMap = {
    hero: {
      title: "🎖️ 국가유공자 등록 및 보훈급여 혜택 안내",
      desc: "본인 또는 가족이 국가유공자 대상인지 확인하고, 보상금, 자녀 학자금 지원, 주거 지원, 대부 등 종합 혜택을 국가보훈부 민원포털에서 원스톱으로 신청할 수 있습니다.",
      linkText: "국가유공자 혜택 및 등록안내 확인 ↗",
      linkUrl: "https://www.mpva.go.kr/mpva/minwon/minwonGuide.do"
    },
    hospital: {
      title: "🏥 내 집 주변 보훈 위탁병원 & 감면 진료 안내",
      desc: "전국 2,000여 개 지정 위탁병원을 시·도 및 진료과목별로 검색하고, 유공자 등급별 진료비 감면율 및 약제비 지원 혜택을 사전에 조회하세요.",
      linkText: "가까운 위탁병원 검색하기 ↗",
      linkUrl: "https://www.mpva.go.kr/mpva/minwon/consignmentHospital.do"
    },
    military: {
      title: "💼 제대군인 1:1 취·창업 컨설팅 & 전직지원금",
      desc: "중·장기 복무 제대군인과 전역 예정자를 위해 전국 제대군인지원센터(VSC)에서 전문 상담사 배치, 취업알선, 자격증 취득비, 전직지원금을 제공합니다.",
      linkText: "제대군인지원센터 (V-Net) 바로가기 ↗",
      linkUrl: "https://www.vnet.go.kr"
    },
    memorial: {
      title: "🕊️ 국립현충원·호국원 안장 자격 및 사전심의",
      desc: "국가유공자 사후 국립묘지 안장 대상 여부를 생전에 미리 확인해 드리는 '생전 사전심의제도' 신청 및 국립묘지 안장 통합포털에서 절차를 진행하세요.",
      linkText: "국립묘지 안장신청 통합포털 ↗",
      linkUrl: "https://www.ncms.go.kr"
    },
    citizen: {
      title: "🤝 일반 국민 참여: '모두의 보훈' 기부 및 봉사",
      desc: "국민 누구나 일상에서 국가유공자 주거환경 개선, 고령 참전유공자 지원 기부, 현충시설 정화 봉사활동 및 제복근무자 감사 캠페인에 동참할 수 있습니다.",
      linkText: "보훈 기부 & 참여마당 보기 ↗",
      linkUrl: "https://www.mpva.go.kr"
    }
  };

  if (select && resultDiv) {
    select.addEventListener("change", (e) => {
      const val = e.target.value;
      if (!val || !situationMap[val]) {
        resultDiv.innerHTML = '<p class="placeholder-text">위 목록에서 상황을 선택하시면 상세 맞춤 지원 링크와 안내가 나타납니다.</p>';
        return;
      }

      const item = situationMap[val];
      resultDiv.innerHTML = `
        <div class="result-card-inner">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <a href="${item.linkUrl}" target="_blank" rel="noopener noreferrer" class="btn-link">${item.linkText}</a>
        </div>
      `;
    });
  }
}

/* ==========================================================
   5. FAQ 아코디언 인터랙션
========================================================== */
function initAccordion() {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");

      // 다른 아코디언 닫기
      document.querySelectorAll(".accordion-item").forEach(other => {
        other.classList.remove("active");
      });

      // 현재 아이템 토글
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

/* ==========================================================
   6. 맞춤 혜택 진단 설문 & 체크리스트 (Benefit Checker)
========================================================== */
function initBenefitChecker() {
  let currentStep = 1;
  const totalSteps = 4;

  const progressFill = document.getElementById("checkerProgress");
  const stepIndicator = document.getElementById("stepIndicator");
  const prevBtn = document.getElementById("prevStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");
  const surveyCard = document.getElementById("surveyCard");
  const surveyResultBox = document.getElementById("surveyResultBox");
  const benefitCardList = document.getElementById("benefitCardList");
  const resultSummaryText = document.getElementById("resultSummaryText");
  const restartBtn = document.getElementById("restartSurveyBtn");

  const stepElements = document.querySelectorAll(".survey-step");

  // Step 설명 타이틀
  const stepTitles = [
    "나와 국가보훈부의 관계",
    "가장 관심 있는 도움 분야 (복수 선택)",
    "복무 및 부상(상이) 여부",
    "현재 등록 상태"
  ];

  // 옵션 선택 시각 효과
  document.querySelectorAll(".survey-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      const input = opt.querySelector("input");
      if (input.type === "radio") {
        const name = input.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
          r.closest(".survey-opt").classList.remove("selected");
        });
        opt.classList.add("selected");
      } else if (input.type === "checkbox") {
        if (input.checked) {
          opt.classList.add("selected");
        } else {
          opt.classList.remove("selected");
        }
      }
    });
  });

  function updateStepUI() {
    // 스텝 표시
    stepElements.forEach(el => {
      const stepNum = parseInt(el.getAttribute("data-step"), 10);
      if (stepNum === currentStep) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    // 프로그레스 바 & 인디케이터
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    stepIndicator.textContent = `단계 ${currentStep} / ${totalSteps}: ${stepTitles[currentStep - 1]}`;

    // 버튼 제어
    if (currentStep === 1) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "inline-flex";
    }

    if (currentStep === totalSteps) {
      nextBtn.textContent = "맞춤 혜택 진단 결과 보기 ➔";
    } else {
      nextBtn.textContent = "다음 단계 ➔";
    }
  }

  // 유효성 검사
  function validateCurrentStep() {
    if (currentStep === 1) {
      const checked = document.querySelector('input[name="userRole"]:checked');
      if (!checked) {
        alert("귀하의 대상 구분을 하나 선택해 주세요.");
        return false;
      }
    } else if (currentStep === 2) {
      const checked = document.querySelectorAll('input[name="interestArea"]:checked');
      if (checked.length === 0) {
        alert("관심 있는 지원 분야를 최소 1개 이상 선택해 주세요.");
        return false;
      }
    } else if (currentStep === 3) {
      const checked = document.querySelector('input[name="injuryStatus"]:checked');
      if (!checked) {
        alert("복무 또는 상이 여부를 선택해 주세요.");
        return false;
      }
    } else if (currentStep === 4) {
      const checked = document.querySelector('input[name="regStatus"]:checked');
      if (!checked) {
        alert("현재 등록 상태를 선택해 주세요.");
        return false;
      }
    }
    return true;
  }

  // 다음 버튼
  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps) {
      currentStep++;
      updateStepUI();
    } else {
      // 설문 완료 -> 결과 계산 및 렌더링
      generateBenefitResults();
    }
  });

  // 이전 버튼
  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  });

  // 다시하기 버튼
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      currentStep = 1;
      // 폼 리셋
      document.querySelectorAll('.survey-opt input').forEach(input => {
        input.checked = false;
        input.closest(".survey-opt").classList.remove("selected");
      });
      surveyResultBox.style.display = "none";
      surveyCard.style.display = "block";
      updateStepUI();
      document.getElementById("checker").scrollIntoView({ behavior: "smooth" });
    });
  }

  // 결과 생성 로직
  function generateBenefitResults() {
    const userRole = document.querySelector('input[name="userRole"]:checked').value;
    const injuryStatus = document.querySelector('input[name="injuryStatus"]:checked').value;
    const regStatus = document.querySelector('input[name="regStatus"]:checked').value;
    const interests = Array.from(document.querySelectorAll('input[name="interestArea"]:checked')).map(el => el.value);

    surveyCard.style.display = "none";
    surveyResultBox.style.display = "block";

    let roleName = "국민";
    if (userRole === "merit") roleName = "국가유공자 본인";
    else if (userRole === "family") roleName = "유공자 유가족/자녀";
    else if (userRole === "military") roleName = "제대군인/복무자";
    else if (userRole === "uniform") roleName = "제복근무자(MIU)";
    else if (userRole === "citizen") roleName = "대한민국 일반 국민";

    resultSummaryText.innerHTML = `
      선택하신 구분(<strong>${roleName}</strong>)과 관심 분야를 종합적으로 분석한 결과, 
      국가보훈부로부터 지원받으실 수 있는 핵심 혜택 및 신청 가이드입니다.
    `;

    // 추천 카드 생성
    const cards = [];

    // 1. 등록 및 심사 안내 (미등록 또는 상이군경인 경우)
    if (regStatus === "notYet" || injuryStatus === "injured") {
      cards.push({
        theme: "gold",
        title: "🎖️ [필수] 국가유공자·보훈보상대상자 등록 신청 및 AI 신속심사",
        badge: "신규 신청",
        desc: "군 복무 또는 공무 중 발생한 질병/부상에 대해 국가유공자 요건 심사를 신청하실 수 있습니다. 최근 도입된 AI 의무기록 분석 시스템을 통해 과거보다 대기 기간이 대폭 단축되어 신속한 판정을 받으실 수 있습니다.",
        actionText: "보훈심사 신청 절차 및 구비서류 확인 ↗",
        actionUrl: "https://simsa.mpva.go.kr"
      });
    }

    // 2. 의료 혜택 (관심사 또는 대상자)
    if (interests.includes("medical") || userRole === "merit" || userRole === "family") {
      let medicalDesc = "전국 5대 보훈병원 및 집 근처 전국 2,000개 보훈위탁병원에서 국비 진료(100% 감면) 또는 본인부담금 60~90% 감면 혜택을 받으실 수 있습니다.";
      if (userRole === "family") {
        medicalDesc = "유공자 배우자 및 수권유족은 보훈병원 외래 진료비 60% 감면 및 75세 이상 어르신의 경우 위탁병원 감면 혜택을 이용하실 수 있습니다.";
      }
      cards.push({
        theme: "blue",
        title: "🏥 보훈병원 국비 진료 및 내 집 주변 위탁병원 감면 혜택",
        badge: "의료·복지",
        desc: medicalDesc,
        actionText: "가까운 보훈위탁병원 지도 조회 ↗",
        actionUrl: "https://www.mpva.go.kr/mpva/minwon/consignmentHospital.do"
      });
    }

    // 3. 재정 및 대부 지원
    if (interests.includes("finance") || userRole === "merit") {
      cards.push({
        theme: "gold",
        title: "💵 보훈보상금(수당) 및 나라사랑 장기 저리 대출",
        badge: "생활안정",
        desc: "매월 15일 지급되는 보훈급여금(물가상승 반영 인상 지원)과 함께, 내 집 마련 및 전세보증금, 긴급 생활안정자금을 연 2~3%대 저금리로 융자해 드리는 대부 제도를 이용할 수 있습니다.",
        actionText: "보훈급여금 지급기준 및 대부 안내 ↗",
        actionUrl: "https://www.mpva.go.kr/mpva/minwon/minwonGuide.do"
      });
    }

    // 4. 취업 및 교육 지원 (취업/교육 관심 또는 군복무/유가족)
    if (interests.includes("job") || interests.includes("edu") || userRole === "military" || userRole === "family") {
      cards.push({
        theme: "green",
        title: "💼 채용 가점(5~10%) & 대학교 등록금 전액 면제 / 학습보조비",
        badge: "자립·취업",
        desc: "공무원·공기업 채용시험 응시 시 5% 또는 10%의 법정 취업지원 가점이 부여됩니다. 또한 본인 및 대학생 자녀의 경우 국·공립 및 사립대 등록금(입학금·수업료) 면제 혜택과 학습보조비를 지원받을 수 있습니다.",
        actionText: "취업지원 및 교육지원 신청 방법 ↗",
        actionUrl: "https://e-bohun.mpva.go.kr"
      });
    }

    // 5. 제대군인 특화 지원
    if (userRole === "military" || injuryStatus === "longTerm" || injuryStatus === "conscript") {
      cards.push({
        theme: "purple",
        title: "🪖 제대군인지원센터(VSC) 1:1 취업 매칭 & 청년 군복무 인정",
        badge: "제대군인",
        desc: "5년 이상 복무 제대군인은 구직활동 시 매월 '전직지원금'과 무료 직업훈련 바우처를 받으실 수 있습니다. 아울러 의무복무 제대자에게는 공공기관 채용 시 군 복무기간 호봉 산정 및 정부 청년정책 연령 상한(최대 3년) 연장 혜택이 적용됩니다.",
        actionText: "제대군인지원센터 일자리·교육 신청 ↗",
        actionUrl: "https://www.vnet.go.kr"
      });
    }

    // 6. 국립묘지 안장 및 예우 (사망 시)
    if (interests.includes("memorial") || userRole === "merit" || userRole === "family") {
      cards.push({
        theme: "blue",
        title: "🕊️ 국립현충원·호국원 안장 지원 & 생전 사전심의제도",
        badge: "국가예우",
        desc: "사후 국립대전현충원 또는 각 권역 호국원(괴산, 이천, 영천 등)에 품격 있는 국가안장을 지원합니다. 생전에 안장 대상 자격을 미리 판별해 주는 '생전 안장심의제도'를 신청하여 유가족의 불안을 덜 수 있습니다.",
        actionText: "국립묘지 안장 사전심의 신청 ↗",
        actionUrl: "https://www.ncms.go.kr"
      });
    }

    // 7. 일반 국민 / 일상 감면 혜택
    if (interests.includes("life") || userRole === "citizen") {
      cards.push({
        theme: "gold",
        title: "🇰🇷 '모두의 보훈' 국민 참여 기부 & 고궁·문화시설 감면",
        badge: "국민참여",
        desc: "일반 국민 누구나 '모두의 보훈드림' 플랫폼을 통해 보훈가족 지원 기부 및 자원봉사에 참여할 수 있습니다. 등록 유공자증 제시 시 전국 고궁·박물관 무료입장, 지하철·KTX 할인, 유공자 우선주차장 이용 혜택이 제공됩니다.",
        actionText: "모두의 보훈 참여마당 바로가기 ↗",
        actionUrl: "https://www.mpva.go.kr"
      });
    }

    // 렌더링
    benefitCardList.innerHTML = "";
    cards.forEach(card => {
      const cardEl = document.createElement("div");
      cardEl.className = `benefit-item ${card.theme}`;
      cardEl.innerHTML = `
        <div class="b-title-row">
          <span class="b-title">${card.title}</span>
          <span class="b-badge">${card.badge}</span>
        </div>
        <p class="b-desc">${card.desc}</p>
        <a href="${card.actionUrl}" target="_blank" rel="noopener noreferrer" class="b-action">${card.actionText}</a>
      `;
      benefitCardList.appendChild(cardEl);
    });

    // 결과 위치로 스크롤
    surveyResultBox.scrollIntoView({ behavior: "smooth" });
  }

  updateStepUI();
}

