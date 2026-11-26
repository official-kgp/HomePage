const officialProfileUrl = 'https://hololive.hololivepro.com/talents/kazama-iroha/';
const youtubeUrl = 'https://www.youtube.com/channel/UC_vMYWcDjmfdpH6r4TTn1MQ?sub_confirmation=1';
const xUrl = 'https://twitter.com/kazamairohach';

export function IrohaProfilePage() {
  return <>
    <section className="iroha-page-hero">
      <p className="eyebrow">KAZAMA IROHA / TALENT PROFILE</p>
      <h1>風真いろはを、<br /><em>もっと知ろう。</em></h1>
      <p>秘密結社holoXの用心棒。風真いろはのプロフィールや活動情報を、公式ページをもとにご紹介します。</p>
      <span className="iroha-page-index">KAZAMA IROHA / 01</span>
    </section>
    <section className="iroha-content">
      <p className="eyebrow">ABOUT KAZAMA IROHA</p>
      <h2>「holoXの用心棒、侍の風真いろはでござる」</h2>
      <p>〖秘密結社holoX〗の用心棒。山奥の田舎で生活していたが、外の世界に憧れてお供と共に面白い事を求めて武者修行の旅を始めた。今は日銭を稼ぎながら〖秘密結社holoX〗の用心棒として雇われている。</p>
      <div className="iroha-facts">
        <div className="iroha-fact"><small>BIRTHDAY</small><strong>6月18日</strong></div>
        <div className="iroha-fact"><small>DEBUT STREAM</small><strong>2021年11月30日</strong></div>
        <div className="iroha-fact"><small>HEIGHT</small><strong>156cm</strong></div>
        <div className="iroha-fact"><small>UNIT</small><strong>秘密結社holoX</strong></div>
        <div className="iroha-fact"><small>FAN NAME</small><strong>かざま隊</strong></div>
        <div className="iroha-fact"><small>ILLUSTRATOR</small><strong>うみぼうず</strong></div>
      </div>
    </section>
    <section className="iroha-content" style={{ background: '#fff5f0' }}>
      <p className="eyebrow">OFFICIAL LINKS</p>
      <h2>公式の活動をチェック</h2>
      <div className="iroha-link-grid">
        <a className="iroha-link-card" href={youtubeUrl} target="_blank" rel="noreferrer"><span><strong>YouTube</strong><small>Iroha ch. 風真いろは - holoX -</small></span><b>↗</b></a>
        <a className="iroha-link-card" href={xUrl} target="_blank" rel="noreferrer"><span><strong>X</strong><small>@kazamairohach</small></span><b>↗</b></a>
        <a className="iroha-link-card" href={officialProfileUrl} target="_blank" rel="noreferrer"><span><strong>hololive 公式プロフィール</strong><small>最新のプロフィール・公式情報</small></span><b>↗</b></a>
        <a className="iroha-link-card" href="https://3d.nicovideo.jp/works/td84835" target="_blank" rel="noreferrer"><span><strong>MMD</strong><small>公式プロフィール掲載の関連リンク</small></span><b>↗</b></a>
      </div>
      <div className="iroha-page-actions">
        <a className="portal-button portal-button-primary" href="/iroha/music"><span>音楽をチェック</span><b>→</b></a>
        <a className="portal-button portal-button-ghost" href="/iroha/streams"><span>配信をチェック</span><b>→</b></a>
      </div>
      <p className="iroha-callout">このページはファンによる非公式の紹介ページです。所属事務所・ご本人とは関係ありません。プロフィール情報の出典はhololive公式サイトです。</p>
    </section>
  </>;
}
