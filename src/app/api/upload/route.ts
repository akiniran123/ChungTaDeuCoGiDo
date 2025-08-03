// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const userId = formData.get('user_id') as string

  if (!file || !userId) {
    return NextResponse.json({ error: 'Missing file or user ID' }, { status: 400 })
  }

  const supabase = createServerActionClient<Database>({ cookies })

  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${Date.now()}.${fileExt}`

  const { error } = await supabase.storage.from('your-bucket-name').upload(filePath, file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, path: filePath })
}
