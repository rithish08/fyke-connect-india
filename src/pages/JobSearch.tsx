import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ShimmerLoader from '@/components/ui/ShimmerLoader';

const workersDb = [
  { id: 1, name: "Raj", category: "Construction", skills: ["Manual Labor"], rating: 4.8 },
  { id: 2, name: "Amit", category: "Gardening", skills: ["Gardening"], rating: 4.4 },
  { id: 3, name: "Devika", category: "Driver", skills: ["Driving", "Tempo"], rating: 4.5 },
];

const jobsDb = [
  { id: 1, title: "Construction Worker Needed", category: "Construction", salary: "400/day" },
  { id: 2, title: "Driver for Tempo", category: "Driver", salary: "500/day" },
  { id: 3, title: "Gardener Wanted", category: "Gardening", salary: "300/day" },
];

const JobSearch = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<null | any[]>(null);

  useEffect(() => {
    setTimeout(() => {
      if (user?.role === 'employer') {
        setResults(workersDb.filter(w => user.categories?.length ? user.categories.includes(w.category) : true));
      } else {
        setResults(jobsDb.filter(j => user.categories?.length ? user.categories.includes(j.category) : true));
      }
    }, 1000);
  }, [user]);

  if (!results) return <ShimmerLoader height={50} className="my-5" />;

  return (
    <div className="max-w-2xl mx-auto px-2 pt-3">
      {results.length === 0 && <div className="text-gray-500 text-center">No results found in your categories.</div>}
      {results.map(res =>
        user?.role === 'employer' ? (
          <div key={res.id} className="mb-4 bg-white border border-gray-100 rounded-xl shadow p-4 flex items-center">
            <div className="font-bold text-gray-900 text-base">{res.name}</div>
            <div className="text-xs ml-2 text-gray-500">{res.category}</div>
            <div className="ml-auto text-yellow-600 font-bold text-xs">{res.rating}★</div>
          </div>
        ) : (
          <div key={res.id} className="mb-4 bg-white border border-gray-100 rounded-xl shadow p-4">
            <div className="font-bold">{res.title}</div>
            <div className="text-xs text-gray-500">{res.category} • {res.salary}</div>
          </div>
        )
      )}
    </div>
  );
};
export default JobSearch;
