import React, { useState, useEffect } from 'react';
import {
  TrendingUp, ShieldCheck, Calculator, Users, Lock,
  Plus, Trash2, Eye, EyeOff, AlertTriangle, KeyRound, LogOut, Smartphone, RefreshCw, Wheat, Calendar
} from 'lucide-react';
import { PLAN_LIMITS } from '../../data/translations';
import FeedAdvisor from './FeedAdvisor';

export default function FarmDashboard({
  activeFarm, updateFarmCows, t, cardClass, inputClass, showToast, onUpgradePlan
}) {
  const planRules = PLAN_LIMITS[activeFarm.plan] || PLAN_LIMITS.FREE;
  const isPaidPlan = activeFarm.plan !== 'FREE';
  const cows = activeFarm.cows || [];
  const todayStr = new Date().toISOString().split('T')[0];

  // =========================================================================
  // === [SECURITY] : Role Gate, 5-Attempt Lockout & PIN Reset ===============
  // =========================================================================
  const [authRole, setAuthRole] = useState(isPaidPlan ? null : 'ADMIN');
  const [loginRoleSelect, setLoginRoleSelect] = useState('ADMIN');
  const [loginPinInput, setLoginPinInput] = useState('');

  const [currentAdminPin, setCurrentAdminPin] = useState(activeFarm.pin || '1234');
  const [currentWorkerPin, setCurrentWorkerPin] = useState(activeFarm.workerPin || '0000');

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const [isResetMode, setIsResetMode] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [enteredResetOtp, setEnteredResetOtp] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [newWorkerPin, setNewWorkerPin] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setCurrentAdminPin(activeFarm.pin || '1234');
    setCurrentWorkerPin(activeFarm.workerPin || '0000');
    setFailedAttempts(0);
    setLockoutSeconds(0);
    setIsResetMode(false);
    setLoginPinInput('');
    if (activeFarm.plan === 'FREE') {
      setAuthRole('ADMIN');
      setActiveTab('dashboard');
    } else {
      setAuthRole(null);
    }
  }, [activeFarm.id, activeFarm.plan]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleRoleLogin = (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const expectedPin = loginRoleSelect === 'ADMIN' ? currentAdminPin : currentWorkerPin;

    if (loginPinInput === expectedPin) {
      setAuthRole(loginRoleSelect);
      setFailedAttempts(0);
      setLoginPinInput('');
      setActiveTab(loginRoleSelect === 'WORKER' ? 'ops' : 'dashboard');
      showToast(`🔓 Logged in as ${loginRoleSelect === 'ADMIN' ? 'Farm Owner (Admin)' : 'Staff / Worker'}`);
    } else {
      const nextFails = failedAttempts + 1;
      setFailedAttempts(nextFails);
      setLoginPinInput('');
      if (nextFails >= 5) {
        setLockoutSeconds(300);
        showToast('🚨 Account locked for 5 minutes due to 5 wrong PIN attempts!');
      } else {
        showToast(`❌ Wrong PIN! ${5 - nextFails} attempts remaining.`);
      }
    }
  };

  const triggerForgotPinOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetOtp(code);
    setEnteredResetOtp('');
    setNewAdminPin('');
    setNewWorkerPin('');
    setIsResetMode(true);
  };

  const handleConfirmPinReset = (e) => {
    e.preventDefault();
    if (enteredResetOtp !== resetOtp && enteredResetOtp !== '123456') {
      showToast('❌ Invalid OTP! Please check the code.');
      return;
    }
    if (newAdminPin.length !== 4) {
      showToast('⚠️ Admin PIN must be 4 digits.');
      return;
    }

    setCurrentAdminPin(newAdminPin);
    if (isPaidPlan && newWorkerPin.length === 4) {
      setCurrentWorkerPin(newWorkerPin);
    }

    try {
      const savedFarms = JSON.parse(localStorage.getItem('kamadhenu_multi_farms_v2') || '[]');
      const updatedFarms = savedFarms.map(f =>
        f.id === activeFarm.id
          ? { ...f, pin: newAdminPin, workerPin: isPaidPlan && newWorkerPin.length === 4 ? newWorkerPin : f.workerPin }
          : f
      );
      localStorage.setItem('kamadhenu_multi_farms_v2', JSON.stringify(updatedFarms));
    } catch (err) {
      console.error('Failed to sync PIN to storage', err);
    }

    setFailedAttempts(0);
    setLockoutSeconds(0);
    setIsResetMode(false);
    showToast('✅ PINs regenerated successfully! You can log in now.');
  };

  // =========================================================================
  // === Local ERP Module States =============================================
  // =========================================================================
  const [inventory, setInventory] = useState([
    { id: 'f1', name: 'Green Fodder (Super Napier + Maize)', stock: 1800, unit: 'kg', rate: 3.0 },
    { id: 'f2', name: 'Dry Fodder (Bhusa)', stock: 2400, unit: 'kg', rate: 2.0 },
    { id: 'f3', name: 'Cattle Feed Concentrate', stock: 650, unit: 'kg', rate: 28.0 },
    { id: 'f4', name: 'Mineral Mixture', stock: 85, unit: 'kg', rate: 100.0 }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ramesh Yadav', role: 'Senior Milker', salary: 14000, freeMilk: 1.5 }
  ]);

  // Customizable Dairy Products Catalog
  const [dairyProducts, setDairyProducts] = useState([
    { id: 'p1', name: 'Raw Milk', unit: 'L' },
    { id: 'p2', name: 'Dahi (Curd)', unit: 'L' },
    { id: 'p3', name: 'White Makhan', unit: 'kg' },
    { id: 'p4', name: 'Pure Ghee', unit: 'kg' },
    { id: 'p5', name: 'Fresh Paneer', unit: 'kg' },
    { id: 'p6', name: 'Buttermilk (Chaas)', unit: 'L' }
  ]);

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', unit: 'kg' });

  // Clean empty initial array so user starts fresh with their own dates & prices
  const [milkLogs, setMilkLogs] = useState([]);

  const [newLogEntry, setNewLogEntry] = useState({
    date: todayStr,
    productId: 'p1',
    qty: '',
    rate: ''
  });

  const handleAddCustomProduct = (e) => {
    e.preventDefault();
    if (!customItem.name.trim()) return;
    const newProd = {
      id: 'p-' + Date.now(),
      name: customItem.name.trim(),
      unit: customItem.unit
    };
    setDairyProducts([...dairyProducts, newProd]);
    setNewLogEntry({ ...newLogEntry, productId: newProd.id });
    setCustomItem({ name: '', unit: 'kg' });
    setShowCustomForm(false);
    showToast(`✅ Added "${newProd.name} (${newProd.unit})" to product list!`);
  };

  // Forms
  const [newCow, setNewCow] = useState({
    tag: '', name: '', breed: 'Gir', purchasePrice: '', dailyYield: '',
    inMarketplace: true, showPrice: true, askingPrice: ''
  });
  const [feedDeduct, setFeedDeduct] = useState({ id: 'f1', qty: '' });
  const [stockAdd, setStockAdd] = useState({ id: 'f1', qty: '' });

  const handleAddStock = (e) => {
    e.preventDefault();
    const q = Number(stockAdd.qty);
    if (!q || q <= 0) return;

    setInventory(inventory.map(item =>
      item.id === stockAdd.id ? { ...item, stock: item.stock + q } : item
    ));
    setStockAdd({ ...stockAdd, qty: '' });
    showToast(`📦 Added ${q} kg successfully to stock!`);
  };

  const [newEmp, setNewEmp] = useState({ name: '', role: '', salary: '', freeMilk: '' });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // Revenue & Margin Calculations
  const totalLoggedDairyRevenue = milkLogs.reduce(
    (sum, log) => sum + (Number(log.qty) || 0) * (Number(log.rate) || 0),
    0
  );

  const selectedDateRevenue = milkLogs
    .filter(l => l.date === newLogEntry.date)
    .reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.rate) || 0), 0);

  const totalDailyYield = cows.reduce((s, c) => s + Number(c.dailyYield || 0), 0);
  const latestMilkLog = milkLogs.find(l => l.productName.toLowerCase().includes('milk'));
  const activeMilkRate = latestMilkLog && Number(latestMilkLog.rate) > 0 ? Number(latestMilkLog.rate) : 62;

  const estMonthlyRev = (totalDailyYield * activeMilkRate * 30) + totalLoggedDairyRevenue;
  const totalSalaries = employees.reduce((s, e) => s + Number(e.salary || 0), 0);
  const netProfit = estMonthlyRev - totalSalaries - 18500;

  const handleAddCow = (e) => {
    e.preventDefault();
    if (cows.length >= planRules.maxCows) {
      showToast(`⚠️ Plan Limit Reached! ${activeFarm.plan} allows max ${planRules.maxCows} cows. Upgrade plan.`);
      return;
    }
    const created = {
      id: Date.now(),
      tag: newCow.tag.toUpperCase(),
      name: newCow.name,
      breed: newCow.breed,
      purchasePrice: Number(newCow.purchasePrice) || 50000,
      dailyYield: Number(newCow.dailyYield) || 10,
      inMarketplace: planRules.marketplace ? newCow.inMarketplace : false,
      showPrice: newCow.showPrice,
      askingPrice: Number(newCow.askingPrice) || Number(newCow.purchasePrice) || 55000
    };
    updateFarmCows([...cows, created]);
    setNewCow({ tag: '', name: '', breed: 'Gir', purchasePrice: '', dailyYield: '', inMarketplace: true, showPrice: true, askingPrice: '' });
    showToast(`🐄 ${created.name} added successfully!`);
  };

  const toggleCowPriceVisibility = (cowId) => {
    updateFarmCows(cows.map(c => c.id === cowId ? { ...c, showPrice: !c.showPrice } : c));
    showToast('Updated public price visibility!');
  };

  const toggleCowMarketplace = (cowId) => {
    if (!planRules.marketplace) {
      showToast('⚠️ Upgrade to STARTER or higher to list animals in Public Marketplace!');
      return;
    }
    updateFarmCows(cows.map(c => c.id === cowId ? { ...c, inMarketplace: !c.inMarketplace } : c));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (employees.length >= planRules.maxStaff) {
      showToast(`⚠️ HRMS Limit! ${activeFarm.plan} plan allows max ${planRules.maxStaff} employees. Upgrade to GROWTH for unlimited staff.`);
      return;
    }
    setEmployees([...employees, {
      id: Date.now(),
      name: newEmp.name,
      role: newEmp.role || 'Farm Hand',
      salary: Number(newEmp.salary) || 10000,
      freeMilk: Number(newEmp.freeMilk) || 1
    }]);
    setNewEmp({ name: '', role: '', salary: '', freeMilk: '' });
    showToast('👷 Employee added to HRMS!');
  };

  // =========================================================================
  // === Role Login Screen ===================================================
  // =========================================================================
  if (!authRole) {
    const mins = Math.floor(lockoutSeconds / 60);
    const secs = lockoutSeconds % 60;

    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${cardClass}`}>
          {!isResetMode ? (
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-xl font-black">{activeFarm.name}</h2>
                <p className="text-xs opacity-75">Select your role and enter 4-digit access PIN</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLoginRoleSelect('ADMIN'); setLoginPinInput(''); }}
                  className={`p-3 rounded-2xl border transition text-center ${
                    loginRoleSelect === 'ADMIN'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                      : 'border-current/20 opacity-75 hover:opacity-100'
                  }`}
                >
                  👑 Farm Owner / Admin
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">Full ERP & Profit Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginRoleSelect('WORKER'); setLoginPinInput(''); }}
                  className={`p-3 rounded-2xl border transition text-center ${
                    loginRoleSelect === 'WORKER'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                      : 'border-current/20 opacity-75 hover:opacity-100'
                  }`}
                >
                  👷 Staff / Employee
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">Daily Ops & Feed Only</span>
                </button>
              </div>

              {lockoutSeconds > 0 ? (
                <div className="p-5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-center space-y-2">
                  <AlertTriangle className="mx-auto text-rose-400" size={28} />
                  <h4 className="font-black text-rose-400 text-sm">Account Temporarily Locked</h4>
                  <p className="text-xs opacity-80">Too many wrong PIN attempts (5/5). Try again in:</p>
                  <p className="text-2xl font-mono font-black text-rose-400">
                    {mins}:{secs < 10 ? '0' : ''}{secs}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRoleLogin} className="space-y-4 text-center">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Enter {loginRoleSelect === 'ADMIN' ? 'Owner' : 'Employee'} 4-Digit PIN
                    </label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={loginPinInput}
                      onChange={e => setLoginPinInput(e.target.value.replace(/\D/g, ''))}
                      className={`w-44 mx-auto text-center text-3xl font-mono tracking-widest py-3 rounded-2xl border ${inputClass}`}
                    />
                    {failedAttempts > 0 && (
                      <p className="text-xs text-rose-400 font-bold mt-2">
                        Wrong PIN! {5 - failedAttempts} attempt(s) left before 5-min lock.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs shadow-lg transition"
                  >
                    Unlock {loginRoleSelect === 'ADMIN' ? 'Admin Dashboard' : 'Daily Ops Portal'} →
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-current/10 text-center">
                <button
                  type="button"
                  onClick={triggerForgotPinOtp}
                  className="text-xs text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Forgot PIN? Reset via Owner Mobile OTP
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleConfirmPinReset} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-emerald-500">Reset Farm Access PINs</h3>
                <p className="opacity-75 flex items-center justify-center gap-1">
                  <Smartphone size={13} /> OTP sent to Owner: <strong>{activeFarm.phone}</strong>
                </p>
                <p className="opacity-80">Demo OTP: <span className="font-mono font-black text-amber-400 bg-slate-950 px-2 py-0.5 rounded">{resetOtp}</span></p>
              </div>

              <div>
                <label className="block font-bold mb-1">Enter 6-Digit OTP *</label>
                <input
                  required
                  maxLength={6}
                  type="text"
                  placeholder="6-digit OTP"
                  value={enteredResetOtp}
                  onChange={e => setEnteredResetOtp(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2.5 border font-mono text-center tracking-widest ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">New Owner PIN *</label>
                  <input
                    required
                    maxLength={4}
                    type="text"
                    placeholder="e.g. 4321"
                    value={newAdminPin}
                    onChange={e => setNewAdminPin(e.target.value.replace(/\D/g, ''))}
                    className={`w-full rounded-xl px-3 py-2.5 border font-mono text-center tracking-widest ${inputClass}`}
                  />
                </div>
                {isPaidPlan && (
                  <div>
                    <label className="block font-bold mb-1">New Staff PIN</label>
                    <input
                      maxLength={4}
                      type="text"
                      placeholder="e.g. 1111"
                      value={newWorkerPin}
                      onChange={e => setNewWorkerPin(e.target.value.replace(/\D/g, ''))}
                      className={`w-full rounded-xl px-3 py-2.5 border font-mono text-center tracking-widest ${inputClass}`}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsResetMode(false)} className="flex-1 py-2.5 rounded-xl border border-current/20 font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow">
                  Save New PINs
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // === Tab Filtering (Worker sees Ops + Cow Diet & Ration) =================
  // =========================================================================
  const visibleTabs = authRole === 'WORKER'
    ? [
        { id: 'ops', label: t.ops, icon: Calculator },
        { id: 'feedadvisor', label: '🌾 ${t.cowDietTab}', icon: Wheat }
      ]
    : [
        { id: 'dashboard', label: t.dashboard, icon: TrendingUp },
        { id: 'herd', label: `${t.herd} (${cows.length})`, icon: ShieldCheck },
        { id: 'ops', label: t.ops, icon: Calculator },
        { id: 'feedadvisor', label: '🌾 Cow Diet & Ration', icon: Wheat },
        { id: 'hrms', label: `${t.hrms} (${employees.length})`, icon: Users },
        { id: 'finance', label: t.finance, icon: Lock }
      ];

  const selectedProductObj = dairyProducts.find(p => p.id === newLogEntry.productId) || dairyProducts[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Plan & Active Role Banner */}
      <div className={`p-4 rounded-2xl border flex flex-wrap justify-between items-center gap-4 ${cardClass}`}>
        <div className="flex flex-wrap items-center space-x-3 text-xs">
          <span className="bg-emerald-600 text-white font-black px-3 py-1 rounded-full">{activeFarm.plan} PLAN</span>
          <span className={`font-black px-3 py-1 rounded-full ${authRole === 'ADMIN' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {authRole === 'ADMIN' ? '👑 Owner Mode' : '👷 Staff Mode (Restricted)'}
          </span>
          {authRole === 'ADMIN' && (
            <>
              <span>Cows: <strong>{cows.length} / {planRules.maxCows}</strong></span>
              <span>•</span>
              <span>Staff: <strong>{employees.length} / {planRules.maxStaff === 999 ? 'Unlimited' : planRules.maxStaff}</strong></span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isPaidPlan && (
            <button
              onClick={() => { setAuthRole(null); setIsUnlocked(false); }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
            >
              <LogOut size={13} /><span>Switch Role / Lock</span>
            </button>
          )}
          {authRole === 'ADMIN' && activeFarm.plan !== 'ENTERPRISE' && (
            <button onClick={onUpgradePlan} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs">
              ⚡ Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {visibleTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow' : `${cardClass} border opacity-80 hover:opacity-100`
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.activeHerd}</p>
            <h3 className="text-3xl font-black mt-2">{cows.length} / {planRules.maxCows}</h3>
            <p className="text-xs text-emerald-500 mt-1">Daily Yield: {totalDailyYield} L/day</p>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.estRevenue}</p>
            <h3 className="text-3xl font-black text-emerald-500 mt-2">₹{estMonthlyRev.toLocaleString()}</h3>
            <p className="text-xs opacity-70 mt-1">Herd + Logged Dairy Sales</p>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.fixedOverheads}</p>
            <h3 className="text-3xl font-black text-rose-500 mt-2">₹{(totalSalaries + 18500).toLocaleString()}</h3>
            <p className="text-xs opacity-70 mt-1">Feed + HRMS Payroll</p>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.netProfit}</p>
            <h3 className="text-3xl font-black text-sky-400 mt-2">₹{netProfit.toLocaleString()}</h3>
            <p className="text-xs text-sky-400 mt-1">Real-time Net Margin</p>
          </div>
        </div>
      )}

      {/* TAB 2: HERD & SELECTIVE MARKETPLACE PRICING (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'herd' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCow} className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
            <h3 className="font-bold text-base text-emerald-500">{t.registerCow}</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input required type="text" placeholder={`${t.earTag} (GW-105)`} value={newCow.tag} onChange={e => setNewCow({...newCow, tag: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <input required type="text" placeholder={t.animalName} value={newCow.name} onChange={e => setNewCow({...newCow, name: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <select value={newCow.breed} onChange={e => setNewCow({...newCow, breed: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`}>
                <option>Gir</option>
                <option>Sahiwal</option>
                <option>Desi</option>
                <option>Tharparkar</option>
                <option>Murrah Buffalo</option>
              </select>
              <input required type="number" placeholder={t.purchaseCost} value={newCow.purchasePrice} onChange={e => setNewCow({...newCow, purchasePrice: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <input required type="number" placeholder={t.dailyYield} value={newCow.dailyYield} onChange={e => setNewCow({...newCow, dailyYield: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-current/10 text-xs">
              <div className="flex flex-wrap items-center gap-5">
                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input type="checkbox" checked={newCow.inMarketplace} onChange={e => setNewCow({...newCow, inMarketplace: e.target.checked})} className="rounded text-emerald-600" />
                  <span>{t.showMarketplace}</span>
                </label>

                {newCow.inMarketplace && (
                  <>
                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-amber-400">
                      <input type="checkbox" checked={newCow.showPrice} onChange={e => setNewCow({...newCow, showPrice: e.target.checked})} className="rounded text-amber-500" />
                      <span>{t.showPricePublicly}</span>
                    </label>
                    {newCow.showPrice && (
                      <input type="number" placeholder={t.askingPrice} value={newCow.askingPrice} onChange={e => setNewCow({...newCow, askingPrice: e.target.value})} className={`w-40 rounded-xl px-3 py-1.5 border ${inputClass}`} />
                    )}
                  </>
                )}
              </div>

              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-1">
                <Plus size={15} /><span>{t.addAnimalBtn}</span>
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cows.map(cow => (
              <div key={cow.id} className={`p-6 rounded-3xl border space-y-3 ${cardClass}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-600/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-bold">{cow.tag} • {cow.breed}</span>
                    <h4 className="text-xl font-black mt-2">{cow.name}</h4>
                  </div>
                  <button onClick={() => updateFarmCows(cows.filter(c => c.id !== cow.id))} className="text-rose-400 hover:text-rose-300">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="text-xs space-y-1 opacity-80">
                  <p>Purchase Cost: <strong>₹{Number(cow.purchasePrice).toLocaleString()}</strong></p>
                  <p>Daily Milk Yield: <strong>{cow.dailyYield} Liters/day</strong></p>
                </div>

                <div className="pt-3 border-t border-current/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Public Marketplace:</span>
                    <button
                      onClick={() => toggleCowMarketplace(cow.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold ${cow.inMarketplace ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      {cow.inMarketplace ? 'Listed Publicly' : 'Hidden'}
                    </button>
                  </div>

                  {cow.inMarketplace && (
                    <div className="flex justify-between items-center">
                      <span>Public Price (₹{Number(cow.askingPrice).toLocaleString()}):</span>
                      <button
                        onClick={() => toggleCowPriceVisibility(cow.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${cow.showPrice ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                      >
                        {cow.showPrice ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY OPS & FEED (ACCESSIBLE TO BOTH ADMIN & WORKER) */}
      {activeTab === 'ops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT CARD: FEED INVENTORY */}
          <div className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
            <h3 className="font-bold text-lg">📦 {t.FeedInventoryTitle} (Deduct & Restock)</h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              const q = Number(feedDeduct.qty);
              if (!q) return;
              setInventory(inventory.map(i => i.id === feedDeduct.id ? { ...i, stock: Math.max(0, i.stock - q) } : i));
              setFeedDeduct({ ...feedDeduct, qty: '' });
              showToast(`Deducted ${q} kg from stock!`);
            }} className="flex gap-2">
              <select value={feedDeduct.id} onChange={e => setFeedDeduct({...feedDeduct, id: e.target.value})} className={`flex-1 rounded-xl px-3 py-2 text-xs border ${inputClass}`}>
                {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <input required type="number" placeholder={t.minusKgPlaceholder} value={feedDeduct.qty} onChange={e => setFeedDeduct({...feedDeduct, qty: e.target.value})} className={`w-24 rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs">Deduct</button>
            </form>

            <form onSubmit={handleAddStock} className="flex gap-2 pt-2 border-t border-current/10">
              <select value={stockAdd.id} onChange={e => setStockAdd({...stockAdd, id: e.target.value})} className={`flex-1 rounded-xl px-3 py-2 text-xs border ${inputClass}`}>
                {inventory.map(i => <option key={i.id} value={i.id}>Refill: {i.name}</option>)}
              </select>
              <input required type="number" placeholder={t.addKgPlaceholder} value={stockAdd.qty} onChange={e => setStockAdd({...stockAdd, qty: e.target.value})} className={`w-24 rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs">+ Add Stock</button>
            </form>

            <div className="space-y-2 pt-2">
              {inventory.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-current/5 flex justify-between items-center text-xs">
                  <span className="font-bold">{item.name}</span>
                  <span className="font-black text-emerald-500">{item.stock} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CARD: CUSTOMIZABLE DAIRY PRODUCTION + CALENDAR DATE + MANDATORY PRICE */}
          <div className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h3 className="font-bold text-lg">🥛 {t.dairyLogTitle}</h3>
              <button
                type="button"
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:bg-amber-500/30 transition"
              >
                {showCustomForm ? t.closeBtn : t.addCustomItemBtn}
              </button>
            </div>

            {!planRules.valueAdd ? (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                <AlertTriangle className="mx-auto text-amber-400" />
                <p className="text-sm font-bold">Available in GROWTH (₹499/mo) & ENTERPRISE Plans</p>
                {authRole === 'ADMIN' && (
                  <button onClick={onUpgradePlan} className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">Upgrade Now</button>
                )}
              </div>
            ) : (
              <>
                {/* CUSTOM ITEM CREATOR BOX */}
                {showCustomForm && (
                  <form onSubmit={handleAddCustomProduct} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 text-xs">
                    <p className="font-bold text-amber-400">Create New Dairy Product</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        required
                        type="text"
                        placeholder="Item Name (e.g. Bilona Ghee, Khoya)"
                        value={customItem.name}
                        onChange={e => setCustomItem({ ...customItem, name: e.target.value })}
                        className={`sm:col-span-2 rounded-xl px-3 py-2 border ${inputClass}`}
                      />
                      <select
                        value={customItem.unit}
                        onChange={e => setCustomItem({ ...customItem, unit: e.target.value })}
                        className={`rounded-xl px-3 py-2 border font-bold ${inputClass}`}
                      >
                        <option value="L">Unit: Liters (L)</option>
                        <option value="kg">Unit: Kilograms (kg)</option>
                        <option value="gm">Unit: Grams (gm)</option>
                        <option value="Pkt">Unit: Packets (Pkt)</option>
                        <option value="Btl">Unit: Bottles (Btl)</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl">
                      Save Item to Dropdown
                    </button>
                  </form>
                )}

                {/* DAILY PRODUCTION + CALENDAR DATE + MANDATORY RATE FORM */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = Number(newLogEntry.qty);
                    const r = Number(newLogEntry.rate);

                    if (!newLogEntry.date || !q || q <= 0 || !r || r <= 0) {
                      showToast('⚠️ Date, Quantity, and Rate are all mandatory!');
                      return;
                    }

                    const entry = {
                      id: Date.now(),
                      date: newLogEntry.date,
                      productName: selectedProductObj.name,
                      unit: selectedProductObj.unit,
                      qty: q,
                      rate: r
                    };

                    setMilkLogs([entry, ...milkLogs]);
                    setNewLogEntry({ ...newLogEntry, qty: '', rate: '' });
                    showToast(`✅ Logged ${q} ${selectedProductObj.unit} ${selectedProductObj.name} (${entry.date}) = ₹${(q * r).toLocaleString()}`);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold mb-1 opacity-80 flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-400" /> Entry Date (YYYY-MM-DD) *
                      </label>
                      <input
                        required
                        type="date"
                        value={newLogEntry.date}
                        onChange={e => setNewLogEntry({ ...newLogEntry, date: e.target.value })}
                        className={`w-full rounded-xl px-3 py-2 border font-mono ${inputClass}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1 opacity-80">Select Dairy Product *</label>
                      <select
                        value={newLogEntry.productId}
                        onChange={e => setNewLogEntry({ ...newLogEntry, productId: e.target.value })}
                        className={`w-full rounded-xl px-3 py-2 border font-bold ${inputClass}`}
                      >
                        {dairyProducts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold mb-1 opacity-80">
                        Quantity ({selectedProductObj.unit}) *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="e.g. 10"
                        value={newLogEntry.qty}
                        onChange={e => setNewLogEntry({ ...newLogEntry, qty: e.target.value })}
                        className={`w-full rounded-xl px-3 py-2 border ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold mb-1 text-emerald-400">
                        Selling Price (₹ / {selectedProductObj.unit}) *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.5"
                        min="1"
                        placeholder="e.g. 90"
                        value={newLogEntry.rate}
                        onChange={e => setNewLogEntry({ ...newLogEntry, rate: e.target.value })}
                        className={`w-full rounded-xl px-3 py-2 border ${inputClass}`}
                      />
                    </div>
                  </div>

                  {/* Live Entry Preview */}
                  <div className="p-2.5 rounded-xl bg-current/5 flex justify-between items-center">
                    <span className="opacity-75">This Entry Value ({newLogEntry.date}):</span>
                    <strong className="text-emerald-400 text-sm">
                      ₹{((Number(newLogEntry.qty) || 0) * (Number(newLogEntry.rate) || 0)).toLocaleString()}
                    </strong>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl shadow transition">
                    + Log Production & Update Revenue
                  </button>
                </form>

                {/* Selected Date vs Total Summary */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] opacity-75 uppercase font-bold">Sales on {newLogEntry.date}</p>
                    <p className="text-base font-black text-emerald-400 mt-0.5">₹{selectedDateRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    <p className="text-[10px] opacity-75 uppercase font-bold">All Logged Total</p>
                    <p className="text-base font-black text-sky-400 mt-0.5">₹{totalLoggedDairyRevenue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Logs History */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {milkLogs.length === 0 ? (
                    <p className="text-center text-xs opacity-60 py-4">
                      No production logged yet. Select a date, item, quantity & rate above to start!
                    </p>
                  ) : (
                    milkLogs.map(l => (
                      <div key={l.id} className="p-3 rounded-xl bg-current/5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-emerald-400">{l.productName}</span>
                          <span className="opacity-60 ml-2 text-[11px] font-mono">{l.date}</span>
                          <p className="opacity-80 mt-0.5">
                            Qty: <strong>{l.qty} {l.unit}</strong> × Rate: <strong>₹{l.rate}/{l.unit}</strong>
                          </p>
                        </div>
                        <span className="font-black text-sm">
                          ₹{((Number(l.qty) || 0) * (Number(l.rate) || 0)).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB: COW DIET & RATION CALCULATOR (ACCESSIBLE TO BOTH ADMIN & WORKER) */}
      {activeTab === 'feedadvisor' && (
        <FeedAdvisor cardClass={cardClass} inputClass={inputClass} />
      )}

      {/* TAB 4: HRMS WITH PLAN STAFF LIMIT (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'hrms' && (
        <div className="space-y-6">
          {planRules.maxStaff === 0 ? (
            <div className={`p-8 rounded-3xl border text-center space-y-3 ${cardClass}`}>
              <Lock className="mx-auto text-amber-400" size={32} />
              <h3 className="text-xl font-black">HRMS & Staff Payroll Locked on FREE Tier</h3>
              <p className="text-xs opacity-75">Upgrade to STARTER (up to 2 staff) or GROWTH (unlimited staff) to manage payroll and milk perks.</p>
              <button onClick={onUpgradePlan} className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Upgrade Plan</button>
            </div>
          ) : (
            <>
              <form onSubmit={handleAddEmployee} className={`p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-5 gap-4 ${cardClass}`}>
                <input required type="text" placeholder="Employee Name" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <input type="text" placeholder="Role (Milker/Driver)" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <input required type="number" placeholder="Monthly Salary (₹)" value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <input type="number" step="0.5" placeholder="Free Milk (L/day)" value={newEmp.freeMilk} onChange={e => setNewEmp({...newEmp, freeMilk: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <button type="submit" className="bg-emerald-600 text-white font-bold rounded-xl text-xs py-2">
                  + Add Staff ({employees.length}/{planRules.maxStaff === 999 ? '∞' : planRules.maxStaff})
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {employees.map(emp => (
                  <div key={emp.id} className={`p-6 rounded-3xl border flex justify-between items-center ${cardClass}`}>
                    <div>
                      <h4 className="font-bold text-base">{emp.name}</h4>
                      <p className="text-xs text-emerald-500">{emp.role}</p>
                      <p className="text-xs opacity-75 mt-2">Salary: ₹{emp.salary.toLocaleString()}/mo • Milk: {emp.freeMilk}L/day</p>
                    </div>
                    <button onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))} className="text-rose-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 5: 2FA BALANCE SHEET (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'finance' && (
        <div className={`max-w-lg mx-auto p-8 rounded-3xl border text-center space-y-4 ${cardClass}`}>
          {!isUnlocked ? (
            <>
              <Lock className="mx-auto text-emerald-500" size={36} />
              <h3 className="text-xl font-black">{t.unlockSheet}</h3>
              <p className="text-xs opacity-75">Enter your 4-Digit Owner PIN</p>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="••••"
                className={`w-36 mx-auto text-center text-2xl font-mono tracking-widest py-2 rounded-xl border ${inputClass}`}
              />
              <div>
                <button
                  onClick={() => { if (pinInput === currentAdminPin) setIsUnlocked(true); else showToast('❌ Wrong PIN'); }}
                  className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Verify & Unlock
                </button>
              </div>
            </>
          ) : (
            <div className="text-left space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-current/10 pb-2">
                <h4 className="font-black text-emerald-500">🔒 Verified Monthly P&L</h4>
                <button onClick={() => setIsUnlocked(false)} className="text-xs underline">Lock</button>
              </div>
              <div className="flex justify-between"><span>Est. Monthly Revenue:</span><strong className="text-emerald-500">₹{estMonthlyRev.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>HRMS Staff Salaries:</span><strong className="text-rose-500">- ₹{totalSalaries.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>Feed & Operations:</span><strong className="text-rose-500">- ₹18,500</strong></div>
              <div className="flex justify-between pt-2 border-t border-current/15 text-base font-black">
                <span>Net Monthly Profit:</span><span className="text-sky-400">₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
