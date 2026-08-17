CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'お知らせ',
  cover_image_url TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
