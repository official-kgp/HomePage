# かざま隊の集いの場 Web Suite

Cloudflare Workers/Vite を使う公開HP、Cloudflare Workers + D1 のニュースAPI、PHP製の管理UIをまとめた構成です。

## 構成

- `public-site/` — 公開HP (`www.kgp.suiten.site` など)
- `api/` — Cloudflare Worker API + D1
- `admin-php/` — 管理UI (`op.kgp.suiten.site`)
- `database/schema.sql` — D1初期スキーマ
- `docs/DEPLOY.md` — 本番デプロイ手順
- `docs/SECURITY.md` — 認証・ホワイトリスト設計

## 重要

このリポジトリには Discord Client Secret、ADMIN_API_KEY、PHP管理者パスワード等の秘密情報を含めません。Cloudflare Secrets / PHP側の環境変数またはサーバー設定へ登録してください。

公開HPのDiscord OAuth2と、管理UIのDiscord OAuth2は分離して設定できます。管理UIでは「Discordホワイトリスト」と「PHPアカウント」の両方を利用でき、どちらも管理者として許可された場合のみ管理画面へ進めます。
