import { useEffect, useState } from 'react';
import { getNews, type News } from '../lib/api';
import type { Copy, Language } from '../locales';

type NewsPageProps = { copy: Copy; language: Language };

export function NewsPage({ copy, language }: NewsPageProps) {
  const [items, setItems] = useState<News[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    getNews()
      .then((news) => {
        if (!active) return;
        setItems(news);
        setState('ready');
      })
      .catch(() => active && setState('error'));
    return () => { active = false; };
  }, []);

  return <>
    <section className="page-hero page-hero-pink">
      <p className="eyebrow"><span className="eyebrow-mark" />{copy.news.eyebrow}</p>
      <h1>{copy.news.title}</h1>
      <p className="page-lede">{copy.home.latestNews}</p>
      <span className="page-index">{copy.news.index}</span>
    </section>
    <section className="content-section news-page-list">
      {state === 'loading' && <p className="quiet">{copy.news.loading}</p>}
      {state === 'error' && <p className="quiet" role="alert">{copy.news.error}</p>}
      {state === 'ready' && items.length === 0 && <p className="quiet">{copy.news.empty}</p>}
      {items.map((item, index) => <a className="news-entry" href={`/news/${encodeURIComponent(item.slug)}`} key={item.id}>
        <span className="news-entry-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="news-entry-main"><small>{item.category}</small><strong>{item.title}</strong><span>{item.excerpt}</span></span>
        <time>{item.published_at ? new Date(item.published_at).toLocaleDateString(language) : ''}</time>
        <span className="row-arrow" aria-hidden="true">↗</span>
      </a>)}
    </section>
  </>;
}
