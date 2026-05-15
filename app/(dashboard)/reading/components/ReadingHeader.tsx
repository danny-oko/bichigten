type ReadingHeaderProps = {
  description?: string;
  title: string;
};

export const ReadingHeader = ({ description, title }: ReadingHeaderProps) => {
  return (
    <header className="flex flex-col gap-1.5 md:gap-2">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl dark:text-[#f0ebe3]">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-sm leading-5 text-stone-600 md:leading-6 dark:text-[#b8b0a4]">
          {description}
        </p>
      )}
    </header>
  );
};
