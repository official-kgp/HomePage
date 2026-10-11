import { useState } from 'react';
import type { FormEvent } from 'react';
import './preview.css';

export function PreviewPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          : 'パスワードが正しくないか、認証に失敗しました。');
        return;
      }
      window.location.assign('/');
    } catch {
      setError('通信に失敗しました。時間をおいて再試行してください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="preview-page">
      <div className="preview-card">
        <p className="preview-eyebrow">KGP WEBSITE PREVIEW</p>
        <h1>プレビュー認証</h1>
        <p className="preview-description">閲覧用パスワードを入力してください。認証後はトップページからサイトを閲覧できます。</p>
        <form className="preview-form" onSubmit={handleSubmit}>
          <label htmlFor="preview-password">パスワード</label>
          <input id="preview-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} />
          {error && <p className="preview-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? '認証中…' : '認証してサイトを開く'}</button>
        </form>
      </div>
    </section>
  );
}
