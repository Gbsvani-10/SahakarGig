import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Badge } from '../../components/common/Badge';
import { 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  Home, 
  HeartHandshake, 
  Car, 
  Sprout, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const CustomerServices: React.FC = () => {
  const { services } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plumber': return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'Electrician': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Carpenter': return <Hammer className="w-5 h-5 text-amber-700" />;
      case 'Painter': return <Paintbrush className="w-5 h-5 text-indigo-600" />;
      case 'Cleaner': return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'Domestic Helper': return <Home className="w-5 h-5 text-rose-600" />;
      case 'Caregiver': return <HeartHandshake className="w-5 h-5 text-teal-600" />;
      case 'Driver': return <Car className="w-5 h-5 text-slate-700" />;
      case 'Gardener': return <Sprout className="w-5 h-5 text-green-600" />;
      case 'Technician': return <Cpu className="w-5 h-5 text-cyan-600" />;
      default: return <Wrench className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleStartBooking = (serviceId: string) => {
    navigate(`/customer/booking-flow?serviceId=${serviceId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Find & Book Cooperative Services</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Certified artisans from Labour Cooperative Societies with transparent standardized rates
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => navigate('/customer/emergency')}
          leftIcon={<AlertTriangle className="w-4 h-4" />}
        >
          Need Urgent Help? 15-Min Emergency
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by trade (e.g., plumbing, electrical, AC)..."
          className="w-full md:w-96"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <Card key={srv.id} className="flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {getCategoryIcon(srv.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{srv.name}</h3>
                    <span className="text-[11px] font-semibold text-emerald-700">{srv.category}</span>
                  </div>
                </div>
                {srv.emergencyAvailable && (
                  <Badge variant="amber" size="sm">15-Min Emergency</Badge>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {srv.description}
              </p>

              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Includes:</p>
                {srv.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Fixed Cooperative Rate</span>
                <span className="text-base font-black text-gray-900">{srv.priceRange}</span>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStartBooking(srv.id)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
