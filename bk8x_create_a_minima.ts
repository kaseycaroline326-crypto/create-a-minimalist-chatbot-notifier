TypeScript
interface Config {
  // Bot credentials
  botToken: string;
  botUsername: string;

  // Chat details
  chatId: number;
  chatTitle: string;

  // Notification settings
  notificationThreshold: number; // minutes
  notificationMessage: string;

  // API endpoint for message fetching
  apiEndpoint: string;
}

interface Message {
  id: number;
  text: string;
  timestamp: number;
}

class MinimalistChatbotNotifier {
  private config: Config;
  private lastNotification: number;

  constructor(config: Config) {
    this.config = config;
    this.lastNotification = 0;
  }

  async fetchMessages(): Promise<Message[]> {
    const response = await fetch(this.config.apiEndpoint);
    return await response.json();
  }

  async notify(): Promise<void> {
    const messages = await this.fetchMessages();
    const newMessages = messages.filter((message) => message.timestamp > this.lastNotification);

    if (newMessages.length >= this.config.notificationThreshold) {
      // Send notification using bot
      console.log(`Sending notification: ${this.config.notificationMessage}`);
      this.lastNotification = Date.now() / 1000;
    }
  }

  async start(): Promise<void> {
    setInterval(async () => {
      await this.notify();
    }, 60 * 1000); // check every 1 minute
  }
}

const config: Config = {
  botToken: 'YOUR_BOT_TOKEN',
  botUsername: 'YOUR_BOT_USERNAME',
  chatId: 123456789,
  chatTitle: 'My Chat',
  notificationThreshold: 5,
  notificationMessage: 'New messages in My Chat!',
  apiEndpoint: 'https://api.example.com/messages',
};

const notifier = new MinimalistChatbotNotifier(config);
notifier.start();