"use client";

import { TLColumn } from "@/components/tlcolumn";

export default function Page() {
    return(
        <>
            <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="hoge" />
            <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="piyo" />
            <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="fuga" />
            <TLColumn className={'min-w-[18rem] max-w-[18rem]'} endpoint="obebe" />
        </>
    );
}