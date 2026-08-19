"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  X,
  ShoppingBag,
  Trash2,
  Download,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Check,
  MessageCircle,
} from "lucide-react";
import { updateOrderStatus, deleteOrders } from "./actions";

type SortColumn = "id" | "user" | "totalAmount" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

export default function SiparislerClient({ orders }: { orders: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sorting State
  const [sortCol, setSortCol] = useState<SortColumn>("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  // Filtering & Search State
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "COMPLETED" | "COMPLETED_HAVALE" | "FAILED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Selection State for Deletion
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const completedOrders = orders.filter((o) => o.status === "COMPLETED" || o.status === "COMPLETED_HAVALE");
    const completedShopierOrders = orders.filter((o) => o.status === "COMPLETED");
    const completedHavaleOrders = orders.filter((o) => o.status === "COMPLETED_HAVALE");
    const pendingOrders = orders.filter((o) => o.status === "PENDING");
    const failedOrders = orders.filter((o) => o.status === "FAILED");

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalCount,
      completedCount: completedOrders.length,
      completedShopierCount: completedShopierOrders.length,
      completedHavaleCount: completedHavaleOrders.length,
      pendingCount: pendingOrders.length,
      failedCount: failedOrders.length,
      totalRevenue,
      pendingRevenue,
    };
  }, [orders]);

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
    if (sortCol !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
    );
  };

  // Filter & Search & Sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Filter by Status Tab
    if (filterStatus !== "ALL") {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Filter by Search (ID, Name, Email, Phone)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLocaleLowerCase("tr-TR");
      result = result.filter(
        (o) =>
          o.id.toLocaleLowerCase("tr-TR").includes(q) ||
          o.user.name.toLocaleLowerCase("tr-TR").includes(q) ||
          (o.user.email && o.user.email.toLocaleLowerCase("tr-TR").includes(q)) ||
          (o.user.phone && o.user.phone.includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortCol) {
        case "id":
          aVal = a.id;
          bVal = b.id;
          break;
        case "user":
          aVal = a.user.name.toLowerCase();
          bVal = b.user.name.toLowerCase();
          break;
        case "totalAmount":
          aVal = a.totalAmount;
          bVal = b.totalAmount;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, sortCol, sortDir, filterStatus, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredAndSortedOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;
    if (
      !confirm(
        `${selectedOrders.length} adet siparişi sistemden silmek istediğinize emin misiniz?`
      )
    )
      return;

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

  const getWhatsAppLink = (name: string, phone: string | null, status: string, total: number) => {
    if (!phone) return null;
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length === 10) cleanPhone = "90" + cleanPhone;
    if (cleanPhone.length === 11 && cleanPhone.startsWith("0"))
      cleanPhone = "90" + cleanPhone.slice(1);

    const firstName = name.split(" ")[0];
    let message = "";
    if (status === "PENDING") {
      message = `Merhaba ${firstName} Hanım/Bey, Akademik Masa eğitim paketiniz için havale ödemeniz bekleniyor. Ödemeyi gerçekleştirdiyseniz dekont iletebilir misiniz? Yardımcı olmaktan memnuniyet duyarız.`;
    } else {
      message = `Merhaba ${firstName} Hanım/Bey, Akademik Masa üzerinden yapmış olduğunuz ${total.toLocaleString(
        "tr-TR"
      )} ₺ tutarındaki ödemeniz onaylanmıştır. Eğitimlerinize panelinizden hemen başlayabilirsiniz. Keyifli çalışmalar dileriz!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
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
      "Tarih",
    ];

    const escapeHtml = (str: string) => {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };

    const rowsHtml = filteredAndSortedOrders
      .map((order) => {
        const orderId = escapeHtml(order.id);
        const name = escapeHtml(order.user.name || "");
        const email = escapeHtml(order.user.email || "");
        const phone = escapeHtml(order.user.phone || "");
        const tc = escapeHtml(order.user.tc || "");
        const address = escapeHtml((order.user.address || "").replace(/\r?\n|\r/g, " "));
        const products = escapeHtml(
          order.items
            .map((item: any) => item.product?.title || "Bilinmeyen Ürün")
            .join(", ")
        );
        const total = order.totalAmount;
        const status = escapeHtml(
          order.status.startsWith("COMPLETED")
            ? (order.status === "COMPLETED_HAVALE" ? "Tamamlandı (Havale)" : "Tamamlandı (Shopier)")
            : order.status === "PENDING"
            ? "Bekliyor"
            : "İptal Edildi"
        );
        const date = escapeHtml(new Date(order.createdAt).toLocaleString("tr-TR"));

        return `
        <tr>
          <td style="mso-number-format:'\\@';">${orderId}</td>
          <td>${name}</td>
          <td>${email}</td>
          <td style="mso-number-format:'\\@';">${phone}</td>
          <td style="mso-number-format:'\\@';">${tc}</td>
          <td>${address}</td>
          <td>${products}</td>
          <td style="mso-number-format:'#,##0.00';">${total}</td>
          <td>${status}</td>
          <td>${date}</td>
        </tr>
      `;
      })
      .join("");

    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Siparişler</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Calibri, sans-serif; font-size: 11pt; }
            th { background-color: #1e293b; color: #ffffff; font-bold: bold; border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            td { border: 1px solid #e2e8f0; padding: 6px 10px; vertical-align: middle; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF" + template], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `siparisler_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sipariş Yönetim Paneli
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Akademik Masa üzerindeki tüm ödemeleri, havale bekleyenleri ve onaylanmış eğitim siparişlerini buradan yönetebilirsiniz.
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Excel'e Aktar (Türkçe)</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {stats.totalCount}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Toplam Sipariş
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 leading-none">
              {stats.totalRevenue.toLocaleString("tr-TR")} ₺
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Toplam Ciro (Onaylı)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-600 leading-none">
              {stats.pendingRevenue.toLocaleString("tr-TR")} ₺
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Bekleyen Tutar ({stats.pendingCount})
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {stats.completedCount}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Onaylanan Siparişler
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === "ALL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tümü ({stats.totalCount})
          </button>
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "PENDING"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Bekleyenler ({stats.pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("COMPLETED")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "COMPLETED"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            Shopier ({stats.completedShopierCount})
          </button>
          <button
            onClick={() => setFilterStatus("COMPLETED_HAVALE")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "COMPLETED_HAVALE"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-teal-700 hover:bg-teal-50"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Havale ({stats.completedHavaleCount})
          </button>
          <button
            onClick={() => setFilterStatus("FAILED")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "FAILED"
                ? "bg-red-600 text-white shadow-sm"
                : "text-red-700 hover:bg-red-50"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            İptal/Hata ({stats.failedCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Sipariş no, öğrenci adı, email, telefon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
            {filteredAndSortedOrders.length} Sonuç
          </div>
        </div>
      </div>

      {/* Bulk Operations Alert */}
      {selectedOrders.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-red-700 font-bold text-xs">
            {selectedOrders.length} adet sipariş seçildi.
          </div>
          <button
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-bold transition-all text-xs shadow-sm cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{isDeleting ? "Siliniyor..." : "Seçilenleri Sil"}</span>
          </button>
        </div>
      )}

      {/* Desktop View: Table Layout (visible on md screens and above) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredAndSortedOrders.length > 0 &&
                      selectedOrders.length === filteredAndSortedOrders.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                  onClick={() => toggleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    <span>Sipariş No</span>
                    {getSortIcon("id")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                  onClick={() => toggleSort("user")}
                >
                  <div className="flex items-center gap-2">
                    <span>Öğrenci</span>
                    {getSortIcon("user")}
                  </div>
                </th>
                <th className="px-6 py-4 select-none">
                  <span>Kurslar</span>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                  onClick={() => toggleSort("totalAmount")}
                >
                  <div className="flex items-center gap-2">
                    <span>Tutar</span>
                    {getSortIcon("totalAmount")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                  onClick={() => toggleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    <span>Durum</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                  onClick={() => toggleSort("createdAt")}
                >
                  <div className="flex items-center gap-2">
                    <span>Tarih</span>
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                    Kriterlere uygun sipariş kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map((order) => {
                  const waLink = getWhatsAppLink(
                    order.user.name,
                    order.user.phone || null,
                    order.status,
                    order.totalAmount
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>

                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono text-slate-500 text-[11px] font-bold">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>

                      {/* Student Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">
                            {order.user.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {order.user.email}
                          </span>
                          {order.user.phone && (
                            <span className="text-xs text-slate-400">
                              {order.user.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Course Titles */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 max-w-[240px]">
                          {order.items.map((item: any) => (
                            <span
                              key={item.id}
                              className="text-[11px] font-bold text-slate-700 bg-slate-100/70 border border-slate-200/50 px-2 py-0.5 rounded-md truncate"
                              title={item.product?.title || "Bilinmeyen Ürün"}
                            >
                              {item.product?.title || "Bilinmeyen Ürün"}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-6 py-4 font-black text-brand-600 text-sm">
                        {order.totalAmount.toLocaleString("tr-TR")} ₺
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {loadingId === order.id ? (
                            <div className="flex items-center gap-1.5 text-brand-600 text-[11px] font-bold px-2 py-1 bg-brand-50 rounded-lg">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Güncelleniyor...</span>
                            </div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold outline-none border cursor-pointer transition-all ${
                                order.status.startsWith("COMPLETED")
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-500/20"
                                  : order.status === "PENDING"
                                  ? "bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-500/20"
                                  : "bg-red-50 text-red-800 border-red-200 focus:ring-red-500/20"
                              }`}
                            >
                              <option value="PENDING">Bekliyor (Eksik/Havale)</option>
                              <option value="COMPLETED">Shopier ile Onaylı</option>
                              <option value="COMPLETED_HAVALE">Havale ile Onaylı</option>
                              <option value="FAILED">İptal / Hata</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        <div className="font-bold">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Detail & Action Links */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-all"
                              title="Öğrenciye WhatsApp'tan Durum Bilgisi Gönder"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-400 hover:text-brand-650 hover:bg-brand-50 rounded-lg transition-all cursor-pointer"
                            title="Sipariş Detayı"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View: Premium Cards List (visible on mobile only) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-400 border border-slate-100 rounded-2xl shadow-xs">
            Kriterlere uygun sipariş kaydı bulunamadı.
          </div>
        ) : (
          filteredAndSortedOrders.map((order) => {
            const waLink = getWhatsAppLink(
              order.user.name,
              order.user.phone || null,
              order.status,
              order.totalAmount
            );

            return (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                    <span className="font-mono text-slate-500 text-[10px] font-bold">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  
                  {loadingId === order.id ? (
                    <span className="text-[10px] text-slate-400">Güncelleniyor...</span>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold outline-none border cursor-pointer ${
                        order.status.startsWith("COMPLETED")
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : order.status === "PENDING"
                          ? "bg-amber-50 text-amber-850 border-amber-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      <option value="PENDING">Bekliyor</option>
                      <option value="COMPLETED">Onay (Shopier)</option>
                      <option value="COMPLETED_HAVALE">Onay (Havale)</option>
                      <option value="FAILED">İptal</option>
                    </select>
                  )}
                </div>

                <div className="space-y-1.5 text-xs border-t border-slate-50 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Öğrenci:</span>
                    <span className="font-bold text-slate-900">{order.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tarih:</span>
                    <span className="text-slate-650 font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")} {new Date(order.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Satın Alınan Kurslar:</span>
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((item: any) => (
                        <span
                          key={item.id}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-full"
                        >
                          {item.product?.title || "Bilinmeyen Ürün"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Tutar</span>
                    <span className="font-black text-brand-650 text-sm">
                      {order.totalAmount.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-all"
                        title="WhatsApp Bildirimi Gönder"
                      >
                        <MessageCircle className="w-4.5 h-4.5" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-slate-400 hover:text-brand-650 hover:bg-brand-50 rounded-lg transition-all cursor-pointer"
                      title="Sipariş Detayı"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-600" />
                  Sipariş Detayı
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  ID: {selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Student & Billing Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Öğrenci Bilgileri
                  </p>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {selectedOrder.user.name}
                  </p>
                  <p className="text-slate-600 mt-1">{selectedOrder.user.email}</p>
                  <p className="text-slate-600">{selectedOrder.user.phone || "Telefon belirtilmedi"}</p>
                  {selectedOrder.user.tc && (
                    <p className="text-slate-600 font-mono mt-0.5">
                      TC: {selectedOrder.user.tc}
                    </p>
                  )}
                </div>

                <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Sipariş & Teslimat
                  </p>
                  <p className="font-bold text-slate-900">
                    Tarih:{" "}
                    <span className="font-normal text-slate-600">
                      {new Date(selectedOrder.createdAt).toLocaleString("tr-TR")}
                    </span>
                  </p>
                  <p className="font-bold text-slate-900 mt-1">
                    Durum:{" "}
                    <span className="font-normal text-slate-600">
                      {selectedOrder.status === "COMPLETED"
                        ? "Tamamlandı"
                        : selectedOrder.status === "PENDING"
                        ? "Bekliyor"
                        : "İptal"}
                    </span>
                  </p>
                  {selectedOrder.user.address && (
                    <div className="mt-2.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Açık Adres (Teslimat)
                      </p>
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed max-h-24 overflow-y-auto custom-scrollbar font-medium">
                        {selectedOrder.user.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">
                  Satın Alınan Kurslar
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors bg-white"
                    >
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                          <ShoppingBag className="w-5 h-5 text-slate-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {item.product?.title || "Bilinmeyen Ürün"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {item.product?.lmsCourseId
                            ? `LMS ID: ${item.product.lmsCourseId}`
                            : "LMS Entegrasyonu yok"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-brand-600 text-sm">
                          {item.price.toLocaleString("tr-TR")} ₺
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between rounded-b-3xl">
              <span className="text-slate-500 font-bold text-xs">Toplam Tutar:</span>
              <span className="text-xl font-black text-slate-900">
                {selectedOrder.totalAmount.toLocaleString("tr-TR")} ₺
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
