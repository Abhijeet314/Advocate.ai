import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  try {
    const response = await fetch(`http://localhost:5000/history?session_id=${session_id}`);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching history from Flask backend:', error);
    return res.status(500).json({ error: 'Failed to connect to AI service' });
  }
}