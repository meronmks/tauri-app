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
    Select,
    Option,
} from "@material-tailwind/react";
import { Account, fetchRawMisskeyApi, findAllAccounts, miauthCheck, miauthInit, createTimeline } from "@/lib/bindings";
import { v4 as uuidv4 } from 'uuid';
import { toastError, toastSuccess, toastThrownError } from "@/lib/toast";
import { ToastContainer } from "react-toastify";

export default function Page() {

    const [addAccountDialog, setAddAccountDialogOpen] = React.useState(false);
    const [addColumnDialog, setAddColumnDialogOpen] = React.useState(false);
    const [domainURL, setDomainURL] = React.useState("");
    const [uuid, setUuid] = React.useState("");
    const [bgImageURL, setBgImageURL] = React.useState("");
    const [disabledLogin, setDisabledLogin] = React.useState(true);
    const [disabledCheck, setDisabledCheck] = React.useState(true);
    const [accounts, setAccounts] = React.useState([] as Account[]);
    const [selectAccount, setSelectAccount] = React.useState("");
    const [tlChannel, setTlChannel] = React.useState("");

    const addAccountDialogOpen = () => {
        setAddAccountDialogOpen((cur) => !cur);
    }
    const addColumnDialogOpen = () => {
        setAddColumnDialogOpen((cur) => !cur);
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
            setDomainURL("");
            setBgImageURL("");
            loadAccounts();
            addAccountDialogOpen();
        } else {
            toastError("Login Failed");
        }
    }

    const loadAccounts = () => {
        findAllAccounts().then((a) => {
            setAccounts(a);
        }).catch((e) => {
            toastThrownError(e);
        });
    }

    const addTimeline = () => {
        if (selectAccount == "") return;
        createTimeline(accounts[Number(selectAccount)-1].id, accounts[Number(selectAccount)-1].server_domain, tlChannel).then(() => {
            toastSuccess("Timeline Added");
            addColumnDialogOpen();
        }).catch((e) => {
            toastThrownError(e);
        });
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

    React.useEffect(() => {
        loadAccounts();
    }, []);

    return (
        <>
            <div className={`flex flex-col overflow-hidden w-full gap-3 p-4`}>
                <Button onClick={addAccountDialogOpen}>Add Account</Button>
                <Button onClick={addColumnDialogOpen}>Add Column</Button>
            </div>
            <Dialog
                size="md"
                open={addAccountDialog}
                handler={addAccountDialogOpen}
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
                        <Input label="Server Domain" size="lg" placeholder="ex) misskey.io" value={domainURL} onChange={e => setDomainURL(e.target.value)} />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button disabled={disabledLogin} variant="gradient" onClick={openBrowserMiAuth} fullWidth>
                            Login (Open Browser)
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
            <Dialog
                size="md"
                open={addColumnDialog}
                handler={addColumnDialogOpen}
                className={`bg-transparent shadow-none p-8 bg-cover`}
            >
                <Card>
                    <CardBody>
                        <Typography variant="h4" color="blue-gray">
                            AddTimeLine
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                            Select User
                        </Typography>
                        <Select
                            value={selectAccount}
                            onChange={(val) => setSelectAccount(val || "")}
                        >
                            {
                                accounts.map((a, index) => (
                                    <Option key={index} value={a.id.toString()}>{a.user_name}@{a.server_domain}</Option>
                                ))
                            }
                        </Select>
                        <Typography className="-mb-2" variant="h6">
                            Timleline channel
                        </Typography>
                        <Input label="Server Domain" size="lg" placeholder="ex) homeTimeline" value={tlChannel} onChange={e => setTlChannel(e.target.value)} />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={addTimeline} fullWidth>
                            Add!
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}