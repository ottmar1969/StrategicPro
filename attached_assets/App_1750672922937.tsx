import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ContentScale - AI Business Consulting Platform
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to ContentScale
              </h2>
              <p className="text-gray-600 mb-6">
                Your AI-powered business consulting platform is now running successfully!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">AI Consulting</h3>
                  <p className="text-gray-600">Get expert advice across 12 business categories</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Business Analysis</h3>
                  <p className="text-gray-600">Comprehensive analysis and recommendations</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Content Generation</h3>
                  <p className="text-gray-600">AI-powered content creation with fraud detection</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">API Endpoints Available:</h3>
                <div className="text-left bg-gray-100 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm font-mono">
                    <li>GET /api/status - System status</li>
                    <li>POST /api/consultations - Create consultation</li>
                    <li>GET /api/consultations - List consultations</li>
                    <li>POST /api/analysis/:id - Generate analysis</li>
                    <li>POST /api/business-profiles - Create business profile</li>
                    <li>POST /api/content/generate - Generate content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

