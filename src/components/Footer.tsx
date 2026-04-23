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
              <div className="bg-white rounded-xl px-4 py-2 shadow-lg hover:opacity-90 transition-opacity inline-flex items-center">
                <img src={fullLogo} alt="TechzGreen" loading="lazy" className="h-14 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-[rgba(200,230,201,0.8)] text-sm leading-relaxed max-w-xs">
              Turning plastic waste into green rewards. Every bin. Every action. Every community member counts.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  title: 'Instagram',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
                },
                {
                  title: 'Twitter / X',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.536-8.626L2.25 2.25h6.832l4.26 5.636zm-1.16 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                },
                {
                  title: 'Facebook',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                },
                {
                  title: 'LinkedIn',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                },
              ].map(({ svg, title }) => (
                <a
                  key={title}
                  href="#"
                  aria-label={title}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(76,175,80,0.3)] text-[rgba(200,230,201,0.8)] hover:text-white transition-all flex items-center justify-center"
                >
                  {svg}
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
