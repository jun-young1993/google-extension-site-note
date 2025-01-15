const Popup = () => {
  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <header className="w-full max-w-4xl px-6 py-4 bg-white shadow-md rounded-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Site Note</h1>
        <p className="text-sm text-gray-500">
          Easily manage notes by domain, path, and query
        </p>
      </header>

      <div className="w-full max-w-4xl bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Your Notes</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
            + Add Note
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h3 className="text-md font-medium text-gray-800">example.com</h3>
              <p className="text-sm text-gray-600">/products?page=2</p>
              <p className="text-sm text-gray-500 mt-1">
                Remember to check this page for updates.
              </p>
            </div>
            <div className="flex items-center mt-3 sm:mt-0">
              <button className="text-sm px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                Edit
              </button>
              <button className="ml-2 text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h3 className="text-md font-medium text-gray-800">
                blog.example.com
              </h3>
              <p className="text-sm text-gray-600">/2023/insights</p>
              <p className="text-sm text-gray-500 mt-1">
                Draft ideas for next article.
              </p>
            </div>
            <div className="flex items-center mt-3 sm:mt-0">
              <button className="text-sm px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                Edit
              </button>
              <button className="ml-2 text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-4xl px-6 py-4 mt-6 text-center text-gray-500 text-sm">
        © 2025 Site Note - Your personal note manager
      </footer>
    </div>
  );
};

export default Popup;
