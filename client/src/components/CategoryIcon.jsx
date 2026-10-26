import React from 'react';
import {
  Laptop,
  FileText,
  Briefcase,
  Key,
  Shirt,
  BookOpen,
  Watch,
  Wallet,
  Package,
} from 'lucide-react';

export const CategoryIcon = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'Electronics':
      return <Laptop className={className} />;
    case 'Documents and ID Cards':
      return <FileText className={className} />;
    case 'Bags and Backpacks':
      return <Briefcase className={className} />;
    case 'Keys':
      return <Key className={className} />;
    case 'Clothing':
      return <Shirt className={className} />;
    case 'Books and Stationery':
      return <BookOpen className={className} />;
    case 'Jewellery and Accessories':
      return <Watch className={className} />;
    case 'Wallets and Money':
      return <Wallet className={className} />;
    default:
      return <Package className={className} />;
  }
};
