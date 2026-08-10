import express from 'express';
import { Project } from '../models/project.js';
import { requireAdminToken } from './admin.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { highlight, category, limit } = req.query;
    let query = {};

    if (highlight === 'true') {
      query.highlight = true;
    }
    if (category) {
      query.category = category;
    }

    let projectsQuery = Project.find(query).sort({ year: -1, createdAt: -1 });
    
    if (limit) {
      projectsQuery = projectsQuery.limit(parseInt(limit));
    }

    const projects = await projectsQuery;
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project (admin only)
router.post('/', requireAdminToken, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description || '',
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      location: req.body.location || '',
      year: req.body.year ? parseInt(req.body.year) : null,
      client: req.body.client || '',
      image: req.body.image,
      highlight: req.body.highlight === true || req.body.highlight === 'true',
      category: req.body.category || 'residential',
    };

    if (!payload.title || !payload.image) {
      return res.status(400).json({ error: 'Title and image are required' });
    }

    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update project (admin only)
router.put('/:id', requireAdminToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', requireAdminToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
