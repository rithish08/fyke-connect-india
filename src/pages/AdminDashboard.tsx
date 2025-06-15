import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {userProfile && (
        <div>
          <p>Welcome, {userProfile.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;
