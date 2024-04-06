"use client";

import { Card, Avatar, List, ListItem } from "@material-tailwind/react";
import TimelineNote from "./timelinenote";

export function TLColumn({ className, endpoint }: {
    className?: string;
    endpoint: string;
}) {
    return (
        <Card
            className={`${className} w-auto p-0 h-auto overflow-y-auto`}
        >
            <List
                className="min-w-[10rem] flex-grow"
            >
                <ListItem
                    className="p-0 cursor-default"
                    ripple={false}
                    onClick={(e) => e.preventDefault()}
                >
                    <TimelineNote />
                </ListItem>
                <ListItem
                    className="p-0 cursor-default"
                    ripple={false}
                    onClick={(e) => e.preventDefault()}
                >
                    <TimelineNote />
                </ListItem>
            </List>
        </Card>
    );
}