import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  HelpCircle,
  Compass,
  LayoutDashboard,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../utils/constants';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-findit-teal bg-findit-navy-light/40'
        : 'text-slate-300 hover:text-white hover:bg-findit-navy-light/20'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-base font-medium rounded-xl transition-colors ${
      isActive
        ? 'text-findit-teal bg-findit-navy-light/60 font-semibold'
        : 'text-slate-200 hover:text-white hover:bg-findit-navy-light/30'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-findit-navy text-white border-b border-findit-navy-light/40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-findit-teal rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-findit-teal to-findit-teal-dark p-0.5 shadow-sm">
              <img
                src="/logo.svg"
                alt="FindIt Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-findit-teal transition-colors">
                {BRAND.name}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 block -mt-1 font-medium">
                Lost & Found Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/items" className={navLinkClass}>
              Browse All
            </NavLink>
            <NavLink to="/items/lost" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-rose-400" />
                Lost Items
              </span>
            </NavLink>
            <NavLink to="/items/found" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                Found Items
              </span>
            </NavLink>
          </nav>

          {/* Desktop Actions / Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Report Dropdown / Buttons */}
            <Link
              to="/report/lost"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Report Lost
            </Link>
            <Link
              to="/report/found"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-findit-teal bg-findit-teal/10 hover:bg-findit-teal/20 border border-findit-teal/30 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Found
            </Link>

            <div className="h-5 w-px bg-slate-700 mx-1"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-findit-teal bg-findit-navy-light/60'
                        : 'text-slate-300 hover:text-white hover:bg-findit-navy-light/30'
                    }`
                  }
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </NavLink>
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    `p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-findit-teal bg-findit-navy-light/60'
                        : 'text-slate-300 hover:text-white hover:bg-findit-navy-light/30'
                    }`
                  }
                  title="Contact Requests"
                >
                  <MessageSquare className="w-5 h-5" />
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-findit-teal bg-findit-navy-light/60'
                        : 'text-slate-300 hover:text-white hover:bg-findit-navy-light/30'
                    }`
                  }
                  title="My Profile"
                >
                  <User className="w-5 h-5" />
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-findit-navy bg-findit-teal hover:bg-findit-teal-hover rounded-lg transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-findit-navy-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-findit-teal"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-findit-navy-dark border-t border-findit-navy-light/30 px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/items"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Browse All Items
          </NavLink>
          <NavLink
            to="/items/lost"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Lost Items
          </NavLink>
          <NavLink
            to="/items/found"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Found Items
          </NavLink>

          <div className="pt-2 pb-2 border-t border-slate-700/60 grid grid-cols-2 gap-2">
            <Link
              to="/report/lost"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-center rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30"
            >
              Report Lost
            </Link>
            <Link
              to="/report/found"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-center rounded-xl text-xs font-semibold text-findit-teal bg-findit-teal/10 border border-findit-teal/30"
            >
              Report Found
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-700/60 space-y-1">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Contact Requests
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                My Profile ({user?.name})
              </NavLink>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-base font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-slate-800 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-findit-navy bg-findit-teal rounded-xl"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
