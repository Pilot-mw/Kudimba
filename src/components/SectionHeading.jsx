export default function SectionHeading({ children, subtitle, centered = true, light }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className={`text-3xl font-bold tracking-tight md:text-4xl ${light ? "text-white" : "text-brand-dark"}`}>
        {children}
      </h2>
      {subtitle && (
        <p className="mt-2 text-brand-orange font-medium italic">{subtitle}</p>
      )}
      <div
        className={`mx-auto mt-3 h-1 w-16 rounded-full bg-brand-orange ${centered ? "mx-auto" : ""}`}
      />
    </div>
  );
}
