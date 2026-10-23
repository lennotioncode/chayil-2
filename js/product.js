/**
 * CHAYIL - Product Detail Page Logic
 * Dynamic data binding, gallery thumbnails, color/size picker, dynamic bundle look add, accordions
 */

document.addEventListener("DOMContentLoaded", () => {
  initProductDetailPage();
});

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "cam-heavyweight-arena";
  const product = getProductById(productId);

  if (!product) return;

  // Selected state
  let selectedSize = product.sizes ? product.sizes[1] || product.sizes[0] || "M" : "M";
  let selectedColor = product.colors && product.colors[0] ? product.colors[0].name : "Arena Crudo";

  // Bind DOM elements
  const titleEl = document.getElementById("productTitle");
  const priceEl = document.getElementById("productPrice");
  const descEl = document.getElementById("productDesc");
  const gsmEl = document.getElementById("productGsmBadge");
  const gotsEl = document.getElementById("productGotsBadge");
  const breadcrumbCategory = document.getElementById("breadcrumbCategoryLink");
  const breadcrumbName = document.getElementById("breadcrumbProductName");
  const mainImageEl = document.getElementById("productMainImage");
  const thumbsContainer = document.getElementById("productThumbsContainer");
  const colorSwatchesContainer = document.getElementById("colorSwatchesContainer");
  const colorLabelEl = document.getElementById("selectedColorLabel");
  const sizesContainer = document.getElementById("sizesContainer");
  const btnAddToCart = document.getElementById("btnAddToCart");
  const btnQuickBuy = document.getElementById("btnQuickBuy");
  const crossSellAddBtn = document.getElementById("btnAddCompleteLook");
  const featuresStripEl = document.getElementById("galleryFeaturesStrip");

  // Populate data
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = formatPrice(product.price);
  if (descEl) descEl.textContent = product.description;
  if (gsmEl) gsmEl.textContent = `GRAMAJE ${product.gsm || '240 GSM'}`;
  if (breadcrumbName) breadcrumbName.textContent = product.shortName || product.name;
  
  // Breadcrumb Category Link
  if (breadcrumbCategory) {
    if (product.category === "gorras") {
      breadcrumbCategory.href = "gorras.html";
      breadcrumbCategory.textContent = "GORRAS";
    } else if (product.category === "camisetas") {
      breadcrumbCategory.href = "camisetas.html";
      breadcrumbCategory.textContent = "CAMISETAS";
    } else {
      breadcrumbCategory.href = "coleccion.html";
      breadcrumbCategory.textContent = "COLECCIÓN";
    }
  }

  // GOTS / Material floating badge
  if (gotsEl) {
    if (product.category === "gorras") {
      gotsEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> 100% SARGA DE ALGODÓN LAVADO`;
    } else {
      gotsEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> ALGODÓN 100% ORGÁNICO GOTS`;
    }
  }

  if (mainImageEl) {
    mainImageEl.src = product.gallery && product.gallery[0] ? product.gallery[0] : product.image;
    mainImageEl.alt = product.name;
  }

  // Gallery Features Strip Dynamic
  if (featuresStripEl) {
    if (product.category === "gorras") {
      featuresStripEl.innerHTML = `
        <div class="g-feature-item">
          <span class="g-feature-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg></span>
          <span class="g-feature-title">Lona 280 GSM</span>
          <span class="g-feature-desc">Lavado a la piedra suave</span>
        </div>
        <div class="g-feature-item">
          <span class="g-feature-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3"></circle></svg></span>
          <span class="g-feature-title">Hebilla de Latón</span>
          <span class="g-feature-desc">Ajuste metálico bruñido</span>
        </div>
        <div class="g-feature-item">
          <span class="g-feature-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 22h20L12 2z"></path></svg></span>
          <span class="g-feature-title">6 Paneles Clásicos</span>
          <span class="g-feature-desc">Curvatura natural orgánica</span>
        </div>
      `;
    } else {
      featuresStripEl.innerHTML = `
        <div class="g-feature-item">
          <span class="g-feature-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></span>
          <span class="g-feature-title">Tacto Denso</span>
          <span class="g-feature-desc">${product.gsm || '240 g/m²'} no traslúcido</span>
        </div>
        <div class="g-feature-item">
          <span class="g-feature-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg></span>
          <span class="g-feature-title">Tintado Mineral</span>
          <span class="g-feature-desc">Sin fijadores químicos nocivos</span>
        </div>
        <div class="g-feature-item">
          <span class="g-feature-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></span>
          <span class="g-feature-title">${product.fit || 'Corte Regular Boxy'}</span>
          <span class="g-feature-desc">Caída arquitectónica</span>
        </div>
      `;
    }
  }

  // Gallery Thumbs
  if (thumbsContainer) {
    const galleryImgs = product.gallery || [product.image];
    thumbsContainer.innerHTML = galleryImgs.map((imgSrc, idx) => `
      <button type="button" class="thumb-btn ${idx === 0 ? 'active' : ''}" data-img-src="${imgSrc}">
        <img src="${imgSrc}" alt="Vista ${idx + 1}">
      </button>
    `).join('');

    thumbsContainer.querySelectorAll(".thumb-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        thumbsContainer.querySelectorAll(".thumb-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (mainImageEl) {
          mainImageEl.src = btn.dataset.imgSrc;
        }
      });
    });
  }

  // Color Swatches
  if (colorSwatchesContainer && product.colors) {
    colorSwatchesContainer.innerHTML = product.colors.map((c, idx) => `
      <button type="button" class="color-option-btn ${idx === 0 ? 'active' : ''}" style="background-color: ${c.hex};" data-color-name="${c.name}" title="${c.name}">
      </button>
    `).join('');

    colorSwatchesContainer.querySelectorAll(".color-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        colorSwatchesContainer.querySelectorAll(".color-option-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedColor = btn.dataset.colorName;
        if (colorLabelEl) colorLabelEl.textContent = `COLOR: ${selectedColor.toUpperCase()}`;
      });
    });
  }

  // Sizes Grid
  if (sizesContainer && product.sizes) {
    sizesContainer.innerHTML = product.sizes.map(size => `
      <button type="button" class="size-option-btn ${size === selectedSize ? 'active' : ''}" data-size="${size}">
        ${size}
      </button>
    `).join('');

    sizesContainer.querySelectorAll(".size-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sizesContainer.querySelectorAll(".size-option-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.dataset.size;
        updateCtaButton();
      });
    });
  }

  function updateCtaButton() {
    if (btnAddToCart) {
      btnAddToCart.innerHTML = `Añadir a la Bolsa — ${formatPrice(product.price)}`;
    }
  }
  updateCtaButton();

  // Add to cart click
  if (btnAddToCart) {
    btnAddToCart.addEventListener("click", () => {
      if (window.chayilCart) {
        window.chayilCart.addItem(product, selectedSize, selectedColor, 1);
      }
    });
  }

  // Quick Buy (Apple Pay / Checkout Rápido)
  if (btnQuickBuy) {
    btnQuickBuy.addEventListener("click", () => {
      if (window.chayilCart) {
        window.chayilCart.addItem(product, selectedSize, selectedColor, 1);
        window.chayilCart.openCheckoutModal();
      }
    });
  }

  // Cross-sell Complete Look Dynamic Setup
  const crossSellProdId = product.category === "gorras" ? "cam-heavyweight-arena" : "gorra-duna-washed";
  const crossSellProduct = getProductById(crossSellProdId);
  
  const crossPhotoImg = document.querySelector(".cross-sell-photo img");
  const crossTagPrice = document.querySelector(".cross-sell-tag-row strong");
  const crossNameEl = document.querySelector(".cross-sell-name");
  const crossDescEl = document.querySelector(".cross-sell-desc");
  const crossBundleCopy = document.querySelector(".bundle-copy strong");

  if (crossSellProduct) {
    if (crossPhotoImg) crossPhotoImg.src = crossSellProduct.image;
    if (crossTagPrice) crossTagPrice.textContent = formatPrice(crossSellProduct.price);
    if (crossNameEl) crossNameEl.textContent = crossSellProduct.name;
    if (crossDescEl) crossDescEl.textContent = crossSellProduct.description;
    if (crossBundleCopy) {
      const combined = product.price + crossSellProduct.price;
      const discounted = combined - 5.00;
      crossBundleCopy.textContent = `Añade ambos productos: ${formatPrice(discounted)} en lugar de ${formatPrice(combined)}`;
    }
  }

  if (crossSellAddBtn && crossSellProduct) {
    crossSellAddBtn.innerHTML = "Añadir Look Completo";
    crossSellAddBtn.addEventListener("click", () => {
      if (window.chayilCart) {
        window.chayilCart.addItem(product, selectedSize, selectedColor, 1);
        window.chayilCart.addItem(crossSellProduct, crossSellProduct.sizes[0] || "M", crossSellProduct.colors[0]?.name || "Arena Crudo", 1);
        window.chayilCart.showToast("Look mediterráneo completo añadido a tu bolsa.");
      }
    });
  }

  // Accordions
  initAccordions();

  // Reviews modal
  const reviewBtn = document.getElementById("btnWriteReview");
  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      if (window.chayilUI) {
        window.chayilUI.openReviewModal();
      }
    });
  }
}

function initAccordions() {
  const headers = document.querySelectorAll(".accordion-header");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      if (item) {
        item.classList.toggle("open");
      }
    });
  });
}

