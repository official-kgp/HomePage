import { useEffect, useState } from 'react';
import { getNews, type News } from '../lib/api';
import type { Copy, Language } from '../locales';

type HomePageProps = { copy: Copy; language: Language; inviteUrl: string };

function NewsTicker({ copy, language }: Pick<HomePageProps, 'copy' | 'language'>) {
  const [items, setItems] = useState<News[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    getNews()
      .then((news) => {
        if (active) {
          setItems(news.slice(0, 3));
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => { active = false; };
  }, []);

  return <div className="home-news-ticker" aria-label={copy.nav.news} aria-live="polite">
    {state === 'loading' && <p>お知らせを読み込んでいます…</p>}
    {state === 'error' && <p>お知らせを取得できませんでした。</p>}
    {state === 'ready' && (items.length > 0
      ? items.map((item) => <a className="home-news-ticker-item" href={`/news/${encodeURIComponent(item.slug)}`} key={item.id}>
          <small>{item.category}</small><strong>{item.title}</strong><time>{item.published_at ? new Date(item.published_at).toLocaleDateString(language) : ''}</time><span>↗</span>
        </a>)
      : <p>現在、お知らせはありません。</p>)}
  </div>;
}

const highlights = [
  { id: '01', en: 'TALK & CONNECT', color: 'mint', icon: '✳', title: '好きなことを、自由に話そう。', body: '日常の雑談から推しの話まで。共通の話題を通じて、メンバー同士で交流できます。' },
  { id: '02', en: 'WATCH TOGETHER', color: 'blue', icon: '▷', title: '配信やイベントを一緒に。', body: '配信の感想を共有したり、イベントの盛り上がりをみんなで楽しめます。' },
  { id: '03', en: 'CREATE & SHARE', color: 'pink', icon: '✧', title: '創作や趣味を共有しよう。', body: 'イラスト、ゲーム、音楽など、それぞれの得意や好きなことを持ち寄れます。' },
  { id: '04', en: 'COMMUNITY EVENTS', color: 'orange', icon: '◎', title: '企画に参加してみよう。', body: 'メンバー参加型の企画や交流イベントなど、新しい楽しみ方に出会えます。' },
];

export function HomePage({ copy, language, inviteUrl }: HomePageProps) {
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

    <section className="iroha-feature-section">
      <div className="iroha-feature-heading" data-reveal>
        <p className="eyebrow">OUR FAVORITE NINJA / KAZAMA IROHA</p>
        <h2>風真いろはの魅力を、<em>もっと知ろう。</em></h2>
        <p>プロフィールから音楽、配信まで。公式の情報へつながる入口をまとめました。</p>
      </div>
      <div className="iroha-feature-grid">
        <a className="iroha-feature-card iroha-feature-profile" href="/iroha" data-reveal>
          <span className="iroha-feature-icon">🍃</span><small>01 / PROFILE</small><strong>風真いろはを知る</strong><span>プロフィール・活動情報 <b>↗</b></span>
        </a>
        <a className="iroha-feature-card iroha-feature-music" href="/iroha/music" data-reveal>
          <span className="iroha-feature-icon">♫</span><small>02 / MUSIC</small><strong>音楽を楽しむ</strong><span>オリジナル楽曲・公式リリース <b>↗</b></span>
        </a>
        <a className="iroha-feature-card iroha-feature-streams" href="/iroha/streams" data-reveal>
          <span className="iroha-feature-icon">▶</span><small>03 / STREAMS</small><strong>配信を見に行く</strong><span>ライブ・アーカイブ・動画 <b>↗</b></span>
        </a>
      </div>
      <p className="iroha-feature-note">※ 当ページはファンによる情報案内ページです。音楽・動画の再生は各公式サービスでお楽しみください。</p>
    </section>

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
        {highlights.map((item) => <article className={`discover-card discover-${item.color}`} data-reveal key={item.id}>
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

 
    <section className="home-directory" id="directory">
      <div className="home-directory-head" data-reveal="left">
        <p className="eyebrow">QUICK ACCESS / PORTAL DIRECTORY</p>
        <h2>知りたいことへ、<br /><em>まっすぐアクセス。</em></h2>
        <p>初めての方も、いつものメンバーも。必要な情報をここから探せます。</p>
      </div>
      <div className="home-directory-grid">
        <a className="directory-card directory-featured" href="/guide" data-reveal="right"><span className="directory-number">01 / START</span><b className="directory-symbol">↗</b><strong>はじめての方へ</strong><small>参加方法・最初にすること</small><i>GET STARTED</i></a>
        <a className="directory-card directory-faq" href="/faq" data-reveal="left"><span className="directory-number">02 / HELP</span><b className="directory-symbol">?</b><strong>FAQ・よくある質問</strong><small>参加前の疑問を解決</small><i>QUICK ANSWERS</i></a>
        <a className="directory-card directory-server" href="/server" data-reveal="right"><span className="directory-number">03 / EXPLORE</span><b className="directory-symbol">⌘</b><strong>サーバー紹介</strong><small>機能やチャンネルを知る</small><i>EXPLORE KGP</i></a>
        <a className="directory-card directory-rules" href="/rule" data-reveal="left"><span className="directory-number">04 / SAFETY</span><b className="directory-symbol">✳</b><strong>コミュニティルール</strong><small>みんなで楽しむための約束</small><i>GUIDELINES</i></a>
        <a className="directory-card directory-news" href="/news" data-reveal="right"><span className="directory-number">05 / UPDATES</span><b className="directory-symbol">⌁</b><strong>お知らせ・活動記録</strong><small>KGPの最新情報をチェック</small><i>NEWSROOM</i></a>
        <a className="directory-card directory-contact" href="/contact" data-reveal="left"><span className="directory-number">06 / SUPPORT</span><b className="directory-symbol">✉</b><strong>お問い合わせ</strong><small>困ったとき・相談したいとき</small><i>CONTACT US</i></a>
      </div>
      <div className="directory-foot"><span>NEED A HAND?</span><p>迷ったら、まずは <a href="/faq">FAQ</a> または <a href="/guide">参加ガイド</a> をチェック。</p><span className="directory-cross">✳</span></div>
    </section>

    <section className="portal-cta">
      <div className="cta-orb cta-orb-a" /><div className="cta-orb cta-orb-b" />
      <div className="portal-cta-content" data-reveal><p className="eyebrow">YOUR NEXT CONNECTION STARTS HERE</p><h2>「好き」が集まる場所へ。<br /><em>あなたも、いっしょに。</em></h2><p>何かを話したい日も、ただ眺めていたい日も。<br />KGPで、自分らしい居場所を見つけてみませんか？</p><a className="portal-button portal-button-light" href={inviteUrl} target="_blank" rel="noreferrer"><span>コミュニティに参加する</span><b>↗</b></a></div>
      <span className="cta-side-note">KAZAMATAI GATHERING PLACE — KGP</span>
    </section>
  </>;
}
