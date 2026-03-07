import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['issue', 'contact', 'feedback'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  submittedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'feature-request', 'bug', 'general', 'other'],
    default: 'general'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  adminNotes: {
    type: String,
    default: ''
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
issueSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
