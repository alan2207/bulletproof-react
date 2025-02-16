import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { checkLoggedIn } from '@/utils/auth';

export default function HomePage() {
  const isLoggedIn = checkLoggedIn();

  return (
    <div className="space-y-12">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-indigo-900 mb-6">Welcome to My Consulting Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Delivering innovative solutions in process optimization, safety compliance, and project management.
        </p>
      </section>

      <section className="bg-white shadow-lg rounded-xl p-8 border border-indigo-50">
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Featured Projects</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 bg-indigo-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Firedog Fireproofing</h3>
            <p className="text-gray-600 leading-relaxed">
            Engineered a high-performance NAS infrastructure and implemented comprehensive backup solutions
            using Synology NAS and Hyper Backup, ensuring enterprise-level data protection and business continuity.
            </p>
            <a 
              href="/projects/firedog" 
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Learn More →
            </a>
          </div>

          <div className="p-6 bg-indigo-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Maven Baseball Lab</h3>
            <p className="text-gray-600 leading-relaxed">
              Developed data-driven solutions for player performance analysis, integrating Blast, 
              Trackman, and motion capture systems. Built custom analytics pipelines and machine 
              learning models to deliver actionable insights for athletes and coaches.
            </p>
            <a 
              href="/projects/maven" 
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Learn More →
            </a>
          </div>

          <div className="p-6 bg-indigo-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">DM Lives</h3>
            <p className="text-gray-600 leading-relaxed">
              Built a technology-enhanced wellness brand with intelligent recommendation systems 
              and automated operations, creating personalized experiences for organic tea enthusiasts.
            </p>
            <a 
              href="/projects/dmlives" 
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
