/**
 * CHAYIL - Sistema Central de Carrito de Compras & Notificaciones
 */

class ChayilCart {
  constructor() {
    this.storageKey = "chayil_cart_items";
    this.promoStorageKey = "chayil_cart_promo";
    this.wishlistStorageKey = "chayil_wishlist";
    this.freeShippingThreshold = 65.00;
    this.standardShippingCost = 4.50;
    this.lastRemovedItem = null;

    this.initCart();
    this.bindGlobalEvents();
    this.updateBadges();
  }

  // Inicializa el carrito; si es la primera visita, cargamos los 2 artículos del preview
  initCart() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      const initialItems = [
        {
          id: "cam-heavyweight-arena",
          name: "Camiseta Heavyweight Essential",
          subtitle: "100% ALGODÓN PEINADO",
          specs: "Gramaje: 240 GSM • Corte Recto Boxy",
          price: 38.00,
          color: "Arena Crudo",
          colorHex: "#E3DAC9",
          size: "M",
          qty: 1,
          image: "assets/images/cart_item_tee.jpg"
        },
        {
          id: "gorra-duna-washed",
          name: "Gorra Daily Canvas 'Duna Washed'",
          subtitle: "LONA DESLAVADA",
          specs: "Cierre regulable con hebilla de latón bruñido",
          price: 32.00,
          color: "Duna Washed",
          colorHex: "#C2AF94",
          size: "Única (Ajustable)",
          qty: 1,
          image: "assets/images/cart_item_cap.jpg"
        }
      ];
      this.saveItems(initialItems);
      // Aplicar cupón de bienvenida predeterminado como en el diseño
      if (!localStorage.getItem(this.promoStorageKey)) {
        localStorage.setItem(this.promoStorageKey, "BIENVENIDA10");
      }
    }
  }

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {
      return [];
    }
  }

  saveItems(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.updateBadges();
    window.dispatchEvent(new CustomEvent("chayil:cart-updated", { detail: { items } }));
  }

  getPromoCode() {
    return localStorage.getItem(this.promoStorageKey) || "";
  }

  setPromoCode(code) {
    if (code) {
      localStorage.setItem(this.promoStorageKey, code.trim().toUpperCase());
    } else {
      localStorage.removeItem(this.promoStorageKey);
    }
    window.dispatchEvent(new CustomEvent("chayil:cart-updated", { detail: { items: this.getItems() } }));
  }

  getTotalCount() {
    return this.getItems().reduce((acc, item) => acc + item.qty, 0);
  }

  getSubtotal() {
    return this.getItems().reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  getDiscount() {
    const code = this.getPromoCode();
    const subtotal = this.getSubtotal();
    if (code === "BIENVENIDA10" || code === "CHAYIL10") {
      return subtotal * 0.10;
    }
    if (code === "MEDITERRANEO" && subtotal > 40) {
      return 5.00;
    }
    return 0.00;
  }

  getShippingCost() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0.00;
    return subtotal >= this.freeShippingThreshold ? 0.00 : this.standardShippingCost;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0.00;
    const discount = this.getDiscount();
    const shipping = this.getShippingCost();
    return Math.max(0, subtotal - discount + shipping);
  }

  addItem(product, size = "M", color = null, qty = 1) {
    const items = this.getItems();
    const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Arena Crudo");
    const selectedHex = (product.colors && product.colors.find(c => c.name === selectedColor))
      ? product.colors.find(c => c.name === selectedColor).hex
      : "#E3DAC9";

    const existingIndex = items.findIndex(
      it => it.id === product.id && it.size === size && it.color === selectedColor
    );

    if (existingIndex > -1) {
      items[existingIndex].qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.shortName || product.name,
        subtitle: product.gsm || (product.category === "camisetas" ? "100% ALGODÓN PEINADO" : "LONA DESLAVADA"),
        specs: product.specs || `${product.gsm || '240 GSM'} • ${product.fit || 'Corte Boxy'}`,
        price: product.price,
        color: selectedColor,
        colorHex: selectedHex,
        size: size,
        qty: qty,
        image: product.image || "assets/images/prod_tee_arena.jpg"
      });
    }

    this.saveItems(items);
    this.showToast(`Añadido a tu bolsa: <strong>${product.shortName || product.name}</strong> (${size})`);
    this.openDrawer();
  }

  updateQty(index, newQty) {
    const items = this.getItems();
    if (items[index]) {
      if (newQty <= 0) {
        this.removeItem(index);
      } else {
        items[index].qty = newQty;
        this.saveItems(items);
      }
    }
  }

  removeItem(index) {
    const items = this.getItems();
    if (items[index]) {
      this.lastRemovedItem = { item: items[index], index };
      const removedName = items[index].name;
      items.splice(index, 1);
      this.saveItems(items);

      this.showToast(`Producto eliminado: <strong>${removedName}</strong>`, {
        actionText: "Deshacer",
        actionCallback: () => this.undoRemove()
      });
    }
  }

  undoRemove() {
    if (this.lastRemovedItem) {
      const items = this.getItems();
      items.splice(this.lastRemovedItem.index, 0, this.lastRemovedItem.item);
      this.saveItems(items);
      this.showToast(`Se ha restaurado <strong>${this.lastRemovedItem.item.name}</strong> en tu bolsa.`);
      this.lastRemovedItem = null;
    }
  }

  updateBadges() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll(".cart-badge-count, #cartCountBadge, .header-cart-badge");
    badges.forEach(b => {
      b.textContent = count;
      b.classList.toggle("has-items", count > 0);
      b.classList.add("badge-pop");
      setTimeout(() => b.classList.remove("badge-pop"), 300);
    });
  }

  showToast(message, options = {}) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "chayil-toast";
    
    let contentHtml = `<div class="toast-message">${message}</div>`;
    if (options.actionText && options.actionCallback) {
      contentHtml += `<button class="toast-action-btn">${options.actionText}</button>`;
    }
    toast.innerHTML = contentHtml;

    if (options.actionCallback) {
      const actionBtn = toast.querySelector(".toast-action-btn");
      if (actionBtn) {
        actionBtn.addEventListener("click", () => {
          options.actionCallback();
          toast.remove();
        });
      }
    }

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  openDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
      this.renderDrawerContent();
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.classList.add("no-scroll");
    }
  }

  closeDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  }

  renderDrawerContent() {
    const drawerBody = document.getElementById("cartDrawerBody");
    const drawerFooter = document.getElementById("cartDrawerFooter");
    const drawerFreeShipping = document.getElementById("cartDrawerFreeShipping");
    if (!drawerBody) return;

    const items = this.getItems();
    const subtotal = this.getSubtotal();
    const count = this.getTotalCount();

    // Actualizar barra de envío gratuito
    if (drawerFreeShipping) {
      const remaining = this.freeShippingThreshold - subtotal;
      if (subtotal === 0) {
        drawerFreeShipping.innerHTML = `
          <div class="shipping-notice-box">
            <span>Envío gratuito en compras superiores a 65,00 €</span>
          </div>
        `;
      } else if (remaining > 0) {
        const pct = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
        drawerFreeShipping.innerHTML = `
          <div class="shipping-progress-box">
            <div class="shipping-progress-text">
              <span class="truck-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 4px;"><rect x="1" y="3" width="15" height="13" rx="1"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></span> ¡Faltan solo <strong>${formatPrice(remaining)}</strong> para conseguir <strong>Envío Gratuito</strong>!
            </div>
            <div class="shipping-progress-track">
              <div class="shipping-progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      } else {
        drawerFreeShipping.innerHTML = `
          <div class="shipping-progress-box qualified">
            <div class="shipping-progress-text">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ¡Enhorabuena! Has alcanzado el <strong>Envío Gratuito</strong>.
            </div>
            <div class="shipping-progress-track">
              <div class="shipping-progress-fill" style="width: 100%;"></div>
            </div>
          </div>
        `;
      }
    }

    // Renderizar artículos o estado vacío
    if (items.length === 0) {
      drawerBody.innerHTML = `
        <div class="drawer-empty-state">
          <div class="empty-icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3>Tu bolsa está vacía</h3>
          <p>No tienes prendas añadidas. Descubre nuestros básicos atemporales confeccionados para durar.</p>
          <div class="drawer-empty-recommendations">
            <span class="recommendations-label">IMPRESCINDIBLES CHAYIL:</span>
            <div class="quick-rec-item" onclick="window.chayilCart.addQuickItem('cam-heavyweight-arena')">
              <img src="assets/images/prod_tee_arena.jpg" alt="Camiseta Heavyweight">
              <div class="rec-info">
                <strong>Camiseta Heavyweight (240 GSM)</strong>
                <span>38,00 €</span>
              </div>
              <button class="quick-add-btn">+ Añadir</button>
            </div>
            <div class="quick-rec-item" onclick="window.chayilCart.addQuickItem('gorra-duna-washed')">
              <img src="assets/images/prod_cap_duna.jpg" alt="Gorra Duna Washed">
              <div class="rec-info">
                <strong>Gorra Daily Canvas Duna</strong>
                <span>32,00 €</span>
              </div>
              <button class="quick-add-btn">+ Añadir</button>
            </div>
          </div>
          <a href="coleccion.html" class="btn-primary btn-block">Explorar Colección →</a>
        </div>
      `;
      if (drawerFooter) drawerFooter.style.display = "none";
    } else {
      if (drawerFooter) drawerFooter.style.display = "block";
      let html = `<div class="drawer-items-list">`;
      items.forEach((item, idx) => {
        html += `
          <div class="drawer-item" data-index="${idx}">
            <div class="drawer-item-img">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="drawer-item-info">
              <div class="drawer-item-header">
                <span class="drawer-item-subtitle">${item.subtitle}</span>
                <span class="drawer-item-price">${formatPrice(item.price * item.qty)}</span>
              </div>
              <h4 class="drawer-item-title">${item.name}</h4>
              <div class="drawer-item-meta">
                <span class="color-dot" style="background-color: ${item.colorHex};"></span>
                <span>${item.color}</span> • <span>Talla: ${item.size}</span>
              </div>
              <div class="drawer-item-bottom">
                <div class="qty-stepper-compact">
                  <button type="button" onclick="window.chayilCart.updateQty(${idx}, ${item.qty - 1})">-</button>
                  <span>${item.qty}</span>
                  <button type="button" onclick="window.chayilCart.updateQty(${idx}, ${item.qty + 1})">+</button>
                </div>
                <button type="button" class="btn-remove-link" onclick="window.chayilCart.removeItem(${idx})">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
      drawerBody.innerHTML = html;

      // Actualizar footer del drawer
      if (drawerFooter) {
        drawerFooter.innerHTML = `
          <div class="drawer-subtotal-row">
            <span>Subtotal (${count} artículos)</span>
            <span class="subtotal-amount">${formatPrice(subtotal)}</span>
          </div>
          <p class="drawer-tax-note">Impuestos y gastos calculados en el paso siguiente.</p>
          <div class="drawer-actions">
            <a href="bolsa.html" class="btn-secondary btn-block">Ver Bolsa Completa (${count})</a>
            <button type="button" class="btn-primary btn-block" onclick="window.chayilCart.openCheckoutModal()">
              Continuar al Pago Seguro
            </button>
          </div>
        `;
      }
    }
  }

  addQuickItem(productId) {
    const prod = getProductById(productId);
    if (prod) {
      this.addItem(prod, prod.sizes[0] || "M");
    }
  }

  // Modal de Pago en Pausa (Manejo transparente y funcional solicitado por el usuario)
  openCheckoutModal() {
    let modal = document.getElementById("checkoutPauseModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "checkoutPauseModal";
      modal.className = "chayil-modal-backdrop";
      document.body.appendChild(modal);
    }

    const items = this.getItems();
    const total = this.getTotal();
    const itemsSummary = items.map(it => `• ${it.qty}x ${it.name} (${it.color}, Talla ${it.size}) - ${formatPrice(it.price * it.qty)}`).join("%0A");
    const waText = encodeURIComponent(
      `¡Hola Chayil Studio! Quisiera formalizar mi pedido:%0A%0A${items.map(it => `• ${it.qty}x ${it.name} (${it.color}, Talla ${it.size}) - ${formatPrice(it.price * it.qty)}`).join("\n")}\n\nTotal: ${formatPrice(total)}\n\n¿Cómo podemos coordinar el pago y envío? Gracias.`
    );
    const waUrl = `https://wa.me/34611223344?text=${waText}`;

    modal.innerHTML = `
      <div class="chayil-modal-dialog">
        <button class="modal-close-btn" onclick="window.chayilCart.closeCheckoutModal()">&times;</button>
        <div class="modal-badge-pill">ESTADO DEL SERVICIO</div>
        <h3 class="modal-title">Pasarela Online Temporalmente en Pausa</h3>
        <p class="modal-desc">
          En este momento estamos migrando y optimizando nuestra pasarela de pagos bancarios para brindarte la máxima seguridad y experiencia de compra.
        </p>
        <div class="modal-order-recap">
          <div class="recap-header">
            <span>Resumen de tu selección</span>
            <strong>${formatPrice(total)}</strong>
          </div>
          <p class="recap-count">${items.length} prenda(s) seleccionada(s) listas para reservar.</p>
        </div>

        <div class="modal-options-list">
          <a href="${waUrl}" target="_blank" class="modal-option-card highlight">
            <div class="option-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
            <div class="option-content">
              <strong>Completar Pedido por WhatsApp / Asesor</strong>
              <span>Atención directa desde nuestro taller en Colombia. Te enviamos los datos para transferencia instantánea o Bizum.</span>
            </div>
            <span class="option-arrow">→</span>
          </a>

          <div class="modal-option-card" onclick="window.chayilCart.reserveInStore()">
            <div class="option-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
            <div class="option-content">
              <strong>Reservar y Recoger en Showroom Colombia</strong>
              <span>Carrer del Mar, 14. Preparamos tu bolsa para que te la pruebes y la abones en mano.</span>
            </div>
            <span class="option-arrow">→</span>
          </div>

          <div class="modal-newsletter-notify">
            <label for="notifyEmail">Avísame cuando se abra la pasarela automática con tarjeta:</label>
            <div class="notify-input-group">
              <input type="email" id="notifyEmail" placeholder="tu@correo.com">
              <button type="button" onclick="window.chayilCart.saveNotificationEmail()">Notificarme</button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkoutPauseModal");
    if (modal) {
      modal.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  }

  reserveInStore() {
    this.closeCheckoutModal();
    this.showToast("Pedido reservado con éxito para recogida en Carrer del Mar, 14, Colombia. Te contactaremos en breve.");
  }

  saveNotificationEmail() {
    const input = document.getElementById("notifyEmail");
    if (input && input.value.trim().includes("@")) {
      this.closeCheckoutModal();
      this.showToast("Gracias. Recibirás una notificación prioritaria en " + input.value.trim() + " tan pronto se active la pasarela.");
    } else {
      this.showToast("Por favor, introduce un correo electrónico válido.");
    }
  }

  bindGlobalEvents() {
    // Escuchar clics en botones de añadir rápido
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add-to-cart]");
      if (btn) {
        const prodId = btn.dataset.addToCart;
        const size = btn.dataset.size || "M";
        const color = btn.dataset.color || null;
        const prod = getProductById(prodId);
        if (prod) {
          this.addItem(prod, size, color, 1);
        }
      }

      // Toggle drawer
      const trigger = e.target.closest(".open-cart-drawer");
      if (trigger) {
        e.preventDefault();
        this.openDrawer();
      }

      const closeTrigger = e.target.closest(".close-cart-drawer, #cartDrawerOverlay");
      if (closeTrigger) {
        e.preventDefault();
        this.closeDrawer();
      }
    });

    // Sincronizar cambios entre pestañas o eventos custom
    window.addEventListener("storage", (e) => {
      if (e.key === this.storageKey || e.key === this.promoStorageKey) {
        this.updateBadges();
        this.renderDrawerContent();
      }
    });

    window.addEventListener("chayil:cart-updated", () => {
      this.updateBadges();
      this.renderDrawerContent();
    });
  }
}

// Instancia global
window.chayilCart = new ChayilCart();
