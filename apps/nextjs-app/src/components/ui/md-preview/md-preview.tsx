import DOMPurify from 'isomorphic-dompurify';
import { parse } from 'marked';

export type MDPreviewProps = {
  value: string;
};

export const MDPreview = ({ value = '' }: MDPreviewProps) => {
  return (
    <div
      className="prose prose-slate w-full p-2"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(parse(value) as string),
      }}
    />
  );
};
