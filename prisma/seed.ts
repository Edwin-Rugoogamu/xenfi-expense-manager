import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  })

  console.log('Created demo user:', user.email)

  // Create categories
  const categories = [
    { name: 'Office Supplies', description: 'Stationery and office materials' },
    { name: 'Travel', description: 'Business travel expenses' },
    { name: 'Software', description: 'Software licenses and subscriptions' },
    { name: 'Marketing', description: 'Marketing and advertising costs' },
    { name: 'Equipment', description: 'Office equipment and furniture' },
  ]

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    })
    console.log('Created category:', category.name)
  }

  // Get all categories
  const allCategories = await prisma.category.findMany()

  // Create sample expenses
  const expenses = [
    {
      amount: 45.99,
      description: 'Notebooks and pens',
      date: new Date('2024-12-01'),
      paymentMethod: 'Credit Card',
      categoryId: allCategories[0].id,
      userId: user.id,
    },
    {
      amount: 299.99,
      description: 'Flight to conference',
      date: new Date('2024-12-05'),
      paymentMethod: 'Corporate Card',
      categoryId: allCategories[1].id,
      userId: user.id,
    },
    {
      amount: 99.99,
      description: 'Adobe Creative Suite subscription',
      date: new Date('2024-12-10'),
      paymentMethod: 'Credit Card',
      categoryId: allCategories[2].id,
      userId: user.id,
    },
    {
      amount: 150.00,
      description: 'Social media ads',
      date: new Date('2024-12-15'),
      paymentMethod: 'Bank Transfer',
      categoryId: allCategories[3].id,
      userId: user.id,
    },
    {
      amount: 499.99,
      description: 'New laptop',
      date: new Date('2024-12-20'),
      paymentMethod: 'Corporate Card',
      categoryId: allCategories[4].id,
      userId: user.id,
    },
  ]

  for (const expenseData of expenses) {
    const expense = await prisma.expense.create({
      data: expenseData,
    })
    console.log('Created expense:', expense.description)
  }

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
