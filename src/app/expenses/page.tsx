import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Nav from "@/components/Nav"
import Link from "next/link"

async function getExpenses(userId: string) {
  return await prisma.expense.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const expenses = await getExpenses(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
            <Link
              href="/expenses/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Expense
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {expenses.map((expense: any) => (
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
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/expenses/${expense.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </Link>
                        <form
                          action={`/api/expenses/${expense.id}`}
                          method="POST"
                          className="inline"
                        >
                          <input type="hidden" name="_method" value="DELETE" />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {expenses.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No expenses yet. <Link href="/expenses/new" className="text-indigo-600 hover:text-indigo-900">Create one</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
