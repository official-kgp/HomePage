<?php
declare(strict_types=1);

return [
  'api_base' => getenv('KGP_API_BASE') ?: 'https://api.kgp.suiten.site',
  'api_key' => getenv('KGP_ADMIN_API_KEY') ?: '',
  'discord_client_id' => getenv('KGP_ADMIN_DISCORD_CLIENT_ID') ?: '',
  'discord_client_secret' => getenv('KGP_ADMIN_DISCORD_CLIENT_SECRET') ?: '',
  'discord_redirect_uri' => getenv('KGP_ADMIN_DISCORD_REDIRECT_URI') ?: 'https://op.kgp.suiten.site/discord-callback.php',
  // JSON: [{"username":"admin","password_hash":"$2y$..."}]
  'php_admins' => json_decode(getenv('KGP_PHP_ADMINS_JSON') ?: '[]', true) ?: [],
  // JSON array of Discord user IDs. Keep this outside the repository in production.
  'discord_whitelist' => json_decode(getenv('KGP_DISCORD_WHITELIST') ?: '[]', true) ?: [],
];
