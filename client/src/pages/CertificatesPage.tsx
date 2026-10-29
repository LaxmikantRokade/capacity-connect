import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Search,
  ExternalLink,
  QrCode,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { api } from '../services/api';
import { Certificate } from '../types';
import { useAuth } from '../context/AuthContext';

export const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      try {
        const list = await api.getMyCertificates();
        setCertificates(list);
        if (list.length > 0) {
          setSelectedCert(list[0]);
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, [user]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.getCertificateByNumber(verifyInput.trim());
      if (res) {
        setVerifyResult({
          valid: true,
          certificate: res,
        });
      } else {
        setVerifyResult({
          valid: false,
          error: 'Certificate ID not found in the national registry.',
        });
      }
    } catch (err) {
      setVerifyResult({
        valid: false,
        error: 'Unable to verify certificate ID.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Header (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Accredited Credentials</span>
            <span>•</span>
            <span>Tamper-Evident SHA-256 Hashes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Digital Certificates & Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cryptographically verifiable credentials issued upon passing accredited competency assessments.
          </p>
        </div>

        {selectedCert && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition dark:bg-white dark:text-slate-900"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
        )}
      </div>

      {/* Public Verification Bar (Hidden when printing) */}
      <div className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Public Credential Verification Engine
        </h3>
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            placeholder="Enter Certificate Identifier (e.g. CC-2026-DPI-00891)..."
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>

        {verifyResult && (
          <div
            className={`mt-4 rounded-xl border p-4 text-xs ${
              verifyResult.valid
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            {verifyResult.valid ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  AUTHENTICATED RECORD CONFIRMED IN NATIONAL REPOSITORY
                </div>
                <p>
                  Issued to: <strong>{verifyResult.certificate.userName}</strong> for{' '}
                  <strong>{verifyResult.certificate.courseTitle}</strong> on{' '}
                  {new Date(verifyResult.certificate.issueDate).toLocaleDateString()}.
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  SHA-256 Hash: {verifyResult.certificate.verificationHash}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                {verifyResult.error}
              </div>
            )}
          </div>
        )}
      </div>

      {certificates.length === 0 ? (
        <div className="no-print rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700 bg-white dark:bg-navy-900">
          <Award className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No certificates earned yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Certificates are issued automatically upon achieving 100% course progress and passing the certification assessment with distinction.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Certificate Selector tabs (no-print) */}
          {certificates.length > 1 && (
            <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
              {certificates.map((cert) => (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    selectedCert?.id === cert.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-navy-900 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cert.certificateNumber}
                </button>
              ))}
            </div>
          )}

          {/* High-Fidelity Printable Certificate Frame */}
          {selectedCert && (
            <div className="certificate-frame relative mx-auto w-full max-w-4xl rounded-3xl border-8 border-double border-brand-700 bg-gradient-to-br from-amber-50/20 via-white to-blue-50/20 p-8 sm:p-14 shadow-2xl dark:bg-navy-900 text-center space-y-6">
              {/* Prototype / Demo Label */}
              <div className="inline-block rounded-md bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-300/60 mb-2">
                Prototype Generated Credential • Smart India Hackathon 2026
              </div>

              {/* Seal & Header */}
              <div className="space-y-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg ring-4 ring-brand-100">
                  <Award className="h-9 w-9 text-amber-300" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-800 dark:text-brand-300">
                  Government of India • Ministry of Electronics & IT (MeitY)
                </h2>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                  Certificate of Competency Mastery
                </h3>
                <p className="text-xs text-slate-500 italic">
                  Digital Capacity Building & Learning Management Portal (SIH26075)
                </p>
              </div>

              {/* Recipient */}
              <div className="space-y-1 pt-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  This is proudly presented to
                </p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-brand-700 dark:text-brand-400 font-serif">
                  {selectedCert.userName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  for successfully completing all accredited curriculum requirements and final assessment for
                </p>
                <h5 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-1">
                  "{selectedCert.courseTitle}"
                </h5>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {selectedCert.grade}
                </p>
              </div>

              {/* Footer Details */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 items-end text-left text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Certificate ID</p>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedCert.certificateNumber}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">Date of Issuance</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(selectedCert.issueDate).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-300">
                    <QrCode className="h-10 w-10 text-slate-800 dark:text-slate-200" />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">Scan to Verify Authenticity</p>
                </div>

                <div className="text-right">
                  <div className="inline-block border-b-2 border-slate-400 pb-1 font-serif italic text-slate-800 dark:text-slate-200 font-bold text-sm">
                    Vikram Malhotra
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Principal Platform Administrator
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Capacity Connect Accreditation Cell
                  </p>
                </div>
              </div>

              {/* Cryptographic hash footer */}
              <div className="pt-2 text-[9px] font-mono text-slate-400 truncate">
                SHA-256 Digest: {selectedCert.verificationHash}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
