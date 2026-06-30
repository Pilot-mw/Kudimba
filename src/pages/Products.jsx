import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";

const FRESH_CHILLIES = [
  {
    name: "Cayenne",
    description: "Slender, vibrant red chili. Best for drying and pepper sauces.",
    heat: "Hot",
    image: "/images/products/Cayenne.jpg",
  },
  {
    name: "Jalapeño",
    description: "Thick-fleshed, mild-to-medium chili. Best for stuffing, salsas, pickling.",
    heat: "Medium",
    image: "/images/products/jalapeno.jpg",
  },
  {
    name: "Local Kambuzi",
    description: "Small, round, traditional Malawian chili. Best for authentic Malawian dishes and sauces.",
    heat: "Mild",
    image: "/images/products/local-Kambuzi.jpg",
  },
  {
    name: "Peri-Peri",
    description: "Small but fierce African Bird's Eye chili. Best for authentic Portuguese/African-style dishes.",
    heat: "Extra Hot",
    image: "/images/products/Peri-Peri.jpg",
  },
];

const SAUCES = [
  {
    name: "Hot Sauce (Peri-Peri & Kambuzi)",
    description: "A fiery blend for those who love intense heat.",
    heat: "Extra Hot",
    image: "/images/products/hot-sauce.jpg",
  },
  {
    name: "Spicy Pepper Sauce (Cayenne & Jalapeño)",
    description: "The perfect balance of flavour and medium heat for everyday cooking.",
    heat: "Medium",
    image: "/images/products/spicy-sauce.jpg",
  },
  {
    name: "Sweet Pepper Sauce (Red Bell Pepper)",
    description: "A mild, tangy-sweet sauce with no heat — ideal for marinades and dips.",
    image: "/images/products/sweet-sauce.jpg",
  },
  {
    name: "Kambuzi Special",
    description: "A tribute to Malawi — pure Kambuzi sauce with an authentic, distinctive kick.",
    heat: "Mild",
    image: "/images/products/kambuzi-special.jpg",
  },
];

const POWDERS = [
  {
    name: "Cayenne Powder",
    description: "Finely ground for chili, stews and dry rubs.",
    heat: "Hot",
    image: "/images/products/cayenne-powder.jpg",
  },
  {
    name: "Peri-Peri Powder",
    description: "A dry blend of chili, garlic and citrus notes.",
    heat: "Extra Hot",
    image: "/images/products/peri-peri-powder.jpg",
  },
  {
    name: "Smoked Paprika",
    description: "Made from dried, smoked jalapeños or sweet peppers for a rich, smoky flavour.",
    heat: "Mild",
    image: "/images/products/Paprika-Powder.jpg",
  },
  {
    name: "Kambuzi Flakes",
    description: "Crushed dried Kambuzi for authentic Malawian cooking.",
    heat: "Mild",
    image: "/images/products/Kambuzi-flakes.jpg",
  },
];

const VALUE_ADDED = [
  {
    name: "Pickled Jalapeños",
    description:
      "Sliced and jarred in brine, perfect for pizzas, burgers and salads.",
    heat: "Medium",
    image: "/images/products/pickled-jalapenos.jpg",
  },
];

export default function Products() {
  return (
    <div>
      <section className="bg-brand-dark px-4 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Our Products
          </h1>
          <p className="mt-2 text-brand-orange italic">"We grow, you eat."</p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Fresh Chillies &amp; Raw Materials</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FRESH_CHILLIES.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Premium Pepper Sauces</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SAUCES.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Powders &amp; Spices</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {POWDERS.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-dark px-4 py-16 md:py-20">
        <img src="/Hero 3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative mx-auto max-w-3xl text-center text-white">
          <p className="text-lg leading-relaxed">
            All products are available in a range of packaging sizes, from household bottles and jars
            to larger formats for restaurants, retailers and wholesale customers.
          </p>
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Value-Added Products</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_ADDED.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
