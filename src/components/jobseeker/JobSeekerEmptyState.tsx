
const JobSeekerEmptyState = () => {
  return (
    <div className="text-gray-500 text-center py-8">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
      <p className="text-sm">Try updating your categories in profile settings</p>
    </div>
  );
};

export default JobSeekerEmptyState;
