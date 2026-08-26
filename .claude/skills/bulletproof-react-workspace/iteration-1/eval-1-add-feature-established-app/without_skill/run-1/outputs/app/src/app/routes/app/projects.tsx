import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { getProjectsQueryOptions } from '@/features/projects/api/get-projects';
import { CreateProject } from '@/features/projects/components/create-project';
import { ProjectsList } from '@/features/projects/components/projects-list';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getProjectsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const ProjectsRoute = () => {
  return (
    <ContentLayout title="Projects">
      <div className="flex justify-end">
        <CreateProject />
      </div>
      <div className="mt-4">
        <ProjectsList />
      </div>
    </ContentLayout>
  );
};

export default ProjectsRoute;
