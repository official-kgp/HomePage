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
