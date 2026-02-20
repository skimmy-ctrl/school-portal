import { Link } from 'react-router-dom';
import logo from '../../assets/mavade.svg';

type PublicFooterProps = {
  showLandingAnchors?: boolean;
};

export function PublicFooter({ showLandingAnchors = false }: PublicFooterProps) {
  const whyUsHref = showLandingAnchors ? '#why-us' : '/#why-us';
  const requestInfoHref = showLandingAnchors ? '#request-info' : '/#request-info';

  return (
    <footer className="w-full bg-slate-100/80 border-t border-slate-200/70 py-12 flex justify-center">
      <div className="max-w-7xl w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center">
              <img src={logo} alt="mavade logo" className="size-30" />
            </div>
            <p className="text-sm text-slate-600">
              A modern school portal for admissions, communication, and learning support.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={whyUsHref} className="text-slate-600 hover:text-slate-900 transition-colors">Why Mavade</Link></li>
              <li><Link to="/admissions" className="text-slate-600 hover:text-slate-900 transition-colors">Admissions</Link></li>
              <li><Link to={requestInfoHref} className="text-slate-600 hover:text-slate-900 transition-colors">Request Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About Mavade</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact Us</Link></li>
              <li><Link to="/admissions" className="text-slate-600 hover:text-slate-900 transition-colors">Visit Admissions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">Our Mission</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 text-center text-sm">
          <p className="text-slate-500">&copy; {new Date().getFullYear()} Mavade Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
