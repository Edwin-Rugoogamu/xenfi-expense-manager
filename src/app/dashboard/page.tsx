import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Nav from "@/components/Nav"
import Link from "next/link"

async function getDashboardData(userId: string) {
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const [totalExpenses, expensesByCategory, recentExpenses] = await Promise.all([
    prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: currentMonth,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        date: {
          gte: currentMonth,
        },
      },
      _sum: {
        amount: true,
      },
      _count: true,
    }),
    prisma.expense.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ])

  // Get category names
  const categoryIds = expensesByCategory.map((item: any) => item.categoryId)
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  })

  const categoryMap = categories.reduce((acc: Record<string, string>, cat: any) => {
    acc[cat.id] = cat.name
    return acc
  }, {} as Record<string, string>)

  return {
    totalExpenses: totalExpenses._sum.amount || 0,
    expensesByCategory: expensesByCategory.map((item: any) => ({
      category: categoryMap[item.categoryId] || "Unknown",
      amount: item._sum.amount || 0,
      count: item._count,
    })),
    recentExpenses,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const data = await getDashboardData(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">$</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Expenses (This Month)
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${data.totalExpenses.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Categories
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.expensesByCategory.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">💳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Recent Transactions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.recentExpenses.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Expenses by Category (This Month)
              </h3>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {data.expensesByCategory.map((item: any, index: number) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {item.category.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.count} transaction{item.count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
              {data.expensesByCategory.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No expenses this month
                </li>
              )}
            </ul>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Expenses
              </h3>
              <Link
                href="/expenses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Expense
              </Link>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {data.recentExpenses.map((expense: any) => (
                <li key={expense.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {expense.category.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description || "No description"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {expense.category.name} • {expense.paymentMethod} •{" "}
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
              {data.recentExpenses.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No expenses yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
