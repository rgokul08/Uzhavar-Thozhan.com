export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-leaf-600">{eyebrow}</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-soil sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-soil-700">{description}</p>
    </div>
  );
}
