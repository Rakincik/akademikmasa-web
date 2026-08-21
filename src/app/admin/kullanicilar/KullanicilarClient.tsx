"use client";

import { useState, useMemo } from "react";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  UserPlus,
  Search,
  Copy,
  Check,
  Edit2,
  X,
  Save,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Calendar,
  KeyRound,
  ShoppingBag,
  UserCheck,
  UserX,
  MessageCircle,
  Download,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { User } from "@prisma/client";
import { updateUser, createUser, deleteUser, deleteUsers } from "./actions";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface UserWithOrders extends User {
  orders?: {
    id: string;
    status: string;
    totalAmount: number;
  }[];
}

interface KullanicilarClientProps {
  users: UserWithOrders[];
}

export default function KullanicilarClient({ users }: KullanicilarClientProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "PAID" | "UNPAID" | "ADMIN">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selection & Delete State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userToDelete, setUserToDelete] = useState<UserWithOrders | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State
  const [editingUser, setEditingUser] = useState<UserWithOrders | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    tc: "",
    address: "",
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = users.length;
    const paidStudents = users.filter(
      (u) => u.role === "STUDENT" && u.orders && u.orders.some((o) => o.status === "COMPLETED")
    ).length;
    const unpaidStudents = users.filter(
      (u) => u.role === "STUDENT" && (!u.orders || !u.orders.some((o) => o.status === "COMPLETED"))
    ).length;
    const admins = users.filter((u) => u.role === "ADMIN").length;

    return { total, paidStudents, unpaidStudents, admins };
  }, [users]);

  // Copy password to clipboard
  const handleCopyPassword = (userId: string, password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // WhatsApp quick link for potential students
  const getWhatsAppLink = (name: string, phone: string | null) => {
    if (!phone) return null;
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length === 10) cleanPhone = "90" + cleanPhone;
    if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) cleanPhone = "90" + cleanPhone.slice(1);

    const firstName = name.split(" ")[0];
    const message = encodeURIComponent(
      `Merhaba ${firstName} Hanım/Bey, Akademik Masa uzaktan eğitim paketlerimiz hakkında bilgi almak ister misiniz? Size yardımcı olmaktan memnuniyet duyarız.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Filter users by search term & tab filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.toLocaleLowerCase("tr-TR").trim();
      const matchesSearch =
        !search ||
        user.name.toLocaleLowerCase("tr-TR").includes(search) ||
        user.email.toLocaleLowerCase("tr-TR").includes(search) ||
        (user.phone && user.phone.includes(search)) ||
        (user.tc && user.tc.includes(search));

      const hasPaid = user.orders && user.orders.some((o) => o.status === "COMPLETED");

      let matchesTab = true;
      if (roleFilter === "PAID") {
        matchesTab = user.role === "STUDENT" && Boolean(hasPaid);
      } else if (roleFilter === "UNPAID") {
        matchesTab = user.role === "STUDENT" && !hasPaid;
      } else if (roleFilter === "ADMIN") {
        matchesTab = user.role === "ADMIN";
      }

      return matchesSearch && matchesTab;
    });
  }, [users, searchTerm, roleFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name, "tr");
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [filteredUsers, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(sortedUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const confirmSingleDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(userToDelete.id);
      if (res?.success) {
        setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete.id));
      } else {
        alert(res?.error || "Kullanıcı silinirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Kullanıcı silinemedi.");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await deleteUsers(selectedUsers);
      if (res?.success) {
        setSelectedUsers([]);
      } else {
        alert(res?.error || "Kullanıcılar silinirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Kullanıcılar silinemedi.");
    } finally {
      setIsDeleting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const openEditModal = (user: UserWithOrders) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      tc: user.tc || "",
      address: user.address || "",
    });
    setIsModalOpen(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setEditForm({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      tc: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editForm.name || !editForm.email) {
      alert("Lütfen ad ve e-posta alanlarını doldurun.");
      return;
    }

    setIsSaving(true);
    try {
      let res;
      if (editingUser) {
        res = await updateUser(editingUser.id, editForm);
      } else {
        res = await createUser(editForm);
      }

      if (res.success) {
        setIsModalOpen(false);
        setEditingUser(null);
      } else {
        alert(res.error);
      }
    } catch (e) {
      alert("Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  const exportToExcel = () => {
    const headers = [
      "Ad Soyad",
      "E-Posta",
      "Telefon",
      "T.C. Kimlik No",
      "Açık Adres",
      "Rol",
      "Açık Şifre",
      "Müşteri Durumu",
      "Toplam Harcama (TL)",
      "Kayıt Tarihi"
    ];

    const escapeHtml = (str: string) => {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };

    const rowsHtml = sortedUsers.map(user => {
      const name = escapeHtml(user.name || "");
      const email = escapeHtml(user.email || "");
      const phone = escapeHtml(user.phone || "");
      const tc = escapeHtml(user.tc || "");
      const address = escapeHtml((user.address || "").replace(/\r?\n|\r/g, " "));
      const role = user.role === 'ADMIN' ? 'Yönetici' : 'Öğrenci';
      const password = escapeHtml(user.password || "");
      
      const completedOrders = user.orders?.filter((o) => o.status === "COMPLETED") || [];
      const hasPaid = completedOrders.length > 0;
      const totalSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      
      const status = user.role === 'ADMIN' ? 'Yönetici' : 
                     hasPaid ? `Aktif Kursiyer (${completedOrders.length} Sipariş)` : 'Potansiyel Üye (Satın Almadı)';
      
      const date = escapeHtml(new Date(user.createdAt).toLocaleDateString('tr-TR'));

      return `
        <tr>
          <td>${name}</td>
          <td>${email}</td>
          <td style="mso-number-format:'\\@';">${phone}</td>
          <td style="mso-number-format:'\\@';">${tc}</td>
          <td>${address}</td>
          <td>${role}</td>
          <td style="mso-number-format:'\\@';">${password}</td>
          <td>${status}</td>
          <td style="mso-number-format:'#,##0.00';">${totalSpent}</td>
          <td>${date}</td>
        </tr>
      `;
    }).join("");

    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Kullanıcılar</x:Name>
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
                ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF" + template], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kullanicilar_${new Date().toISOString().slice(0, 10)}.xls`);
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
            Kullanıcı ve Şifre Yönetimi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kayıtlı kullanıcıları, satın alma durumlarına göre (Satın Alan Kursiyer vs. Potansiyel Üye) filtreleyin ve yönetin.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={exportToExcel}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Excel'e Aktar</span>
          </button>
          <button
            onClick={handleNewUser}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-brand-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yeni Kullanıcı Ekle</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {stats.total}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Toplam Kayıtlı
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 leading-none">
              {stats.paidStudents}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Satın Alan (Kursiyer)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-600 leading-none">
              {stats.unpaidStudents}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Satın Almayan (Potansiyel)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {stats.admins}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Yönetici Hesabı
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Purchase Status & Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setRoleFilter("ALL")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              roleFilter === "ALL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tüm Üyeler ({stats.total})
          </button>
          <button
            onClick={() => setRoleFilter("PAID")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              roleFilter === "PAID"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Satın Alanlar ({stats.paidStudents})
          </button>
          <button
            onClick={() => setRoleFilter("UNPAID")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              roleFilter === "UNPAID"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            Satın Almayanlar ({stats.unpaidStudents})
          </button>
          <button
            onClick={() => setRoleFilter("ADMIN")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              roleFilter === "ADMIN"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Yöneticiler ({stats.admins})
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="İsim, e-posta, telefon veya T.C. No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
            {sortedUsers.length} Sonuç
          </div>
        </div>
      </div>

      {/* Bulk Operations Banner */}
      {selectedUsers.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-red-700 font-bold text-xs md:text-sm">
              {selectedUsers.length} adet kullanıcı seçildi.
            </span>
            <button
              onClick={() => setSelectedUsers([])}
              className="text-xs text-red-600 hover:text-red-800 underline font-medium cursor-pointer"
            >
              Seçimi Temizle
            </button>
          </div>
          <button
            onClick={() => setIsBulkDeleteModalOpen(true)}
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

      {/* Users Table */}
      {/* Desktop View: Table Layout (visible on md screens and above) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      sortedUsers.length > 0 &&
                      selectedUsers.length === sortedUsers.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    <span>Ad Soyad</span>
                    <div className="text-slate-400 group-hover:text-brand-600 transition-colors">
                      {sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4">E-posta & İletişim</th>
                <th className="px-6 py-4">Müşteri / Satın Alma Durumu</th>
                <th className="px-6 py-4 bg-brand-50/70 text-brand-800 font-bold">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-brand-600" />
                    <span>Açık Şifre (Görünür)</span>
                  </div>
                </th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Kriterlere uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => {
                  const initials = user.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  const completedOrders =
                    user.orders?.filter((o) => o.status === "COMPLETED") || [];
                  const hasPaid = completedOrders.length > 0;
                  const totalSpent = completedOrders.reduce(
                    (sum, o) => sum + o.totalAmount,
                    0
                  );

                  const waLink = getWhatsAppLink(user.name, user.phone || null);

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        selectedUsers.includes(user.id) ? "bg-red-50/30" : ""
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>

                      {/* Name + Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : hasPaid
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {initials || "U"}
                          </div>
                          <div>
                            <Link
                              href={`/admin/kullanicilar/${user.id}`}
                              className="font-bold text-slate-900 text-sm hover:text-brand-600 hover:underline transition-colors block"
                            >
                              {user.name}
                            </Link>
                            {user.tc && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                T.C.: {user.tc}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="px-6 py-4">
                        <div className="text-slate-800 text-xs">{user.email}</div>
                        {user.phone && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {user.phone}
                          </div>
                        )}
                      </td>

                      {/* Purchase Status Badge */}
                      <td className="px-6 py-4">
                        {user.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-purple-200">
                            <ShieldCheck className="w-3.5 h-3.5" /> Yönetici
                          </span>
                        ) : hasPaid ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-200">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Aktif Kursiyer ({completedOrders.length} Sipariş)
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 ml-0.5">
                              Harcalama: {totalSpent.toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-amber-200">
                              <UserX className="w-3.5 h-3.5 text-amber-500" />
                              Potansiyel Üye (Satın Almadı)
                            </span>

                            {/* Convert potential lead via WhatsApp */}
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 px-2 py-0.5 rounded text-[10px] font-bold transition-colors"
                                title="Potansiyel öğrenciye satış için WhatsApp'tan yaz"
                              >
                                <MessageCircle className="w-3 h-3 text-[#25D366]" />
                                <span>WhatsApp'tan Ulaş →</span>
                              </a>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Plaintext Password with 1-Click Copy */}
                      <td className="px-6 py-4 bg-brand-50/30">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs select-all">
                            {user.password}
                          </span>
                          <button
                            onClick={() => handleCopyPassword(user.id, user.password)}
                            className="p-1.5 rounded-md hover:bg-white text-slate-500 hover:text-brand-600 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                            title="Şifreyi Kopyala"
                          >
                            {copiedId === user.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/kullanicilar/${user.id}`}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Profil & Sipariş Geçmişi"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Kullanıcıyı Sil"
                          >
                            <Trash2 className="w-4 h-4" />
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
        {sortedUsers.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-400 border border-slate-100 rounded-2xl shadow-xs">
            Kriterlere uygun kullanıcı bulunamadı.
          </div>
        ) : (
          sortedUsers.map((user) => {
            const initials = user.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const completedOrders =
              user.orders?.filter((o) => o.status === "COMPLETED") || [];
            const hasPaid = completedOrders.length > 0;
            const totalSpent = completedOrders.reduce(
              (sum, o) => sum + o.totalAmount,
              0
            );

            const waLink = getWhatsAppLink(user.name, user.phone || null);

            return (
              <div
                key={user.id}
                className={`bg-white p-4 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col gap-3 animate-in fade-in-50 duration-200 ${
                  selectedUsers.includes(user.id)
                    ? "border-red-300 bg-red-50/20"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer mr-0.5"
                    />
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : hasPaid
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {initials || "U"}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/kullanicilar/${user.id}`}
                        className="font-bold text-slate-900 text-sm hover:underline block truncate max-w-[150px]"
                      >
                        {user.name}
                      </Link>
                      {user.tc && (
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          T.C.: {user.tc}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-100">
                      Yönetici
                    </span>
                  ) : hasPaid ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50/80 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">
                      Aktif Kursiyer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-50/80 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">
                      Potansiyel Üye
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-650 border-t border-slate-50 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">E-posta:</span>
                    <span className="font-semibold text-slate-900 break-all pl-4 text-right">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Telefon:</span>
                      <span className="font-semibold text-slate-900">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kayıt Tarihi:</span>
                    <span className="text-slate-900 font-semibold">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                  {user.role !== 'ADMIN' && hasPaid && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Toplam Harcama:</span>
                      <span className="font-extrabold text-emerald-600">{totalSpent.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                  {/* Password Copier */}
                  <div className="flex items-center gap-1 bg-brand-50/30 px-2.5 py-1 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 mr-1 font-bold">Şifre:</span>
                    <span className="font-mono text-xs font-bold text-slate-800 select-all">
                      {user.password}
                    </span>
                    <button
                      onClick={() => handleCopyPassword(user.id, user.password)}
                      className="p-1 text-slate-400 hover:text-brand-650 cursor-pointer ml-1"
                      title="Şifreyi Kopyala"
                    >
                      {copiedId === user.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!hasPaid && waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-all"
                        title="WhatsApp'tan Yaz"
                      >
                        <MessageCircle className="w-4.5 h-4.5" />
                      </a>
                    )}
                    <Link
                      href={`/admin/kullanicilar/${user.id}`}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Profil Detayı"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                    </Link>
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 text-slate-400 hover:text-slate-850 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rol
                </label>
                <div className="relative">
                  <div
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 outline-none bg-white flex justify-between items-center cursor-pointer text-sm"
                    onClick={() =>
                      setIsRoleDropdownOpen(!isRoleDropdownOpen)
                    }
                  >
                    <span className="font-medium text-slate-700">
                      {editForm.role === "ADMIN" ? "Yönetici" : "Öğrenci"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isRoleDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isRoleDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsRoleDropdownOpen(false)}
                      ></div>
                      <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden text-sm">
                        <div
                          className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 transition-colors border-b border-slate-100"
                          onClick={() => {
                            setEditForm({ ...editForm, role: "STUDENT" });
                            setIsRoleDropdownOpen(false);
                          }}
                        >
                          Öğrenci
                        </div>
                        <div
                          className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 transition-colors"
                          onClick={() => {
                            setEditForm({ ...editForm, role: "ADMIN" });
                            setIsRoleDropdownOpen(false);
                          }}
                        >
                          Yönetici
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  T.C. Kimlik No
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={editForm.tc}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      tc: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Açık Adres
                </label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Şifre (Açık Metin)
                </label>
                <input
                  type="text"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                disabled={isSaving}
              >
                İptal
              </button>
              <button
                onClick={handleSaveUser}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  "Kaydediliyor..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single User Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmSingleDelete}
        title="Kullanıcıyı Sil"
        message={
          userToDelete
            ? `"${userToDelete.name}" (${userToDelete.email}) adlı kullanıcıyı sistemden silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve kullanıcıya ait tüm sipariş geçmişi de silinir.`
            : "Bu kullanıcıyı silmek istediğinize emin misiniz?"
        }
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Seçili Kullanıcıları Sil"
        message={`Seçtiğiniz ${selectedUsers.length} adet kullanıcıyı sistemden silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve kullanıcılara ait tüm sipariş geçmişi de silinir.`}
      />
    </div>
  );
}

