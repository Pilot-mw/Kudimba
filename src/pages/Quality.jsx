import { Sprout, ClipboardCheck, Search } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const SECTIONS = [
  {
    icon: Sprout,
    title: "Sustainable Farming",
    description:
      "We practice crop rotation and organic composting to maintain soil health and reduce chemical inputs — because what we grow must be good for the land and good for you.",
  },
  {
    icon: ClipboardCheck,
    title: "Processing Standards",
    description:
      "Our processing facility in Area 47 adheres to strict hygiene standards built on HACCP principles. We use modern equipment for drying, grinding and pasteurisation to ensure product safety without compromising flavour.",
  },
  {
    icon: Search,
    title: "Traceability",
    description:
      "Every batch of Kudimba product can be traced back to the specific field in Area 47, ensuring accountability and consistency. When you eat, you know exactly where it came from.",
  },
];

export default function Quality() {
  return (
    <div>
      <section className="bg-brand-dark px-4 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Quality &amp; Sustainability
          </h1>
          <p className="mt-2 text-brand-orange italic">"We grow, you eat."</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-4 py-16 md:py-20">
        <div className="absolute inset-0">
          <img src="/Hero 4.jpg" alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="relative mx-auto max-w-4xl space-y-16">
          {SECTIONS.map((s, i) => (
            <div
              key={s.title}
              className={`flex flex-col items-start gap-6 ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-pale">
                <s.icon size={36} className="text-brand-dark" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-dark">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-brand-gray">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
