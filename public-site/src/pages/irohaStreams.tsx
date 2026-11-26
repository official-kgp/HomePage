const channel = 'https://www.youtube.com/channel/UC_vMYWcDjmfdpH6r4TTn1MQ';

const destinations = [
  { title: 'ライブ配信', en: 'LIVE STREAMS', detail: '配信中のライブや配信予定をチェック', url: channel + '/streams' },
  { title: '動画・アーカイブ', en: 'VIDEOS & ARCHIVES', detail: '過去の配信や投稿動画を見つける', url: channel + '/videos' },
  { title: 'ショート動画', en: 'SHORTS', detail: '短い動画コンテンツをチェック', url: channel + '/shorts' },
  { title: '公式X', en: 'OFFICIAL X', detail: '配信のお知らせや最新の投稿を確認', url: 'https://twitter.com/kazamairohach' },
];

export function IrohaStreamsPage() {
  return <>
    <section className="iroha-page-hero">
      <p className="eyebrow">KAZAMA IROHA / STREAM & VIDEO</p>
      <h1>配信の時間を、<br /><em>一緒に楽しもう。</em></h1>
      <p>ライブ配信、アーカイブ、ショート動画。見たいコンテンツを選んで、公式チャンネルへ。</p>
      <span className="iroha-page-index">KAZAMA IROHA / 03</span>
    </section>
    <section className="iroha-content">
      <p className="eyebrow">WATCH & DISCOVER</p>
      <h2>配信・動画リンク</h2>
      <p>このページは配信・動画へのリンクをまとめた案内ページです。動画の埋め込みやサイト内再生は行わず、各リンクからYouTubeなどの公式サービスへ移動します。</p>
      <div className="iroha-link-grid">
        {destinations.map((item) => <a className="iroha-link-card" href={item.url} target="_blank" rel="noreferrer" key={item.title}>
          <span><strong>{item.title}</strong><small>{item.en} — {item.detail}</small></span><b>↗</b>
        </a>)}
      </div>
      <div className="iroha-page-actions">
        <a className="portal-button portal-button-primary" href={channel} target="_blank" rel="noreferrer"><span>YouTube公式チャンネル</span><b>↗</b></a>
        <a className="portal-button portal-button-ghost" href="/iroha"><span>プロフィールへ戻る</span><b>→</b></a>
      </div>
      <p className="iroha-callout">配信スケジュールや公開状態は変更される場合があります。最新情報は公式チャンネルと公式Xをご確認ください。</p>
    </section>
  </>;
}
