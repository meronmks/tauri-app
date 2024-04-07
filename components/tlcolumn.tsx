"use client";

import React from "react";
import { Card, Avatar, List, ListItem } from "@material-tailwind/react";
import TimelineNote from "./timelinenote";
import WebSocket from "tauri-plugin-websocket-api";
import { debug } from "tauri-plugin-log-api";

export function TLColumn({ className, endpoint }: {
    className?: string;
    endpoint: string;
}) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!loading) return;
        setLoading(false);
        (async () => {
            const wss = await WebSocket.connect(`wss://${endpoint}/streaming`);

            wss.addListener((msg) => {
                if (msg.data !== null) {
                }
            });

            await wss.send(JSON.stringify({
                "type": "connect",
                "body": {
                    "channel": "localTimeline",
                    "id": "1",
                    "params": {
                        "withRenotes": true,
                        "withReplies": false
                    }
                }
            }));
        })();
    }, [endpoint, loading]);
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