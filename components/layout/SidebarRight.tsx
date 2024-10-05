"use client";

import { getLoggedInUser } from "@/lib/actions/auth.actions";
import LinkedAccountsList from "../LinkedAccountsList";
import { ThemeSwitcher } from "../core/ThemeSwitcher";
import { motion } from "framer-motion";

const SidebarRight = ({ user }: { user: User }) => {
  return (
    <motion.aside
      className="no-scrollbar hidden h-screen max-h-screen flex-col align-center border-l xl:flex w-[21rem] xl:overflow-y-scroll pt-8 sm:p-4 xl:p-6 !important"
      initial={{ opacity: 1, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ style: "tween", duration: 0.5 }}
    >
      <div className="flex-grow">
        <LinkedAccountsList user={user} />
      </div>
      <footer>
        <div className="flex flex-row-reverse flex-end">
          <ThemeSwitcher />
        </div>
      </footer>
    </motion.aside>
  );
};

export default SidebarRight;
