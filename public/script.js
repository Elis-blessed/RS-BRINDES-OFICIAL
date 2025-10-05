document.addEventListener('DOMContentLoaded', () => {
  // Atualiza o ano no rodapé (se existir)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Monta os destaques na home se a seção existir
  const featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    fetch('data/products.json')
      .then(r => r.json())
      .then(items => {
        const featured = items.filter(p => p.featured === true);
        if (!featured.length) {
          featuredGrid.innerHTML = '<div class="card card-pad" style="grid-column:1/-1;text-align:center">Nenhum destaque cadastrado no momento.</div>';
          return;
        }
        featuredGrid.innerHTML = featured.map(p => `
          <a class="card" href="catalogo.html?cat=${encodeURIComponent(p.category)}" title="Ver ${p.name} no catálogo">
            <img class="product" src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"/>
            <div class="card-pad">
              <div class="title">${p.name}</div>
              <div class="cat">${p.category}</div>
              <div style="margin-top:8px">
                <span class="btn btn-primary">Ver no Catálogo</span>
              </div>
            </div>
          </a>
        `).join('');
      })
      .catch(() => {
        featuredGrid.innerHTML = '<div class="card card-pad" style="grid-column:1/-1;text-align:center">Não foi possível carregar os destaques.</div>';
      });
  }
});
