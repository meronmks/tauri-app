"use client";

import React from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import { miauthCheck, miauthInit } from "@/lib/bindings";
import { v4 as uuidv4 } from 'uuid';
import { debug } from "tauri-plugin-log-api";

export default function Page() {

    const [open, setOpen] = React.useState(false);
    const [domainURL, setDomainURL] = React.useState("");
    const [uuid, setUuid] = React.useState(uuidv4());
    const handleOpen = () => {
        debug("Call handleOpen");
        setOpen((cur) => !cur);
    }
    const openBrowserMiAuth = () => miauthInit(uuid, domainURL);
    const checkMiAuth = () => {
        debug("Call checkMiAuth");
        miauthCheck(uuid, domainURL);
        handleOpen();
    }

    const onChangeDomainURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomainURL(e.target.value);
    }

    return (
        <>
            <div className={`flex flex-col overflow-hidden w-full gap-3 p-4`}>
                <Button onClick={handleOpen}>Add Account</Button>
            </div>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className={`bg-transparent shadow-none p-8 bg-[url('https://media.niri.la/Header_2023_02_small.jpg')]`}
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Login
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Enter Server Domain to Login.
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                            Server Domain
                        </Typography>
                        <Input label="Server Domain" size="lg" placeholder="misskey.io" value={domainURL} onChange={onChangeDomainURL} />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={openBrowserMiAuth} fullWidth>
                            Login
                        </Button>
                        <Button className="mt-4" variant="gradient" onClick={checkMiAuth} fullWidth>
                            Auth Check
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}