import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  HelpCircle,
  Compass,
  CheckCircle2,
  Clock,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TypeBadge, StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_FALLBACK_IMAGE } from '../utils/constants';

export const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    userTotal: 0,
    userActiveLost: 0,
    userActiveFound: 0,
    userResolved: 0,
    pendingRequests: 0,
  });

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, LOST, FOUND, RESOLVED
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user stats
      const statsRes = await api.get('/dashboard/stats');
      if (statsRes.data?.stats?.user) {
        setStats(statsRes.data.stats.user);
      }

      // Fetch user items with tab filtering
      let url = '/dashboard/items?limit=50';
      if (activeTab === 'LOST') url += '&type=LOST&status=ALL';
      else if (activeTab === 'FOUND') url += '&type=FOUND&status=ALL';
      else if (activeTab === 'RESOLVED') url += '&status=RESOLVED';

      const itemsRes = await api.get(url);
      if (itemsRes.data?.success) {
        setItems(itemsRes.data.items);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  // Handle Mark Resolved
  const handleToggleResolve = async (itemId) => {
    try {
      setActionLoading(true);
      await api.patch(`/items/${itemId}/resolve`);
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update item status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be reversed.')) {
      try {
        setActionLoading(true);
        await api.delete(`/items/${itemId}`);
        await fetchDashboardData();
      } catch (err) {
        alert(err.message || 'Failed to delete report.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-findit-navy via-[#16274a] to-findit-navy text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-findit-teal text-xs font-bold uppercase tracking-wider block mb-1">
            Student Portal Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Track your reports, review claim requests, and manage your lost & found listings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report/lost"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report/found"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-findit-teal hover:bg-findit-teal-hover text-findit-navy shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* User Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            My Total Reports
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-findit-navy mt-1">
            {stats.userTotal}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            All submitted items
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-soft">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
            Active Lost
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-1">
            {stats.userActiveLost}
          </p>
          <span className="text-[11px] text-rose-500/80 mt-1 block">
            Still looking for
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-teal-100 shadow-soft">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
            Active Found
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 mt-1">
            {stats.userActiveFound}
          </p>
          <span className="text-[11px] text-teal-600/80 mt-1 block">
            Awaiting owner claim
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-soft">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Resolved Items
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
            {stats.userResolved}
          </p>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            Successfully returned
          </span>
        </div>

        <Link
          to="/requests"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-findit-teal/40 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex flex-col justify-between group col-span-2 lg:col-span-1"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Claim Requests
              </span>
              <MessageSquare className="w-4 h-4 text-findit-teal-dark" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-findit-navy mt-1">
              {stats.pendingRequests}
            </p>
          </div>
          <span className="text-[11px] text-findit-teal-dark font-semibold mt-2 group-hover:underline">
            View Requests & Inquiries →
          </span>
        </Link>
      </div>

      {/* Reports Section with Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              My Submitted Reports
            </h2>
            <p className="text-xs text-slate-500">
              Manage your reports, mark them as resolved, or update details anytime.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-white text-findit-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('LOST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'LOST'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Items
            </button>
            <button
              onClick={() => setActiveTab('FOUND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'FOUND'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Items
            </button>
            <button
              onClick={() => setActiveTab('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'RESOLVED'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-findit-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 mt-3 font-medium">Loading your listings...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const fallbackSrc =
                CATEGORY_FALLBACK_IMAGES[item.category] || DEFAULT_FALLBACK_IMAGE;

              return (
                <div
                  key={item._id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || fallbackSrc}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = fallbackSrc;
                      }}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <TypeBadge type={item.type} />
                        <StatusBadge status={item.status} />
                        <span className="text-xs text-slate-400 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-findit-navy">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Location: <span className="font-medium text-slate-700">{item.location}</span> • Reported on {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <Link
                      to={`/items/${item._id}`}
                      className="p-2 text-slate-500 hover:text-findit-navy hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/items/${item._id}/edit`}
                      className="p-2 text-slate-500 hover:text-findit-navy hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Report"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleToggleResolve(item._id)}
                      disabled={actionLoading}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        item.status === 'RESOLVED'
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title="Toggle Resolved Status"
                    >
                      {item.status === 'RESOLVED' ? 'Reopen' : 'Mark Resolved'}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={actionLoading}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center max-w-sm mx-auto space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">
              No reports in this tab
            </h4>
            <p className="text-xs text-slate-500">
              You haven't submitted any reports matching this filter yet.
            </p>
            <div className="pt-2">
              <Link
                to="/report/lost"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-findit-navy text-white text-xs font-semibold shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit a Report</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
