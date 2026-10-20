document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('orderList');
  if (!list || !window.supabase) return;
  const db = supabase.createClient(window.PAKDIN_SUPABASE_URL, window.PAKDIN_SUPABASE_ANON_KEY);
  const decorate = () => {
    list.querySelectorAll('.admin-data-row').forEach(row => {
      if (row.querySelector('.admin-status-controls')) return;
      const ref = row.querySelector('strong')?.textContent.trim();
      if (!ref) return;
      const controls = document.createElement('div');
      controls.className = 'admin-status-controls';
      controls.innerHTML = '<label>Order <select data-status="order_status"><option value="new">New</option><option value="confirmed">Confirmed</option><option value="ready">Ready</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label><label>Payment <select data-status="payment_status"><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option></select></label>';
      row.appendChild(controls);
      controls.querySelectorAll('select').forEach(select => select.addEventListener('change', async () => {
        const { error } = await db.from('orders').update({ [select.dataset.status]: select.value }).eq('reference', ref);
        if (error) alert(error.message);
      }));
    });
  };
  new MutationObserver(decorate).observe(list, { childList: true, subtree: true });
  decorate();
});
