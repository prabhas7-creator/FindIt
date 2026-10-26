import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  User,
  Mail,
  Phone,
  Inbox,
  Send,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { TypeBadge } from '../components/StatusBadge';

export const ContactRequests = () => {
  const [activeTab, setActiveTab] = useState('INCOMING'); // INCOMING or SENT
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/requests');
      if (res.data?.success) {
        setIncoming(res.data.incoming || []);
        setSent(res.data.sent || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load contact requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      setActionLoading(true);
      await api.patch(`/requests/${requestId}`, { status: newStatus });
      await fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to update request.');
    } finally {
      setActionLoading(false);
    }
  };

  const currentList = activeTab === 'INCOMING' ? incoming : sent;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-8 h-8 text-findit-teal-dark" />
            <span>Contact Requests & Claims</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review inquiries and coordinate item returns safely with fellow campus members.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('INCOMING')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'INCOMING'
                ? 'bg-white text-findit-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming ({incoming.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('SENT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SENT'
                ? 'bg-white text-findit-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent by Me ({sent.length})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-findit-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Loading requests...</p>
        </div>
      ) : currentList.length > 0 ? (
        <div className="space-y-4">
          {currentList.map((req) => {
            const isPending = req.status === 'PENDING';
            const isAccepted = req.status === 'ACCEPTED';
            const isRejected = req.status === 'REJECTED';

            return (
              <div
                key={req._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-soft p-5 sm:p-6 space-y-4"
              >
                {/* Header row: Item Title & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {req.itemId?.type && <TypeBadge type={req.itemId.type} />}
                    <Link
                      to={`/items/${req.itemId?._id}`}
                      className="font-bold text-slate-900 hover:text-findit-navy hover:underline text-base line-clamp-1"
                    >
                      {req.itemId?.title || 'Reported Item'}
                    </Link>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      isAccepted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isRejected
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isAccepted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isRejected && <XCircle className="w-3.5 h-3.5" />}
                    {isPending && <Clock className="w-3.5 h-3.5" />}
                    <span>{req.status}</span>
                  </span>
                </div>

                {/* Message Content */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {req.message}
                </div>

                {/* Contact Metadata and Decision actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {activeTab === 'INCOMING'
                          ? `From: ${req.senderId?.name || 'Student'}`
                          : `To: ${req.recipientId?.name || 'Reporter'}`}
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(req.createdAt)}</span>
                    </div>

                    {(isAccepted || activeTab === 'INCOMING') && req.senderContact && (
                      <div className="flex items-center gap-2 text-findit-navy font-semibold">
                        <Mail className="w-3.5 h-3.5 text-findit-teal-dark" />
                        <span>Reply Contact: {req.senderContact}</span>
                      </div>
                    )}
                  </div>

                  {/* Accept / Reject actions only for recipient on incoming pending requests */}
                  {activeTab === 'INCOMING' && isPending && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'REJECTED')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                      >
                        Reject Claim
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'ACCEPTED')}
                        disabled={actionLoading}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold text-findit-navy bg-findit-teal hover:bg-findit-teal-hover transition-colors shadow-sm"
                      >
                        Accept Claim
                      </button>
                    </div>
                  )}

                  {/* Reopened or already answered status text */}
                  {activeTab === 'INCOMING' && !isPending && (
                    <span className="text-xs text-slate-400 font-medium">
                      You marked this request as {req.status.toLowerCase()}.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">
            No {activeTab.toLowerCase()} requests
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'INCOMING'
              ? 'When students send claims or messages regarding your reports, they will show up here.'
              : 'You have not sent any claim messages yet.'}
          </p>
        </div>
      )}
    </div>
  );
};
