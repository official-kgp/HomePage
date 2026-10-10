import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { getArticle, type News } from '../lib/api';
import type { Copy, Language } from '../locales';

type ArticlePageProps = { copy: Copy; language: Language; slug: string };

function safeImageUrl(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

export function ArticlePage({ copy, language, slug }: ArticlePageProps) {
  const [article, setArticle] = useState<News | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    setArticle(null);
    setMissing(false);
    getArticle(slug)
      .then((item) => active && setArticle(item))
      .catch(() => active && setMissing(true));
    return () => { active = false; };
  }, [slug]);

  if (missing) {
    return <section className="content-section article-state"><p className="eyebrow">{copy.common.notFoundEyebrow}</p><h1>{copy.article.missing}</h1><a className="text-link" href="/news">{copy.article.back}<span className="link-arrow" aria-hidden="true">↗</span></a></section>;
  }

  if (!article) {
    return <section className="content-section article-state"><p className="quiet">{copy.article.loading}</p></section>;
  }

  const excerptHtml = marked.parse(article.excerpt, { async: false }) as string;
  const articleHtml = DOMPurify.sanitize(article.content_html || excerptHtml);
  const imageUrl = safeImageUrl(article.cover_image_url);
  const date = article.published_at ? new Date(article.published_at).toLocaleDateString(language) : '';

  return <article className="article-page">
    <div className="article-topline"><a className="text-link" href="/news"><span aria-hidden="true">←</span>{copy.article.back}</a><span>{date}</span></div>
    <header className="article-heading"><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="article-excerpt">{article.excerpt}</p></header>
    {imageUrl && <img className="article-cover" src={imageUrl} alt="" />}
    <div className="article-content" dangerouslySetInnerHTML={{ __html: articleHtml }} />
  </article>;
}
