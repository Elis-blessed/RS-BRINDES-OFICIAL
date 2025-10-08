document.addEventListener('DOMContentLoaded', () => {
  // Ano no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

    // === Slider robusto (funciona com 2+ slides) ===
(function initSlider(){
  const slider = document.getElementById('slider');
  const dotsWrap = document.getElementById('slider-dots');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  if (!slides.length) return;

  // garante apenas um ativo
  slides.forEach(s => s.classList.remove('active'));
  slides[0].classList.add('active');

  let idx = 0, timer = null;

  function go(i){
    slides[idx].classList.remove('active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d,k)=>d.classList.toggle('active', k===idx));
    }
  }

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => { go(i); reset(); });
      dotsWrap.appendChild(b);
    });
  }

  function reset(){
    if (timer) clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 4000);
  }

  reset();
})();

  // Home: Produtos em destaque
  const featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    fetch('data/products.json?_v=10')
      .then(r => r.json())
      .then(items => {
        const featured = items.filter(p => p.featured === true);
        const toRender = featured.length ? featured : items.slice(0, 8);
        featuredGrid.innerHTML = toRender.map(p => cardHTML(p)).join('');
      })
      .catch(() => {
        featuredGrid.innerHTML = '<div class="card card-pad" style="grid-column:1/-1;text-align:center">Não foi possível carregar os destaques.</div>';
      });
  }

  // Catálogo
  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const category = document.getElementById('category');

  if (grid && search && category) {
    let state = { items: [], q:'', cat:'Todas' };

    fetch('data/products.json?_v=10')
      .then(r => r.json())
      .then(items => {
        state.items = items;
        buildCategories(items);
        const pre = new URLSearchParams(location.search).get('cat');
        if (pre) state.cat = pre;
        category.value = state.cat;
        apply();
      });

    search.addEventListener('input', () => { state.q = search.value.toLowerCase(); apply(); });
    category.addEventListener('change', () => { state.cat = category.value; apply(); });

    function buildCategories(items){
      const cats = Array.from(new Set(items.map(i => i.category))).sort();
      category.innerHTML = '';
      category.append(new Option('Todas','Todas'));
      cats.forEach(c => category.append(new Option(c,c)));
    }

    function apply(){
      const filtered = state.items.filter(p =>
        (state.cat === 'Todas' || p.category === state.cat) &&
        (state.q === '' || (p.name||'').toLowerCase().includes(state.q))
      );
      if (!filtered.length) {
        grid.innerHTML = '<div class="card card-pad" style="grid-column:1/-1;text-align:center">Nenhum item encontrado</div>';
        return;
      }
      grid.innerHTML = filtered.map(p => cardHTML(p)).join('');
    }
  }

  // Card template reutilizável
  function cardHTML(p){
    const safeImg = p.image || '';
    const safeName = p.name || 'Produto';
    const safeCat = p.category || '';
    return `
      <div class="card">
        <img class="product" src="${safeImg}" alt="${safeName}" onerror="this.style.display='none'"/>
        <div class="card-pad">
          <div class="title">${safeName}</div>
          <div class="cat">${safeCat}</div>
          <div style="margin-top:8px">
            <a class="btn btn-primary" href="orcamento.html">Solicitar Orçamento</a>
          </div>
        </div>
      </div>
    `;
  }
});
