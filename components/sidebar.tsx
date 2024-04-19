"use client";

import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    HomeIcon,
    UserCircleIcon,
    CloudIcon,
    Cog6ToothIcon,
    ListBulletIcon,
    PencilIcon
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Account, findAllAccounts } from "@/lib/bindings";
import { toastThrownError } from "@/lib/toast";

export function SideBar({ className }: { className?: string }) {

    const [accounts, setAccounts] = React.useState([] as Account[]);

    React.useEffect(() => {
        findAllAccounts().then((a) => {
            setAccounts(a);
            
        }).catch((e) => {
            toastThrownError(e);
        });
    }, []);

    return (
        <Card
            className={`${className} w-auto max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 h-screen shrink-0`}
        >
            <List
                className="min-w-[10rem] flex-grow"
            >
                <SideBarItem href={"/"} text={"Home"} icon={HomeIcon} />
                {
                    accounts.map((a, index) => (
                        <SideBarAccordionItem key={index} section={a.user_id} userName={a.user_name} displayName={a.display_name} domain={a.server_domain} icon={UserCircleIcon} />
                    ))
                }
                <div className={'flex-grow'} />
                <SideBarItem href={"/piyo"} text={"Note"} icon={PencilIcon} />
                <SideBarItem href={"/appSettings"} text={"App Settings"} icon={Cog6ToothIcon} />
            </List>
        </Card>
    );
}

function SideBarAccordionItem({ section, userName, displayName, domain, icon }: { section: string, userName: string, displayName: string, domain: string, icon: React.ComponentType<{ className?: string }> }) {
    const IconElement = icon;
    const router = useRouter();
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value: number) => {
        setOpen(open === value ? 0 : value);
    };
    return (
        <Accordion
            open={open === 1}
            icon={
                <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                />
            }
        >
            <ListItem selected={open === 1} className="p-0">
                <AccordionHeader onClick={() => handleOpen(1)} className="p-3">
                    <ListItemPrefix>
                        <IconElement className="h-5 w-5" />
                    </ListItemPrefix>
                    <div className="flex-grow" >
                        <Typography color="blue-gray" className="mr-auto font-black">
                            {displayName}
                        </Typography>
                        <Typography color="blue-gray" className="mr-auto font-normal">
                            @{userName}@{domain}
                        </Typography>
                    </div>
                </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
                <List className="p-0">
                    <SideBarItem href={`${section}/hoge`} text={"Hoge"} icon={ListBulletIcon} />
                    <SideBarItem href={`${section}/piyo`} text={"Piyo"} icon={ListBulletIcon} />
                    <SideBarItem href={`${section}/setting`} text={"Account Setting"} icon={Cog6ToothIcon} />
                </List>
            </AccordionBody>
        </Accordion>
    );
}

function SideBarItem({ href, text, icon }: { href: string, text: string, icon: React.ComponentType<{ className?: string }> }) {
    const IconElement = icon;
    const router = useRouter();
    return (
        <ListItem
            onClick={() => router.push(href)}
        >
            <ListItemPrefix>
                <IconElement className="h-5 w-5" />
            </ListItemPrefix>
            {text}
        </ListItem>
    );
}