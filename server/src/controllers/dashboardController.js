import Item from '../models/Item.js';
import ContactRequest from '../models/ContactRequest.js';

// @desc    Get portal overall stats and optional user-specific stats
// @route   GET /api/dashboard/stats
// @access  Public (Enhanced if authenticated)
export const getStats = async (req, res, next) => {
  try {
    const [totalReports, activeLost, activeFound, resolvedReports] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ type: 'LOST', status: 'ACTIVE' }),
      Item.countDocuments({ type: 'FOUND', status: 'ACTIVE' }),
      Item.countDocuments({ status: 'RESOLVED' }),
    ]);

    let userStats = null;
    if (req.user) {
      const [userTotal, userActiveLost, userActiveFound, userResolved, pendingRequests] =
        await Promise.all([
          Item.countDocuments({ userId: req.user._id }),
          Item.countDocuments({ userId: req.user._id, type: 'LOST', status: 'ACTIVE' }),
          Item.countDocuments({ userId: req.user._id, type: 'FOUND', status: 'ACTIVE' }),
          Item.countDocuments({ userId: req.user._id, status: 'RESOLVED' }),
          ContactRequest.countDocuments({ recipientId: req.user._id, status: 'PENDING' }),
        ]);

      userStats = {
        userTotal,
        userActiveLost,
        userActiveFound,
        userResolved,
        pendingRequests,
      };
    }

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        activeLost,
        activeFound,
        resolvedReports,
        user: userStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's submitted items
// @route   GET /api/dashboard/items
// @access  Private
export const getUserItems = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }
    if (type && type !== 'ALL') {
      query.type = type.toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      items,
    });
  } catch (error) {
    next(error);
  }
};
