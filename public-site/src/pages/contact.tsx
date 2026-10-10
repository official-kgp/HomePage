import type { Copy } from '../locales';

type ContactPageProps = { copy: Copy; contactEmail: string };

export function ContactPage({ copy, contactEmail }: ContactPageProps) {
  return <>
    <section className="page-hero page-hero-blue">
      <p className="eyebrow"><span className="eyebrow-mark" />{copy.contact.eyebrow}</p>
      <h1>{copy.contact.title}</h1>
      <p className="page-lede">{copy.contact.description}</p>
      <span className="page-index">{copy.contact.index}</span>
    </section>
    <section className="content-section contact-layout">
      <a className="contact-email" href={`mailto:${contactEmail}`}><span>{copy.contact.email}</span><strong>{contactEmail}</strong><span aria-hidden="true">↗</span></a>
      <form className="contact-form" action="https://formspree.io/f/mnqvkwqj" method="POST">
        <label>{copy.contact.formName}<input name="name" autoComplete="name" required /></label>
        <label>{copy.contact.formEmail}<input type="email" name="_replyto" autoComplete="email" required /></label>
        <label>{copy.contact.formMessage}<textarea name="message" rows={5} required /></label>
        <button className="button button-ink" type="submit">{copy.contact.send}<span aria-hidden="true">↗</span></button>
      </form>
    </section>
  </>;
}
