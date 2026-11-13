import React, { useState } from 'react';
import { 
  ShieldCheck, Calculator, TrendingUp, Users, Truck, DollarSign, 
  Settings, Globe, Lock, Bell, CheckCircle, Plus, Trash2, ArrowUpRight, 
  ArrowDownRight, CreditCard, Building, Smartphone, FileText, ChevronRight
} from 'lucide-react';
console.log("🐄 KamadhenuERP: App.jsx component loaded successfully!");
export default function App() {
  // Navigation & View States: 'landing', 'app'
  const [currentView, setCurrentView] = useState('landing');
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Farm Registration State
  const [farmInfo, setFarmInfo] = useState({
    name: 'Shree Gopal Gokulam Dairy',
    owner: 'Harsh Vardhan Mishra',
    location: 'Raipur, Chhattisgarh',
    subscription: 'GROWTH (₹499/mo)',
    expiry: '2027-11-13'
  });

  // Admin Bank & Razorpay Payment Integration State
  const [bankDetails, setBankDetails] = useState({
    accountName: 'Shree Gopal Gokulam Dairy',
    accountNumber: '3290102004589',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India, DDU Nagar Branch',
    upiId: 'gopaldairy@sbi',
    razorpayKeyId: 'rzp_live_993848291029',
    autoRenew: true
  });
  const [savedMsg, setSavedMsg] = useState(false);

  // Herd State
  const [cows, setCows] = useState([
    { id: 1, tag: 'GW-101', name: 'Ganga', breed: 'Gir', purchasePrice: 50000, dailyYield: 10, cost: 50087, revenue: 6500, breakeven: false },
    { id: 2, tag: 'GW-102', name: 'Yamuna', breed: 'Sahiwal', purchasePrice: 48000, dailyYield: 12, cost: 48075, revenue: 7800, breakeven: false },
    { id: 3, tag: 'GW-103', name: 'Nandini', breed: 'Tharparkar', purchasePrice: 55000, dailyYield: 9, cost: 55060, revenue: 5800, breakeven: false }
  ]);

  // Inventory & Feed State
  const [inventory, setInventory] = useState([
    { id: 'f1', name: 'Green Fodder (Super Napier/Maize)', category: 'Green Fodder', stock: 1800, unit: 'kg', rate: 3.0 },
    { id: 'f2', name: 'Dry Fodder (Bhusa)', category: 'Dry Fodder', stock: 2400, unit: 'kg', rate: 2.0 },
    { id: 'f3', name: 'Cattle Feed Concentrate', category: 'Concentrate', stock: 650, unit: 'kg', rate: 28.0 },
    { id: 'f4', name: 'Mineral Mixture & Salt', category: 'Supplement', stock: 85, unit: 'kg', rate: 100.0 }
  ]);

  // HRMS Employees State
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ramesh Yadav', role: 'Senior Milker & Supervisor', salary: 14000, freeMilkLiters: 1.5, status: 'Active' },
    { id: 2, name: 'Suresh Kumar', role: 'Fodder & Field Hand', salary: 11000, freeMilkLiters: 1.0, status: 'Active' }
  ]);

  // Fleet Logistics State
  const [fleet, setFleet] = useState([
    { id: 1, vehicle: 'Tata Ace Milk Van', reg: 'CG 04 HC 5892', type: 'Owned', monthlyCost: 4500 },
    { id: 2, vehicle: 'Mahindra Tractor (Fodder Transport)', reg: 'CG 04 M 1102', type: 'Owned', monthlyCost: 3200 }
  ]);

  // Loans State
  const [loans, setLoans] = useState([
    { id: 1, lender: 'Gramin Bank / SBI Agri Loan', principal: 250000, rate: 8.5, emi: 7750, nextDue: '2026-12-05' }
  ]);

  // Security / 2FA Balance Sheet State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // Translations Dictionary
  const t = {
    en: {
      brand: "KamadhenuERP",
      tagline: "India's Smartest Dairy Farm ERP & Financial Operating System",
      loginApp: "Open App Dashboard",
      home: "Home",
      features: "Features",
      pricing: "Pricing",
      dashboard: "Dashboard",
      herd: "Herd & Valuation",
      ops: "Daily Ops & Feed",
      hrms: "HRMS & Payroll",
      fleet: "Fleet & Logistics",
      loans: "Loans & CapEx",
      finance: "2FA Balance Sheet",
      payments: "Billing & Bank Setup",
      save: "Save Changes",
      success: "Successfully updated payment and bank routing details!"
    },
    hi: {
      brand: "कामधेनु ERP",
      tagline: "भारत का सबसे उन्नत डेयरी फार्म और वित्तीय प्रबंधन सॉफ्टवेयर",
      loginApp: "ऐप डैशबोर्ड खोलें",
      home: "होम",
      features: "विशेषताएं",
      pricing: "मूल्य निर्धारण",
      dashboard: "डैशबोर्ड",
      herd: "पशु और मूल्यांकन",
      ops: "दैनिक कार्य और चारा",
      hrms: "कर्मचारी और वेतन",
      fleet: "वाहन और रसद",
      loans: "ऋण और निवेश",
      finance: "सुरक्षित बैलेंस शीट",
      payments: "बिलिंग और बैंक सेटिंग्स",
      save: "बदलाव सहेजें",
      success: "भुगतान और बैंक विवरण सफलतापूर्वक अपडेट हो गए!"
    }
  };

  const currentT = t[lang];

  // ==========================================
  // VIEW 1: PUBLIC MARKETING LANDING PAGE
  // ==========================================
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        {/* Top Navbar */}
        <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl font-bold text-xl">🐄</div>
            <span className="text-2xl font-black tracking-tight text-emerald-400">{currentT.brand}</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
              {lang === 'en' ? '🇮🇳 हिन्दी' : '🌐 English'}
            </button>
            <button onClick={() => setCurrentView('app')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg transition">
              {currentT.loginApp} 🚀
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            🌾 Built for Commercial Dairy Farms & Value-Added Processing
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-6 tracking-tight leading-tight text-white">
            {currentT.tagline}
          </h1>
          <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
            Track individual cow break-even milestones, auto-deduct feed inventory in exact <code className="text-emerald-400 font-mono">kg/gm</code>, manage HRMS payroll, and secure your balance sheet with 2-way authentication.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setCurrentView('app')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-emerald-900/40 transition">
              Launch Live App & Dashboard 🚀
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white">Dynamic Cow Valuation</h3>
              <p className="text-slate-400 mt-2 text-sm">Real-time cost ledgers combining purchase price, precise feed consumption, and medical costs vs. milk revenue.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-white">Auto-Deduct Inventory</h3>
              <p className="text-slate-400 mt-2 text-sm">Log daily green fodder, dry fodder, and mineral mix in kg or grams. Stock updates instantly with zero duplicate entry.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-white">2FA Encrypted Balance Sheet</h3>
              <p className="text-slate-400 mt-2 text-sm">Protect farm finances with two-way authentication. Consolidated P&L covers milk, HRMS salaries, fleet, tools, and loans.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FULL ERP DASHBOARD & ADMIN SUITE
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🐄</span>
          <div>
            <h1 className="font-black text-lg text-emerald-400 tracking-wide">{currentT.brand}</h1>
            <p className="text-xs text-slate-400">{farmInfo.name} • {farmInfo.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-700">
            {lang === 'en' ? '🇮🇳 हिन्दी' : '🌐 English'}
          </button>
          <button onClick={() => setCurrentView('landing')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
            ← Website Home
          </button>
        </div>
      </header>

      {/* Navigation Sub-Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 flex space-x-2 overflow-x-auto py-2">
        {[
          { id: 'dashboard', label: currentT.dashboard, icon: TrendingUp },
          { id: 'herd', label: currentT.herd, icon: ShieldCheck },
          { id: 'ops', label: currentT.ops, icon: Calculator },
          { id: 'hrms', label: currentT.hrms, icon: Users },
          { id: 'fleet', label: currentT.fleet, icon: Truck },
          { id: 'loans', label: currentT.loans, icon: DollarSign },
          { id: 'finance', label: currentT.finance, icon: Lock },
          { id: 'payments', label: currentT.payments, icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">

        {/* TAB 1: DASHBOARD & ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Active Milking Herd</p>
                <h3 className="text-3xl font-black text-white mt-2">{cows.length} Animals</h3>
                <p className="text-xs text-emerald-400 mt-1">Avg 10.3 L/cow daily yield</p>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Monthly Milk Revenue</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-2">₹1,95,400</h3>
                <p className="text-xs text-emerald-400 mt-1">↑ 14.2% vs last month</p>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Monthly Feed Expenses</p>
                <h3 className="text-3xl font-black text-rose-400 mt-2">₹78,250</h3>
                <p className="text-xs text-slate-400 mt-1">Auto-deducted from inventory</p>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase">Estimated Net Profit</p>
                <h3 className="text-3xl font-black text-sky-400 mt-2">₹82,400</h3>
                <p className="text-xs text-sky-400 mt-1">After payroll, fleet & loan EMIs</p>
              </div>
            </div>

            {/* MoM and YoY Analytics Card */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">📈 MoM & YoY Herd Profit Comparison</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-bold">Month-over-Month (Oct vs Nov)</span>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-slate-300">Revenue Growth</span>
                    <span className="text-emerald-400 font-bold">+18.5%</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-300">Feed Cost Variation</span>
                    <span className="text-rose-400 font-bold">+4.1% (Fodder Rate Spike)</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-bold">Year-over-Year (2025 vs 2026)</span>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-slate-300">Herd Scale</span>
                    <span className="text-emerald-400 font-bold">3 Cows → 30 Cows</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-300">Net Annual ROI</span>
                    <span className="text-sky-400 font-bold">34.2% Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERD & DYNAMIC VALUATION */}
        {activeTab === 'herd' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Livestock Herd & Valuation Ledger</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {cows.map(cow => (
                <div key={cow.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">{cow.tag}</span>
                      <h3 className="text-xl font-bold text-white mt-2">{cow.name}</h3>
                      <p className="text-xs text-slate-400">Breed: {cow.breed}</p>
                    </div>
                    <span className="text-2xl">🐄</span>
                  </div>
                  <div className="mt-6 space-y-2 text-sm border-t border-slate-700/60 pt-4">
                    <div className="flex justify-between"><span className="text-slate-400">Purchase Price:</span><span className="font-bold text-white">₹{cow.purchasePrice}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Current Total Cost:</span><span className="font-bold text-rose-400">₹{cow.cost}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Milk Revenue:</span><span className="font-bold text-emerald-400">₹{cow.revenue}</span></div>
                    <div className="flex justify-between pt-2 border-t border-slate-700/60"><span className="text-slate-400 font-bold">Net Position:</span><span className="font-black text-sky-400">₹{cow.revenue - cow.cost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DAILY OPS & FEED INVENTORY */}
        {activeTab === 'ops' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Daily Operations & Auto-Deduct Inventory</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                <h3 className="font-bold text-white">📦 Feed Inventory Stock</h3>
                {inventory.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <p className="font-bold text-sm text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">Rate: ₹{item.rate}/{item.unit}</p>
                    </div>
                    <span className="font-black text-emerald-400 text-lg">{item.stock} {item.unit}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                <h3 className="font-bold text-white">🥛 Multi-Channel Milk Yield & Realization</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>Raw Milk Sold (5L @ ₹52)</span>
                    <span className="font-bold text-emerald-400">₹260</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>Curd / Dahi (2L @ ₹75)</span>
                    <span className="font-bold text-emerald-400">₹150</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>Value-Add Products (3L @ ₹90)</span>
                    <span className="font-bold text-emerald-400">₹270</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HRMS & PAYROLL */}
        {activeTab === 'hrms' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Farm Staff & Payroll (HRMS)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {employees.map(emp => (
                <div key={emp.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                  <h3 className="text-lg font-bold text-white">{emp.name}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{emp.role}</p>
                  <div className="mt-4 space-y-2 text-sm border-t border-slate-700 pt-3">
                    <div className="flex justify-between"><span className="text-slate-400">Base Salary:</span><span className="font-bold text-white">₹{emp.salary}/mo</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Daily Free Milk Perk:</span><span className="font-bold text-sky-400">{emp.freeMilkLiters} L/day</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FLEET & LOGISTICS */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Fleet & Logistics Expenses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {fleet.map(f => (
                <div key={f.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{f.vehicle}</h3>
                    <p className="text-xs text-slate-400">Reg: {f.reg}</p>
                  </div>
                  <span className="font-black text-rose-400 text-lg">₹{f.monthlyCost}/mo</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: LOANS & CAPEX */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Farm CapEx & Loan Repayment Simulator</h2>
            <div className="grid md:grid-cols-1 gap-6">
              {loans.map(loan => (
                <div key={loan.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{loan.lender}</h3>
                    <p className="text-xs text-slate-400">Principal: ₹{loan.principal} • Interest: {loan.rate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-rose-400 text-lg">EMI: ₹{loan.emi}/mo</p>
                    <p className="text-xs text-slate-400">Next Due: {loan.nextDue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: 2FA BALANCE SHEET */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-xl mx-auto text-center space-y-4">
              {!isUnlocked ? (
                <>
                  <div className="text-4xl">🔐</div>
                  <h3 className="text-xl font-bold text-white">Secure Balance Sheet 2FA Lock</h3>
                  <p className="text-sm text-slate-400">Enter Admin PIN to view consolidated P&L (Demo PIN: <code className="text-emerald-400 font-bold">1234</code>)</p>
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
                      onClick={() => { if (pinInput === '1234') setIsUnlocked(true); else alert('Incorrect PIN'); }}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold px-6 py-2.5 rounded-xl text-white mt-2"
                    >
                      Verify & Unlock Balance Sheet
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-left space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">🔒 Consolidated Farm P&L Statement</h3>
                    <span className="bg-emerald-950 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">2FA Verified</span>
                  </div>
                  <div className="space-y-2 text-sm border-t border-slate-700 pt-4">
                    <div className="flex justify-between"><span className="text-slate-400">Total Milk & Product Revenue:</span><span className="font-bold text-emerald-400">₹1,95,400</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Feed & Supplement Consumed:</span><span className="font-bold text-rose-400">− ₹78,250</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">HRMS Salaries & Perks:</span><span className="font-bold text-rose-400">− ₹25,000</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Fleet & Logistics:</span><span className="font-bold text-rose-400">− ₹7,700</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Loan EMI Interest:</span><span className="font-bold text-rose-400">− ₹2,050</span></div>
                    <div className="flex justify-between pt-3 border-t border-slate-700 text-base font-black"><span className="text-white">True Net Monthly Profit:</span><span className="text-sky-400">₹82,400</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: BILLING & BANK DETAILS (RAZORPAY PAYMENT MODULE) */}
        {activeTab === 'payments' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <CreditCard className="text-emerald-400" />
                  <span>Razorpay & Bank Payout Setup</span>
                </h3>
                <span className="bg-sky-950 text-sky-400 text-xs px-3 py-1 rounded-full font-bold">Active Tier: Growth</span>
              </div>

              {savedMsg && (
                <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-sm font-medium">
                  {currentT.success}
                </div>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-slate-400 block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Razorpay API Live Key ID</label>
                  <input
                    type="text"
                    value={bankDetails.razorpayKeyId}
                    onChange={(e) => setBankDetails({...bankDetails, razorpayKeyId: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 3000); }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-white shadow-lg transition"
              >
                {currentT.save} 💾
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
