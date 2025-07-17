import LoadingSkeleton from '@/components/common/LoadingSkeleton';

const ProfileNameStep = ({ onSubmit, initialName }: ProfileNameStepProps) => {
  const [localName, setLocalName] = useState(initialName);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNameSubmit = async () => {
    if (!localName.trim()) return;
    setLoading(true);
    await onSubmit(localName.trim());
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      {loading && <div className="mb-6"><LoadingSkeleton width="100%" height="3rem" /></div>}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Profile Name</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleNameSubmit();
        }}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Name'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileNameStep; 