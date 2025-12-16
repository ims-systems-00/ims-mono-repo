import React from "react";
import { BiCog } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineTrackChanges } from "react-icons/md";
import { PiBoundingBox } from "react-icons/pi";
import { Outlet } from "react-router-dom";
import Navigationbar from "../../components/Navigationbar";
import { ParameterManagerContextProvider } from "./store";
import { LuBookOpenCheck } from "react-icons/lu";
const navigations = [
  {
    path: "/guidelines",
    text: "Guidelines",
    icon: <LuBookOpenCheck />,
  },
  {
    path: "/reporting-overview",
    text: "Overview",
    icon: <BiCog />,
  },
  {
    path: "/reporting-periods",
    text: "Reporting Periods",
    icon: <LuCalendarClock />,
  },
  {
    path: "/locations",
    text: "Locations",
    icon: <GrLocation />,
  },
  // {
  //   path: "/boundaries",
  //   text: "Reporting Boundaries",
  //   icon: <PiBoundingBox />,
  // },
  // {
  //   path: "/advanced-tracking",
  //   text: "Advanced tracking",
  //   icon: <MdOutlineTrackChanges />,
  // },
].map((item) => ({ ...item, path: "/parameters" + item.path }));

function Layout() {
  return (
    <ParameterManagerContextProvider>
      <Navigationbar navigaions={navigations} sticky={"top"} />
      <div className="content">
        <Outlet />
      </div>
    </ParameterManagerContextProvider>
  );
}

export default Layout;
