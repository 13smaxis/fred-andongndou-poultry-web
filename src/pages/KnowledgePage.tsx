
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, ChevronDown, ChevronUp, Search, Calendar, Thermometer, Syringe, Utensils, Home, Bug, Egg } from 'lucide-react';

const guides = [
  {
    id: 1,
    icon: Home,
    title: 'How to Raise Broilers Successfully',
    category: 'Broiler Management',
    summary: 'A complete guide to raising broilers from day-old chicks to market weight.',
    content: `**Getting Started:**\n\nBefore your chicks arrive, prepare a clean, disinfected brooding area. Ensure the temperature is 95°F (35°C) for the first week, then reduce by 5°F each week.\n\n**Week 1-2 (Starter Phase):**\n- Feed broiler starter crumble (23% protein)\n- Provide clean water with electrolytes\n- Maintain brooding temperature\n- Monitor for pasty butt and treat immediately\n- Ensure 24 hours of light for first 3 days\n\n**Week 3-4 (Grower Phase):**\n- Switch to broiler grower pellets (21% protein)\n- Reduce temperature to 75-80°F\n- Ensure proper ventilation\n- Monitor feed conversion ratio\n\n**Week 5-6 (Finisher Phase):**\n- Switch to finisher feed (19% protein)\n- Birds should reach 2-3kg by week 6\n- Prepare for market or processing\n- Restrict feed 8-12 hours before processing`
  },
  {
    id: 2,
    icon: Utensils,
    title: 'Feeding Schedules for All Stages',
    category: 'Nutrition',
    summary: 'Optimal feeding schedules and nutrition requirements for broilers and layers.',
    content: `**Broiler Feeding Schedule:**\n\n- Day 1-14: Starter feed (23% protein) — 25g/bird/day increasing to 60g\n- Day 15-28: Grower feed (21% protein) — 60g increasing to 120g\n- Day 29-42: Finisher feed (19% protein) — 120g increasing to 180g\n\n**Layer Feeding Schedule:**\n\n- Week 1-6: Chick starter (20% protein)\n- Week 7-18: Grower feed (16% protein)\n- Week 19+: Layer feed (17% protein, 3.5% calcium)\n\n**Key Tips:**\n- Always provide fresh, clean water\n- Feed should be available at all times (ad libitum)\n- Add grit for layers to aid digestion\n- Supplement with calcium (oyster shell) during peak laying\n- Monitor body weight weekly to adjust feed amounts`
  },
  {
    id: 3,
    icon: Bug,
    title: 'Disease Prevention Guide',
    category: 'Health',
    summary: 'Common poultry diseases and how to prevent them in your flock.',
    content: `**Common Diseases:**\n\n1. **Newcastle Disease** — Respiratory signs, nervous symptoms. Prevent with vaccination at day 7 and day 21.\n\n2. **Gumboro (IBD)** — Affects immune system. Vaccinate at day 14.\n\n3. **Coccidiosis** — Bloody droppings, lethargy. Use medicated starter feed or anticoccidial drugs.\n\n4. **Fowl Pox** — Skin lesions, scabs. Vaccinate at 6-8 weeks.\n\n5. **Chronic Respiratory Disease (CRD)** — Sneezing, nasal discharge. Maintain good ventilation.\n\n**Prevention Tips:**\n- Maintain strict biosecurity\n- Follow vaccination schedules\n- Keep housing clean and dry\n- Quarantine new birds for 2 weeks\n- Provide balanced nutrition\n- Monitor flock daily for signs of illness`
  },
  {
    id: 4,
    icon: Syringe,
    title: 'Vaccination Calendar',
    category: 'Health',
    summary: 'Complete vaccination schedule for broilers and layers from day 1 to maturity.',
    content: `**Broiler Vaccination Schedule:**\n\n- Day 1: Marek's Disease (at hatchery)\n- Day 7: Newcastle Disease (B1 strain) — eye drop\n- Day 14: Gumboro (IBD) — drinking water\n- Day 21: Newcastle Disease (LaSota) — drinking water\n\n**Layer Vaccination Schedule:**\n\n- Day 1: Marek's Disease (at hatchery)\n- Day 7: Newcastle Disease (B1)\n- Day 14: Gumboro (IBD)\n- Day 21: Newcastle Disease (LaSota)\n- Week 6-8: Fowl Pox — wing web\n- Week 8-10: Newcastle Disease (booster)\n- Week 16: Newcastle Disease (killed vaccine)\n\n**Important Notes:**\n- Use clean, chlorine-free water for water vaccines\n- Vaccinate in the morning when birds are active\n- Store vaccines properly (2-8°C)\n- Never mix different vaccines\n- Record all vaccinations with dates and batch numbers`
  },
  {
    id: 5,
    icon: Thermometer,
    title: 'Brooding Temperature Guide',
    category: 'Chick Rearing',
    summary: 'Proper temperature management for day-old chicks through the brooding period.',
    content: `**Temperature Schedule:**\n\n- Week 1: 95°F (35°C)\n- Week 2: 90°F (32°C)\n- Week 3: 85°F (29°C)\n- Week 4: 80°F (27°C)\n- Week 5+: Room temperature (70-75°F)\n\n**Signs of Temperature Problems:**\n\n- **Too Hot:** Chicks spread out, panting, wings drooping\n- **Too Cold:** Chicks huddling together, chirping loudly\n- **Just Right:** Chicks evenly distributed, active, eating/drinking\n\n**Brooding Setup:**\n- Use infrared heat lamps (250W)\n- Place thermometer at chick level\n- Provide a temperature gradient (warm under lamp, cooler edges)\n- Use wood shavings or rice hulls as bedding (4-6 inches)\n- Ensure no drafts but adequate ventilation`
  },
  {
    id: 6,
    icon: Egg,
    title: 'Maximizing Egg Production',
    category: 'Layer Management',
    summary: 'Tips and strategies to achieve peak egg production from your laying hens.',
    content: `**Key Factors for High Production:**\n\n1. **Lighting:** Provide 16 hours of light daily. Use timers for consistency.\n\n2. **Nutrition:** Layer feed with 17% protein and 3.5% calcium. Supplement with oyster shell.\n\n3. **Water:** Clean, fresh water at all times. Hens drink 250ml/day.\n\n4. **Nesting Boxes:** 1 box per 4-5 hens. Keep clean with fresh bedding.\n\n5. **Stress Reduction:** Avoid sudden changes, loud noises, or overcrowding.\n\n**Expected Production:**\n- Peak laying: 90-95% at 25-30 weeks\n- Average: 280-320 eggs per hen per year\n- Egg size increases with age\n- Production declines after 72 weeks\n\n**Common Issues:**\n- Soft shells: Increase calcium\n- Reduced laying: Check lighting, nutrition, stress\n- Egg eating: Collect eggs frequently, darken nesting boxes`
  },
  {
    id: 7,
    icon: Home,
    title: 'Building a Poultry House',
    category: 'Infrastructure',
    summary: 'Design and construction guidelines for an efficient poultry house.',
    content: `**Design Principles:**\n\n- **Orientation:** East-West to minimize direct sunlight\n- **Ventilation:** Open-sided with curtains, or tunnel ventilation\n- **Floor Space:** 1 sq ft per broiler, 2 sq ft per layer\n- **Height:** 8-10 feet at center for good air circulation\n\n**Materials:**\n- Concrete floor (easy to clean and disinfect)\n- Steel or wooden frame\n- Corrugated roofing with insulation\n- Wire mesh for ventilation openings\n- Curtain material for weather protection\n\n**Essential Equipment:**\n- Feeders (1 per 25 birds)\n- Drinkers (1 per 50 birds)\n- Heat lamps for brooding\n- Lighting system\n- Fans for ventilation\n- Nesting boxes (for layers)\n\n**Biosecurity Features:**\n- Footbath at entrance\n- Perimeter fencing\n- Proper drainage system\n- Storage for feed and equipment`
  },
  {
    id: 8,
    icon: Calendar,
    title: 'Starting a Poultry Business',
    category: 'Business',
    summary: 'A step-by-step guide to starting your own profitable poultry farming business.',
    content: `**Step 1: Planning**\n- Decide on type: broilers, layers, or both\n- Create a business plan with financial projections\n- Research local regulations and permits\n\n**Step 2: Setup (Budget depends on your scale)**\n- Secure land (minimum 0.5 acres for 1,000 birds)\n- Build or rent poultry housing\n- Purchase equipment (feeders, drinkers, brooders)\n- Arrange feed supply\n\n**Step 3: Stock**\n- Source quality day-old chicks from certified hatcheries\n- Start with 500-1,000 birds\n- Follow proper brooding procedures\n\n**Step 4: Management**\n- Follow feeding and vaccination schedules\n- Keep detailed records\n- Monitor costs and revenue\n\n**Step 5: Marketing**\n- Build relationships with local buyers\n- Use WhatsApp for orders\n- Create a website (like this one!)\n- Offer delivery services\n\n**Expected Returns:**\n- Broilers: 20-30% profit margin per batch\n- Layers: Break-even at 6 months, profitable from month 7\n- ROI: 40-60% annually with good management`
  },
];

export default function KnowledgePage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(guides.map(g => g.category))];

  const filteredGuides = guides.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-green-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Poultry Care Guides</h1>
          <p className="text-green-200 max-w-xl mx-auto">Expert knowledge to help you raise healthy, productive poultry. From beginner basics to advanced management techniques.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border hover:bg-green-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div className="space-y-4">
          {filteredGuides.map(guide => (
            <div key={guide.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <guide.icon className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <span className="text-xs text-green-600 font-medium uppercase tracking-wider">{guide.category}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-0.5">{guide.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{guide.summary}</p>
                </div>
                {expandedId === guide.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                )}
              </button>
              {expandedId === guide.id && (
                <div className="px-5 pb-5 border-t">
                  <div className="pt-4 prose prose-sm max-w-none">
                    {guide.content.split('\n').map((line, idx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h4 key={idx} className="font-bold text-gray-900 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={idx} className="text-gray-700 ml-4 mb-1">{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <li key={idx} className="text-gray-700 ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
                      }
                      if (line.trim() === '') return <br key={idx} />;
                      return <p key={idx} className="text-gray-700 mb-2">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No guides found matching your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
