import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/rootReducer";

export default function AccountInfo() {
  const account = useSelector((state: RootState) => state.account);

  const items = [];
  // tslint:disable-next-line:forin
  for (const item in account) {
    items.push(
      <Typography key={item} noWrap>
        {" "}
        {`${item}: ${account[item as keyof typeof account]}`}
      </Typography>
    );
  }
  return (
    <div>
      <List>{items}</List>
    </div>
  );
}
