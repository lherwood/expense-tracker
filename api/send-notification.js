import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:herwood.luke@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscription, notification } = req.body;

  if (!subscription || !notification) {
    return res.status(400).json({ error: 'Missing subscription or notification data' });
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(notification)
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Push notification error:', error);
    return res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
} 