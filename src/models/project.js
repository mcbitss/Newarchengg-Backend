import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    location: { type: String, default: '' },
    year: { type: Number, default: null },
    client: { type: String, default: '' },
    image: { type: String, required: true },
    highlight: { type: Boolean, default: false },
    category: { type: String, enum: ['villa', 'residential', 'commercial', 'mixed'], default: 'residential' },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
