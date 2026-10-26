import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Compass,
} from 'lucide-react';
import api from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { CATEGORIES } from '../utils/constants';

export const BrowseItems = ({ fixedType = null, pageTitle = 'Browse All Items' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state initialization
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialType = fixedType || searchParams.get('type') || 'All';
  const initialStatus = searchParams.get('status') || 'All';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(initialPage);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync fixedType prop if provided (e.g. from /items/lost or /items/found)
  useEffect(() => {
    if (fixedType) {
      setType(fixedType);
    }
  }, [fixedType]);

  // Fetch items from backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category && category !== 'All') params.append('category', category);
      if (type && type !== 'All') params.append('type', type);
      if (status && status !== 'All') params.append('status', status);
      params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 9);

      const res = await api.get(`/items?${params.toString()}`);
      if (res.data?.success) {
        setItems(res.data.items);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // Update URL params
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (category !== 'All') newParams.category = category;
    if (type !== 'All' && !fixedType) newParams.type = type;
    if (status !== 'All') newParams.status = status;
    if (page > 1) newParams.page = page;
    setSearchParams(newParams, { replace: true });
  }, [search, category, type, status, sort, page]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    if (!fixedType) setType('All');
    setStatus('All');
    setSort('-createdAt');
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    (!fixedType && type !== 'All') ||
    status !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {fixedType === 'LOST' && <HelpCircle className="w-8 h-8 text-rose-500" />}
            {fixedType === 'FOUND' && <Compass className="w-8 h-8 text-emerald-500" />}
            <span>{pageTitle}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {fixedType === 'LOST'
              ? 'Browse lost items reported on campus. Did you find any of these?'
              : fixedType === 'FOUND'
              ? 'Browse found items awaiting their rightful owners.'
              : 'Browse all lost and found reports. Use filters to quickly locate items.'}
          </p>
        </div>

        {/* Total Count Badge */}
        <div className="text-sm text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          Showing <span className="font-bold text-findit-navy">{items.length}</span> of{' '}
          <span className="font-bold text-findit-navy">{total}</span> reports
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, description, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-52 shrink-0">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-findit-navy text-sm bg-white text-slate-700"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-incidentDate">Incident Date (Recent)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-findit-navy"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Type Filter (only show if not on fixed /lost or /found page) */}
          {!fixedType && (
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-findit-navy"
            >
              <option value="All">All Types (Lost & Found)</option>
              <option value="LOST">Lost Items Only</option>
              <option value="FOUND">Found Items Only</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-findit-navy"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active Reports</option>
            <option value="RESOLVED">Resolved Reports</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Items Grid / State Render */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"
            ></div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-slate-600 px-4">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                disabled={page === pages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              No matching items found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              We couldn't find any listings matching your search or filters.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-findit-navy text-white text-sm font-semibold hover:bg-findit-navy-light transition-all"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
