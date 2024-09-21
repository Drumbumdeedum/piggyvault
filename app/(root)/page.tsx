import { getLoggedInUser } from "@/lib/actions/auth.actions";

export default async function Index() {
  const user = await getLoggedInUser();
  console.log(user);
  return (
    <>
      <main>Home page</main>
    </>
  );
}
