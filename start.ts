import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000; // Ensure you're using the correct port

// Health check endpoint for Replit deployment
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ContentScale AI Consulting Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'ContentScale API is running',
    categories: [
      'seo', 'business_strategy', 'financial', 'marketing',
      'operations', 'hr', 'it', 'legal', 'sales',
      'customer_experience', 'sustainability', 'cybersecurity'
    ]
  });
});

// Serve static files from the client/public directory
// This assumes your main index.html and other static assets are here
app.use(express.static(path.join(__dirname, 'client', 'public')));

// For any other requests (client-side routes), serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});