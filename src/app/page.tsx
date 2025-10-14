import { caller } from '@/trpc/server'

export default async function Page() {
  const users = await caller.getUsers()

  return (
    <div className="">
      <h1>Hello Page</h1>
    </div>
  )
}
