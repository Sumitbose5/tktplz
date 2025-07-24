import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Dummy data
const events = [
  { id: 1, name: "Summer Music Fest", date: "2025-07-10", ticketsSold: 120, revenue: 2400, status: "Ongoing" },
  { id: 2, name: "Tech Conference", date: "2025-08-15", ticketsSold: 80, revenue: 4000, status: "Upcoming" },
  { id: 3, name: "Art Exhibition", date: "2025-06-20", ticketsSold: 50, revenue: 1500, status: "Completed" },
];

const attendees = [
  { id: 1, name: "John Doe", email: "john@example.com", ticketNumber: "TK12345" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", ticketNumber: "TK12346" },
  { id: 3, name: "Alex Brown", email: "alex@example.com", ticketNumber: "TK12347" },
];

const invoices = [
  { id: 1, event: "Summer Music Fest", amount: 2400, status: "Paid" },
  { id: 2, event: "Tech Conference", amount: 4000, status: "Pending" },
];

const messages = [
  { id: 1, sender: "Team Member", message: "Need approval for event banners.", time: "2025-06-14" },
  { id: 2, sender: "User", message: "Can I get a refund for my ticket?", time: "2025-06-13" },
];

const pieData = events.map(event => ({ name: event.name, value: event.revenue }));
const COLORS = ['#1A73E8', '#34D399', '#FBBF24'];

export const OrganiserDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Dashboard Summary */}
      <section id="dashboard">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Active Events</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">2</p>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-3">1 Ongoing</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Tickets Sold</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">250</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Attendees</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">200</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Gross Revenue</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">$7,900</p>
          </div>
        </div>
      </section>

      {/* My Events */}
      <section id="events">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">My Events</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Event Name</th>
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Date</th>
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Tickets Sold</th>
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Revenue</th>
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{event.name}</td>
                  <td className="p-4 text-gray-600">{event.date}</td>
                  <td className="p-4 text-gray-600">{event.ticketsSold}</td>
                  <td className="p-4 text-gray-600">${event.revenue}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                      event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{event.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Financial Summary */}
      <section id="financials">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Financial Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-4">Revenue by Event</h4>
            <PieChart width={400} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <h4 className="text-sm font-medium text-gray-500 uppercase p-4">Invoice List</h4>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-sm font-medium text-gray-500 uppercase">Event</th>
                  <th className="p-4 text-sm font-medium text-gray-500 uppercase">Amount</th>
                  <th className="p-4 text-sm font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{invoice.event}</td>
                    <td className="p-4 text-gray-600">${invoice.amount}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{invoice.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Attendees */}
      <section id="attendees">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Attendees</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Name</th>
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Email</th>
                <th className="p-4 text-sm font-medium text-gray-500 uppercase">Ticket Number</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(attendee => (
                <tr key={attendee.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{attendee.name}</td>
                  <td className="p-4 text-gray-600">{attendee.email}</td>
                  <td className="p-4 text-gray-600">{attendee.ticketNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Messages */}
      <section id="messages">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Messages</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {messages.map(message => (
            <div key={message.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{message.sender}</p>
                  <p className="text-sm text-gray-600">{message.message}</p>
                </div>
                <p className="text-sm text-gray-500">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h3>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 uppercase mb-4">Ticket Sales & Revenue</h4>
          <LineChart width={600} height={300} data={events} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ticketsSold" stroke="#1A73E8" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={2} />
          </LineChart>
        </div>
      </section>
    </div>
  );
};
