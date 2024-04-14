"use client";

import { TLColumn } from "@/components/tlcolumn";
import { Account, Timeline, findAllAccounts, findAllTimelines } from "@/lib/bindings";
import { toastThrownError } from "@/lib/toast";
import React from "react";

export default function Page() {

    const [timeline, setTimeline] = React.useState([] as Timeline[])
    const [accounts, setAccounts] = React.useState([] as Account[]);

    React.useEffect(() => {
        findAllAccounts().then((a) => {
            setAccounts(a);

        }).catch((e) => {
            toastThrownError(e);
        });
        findAllTimelines().then((t) => {
            setTimeline(t);
        }).catch((e) => {
            toastThrownError(e);
        });
    }, []);

    return (
        <>
            {
                timeline.map((t, index) => (
                    <TLColumn className={'min-w-[18rem] max-w-[18rem]'} key={index} endpoint={t.server_domain} channel={t.channel} token={accounts.find(a => a.id == t.account_id)?.access_token} />
                ))
            }
        </>
    );
}