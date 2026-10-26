import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message or claim details'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    senderContact: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

contactRequestSchema.index({ recipientId: 1, createdAt: -1 });
contactRequestSchema.index({ senderId: 1, itemId: 1 });

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
export default ContactRequest;
