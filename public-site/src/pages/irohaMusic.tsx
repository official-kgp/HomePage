const releases = [
  { title: '風向きエントロピー', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/764/' },
  { title: 'ドリームキャッチピュアいろは！', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/736/' },
  { title: '君にしか読めない手紙', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/584/' },
  { title: 'ホントノワタシ', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/585/' },
  { title: 'ハードモード', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/491/' },
  { title: '魔法少女まじかる☆ござる', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/419/' },
  { title: '風を仰ぎし麗容な', label: 'SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/364/' },
  { title: 'いろはすてっぷ！', label: '1ST SINGLE / ORIGINAL', url: 'https://hololive.hololivepro.com/music/いろはすてっぷ！/' },
];

export function IrohaMusicPage() {
  return <>
    <section className="iroha-page-hero">
      <p className="eyebrow">KAZAMA IROHA / MUSIC COLLECTION</p>
      <h1>音楽で出会う、<br /><em>風真いろは。</em></h1>
      <p>オリジナル楽曲を中心に、公式の音楽リリースへアクセスできるリンクをまとめています。</p>
      <span className="iroha-page-index">KAZAMA IROHA / 02</span>
    </section>
    <section className="iroha-content">
      <p className="eyebrow">ORIGINAL RELEASES</p>
      <h2>オリジナル楽曲</h2>
      <p>気になる楽曲を選ぶと、hololive公式サイトの楽曲ページへ移動します。配信サービスやダウンロード先は、各公式ページからご確認ください。</p>
      <div className="iroha-song-grid">
        {releases.map((release) => <a className="iroha-song-card" href={release.url} target="_blank" rel="noreferrer" key={release.title}>
          <small>{release.label}</small><strong>{release.title}</strong><span><span>公式リリース情報を見る</span><b>↗</b></span>
        </a>)}
      </div>
      <div className="iroha-page-actions">
        <a className="portal-button portal-button-primary" href="https://hololive.hololivepro.com/music/" target="_blank" rel="noreferrer"><span>hololive公式 MUSIC一覧</span><b>↗</b></a>
        <a className="portal-button portal-button-ghost" href="/iroha"><span>プロフィールへ戻る</span><b>→</b></a>
      </div>
      <p className="iroha-callout">このページでは音楽を再生・配信しません。各楽曲の公式ページから、対応する音楽配信サービスをご利用ください。掲載内容は公式の公開情報に基づいています。</p>
    </section>
  </>;
}
