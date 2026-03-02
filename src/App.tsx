import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Mail, User, CheckCircle, ArrowRight, FileText, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={18} />
          </div>
          <span>ABC Academy</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Tài liệu</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Khóa học</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Về chúng tôi</a>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Tài liệu mới nhất 2024
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Làm chủ kỹ năng <span className="text-indigo-600">ABC</span> chỉ trong 7 ngày.
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
            Tải xuống bộ tài liệu hướng dẫn chi tiết từ cơ bản đến nâng cao. 
            Hơn 5,000 người đã đăng ký và thay đổi lộ trình sự nghiệp của mình.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "Hướng dẫn từng bước thực hành",
              "Bộ công cụ tối ưu hóa hiệu suất",
              "Case study thực tế từ chuyên gia",
              "Cập nhật miễn phí trọn đời"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle size={14} />
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/100?u=${i}`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-900">4.9/5 từ học viên</p>
              <p className="text-slate-500">Tham gia cùng cộng đồng ABC</p>
            </div>
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full -z-10"></div>
          
          <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl shadow-indigo-500/5 border border-slate-100 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Tuyệt vời!</h2>
                  <p className="text-slate-600 mb-8">
                    Tài liệu đã được gửi đến email của bạn. Bạn cũng có thể tải xuống trực tiếp tại đây.
                  </p>
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200">
                    <Download size={20} />
                    Tải xuống ngay (.PDF)
                  </button>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
                  >
                    Quay lại trang chủ
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Nhận tài liệu miễn phí</h2>
                    <p className="text-slate-500">Điền thông tin bên dưới để chúng tôi gửi tài liệu cho bạn.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Họ và tên</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          required
                          type="text"
                          placeholder="Nguyễn Văn A"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Địa chỉ Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          required
                          type="email"
                          placeholder="example@gmail.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-500 text-sm font-medium px-1">{errorMessage}</p>
                    )}

                    <button 
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 group"
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Nhận tài liệu ngay
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-6 text-slate-400">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <ShieldCheck size={14} />
                      Bảo mật 100%
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <FileText size={14} />
                      PDF 2.4MB
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
        <p>© 2024 ABC Academy. Tất cả quyền được bảo lưu.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-indigo-600 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Liên hệ</a>
        </div>
      </footer>
    </div>
  );
}
