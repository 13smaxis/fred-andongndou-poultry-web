import Image from "next/image";
import { STORE_NAME, GALLERY_IMAGES } from "@/lib/constants";
import { Shield, Award, Leaf, Heart, CheckCircle } from "lucide-react";
import AnimatedStatCard from "@/components/about/AnimatedStatCard";

const certifications = [
  { icon: Shield, title: "USDA Certified", desc: "Meets all federal poultry standards" },
  { icon: Award, title: "Good Agricultural Practices", desc: "GAP certified farm operations" },
  { icon: Leaf, title: "Sustainable Farming", desc: "Eco-friendly farming methods" },
  { icon: Heart, title: "Animal Welfare Approved", desc: "Humane treatment of all birds" },
];

const biosecurity = [
  "Controlled access to poultry houses with visitor protocols",
  "Regular disinfection of all equipment and facilities",
  "Comprehensive vaccination programs for all flocks",
  "Quarantine procedures for new birds entering the farm",
  "Regular health monitoring and veterinary inspections",
  "Proper waste management and disposal systems",
  "Clean water supply with regular testing",
  "Pest and rodent control programs",
];

const timeline = [
  { year: "2009", event: "Farm established with 500 broilers" },
  { year: "2012", event: "Expanded to include layer operations" },
  { year: "2015", event: "Achieved USDA certification" },
  { year: "2018", event: "Launched day-old chick supply program" },
  { year: "2021", event: "Introduced free-range operations" },
  { year: "2024", event: "Expanded to serve 500+ customers monthly" },
];

const stats = [
  {
    end: 15,
    suffix: "+",
    label: "Years Experience",
    cardClassName: "bg-blue-700 text-white",
  },
  {
    end: 500,
    suffix: "+",
    label: "Monthly Customers",
    cardClassName: "bg-emerald-700 text-white",
  },
  {
    end: 50,
    suffix: "K+",
    label: "Birds Raised Yearly",
    cardClassName: "bg-orange-700 text-white",
  },
  {
    end: 99,
    suffix: "%",
    label: "Customer Satisfaction",
    cardClassName: "bg-slate-800 text-white",
  },
];

const stripeDirections = [
  "biosecurity-stripe-left",
  "biosecurity-stripe-right",
  "biosecurity-stripe-top",
  "biosecurity-stripe-diagonal",
];

export default function AboutPage() {
  return (
    <>
      <div
        className="relative h-64 overflow-hidden bg-cover bg-center md:h-80 md:bg-fixed"
        style={{ backgroundImage: `url(${GALLERY_IMAGES[0]})` }}
      >
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-green-900/80 to-green-800/60">
          <div className="mx-auto w-full max-w-7xl px-4">
            <h1 className="mb-3 text-3xl font-bold text-white md:text-5xl">About Our Farm</h1>
            <p className="max-w-xl text-lg text-green-100">
              Over 15 years of dedication to raising healthy, premium poultry with the highest standards of care.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">Our Story</h2>
            <div className="space-y-4 leading-relaxed text-gray-600">
              <p>
                {STORE_NAME} was founded in 2009 with a simple mission: to provide the freshest, healthiest poultry products to our community. What started as a small operation with just 500 broilers has grown into one of the region&apos;s most trusted poultry suppliers.
              </p>
              <p>
                Our founder, a third-generation farmer, combined traditional farming wisdom with modern agricultural science to create a farm that prioritizes both animal welfare and product quality. Every bird on our farm receives proper nutrition, clean water, and ample space to grow naturally.
              </p>
              <p>
                Today, we serve over 500 customers monthly, including families, restaurants, retailers, and fellow farmers. Our commitment to quality has never wavered, and every product carries the {STORE_NAME} guarantee of excellence.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY_IMAGES.map((img, idx) => (
              <div key={idx} className="relative h-40 overflow-hidden rounded-xl shadow-sm">
                <Image
                  src={img}
                  alt={`Farm ${idx + 1}`}
                  fill
                  unoptimized
                  className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedStatCard
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              className={`${stat.cardClassName}`}
              durationMs={1300}
            />
          ))}
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">Certifications & Standards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div
                key={cert.title}
                className="rounded-xl border border-amber-200 bg-amber-100/70 p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <cert.icon className="mx-auto mb-3 h-10 w-10 text-amber-700" />
                <h3 className="mb-1 font-semibold text-gray-900">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 rounded-2xl bg-green-50 p-8">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
            <Shield className="h-8 w-8 text-green-600" />
            Biosecurity Practices
          </h2>
          <p className="mb-6 text-gray-600">
            We maintain strict biosecurity protocols to ensure the health of our flocks and the safety of our products.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {biosecurity.map((item, idx) => (
              <div
                key={idx}
                className={`biosecurity-stripe-card ${stripeDirections[idx % stripeDirections.length]} flex items-start gap-3 rounded-lg bg-white p-3`}
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">Our Journey</h2>
          <div className="mx-auto max-w-2xl">
            {timeline.map((item, idx) => (
              <div key={idx} className="mb-6 flex gap-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                    {item.year}
                  </div>
                  {idx < timeline.length - 1 && <div className="mt-2 w-0.5 flex-1 bg-green-200" />}
                </div>
                <div className="flex-1 rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-sm">
                  <p className="font-medium text-gray-800">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}