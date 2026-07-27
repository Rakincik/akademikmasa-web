import { useState } from "react";
import { X, TrendingUp, Users, DollarSign, Calendar, BarChart2 } from "lucide-react";

export default function CouponStatsModal({ isOpen, onClose, coupon }: { isOpen: boolean, onClose: () => void, coupon: any }) {
  const [timeFilter, setTimeFilter] = useState<"day" | "month" | "year">("day");

  if (!isOpen || !coupon) return null;

  // Usage percentage calc
  const usagePercentage = coupon.usageLimit 
    ? Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100))
    : 0;

  // Mock data for filters
  const mockData = {
    day: {
      data: [40, 70, 30, 90, 50, 100, 80],
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      title: "Gün"
    },
    month: {
      data: [20, 40, 30, 60, 80, 50, 90, 100, 70, 60, 80, 90],
      labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
      title: "Ay"
    },
    year: {
      data: [30, 60, 100, 80, 120],
      labels: ["2022", "2023", "2024", "2025", "2026"],
      title: "Yıl"
    }
  };

  const currentChart = mockData[timeFilter];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Kupon Performansı
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="text-3xl font-black text-slate-900 bg-slate-100 inline-block px-4 py-2 rounded-xl tracking-widest mb-2">
              {coupon.code}
            </div>
            {coupon.isInfluencer && (
              <p className="text-slate-500 font-medium">Influencer: {coupon.influencerName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Users className="w-4 h-4" />
                <span className="font-bold text-sm">Kullanım</span>
              </div>
              <div className="text-2xl font-black text-indigo-900">
                {coupon.usedCount}
                {coupon.usageLimit && <span className="text-base text-indigo-400 ml-1">/ {coupon.usageLimit}</span>}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-bold text-sm">Elde Edilen Ciro</span>
              </div>
              <div className="text-2xl font-black text-emerald-900">
                ₺{coupon.totalRevenue.toLocaleString('tr-TR')}
              </div>
            </div>
          </div>

          {/* Usage Limit Bar Graph */}
          {coupon.usageLimit > 0 && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-700">Kullanım Doluluk Oranı</span>
                <span className="font-black text-indigo-600 text-lg">%{usagePercentage}</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Mock Timeline Chart (CSS) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-700">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">{currentChart.title}</span>
              </div>
              
              <div className="flex items-center bg-slate-200 p-1 rounded-xl">
                <button 
                  onClick={() => setTimeFilter("day")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeFilter === 'day' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Gün
                </button>
                <button 
                  onClick={() => setTimeFilter("month")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeFilter === 'month' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Ay
                </button>
                <button 
                  onClick={() => setTimeFilter("year")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeFilter === 'year' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Yıl
                </button>
              </div>
            </div>
            
            <div className="flex items-end h-48 gap-2 pt-4 border-b border-slate-200">
              {currentChart.data.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer relative">
                  {/* Tooltip mock */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                    {height} İşlem
                  </div>
                  <div 
                    className="w-full bg-indigo-200 group-hover:bg-indigo-400 rounded-t-md transition-all duration-500" 
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              {currentChart.labels.map((label, i) => (
                <span key={i} className="flex-1 text-center truncate">{label}</span>
              ))}
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
