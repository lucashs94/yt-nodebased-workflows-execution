import { inngest } from '@/inngest/client'
import prisma from '@/lib/db'
import { createTRPCRouter, protectedProcedure } from '../init'

export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: 'execute/ai',
    })

    return { success: true, message: 'Job queued' }
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany()
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: 'test/hello.world',
      data: {
        email: 'test@example.com',
      },
    })

    return prisma.workflow.create({
      data: {
        name: 'Workflow teste',
      },
    })
  }),
})
// export type definition of API
export type AppRouter = typeof appRouter
