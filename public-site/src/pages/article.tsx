import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { getArticle, type News } from '../lib/api';
import type { Copy, Language } from '../locales';
type ArticlePageProps = { copy: Copy; language: Language; slug: string };
function safeImageUrl(value: string): string {
  try { const url = new URL(value, window.location.origin); return url.protocol === 'https:' ? url.href : ''; }
  catch { return ''; }
}
export function ArticlePage({ copy, language, slug }: ArticlePageProps) {
  const [article, setArticle] = useState<News | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let active = true; setArticle(null); setMissing(false);
    getArticle(slug).then((item) => active && setArticle(item)).catch(() => active && setMissing(true));
    return () => { active = false; };
  }, [slug]);
  if (missing) return <section className="article-state"><p className="eyebrow">404 / ARTICLE NOT FOUND</p><h1>{copy.article.missing}</h1><a className="inline-arrow" href="/news">{copy.article.back} <b>↗</b></a></section>;
  if (!article) return <section className="article-state"><p className="eyebrow">LOADING ARTICLE</p><p className="quiet">{copy.article.loading}</p></section>;
  const excerptHtml = marked.parse(article.excerpt, { async: false }) as string;
  const articleHtml = DOMPurify.sanitize(article.content_html || excerptHtml);
  const imageUrl = safeImageUrl(article.cover_image_url);
  const date = article.published_at ? new Date(article.published_at).toLocaleDateString(language) : '';
  return <article className="article-shell">
    <div className="article-backline"><a href="/news">← {copy.article.back}</a><span>NEWS / KGP JOURNAL</span></div>
    <header className="article-title-block"><p className="eyebrow">{article.category} <i /> {date}</p><h1>{article.title}</h1><p>{article.excerpt}</p></header>
    {imageUrl && <img className="article-cover" src={imageUrl} alt="" />}
    <div className="article-content" dangerouslySetInnerHTML={{ __html: articleHtml }} />
    <a className="article-return" href="/news">← お知らせ一覧へ戻る</a>
  </article>;
}
