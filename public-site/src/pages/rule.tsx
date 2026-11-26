const rules = [
  ['01', '互いを尊重する', '相手の考え方や好きなものを尊重し、誹謗中傷、嫌がらせ、差別的な発言、過度な煽りなどを行わないでください。'],
  ['02', '安心・安全を守る', '個人情報やプライベートな情報を本人の許可なく共有しないでください。詐欺、なりすまし、迷惑行為、危険なリンクの共有は禁止します。'],
  ['03', 'チャンネルの用途を守る', '各チャンネルの案内に沿って投稿してください。連投、スパム、無関係な宣伝、過度なメンションは控えてください。'],
  ['04', '作品・コンテンツの権利を尊重する', '他者のイラスト、文章、画像、動画などを共有する場合は、権利や投稿元のルールを確認してください。自作であるかのような誤認を招く投稿はしないでください。'],
  ['05', '運営の案内に協力する', '運営からの注意や案内には協力してください。問題がある場合は、公開チャンネルでの口論ではなく、案内された問い合わせ・相談窓口を利用してください。'],
  ['06', 'Discordの規約を守る', 'Discordの利用規約・コミュニティガイドラインに従ってください。違反が確認された場合、Discord側の措置が適用されることもあります。'],
];
export default function RulePage() {
  return <>
    <section className="subpage-hero subpage-hero-rules"><p className="eyebrow">COMMUNITY GUIDELINES / KGP</p><span className="subpage-number">06 / SAFETY</span><h1>みんなが心地よく<br /><em>過ごすために。</em></h1><p>自由に楽しめる場所を、みんなで守るための約束です。</p></section>
    <section className="policy-layout"><aside className="policy-aside"><p className="eyebrow">GUIDELINES</p><p>Respect<br />Safety<br />Fairness<br />Together</p><a href="/terms">利用規約 →</a><a href="/privacy">プライバシー →</a></aside><div className="policy-content"><p className="policy-lead">KGPでは、さまざまな価値観や楽しみ方を持つ人が同じ場所で過ごします。すべての人が安心して参加できるよう、次のことを大切にしてください。</p>{rules.map(([no, title, body]) => <article className="policy-rule" key={no}><span>{no}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}<div className="policy-warning"><strong>違反への対応について</strong><p>状況に応じて、運営から注意、投稿の削除、タイムアウト、キック、BANなどの対応を行う場合があります。対応は内容や経緯を踏まえて判断します。すべてのケースで同じ措置になるとは限りません。</p></div><p className="policy-updated">このページはコミュニティ運営上の案内です。最新の案内はDiscordサーバー内の掲示も確認してください。</p></div></section>
  </>;
}
