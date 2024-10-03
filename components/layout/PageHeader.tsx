import React from "react";

const PageHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <section className="mb-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </section>
  );
};

export default PageHeader;
