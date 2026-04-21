
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { STORE_NAME, GALLERY_IMAGES } from '@/lib/constants';
import { Shield, Award, Leaf, Users, Clock, Heart, CheckCircle } from 'lucide-react';

const certifications = [
  { icon: Shield, title: 'USDA Certified', desc: 'Meets all federal poultry standards' },
  { icon: Award, title: 'Good Agricultural Practices', desc: 'GAP certified farm operations' },
  { icon: Leaf, title: 'Sustainable Farming', desc: 'Eco-friendly farming methods' },
  { icon: Heart, title: 'Animal Welfare Approved', desc: 'Humane treatment of all birds' },
];

const biosecurity = [
  'Controlled access to poultry houses with visitor protocols',
  'Regular disinfection of all equipment and facilities',
  'Comprehensive vaccination programs for all flocks',
  'Quarantine procedures for new birds entering the farm',
  'Regular health monitoring and veterinary inspections',
  'Proper waste management and disposal systems',
  'Clean water supply with regular testing',
  'Pest and rodent control programs',
];

const timeline = [
  { year: '2009', event: 'Farm established with 500 broilers' },
  { year: '2012', event: 'Expanded to include layer operations' },
  { year: '2015', event: 'Achieved USDA certification' },
  { year: '2018', event: 'Launched day-old chick supply program' },
  { year: '2021', event: 'Introduced free-range operations' },
  { year: '2024', event: 'Expanded to serve 500+ customers monthly' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="
                      relative h-64 
                      md:h-80 overflow-hidden 
                      bg-center bg-cover bg-scroll 
                      md:bg-fixed
                  "
        style={{ backgroundImage: `url(${GALLERY_IMAGES[0]})` }}
      >
        <div className="
                        absolute inset-0 
                        bg-gradient-to-r from-green-900/80 to-green-800/60 
                        flex items-center
                      "
        >
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">About Our Farm</h1>
            <p className="text-green-100 text-lg max-w-xl">Over 15 years of dedication to raising healthy, premium poultry with the highest standards of care.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{STORE_NAME} was founded in 2009 with a simple mission: to provide the freshest, healthiest poultry products to our community. What started as a small operation with just 500 broilers has grown into one of the region's most trusted poultry suppliers.</p>
              <p>Our founder, a third-generation farmer, combined traditional farming wisdom with modern agricultural science to create a farm that prioritizes both animal welfare and product quality. Every bird on our farm receives proper nutrition, clean water, and ample space to grow naturally.</p>
              <p>Today, we serve over 500 customers monthly, including families, restaurants, retailers, and fellow farmers. Our commitment to quality has never wavered, and every product carries the {STORE_NAME} guarantee of excellence.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY_IMAGES.map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden shadow-sm">
                <img src={img} alt={`Farm ${idx + 1}`} className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { num: '15+', label: 'Years Experience' },
            { num: '500+', label: 'Monthly Customers' },
            { num: '50K+', label: 'Birds Raised Yearly' },
            { num: '99%', label: 'Customer Satisfaction' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-green-100">
              <p className="text-3xl md:text-4xl font-bold text-green-700">{stat.num}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Certifications & Standards</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map(cert => (
              <div key={cert.title} className="bg-white rounded-xl p-6 shadow-sm border border-green-100 text-center hover:shadow-md transition-shadow">
                <cert.icon className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Biosecurity */}
        <div className="bg-green-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-8 h-8 text-green-600" />
            Biosecurity Practices
          </h2>
          <p className="text-gray-600 mb-6">We maintain strict biosecurity protocols to ensure the health of our flocks and the safety of our products.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {biosecurity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Our Journey</h2>
          <div className="max-w-2xl mx-auto">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{item.year}</div>
                  {idx < timeline.length - 1 && <div className="w-0.5 flex-1 bg-green-200 mt-2" />}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm flex-1 border-l-4 border-green-500">
                  <p className="text-gray-800 font-medium">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
