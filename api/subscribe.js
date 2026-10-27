const json=(res,status,body)=>res.status(status).json(body);
const clean=v=>typeof v==='string'?v.trim():'';
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default async function handler(req,res){
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed.'});
  const email=clean(req.body?.email), company=clean(req.body?.company);
  if(company) return json(res,200,{message:'Thanks.'});
  if(!validEmail(email)||email.length>200) return json(res,400,{error:'Please enter a valid email address.'});
  const key=process.env.RESEND_API_KEY, audience=process.env.RESEND_AUDIENCE_ID;
  if(!key||!audience) return json(res,503,{error:'Subscriptions are not configured yet.'});
  try{
    const r=await fetch(`https://api.resend.com/audiences/${audience}/contacts`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({email,unsubscribed:false})});
    if(!r.ok){const text=await r.text();console.error('Resend subscribe error',r.status,text);if(r.status===409) return json(res,200,{message:'You are already subscribed.'});return json(res,502,{error:'Subscription could not be completed right now.'});}
    return json(res,200,{message:'Subscribed. Thank you.'});
  }catch(err){console.error(err);return json(res,500,{error:'Subscription could not be completed right now.'});}
}