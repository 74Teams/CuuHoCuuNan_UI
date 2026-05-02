// src/app/dispatcher/layout.tsx
import TopbarSearch from '@/components/citizen/TopbarSearch'
import { Button } from '@/components/ui/button'
import { Activity, Bell, Settings, ShieldAlert } from 'lucide-react'

export default function DispatcherLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50">
      {/* HEADER ĐIỀU PHỐI VIÊN - Tông màu Xanh Navy đậm phong cách Admin */}
      <header className="flex items-center justify-between px-5 py-5 bg-[#0a192f] text-white border-b border-slate-800 shadow-md z-20 h-16 shrink-0 w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 text-white shadow-md">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[17px] font-black tracking-tight leading-none text-white">
                RESCUE<span className="text-blue-400">CORE</span>
              </span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] leading-none mt-1 flex items-center gap-1">
                <Activity className="w-2.5 h-2.5" /> TRUNG TÂM ĐIỀU PHỐI
              </span>
            </div>
          </div>
        </div>

        {/* Thanh tìm kiếm - Được bọc lại để phù hợp với nền tối */}
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block opacity-90 hover:opacity-100 transition-opacity">
          <TopbarSearch />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-[#0a192f]"></span>
          </Button>

          {/* Avatar Admin */}
          <div className="ml-2 h-9 w-9 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition shadow-sm">
            <span className="text-xs font-bold">AD</span>
          </div>
        </div>
      </header>

      {/* PHẦN MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <main className="flex-1 relative h-full">{children}</main>
      </div>
    </div>
  )
}
