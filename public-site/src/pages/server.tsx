import type { Copy } from '../locales';
type ServerPageProps = { copy: Copy; inviteUrl: string };

const categories = [
  { no: '01', title: 'チャット・交流', en: 'CHAT & COMMUNITY', text: 'hololiveや風真いろはの話題はもちろん、日常の雑談や趣味の話も。話題に合わせたチャンネルで、気軽に会話を楽しめます。', items: ['ホロライブ関連の話題', '日常・雑談', 'ゲームや趣味の話題'] },
  { no: '02', title: 'ファンコンテンツ', en: 'FAN CONTENTS', text: 'ファンアートやAI関連の作品など、好きなものを共有できる場所も用意しています。投稿時は各コンテンツのルールを確認してください。', items: ['ファンアート', 'AI関連コンテンツ', '作品・情報の共有'] },
  { no: '03', title: '公式情報', en: 'OFFICIAL UPDATES', text: '風真いろはのXやYouTubeなどの更新情報をチェック。会話に参加しなくても、情報収集の場所として利用できます。', items: ['Xの投稿情報', 'YouTubeの動画・配信情報', 'お知らせ'] },
  { no: '04', title: 'イベント・企画', en: 'EVENTS & PROJECTS', text: '同時視聴やクイズ、誕生日企画などを不定期で開催。参加できるタイミングで、気軽に楽しんでください。', items: ['同時視聴企画', 'クイズ・交流企画', 'メンバー参加型の企画'] },
  { no: '05', title: '独自Bot・便利機能', en: 'ORIGINAL SYSTEMS', text: 'KGP独自のBotも活用しています。おみくじやRankなど、Discordならではの仕組みをコミュニティの楽しさにつなげています。', items: ['ぽこべぇ管理人', 'おみくじ', 'Rank・各種サーバー機能'] },
  { no: '06', title: 'ボイスチャット', en: 'VOICE CHANNELS', text: '複数人での交流だけでなく、少人数で話せる個室型VCも。大人数で話すのが苦手な方も、自分に合う場所を探せます。', items: ['通常ボイスチャンネル', '少人数向け個室型VC', '聞き専での参加もOK'] },
];

export function ServerPage({ copy, inviteUrl }: ServerPageProps) {
  return <>
    <section className="subpage-hero subpage-hero-server"><div className="subpage-hero-orbit" /><p className="eyebrow">EXPLORE THE COMMUNITY / KGP</p><span className="subpage-number">01—06</span><h1>この場所のこと、<br /><em>もっと知ってほしい。</em></h1><p>会話も、イベントも、独自の仕組みも。<br />KGPの楽しみ方を少しだけご紹介します。</p><a className="portal-button portal-button-primary" href={inviteUrl} target="_blank" rel="noreferrer"><span>Discordに参加する</span><b>↗</b></a></section>
    <section className="server-intro-block"><p className="eyebrow">A PLACE BUILT TOGETHER</p><h2>参加の仕方に、<em>正解はありません。</em></h2><p>毎日会話する人も、たまに覗く人も、イベントだけ参加する人も。KGPでは、それぞれの関わり方を大切にしています。</p><a className="inline-arrow" href="https://note.com/official_kgp/n/n9715b5790b9e" target="_blank" rel="noreferrer">公式note「KGPの紹介」を読む <b>↗</b></a></section>
    <section className="server-category-list">{categories.map((item) => <article className="server-category" key={item.no} data-reveal><div className="server-category-no">{item.no}<span>{item.en}</span></div><div className="server-category-main"><h2>{item.title}</h2><p>{item.text}</p><ul>{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul></div><span className="server-category-arrow">↗</span></article>)}</section>
    <section className="server-note"><span className="eyebrow">ONE MORE THING</span><h2>みんなでつくる、<br /><em>みんなの居場所。</em></h2><p>コミュニティの雰囲気は、運営だけでは完成しません。日々の会話やリアクション、イベントへの参加など、一人ひとりの関わりがKGPらしさを育てていきます。</p><a className="inline-arrow" href="https://note.com/official_kgp/n/n00f52b03940e" target="_blank" rel="noreferrer">KGPが大切にしている考え方 <b>↗</b></a></section>
    <section className="portal-cta compact-cta"><div className="portal-cta-content"><p className="eyebrow">READY WHEN YOU ARE</p><h2>気になったら、<em>遊びにおいで。</em></h2><p>まずは参加して、サーバーの案内をチェックしてみてください。</p><a className="portal-button portal-button-light" href={inviteUrl} target="_blank" rel="noreferrer"><span>Discordに参加する</span><b>↗</b></a></div></section>
  </>;
}
