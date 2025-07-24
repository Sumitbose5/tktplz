// AdminDashboard.jsx
import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Eye, Ban, CheckCircle, Trash2, Reply } from 'lucide-react';

// Dummy data
const platformSummary = {
  totalEvents: 150,
  organizers: 50,
  users: 5000,
  ticketsSold: 10000,
  grossRevenue: 250000,
  pendingPayments: 15000,
  ongoingEvents: 25,
  cancellations: 5,
};

const organizers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', events: 10 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', events: 5 },
  { id: 3, name: 'Alex Brown', email: 'alex@example.com', events: 3 },
];

const events = [
  { id: 1, title: 'Summer Music Fest', date: '2025-07-10', ticketsSold: 120, payments: 2400, status: 'Ongoing' },
  { id: 2, title: 'Tech Conference', date: '2025-08-15', ticketsSold: 80, payments: 4000, status: 'Upcoming' },
  { id: 3, title: 'Art Exhibition', date: '2025-06-20', ticketsSold: 50, payments: 1500, status: 'Completed' },
];

const attendees = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', ticketNumber: 'TK12345', event: 'Summer Music Fest' },
  { id: 2, name: 'Bob Wilson', email: 'bob@example.com', ticketNumber: 'TK12346', event: 'Tech Conference' },
];

const messages = [
  { id: 1, sender: 'User', message: 'Issue with ticket purchase', time: '2025-06-14', status: 'Open' },
  { id: 2, sender: 'Organizer', message: 'Event cancellation request', time: '2025-06-13', status: 'Resolved' },
];

const financialData = {
  paymentsProcessed: 200000,
  invoicesDue: 5000,
  refundsProcessed: 2000,
  transactionsByEvent: [
    { name: 'Summer Music Fest', value: 2400 },
    { name: 'Tech Conference', value: 4000 },
    { name: 'Art Exhibition', value: 1500 },
  ],
};

const analyticsData = {
  eventsOverTime: [
    { month: 'Jan', events: 10 },
    { month: 'Feb', events: 15 },
    { month: 'Mar', events: 20 },
  ],
  ticketSales: [
    { event: 'Summer Music Fest', tickets: 120 },
    { event: 'Tech Conference', tickets: 80 },
    { event: 'Art Exhibition', tickets: 50 },
  ],
  userGrowth: [
    { month: 'Jan', users: 1000 },
    { month: 'Feb', users: 1500 },
    { month: 'Mar', users: 2000 },
  ],
  revenueTrends: [
    { month: 'Jan', revenue: 50000 },
    { month: 'Feb', revenue: 75000 },
    { month: 'Mar', revenue: 100000 },
  ],
};

const COLORS = ['#1A73E8', '#34D399', '#FBBF24'];

export const AdminDashboard = () => {
  const [eventFilter, setEventFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const handleViewOrganizer = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Platform Summary */}
      <section id="platform-summary">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: platformSummary.totalEvents, color: 'text-blue-600' },
            { label: 'Organizers', value: platformSummary.organizers, color: 'text-purple-600' },
            { label: 'Users', value: platformSummary.users, color: 'text-teal-600' },
            { label: 'Tickets Sold', value: platformSummary.ticketsSold, color: 'text-green-600' },
            { label: 'Gross Revenue', value: `$${platformSummary.grossRevenue.toLocaleString()}`, color: 'text-yellow-600' },
            { label: 'Pending Payments', value: `$${platformSummary.pendingPayments.toLocaleString()}`, color: 'text-red-600' },
            { label: 'Ongoing Events', value: platformSummary.ongoingEvents, color: 'text-blue-600' },
            { label: 'Cancellations/Complaints', value: platformSummary.cancellations, color: 'text-red-600' },
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Organizer Management */}
      <section id="organizer-management">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Organizer Management</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Events</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((organizer) => (
                  <tr key={organizer.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{organizer.name}</td>
                    <td className="p-3">{organizer.email}</td>
                    <td className="p-3">{organizer.events}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleViewOrganizer(organizer)} className="text-blue-600 hover:text-blue-800">
                        <Eye size={20} />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-800">
                        <Ban size={20} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Event Management */}
      <section id="event-management">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Management</h2>
        <div className="flex justify-between mb-4">
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Canceled">Canceled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Tickets Sold</th>
                  <th className="p-3">Payments</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter((event) => eventFilter === 'All' || event.status === eventFilter)
                  .map((event) => (
                    <tr key={event.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{event.title}</td>
                      <td className="p-3">{event.date}</td>
                      <td className="p-3">{event.ticketsSold}</td>
                      <td className="p-3">${event.payments}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            event.status === 'Ongoing'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'Upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye size={20} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <CheckCircle size={20} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Financial Summary */}
      <section id="financial-summary">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Revenue by Event</h3>
            <PieChart width={400} height={200}>
              <Pie
                data={financialData.transactionsByEvent}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {financialData.transactionsByEvent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Financial Metrics</h3>
            <p>Payments Processed: ${financialData.paymentsProcessed.toLocaleString()}</p>
            <p>Invoices Due: ${financialData.invoicesDue.toLocaleString()}</p>
            <p>Refunds Processed: ${financialData.refundsProcessed.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Attendees */}
      <section id="attendees">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendees</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Ticket Number</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr key={attendee.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{attendee.name}</td>
                    <td className="p-3">{attendee.email}</td>
                    <td className="p-3">{attendee.ticketNumber}</td>
                    <td className="p-3">{attendee.event}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Messages/Support */}
      <section id="messages">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages/Support</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Sender</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{message.sender}</td>
                    <td className="p-3">{message.message}</td>
                    <td className="p-3">{message.time}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          message.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {message.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Reply size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Events Over Time</h3>
            <BarChart width={500} height={300} data={analyticsData.eventsOverTime}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="events" fill="#1A73E8" />
            </BarChart>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Revenue Trends</h3>
            <BarChart width={500} height={300} data={analyticsData.revenueTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#34D399" />
            </BarChart>
          </div>
        </div>
      </section>

      {/* Other Tools */}
      <section id="other-tools">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Other Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">User Role Management</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Manage Roles
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Blog/Announcements</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Post
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Logs
            </button>
          </div>
        </div>
      </section>

      {/* Organizer Details Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Organizer Details</h2>
            {selectedOrganizer && (
              <div>
                <p>Name: {selectedOrganizer.name}</p>
                <p>Email: {selectedOrganizer.email}</p>
                <p>Events: {selectedOrganizer.events}</p>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
