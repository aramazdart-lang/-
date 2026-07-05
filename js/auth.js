function cleanNext(next){
  if(!next) return 'account/index.html';

  next = decodeURIComponent(next);
  next = next.replace(/^\/+/, '');

  if(next.includes('checkout.html')) return 'checkout.html';
  if(next.includes('account/index.html')) return 'account/index.html';

  return next;
}

function getNext(defaultPath = 'account/index.html'){
  const next = new URLSearchParams(location.search).get('next');
  return next ? cleanNext(next) : defaultPath;
}

async function registerUser(){
  const fullName = document.getElementById('fullName')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  const btn = document.getElementById('authBtn');

  if(!fullName || !phone || !email || !password){
    alert('Լրացրեք բոլոր դաշտերը');
    return;
  }

  if(password.length < 6){
    alert('Գաղտնաբառը պետք է լինի առնվազն 6 նշան');
    return;
  }

  if(btn){
    btn.disabled = true;
    btn.textContent = 'Գրանցվում է...';
  }

  const { data, error } = await aramazdClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone }
    }
  });

  if(error){
    const msg = (error.message || '').toLowerCase();

    if(msg.includes('already registered') || msg.includes('already exists')){
      alert('Այս email-ով հաշիվ արդեն կա։ Մուտք գործեք։');
      location.href = 'login.html?next=' + encodeURIComponent(getNext('account/index.html'));
      return;
    }

    alert('Սխալ։ ' + error.message);

    if(btn){
      btn.disabled = false;
      btn.textContent = 'Գրանցվել';
    }

    return;
  }

  if(data.user){
    await Aramazd.ensureProfile(data.user, {
      full_name: fullName,
      phone,
      role: 'customer'
    });
  }

  alert('Հաշիվը ստեղծվեց ✅');

  const session = await Aramazd.getSession();

  if(!session){
    location.href = 'login.html?next=' + encodeURIComponent(getNext('account/index.html'));
    return;
  }

  location.href = getNext('account/index.html');
}

async function loginUser(){
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  const btn = document.getElementById('authBtn');

  if(!email || !password){
    alert('Լրացրեք email-ն ու գաղտնաբառը');
    return;
  }

  if(btn){
    btn.disabled = true;
    btn.textContent = 'Մուտք է գործում...';
  }

  const { data, error } = await aramazdClient.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    alert('Սխալ։ ' + error.message);

    if(btn){
      btn.disabled = false;
      btn.textContent = 'Մուտք գործել';
    }

    return;
  }

  if(data.user){
    await Aramazd.ensureProfile(data.user);
  }

  location.href = getNext('account/index.html');
}

async function logoutUser(){
  await aramazdClient.auth.signOut();
  location.href = 'login.html';
}

async function resetPassword(){
  const email = document.getElementById('email')?.value.trim();

  if(!email){
    alert('Գրեք email-ը');
    return;
  }

  const { error } = await aramazdClient.auth.resetPasswordForEmail(email, {
    redirectTo: location.href.replace('login.html', 'reset-password.html')
  });

  if(error){
    alert('Սխալ։ ' + error.message);
    return;
  }

  alert('Վերականգնման հղումը ուղարկվեց email-ին։');
}
