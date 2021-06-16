import createDOMPurify from 'dompurify';
import marked from 'marked';

const DOMPurify = createDOMPurify(window);

export type MDPreviewProps = {
  value: string;
};

export const MDPreview = ({ value = '' }: MDPreviewProps) => {
  return (
    <div
      className="p-2 w-full prose prose-indigo"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(value)),
      }}
    />
  );
};
