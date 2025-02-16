export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <a 
          href="/projects/firedog" 
          className="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Firedog Fireproofing</h2>
          <p className="text-gray-600">
            Collaborated with Firedog Fireproofing to develop and implement fireproofing solutions
            for commercial and residential buildings.
          </p>
        </a>
      </div>
    </div>
  );
} 