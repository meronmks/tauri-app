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
    const [renoteCreatedAt, setRenoteCreatedAt] = React.useState("");
    React.useEffect(() => {
        let intervalTimeout: NodeJS.Timeout | null = null;

        if (note.createdAt) {
            setNoteCreatedAt(dayjs(note.createdAt).fromNow());
        } else {
            console.error("Note has no createdAt field");
            console.debug(note);
            setNoteCreatedAt("Unknown time ago");
        }

        if (note.renoteId != null && note.renote.createdAt) {
            setRenoteCreatedAt(dayjs(note.renote.createdAt).fromNow());
        } else {
            setRenoteCreatedAt("Unknown time ago");
        }

        intervalTimeout = setInterval(() => {
            if (note.createdAt) {
                setNoteCreatedAt(dayjs(note.createdAt).fromNow());
            }
            if (note.renoteId != null && note.renote.createdAt) {
                setRenoteCreatedAt(dayjs(note.renote.createdAt).fromNow());
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
                <div className="flex w-full flex-col gap-0.5">
                    {note.renoteId != null &&
                        <>
                            <div className="flex items-start whitespace-nowrap w-full">
                                <Avatar
                                    size="sm"
                                    variant="circular"
                                    src={note.user.avatarUrl}
                                    alt={note.user.username}
                                    className="shrink-0"
                                />
                                <Typography className="block shrink-1 overflow-hidden p-0 ml-2 text-base">
                                    Renote: {note.user.name}
                                </Typography>
                                <Typography className="shrink-0 ml-auto text-[.9em]">
                                    {noteCreatedAt}
                                </Typography>
                            </div>
                            <div className="flex items-start whitespace-nowrap w-full">
                                <Avatar
                                    size="md"
                                    variant="circular"
                                    src={note.renote.user.avatarUrl}
                                    alt={note.renote.user.username}
                                    className="shrink-0"
                                />
                                <Typography className="block shrink-1 overflow-hidden p-0 ml-2 text-base">
                                    {note.renote.user.name}
                                </Typography>
                                <Typography className="cursor-text shrink-[9999999] overflow-hidden text-ellipsis ml-2 text-base">
                                    @{note.renote.user.username}
                                </Typography>
                                <Typography className="shrink-0 ml-auto text-[.9em]">
                                    {renoteCreatedAt}
                                </Typography>
                            </div>
                        </>
                    }
                    {note.renoteId == null &&
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
                    }
                </div>
            </CardHeader>
            {note.user.host != null &&
                <Typography className="flex pb-2">
                    {note.user.host}
                </Typography>
            }
            <CardBody
                className="mb-6 p-0"
            >
                {note.renoteId != null &&
                    <Typography className="cursor-text whitespace-pre-wrap text-wrap break-words w-full text-[.9em]">
                        {note.renote.text}
                    </Typography>
                }
                {note.renoteId == null &&
                    <Typography className="cursor-text whitespace-pre-wrap text-wrap break-words w-full text-[.9em]">
                        {note.text}
                    </Typography>
                }

                <div className={`grid gap-2 ${((note.files != null && note.files.length > 1) || (note.renoteId != null && note.renote.files.length > 1)) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {
                        note.files.map((file: any, index: React.Key | null | undefined) => (
                            <div key={index} className="m-1">
                                {file.isSensitive == true && file.type.indexOf("image") === 0 &&
                                    <picture>
                                        <img
                                            className="h-auto w-full object-cover object-center rounded-lg blur-md hover:blur-none"
                                            src={file.thumbnailUrl}
                                            alt={file.name}
                                        />
                                    </picture>
                                }
                                {file.isSensitive != true && file.type.indexOf("image") === 0 &&
                                    <picture>
                                        <img
                                            className="h-auto w-full object-cover object-center rounded-lg"
                                            src={file.thumbnailUrl}
                                            alt={file.name}
                                        />
                                    </picture>
                                }
                                {file.isSensitive == true && file.type.indexOf("video") === 0 &&
                                    <video className="h-auto w-full rounded-lg blur-md hover:blur-none" controls>
                                        <source src={file.url} type={file.type} />
                                    </video>
                                }
                                {file.isSensitive != true && file.type.indexOf("video") === 0 &&
                                    <video className="h-auto w-full rounded-lg" controls>
                                        <source src={file.url} type={file.type} />
                                    </video>
                                }
                            </div>
                        ))
                    }
                    {note.renoteId != null &&
                        note.renote.files.map((file: any, index: React.Key | null | undefined) => (
                            <div key={index} className="m-1">
                                {file.isSensitive == true && file.type.indexOf("image") === 0 &&
                                    <picture>
                                        <img
                                            className="h-auto w-full object-cover object-center rounded-lg blur-md hover:blur-none"
                                            src={file.thumbnailUrl}
                                            alt={file.name}
                                        />
                                    </picture>
                                }
                                {file.isSensitive != true && file.type.indexOf("image") === 0 &&
                                    <picture>
                                        <img
                                            className="h-auto w-full object-cover object-center rounded-lg"
                                            src={file.thumbnailUrl}
                                            alt={file.name}
                                        />
                                    </picture>
                                }
                                {file.isSensitive == true && file.type.indexOf("video") === 0 &&
                                    <video className="h-auto w-full rounded-lg blur-md hover:blur-none" controls>
                                        <source src={file.url} type={file.type} />
                                    </video>
                                }
                                {file.isSensitive != true && file.type.indexOf("video") === 0 &&
                                    <video className="h-auto w-full rounded-lg" controls>
                                        <source src={file.url} type={file.type} />
                                    </video>
                                }
                            </div>
                        ))
                    }
                </div>

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