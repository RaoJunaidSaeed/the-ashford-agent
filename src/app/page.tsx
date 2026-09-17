import DashboardPage from './dashboard/page';

export default function Home() {
  return (
    <main className="h-screen w-full bg-[#F7F8FA] overflow-hidden font-sans relative">
      {/* Full Screen Staff Dashboard */}
      <DashboardPage />

      {/* The floating n8n chat bubble injection with deep Shadow DOM styling */}
      <script type="module" dangerouslySetInnerHTML={{
        __html: `
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/chat.bundle.es.js';
          createChat({
            webhookUrl: '${process.env.NEXT_PUBLIC_N8N_CHAT_URL}',
            initialMessages: ['Hello! Welcome to The Ashford. How can I help you today?']
          });

          // Watcher to inject CSS deeply into n8n's Shadow DOM to fix bubble styling
          setInterval(() => {
            const injectStyles = (root) => {
              const win = root.querySelector('.chat-window');
              if (win && !root.querySelector('#ashford-chat-fix')) {
                const style = document.createElement('style');
                style.id = 'ashford-chat-fix';
                style.textContent = \`
                  /* Fix bullet lists and padding */
                  ol, ul { padding-left: 25px !important; margin-left: 5px !important; }
                  .chat-message-text ol, .chat-message-text ul { padding-left: 25px !important; }

                  /* Bubble Sizing */
                  .chat-message {
                      max-width: 85% !important;
                      width: auto !important;
                      min-width: 0 !important;
                      flex-shrink: 0 !important;
                      box-sizing: border-box !important;
                  }

                  /* Text formatting */
                  .chat-message-text, .chat-message-text * {
                      font-size: 0.95rem !important;
                      line-height: 1.55 !important;
                      white-space: normal !important;
                      word-break: normal !important;
                      overflow-wrap: anywhere !important;
                      font-family: 'Inter', sans-serif !important;
                  }

                  /* Bot Messages (Light Gray) */
                  .chat-message-from-bot, .chat-message-from-bot .chat-message-text {
                      color: #0f172a !important;
                      background-color: #f1f5f9 !important;
                  }
                  
                  /* User Messages (Ashford Navy) */
                  .chat-message-from-user, .chat-message-from-user .chat-message-text,
                  [class*="chat-message"][class*="user"], [class*="chat-message"][class*="user"] * {
                      color: #ffffff !important;
                      background-color: #1a2942 !important;
                      -webkit-text-fill-color: #ffffff !important;
                      opacity: 1 !important;
                  }
                \`;
                const target = root.head || root;
                if (target) target.appendChild(style);
              }
            };

            // Check Light DOM and all Shadow DOMs
            injectStyles(document);
            document.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) injectStyles(el.shadowRoot);
            });
          }, 200);
        `
      }} />
      <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
      
      {/* Global CSS variables to override n8n chat widget root styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --chat--color-primary: #1a2942;
            --chat--color-secondary: #2c3e50;
            --chat--color-background: #ffffff;
            --chat--color-font: #1a2942;
            --chat--window--border-radius: 16px !important;
            --chat--message--padding: 12px 16px !important;
            --chat--message--border-radius: 12px !important;
          }
        `
      }} />
    </main>
  );
}
