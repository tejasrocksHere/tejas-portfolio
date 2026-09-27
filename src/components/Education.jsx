import { education } from '../data/content.js'

export default function Education() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head"><h2>Education</h2></div>
        <div className="edu-line">
          <b>{education.school}</b> — {education.degree}<br />{education.dates}
        </div>
      </div>
    </section>
  )
}
