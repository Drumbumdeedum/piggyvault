import { getLoggedInUser } from "@/lib/actions/auth.actions";
import LinkedAccountsList from "./LinkedAccountsList";
import { ThemeSwitcher } from "./ThemeSwitcher";

const SidebarRight = async () => {
  const user = await getLoggedInUser();

  return (
    <aside className="no-scrollbar hidden h-screen max-h-screen flex-col align-center border-l xl:flex w-[21rem] xl:overflow-y-scroll pt-8 sm:p-4 xl:p-6 !important">
      <div className="flex-grow">
        <LinkedAccountsList user={user} />
      </div>
      <footer>
        <div className="flex flex-row-reverse flex-end">
          <ThemeSwitcher />
        </div>
      </footer>
    </aside>
  );
};

export default SidebarRight;
