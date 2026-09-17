import DashboardPage from './dashboard/page';

export default function Home() {
  return (
    <main className="h-screen w-full bg-[#F7F8FA] overflow-hidden font-sans relative">
      {/* Full Screen Staff Dashboard */}
      <DashboardPage />

      {/* The floating n8n chat bubble injection */}
      <script type="module" dangerouslySetInnerHTML={{
        __html: `
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/chat.bundle.es.js';
          createChat({
            webhookUrl: '${process.env.NEXT_PUBLIC_N8N_CHAT_URL}',
            initialMessages: ['Hello! Welcome to The Ashford. How can I help you today?']
          });
        `
      }} />
      <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
      
      {/* CSS to override n8n chat widget brand colors */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --chat--color-primary: #1a2942;
            --chat--color-secondary: #2c3e50;
            --chat--color-background: #ffffff;
            --chat--color-font: #1a2942;
          }
        `
      }} />
    </main>
  );
}
