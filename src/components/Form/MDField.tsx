import marked from 'marked';
import { Controller, Control, Path } from 'react-hook-form';
import MdEditor from 'react-markdown-editor-lite';

import 'react-markdown-editor-lite/lib/index.css';
import { FieldWrapperPassThroughProps, FieldWrapper } from './FieldWrapper';

type MDFieldProps<T> = FieldWrapperPassThroughProps & {
  className?: string;
  control: Control<T>;
  name: Path<T>;
};

export const MDField = <T,>({ label, error, control, name }: MDFieldProps<T>) => {
  return (
    <FieldWrapper label={label} error={error}>
      <Controller
        render={({ field }) => (
          <MdEditor
            style={{ height: '500px' }}
            renderHTML={(text) => marked(text)}
            onChange={(v) => field.onChange(v.text)}
            onBlur={field.onBlur}
            value={field.value as string}
          />
        )}
        control={control}
        name={name}
        defaultValue={undefined}
      />
    </FieldWrapper>
  );
};
