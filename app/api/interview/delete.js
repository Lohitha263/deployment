import { NextResponse } from 'next/server'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const mockId = searchParams.get('mockId')

  if (!mockId) {
    return NextResponse.json({ error: 'mockId is required' }, { status: 400 })
  }

  await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId))

  return NextResponse.json({ success: true })
}
