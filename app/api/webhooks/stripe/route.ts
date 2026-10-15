export async function POST() {
  return new Response("Stripe belum diaktifkan", { status: 501 });
}
