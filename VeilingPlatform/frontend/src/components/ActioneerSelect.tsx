import { getActioneers } from "@api/ApiProvider";
import AsyncSelect from "react-select/async";
import { Auctioneer } from "src/definitions/UserDefinition";

type Option = { value: number; label: string; meta: Auctioneer };

type Props = {
  value: Auctioneer | null;
  onChange: (auctioneer: Auctioneer | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

export default function AuctioneerSelect({ value, onChange, placeholder="Select an auctioneer…", isDisabled }: Props) {
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const res = await getActioneers();
    if (!res.ok) return [];
    const items: Auctioneer[] = await res.json();

    return items.map(a => ({ value: a.id, label: a.name, meta: a }));
  };

  const current: Option | null = value ? { value: value.id, label: value.name, meta: value } : null;

  return (
    <AsyncSelect<Option, false>
      isMulti={false}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={current}
      onChange={(opt) => onChange(opt ? opt.meta : null)}
      isDisabled={isDisabled}
      placeholder={placeholder}
      classNamePrefix="rs"
      menuPortalTarget={document.body}
      menuShouldBlockScroll
    />
  );
}
