import { site } from '../config/site';

export type News = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  category: string;
  cover_image_url: string;
  published_at: string | null;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${site.newsApi}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getNews(): Promise<News[]> {
  const result = await getJson<{ items: News[] }>('/v1/news?limit=20');
  return result.items;
}

export function getArticle(slug: string): Promise<News> {
  return getJson<News>(`/v1/news/${encodeURIComponent(slug)}`);
}
