import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ContactRequestModal = ({ item, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [senderContact, setSenderContact] = useState(user?.phone || user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a message explaining your claim or inquiry.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/requests', {
        itemId: item._id,
        message: message.trim(),
        senderContact: senderContact.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(res.data);
        onClose();
        setSuccess(false);
        setMessage('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit contact request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-hover border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-findit-navy px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h3 className="font-semibold text-lg">
              {item.type === 'LOST' ? 'Found This Item? Contact Owner' : 'Is This Yours? Contact Finder'}
            </h3>
            <p className="text-xs text-slate-300 truncate max-w-sm">
              Item: {item.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-semibold text-slate-800">
                Message Sent!
              </h4>
              <p className="text-sm text-slate-500">
                Your request has been forwarded to the reporter. You can monitor responses in your dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message or Claim Proof *
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    item.type === 'LOST'
                      ? 'e.g., "Hello, I found your wallet outside classroom 302 and handed it to the library security desk."'
                      : 'e.g., "Hello, this is my calculator. It has my initial S.D. carved on the back cover."'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-findit-navy focus:border-transparent text-sm resize-none"
                ></textarea>
                <p className="text-[11px] text-slate-400 mt-1">
                  Be descriptive so the person can verify you are the legitimate owner or finder.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  How should they contact you back? (Email or Phone)
                </label>
                <input
                  type="text"
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  placeholder="e.g., student@college.edu or 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-findit-navy focus:border-transparent text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-findit-navy bg-findit-teal hover:bg-findit-teal-hover rounded-xl shadow-sm transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-findit-navy border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
