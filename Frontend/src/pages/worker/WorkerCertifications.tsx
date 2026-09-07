import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Award, Plus, CheckCircle2, FileText, Download } from 'lucide-react';

export const WorkerCertifications: React.FC = () => {
  const { workers, addToast } = useApp();
  const currentWorker = workers[0];

  const handleDownloadCert = (name: string) => {
    addToast('success', 'Certificate Downloaded', `Official NCCT digital badge for ${name} downloaded.`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Vocational Certifications & Badges</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Issued by NCCT Regional Institutes, NSDC Skill Councils, and State Technical Boards
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => addToast('info', 'Document Upload', 'Please submit your ITI or NCCT certificate copy for committee verification.')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Upload New Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentWorker.certifications.map((cert) => (
          <Card key={cert.id} className="p-6 space-y-4 border-l-4 border-l-teal-600">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                  <p className="text-xs text-gray-500">{cert.issuingOrganization}</p>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Verified ✓
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Issue Date</span>
                <p className="font-bold text-gray-900">{cert.issueDate}</p>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Valid Until</span>
                <p className="font-bold text-gray-900">{cert.expiryDate || 'Lifetime Credential'}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="font-mono text-[11px] text-gray-400">Badge ID: {cert.id}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadCert(cert.name)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Credential
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
