type ReadingHeaderProps = {
  description?: string;
  title: string;
};

export const ReadingHeader = ({ description, title }: ReadingHeaderProps) => {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-stone-600">
          {description}
        </p>
      )}
    </header>
  );
};
