import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
    projectType: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'archived'], default: 'new' },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
