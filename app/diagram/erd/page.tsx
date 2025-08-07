// "use client";
import React from "react";
import { useState } from "react";
import { TabsDemo } from "./TextTab";

const page = () => {
  //   const [text, setText] = useState("");
  return (
    <div className="flex flex-wrap h-full  w-full">
      <div className="w-full md:w-1/3">
        <TabsDemo />
      </div>

      <div className="w-full md:w-3/4"></div>
    </div>
  );
};

export default page;
