import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/serverClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, imageUrl } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing title or imageUrl' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('images')
      .insert([{ title, image_url: imageUrl, user_id: user.id }])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 }) // 201 = Created
  } catch (err: unknown) {
    let message = 'Unexpected server error'

    if (err instanceof Error) {
      message = err.message
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
