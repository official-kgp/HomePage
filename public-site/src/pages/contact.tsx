import { useState, type FormEvent } from 'react';
import type { Copy } from '../locales';

type ContactPageProps = { copy: Copy; contactEmail: string; apiUrl: string };

export function ContactPage({ copy, contactEmail, apiUrl }: ContactPageProps) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      consent: formData.get('consent') === 'on',
      website: String(formData.get('website') || ''),
    };

    setSending(true);
    setStatus(null);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({})) as { ok?: boolean };
      if (!response.ok || !result.ok) throw new Error('contact_send_failed');

      form.reset();
      setStatus({ type: 'success', message: 'お問い合わせを送信しました。ご連絡までしばらくお待ちください。' });
    } catch {
      setStatus({ type: 'error', message: '送信に失敗しました。時間をおいて再度お試しいただくか、メールでお問い合わせください。' });
    } finally {
      setSending(false);
    }
  }

  return <>
    <section className="subpage-hero subpage-hero-contact"><p className="eyebrow">CONTACT / SAY HELLO</p><span className="subpage-number">05 / CONTACT</span><h1>ご質問・ご相談は、<br /><em>こちらから。</em></h1><p>サイトやコミュニティに関するお問い合わせを受け付けています。</p></section>
    <section className="contact-page-layout"><div className="contact-intro"><p className="eyebrow">GET IN TOUCH</p><h2>あなたの声を、<br /><em>聞かせてください。</em></h2><p>お問い合わせの内容によっては、回答までお時間をいただく場合があります。Discord内の個別対応が必要な場合は、サーバー内の案内もご確認ください。</p><a className="contact-mail-card" href={`mailto:${contactEmail}`}><small>EMAIL CONTACT</small><strong>{contactEmail}</strong><b>↗</b></a></div>
      <form className="contact-form-portal" onSubmit={handleSubmit} aria-busy={sending}>
        <label>お名前<input name="name" autoComplete="name" required maxLength={80} placeholder="お名前・ハンドルネーム" /></label>
        <label>メールアドレス<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
        <label>お問い合わせ内容<textarea name="message" rows={6} required maxLength={5000} placeholder="お問い合わせ内容をご記入ください。" /></label>
        <label className="contact-consent"><input type="checkbox" name="consent" required /><span><a href="/privacy">プライバシーポリシー</a>を確認しました。</span></label>
        <div className="contact-honeypot" aria-hidden="true"><label>入力しないでください<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="portal-button portal-button-primary" type="submit" disabled={sending}><span>{sending ? '送信中…' : copy.contact.send}</span><b>↗</b></button>
        <small>送信内容はKGP運営へのメールとして送信されます。</small>
        {status && <p className={`contact-form-status is-${status.type}`} role="status" aria-live="polite">{status.message}</p>}
      </form>
    </section>
  </>;
}
