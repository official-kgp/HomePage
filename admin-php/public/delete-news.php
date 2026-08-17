<?php require __DIR__.'/../src/bootstrap.php';require_admin();check_csrf();$id=(int)($_POST['id']??0);api('DELETE','/v1/admin/news/'.$id);header('Location: /dashboard.php');
