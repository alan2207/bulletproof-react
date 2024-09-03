import NextHead from 'next/head';

type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
    </NextHead>
  );
};
