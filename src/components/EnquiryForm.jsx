import { useState } from "react";
import { Send } from "lucide-react";
import { openWhatsApp } from "../utils/whatsapp";

const PRODUCT_OPTIONS = [
  "Fresh Chillies & Raw Materials",
  "Hot Sauce (Peri-Peri & Kambuzi)",
  "Spicy Pepper Sauce (Cayenne & Jalapeño)",
  "Sweet Pepper Sauce (Red Bell Pepper)",
  "Kambuzi Special",
  "Powders & Spices (Cayenne, Peri-Peri, Smoked Paprika, Kambuzi Flakes)",
  "Pickled Jalapeños",
  "Other",
];

export default function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    products: [],
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (product) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productList = form.products.length
      ? form.products.join(", ")
      : "Not specified";
    const message = [
      "Hi Kudimba Farms, I'd like to make a bulk enquiry / booking.",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.company ? `Company: ${form.company}` : "",
      `Products of interest: ${productList}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    openWhatsApp(message);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitted && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          This will open WhatsApp with your order details pre-filled &mdash; just hit send.
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-brand-ink">
          Name <span className="text-brand-hot">*</span>
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-brand-ink">
          Phone <span className="text-brand-hot">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
          placeholder="+265 999 000 000"
        />
      </div>

      <div>
        <label htmlFor="company" className="mb-1 block text-sm font-medium text-brand-ink">
          Company / Organisation
        </label>
        <input
          id="company"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
          placeholder="Optional"
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-brand-ink">
          Products of interest
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PRODUCT_OPTIONS.map((product) => (
            <label
              key={product}
              className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:bg-brand-pale has-checked:border-brand-green has-checked:bg-brand-pale"
            >
              <input
                type="checkbox"
                checked={form.products.includes(product)}
                onChange={() => handleToggle(product)}
                className="mt-0.5 accent-brand-green"
              />
              <span>{product}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-brand-ink">
          Quantity / Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none resize-y"
          placeholder="Estimated quantity, packaging preferences, delivery details..."
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
      >
        <Send size={18} />
        Send Enquiry via WhatsApp
      </button>
    </form>
  );
}
