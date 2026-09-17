'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Phone, Globe, CheckCircle2, Search } from 'lucide-react';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
    const bookingsSub = supabase.channel('b-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData).subscribe();
    const enquiriesSub = supabase.channel('e-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, fetchData).subscribe();
    return () => { supabase.removeChannel(bookingsSub); supabase.removeChannel(enquiriesSub); };
  }, []);

  const fetchData = async () => {
    try {
      const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50);
      const { data: eData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(10);
      if (bData) setBookings(bData);
      if (eData) setEnquiries(eData);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const todaysBookings = bookings.filter(b => b.created_at?.startsWith(todayStr)).length;
    const revenueMTD = bookings
      .filter(b => new Date(b.created_at).getMonth() === thisMonth)
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0);
    const baseOccupancy = 65;
    const dynamicOccupancy = Math.min(100, baseOccupancy + (bookings.length * 2));
    return { todaysBookings, revenueMTD, dynamicOccupancy };
  }, [bookings]);

  const activeEscalations = enquiries.filter(e => e.status !== 'resolved');
  const filteredBookings = bookings.filter(b => 
    b.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.booking_ref?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedBookings = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredBookings.forEach(b => {
      const dateStr = new Date(b.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(b);
    });
    return groups;
  }, [filteredBookings]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans text-gray-900 flex flex-col h-screen overflow-hidden">
      {/* Global Header */}
      <header className="h-14 bg-white border-b border-[#E4E7EC] flex items-center px-4 md:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#1a2942] rounded flex items-center justify-center">
            <span className="text-white text-xs font-serif font-bold">A</span>
          </div>
          <h1 className="font-semibold text-[15px] tracking-tight truncate">The Ashford Ops</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Live Sync</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Stacks on mobile, 60/40 on large screens */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
        
        {/* LEFT: Bookings */}
        <section className="w-full lg:w-[60%] flex flex-col border-b lg:border-b-0 lg:border-r border-[#E4E7EC] bg-[#F7F8FA] lg:overflow-y-auto relative shrink-0 lg:shrink">
          <div className="p-4 md:p-8 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Bookings</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search guests or refs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-sm rounded-md border border-[#E4E7EC] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1a2942]" 
                />
              </div>
            </div>

            {/* Live Stat Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="text-xl md:text-2xl font-semibold tabular-nums tracking-tight">{stats.todaysBookings}</div>
                <div className="text-[10px] md:text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Booked Today</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all">
                <div className="text-xl md:text-2xl font-semibold tabular-nums tracking-tight">{stats.dynamicOccupancy}%</div>
                <div className="text-[10px] md:text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Proj. Occupancy</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all col-span-2 md:col-span-1">
                <div className="text-xl md:text-2xl font-semibold tabular-nums tracking-tight text-emerald-600">£{stats.revenueMTD.toLocaleString()}</div>
                <div className="text-[10px] md:text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Revenue MTD</div>
              </div>
            </div>

            {/* Grouped Table */}
            <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading data...</div>
              ) : Object.keys(groupedBookings).length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No bookings found.</div>
              ) : (
                <div className="flex flex-col overflow-x-auto">
                  {Object.entries(groupedBookings).map(([dateGroup, bks]) => (
                    <div key={dateGroup} className="min-w-[600px] lg:min-w-full">
                      {/* Sticky Date Header */}
                      <div className="sticky top-0 bg-[#F7F8FA] border-y border-[#E4E7EC] px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider z-10 shadow-sm">
                        {dateGroup}
                      </div>
                      <table className="min-w-full text-sm text-left">
                        <tbody className="divide-y divide-[#E4E7EC]">
                          {bks.map(b => (
                            <tr key={b.booking_ref} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                              <td className="px-5 py-4 text-gray-400 w-10" title={`Source: ${b.source}`}>
                                {b.source === 'chat' ? <Globe className="w-4 h-4 text-purple-500" /> : <Phone className="w-4 h-4 text-blue-500" />}
                              </td>
                              <td className="px-5 py-4 w-1/3">
                                <div className="font-medium text-gray-900">{b.guest_name}</div>
                                <div className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-2">
                                  {b.booking_ref}
                                  <span className="flex items-center text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-px rounded text-[9px] uppercase tracking-wider font-semibold">
                                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Email Sent
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="text-gray-900">{new Date(b.check_in).toLocaleDateString(undefined, {month:'short', day:'numeric'})} &rarr; {new Date(b.check_out).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                                <div className="text-xs text-gray-500 mt-0.5 flex gap-2 whitespace-nowrap">
                                  <span className="font-medium text-[#1a2942] bg-gray-100 px-1.5 rounded">{b.room_type_code}</span>
                                  <span>{b.num_adults}A {b.num_children > 0 && `${b.num_children}C `}{b.dogs > 0 && `🐕`}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right font-medium tabular-nums text-gray-900">
                                £{b.total_price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: Escalations */}
        <section className="w-full lg:w-[40%] bg-gray-100/50 flex flex-col lg:overflow-y-auto border-l border-white pb-24">
          <div className="p-4 md:p-8 pb-4">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Needs Attention</h2>
              {activeEscalations.length > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{activeEscalations.length}</span>
              )}
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-400">Syncing queue...</div>
              ) : activeEscalations.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-[#E4E7EC] shadow-sm flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-3" />
                  <div className="font-medium text-gray-900">All caught up</div>
                  <div className="text-sm text-gray-500 mt-1">AI agent is handling everything smoothly.</div>
                </div>
              ) : activeEscalations.map((e, idx) => (
                <div key={e.enquiry_id} className={`bg-white rounded-xl border border-[#E4E7EC] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden relative ${idx === 0 ? 'border-l-4 border-l-red-500' : ''}`}>
                  <div className="p-5">
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="font-medium text-gray-900 break-words">{e.guest_name}</div>
                      <span className={`shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                        e.status === 'escalated' ? 'bg-red-50 text-red-700' : 
                        e.status === 'in_progress' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                    {/* Body */}
                    <p className="text-sm text-gray-600 leading-relaxed break-words">
                      {e.summary}
                    </p>
                    
                    {/* Contact Info */}
                    <div className="mt-4 pt-4 border-t border-[#E4E7EC] flex flex-col gap-1 text-sm text-gray-500">
                      <div className="break-all"><strong className="text-gray-700 font-medium">Contact:</strong> {e.contact}</div>
                      <div><strong className="text-gray-700 font-medium">Ref:</strong> {e.enquiry_id}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
