'use client';

import { Pen } from 'lucide-react';

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
import { canUpdateDiscussion } from '@/lib/authorization';

import { useDiscussion } from '../api/get-discussion';
import {
  updateDiscussionInputSchema,
  useUpdateDiscussion,
} from '../api/update-discussion';

type UpdateDiscussionProps = {
  discussionId: string;
};

export const UpdateDiscussion = ({ discussionId }: UpdateDiscussionProps) => {
  const { addNotification } = useNotifications();
  const discussionQuery = useDiscussion({ discussionId });
  const updateDiscussionMutation = useUpdateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Updated',
        });
      },
    },
  });

  const user = useUser();

  if (!canUpdateDiscussion(user?.data)) {
    return null;
  }

  const discussion = discussionQuery.data?.data;

  return (
    <FormDrawer
      isDone={updateDiscussionMutation.isSuccess}
      triggerButton={
        <Button icon={<Pen className="size-4" />} size="sm">
          Update Discussion
        </Button>
      }
      title="Update Discussion"
      submitButton={
        <Button
          form="update-discussion"
          type="submit"
          size="sm"
          isLoading={updateDiscussionMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="update-discussion"
        onSubmit={(values) => {
          updateDiscussionMutation.mutate({
            data: values,
            discussionId,
          });
        }}
        options={{
          defaultValues: {
            title: discussion?.title ?? '',
            body: discussion?.body ?? '',
            public: discussion?.public ?? false,
          },
        }}
        schema={updateDiscussionInputSchema}
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
