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

  return <div className="latest-news">
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

export function HomePage({ copy, language, inviteUrl }: HomePageProps) {
  return <>
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-mark" />{copy.home.eyebrow}</p>
        <h1>{copy.home.title}</h1>
        <p className="hero-intro">{copy.home.intro}</p>
        <p className="hero-description">{copy.home.description}</p>
        <div className="hero-actions">
          <a className="button button-ink" href={inviteUrl} target="_blank" rel="noreferrer">{copy.home.join}<span aria-hidden="true">↗</span></a>
          <a className="text-link" href="/news">{copy.home.newsLink}<span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <figure className="hero-image-wrap">
        <img className="hero-image" src="/logo.png" alt={copy.siteName} />
        <figcaption><span>{copy.home.heroCaption}</span><span>{copy.home.heroStamp}</span></figcaption>
      </figure>
      <span aria-hidden="true" className="hero-index">01</span>
    </section>

    <section className="manifesto-band">
      <p className="eyebrow">{copy.siteName}</p>
      <h2>{copy.home.manifesto}</h2>
      <span aria-hidden="true" className="manifesto-stamp">K</span>
    </section>

    <section className="content-section feature-section">
      <div className="section-heading">
        <p className="eyebrow">{copy.home.featuresEyebrow}</p>
        <h2>{copy.home.featuresTitle}</h2>
      </div>
      <div className="feature-list">
        {copy.home.features.map((feature, index) => <article className="feature-row" key={feature.title}>
          <span className="feature-number">0{index + 1}</span>
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
          <span aria-hidden="true" className="feature-mark">✳</span>
        </article>)}
      </div>
    </section>

    <section className="content-section news-section">
      <div className="section-heading section-heading-inline">
        <div><p className="eyebrow">{copy.home.latestEyebrow}</p><h2>{copy.home.latestNews}</h2></div>
        <a className="text-link" href="/news">{copy.home.allNews}<span aria-hidden="true">↗</span></a>
      </div>
      <LatestNews copy={copy} language={language} />
    </section>
  </>;
}
