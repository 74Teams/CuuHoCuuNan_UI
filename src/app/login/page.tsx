"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useLogin } from "@/lib/api/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      toast.success("Đăng nhập thành công");
    } catch (err) {
      toast.error("Đăng nhập thất bại", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-100">
      {/* Background accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-red-500/15 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Hero Section */}
          <div className="flex flex-col justify-center gap-8">
            <div className="space-y-1">
              <Badge className="w-fit bg-red-500/20 text-red-200 hover:bg-red-500/20 border-red-500/30">
                RESCUE SYSTEM
              </Badge>
              <p className="text-xs uppercase tracking-widest text-slate-400 mt-4">
                Trung tâm điều phối cứu hộ
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Đăng nhập bằng điều khiển <span className="text-red-400">cứu hộ</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                Tiếp nhận và điều phối yêu cầu khẩn cấp với hệ thống theo thời gian thực.
                Kết nối với các đội cứu hộ và cập nhật tình hình nhanh chóng.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-lg border border-slate-700/50 bg-slate-900/30 p-4 backdrop-blur hover:border-red-500/30 transition">
                <div className="text-red-400 text-sm font-semibold">24/7 Hoạt động</div>
                <p className="mt-1 text-sm text-slate-400">Nhận và xử lý yêu cầu lúc nào</p>
              </div>
              <div className="group rounded-lg border border-slate-700/50 bg-slate-900/30 p-4 backdrop-blur hover:border-blue-500/30 transition">
                <div className="text-blue-400 text-sm font-semibold">Theo thời gian thực</div>
                <p className="mt-1 text-sm text-slate-400">Cập nhật tình trạng các đội cứu</p>
              </div>
              <div className="group rounded-lg border border-slate-700/50 bg-slate-900/30 p-4 backdrop-blur hover:border-cyan-500/30 transition">
                <div className="text-cyan-400 text-sm font-semibold">Bảo mật cao</div>
                <p className="mt-1 text-sm text-slate-400">Xác thực bằng mã hai yếu tố</p>
              </div>
              <div className="group rounded-lg border border-slate-700/50 bg-slate-900/30 p-4 backdrop-blur hover:border-green-500/30 transition">
                <div className="text-green-400 text-sm font-semibold">Đạt tốc độ</div>
                <p className="mt-1 text-sm text-slate-400">Đường dây truyền tin tức đường</p>
              </div>
            </div>
          </div>

          {/* Login Form Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-slate-700/50 bg-slate-900/40 shadow-2xl shadow-black/50 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>
                  Nhập thông tin tài khoản để truy cập bảng điều khiển cứu hộ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-200">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="dieu_phoi@rescue.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 focus:border-red-500/50 focus:ring-red-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-slate-200">
                        Mật khẩu
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 focus:border-red-500/50 focus:ring-red-500/20"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-10"
                    disabled={login.isPending}
                  >
                    {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>

                {/* Alternative info */}
                <div className="mt-6 flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <p className="text-xs text-slate-400">
                    Sử dụng tài khoản điều phối hoặc rescuer của bạn
                  </p>
                </div>
              </CardContent>

              <Separator className="bg-slate-700/30" />

              <CardFooter className="flex flex-col items-start gap-3 pt-4">
                <p className="text-xs text-slate-400">
                  Không có tài khoản?{" "}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300">
                    Đăng ký tại đây
                  </Link>
                </p>
                <Link
                  href="/"
                  className="text-xs text-slate-500 hover:text-slate-400 transition"
                >
                  ← Quay về trang chính
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
