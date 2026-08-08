import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { LANGS } from './app/i18n/types';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //--------------------------------------------------
  // Пропускаем служебные запросы
  //--------------------------------------------------

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || /\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  //--------------------------------------------------
  // Если нет языка — добавляем /en
  //--------------------------------------------------

  const pathnameHasLang = LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`),
  );

  if (!pathnameHasLang) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;

    return NextResponse.redirect(url);
  }

  //--------------------------------------------------
  // Проверяем авторизацию
  //--------------------------------------------------

  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //--------------------------------------------------
  // Если пользователь уже авторизован
  //--------------------------------------------------

  const isAuthPage =
    pathname.endsWith('/login') ||
    pathname.endsWith('/register') ||
    pathname.endsWith('/forgot-password');

  if (user && isAuthPage) {
    const lang = LANGS.find((l) => pathname.startsWith(`/${l}/`)) ?? 'en';

    return NextResponse.redirect(new URL(`/${lang}/profile`, request.url));
  }

  //--------------------------------------------------
  // Если пользователь не авторизован
  //--------------------------------------------------

  const isProfilePage = pathname.endsWith('/profile');

  if (!user && isProfilePage) {
    const lang = LANGS.find((l) => pathname.startsWith(`/${l}/`)) ?? 'en';

    return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|.*\\..*).*)'],
};
