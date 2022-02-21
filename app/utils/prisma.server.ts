import { PrismaClient } from '@prisma/client'

declare global {
  // This prevents us from making multiple connections to the db when the
  // require cache is cleared.
  // eslint-disable-next-line
  var prismaDB: ReturnType<typeof getClient> | undefined
}

const logThreshold = 50

const prismaDB =
  global.prismaDB ?? global.prismaDB ?? (global.prismaDB = getClient('read'))
// global.prismaDB ?? (global.prismaDB = getClient(regionalDB, 'read'))

// function getClient(connectionUrl: URL, type: 'write' | 'read'): PrismaClient {
function getClient(type: 'write' | 'read'): PrismaClient {
  console.log(
    `Setting up prisma client to ${process.env.DATABASE_URL} for ${type}`
  )
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'info', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
})
  client.$on('query', e => {
    if (e.duration < logThreshold) return

    // console.log(`prisma:query - ${dur} - ${e.query}`)
    console.log(`prisma:query - ${e.duration} - ${e.query}`)
  })
  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect()
  return client
}

export { prismaDB }
