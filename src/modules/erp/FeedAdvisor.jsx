import React, { useState } from 'react';
import { Calculator, Wheat, Sparkles, Info } from 'lucide-react';

export default function FeedAdvisor({ cardClass, inputClass }) {
  const [milkYield, setMilkYield] = useState(10);
  const [cowWeight, setCowWeight] = useState(400);
  const [isPregnant, setIsPregnant] = useState(false);

  // NDDB / ICAR Scientific Dairy Ration Formula
  const maintenanceConcentrate = 1.5; // kg
  const productionConcentrate = (Number(milkYield) / 2.5); // 1 kg per 2.5L milk
  const pregnancyAllowance = isPregnant ? 1.5 : 0;
  const totalConcentrate = (maintenanceConcentrate + productionConcentrate + pregnancyAllowance).toFixed(1);

  const greenFodder = Math.round((cowWeight * 0.04) + (milkYield * 0.8)); // Super Napier + Maize
  const dryFodder = Math.round((cowWeight * 0.012)); // Bhusa / Hay
  const mineralMixture = Math.round(50 + (milkYield * 5)); // in grams
  const salt = 30; // grams

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div>
        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
          🌾 Smart Dairy Nutrition & Ration Calculator (NDDB Standards)
        </span>
        <h2 className="text-3xl font-black mt-2">Daily Cattle Feed & Diet Planner</h2>
        <p className="text-xs opacity-75 mt-1">
          Select your cow's daily milk production to get exact quantities of Green Fodder (Super Napier/Maize), Dry Bhusa, Concentrate, and Minerals.
        </p>
      </div>

      {/* Input Controls */}
      <div className={`p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-3 gap-6 ${cardClass}`}>
        <div>
          <label className="text-xs font-bold block mb-2">Daily Milk Yield (Liters): <span className="text-emerald-500 text-base">{milkYield} L/day</span></label>
          <input
            type="range"
            min="2"
            max="35"
            step="1"
            value={milkYield}
            onChange={e => setMilkYield(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-60 mt-1">
            <span>2 L</span><span>10 L</span><span>15 L</span><span>25 L+</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-2">Approx. Body Weight (kg)</label>
          <select value={cowWeight} onChange={e => setCowWeight(Number(e.target.value))} className={`w-full rounded-xl px-4 py-2.5 border text-sm font-bold ${inputClass}`}>
            <option value={350}>350 kg (Small Gir / Desi)</option>
            <option value={400}>400 kg (Standard Gir / Sahiwal)</option>
            <option value={450}>450 kg (Large Sahiwal / Cross)</option>
            <option value={550}>550 kg (HF / Murrah Buffalo)</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-3 cursor-pointer text-xs font-bold p-3.5 rounded-2xl border border-current/15 w-full">
            <input type="checkbox" checked={isPregnant} onChange={e => setIsPregnant(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
            <span>Pregnant Cow (6+ Months) <br/><span className="opacity-60 font-normal">+1.5 kg extra feed added</span></span>
          </label>
        </div>
      </div>

      {/* Recommended Daily Diet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div className={`p-6 rounded-3xl border border-emerald-500/40 ${cardClass}`}>
          <p className="text-xs font-bold opacity-70 uppercase">Green Fodder (हरा चारा)</p>
          <h3 className="text-3xl font-black text-emerald-500 mt-2">{greenFodder} kg/day</h3>
          <p className="text-[11px] opacity-75 mt-2">Mix 70% Super Napier + 30% Green Maize for high fat & SNF.</p>
        </div>

        <div className={`p-6 rounded-3xl border border-amber-500/40 ${cardClass}`}>
          <p className="text-xs font-bold opacity-70 uppercase">Dry Fodder / Bhusa (सूखा चारा)</p>
          <h3 className="text-3xl font-black text-amber-400 mt-2">{dryFodder} kg/day</h3>
          <p className="text-[11px] opacity-75 mt-2">Wheat/Paddy straw (कुट्टी) to maintain rumen digestion.</p>
        </div>

        <div className={`p-6 rounded-3xl border border-sky-500/40 ${cardClass}`}>
          <p className="text-xs font-bold opacity-70 uppercase">Cattle Feed / Dana (दाना मिश्रण)</p>
          <h3 className="text-3xl font-black text-sky-400 mt-2">{totalConcentrate} kg/day</h3>
          <p className="text-[11px] opacity-75 mt-2">Divide into 2 equal meals during morning & evening milking.</p>
        </div>

        <div className={`p-6 rounded-3xl border border-purple-500/40 ${cardClass}`}>
          <p className="text-xs font-bold opacity-70 uppercase">Minerals & Salt (खनिज मिश्रण)</p>
          <h3 className="text-3xl font-black text-purple-400 mt-2">{mineralMixture} gm/day</h3>
          <p className="text-[11px] opacity-75 mt-2">Chelated Mineral Mixture + {salt}g common salt daily.</p>
        </div>
      </div>

      {/* Pro Tip Box */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-start gap-3">
        <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong>Pro Tip for {milkYield}L Milking Cow:</strong> Ensure 50–65 liters of clean drinking water daily. 
          If feeding 10L cow, give <strong>{totalConcentrate} kg</strong> concentrate; if upgrading to a 15L cow, increase concentrate to <strong>{(1.5 + 15/2.5 + (isPregnant?1.5:0)).toFixed(1)} kg</strong> to prevent calcium deficiency and weight loss.
        </p>
      </div>
    </div>
  );
}
