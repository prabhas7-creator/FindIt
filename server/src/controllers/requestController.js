import ContactRequest from '../models/ContactRequest.js';
import Item from '../models/Item.js';

// @desc    Send a contact request/claim message for an item
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res, next) => {
  try {
    const { itemId, message, senderContact } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the item ID and a message.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Prevent user from contacting themselves
    if (item.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a contact request to your own report.',
      });
    }

    // Check for existing pending request from this user
    const existingRequest = await ContactRequest.findOne({
      itemId,
      senderId: req.user._id,
      status: 'PENDING',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending contact request for this item.',
      });
    }

    const contactRequest = await ContactRequest.create({
      itemId,
      senderId: req.user._id,
      recipientId: item.userId,
      message: message.trim(),
      senderContact: senderContact ? senderContact.trim() : req.user.email,
    });

    await contactRequest.populate('itemId', 'title type category status');
    await contactRequest.populate('recipientId', 'name');

    res.status(201).json({
      success: true,
      message: 'Contact request sent successfully to the reporter.',
      contactRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's incoming and sent contact requests
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res, next) => {
  try {
    const incoming = await ContactRequest.find({ recipientId: req.user._id })
      .populate('itemId', 'title type category status imageUrl location')
      .populate('senderId', 'name email phone')
      .sort({ createdAt: -1 });

    const sent = await ContactRequest.find({ senderId: req.user._id })
      .populate('itemId', 'title type category status imageUrl location')
      .populate('recipientId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      incoming,
      sent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status (ACCEPT or REJECT)
// @route   PATCH /api/requests/:id
// @access  Private (Recipient only)
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be ACCEPTED or REJECTED.',
      });
    }

    const contactRequest = await ContactRequest.findById(req.params.id)
      .populate('itemId', 'title type')
      .populate('senderId', 'name email');

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found.',
      });
    }

    // Only recipient can accept/reject
    if (contactRequest.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Only the report owner can respond to this request.',
      });
    }

    contactRequest.status = status;
    await contactRequest.save();

    res.status(200).json({
      success: true,
      message: `Contact request ${status.toLowerCase()} successfully.`,
      contactRequest,
    });
  } catch (error) {
    next(error);
  }
};
