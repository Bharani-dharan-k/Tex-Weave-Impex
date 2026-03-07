import Issue from '../models/Issue.js';

// Submit a new issue/contact request
export const submitIssue = async (req, res) => {
  try {
    const { type, subject, description, priority, category, name, email } = req.body;
    
    // Get user info from authenticated request or request body
    const submittedBy = {
      name: req.user?.name || name || 'Anonymous',
      email: req.user?.email || email || 'Not provided'
    };

    // Only add userId if user is authenticated
    if (req.user?._id) {
      submittedBy.userId = req.user._id;
    }

    const newIssue = new Issue({
      type: type || 'issue',
      subject,
      description,
      priority: priority || 'medium',
      category: category || 'general',
      submittedBy,
      status: 'open'
    });

    await newIssue.save();

    res.status(201).json({
      success: true,
      message: 'Issue submitted successfully',
      issue: newIssue
    });
  } catch (error) {
    console.error('Error submitting issue:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error submitting issue',
      error: error.message
    });
  }
};

// Get all issues (Admin only)
export const getAllIssues = async (req, res) => {
  try {
    const { status, type, priority, category } = req.query;
    
    let filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .populate('submittedBy.userId', 'name email')
      .populate('resolvedBy', 'name email');

    res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues',
      error: error.message
    });
  }
};

// Get a single issue by ID
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('submittedBy.userId', 'name email')
      .populate('resolvedBy', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      issue
    });
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue',
      error: error.message
    });
  }
};

// Get issues submitted by the logged-in user
export const getUserIssues = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const issues = await Issue.find({ 'submittedBy.userId': userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user issues',
      error: error.message
    });
  }
};

// Update issue status (Admin only)
export const updateIssueStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const issueId = req.params.id;

    const updateData = {
      status,
      updatedAt: Date.now()
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedBy = req.user._id;
      updateData.resolvedAt = Date.now();
    }

    const issue = await Issue.findByIdAndUpdate(
      issueId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      issue
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue',
      error: error.message
    });
  }
};

// Delete an issue (Admin only)
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting issue',
      error: error.message
    });
  }
};

// Get issue statistics (Admin only)
export const getIssueStats = async (req, res) => {
  try {
    const [
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      closedIssues,
      criticalIssues,
      highPriorityIssues,
      byType,
      byCategory
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'open' }),
      Issue.countDocuments({ status: 'in-progress' }),
      Issue.countDocuments({ status: 'resolved' }),
      Issue.countDocuments({ status: 'closed' }),
      Issue.countDocuments({ priority: 'critical' }),
      Issue.countDocuments({ priority: 'high' }),
      Issue.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalIssues,
        byStatus: {
          open: openIssues,
          inProgress: inProgressIssues,
          resolved: resolvedIssues,
          closed: closedIssues
        },
        byPriority: {
          critical: criticalIssues,
          high: highPriorityIssues
        },
        byType,
        byCategory
      }
    });
  } catch (error) {
    console.error('Error fetching issue stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue stats',
      error: error.message
    });
  }
};
