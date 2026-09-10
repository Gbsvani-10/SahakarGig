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
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

export const ServicesCatalogPage: React.FC = () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Cooperative Household Services Catalog
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 max-w-2xl">
          Browse verified trade services backed by cooperative transparent pricing, background check verification, and 30-day workmanship assurance.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by trade (e.g., plumbing, electrical, cleaning)..."
          className="w-full md:w-96"
        />

        {/* Category Pills */}
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

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <Card key={srv.id} className="flex flex-col justify-between hover:border-emerald-400 transition-colors">
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

              {/* Inclusions */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Service Inclusions:</p>
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
                <span className="text-[10px] text-gray-700 uppercase font-semibold block">Cooperative Rate</span>
                <span className="text-sm font-black text-gray-900">{srv.priceRange}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/customer/services`)}
                >
                  Book Service
                </Button>
                {srv.emergencyAvailable && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => navigate('/customer/emergency')}
                    title="Emergency Immediate Booking"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
