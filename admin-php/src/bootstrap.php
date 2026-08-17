<?php
declare(strict_types=1);
$config = require __DIR__ . '/config.php';
session_name('KGP_OP');
session_set_cookie_params(['httponly'=>true,'secure'=>true,'samesite'=>'Lax']);
session_start();
function cfg(string $key){global $config;return $config[$key] ?? null;}
function require_admin(): void {if(empty($_SESSION['admin'])){header('Location: /');exit;}}
function csrf(): string {if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32));return $_SESSION['csrf'];}
function check_csrf(): void {if(!hash_equals($_SESSION['csrf']??'', $_POST['csrf']??'')){http_response_code(403);exit('CSRF validation failed');}}
function api(string $method,string $path,?array $body=null): array {$url=rtrim((string)cfg('api_base'),'/').$path;$ch=curl_init($url);$headers=['X-Admin-Key: '.cfg('api_key'),'Accept: application/json'];if($body!==null){$headers[]='Content-Type: application/json';curl_setopt($ch,CURLOPT_POSTFIELDS,json_encode($body,JSON_UNESCAPED_UNICODE));}curl_setopt_array($ch,[CURLOPT_CUSTOMREQUEST=>$method,CURLOPT_HTTPHEADER=>$headers,CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>15]);$raw=curl_exec($ch);$code=curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);return [$code,json_decode((string)$raw,true)];}
