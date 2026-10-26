import Item, { CATEGORIES } from '../models/Item.js';
import ContactRequest from '../models/ContactRequest.js';

// @desc    Get all items with search, filters, pagination
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res, next) => {
  try {
    const {
      type,
      category,
      location,
      status,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by type (LOST or FOUND)
    if (type && ['LOST', 'FOUND'].includes(type.toUpperCase())) {
      query.type = type.toUpperCase();
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status (ACTIVE or RESOLVED)
    if (status && ['ACTIVE', 'RESOLVED'].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    // Filter by location
    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Search query across title, description, location
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('userId', 'name createdAt')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      hasMore: pageNum * limitNum < total,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email createdAt');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Hide user's full email address unless logged in as that user or showing privacy mask
    const isOwner = req.user && req.user._id.toString() === item.userId._id.toString();
    const itemData = item.toObject();
    if (!isOwner && itemData.userId && itemData.userId.email) {
      // Mask email for privacy (e.g. s***u@college.edu)
      const [localPart, domain] = itemData.userId.email.split('@');
      const maskedLocal =
        localPart.length > 2
          ? `${localPart[0]}***${localPart[localPart.length - 1]}`
          : `${localPart[0]}***`;
      itemData.userId.email = `${maskedLocal}@${domain}`;
    }

    res.status(200).json({
      success: true,
      item: itemData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lost or found item report
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res, next) => {
  try {
    const {
      title,
      type,
      category,
      description,
      location,
      incidentDate,
      imageUrl,
    } = req.body;

    if (!title || !type || !category || !description || !location || !incidentDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, type, category, description, location, incident date.',
      });
    }

    if (!['LOST', 'FOUND'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Item type must be LOST or FOUND.',
      });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      });
    }

    const item = await Item.create({
      title: title.trim(),
      type: type.toUpperCase(),
      category,
      description: description.trim(),
      location: location.trim(),
      incidentDate: new Date(incidentDate),
      imageUrl: imageUrl ? imageUrl.trim() : '',
      userId: req.user._id,
      status: 'ACTIVE',
    });

    await item.populate('userId', 'name createdAt');

    res.status(201).json({
      success: true,
      message: `${type.toUpperCase() === 'LOST' ? 'Lost item report' : 'Found item report'} submitted successfully.`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item report
// @route   PATCH /api/items/:id
// @access  Private (Owner only)
export const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Ownership check
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only edit your own reports.',
      });
    }

    const allowedUpdates = [
      'title',
      'category',
      'description',
      'location',
      'incidentDate',
      'imageUrl',
      'status',
      'type',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'type') {
          item[field] = req.body[field].toUpperCase();
        } else if (field === 'incidentDate') {
          item[field] = new Date(req.body[field]);
        } else if (typeof req.body[field] === 'string') {
          item[field] = req.body[field].trim();
        } else {
          item[field] = req.body[field];
        }
      }
    });

    await item.save();
    await item.populate('userId', 'name createdAt');

    res.status(200).json({
      success: true,
      message: 'Report updated successfully.',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item report
// @route   DELETE /api/items/:id
// @access  Private (Owner only)
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Ownership check
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own reports.',
      });
    }

    // Delete item and cascade delete its contact requests
    await Item.findByIdAndDelete(req.params.id);
    await ContactRequest.deleteMany({ itemId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Item report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark item as RESOLVED or ACTIVE
// @route   PATCH /api/items/:id/resolve
// @access  Private (Owner only)
export const resolveItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update the status of your own reports.',
      });
    }

    // Toggle status or set to specified status
    const targetStatus = req.body.status || (item.status === 'RESOLVED' ? 'ACTIVE' : 'RESOLVED');
    item.status = targetStatus;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Report marked as ${item.status.toLowerCase()}.`,
      item,
    });
  } catch (error) {
    next(error);
  }
};
