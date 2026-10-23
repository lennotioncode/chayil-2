/**
 * CHAYIL - Dedicated Shopping Bag Page Logic (bolsa.html)
 * Active items list, quantity updates, removal & undo, promo codes, upsell, dynamic empty state
 */

document.addEventListener("DOMContentLoaded", () => {
  initCartPage();
});

function initCartPage() {
  const activeContainer = document.getElementById("cartActiveView");
  const emptyContainer = document.getElementById("cartEmptyView");
  const itemsListEl = document.getElementById("cartItemsList");
  const freeShippingBarEl = document.getElementById("cartPageFreeShipping");
  const subtotalEl = document.getElementById("cartSummarySubtotal");
  const discountEl = document.getElementById("cartSummaryDiscount");
  const discountRowEl = document.getElementById("cartDiscountRow");
  const shippingEl = document.getElementById("cartSummaryShipping");
  const taxEl = document.getElementById("cartSummaryTax");
  const totalEl = document.getElementById("cartSummaryTotal");
  const countTitleEl = document.getElementById("cartTitleItemCount");
  const promoInput = document.getElementById("promoCodeInput");
  const btnApplyPromo = document.getElementById("btnApplyPromo");
  const promoFeedbackEl = document.getElementById("promoFeedbackMsg");
  const btnAddUpsell = document.getElementById("btnAddUpsellSocks");
  const btnCheckoutPrimary = document.getElementById("btnCheckoutPrimary");
  const btnExpressApple = document.getElementById("btnExpressApple");
  const btnExpressGpay = document.getElementById("btnExpressGpay");

  function renderPage() {
    const items = window.chayilCart.getItems();
    const count = window.chayilCart.getTotalCount();
    const subtotal = window.chayilCart.getSubtotal();
    const discount = window.chayilCart.getDiscount();
    const shipping = window.chayilCart.getShippingCost();
    const total = window.chayilCart.getTotal();
    const threshold = window.chayilCart.freeShippingThreshold;

    // Update title count
    if (countTitleEl) {
      countTitleEl.textContent = `(${count} artículo${count === 1 ? '' : 's'})`;
    }

    if (items.length === 0) {
      if (activeContainer) activeContainer.style.display = "none";
      if (emptyContainer) emptyContainer.style.display = "flex";
      return;
    }

    if (activeContainer) activeContainer.style.display = "grid";
    if (emptyContainer) emptyContainer.style.display = "none";

    // Free Shipping Bar
    if (freeShippingBarEl) {
      const remaining = threshold - subtotal;
      if (remaining > 0) {
        const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
        freeShippingBarEl.className = "cart-free-shipping-card";
        freeShippingBarEl.innerHTML = `
          <div class="cart-shipping-text-row">
            <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 5px;"><rect x="1" y="3" width="15" height="13" rx="1"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> ¡Faltan solo <strong>${formatPrice(remaining)}</strong> para conseguir <strong>Envío Gratuito</strong>!</span>
            <span class="shipping-target-metric">${formatPrice(subtotal)} / ${formatPrice(threshold)}</span>
          </div>
          <div class="cart-shipping-track">
            <div class="cart-shipping-fill" style="width: ${pct}%;"></div>
          </div>
        `;
      } else {
        freeShippingBarEl.className = "cart-free-shipping-card qualified";
        freeShippingBarEl.innerHTML = `
          <div class="cart-shipping-text-row">
            <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 5px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ¡Enhorabuena! Has alcanzado el <strong>Envío Exprés Gratuito</strong>.</span>
            <span class="shipping-target-metric">100% Alcanzado</span>
          </div>
          <div class="cart-shipping-track">
            <div class="cart-shipping-fill" style="width: 100%;"></div>
          </div>
        `;
      }
    }

    // Render Items
    if (itemsListEl) {
      itemsListEl.innerHTML = items.map((item, idx) => `
        <div class="cart-item-card" data-item-idx="${idx}">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-content">
            <div class="cart-item-header">
              <span class="cart-item-subtitle">${item.subtitle || 'CHAYIL ESSENTIALS'}</span>
              <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
            </div>
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-specs">${item.specs}</p>
            <div class="cart-item-meta-row">
              <span class="color-dot" style="background-color: ${item.colorHex};"></span>
              <span>${item.color}</span> • <span>Talla: ${item.size}</span>
            </div>
            <div class="cart-item-actions-row">
              <div class="qty-stepper-standard">
                <button type="button" onclick="window.chayilCart.updateQty(${idx}, ${item.qty - 1})">-</button>
                <span>${item.qty}</span>
                <button type="button" onclick="window.chayilCart.updateQty(${idx}, ${item.qty + 1})">+</button>
              </div>
              <div class="item-links-group">
                <button type="button" class="btn-item-action" onclick="saveForLater(${idx})">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -1px; margin-right: 3px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Guardar
                </button>
                <button type="button" class="btn-item-action delete" onclick="deleteCartItem(${idx})">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -1px; margin-right: 3px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Order Summary
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    
    if (discountRowEl && discountEl) {
      if (discount > 0) {
        discountRowEl.style.display = "flex";
        discountEl.textContent = `-${formatPrice(discount)}`;
      } else {
        discountRowEl.style.display = "none";
      }
    }

    if (shippingEl) {
      shippingEl.innerHTML = shipping === 0 
        ? `<strong>GRATIS</strong>` 
        : formatPrice(shipping);
    }

    if (taxEl) {
      const taxIncluded = (total * 0.21) / 1.21;
      taxEl.textContent = formatPrice(taxIncluded);
    }

    if (totalEl) {
      totalEl.textContent = formatPrice(total);
    }

    // Promo feedback state
    const currentCode = window.chayilCart.getPromoCode();
    if (promoFeedbackEl) {
      if (currentCode === "BIENVENIDA10" || currentCode === "CHAYIL10") {
        promoFeedbackEl.className = "promo-feedback-msg success";
        promoFeedbackEl.innerHTML = `Código <strong>${currentCode}</strong> (-10%) aplicado correctamente.`;
      } else if (currentCode === "MEDITERRANEO") {
        promoFeedbackEl.className = "promo-feedback-msg success";
        promoFeedbackEl.innerHTML = `Código <strong>MEDITERRANEO</strong> (-5,00 €) aplicado correctamente.`;
      } else if (currentCode) {
        promoFeedbackEl.className = "promo-feedback-msg error";
        promoFeedbackEl.textContent = "El código introducido no es válido o ha expirado.";
      } else {
        promoFeedbackEl.textContent = "";
      }
    }
  }

  // Delete animation
  window.deleteCartItem = function(idx) {
    const card = document.querySelector(`.cart-item-card[data-item-idx="${idx}"]`);
    if (card) {
      card.classList.add("removing");
      setTimeout(() => {
        window.chayilCart.removeItem(idx);
        renderPage();
      }, 250);
    } else {
      window.chayilCart.removeItem(idx);
      renderPage();
    }
  };

  window.saveForLater = function(idx) {
    const items = window.chayilCart.getItems();
    if (items[idx]) {
      const item = items[idx];
      window.chayilCart.showToast(`Se ha guardado <strong>${item.name}</strong> en tu lista de deseos.`);
      deleteCartItem(idx);
    }
  };

  // Promo Code Apply
  if (btnApplyPromo && promoInput) {
    btnApplyPromo.addEventListener("click", () => {
      const val = promoInput.value.trim().toUpperCase();
      if (!val) return;

      if (val === "BIENVENIDA10" || val === "CHAYIL10" || val === "MEDITERRANEO") {
        window.chayilCart.setPromoCode(val);
        window.chayilCart.showToast(`Descuento ${val} aplicado con éxito.`);
        renderPage();
      } else {
        if (promoFeedbackEl) {
          promoFeedbackEl.className = "promo-feedback-msg error";
          promoFeedbackEl.textContent = "Código promocional no válido. Prueba con BIENVENIDA10.";
        }
      }
    });
  }

  // Upsell Socks Add
  if (btnAddUpsell) {
    btnAddUpsell.addEventListener("click", () => {
      const socks = getProductById("calcetines-acanalados");
      if (socks) {
        window.chayilCart.addItem(socks, "Única (39-44)", "Pack 4 Tonos Neutros", 1);
        renderPage();
      }
    });
  }

  // Checkout Buttons
  const checkoutHandlers = [btnCheckoutPrimary, btnExpressApple, btnExpressGpay];
  checkoutHandlers.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.chayilCart.openCheckoutModal();
      });
    }
  });

  // Listen for global cart updates
  window.addEventListener("chayil:cart-updated", () => {
    renderPage();
  });

  // Initial render
  renderPage();
}
