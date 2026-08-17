// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle){
  navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> navLinks.classList.remove('open')));
}

// scroll reveal (also triggers skill bar fill + counts when in view)
const revealEls = document.querySelectorAll('.reveal, .exp-node');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      e.target.querySelectorAll('.skill-bar-fill').forEach(fill=>{
        fill.style.width = fill.dataset.level + '%';
      });
      io.unobserve(e.target);
    }
  });
}, {threshold:0.15, rootMargin:"0px 0px -60px 0px"});
revealEls.forEach(el=>io.observe(el));

// typing effect (home page only)
const typedEl = document.getElementById('typedText');
if(typedEl){
  const phrases = ["reduced approval turnaround by 90%", "shipped DPM across multiple departments", "building on ASP.NET Core + Angular 17+"];
  let pIndex = 0, cIndex = 0, deleting = false;
  function typeLoop(){
    const current = phrases[pIndex];
    if(!deleting){
      cIndex++;
      typedEl.textContent = current.slice(0, cIndex);
      if(cIndex === current.length){ deleting = true; setTimeout(typeLoop, 1600); return; }
    } else {
      cIndex--;
      typedEl.textContent = current.slice(0, cIndex);
      if(cIndex === 0){ deleting = false; pIndex = (pIndex+1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 30 : 55);
  }
  typeLoop();
}

// contact form — submit via fetch so the page never redirects
const form = document.getElementById('contactForm');
if(form){
  const submitBtn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';
    try{
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if(res.ok){
        status.textContent = "Message sent — thanks, I'll get back to you soon.";
        status.className = 'form-status ok';
        form.reset();
      } else {
        throw new Error('Request failed');
      }
    } catch(err){
      status.textContent = 'Something went wrong — please email me directly instead.';
      status.className = 'form-status err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message →';
    }
  });
}