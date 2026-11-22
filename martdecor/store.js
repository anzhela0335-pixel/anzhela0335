const shop = 'https://martdecor.online';
const salonEmail = 'salon@martdecor.ru';
const storageKey = 'martdecor-store-selection-v2';
const byId = id => document.getElementById(id);
const categoryById = new Map(categories.map(category => [category.id, category]));
const productById = new Map(products.map(product => [product.id, product]));
const format = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const image = product => `assets/texture-${product.image ?? categoryById.get(product.category).image}.webp`;
const categoryImage = category => `assets/texture-${category.image}.webp`;
const money = amount => `${format.format(amount)} ₽`;
const price = product => `от ${money(product.price)}${product.unit ? ' / ' + product.unit : ''}`;
const productUrl = product => `${shop}/product/${product.id}/`;
const compared = new Set();
const saved = new Map();
const controls = {
  query: byId('query'), category: byId('category'), brand: byId('brand'),
  maxPrice: byId('max-price'), sort: byId('sort')
};
const panel = byId('panel');
const panelBody = byId('panel-body');
const panelTitle = byId('panel-title');

function quantity(product, value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return product.unit === 'м²'
    ? Math.min(999, Math.max(.01, Math.round(number * 100) / 100))
    : Math.min(999, Math.max(1, Math.round(number)));
}

try {
  const previous = JSON.parse(localStorage.getItem(storageKey) || '{}');
  for (const [id, count] of Object.entries(previous || {})) {
    if (productById.has(id)) saved.set(id, quantity(productById.get(id), count));
  }
} catch {
  // The selection still works for this visit when storage is unavailable.
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(saved)));
  } catch {
    announce('Подборка доступна до закрытия этой страницы.');
  }
}

function announce(message) {
  byId('notifications').textContent = message;
}

function syncActions() {
  byId('saved-count').textContent = saved.size;
  byId('compare-count').textContent = compared.size;
  byId('compare-open').disabled = compared.size < 2;
  for (const button of document.querySelectorAll('[data-action="save"]')) {
    const pressed = saved.has(button.dataset.product);
    button.setAttribute('aria-pressed', pressed);
    button.textContent = pressed ? 'В подборке · убрать' : 'В подборку';
  }
  for (const button of document.querySelectorAll('[data-action="compare"]')) {
    const pressed = compared.has(button.dataset.product);
    button.setAttribute('aria-pressed', pressed);
    const atLimit = !pressed && compared.size >= 3;
    button.disabled = atLimit;
    button.textContent = pressed ? 'Убрать из сравнения' : atLimit ? 'Лимит сравнения' : 'К сравнению';
  }
}

function renderCatalog() {
  const search = controls.query.value.trim().toLowerCase().replaceAll('ё', 'е');
  const ceiling = controls.maxPrice.valueAsNumber;
  const visible = products.filter(product => {
    const kind = categoryById.get(product.category).name;
    const terms = [product.name, product.brand, product.code, kind, product.spec].join(' ').toLowerCase().replaceAll('ё', 'е');
    return (!controls.category.value || controls.category.value === product.category) &&
      (!controls.brand.value || controls.brand.value === product.brand) &&
      (!Number.isFinite(ceiling) || product.price <= ceiling) &&
      search.split(/\s+/).every(word => terms.includes(word));
  });
  const order = controls.sort.value;
  if (order === 'low') visible.sort((left, right) => left.price - right.price);
  if (order === 'high') visible.sort((left, right) => right.price - left.price);
  const fullCategory = byId('full-category');
  const currentCategory = categoryById.get(controls.category.value);
  fullCategory.href = currentCategory ? `${shop}/product-category/${currentCategory.catalog}/` : shop + '/shop/';
  fullCategory.textContent = currentCategory ? 'Все товары этой категории в магазине' : 'Весь каталог магазина';
  byId('result-count').textContent = `Найдено: ${visible.length} из ${products.length}`;
  byId('results').innerHTML = visible.length ? visible.map(product => {
    const kind = categoryById.get(product.category).name;
    return `<article class="product-card">
      <button class="product-photo" type="button" data-action="detail" data-product="${product.id}" aria-label="Открыть карточку ${product.name.replaceAll('"', '&quot;')}"><img src="${image(product)}" width="492" height="492" alt="" loading="lazy"></button>
      <div class="product-body">
        <p class="product-meta">${kind}${product.brand ? ' · ' + product.brand : ''}</p>
        <h3><button class="product-title" type="button" data-action="detail" data-product="${product.id}">${product.name}</button></h3>
        <p class="product-spec">${product.spec}</p>
        <p class="product-price">${price(product)}</p>
        <div class="product-actions"><button class="button secondary" type="button" data-action="save" data-product="${product.id}"></button>
        <button class="text-link" type="button" data-action="compare" data-product="${product.id}"></button></div>
      </div></article>`;
  }).join('') : '<div class="empty"><p>По этим условиям ничего не найдено.</p><button class="text-link" type="button" data-action="clear">Сбросить фильтры</button></div>';
  for (const button of byId('category-cards').children) {
    button.setAttribute('aria-pressed', button.dataset.category === controls.category.value);
  }
  syncActions();
}

function showPanel(title, html) {
  panelTitle.textContent = title;
  panelBody.innerHTML = html;
  panel.scrollTop = 0;
  if (!panel.open) panel.showModal();
  syncActions();
  panel.querySelector('.panel-close').focus();
}

function showProduct(product) {
  showPanel(product.name, `<div class="detail-layout">
    <figure class="detail-picture"><img src="${image(product)}" alt="" width="492" height="492"><figcaption>Иллюстрация категории. Точная фактура — в магазине.</figcaption></figure>
    <div class="detail-copy"><p class="product-meta">${categoryById.get(product.category).name}${product.brand ? ' · ' + product.brand : ''}</p>
    <p>${product.description}</p><p><strong>Характеристики.</strong> ${product.spec}</p>
    ${product.code ? `<p>Артикул: ${product.code}</p>` : ''}
    <p class="product-price">${price(product)}</p>
    <p class="hint">Цену, наличие и условия доставки уточняйте в магазине.</p>
    <a class="button primary" href="${productUrl(product)}">Открыть в магазине</a>
    <button class="button secondary" type="button" data-action="save" data-product="${product.id}"></button>
    <button class="text-link" type="button" data-action="compare" data-product="${product.id}"></button></div></div>`);
}

function showComparison() {
  const entries = [...compared].map(id => productById.get(id));
  if (entries.length < 2) return;
  const rows = [
    ['Категория', product => categoryById.get(product.category).name],
    ['Бренд', product => product.brand || 'Уточнить'],
    ['Характеристики', product => product.spec],
    ['Цена «от»', product => price(product)],
    ['Карточка', product => `<a class="text-link" href="${productUrl(product)}">В магазине</a>`]
  ];
  showPanel('Сравнение материалов', `<div class="table-wrap" tabindex="0" aria-label="Таблица сравнения"><table class="compare-table">
    <thead><tr><th scope="col">Параметр</th>${entries.map(product => `<th scope="col">${product.name}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(([title, value]) => `<tr><th scope="row">${title}</th>${entries.map(product => `<td>${value(product)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div><p class="hint">Сравнивайте цены с учётом единиц продажи. Итоговую стоимость подтвердит салон.</p>`);
}

function updateTotal() {
  const total = byId('saved-total');
  if (!total) return;
  let amount = 0;
  let excluded = 0;
  for (const [id, count] of saved) {
    const product = productById.get(id);
    if (product.unit) amount += product.price * count;
    else excluded++;
  }
  total.textContent = amount ? `Ориентир от ${money(amount)}` : 'Стоимость уточнит салон';
  byId('total-note').textContent = excluded
    ? `Позиции с неуточнённой единицей цены в расчёт не вошли (${excluded}). Доставка считается отдельно.`
    : 'Расчёт по опубликованным ценам «от», без стоимости доставки.';
}

function showSelection() {
  if (!saved.size) {
    showPanel('Моя подборка', '<p>Добавьте материалы из каталога, чтобы обсудить их с салоном.</p><div class="actions"><a class="button primary" data-action="to-catalog" href="#catalog">Перейти в каталог</a></div>');
    return;
  }
  const rows = [...saved].map(([id, count]) => {
    const product = productById.get(id);
    const step = product.unit === 'м²' ? '.01' : '1';
    return `<div class="saved-row"><div><button class="text-link" type="button" data-action="detail" data-product="${id}">${product.name}</button><p>${price(product)}</p></div>
      <div class="saved-controls"><label>Кол-во ${product.unit ? '(' + product.unit + ')' : '(поз.)'}<input type="number" min="${step}" max="999" step="${step}" value="${count}" data-quantity="${id}"></label>
      <button class="text-link" type="button" data-action="remove" data-product="${id}">Убрать</button></div></div>`;
  }).join('');
  showPanel('Моя подборка', `<div class="saved-list">${rows}</div><p id="saved-total" class="saved-total" aria-live="polite"></p><p class="hint" id="total-note"></p><div class="actions"><a class="button primary" data-action="to-project" href="#project">Обсудить с салоном</a><a class="button secondary" data-action="to-catalog" href="#catalog">Вернуться в каталог</a></div>`);
  updateTotal();
}

function showDraft(data) {
  const items = [...saved].map(([id, count]) => {
    const product = productById.get(id);
    const unit = { рулон: 'рул.', упаковка: 'уп.', 'м²': 'м²' }[product.unit] || 'поз. (единицу уточнить)';
    return `• ${product.name} — ${format.format(count)} ${unit}\n  ${productUrl(product)}`;
  });
  const lines = [
    'Здравствуйте! Помогите, пожалуйста, подобрать материалы для стен.',
    `Помещение: ${data.get('room')}`,
    data.get('area') ? `Площадь стен: ${data.get('area')} м²` : '',
    data.get('budget') ? `Бюджет на отделку: ${data.get('budget')} ₽` : '',
    data.get('notes').trim() ? `Пожелания: ${data.get('notes').trim()}` : '',
    items.length ? '\nМоя подборка:\n' + items.join('\n') : '',
    '\nПрошу уточнить наличие, количество и стоимость материалов.'
  ].filter(Boolean).join('\n');
  const subject = encodeURIComponent('Подбор материалов для стен');
  showPanel('Черновик письма', `<div class="form-draft">
    <p>Проверьте текст. В почте можно приложить фото или дизайн-проект.</p>
    <label>Текст письма<textarea id="draft-text" rows="8" readonly></textarea></label>
    <div class="actions"><a class="button primary" href="mailto:${salonEmail}?subject=${subject}&amp;body=${encodeURIComponent(lines)}">Открыть в почте</a>
    <button class="button secondary" type="button" data-action="copy">Скопировать текст</button></div>
    <p class="hint" id="copy-status" role="status">Письмо ещё не отправлено.</p></div>`);
  byId('draft-text').value = lines;
}

function resetFilters() {
  for (const control of Object.values(controls)) control.value = '';
  renderCatalog();
}

byId('category-cards').innerHTML = categories.map(category =>
  `<button class="category-card" type="button" data-category="${category.id}" aria-pressed="false"><img src="${categoryImage(category)}" width="492" height="492" alt=""><span class="category-name">${category.name}</span></button>`
).join('');
for (const category of categories) controls.category.add(new Option(category.name, category.id));
const brands = [...new Set(products.map(product => product.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
for (const brand of brands) controls.brand.add(new Option(brand, brand));
for (const control of Object.values(controls)) control.addEventListener('input', renderCatalog);
byId('filter-form').addEventListener('submit', event => event.preventDefault());
byId('filter-form').addEventListener('reset', event => {
  event.preventDefault();
  resetFilters();
});
byId('category-cards').addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  resetFilters();
  controls.category.value = button.dataset.category;
  renderCatalog();
  byId('catalog').scrollIntoView();
});
byId('open-list').addEventListener('click', showSelection);
byId('compare-open').addEventListener('click', showComparison);
byId('project-form').addEventListener('submit', event => {
  event.preventDefault();
  showDraft(new FormData(event.currentTarget));
});
panel.querySelector('.panel-close').addEventListener('click', () => panel.close());
panelBody.addEventListener('change', event => {
  const id = event.target.dataset.quantity;
  if (!saved.has(id)) return;
  const count = quantity(productById.get(id), event.target.value);
  event.target.value = count;
  saved.set(id, count);
  persist();
  updateTotal();
});

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.product;
  if (action === 'clear') {
    resetFilters();
    controls.query.focus();
  } else if (action === 'detail') {
    showProduct(productById.get(id));
  } else if (action === 'save') {
    if (saved.has(id)) {
      saved.delete(id);
      announce('Материал удалён из подборки.');
    } else {
      saved.set(id, 1);
      announce('Материал добавлен в подборку.');
    }
    persist();
    syncActions();
  } else if (action === 'compare') {
    if (compared.has(id)) compared.delete(id);
    else if (compared.size < 3) compared.add(id);
    syncActions();
  } else if (action === 'remove') {
    saved.delete(id);
    persist();
    showSelection();
  } else if (action === 'to-project' || action === 'to-catalog') {
    panel.close();
  } else if (action === 'copy') {
    const draft = byId('draft-text');
    try {
      await navigator.clipboard.writeText(draft.value);
      byId('copy-status').textContent = 'Текст скопирован.';
    } catch {
      draft.select();
      byId('copy-status').textContent = 'Текст выделен для копирования.';
    }
  }
});

renderCatalog();
