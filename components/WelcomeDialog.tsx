"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WelcomeModal = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (sp.has("success")) {
      console.log(sp.get("success"));
      setOpen(true);
    }
  }, [sp, user]);

  const closeDialog = () => {
    router.replace("/");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby="Welcome dialog">
        <DialogTitle>
          Hello, <span>{user.first_name}</span>!
        </DialogTitle>
        <p>Welcome to Piggyvault!</p>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
