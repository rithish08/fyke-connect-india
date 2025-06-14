import { useEffect, useState } from 'react';
import ShimmerLoader from './ui/ShimmerLoader';
import { useAuth } from '@/contexts/AuthContext';

const JobSeekerHome = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      // Example jobs
      const allJobs = [
        { id: 1, title: "Construction Worker Needed", category: "Construction", salary: "400/day" },
        { id: 2, title: "Driver for Tempo", category: "Driver", salary: "500/day" },
        { id: 3, title: "Gardener Wanted", category: "Gardening", salary: "300/day" },
      ];
      if (user?.categories?.length) {
        setJobs(allJobs.filter(j => user.categories.includes(j.category)));
      } else {
        setJobs(allJobs);
      }
    }, 1200); // fake load
  }, [user]);

  if (!jobs) return <ShimmerLoader height={56} className="my-5" />;

  return (
    <div>
      {jobs.length === 0 && <div className="text-gray-500 text-center my-6">No jobs found for your selected categories.</div>}
      {jobs.map(job => (
        <div key={job.id} className="p-3 mb-4 rounded-xl bg-gray-50 border border-gray-100 shadow hover:shadow-md transition">
          <div className="font-bold text-gray-900">{job.title}</div>
          <div className="text-xs text-gray-500 mt-1">{job.category} • {job.salary}</div>
        </div>
      ))}
    </div>
  );
};
export default JobSeekerHome;
