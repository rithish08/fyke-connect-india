// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center p-8 rounded-xl shadow-lg bg-white max-w-lg w-full">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-700">Fyke Connect India</h1>
        <p className="text-xl text-gray-700 mb-6">Find jobs, hire workers, and connect with opportunities across India.</p>
        <div className="flex flex-col gap-4">
          <a href="/login" className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">Login</a>
          <a href="/role-selection" className="bg-white border border-blue-600 text-blue-700 py-2 px-6 rounded-lg font-semibold hover:bg-blue-50 transition">Get Started</a>
        </div>
      </div>
    </div>
  );
};

export default Index;
