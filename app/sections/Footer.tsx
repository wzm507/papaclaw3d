'use client'

interface FooterProps {
  contactTitle: string
  contactDescription: string
  ctaText: string
  socialLinks: { name: string; url: string }[]
  copyright: string
  legalLinks: { label: string; url: string }[]
  credit: string
}

export default function Footer({ contactTitle, contactDescription, ctaText, socialLinks, copyright, legalLinks, credit }: FooterProps) {
  return (
    <footer className="section bg-midnight-ink px-6 py-20 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-content border border-white/10 bg-white/[0.04] px-5 py-12 text-center mb-12 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:px-10">
          <p className="mb-5 font-utility text-caption uppercase text-white/60">
            Contact
          </p>
          <h2 className="font-utility text-heading-lg font-semibold mb-5 text-balance">
            {contactTitle}
          </h2>
          <p className="mx-auto max-w-3xl font-utility text-body text-white/72 mb-9">
            {contactDescription}
          </p>
          <button className="min-h-12 rounded-content border border-white/15 bg-paper-white px-8 py-4 font-utility text-sm font-semibold text-deep-forest shadow-[0_18px_40px_rgba(255,255,255,0.08)] transition-all hover:-translate-y-0.5 hover:border-bubblegum-blush hover:bg-bubblegum-blush">
            {ctaText}
          </button>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-utility text-sm text-white/62 hover:text-white transition-colors underline underline-offset-4"
            >
              {social.name}
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/12">
          <p className="font-utility text-caption text-white/45">
            {copyright}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.url} className="font-utility text-caption text-white/45 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="font-utility text-caption text-white/45">
            {credit}
          </p>
        </div>
      </div>
    </footer>
  )
}
