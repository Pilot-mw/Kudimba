export default function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pale text-brand-dark">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
      {description && (
        <p className="text-sm text-brand-gray leading-relaxed">{description}</p>
      )}
    </div>
  );
}
