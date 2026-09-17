export default function HotelWebsite() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      {/* Hotel Header */}
      <div className="h-20 bg-[#1a2942] text-white flex items-center px-12 shrink-0">
        <h1 className="text-2xl font-serif tracking-widest uppercase">The Ashford</h1>
        <div className="ml-auto space-x-10 text-sm font-light hidden lg:block tracking-wide">
          <a href="#" className="hover:text-gray-300 transition-colors">Rooms</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Dining</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Spa</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Weddings</a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="h-[60vh] bg-gray-200 relative shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1542314831-c6a4d14d8859?q=80&w=2000&auto=format&fit=crop" 
          alt="The Ashford Countryside"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-5xl md:text-7xl font-serif text-center px-4 tracking-wide shadow-sm">
            A Yorkshire Escape
          </h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-8 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-6 mb-16">
          <h3 className="text-4xl font-serif text-[#1a2942]">Welcome to your sanctuary</h3>
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            Nestled in the heart of Ashford-in-Wharfedale, our boutique hotel offers the perfect blend of countryside tranquility and modern luxury. 
          </p>
        </div>

        {/* Hotel Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-100 rounded-sm overflow-hidden relative shadow-md group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop" alt="Hotel Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a2942]/90 to-transparent p-6">
              <span className="text-white font-serif text-2xl">Luxury Rooms</span>
            </div>
          </div>
          <div className="h-80 bg-gray-100 rounded-sm overflow-hidden relative shadow-md group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop" alt="Spa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a2942]/90 to-transparent p-6">
              <span className="text-white font-serif text-2xl">The Spa</span>
            </div>
          </div>
        </div>

        {/* CSS to override n8n chat widget brand colors (Option A approach) */}
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
      </div>
    </div>
  );
}
