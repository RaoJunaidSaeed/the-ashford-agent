'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, PhoneCall, MessageSquare, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up real-time subscriptions
    const bookingsSub = supabase
      .channel('bookings-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
        console.log('Booking change received!', payload);
        fetchData();
      })
      .subscribe();

    const enquiriesSub = supabase
      .channel('enquiries-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, payload => {
        console.log('Enquiry change received!', payload);
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsSub);
      supabase.removeChannel(enquiriesSub);
    };
  }, []);

  const fetchData = async () => {
    try {
      const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10);
      const { data: eData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5);
      if (bData) setBookings(bData);
      if (eData) setEnquiries(eData);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Staff Dashboard</h2>
        <div className="ml-auto flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live Sync Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Bookings Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-800">Recent Bookings</h3>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stay Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No bookings yet. Talk to the AI!</td></tr>
                ) : bookings.map((b) => (
                  <tr key={b.booking_ref} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {b.guest_name} 
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-mono">{b.booking_ref}</span>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">{b.email}</div>
                      <div className="text-gray-500 text-xs">{b.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="font-medium text-indigo-900">{b.room_type_code}</div>
                      <div className="text-xs">{new Date(b.check_in).toLocaleDateString()} &rarr; {new Date(b.check_out).toLocaleDateString()}</div>
                      <div className="text-xs mt-1 text-gray-500">
                        {b.num_adults} Adults {b.num_children > 0 && `, ${b.num_children} Children`} {b.dogs > 0 && ` 🐕 (${b.dogs})`}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">£{b.total_price}</td>
                    <td className="px-6 py-4">
                      {b.source === 'chat' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                          <MessageSquare className="w-3 h-3 mr-1" /> Web Chat
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          <PhoneCall className="w-3 h-3 mr-1" /> Voice
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Escalations Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-lg font-medium text-gray-800">Human Escalations</h3>
          </div>
          
          <div className="space-y-3">
            {enquiries.length === 0 ? (
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
                No active escalations.
              </div>
            ) : enquiries.map(e => (
              <div key={e.enquiry_id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm flex items-start justify-between">
                <div>
                  <div className="font-medium text-amber-900">{e.guest_name}</div>
                  <div className="text-amber-700 text-sm mt-1">{e.summary}</div>
                  <div className="text-amber-600 text-xs mt-2 font-mono">{e.contact}</div>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-amber-200 text-amber-800 uppercase tracking-wide">
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
