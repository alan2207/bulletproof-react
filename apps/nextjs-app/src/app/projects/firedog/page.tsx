export default function FiredogProjectPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Firedog Fireproofing</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Project Overview</h2>
          <p className="text-gray-600">
            Collaborated with Firedog Fireproofing to develop and implement fireproofing solutions
            for commercial and residential buildings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Key Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Developed comprehensive fireproofing strategies</li>
            <li>Implemented safety protocols and procedures</li>
            <li>Coordinated with contractors and stakeholders</li>
            <li>Ensured compliance with fire safety regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Technologies & Tools</h2>
          <div className="flex flex-wrap gap-2">
            {['Fire Safety', 'Project Management', 'Regulatory Compliance'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 