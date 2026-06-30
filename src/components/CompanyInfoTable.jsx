const ROWS = [
  { label: "Company Name", value: "Kudimba Farms" },
  { label: "Motto", value: '"We grow, you eat."' },
  { label: "Location", value: "Area 47, Lilongwe, Malawi" },
  { label: "Specialisation", value: "Cultivation & processing of premium pepper products" },
  { label: "Core Products", value: "Cayenne, Jalapeño, Local Kambuzi & Peri-Peri — sauces, powders, spices & fresh chillies" },
];

export default function CompanyInfoTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-brand-pale/50" : "bg-white"}>
              <td className="px-4 py-3 font-semibold text-brand-dark whitespace-nowrap w-1/3">
                {row.label}
              </td>
              <td className="px-4 py-3 text-brand-gray">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
