import Image from "next/image";

/**
 * Three reasons, stacked on mobile exactly as the frame draws them and set as
 * three columns on desktop.
 *
 * One correction to the design: the frame titles both the first and second
 * block "VETTED LISTINGS", but the second block's body is about volume sold
 * and the CTA card below lists the three pillars as Vetted Listings / Industry
 * Trusted / Finance Available. The second is titled "Industry Trusted" here so
 * the two lists agree.
 *
 * The pictograms are boxed square at the frame's 111px (96px on desktop) with
 * object-contain, so each keeps the internal padding that balances it against
 * the other two.
 */
const REASONS = [
  {
    icon: "/brand/icon-vetted.webp",
    title: "Vetted Listings",
    body:
      "Every motorcycle is thoroughly inspected and vetted to insure the motorcycle is fit for safe track and road use.",
  },
  {
    icon: "/brand/icon-trusted.webp",
    title: "Industry Trusted",
    body: "Over 120+ track and road motorcycles have been sold by RAGERIDE.",
  },
  {
    icon: "/brand/icon-finance.webp",
    title: "Finance Available",
    body:
      "Finance available — give our helpful sales staff a call or a message to inquire about financing rates and current promotions.",
  },
];

export function WhyChoose() {
  return (
    <section className="shell py-14 lg:py-20" aria-labelledby="why-heading">
      <h2 id="why-heading" className="section-title text-center text-gold">
        Why Choose RAGERIDE ?
      </h2>

      <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-3 lg:gap-12">
        {REASONS.map((reason) => (
          <article key={reason.title} className="text-center">
            <Image
              src={reason.icon}
              alt=""
              width={256}
              height={256}
              className="mx-auto size-28 object-contain lg:size-24"
            />
            <h3 className="mt-6 font-sans text-[clamp(1.5rem,7vw,2rem)] font-medium uppercase leading-tight">
              {reason.title}
            </h3>
            <p className="mx-auto mt-4 max-w-prose text-[0.9375rem] leading-[1.51] tracking-[0.6px] text-navy">
              {reason.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
