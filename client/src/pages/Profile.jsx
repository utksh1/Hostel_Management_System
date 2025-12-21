import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Header>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
          <p className="text-secondary-600">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="px-6 py-4 border-b border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900">Personal Information</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-secondary-400" />
                        <span className="text-secondary-900">{user?.name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-secondary-400" />
                        <span className="text-secondary-900">{user?.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Role
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="text-secondary-900 capitalize">{user?.role}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Member Since
                      </label>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-secondary-400" />
                        <span className="text-secondary-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div>
            <div className="card">
              <div className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-secondary-900">{user?.name}</h3>
                  <p className="text-secondary-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Profile;