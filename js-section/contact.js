(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();
    const status = document.getElementById('formStatus');
    if (!name || !phone || !message) {
      status.textContent = 'Please complete your name, phone number and message.';
      return;
    }
    const text = `Hello Pak Din, I would like to make a ${subject}.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(message)}`;
    status.textContent = 'Opening WhatsApp…';
    window.open(`https://wa.me/60125033639?text=${text}`, '_blank', 'noopener');
  });
})();
