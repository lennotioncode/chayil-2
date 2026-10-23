/**
 * CHAYIL - Main Interaction Script
 * Mobile menu, search, newsletter, wishlist, global UI
 */

document.addEventListener("DOMContentLoaded", () => {
  ensureCartDrawerHtml();
  initMobileMenu();
  initSearch();
  initNewsletter();
  initWishlist();
  initHeaderScroll();
  initHomeFilters();
});

// Home Bestsellers Filter Tabs
function initHomeFilters() {
  const filterBtns = document.querySelectorAll("[data-home-filter]");
  const grid = document.getElementById("homeBestsellersGrid");
  if (!filterBtns.length || !grid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.homeFilter;
      const cards = grid.querySelectorAll(".product-card");
      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === "all" || cat === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const drawer = document.getElementById("mobileNavDrawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const overlay = document.getElementById("cartDrawerOverlay");
      drawer.classList.toggle("open");
      if (overlay) {
        overlay.classList.toggle("open");
      }
      document.body.classList.toggle("no-scroll");
    });

    const closeBtn = drawer.querySelector(".mobile-menu-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        const overlay = document.getElementById("cartDrawerOverlay");
        drawer.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    }

    // Close when clicking overlay backdrop
    document.addEventListener("click", (e) => {
      if (e.target.id === "cartDrawerOverlay" && drawer.classList.contains("open")) {
        drawer.classList.remove("open");
        e.target.classList.remove("open");
        document.body.classList.remove("no-scroll");
      }
    });
  }
}

// Quick Search Modal
function initSearch() {
  const searchTriggers = document.querySelectorAll(".header-search-btn");
  let modal = document.getElementById("quickSearchModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickSearchModal";
    modal.className = "chayil-modal-backdrop";
    modal.innerHTML = `
      <div class="chayil-modal-dialog" style="max-width: 600px;">
        <button class="modal-close-btn" onclick="document.getElementById('quickSearchModal').classList.remove('open'); document.body.classList.remove('no-scroll');">&times;</button>
        <span class="modal-badge-pill">BÚSQUEDA RÁPIDA</span>
        <h3 class="modal-title">¿Qué prenda estás buscando?</h3>
        <div class="search-input-box" style="margin: 20px 0;">
          <input type="text" id="searchInput" placeholder="Ej: Camiseta Heavyweight, Gorra Duna, 240 GSM..." style="width: 100%; padding: 14px 18px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 1rem; background: var(--bg-warm-tint);">
        </div>
        <div id="searchResultsList" class="search-results-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">Sugerencias habituales:</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="camisetas.html" class="pill-tag">Camisetas 240 GSM</a>
            <a href="gorras.html" class="pill-tag">Gorras Daily Canvas</a>
            <a href="producto.html" class="pill-tag">Heavyweight Arena</a>
            <a href="camisetas.html" class="pill-tag">Pack Trilogía</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  searchTriggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("open");
      document.body.classList.add("no-scroll");
      const input = document.getElementById("searchInput");
      if (input) {
        input.focus();
        input.addEventListener("input", handleLiveSearch);
      }
    });
  });
}

function handleLiveSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const resultsContainer = document.getElementById("searchResultsList");
  if (!resultsContainer || typeof PRODUCTS_DATA === "undefined") return;

  if (query.length < 2) {
    resultsContainer.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--text-muted);">Sugerencias habituales:</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="camisetas.html" class="pill-tag">Camisetas 240 GSM</a>
        <a href="gorras.html" class="pill-tag">Gorras Daily Canvas</a>
        <a href="producto.html" class="pill-tag">Heavyweight Arena</a>
        <a href="camisetas.html" class="pill-tag">Pack Trilogía</a>
      </div>
    `;
    return;
  }

  const matches = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.shortName.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    (p.gsm && p.gsm.toLowerCase().includes(query)) ||
    (p.fit && p.fit.toLowerCase().includes(query))
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); padding: 15px 0;">No se encontraron prendas para "${query}".</p>`;
  } else {
    resultsContainer.innerHTML = matches.map(m => `
      <a href="producto.html?id=${m.id}" style="display: flex; align-items: center; gap: 14px; padding: 10px; border-radius: 4px; background: var(--bg-warm); transition: background 0.2s;" onmouseover="this.style.background='#EAE5DE'" onmouseout="this.style.background='var(--bg-warm)'">
        <img src="${m.image}" alt="${m.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 2px;">
        <div style="flex: 1;">
          <div style="font-size: 0.85rem; font-weight: 600;">${m.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${m.gsm || m.specs}</div>
        </div>
        <strong style="font-size: 0.9rem;">${formatPrice(m.price)}</strong>
      </a>
    `).join("");
  }
}

// Newsletter submit handler
function initNewsletter() {
  const forms = document.querySelectorAll(".newsletter-form, #homeNewsletterForm, #footerNewsletterForm");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value.trim().includes("@")) {
        if (window.chayilCart) {
          window.chayilCart.showToast("Bienvenido a Chayil. Tu cupón del 10% (<strong>BIENVENIDA10</strong>) ha sido activado.");
        }
        input.value = "";
      } else {
        if (window.chayilCart) {
          window.chayilCart.showToast("Por favor, introduce un correo electrónico válido.");
        }
      }
    });
  });
}

// Wishlist interaction (for product cards)
function initWishlist() {
  document.addEventListener("click", (e) => {
    const wishBtn = e.target.closest(".card-wishlist-btn");
    if (wishBtn) {
      e.preventDefault();
      wishBtn.classList.toggle("active");
      const isSaved = wishBtn.classList.contains("active");
      const heart = wishBtn.querySelector("svg");
      if (heart) {
        heart.setAttribute("fill", isSaved ? "var(--accent-terracotta)" : "none");
        heart.style.stroke = isSaved ? "var(--accent-terracotta)" : "currentColor";
      }
      if (window.chayilCart) {
        window.chayilCart.showToast(isSaved ? "Guardado en tu lista de deseos" : "Eliminado de tu lista de deseos");
      }
    }
  });
}

// Sticky header styling on scroll
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
    } else {
      header.style.boxShadow = "none";
    }
  });
}

// Ensure the standard Cart Drawer HTML structure exists in DOM
function ensureCartDrawerHtml() {
  if (document.getElementById("cartDrawer")) return;

  const drawerContainer = document.createElement("div");
  drawerContainer.innerHTML = `
    <div id="cartDrawerOverlay" class="cart-drawer-overlay close-cart-drawer"></div>
    <aside id="cartDrawer" class="cart-drawer" aria-label="Bolsa de compra lateral">
      <div class="cart-drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-subtitle">Cesta Consciente</span>
          <h3>Tu Bolsa de Compra</h3>
        </div>
        <button type="button" class="cart-drawer-close close-cart-drawer" aria-label="Cerrar bolsa">&times;</button>
      </div>
      <div id="cartDrawerFreeShipping" class="cart-drawer-shipping"></div>
      <div id="cartDrawerBody" class="cart-drawer-body"></div>
      <div id="cartDrawerFooter" class="cart-drawer-footer"></div>
    </aside>
  `;
  document.body.appendChild(drawerContainer);
}

// ==========================================================================
// Chayil UI Modal & Dialog System (Replaces clunky browser alerts & prompts)
// ==========================================================================
window.chayilUI = {
  openModal(title, badge, contentHtml) {
    let modal = document.getElementById("chayilDynamicModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "chayilDynamicModal";
      modal.className = "chayil-modal-backdrop";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="chayil-modal-dialog">
        <button class="modal-close-btn" onclick="window.chayilUI.closeModal()">&times;</button>
        ${badge ? `<span class="modal-badge-pill">${badge}</span>` : ''}
        <h3 class="modal-title">${title}</h3>
        <div class="modal-body-content" style="margin-top: 16px;">
          ${contentHtml}
        </div>
      </div>
    `;

    modal.classList.add("open");
    document.body.classList.add("no-scroll");

    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) {
        window.chayilUI.closeModal();
      }
    };
  },

  closeModal() {
    const modal = document.getElementById("chayilDynamicModal");
    if (modal) {
      modal.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  },

  openSizeGuide() {
    const html = `
      <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.55;">
        Nuestras prendas están patronadas con silueta relaxed y corte boxy contemporáneo. Si buscas una caída sutilmente estructurada y holgada, elige tu talla habitual.
      </p>

      <div class="size-guide-table-wrap">
        <table class="size-guide-table">
          <thead>
            <tr>
              <th>Talla</th>
              <th>Pecho (cm)</th>
              <th>Largo (cm)</th>
              <th>Hombro (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>S</strong></td>
              <td>92 - 96</td>
              <td>71</td>
              <td>49</td>
            </tr>
            <tr>
              <td><strong>M</strong></td>
              <td>98 - 104</td>
              <td>73</td>
              <td>51</td>
            </tr>
            <tr>
              <td><strong>L</strong></td>
              <td>106 - 112</td>
              <td>75</td>
              <td>53</td>
            </tr>
            <tr>
              <td><strong>XL</strong></td>
              <td>114 - 120</td>
              <td>77</td>
              <td>55</td>
            </tr>
            <tr>
              <td><strong>XXL</strong></td>
              <td>122 - 128</td>
              <td>79</td>
              <td>57</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="size-guide-tip">
        <strong>Gorras Daily Canvas:</strong> Talla única anatómica (54 - 61 cm) regulable con hebilla deslizante de latón macizo.
      </div>

      <div style="margin-top: 24px; text-align: right;">
        <button type="button" class="btn btn-primary" onclick="window.chayilUI.closeModal()">Entendido</button>
      </div>
    `;
    this.openModal("Guía de Tallas & Ajuste", "ANATOMÍA TEXTIL", html);
  },

  openFitAssistant() {
    const html = `
      <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.55;">
        En Chayil diseñamos la prenda para que respete el movimiento natural sin ceñir en hombros ni cadera:
      </p>

      <div class="care-guide-list">
        <div class="care-guide-item">
          <div>
            <strong>Corte Boxy / Caída Arquitectónica (Recomendado)</strong>
            <p>Mantén tu talla habitual. La caída del hombro está calculada con 2.5 cm adicionales y un cuello 1x1 que enmarca el pecho sin perder compostura.</p>
          </div>
        </div>
        <div class="care-guide-item">
          <div>
            <strong>Corte Satorial / Ajustado</strong>
            <p>Si prefieres llevar la prenda como primera capa interior bajo sobrecamisas o blazers estructurados, selecciona una talla menos de la habitual.</p>
          </div>
        </div>
      </div>

      <div style="margin-top: 24px; text-align: right;">
        <button type="button" class="btn btn-primary" onclick="window.chayilUI.closeModal()">Cerrar Asistente</button>
      </div>
    `;
    this.openModal("Asistente de Ajuste Chayil", "FIT & SILUETA", html);
  },

  openCareGuide() {
    const html = `
      <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.55;">
        Confeccionamos cada pieza con materias primas nobles. Sigue estos pasos para preservar la textura y el tinte mineral durante años:
      </p>

      <div class="care-guide-list">
        <div class="care-guide-item">
          <div>
            <strong>Lavado en frío a 30°C</strong>
            <p>Utiliza detergente neutro y programas suaves con colores similares para proteger la fibra vegetal de algodón orgánico.</p>
          </div>
        </div>
        <div class="care-guide-item">
          <div>
            <strong>Secado al aire en plano</strong>
            <p>Evita por completo la secadora. Tiende las prendas en horizontal a la sombra para proteger el tintado botánico y evitar marcas de pinzas.</p>
          </div>
        </div>
        <div class="care-guide-item">
          <div>
            <strong>Gorras de Lona & Visera</strong>
            <p>Limpiar con un paño húmedo templado en las zonas de fricción. Nunca sumergir por completo en lavadora para no debilitar el núcleo de visera.</p>
          </div>
        </div>
      </div>

      <div style="margin-top: 24px; text-align: right;">
        <button type="button" class="btn btn-primary" onclick="window.chayilUI.closeModal()">Entendido</button>
      </div>
    `;
    this.openModal("Guía Completa de Cuidados", "LONGEVIDAD TEXTIL", html);
  },

  openAppointmentModal() {
    const html = `
      <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.55;">
        Abrimos las puertas de nuestro showroom y taller en el centro histórico de Colombia para citas personalizadas de prueba y asesoría de patronaje.
      </p>

      <div class="appointment-details">
        <div class="appointment-details-row">
          <span>Ubicación</span>
          <strong>Carrer del Mar, 14, Ciutat Vella, Colombia</strong>
        </div>
        <div class="appointment-details-row">
          <span>Horario de Citas</span>
          <strong>Lunes a Sábado: 11:00h - 19:30h</strong>
        </div>
        <div class="appointment-details-row">
          <span>Servicio Incluido</span>
          <strong>Prueba completa de cápsula & café de especialidad</strong>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; flex-wrap: wrap;">
        <button type="button" class="btn btn-outline" onclick="window.chayilUI.closeModal()">Volver</button>
        <a href="https://wa.me/34611223344?text=Hola%20Chayil%2C%20quisiera%20reservar%20una%20cita%20privada%20en%20vuestro%20showroom%20de%20Valencia." target="_blank" rel="noopener" class="btn btn-primary">
          Confirmar por WhatsApp Directo
        </a>
      </div>
    `;
    this.openModal("Reserva de Cita Privada", "SHOWROOM COLOMBIA", html);
  },

  openChatSupport() {
    const url = "https://wa.me/34611223344?text=" + encodeURIComponent("Hola Chayil Studio, tengo una consulta sobre tallas y tejidos de la colección.");
    window.open(url, "_blank");
  },

  openReviewModal() {
    const html = `
      <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.55;">
        Tu experiencia ayuda a mantener la transparencia de nuestra artesanía y patronaje.
      </p>
      <form id="reviewSubmissionForm" onsubmit="event.preventDefault(); window.chayilUI.submitReview();" style="margin-top: 16px;">
        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Tu Nombre o Inicial</label>
          <input type="text" id="reviewAuthorName" placeholder="Ej: Marc R." required style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.9rem; background: var(--bg-warm-tint);">
        </div>
        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Valoración</label>
          <select id="reviewRatingScore" style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.9rem; background: var(--bg-warm-tint);">
            <option value="5">5 estrellas — Excepcional calidad y caída</option>
            <option value="4">4 estrellas — Muy buena prenda</option>
            <option value="3">3 estrellas — Correcto</option>
          </select>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Comentario</label>
          <textarea id="reviewCommentText" rows="3" placeholder="Comenta el tacto del tejido, la talla y la densidad..." required style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.9rem; background: var(--bg-warm-tint); resize: vertical;"></textarea>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" class="btn btn-outline" onclick="window.chayilUI.closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">Publicar Valoración</button>
        </div>
      </form>
    `;
    this.openModal("Escribir una Valoración", "COMUNIDAD CHAYIL", html);
  },

  submitReview() {
    const author = document.getElementById("reviewAuthorName")?.value || "Cliente";
    this.closeModal();
    if (window.chayilCart) {
      window.chayilCart.showToast(`Gracias, <strong>${author}</strong>. Tu valoración ha sido enviada para moderación.`);
    }
  }
};

