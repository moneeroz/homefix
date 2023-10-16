"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import axios from "axios";

import {
    Loader,
    ContactList,
    MessageList,
    EditorMessageFeild,
    DashConversationCard,
    MessageItem,
} from "@/components";

import { Grid, ListItem, ListItemText, Stack } from "@mui/material";

import { ConversationContactsType, FullMessageType } from "@/app/types";

const fetcher = (url: URL) => fetch(url).then((r) => r.json());

const page = () => {
    const { data, error } = useSWR("/api/conversations", fetcher, {
        refreshInterval: 1000,
    });
    const [messages, setMessages] = useState<FullMessageType[]>([]);
    const [converasation, setConversation] = useState<
        ConversationContactsType[]
    >([]);
    const [activeConversationId, setActiveConversationId] =
        useState<string>("");

    if (error) {
        toast.error(error.message);
    }

    useEffect(() => {
        if (data) {
            setConversation(data);
        }
    }, [data]);

    const handleGetMessages = async (conversationId: string) => {
        try {
            const response = await axios.get(`/api/messages/${conversationId}`);

            setActiveConversationId(conversationId);
            setMessages(response.data);
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    };

    const hadnleDeleteMessage = async (messageId: string) => {
        try {
            const response = await axios.delete(
                `/api/messages/delete/${messageId}`
            );

            setMessages(response.data);
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    };

    const renderEmptyListItem = (
        <ListItem alignItems="flex-start">
            <ListItemText primary="Contact List Empty" />
        </ListItem>
    );

    const renderConversationList = (
        <ContactList>
            {converasation.length > 0
                ? converasation.map((obj: ConversationContactsType) => (
                      <DashConversationCard
                          key={obj.id}
                          activeConversationId={activeConversationId}
                          onClick={() => handleGetMessages(obj.id)}
                          {...obj}
                      />
                  ))
                : renderEmptyListItem}
        </ContactList>
    );

    const renderMessagesList = (
        <MessageList>
            {messages.map((obj: FullMessageType) => (
                <MessageItem
                    {...obj}
                    key={obj.id}
                    onDelete={() => hadnleDeleteMessage(obj.id)}
                />
            ))}
            <Stack
                sx={{
                    width: "100%",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                }}
            >
                <EditorMessageFeild
                    onChange={() => console.log("Change text area")}
                    onClick={() => console.log("Click Send")}
                />
            </Stack>
        </MessageList>
    );

    return (
        <Grid container justifyContent="center" sx={{ height: "100%" }}>
            <Grid container item xs={12} spacing={2} sx={{ height: "100%" }}>
                <Grid item xs={12} md={4} sx={{ height: "fit-content" }}>
                    {renderConversationList}
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                        // 2px for grid spacing and 8rem for maxHeight of the contacts container
                        height: { xs: "calc(100% - 2px - 8rem)", md: "100%" },
                    }}
                >
                    {renderMessagesList}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default page;
