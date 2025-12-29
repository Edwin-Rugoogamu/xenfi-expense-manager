import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Nav from "@/components/Nav"
import Link from "next/link"

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          expenses: true,
        },
      },
    },
  })
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <Link
              href="/categories/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Category
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {categories.map((category: any) => (
                <li key={category.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.description || "No description"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {category._count.expenses} expense{category._count.expenses !== 1 ? "s" : ""}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          href={`/categories/${category.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </Link>
                        <form
                          action={`/api/categories/${category.id}`}
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
              {categories.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No categories yet. <Link href="/categories/new" className="text-indigo-600 hover:text-indigo-900">Create one</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
