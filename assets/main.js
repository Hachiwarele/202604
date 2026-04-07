// Fetch common header/footer and init nav active state
(async function(){
  // helper to load include with fallback
  async function loadInclude(path, id){
    try{
      const res = await fetch(path, {cache: "no-store"});
      if(!res.ok) {
        console.warn('include not found', path, res.status);
        return;
      }
      const html = await res.text();
      document.getElementById(id).innerHTML = html;
      initNav();
    }catch(e){
      console.warn('include load failed', path, e);
    }
  }

  // compute base path robustly so includes work on subpaths
  function computeBasePath(){
    const p = location.pathname;
    // If path ends with a filename like /202604/index.html -> remove filename
    if(p.endsWith('/')) return p;
    return p.replace(/\/[^\/]*$/, '/');
  }
  const basePath = computeBasePath();

  await loadInclude(basePath + '_includes/header.html', 'site-header');
  await loadInclude(basePath + '_includes/footer.html', 'site-footer');

  // init nav active
  function initNav(){
    const links = document.querySelectorAll('.site-nav .nav, .brand-link');
    const path = location.pathname.replace(/\/$/, '') || '/';
    links.forEach(a=>{
      a.classList.remove('active');
      const href = a.getAttribute('href');
      // normalize href to absolute-ish for comparison
      const resolved = new URL(href, location.origin + basePath).pathname.replace(/\/$/, '');
      if(resolved === path) a.classList.add('active');
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
