import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { expenseSchema } from "@/lib/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const expense = await prisma.expense.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    })

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const body = await request.json()
    const validatedData = expenseSchema.parse(body)

    const expense = await prisma.expense.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: validatedData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(expense)
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const formData = await request.formData()
  const method = formData.get("_method")

  if (method === "DELETE") {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const { id } = await params

      await prisma.expense.delete({
        where: {
          id,
          userId: session.user.id,
        },
      })

      return NextResponse.redirect(new URL("/expenses", request.url))
    } catch (error: any) {
      if (error?.code === "P2025") {
        return NextResponse.json({ error: "Expense not found" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Failed to delete expense" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.expense.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Expense deleted" })
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    )
  }
}
