import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect("/admin")
  return <>{children}</>
}
