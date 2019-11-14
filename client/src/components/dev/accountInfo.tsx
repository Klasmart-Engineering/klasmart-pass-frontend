import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRestAPI } from "../../restapi";
import { State } from "../../store/store";
import BadanamuButton from "../button";

export default function AccountInfo() {
    const account = useSelector((state: State) => state.account);

    const items = [];
    // tslint:disable-next-line:forin
    for (const item in account) {
        items.push(<Typography noWrap > {`${item}: ${account[item as keyof typeof account]}`}</Typography>);
    }
    return (
        <div>
            <List>
                {items}
            </List>
        </div>
    );
}
