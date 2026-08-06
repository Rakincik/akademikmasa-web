"use client";
import { useState, useEffect } from "react";
import {
  X,
  Tag,
  Percent,
  DollarSign,
  Loader2,
  Dices,
  UserCheck,
  Search,
  ShoppingCart,
  User,
  Check,
  Calendar,
  Layers,
} from "lucide-react";
import { saveCoupon } from "@/app/admin/kuponlar/actions";

export default function CouponModal({
  isOpen,
  onClose,
  initialData,
  isInfluencerMode = false,
  products = [],
  users = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  isInfluencerMode?: boolean;
  products?: any[];
  users?: any[];
}) {
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    discountType: "FIXED",
    discountValue: "",
    isActive: true,
    isInfluencer: isInfluencerMode,
    influencerName: "",
    influencerEmail: "",
    onlyPreviousBuyers: false,
    allowedUserEmails: [] as string[],
    minOrderAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    allowedProductIds: [] as string[],
  });

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setUserSearchTerm("");
      setIsUserDropdownOpen(false);

      if (initialData) {
        setFormData({
          id: initialData.id,
          code: initialData.code,
          discountType: initialData.discountType,
          discountValue: initialData.discountValue.toString(),
          isActive: initialData.isActive,
          isInfluencer: initialData.isInfluencer || false,
          influencerName: initialData.influencerName || "",
          influencerEmail: initialData.influencerEmail || "",
          onlyPreviousBuyers: initialData.onlyPreviousBuyers || false,
          allowedUserEmails: initialData.allowedUserEmails || [],
          minOrderAmount: initialData.minOrderAmount
            ? initialData.minOrderAmount.toString()
            : "",
          startDate: initialData.startDate
            ? new Date(initialData.startDate).toISOString().slice(0, 16)
            : "",
          endDate: initialData.endDate
            ? new Date(initialData.endDate).toISOString().slice(0, 16)
            : "",
          usageLimit: initialData.usageLimit
            ? initialData.usageLimit.toString()
            : "",
          allowedProductIds: initialData.allowedProductIds || [],
        });
      } else {
        setFormData({
          id: "",
          code: "",
          discountType: "FIXED",
          discountValue: "",
          isActive: true,
          isInfluencer: isInfluencerMode,
          influencerName: "",
          influencerEmail: "",
          onlyPreviousBuyers: false,
          allowedUserEmails: [],
          minOrderAmount: "",
          startDate: "",
          endDate: "",
          usageLimit: "",
          allowedProductIds: [],
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let random = "";
    for (let i = 0; i < 6; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code: `AKM-${random}` }));
  };

  const filteredUsersList = users.filter((u) => {
    const q = userSearchTerm.toLocaleLowerCase("tr-TR").trim();
    if (!q) return true;
    return (
      u.name.toLocaleLowerCase("tr-TR").includes(q) ||
      u.email.toLocaleLowerCase("tr-TR").includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const handleSelectUser = (email: string) => {
    const lowerEmail = email.toLowerCase();
    if (!formData.allowedUserEmails.includes(lowerEmail)) {
      setFormData((prev) => ({
        ...prev,
        allowedUserEmails: [...prev.allowedUserEmails, lowerEmail],
      }));
    }
    setUserSearchTerm("");
    setIsUserDropdownOpen(false);
  };

  const handleRemoveUser = (emailToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedUserEmails: prev.allowedUserEmails.filter(
        (email) => email !== emailToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (!formData.code || !formData.discountValue) {
        throw new Error("Lütfen zorunlu alanları doldurun.");
      }

      await saveCoupon({
        ...formData,
        discountValue: parseFloat(formData.discountValue),
      });

      onClose();
    } catch (error: any) {
      setErrorMsg(error.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? "Kuponu Düzenle" : "Yeni Kupon Ekle"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Basic Details & Value */}
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-600" />
                    Kupon & İndirim Tanımları
                  </h3>
                </div>

                {/* Code Input + Random Generator */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Kupon Kodu
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Dices className="w-3.5 h-3.5" /> Kod Üret
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Örn: YAZ100 veya AKM-X7K9P"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all uppercase font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                {/* Type */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, discountType: "FIXED" })
                    }
                    className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      formData.discountType === "FIXED"
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span className="font-bold text-xs">Sabit İndirim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, discountType: "PERCENTAGE" })
                    }
                    className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      formData.discountType === "PERCENTAGE"
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <Percent className="w-5 h-5" />
                    <span className="font-bold text-xs">Yüzdelik İndirim</span>
                  </button>
                </div>

                {/* Value & Min Order Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      İndirim Miktarı {formData.discountType === "PERCENTAGE" ? "(%)" : "(₺)"}
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({ ...formData, discountValue: e.target.value })
                      }
                      placeholder={
                        formData.discountType === "PERCENTAGE"
                          ? "Örn: 15"
                          : "Örn: 250"
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
                      Min Sepet (₺)
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, minOrderAmount: e.target.value })
                      }
                      placeholder="Örn: 1500"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Date Constraints */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="col-span-2 mb-1">
                    <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Tarih ve Limit Ayarları
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      Kullanım Sınırı (Adet)
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: e.target.value })
                      }
                      placeholder="Örn: 100 (Sınırsız için boş bırakın)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Status Switch */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Kupon Durumu</p>
                    <p className="text-[10px] text-slate-500">
                      Müşteriler bu kuponu hemen kullanabilsin mi?
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Right Column: User Selection, Loyalty & Allowed Products */}
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-600" />
                    Öğrenci & Kurs İzinleri
                  </h3>
                </div>

                {/* Loyalty Program Toggle */}
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      Sadece Eski / Mevcut Öğrencilere Özel
                    </p>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.onlyPreviousBuyers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            onlyPreviousBuyers: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-emerald-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Bu indirim kuponunu sadece daha önce en az 1 tamamlanmış siparişi bulunan öğrenciler kullanabilir.
                  </p>
                </div>

                {/* Multi-User Selector Component */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-600" />
                      Kişiye Özel Kupon (Öğrenci Sınırla)
                    </label>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Kuponu sadece belirli bir grup öğrenciye kısıtlayın. (Boş kalırsa herkese açıktır)
                    </p>
                  </div>

                  {/* Selected Users Badges */}
                  {formData.allowedUserEmails.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-slate-200 rounded-xl max-h-24 overflow-y-auto custom-scrollbar">
                      {formData.allowedUserEmails.map((email) => {
                        const uObj = users.find(
                          (u) => u.email.toLowerCase() === email.toLowerCase()
                        );
                        return (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-850 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                          >
                            <span>{uObj?.name || email}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveUser(email)}
                              className="text-slate-400 hover:text-red-650 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* User Search Input */}
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Öğrenci adı, e-posta veya telefon ile ara..."
                        value={userSearchTerm}
                        onFocus={() => setIsUserDropdownOpen(true)}
                        onChange={(e) => {
                          setUserSearchTerm(e.target.value);
                          setIsUserDropdownOpen(true);
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs font-semibold"
                      />
                    </div>

                    {isUserDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsUserDropdownOpen(false)}
                        ></div>
                        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
                          {filteredUsersList.length === 0 ? (
                            <div className="p-2.5 text-[11px] text-slate-400 text-center">
                              Eşleşen öğrenci bulunamadı.
                            </div>
                          ) : (
                            filteredUsersList.map((user) => {
                              const isSelected = formData.allowedUserEmails.includes(
                                user.email.toLowerCase()
                              );
                              return (
                                <div
                                  key={user.id}
                                  onClick={() => {
                                    if (isSelected) {
                                      handleRemoveUser(user.email);
                                    } else {
                                      handleSelectUser(user.email);
                                    }
                                  }}
                                  className={`p-2 cursor-pointer border-b border-slate-100 last:border-0 transition-colors flex items-center justify-between text-[11px] ${
                                    isSelected
                                      ? "bg-brand-50/50"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div>
                                    <p className="font-bold text-slate-900">
                                      {user.name}
                                    </p>
                                    <p className="text-[9px] text-slate-500">
                                      {user.email} {user.phone ? `• ${user.phone}` : ""}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-brand-600" />
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Allowed Products Selector */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-600" />
                      Geçerli Olacağı Kurslar / Eğitimler
                    </label>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Kuponun hangi eğitimlerde geçerli olacağını seçin. (Boş kalırsa tüm ürünlerde geçerlidir)
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, allowedProductIds: [] })
                      }
                      className={`flex-1 py-1.5 px-3 rounded-lg border font-bold text-[10px] transition-all cursor-pointer ${
                        formData.allowedProductIds.length === 0
                          ? "bg-white border-brand-500 text-brand-700 shadow-2xs"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      Tüm Eğitimler
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          formData.allowedProductIds.length === 0 &&
                          products.length > 0
                        ) {
                          setFormData({
                            ...formData,
                            allowedProductIds: [products[0].id],
                          });
                        }
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg border font-bold text-[10px] transition-all cursor-pointer ${
                        formData.allowedProductIds.length > 0
                          ? "bg-white border-brand-500 text-brand-700 shadow-2xs"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      Seçili Kurslar ({formData.allowedProductIds.length})
                    </button>
                  </div>

                  {formData.allowedProductIds.length > 0 && (
                    <div className="border border-slate-200 rounded-xl p-2.5 bg-white max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar">
                      {products.map((product) => {
                        const isChecked = formData.allowedProductIds.includes(
                          product.id
                        );
                        return (
                          <label
                            key={product.id}
                            className="flex items-center gap-2.5 cursor-pointer p-1 hover:bg-slate-50 rounded-lg transition-colors text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let updatedIds = [...formData.allowedProductIds];
                                if (e.target.checked) {
                                  if (!updatedIds.includes(product.id)) {
                                    updatedIds.push(product.id);
                                  }
                                } else {
                                  updatedIds = updatedIds.filter(
                                    (id) => id !== product.id
                                  );
                                }
                                setFormData({
                                  ...formData,
                                  allowedProductIds: updatedIds,
                                });
                              }}
                              className="rounded text-brand-600 focus:ring-brand-500 w-3.5 h-3.5 border-slate-300 cursor-pointer"
                            />
                            <span className="text-[11px] font-semibold text-slate-700 select-none truncate">
                              {product.title}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Influencer Toggle */}
                {!isInfluencerMode && (
                  <div className="flex items-center justify-between p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
                    <div>
                      <p className="font-bold text-brand-900 text-xs">
                        Influencer / İş Ortağı Kuponu
                      </p>
                      <p className="text-[10px] text-brand-700 mt-0.5">
                        Bu kuponu özel bir iş ortağına / influencer'a atayın.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.isInfluencer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isInfluencer: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                )}

                {/* Influencer Details */}
                {formData.isInfluencer && (
                  <div className="space-y-4 p-4 border border-brand-100 rounded-2xl bg-white animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        İş Ortağı / Influencer Adı
                      </label>
                      <input
                        type="text"
                        value={formData.influencerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            influencerName: e.target.value,
                          })
                        }
                        placeholder="Örn: Ayşe Yılmaz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs"
                        required={formData.isInfluencer}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        E-Posta Adresi (İsteğe Bağlı)
                      </label>
                      <input
                        type="email"
                        value={formData.influencerEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            influencerEmail: e.target.value,
                          })
                        }
                        placeholder="Örn: ayse@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mx-6 mb-4 p-3.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-xs"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md hover:shadow-brand-600/20"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {initialData ? "Değişiklikleri Kaydet" : "Kuponu Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
