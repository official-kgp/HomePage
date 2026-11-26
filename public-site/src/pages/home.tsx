import { useEffect, useState } from 'react';
import { getNews, type News } from '../lib/api';
import type { Copy, Language } from '../locales';

type HomePageProps = { copy: Copy; language: Language; inviteUrl: string };

function LatestNews({ copy, language }: Pick<HomePageProps, 'copy' | 'language'>) {
  const [items, setItems] = useState<News[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    getNews()
      .then((news) => {
        if (!active) return;
        setItems(news.slice(0, 3));
        setState('ready');
      })
      .catch(() => active && setState('error'));
    return () => { active = false; };
  }, []);

  return <div className="latest-news" data-reveal>
    {state === 'loading' && <p className="quiet">{copy.news.loading}</p>}
    {state === 'error' && <p className="quiet">{copy.news.error}</p>}
    {state === 'ready' && items.length === 0 && <p className="quiet">{copy.news.empty}</p>}
    {items.map((item, index) => <a className="latest-row" href={`/news/${encodeURIComponent(item.slug)}`} key={item.id}>
      <span className="latest-index">0{index + 1}</span>
      <span className="latest-copy"><small>{item.category}</small><strong>{item.title}</strong></span>
      <time>{item.published_at ? new Date(item.published_at).toLocaleDateString(language) : ''}</time>
      <span aria-hidden="true" className="row-arrow">↗</span>
    </a>)}
  </div>;
}

const communityCards = [
  { number: '01', icon: '✳', title: '好きなことを、好きなペースで。', body: '配信の感想も、日常の雑談も。テキスト・ボイスチャットを通じて、それぞれの距離感で交流できます。', tag: 'COMMUNITY' },
  { number: '02', icon: '✧', title: '一緒に楽しむ、特別な時間。', body: '同時視聴やクイズなどのイベントを不定期で開催。メンバーのアイデアから新しい企画も生まれます。', tag: 'EVENT' },
  { number: '03', icon: '⌘', title: 'コミュニティを支える独自機能。', body: 'AIコンテンツやおみくじ、Rank機能など、独自Botを活用したKGPならではの体験を用意しています。', tag: 'DEVELOP' },
  { number: '04', icon: '◎', title: '話すことだけが、参加じゃない。', body: 'ROM専の方も、自分のペースで楽しめる環境づくりを大切にしています。少人数で話せる個室型VCもあります。', tag: 'YOUR STYLE' },
  { number: '05', icon: '文', title: '言葉や国籍を越えてつながる。', body: '日本語を含む複数言語での案内を整備。さまざまな背景を持つ人が参加できるコミュニティを目指します。', tag: 'GLOBAL' },
  { number: '06', icon: '盾', title: '安心して過ごせる場所を目指して。', body: 'セキュリティ、ルール、運営体制を継続的に見直し、自由度と安全性のバランスを大切にしています。', tag: 'SAFETY' },
];

export function HomePage({ copy, language, inviteUrl }: HomePageProps) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -36px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <>
    <section className="home-hero">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-mark" />{copy.home.eyebrow}<span className="hero-live-dot" /></p>
        <p className="hero-kicker">WELCOME TO KAZAMATAI COMMUNITY</p>
        <h1>{copy.home.title}</h1>
        <p className="hero-intro">{copy.home.intro}</p>
        <p className="hero-description">{copy.home.description}</p>
        <div className="hero-actions">
          <a className="button button-ink hero-join" href={inviteUrl} target="_blank" rel="noreferrer">{copy.home.join}<span aria-hidden="true">↗</span></a>
          <a className="text-link" href="/server">{copy.nav.server}<span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-meta"><span>FAN COMMUNITY</span><i /><span>HOLOLIVE / HOLOX</span><i /><span>EST. 2025</span></div>
      </div>
      <figure className="hero-image-wrap">
        <div className="hero-image-halo" />
        <img className="hero-image" src="/logo.png" alt={copy.siteName} />
        <span className="hero-float hero-float-top">KGP <b>✳</b></span>
        <span className="hero-float hero-float-bottom">YOUR PLACE, YOUR PACE.</span>
        <figcaption><span>{copy.home.heroCaption}</span><span>{copy.home.heroStamp}</span></figcaption>
      </figure>
      <span aria-hidden="true" className="hero-index">01 <i /> 04</span>
      <a className="hero-scroll" href="#about"><span />SCROLL TO EXPLORE</a>
    </section>

    <section className="manifesto-band" id="about">
      <div className="manifesto-grid" aria-hidden="true"><span>K</span><span>G</span><span>P</span></div>
      <div className="manifesto-content" data-reveal>
        <p className="eyebrow">OUR PHILOSOPHY <span className="eyebrow-mark" /></p>
        <h2>{copy.tagline}</h2>
        <p>同じ「好き」を持つ人たちが出会い、それぞれの楽しみ方で過ごせる場所へ。<br />KGPは、メンバーと一緒に育てていくコミュニティです。</p>
      </div>
      <span aria-hidden="true" className="manifesto-orb" />
    </section>

    <section className="content-section feature-section">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow">WHAT YOU CAN DO HERE <span className="eyebrow-mark" /></p><h2>「好き」が広がる、<br className="mobile-break" />6つの楽しみ方。</h2></div>
        <p className="section-aside">A COMMUNITY MADE<br />TO BE YOUR PLACE.</p>
      </div>
      <div className="feature-grid">
        {communityCards.map((feature, index) => <article className="feature-card" data-reveal key={feature.number}>
          <div className="feature-card-top"><span className="feature-number">{feature.number}</span><span className="feature-icon">{feature.icon}</span></div>
          <p className="feature-tag">{feature.tag}</p>
          <h3>{feature.title}</h3>
          <p className="feature-body">{feature.body}</p>
          <span className="feature-card-arrow" aria-hidden="true">↗</span>
        </article>)}
      </div>
      <div className="feature-footnote" data-reveal><span>✳</span> それぞれの「好き」と、それぞれの居場所を。</div>
    </section>

    <section className="community-strip">
      <div className="community-strip-copy" data-reveal>
        <p className="eyebrow">BEYOND A DISCORD SERVER <span className="eyebrow-mark" /></p>
        <h2>ただ集まるだけじゃない。<br />みんなで、つくっていく。</h2>
        <p>安心して交流できる環境も、楽しい企画も、日々の小さな会話も。運営だけではなく、参加する一人ひとりの声がKGPをつくります。</p>
        <a className="text-link" href="/server">コミュニティについて<span aria-hidden="true">↗</span></a>
      </div>
      <div className="community-visual" data-reveal>
        <div className="visual-ring visual-ring-one" /><div className="visual-ring visual-ring-two" />
        <div className="visual-center"><img src="https://img.suiten.site/Image/kgp-logo.png" alt="" /><span>KGP</span></div>
        <span className="visual-label visual-label-a">CONNECT</span><span className="visual-label visual-label-b">CREATE</span><span className="visual-label visual-label-c">GROW</span>
      </div>
    </section>

    <section className="content-section news-section">
      <div className="section-heading section-heading-inline" data-reveal>
        <div><p className="eyebrow">LATEST UPDATES <span className="eyebrow-mark" /></p><h2>{copy.home.latestNews}</h2></div>
        <a className="text-link" href="/news">{copy.home.allNews}<span aria-hidden="true">↗</span></a>
      </div>
      <LatestNews copy={copy} language={language} />
      <div className="note-links" data-reveal>
        <a href="https://note.com/official_kgp/n/n9715b5790b9e" target="_blank" rel="noreferrer"><span>01 / ABOUT KGP</span><strong>かざま隊の集いの場って？</strong><i>↗</i></a>
        <a href="https://note.com/official_kgp/n/ndf28c7f69996" target="_blank" rel="noreferrer"><span>02 / OUR POLICY</span><strong>コミュニティの理念と運営方針</strong><i>↗</i></a>
        <a href="https://note.com/official_kgp/n/nf27737995f5e" target="_blank" rel="noreferrer"><span>03 / OFFICIAL LINKS</span><strong>公式アカウント・リンク集</strong><i>↗</i></a>
      </div>
    </section>

    <section className="join-cta">
      <div className="join-cta-orbit" aria-hidden="true" />
      <div className="join-cta-content" data-reveal>
        <p className="eyebrow">FIND YOUR PLACE <span className="eyebrow-mark" /></p>
        <h2>あなたの「好き」を、<br />ここから一緒に。</h2>
        <p>新しい出会いも、いつもの日常も。<br />KGPで、あなたらしい楽しみ方を見つけてみませんか？</p>
        <a className="button button-light" href={inviteUrl} target="_blank" rel="noreferrer">Discordに参加する<span aria-hidden="true">↗</span></a>
        <span className="join-cta-caption">WELCOME TO KAZAMATAI COMMUNITY / KGP</span>
      </div>
    </section>
  </>;
}
