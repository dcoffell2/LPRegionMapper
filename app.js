import React, { useState, useMemo } from 'react';
import USAMap from "react-usa-map";
import { Plus, MousePointer2 } from 'lucide-react';
import { STATE_WEIGHTS } from './constants';

const App = () => {
  const [regions, setRegions] = useState([
    { id: '1', name: 'Region 1', color: '#6366f1', states: [] }
  ]);
  const [activeRegionId, setActiveRegionId] = useState('1');

  // Add a new region with user-defined color capability
  const addRegion = () => {
    const newId = Date.now().toString();
    setRegions([...regions, {
      id: newId,
      name: `Region ${regions.length + 1}`,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      states: []
    }]);
    setActiveRegionId(newId);
  };

  const handleStateClick = (event) => {
    const stateAbbr = event.target.dataset.name;
    setRegions(prev => prev.map(reg => {
      // Remove from existing region, add to active one
      const filtered = reg.states.filter(s => s !== stateAbbr);
      return reg.id === activeRegionId 
        ? { ...reg, states: [...filtered, stateAbbr] } 
        : { ...reg, states: filtered };
    }));
  };

  // Helper to calculate weight for a region
  const getWeight = (stateList) => {
    return stateList.reduce((sum, abbr) => sum + (STATE_WEIGHTS[abbr] || 0), 0).toFixed(2);
  };

  // Map coloring config
  const mapConfig = useMemo(() => {
    const config = {};
    regions.forEach(reg => {
      reg.states.forEach(st => config[st] = { fill: reg.color });
    });
    return config;
  }, [regions]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">Map Builder</h1>
          <p className="text-slate-500 mt-2 italic">Select a region card, then click states to assign them.</p>
        </div>
        <button 
          onClick={addRegion}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus size={20} /> Create New Region
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Regions & Weights */}
        <div className="lg:col-span-1 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {regions.map(reg => (
            <div 
              key={reg.id}
              onClick={() => setActiveRegionId(reg.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm ${activeRegionId === reg.id ? 'border-slate-900 ring-4 ring-slate-100' : 'border-transparent opacity-70'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <input 
                  type="text" 
                  value={reg.name}
                  onChange={(e) => setRegions(regions.map(r => r.id === reg.id ? {...r, name: e.target.value} : r))}
                  className="font-bold bg-transparent border-none focus:ring-0 p-0 w-2/3"
                />
                <input 
                  type="color" 
                  value={reg.color}
                  onChange={(e) => setRegions(regions.map(r => r.id === reg.id ? {...r, color: e.target.value} : r))}
                  className="w-6 h-6 rounded-full border-none p-0 overflow-hidden cursor-pointer"
                />
              </div>
              <div className="text-3xl font-mono font-bold text-indigo-600">
                {getWeight(reg.states)}
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Total Weight</p>
            </div>
          ))}
        </div>

        {/* Map Stage */}
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center">
          <div className="w-full">
            <USAMap customize={mapConfig} onClick={handleStateClick} />
          </div>
          <div className="mt-8 flex items-center gap-4 text-slate-400 text-sm border-t pt-6 w-full">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-200"></div> Unassigned
             </div>
             {regions.map(r => (
               <div key={r.id} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: r.color}}></div> {r.name}
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
