// cart.js — ordering cart + checkout for order.html
// Works with the markup in order.html and the styles in cart.css.

// ── SETTINGS — change these ─────────────────────────────
const WHATSAPP_NUMBER = '60123456789'; // country code + number, digits only (placeholder)
const BOOKING_FEE = 1.00;              // RM, charged once per order (placeholder — set your real fee)
const PAYMENT_URL = '';                // payment link for the booking fee; leave '' until you have one
const CART_STORAGE_KEY = 'pakdin-cart';


// ── HELPERS ─────────────────────────────────────────────
// Money is kept in cents so 14.90 + 11.90 never turns into 26.799999…
const toCents = (rm) => Math.round(rm * 100);
const formatRM = (cents) => 'RM ' + (cents / 100).toFixed(2);

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
        if (Array.isArray(saved)) {
            return saved.filter(function (i) {
                return i && typeof i.name === 'string' &&
                       Number.isFinite(i.cents) && Number.isInteger(i.qty) && i.qty > 0;
            });
        }
    } catch (e) { /* storage blocked or empty — start with an empty cart */ }
    return [];
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* ignore */ }
}

let cart = loadCart();

function fieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

// "14:30" -> "2:30 PM"
function formatTime(value) {
    const parts = value.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return value;
    const suffix = h >= 12 ? 'PM' : 'AM';
    return ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + ' ' + suffix;
}

function showHint(text) {
    const el = document.getElementById('cartHint');
    if (el) el.textContent = text;
}


// ── CART ACTIONS (called from the buttons in order.html) ──
function addToCart(name, price) {
    const existing = cart.find(function (i) { return i.name === name; });
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, cents: toCents(price), qty: 1 });
    }
    saveCart();
    renderCart();
    pulseFab();
}

function changeQty(name, delta) {
    const item = cart.find(function (i) { return i.name === name; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(function (i) { return i !== item; });
    }
    saveCart();
    renderCart();
}

function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    drawer.classList.add('cart-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('active');
}

function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    drawer.classList.remove('cart-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('active');
}

function sendOrderWhatsApp() {
    if (!cart.length) return;

    // Name is required so the order can be prepared and collected
    const name = fieldValue('orderName');
    if (!name) {
        showHint('Please enter your name so we can prepare your order.');
        const nameField = document.getElementById('orderName');
        if (nameField) nameField.focus();
        return;
    }
    showHint('');

    const phone = fieldValue('orderPhone');
    const time = fieldValue('orderTime');
    const note = fieldValue('orderNote');

    const subtotal = cart.reduce(function (sum, i) { return sum + i.cents * i.qty; }, 0);
    const fee = toCents(BOOKING_FEE);

    const lines = ['Hello Pak Din, I would like to place an order for self-pickup:', ''];
    cart.forEach(function (i) {
        lines.push(i.qty + ' x ' + i.name + ' — ' + formatRM(i.cents * i.qty));
    });
    lines.push('');
    lines.push('Food total (pay at pickup): ' + formatRM(subtotal));
    lines.push('Booking fee (paid online): ' + formatRM(fee));
    lines.push('');
    lines.push('Name: ' + name);
    if (phone) lines.push('Phone: ' + phone);
    if (time) lines.push('Pickup time: ' + formatTime(time));
    if (note) lines.push('Note: ' + note);

    const url = 'https://wa.me/' + WHATSAPP_NUMBER +
                '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
}

function payServiceFee() {
    if (!cart.length) return;
    if (!PAYMENT_URL) {
        alert('Online payment is not set up yet. Please send your order by WhatsApp and we will confirm the booking fee with you.');
        return;
    }
    window.open(PAYMENT_URL, '_blank', 'noopener');
}


// ── DRAWING THE CART ────────────────────────────────────
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function makeQtyButton(action, name, label, symbol) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.action = action;
    btn.dataset.name = name;
    btn.setAttribute('aria-label', label + ' ' + name);
    btn.textContent = symbol;
    return btn;
}

function renderCart() {
    const list = document.getElementById('cartItems');
    const emptyMsg = document.getElementById('cartEmpty');
    const badge = document.getElementById('cartCount');
    const details = document.getElementById('cartDetails');

    const itemCount = cart.reduce(function (n, i) { return n + i.qty; }, 0);
    const subtotal = cart.reduce(function (sum, i) { return sum + i.cents * i.qty; }, 0);
    const fee = itemCount ? toCents(BOOKING_FEE) : 0;

    if (list) {
        list.textContent = '';
        cart.forEach(function (item) {
            const row = document.createElement('div');
            row.className = 'cart-item';

            const info = document.createElement('div');
            info.className = 'cart-item-info';
            const nameEl = document.createElement('span');
            nameEl.className = 'cart-item-name';
            nameEl.textContent = item.name;
            const priceEl = document.createElement('span');
            priceEl.className = 'cart-item-price';
            priceEl.textContent = formatRM(item.cents) + ' each';
            info.appendChild(nameEl);
            info.appendChild(priceEl);

            const qty = document.createElement('div');
            qty.className = 'cart-item-qty';
            const qtyNum = document.createElement('span');
            qtyNum.textContent = item.qty;
            qty.appendChild(makeQtyButton('dec', item.name, 'Decrease quantity of', '−'));
            qty.appendChild(qtyNum);
            qty.appendChild(makeQtyButton('inc', item.name, 'Increase quantity of', '+'));

            row.appendChild(info);
            row.appendChild(qty);
            list.appendChild(row);
        });
    }

    if (emptyMsg) emptyMsg.style.display = itemCount ? 'none' : '';
    if (details) details.hidden = itemCount === 0;   // pickup form only shows once there is an order
    if (badge) {
        badge.textContent = itemCount;
        badge.style.display = itemCount ? 'flex' : 'none';
    }

    setText('cartSubtotal', formatRM(subtotal));
    setText('cartFee', formatRM(fee));
    setText('cartTotal', formatRM(subtotal + fee));

    // Order / pay buttons only work when there is something in the cart
    document.querySelectorAll('.cart-btn').forEach(function (btn) {
        btn.disabled = itemCount === 0;
    });
}

function pulseFab() {
    const fab = document.querySelector('.cart-fab');
    if (fab && fab.animate) {
        fab.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
            { duration: 280, easing: 'ease-out' }
        );
    }
}


// ── START UP ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');

    // One click listener handles every + and − button in the drawer
    const list = document.getElementById('cartItems');
    if (list) {
        list.addEventListener('click', function (event) {
            const btn = event.target.closest('button[data-action]');
            if (!btn) return;
            changeQty(btn.dataset.name, btn.dataset.action === 'inc' ? 1 : -1);
        });
    }

    // Clear the "please enter your name" message as soon as they start typing
    const nameField = document.getElementById('orderName');
    if (nameField) nameField.addEventListener('input', function () { showHint(''); });

    // Escape closes the drawer
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeCart();
    });

    renderCart();
});