import { AppHeader } from '@/components/appHeader'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 bg-muted">{children}</main>
    </>
  )
}
