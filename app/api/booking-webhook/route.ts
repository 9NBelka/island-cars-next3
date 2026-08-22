import { NextResponse } from 'next/server';

import { createClient } from '@/app/lib/supabaseServer';

const N8N_WEBHOOK_URL = 'https://n8n.rental.islandcars.pro/webhook/islandRenalFormHook';

export async function POST(request: Request) {
  const { bookingId } = await request.json();

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Достаём бронь и профиль сами, на сервере — не доверяем данным,
  // которые мог бы прислать клиент в теле запроса.
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, car:cars(*)')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  const payload = {
    booking: {
      id: booking.id,
      pickup_place: booking.pickup_place,
      return_place: booking.return_place,
      start_at: booking.start_at,
      end_at: booking.end_at,
      total_price: booking.total_price,
      payment_method: booking.payment_method,
      status: booking.status,
      payment_status: booking.payment_status,
      created_at: booking.created_at,
    },
    car: {
      id: booking.car?.id,
      brand: booking.car?.brand,
      model: booking.car?.model,
      year: booking.car?.year,
    },
    customer: {
      id: user.id,
      email: user.email,
      first_name: profile?.first_name ?? null,
      last_name: profile?.last_name ?? null,
      phone: profile?.phone ?? null,
      country: profile?.country ?? null,
      city: profile?.city ?? null,
      document_type: profile?.document_type ?? null,
      document_number: profile?.document_number ?? null,
      license_number: profile?.license_number ?? null,
    },
  };

  try {
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      console.error('n8n webhook responded with status', webhookResponse.status);
    }
  } catch (err) {
    console.error('Failed to reach n8n webhook:', err);
  }

  // Бронь в Supabase уже успешно создана к этому моменту — падение
  // вебхука не должно превращаться в ошибку бронирования для пользователя.
  return NextResponse.json({ success: true });
}
