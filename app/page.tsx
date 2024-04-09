"use client";

import { TLColumn } from "@/components/tlcolumn";

export default function Page() {
    return(
        <>
            {/* <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="misskey.io" /> */}
            <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="misskey.niri.la" />
            {/* <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="meron.cloud" /> */}
        </>
    );
}