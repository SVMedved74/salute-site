// ===== НАСТРОЙКИ =====
const EMAIL = 'info@salute-ink.ru';

// Что показывать в подборе по бренду. Точные артикулы присылает менеджер.
const PICKER = [
  { test: /epson/i, brand: 'Epson', items: [
    ['Струйные картриджи', 'совместимые'],
    ['Чернила и заправочные наборы', 'для СНПЧ и ПЗК'],
    ['ПЗК и СНПЧ', 'для экономной печати'],
    ['Фотобумага', 'глянец, мат, сатин'],
    ['Сублимационные чернила', 'для печати на кружках и футболках'],
  ]},
  { test: /canon|pixma/i, brand: 'Canon', items: [
    ['Струйные картриджи', 'совместимые'],
    ['Чернила и заправочные наборы', 'для серий G и PIXMA'],
    ['Фотобумага', 'глянец, мат, сатин'],
  ]},
  { test: /laserjet|laser|лазер/i, brand: 'Лазерный принтер', items: [
    ['Лазерные картриджи', 'совместимые, для офиса'],
    ['Офисная бумага', 'A4, A3'],
  ]},
  { test: /\bhp\b|deskjet|officejet|smart tank/i, brand: 'HP', items: [
    ['Струйные картриджи', 'совместимые'],
    ['Чернила и заправочные наборы', ''],
    ['Фотобумага', 'глянец, мат'],
  ]},
  { test: /brother/i, brand: 'Brother', items: [
    ['Чернила', 'для серий DCP-T и MFC-T'],
    ['Лазерные картриджи', 'для лазерных моделей'],
    ['Фотобумага', ''],
  ]},
];

// ===== Подбор по модели принтера =====
const input = document.getElementById('pickerInput');
const result = document.getElementById('pickerResult');
const ask = document.getElementById('pickerAsk');

function renderPicker() {
  const q = input.value.trim();
  ask.dataset.topic = 'Подбор расходников';
  ask.dataset.model = q;
  if (q.length < 3) { result.innerHTML = ''; return; }
  const hit = PICKER.find(p => p.test.test(q));
  if (!hit) {
    result.innerHTML = '<p class="muted">Эту модель подберём вручную: нажмите «Спросить менеджера», и мы ответим, что к ней подходит.</p>';
    return;
  }
  const rows = hit.items.map(([name, note]) =>
    `<li><b>${name}</b><span>${note}</span></li>`).join('');
  result.innerHTML = `<p><b>Для ${escapeHtml(q)}</b> у нас есть:</p><ul>${rows}</ul>
    <p class="picker__hint">Точные артикулы и цены пришлёт менеджер. Нажмите «Спросить менеджера».</p>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

input.addEventListener('input', renderPicker);
document.querySelectorAll('[data-model]').forEach(b => b.addEventListener('click', () => {
  input.value = b.dataset.model;
  renderPicker();
}));

// ===== Кнопки с темой заявки подставляют её в форму =====
const topic = document.getElementById('topic');
let pickedModel = '';
document.querySelectorAll('[data-topic]').forEach(a => a.addEventListener('click', () => {
  topic.value = a.dataset.topic;
  pickedModel = a.dataset.model || '';
}));

// ===== Форма: пока без сервера — открывает письмо с заполненной заявкой =====
const form = document.getElementById('leadForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const lines = [
    `Имя: ${d.get('name')}`,
    `Телефон: ${d.get('phone')}`,
    `Интересует: ${d.get('topic')}`,
  ];
  if (pickedModel) lines.push(`Модель принтера: ${pickedModel}`);
  const subject = encodeURIComponent(`Заявка с сайта: ${d.get('topic')}`);
  const body = encodeURIComponent(lines.join('\n'));
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  form.classList.add('is-sent');
});
