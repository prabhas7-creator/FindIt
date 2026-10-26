import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { ItemForm } from '../components/ItemForm';

export const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/items/${id}`);
        if (res.data?.success) {
          setItem(res.data.item);
        }
      } catch (err) {
        setError(err.message || 'Could not load report.');
      } finally {
        setFetching(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.patch(`/items/${id}`, formData);
      if (res.data?.success) {
        navigate(`/items/${id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update report.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-findit-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-xs text-slate-500">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-findit-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Go Back</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-findit-navy text-white flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Report
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Update the details of your report. Changes will take effect immediately.
            </p>
          </div>
        </div>

        {item && (
          <ItemForm
            initialValues={item}
            fixedType={item.type}
            isEditing={true}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};
