import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import './preview.css';

export function PreviewPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/__preview/status', { credentials: 'same-origin', cache: 'no-store' })
      .then((response) => {
        if (active) setAuthenticated(response.status === 204);
      })
      .catch(() => {
        if (active) setError('認証状態を確認できませんでした。ページを再読み込みしてください。');
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/__preview/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(response.status === 429
          ? '試行回数が多すぎます。しばらく待ってから再試行してください。'
          : response.status === 401
            ? 'パスワードが一致しません。サーバー側の設定も確認してください。'
            : '認証サーバーがリクエストを受け付けませんでした。');
        return;
      }
      window.location.assign('/');
    } catch {
      setError('通信に失敗しました。時間をおいて再試行してください。');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/__preview/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error('logout_failed');
      window.location.assign('/');
    } catch {
      setError('認証解除に失敗しました。ページを再読み込みして再試行してください。');
      setLoading(false);
    }
  }

  return (
    <section className="preview-page">
      <div className="preview-card">
        <p className="preview-eyebrow">KGP WEBSITE PREVIEW</p>
        {checking ? (
          <>
            <h1>認証状態を確認中</h1>
            <p className="preview-description">しばらくお待ちください。</p>
          </>
        ) : authenticated ? (
          <>
            <h1>認証済みです</h1>
            <p className="preview-description">このブラウザーではKGPサイトを閲覧できます。認証を解除すると、サイトは再びComing Soon表示になります。</p>
            {error && <p className="preview-error" role="alert">{error}</p>}
            <div className="preview-form">
              <button type="button" onClick={handleLogout} disabled={loading}>{loading ? '解除中…' : 'プレビュー認証を解除'}</button>
            </div>
          </>
        ) : (
          <>
            <h1>プレビュー認証</h1>
            <p className="preview-description">閲覧用パスワードを入力してください。認証後はトップページからサイトを閲覧できます。</p>
            <form className="preview-form" onSubmit={handleSubmit}>
              <label htmlFor="preview-password">パスワード</label>
              <input id="preview-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} />
              {error && <p className="preview-error" role="alert">{error}</p>}
              <button type="submit" disabled={loading}>{loading ? '認証中…' : '認証してサイトを開く'}</button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
