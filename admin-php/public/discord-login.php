<?php require __DIR__.'/../src/bootstrap.php';
$_SESSION['oauth_state']=bin2hex(random_bytes(24));
$params=http_build_query(['client_id'=>cfg('discord_client_id'),'redirect_uri'=>cfg('discord_redirect_uri'),'response_type'=>'code','scope'=>'identify','state'=>$_SESSION['oauth_state']]);
header('Location: https://discord.com/oauth2/authorize?'.$params);
