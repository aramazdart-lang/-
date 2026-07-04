let currentUser=null, currentProfile=null, userOrders=[];

const buttons=document.querySelectorAll('.menu button');
const pages=document.querySelectorAll('.page');
const title=document.getElementById('pageTitle');

const titles={
  dashboard:'Dashboard',
  orders:'Իմ պատվերները',
  library:'Թվային գրադարան',
  payments:'Վճարումներ',
  profile:'Իմ տվյալները'
};

buttons.forEach(btn=>btn.addEventListener('click',()=>{
  const page=btn.dataset.page;
  buttons.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  pages.forEach(p=>p.classList.remove('active'));
  document.getElementById(page).classList.add('active');
  title.textContent=titles[page];
}));

function money(n){ return Number(n||0).toLocaleString('hy-AM')+' դր․'; }
function remaining(o){ return Math.max(Number(o.price||0)-Number(o.paid_amount||0),0); }
function isDeliveryStage(o){ return ['Առաքում','Առաքված'].includes(String(o.status||'')); }

function stepIndex(status){
  if(!status) return 1;
  if(status.includes('Հեքիաթ')||status.includes('գրվում')) return 2;
  if(status.includes('Իլ')||status.includes('Նկար')||status.includes('Դիզայն')) return 3;
  if(status.includes('Տպ')) return 4;
  if(status.includes('Պատրաստ')) return 5;
  if(status.includes('Առաք')) return 6;
  return 1;
}

function timeline(status){
  const steps=['Տվյալները ստացվել են','Ստեղծման փուլ','Նկարազարդում/դիզայն','Տպագրություն','Պատրաստ է','Առաքում'];
  const cur=stepIndex(status);
  return `<div class="timeline five-step">${steps.map((s,i)=>{
    const n=i+1;
    return `<div class="${n<cur?'done':n===cur?'current':''}"><b>${n<cur?'✓':n}</b><span>${s}</span></div>`;
  }).join('')}</div>`;
}

async function init(){
  const session=await Aramazd.getSession();
  if(!session){ location.href='../login.html?next=account/index.html'; return; }

  currentUser=session.user;
  currentProfile=await Aramazd.ensureProfile(currentUser);

  document.getElementById('userName').textContent=currentProfile?.full_name||currentUser.email;
  document.getElementById('userEmail').textContent=currentUser.email;
  document.getElementById('avatar').textContent=(currentProfile?.full_name||currentUser.email||'Ա').trim()[0].toUpperCase();

  if(currentProfile?.role==='admin') document.getElementById('adminLink').style.display='block';

  document.getElementById('profileName').value=currentProfile?.full_name||'';
  document.getElementById('profileEmail').value=currentUser.email||'';
  document.getElementById('profilePhone').value=currentProfile?.phone||'';
  document.getElementById('profileCity').value=currentProfile?.city||'';
  document.getElementById('profileAddress').value=currentProfile?.address||'';
  document.getElementById('profileIndex').value=currentProfile?.postal_code||'';

  await loadOrders();
}

async function loadOrders(){
  const {data,error}=await aramazdClient
    .from('orders')
    .select('*')
    .eq('user_id',currentUser.id)
    .order('created_at',{ascending:false});

  if(error){
    document.getElementById('ordersList').innerHTML='Սխալ՝ '+error.message;
    return;
  }

  userOrders=data||[];
  renderDashboard();
  renderOrders();
  renderPayments();
  renderLibrary();
}

function renderDashboard(){
  const active=userOrders.filter(o=>!String(o.status||'').includes('Ավարտ')&&!String(o.status||'').includes('Առաքված'));
  const done=userOrders.length-active.length;
  const debt=userOrders.reduce((s,o)=>s+remaining(o),0);
  const latest=userOrders[0];

  document.getElementById('statAll').textContent=userOrders.length;
  document.getElementById('statActive').textContent=active.length;
  document.getElementById('statDone').textContent=done;
  document.getElementById('statDebt').textContent=money(debt);

  document.getElementById('activeOrderBox').innerHTML=latest?`
    <div class="order-head">
      <div>
        <h3>${latest.product}</h3>
        <p>Պատվեր #AA-${latest.id} • ${latest.status||'Նոր պատվեր'}</p>
      </div>
      <span class="badge yellow">${latest.status||'Նոր պատվեր'}</span>
    </div>
    ${timeline(latest.status)}
    <div class="pay-line"><span>Վճարման վիճակ</span><b>${latest.payment_status||'Չհաստատված'}</b></div>
    <div class="pay-line"><span>Մնացած գումար</span><b>${money(remaining(latest))}</b></div>
    ${isDeliveryStage(latest)?deliveryForm(latest):''}
  `:'<p>Դեռ պատվերներ չկան։</p>';

  document.getElementById('paymentBox').innerHTML=latest?`
    <div class="pay-line"><span>Ընդհանուր</span><b>${money(latest.price)}</b></div>
    <div class="pay-line"><span>Վճարված</span><b>${money(latest.paid_amount)}</b></div>
    <div class="pay-line"><span>Մնացած</span><b>${money(latest.remaining_amount ?? remaining(latest))}</b></div>
    ${(String(latest.status||'').includes('Պատրաստ') && Number(latest.remaining_amount ?? remaining(latest))>0)?`
      <div class="panel" style="margin-top:14px;padding:16px">
        <h3>Վերջնական վճարում</h3>
        <p><b>Քարտ՝</b> 4454300004304959<br><b>Ստացող՝</b> Արեն Ալավերդյան<br><b>Բանկ՝</b> Սրդշինբանկ<br><b>Idram՝</b> 613508551</p>
        <input id="finalReceipt_${latest.id}" type="file" accept="image/*,application/pdf">
        <button onclick="demoFinalPayment(${latest.id})">Ուղարկել անդորրագիրը</button>
      </div>`:''}
  `:'<p>Վճարում չկա։</p>';
}

function renderOrders(){
  const box=document.getElementById('ordersList');
  if(!userOrders.length){ box.innerHTML='<p>Դեռ պատվերներ չկան։</p>'; return; }

  box.innerHTML=userOrders.map(o=>`
    <article class="order-card" onclick="showOrder(${o.id})">
      <div>
        <h3>${o.product}</h3>
        <p>#AA-${o.id} • ${money(o.price)} • ${o.phone||''}</p>
      </div>
      <span class="badge yellow">${o.status||'Նոր պատվեր'}</span>
    </article>
  `).join('');

  showOrder(userOrders[0].id);
}

function showOrder(id){
  const o=userOrders.find(x=>x.id===id);
  if(!o) return;

  document.getElementById('orderDetails').innerHTML=`
    <h2>${o.product}</h2>
    <p>#AA-${o.id} • ${o.status||'Նոր պատվեր'}</p>
    ${timeline(o.status)}
    <div class="pay-line"><span>Ընդհանուր</span><b>${money(o.price)}</b></div>
    <div class="pay-line"><span>Կանխավճար</span><b>${money(o.deposit_amount)}</b></div>
    <div class="pay-line"><span>Վճարված</span><b>${money(o.paid_amount)}</b></div>
    <div class="pay-line"><span>Մնացած</span><b>${money(remaining(o))}</b></div>
    <div class="pay-line"><span>Վճարման կարգավիճակ</span><b>${o.payment_status||'Չհաստատված'}</b></div>
    ${(String(o.status||'').includes('Պատրաստ') && Number(o.remaining_amount ?? remaining(o))>0)?`
      <div class="panel" style="margin-top:20px">
        <h2>Վերջնական վճարում</h2>
        <p><b>Մնացած գումար՝</b> ${money(o.remaining_amount ?? remaining(o))}</p>
        <p><b>Քարտ՝</b> 4454300004304959<br><b>Ստացող՝</b> Արեն Ալավերդյան<br><b>Բանկ՝</b> Սրդշինբանկ<br><b>Idram՝</b> 613508551</p>
        <input id="finalReceipt_${o.id}" type="file" accept="image/*,application/pdf">
        <button onclick="demoFinalPayment(${o.id})">Ուղարկել անդորրագիրը</button>
      </div>`:''}
    ${isDeliveryStage(o)?deliveryForm(o):''}
  `;
}

function deliveryForm(o){
  return `
    <div class="panel" style="margin-top:20px">
      <h2>Առաքման տվյալներ</h2>
      <p>Լրացրեք տվյալները ՀայՓոստով կամ առաքմամբ ուղարկելու համար։</p>
      <div class="profile-form">
        <label>Ստացողի անուն<input id="deliveryName_${o.id}" value="${o.recipient_name||currentProfile?.full_name||''}"></label>
        <label>Հեռախոս<input id="deliveryPhone_${o.id}" value="${o.delivery_phone||currentProfile?.phone||o.phone||''}"></label>
        <label>Քաղաք / գյուղ<input id="deliveryCity_${o.id}" value="${o.delivery_city||currentProfile?.city||''}"></label>
        <label>Հասցե<input id="deliveryAddress_${o.id}" value="${o.delivery_address||currentProfile?.address||''}"></label>
        <label>Փոստային ինդեքս<input id="postalCode_${o.id}" value="${o.postal_code||currentProfile?.postal_code||''}"></label>
        <label>Նշում<textarea id="deliveryNote_${o.id}" placeholder="օր․ զանգել մինչ առաքումը">${o.delivery_note||''}</textarea></label>
        <button onclick="saveDelivery(${o.id})">Պահպանել առաքման տվյալները</button>
      </div>
      <hr style="margin:25px 0">
      <h2>Վերջնական վճարում</h2>
      <p>Մնացած գումար՝ <b>${money(remaining(o))}</b></p>
      <p>Վճարման վիճակ՝ <b>${o.final_payment_status||'Չվճարված'}</b></p>
      <button onclick="demoFinalPayment(${o.id})">Վճարել մնացածը</button>
    </div>
  `;
}

function youtubeEmbed(url){
  if(!url) return '';
  let id='';
  if(url.includes('youtu.be/')) id=url.split('youtu.be/')[1].split('?')[0];
  if(url.includes('watch?v=')) id=url.split('watch?v=')[1].split('&')[0];
  if(!id) return '';
  return `https://www.youtube.com/embed/${id}`;
}

function renderLibrary(){
  const box=document.getElementById('libraryGrid');
  if(!box) return;
  const ready=userOrders.filter(o=>o.video_url || o.tracking_code);
  if(!ready.length){
    box.innerHTML=`<div class="file-card"><div class="file-icon">🎬</div><h3>Դեռ մուլտֆիլմ չկա</h3><p>Երբ մուլտֆիլմը պատրաստ լինի, այն կհայտնվի այստեղ։</p></div>`;
    return;
  }
  box.innerHTML=ready.map(o=>{
    const embed=youtubeEmbed(o.video_url);
    return `<div class="file-card"><div class="file-icon">🎬</div><h3>${o.product}</h3><p>Պատվեր #AA-${o.id}</p>${embed?`<iframe width="100%" height="240" src="${embed}" frameborder="0" allowfullscreen style="border-radius:16px"></iframe>`:(o.video_url?`<a class="btn small" target="_blank" href="${o.video_url}">Դիտել մուլտֆիլմը</a>`:'')}${o.tracking_code?`<p><b>📦 Tracking:</b> ${o.delivery_company||''} ${o.tracking_code}</p>`:''}</div>`;
  }).join('');
}

async function saveDelivery(id){
  const updates={
    recipient_name:document.getElementById('deliveryName_'+id).value,
    delivery_phone:document.getElementById('deliveryPhone_'+id).value,
    delivery_city:document.getElementById('deliveryCity_'+id).value,
    delivery_address:document.getElementById('deliveryAddress_'+id).value,
    postal_code:document.getElementById('postalCode_'+id).value,
    delivery_note:document.getElementById('deliveryNote_'+id).value
  };

  const {error}=await aramazdClient.from('orders').update(updates).eq('id',id).eq('user_id',currentUser.id);
  if(error){ alert('Սխալ։ '+error.message); return; }

  alert('Առաքման տվյալները պահպանվեցին ✅');
  await loadOrders();
}

async function demoFinalPayment(id){
  const input=document.getElementById('finalReceipt_'+id);
  const file=input?.files?.[0];
  if(!file){alert('Կցեք անդորրագիրը');return;}
  const safe=String(file.name||'receipt').replace(/[^\w.\-]+/g,'_').toLowerCase();
  const path=`order-${id}/final-${Date.now()}-${safe}`;
  const up=await aramazdClient.storage.from('receipts').upload(path,file,{cacheControl:'3600',upsert:true,contentType:file.type||undefined});
  if(up.error){alert('Upload սխալ․ '+up.error.message);return;}
  const url=aramazdClient.storage.from('receipts').getPublicUrl(path)?.data?.publicUrl || '';
  const {error}=await aramazdClient.from('orders').update({final_receipt_url:url,final_payment_status:'Սպասում է հաստատման'}).eq('id',id).eq('user_id',currentUser.id);
  if(error){ alert('Սխալ։ '+error.message); return; }
  alert('Անդորրագիրը ուղարկվեց ✅');
  await loadOrders();
}

function renderPayments(){
  const box=document.getElementById('paymentsList');
  box.innerHTML=`
    <div class="panel">
      <h3>Մնացած գումար</h3>
      <div class="big-price">${money(userOrders.reduce((s,o)=>s+remaining(o),0))}</div>
      <p>Իրական վճարման կոճակը կկցվի IDBank/Idram-ից տվյալներ ստանալուց հետո։</p>
    </div>
    <div class="panel">
      <h3>Վճարման պատմություն</h3>
      ${userOrders.map(o=>`<div class="history"><span>#AA-${o.id} ${o.product}</span><b>${money(o.paid_amount)}</b></div>`).join('')||'<p>Չկա</p>'}
    </div>
  `;
}

async function saveProfile(){
  const updates={
    full_name:document.getElementById('profileName').value,
    phone:document.getElementById('profilePhone').value,
    city:document.getElementById('profileCity').value,
    address:document.getElementById('profileAddress').value,
    postal_code:document.getElementById('profileIndex').value
  };

  const {error}=await aramazdClient.from('profiles').update(updates).eq('id',currentUser.id);
  if(error){ alert('Սխալ։ '+error.message); return; }

  alert('Պահպանվեց ✅');
}

async function logoutAccount(){
  await aramazdClient.auth.signOut();
  location.href='../login.html';
}

document.addEventListener('DOMContentLoaded',init);
