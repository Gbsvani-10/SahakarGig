import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Wrench, Award, Plus, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

export const WorkerSkills: React.FC = () => {
  const { workers, addToast } = useApp();
  const currentWorker = workers[0];
  const [skillsList, setSkillsList] = useState(currentWorker.skills);
  const [showModal, setShowModal] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Plumbing');
  const [experienceYears, setExperienceYears] = useState('3');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const newSkill = {
      id: `sk-${Date.now()}`,
      name: skillName,
      category: skillCategory,
      level: skillLevel,
      yearsExperience: parseInt(experienceYears, 10),
      verifiedByCooperative: false
    };
    setSkillsList([...skillsList, newSkill]);
    setShowModal(false);
    addToast('info', 'Skill Added for Verification', 'Your skill has been queued for cooperative trade test verification.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Trade Skills & Wage Cards</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Skills validated through cooperative practical trade examinations and NSQF frameworks
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Trade Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsList.map((sk) => (
          <Card key={sk.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{sk.name}</h3>
                    <span className="text-[11px] text-teal-700 font-semibold">{sk.category}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sk.level === 'Expert' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {sk.level}
                </span>
              </div>

              <div className="pt-2 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-bold text-gray-900">{sk.yearsExperience} Years</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {sk.verifiedByCooperative ? 'Coop Certified ✓' : 'Pending Audit'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400">Cooperative Wage Tier</span>
              <span className="font-black text-gray-900">Grade A (₹450/hr)</span>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add Skill for Cooperative Evaluation"
          subtitle="Submitted to NCCT District Assessor"
          maxWidth="md"
        >
          <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Skill / Competency Name
              </label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Copper Pipe Brazing & Welding"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Masonry">Masonry</option>
                  <option value="HVAC">HVAC & Cooling</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Proficiency Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white"
                >
                  <option value="Beginner">Beginner (1-2 yrs)</option>
                  <option value="Intermediate">Intermediate (3-5 yrs)</option>
                  <option value="Expert">Expert (5+ yrs)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Years of Practical Experience
              </label>
              <input
                type="number"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit for Evaluation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
