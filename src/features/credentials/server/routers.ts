import { PAGINATION } from '@/config/constants'
import prisma from '@/lib/db'
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from '@/trpc/init'
import { CredentialType } from '@/types/credentials'
import { z } from 'zod'

export const credentialsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        type: z.enum(CredentialType),
        value: z.string().min(1, 'Value is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, type, value } = input

      return prisma.credential.create({
        data: {
          userId: ctx.auth.user.id,
          name,
          type,
          value, // TODO: encrypt value in prod
        },
      })
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        type: z.enum(CredentialType),
        value: z.string().min(1, 'Value is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, type, value } = input

      const credential = await prisma.credential.findUniqueOrThrow({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      })

      const updated = await prisma.credential.update({
        where: { id: credential.id },
        data: { name, type, value },
      })

      return updated
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      })
    }),

  getByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType) }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findMany({
        where: {
          type: input.type,
          userId: ctx.auth.user.id,
        },
      })
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .max(PAGINATION.MAX_PAGE_SIZE)
          .min(PAGINATION.MIN_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(''),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      ])

      const totalPages = Math.ceil(totalCount / pageSize)
      const hasNextPage = page < totalPages
      const hasPreviousPage = page > 1

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      }
    }),
})
