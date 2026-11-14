type CaseSectionProps = {
  id: string;
  index: string;
  title: string;
  content: string;
};

export default function CaseSection({
  id,
  index,
  title,
  content,
}: CaseSectionProps) {
  const paragraphs = content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section id={id} className="scroll-mt-8 border-t hairline pt-7 mt-9 first:mt-0 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="num micro t-faint tnum">{index}</span>
        <h2 className="section-title text-[1.5rem]">{title}</h2>
      </div>
      <div className="mt-3 max-w-[66ch] space-y-4 text-[1.0625rem] leading-[1.7] text-[var(--ink-soft)]">
        {paragraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
