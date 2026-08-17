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

API用のCustom Domainを `api.kgp.suiten.site` に設定します。

## 2. 公開HP

`public-site/src/config/site.ts` の `newsApi` と `discordOAuthUrl` を本番APIに合わせます。

```bash
cd public-site
npm install
npm run build
```

生成された `dist/` をCloudflare Pages/Workers Static Assets等へ配置します。既存のCloudflare Workers構成に統合しても構いません。

## 3. Discord OAuth2

Worker Secretとして `ADMIN_API_KEY`, `PUBLIC_DISCORD_CLIENT_SECRET`, `SESSION_SECRET` を登録します。公開OAuthのClient ID/Redirect URIはWorkerのvarsへ、Client SecretはSecretへ入れます。

Discord Developer Portalで公開HP用OAuth2アプリを作成し、API側にOAuth開始/Callbackを実装するか、既存認証基盤へ接続します。本リポジトリでは公開HPのボタン先を設定可能にしてありますが、Client Secretはソースに置きません。

## 4. PHP管理UI

`admin-php/` をPHP 8.2+ / HTTPS環境へ配置し、DocumentRootを `admin-php/public` にします。

次の環境変数をサーバー側へ登録します。

- `KGP_API_BASE=https://api.kgp.suiten.site`
- `KGP_ADMIN_API_KEY=<Cloudflare Workerと同じ秘密鍵>`
- `KGP_ADMIN_DISCORD_CLIENT_ID=<管理用Discord OAuth Client ID>`
- `KGP_ADMIN_DISCORD_CLIENT_SECRET=<管理用Discord OAuth Client Secret>`
- `KGP_ADMIN_DISCORD_REDIRECT_URI=https://op.kgp.suiten.site/discord-callback.php`
- `KGP_PHP_ADMINS_JSON=[{"username":"admin","password_hash":"<password_hash>"}]`
- `KGP_DISCORD_WHITELIST=["DiscordユーザーID"]`

パスワードハッシュはPHPの `password_hash('任意のパスワード', PASSWORD_DEFAULT)` で生成してください。

## 5. 管理画面

`https://op.kgp.suiten.site/` にアクセスするとログイン画面を表示します。

- PHPアカウント
- Discord OAuth2

のどちらでもログインできます。ただしDiscordログインはホワイトリストIDに一致する必要があります。

## 6. ニュース運用

管理画面からタイトル、カテゴリ、概要、画像URL、本文、公開日時、公開/下書きを編集できます。保存後、公開HPの `/news` とトップページがAPIから最新ニュースを取得します。
