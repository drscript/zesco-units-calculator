'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Zap, ReceiptText, Info, HelpCircle } from 'lucide-react';

const TARIFF_SCHEDULES = {
  residential: {
    name: "Residential",
    visualScale: 500,
    bands: [
      { min: 0, max: 100, rate: 0.35, label: '0-100', color: 'bg-green-500' },
      { min: 100, max: 200, rate: 1.00, label: '101-200', color: 'bg-amber-400' },
      { min: 200, max: 400, rate: 2.42, label: '201-400', color: 'bg-orange-500' },
      { min: 400, max: Infinity, rate: 3.45, label: '400+', color: 'bg-red-500' },
    ]
  },
  commercial: {
    name: "Commercial",
    visualScale: 625,
    bands: [
      { min: 0, max: 100, rate: 0.66, label: '0-100', color: 'bg-green-500' },
      { min: 100, max: 300, rate: 1.35, label: '101-300', color: 'bg-amber-400' },
      { min: 300, max: 500, rate: 2.19, label: '301-500', color: 'bg-orange-500' },
      { min: 500, max: Infinity, rate: 3.16, label: '500+', color: 'bg-red-500' },
    ]
  },
  social: {
    name: "Social Services",
    visualScale: 625,
    bands: [
      { min: 0, max: 100, rate: 0.69, label: '0-100', color: 'bg-green-500' },
      { min: 100, max: 300, rate: 1.04, label: '101-300', color: 'bg-amber-400' },
      { min: 300, max: 500, rate: 1.11, label: '301-500', color: 'bg-orange-500' },
      { min: 500, max: Infinity, rate: 1.25, label: '500+', color: 'bg-red-500' },
    ]
  }
};

type TariffType = keyof typeof TARIFF_SCHEDULES;

export default function ZescoCalculator() {
  const [amount, setAmount] = useState<string>('500');
  const [previousUnits, setPreviousUnits] = useState<string>('0');
  const [includeTaxes, setIncludeTaxes] = useState(true);
  const [tariffType, setTariffType] = useState<TariffType>('residential');

  const calculation = useMemo(() => {
    const parsedAmount = parseFloat(amount);
    const parsedPrevious = parseFloat(previousUnits) || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) return null;

    // Standard Zambian taxes on ZESCO units
    // 3% Excise Duty + 16% VAT on (Base + Excise) = 19.48% total tax on the base value
    // Therefore, Net Amount = Gross Amount / 1.1948
    const netAmount = includeTaxes ? parsedAmount / 1.1948 : parsedAmount;
    const taxAmount = parsedAmount - netAmount;
    const exciseAmount = includeTaxes ? netAmount * 0.03 : 0;
    const vatAmount = includeTaxes ? (netAmount + exciseAmount) * 0.16 : 0;

    let remainingAmount = netAmount;
    let currentUnits = parsedPrevious;
    let totalPurchasedUnits = 0;
    const breakdown = [];
    const activeSchedule = TARIFF_SCHEDULES[tariffType].bands;

    for (const band of activeSchedule) {
      if (remainingAmount <= 0) break;

      // Skip bands we've already surpassed
      if (currentUnits >= band.max) continue;

      const startingPoint = Math.max(currentUnits, band.min);
      
      if (band.max === Infinity) {
        // Last band, just buy whatever we can with the remaining money
        const unitsPurchased = remainingAmount / band.rate;
        totalPurchasedUnits += unitsPurchased;
        breakdown.push({
          units: unitsPurchased,
          rate: band.rate,
          cost: remainingAmount,
          bandName: band.label,
          color: band.color,
        });
        remainingAmount = 0;
      } else {
        const unitsAvailableInBand = band.max - startingPoint;
        const costForAvailableUnits = unitsAvailableInBand * band.rate;

        if (remainingAmount >= costForAvailableUnits) {
          // Buy all available units in this band
          totalPurchasedUnits += unitsAvailableInBand;
          remainingAmount -= costForAvailableUnits;
          currentUnits += unitsAvailableInBand;
          breakdown.push({
            units: unitsAvailableInBand,
            rate: band.rate,
            cost: costForAvailableUnits,
            bandName: band.label,
            color: band.color,
          });
        } else {
          // Money will run out in this band
          const unitsPurchased = remainingAmount / band.rate;
          totalPurchasedUnits += unitsPurchased;
          currentUnits += unitsPurchased;
          breakdown.push({
            units: unitsPurchased,
            rate: band.rate,
            cost: remainingAmount,
            bandName: band.label,
            color: band.color,
          });
          remainingAmount = 0;
        }
      }
    }

    const averageRate = totalPurchasedUnits > 0 ? (parsedAmount / totalPurchasedUnits).toFixed(2) : '0.00';

    return { totalPurchasedUnits, breakdown, netAmount, taxAmount, exciseAmount, vatAmount, averageRate, activeSchedule: TARIFF_SCHEDULES[tariffType] };
  }, [amount, previousUnits, includeTaxes, tariffType]);

  // Visualizer data
  const parsedPrevious = parseFloat(previousUnits) || 0;
  const currentTotal = parsedPrevious + (calculation?.totalPurchasedUnits || 0);
  const currentBands = TARIFF_SCHEDULES[tariffType].bands;
  const currentScale = TARIFF_SCHEDULES[tariffType].visualScale;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-y-auto sm:overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">Z</div>
          <span className="text-xl font-bold text-slate-800">Zesco Unit <span className="text-green-600">Calculator</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Current Month</span>
            <span className="text-sm font-medium text-slate-800">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <Info className="w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* Tariff Selector - placed outside grid so buttons don't stretch vertically */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex gap-2 overflow-x-auto shrink-0">
        {(Object.keys(TARIFF_SCHEDULES) as TariffType[]).map(key => (
          <button 
            key={key} 
            onClick={() => setTariffType(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${tariffType === key ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {TARIFF_SCHEDULES[key].name}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <main className="p-4 sm:p-6 pt-2 sm:pt-4 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 flex-grow max-w-[1200px] w-full mx-auto">

        {/* Input Section: Amount */}
        <div className="md:col-span-4 md:row-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm mt-2">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount to Purchase</label>
            <div className="mt-4 flex items-baseline">
              <span className="text-2xl font-semibold text-slate-400 mr-2">K</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-5xl font-bold text-slate-900 w-full outline-none bg-transparent placeholder-slate-200"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setAmount('100')} className="flex-1 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition-colors text-slate-700">K100</button>
            <button onClick={() => setAmount('200')} className="flex-1 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition-colors text-slate-700">K200</button>
            <button onClick={() => setAmount('500')} className="flex-1 py-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors">K500</button>
          </div>
        </div>

        {/* Input Section: History */}
        <div className="md:col-span-4 md:row-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm md:mt-2">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Previous Monthly Units</label>
            <div className="mt-4 flex items-baseline">
              <input 
                type="number"
                value={previousUnits}
                onChange={(e) => setPreviousUnits(e.target.value)}
                className="text-5xl font-bold text-slate-900 w-full outline-none bg-transparent placeholder-slate-200"
                placeholder="0"
                min="0"
                step="0.1"
              />
              <span className="text-2xl font-semibold text-slate-400 ml-2">kWh</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-6">Total energy already consumed in the current billing cycle. This determines your starting tariff band.</p>
        </div>

        {/* Primary Result Card */}
        <div className="md:col-span-4 md:row-span-6 bg-green-600 rounded-3xl p-6 sm:p-8 flex flex-col text-white shadow-lg shadow-green-200/50 md:mt-2">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium uppercase tracking-wider">Calculation Result</span>
          </div>
          <div className="flex-grow flex flex-col justify-center py-4">
            <span className="text-lg font-medium text-green-100">Total Units to Receive</span>
            <div className="mt-2 flex items-baseline flex-wrap">
              <h2 className="text-6xl sm:text-7xl font-bold tracking-tight">
                {calculation ? calculation.totalPurchasedUnits.toFixed(1) : '0.0'}
              </h2>
              <span className="text-2xl sm:text-3xl font-light opacity-80 ml-2">kWh</span>
            </div>
          </div>
          <div className="mt-auto space-y-4">
            <div className="pt-6 border-t border-white/20 flex justify-between items-center">
              <span className="text-green-100">Average Rate</span>
              <span className="font-bold text-xl">K {calculation ? calculation.averageRate : '0.00'} / unit</span>
            </div>
            
            {/* Added taxes toggle inside the main card as a clean switch */}
            <div className="py-3 px-4 bg-white/10 rounded-xl flex items-center justify-between border border-white/10">
              <span className="text-sm font-medium text-green-50">Include Standard Taxes</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={includeTaxes}
                  onChange={(e) => setIncludeTaxes(e.target.checked)}
                />
                <div className="w-9 h-5 bg-green-800/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white"></div>
              </label>
            </div>
            
            <button className="w-full py-4 mt-2 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-sm flex items-center justify-center gap-2">
               GENERATE TOKEN PREVIEW
            </button>
          </div>
        </div>

        {/* Tariff Band Visualizer */}
        <div className="md:col-span-8 md:row-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-800">Tariff Consumption Bands</h3>
            <div className="hidden sm:flex gap-3 text-xs">
              {currentBands.map((band, i) => (
                <div key={i} className="flex items-center gap-1.5 font-medium text-slate-600">
                  <div className={`w-3 h-3 rounded-full ${band.color}`}></div> {band.label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-12 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
            {currentBands.map((band, i) => {
              const widthPercentage = band.max === Infinity 
                ? ((currentScale - band.min) / currentScale) * 100
                : ((band.max - band.min) / currentScale) * 100;
              
              return (
                <div 
                  key={i} 
                  className={`h-full ${band.color} ${i > 0 ? 'border-l border-white/20' : ''} flex items-center justify-center text-[10px] font-bold text-white transition-all`} 
                  style={{ width: `${widthPercentage}%` }}
                >
                  <span className="hidden sm:inline">Band {i + 1}</span>
                </div>
              );
            })}

            {/* Indicator Pin for current consumption */}
            {parsedPrevious > 0 && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10 transition-all duration-500"
                style={{ left: `${Math.min((parsedPrevious / currentScale) * 100, 100)}%` }}
                title="Starting point (previous units)"
              >
                <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800"></div>
              </div>
            )}
            
            {/* Indicator area for NEW purchase */}
            {calculation && calculation.totalPurchasedUnits > 0 && (
              <div 
                className="absolute top-0 bottom-0 bg-white/30 border-x-2 border-white/80 z-20 backdrop-blur-[1px] transition-all duration-500"
                style={{ 
                  left: `${Math.min((parsedPrevious / currentScale) * 100, 100)}%`,
                  width: `${Math.min((calculation.totalPurchasedUnits / currentScale) * 100, 100 - Math.min((parsedPrevious / currentScale) * 100, 100))}%`
                }}
              >
              </div>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            {currentBands.map((band, i) => (
              <div key={i} className={`text-center ${i > 0 ? 'border-l border-slate-100' : ''}`}>
                <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase">{band.label}</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">K{band.rate.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown of Costs */}
        <div className="md:col-span-5 md:row-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-slate-400" />
            Cost Breakdown
          </h3>
          <div className="space-y-3 flex-grow">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Net Energy Charge</span>
              <span className="font-medium text-slate-800 font-mono">
                K {calculation ? calculation.netAmount.toFixed(2) : '0.00'}
              </span>
            </div>
            {includeTaxes && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Excise Duty (3%)</span>
                  <span className="font-medium text-slate-800 font-mono">
                    K {calculation ? calculation.exciseAmount.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">VAT (16%)</span>
                  <span className="font-medium text-slate-800 font-mono">
                    K {calculation ? calculation.vatAmount.toFixed(2) : '0.00'}
                  </span>
                </div>
              </>
            )}
            
            {calculation && calculation.breakdown.length > 0 && (
              <div className="pt-2 pb-1 border-t border-slate-50 mt-1">
                {calculation.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs mt-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      Band {item.bandName} ({item.units.toFixed(1)}u)
                    </span>
                    <span className="font-medium text-slate-600 font-mono">K {item.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between mt-2">
            <span className="font-bold text-slate-800">Total Amount</span>
            <span className="font-bold text-green-600 font-mono">
              K {parseFloat(amount || '0').toFixed(2)}
            </span>
          </div>
        </div>

        {/* Support Info */}
        <div className="md:col-span-3 md:row-span-2 bg-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Pro Tip</h4>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Purchasing units at the start of the month gives you more value because you start in the cheapest Band 1 (K{currentBands[0].rate.toFixed(2)}/u).
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Real-time Tariff Sync Active</span>
          </div>
        </div>

      </main>
    </div>
  );
}

