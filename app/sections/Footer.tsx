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
    <footer className="section py-24 px-6 bg-deep-forest text-white">
      <div className="max-w-7xl mx-auto">
        <div className="border-y border-white/18 py-12 text-center mb-14">
          <p className="font-utility text-caption text-white/60 uppercase mb-5" style={{ letterSpacing: '0.08em' }}>
            Contact
          </p>
          <h2 className="font-editorial text-heading-lg font-bold mb-5 text-balance">
            {contactTitle}
          </h2>
          <p className="mx-auto max-w-3xl font-editorial text-body text-white/72 mb-9">
            {contactDescription}
          </p>
          <button className="min-h-12 border border-white/25 bg-foudre-pink px-8 py-4 font-utility text-sm font-semibold text-white hover:bg-paper-white hover:text-deep-forest transition-colors">
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
