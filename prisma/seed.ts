import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()

  await prisma.product.create({
    data: {
      name: 'Cozy Winter Sweater',
      description: 'Stay warm and stylish with this comfortable winter sweater.',
      price: 4999, // $49.99
      imageUrl: 'https://images.unsplash.com/photo-1571439207018-80b623910f54?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  })

  await prisma.product.create({
    data: {
      name: 'Classic Denim Jeans',
      description: 'A timeless pair of denim jeans that goes with everything.',
      price: 5999, // $59.99
      imageUrl: 'https://images.unsplash.com/photo-1560295147-16726c514717?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  })

  await prisma.product.create({
    data: {
      name: 'Stylish Leather Boots',
      description: 'Step out in style with these durable and fashionable leather boots.',
      price: 8999, // $89.99
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
