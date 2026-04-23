import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import fullLogo from '../assets/full_logo.png';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1a3d1f] text-white">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + tagline */}
          <div className="space-y-4">
            <Link to="/" className="block w-fit">
              <img src={fullLogo} alt="TechzGreen" className="h-14 w-auto bg-white rounded-xl px-4 py-2 object-contain shadow-lg hover:opacity-90 transition-opacity" style={{filter:'contrast(1.15) brightness(0.92)'}} />
            </Link>
            <p className="text-[rgba(200,230,201,0.8)] text-sm leading-relaxed max-w-xs">
              Turning plastic waste into green rewards. Every bin. Every action. Every community member counts.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { label: 'IG', title: 'Instagram' },
                { label: 'TW', title: 'Twitter' },
                { label: 'FB', title: 'Facebook' },
                { label: 'IN', title: 'LinkedIn' },
              ].map(({ label, title }) => (
                <a
                  key={title}
                  href="#"
                  aria-label={title}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(76,175,80,0.3)] text-[rgba(200,230,201,0.8)] hover:text-white transition-all flex items-center justify-center text-xs font-black"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#4caf50] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Shop', to: '/shop' },
                { label: 'Events', to: '/events' },
                { label: 'Earn Points', to: '/rewards' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[rgba(200,230,201,0.75)] hover:text-white text-sm font-medium transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#4caf50] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[rgba(200,230,201,0.75)]">
                <MapPin className="w-4 h-4 mt-0.5 text-[#4caf50] shrink-0" />
                <span>JJ Complex, Koonammoochi (P.O)<br />Thrissur, Kerala, India — 680504</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#4caf50] shrink-0" />
                <a href="mailto:techzgreen23@gmail.com" className="text-[rgba(200,230,201,0.75)] hover:text-white transition-colors">
                  techzgreen23@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#4caf50] shrink-0" />
                <a href="tel:+918714985123" className="text-[rgba(200,230,201,0.75)] hover:text-white transition-colors">
                  +91 87149 85123
                </a>
              </li>
            </ul>
          </div>

          {/* Mission blurb */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#4caf50] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Our Mission
            </h4>
            <p className="text-[rgba(200,230,201,0.75)] text-sm leading-relaxed mb-4">
              Empowering communities to dispose of plastic waste responsibly through rewards, education, and a circular economy approach.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 btn-accent text-sm !py-2 !px-4"
            >
              Join the Movement
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(255,255,255,0.08)]">
        <div className="page-container py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[rgba(200,230,201,0.5)]">
          <p>© {new Date().getFullYear()} TechzGreen Pvt. Ltd. All rights reserved.</p>
          <p>Built for a greener tomorrow 🌿</p>
        </div>
      </div>
    </footer>
  );
}
