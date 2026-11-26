import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { site } from './config/site';
import { dictionaries, languages, preferredLanguage, type Copy, type Language } from './locales';
import { ArticlePage } from './pages/article';
import { ContactPage } from './pages/contact';
import { FaqPage } from './pages/faq';
import { GuidePage } from './pages/guide';
import { HomePage } from './pages/home';
import { NewsPage } from './pages/news';
import { PrivacyPage } from './pages/privacy';
import { PreviewPage } from './pages/preview';
import { NotFoundPage } from './pages/notFound';
import { ServerPage } from './pages/server';
import { TermsPage } from './pages/terms';
import RulePage from './pages/rule';
import './styles.css';

type Route =
  | { name: 'home' } | { name: 'server' } | { name: 'guide' } | { name: 'faq' }
  | { name: 'news' } | { name: 'article'; slug: string } | { name: 'contact' }
  | { name: 'rule' } | { name: 'terms' } | { name: 'privacy' }
  | { name: 'preview' } | { name: 'notFound' };

function resolveRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'home' };
  if (path === '/server') return { name: 'server' };
  if (path === '/guide') return { name: 'guide' };
  if (path === '/faq') return { name: 'faq' };
  if (path === '/news') return { name: 'news' };
  if (path === '/contact') return { name: 'contact' };
  if (path === '/rule' || path === '/rules') return { name: 'rule' };
  if (path === '/terms' || path === '/tos') return { name: 'terms' };
  if (path === '/privacy') return { name: 'privacy' };
  if (path === '/preview') return { name: 'preview' };
  const articleMatch = path.match(/^\/news\/(.+)$/);
  if (articleMatch) {
    try { return { name: 'article', slug: decodeURIComponent(articleMatch[1]) }; }
    catch { return { name: 'notFound' }; }
  }
  return { name: 'notFound' };
}

function OpeningScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem('kgp-opening-seen') === '1') return;
    setVisible(true);
    const hide = window.setTimeout(() => setLeaving(true), 1900);
    const remove = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('kgp-opening-seen', '1');
    }, 2550);
    return () => { window.clearTimeout(hide); window.clearTimeout(remove); };
  }, []);
  if (!visible) return null;
  return <div className={leaving ? 'opening-screen is-leaving' : 'opening-screen'} role="status" aria-label="KGP welcome">
    <div className="opening-noise" /><div className="opening-sweep" />
    <div className="opening-symbol"><span>K</span><i>✳</i><span>G</span><i>✧</i><span>P</span></div>
    <p className="opening-name">KAZAMATAI GATHERING PLACE</p><p className="opening-jp">あなたの「好き」で、みんなの居場所を。</p>
    <div className="opening-loader"><span /></div><small className="opening-coord">COMMUNITY NODE / 001</small>
  </div>;
}

function LanguagePicker({ language, copy, onChange }: { language: Language; copy: Copy; onChange: (next: Language) => void }) {
  return <div className="language-picker" role="group" aria-label={copy.nav.language}>
    {languages.map((option) => <button aria-label={option.label} aria-pressed={language === option.id}
      className={language === option.id ? 'language-button is-selected' : 'language-button'}
      key={option.id} onClick={() => onChange(option.id)} title={option.label} type="button">{option.flag}</button>)}
  </div>;
}

function Header({ route, copy, language, onLanguageChange }: { route: Route; copy: Copy; language: Language; onLanguageChange: (next: Language) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const links = [
    { href: '/', label: copy.nav.home, active: route.name === 'home' },
    { href: '/server', label: 'サーバー紹介', active: route.name === 'server' },
    { href: '/guide', label: '参加ガイド', active: route.name === 'guide' },
    { href: '/news', label: copy.nav.news, active: route.name === 'news' || route.name === 'article' },
    { href: '/faq', label: 'FAQ', active: route.name === 'faq' },
    { href: '/rule', label: 'ルール', active: route.name === 'rule' },
    { href: '/contact', label: copy.nav.contact, active: route.name === 'contact' },
  ];
  const closeMenu = () => {
    setMenuOpen(false);
    setMenuClosing(true);
    window.setTimeout(() => setMenuClosing(false), 550);
  };
  return <header className="site-header">
    <a className="brand" href="/" aria-label={copy.siteName}><img src="https://img.suiten.site/Image/kgp-logo.png" alt="" /><span>{copy.siteName}<small>OFFICIAL COMMUNITY</small></span></a>
    <button className={menuOpen ? 'menu-toggle is-open' : menuClosing ? 'menu-toggle is-closing' : 'menu-toggle'} type="button"
      aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? copy.common.menuClose : copy.common.menuOpen}
      onClick={() => menuOpen ? closeMenu() : (setMenuClosing(false), setMenuOpen(true))}><span /><span /><span /></button>
    <nav className={menuOpen ? 'site-navigation is-open' : 'site-navigation'} id="site-navigation" aria-label={copy.common.mainNavigation}>
      {links.map((link) => <a className={link.active ? 'nav-link is-active' : 'nav-link'} href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
      <LanguagePicker language={language} copy={copy} onChange={(next) => { onLanguageChange(next); setMenuOpen(false); }} />
    </nav>
  </header>;
}

function Footer({ copy }: { copy: Copy }) {
  return <footer className="site-footer">
    <div className="footer-main">
      <div><img className="logo" src="https://img.suiten.site/Image/kgp-logo.png" alt="Server Logo" /><h2>{copy.siteName}</h2></div>
      <div><p>{copy.footer.footerDescription1}</p><p>{copy.footer.footerDescription2}</p><p>{copy.footer.footerDescription3}</p></div>
      <div className="footer-contact"><span>{copy.common.contact}</span><a href={\`mailto:\${site.contact}\`}>{site.contact}<span aria-hidden="true">↗</span></a></div>
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
    const titles: Record<Route['name'], string> = {
      home: copy.siteName, server: 'サーバー紹介', guide: '参加ガイド', faq: 'よくある質問',
      news: copy.nav.news, article: copy.nav.news, contact: copy.nav.contact, rule: 'コミュニティルール',
      terms: '利用規約', privacy: 'プライバシーポリシー', preview: 'プレビュー認証', notFound: copy.common.notFound,
    };
    document.title = \`\${titles[route.name]} | \${copy.siteName}\`;
  }, [copy, language, route.name]);
  const page = (() => {
    switch (route.name) {
      case 'home': return <HomePage copy={copy} language={language} inviteUrl={site.inviteUrl} />;
      case 'server': return <ServerPage copy={copy} inviteUrl={site.inviteUrl} />;
      case 'guide': return <GuidePage copy={copy} inviteUrl={site.inviteUrl} />;
      case 'faq': return <FaqPage />;
      case 'news': return <NewsPage copy={copy} language={language} />;
      case 'article': return <ArticlePage copy={copy} language={language} slug={route.slug} />;
      case 'contact': return <ContactPage copy={copy} contactEmail={site.contact} />;
      case 'rule': return <RulePage />;
      case 'terms': return <TermsPage />;
      case 'privacy': return <PrivacyPage />;
      case 'preview': return <PreviewPage />;
      case 'notFound': return <NotFoundPage copy={copy} />;
    }
  })();
  return <>
    <OpeningScreen /><a className="skip-link" href="#main-content">{copy.common.skip}</a>
    <Header route={route} copy={copy} language={language} onLanguageChange={setLanguage} />
    <main id="main-content" className="page-transition" key={pathname}>{page}</main>
    <Footer copy={copy} />
  </>;
}

const root = document.getElementById('app');
if (!root) throw new Error('App root was not found.');
createRoot(root).render(<App />);
