'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, LocateFixed, Send, Info } from "lucide-react";

export default function SubmitRequestPage() {
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ================= CỘT TRÁI: FORM ĐIỀN THÔNG TIN ================= */}
        <div className="flex-1">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            * Cấp bách
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-2 text-slate-900 tracking-tight">
            Gửi Yêu Cầu Cứu Trợ
          </h1>
          <p className="text-slate-500 mb-8">
            Vui lòng cung cấp thông tin chính xác nhất để đội cứu hộ có thể tiếp cận bạn nhanh chóng. Thông tin của bạn sẽ được bảo mật.
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Số điện thoại *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  className="pl-10 bg-slate-50 border-slate-200 h-12 text-md rounded-xl" 
                  placeholder="0xxx xxx xxx" 
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 italic">Chúng tôi sẽ gọi lại để xác nhận vị trí.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Địa chỉ</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    className="pl-10 bg-slate-50 border-slate-200 h-12 rounded-xl" 
                    placeholder="Số nhà, tên đường, phường/xã..." 
                  />
                </div>
                <Button type="button" variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-[#003da5] h-12 px-6 rounded-xl font-semibold">
                  <LocateFixed className="w-5 h-5 mr-2" />
                  Lấy vị trí hiện tại
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Mô tả tình trạng hiện tại</label>
              <Textarea 
                className="bg-slate-50 border-slate-200 min-h-[120px] rounded-xl text-md p-4" 
                placeholder="Ví dụ: Đang bị cô lập do nước dâng cao, cần lương thực và nước uống cho 3 người..." 
              />
            </div>

            <Button type="button" className="w-full md:w-auto bg-[#003da5] hover:bg-blue-800 text-white h-14 px-8 text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
              Gửi Yêu Cầu
              <Send className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>

        <div className="w-full lg:w-[350px] space-y-6">
          <div className="bg-[#f0f7ff] rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 text-[#003da5] font-bold mb-4 text-lg">
              <Info className="w-6 h-6" />
            </div>
            <ul className="space-y-4 text-sm text-blue-900">
              <li className="flex gap-3">
                <span className="bg-blue-200 text-[#003da5] font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span> 
                Giữ điện thoại luôn bật và đảm bảo có sóng.
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-200 text-[#003da5] font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span> 
                Nếu có thể, hãy di chuyển lên vị trí cao hơn.
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-200 text-[#003da5] font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span> 
                Sử dụng đèn pin hoặc vải màu sáng để làm tín hiệu.
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between text-lg">
              Đường dây nóng
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Cứu hỏa</span>
                <span className="font-bold text-red-600">114</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Cấp cứu</span>
                <span className="font-bold text-red-600">115</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Cứu hộ địa phương</span>
                <span className="font-bold text-[#003da5]">024 123 456</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}