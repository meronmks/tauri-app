"use client";

import { Avatar, Card, CardBody, CardHeader, Typography, Button } from "@material-tailwind/react";

export default function TimelineNote({ className, note }: { className?: string, note: any }) {
    return (
        <Card
            className={`${className} w-auto p-2 h-auto`}
        >
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-0 pt-0 pb-2"
            >
                <div className="flex items-start whitespace-nowrap w-full">
                    <Avatar
                        size="lg"
                        variant="circular"
                        src={note.user.avatarUrl}
                        alt={note.user.username}
                        className="shrink-0"
                    />
                    <span className="block shrink-1 overflow-hidden p-0 ml-2">
                        {note.user.name}
                    </span>
                    <span className="cursor-text shrink-[9999999] overflow-hidden text-ellipsis ml-2">
                        @{note.user.username}
                    </span>
                    <span className="shrink-0 ml-auto">
                        {note.createdAt}
                    </span>
                </div>
            </CardHeader>
            <div className="flex pb-2">
                ====Instance Bar====
            </div>
            <CardBody
                className="mb-6 p-0"
            >
                <span className="cursor-text text-wrap w-full">
                    {note.text}
                </span>
                {/* <picture>
                    <img
                        className="h-96 w-full object-cover object-center rounded-lg"
                        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                        alt="nature image"
                    />
                </picture> */}
                <div className="flex w-auto">
                    <Button>Reply</Button>
                    <Button>ReNote</Button>
                    <Button>Reaction</Button>
                    <Button>Other</Button>
                </div>
            </CardBody>
        </Card>
    );
}