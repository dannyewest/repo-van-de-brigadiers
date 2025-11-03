import Select from "react-select";

// Swap out options for dynamic flower data with types/species
const options = [
  {
    label: "Roses",
    options: [
      { value: "Rose Elegance", label: "Rose Elegance" },
      { value: "Rose Royale", label: "Rose Royale" },
      { value: "Rose Velvet Bloom", label: "Rose Velvet Bloom" },
    ],
  },
  {
    label: "Tulips",
    options: [
      { value: "Tulip Harmony", label: "Tulip Harmony" },
      { value: "Tulip Imperial", label: "Tulip Imperial" },
      { value: "Tulip Crystal Dawn", label: "Tulip Crystal Dawn" },
    ],
  },
  {
    label: "Lilies & Orchids",
    options: [
      { value: "Lily Grace", label: "Lily Grace" },
      { value: "Orchid Majesty", label: "Orchid Majesty" },
      { value: "Orchid Imperial Silk", label: "Orchid Imperial Silk" },
    ],
  },
  {
    label: "Peonies & Others",
    options: [
      { value: "Peony Bloom", label: "Peony Bloom" },
      { value: "Hydrangea Dream", label: "Hydrangea Dream" },
      { value: "Chrysanthemum Delight", label: "Chrysanthemum Delight" },
      { value: "Lavender Whisper", label: "Lavender Whisper" },
      { value: "Daisy Charm", label: "Daisy Charm" },
      { value: "Sunflower Glory", label: "Sunflower Glory" },
    ],
  },
];

export type Option = {
  value: string;
  label: string;
};

type Props = {
  value?: Option | null;
  onChange?: (value: Option | null) => void;
  isClearable?: boolean;
};

export default function FlowerSelect({ value, onChange, isClearable }: Props) {
  return (
    <Select
      classNamePrefix="rs"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select premium flower…"
      isClearable={isClearable}
      isSearchable
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