import React, { useState, useEffect } from 'react';
import { translations, PLAN_LIMITS, INITIAL_FARMS } from './data/translations';
import Navbar from './components/Navbar';
import RegistrationModal from './modules/auth/RegistrationModal';
import BreedMarketplace from './modules/marketplace/BreedMarketplace';
import SuperAdminDashboard from './modules/admin/SuperAdminDashboard';
import FarmDashboard from './modules/erp/FarmDashboard';

export default function App() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light' | 'emerald'
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'register' | 'app' | 'marketplace' | 'superadmin'
  const [selectedPlanForReg, setSelectedPlanForReg] = useState('GROWTH');
  const [toast, setToast] = useState('');

  // Multi-Tenant Farms Database in localStorage
  const [farms, setFarms] = useState(() => {
    const saved = localStorage.getItem('kamadhenu_multi_farms_v2');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [activeFarmId, setActiveFarmId] = useState(() => {
    return localStorage.getItem('kamadhenu_active_farm_id') || INITIAL_FARMS[0].id;
  });

  useEffect(() => {
    localStorage.setItem('kamadhenu_multi_farms_v2', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem('kamadhenu_active_farm_id', activeFarmId);
  }, [activeFarmId]);

  const activeFarm = farms.find(f => f.id === activeFarmId) || farms[0];
  const t = translations[lang];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Dynamic Theme Classes
  const pageBg = theme === 'light'
    ? 'bg-slate-50 text-slate-900'
    : theme === 'emerald'
    ? 'bg-[#041f18] text-emerald-50'
    : 'bg-slate-900 text-slate-100';

  const cardClass = theme === 'light'
    ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
    : theme === 'emerald'
    ? 'bg-[#072e24] border-emerald-800/70 text-emerald-50'
    : 'bg-slate-800/90 border-slate-700 text-slate-100';

  const inputClass = theme === 'light'
    ? 'bg-slate-100 border-slate-300 text-slate-900'
    : theme === 'emerald'
    ? 'bg-[#031712] border-emerald-700 text-emerald-50'
    : 'bg-slate-900 border-slate-700 text-white';

  const handleFarmRegistered = (newFarm) => {
    setFarms([newFarm, ...farms]);
    setActiveFarmId(newFarm.id);
    setCurrentView('app');
    showToast(`🎉 ${newFarm.name} enrolled on ${newFarm.plan} Plan!`);
  };

  const updateActiveFarmCows = (updatedCows) => {
    setFarms(farms.map(f => f.id === activeFarm.id ? { ...f, cows: updatedCows } : f));
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${pageBg}`}>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs z-50">
          {toast}
        </div>
      )}

      <Navbar
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeFarm={activeFarm}
      />

      {/* 1. LANDING & PRICING PAGE */}
      {currentView === 'landing' && (
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
          <section className="text-center max-w-4xl mx-auto space-y-6">
            <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              🐄 Multi-Farm Dairy SaaS + Public Breed Directory
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {t.tagline}
            </h1>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => { setSelectedPlanForReg('FREE'); setCurrentView('register'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl text-base shadow-xl transition"
              >
                🚀 {t.enrollBtn}
              </button>
              <button
                onClick={() => setCurrentView('marketplace')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-base shadow-xl transition"
              >
                🔍 {t.marketplaceBtn}
              </button>
              <button
                onClick={() => setCurrentView('app')}
                className={`border font-bold px-8 py-4 rounded-2xl text-base transition ${cardClass}`}
              >
                📊 {t.demoBtn}
              </button>
            </div>
          </section>

          {/* Subscription Plans & Feature Matrix */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black text-center">{t.pricingTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  key: 'FREE', title: t.freeTier, price: '₹0/mo',
                  features: ['Up to 3 Cows', 'Basic Herd Ledger', '❌ No HRMS Staff', '❌ No Marketplace Listing']
                },
                {
                  key: 'STARTER', title: t.starterTier, price: '₹249/mo',
                  features: ['Up to 15 Cows', 'HRMS Limit: 1–2 Staff', 'Public Breed Listing', 'Optional Price Hiding']
                },
                {
                  key: 'GROWTH', title: t.growthTier, price: '₹499/mo', popular: true,
                  features: ['Up to 50 Cows', 'Unlimited HRMS Staff', 'Dahi, Makhan & Ghee Log', '2FA Encrypted Balance Sheet']
                },
                {
                  key: 'ENTERPRISE', title: t.enterpriseTier, price: '₹999/mo',
                  features: ['Unlimited Cows & Farms', 'Unlimited Staff & Fleet', 'Top Marketplace Priority', 'Dedicated Razorpay Payouts']
                }
              ].map(plan => (
                <div key={plan.key} className={`p-7 rounded-3xl border flex flex-col justify-between ${plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/30' : ''} ${cardClass}`}>
                  <div>
                    {plan.popular && <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full">MOST POPULAR</span>}
                    <h3 className="text-lg font-black mt-3">{plan.title}</h3>
                    <p className="text-3xl font-black text-emerald-500 mt-2">{plan.price}</p>
                    <ul className="mt-5 space-y-2.5 text-xs opacity-85">
                      {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>
                  <button
                    onClick={() => { setSelectedPlanForReg(plan.key); setCurrentView('register'); }}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    Choose {plan.key}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 2. REGISTRATION + OTP + RAZORPAY */}
      {currentView === 'register' && (
        <RegistrationModal
          selectedPlan={selectedPlanForReg}
          onSuccess={handleFarmRegistered}
          onCancel={() => setCurrentView('landing')}
          cardClass={cardClass}
          inputClass={inputClass}
        />
      )}

      {/* 3. PUBLIC BREED & LOCATION MARKETPLACE */}
      {currentView === 'marketplace' && (
        <BreedMarketplace
          farms={farms}
          t={t}
          cardClass={cardClass}
          inputClass={inputClass}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {/* 4. SUPER ADMIN MULTI-TENANT CONSOLE */}
      {currentView === 'superadmin' && (
        <SuperAdminDashboard
          farms={farms}
          setFarms={setFarms}
          cardClass={cardClass}
          inputClass={inputClass}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {/* 5. TENANT FARM ERP WORKSPACE */}
      {currentView === 'app' && (
        <div>
          {/* Tenant Farm Switcher Bar for Demo / Pitching */}
          <div className="max-w-7xl mx-auto px-6 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="opacity-70 font-bold">Active Farm Workspace:</span>
              <select
                value={activeFarmId}
                onChange={e => setActiveFarmId(e.target.value)}
                className={`rounded-xl px-3 py-1.5 border font-bold ${inputClass}`}
              >
                {farms.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.plan})</option>
                ))}
              </select>
            </div>
          </div>

          <FarmDashboard
            activeFarm={activeFarm}
            updateFarmCows={updateActiveFarmCows}
            t={t}
            cardClass={cardClass}
            inputClass={inputClass}
            showToast={showToast}
            onUpgradePlan={() => { setSelectedPlanForReg('GROWTH'); setCurrentView('register'); }}
          />
        </div>
      )}
    </div>
  );
}
