import { Link } from 'react-router-dom'
import { ctaBand } from '../content/lt/common'
import { ContentTrail } from './ContentTrail'
import { SplitText } from './motion'

/**
 * The grey "Ieškote pagalbos? Susisiekite su mumis" band that closes every
 * page on the original. The heading un-blurs word by word as it scrolls
 * in; moving the pointer over the band leaves a trail of coloured words.
 * The whole band links to Kontaktai.
 */
export function CtaBand() {
  return (
    <section className="cta-band">
      <Link to="/kontaktai" className="cta-band__link">
        <span className="sr-only">{ctaBand.linkLabel}</span>
      </Link>
      <div className="cta-band__inner">
        <SplitText as="h2" text={ctaBand.title} effect="blur-bottom" />
      </div>
      <ContentTrail words={ctaBand.trailWords} colors={ctaBand.trailColors} />
    </section>
  )
}
