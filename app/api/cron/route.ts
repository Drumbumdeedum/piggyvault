import { createClient } from "@/utils/supabase/server";

export async function GET() {
  console.log("Cron job triggered");

  const supabase = createClient();
  const users = await supabase
    .from("users")
    .select();

  console.log(`USER COUNT: ${users.count}`);

  return new Response(JSON.stringify({ message: "Cron job executed" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
