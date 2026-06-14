import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function seed() {
  const email = "admin@boilerplate.local"
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    console.log("ℹ️ Admin user already exists, skipping seed.")
    return
  }

  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      role: "admin",
      emailVerified: true,
    },
  })

  console.log(`✅ Admin user created: ${email}`)
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
