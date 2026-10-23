/**
 * CHAYIL - Catalog Page Logic
 * Filters, sorting, dynamic rendering & quick-add
 */

document.addEventListener("DOMContentLoaded", () => {
  initCatalogFilters();
});

function initCatalogFilters() {
  const container = document.getElementById("catalogProductsGrid");
  const countDisplay = document.getElementById("catalogItemCount");
  const tabBtns = document.querySelectorAll(".catalog-tab-btn");
  const sizeBtns = document.querySelectorAll(".quick-size-btn");
  const sortSelect = document.getElementById("sortSelect");

  if (!container || typeof PRODUCTS_DATA === "undefined") return;

  // Determine current page filter (e.g. if we are on camisetas.html or gorras.html)
  const pageCategory = document.body.dataset.pageCategory || "all";
  let activeCategory = pageCategory !== "all" ? pageCategory : "all";
  let activeSubcategory = "all";
  let activeSize = "all";
  let activeGsm = "all";
  let currentSort = "popular";

  function filterAndRender() {
    let list = [...PRODUCTS_DATA];

    // Filter by main page category
    if (pageCategory !== "all") {
      list = list.filter(p => p.category === pageCategory);
    }

    // Filter by tab
    if (activeCategory !== "all" && pageCategory === "all") {
      list = list.filter(p => p.category === activeCategory);
    }

    // Filter by subcategory or badge
    if (activeSubcategory !== "all") {
      if (activeSubcategory === "ediciones-limitadas") {
        list = list.filter(p => p.badge && (p.badge.toLowerCase().includes("limitada") || p.badge.toLowerCase().includes("edición")));
      } else if (activeSubcategory === "heavyweight") {
        list = list.filter(p => p.subcategory === "heavyweight" || (p.gsm && p.gsm.includes("240")));
      } else if (activeSubcategory === "relaxed") {
        list = list.filter(p => p.subcategory === "relaxed" || (p.fit && p.fit.toLowerCase().includes("regular")) || (p.gsm && p.gsm.includes("180")));
      } else if (activeSubcategory === "oversized") {
        list = list.filter(p => p.subcategory === "oversized" || (p.fit && p.fit.toLowerCase().includes("caído")) || (p.fit && p.fit.toLowerCase().includes("boxy")));
      } else if (activeSubcategory === "clasico") {
        list = list.filter(p => p.subcategory === "clasico" || p.subcategory === "heavyweight");
      } else {
        list = list.filter(p => p.subcategory === activeSubcategory || (p.gsm && p.gsm.includes(activeSubcategory)));
      }
    }

    // Filter by size
    if (activeSize !== "all") {
      list = list.filter(p => p.sizes && p.sizes.includes(activeSize));
    }

    // Filter by GSM
    if (activeGsm !== "all") {
      list = list.filter(p => p.gsm && p.gsm.includes(activeGsm));
    }

    // Sort
    if (currentSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    // Update count display
    if (countDisplay) {
      const totalForCategory = pageCategory === "all" ? PRODUCTS_DATA.length : PRODUCTS_DATA.filter(p => p.category === pageCategory).length;
      countDisplay.textContent = `Mostrando ${list.length} de ${totalForCategory} piezas`;
    }

    // Render cards
    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <h3>No se encontraron piezas con los filtros seleccionados</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Prueba a restablecer los filtros para ver la colección completa.</p>
          <button type="button" class="btn-primary" style="margin-top: 20px;" onclick="window.location.reload()">Restablecer Filtros</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <article class="product-card" data-product-id="${item.id}">
        <div class="product-img-wrapper">
          <div class="card-badges">
            ${item.badge ? `<span class="card-badge ${item.badge === 'EDICIÓN LIMITADA' ? 'highlight' : ''}">${item.badge}</span>` : ''}
            ${item.gsm && item.gsm !== item.badge ? `<span class="card-badge">${item.gsm}</span>` : ''}
          </div>
          <button type="button" class="card-wishlist-btn" aria-label="Guardar en favoritos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <a href="producto.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </a>
        </div>
        <div class="product-card-meta">
          <div class="product-swatches">
            ${item.colors ? item.colors.map(c => `
              <span class="swatch-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
            `).join('') : ''}
          </div>
          <span class="product-price-tag">${formatPrice(item.price)}</span>
        </div>
        <h4 class="product-card-title">
          <a href="producto.html?id=${item.id}">${item.shortName || item.name}</a>
        </h4>
        <p class="product-card-spec">${item.specs || item.material}</p>
        <div class="card-quick-add">
          <button type="button" class="btn-outline btn-block" data-add-to-cart="${item.id}" data-size="${item.sizes[0] || 'M'}">
            + Añadir a la Bolsa
          </button>
        </div>
      </article>
    `).join('');
  }

  // Bind Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      if (filter === "all") {
        activeCategory = pageCategory !== "all" ? pageCategory : "all";
        activeSubcategory = "all";
      } else if (filter === "camisetas" || filter === "gorras" || filter === "accesorios") {
        activeCategory = filter;
        activeSubcategory = "all";
      } else {
        activeCategory = pageCategory !== "all" ? pageCategory : "all";
        activeSubcategory = filter;
      }
      filterAndRender();
    });
  });

  // Bind Quick Sizes
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        activeSize = "all";
      } else {
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeSize = btn.dataset.size;
      }
      filterAndRender();
    });
  });

  // Bind Sorting
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      filterAndRender();
    });
  }

  // Initial render
  filterAndRender();
}
