"use client";

import { Avatar, Card, CardBody, CardHeader, Typography, IconButton, ButtonGroup } from "@material-tailwind/react";
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from "dayjs/plugin/updateLocale.js"
import React from "react";
import { ArrowUturnLeftIcon, ArrowPathRoundedSquareIcon, PlusIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { toastNormal } from "@/lib/toast";

const relativeTimeConfig = {
    thresholds: [
        { l: "s", r: 59, d: "second" },
        { l: "m", r: 1 },
        { l: "mm", r: 59, d: "minute" },
        { l: "h", r: 1 },
        { l: "hh", r: 23, d: "hour" },
        { l: "d", r: 1 },
        { l: "dd", r: 29, d: "day" },
        { l: "M", r: 1 },
        { l: "MM", r: 11, d: "month" },
        { l: "y", r: 1 },
        { l: "yy", d: "year" },
    ],
    rounding: Math.floor,
}
extend(relativeTime, relativeTimeConfig);
extend(updateLocale)

dayjs.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",

        s: "%ds",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
        M: "%dM",
        MM: "%dM",
        y: "%dy",
        yy: "%dy"
    }
});

dayjs.updateLocale('ja', {
    relativeTime: {
        future: "%s後",
        past: "%s前",

        s: "%d秒",
        m: "%d分",
        mm: "%d分",
        h: "%d時間",
        hh: "%d時間",
        d: "%d日",
        dd: "%d日",
        M: "%dヶ月",
        MM: "%dヶ月",
        y: "%d年",
        yy: "%d年"
    }
});

export default function TimelineNote({ className, note }: { className?: string, note: any }) {
    const [noteCreatedAt, setNoteCreatedAt] = React.useState("");
    React.useEffect(() => {
        let intervalTimeout: NodeJS.Timeout | null = null;

        if (note.createdAt) {
            setNoteCreatedAt(dayjs(note.createdAt).fromNow());
        } else {
            console.error("Note has no createdAt field");
            console.debug(note);
            setNoteCreatedAt("Unknown time ago");
        }

        intervalTimeout = setInterval(() => {
            if (note.createdAt) {
                setNoteCreatedAt(dayjs(note.createdAt).fromNow());
            }
        }, 1000);

        return () => {
            if (intervalTimeout) {
                clearInterval(intervalTimeout);
                intervalTimeout = null;
            }
        };
    }, [note]);

    const copyRawJson = () => {
        navigator.clipboard.writeText(JSON.stringify(note));
        toastNormal("Copied raw JSON to clipboard");
    }

    return (
        <Card
            className={`${className} w-full p-2 h-auto`}
        >
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-0 pt-0 pb-2"
            >
                <div className="flex items-start whitespace-nowrap w-full">
                    <Avatar
                        size="md"
                        variant="circular"
                        src={note.user.avatarUrl}
                        alt={note.user.username}
                        className="shrink-0"
                    />
                    <Typography className="block shrink-1 overflow-hidden p-0 ml-2 text-base">
                        {note.user.name}
                    </Typography>
                    <Typography className="cursor-text shrink-[9999999] overflow-hidden text-ellipsis ml-2 text-base">
                        @{note.user.username}
                    </Typography>
                    <Typography className="shrink-0 ml-auto text-[.9em]">
                        {noteCreatedAt}
                    </Typography>
                </div>
            </CardHeader>
            { note.user.host != null &&
                <Typography className="flex pb-2">
                    {note.user.host}
                </Typography>
            }
            <CardBody
                className="mb-6 p-0"
            >
                <Typography className="cursor-text text-wrap w-full text-[.9em]">
                    {note.text}
                </Typography>
                {/* <picture>
                    <img
                        className="h-96 w-full object-cover object-center rounded-lg"
                        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                        alt="nature image"
                    />
                </picture> */}
                <div className="flex items-center gap-2 mt-2">
                    <IconButton variant="text">
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton variant="text">
                        <ArrowPathRoundedSquareIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton variant="text">
                        <PlusIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton onClick={copyRawJson} variant="text">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                    </IconButton>
                </div>
            </CardBody>
        </Card>
    );
}