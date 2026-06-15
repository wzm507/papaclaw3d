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
        {/* Contact Section */}
        <div className="text-center mb-16">
          <p className="text-caption text-white/60 uppercase tracking-wider mb-4">
            Contact
          </p>
          <h2 className="text-heading-lg font-bold mb-4">
            {contactTitle}
          </h2>
          <p className="text-body text-white/70 mb-8">
            {contactDescription}
          </p>
          <button className="bg-foudre-pink text-white px-8 py-4 rounded-badge font-medium hover:bg-bubblegum-blush transition-colors">
            {ctaText}
          </button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
            >
              {social.name}
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-caption text-white/40">
            {copyright}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.url} className="text-caption text-white/40 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-caption text-white/40 mt-4 md:mt-0">
            {credit}
          </p>
        </div>
      </div>
    </footer>
  )
}
