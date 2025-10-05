const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Carregar produtos para home e catálogo
fetch('dados/products.json')
  .then(r => r.json())
  .then(items => {
    const grid = document.getElementById('grid');
    if (grid) {
      grid.innerHTML = items.map(p => `
        <div class="card">
          <img class="product" src="${p.image}" alt="${p.name}">
          <div class="card-pad">
            <div class="title">${p.name}</div>
            <div class="cat">${p.category}</div>
            <a class="btn btn-primary" href="contato.html">Solicitar Orçamento</a>
          </div>
        </div>
      `).join('');
    }
  });
