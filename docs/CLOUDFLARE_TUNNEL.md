# Cloudflare Tunnel公開

ソースを `/var/www` へ移動せず、`/home/user/site` 配下から公開する構成です。

## Tunnel構成

```text
kgp-web (d7f2deb5-ea6c-4181-be61-db128c75a51f)
  kgp.suiten.site       -> 127.0.0.1:4173  (Vite Preview)
  form-kgp.suiten.site  -> 127.0.0.1:8888 (kgp-form)
  op-kgp.suiten.site    -> 127.0.0.1:8081 (kgp-admin PHP)

home-web (b77e8042-3cbb-45d7-b35f-7362c73b7322)
  www.suiten.site
  img.suiten.site
  test.suiten.site
```

`kgp-web` の設定は `/home/user/.cloudflared/kgp-web.yml`、systemd user unitは `kgp-web.service` です。PHP originは `kgp-admin-php.service` が起動します。

## DNSの移行

Cloudflare Dashboardの `suiten.site` > DNS > Records で、次の3つの既存レコードを編集します。

| Name | Type | Content |
| --- | --- | --- |
| `kgp` | CNAME | `d7f2deb5-ea6c-4181-be61-db128c75a51f.cfargotunnel.com` |
| `form-kgp` | CNAME | `d7f2deb5-ea6c-4181-be61-db128c75a51f.cfargotunnel.com` |
| `op-kgp` | CNAME | `d7f2deb5-ea6c-4181-be61-db128c75a51f.cfargotunnel.com` |

Proxiedを有効にします。既存レコードを編集できない場合は、同じNameのA/AAAA/CNAMEレコードを削除してから上記CNAMEを追加します。現在の `cloudflared tunnel route dns --overwrite-dns` は既存レコード競合（1003）で置換できません。

## home-webからの切離し

home-web用の整理済みIngress設定は `/home/user/.cloudflared/home-web.yml` です。KGP用3ホストを含まず、既存サイトのルートを保持しています。DNSの切替後、管理者権限で既定設定へ配置します。

```bash
sudo install -m 644 /home/user/.cloudflared/home-web.yml /etc/cloudflared/config.yml
```

その後、旧home-web connectorを停止してユーザーsystemd unitで再起動します。

```bash
systemctl --user daemon-reload
systemctl --user enable --now home-web.service
```

## Originの確認

```bash
curl -I -H 'Host: kgp.suiten.site' http://127.0.0.1:4173/
curl -I -H 'Host: form-kgp.suiten.site' http://127.0.0.1:8888/
curl -I -H 'Host: op-kgp.suiten.site' http://127.0.0.1:8081/
```

## 再起動と永続化

Tunnel設定と全originの起動確認:

```bash
cloudflared --config /home/user/.cloudflared/kgp-web.yml tunnel ingress validate
systemctl --user status kgp-web.service kgp-site-preview.service kgp-admin-php.service
cloudflared tunnel info kgp-web
```

ユーザーサービスをログアウト後・再起動後も起動させるには、一度だけlingerを有効にします。

```bash
sudo loginctl enable-linger user
```

公開サイトを更新する場合:

```bash
cd /home/user/site/kgp-site/public-site
npm run typecheck
npm run build
systemctl --user restart kgp-site-preview.service
```

## 管理Discord OAuth

管理画面のRedirect URIは `https://op-kgp.suiten.site/discord-callback.php` です。Discord Developer PortalにもこのURLを登録してください。APIの公開ニュースURLは `https://kgp-api.suiten.site` のままです。

## KGPサイトのプレビュー認証ゲート（ローカルorigin）

Vite Previewだけではサーバー側でCookieを検証してComing Soonと本サイトを切り替えられません。認証ゲートを使う場合は public-site/server/preview-gate.mjs をoriginとして起動します。Cloudflare Tunnelは引き続き http://127.0.0.1:4173 へ接続できます。

1. 既存のComing Soon HTMLを、Web公開ルート外のローカルファイルへ配置します（例：/home/user/site/kgp-coming-soon.html）。
2. public-site で npm run build を実行します。
3. kgp-site-preview.service の WorkingDirectory を `/home/user/site/kgp-site/public-site` にし、起動コマンドを `npm run serve:preview` に変更します。このスクリプトは `../ci/.env` を明示的に読み込みます（Node.jsの `--env-file` を使用）。`.env` のパスはWorkingDirectory基準なので、`/home/user/site/kgp-site/ci/.env` に配置してください。EnvironmentFileをsystemd側で設定する構成でも構いません。以下の環境変数を設定します。

```ini
HOST=127.0.0.1
PORT=4173
KGP_DIST_DIR=/home/user/site/kgp-site/public-site/dist
KGP_COMING_SOON_FILE=/home/user/site/kgp-coming-soon.html
PREVIEW_PASSWORD=<長く推測困難なプレビュー用パスワード>
PREVIEW_COOKIE_SECRET=<openssl rand -hex 32 で生成した値>
```

PREVIEW_PASSWORD と PREVIEW_COOKIE_SECRET はリポジトリに保存しないでください。環境変数は適切に保護します。設定後、`npm run build` を実行してからサービスを再起動します。`/preview/` で認証して `/` に遷移できること、認証済みで `/preview/` を開くと認証解除ボタンが出ること、解除後と未認証の別ブラウザでは `/` や `/news` を含むすべてのHTMLページでComing Soonが表示されることを確認してください。`/__preview/status` は認証状態確認用、`/__preview/logout` は認証解除用です。パスワードが拒否される場合は、サービスログに環境変数不足の起動エラーがないことと、`.env` の `PREVIEW_PASSWORD` が入力値と完全一致することを確認してください。

このoriginは静的アセットを公開し、アプリのHTMLルートをCookieで保護します。公開ニュースAPIなど別ホストのAPI自体を認証するものではありません。Cloudflare Tunnelはlocalhostのままなので、ルーター側のポート開放は不要です。
