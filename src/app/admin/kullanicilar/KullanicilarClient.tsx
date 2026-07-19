"use client";

import { useState } from "react";
import { Eye, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { User } from "@prisma/client";

interface KullanicilarClientProps {
  users: User[];
}

export default function KullanicilarClient({ users }: KullanicilarClientProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort by name if asc, else by createdAt
  const sortedUsers = [...users].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name, "tr");
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const toggleSort = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={toggleSort}
              >
                <div className="flex items-center gap-2">
                  Ad Soyad
                  <div className="text-slate-400 group-hover:text-brand-600 transition-colors">
                    {sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
                  </div>
                </div>
              </th>
              <th className="px-6 py-4">E-posta</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4 bg-brand-50 text-brand-700">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Şifre
                </div>
              </th>
              <th className="px-6 py-4">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  Henüz kayıtlı kullanıcı bulunmuyor.
                </td>
              </tr>
            ) : (
              sortedUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link href={`/admin/kullanicilar/${user.id}`} className="hover:text-brand-600 hover:underline">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="bg-slate-100 px-3 py-1.5 rounded text-sm font-mono text-slate-800 border border-slate-200 inline-block">
                      {user.password}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
