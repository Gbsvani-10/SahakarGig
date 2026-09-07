import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkerProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Award, 
  Wrench, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Calendar
} from 'lucide-react';

export const CustomerWorkers: React.FC = () => {
  const { workers } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  const categories = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'Caregiver', 'Technician'];

  const filteredWorkers = workers.filter((w) => {
    const matchesCategory = selectedCategory === 'All' || w.primaryCategory === selectedCategory;
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.primaryCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.cooperativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.serviceArea.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookWorker = (worker: WorkerProfile) => {
    setSelectedWorker(null);
    navigate(`/customer/booking-flow?workerId=${worker.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Verified Cooperative Artisans</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Directly certified by Labour Cooperative Societies under NCCT and NSDC
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by artisan name, trade, or locality..."
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

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} className="flex flex-col justify-between hover:border-emerald-400 transition-all p-5">
            <div className="space-y-3">
              {/* Header with Photo & Verification */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-700 text-white text-[10px] p-0.5 rounded-full" title="Verified Worker">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-gray-900 truncate">{worker.name}</h3>
                    <span className="text-emerald-700 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-800">{worker.primaryCategory}</p>
                  <p className="text-[11px] text-gray-700 truncate">{worker.experienceYears} yrs experience</p>
                </div>
              </div>

              {/* Society Affiliation */}
              <div className="p-2 bg-gray-50 rounded-lg text-[11px] text-gray-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{worker.cooperativeName}</span>
              </div>

              {/* Badges & Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{worker.rating}</span>
                  <span className="text-gray-400 font-normal">({worker.completedJobsCount} jobs)</span>
                </div>
                <div className="text-right text-gray-500">
                  📍 {worker.distanceKm} km away
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {worker.availabilityStatus}
                </span>
                <span className="font-black text-gray-900">{worker.priceRange}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWorker(worker)}
              >
                View Profile
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBookWorker(worker)}
              >
                Book Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Worker Profile Modal */}
      {selectedWorker && (
        <Modal
          isOpen={!!selectedWorker}
          onClose={() => setSelectedWorker(null)}
          title={selectedWorker.name}
          subtitle={`Verified Artisan • ${selectedWorker.cooperativeName}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Top Overview */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <img
                src={selectedWorker.avatarUrl}
                alt={selectedWorker.name}
                className="w-16 h-16 rounded-2xl object-cover border border-emerald-300 shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{selectedWorker.name}</h3>
                  <StatusBadge status="Verified" />
                </div>
                <p className="text-xs font-bold text-emerald-800">
                  {selectedWorker.primaryCategory} • {selectedWorker.experienceYears} Years Cooperative Tenure
                </p>
                <p className="text-xs text-gray-600">
                  📍 Service Areas: {selectedWorker.serviceArea}
                </p>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Verified Certifications</span>
              </h4>
              <div className="space-y-2">
                {selectedWorker.certifications.map((cert) => (
                  <div key={cert.id} className="p-2.5 rounded-lg border border-gray-200 bg-white text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{cert.name}</p>
                      <p className="text-[11px] text-gray-500">{cert.issuingOrganization} • Issued: {cert.issueDate}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Verified ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-700" />
                <span>Specialized Skills</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedWorker.skills.map((sk) => (
                  <div key={sk.id} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs">
                    <p className="font-bold text-gray-900">{sk.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">{sk.level} Level • {sk.yearsExperience} yrs</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Booking Actions */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block font-semibold">Standard Estimated Rate</span>
                <span className="text-lg font-black text-gray-900">{selectedWorker.priceRange}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedWorker.emergencyAvailable && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedWorker(null);
                      navigate('/customer/emergency');
                    }}
                  >
                    Request Emergency
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleBookWorker(selectedWorker)}
                >
                  Book Service Now
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
