/* =========================================================
   PEC - GESTÃO DE CASOS
   Configuração pública do Supabase
   ========================================================= */

const SUPABASE_URL =
    "https://ibsowximsiocgholdzsj.supabase.co";

const SUPABASE_PUBLIC_KEY =
    "sb_publishable_uyNW-IIPwdwY8Iaxe0qxTA_FqTcrNVi";


if (!window.supabase) {
    console.error(
        "A biblioteca do Supabase não foi carregada."
    );
}


window.pecSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
);