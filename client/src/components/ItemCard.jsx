import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { TypeBadge, StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { formatDate, truncate } from '../utils/formatters';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_FALLBACK_IMAGE } from '../utils/constants';

export const ItemCard = ({ item }) => {
  const fallbackSrc =
    CATEGORY_FALLBACK_IMAGES[item.category] || DEFAULT_FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(item.imageUrl || fallbackSrc);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc(fallbackSrc)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <TypeBadge type={item.type} />
          <StatusBadge status={item.status} />
        </div>

        {/* Category Pill on Bottom of Image */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-sm">
          <CategoryIcon category={item.category} className="w-3.5 h-3.5 text-slate-600" />
          <span>{item.category}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-findit-navy transition-colors line-clamp-1 mb-2">
            {item.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {truncate(item.description, 110)}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500 gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatDate(item.incidentDate)}</span>
            </div>

            <Link
              to={`/items/${item._id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-findit-navy hover:text-findit-teal-dark transition-colors group/link"
            >
              <span>Details</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
