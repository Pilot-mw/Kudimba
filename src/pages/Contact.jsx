import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import EnquiryForm from "../components/EnquiryForm";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

export default function Contact() {
  return (
    <div>
      <section className="bg-brand-dark px-4 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Contact &amp; Order
          </h1>
          <p className="mt-2 text-brand-orange italic">"We grow, you eat."</p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading centered={false}>Get in Touch</SectionHeading>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-brand-orange" />
                  <div>
                    <p className="font-semibold text-brand-dark">Location</p>
                    <p className="text-sm text-brand-gray">Area 47, Lilongwe, Malawi</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 shrink-0 text-brand-orange" />
                  <div>
                    <p className="font-semibold text-brand-dark">Phone / WhatsApp</p>
                    <p className="text-sm text-brand-gray">+265 999 941 540</p>
                    <p className="text-sm text-brand-gray">+265 885 010 149</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 shrink-0 text-brand-orange" />
                  <div>
                    <p className="font-semibold text-brand-dark">Business Hours</p>
                    <p className="text-sm text-brand-gray">Mon–Fri: 8:00 AM – 5:00 PM</p>
                    <p className="text-sm text-brand-gray">Sat: 9:00 AM – 1:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={buildWhatsAppLink(WHATSAPP_GREETING)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
                >
                  <MessageCircle size={20} />
                  Order on WhatsApp
                </a>
              </div>

              <div className="mt-10 aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246060.99090250284!2d33.689601226562506!3d-13.96250965636058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x191f9f5b5e5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sLilongwe%2C+Malawi!5e0!3m2!1sen!2s!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map of Lilongwe, Malawi"
                />
              </div>
            </div>

            <div>
              <SectionHeading centered={false}>
                Bulk Enquiry / Booking
              </SectionHeading>
              <p className="mt-4 text-sm text-brand-gray">
                For restaurants, hotels, wholesalers and large-volume orders. Fill in the form
                below and we&rsquo;ll open WhatsApp with your details pre-filled.
              </p>
              <div className="mt-6">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
