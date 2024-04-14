"use client";

import React, { useEffect } from "react";
import { Card, Avatar, List, ListItem } from "@material-tailwind/react";
import TimelineNote from "./timelinenote";
import WebSocket from "tauri-plugin-websocket-api";
import { toastNormal } from "@/lib/toast";
import { Virtuoso } from "react-virtuoso";

export function TLColumn({ className, endpoint, channel, token }: {
    className?: string;
    endpoint: string;
    channel: string;
    token?: string;
}) {
    const wss = React.useRef<WebSocket | null>(null);
    const [notes, setNotes] = React.useState([] as any[]);
    const maxNotes = 300;

    React.useEffect(() => {
        console.debug(`Loading TLColumn with endpoint ${endpoint}`);
        let unmounted = false;
        let intervalTimeout: NodeJS.Timeout | null = null;

        const connectWebSocket = async () => {
            console.debug(`Connecting to WebSocket at ${endpoint}`);
            if (token) {
                wss.current = await WebSocket.connect(`wss://${endpoint}/streaming?i=${token}`);
            } else {
                wss.current = await WebSocket.connect(`wss://${endpoint}/streaming`);
            }
            
            if (unmounted) {
                disconnectWebSocket();
                return;
            }
            toastNormal(`Connected to WebSocket at ${endpoint}`);

            wss.current.addListener((msg: any) => {
                try {
                    if (msg.data){
                        console.debug(msg.data);
                        const jsonData = JSON.parse(msg.data);

                        if (notes.length >= maxNotes) {
                            setNotes(prevNotes => prevNotes.slice(0, maxNotes - 1));
                        }

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
                    "channel": channel,
                    "id": "1",
                    "params": {
                        "withRenotes": true,
                        "withReplies": false
                    }
                }
            }));

            intervalTimeout = setInterval(() => {
                console.debug(`Sending keepalive to WebSocket ${endpoint}`);
                wss.current?.send("h").catch((e) => {
                    console.error(`Error sending keepalive: ${e}`);
                });
            }, 30000);
        };

        const disconnectWebSocket = () => {
            console.debug("Pre Disconnecting from WebSocket");
            unmounted = true;
            if (wss.current) {
                console.debug("Disconnecting from WebSocket");
                wss.current.disconnect();
                wss.current = null;
            }
            if (intervalTimeout) {
                clearInterval(intervalTimeout);
                intervalTimeout = null;
            }
        };

        connectWebSocket();

        return () => {
            window.removeEventListener('beforeunload', disconnectWebSocket);
            disconnectWebSocket();
        };
    }, [endpoint]);

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
            <Virtuoso
                className="min-w-[10rem] flex-grow"
                totalCount={notes.length}
                itemContent={(index) => (
                    <TimelineNote note={notes[index].body.body} />
                )}
            />
        </Card>
    );
}