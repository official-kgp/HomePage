# 本番デプロイ手順

## 1. D1

`database/schema.sql` をD1へ適用し、`api/wrangler.toml` の `database_id` を実際のIDへ変更します。

```bash
cd api
npx wrangler d1 create kgp-news
npx wrangler d1 execute kgp-news --remote --file=../database/schema.sql
npx wrangler secret put ADMIN_API_KEY
npx wrangler deploy
```

API用のCustom Domainは `kgp-api.suiten.site` です。`api.kgp.suiten.site` はTLS証明書の対象外だったため使用しません。

## 2. 公開HP

`public-site/.env.production`（またはホスティング側の環境変数）でAPI URLを設定します。

```env
VITE_NEWS_API=https://kgp-api.suiten.site
VITE_DISCORD_INVITE_URL=https://discord.gg/vykYySsdQe
```

```bash
cd public-site
npm install
npm run build
```

生成された `dist/` をCloudflare Pages/Workers Static Assets等へ配置します。既存のCloudflare Workers構成に統合しても構いません。

## 3. Discord OAuth2

Worker Secretとして `ADMIN_API_KEY`, `PUBLIC_DISCORD_CLIENT_SECRET`, `SESSION_SECRET` を登録します。公開OAuthのClient ID/Redirect URIはWorkerのvarsへ、Client SecretはSecretへ入れます。

Discord Developer Portalで公開HP用OAuth2アプリを作成し、Client ID/Redirect URIとSecretを設定してください。ログイン導線はOAuth設定を完了するまで公開HPに表示しません。

## 4. PHP管理UI（別配備）

`/home/user/site/kgp-admin/` をPHP 8.2+ / HTTPS環境へ配置し、DocumentRootを `kgp-admin/public` にします。`kgp-admin/src` はWebから直接公開しません。

管理画面のフロントエンドをビルドします。

```bash
cd /home/user/site/kgp-admin
npm ci
npm run typecheck
npm run build
```

認証入口（PHPアカウントとDiscord OAuth）とJSON中継はPHP、ログイン後のニュース操作は `public/assets/admin.js` のTSXアプリが担当します。

次の環境変数をサーバー側へ登録します。

- `KGP_API_BASE=https://kgp-api.suiten.site`
- `KGP_ADMIN_API_KEY=<Cloudflare Workerと同じ秘密鍵>`
- `KGP_ADMIN_DISCORD_CLIENT_ID=<管理用Discord OAuth Client ID>`
- `KGP_ADMIN_DISCORD_CLIENT_SECRET=<管理用Discord OAuth Client Secret>`
- `KGP_ADMIN_DISCORD_REDIRECT_URI=https://op-kgp.suiten.site/discord-callback.php`
- `KGP_PHP_ADMINS_JSON=[{"username":"admin","password_hash":"<password_hash>"}]`
- `KGP_DISCORD_WHITELIST=["DiscordユーザーID"]`

管理UIは `https://kgp-api.suiten.site` の管理APIだけを呼び出すため、`kgp-site` のソースや公開サイトのDocumentRootを共有する必要はありません。

パスワードハッシュはPHPの `password_hash('任意のパスワード', PASSWORD_DEFAULT)` で生成してください。

## 5. 管理画面

`https://op-kgp.suiten.site/` にアクセスするとログイン画面を表示します。

- PHPアカウント
- Discord OAuth2

のどちらでもログインできます。ただしDiscordログインはホワイトリストIDに一致する必要があります。

## 6. ニュース運用

管理画面からタイトル、カテゴリ、概要、画像URL、本文、公開日時、公開/下書きを編集できます。保存後、公開HPの `/news` とトップページがAPIから最新ニュースを取得します。

現行APIにはD1とWorkerをデプロイ済みです。管理画面から更新する場合は、Workerの `ADMIN_API_KEY` Secretと、`kgp-admin` の `KGP_ADMIN_API_KEY` を同じ値に設定してください。
