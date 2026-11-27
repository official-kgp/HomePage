import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { site } from './config/site';
import { dictionaries, languages, preferredLanguage, type Copy, type Language } from './locales';
import { ArticlePage } from './pages/article';
import { ContactPage } from './pages/contact';
import { FaqPage } from './pages/faq';
import { GuidePage } from './pages/guide';
import { HomePage } from './pages/home';
import { IrohaProfilePage } from './pages/iroha';
import { IrohaMusicPage } from './pages/irohaMusic';
import { IrohaStreamsPage } from './pages/irohaStreams';
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
  | { name: 'preview' } | { name: 'iroha' } | { name: 'irohaMusic' } | { name: 'irohaStreams' } | { name: 'notFound' };

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
  if (path === '/iroha') return { name: 'iroha' };
  if (path === '/iroha/music') return { name: 'irohaMusic' };
  if (path === '/iroha/streams' || path === '/iroha/stream') return { name: 'irohaStreams' };
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

function ScrollRevealObserver() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observed = new WeakSet<Element>();
    let observer: IntersectionObserver | null = null;
    const reveal = (root: ParentNode) => {
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
      if (reduced || !('IntersectionObserver' in window)) {
        nodes.forEach((node) => node.classList.add('is-visible'));
        return;
      }
      if (!observer) {
        observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        }), { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
      }
      nodes.forEach((node) => {
        if (!observed.has(node)) {
          observed.add(node);
          observer?.observe(node);
        }
      });
    };
    reveal(document);
    const mutation = new MutationObserver((records) => records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) reveal(node);
      });
    }));
    mutation.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true });
    return () => { mutation.disconnect(); observer?.disconnect(); };
  }, []);
  return null;
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
  const activeIroha = ['iroha', 'irohaMusic', 'irohaStreams'].includes(route.name);
  const activeServer = ['server', 'guide', 'faq', 'rule'].includes(route.name);
  const activeCommunity = ['news', 'article', 'contact'].includes(route.name);
  const activeLegal = ['terms', 'privacy'].includes(route.name);
  const activeGroup = activeIroha ? 'iroha' : activeServer ? 'server' : activeCommunity ? 'community' : activeLegal ? 'legal' : null;
  const [expandedGroup, setExpandedGroup] = useState<string | null>(activeGroup ?? 'iroha');

  useEffect(() => {
    setExpandedGroup(activeGroup ?? 'iroha');
  }, [activeGroup]);

  const toggleGroup = (key: string) => setExpandedGroup((current) => current === key ? null : key);
  const closeMenu = () => setMenuOpen(false);
  const isExpanded = (key: string) => expandedGroup === key;

  return <header className="site-header">
    <a className="brand" href="/" aria-label={copy.siteName} onClick={closeMenu}>
      <img src="https://img.suiten.site/Image/kgp-logo.png" alt="" />
      <span>{copy.siteName}<small>OFFICIAL COMMUNITY / PORTAL</small></span>
    </a>
    <button className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'} type="button"
      aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? copy.common.menuClose : copy.common.menuOpen}
      onClick={() => setMenuOpen((open) => !open)}>
      <span /><span />
    </button>
    <nav className={menuOpen ? 'site-navigation is-open' : 'site-navigation'} id="site-navigation" aria-label={copy.common.mainNavigation}>
      <div className="nav-mobile-heading"><span>EXPLORE KGP</span><small>FIND YOUR WAY</small></div>

      <a className={route.name === 'home' ? 'nav-link is-active' : 'nav-link'} href="/"
        aria-current={route.name === 'home' ? 'page' : undefined} onClick={closeMenu}>
        <span className="nav-index">00</span><span>{copy.nav.home}</span>
      </a>

      <div className={activeGroup === 'server' ? 'nav-group is-current' : 'nav-group'}>
        <button className={activeGroup === 'server' ? 'nav-group-trigger is-active' : 'nav-group-trigger'} type="button"
          aria-expanded={isExpanded('server')} aria-controls="submenu-server" onClick={() => toggleGroup('server')}>
          <span><i className="nav-index">01</i>サーバー</span><b className="nav-chevron" aria-hidden="true">›</b>
        </button>
        <div className={isExpanded('server') ? 'nav-submenu is-expanded' : 'nav-submenu'} id="submenu-server">
          <a className={route.name === 'server' ? 'is-current' : undefined} href="/server" onClick={closeMenu} aria-current={route.name === 'server' ? 'page' : undefined}>サーバー紹介 <small>ABOUT KGP</small></a>
          <a className={route.name === 'guide' ? 'is-current' : undefined} href="/guide" onClick={closeMenu} aria-current={route.name === 'guide' ? 'page' : undefined}>参加ガイド <small>GETTING STARTED</small></a>
          <a className={route.name === 'faq' ? 'is-current' : undefined} href="/faq" onClick={closeMenu} aria-current={route.name === 'faq' ? 'page' : undefined}>よくある質問 <small>FAQ</small></a>
          <a className={route.name === 'rule' ? 'is-current' : undefined} href="/rule" onClick={closeMenu} aria-current={route.name === 'rule' ? 'page' : undefined}>コミュニティルール <small>GUIDELINES</small></a>
        </div>
      </div>

      <div className={activeGroup === 'iroha' ? 'nav-group is-current' : 'nav-group'}>
        <button className={activeGroup === 'iroha' ? 'nav-group-trigger is-active' : 'nav-group-trigger'} type="button"
          aria-expanded={isExpanded('iroha')} aria-controls="submenu-iroha" onClick={() => toggleGroup('iroha')}>
          <span><i className="nav-index">02</i>風真いろは</span><b className="nav-chevron" aria-hidden="true">›</b>
        </button>
        <div className={isExpanded('iroha') ? 'nav-submenu is-expanded' : 'nav-submenu'} id="submenu-iroha">
          <a className={route.name === 'iroha' ? 'is-current' : undefined} href="/iroha" onClick={closeMenu} aria-current={route.name === 'iroha' ? 'page' : undefined}>プロフィール <small>PROFILE</small></a>
          <a className={route.name === 'irohaStreams' ? 'is-current' : undefined} href="/iroha/streams" onClick={closeMenu} aria-current={route.name === 'irohaStreams' ? 'page' : undefined}>Video <small>STREAMS & ARCHIVES</small></a>
          <a className={route.name === 'irohaMusic' ? 'is-current' : undefined} href="/iroha/music" onClick={closeMenu} aria-current={route.name === 'irohaMusic' ? 'page' : undefined}>Music <small>OFFICIAL RELEASES</small></a>
        </div>
      </div>

      <div className={activeGroup === 'community' ? 'nav-group is-current' : 'nav-group'}>
        <button className={activeGroup === 'community' ? 'nav-group-trigger is-active' : 'nav-group-trigger'} type="button"
          aria-expanded={isExpanded('community')} aria-controls="submenu-community" onClick={() => toggleGroup('community')}>
          <span><i className="nav-index">03</i>コミュニティ</span><b className="nav-chevron" aria-hidden="true">›</b>
        </button>
        <div className={isExpanded('community') ? 'nav-submenu is-expanded' : 'nav-submenu'} id="submenu-community">
          <a className={['news', 'article'].includes(route.name) ? 'is-current' : undefined} href="/news" onClick={closeMenu} aria-current={['news', 'article'].includes(route.name) ? 'page' : undefined}>お知らせ <small>NEWS & JOURNAL</small></a>
          <a className={route.name === 'contact' ? 'is-current' : undefined} href="/contact" onClick={closeMenu} aria-current={route.name === 'contact' ? 'page' : undefined}>お問い合わせ <small>CONTACT</small></a>
        </div>
      </div>

      <div className={activeGroup === 'legal' ? 'nav-group is-current' : 'nav-group'}>
        <button className={activeGroup === 'legal' ? 'nav-group-trigger is-active' : 'nav-group-trigger'} type="button"
          aria-expanded={isExpanded('legal')} aria-controls="submenu-legal" onClick={() => toggleGroup('legal')}>
          <span><i className="nav-index">04</i>サイト情報</span><b className="nav-chevron" aria-hidden="true">›</b>
        </button>
        <div className={isExpanded('legal') ? 'nav-submenu is-expanded' : 'nav-submenu'} id="submenu-legal">
          <a className={route.name === 'terms' ? 'is-current' : undefined} href="/terms" onClick={closeMenu} aria-current={route.name === 'terms' ? 'page' : undefined}>利用規約 <small>TERMS OF SERVICE</small></a>
          <a className={route.name === 'privacy' ? 'is-current' : undefined} href="/privacy" onClick={closeMenu} aria-current={route.name === 'privacy' ? 'page' : undefined}>プライバシー <small>PRIVACY POLICY</small></a>
        </div>
      </div>

      <div className="nav-bottom">
        <LanguagePicker language={language} copy={copy} onChange={(next) => { onLanguageChange(next); closeMenu(); }} />
        <a className="nav-join" href={site.inviteUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Discordに参加 <b>↗</b></a>
      </div>
    </nav>
    {menuOpen && <button className="nav-scrim" aria-label="メニューを閉じる" onClick={closeMenu} type="button" />}
  </header>;
}
function Footer({ copy }: { copy: Copy }) {
  return <footer className="site-footer">
    <div className="footer-main">
      <div><img className="logo" src="https://img.suiten.site/Image/kgp-logo.png" alt="Server Logo" /><h2>{copy.siteName}</h2></div>
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
    const titles: Record<Route['name'], string> = {
      home: copy.siteName, server: 'サーバー紹介', guide: '参加ガイド', faq: 'よくある質問',
      news: copy.nav.news, article: copy.nav.news, contact: copy.nav.contact, rule: 'コミュニティルール',
      terms: '利用規約', privacy: 'プライバシーポリシー', preview: 'プレビュー認証',
      iroha: '風真いろは プロフィール', irohaMusic: '風真いろは 音楽', irohaStreams: '風真いろは 配信', notFound: copy.common.notFound,
    };
    document.title = `${titles[route.name]} | ${copy.siteName}`;
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
      case 'iroha': return <IrohaProfilePage />;
      case 'irohaMusic': return <IrohaMusicPage />;
      case 'irohaStreams': return <IrohaStreamsPage />;
      case 'notFound': return <NotFoundPage copy={copy} />;
    }
  })();
  return <>
    <OpeningScreen /><ScrollRevealObserver /><a className="skip-link" href="#main-content">{copy.common.skip}</a>
    <Header route={route} copy={copy} language={language} onLanguageChange={setLanguage} />
    <main id="main-content" className="page-transition" key={pathname}>{page}</main>
    <Footer copy={copy} />
  </>;
}

const root = document.getElementById('app');
if (!root) throw new Error('App root was not found.');
createRoot(root).render(<App />);
