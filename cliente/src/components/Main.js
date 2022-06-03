import React from "react";

export const Main = ({ children, center }) => {
  let classes = `Main ${center ? "Main--center" : ""}`;

  return <main className={classes}>{children}</main>;
};
