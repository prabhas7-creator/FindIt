import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home, ArrowLeft } from 'lucide-react';
import { BRAND } from '../utils/constants';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto shadow-soft">
          <SearchX className="w-10 h-10 text-findit-navy" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-findit-teal-dark uppercase tracking-widest block">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Looks like this page is lost!
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The page you are looking for doesn't exist, was moved, or the link might be broken.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-findit-navy hover:bg-findit-navy-light text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/items"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
          >
            <span>Browse Items</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
