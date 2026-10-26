import mongoose from 'mongoose';

export const CATEGORIES = [
  'Electronics',
  'Documents and ID Cards',
  'Bags and Backpacks',
  'Keys',
  'Clothing',
  'Books and Stationery',
  'Jewellery and Accessories',
  'Wallets and Money',
  'Other',
];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify if the item is LOST or FOUND'],
      enum: {
        values: ['LOST', 'FOUND'],
        message: 'Type must be either LOST or FOUND',
      },
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: CATEGORIES,
        message: 'Category is not valid',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please specify the location'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    incidentDate: {
      type: Date,
      required: [true, 'Please specify the date of the incident'],
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'RESOLVED'],
      default: 'ACTIVE',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search and filtering indexes
itemSchema.index({ type: 1, status: 1, createdAt: -1 });
itemSchema.index({ category: 1 });
itemSchema.index({ title: 'text', description: 'text', location: 'text' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
