
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ShimmerLoader from '@/components/ui/ShimmerLoader';
import JobCard from '@/components/search/JobCard';
import WorkerCard from '@/components/search/WorkerCard';

const workersDb = [
  { id: 1, name: "Raj", category: "Construction", skills: ["Manual Labor"], rating: 4.8 },
  { id: 2, name: "Amit", category: "Gardening", skills: ["Gardening"], rating: 4.4 },
  { id: 3, name: "Devika", category: "Driver", skills: ["Driving", "Tempo"], rating: 4.5 },
];

const jobsDb = [
  { id: 1, title: "Construction Worker Needed", category: "Construction", skills: ["Manual Labor"], salary: "400" },
  { id: 2, title: "Driver for Tempo", category: "Driver", skills: ["Driving", "Tempo"], salary: "500" },
  { id: 3, title: "Gardener Wanted", category: "Gardening", skills: ["Gardening"], salary: "300" },
];

const JobSearch = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<null | any[]>(null);

  useEffect(() => {
    setTimeout(() => {
      // Category filtering
      const filterFn = (item: any) =>
        user?.categories?.length
          ? user.categories.includes(item.category)
          : true;

      if (user?.role === 'employer') {
        setResults(workersDb.filter(filterFn));
      } else {
        setResults(jobsDb.filter(filterFn));
      }
    }, 1000);
  }, [user]);

  if (!results)
    return (
      <div className="max-w-2xl mx-auto px-2 pt-4">
        <ShimmerLoader height={50} className="my-5" />
        <ShimmerLoader height={50} className="my-3" />
        <ShimmerLoader height={50} className="my-3" />
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto px-2 pt-5" aria-live="polite">
      {results.length === 0 && (
        <div className="text-gray-400 text-center my-8 text-base animate-fade-in">
          No results found in your selected categories.<br />
          <span className="text-xs text-gray-300">(Try choosing more categories in your profile.)</span>
        </div>
      )}
      <div role="list">
        {results.map(res =>
          user?.role === 'employer' ? (
            <WorkerCard
              key={res.id}
              name={res.name}
              category={res.category}
              skills={res.skills || []}
              rating={res.rating}
            />
          ) : (
            <JobCard
              key={res.id}
              title={res.title}
              category={res.category}
              skills={res.skills || []}
              salary={res.salary}
            />
          )
        )}
      </div>
    </main>
  );
};

export default JobSearch;
