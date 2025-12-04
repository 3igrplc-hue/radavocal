/* scripts.js
   Parallax, burger toggle, gold particles, small helpers
*/

/* ---------- Burger ---------- */
(function(){
  const burger = document.getElementById('burgerBtn');
  const mobile = document.getElementById('mobileNav');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      mobile.classList.toggle('open');
      burger.classList.toggle('open');
    });
  }
})();

/* ---------- Smooth scroll for in-page anchors ---------- */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        const top = el.offsetTop - 70;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile nav if open
        const mobile = document.getElementById('mobileNav');
        if (mobile && mobile.classList.contains('open')) mobile.classList.remove('open');
      }
    });
  });
})();

/* ---------- Parallax & subtle floats ---------- */
(function(){
  const logo = document.querySelector('.hero-logo-bg');
  const singer = document.querySelector('.hero-singer');

  // add float class to singer if present
  if (singer) singer.classList.add('animate');

  window.addEventListener('scroll', () => {
    const sc = window.scrollY || window.pageYOffset;
    if (logo) {
      // slow move downward + tiny scale
      logo.style.transform = `translateX(-50%) translateY(${sc * 0.06}px)`;
    }
    if (singer) {
      // singer moves a bit faster
      singer.style.transform = `translateY(${sc * 0.14}px)`;
    }
  }, { passive: true });
})();

/* ---------- Gold particles (canvas) ---------- */
(function(){
  const canvas = document.getElementById('goldParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], particleCount = 30;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function init(){
    particles = [];
    for (let i=0;i<particleCount;i++){
      particles.push({
        x: rand(W*0.1, W*0.9),
        y: rand(H*0.05, H*0.6),
        r: rand(1, 4),
        vx: rand(-0.1,0.1),
        vy: rand(-0.15,0.15),
        alpha: rand(0.05,0.45),
        swing: rand(0.6,1.8)
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    for (let p of particles){
      p.x += p.vx;
      p.y += p.vy + Math.sin(Date.now() * 0.001 * p.swing) * 0.15;
      if (p.x < -50) p.x = W + 50;
      if (p.x > W + 50) p.x = -50;
      if (p.y < -50) p.y = H + 50;
      if (p.y > H + 50) p.y = -50;

      // radial gradient for soft gold
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*6);
      g.addColorStop(0, `rgba(212,166,103,${p.alpha})`);
      g.addColorStop(0.5, `rgba(212,166,103,${p.alpha*0.45})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();
})();

/* ---------- Simple FAQ toggle (progressive enhancement) ---------- */
(function(){
  document.querySelectorAll('.faq-question').forEach(q=>{
    q.style.cursor = 'pointer';
    q.addEventListener('click', ()=>{
      const parent = q.parentElement;
      const answer = parent.querySelector('.faq-answer') || parent.querySelector('p');
      if (!answer) return;
      const isOpen = parent.classList.contains('open');
      if (isOpen) {
        parent.classList.remove('open');
        answer.style.maxHeight = '0px';
      } else {
        parent.classList.add('open');
        answer.style.maxHeight = (answer.scrollHeight + 24) + 'px';
      }
    });
  });
})();
