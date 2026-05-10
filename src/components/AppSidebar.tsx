"use client";

import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  FileVideo,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  MapPinned,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

import { dictPriority, dictType } from "@/constants/dictionary";
import {
  type CitizenRequestSubmissionInput,
  useCreateCitizenRequestMutation,
} from "@/lib/api/citizen-requests";
import CitizenRequestDetailDialog from "./citizen/CitizenRequestDetailDialog";

import {
  EmergencyCategory,
  OsmAddressResult,
  RequestDetail,
  RequestPriority,
} from "@/types/request";
import { toast } from "sonner";

export function AppSidebar({ requests }: { requests: RequestDetail[] }) {
  const createRequestMutation = useCreateCitizenRequestMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [emergencyType, setEmergencyType] =
    useState<EmergencyCategory>("FLOOD");
  const [priority, setPriority] = useState<RequestPriority>("CRITICAL");
  const [description, setDescription] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [landmarkInput, setLandmarkInput] = useState("");
  const [gpsStatus, setGpsStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [gpsCoords, setGpsCoords] = useState("");
  const [addressResults, setAddressResults] = useState<OsmAddressResult[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const skipAddressSearch = useRef(false);

  const [attachments, setAttachments] = useState<
    { file: File; preview: string; type: string }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gpsCoords) {
      toast.error("Vui lòng lấy tọa độ GPS trước khi gửi!");
      return;
    }

    const [lat, lng] = gpsCoords
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    const payload: CitizenRequestSubmissionInput = {
      emergencyType,
      priority,
      description,
      address: addressInput || "Chưa có địa chỉ",
      latitude: lat,
      longitude: lng,
      landmark: landmarkInput || undefined,
      medias: attachments.map((item) => item.file),
    };

    try {
      await createRequestMutation.mutateAsync(payload);
      toast.success("Đã gửi yêu cầu thành công!");
      setIsDialogOpen(false);
      setAttachments([]);
      setGpsCoords("");
      setAddressInput("");
      setLandmarkInput("");
      setDescription("");
      setEmergencyType("FLOOD");
      setPriority("CRITICAL");
    } catch (error) {
      toast.error("Không thể gửi yêu cầu", {
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    setGpsStatus("loading");
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsStatus("success");
        setGpsCoords(
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        );
        setTimeout(() => setGpsStatus("idle"), 3000);
      },
      () => {
        setGpsStatus("error");
        setTimeout(() => setGpsStatus("idle"), 3000);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  };

  useEffect(() => {
    if (!addressInput.trim()) {
      setAddressResults([]);
      setShowAddressDropdown(false);
      return;
    }

    if (skipAddressSearch.current) {
      skipAddressSearch.current = false;
      return;
    }

    const delayFn = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=4&countrycodes=vn`,
        );
        const data = await res.json();
        setAddressResults(data);
        setShowAddressDropdown(true);
      } catch (error) {
        console.error("Lỗi tìm địa chỉ form:", error);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 600);

    return () => clearTimeout(delayFn);
  }, [addressInput]);

  const handleSelectAddress = (fullAddress: string) => {
    skipAddressSearch.current = true;
    setAddressInput(fullAddress);
    setShowAddressDropdown(false);
  };

  return (
    <Sidebar className="bg-white">
      <SidebarHeader className="h-16 border-0" />
      <SidebarContent className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-3">
        {requests.map((requestItem) => (
          <div
            key={requestItem.id}
            className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm group-hover:text-[#003da5] transition-colors">
                  {dictType[requestItem.emergencyType] ||
                    requestItem.emergencyType}
                </span>
                <span
                  className="text-[9px] text-slate-400 font-mono mt-0.5"
                  title={requestItem.id}
                >
                  ID-{requestItem.id.substring(0, 4)}...
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                  requestItem.priority === "CRITICAL"
                    ? "bg-red-100 text-red-700"
                    : requestItem.priority === "HIGH"
                      ? "bg-orange-100 text-orange-700"
                      : requestItem.priority === "MEDIUM"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                }`}
              >
                {dictPriority[requestItem.priority]}
              </span>
            </div>

            <div className="space-y-1.5 mt-3 mb-3">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span className="line-clamp-2 leading-snug">
                  {requestItem.location.address}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                {new Date(requestItem.submittedTime).toLocaleString("vi-VN")}
              </div>
            </div>

            <CitizenRequestDetailDialog request={requestItem}>
              <Button
                variant="ghost"
                className="w-full mt-2 h-9 text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 border border-dashed border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 group/btn cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 ">
                  <Info className="w-3.5 h-3.5 transition-transform group-hover/btn:rotate-12" />
                  Xem chi tiết báo cáo
                </div>
              </Button>
            </CitizenRequestDetailDialog>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#003da5] hover:bg-blue-900 active:bg-blue-950 active:scale-95 text-white font-semibold py-6 rounded-xl shadow-md hover:shadow-lg active:shadow-sm text-base transition-all cursor-pointer duration-200">
              Gửi yêu cầu cứu trợ
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl bg-white rounded-2xl overflow-visible max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Cấp bách
                </span>
              </div>
              <DialogTitle className="text-2xl font-extrabold mt-2 text-slate-900">
                Gửi Yêu Cầu Cứu Trợ
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Điền thông tin chính xác để đội cứu hộ tiếp cận nhanh nhất.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-5 mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-9 bg-slate-50 border-slate-200"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-9 bg-slate-50 border-slate-200"
                      placeholder="0905 xxx xxx"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Loại sự cố *
                  </label>
                  <Select
                    value={emergencyType}
                    onValueChange={(value) =>
                      setEmergencyType(value as EmergencyCategory)
                    }
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="-- Chọn sự cố --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIRE">Hỏa hoạn / Cháy nổ</SelectItem>
                      <SelectItem value="FLOOD">Ngập lụt / Lũ quét</SelectItem>
                      <SelectItem value="MEDICAL">Cấp cứu y tế</SelectItem>
                      <SelectItem value="LANDSLIDE">Sạt lở đất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Mức độ ưu tiên *
                  </label>
                  <Select
                    value={priority}
                    onValueChange={(value) =>
                      setPriority(value as RequestPriority)
                    }
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-red-600 font-medium">
                      <SelectValue placeholder="-- Chọn mức độ --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="CRITICAL"
                        className="text-red-600 font-bold"
                      >
                        CRITICAL - Cực kỳ khẩn cấp
                      </SelectItem>
                      <SelectItem
                        value="HIGH"
                        className="text-orange-600 font-bold"
                      >
                        HIGH - Nguy hiểm cao
                      </SelectItem>
                      <SelectItem value="MEDIUM" className="text-blue-600">
                        MEDIUM - Trung bình
                      </SelectItem>
                      <SelectItem value="LOW" className="text-slate-600">
                        LOW - Thấp
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
                  <MapPinned className="w-5 h-5 text-[#003da5]" />
                  Thông tin vị trí sự cố
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    1. Tọa độ bản đồ
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gpsStatus === "loading"}
                      className={`transition-all duration-200 active:scale-95 h-10 w-36 cursor-pointer ${
                        gpsStatus === "success"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : gpsStatus === "error"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-[#003da5] text-white hover:bg-blue-800"
                      }`}
                    >
                      {gpsStatus === "idle" && (
                        <>
                          <LocateFixed className="w-4 h-4 mr-2" /> Lấy GPS
                        </>
                      )}
                      {gpsStatus === "loading" && (
                        <span className="animate-pulse text-xs">
                          Đang dò tìm...
                        </span>
                      )}
                      {gpsStatus === "success" && (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Đã xác định
                        </>
                      )}
                      {gpsStatus === "error" && (
                        <>
                          <AlertCircle className="w-4 h-4 mr-2" /> Lỗi định vị
                        </>
                      )}
                    </Button>
                    {gpsCoords && (
                      <div className="text-sm font-mono text-green-700 bg-white px-3 py-2 rounded-lg border border-green-100 flex-1 text-center shadow-sm">
                        {gpsCoords}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-50">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                      2. Địa chỉ cụ thể
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        className="pl-9 bg-white border-slate-200"
                        placeholder="Số nhà, tên đường..."
                        value={addressInput}
                        onChange={(e) => {
                          setAddressInput(e.target.value);
                          setShowAddressDropdown(true);
                        }}
                      />
                      {isSearchingAddress && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
                      )}
                    </div>
                    {showAddressDropdown && addressResults.length > 0 && (
                      <div className="absolute top-[60px] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[60]">
                        {addressResults.map(
                          (item: OsmAddressResult, index: number) => (
                            <button
                              key={item.place_id || index}
                              onClick={() =>
                                handleSelectAddress(item.display_name)
                              }
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-none transition-colors truncate"
                            >
                              {item.display_name}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                      3. Mốc nhận diện (Landmark)
                    </label>
                    <Input
                      className="bg-white border-slate-200"
                      placeholder="Ví dụ: Gần trường học, ngã tư..."
                      value={landmarkInput}
                      onChange={(e) => setLandmarkInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Mô tả tình trạng chi tiết *
                </label>
                <Textarea
                  className="bg-slate-50 border-slate-200 min-h-[80px]"
                  placeholder="Nước ngập đến đâu? Có trẻ em/người già không?..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Đính kèm minh chứng (Ảnh/Video)
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  {attachments.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200 bg-white"
                    >
                      {item.type === "image" ? (
                        <Image
                          src={item.preview}
                          alt="Tệp đính kèm"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileVideo className="text-slate-400 w-5 h-5" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-white hover:border-[#003da5] transition-all group">
                    <Camera className="w-5 h-5 text-slate-400 group-hover:text-[#003da5]" />
                    <span className="text-[9px] text-slate-500 font-medium">
                      Thêm file
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={createRequestMutation.isPending}
                  className="bg-[#003da5] hover:bg-blue-800 active:bg-blue-900 active:scale-95 text-white px-10 h-12 text-md font-bold shadow-lg transition-all duration-200"
                >
                  {createRequestMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  GỬI YÊU CẦU CỨU TRỢ <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
