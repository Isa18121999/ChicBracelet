// ---- Data (images per collection) ----
const DATA = {
  blue: [
    {src: 'images/blue1.png', name: 'Blue Charm 1'},
    {src: 'images/blue2.png', name: 'Blue Charm 2'},
    {src: 'images/blue3.png', name: 'Blue Charm 3'},
  ],
  green: [
    {src: 'images/green1.png', name: 'Green Spirit 1'},
    {src: 'images/green2.png', name: 'Green Spirit 2'},
  ],
  yellow: [
    {src: 'images/yellow1.png', name: 'Yellow Joy 1'},
    {src: 'images/yellow2.png', name: 'Yellow Joy 2'},
    {src: 'images/yellow3.png', name: 'Yellow Joy 3'},
  ],
  red: [
    {src: 'images/red1.png', name: 'Passion Flame 1'},
    {src: 'images/red2.png', name: 'Passion Flame 2'},
    {src: 'images/red3.png', name: 'Passion Flame 3'},
  ],
};

// Initial items shown for each collection
const INITIAL_COUNT = 6; // show up to 6, then reveal more when available

// ---- Helpers ----
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function createCard(item){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.src}" alt="${item.name}" loading="lazy">
    <div class="meta"><strong>${item.name}</strong></div>
  `;
  return card;
}

function renderGrid(key){
  const grid = $(`#grid-${key}`);
  grid.innerHTML = '';
  const items = DATA[key] || [];
  
  const count = Math.min(items.length, INITIAL_COUNT);
  for (let i=0; i<count; i++){
    grid.appendChild(createCard(items[i]));
  }
  // set button state
  const btn = document.querySelector(`.ver-mas[data-more="${key}"]`);
  if (items.length > count){
    btn.disabled = false;
    btn.dataset.nextIndex = count;
  } else {
    btn.disabled = true;
    btn.dataset.nextIndex = items.length;
  }
}

function revealMore(key){
  const grid = $(`#grid-${key}`);
  const items = DATA[key] || [];
  const btn = document.querySelector(`.ver-mas[data-more="${key}"]`);
  let idx = parseInt(btn.dataset.nextIndex || INITIAL_COUNT, 10);
  const step = 4; // add 4 more items each click
  const end = Math.min(items.length, idx + step);
  for (let i=idx; i<end; i++){
    grid.appendChild(createCard(items[i]));
  }
  btn.dataset.nextIndex = end;
  if (end >= items.length){
    btn.disabled = true;
  }
}

// ---- Tabs behavior ----
function setActiveTab(key){
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab===key));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === `panel-${key}`));
  renderGrid(key);
}
// ✅ Esta función muestra el catálogo y oculta la portada
function showCatalog() {
  const hero = document.getElementById('hero');        // sección de bienvenida
  const catalog = document.getElementById('catalogo'); // sección del catálogo
  if (hero && catalog) {
    hero.classList.add('hidden');     // oculta la portada
    catalog.classList.remove('hidden'); // muestra el catálogo
  }
  setActiveTab('blue'); // muestra por defecto la colección Blue Charm
  window.scrollTo({ top: 0, behavior: 'smooth' }); // sube suavemente al inicio
}

// ✅ Esta parte se ejecuta cuando la página carga
window.addEventListener('DOMContentLoaded', () => {
  // Si alguien entra directamente con el enlace #catalogo, abre el catálogo
  if (location.hash === '#catalogo') {
    showCatalog();
  }

  // 🔸 Cuando haces clic en el botón, llama a showCatalog()
  const enter = document.getElementById('enterBtn');
  if (enter) {
    enter.addEventListener('click', () => {
      showCatalog(); // activa el cambio de vista
    });
  }
});


// ---- Init ----
window.addEventListener('DOMContentLoaded', () => {
  // hero -> enter
  $('#enterBtn').addEventListener('click', () => {
    $('#hero').classList.add('hidden');
    $('#catalogo').classList.remove('hidden');
    setActiveTab('blue'); // default
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // tabs
  $$('.tab').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  // ver más
  $$('.ver-mas').forEach(btn => {
    btn.addEventListener('click', () => revealMore(btn.dataset.more));
  });

  // preload first tab content (for SEO)
  renderGrid('blue');
});
