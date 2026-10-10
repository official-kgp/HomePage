import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { site } from './config/site';
import { dictionaries, languages, preferredLanguage, type Copy, type Language } from './locales';
import { ArticlePage } from './pages/article';
import { ContactPage } from './pages/contact';
import { HomePage } from './pages/home';
import { NewsPage } from './pages/news';
import { RulePage } from './pages/rule';
import { PreviewPage } from './pages/preview';
import { NotFoundPage } from './pages/notFound';
import { ServerPage } from './pages/server';
import './styles.css';

type Route =
  | { name: 'home' }
  | { name: 'server' }
  | { name: 'news' }
  | { name: 'article'; slug: string }
  | { name: 'contact' }
  | { name: 'rule' }
  | { name: 'preview' }
  | { name: 'notFound' };

function resolveRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'home' };
  if (path === '/server') return { name: 'server' };
  if (path === '/news') return { name: 'news' };
  if (path === '/contact') return { name: 'contact' };
  if (path === '/rule') return { name: 'rule' };
  if (path === '/preview') return { name: 'preview' };

  const articleMatch = path.match(/^\/news\/(.+)$/);
  if (articleMatch) {
    try {
      return { name: 'article', slug: decodeURIComponent(articleMatch[1]) };
    } catch {
      return { name: 'notFound' };
    }
  }

  return { name: 'notFound' };
}

function LanguagePicker({ language, copy, onChange }: { language: Language; copy: Copy; onChange: (next: Language) => void }) {
  return <div className="language-picker" role="group" aria-label={copy.nav.language}>
    {languages.map((option) => <button
      aria-label={option.label}
      aria-pressed={language === option.id}
      className={language === option.id ? 'language-button is-selected' : 'language-button'}
      key={option.id}
      onClick={() => onChange(option.id)}
      title={option.label}
      type="button"
    >{option.flag}</button>)}
  </div>;
}

function Header({ route, copy, language, onLanguageChange }: { route: Route; copy: Copy; language: Language; onLanguageChange: (next: Language) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const links = [
    { href: '/', label: copy.nav.home, active: route.name === 'home' },
    { href: '/server', label: copy.nav.server, active: route.name === 'server' },
    { href: '/news', label: copy.nav.news, active: route.name === 'news' || route.name === 'article' },
    { href: '/contact', label: copy.nav.contact, active: route.name === 'contact' },
  ];

  return <header className="site-header">
    <a className="brand" href="/" aria-label={copy.siteName}>
      <img src="https://img.suiten.site/Image/kgp-logo.png" alt="" />
      <span>{copy.siteName}</span>
    </a>
    <button className={menuOpen ? 'menu-toggle is-open' : menuClosing ? 'menu-toggle is-closing' : 'menu-toggle'} type="button" aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? copy.common.menuClose : copy.common.menuOpen} onClick={() => {
      if (menuOpen) {
        setMenuOpen(false);
        setMenuClosing(true);
        window.setTimeout(() => setMenuClosing(false), 680);
      } else {
        setMenuClosing(false);
        setMenuOpen(true);
      }
    }}>
      <span /><span /><span />
    </button>
    <nav className={menuOpen ? 'site-navigation is-open' : 'site-navigation'} id="site-navigation" aria-label={copy.common.mainNavigation}>
      {links.map((link) => <a className={link.active ? 'nav-link is-active' : 'nav-link'} href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
      <LanguagePicker language={language} copy={copy} onChange={(next) => { onLanguageChange(next); setMenuOpen(false); }} />
    </nav>
  </header>;
}

function Footer({ copy }: { copy: Copy }) {
  return <footer className="site-footer">
    <div className="footer-main">
      <div><img src="https://img.suiten.site/Image/kgp-logo.png" alt="Server Logo" /><h2>{copy.siteName}</h2></div>
      <div><p>{copy.footer.footerDescription1}</p><p>{copy.footer.footerDescription2}</p><p>{copy.footer.footerDescription3}</p></div>
      <div className="footer-contact"><span>{copy.common.contact}</span><a href={`mailto:${site.contact}`}>{site.contact}<span aria-hidden="true">↗</span></a></div>
    </div>
    <div className="footer-bottom">
      
      <div className="social-links" aria-label={copy.footer.follow}>
        <a href="https://x.com/official_kgp" target="_blank" rel="noreferrer">X ↗</a>
        <a href="https://instagram.com/kazamatai_gp" target="_blank" rel="noreferrer">Instagram ↗</a>
        <a href="https://www.youtube.com/@official_kgp" target="_blank" rel="noreferrer">YouTube ↗</a>
        <a href={site.inviteUrl} target="_blank" rel="noreferrer">Discord ↗</a>
        <a href="https://note.com/official_kgp" target="_blank" rel="noreferrer">note ↗</a>
      </div>
      <span>© 2025 - 2026 {copy.siteName}. {copy.footer.rights}</span>

    </div>
  </footer>;
}

function App() {
  const [language, setLanguage] = useState<Language>(preferredLanguage);
  const [pathname, setPathname] = useState(window.location.pathname);
  const copy = dictionaries[language];
  const route = resolveRoute(pathname);

  useEffect(() => {
    const updatePath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    localStorage.setItem('kgp-language', language);
    document.documentElement.lang = language;
    const pageTitle = route.name === 'home' ? copy.siteName : route.name === 'server' ? copy.nav.server : route.name === 'news' || route.name === 'article' ? copy.nav.news : route.name === 'contact' ? copy.nav.contact : route.name === 'preview' ? 'プレビュー認証' : copy.common.notFound;
    document.title = `${pageTitle} | ${copy.siteName}`;
  }, [copy, language, route.name]);

  const page = (() => {
    switch (route.name) {
      case 'home': return <HomePage copy={copy} language={language} inviteUrl={site.inviteUrl} />;
      case 'server': return <ServerPage copy={copy} inviteUrl={site.inviteUrl} />;
      case 'news': return <NewsPage copy={copy} language={language} />;
      case 'article': return <ArticlePage copy={copy} language={language} slug={route.slug} />;
      case 'contact': return <ContactPage copy={copy} contactEmail={site.contact} />;
      case 'rule': return <RulePage copy={copy} />;
      case 'preview': return <PreviewPage />;
      case 'notFound': return <NotFoundPage copy={copy} />;
    }
  })();

  return <>
    <a className="skip-link" href="#main-content">{copy.common.skip}</a>
    <Header route={route} copy={copy} language={language} onLanguageChange={setLanguage} />
    <main id="main-content">{page}</main>
    <Footer copy={copy} />
  </>;
}

const root = document.getElementById('app');
if (!root) throw new Error('App root was not found.');
createRoot(root).render(<App />);
