import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import { 
  Users, 
  Bed, 
  CreditCard, 
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const stats = [
    {
      name: 'Total Students',
      value: '156',
      icon: Users,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Occupied Rooms',
      value: '48/60',
      icon: Bed,
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Pending Payments',
      value: '$12,450',
      icon: CreditCard,
      change: '-8%',
      changeType: 'negative',
    },
    {
      name: 'Monthly Reports',
      value: '24',
      icon: FileText,
      change: '+100%',
      changeType: 'positive',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      message: 'Payment received from John Doe',
      time: '2 hours ago',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    {
      id: 2,
      type: 'complaint',
      message: 'New complaint submitted',
      time: '4 hours ago',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
    {
      id: 3,
      type: 'registration',
      message: 'New student registered',
      time: '6 hours ago',
      icon: Users,
      iconColor: 'text-blue-600',
    },
    {
      id: 4,
      type: 'room',
      message: 'Room allocation updated',
      time: '1 day ago',
      icon: Bed,
      iconColor: 'text-purple-600',
    },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <Header>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-secondary-600">
            Here's what's happening in your hostel today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-secondary-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-secondary-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-medium text-secondary-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivities.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-secondary-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconColor}`}>
                              <activity.icon className="h-4 w-4" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-secondary-500">
                                {activity.message}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-secondary-500">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions / Admin Panel */}
          <div className="card">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-medium text-secondary-900">
                {isAdmin ? 'Admin Panel' : 'Quick Actions'}
              </h3>
            </div>
            <div className="p-6">
              {isAdmin ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="btn btn-primary">
                      Add Student
                    </button>
                    <button className="btn btn-secondary">
                      Manage Rooms
                    </button>
                    <button className="btn btn-secondary">
                      View Reports
                    </button>
                    <button className="btn btn-secondary">
                      Payment Status
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <button className="btn btn-primary">
                      Make Payment
                    </button>
                    <button className="btn btn-secondary">
                      Submit Complaint
                    </button>
                    <button className="btn btn-secondary">
                      Download Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Dashboard;