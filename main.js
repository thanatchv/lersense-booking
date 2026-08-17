/* ============ Utility ============ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ============ Countdown (hero promo) ============ */
(function countdown(){
  const el = $('#countdown');
  if (!el) return;
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  function tick(){
    const diff = Math.max(0, end - new Date());
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ============ Animated stat counters ============ */
(function statCounters(){
  const stats = $$('.stat-num[data-target]');
  if (!stats.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      let cur = 0;
      const steps = 40;
      const inc = target / steps;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = cur.toFixed(decimals) + suffix;
      }, 25);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  stats.forEach(s => io.observe(s));
})();

/* ============ Generic tabs (pay tabs / auth tabs) ============ */
function initTabs(tabSelector, panelSelector){
  const tabs = $$(tabSelector);
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$(panelSelector).forEach(p => p.classList.remove('active'));
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}
initTabs('.pay-tab', '.pay-panel');
initTabs('.auth-tab', '.auth-panel');

/* ============ Package selection ============ */
const packageGrid = $('#packageGrid');
if (packageGrid){
  packageGrid.addEventListener('click', (e) => {
    const pkg = e.target.closest('.pkg');
    if (!pkg) return;
    $$('.pkg', packageGrid).forEach(p => p.classList.remove('selected'));
    pkg.classList.add('selected');
    const amt = pkg.querySelector('.pkg-price').textContent;
    const summaryTotal = $('#summaryTotal');
    if (summaryTotal) summaryTotal.textContent = amt;
  });
}

/* ============ Games filter (index page) ============ */
const gamesToolbar = $('.games-toolbar');
if (gamesToolbar){
  gamesToolbar.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-filter');
    if (!chip) return;
    $$('.chip-filter', gamesToolbar).forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.cat;
    $$('.game-card[data-cat]').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
}

/* ============ Order form (demo only, no real payment) ============ */
const orderForm = $('#orderForm');
if (orderForm){
  const modalBackdrop = $('#modalBackdrop');
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedPkg = $('.pkg.selected', orderForm);
    if (!selectedPkg){
      alert('กรุณาเลือกแพ็กเกจก่อนดำเนินการต่อ (เดโม่)');
      return;
    }
    const activeTab = $('.pay-tab.active');
    const method = activeTab ? activeTab.textContent.trim() : 'ช่องทางชำระเงิน';
    $('#modalTitle').textContent = 'กำลังตรวจสอบการชำระเงิน...';
    $('#modalSub').textContent = `กำลังจำลองการชำระเงินผ่าน ${method} — นี่คือเดโม่ ไม่มีการตัดเงินจริง`;
    modalBackdrop.classList.add('open');
    setTimeout(() => {
      const game = $('#gameSelect').value || 'เกมของคุณ';
      const amount = selectedPkg.querySelector('.pkg-amt').textContent;
      const orderId = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      $('#modalTitle').textContent = 'ทำรายการสำเร็จ (จำลอง)';
      $('#modalSub').innerHTML = `${amount} สำหรับ <b>${game}</b> ถูกจำลองว่าส่งถึงบัญชีแล้ว<br><span class="mono" style="color:var(--accent);font-size:12px;">เลขที่คำสั่งซื้อ: ${orderId}</span>`;
    }, 1500);
  });
  $('#modalClose')?.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  modalBackdrop?.addEventListener('click', (e) => { if (e.target === modalBackdrop) modalBackdrop.classList.remove('open'); });
}

/* ============ Auth: KYC stepper ============ */
(function kycStepper(){
  const steps = $$('.kyc-step');
  if (!steps.length) return;
  const progress = $$('.kyc-progress span');
  let current = 0;

  function show(i){
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    progress.forEach((p, idx) => p.classList.toggle('done', idx <= i));
    current = i;
  }
  show(0);

  $$('[data-kyc-next]').forEach(btn => btn.addEventListener('click', () => {
    if (current < steps.length - 1) show(current + 1);
  }));
  $$('[data-kyc-back]').forEach(btn => btn.addEventListener('click', () => {
    if (current > 0) show(current - 1);
  }));
})();

/* ============ KYC file mock upload ============ */
$$('.kyc-upload input[type=file]').forEach(input => {
  input.addEventListener('change', () => {
    const wrap = input.closest('.kyc-upload');
    const nameEl = wrap.querySelector('.ku-name');
    if (input.files[0]) {
      nameEl.textContent = `✓ เลือกไฟล์แล้ว: ${input.files[0].name} (ไม่อัปโหลดจริง — เดโม่)`;
    }
  });
});

/* ============ Link game account modal (account.html) ============ */
const linkModal = $('#linkModal');
if (linkModal){
  $$('[data-link-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      $('#linkGameName').textContent = btn.dataset.linkGame;
      linkModal.classList.add('open');
    });
  });
  $('#linkModalClose')?.addEventListener('click', () => linkModal.classList.remove('open'));
  $('#linkConfirm')?.addEventListener('click', () => {
    linkModal.classList.remove('open');
    alert('เชื่อมบัญชี ' + $('#linkGameName').textContent + ' สำเร็จ (จำลอง)');
  });
  linkModal.addEventListener('click', (e) => { if (e.target === linkModal) linkModal.classList.remove('open'); });
}

/* ============ AI Chat widget (demo keyword-based, no real backend) ============ */
(function chatWidget(){
  const fab = $('#chatFab');
  const panel = $('#chatPanel');
  if (!fab || !panel) return;
  const body = $('#chatBody');
  const input = $('#chatInput');
  const form = $('#chatForm');

  const responses = [
    { keys: ['คืนเงิน', 'refund', 'เงินคืน'], reply: 'คำขอคืนเงินที่เข้าเงื่อนไข (เติมไม่สำเร็จ/ไอเทมไม่เข้าบัญชี) จะได้รับเงินคืนภายใน 15–60 นาที เข้าบัญชีเดิมที่ใช้ชำระ ดูรายละเอียดที่หน้านโยบายคืนเงินได้เลยครับ' },
    { keys: ['kyc', 'ยืนยันตัวตน', 'บัตรประชาชน'], reply: 'การยืนยันตัวตน (KYC) ใช้เพียงบัตรประชาชน + เซลฟี่ถือบัตร ใช้เวลาอนุมัติประมาณ 1–5 นาที เพื่อความปลอดภัยของบัญชีและการทำธุรกรรมของคุณครับ' },
    { keys: ['เชื่อมบัญชี', 'link', 'ผูกบัญชี'], reply: 'ไปที่เมนู "บัญชีของฉัน" แล้วกดเชื่อมบัญชีเกมที่ต้องการ กรอก Player ID/Zone ระบบจะตรวจสอบและผูกบัญชีให้อัตโนมัติครับ' },
    { keys: ['stripe', 'บัตรเครดิต', 'บัตรเดบิต'], reply: 'รองรับชำระผ่านบัตรเครดิต/เดบิตด้วยระบบ Stripe ซึ่งเข้ารหัสข้อมูลบัตรระดับสากล เราไม่มีการเก็บเลขบัตรไว้ในระบบของเราเองครับ' },
    { keys: ['truemoney', 'ทรูมันนี่', 'วอลเล็ท'], reply: 'รองรับ TrueMoney Wallet สแกน QR หรือกรอกเบอร์ที่ผูกกับวอลเล็ท ยืนยัน OTP แล้วรายการจะเข้าอัตโนมัติครับ' },
    { keys: ['นาน', 'กี่นาที', 'เร็ว', 'ระยะเวลา'], reply: 'โดยเฉลี่ยไอเทมจะเข้าบัญชีภายใน 30 วินาที หลังชำระเงินสำเร็จ และไม่เกิน 5 นาทีในกรณีระบบตรวจสอบเพิ่มเติมครับ' },
    { keys: ['เกม', 'รองรับเกมอะไร'], reply: 'รองรับกว่า 200 เกมยอดนิยมในไทย เช่น Free Fire, RoV, PUBG Mobile, Valorant, Genshin Impact, Mobile Legends และอื่นๆ ดูรายชื่อทั้งหมดที่หน้าแรกได้เลยครับ' }
  ];

  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'user' ? 'msg-user' : 'msg-bot');
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function reply(text){
    const lower = text.toLowerCase();
    const match = responses.find(r => r.keys.some(k => lower.includes(k)));
    setTimeout(() => {
      addMsg(match ? match.reply : 'ขอบคุณสำหรับคำถามครับ ทีมงานหรือผู้ช่วย AI แบบเต็มรูปแบบจะพร้อมตอบในเวอร์ชันจริง ลองถามเกี่ยวกับ "คืนเงิน" "KYC" "เชื่อมบัญชี" หรือ "ช่องทางชำระเงิน" ดูได้ครับ', 'bot');
    }, 500);
  }

  fab.addEventListener('click', () => panel.classList.toggle('open'));
  $('#chatClose')?.addEventListener('click', () => panel.classList.remove('open'));

  $$('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      addMsg(chip.textContent, 'user');
      reply(chip.textContent);
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    reply(val);
    input.value = '';
  });
})();
