// Fetch common header/footer and init nav active state
(async function(){
  async function loadInclude(path, id){
    try{
      const res = await fetch(path);
      if(!res.ok) return;
      const html = await res.text();
      document.getElementById(id).innerHTML = html;
      initNav();
    }catch(e){
      console.warn('include load failed', path, e);
    }
  }
  await loadInclude('/_includes/header.html', 'site-header');
  await loadInclude('/_includes/footer.html', 'site-footer');

  // init nav active
  function initNav(){
    const links = document.querySelectorAll('.site-nav .nav, .brand-link');
    const path = location.pathname.replace(/\/$/, '') || '/';
    links.forEach(a=>{
      a.classList.remove('active');
      const href = a.getAttribute('href');
      if(href === path) a.classList.add('active');
    });
  }

  // keyboard shortcuts: t toggles theme
  document.addEventListener('keydown', (e)=>{
    if(e.key === 't'){
      const root = document.documentElement;
      const cur = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = cur === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('site-theme', next);
    }
  });

  // restore theme
  const saved = localStorage.getItem('site-theme');
  if(saved) document.documentElement.setAttribute('data-theme', saved);

  // simple focus outline for keyboard users
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();
