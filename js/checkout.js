window.AramazdCheckout = {
  saveDraft(draft){ draft.created_at_local = new Date().toISOString(); localStorage.setItem('aramazd_pending_checkout', JSON.stringify(draft)); },
  getDraft(){ try { return JSON.parse(localStorage.getItem('aramazd_pending_checkout') || 'null'); } catch(e){ return null; } },
  clearDraft(){ localStorage.removeItem('aramazd_pending_checkout'); },
  async start(draft, opts){
    this.saveDraft(draft);

    const checkoutPath = (opts && opts.checkoutPath) || '../checkout.html';
    const loginPath = (opts && opts.loginPath) || '../login.html';

    // Պատվերի ճիշտ հերթականությունը՝ ՄԻՇՏ նախ Մուտք, հետո Գրանցում հղումը, հետո Checkout
    // Նույնիսկ եթե օգտատերը արդեն մուտք գործած է, սկզբում բացում ենք մուտքի էջը։
    location.href = loginPath + '?next=' + encodeURIComponent(checkoutPath);
  },
  safeName(name){return String(name||'file').replace(/[^\w.\-]+/g,'_').toLowerCase();},
  async upload(bucket,path,file){
    const res=await aramazdClient.storage.from(bucket).upload(path,file,{cacheControl:'3600',upsert:true,contentType:file.type||undefined});
    if(res.error) throw res.error;
    return aramazdClient.storage.from(bucket).getPublicUrl(path)?.data?.publicUrl || '';
  },
  async createOrderFromDraft(opts={}){
    const draft = this.getDraft(); if(!draft) throw new Error('Պատվերի տվյալները չեն գտնվել։');
    const session = await Aramazd.getSession(); if(!session || !session.user) throw new Error('Մուտք գործեք պատվերը ավարտելու համար։');
    const user = session.user; const profile = await Aramazd.ensureProfile(user);
    const price = Number(draft.price || 0);
    const dueNow = price <= 7000 ? price : 5000;
    const paymentType = price <= 7000 ? 'full_payment' : 'deposit';
    const { data, error } = await aramazdClient.from('orders').insert([{
      user_id: user.id,
      product: draft.product || 'Պատվեր', status: 'Նոր պատվեր', payment_status: 'Սպասում է հաստատման',
      deposit_amount: dueNow, paid_amount: 0, remaining_amount: Math.max(price-dueNow,0), final_payment_status: 'Չվճարված',
      customer_name: draft.customer_name || profile?.full_name || user.user_metadata?.full_name || user.email,
      phone: draft.phone || profile?.phone || '', price,
      recipient_name: opts.delivery?.recipient_name || '', delivery_phone: opts.delivery?.delivery_phone || '', delivery_city: opts.delivery?.delivery_city || '', delivery_address: opts.delivery?.delivery_address || '', postal_code: opts.delivery?.postal_code || '', delivery_note: opts.delivery?.delivery_note || '',
      details: { ...(draft.details || {}), payment_type: paymentType, due_now: dueNow, customer_email: user.email }
    }]).select().single();
    if(error) throw error;
    const orderId=data.id; const updates={};
    if(opts.receiptFile){ updates.receipt_url = await this.upload('receipts',`order-${orderId}/${Date.now()}-${this.safeName(opts.receiptFile.name)}`,opts.receiptFile); }
    const photoUrls=[];
    for(const f of (opts.photoFiles||[])) photoUrls.push(await this.upload('order-photos',`order-${orderId}/${Date.now()}-${this.safeName(f.name)}`,f));
    if(photoUrls.length) updates.order_photos = photoUrls;
    let final=data;
    if(Object.keys(updates).length){
      const upd=await aramazdClient.from('orders').update(updates).eq('id',orderId).select().single();
      if(upd.error) throw upd.error; final=upd.data;
    }
    this.clearDraft(); return final;
  }
};