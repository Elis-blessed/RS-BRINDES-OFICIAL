document.addEventListener('DOMContentLoaded', () => {
  // Ano no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Slider simples (usa public/img/destaque/slide1.jpg, slide2.jpg, slide3.jpg)
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('slider-dots');
  if (slides.length && dotsWrap) {
    slides.forEach((_,i)=>{
      const b = document.createElement('button');
      if (i===0) b.classList.add('active');
      b.addEventListener('click', ()=> go(i));
      dotsWrap.appendChild(b);
    });
    let idx = 0;
    function go(i){
      slides[idx].classList.remove('active');
      dotsWrap.children[idx].classList.remove('active');
      idx = i;
      slides[idx].classList.add('active');
      dotsWrap.children[idx].classList.add('active');
    }
    setInterval(()=> go((idx+1)%slides.length), 4000);
  }

  // Monta os destaques na Home (featured:true em data/products.json)
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
      .catch(err => {
        console.error('Erro ao carregar destaques:', err);
        featuredGrid.innerHTML = '<div class="card card-pad" style="grid-column:1/-1;text-align:center">Não foi possível carregar os destaques.</div>';
      });
  }
});
