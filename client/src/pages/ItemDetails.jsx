import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldAlert,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TypeBadge, StatusBadge } from '../components/StatusBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import { ContactRequestModal } from '../components/ContactRequestModal';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_FALLBACK_IMAGE } from '../utils/constants';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/items/${id}`);
        if (res.data?.success) {
          setItem(res.data.item);
        }
      } catch (err) {
        setError(err.message || 'Item not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-findit-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading report details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200">
          {error || 'Item not found.'}
        </div>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-4 py-2 bg-findit-navy text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.id === item.userId?._id || user._id === item.userId?._id);
  const fallbackSrc =
    CATEGORY_FALLBACK_IMAGES[item.category] || DEFAULT_FALLBACK_IMAGE;

  // Handle Mark Resolved
  const handleToggleResolve = async () => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/items/${item._id}/resolve`);
      if (res.data?.success) {
        setItem(res.data.item);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report? This cannot be undone.')) {
      try {
        setActionLoading(true);
        await api.delete(`/items/${item._id}`);
        navigate('/dashboard');
      } catch (err) {
        alert(err.message || 'Failed to delete report.');
        setActionLoading(false);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-findit-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft">
            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
              <img
                src={item.imageUrl || fallbackSrc}
                alt={item.title}
                onError={(e) => {
                  e.target.src = fallbackSrc;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <TypeBadge type={item.type} size="lg" />
                <StatusBadge status={item.status} size="lg" />
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                  <CategoryIcon category={item.category} className="w-4 h-4 text-findit-teal-dark" />
                  <span>{item.category}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {item.title}
                </h1>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Detailed Description
                </h3>
                <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Key Incident Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-5 h-5 text-findit-teal-dark mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Incident Location
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-5 h-5 text-findit-teal-dark mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Incident Date
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {formatDate(item.incidentDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Action Card & Reporter Info */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-6">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              {isOwner ? 'Manage Your Report' : 'Inquire or Claim'}
            </h3>

            {isOwner ? (
              <div className="space-y-3">
                <button
                  onClick={handleToggleResolve}
                  disabled={actionLoading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                    item.status === 'RESOLVED'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {item.status === 'RESOLVED' ? 'Reopen as Active' : 'Mark as Resolved'}
                  </span>
                </button>

                <Link
                  to={`/items/${item._id}/edit`}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Report</span>
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Report</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-findit-teal hover:bg-findit-teal-hover text-findit-navy transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {item.type === 'LOST' ? 'I Found This Item' : 'Claim This Item'}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-3 text-center">
                    <p className="text-xs text-slate-500">
                      Sign in to send a secure claim request or contact this student.
                    </p>
                    <Link
                      to="/login"
                      state={{ from: window.location.pathname }}
                      className="block w-full py-3 px-4 rounded-xl font-bold text-sm bg-findit-navy hover:bg-findit-navy-light text-white text-center shadow-sm"
                    >
                      Sign In to Contact
                    </Link>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Reported by: {item.userId?.name || 'Campus Student'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Posted {formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Safety Notice Box */}
          <div className="bg-amber-50 rounded-3xl border border-amber-200/80 p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Campus Safety Notice</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              For your safety, meet in a public campus venue during regular hours (library front desk or security kiosk). Request identifying details (e.g. lockscreen wallpaper, serial number, student card name) before handing over valuables.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Request Modal */}
      <ContactRequestModal
        item={item}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSuccess={() => {
          alert('Your contact request has been sent to the reporter!');
        }}
      />
    </div>
  );
};
