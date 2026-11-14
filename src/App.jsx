import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Calculator, TrendingUp, Users, Truck, DollarSign, 
  Lock, CheckCircle, Plus, Trash2, CreditCard, Building, X, RotateCcw
} from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'register' | 'app'
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initial Default States (Used when resetting or first-time load)
  const defaultFarm = {
    name: 'Shree Gopal Gokulam Dairy',
    owner: 'Harsh Vardhan Mishra',
    phone: '+91 98261 XXXXX',
    location: 'Raipur, Chhattisgarh',
    subscription: 'GROWTH (₹499/mo)',
    pin: '1234'
  };

  const defaultCows = [
    { id: 1, tag: 'GW-101', name: 'Ganga', breed: 'Gir', purchasePrice: 50000, dailyYield: 10, totalCost: 52500, totalRevenue: 15600 },
    { id: 2, tag: 'GW-102', name: 'Yamuna', breed: 'Sahiwal', purchasePrice: 48000, dailyYield: 12, totalCost: 50200, totalRevenue: 18720 }
  ];

  const defaultInventory = [
    { id: 'f1', name: 'Green Fodder (Super Napier/Maize)', stock: 1800, unit: 'kg', rate: 3.0 },
    { id: 'f2', name: 'Dry Fodder (Bhusa)', stock: 2400, unit: 'kg', rate: 2.0 },
    { id: 'f3', name: 'Cattle Feed Concentrate', stock: 650, unit: 'kg', rate: 28.0 },
    { id: 'f4', name: 'Mineral Mixture & Salt', stock: 85, unit: 'kg', rate: 100.0 }
  ];

  const defaultEmployees = [
    { id: 1, name: 'Ramesh Yadav', role: 'Senior Milker & Supervisor', salary: 14000, freeMilkLiters: 1.5 },
    { id: 2, name: 'Suresh Kumar', role: 'Fodder & Field Hand', salary: 11000, freeMilkLiters: 1.0 }
  ];

  const defaultFleet = [
    { id: 1, vehicle: 'Tata Ace Milk Van', reg: 'CG 04 HC 5892', monthlyCost: 4500 }
  ];

  const defaultLoans = [
    { id: 1, lender: 'SBI Agri / Mudra Loan', principal: 250000, rate: 8.5, emi: 7750 }
  ];

  // Persistent States via localStorage
  const [farmInfo, setFarmInfo] = useState(() => JSON.parse(localStorage.getItem('k_farm')) || defaultFarm);
  const [cows, setCows] = useState(() => JSON.parse(localStorage.getItem('k_cows')) || defaultCows);
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('k_inv')) || defaultInventory);
  const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem('k_emp')) || defaultEmployees);
  const [fleet, setFleet] = useState(() => JSON.parse(localStorage.getItem('k_fleet')) || defaultFleet);
  const [loans, setLoans] = useState(() => JSON.parse(localStorage.getItem('k_loans')) || defaultLoans);
  const [milkLogs, setMilkLogs] = useState(() => JSON.parse(localStorage.getItem('k_milk')) || [
    { id: 1, date: '2026-11-14', rawLiters: 12, rawRate: 55, dahiLiters: 6, dahiRate: 80, makhanKg: 1.5, makhanRate: 550 }
  ]);

  const [bankDetails, setBankDetails] = useState(() => JSON.parse(localStorage.getItem('k_bank')) || {
    accountName: farmInfo.name,
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    razorpayKeyId: ''
  });

  // Sync to localStorage automatically
  useEffect(() => { localStorage.setItem('k_farm', JSON.stringify(farmInfo)); }, [farmInfo]);
  useEffect(() => { localStorage.setItem('k_cows', JSON.stringify(cows)); }, [cows]);
  useEffect(() => { localStorage.setItem('k_inv', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('k_emp', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('k_fleet', JSON.stringify(fleet)); }, [fleet]);
  useEffect(() => { localStorage.setItem('k_loans', JSON.stringify(loans)); }, [loans]);
  useEffect(() => { localStorage.setItem('k_milk', JSON.stringify(milkLogs)); }, [milkLogs]);
  useEffect(() => { localStorage.setItem('k_bank', JSON.stringify(bankDetails)); }, [bankDetails]);

  // Form States for Adding Items
  const [regForm, setRegForm] = useState({ name: '', owner: '', phone: '', location: '', subscription: 'GROWTH (₹499/mo)', pin: '1234' });
  const [newCow, setNewCow] = useState({ tag: '', name: '', breed: 'Gir', purchasePrice: '', dailyYield: '' });
  const [feedUsage, setFeedUsage] = useState({ itemId: 'f1', qtyUsed: '' });
  const [stockAdd, setStockAdd] = useState({ itemId: 'f1', qtyAdded: '' });
  const [newMilk, setNewMilk] = useState({ rawLiters: '', rawRate: 55, dahiLiters: '', dahiRate: 80, makhanKg: '', makhanRate: 550 });
  const [newEmp, setNewEmp] = useState({ name: '', role: '', salary: '', freeMilkLiters: '' });
  const [newFleet, setNewFleet] = useState({ vehicle: '', reg: '', monthlyCost: '' });
  const [newLoan, setNewLoan] = useState({ lender: '', principal: '', rate: '', emi: '' });

  // Security & Toast States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Dynamic Financial Calculations
  const totalDailyYield = cows.reduce((sum, c) => sum + Number(c.dailyYield || 0), 0);
  const totalMilkRevenueLogged = milkLogs.reduce((sum, log) => {
    return sum + (log.rawLiters * log.rawRate) + (log.dahiLiters * log.dahiRate) + (log.makhanKg * log.makhanRate);
  }, 0);
  const projectedMonthlyRevenue = totalMilkRevenueLogged > 0 ? totalMilkRevenueLogged * 30 : totalDailyYield * 60 * 30;
  const totalMonthlySalaries = employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
  const totalMonthlyFleet = fleet.reduce((sum, f) => sum + Number(f.monthlyCost || 0), 0);
  const totalMonthlyEMI = loans.reduce((sum, l) => sum + Number(l.emi || 0), 0);
  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.stock * i.rate), 0);
  const estimatedNetProfit = projectedMonthlyRevenue - (totalMonthlySalaries + totalMonthlyFleet + totalMonthlyEMI + (totalInventoryValue * 0.35));

  // Handlers
  const handleFarmRegister = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.owner) return;
    setFarmInfo(regForm);
    setBankDetails({ ...bankDetails, accountName: regForm.name });
    setCurrentView('app');
    showToast(`🎉 Welcome ${regForm.name}! Your farm ERP is now live.`);
  };

  const handleResetDemo = () => {
    if (window.confirm("Reset all data to fresh demo defaults?")) {
      localStorage.clear();
      setFarmInfo(defaultFarm);
      setCows(defaultCows);
      setInventory(defaultInventory);
      setEmployees(defaultEmployees);
      setFleet(defaultFleet);
      setLoans(defaultLoans);
      showToast("Demo data restored!");
    }
  };

  const handleAddCow = (e) => {
    e.preventDefault();
    if (!newCow.tag || !newCow.name) return;
    const price = Number(newCow.purchasePrice) || 45000;
    const yieldVal = Number(newCow.dailyYield) || 10;
    setCows([...cows, {
      id: Date.now(),
      tag: newCow.tag.toUpperCase(),
      name: newCow.name,
      breed: newCow.breed,
      purchasePrice: price,
      dailyYield: yieldVal,
      totalCost: price,
      totalRevenue: 0
    }]);
    setNewCow({ tag: '', name: '', breed: 'Gir', purchasePrice: '', dailyYield: '' });
    showToast(`🐄 ${newCow.name} (${newCow.tag}) added to herd!`);
  };

  const handleDeductFeed = (e) => {
    e.preventDefault();
    const qty = Number(feedUsage.qtyUsed);
    if (!qty || qty <= 0) return;
    setInventory(inventory.map(item => 
      item.id === feedUsage.itemId ? { ...item, stock: Math.max(0, item.stock - qty) } : item
    ));
    setFeedUsage({ ...feedUsage, qtyUsed: '' });
    showToast(`📉 Deducted ${qty} kg from feed inventory!`);
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    const qty = Number(stockAdd.qtyAdded);
    if (!qty || qty <= 0) return;
    setInventory(inventory.map(item => 
      item.id === stockAdd.itemId ? { ...item, stock: item.stock + qty } : item
    ));
    setStockAdd({ ...stockAdd, qtyAdded: '' });
    showToast(`📦 Added ${qty} kg new stock to inventory!`);
  };

  const handleLogMilk = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      rawLiters: Number(newMilk.rawLiters) || 0,
      rawRate: Number(newMilk.rawRate) || 55,
      dahiLiters: Number(newMilk.dahiLiters) || 0,
      dahiRate: Number(newMilk.dahiRate) || 80,
      makhanKg: Number(newMilk.makhanKg) || 0,
      makhanRate: Number(newMilk.makhanRate) || 550
    };
    setMilkLogs([entry, ...milkLogs]);
    setNewMilk({ rawLiters: '', rawRate: 55, dahiLiters: '', dahiRate: 80, makhanKg: '', makhanRate: 550 });
    showToast("🥛 Daily milk & dairy products production logged!");
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.salary) return;
    setEmployees([...employees, {
      id: Date.now(),
      name: newEmp.name,
      role: newEmp.role || 'Farm Staff',
      salary: Number(newEmp.salary),
      freeMilkLiters: Number(newEmp.freeMilkLiters) || 0
    }]);
    setNewEmp({ name: '', role: '', salary: '', freeMilkLiters: '' });
    showToast(`👷 Staff ${newEmp.name} added to HRMS!`);
  };

  const handleAddFleet = (e) => {
    e.preventDefault();
    if (!newFleet.vehicle) return;
    setFleet([...fleet, {
      id: Date.now(),
      vehicle: newFleet.vehicle,
      reg: newFleet.reg || 'N/A',
      monthlyCost: Number(newFleet.monthlyCost) || 0
    }]);
    setNewFleet({ vehicle: '', reg: '', monthlyCost: '' });
    showToast("🚚 Vehicle added to fleet!");
  };

  const handleAddLoan = (e) => {
    e.preventDefault();
    if (!newLoan.lender) return;
    setLoans([...loans, {
      id: Date.now(),
      lender: newLoan.lender,
      principal: Number(newLoan.principal) || 0,
      rate: Number(newLoan.rate) || 8.5,
      emi: Number(newLoan.emi) || 0
    }]);
    setNewLoan({ lender: '', principal: '', rate: '', emi: '' });
    showToast("🏦 Loan entry recorded!");
  };

  // Translations
  const t = {
    en: {
      brand: "KamadhenuERP",
      tagline: "India's Smartest Dairy Farm ERP & Financial Operating System",
      enrollBtn: "Enroll Your Dairy Farm",
      demoBtn: "Try Live Demo Dashboard",
      dashboard: "Dashboard",
      herd: "Herd & Cows",
      ops: "Daily Ops & Feed",
      hrms: "HRMS & Staff",
      fleet: "Fleet",
      loans: "Loans",
      finance: "2FA P&L Sheet",
      payments: "Bank & Billing"
    },
    hi: {
      brand: "कामधेनु ERP",
      tagline: "भारत का सबसे उन्नत डेयरी फार्म और वित्तीय प्रबंधन सॉफ्टवेयर",
      enrollBtn: "अपना डेयरी फार्म रजिस्टर करें",
      demoBtn: "लाइव डेमो डैशबोर्ड देखें",
      dashboard: "डैशबोर्ड",
      herd: "पशु प्रबंधन",
      ops: "दैनिक दूध और चारा",
      hrms: "कर्मचारी व वेतन",
      fleet: "वाहन",
      loans: "ऋण / EMI",
      finance: "बैलेंस शीट",
      payments: "बैंक सेटअप"
    }
  }[lang];

  // ==========================================
  // VIEW 1: LANDING PAGE (FOR ADS & CUSTOMERS)
  // ==========================================
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl font-bold text-xl">🐄</div>
            <span className="text-2xl font-black tracking-tight text-emerald-400">{t.brand}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
              {lang === 'en' ? '🇮🇳 हिन्दी' : '🌐 English'}
            </button>
            <button onClick={() => setCurrentView('register')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg transition">
              {t.enrollBtn}
            </button>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            🌾 Complete SaaS ERP for Commercial Dairy Farms
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight leading-tight text-white">
            {t.tagline}
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto">
            Enroll your farm in 60 seconds. Track cow-wise ROI, value-added milk products (Dahi, Makhan, Ghee), auto-deduct feed inventory, manage staff payroll, and lock your P&L with 2FA.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setCurrentView('register')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-emerald-900/40 transition">
              🚀 {t.enrollBtn} (Free Trial)
            </button>
            <button onClick={() => setCurrentView('app')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-2xl text-lg border border-slate-700 transition">
              📊 {t.demoBtn}
            </button>
          </div>
        </section>

        {/* Pricing Cards for Ad Conversions */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-800">
          <h2 className="text-3xl font-black text-center mb-10">Simple, Transparent SaaS Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'STARTER', price: '₹249/mo', cows: 'Up to 15 Cows', desc: 'Ideal for small & emerging dairy farms.' },
              { name: 'GROWTH', price: '₹499/mo', cows: 'Up to 50 Cows', desc: 'Includes Value-Add Processing, HRMS & 2FA P&L.', popular: true },
              { name: 'ENTERPRISE', price: '₹999/mo', cows: 'Unlimited Herd', desc: 'Multi-branch farms, fleet tracking & priority support.' }
            ].map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border ${plan.popular ? 'bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-950/30' : 'bg-slate-800/50 border-slate-700'}`}>
                {plan.popular && <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                <h3 className="text-xl font-black mt-3">{plan.name}</h3>
                <p className="text-3xl font-black text-emerald-400 mt-2">{plan.price}</p>
                <p className="text-sm font-bold text-slate-300 mt-2">{plan.cows}</p>
                <p className="text-xs text-slate-400 mt-2">{plan.desc}</p>
                <button 
                  onClick={() => { setRegForm({...regForm, subscription: `${plan.name} (${plan.price})`}); setCurrentView('register'); }}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition"
                >
                  Select {plan.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FARM ENROLLMENT / ONBOARDING FORM
  // ==========================================
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-800 border border-slate-700 max-w-lg w-full rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-emerald-400">🐄 Farm Registration</h2>
              <p className="text-xs text-slate-400 mt-1">Setup your custom dairy ERP workspace instantly</p>
            </div>
            <button onClick={() => setCurrentView('landing')} className="p-2 bg-slate-700 rounded-xl text-slate-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleFarmRegister} className="space-y-4 text-sm">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Dairy Farm Name *</label>
              <input required type="text" placeholder="e.g., Kamadhenu Gir Gaushala" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Owner / Director Full Name *</label>
              <input required type="text" placeholder="e.g., Rajesh Sharma" value={regForm.owner} onChange={e => setRegForm({...regForm, owner: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Mobile / WhatsApp *</label>
                <input required type="tel" placeholder="+91 98XXXXXXXX" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">City & State *</label>
                <input required type="text" placeholder="e.g., Raipur, CG" value={regForm.location} onChange={e => setRegForm({...regForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Subscription Plan</label>
                <select value={regForm.subscription} onChange={e => setRegForm({...regForm, subscription: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
                  <option>STARTER (₹249/mo)</option>
                  <option>GROWTH (₹499/mo)</option>
                  <option>ENTERPRISE (₹999/mo)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Set 4-Digit 2FA PIN *</label>
                <input required maxLength={4} type="text" placeholder="1234" value={regForm.pin} onChange={e => setRegForm({...regForm, pin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-center tracking-widest" />
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-base shadow-lg mt-4 transition">
              Create Farm Workspace & Launch 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: FULL INTERACTIVE ERP APPLICATION
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm z-50 animate-bounce">
          {toast}
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🐄</span>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-lg text-emerald-400">{farmInfo.name}</h1>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">{farmInfo.subscription}</span>
            </div>
            <p className="text-xs text-slate-400">Owner: {farmInfo.owner} • {farmInfo.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-700">
            {lang === 'en' ? '🇮🇳 हिन्दी' : '🌐 English'}
          </button>
          <button onClick={() => setCurrentView('register')} className="text-xs bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-white font-bold">
            + New Farm
          </button>
          <button onClick={handleResetDemo} title="Reset Demo Data" className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400">
            <RotateCcw size={16} />
          </button>
          <button onClick={() => setCurrentView('landing')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
            Home
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 flex space-x-2 overflow-x-auto py-2.5">
        {[
          { id: 'dashboard', label: t.dashboard, icon: TrendingUp },
          { id: 'herd', label: `${t.herd} (${cows.length})`, icon: ShieldCheck },
          { id: 'ops', label: t.ops, icon: Calculator },
          { id: 'hrms', label: `${t.hrms} (${employees.length})`, icon: Users },
          { id: 'fleet', label: t.fleet, icon: Truck },
          { id: 'loans', label: t.loans, icon: DollarSign },
          { id: 'finance', label: t.finance, icon: Lock },
          { id: 'payments', label: t.payments, icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">

        {/* 1. LIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Active Milking Herd</p>
                <h3 className="text-3xl font-black text-white mt-2">{cows.length} Cows</h3>
                <p className="text-xs text-emerald-400 mt-1">Total Daily Yield: {totalDailyYield} Liters</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Est. Monthly Revenue</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-2">₹{projectedMonthlyRevenue.toLocaleString()}</h3>
                <p className="text-xs text-slate-400 mt-1">Based on milk, dahi & makhan logs</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Fixed Monthly Overheads</p>
                <h3 className="text-3xl font-black text-rose-400 mt-2">₹{(totalMonthlySalaries + totalMonthlyFleet + totalMonthlyEMI).toLocaleString()}</h3>
                <p className="text-xs text-slate-400 mt-1">Salaries + Fleet + Loan EMIs</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Projected Net Profit</p>
                <h3 className="text-3xl font-black text-sky-400 mt-2">₹{Math.round(estimatedNetProfit).toLocaleString()}</h3>
                <p className="text-xs text-sky-400 mt-1">Live calculated margin</p>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3">⚡ Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setActiveTab('herd')} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl text-xs font-bold">+ Register New Cow</button>
                <button onClick={() => setActiveTab('ops')} className="bg-sky-600 hover:bg-sky-500 px-4 py-2.5 rounded-xl text-xs font-bold">+ Log Today's Milk & Dahi</button>
                <button onClick={() => setActiveTab('ops')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2.5 rounded-xl text-xs font-bold">- Deduct Daily Fodder</button>
                <button onClick={() => setActiveTab('hrms')} className="bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-xl text-xs font-bold">+ Add Farm Employee</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. HERD MANAGEMENT (ADD / DELETE COWS) */}
        {activeTab === 'herd' && (
          <div className="space-y-6">
            {/* Add Cow Form */}
            <form onSubmit={handleAddCow} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Ear Tag ID *</label>
                <input required type="text" placeholder="GW-104" value={newCow.tag} onChange={e => setNewCow({...newCow, tag: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Cow Name *</label>
                <input required type="text" placeholder="Kamadhenu" value={newCow.name} onChange={e => setNewCow({...newCow, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Breed</label>
                <select value={newCow.breed} onChange={e => setNewCow({...newCow, breed: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
                  <option>Gir</option>
                  <option>Sahiwal</option>
                  <option>Tharparkar</option>
                  <option>HF Cross</option>
                  <option>Murrah Buffalo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Purchase Cost (₹)</label>
                <input required type="number" placeholder="55000" value={newCow.purchasePrice} onChange={e => setNewCow({...newCow, purchasePrice: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Daily Yield (L)</label>
                <input required type="number" placeholder="12" value={newCow.dailyYield} onChange={e => setNewCow({...newCow, dailyYield: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center justify-center space-x-1">
                <Plus size={16} /><span>Add Cow</span>
              </button>
            </form>

            {/* Cows Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {cows.map(cow => (
                <div key={cow.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 relative">
                  <button onClick={() => setCows(cows.filter(c => c.id !== cow.id))} className="absolute top-5 right-5 text-slate-500 hover:text-rose-400">
                    <Trash2 size={16} />
                  </button>
                  <span className="bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">{cow.tag}</span>
                  <h3 className="text-xl font-bold text-white mt-2">{cow.name}</h3>
                  <p className="text-xs text-slate-400">Breed: {cow.breed} • Yield: {cow.dailyYield} L/day</p>
                  <div className="mt-4 space-y-2 text-sm border-t border-slate-700 pt-3">
                    <div className="flex justify-between"><span className="text-slate-400">Purchase Price:</span><span className="font-bold text-white">₹{cow.purchasePrice.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Est. Monthly Milk Value:</span><span className="font-bold text-emerald-400">₹{(cow.dailyYield * 60 * 30).toLocaleString()}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. DAILY OPS: MILK PROCESSING & AUTO-DEDUCT FEED */}
        {activeTab === 'ops' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Feed Inventory & Auto Deduct */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-5">
              <h3 className="font-bold text-lg text-white">📦 Feed Stock & Auto-Deduction</h3>
              
              {/* Deduct Form */}
              <form onSubmit={handleDeductFeed} className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3">
                <p className="text-xs font-bold text-rose-400 uppercase">Log Daily Feed Consumption (Deduct Stock)</p>
                <div className="flex gap-2">
                  <select value={feedUsage.itemId} onChange={e => setFeedUsage({...feedUsage, itemId: e.target.value})} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                  <input required type="number" placeholder="Qty (kg)" value={feedUsage.qtyUsed} onChange={e => setFeedUsage({...feedUsage, qtyUsed: e.target.value})} className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                  <button type="submit" className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl text-xs font-bold">Deduct</button>
                </div>
              </form>

              {/* Add Stock Form */}
              <form onSubmit={handleAddStock} className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3">
                <p className="text-xs font-bold text-emerald-400 uppercase">Purchase / Harvest New Fodder (Add Stock)</p>
                <div className="flex gap-2">
                  <select value={stockAdd.itemId} onChange={e => setStockAdd({...stockAdd, itemId: e.target.value})} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                  <input required type="number" placeholder="Qty (kg)" value={stockAdd.qtyAdded} onChange={e => setStockAdd({...stockAdd, qtyAdded: e.target.value})} className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold">Add</button>
                </div>
              </form>

              {/* Current Stock List */}
              <div className="space-y-2">
                {inventory.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <p className="font-bold text-sm text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">Rate: ₹{item.rate}/{item.unit}</p>
                    </div>
                    <span className="font-black text-emerald-400 text-base">{item.stock} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Value-Added Dairy Products Log (Dahi, Makhan, Raw Milk) */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-5">
              <h3 className="font-bold text-lg text-white">🥛 Daily Milk & Value-Add Production</h3>
              <form onSubmit={handleLogMilk} className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Raw Milk Sold (Liters)</label>
                    <input type="number" placeholder="10" value={newMilk.rawLiters} onChange={e => setNewMilk({...newMilk, rawLiters: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Curd / Dahi Sold (Kg/L)</label>
                    <input type="number" placeholder="8" value={newMilk.dahiLiters} onChange={e => setNewMilk({...newMilk, dahiLiters: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Makhan / Ghee Sold (Kg)</label>
                    <input type="number" step="0.1" placeholder="1.5" value={newMilk.makhanKg} onChange={e => setNewMilk({...newMilk, makhanKg: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-xl font-bold text-white">Save Production Log</button>
                  </div>
                </div>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {milkLogs.map(log => {
                  const dayTotal = (log.rawLiters * log.rawRate) + (log.dahiLiters * log.dahiRate) + (log.makhanKg * log.makhanRate);
                  return (
                    <div key={log.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{log.date}</p>
                        <p className="text-slate-400">Milk: {log.rawLiters}L • Dahi: {log.dahiLiters}L • Makhan: {log.makhanKg}kg</p>
                      </div>
                      <span className="font-black text-emerald-400 text-sm">₹{dayTotal.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. HRMS & STAFF ENROLLMENT */}
        {activeTab === 'hrms' && (
          <div className="space-y-6">
            <form onSubmit={handleAddEmployee} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Employee Name *</label>
                <input required type="text" placeholder="Mohan Lal" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Role / Designation</label>
                <input type="text" placeholder="Milker / Delivery" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Salary (₹) *</label>
                <input required type="number" placeholder="12000" value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Daily Free Milk (L)</label>
                <input type="number" step="0.5" placeholder="1.0" value={newEmp.freeMilkLiters} onChange={e => setNewEmp({...newEmp, freeMilkLiters: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center justify-center space-x-1">
                <Plus size={16} /><span>Add Staff</span>
              </button>
            </form>

            <div className="grid md:grid-cols-3 gap-6">
              {employees.map(emp => (
                <div key={emp.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 relative">
                  <button onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))} className="absolute top-5 right-5 text-slate-500 hover:text-rose-400">
                    <Trash2 size={16} />
                  </button>
                  <h3 className="text-lg font-bold text-white">{emp.name}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{emp.role}</p>
                  <div className="mt-4 space-y-2 text-sm border-t border-slate-700 pt-3">
                    <div className="flex justify-between"><span className="text-slate-400">Monthly Salary:</span><span className="font-bold text-white">₹{emp.salary.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Free Milk Perk:</span><span className="font-bold text-sky-400">{emp.freeMilkLiters} L/day</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FLEET MANAGEMENT */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <form onSubmit={handleAddFleet} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Vehicle Name *</label>
                <input required type="text" placeholder="Bolero Pickup" value={newFleet.vehicle} onChange={e => setNewFleet({...newFleet, vehicle: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Registration No.</label>
                <input type="text" placeholder="CG 04 AB 1234" value={newFleet.reg} onChange={e => setNewFleet({...newFleet, reg: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Fuel/Maint (₹)</label>
                <input required type="number" placeholder="5000" value={newFleet.monthlyCost} onChange={e => setNewFleet({...newFleet, monthlyCost: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-sm">+ Add Vehicle</button>
            </form>

            <div className="grid md:grid-cols-2 gap-6">
              {fleet.map(f => (
                <div key={f.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{f.vehicle}</h3>
                    <p className="text-xs text-slate-400">Reg: {f.reg}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-black text-rose-400 text-lg">₹{f.monthlyCost.toLocaleString()}/mo</span>
                    <button onClick={() => setFleet(fleet.filter(item => item.id !== f.id))} className="text-slate-500 hover:text-rose-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. LOANS & CAPEX */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            <form onSubmit={handleAddLoan} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Bank / Lender *</label>
                <input required type="text" placeholder="SBI / NABARD" value={newLoan.lender} onChange={e => setNewLoan({...newLoan, lender: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Loan Amount (₹)</label>
                <input required type="number" placeholder="300000" value={newLoan.principal} onChange={e => setNewLoan({...newLoan, principal: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Interest (%)</label>
                <input type="number" step="0.1" placeholder="8.5" value={newLoan.rate} onChange={e => setNewLoan({...newLoan, rate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly EMI (₹) *</label>
                <input required type="number" placeholder="8500" value={newLoan.emi} onChange={e => setNewLoan({...newLoan, emi: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-sm">+ Add Loan</button>
            </form>

            <div className="space-y-4">
              {loans.map(loan => (
                <div key={loan.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{loan.lender}</h3>
                    <p className="text-xs text-slate-400">Principal: ₹{loan.principal.toLocaleString()} • Rate: {loan.rate}%</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-black text-rose-400 text-lg">EMI: ₹{loan.emi.toLocaleString()}/mo</span>
                    <button onClick={() => setLoans(loans.filter(l => l.id !== loan.id))} className="text-slate-500 hover:text-rose-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. 2FA BALANCE SHEET */}
        {activeTab === 'finance' && (
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-xl mx-auto text-center space-y-4">
            {!isUnlocked ? (
              <>
                <div className="text-4xl">🔐</div>
                <h3 className="text-xl font-bold text-white">2FA Protected Consolidated P&L</h3>
                <p className="text-sm text-slate-400">Enter Farm Owner PIN (Your set PIN: <code className="text-emerald-400 font-bold">{farmInfo.pin}</code>)</p>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="bg-slate-900 border border-slate-700 text-center text-2xl tracking-widest py-2 rounded-xl w-36 mx-auto text-white"
                />
                <div>
                  <button
                    onClick={() => { if (pinInput === farmInfo.pin) setIsUnlocked(true); else showToast('❌ Incorrect PIN!'); }}
                    className="bg-emerald-600 hover:bg-emerald-500 font-bold px-6 py-2.5 rounded-xl text-white mt-2"
                  >
                    Unlock Balance Sheet
                  </button>
                </div>
              </>
            ) : (
              <div className="text-left space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">🔒 Live Monthly P&L Statement</h3>
                  <button onClick={() => { setIsUnlocked(false); setPinInput(''); }} className="text-xs bg-slate-700 px-3 py-1 rounded-lg">Lock Again</button>
                </div>
                <div className="space-y-2.5 text-sm border-t border-slate-700 pt-4">
                  <div className="flex justify-between"><span className="text-slate-400">Projected Monthly Dairy Revenue:</span><span className="font-bold text-emerald-400">₹{projectedMonthlyRevenue.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">HRMS Staff Salaries:</span><span className="font-bold text-rose-400">− ₹{totalMonthlySalaries.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Fleet & Transport Fuel:</span><span className="font-bold text-rose-400">− ₹{totalMonthlyFleet.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Loan EMIs:</span><span className="font-bold text-rose-400">− ₹{totalMonthlyEMI.toLocaleString()}</span></div>
                  <div className="flex justify-between pt-3 border-t border-slate-700 text-base font-black"><span className="text-white">Net Operating Cashflow:</span><span className="text-sky-400">₹{Math.round(estimatedNetProfit).toLocaleString()}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. BANK & RAZORPAY BILLING SETUP */}
        {activeTab === 'payments' && (
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-2xl mx-auto space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <CreditCard className="text-emerald-400" />
              <span>Customer Collection & Payout Bank Setup</span>
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="text-slate-400 block mb-1">Account Holder / Farm Name</label>
                <input type="text" value={bankDetails.accountName} onChange={e => setBankDetails({...bankDetails, accountName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Bank Account Number</label>
                  <input type="text" placeholder="Enter Account No." value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">IFSC Code</label>
                  <input type="text" placeholder="e.g. SBIN0001234" value={bankDetails.ifscCode} onChange={e => setBankDetails({...bankDetails, ifscCode: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Merchant UPI ID (For Milk Bills)</label>
                  <input type="text" placeholder="yourfarm@upi" value={bankDetails.upiId} onChange={e => setBankDetails({...bankDetails, upiId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Razorpay Key ID</label>
                  <input type="text" placeholder="rzp_live_..." value={bankDetails.razorpayKeyId} onChange={e => setBankDetails({...bankDetails, razorpayKeyId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono" />
                </div>
              </div>
              <button onClick={() => showToast("💾 Bank & Payment Gateway details saved!")} className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-white">
                Save Payment Settings
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
