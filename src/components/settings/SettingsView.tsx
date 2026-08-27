import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Save,
  Globe,
  Sliders,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { RestaurantBranch } from '../../types.ts';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    branches,
    activeBranch,
    setActiveBranch,
    testResults,
    runTestSuite,
    refreshAllData,
  } = useApp();

  const [name, setName] = useState<string>(profile?.name || 'Savory Prime Grill & Bar');
  const [tagline, setTagline] = useState<string>(profile?.tagline || 'Artisanal Steaks, Wood-Fired Pizza & Craft Cocktails');
  const [currency, setCurrency] = useState<string>(profile?.currency || 'USD');
  const [currencySymbol, setCurrencySymbol] = useState<string>(profile?.currencySymbol || '$');
  const [taxRate, setTaxRate] = useState<number>((profile?.taxRate || 0.0825) * 100);
  const [serviceChargeRate, setServiceChargeRate] = useState<number>((profile?.serviceChargeRate || 0.1) * 100);
  const [receiptFooter, setReceiptFooter] = useState<string>(profile?.receiptFooter || 'Thank you for dining with us!\nGratuity shared with culinary & service team.');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [newBranchCode, setNewBranchCode] = useState<string>('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      name,
      tagline,
      currency,
      currencySymbol,
      taxRate: taxRate / 100,
      serviceChargeRate: serviceChargeRate / 100,
      receiptFooter,
    });
    setIsSaving(false);
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    await runTestSuite();
    setIsRunningTests(false);
  };

  return (
    <div id="settings-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-5 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Restaurant Profile & Multi-Branch SaaS Settings
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Configure business profile, branches, financial tax rates, thermal receipts, and system integrity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Profile & Financial Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand & Financial Settings Form */}
          <form
            onSubmit={handleSaveProfile}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Restaurant Business Configuration</span>
              </h3>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Restaurant Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Currency Symbol & Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-16 px-3 py-2 text-xs text-center font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Sales Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Dine-In Service Charge (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={serviceChargeRate}
                  onChange={(e) => setServiceChargeRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Thermal Receipt Footer Text
              </label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </form>

          {/* Automated System Tests Runner */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Automated Quality & Regression Test Suite</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Tests API endpoints, calculation models, inventory depletion & RBAC
                </p>
              </div>

              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunningTests ? 'Executing Tests...' : 'Run Automated Tests'}</span>
              </button>
            </div>

            {testResults ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {testResults.passed} of {testResults.total} Test Suites Passed Green
                    </span>
                  </div>
                  <span className="font-mono text-zinc-400">
                    Duration: {testResults.durationMs}ms • {new Date(testResults.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {testResults.tests.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {t.status === 'passed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{t.durationMs}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-zinc-400">
                Click "Run Automated Tests" to verify system integrity across POS, KDS, and backend database.
              </div>
            )}
          </div>
        </div>

        {/* Right col: Multi-Branch Locations */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Multi-Location Branches</span>
              </h3>
              <span className="text-xs text-zinc-400">{branches.length} locations</span>
            </div>

            <div className="space-y-3">
              {branches.map((b) => {
                const isActive = activeBranch.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => setActiveBranch(b)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>{b.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700">
                          {b.code}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-black">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">{b.address}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Tel: {b.phone}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
