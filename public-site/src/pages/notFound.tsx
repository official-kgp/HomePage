import type { Copy } from '../locales';

type NotFoundPageProps = { copy: Copy };

export function NotFoundPage({ copy }: NotFoundPageProps) {
  return <section className="not-found">
    <p className="eyebrow">{copy.common.notFoundEyebrow}</p>
    <h1>{copy.common.notFound}</h1>
    <p>{copy.common.notFoundDescription}</p>
    <a className="button button-ink" href="/site/">{copy.common.backHome}<span aria-hidden="true">↗</span></a>
  </section>;
}
