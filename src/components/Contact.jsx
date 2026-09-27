import { contact } from '../data/content.js'

export default function Contact() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sec-head"><h2>Get in touch</h2></div>
        <div className="term">
          <div><span className="p1">tejas@systems</span>:~$ contact</div>
          <div>→ email <a href={`mailto:${contact.email}`}>{contact.email}</a></div>
          <div>→ phone <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a></div>
          <div>→ linkedin <a href={contact.linkedin} target="_blank" rel="noopener">/tejas-mundhe</a></div>
          <div>→ Leetcode <a href={contact.leetcode} target="_blank" rel="noopener">/tejasmundhe123</a></div>
        </div>
      </div>
    </section>
  )
}
