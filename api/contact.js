const json=(res,status,body)=>res.status(status).json(body);
const clean=v=>typeof v==='string'?v.trim():'';
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

export default async function handler(req,res){
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed.'});
  const name=clean(req.body?.name), email=clean(req.body?.email), subject=clean(req.body?.subject), message=clean(req.body?.message), company=clean(req.body?.company);
  if(company) return json(res,200,{message:'Thanks.'});
  if(!name||name.length>100||!validEmail(email)||email.length>200||!subject||subject.length>160||!message||message.length>5000) return json(res,400,{error:'Please check the form fields and try again.'});
  const key=process.env.RESEND_API_KEY, to=process.env.CONTACT_TO_EMAIL, from=process.env.RESEND_FROM_EMAIL;
  if(!key||!to||!from) return json(res,503,{error:'Email delivery is not configured yet.'});
  try{
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`Website: ${subject}`,html:`<h2>New website message</h2><p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><hr><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`})});
    if(!r.ok){console.error('Resend contact error',r.status,await r.text());return json(res,502,{error:'Email could not be sent right now.'});}
    return json(res,200,{message:'Message sent. Thank you.'});
  }catch(err){console.error(err);return json(res,500,{error:'Email could not be sent right now.'});}
}