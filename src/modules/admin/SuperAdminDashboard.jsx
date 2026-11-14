import React, { useState } from 'react';
import { Shield, Building, IndianRupee, Users, CheckCircle, Lock } from 'lucide-react';
import { PLAN_LIMITS } from '../../data/translations';

export default function SuperAdminDashboard({ farms, setFarms, cardClass, inputClass, onBack }) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  if (!isAdminAuth) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className={`p-8 rounded-3xl border text-center space-y-4 shadow-2xl ${cardClass}`}>
          <div className="w-14 h-14 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-black">SaaS Owner Super-Admin</h2>
          <p className="text-xs opacity-75">Master Control Panel for KamadhenuERP Platform Owner (Demo Passcode: <code className="text-purple-400 font-bold">admin123</code>)</p>
          <input
            type="password"
            placeholder="Enter Master Password"
            value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            className={`w-full text-center py-3 rounded-xl border ${inputClass}`}
          />
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 py-2.5 rounded-xl border border-current/20 text-xs font-bold">Cancel</button>
            <button
              onClick={() => { if (adminPass === 'admin123') setIsAdminAuth(true); else alert('Invalid Master Password'); }}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Login as Owner
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalMRR = farms.reduce((sum, f) => sum + (PLAN_LIMITS[f.plan]?.price || 0), 0);
  const totalCattle = farms.reduce((sum, f) => sum + (f.cows?.length || 0), 0);

  const toggleFarmStatus = (id) => {
    setFarms(farms.map(f => f.id === id ? { ...f, status: f.status === 'Active' ? 'Suspended' : 'Active' } : f));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="bg-purple-600/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full">👑 Master SaaS Owner Console</span>
          <h1 className="text-3xl font-black mt-2">KamadhenuERP Multi-Tenant Control</h1>
        </div>
        <button onClick={onBack} className="px-4 py-2 rounded-xl border border-current/20 text-xs font-bold">← Exit Admin</button>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-3xl border ${cardClass}`}>
          <p className="text-xs opacity-70 font-bold uppercase">Enrolled Dairy Farms</p>
          <h3 className="text-3xl font-black text-purple-400 mt-2">{farms.length} Farms</h3>
        </div>
        <div className={`p-6 rounded-3xl border ${cardClass}`}>
          <p className="text-xs opacity-70 font-bold uppercase">Monthly Recurring Revenue (MRR)</p>
          <h3 className="text-3xl font-black text-emerald-500 mt-2">₹{totalMRR.toLocaleString()}/mo</h3>
          <p className="text-[11px] opacity-70 mt-1">Direct Razorpay Settlement</p>
        </div>
        <div className={`p-6 rounded-3xl border ${cardClass}`}>
          <p className="text-xs opacity-70 font-bold uppercase">Total Cattle on Network</p>
          <h3 className="text-3xl font-black text-sky-400 mt-2">{totalCattle} Animals</h3>
        </div>
        <div className={`p-6 rounded-3xl border ${cardClass}`}>
          <p className="text-xs opacity-70 font-bold uppercase">Master Payout Gateway</p>
          <h3 className="text-lg font-black text-emerald-400 mt-2">Razorpay Connected</h3>
          <p className="text-[11px] opacity-70 mt-1">Auto-split disabled (100% Owner)</p>
        </div>
      </div>

      {/* Enrolled Farms Table */}
      <div className={`p-6 rounded-3xl border overflow-x-auto ${cardClass}`}>
        <h3 className="text-lg font-bold mb-4">📋 Registered Tenant Farms Directory</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-current/15 opacity-75">
              <th className="py-3 px-2">Farm Name</th>
              <th className="py-3 px-2">Owner & Contact</th>
              <th className="py-3 px-2">Location</th>
              <th className="py-3 px-2">Active Plan</th>
              <th className="py-3 px-2">Herd Size</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {farms.map(farm => (
              <tr key={farm.id} className="border-b border-current/10">
                <td className="py-3.5 px-2 font-bold">{farm.name}</td>
                <td className="py-3.5 px-2">{farm.owner}<br/><span className="opacity-70">{farm.phone}</span></td>
                <td className="py-3.5 px-2">{farm.location}</td>
                <td className="py-3.5 px-2">
                  <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                    {farm.plan} (₹{PLAN_LIMITS[farm.plan]?.price}/mo)
                  </span>
                </td>
                <td className="py-3.5 px-2 font-bold">{farm.cows?.length || 0} Cows</td>
                <td className="py-3.5 px-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${farm.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {farm.status}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  <button
                    onClick={() => toggleFarmStatus(farm.id)}
                    className="px-3 py-1 rounded-lg border border-current/20 hover:bg-current/10 font-bold"
                  >
                    {farm.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
