 // pages/api/generate-slides.js
 export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/generate-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'dev'
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate slides');
      }
      
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error generating slides:', error);
      return res.status(500).json({ message: error.message || 'Failed to generate slides' });
    }
  }