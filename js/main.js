
document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      langBtn.textContent = langBtn.textContent === 'HY' ? 'EN' : 'HY';
      alert('Երկլեզու տարբերակի հիմքը պատրաստ է։ Հետո այստեղ կկապվի ամբողջական թարգմանությունը։');
    });
  }
});
