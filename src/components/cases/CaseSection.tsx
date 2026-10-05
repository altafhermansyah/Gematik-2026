type CaseSectionProps = {
  title: string;
  content: string;
};

export default function CaseSection({ title, content }: CaseSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-slate-100">
        {title}
      </h2>
      <div className="prose prose-invert max-w-none text-base leading-relaxed text-slate-300 break-words">
        {content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mt-2 first:mt-0">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
