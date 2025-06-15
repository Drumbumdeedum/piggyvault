import { createClient } from "@/utils/supabase/server";

export async function GET() {
  console.log("CRON JOB TRIGGERED");

  const supabase = createClient();
  const users = await supabase
    .from("users")
    .select();

  console.log(`USER COUNT: ${users.count}`);

  return new Response(JSON.stringify({ message: "CRON JOB EXECUTED" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
