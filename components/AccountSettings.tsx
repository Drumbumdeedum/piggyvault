import React from "react";

const AccountSettings = ({ user }: { user: User }) => {
  return (
    <div className="flex">
      <section className="w-64">
        <h1 className="font-3xl font-semibold">Credentials</h1>
        <h1 className="font-3xl font-semibold">Personal</h1>
      </section>
      <section>
        <div>EMAIL</div>
        <div>NAME</div>
      </section>
    </div>
  );
};

export default AccountSettings;
