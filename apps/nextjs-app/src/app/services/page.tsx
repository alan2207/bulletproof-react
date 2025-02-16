export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Our Services</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Process Optimization</h2>
          <p className="text-gray-600">
            Streamline your operations and improve efficiency through data-driven process optimization.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Safety Compliance</h2>
          <p className="text-gray-600">
            Ensure your operations meet all safety standards and regulatory requirements.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Management</h2>
          <p className="text-gray-600">
            Expert project management services to keep your initiatives on track and within budget.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Strategic Consulting</h2>
          <p className="text-gray-600">
            Strategic guidance to help your business grow and adapt to market changes.
          </p>
        </div>
      </div>
    </div>
  );
}