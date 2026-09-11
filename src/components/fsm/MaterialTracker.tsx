import React, { useState } from 'react';
import {
  Package,
  Plus,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
} from 'lucide-react';
import { MaterialIndent, AppUser, WorkOrder } from '../../types';

interface MaterialTrackerProps {
  materials: MaterialIndent[];
  workOrders: WorkOrder[];
  currentUser: AppUser;
  onAddMaterialIndent: (indent: Partial<MaterialIndent>) => void;
  onApproveIndent: (indentId: string) => void;
}

export const MaterialTracker: React.FC<MaterialTrackerProps> = ({
  materials,
  workOrders,
  currentUser,
  onAddMaterialIndent,
  onApproveIndent,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // New Indent Form State
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<MaterialIndent['category']>('STEEL_SECTIONS');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('MT');
  const [urgency, setUrgency] = useState<MaterialIndent['urgency']>('HIGH');
  const [purpose, setPurpose] = useState('');

  const canApprove = currentUser.role === 'OWNER' || currentUser.role === 'HOD';

  const filteredMaterials = materials.filter((m) => {
    if (filterType === 'ALL') return true;
    return m.category === filterType;
  });

  const handleCreateIndent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    onAddMaterialIndent({
      workOrderId: 'wo-01',
      workOrderTitle: 'Pellet Plant 1.2 MTPA Structural',
      siteId: 'site-mmil-vzm',
      siteName: 'MMIL Vizianagaram Plant Site',
      itemName,
      category: itemCategory,
      quantityRequested: Number(quantity),
      quantityDelivered: 0,
      stockRemainingAtSite: 0,
      unit,
      urgency,
      status: 'REQUESTED',
      requestedBy: currentUser.name,
      requestDate: new Date().toISOString().split('T')[0],
      purpose,
    });

    setShowModal(false);
    setItemName('');
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Material Indents & Site Yard Stock
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Heavy structural steel, welding consumables, high-tensile bolts & crane dispatch indents
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Raise Material Indent</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'STEEL_SECTIONS', 'FASTENERS', 'CONSUMABLES', 'MACHINERY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterType === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {mat.category.replace('_', ' ')}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    mat.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : mat.status === 'APPROVED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {mat.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2">{mat.itemName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{mat.purpose}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Requested</span>
                  <span className="font-extrabold text-slate-900">
                    {mat.quantityRequested} {mat.unit}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">At Site Yard</span>
                  <span className="font-extrabold text-emerald-600">
                    {mat.stockRemainingAtSite} {mat.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>By: {mat.requestedBy}</span>
                <span>Date: {mat.requestDate}</span>
              </div>

              {canApprove && mat.status === 'REQUESTED' && (
                <button
                  onClick={() => onApproveIndent(mat.id)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Approve Indent & Dispatch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Raise Indent */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Raise Site Material & Equipment Indent</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIndent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MS Chequered Plates 8mm thick"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  >
                    <option value="STEEL_SECTIONS">Steel Sections / Beams</option>
                    <option value="FASTENERS">Fasteners / HT Bolts</option>
                    <option value="CONSUMABLES">Welding Consumables</option>
                    <option value="MACHINERY">Machinery / Crane Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency (Plant Stoppage)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="MT / Pkts / Nos / Hours"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Location & Purpose</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Walkway flooring fabrication at pellet plant tower elevation +18m."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Submit Indent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
