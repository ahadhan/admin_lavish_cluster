import React from "react";

export default function Header({ sectionName }) {
  return (
    <header className="p-6 bg-black text-white">
      <h1 className="text-3xl font-bold font-roboto text-center" >
        {sectionName}
      </h1>
    </header>
  );
}
