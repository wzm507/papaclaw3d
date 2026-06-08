'use client'

export default function Footer() {
  return (
    <footer className="section py-24 px-6 bg-deep-forest text-white">
      <div className="max-w-7xl mx-auto">
        {/* Contact Section */}
        <div className="text-center mb-16">
          <p className="text-caption text-white/60 uppercase tracking-wider mb-4">
            Contact
          </p>
          <h2 className="text-heading-lg font-bold mb-4">
            Racontez-nous.
          </h2>
          <p className="text-body text-white/70 mb-8">
            Un mini quiz, 3 questions, moins d&apos;une minute...
          </p>
          <button className="bg-foudre-pink text-white px-8 py-4 rounded-badge font-medium hover:bg-bubblegum-blush transition-colors">
            Lancer le quiz
          </button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-12">
          {['Instagram', 'TikTok', 'Pinterest', 'LinkedIn'].map((social) => (
            <a
              key={social}
              href="#"
              className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
            >
              {social}
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-caption text-white/40">
            © 2026 PAPACLAW, tous droits réservés.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-caption text-white/40 hover:text-white transition-colors">
              CONFIDENTIALITÉ
            </a>
            <a href="#" className="text-caption text-white/40 hover:text-white transition-colors">
              MENTIONS LÉGALES
            </a>
          </div>
          <p className="text-caption text-white/40 mt-4 md:mt-0">
            SITE PAR TROA
          </p>
        </div>
      </div>
    </footer>
  )
}
