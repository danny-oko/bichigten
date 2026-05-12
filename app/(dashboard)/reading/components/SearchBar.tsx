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
      className="w-full rounded-full border border-amber-100 bg-white/85 px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-400"
    />
  );
};
