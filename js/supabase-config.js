
// Aramazd Art — Supabase shared config
window.ARAMAZD_SUPABASE_URL = 'https://xxbvitnrnloscrrmlaui.supabase.co';
window.ARAMAZD_SUPABASE_KEY = 'sb_publishable_4_qeOASRgzI1mEpEioICow_hHSB5HPi';

window.aramazdClient = window.supabase.createClient(
  window.ARAMAZD_SUPABASE_URL,
  window.ARAMAZD_SUPABASE_KEY
);

window.Aramazd = window.Aramazd || {};
window.Aramazd.client = window.aramazdClient;

window.Aramazd.money = function(value){
  return Number(value || 0).toLocaleString('hy-AM') + ' դր․';
};

window.Aramazd.getSession = async function(){
  const { data } = await window.aramazdClient.auth.getSession();
  return data.session || null;
};

window.Aramazd.getProfile = async function(userId){
  const { data, error } = await window.aramazdClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if(error) throw error;
  return data;
};

window.Aramazd.ensureProfile = async function(user, extra){
  if(!user) return null;
  const profile = await window.Aramazd.getProfile(user.id).catch(()=>null);
  if(profile) return profile;
  const payload = Object.assign({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email || '',
    phone: user.user_metadata?.phone || '',
    role: 'customer'
  }, extra || {});
  const { data, error } = await window.aramazdClient
    .from('profiles')
    .insert([payload])
    .select()
    .single();
  if(error) console.warn('profile insert error', error.message);
  return data || payload;
};
