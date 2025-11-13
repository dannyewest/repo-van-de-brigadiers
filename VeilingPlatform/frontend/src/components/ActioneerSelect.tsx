// components/AuctioneerSelect.tsx
import { getActioneers } from "@api/ApiProvider";
import AsyncSelect from "react-select/async";

export type Auctioneer = { id: number; name: string };

type Option = { value: number; label: string; meta: Auctioneer };

type Props = {
  value: Auctioneer | null;
  onChange: (auctioneer: Auctioneer | null) => void;
  apiBase?: string;
  placeholder?: string;
  isDisabled?: boolean;
};

export default function AuctioneerSelect({
  value,
  onChange,
  placeholder = "Select an auctioneer…",
  isDisabled,
}: Props) {
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const res = await getActioneers();
    if (!res.ok) return [];
    const items: Auctioneer[] = await res.json();

    return items.map((a) => ({
      value: a.id,
      label: a.name,
      meta: a,
    }));
  };

  const current: Option | null =
    value ? { value: value.id, label: value.name, meta: value } : null;

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
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 44,
          fontSize: 16,
          borderRadius: 8,
          borderColor: state.isFocused ? "#26006b" : "#ced4da",
          boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(38,0,107,.15)" : "none",
          ":hover": { borderColor: "#26006b" },
        }),
        valueContainer: (b) => ({ ...b, padding: "4px 10px" }),
        singleValue: (b) => ({ ...b, fontSize: 16 }),
        input: (b) => ({ ...b, fontSize: 16 }),
        placeholder: (b) => ({ ...b, fontSize: 16 }),
        menuPortal: (b) => ({ ...b, zIndex: 9999 }),
        menu: (b) => ({ ...b, fontSize: 16, borderRadius: 10, overflow: "hidden" }),
      }}
      theme={(t) => ({
        ...t,
        colors: {
          ...t.colors,
          primary: "#26006b",
          primary25: "rgba(38,0,107,.08)",
          primary50: "rgba(38,0,107,.15)",
        },
        borderRadius: 8,
        spacing: { ...t.spacing, baseUnit: 5 },
      })}
    />
  );
}
