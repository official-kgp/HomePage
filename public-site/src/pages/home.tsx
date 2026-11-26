import { useEffect, useState } from 'react';
import { getNews, type News } from '../lib/api';
import type { Copy, Language } from '../locales';

type HomePageProps = { copy: Copy; language: Language; inviteUrl: string };

function NewsTicker({ copy, language }: Pick<HomePageProps, 'copy' | 'language'>) {
  const [items, setItems] = useState<News[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    getNews().then((news) => {
      if (!active) return;
      setItems(news.slice(0, 3));
      setState('ready');
    }).catch(() => active && setState('error'));
    return () => { active = false; };
  }, []);
  return <div className="home-news-feed">
    {state === 'loading' && <p className="quiet">{copy.news.loading}</p>}
    {state === 'error' && <p className="quiet">{copy.news.error}</p>}
    {state === 'ready' && items.length === 0 && <p className="quiet">{copy.news.empty}</p>}
    {items.map((item, index) => <a className="home-news-item" href={\`/news/\${encodeURIComponent(item.slug)}\`} key={item.id}>
      <span className="home-news-no">0{index + 1}</span><span className="home-news-title"><small>{item.category}</small><strong>{item.title}</strong></span>
      <time>{item.published_at ? new Date(item.published_at).toLocaleDateString(language) : ''}</time><b aria-hidden="true">↗</b>
    </a>)}
  </div>;
}

const highlights = [
  { id: '01', icon: '✳', en: 'CHAT & CONNECT', title: '好きな話題で、気軽につながる。', body: '風真いろはやhololiveの話題はもちろん、日常のこと、趣味のことも。テキスト・ボイスで自分らしく交流できます。', color: 'mint' },
  { id: '02', icon: '✧', en: 'EVENT & PROJECT', title: 'みんなで楽しむ企画とイベント。', body: '同時視聴やクイズ、誕生日企画などを不定期で開催。メンバーのアイデアから新しい楽しみ方も生まれます。', color: 'peach' },
  { id: '03', icon: '⌘', en: 'ORIGINAL SYSTEM', title: 'KGPならではの独自Bot。', body: 'おみくじやRankなど、コミュニティをもっと楽しくする独自機能を開発・運用しています。', color: 'blue' },
  { id: '04', icon: '◎', en: 'YOUR OWN PACE', title: 'ROM専だって、立派な参加。', body: '会話に入るのが得意でなくても大丈夫。読むだけ、リアクションだけ、自分のペースで過ごせます。', color: 'lilac' },
];

export function HomePage({ copy, language, inviteUrl }: HomePageProps) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <>
    <section className="portal-hero">
      <div className="hero-gridlines" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-a" aria-hidden="true" /><div className="hero-orbit hero-orbit-b" aria-hidden="true" />
      <div className="hero-spark hero-spark-a" aria-hidden="true">✳</div><div className="hero-spark hero-spark-b" aria-hidden="true">✧</div>
      <div className="portal-hero-copy">
        <p className="portal-kicker"><span className="status-dot" /> OFFICIAL COMMUNITY PORTAL <span className="kicker-ja">｜ かざま隊の集いの場</span></p>
        <p className="portal-overline">WELCOME TO KGP / EST. 2025</p>
        <h1>あなたの<span className="hero-highlight">「好き」</span>で、<br />みんなの<span className="hero-highlight">居場所</span>を。</h1>
        <p className="portal-hero-lead">好きなものが違ってもいい。楽しみ方が違ってもいい。<br />それぞれの「好き」がつながる、みんなのコミュニティ。</p>
        <div className="portal-hero-actions">
          <a className="portal-button portal-button-primary" href={inviteUrl} target="_blank" rel="noreferrer"><span>Discordに参加する</span><b>↗</b></a>
          <a className="portal-button portal-button-ghost" href="/guide"><span>はじめての方へ</span><b>→</b></a>
        </div>
        <div className="portal-hero-foot"><span>FAN COMMUNITY</span><i /> <span>KAZAMA IROHA / HOLOX</span><i /> <span>JAPAN & BEYOND</span></div>
      </div>
      <div className="portal-hero-art" aria-label="KGP community visual">
        <div className="art-backdrop" />
        <div className="art-orbit art-orbit-1" /><div className="art-orbit art-orbit-2" /><div className="art-orbit art-orbit-3" />
        <div className="art-core"><img src="/logo.png" alt="かざま隊の集いの場" /><span>KGP</span></div>
        <span className="art-chip art-chip-top"><i>✳</i> YOUR PLACE</span>
        <span className="art-chip art-chip-right">CONNECT <b>↗</b></span>
        <span className="art-chip art-chip-bottom">好きが、つながる。</span>
        <span className="art-coordinate">35° / 135°<br />COMMUNITY NODE</span>
      </div>
      <a className="hero-scroll-cue" href="#discover"><span /> SCROLL TO DISCOVER</a>
      <span className="hero-side-index">01 <i /> 05</span>
    </section>

    <section className="ticker-band" aria-label="KGP concept"><div className="ticker-track">
      {Array.from({ length: 4 }, (_, i) => <span key={i}>YOUR LIKES, OUR PLACE <b>✳</b> みんなでつくる、みんなの居場所 <b>✧</b></span>)}
    </div></section>

    <section className="intro-section" id="discover">
      <div className="section-index" data-reveal><span>01 / ABOUT</span><i /></div>
      <div className="intro-layout">
        <div className="intro-title" data-reveal><p className="eyebrow">WHAT IS KGP?</p><h2>ただのファン<br />サーバーで、<em>終わらない。</em></h2></div>
        <div className="intro-copy" data-reveal><p>「かざま隊の集いの場」は、風真いろはを応援するファンを中心に、さまざまな「好き」を持つ人が集まるDiscordコミュニティです。</p><p>配信の感想を話したり、イベントを一緒に楽しんだり。何気ない日常の会話から、新しい趣味との出会いまで。一人ひとりが自分らしく過ごせる場所を、メンバーと一緒につくっています。</p><a className="inline-arrow" href="https://note.com/official_kgp/n/n9715b5790b9e" target="_blank" rel="noreferrer">公式noteでKGPをもっと知る <b>↗</b></a></div>
      </div>
      <div className="intro-stats" data-reveal><div><strong>01</strong><span>YOUR PACE</span><small>自分らしい参加スタイル</small></div><div><strong>∞</strong><span>YOUR LIKES</span><small>好きの数だけ、話題がある</small></div><div><strong>✳</strong><span>TOGETHER</span><small>みんなで育てるコミュニティ</small></div></div>
    </section>

    <section className="discover-section">
      <div className="section-index" data-reveal><span>02 / DISCOVER</span><i /></div>
      <div className="section-heading-portal" data-reveal><div><p className="eyebrow">FIND YOUR WAY TO ENJOY</p><h2>ここでできる、<br /><em>いろんな楽しみ方。</em></h2></div><p>会話だけがコミュニティの楽しみ方じゃない。<br />あなたに合った関わり方を見つけてください。</p></div>
      <div className="discover-grid">
        {highlights.map((item) => <article className={\`discover-card discover-\${item.color}\`} data-reveal key={item.id}>
          <div className="discover-card-head"><span>{item.id} / {item.en}</span><b>{item.icon}</b></div><h3>{item.title}</h3><p>{item.body}</p><span className="discover-card-deco">{item.icon}</span>
        </article>)}
      </div>
      <div className="discover-more" data-reveal><a className="inline-arrow" href="/server">サーバーの機能・チャンネルを詳しく見る <b>↗</b></a><a className="inline-arrow" href="/faq">よくある質問 <b>↗</b></a></div>
    </section>

    <section className="join-guide-section">
      <div className="join-guide-visual" data-reveal><div className="guide-orbit" /><div className="guide-number">03</div><div className="guide-stamp">FIRST<br />STEP</div><span className="guide-caption">IT'S EASIER THAN YOU THINK.</span></div>
      <div className="join-guide-copy" data-reveal><p className="eyebrow">HOW TO JOIN</p><h2>参加方法は、<br /><em>たったの3 STEP。</em></h2><ol className="join-steps"><li><b>01</b><span><strong>Discordを準備</strong><small>アプリまたはブラウザからDiscordを開きます。</small></span></li><li><b>02</b><span><strong>招待リンクを開く</strong><small>下のボタンからKGPの招待ページへ。</small></span></li><li><b>03</b><span><strong>参加して案内をチェック</strong><small>ルールや案内を確認したら、好きな場所からどうぞ！</small></span></li></ol>
        <a className="portal-button portal-button-primary" href={inviteUrl} target="_blank" rel="noreferrer"><span>Discordに参加する</span><b>↗</b></a>
        <p className="join-guide-note">※ Discordアカウントが必要です。参加後はサーバー内の案内に従ってください。</p>
      </div>
    </section>

    <section className="news-portal-section">
      <div className="section-index" data-reveal><span>04 / UPDATES</span><i /></div>
      <div className="section-heading-portal" data-reveal><div><p className="eyebrow">NEWS & JOURNAL</p><h2>KGPの「今」を、<br /><em>チェックしよう。</em></h2></div><a className="inline-arrow" href="/news">すべてのお知らせ <b>↗</b></a></div>
      <NewsTicker copy={copy} language={language} />
      <div className="official-note-grid" data-reveal>
        <a href="https://note.com/official_kgp/n/n00f52b03940e" target="_blank" rel="noreferrer"><small>OUR PHILOSOPHY / 01</small><strong>「好き」で、みんなの居場所を。</strong><span>キャッチコピーに込めた想い <b>↗</b></span></a>
        <a href="https://note.com/official_kgp/n/n9715b5790b9e" target="_blank" rel="noreferrer"><small>ABOUT KGP / 02</small><strong>かざま隊の集いの場って？</strong><span>サーバーの特徴と活動をご紹介 <b>↗</b></span></a>
        <a href="https://note.com/official_kgp/n/nd609c1aa41ab" target="_blank" rel="noreferrer"><small>PROJECT / 03</small><strong>PROJECT NEXUS</strong><span>KGPのこれからとアップデート <b>↗</b></span></a>
      </div>
    </section>

    <section className="portal-cta">
      <div className="cta-orb cta-orb-a" /><div className="cta-orb cta-orb-b" />
      <div className="portal-cta-content" data-reveal><p className="eyebrow">YOUR NEXT CONNECTION STARTS HERE</p><h2>「好き」が集まる場所へ。<br /><em>あなたも、いっしょに。</em></h2><p>何かを話したい日も、ただ眺めていたい日も。<br />KGPで、自分らしい居場所を見つけてみませんか？</p><a className="portal-button portal-button-light" href={inviteUrl} target="_blank" rel="noreferrer"><span>コミュニティに参加する</span><b>↗</b></a></div>
      <span className="cta-side-note">KAZAMATAI GATHERING PLACE — KGP</span>
    </section>
  </>;
}
