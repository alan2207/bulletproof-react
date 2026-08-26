import * as React from 'react';

type ContentLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const ContentLayout = ({ title, children }: ContentLayoutProps) => {
  return (
    <section className="content-layout">
      <h1 className="content-layout__title">{title}</h1>
      <div className="content-layout__body">{children}</div>
    </section>
  );
};
