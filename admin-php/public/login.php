<?php require __DIR__.'/../src/bootstrap.php';
if($_SERVER['REQUEST_METHOD']!=='POST'){header('Location: /');exit;}
$u=(string)($_POST['username']??'');$p=(string)($_POST['password']??'');$ok=false;foreach(cfg('php_admins') as $a){if(hash_equals((string)($a['username']??''),$u)&&password_verify($p,(string)($a['password_hash']??''))){$ok=true;break;}}
if(!$ok){$_SESSION['login_error']='IDまたはパスワードが正しくありません。';header('Location: /');exit;}
session_regenerate_id(true);$_SESSION['admin']=['type'=>'php','id'=>$u];$_SESSION['csrf']=bin2hex(random_bytes(32));header('Location: /dashboard.php');
