import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { ItemForm } from '../components/ItemForm';

export const ReportFound = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/items', formData);
      if (res.data?.success && res.data?.item) {
        navigate(`/items/${res.data.item._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit found report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Report a Found Item
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Found an unattended belonging? Thank you for helping! Post the details to help reunite it with its owner.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <ItemForm
            fixedType="FOUND"
            isEditing={false}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
