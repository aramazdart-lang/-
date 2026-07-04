let planName='Անհատական գիրք + NFC';
let planPrice=17000;
let currentMode='custom';
let heroes=0;
let pages=0;
let uploadedCount=0;
let selectedStoryId='';
const READY_STORIES=[{"id": "two-suns", "title": "Երկու արև և մեկ մեծ սեր", "cover": "../assets/fairytales/covers/two-suns.webp", "text": "Մի արևոտ օր, երբ Մարտան և Մարիան խաղում էին այգում, նրանց դիմաց հայտնվեց մի անսովոր ոսկեգույն թիթեռ։ Այն կարծես ինչ-որ տեղ էր կանչում նրանց... Աղջիկները հետևեցին նրան՝ չիմանալով, որ ընդամենը մի քանի քայլ հետո իրենց կյանքում սկսվելու էր մի կախարդական պատմություն, որը փոխելու էր ամեն ինչ…", "heroes": [["Մարտա", "../assets/fairytales/poses/marta.webp"], ["Մարիա", "../assets/fairytales/poses/maria.webp"]]}, {"id": "found-dream", "title": "Գտնված երազ", "cover": "../assets/fairytales/covers/found-dream.webp", "text": "Գիշերը գալիս է շատ դանդաղ, կարծես վախենում է արթնացնել աշխարհը։ Պատուհանից ներս է սահում լուսնի փափուկ լույսը, իսկ փոքրիկ Անգելինան նստած է անկողնում ու գիրք է կարդում գունավոր թիթեռների մասին։ Բայց երբ պապիկը խոստովանում է, որ վաղուց կորցրել է իր քունը, Անգելինայի սրտում ծնվում է մի ցանկություն, որը նրան տանելու է մի կախարդական ճանապարհորդության…", "heroes": [["Անգելինա", "../assets/fairytales/poses/angelina.webp"]]}, {"id": "eduard", "title": "Էդուարդի առաջին քաջությունը", "cover": "../assets/fairytales/covers/eduard.webp", "text": "Մի լուսավոր առավոտ արևի շողերը մեղմ սահում են Էդուարդի սենյակի պատուհանից ներս։ Նա հպարտությամբ հագնում է իր կարմիր հրշեջ գլխարկն ու փոքրիկ ուսապարկը՝ պատրաստ լինելով նոր արկածների։ Սակայն նա դեռ չգիտեր, որ հենց այդ օրը մի փոքրիկ օգնության կանչ իրեն ու եղբորը՝ Դավիթին, տանելու էր մի փորձության, որտեղ պետք էր ցույց տալ իսկական քաջությունը…", "heroes": [["Էդուարդ", "../assets/fairytales/poses/eduard.webp"]]}, {"id": "emila", "title": "Էմիլան և կախարդական լիճը", "cover": "../assets/fairytales/covers/emila.webp", "text": "Լուսաբացի մեղմ շողերը կամաց սահում են պատուհանի միջով ու լցվում փոքրիկ Էմիլիայի սենյակը։ Այսօր ինչ-որ յուրահատուկ օր է․ նրա սիրտը լի է սպասումով, կարծես նոր արկած է սպասվում։ Սակայն նա դեռ չգիտեր, որ մի կախարդական լիճ, որը զգում է մարդկանց սրտերը, պատրաստվում էր կանչել իրեն և փորձության ենթարկել նրա խիզախությունն ու հավատը…", "heroes": [["Էմիլա", "../assets/fairytales/poses/emila.webp"]]}, {"id": "lea", "title": "Լեայի բարի օրը", "cover": "../assets/fairytales/covers/lea.webp", "text": "Առավոտը բացվում է խաղաղ ու լուսավոր։ Արևի ոսկեգույն շողերը մեղմ սահում են պատուհանից ներս և լուսավորում Լեայի փոքրիկ սենյակը։ Հենց այդ օրը, երբ օրացույցում կարմիրով նշված ամսաթիվն էր, օդում հնչում է մի խորհրդավոր ձայն, և նրա առջև հայտնվում է փոքրիկ փերին։ Բայց Լեան դեռ չգիտեր, որ այդ կախարդական հանդիպումը նրան տանելու էր մի բարի արկածի, որտեղ յուրաքանչյուր քայլը դառնալու էր իսկական փորձություն…", "heroes": [["Լեա", "../assets/fairytales/poses/lea.webp"]]}, {"id": "mariam", "title": "Մարիամի լուսավոր օրը", "cover": "../assets/fairytales/covers/mariam.webp", "text": "Արևի ոսկեգույն շողերը կամաց-կամաց սահում են դպրոցի լուսավոր դասասենյակով, իսկ Մարիամը հուզմունքով պատրաստվում է ավարտել իր ամենակարևոր նկարը՝ այն, որը ներկայացվելու է ցուցադրությանը։ Նա վստահ է, որ այս անգամ ամեն ինչ պետք է ստացվի... բայց հենց առաջին վրձնահարվածներից հետո հասկանում է, որ իրեն սպասում է մի փորձություն, որը կփոխի ոչ միայն իր նկարը, այլև ինքն իրեն…", "heroes": [["Մարիամ", "../assets/fairytales/poses/mariam.webp"]]}, {"id": "miqayel", "title": "Միքայելի փոքրիկ արկածը", "cover": "../assets/fairytales/covers/miqayel.webp", "text": "Առավոտյան արևի մեղմ շողերը սահում են պատուհանի միջով ու լուսավորում Միքայելի սենյակը։ Այսօր նա որոշել է ինքնուրույն բացահայտել աշխարհը՝ քայլել դեպի քաղաքի այգին, լսել նրա ձայները և զգալ, թե ինչ է նշանակում պատասխանատու լինել։ Բայց Միքայելը դեռ չգիտեր, որ այդ սովորական զբոսանքը շուտով վերածվելու էր մի փոքրիկ, բայց կարևոր արկածի, որը նրան նորովի էր սովորեցնելու սիրել ու գնահատել իր հայրենիքը…", "heroes": [["Միքայել", "../assets/fairytales/poses/miqayel.webp"]]}, {"id": "qajik", "title": "Խիզախ Քաջիկն ու փոքրիկ արկածը", "cover": "../assets/fairytales/covers/qajik.webp", "text": "Արևը նոր է բարձրանում, և իր ոսկեգույն շողերը մեղմ լցվում են Քաջիկի սենյակ։ Այսօր նա իրեն ուժեղ ու համարձակ է զգում և որոշում է սկսել օրը փոքրիկ առավոտյան վազքով։ Բայց նա դեռ չգիտեր, որ այդ սովորական առավոտը շուտով վերածվելու էր մի անսպասելի արկածի, որտեղ ամենակարևորը լինելու էր ոչ թե ուժը, այլ քաջությունը, պատասխանատվությունն ու փոքրիկ քրոջը պաշտպանելու պատրաստակամությունը…", "heroes": [["Քաջիկ", "../assets/fairytales/poses/qajik.webp"]]}, {"id": "lana", "title": "Լանայի լուսավոր օրը", "cover": "../assets/fairytales/covers/lana.webp", "text": "Մի լուսավոր առավոտ է բացվում։ Արևի մեղմ շողերը սահում են Լանայի սենյակի պատերով, իսկ նրա սրտում մի քաղցր սպասում կա․ ընդամենը մի քանի օրից նա դառնալու է յոթ տարեկան։ Նա դեռ չգիտեր, որ մինչև այդ սպասված օրը մի փոքրիկ անակնկալ, մեկ սխալ որոշում և մեկ կարևոր ընտրություն կօգնեն նրան բացահայտել, թե ինչքան մեծ ուժ ունի ազնվությունն ու անկեղծությունը...", "heroes": [["Լանա", "../assets/fairytales/poses/lana.webp"]]}, {"id": "godzila", "title": "Անտառում կորած Գոձիլան", "cover": "../assets/fairytales/covers/godzila.webp", "text": "Ամառվա պայծառ առավոտ է։ Տանը ամեն ինչ խաղաղ է, իսկ արևի շողերը ոսկեգույն լույսով լցնում են սենյակը։ Հինգ տարեկան Արմենը պատրաստվում է իր ամենակարևոր «հետախուզական առաքելությանը»՝ ուսապարկը հավաքած, հեռադիտակը ձեռքին և սիրելի փոքրիկ Գոձիլայի հետ։ Բայց նա դեռ չգիտեր, որ այդ օրը անտառի խորքում իրեն սպասում էր մի անհավանական հանդիպում, որը կվերածեր սովորական զբոսանքը իսկական արկածի...", "heroes": [["Արմեն և Էդուարդ", "../assets/fairytales/poses/armen-eduard.webp"]]}];
function format(n){return Number(n||0).toLocaleString('hy-AM')+' դր․'}
function updateTotal(){
  const heroPrice=heroes*2000, pagePrice=pages*2500, total=planPrice+heroPrice+pagePrice;
  document.getElementById('planName').textContent=planName;
  document.getElementById('planPrice').textContent=format(planPrice);
  document.getElementById('heroPrice').textContent=format(heroPrice);
  document.getElementById('pagePrice').textContent=format(pagePrice);
  document.getElementById('totalPrice').textContent=format(total);
}
function renderPoseGuide(story){
  const box=document.getElementById('storyPoseBox');
  if(!box) return;
  if(!story){box.innerHTML='<p>Ընտրեք հեքիաթը, որպեսզի դիրքերի օրինակները երևան այստեղ։</p>';return;}
  box.innerHTML=story.heroes.map(h=>`<div class="pose-hero"><h4>${h[0]}</h4><img src="${h[1]}" alt="${h[0]}"></div>`).join('');
}
function setMode(mode){
  currentMode=mode;
  document.getElementById('templates')?.classList.toggle('hidden',mode!=='ready');
  document.getElementById('customOnlyFields')?.classList.toggle('hidden',mode==='ready');
  document.getElementById('readyOnlyInfo')?.classList.toggle('hidden',mode!=='ready');
  document.getElementById('readyBlock')?.classList.toggle('hidden',mode!=='ready');
  document.getElementById('customQuestions')?.classList.toggle('hidden',mode!=='custom');
  if(mode==='ready'){heroes=0;pages=0;document.getElementById('heroCount').textContent='0';document.getElementById('pageCount').textContent='0'}
  updateTotal();
}
function selectPlan(name,price,mode='custom',btn){planName=name;planPrice=price;setMode(mode);document.querySelectorAll('.plan-card').forEach(c=>c.classList.remove('selected-plan'));btn?.closest('.plan-card')?.classList.add('selected-plan');(mode==='ready'?document.getElementById('templates'):document.getElementById('order'))?.scrollIntoView({behavior:'smooth',block:'start'});}
function selectTemplate(name,el){
  const selected=document.getElementById('selectedTemplate'); if(selected) selected.textContent=name;
  document.querySelectorAll('.template-card').forEach(c=>c.classList.remove('selected'));
  el?.closest('.template-card')?.classList.add('selected');
  selectedStoryId=el?.closest('.template-card')?.dataset.storyId||'';
  renderPoseGuide(READY_STORIES.find(s=>s.id===selectedStoryId));
  document.getElementById('order')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function changeHero(d){if(currentMode==='ready')return;heroes=Math.max(0,heroes+d);document.getElementById('heroCount').textContent=heroes;updateTotal()}
function changePage(d){if(currentMode==='ready')return;pages=Math.max(0,pages+d);document.getElementById('pageCount').textContent=pages;updateTotal()}
function handleFiles(e){
  const files=Array.from(e.target.files||[]); uploadedCount=files.length;
  document.getElementById('uploadStatus').textContent=`Կցված է ${uploadedCount} նկար / առաջարկվող՝ 6-10`;
  const t=document.getElementById('thumbs'); if(t){t.innerHTML='';files.slice(0,18).forEach(f=>{const img=document.createElement('img');img.src=URL.createObjectURL(f);t.appendChild(img)})}
}
async function fakeSubmit(){
  const selectedStory=document.getElementById('selectedTemplate')?.textContent||'';
  if(currentMode==='ready' && (!selectedStory || selectedStory==='Դեռ ընտրված չէ')){alert('Խնդրում ենք ընտրել պատրաստի հեքիաթի տարբերակը։');return}
  if(uploadedCount<1){alert('Խնդրում ենք կցել երեխայի նկարները։');return}
  const childName=document.querySelector('input[placeholder="օր․ Էվա"]')?.value||'';
  const phone=document.querySelector('input[placeholder="+374"]')?.value||'';
  const age=document.querySelector('input[placeholder="օր․ 5"]')?.value||'';
  const gender=document.querySelector('.grid-2 select')?.value||'';
  const notes=document.querySelector('textarea')?.value||'';
  if(!phone){alert('Խնդրում ենք լրացնել հեռախոսահամարը։');return}
  const total=planPrice+heroes*2000+pages*2500;
  await AramazdCheckout.start({
    product: planName, customer_name: childName||'Չնշված', phone, price: total, deposit: total>7000?5000:total,
    details: {product_type:'fairytale',mode:currentMode,selected_story:selectedStory,selected_story_id:selectedStoryId,child_name:childName,age,gender,uploaded_count:uploadedCount,extra_heroes:heroes,extra_pages:pages,notes}
  });
}
document.addEventListener('DOMContentLoaded',()=>{setMode('custom');updateTotal();renderPoseGuide(null)});
