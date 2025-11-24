import { getAvailableProducts } from "@api/ApiProvider";
import { useState } from "react";
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
  // index: productId -> { id, name }
  const [index, setIndex] = useState<Record<number, ProductSummary>>({});

  const toOptions = (ids: number[]): Option[] =>
    ids.map((id) => {
      const item = index[id];
      return item
        ? { value: item.id, label: item.name, meta: item }
        : { value: id, label: `#${id}`, meta: undefined }; // fallback als we de naam nog niet kennen
    });

  const loadOptions = async (): Promise<Option[]> => {
    const items: ProductSummary[] = await getAvailableProducts();

    // index bijwerken + rerender forceren
    setIndex((prev) => {
      const next = { ...prev };
      items.forEach((p) => {
        next[p.id] = p;
      });
      return next;
    });

    return items.map((p) => ({
      value: p.id,
      label: p.name,
      meta: p,
    }));
  };

  return (
    <AsyncSelect<Option, true>
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={toOptions(value)}
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
          boxShadow: state.isFocused
            ? "0 0 0 0.2rem rgba(38,0,107,.15)"
            : "none",
          ":hover": { borderColor: "#26006b" },
        }),
        valueContainer: (b) => ({ ...b, padding: "4px 10px" }),
        singleValue: (b) => ({ ...b, fontSize: 16 }),
        input: (b) => ({ ...b, fontSize: 16 }),
        placeholder: (b) => ({ ...b, fontSize: 16 }),
        menuPortal: (b) => ({ ...b, zIndex: 9999 }),
        menu: (b) => ({ ...b, fontSize: 16, borderRadius: 10, overflow: "hidden" }),
        groupHeading: (b) => ({
          ...b,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: ".04em",
          color: "#6c757d",
        }),
        option: (base, state) => ({
          ...base,
          fontSize: 16,
          padding: "10px 12px",
          backgroundColor: state.isFocused
            ? "rgba(38,0,107,.08)"
            : "white",
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