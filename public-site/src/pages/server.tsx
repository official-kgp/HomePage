import type { Copy } from '../locales';

type ServerPageProps = { copy: Copy; inviteUrl: string };

export function ServerPage({ copy, inviteUrl }: ServerPageProps) {
  return <>
    <section className="page-hero page-hero-green">
      <p className="eyebrow"><span className="eyebrow-mark" />{copy.server.eyebrow}</p>
      <h1>{copy.server.title}</h1>
      <p className="page-lede">{copy.server.intro}</p>
      <span className="page-index">{copy.server.index}</span>
    </section>
    <section className="content-section server-features">
      {copy.server.features.map((feature, index) => <article className="server-feature" key={feature.title}>
        <span className="feature-number">0{index + 1}</span>
        <div><h2>{feature.title}</h2><p>{feature.body}</p></div>
        <span aria-hidden="true" className="feature-mark">✳</span>
      </article>)}
    </section>
    <section className="join-band">
      <p className="eyebrow">{copy.server.joinEyebrow}</p>
      <a className="button button-ink" href={inviteUrl} target="_blank" rel="noreferrer">{copy.server.join}<span aria-hidden="true">↗</span></a>
    </section>
  </>;
}
