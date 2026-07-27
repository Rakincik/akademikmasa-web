"use client";
import { useState } from "react";
import { Plus, Tag, Trash2, Edit2, BarChart2 } from "lucide-react";
import CouponModal from "@/components/admin/CouponModal";
import CouponStatsModal from "@/components/admin/CouponStatsModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { deleteCoupon } from "./actions";

export default function KuponlarClient({ initialCoupons, isInfluencerMode = false }: { initialCoupons: any[], isInfluencerMode?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedStatsCoupon, setSelectedStatsCoupon] = useState<any>(null);
  
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleViewStats = (coupon: any) => {
    setSelectedStatsCoupon(coupon);
    setIsStatsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    try {
      await deleteCoupon(couponToDelete);
    } catch (error) {
      console.error("Silme hatası:", error);
    }
    setCouponToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isInfluencerMode ? "Influencer Pazarlama" : "İndirim Kuponları"}
          </h1>
          <p className="text-slate-500">
            {isInfluencerMode 
              ? "İş ortaklarına özel oluşturulan promosyon kodları ve performans takibi." 
              : "Kullanıcıların sepet sayfasında kullanabileceği genel promosyon kodları."}
          </p>
        </div>
        <button 
          onClick={handleNew}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-500/30 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Yeni Kupon
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 pl-6 text-sm font-semibold text-slate-500">Kupon Kodu</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Kime Ait?</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Kullanım (Adet)</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Ciro</th>
                <th className="p-4 text-sm font-semibold text-slate-500">İndirim Tipi</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Tutar / Yüzde</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Durum</th>
                <th className="p-4 pr-6 text-sm font-semibold text-slate-500 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {initialCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-500">
                    <Tag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    Henüz hiç kupon oluşturulmamış.
                  </td>
                </tr>
              ) : (
                initialCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg inline-block tracking-wider">
                        {coupon.code}
                      </div>
                    </td>
                    <td className="p-4">
                      {coupon.isInfluencer ? (
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-brand-500" />
                            {coupon.influencerName}
                          </div>
                          {coupon.influencerEmail && (
                            <div className="text-xs text-slate-500 mt-0.5 ml-5">{coupon.influencerEmail}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm font-medium">Genel Kupon</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                    </td>
                    <td className="p-4 font-black text-brand-600">
                      ₺{coupon.totalRevenue.toLocaleString('tr-TR')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        coupon.discountType === 'PERCENTAGE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {coupon.discountType === 'PERCENTAGE' ? 'Yüzdelik' : 'Sabit Tutar'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      {coupon.discountType === 'PERCENTAGE' ? `%${coupon.discountValue}` : `₺${coupon.discountValue.toLocaleString('tr-TR')}`}
                    </td>
                    <td className="p-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Pasif
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleViewStats(coupon)}
                          className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Performans Gör"
                        >
                          <BarChart2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(coupon)}
                          className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setCouponToDelete(coupon.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCoupon} 
        isInfluencerMode={isInfluencerMode}
      />

      <CouponStatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)} 
        coupon={selectedStatsCoupon}
      />
      
      <DeleteConfirmModal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={confirmDelete}
        title="Kuponu Sil"
        message="Bu kuponu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve kupon bir daha kullanılamaz."
      />
    </div>
  );
}
