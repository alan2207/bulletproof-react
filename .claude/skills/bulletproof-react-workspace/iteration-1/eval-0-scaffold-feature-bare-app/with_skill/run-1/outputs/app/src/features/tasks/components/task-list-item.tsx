import { Task } from '@/types/api';

type TaskListItemProps = {
  task: Task;
};

export const TaskListItem = ({ task }: TaskListItemProps) => {
  return (
    <li className="task">
      <h3 className="task__title">{task.title}</h3>
      <p className="task__description">{task.description}</p>
    </li>
  );
};
