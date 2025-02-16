export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Get in Touch</h2>
            <p className="text-gray-600">
              Interested in working together? Contact us to discuss how we can help your business succeed.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Email:</strong> contact@yourcompany.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> Dallas, Texas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 