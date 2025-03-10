import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from 'server/db'

interface VerifyRequest {
  email: string
  password: string
}

interface UserResponse {
  id: string
  email: string
  name: string | null
}

interface ErrorResponse {
  error: string
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    
    if (!isVerifyRequest(body)) {
      return NextResponse.json(
        { error: 'Email and password are required' } as ErrorResponse,
        { status: 400 }
      )
    }

    const { email, password } = body

    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
      },
    })

    if (!user?.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' } as ErrorResponse,
        { status: 401 }
      )
    }

    const isValid = await compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' } as ErrorResponse,
        { status: 401 }
      )
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' } as ErrorResponse,
      { status: 500 }
    )
  }
}

function isVerifyRequest(data: unknown): data is VerifyRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'email' in data &&
    'password' in data &&
    typeof (data as VerifyRequest).email === 'string' &&
    typeof (data as VerifyRequest).password === 'string'
  )
}

export const runtime = 'nodejs'
