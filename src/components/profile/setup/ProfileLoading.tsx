
import React from 'react';
import ShimmerLoader from '@/components/ui/ShimmerLoader';

const ProfileLoading = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <ShimmerLoader height={60} width="200px" />
                <p className="text-gray-600">Setting up your profile...</p>
            </div>
        </div>
    );
};

export default ProfileLoading;
