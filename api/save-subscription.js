// /api/save-subscription.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscription, user } = req.body;

  if (!subscription || !user) {
    return res.status(400).json({ error: 'Missing subscription or user data' });
  }

  try {
    // Save subscription to Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbxeSHR21D7pxG7jpZqxERfG80mH1_QugEIKhLwz0br0GTl4OmxbNwUZo-TIVexK4LDJpw/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        method: 'POST',
        action: 'saveSubscription',
        user: user,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription to Apps Script');
    }

    console.log('Subscription saved for user:', user);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return res.status(500).json({ error: 'Failed to save subscription' });
  }
} 