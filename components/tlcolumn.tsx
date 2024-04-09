"use client";

import React, { useEffect } from "react";
import { Card, Avatar, List, ListItem } from "@material-tailwind/react";
import TimelineNote from "./timelinenote";
import WebSocket from "tauri-plugin-websocket-api";
import { debug, error } from "tauri-plugin-log-api";

export function TLColumn({ className, endpoint }: {
    className?: string;
    endpoint: string;
}) {
    const [loading, setLoading] = React.useState(true);
    const wss = React.useRef<WebSocket | null>(null);
    const [notes, setNotes] = React.useState([] as any[]);

    React.useEffect(() => {
        if (!loading) return;
        debug(`Loading TLColumn with endpoint ${endpoint}`);
        setLoading(false);

        const connectWebSocket = async () => {
            debug(`Connecting to WebSocket at ${endpoint}`);
            wss.current = await WebSocket.connect(`wss://${endpoint}/streaming`);

            wss.current.addListener((msg: any) => {
                try {
                    const jsonData = JSON.parse(msg.data);
                    setNotes(prevNotes => [jsonData, ...prevNotes]);
                    debug(`Received WebSocket message!`);
                } catch (e) {
                    error(`Error parsing WebSocket message: ${e}`);
                }
            });

            await wss.current.send(JSON.stringify({
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
        };

        const disconnectWebSocket = () => {
            if (wss.current) {
                debug("Disconnecting from WebSocket");
                wss.current.disconnect();
                wss.current = null;
            }
        };

        connectWebSocket();

        return () => {
            window.removeEventListener('beforeunload', disconnectWebSocket);
            disconnectWebSocket();
        };
    }, [endpoint, loading]);

    // ウィンドウがアンロードされる前にWebSocketを切断する
    React.useEffect(() => {
        const handleBeforeUnload = () => {
            debug("Disconnecting from WebSocket before unloading window");
            wss.current?.disconnect();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <Card
            className={`${className} w-auto p-0 h-auto overflow-y-auto`}
        >
            <List
                className="min-w-[10rem] flex-grow"
            >
                {
                    notes.slice(0).reverse().map((n) => (
                        <ListItem
                            key={n.body.body.id}
                            className="p-0 cursor-default"
                            ripple={false}
                            onClick={(e) => e.preventDefault()}
                        >
                            <TimelineNote note={n.body.body} />
                        </ListItem>
                    ))
                }
            </List>
        </Card>
    );
}