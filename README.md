# かざま隊の集いの場 Web Suite

Cloudflare Workers/Vite を使う公開HP、Cloudflare Workers + D1 のニュースAPIを管理する公開サイト側と、PHP製の管理UIを分離した構成です。

## 構成

- `public-site/` — 公開HP (`https://kgp.suiten.site`)
- `api/` — Cloudflare Worker API + D1
- `/home/user/site/kgp-admin/` — 分離された管理UI (`op-kgp.suiten.site`)
- `database/schema.sql` — D1初期スキーマ
- `docs/DEPLOY.md` — 本番デプロイ手順
- `docs/CLOUDFLARE_TUNNEL.md` — `/var/www` 不要のTunnel公開手順
- `docs/SECURITY.md` — 認証・ホワイトリスト設計

## 重要

このリポジトリには Discord Client Secret、ADMIN_API_KEY、PHP管理者パスワード等の秘密情報を含めません。Cloudflare Secrets / PHP側の環境変数またはサーバー設定へ登録してください。

公開HPのDiscord OAuth2と、管理UIのDiscord OAuth2は分離して設定できます。管理UIでは「Discordホワイトリスト」と「PHPアカウント」の両方を利用でき、どちらも管理者として許可された場合のみ管理画面へ進めます。

## 配備単位

親フォルダ `/home/user/site/` 配下を次の2つの配備単位として扱います。

```text
/home/user/site/
├── kgp-site/   # 公開サイト、API、D1スキーマ、ドキュメント
└── kgp-admin/  # PHP管理画面。public/だけをDocumentRootにする
```

管理画面は公開サイトのファイルを参照せず、環境変数の `KGP_API_BASE` 経由でAPIへ接続します。

## 公開サイトの編集

- `/` と `/site/` は `public-site/src/pages/home.tsx`
- `/server` は `public-site/src/pages/server.tsx`
- `/news` と `/news/:slug` は `public-site/src/pages/news.tsx`、`article.tsx`
- `/contact` は `public-site/src/pages/contact.tsx`
- 表示文言は `public-site/src/locales/{ja,en,zh,ko,pt-BR}.json`
- 共通ナビゲーション、国旗による言語切替、フッターとURLルーティングは `public-site/src/main.tsx`

ページ文章の変更は対応するJSONの値を編集します。レイアウトや挙動の変更は各TSXページで行います。
