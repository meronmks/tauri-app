"use client";

import { Account, fetchRawMisskeyApi, findAllAccounts } from "@/lib/bindings";
import { toastThrownError } from "@/lib/toast";
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, Select, Option, Textarea, Typography } from "@material-tailwind/react";
import React from "react";

export function NotePostDialog({ className, open, handleOpen }: { className?: string, open: boolean, handleOpen: () => void }) {

    const [noteText, setNoteText] = React.useState("");
    const [accounts, setAccounts] = React.useState([] as Account[]);
    const [selectIndex, setSelectIndex] = React.useState(0);
    const [postNoteDisabled, setPostNoteDisabled] = React.useState(true);
    const postNote = async () => {
        setPostNoteDisabled(true);
        const json = await fetchRawMisskeyApi(accounts[selectIndex].server_domain, "notes/create", `{ 
            "i": "${accounts[selectIndex].access_token}",
            "text": "${noteText}",
            "cw": null,
            "localOnly": false,
            "poll": null,
            "reactionAcceptance": null,
            "visibility": "public" }`);
        setPostNoteDisabled(false);
        console.log(json);
        handleOpen();
    }

    React.useEffect(() => {
        findAllAccounts().then((a) => {
            setAccounts(a);

        }).catch((e) => {
            toastThrownError(e);
        });
    }, []);

    React.useEffect(() => {
        if (noteText.length > 0) {
            setPostNoteDisabled(false);
        } else {
            setPostNoteDisabled(true);
        }
    }, [noteText]);

    return (
        <Dialog
            size="md"
            open={open}
            handler={handleOpen}
            className={`bg-transparent shadow-none p-8 bg-cover`}
        >
            <Card className="w-full p-2 h-auto">
                <DialogHeader>
                    <Typography className="text-2xl font-bold">
                        New Note
                    </Typography>
                    <Select onChange={(e) => setSelectIndex(Number(e))} label="Post Account">
                        {
                            accounts.map((a, index) => (
                                <Option key={index} value={String(index)}>{a.user_name}@{a.server_domain}</Option>
                            ))
                        }
                    </Select>
                </DialogHeader>
                <DialogBody>
                    <Textarea onChange={e => setNoteText(e.target.value)} label="Note" />
                </DialogBody>
                <DialogFooter>
                    <Button disabled={postNoteDisabled} onClick={postNote}>Post</Button>
                </DialogFooter>
            </Card>

        </Dialog>
    );
}