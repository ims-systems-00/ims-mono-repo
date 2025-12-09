import React, { useEffect } from "react";
import useNotificationRedirection from "./useNotificationRedirection";

const Redirect = () => {
  let { redirect } = useNotificationRedirection();
  useEffect(() => {
    redirect();
  }, []);
  return <React.Fragment></React.Fragment>;
};

export default Redirect;
