import { useEffect, useState } from 'react';
import { getNews, type News } from '../lib/api';
import type { Copy, Language } from '../locales';
type NewsPageProps = { copy: Copy; language: Language };

export function NewsPage({ copy, language }: NewsPageProps) {
  const [items, setItems] = useState<News[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    getNews().then((news) => { if (active) { setItems(news); setState('ready'); } })
      .catch(() => active && setState('error'));
    return () => { active = false; };
  }, []);
  return <>
    <section className="subpage-hero subpage-hero-news"><p className="eyebrow">NEWSROOM / KGP JOURNAL</p><span className="subpage-number">04 / UPDATES</span><h1>お知らせと、<br /><em>コミュニティの記録。</em></h1><p>運営からのお知らせや、KGPの活動をお届けします。</p></section>
    <section className="news-list-section"><div className="news-list-heading"><p className="eyebrow">LATEST INFORMATION</p><h2>ALL UPDATES <span>{items.length.toString().padStart(2, '0')}</span></h2></div>
      {state === 'loading' && <p className="quiet">{copy.news.loading}</p>}
      {state === 'error' && <p className="quiet" role="alert">{copy.news.error}</p>}
      {state === 'ready' && items.length === 0 && <p className="quiet">{copy.news.empty}</p>}
      <div className="news-archive">{items.map((item, index) => <a className="news-archive-item" href={\`/news/\${encodeURIComponent(item.slug)}\`} key={item.id}><span className="archive-no">{String(index + 1).padStart(2, '0')}</span><span className="archive-main"><small>{item.category}</small><strong>{item.title}</strong><span>{item.excerpt}</span></span><time>{item.published_at ? new Date(item.published_at).toLocaleDateString(language) : ''}</time><b>↗</b></a>)}</div>
    </section>
  </>;
}
