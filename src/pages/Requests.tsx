import React, { useEffect, useState } from 'react';
import UnifiedWorkerCard from '@/components/common/UnifiedWorkerCard';
import { useRequests } from '@/hooks/useRequests';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRatings } from '@/hooks/useRatings';

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <svg width="64" height="64" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#F3F4F6"/><path d="M20 40h24M24 32h16M28 24h8" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/></svg>
    <div className="text-gray-500 text-center mt-4">{message}</div>
  </div>
);

const RequestsPage: React.FC = () => {
  const {
    sentPending,
    receivedPending,
    accepted,
    rejected,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    refresh,
  } = useRequests();
  const [tab, setTab] = useState<'pending' | 'history'>('pending');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchRatingForRequest, submitRating, loading: ratingLoading } = useRatings();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<any>(null);
  const [alreadyRated, setAlreadyRated] = useState<{ [requestId: string]: boolean }>({});

  useEffect(() => {
    // For accepted requests, check if already rated
    if (tab === 'history' && user) {
      accepted.forEach(async (req) => {
        const rating = await fetchRatingForRequest(req.id, user.id);
        setAlreadyRated(prev => ({ ...prev, [req.id]: !!rating }));
      });
    }
  }, [tab, accepted, user, fetchRatingForRequest]);

  const handleAccept = async (id: string) => {
    await acceptRequest(id);
    toast({ title: 'Request Accepted', description: 'You have accepted the request.' });
  };
  const handleReject = async (id: string) => {
    await rejectRequest(id);
    toast({ title: 'Request Rejected', description: 'You have rejected the request.' });
  };

  const handleOpenRating = (req: any) => {
    setRatingTarget(req);
    setShowRatingModal(true);
  };
  const handleSubmitRating = async (rating: number, comment?: string) => {
    if (!user || !ratingTarget) return;
    await submitRating({
      from_user_id: user.id,
      to_user_id: ratingTarget.applicant_id === user.id ? ratingTarget.employer_id : ratingTarget.applicant_id,
      request_id: ratingTarget.id,
      rating,
      comment,
    });
    toast({ title: 'Thank you for your rating!', description: `You rated ${rating} stars.` });
    setShowRatingModal(false);
    setRatingTarget(null);
    setAlreadyRated(prev => ({ ...prev, [ratingTarget.id]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 w-full max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Requests</h1>
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold ${tab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold ${tab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('history')}
          >
            History
          </button>
        </div>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {tab === 'pending' && !loading && (
          <>
            <h2 className="text-lg font-semibold mt-4 mb-2">Sent by Me</h2>
            <div className="space-y-4 mb-6">
              {sentPending.length === 0 ? (
                <EmptyState message="No pending requests sent." />
              ) : (
                sentPending.map((req) => (
                  <div key={req.id} onClick={() => navigate(`/worker/${req.employer_id}`)} className="cursor-pointer">
                    <UnifiedWorkerCard
                      worker={{ ...req.employer, id: req.employer_id }}
                      isRequested={true}
                    />
                  </div>
                ))
              )}
            </div>
            <h2 className="text-lg font-semibold mb-2">Received</h2>
            <div className="space-y-4">
              {receivedPending.length === 0 ? (
                <EmptyState message="No pending requests received." />
              ) : (
                receivedPending.map((req) => (
                  <div key={req.id} className="space-y-2 cursor-pointer" onClick={() => navigate(`/worker/${req.applicant_id}`)}>
                    <UnifiedWorkerCard
                      worker={{ ...req.applicant, id: req.applicant_id }}
                      isRequested={true}
                    />
                    <div className="flex space-x-2 justify-end">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-full font-bold hover:bg-green-600"
                        onClick={e => { e.stopPropagation(); handleAccept(req.id); }}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600"
                        onClick={e => { e.stopPropagation(); handleReject(req.id); }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {tab === 'history' && !loading && (
          <>
            <h2 className="text-lg font-semibold mt-4 mb-2">Accepted</h2>
            <div className="space-y-4 mb-6">
              {accepted.length === 0 ? (
                <EmptyState message="No accepted requests." />
              ) : (
                accepted.map((req) => (
                  <div key={req.id} className="space-y-2 cursor-pointer" onClick={() => navigate(`/worker/${req.applicant_id === req.employer_id ? req.employer_id : (req.applicant_id === req.applicant?.id ? req.employer_id : req.applicant_id)}`)}>
                    <UnifiedWorkerCard
                      worker={{ ...req.applicant_id === req.employer_id ? req.employer : (req.applicant_id === req.applicant?.id ? req.employer : req.applicant), id: req.applicant_id === req.employer_id ? req.employer_id : (req.applicant_id === req.applicant?.id ? req.employer_id : req.applicant_id) }}
                      isRequested={true}
                    />
                    <div className="flex space-x-2 justify-end">
                      <span className="text-green-600 font-semibold">Accepted</span>
                      {/* Show Rate button if not already rated (using alreadyRated state) */}
                      {!alreadyRated[req.id] && (
                        <button className="bg-yellow-500 text-white px-4 py-1 rounded-full font-bold hover:bg-yellow-600" onClick={e => { e.stopPropagation(); handleOpenRating(req); }} disabled={ratingLoading}>Rate</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <h2 className="text-lg font-semibold mb-2">Rejected</h2>
            <div className="space-y-4">
              {rejected.length === 0 ? (
                <EmptyState message="No rejected requests." />
              ) : (
                rejected.map((req) => (
                  <div key={req.id} className="space-y-2 cursor-pointer" onClick={() => navigate(`/worker/${req.applicant_id === req.employer_id ? req.employer_id : (req.applicant_id === req.applicant?.id ? req.employer_id : req.applicant_id)}`)}>
                    <UnifiedWorkerCard
                      worker={{ ...req.applicant_id === req.employer_id ? req.employer : (req.applicant_id === req.applicant?.id ? req.employer : req.applicant), id: req.applicant_id === req.employer_id ? req.employer_id : (req.applicant_id === req.applicant?.id ? req.employer_id : req.applicant_id) }}
                      isRequested={false}
                    />
                    <div className="flex space-x-2 justify-end">
                      <span className="text-red-600 font-semibold">Rejected</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      {/* Rating Modal (simple placeholder) */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[320px] flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">Rate this user</h2>
            <div className="flex space-x-2 mb-4">
              {[1,2,3,4,5].map(star => (
                <button key={star} className="text-yellow-400 text-2xl" onClick={() => handleSubmitRating(star)} disabled={ratingLoading}>★</button>
              ))}
            </div>
            <button className="mt-2 text-gray-500 underline" onClick={() => setShowRatingModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage; 