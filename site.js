document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

async function submitJson(form,url,statusEl){
  const button=form.querySelector('button[type="submit"]');
  const old=button.textContent;
  button.disabled=true; button.textContent='Sending...';
  statusEl.className='status'; statusEl.textContent='';
  try{
    const data=Object.fromEntries(new FormData(form).entries());
    const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const body=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(body.error||'Something went wrong.');
    statusEl.className='status ok'; statusEl.textContent=body.message||'Done.';
    form.reset();
  }catch(err){
    statusEl.className='status error'; statusEl.textContent=err.message||'Unable to submit right now.';
  }finally{button.disabled=false;button.textContent=old;}
}

document.querySelectorAll('[data-subscribe-form]').forEach(form=>{
  form.addEventListener('submit',e=>{e.preventDefault();submitJson(form,'/api/subscribe',form.querySelector('.status'));});
});

document.querySelectorAll('[data-contact-form]').forEach(form=>{
  form.addEventListener('submit',e=>{e.preventDefault();submitJson(form,'/api/contact',form.querySelector('.status'));});
});