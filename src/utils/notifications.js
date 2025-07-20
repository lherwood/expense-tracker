// Notification Service for Expense Tracker

class NotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
  }

  async initialize() {
    if (!this.isSupported) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);

      // Check permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      // Get push subscription
      this.subscription = await this.getSubscription();
      return true;
    } catch (error) {
      console.error('Notification initialization failed:', error);
      return false;
    }
  }

  async requestPermission() {
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async getSubscription() {
    try {
      const existingSubscription = await this.registration.pushManager.getSubscription();
      if (existingSubscription) {
        return existingSubscription;
      }

      // Create new subscription
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
      });

      // Save subscription to server
      await this.saveSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  async saveSubscription(subscription) {
    try {
      const response = await fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          user: localStorage.getItem('expenseUser') || 'Unknown'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      console.log('Subscription saved successfully');
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async sendNotification(title, body, data = {}) {
    if (!this.subscription) {
      console.log('No push subscription available');
      return false;
    }

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription.toJSON(),
          notification: {
            title,
            body,
            data
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      console.log('Notification sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Helper methods for different notification types
  async notifyExpenseAdded(user, amount, category) {
    return this.sendNotification(
      '💰 New Expense Added',
      `${user} added R${amount} for ${category}`,
      { type: 'expense', user, amount, category }
    );
  }

  async notifySavingsUpdated(user, newAmount) {
    return this.sendNotification(
      '💳 Savings Updated',
      `${user} updated shared savings to R${newAmount}`,
      { type: 'savings', user, amount: newAmount }
    );
  }

  async notifyShoppingItemAdded(user, item) {
    return this.sendNotification(
      '🛒 Shopping List Updated',
      `${user} added "${item}" to shopping list`,
      { type: 'shopping', user, item }
    );
  }

  async notifyShoppingItemDeleted(user, item) {
    return this.sendNotification(
      '✅ Shopping Item Removed',
      `${user} removed "${item}" from shopping list`,
      { type: 'shopping', user, item }
    );
  }
}

export default new NotificationService(); 