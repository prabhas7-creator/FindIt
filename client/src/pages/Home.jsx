import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  HelpCircle,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  MapPin,
} from 'lucide-react';
import api from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORIES, BRAND } from '../utils/constants';

export const Home = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    activeLost: 0,
    activeFound: 0,
    resolvedReports: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [statsRes, itemsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/items?limit=6&sort=-createdAt'),
        ]);

        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
        if (itemsRes.data?.items) {
          setRecentItems(itemsRes.data.items);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Deep Navy and Teal Accents */}
      <section className="relative bg-gradient-to-b from-findit-navy via-[#12223f] to-findit-navy text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Decorative Ambient Circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-findit-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-findit-navy-light/60 border border-findit-teal/30 text-findit-teal text-xs sm:text-sm font-medium shadow-sm animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Campus Lost & Found Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Lost Something? <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-findit-teal to-teal-200">
              Let's Find It.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Report misplaced belongings, browse discovered items around campus, connect with finders securely, and reclaim your essentials with ease.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, item title, or location (e.g. 'wallet', 'library')..."
              className="flex-1 px-2 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-findit-navy hover:bg-findit-navy-light text-white text-sm font-semibold transition-all shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/report/lost"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/report/found"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-findit-teal hover:bg-findit-teal-hover text-findit-navy font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </Link>
            <Link
              to="/items"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-all"
            >
              <Compass className="w-4 h-4 text-findit-teal" />
              <span>Browse All Listings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Statistics Section (Real Backend Data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-findit-teal-dark" />
                <span>Live Portal Statistics</span>
              </h2>
              <p className="text-xs text-slate-500">
                Real-time counts backed by live MongoDB database
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sync
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Total Reports
              </span>
              <p className="text-3xl font-extrabold text-findit-navy mt-1">
                {stats.totalReports}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                All-time campus reports
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 block">
                Active Lost
              </span>
              <p className="text-3xl font-extrabold text-rose-700 mt-1">
                {stats.activeLost}
              </p>
              <span className="text-[11px] text-rose-500/80 mt-1 block">
                Items currently being searched
              </span>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block">
                Active Found
              </span>
              <p className="text-3xl font-extrabold text-teal-800 mt-1">
                {stats.activeFound}
              </p>
              <span className="text-[11px] text-teal-600/80 mt-1 block">
                Found items awaiting owners
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
                Resolved & Reunited
              </span>
              <p className="text-3xl font-extrabold text-emerald-800 mt-1">
                {stats.resolvedReports}
              </p>
              <span className="text-[11px] text-emerald-600/80 mt-1 block">
                Successfully returned items
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recently Reported Items
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Check out the latest reports from students and community members.
            </p>
          </div>
          <Link
            to="/items"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-findit-navy hover:text-findit-teal-dark transition-colors group"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"
              ></div>
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">
              No recent items yet
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Be the first to report a lost or found item today!
            </p>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-findit-teal-dark">
              Simple & Transparent
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How FindIt Works
            </h2>
            <p className="text-slate-600 text-sm">
              Our streamlined four-step workflow ensures fast recovery while keeping personal details protected.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-200/80 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-findit-navy text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Report the Item
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit a quick Lost or Found form with title, category, location, and optional photo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-200/80 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-findit-teal text-findit-navy flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Search & Filter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse our real-time database with multi-field search, categories, and date filters to find matching items.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-200/80 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-findit-navy-light text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Contact & Verify
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send a secure contact request message. Share identifying proof without exposing private contact info publicly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-200/80 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Return & Resolve
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hand over the item safely on campus and mark the report as Resolved to update the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore by Category
          </h2>
          <p className="text-slate-500 text-sm">
            Quickly jump into the category of item you are searching for.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat}
              to={`/items?category=${encodeURIComponent(cat)}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-findit-teal/20 text-slate-700 group-hover:text-findit-navy flex items-center justify-center mb-3 transition-colors">
                <CategoryIcon category={cat} className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-findit-navy transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety & Campus Privacy Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-findit-navy to-findit-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-findit-teal text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Safety Priority</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Safety Guidelines for Reclaiming Items
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Always meet in busy public campus areas such as the library reception, college main gate security, or department offices. Do not transfer any money for returning lost belongings.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/items/lost"
              className="px-5 py-2.5 rounded-xl bg-white text-findit-navy font-semibold text-sm hover:bg-slate-100 transition-colors text-center"
            >
              View Lost Items
            </Link>
            <Link
              to="/items/found"
              className="px-5 py-2.5 rounded-xl bg-findit-teal text-findit-navy font-semibold text-sm hover:bg-findit-teal-hover transition-colors text-center"
            >
              View Found Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
