"use client";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalde burada API isteği atılır
    alert("Mesajınız başarıyla gönderildi!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Hero Banner */}
      <div className="bg-slate-900 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-xl mx-auto">
            Sorularınız, önerileriniz veya kayıt işlemleri için her zaman yanınızdayız. Ekibimiz size en kısa sürede dönüş yapacaktır.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: Contact Cards */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Phone Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bizi Arayın</h3>
              <p className="text-slate-500 text-sm mb-4">Hafta içi 09:00 - 18:00 saatleri arasında çağrı merkezimize ulaşabilirsiniz.</p>
              <a href="tel:05380449090" className="text-2xl font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                0538 044 90 90
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp Hattı</h3>
              <p className="text-slate-500 text-sm mb-6">Hızlı destek almak veya kaydınızı anında oluşturmak için bize yazın.</p>
              <a href="https://wa.me/905380449090" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-colors">
                Mesaj Gönder
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-500/5 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">E-Posta</h3>
              <p className="text-slate-500 text-sm mb-4">Detaylı sorularınız ve işbirlikleri için 7/24 e-posta gönderebilirsiniz.</p>
              <a href="mailto:info@akademikmasa.com" className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                info@akademikmasa.com
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form & Socials */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900 mb-8">Bize Yazın</h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Adınız Soyadınız</label>
                    <input 
                      type="text" 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Örn: Ahmet Yılmaz" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresiniz</label>
                    <input 
                      type="email" 
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="adiniz@email.com" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">Konu</label>
                  <input 
                    type="text" 
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Hangi konuda bilgi almak istersiniz?" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Mesajınız</label>
                  <textarea 
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Mesajınızı buraya yazın..." 
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Mesajı Gönder</span>
                </button>
              </form>

              {/* Social Media Section */}
              <div className="mt-16 pt-10 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Sosyal Medyada Biz</h3>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
