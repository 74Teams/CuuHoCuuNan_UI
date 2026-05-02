'use client'

import { dictType } from '@/constants/dictionary'
import { MOCK_REQUESTS } from '@/data/mockRequests'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertTriangle,
  ArrowUpDown,
  Droplets,
  Eye,
  Flame,
  HeartPulse,
} from 'lucide-react'

import { DispatcherRequest } from '@/types/dispatcher'

import { MOCK_REQUESTS } from '@/data/mockRequests'

const maskPhoneNumber = (phone: string) => {
  if (!phone || phone.length < 10) return phone
  return phone.substring(0, 4) + '***' + phone.substring(phone.length - 3)
}

const DispatcherMapComponent = dynamic(
  () => import('@/components/dispatcher/DispatcherMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-100 animate-pulse rounded-2xl">
        <span className="text-slate-400 font-medium text-sm">
          Đang tải bản đồ...
        </span>
      </div>
    ),
  },
)

export default function DispatcherDashboard() {
  const [requestsList, setRequestsList] =
    useState<DispatcherRequest[]>(MOCK_REQUESTS)

  const [sortConfig, setSortConfig] = useState<{
    key: 'priority' | 'status' | 'time'
    direction: 'desc' | 'asc'
  } | null>(null)

  // State request đang được chọn
  const [selectedRequest, setSelectedRequest] =
    useState<DispatcherRequest | null>(MOCK_REQUESTS[0] || null)

  const getRelativeTime = (isoString: string) => {
    const past = new Date(isoString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds <= 60) return 'Vừa xong'

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ngày trước`
  }

  const getExactTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const sortedRequests = [...requestsList].sort((a, b) => {
    if (!sortConfig) return 0

    if (sortConfig.key === 'time') {
      const timeA = new Date(a.submittedTime).getTime()
      const timeB = new Date(b.submittedTime).getTime()
      return sortConfig.direction === 'desc' ? timeB - timeA : timeA - timeB
    }
    if (sortConfig.key === 'priority') {
      const weightA = priorityWeight[a.priority] || 0
      const weightB = priorityWeight[b.priority] || 0
      return sortConfig.direction === 'desc'
        ? weightB - weightA
        : weightA - weightB
    }
    if (sortConfig.key === 'status') {
      const weightA = statusWeight[a.status] || 0
      const weightB = statusWeight[b.status] || 0
      return sortConfig.direction === 'desc'
        ? weightB - weightA
        : weightA - weightB
    }
    return 0
  })

  const handleSort = (columnKey: 'priority' | 'status' | 'time') => {
    let direction: 'desc' | 'asc' = 'desc'
    if (
      sortConfig &&
      sortConfig.key === columnKey &&
      sortConfig.direction === 'desc'
    ) {
      direction = 'asc'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const renderStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center text-orange-600 font-semibold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5 shrink-0"></span>{' '}
            Đang chờ
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center text-blue-600 font-semibold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0"></span>{' '}
            Đã điều phối
          </span>
        )
      case 'RESOLVED':
        return (
          <span className="flex items-center text-green-600 font-semibold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shrink-0"></span>{' '}
            Hoàn thành
          </span>
        )
      default:
        return <span>{status}</span>
    }
  }

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none rounded shadow-none font-bold whitespace-nowrap text-[11px] px-2 py-0.5">
            CẤP BÁCH
          </Badge>
        )
      case 'HIGH':
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none rounded shadow-none font-bold whitespace-nowrap text-[11px] px-2 py-0.5">
            NGUY HIỂM
          </Badge>
        )
      case 'MEDIUM':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none rounded shadow-none font-bold whitespace-nowrap text-[11px] px-2 py-0.5">
            TRUNG BÌNH
          </Badge>
        )
      default:
        return (
          <Badge
            variant="secondary"
            className="rounded font-bold shadow-none whitespace-nowrap text-[11px] px-2 py-0.5"
          >
            THẤP
          </Badge>
        )
    }
  }

  const renderEmergencyType = (type: string) => {
    switch (type) {
      case 'FIRE':
        return (
          <div className="flex items-center gap-1.5 text-orange-600 whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">{dictType[type]}</span>
          </div>
        )
      case 'FLOOD':
        return (
          <div className="flex items-center gap-1.5 text-blue-800 whitespace-nowrap">
            <Droplets className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">{dictType[type]}</span>
          </div>
        )
      case 'MEDICAL':
        return (
          <div className="flex items-center gap-1.5 text-red-600 whitespace-nowrap">
            <HeartPulse className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">{dictType[type]}</span>
          </div>
        )
      case 'LANDSLIDE':
        return (
          <div className="flex items-center gap-1.5 text-amber-700 whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">{dictType[type]}</span>
          </div>
        )
      default:
        return (
          <div className="font-bold text-slate-700 whitespace-nowrap">
            {dictType[type] || type}
          </div>
        )
    }
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto w-full bg-slate-50/80">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row gap-5 xl:gap-6 justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bảng Điều Phối Cứu Trợ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ReliefMap Central Command — Giám sát & Điều động thời gian thực
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng cộng
            </p>
            <p className="text-2xl font-black text-[#003da5] mt-0.5 ">
              {requestsList.length}
            </p>
          </div>
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
              Đang chờ
            </p>
            <p className="text-2xl font-black text-orange-600 mt-0.5">
              {requestsList.filter((r) => r.status === 'PENDING').length}
            </p>
          </div>
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              Đã phân công
            </p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">
              {requestsList.filter((r) => r.status === 'IN_PROGRESS').length}
            </p>
          </div>
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
              Hoàn thành
            </p>
            <p className="text-2xl font-black text-green-500 mt-0.5">
              {requestsList.filter((r) => r.status === 'RESOLVED').length}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Kéo gap nhỏ lại thành gap-5/gap-6 */}
      <div className="flex flex-col xl:flex-row gap-5 xl:gap-6 h-[calc(100vh-170px)] min-h-[550px]">
        {/* CỘT TRÁI - BẢNG DANH SÁCH */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <h2 className="font-bold text-[15px] text-slate-800">
              Danh sách yêu cầu mới nhất
            </h2>
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2 py-0.5 uppercase shadow-md shadow-orange-200 shrink-0 text-[10px]">
              CẦN XỬ LÝ
            </Badge>
          </div>

          <div className="flex-1 overflow-auto overflow-x-auto">
            <Table className="w-full text-[13px]">
              <TableHeader className="bg-slate-50/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead
                    className="w-[100px] font-bold text-slate-500 cursor-pointer hover:text-slate-800 transition-colors select-none py-3"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      ƯU TIÊN
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${sortConfig?.key === 'priority' ? 'text-[#003da5]' : 'text-slate-400'}`}
                      />
                    </div>
                  </TableHead>

                  <TableHead className="w-[110px] font-bold text-slate-500 whitespace-nowrap py-3">
                    PHÂN LOẠI
                  </TableHead>
                  <TableHead className="w-[140px] font-bold text-slate-500 whitespace-nowrap py-3">
                    NGƯỜI GỬI
                  </TableHead>

                  <TableHead className="min-w-[180px] font-bold text-slate-500 py-3">
                    VỊ TRÍ
                  </TableHead>

                  <TableHead
                    className="w-[110px] font-bold text-slate-500 cursor-pointer hover:text-slate-800 transition-colors select-none py-3"
                    onClick={() => handleSort('time')}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      THỜI GIAN
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${sortConfig?.key === 'time' ? 'text-[#003da5]' : 'text-slate-400'}`}
                      />
                    </div>
                  </TableHead>

                  <TableHead
                    className="w-[120px] font-bold text-slate-500 cursor-pointer hover:text-slate-800 transition-colors select-none py-3"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      TRẠNG THÁI
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${sortConfig?.key === 'status' ? 'text-[#003da5]' : 'text-slate-400'}`}
                      />
                    </div>
                  </TableHead>

                  <TableHead className="w-[50px] text-right font-bold text-slate-500 pr-4 py-3">
                    GPS
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedRequests.map((req) => (
                  <TableRow
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`cursor-pointer transition-colors ${selectedRequest?.id === req.id ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <TableCell className="py-2.5">
                      {renderPriorityBadge(req.priority)}
                    </TableCell>

                    <TableCell className="py-2.5">
                      {renderEmergencyType(req.emergencyType)}
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="font-bold text-slate-800 whitespace-nowrap">
                        {req.requestedBy.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">
                        {maskPhoneNumber(req.requestedBy.phoneNumber)}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="text-[13px] text-slate-600 line-clamp-2 min-w-[180px]">
                        {req.location.address}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="font-bold text-slate-700 whitespace-nowrap">
                        {getRelativeTime(req.submittedTime)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono whitespace-nowrap">
                        {getExactTime(req.submittedTime)}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      {renderStatus(req.status)}
                    </TableCell>

                    <TableCell className="text-right pr-4 py-2.5">
                      <div className="flex justify-end">
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRequest(req)
                            window.dispatchEvent(
                              new CustomEvent('MOVE_MAP', {
                                detail: {
                                  lat: req.location.latitude,
                                  lng: req.location.longitude,
                                },
                              }),
                            )
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors shrink-0 ${
                            selectedRequest?.id === req.id
                              ? 'bg-[#003da5] text-white shadow-md'
                              : 'text-slate-400 hover:text-[#003da5] hover:bg-blue-50'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* CỘT PHẢI - Nới rộng ra một chút (380px -> 420px) để ép nhẹ cái Bảng nhỏ lại */}
        <div className="w-full xl:w-[380px] 2xl:w-[420px] flex flex-col gap-5 shrink-0 h-full">
          <div className="h-[260px] bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200 shrink-0 relative">
            <DispatcherMapComponent
              requests={selectedRequest ? [selectedRequest] : []}
            />

            {/* Overlay thông tin ID trên map */}
            {selectedRequest && (
              <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5 pointer-events-none">
                <span className="flex h-1.5 w-1.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-800 font-mono">
                  RQ-{selectedRequest.id.substring(0, 4).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-[14px] text-slate-800">
                  Điều phối cứu hộ
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Các đội trong khu vực
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-slate-500 bg-slate-50 shrink-0 text-[10px] px-2 py-0.5"
              >
                8 đội
              </Badge>
            </div>

            <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              <div className="text-center text-xs text-slate-400 mt-8 italic">
                (Chọn một đội cứu hộ để tiếp tục...)
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-white shrink-0">
              <button className="w-full bg-[#003da5] text-white font-bold py-3 rounded-xl text-[13px] hover:bg-blue-800 transition shadow-lg shadow-blue-200 active:scale-[0.98]">
                XÁC NHẬN PHÂN CÔNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
