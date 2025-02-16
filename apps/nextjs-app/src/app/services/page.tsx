export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Delivering exceptional consulting solutions tailored to your business needs
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 border border-indigo-50">
          <div className="mb-4 text-indigo-600">
            {/* You can add an icon here */}
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Process Optimization</h2>
          <p className="text-gray-600 leading-relaxed">
            Transform your operations with data-driven insights and proven optimization strategies that drive efficiency and growth.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 border border-indigo-50">
          <div className="mb-4 text-indigo-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Safety Compliance</h2>
          <p className="text-gray-600 leading-relaxed">
            Ensure your operations exceed safety standards with comprehensive compliance solutions and expert guidance.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 border border-indigo-50">
          <div className="mb-4 text-indigo-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Project Management</h2>
          <p className="text-gray-600 leading-relaxed">
            Deliver projects on time and within budget with our proven project management methodologies and expertise.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 border border-indigo-50">
          <div className="mb-4 text-indigo-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Strategic Consulting</h2>
          <p className="text-gray-600 leading-relaxed">
            Navigate market changes and drive growth with strategic insights and actionable recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}