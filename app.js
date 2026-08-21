"use strict";

const TRADES = [
  "土木工事業（土木一式工事）", "建築工事業（建築一式工事）", "大工工事業", "左官工事業", "とび・土工工事業", "石工事業", "屋根工事業",
  "電気工事業", "管工事業", "タイル・れんが・ブロック工事業", "鋼構造物工事業", "鉄筋工事業", "舗装工事業",
  "しゅんせつ工事業", "板金工事業", "ガラス工事業", "塗装工事業", "防水工事業", "内装仕上工事業",
  "機械器具設置工事業", "熱絶縁工事業", "電気通信工事業", "造園工事業", "さく井工事業", "建具工事業",
  "水道施設工事業", "消防施設工事業", "清掃施設工事業", "解体工事業"
];

const TOTAL_QUESTIONS = 20;
const UNKNOWN_TRADE = "どれを選べばいいかわからない";

const questions = {
  q1: { number: 1, title: "建設業を行う営業所は、すべて同じ都道府県内にありますか？", help: "この診断は、1つの都道府県内にだけ営業所を置く知事許可の新規申請を対象としています。営業所とは、建設工事の見積りや契約などを継続して行う事務所・店舗などです。", options: [["yes","はい"],["no","いいえ"],["unknown","よくわからない"]] },
  q2: { number: 2, title: "発注者から直接請け負う1件の工事について、下請業者へ出す金額の合計は、次の基準未満ですか？", help: "一般建設業の基準（税込）は5,000万円未満、建築一式工事は8,000万円未満です。複数の下請業者へ出す場合は合計額で判断します。下請に出さない場合は「基準未満」を選んでください。", options: [["general","基準未満／下請に出さない"],["specific","基準以上になる予定"],["unknown","よくわからない"]] },
  qOffice: { number: 3, title: "使用予定の場所は、建設業の営業所として必要な条件をすべて満たしていますか？", examples: ["来客を迎えて見積り・契約の打合せができる", "電話・机・帳簿等を備え、他の部屋や他社と明確に区切られている", "自己所有、または事務所利用が認められた賃貸借契約がある", "営業所の標識を掲示できる"], help: "自宅でも、住居部分と明確に区分され、来客対応・使用権限などの条件を満たせば認められる可能性があります。", options: [["ready","すべて満たしている"],["partial","一部は満たしているが、未確認の条件がある"],["homeUnconfirmed","自宅を使う予定だが、条件はまだ確認していない"],["notReady","使用できる場所がまだない"],["unknown","よくわからない"]] },
  q3: { number: 4, title: "建設会社の役員や、一人親方・個人事業主として、建設業を5年以上経営した経験がある人はいますか？", examples: ["建設会社の取締役を5年以上していた","一人親方として5年以上工事を請け負っていた","個人事業主として建設業を5年以上営んでいた"], help: "現在の会社だけでなく、以前の会社や個人事業での経験を使える場合もあります。", options: [["fivePlus","5年以上ある"],["underFive","5年未満"],["unknown","よくわからない"]] },
  q4: { number: 5, title: "その経験を確認できそうな書類がありますか？", examples: ["会社の登記事項証明書","過去の確定申告書","工事の契約書","注文書・請書","請求書や入金記録"], help: "実際に必要になる資料は、経験の内容や申請先によって異なります。", options: [["likely","ありそう"],["partial","一部ならありそう"],["none","ないと思う"],["unknown","よくわからない"]] },
  q5: { number: 6, title: "建設会社で、役員に次ぐ立場として経営に関する権限を任され、5年以上、会社の経営を管理した人はいますか？", examples: ["工事の受注や契約に関する判断","重要な取引先との交渉","人員配置や資金管理に関する判断"], help: "単に担当者として働いた経験ではなく、役員から権限を任されて会社の経営判断に関わった経験を確認します。", options: [["yes","いる"],["similar","似た経験はある"],["no","いない"],["unknown","よくわからない"]] },
  q6: { number: 7, title: "建設会社で、役員に次ぐ立場として、6年以上、役員の経営判断を直接支える仕事をした人はいますか？", examples: ["工事の受注や契約に関する仕事","会社のお金の管理","人員配置","重要な取引先とのやり取り"], help: "一般的な事務補助ではなく、役員のすぐ下で会社の経営を継続して支えた経験を確認します。", options: [["yes","いる"],["similar","似た経験がある"],["no","いない"],["unknown","よくわからない"]] },
  q7: { number: 8, title: "ここまでに当てはまらなくても、役員経験や、財務・労務・会社運営を管理した経験がありますか？", examples: ["建設業で役員として働いていた","建設業以外の会社で役員として働いていた","財務・労務・会社運営を管理していた"], help: "役員の経験と、財務・労務・会社運営を管理した人の経験を組み合わせて、要件を満たせる場合があります。この回答は詳しい確認が必要な項目として扱います。", options: [["yes","ある"],["some","少しある"],["no","ない"],["unknown","よくわからない"]] },
  qMgmtRole: { number: 9, title: "ここまでに回答した経験者のうち、申請する会社で経営を担当する人は、役員などとして普段から勤務していますか（または申請までに就任する予定ですか）？", help: "経営経験だけでなく、申請する会社で経営を担当しながら勤務することが必要です。", options: [["current","現在、役員などとして普段から勤務している"],["planned","申請までに就任して勤務する予定"],["no","その予定はない"],["unknown","よくわからない"]] },
  q8: { number: 10, title: "健康保険・厚生年金について、加入が必要な場合は加入手続きをしていますか？", options: [["joined","加入している"],["notRequired","加入する必要がない"],["notJoined","加入していない"],["unknown","よくわからない"]] },
  q9: { number: 11, title: "加入が必要な従業員がいる場合、雇用保険の加入手続きをしていますか？", options: [["joined","加入している"],["notRequired","加入する必要がない"],["notJoined","加入していない"],["unknown","よくわからない"]] },
  q10: { number: 12, title: "許可を取りたい工事の種類を選んでください。", type: "trade" },
  q11: { number: 13, title: "申請する会社で普段から勤務し、営業所で工事の技術面を担当する人（営業所技術者等）の候補はいますか？", help: "社長自身でも、役員や従業員でも構いません。原則として、その営業所で継続して勤務し、見積りや契約に必要な技術面を担当できる人が対象です。", options: [["yes","いる（普段から勤務し、担当できる）"],["uncertain","候補はいるが、勤務・担当できるか未確認"],["no","いない"],["unknown","よくわからない"]] },
  q12: { number: 14, title: "その人は、建設工事に関係する資格を持っていますか？", examples: ["建築士","施工管理技士","技能士","電気工事士"], help: "施工管理技術検定は、第一次検定だけ合格している場合も「持っている」を選び、資格名欄に「1級第一次検定合格」などと入力してください。", type: "qualification", options: [["yes","持っている"],["no","持っていない"],["unknown","よくわからない"]] },
  q13: { number: 15, title: "その人は、許可を取りたい種類の工事に、仕事として実際に携わった経験（実務経験）がありますか？", options: [["tenPlus","10年以上ある"],["underTen","10年未満だがある"],["none","ない"],["unknown","よくわからない"]] },
  q14: { number: 16, title: "その人は、建築科・土木科など、建設関係の学科を卒業していますか？", examples: ["建築科","土木科","電気科","機械科"], help: "学校にその学科があるだけでなく、本人がその学科を卒業している場合です。対象となる学科は、選んだ工事業種によって異なります。", options: [["yes","卒業している"],["no","卒業していない"],["unknown","よくわからない"]] },
  q15: { number: 17, title: "直近の決算書で、500万円以上の自己資本があると確認できますか？", help: "法人の場合は貸借対照表の「純資産合計」などを確認します。個人事業主の場合は確認方法が異なります。", options: [["fiveMillion","500万円以上"],["under","500万円未満"],["unknown","わからない"],["noClosing","まだ決算を迎えていない"]] },
  q16: { number: 18, title: "500万円以上の資金を用意できることを、預金などで証明できそうですか？", examples: ["金融機関の預金残高証明書などで確認できる場合があります。"], options: [["likely","できそう"],["difficult","難しそう"],["unknown","よくわからない"]] },
  q17: { number: 19, title: "申請する本人や会社の役員などに、工事の契約や仕事で、不正や重大な契約違反をしたことがありますか？", examples: ["工事代金や契約に関する詐欺、脅迫、横領、重大な契約違反", "建築士・宅地建物取引業など他の許認可で、不正・不誠実な行為を理由に取消処分を受けたこと"], help: "処分を受けたかどうかだけでなく、行為の内容や時期を個別に確認します。", options: [["none","ない"],["yes","ある"],["unknown","よくわからない"]] },
  q18: { number: 20, title: "本人・役員・営業所責任者について、当てはまるものをすべて選んでください。", help: "法律上の「欠格要件」の確認です。申請者が未成年の場合は、法定代理人も対象になります。", type: "multiple", options: [["bankrupt","現在、破産していて復権していない"],["revoked","不正な手段や営業停止違反などを理由に建設業許可を取り消され、5年以内である"],["suspended","現在、建設業の営業停止・営業禁止の期間中である"],["crime","拘禁刑、または建設業法等の一定の罪による罰金刑を受け、5年以内である"],["gang","暴力団員である、離脱から5年以内である、または事業活動を支配されている"],["capacity","認知・判断・意思疎通の状態について、建設業を適正に営めるか心配がある"],["concern","上の項目に心当たりはあるが、時期や処分内容がわからない"],["none","どれにも当てはまらない"],["unknown","質問の意味や対象者がよくわからない"]] }
};

const screens = {
  start: document.querySelector("#start-screen"),
  question: document.querySelector("#question-screen"),
  scope: document.querySelector("#out-of-scope-screen"),
  resultReady: document.querySelector("#result-ready-screen"),
  result: document.querySelector("#result-screen")
};
const state = { answers: {}, history: [], current: null, transitionToken: 0, pendingAdvance: null };

function cancelPendingAdvance() {
  state.transitionToken += 1;
  if (state.pendingAdvance !== null) window.clearTimeout(state.pendingAdvance);
  state.pendingAdvance = null;
  document.querySelectorAll(".answer-button").forEach(button => {
    button.classList.remove("is-selected");
    button.removeAttribute("aria-pressed");
    button.disabled = false;
    delete button.dataset.advancing;
  });
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
}
const statusText = { OK: "要件を満たす可能性あり", CHECK: "確認が必要です", NG: "要件を満たしていない可能性があります", UNKNOWN: "現在の回答だけでは判断できません" };

const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
  resetScrollPosition();
  window.requestAnimationFrame(resetScrollPosition);
}

function resetScrollPosition() {
  const scrollRoot = document.scrollingElement;
  if (scrollRoot) scrollRoot.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function startDiagnosis() {
  cancelPendingAdvance();
  state.answers = {}; state.history = []; state.current = null;
  document.querySelector("#question-content").replaceChildren();
  document.querySelector("#result-content").replaceChildren();
  goTo("q1", false);
}

function goTo(id, addHistory = true) {
  if (addHistory && state.current) state.history.push(state.current);
  state.current = id;
  renderQuestion();
  showScreen("question");
}

function renderQuestion() {
  const q = questions[state.current];
  const percent = Math.round((q.number / TOTAL_QUESTIONS) * 100);
  document.querySelector("#progress-text").textContent = `質問 ${q.number}（最大${TOTAL_QUESTIONS}問）`;
  document.querySelector("#progress-percent").textContent = `${percent}%`;
  document.querySelector("#progress-bar").style.width = `${percent}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", q.number);
  const content = document.querySelector("#question-content");
  const kicker = state.current === "q8" ? "社会保険の確認 1/2｜健康保険・厚生年金" : state.current === "q9" ? "雇用保険｜2/2" : state.current === "qOffice" ? "営業所の確認" : "主な要件の確認";
  const kickerClass = state.current === "q8" ? "question-kicker social-step" : state.current === "q9" ? "question-kicker employment-step" : "question-kicker";
  let html = state.current === "q9" ? `<div class="switch-notice"><span class="switch-check" aria-hidden="true">✓</span><div><small>健康保険・厚生年金の確認が終わりました</small><strong>続いて、雇用保険について確認します</strong></div></div>` : "";
  html += `<div class="${kickerClass}">${kicker}</div><h1 class="question-title">${esc(q.title)}</h1>`;
  if (q.examples) html += `<div class="examples-box"><strong>具体例</strong><ul>${q.examples.map(item => `<li>${esc(item)}</li>`).join("")}</ul></div>`;
  if (q.help) html += `<div class="help-box"><p>${esc(q.help)}</p></div>`;
  if (q.type === "trade") html += renderTrade(q);
  else if (q.type === "qualification") html += renderQualification(q);
  else if (q.type === "multiple") html += renderMultiple(q);
  else html += `<div class="answer-list">${q.options.map(([value,label]) => `<button class="answer-button" data-value="${esc(value)}" type="button">${esc(label)}</button>`).join("")}</div>`;
  content.innerHTML = html;
  bindQuestionEvents(q);
}

function renderTrade() {
  const selected = state.answers.q10 || "";
  return `<label class="field-label" for="trade-select">工事の種類</label><select id="trade-select" class="select-field"><option value="">選択してください</option>${TRADES.map(t => `<option value="${esc(t)}" ${selected === t ? "selected" : ""}>${esc(t)}</option>`).join("")}<option value="${UNKNOWN_TRADE}" ${selected === UNKNOWN_TRADE ? "selected" : ""}>${UNKNOWN_TRADE}</option></select><p id="form-error" class="form-error" hidden></p><button id="trade-next" class="next-button" type="button">次へ</button>`;
}

function renderQualification(q) {
  const saved = state.answers.q12 || {};
  return `<div class="answer-list">${q.options.map(([value,label]) => `<button class="answer-button" data-value="${esc(value)}" type="button">${esc(label)}</button>`).join("")}</div><div id="qualification-entry" ${saved.answer === "yes" ? "" : "hidden"}><label class="field-label" for="qualification-name">資格名（わかる範囲で入力）</label><input id="qualification-name" class="text-field" type="text" maxlength="100" value="${esc(saved.qualificationName || "")}" placeholder="例：二級建築施工管理技士"><p class="help-text">資格名が正確にわからない場合は、わかる範囲で構いません。</p><button id="qualification-next" class="next-button" type="button">次へ</button></div>`;
}

function renderMultiple(q) {
  const selected = state.answers.q18 || [];
  return `<div class="multi-list">${q.options.map(([value,label]) => `<label class="multi-option"><input type="checkbox" value="${esc(value)}" ${selected.includes(value) ? "checked" : ""}><span>${esc(label)}</span></label>`).join("")}</div><p id="form-error" class="form-error" hidden></p><button id="multi-next" class="next-button" type="button">次へ</button>`;
}

function bindQuestionEvents(q) {
  if (q.type === "trade") {
    document.querySelector("#trade-next").addEventListener("click", () => {
      const value = document.querySelector("#trade-select").value;
      if (!value) return showError("工事の種類を選んでください。");
      state.answers.q10 = value; proceed("q10", value);
    });
    return;
  }
  if (q.type === "multiple") {
    const boxes = [...document.querySelectorAll('.multi-option input')];
    boxes.forEach(box => box.addEventListener("change", () => {
      if (box.value === "none" && box.checked) boxes.forEach(other => { if (other !== box) other.checked = false; });
      if (box.value !== "none" && box.checked) { const none = boxes.find(item => item.value === "none"); if (none) none.checked = false; }
    }));
    document.querySelector("#multi-next").addEventListener("click", () => {
      const values = boxes.filter(box => box.checked).map(box => box.value);
      if (!values.length) return showError("当てはまるものを1つ以上選んでください。");
      state.answers.q18 = values; showResultReady();
    });
    return;
  }
  document.querySelectorAll(".answer-button").forEach(button => button.addEventListener("click", () => {
    const value = button.dataset.value;
    if (button.dataset.advancing === "true") return;
    if (q.type === "qualification" && value === "yes") {
      state.answers.q12 = { answer: "yes", qualificationName: state.answers.q12?.qualificationName || "" };
      document.querySelector("#qualification-entry").hidden = false;
      document.querySelector("#qualification-name").focus();
      return;
    }
    button.dataset.advancing = "true";
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
    document.querySelectorAll(".answer-button").forEach(answerButton => { answerButton.disabled = true; });
    const questionId = state.current;
    const transitionToken = state.transitionToken;
    state.pendingAdvance = window.setTimeout(() => {
      if (transitionToken !== state.transitionToken || state.current !== questionId) return;
      state.pendingAdvance = null;
      state.answers[questionId] = q.type === "qualification" ? { answer: value, qualificationName: "" } : value;
      proceed(questionId, value);
    }, 140);
  }));
  if (q.type === "qualification") document.querySelector("#qualification-next").addEventListener("click", () => {
    state.answers.q12 = { answer: "yes", qualificationName: document.querySelector("#qualification-name").value.trim() };
    proceed("q12", "yes");
  });
}

function showError(message) { const el = document.querySelector("#form-error"); el.textContent = message; el.hidden = false; }

function proceed(id, value) {
  const routes = {
    q1: () => value === "no" ? outOfScope("この診断は知事許可を対象としています。2つ以上の都道府県に営業所がある場合は、国土交通大臣許可となる可能性があります。") : goTo("q2"),
    q2: () => value === "specific" ? outOfScope("下請業者へ出す金額が基準以上になる工事では、特定建設業の許可が必要となる可能性があります。この診断は一般建設業のみを対象としています。") : goTo("qOffice"),
    qOffice: () => goTo("q3"),
    q3: () => goTo(value === "fivePlus" ? "q4" : "q5"),
    q4: () => goTo("qMgmtRole"),
    q5: () => goTo(value === "no" ? "q6" : "qMgmtRole"),
    q6: () => goTo(value === "no" ? "q7" : "qMgmtRole"),
    q7: () => goTo(value === "no" ? "q8" : "qMgmtRole"), qMgmtRole: () => goTo("q8"),
    q8: () => goTo("q9"), q9: () => goTo("q10"), q10: () => goTo("q11"),
    q11: () => goTo(value === "yes" || value === "uncertain" ? "q12" : "q15"),
    q12: () => goTo("q13"),
    q13: () => goTo(value === "underTen" ? "q14" : "q15"),
    q14: () => goTo("q15"), q15: () => goTo(value === "fiveMillion" ? "q17" : "q16"),
    q16: () => goTo("q17"), q17: () => goTo("q18")
  };
  routes[id]();
}

function outOfScope(message) { document.querySelector("#out-of-scope-message").textContent = message; showScreen("scope"); }

function showResultReady() {
  document.querySelector("#result-confirm").checked = false;
  document.querySelector("#show-result-button").disabled = true;
  showScreen("resultReady");
}

function goBack() {
  if (!state.history.length) { showScreen("start"); return; }
  state.current = state.history.pop();
  renderQuestion(); showScreen("question");
}

function item(status, reasons = [], display = {}) { return { status, reasons, ...display }; }
function unknownReason(label) { return item("UNKNOWN", [`${label}について、現在の回答だけでは判断できません。`]); }

function calculateResults() {
  const a = state.answers;
  let office;
  if (a.qOffice === "ready") office = item("OK");
  else if (a.qOffice === "partial") office = item("CHECK", ["営業所に必要な設備、他の部屋や他社との区分、その場所を事務所として使えること、来客対応、標識の掲示などに未確認の条件があります。"]);
  else if (a.qOffice === "homeUnconfirmed") office = item("CHECK", ["自宅を営業所として使用する場合は、来客対応、その場所を事務所として使えること、住居部分との明確な区分などの確認が必要です。"]);
  else if (a.qOffice === "notReady") office = item("NG", ["現在の回答では、建設業の営業所として使用できる場所が確認できません。申請前に営業所を用意し、必要な条件を満たす必要があります。"]);
  else if (a.qOffice === "unknown") office = item("CHECK", ["使用予定の場所が、許可申請上の営業所として認められるか確認が必要です。"]);
  else office = unknownReason("営業所");

  let management;
  const roleReady = a.qMgmtRole === "current" || a.qMgmtRole === "planned";
  const roleMissing = a.qMgmtRole === "no";
  if (roleMissing) management = item("NG", ["経営経験があっても、申請する会社で経営を担当しながら普段から勤務する人が必要です。現在の回答では、その予定を確認できませんでした。"]);
  else if (a.q3 === "fivePlus") management = roleReady && a.q4 === "likely" ? item("OK") : item("CHECK", ["その会社での勤務状況と、経営経験を確認する書類の詳しい確認が必要です。以前の会社や個人事業での資料を使える場合があります。"]);
  else if (a.q5 && a.q5 !== "no") management = item("CHECK", ["役員に次ぐ立場として経営に関する権限を任されていたか、その期間、普段の勤務状況、証明書類について詳しい確認が必要です。"]);
  else if (a.q6 && a.q6 !== "no") management = item("CHECK", ["役員に次ぐ立場で経営判断を直接支えていたか、その期間、仕事内容、普段の勤務状況、証明書類について詳しい確認が必要です。"]);
  else if (a.q7 === "no") management = item("NG", ["現在の回答では、経営を担当する人に必要な主な経験を確認できませんでした。役員や管理職の経験を使える場合もあります。"]);
  else if (a.q7) management = item("CHECK", ["役員経験や、財務・労務・会社運営を管理した人の経験を組み合わせて要件を満たせるか、詳しい確認が必要です。"]);
  else management = unknownReason("経営経験");

  const insuranceReasons = [];
  let insuranceStatus = "OK";
  [["q8","健康保険・厚生年金"],["q9","雇用保険"]].forEach(([key,label]) => {
    if (a[key] === "notJoined") { insuranceStatus = "NG"; insuranceReasons.push(`${label}について、加入が必要な場合の手続きが済んでいない可能性があります。加入義務と必要な対応の確認をおすすめします。`); }
    else if (a[key] === "unknown" && insuranceStatus !== "NG") { insuranceStatus = "CHECK"; insuranceReasons.push(`${label}の加入が必要かどうか確認が必要です。`); }
    else if (!a[key] && insuranceStatus !== "NG") { insuranceStatus = "UNKNOWN"; insuranceReasons.push(`${label}について、現在の回答だけでは判断できません。`); }
  });
  const socialInsurance = item(insuranceStatus, insuranceReasons);

  let engineer;
  const qualificationName = a.q12?.answer === "yes" ? a.q12.qualificationName || "未入力" : "";
  if (a.q11 === "no") engineer = item("NG", ["現在の回答では、営業所で継続して勤務する技術者の候補が確認できませんでした。別の人の資格や実務経験によって要件を満たせる場合があります。"]);
  else if (a.q11 === "unknown") engineer = item("CHECK", ["営業所で継続して勤務する技術者の候補について確認が必要です。"]);
  else if (a.q11 === "uncertain") engineer = item("CHECK", ["候補者が申請する会社で普段から勤務し、その営業所を担当できるか確認が必要です。資格や実務経験だけでは、勤務・担当の条件を補えません。"], { qualificationName });
  else if (a.q10 === UNKNOWN_TRADE) engineer = item("CHECK", ["選んだ工事業種が未確定のため、資格や実務経験が使えるか判断できません。実際に請け負う工事内容から業種を確認してください。"], { qualificationName });
  else if (a.q13 === "tenPlus") engineer = item("OK", [], { qualificationName });
  else if (a.q12?.answer === "yes") engineer = item("CHECK", ["入力された資格が、選んだ工事業種に使えるか確認が必要です。施工管理技術検定の第一次検定に合格している場合は、実務経験と組み合わせて要件を満たせることがあります。資格名・合格区分・実務経験を確認してください。"], { hold: true, qualificationName });
  else if (a.q12?.answer === "unknown") engineer = item("CHECK", ["持っている資格の有無や資格名について確認が必要です。"]);
  else if (a.q13 === "none") engineer = item("NG", ["現在の回答では、資格または選んだ工事業種に関する実務経験を確認できませんでした。別の技術者候補で要件を満たせる場合があります。"]);
  else if (a.q13 === "unknown") engineer = item("CHECK", ["選んだ工事業種に関する実務経験の内容と期間について確認が必要です。"]);
  else if (a.q14) engineer = item("CHECK", [a.q14 === "yes" ? "卒業した学科が選んだ工事業種の対象になるか、実務経験の期間と証明書類を含めて確認が必要です。" : a.q14 === "no" ? "対象となる学科の卒業に当たらない場合でも、実務経験の内容や期間によって要件を満たせる場合があります。" : "卒業学科、実務経験の期間、選んだ工事業種との関係について確認が必要です。"]);
  else engineer = unknownReason("営業所を担当する技術者");

  let finance;
  if (a.q15 === "fiveMillion") finance = item("OK");
  else if (a.q16 === "likely") finance = item("CHECK", ["500万円以上を用意できることを、預金残高証明書などで証明できるか確認が必要です。"]);
  else if (a.q16 === "difficult") finance = item("NG", ["現在の回答では、決算書で500万円以上あること、または500万円以上を用意できることを確認できませんでした。"]);
  else if (a.q16 === "unknown") finance = item("CHECK", ["500万円以上あること、または用意できることを、どの資料で証明できるか確認が必要です。"]);
  else finance = unknownReason("500万円の資金要件");

  let integrity;
  if (a.q17 === "none") integrity = item("OK", [], { okText: "現在の回答では該当なし" });
  else if (a.q17) integrity = item("CHECK", [a.q17 === "yes" ? "過去の問題の内容・時期・処分などが、許可に影響するか詳しい確認が必要です。" : "過去の不正や重大な契約違反に当たる事情がないか確認が必要です。"]);
  else integrity = unknownReason("過去の不正・重大な契約違反（誠実性）");

  let disqualification;
  if (Array.isArray(a.q18) && a.q18.length === 1 && a.q18[0] === "none") disqualification = item("OK", [], { okText: "現在の回答では該当なし" });
  else if (Array.isArray(a.q18) && a.q18.some(value => ["bankrupt", "revoked", "suspended", "crime", "gang"].includes(value))) disqualification = item("NG", ["現在の回答には、許可を受けられない事情に該当する可能性が高い項目があります。対象者、処分・刑の内容、時期を確認してください。"]);
  else if (Array.isArray(a.q18) && a.q18.length) {
    const reasons = [];
    if (a.q18.includes("capacity")) reasons.push("この項目は病名や障害の有無だけで決まるものではありません。建設業を営むために必要な認知・判断・意思疎通ができるかを個別に確認します。");
    if (a.q18.some(value => ["concern", "unknown"].includes(value))) reasons.push("事情の時期、処分・刑の内容、対象者の範囲などを確認する必要があります。");
    disqualification = item("CHECK", reasons);
  }
  else disqualification = unknownReason("許可を受けられない事情（欠格要件）");

  return { office, management, socialInsurance, engineer, finance, integrity, disqualification };
}

function calculateOverall(results, answers = state.answers) {
  const entries = Object.values(results);
  const hasNG = entries.some(result => result.status === "NG");
  const targetNeedsReview = answers.q1 === "unknown" || answers.q2 === "unknown";
  const tradeNeedsReview = answers.q10 === UNKNOWN_TRADE;
  const hasReview = targetNeedsReview || tradeNeedsReview || entries.some(result => result.status === "CHECK" || result.status === "UNKNOWN");
  if (hasNG) return { cls: "ng", text: "このままでは許可を受けられない可能性がある項目があります" };
  if (hasReview) return { cls: "check", text: "確認が必要な項目があります" };
  return { cls: "ok", text: "現時点の回答では、主な要件を満たしている可能性があります。" };
}

function showResults() {
  const results = calculateResults();
  const labels = {
    management: "経営を担当する人・体制（経営業務の管理体制）",
    engineer: "営業所を担当する技術者（営業所技術者等）",
    finance: "500万円の資金要件（財産的基礎）",
    integrity: "過去の不正・重大な契約違反（誠実性）",
    disqualification: "許可を受けられない事情（欠格要件）"
  };
  const entries = [
    ["営業所", results.office], [labels.management, results.management], ["社会保険", results.socialInsurance], [labels.engineer, results.engineer],
    [labels.finance, results.finance], [labels.integrity, results.integrity], [labels.disqualification, results.disqualification]
  ];
  const overall = calculateOverall(results);
  const trade = state.answers.q10 || "未回答";
  const reasons = entries.filter(([,r]) => r.status !== "OK").map(([label,r]) => `<article class="reason-card ${r.hold ? "HOLD" : r.status}"><h3>${esc(label)}｜${r.hold ? "入力した資格が使えるか確認が必要です" : statusText[r.status]}</h3>${r.qualificationName ? `<p class="entered-qualification"><strong>入力された資格：</strong>${esc(r.qualificationName)}</p>` : ""}${r.reasons.map(reason => `<p>${esc(reason)}</p>`).join("")}</article>`).join("");
  const targetNotes = [];
  if (state.answers.q1 === "unknown") targetNotes.push({ label: "許可区分", text: "営業所がすべて同じ都道府県内にあるか確認が必要です。2つ以上の都道府県に営業所がある場合は、国土交通大臣許可となる可能性があります。" });
  if (state.answers.q2 === "unknown") targetNotes.push({ label: "許可区分", text: "下請業者へ出す金額の合計から、一般建設業と特定建設業のどちらに当たるか確認が必要です。" });
  if (trade === UNKNOWN_TRADE) targetNotes.push({ label: "工事業種", text: "実際に請け負っている工事の内容から、必要な業種を確認する必要があります。" });
  document.querySelector("#result-content").innerHTML = `
    <h1>診断結果</h1>
    <div class="overall ${overall.cls}"><h2>${esc(overall.text)}</h2></div>
    <div class="trade-card"><strong>選んだ工事業種</strong><p>${esc(trade)}</p></div>
    ${targetNotes.length ? `<div class="reason-list">${targetNotes.map(note => `<article class="reason-card CHECK"><h3>${esc(note.label)}｜確認が必要です</h3><p>${esc(note.text)}</p></article>`).join("")}</div>` : ""}
    <h2>分野別の結果</h2>
    <div class="result-grid">${entries.map(([label,r]) => {
      const documentNote = label === labels.management
        ? "ただし、経営経験の内容や証明書類の詳しい確認が必要です。"
        : label === labels.engineer
          ? "ただし、選んだ工事業種に関する実務経験や証明書類の詳しい確認が必要です。"
          : "";
      return `<div class="result-item">
        <div class="result-item-head"><strong>${esc(label)}</strong><span class="status-badge ${r.hold ? "status-HOLD" : `status-${r.status}`}">${r.hold ? "入力した資格が使えるか確認が必要です" : (r.okText || statusText[r.status])}</span></div>
        ${r.qualificationName ? `<p class="entered-qualification"><strong>入力された資格：</strong>${esc(r.qualificationName)}</p>` : ""}
        ${r.status === "OK" && documentNote ? `<p class="document-note"><strong>${esc(documentNote)}</strong></p>` : ""}
      </div>`;
    }).join("")}</div>
    ${reasons ? `<h2>確認・対応が必要な理由</h2><div class="reason-list">${reasons}</div>` : ""}
    ${state.answers.qOffice === "homeUnconfirmed" ? `<div class="home-office-note">
      <h2>自宅を営業所にする場合</h2>
      <p>打合せスペース、その場所を事務所として使えることを確認する書類、住居部分との区分などについて、細かな確認が必要になる場合があります。</p>
    </div>` : ""}
    ${overall.cls === "ok" ? `<div class="result-complete-message">
      <div class="mascot-frame result-complete-mascot-frame"><img class="result-complete-mascot" src="assets/tiger-mascot.png" width="618" height="640" alt="胸を張ったトラのキャラクター"></div>
      <div>
        <h2>チェックおつかれさまでした。</h2>
        <p>次は、実際の申請に必要な書類を確認していきましょう。</p>
      </div>
    </div>` : ""}`;
  showScreen("result");
}

document.querySelector("#notice-confirm-1").addEventListener("change", event => { document.querySelector("#start-button").disabled = !event.target.checked; });
document.querySelector("#start-button").addEventListener("click", startDiagnosis);
document.querySelector("#back-button").addEventListener("click", goBack);
document.querySelector("#scope-back-button").addEventListener("click", () => { renderQuestion(); showScreen("question"); });
document.querySelector("#result-confirm").addEventListener("change", event => { document.querySelector("#show-result-button").disabled = !event.target.checked; });
document.querySelector("#show-result-button").addEventListener("click", showResults);
document.querySelector("#ready-back-button").addEventListener("click", () => { renderQuestion(); showScreen("question"); });
function resetDiagnosis(requireConfirmation = false) {
  if (requireConfirmation && !window.confirm("回答内容を消して、最初からやり直しますか？")) return;
  document.querySelector("#notice-confirm-1").checked = false;
  document.querySelector("#start-button").disabled = true;
  document.querySelector("#result-confirm").checked = false;
  document.querySelector("#show-result-button").disabled = true;
  cancelPendingAdvance();
  state.answers = {}; state.history = []; state.current = null;
  document.querySelector("#question-content").replaceChildren();
  document.querySelector("#result-content").replaceChildren();
  showScreen("start");
}
document.querySelector("#question-restart-button").addEventListener("click", () => resetDiagnosis(true));
document.querySelector("#ready-restart-button").addEventListener("click", () => resetDiagnosis(true));
document.querySelectorAll(".restart-button").forEach(button => button.addEventListener("click", () => resetDiagnosis(false)));
window.addEventListener("pageshow", () => {
  resetDiagnosis(false);
});
