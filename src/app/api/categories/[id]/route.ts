import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
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
    const validatedData = categorySchema.parse(body)

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: validatedData,
      include: {
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update category" },
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

      await prisma.category.delete({
        where: {
          id,
        },
      })

      return NextResponse.redirect(new URL("/categories", request.url))
    } catch (error: any) {
      if (error?.code === "P2025") {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Failed to delete category" },
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

    await prisma.category.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Category deleted" })
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
