/* ==========================================
   HEALTHYFIT - LÓGICA DE CARRITO Y SISTEMA
   ========================================== */

// Estado del Carrito
let cart = JSON.parse(localStorage.getItem("healthyfit_cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCartItems();

    // Escuchar evento de envío del formulario de contacto si existe
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            alert("¡Gracias por contactarnos! Un asesor te responderá pronto.");
            contactForm.reset();
        });
    }
});

// Función para mostrar la notificación flotante (Toast)
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    // Ícono de check y mensaje
    toast.innerHTML = `<span style="background: #00e676; color: #0b2575; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900;">✓</span> ${message}`;

    toast.classList.add("show");

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Agregar producto al carrito
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    renderCartItems();

    // Notificación emergente flotante (Toast)[cite: 6]
    showToast(`¡${name} agregado al carrito!`);
}

// Remover producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Guardar en LocalStorage
function saveCart() {
    localStorage.setItem("healthyfit_cart", JSON.stringify(cart));
}

// Actualizar contador del Header
function updateCartCount() {
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElem.textContent = totalItems;
    }
}

// Renderizar elementos en el Drawer del Carrito
function renderCartItems() {
    const listElem = document.getElementById("cart-items-container");
    const totalElem = document.getElementById("cart-total-price");

    if (!listElem || !totalElem) return;

    listElem.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        listElem.innerHTML = '<p style="text-align:center; padding: 2rem 0; color: #6b7280;">El carrito está vacío</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemRow = document.createElement("div");
            itemRow.className = "cart-item";
            itemRow.innerHTML = `
        <div>
          <strong style="font-size:0.85rem;">${item.name}</strong>
          <div style="font-size:0.75rem; color:#6b7280;">S/ ${item.price.toFixed(2)} x ${item.quantity}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:700;">S/ ${itemTotal.toFixed(2)}</span>
          <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold;">&times;</button>
        </div>
      `;
            listElem.appendChild(itemRow);
        });
    }

    totalElem.textContent = `S/ ${total.toFixed(2)}`;
}

// Abrir / Cerrar Drawer del Carrito
function toggleCartModal() {
    const modal = document.getElementById("cartModal");
    if (modal) {
        modal.classList.toggle("active");
    }
}

// Procesar Compra / Finalizar Pedido
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de procesar la compra.");
        return;
    }

    // Alerta de procesamiento de compra[cite: 5]
    alert("¡Gracias por tu compra en HealthyFit! Procesando pedido...");

    // Vaciar el carrito
    cart = [];
    saveCart();
    updateCartCount();
    renderCartItems();

    // Cerrar el modal del carrito
    toggleCartModal();
}
