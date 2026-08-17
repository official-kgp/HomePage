# セキュリティ設計

- 管理画面はHTTPS必須。
- PHPセッションCookieはSecure + HttpOnly + SameSite=Lax。
- ログイン成功時にセッションIDを再生成。
- PHPログインは `password_hash/password_verify` を利用。
- PHPフォームはCSRFトークンを検証。
- Discord OAuth2はstateを検証。
- Discord管理者はユーザーIDのホワイトリストで制限。
- Worker APIの管理CRUDは `X-Admin-Key` で保護し、キーはCloudflare SecretとPHP環境変数だけに置く。
- 公開ニュースGETと管理CRUDをAPI上で明確に分離。
- 管理者入力HTMLはAPI側でも最低限のサニタイズを実施し、公開側ではDOMPurifyを通して表示。
- 実運用ではCloudflare WAF/Rate Limiting、管理画面のIP制限、監査ログ、バックアップを追加するとより堅牢。
