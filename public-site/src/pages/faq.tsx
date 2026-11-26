const faqs = [
  ['風真いろはのファンでなくても参加できますか？', 'KGPは風真いろはを応援するファンを中心としたコミュニティです。一方で、さまざまな「好き」を尊重し、日常や趣味の話題も楽しめる場所を目指しています。サーバーの趣旨やルールをご確認のうえご参加ください。'],
  ['見るだけ・ROM専でも大丈夫ですか？', 'もちろんです。会話への参加を強制するものではありません。読むだけ、リアクションだけなど、自分のペースで過ごしてください。'],
  ['参加費はかかりますか？', 'KGPへの参加自体に参加費は設けていません。Discordの利用環境や通信にかかる費用は各自でご確認ください。'],
  ['スマートフォンから参加できますか？', 'はい。Discordアプリを利用すればスマートフォンから参加できます。PC・ブラウザからも利用できます。'],
  ['イベントはいつ開催されますか？', 'イベントは不定期で開催しています。開催日時や参加方法は、サーバー内のお知らせをご確認ください。'],
  ['困ったことがあった場合は？', 'サーバー内の問い合わせ・相談窓口、または公式サイトのお問い合わせページからご連絡ください。緊急性のある場合は、Discordの通報機能などもご利用ください。'],
];
export function FaqPage() {
  return <>
    <section className="subpage-hero subpage-hero-faq"><p className="eyebrow">FAQ / QUICK ANSWERS</p><span className="subpage-number">Q&A</span><h1>気になることを、<br /><em>先にチェック。</em></h1><p>参加前によくある質問をまとめました。</p></section>
    <section className="faq-list">{faqs.map(([question, answer], index) => <details className="faq-item" key={question}><summary><span>Q{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><i>＋</i></summary><p>{answer}</p></details>)}</section>
    <section className="faq-contact"><p>ここにない質問は、お気軽にお問い合わせください。</p><a className="inline-arrow" href="/contact">お問い合わせ <b>↗</b></a></section>
  </>;
}