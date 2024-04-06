"use client";

import { Avatar, Card, CardBody, CardHeader, Typography, Button } from "@material-tailwind/react";

export default function TimelineNote({ className }: { className?: string }) {
    return (
        <Card
            className={`${className} w-auto p-2 h-auto`}
        >
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-0 pt-0 pb-2"
            >
                <div className="flex items-start whitespace-nowrap w-full">
                    <Avatar
                        size="lg"
                        variant="circular"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                        alt="tania andrew"
                        className="shrink-0"
                    />
                    <span className="block shrink-1 overflow-hidden p-0 ml-2">
                        Tania
                    </span>
                    <span className="cursor-text shrink-[9999999] overflow-hidden text-ellipsis ml-2">
                        @Tania
                    </span>
                    <span className="shrink-0 ml-auto">
                        10m
                    </span>
                </div>
            </CardHeader>
            <div className="flex pb-2">
                ====Instance Bar====
            </div>
            <CardBody
                className="mb-6 p-0"
            >
                <span className="cursor-text text-wrap">
                    Lorem ipsum dolor sit amet te accusam enim erat labore volutpat. Quis ut et justo. Et et labore et luptatum labore. Erat nulla kasd kasd et ullamcorper takimata lorem odio takimata duis lorem nonummy iriure sadipscing. Dolore gubergren nisl odio volutpat consequat invidunt invidunt ipsum dolores gubergren sit ut ut sit esse sanctus. Magna consetetur et est ipsum sed voluptua dolor accusam ea est iusto te diam. Dolore dolore voluptua consetetur stet nulla euismod odio voluptua stet.
                </span>
                <picture>
                    <img
                        className="h-96 w-full object-cover object-center rounded-lg"
                        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                        alt="nature image"
                    />
                </picture>
                <Button>a</Button>
                <Button>i</Button>
                <Button>u</Button>
                <Button>e</Button>
            </CardBody>
        </Card>
    );
}