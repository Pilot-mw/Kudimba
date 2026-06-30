import { Leaf, Target, Eye, Heart, Castle } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import CompanyInfoTable from "../components/CompanyInfoTable";
import ValueCard from "../components/ValueCard";

const VALUES = [
  {
    icon: Castle,
    title: "Quality",
    description:
      "We never compromise on quality — from seed to shelf, every product meets our exacting standards.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Honest practices, transparent processes. Our customers trust us because we do what we say.",
  },
  {
    icon: Target,
    title: "Innovation",
    description:
      "We embrace modern techniques and continuously improve our farming and processing methods.",
  },
  {
    icon: Leaf,
    title: "Community",
    description:
      "We are rooted in Area 47 and committed to supporting our local farming community.",
  },
  {
    icon: Eye,
    title: "Simplicity",
    description:
      "Simple philosophy, pure ingredients, straightforward business. We grow, you eat.",
  },
];

export default function About() {
  return (
    <div>
      <section className="bg-brand-dark px-4 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            About Kudimba Farms
          </h1>
          <p className="mt-2 text-brand-orange italic">"We grow, you eat."</p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading centered={false}>Executive Summary</SectionHeading>
          <p className="mt-6 leading-relaxed text-brand-gray">
            Kudimba Farms is a premier agricultural enterprise based in Area 47, Lilongwe, Malawi,
            dedicated to the specialised cultivation and processing of high-quality pepper products.
            From the fiery heat of the Peri-Peri to the mild, fruity Local Kambuzi and the versatile
            Jalapeño and Cayenne, we transform fresh produce into premium sauces, spices and powders.
            Our philosophy is simple: <strong className="text-brand-dark">we grow, you eat.</strong>
          </p>
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading centered={false}>Company Identity</SectionHeading>
          <div className="mt-6">
            <CompanyInfoTable />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl space-y-12">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-dark">
              <Eye size={24} className="text-brand-orange" />
              Our Vision
            </h2>
            <p className="mt-3 leading-relaxed text-brand-gray">
              To be the leading pepper producer in Malawi, recognised globally for quality,
              sustainability and the authentic taste of African heat.
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-dark">
              <Target size={24} className="text-brand-orange" />
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed text-brand-gray">
              To cultivate premium pepper varieties using sustainable farming methods, process them
              with state-of-the-art hygiene, and deliver exceptional flavour to our customers —
              ensuring that when we grow, <strong>you eat with confidence and satisfaction</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Core Values</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {VALUES.map((v) => (
              <ValueCard key={v.title} {...v} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-4 py-16 md:py-20">
        <div className="absolute inset-0">
          <img src="/Hero 2.jpg" alt="" className="h-full w-full object-cover opacity-25" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl">
            <img src="/Hero 2.jpg" alt="Kudimba Farms fields" className="mb-6 h-64 w-full object-cover rounded-xl" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark">Our Farm</h2>
          <p className="mt-3 leading-relaxed text-brand-gray">
            Nestled in the fertile fields of Area 47, Lilongwe, our farm benefits from Malawi's rich
            soils and favourable growing conditions. We cultivate our peppers with care, using
            sustainable methods that protect the land and produce exceptional fruit — the
            foundation of every Kudimba product.
          </p>
        </div>
      </section>
    </div>
  );
}
