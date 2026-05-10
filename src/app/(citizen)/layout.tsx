import TopbarSearch from "@/components/citizen/TopbarSearch";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, Bell, User } from "lucide-react";

export default function CitizenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex flex-col w-full h-screen">
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm z-20 h-16 shrink-0 w-full">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-500 hover:text-blue-600 transition-colors" />
            <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-200">
                <Activity className="w-5 h-5 stroke-[2.5]" />

                {/* Chấm đỏ nhấp nháy báo hiệu hệ thống đang Live */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
              </div>

              {/* Phần Chữ Logo */}
              <div className="flex flex-col justify-center">
                <span className="text-[17px] font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
                    RESCUE
                  </span>
                  <span className="text-slate-800">CORE</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">
                  Điều phối trung tâm
                </span>
              </div>
            </div>
          </div>

          {/* Góc giữa: Ô tìm kiếm */}
          <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
            <TopbarSearch />
          </div>

          {/* Góc phải: Avatar & Thông báo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-slate-100"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </Button>
            <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer hover:bg-slate-800 transition">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden relative z-10">
          <main className="flex-1 relative h-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
