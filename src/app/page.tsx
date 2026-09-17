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
                  /* Chat Window Container Styling */
                  .chat-window {
                      border: 1px solid #000000 !important;
                  }

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

                  /* --- Input Field Enhancements --- */
                  /* Find the wrapper that contains the textarea and make it relative */
                  div:has(> textarea) {
                      padding: 16px !important;
                      border-top: 1px solid #E4E7EC !important;
                      position: relative !important;
                      background: white !important;
                  }

                  /* The Text Input */
                  textarea {
                      background-color: #f8fafc !important;
                      border: 1px solid #e2e8f0 !important;
                      border-radius: 24px !important;
                      padding: 12px 50px 12px 20px !important;
                      font-size: 0.95rem !important;
                      font-family: 'Inter', sans-serif !important;
                      outline: none !important;
                      box-shadow: none !important;
                      width: 100% !important;
                      min-height: 48px !important;
                      transition: all 0.2s ease !important;
                      margin: 0 !important;
                  }
                  textarea:focus {
                      border-color: #1a2942 !important;
                      background-color: #ffffff !important;
                  }

                  /* The Send Button (Selects the button next to the textarea) */
                  textarea + button, button:has(> svg path[d*="M2"]) {
                      background-color: #1a2942 !important;
                      border-radius: 50% !important;
                      width: 36px !important;
                      height: 36px !important;
                      display: flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                      position: absolute !important;
                      right: 24px !important;
                      bottom: 22px !important;
                      padding: 0 !important;
                      border: none !important;
                      transition: transform 0.1s ease !important;
                      cursor: pointer !important;
                      z-index: 10 !important;
                  }
                  textarea + button:hover {
                      transform: scale(1.05) !important;
                      background-color: #2c3e50 !important;
                  }

                  /* The Send Arrow SVG */
                  textarea + button svg {
                      fill: white !important;
                      color: white !important;
                      width: 16px !important;
                      height: 16px !important;
                      margin: 0 !important;
                      transform: translate(1px, 0px) !important;
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
            /* Main Brand Colors */
            --chat--color-primary: #1a2942 !important;
            --chat--color-secondary: #2c3e50 !important;
            --chat--color-background: #ffffff !important;
            --chat--color-font: #1a2942 !important;
            
            /* Window Styling & Sizing */
            --chat--window--border-radius: 16px !important;
            --chat--window--width: 45vw !important;
            --chat--window--height: 82vh !important;
            --chat--window--max-height: 82vh !important;
            --chat--window--bottom: 9vh !important;
            --chat--window--right: 2.5vw !important;
            
            /* Drop Shadow to make it pop off the background */
            --chat--window--box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0,0,0,0.05) !important;
            
            /* Message Bubbles - THIS FIXES THE INVISIBLE BUBBLES */
            --chat--message--bot--background: #f1f5f9 !important;
            --chat--message--bot--color: #0f172a !important;
            --chat--message--user--background: #1a2942 !important;
            --chat--message--user--color: #ffffff !important;
            
            /* Message Formatting */
            --chat--message--padding: 12px 16px !important;
            --chat--message--border-radius: 12px !important;
          }

          /* Mobile Responsiveness for Chat Widget */
          @media (max-width: 768px) {
            :root {
              --chat--window--width: 90vw !important;
              --chat--window--height: 75vh !important;
              --chat--window--max-height: 75vh !important;
              --chat--window--right: 5vw !important;
              --chat--window--bottom: 80px !important; /* Leave room for floating icon */
            }
          }
        `
      }} />
    </main>
  );
}
