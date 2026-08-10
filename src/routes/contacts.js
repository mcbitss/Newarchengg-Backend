import express from 'express';
import { Contact } from '../models/contact.js';
import { requireAdminToken } from './admin.js';

const router = express.Router();

// Get all contacts (admin only)
router.get('/', requireAdminToken, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, projectType } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      message: message || '',
      projectType: projectType || '',
      status: 'new',
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update contact status (admin only)
router.patch('/:id', requireAdminToken, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete contact (admin only)
router.delete('/:id', requireAdminToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
