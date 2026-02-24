import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Проверяет подпись Telegram initData через HMAC-SHA256
async function validateTelegramData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) throw new Error('No hash in initData')
  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const encoder = new TextEncoder()

  // secret = HMAC-SHA256("WebAppData", bot_token)
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const secretKey = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(botToken))

  // verify = HMAC-SHA256(secret, data_check_string)
  const signKey = await crypto.subtle.importKey(
    'raw', secretKey,
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', signKey, encoder.encode(dataCheckString))

  const calculatedHash = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  if (calculatedHash !== hash) throw new Error('Invalid Telegram signature')

  const userStr = params.get('user')
  if (!userStr) throw new Error('No user in initData')
  return JSON.parse(userStr)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { initData } = await req.json()

    const BOT_TOKEN              = Deno.env.get('TELEGRAM_BOT_TOKEN')!
    const SUPABASE_URL           = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 1. Валидируем данные от Telegram
    const tgUser = await validateTelegramData(initData, BOT_TOKEN)

    // 2. Создаём admin-клиент
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // 3. Детерминированный email + пароль на основе Telegram ID
    //    Пользователь никогда не видит это — это внутренний механизм
    const email    = `tg_${tgUser.id}@alatau.app`
    const password = `tg_${tgUser.id}_${BOT_TOKEN.slice(-10)}`

    // 4. Пробуем войти (пользователь уже существует)
    let { data: signInData } = await admin.auth.signInWithPassword({ email, password })

    // 5. Если не существует — создаём
    if (!signInData?.session) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (createErr) throw createErr

      // Входим после создания
      const { data: freshLogin } = await admin.auth.signInWithPassword({ email, password })
      signInData = freshLogin
    }

    if (!signInData?.session) throw new Error('Failed to obtain session')

    const userId = signInData.user!.id

    // 6. Upsert пользователя в нашей таблице users
    await admin.from('users').upsert({
      id:          userId,
      telegram_id: tgUser.id,
      username:    tgUser.username   ?? null,
      first_name:  tgUser.first_name ?? null,
      last_name:   tgUser.last_name  ?? null,
      avatar_url:  tgUser.photo_url  ?? null,
      updated_at:  new Date().toISOString(),
    }, { onConflict: 'id' })

    // 7. Получаем актуальные данные пользователя
    const { data: userData } = await admin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return new Response(
      JSON.stringify({ session: signInData.session, user: userData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error('[telegram-auth]', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
