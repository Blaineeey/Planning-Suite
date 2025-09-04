'use client';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Projects', value: '12', change: '+2 this week', color: 'blue' },
            { label: 'Total Clients', value: '48', change: '+5 this month', color: 'green' },
            { label: 'Pending Invoices', value: '7', change: '$24,500', color: 'yellow' },
            { label: 'Upcoming Events', value: '3', change: 'Next: Dec 15', color: 'purple' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New proposal sent to Sarah & Mike</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Contract signed by Emily & David</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Payment received from Lisa & Tom</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Venue visit - Johnson Wedding</p>
                  <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">High</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Send final invoice - Smith Event</p>
                  <p className="text-xs text-gray-500">Dec 10, 2024</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Medium</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Update wedding website - Brown</p>
                  <p className="text-xs text-gray-500">Dec 12, 2024</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
