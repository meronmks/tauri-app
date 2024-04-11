"use client";

import React, { useEffect } from "react";
import { Card, Avatar, List, ListItem } from "@material-tailwind/react";
import TimelineNote from "./timelinenote";
import WebSocket from "tauri-plugin-websocket-api";

export function TLColumn({ className, endpoint }: {
    className?: string;
    endpoint: string;
}) {
    const [loading, setLoading] = React.useState(true);
    const wss = React.useRef<WebSocket | null>(null);
    const [notes, setNotes] = React.useState([] as any[]);

    React.useEffect(() => {
        if (!loading) return;
        console.debug(`Loading TLColumn with endpoint ${endpoint}`);
        setLoading(false);

        const connectWebSocket = async () => {
            console.debug(`Connecting to WebSocket at ${endpoint}`);
            wss.current = await WebSocket.connect(`wss://${endpoint}/streaming`);
            console.debug(`Connected to WebSocket at ${endpoint}`);

            wss.current.addListener((msg: any) => {
                try {
                    if (msg.data){
                        const jsonData = JSON.parse(msg.data);
                        setNotes(prevNotes => [jsonData, ...prevNotes]);
                        console.debug(`Received WebSocket message!`);
                    }
                } catch (e) {
                    console.error(`Error parsing WebSocket message: ${e}`);
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
            console.debug("Pre Disconnecting from WebSocket");
            if (wss.current) {
                console.debug("Disconnecting from WebSocket");
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
            console.debug("Disconnecting from WebSocket before unloading window");
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
                    notes.map((note, index) => (
                        <ListItem
                            key={index}
                            className="p-0 cursor-default"
                            ripple={false}
                            onClick={(e) => e.preventDefault()}
                        >
                            <TimelineNote note={note.body.body} />
                        </ListItem>
                    ))
                }
            </List>
        </Card>
    );
}