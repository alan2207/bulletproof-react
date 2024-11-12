'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
  Label,
  Switch,
  Textarea,
} from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';
import { canCreateDiscussion } from '@/lib/authorization';

import {
  createDiscussionInputSchema,
  useCreateDiscussion,
} from '../api/create-discussion';

export const CreateDiscussion = () => {
  const { addNotification } = useNotifications();
  const createDiscussionMutation = useCreateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Created',
        });
      },
    },
  });

  const user = useUser();

  if (!canCreateDiscussion(user?.data)) {
    return null;
  }

  return (
    <FormDrawer
      isDone={createDiscussionMutation.isSuccess}
      triggerButton={
        <Button size="sm" icon={<Plus className="size-4" />}>
          Create Discussion
        </Button>
      }
      title="Create Discussion"
      submitButton={
        <Button
          form="create-discussion"
          type="submit"
          size="sm"
          isLoading={createDiscussionMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-discussion"
        onSubmit={(values) => {
          createDiscussionMutation.mutate({ data: values });
        }}
        schema={createDiscussionInputSchema}
        options={{
          defaultValues: {
            title: '',
            body: '',
            public: false,
          },
        }}
      >
        {({ register, formState, setValue, watch }) => (
          <>
            <Input
              label="Title"
              error={formState.errors['title']}
              registration={register('title')}
            />

            <Textarea
              label="Body"
              error={formState.errors['body']}
              registration={register('body')}
            />

            <div className="flex items-center space-x-2">
              <Switch
                name="public"
                onCheckedChange={(value) => setValue('public', value)}
                checked={watch('public')}
                className={` relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                id="public"
              />
              <Label htmlFor="airplane-mode">Public</Label>
            </div>
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
