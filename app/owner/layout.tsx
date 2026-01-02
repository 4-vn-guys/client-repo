import type React from "react"
import { OwnerSidebar } from "@/widgets/owner/sidebar"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <OwnerSidebar />
      <main className="min-h-screen md:ml-60">{children}</main>
    </div>
  )
}
