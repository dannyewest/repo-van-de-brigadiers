// components/ProductSelect.tsx
import { getProducts } from "@api/ApiProvider";
import { useMemo } from "react";
import AsyncSelect from "react-select/async";

type ProductSummary = {
  id: number;
  name: string;
};

type Option = { value: number; label: string; meta?: ProductSummary };

type Props = {
  value: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
};

export default function ProductSelect({
  value,
  onChange,
  placeholder = "Select products…",
  isClearable,
  isDisabled,
}: Props) {
  const toOptions = (ids: number[], index: Record<number, ProductSummary> | null): Option[] =>
    ids
      .map((id) => {
        const item = index?.[id];
        return item
          ? { value: item.id, label: item.name, meta: item }
          : { value: id, label: `#${id}`, meta: undefined };
      });

  const loadedIndexRef = useMemo(() => new Map<number, ProductSummary>(), []);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const products = getProducts();

    const items: ProductSummary[] = await products;

    items.forEach((p) => loadedIndexRef.set(p.id, p));

    return items.map((p) => ({ value: p.id, label: p.name, meta: p }));
  };

  return (
    <AsyncSelect<Option, true>
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={toOptions(value, Object.fromEntries(loadedIndexRef))}
      onChange={(opts) => onChange(opts.map((o) => o.value))}
      classNamePrefix="rs"
      isClearable={isClearable}
      isDisabled={isDisabled}
      placeholder={placeholder}
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
        groupHeading: (b) => ({
          ...b, fontSize: 12, fontWeight: 600, letterSpacing: ".04em", color: "#6c757d",
        }),
        option: (base, state) => ({
          ...base,
          fontSize: 16,
          padding: "10px 12px",
          backgroundColor: state.isFocused ? "rgba(38,0,107,.08)" : "white",
          color: "#212529",
        }),
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
