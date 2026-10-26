import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Calendar,
  MapPin,
  Tag,
  FileText,
  AlertCircle,
  HelpCircle,
  Compass,
  Image as ImageIcon,
} from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export const ItemForm = ({
  initialValues = {},
  fixedType = 'LOST',
  isEditing = false,
  onSubmit,
  loading = false,
  error = '',
}) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialValues.title || '');
  const [type, setType] = useState(initialValues.type || fixedType);
  const [category, setCategory] = useState(initialValues.category || CATEGORIES[0]);
  const [description, setDescription] = useState(initialValues.description || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [incidentDate, setIncidentDate] = useState(
    initialValues.incidentDate
      ? new Date(initialValues.incidentDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || '');
  const [imagePreview, setImagePreview] = useState(initialValues.imageUrl || '');
  const [formErrors, setFormErrors] = useState({});

  // Handle local file selection to data URL for easy image preview and lightweight upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!location.trim()) errors.location = 'Location is required';
    if (!incidentDate) errors.incidentDate = 'Date is required';

    const selectedDate = new Date(incidentDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      errors.incidentDate = 'Incident date cannot be in the future';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      type,
      category,
      description: description.trim(),
      location: location.trim(),
      incidentDate,
      imageUrl: imageUrl.trim(),
    });
  };

  const isLost = type === 'LOST';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Type Toggle (if editing or allowed) */}
      {isEditing && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Report Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('LOST')}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                isLost
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Lost Item</span>
            </button>
            <button
              type="button"
              onClick={() => setType('FOUND')}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                !isLost
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Found Item</span>
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Item Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            isLost
              ? 'e.g., Black Leather Bifold Wallet'
              : 'e.g., Sony Wireless Headphones in Black Case'
          }
          className={`w-full px-4 py-3 rounded-xl border ${
            formErrors.title ? 'border-rose-400' : 'border-slate-300'
          } focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm`}
        />
        {formErrors.title && (
          <p className="text-xs text-rose-600 mt-1">{formErrors.title}</p>
        )}
      </div>

      {/* Category & Date Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Incident Date *
          </label>
          <input
            type="date"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              formErrors.incidentDate ? 'border-rose-400' : 'border-slate-300'
            } focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm bg-white`}
          />
          {formErrors.incidentDate && (
            <p className="text-xs text-rose-600 mt-1">{formErrors.incidentDate}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Specific Location on Campus *
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Central Library 2nd floor study table #12, or Cafeteria counter"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              formErrors.location ? 'border-rose-400' : 'border-slate-300'
            } focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm`}
          />
        </div>
        {formErrors.location && (
          <p className="text-xs text-rose-600 mt-1">{formErrors.location}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Detailed Description *
        </label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide identifying features (color, brand, distinguishing scratches, contents, tags, model number)..."
          className={`w-full px-4 py-3 rounded-xl border ${
            formErrors.description ? 'border-rose-400' : 'border-slate-300'
          } focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm resize-none`}
        ></textarea>
        {formErrors.description && (
          <p className="text-xs text-rose-600 mt-1">{formErrors.description}</p>
        )}
      </div>

      {/* Image Upload / URL */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Item Image (Optional)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {/* File Picker */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-findit-navy transition-colors bg-slate-50/50">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-semibold text-findit-navy">
                Upload image from device
              </span>
              <span className="text-[11px] text-slate-400">
                PNG, JPG or WEBP (Max 5MB)
              </span>
            </label>
          </div>

          {/* Or Image URL Input */}
          <div className="space-y-2">
            <input
              type="url"
              value={imageUrl.startsWith('data:') ? '' : imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
              placeholder="Or paste an image web link (URL)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-findit-navy text-xs"
            />
            <p className="text-[11px] text-slate-400 leading-tight">
              If left blank, an appropriate category illustration will be automatically assigned.
            </p>
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                setImagePreview('');
              }}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs hover:bg-black"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-7 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-60 flex items-center gap-2 ${
            isLost
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-findit-teal hover:bg-findit-teal-hover text-findit-navy'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>{isEditing ? 'Save Changes' : isLost ? 'Publish Lost Report' : 'Publish Found Report'}</span>
          )}
        </button>
      </div>
    </form>
  );
};
