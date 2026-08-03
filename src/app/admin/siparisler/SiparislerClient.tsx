"use client";

import { useState, useMemo } from "react";
import { Eye, CheckCircle, Clock, XCircle, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X, ShoppingBag, Trash2, Download } from "lucide-react";
import { updateOrderStatus, deleteOrders } from "./actions";

type SortColumn = "id" | "user" | "totalAmount" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

export default function SiparislerClient({ orders }: { orders: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Sorting State
  const [sortCol, setSortCol] = useState<SortColumn>("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  
  // Filtering & Search State
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Selection State for Deletion
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error(err);
      alert("Durum güncellenirken hata oluştu.");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  };

  const getSortIcon = (col: SortColumn) => {
    if (sortCol !== col) return <ArrowUpDown className="w-4 h-4 text-slate-300" />;
    return sortDir === "asc" ? <ArrowUp className="w-4 h-4 text-brand-600" /> : <ArrowDown className="w-4 h-4 text-brand-600" />;
  };

  // Process data: filter, search, then sort
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Filter by Status
    if (filterStatus !== "ALL") {
      result = result.filter(o => o.status === filterStatus);
    }

    // Filter by Search (ID, Name, Email)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLocaleLowerCase("tr-TR");
      result = result.filter(o => 
        o.id.toLocaleLowerCase("tr-TR").includes(q) ||
        o.user.name.toLocaleLowerCase("tr-TR").includes(q) ||
        (o.user.email && o.user.email.toLocaleLowerCase("tr-TR").includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortCol) {
        case "id":
          aVal = a.id; bVal = b.id; break;
        case "user":
          aVal = a.user.name.toLowerCase(); bVal = b.user.name.toLowerCase(); break;
        case "totalAmount":
          aVal = a.totalAmount; bVal = b.totalAmount; break;
        case "status":
          aVal = a.status; bVal = b.status; break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, sortCol, sortDir, filterStatus, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredAndSortedOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;
    if (!confirm(`${selectedOrders.length} adet siparişi kalıcı olarak silmek istediğinize emin misiniz?`)) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteOrders(selectedOrders);
      if (res?.success) {
        setSelectedOrders([]);
      } else {
        alert(res?.error || "Silinirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Siparişler silinemedi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getWhatsAppLink = (phone: string | null) => {
    if (!phone) return null;
    // Sadece rakamları al
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = '90' + cleanPhone.slice(1);
    const message = encodeURIComponent("Merhaba size Akademik Masadan ulaşıyorum ödeme yaptığınıza dair bir dekont atabilir misiniz?");
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const exportToExcel = () => {
    const headers = [
      "Sipariş ID",
      "Öğrenci Adı Soyadı",
      "E-Posta",
      "Telefon",
      "T.C. Kimlik No",
      "Açık Adres",
      "Satın Alınan Eğitimler",
      "Toplam Tutar (TL)",
      "Sipariş Durumu",
      "Tarih"
    ];

    const rows = filteredAndSortedOrders.map(order => {
      const orderId = order.id;
      const name = order.user.name;
      const email = order.user.email || "";
      const phone = order.user.phone || "";
      const tc = order.user.tc || "";
      const address = (order.user.address || "").replace(/\r?\n|\r/g, " ");
      const products = order.items.map((item: any) => item.product?.title || 'Bilinmeyen Ürün').join(", ");
      const total = order.totalAmount;
      const status = order.status === 'COMPLETED' ? 'Tamamlandı' : 
                     order.status === 'PENDING' ? 'Bekliyor' : 'İptal Edildi';
      const date = new Date(order.createdAt).toLocaleString('tr-TR');

      return [
        orderId,
        name,
        email,
        phone,
        tc,
        address,
        products,
        total,
        status,
        date
      ];
    });

    const csvContent = [
      "sep=;",
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(";"),
      ...rows.map(row => row.map(val => {
        const str = String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(";"))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `siparisler_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Siparişler</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki tüm satın alımları yönetin ve filtreleyin.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Sipariş no, isim, e-posta..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            />
          </div>
          
          <div className="relative w-full sm:w-auto flex items-center">
            <Filter className="absolute left-3 w-4 h-4 text-slate-400" />
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none cursor-pointer appearance-none transition-all"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="COMPLETED">Tamamlandı</option>
              <option value="PENDING">Bekliyor</option>
              <option value="FAILED">İptal / Hata</option>
            </select>
          </div>

          <button 
            onClick={exportToExcel}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md hover:shadow-emerald-600/20 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Excel'e Aktar
          </button>
        </div>
      </div>

      {selectedOrders.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="text-red-700 font-bold">
            {selectedOrders.length} sipariş seçildi
          </div>
          <button 
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-bold transition-colors text-sm shadow-sm"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isDeleting ? "Siliniyor..." : "Seçilenleri Sil"}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox"
                    checked={filteredAndSortedOrders.length > 0 && selectedOrders.length === filteredAndSortedOrders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group" onClick={() => toggleSort("id")}>
                  <div className="flex items-center gap-2">Sipariş No <span className="opacity-0 group-hover:opacity-100 transition-opacity">{getSortIcon("id")}</span></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group" onClick={() => toggleSort("user")}>
                  <div className="flex items-center gap-2">Öğrenci {getSortIcon("user")}</div>
                </th>
                <th className="px-6 py-4 select-none">
                  <div className="flex items-center gap-2">Kurslar</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group" onClick={() => toggleSort("totalAmount")}>
                  <div className="flex items-center gap-2">Tutar {getSortIcon("totalAmount")}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group" onClick={() => toggleSort("status")}>
                  <div className="flex items-center gap-2">Durum {getSortIcon("status")}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group" onClick={() => toggleSort("createdAt")}>
                  <div className="flex items-center gap-2">Tarih {getSortIcon("createdAt")}</div>
                </th>
                <th className="px-6 py-4 text-right">Detaylar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                    Aradığınız kriterlere uygun sipariş bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{order.user.name}</span>
                        <span className="text-xs text-slate-500">{order.user.email}</span>
                        {order.user.phone && <span className="text-xs text-slate-400">{order.user.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        {order.items.map((item: any) => (
                          <span key={item.id} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md truncate" title={item.product?.title || 'Bilinmeyen Ürün'}>
                            {item.product?.title || 'Bilinmeyen Ürün'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-brand-600">
                      {order.totalAmount.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {loadingId === order.id ? (
                          <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold px-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Güncelleniyor...
                          </div>
                        ) : (
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold outline-none border cursor-pointer ${
                              order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20' :
                              order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/20' :
                              'bg-red-50 text-red-700 border-red-200 focus:ring-red-500/20'
                            }`}
                          >
                            <option value="PENDING">Bekliyor (Havale/Eksik)</option>
                            <option value="COMPLETED">Tamamlandı (Onaylı)</option>
                            <option value="FAILED">İptal Edildi</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(order.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.user.phone && (
                          <a 
                            href={getWhatsAppLink(order.user.phone) || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors inline-flex"
                            title="WhatsApp'tan Yaz"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                            </svg>
                          </a>
                        )}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors inline-flex" 
                          title="Sipariş Detayı"
                        >
                          <Eye className="w-5 h-5" />
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-600" />
                  Sipariş Detayı
                </h2>
                <p className="text-sm text-slate-500 font-mono mt-1">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Student Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Öğrenci Bilgileri</p>
                  <p className="font-bold text-slate-900">{selectedOrder.user.name}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.user.email}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.user.phone || 'Telefon yok'}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.user.tc ? `TC: ${selectedOrder.user.tc}` : 'TC kimlik yok'}</p>
                </div>
                <div className="hidden sm:block w-px bg-slate-200"></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sipariş Bilgileri</p>
                  <p className="font-bold text-slate-900">Tarih: <span className="font-normal text-slate-600">{new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</span></p>
                  <p className="font-bold text-slate-900 mt-1">Durum: <span className="font-normal text-slate-600">{
                    selectedOrder.status === 'COMPLETED' ? 'Tamamlandı' : 
                    selectedOrder.status === 'PENDING' ? 'Bekliyor' : 'İptal'
                  }</span></p>
                  {selectedOrder.paymentId && (
                    <p className="font-bold text-slate-900 mt-1">Ödeme ID: <span className="font-mono text-xs font-normal text-slate-500 break-all">{selectedOrder.paymentId}</span></p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Satın Alınan Eğitimler</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.product?.title || 'Bilinmeyen Ürün'}</p>
                        <p className="text-sm text-slate-500 truncate">{item.product?.lmsCourseId ? `LMS ID: ${item.product.lmsCourseId}` : 'LMS Entagrasyonu Yok'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-brand-600">{item.price.toLocaleString("tr-TR")} ₺</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between rounded-b-3xl">
              <span className="text-slate-500 font-medium">Toplam Tutar:</span>
              <span className="text-2xl font-black text-slate-900">{selectedOrder.totalAmount.toLocaleString("tr-TR")} ₺</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
