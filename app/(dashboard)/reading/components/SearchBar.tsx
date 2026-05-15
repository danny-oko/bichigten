type SearchBarProps = {
  onChange: (value: string) => void;
  value: string;
};

export const SearchBar = ({ onChange, value }: SearchBarProps) => {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search readings"
      className="w-full rounded-full border-3 border-[#E8920A]/50 bg-[#fff8ec] px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#E8920A] dark:border-[#84d8ff]/40 dark:bg-[#1e293b]/70 dark:text-[#e8e4dc] dark:placeholder:text-[#64748b] dark:focus:border-[#84d8ff]"
    />
  );
};
