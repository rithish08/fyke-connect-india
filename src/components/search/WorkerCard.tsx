import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const WorkerCard = ({ worker, onClick }: any) => {
  const user = worker; // keep consistent variable names
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden shadow border border-gray-100 transition-transform hover:scale-[1.01] group cursor-pointer"
      onClick={() => navigate(`/worker-profile/${user.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-500">{user.name?.[0] || user.phone?.[0] || '?'}</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.name || 'Worker'}</h3>
            <p className="text-sm text-gray-500">{user.primaryCategory || 'General Worker'}</p>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{user.location || 'Location not specified'}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="text-xs font-medium text-yellow-700">
                {user.rating || '4.5'} ({user.reviewCount || '0'})
              </span>
            </div>
          </div>
        </div>
        
        {user.subcategories && user.subcategories.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {user.subcategories.slice(0, 3).map((sub: string) => (
                <span key={sub} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {sub}
                </span>
              ))}
              {user.subcategories.length > 3 && (
                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                  +{user.subcategories.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {user.salaryBySubcategory && Object.keys(user.salaryBySubcategory).length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium text-gray-700">Rate: </span>
            {Object.entries(user.salaryBySubcategory).slice(0, 1).map(([key, value]: [string, any]) => (
              <span key={key} className="text-green-700">
                ₹{value.amount}/{value.period}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>Last active {formatDistanceToNow(new Date(user.lastActive || Date.now()), { addSuffix: true })}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 px-4 pb-2">
        <div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            user.availability === 'available' ? 'bg-green-100 text-green-800' :
            user.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {user.availability === 'available' ? 'Available' :
             user.availability === 'busy' ? 'Busy' : 'Unavailable'}
          </span>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium px-4 ml-2"
          onClick={e => {
            e.stopPropagation();
            navigate(`/worker-profile/${user.id}`);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
export default WorkerCard;
