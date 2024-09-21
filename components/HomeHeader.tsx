import React from "react";

const HomeHeader = ({ userName }: { userName: string }) => {
  return (
    <section>
      <header>
        <h1 className="text-3xl font-semibold">Welcome {userName}</h1>
        <p>Access and manage your account and transactions</p>
      </header>
    </section>
  );
};

export default HomeHeader;
