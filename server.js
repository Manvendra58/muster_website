require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./company-50a9e-firebase-adminsdk-fbsvc-a4ca3c3c72.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('Musterd'));

// Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }
  const contactData = {
    name,
    email,
    subject,
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  try {
    await db.collection('contacts').add(contactData);
    res.status(201).json({ success: true, message: 'Contact form submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }
  const subscribeData = {
    email,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  try {
    await db.collection('subscribers').add(subscribeData);
    res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/job-application', async (req, res) => {
  // Just return success without DB
  res.status(201).json({ success: true, message: 'Job application submitted.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 