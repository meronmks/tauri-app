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
import { fetchRawMisskeyApi, miauthCheck, miauthInit } from "@/lib/bindings";
import { v4 as uuidv4 } from 'uuid';
import { toastError, toastSuccess } from "@/lib/toast";
import { ToastContainer } from "react-toastify";

export default function Page() {

    const [open, setOpen] = React.useState(false);
    const [domainURL, setDomainURL] = React.useState("");
    const [uuid, setUuid] = React.useState("");
    const [bgImageURL, setBgImageURL] = React.useState("");
    const [disabledLogin, setDisabledLogin] = React.useState(true);
    const [disabledCheck, setDisabledCheck] = React.useState(true);

    const handleOpen = () => {
        setOpen((cur) => !cur);
    }
    const openBrowserMiAuth = () => {
        setUuid(uuidv4());
        setDisabledCheck(false);
        miauthInit(uuid, domainURL);
    }
    const checkMiAuth = async () => {
        let result = await miauthCheck(uuid, domainURL);
        if (result) {
            toastSuccess("Login Success");
            handleOpen();
        } else {
            toastError("Login Failed");
        }
    }

    React.useEffect(() => {
        if (domainURL.length > 0) {
            setDisabledLogin(false);
        } else {
            setDisabledLogin(true);
            setDisabledCheck(true);
        }
        
        const timer = setTimeout(async () => {
            const json = await fetchRawMisskeyApi(domainURL, "meta", '{ "detail": false }');
            console.log(json?.backgroundImageUrl);
            setBgImageURL(json?.backgroundImageUrl);
        }, 1000);

        return () => clearTimeout(timer);
    }, [domainURL]);

    return (
        <>
            <div className={`flex flex-col overflow-hidden w-full gap-3 p-4`}>
                <Button onClick={handleOpen}>Add Account</Button>
            </div>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className={`bg-transparent shadow-none p-8 bg-cover`}
                style={{ backgroundImage: `url("${bgImageURL}")` }}
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
                        <Input label="Server Domain" size="lg" placeholder="misskey.io" value={domainURL} onChange={e => setDomainURL(e.target.value)} />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button disabled={disabledLogin} variant="gradient" onClick={openBrowserMiAuth} fullWidth>
                            Login
                        </Button>
                        <Button disabled={disabledCheck} className="mt-4" variant="gradient" onClick={checkMiAuth} fullWidth>
                            Auth Check
                        </Button>
                    </CardFooter>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable
                        theme="light"
                    />
                </Card>
            </Dialog>
        </>
    );
}