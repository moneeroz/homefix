"use client";

import React, { useState } from "react";
import { Avatar, Typography, Button, Grid, Box } from "@mui/material";
import { CustomTextField, CustomDashboardCard } from "@/components";
import { useSession } from "next-auth/react";

const initialState = {
    name: "Misha",
    image: "",
    phone: "92384992374",
    email: "email@email.com",
    address: "address",
    city: "Cidty",
    postalCode: "T4T4Y5",
    country: "country",
};

const ProfileCard = () => {
    const [userData, setUserData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const renderFields = Object.entries(userData).map(([key, value]) => (
        <Grid item xs={12} sm={6} key={key}>
            <CustomTextField name={key} value={value} onChange={handleChange} />
        </Grid>
    ));

    return (
        <CustomDashboardCard>
            <Grid item xs={12}>
                <Grid container sx={{ marginBottom: "2rem" }} spacing={1}>
                    <Grid
                        container
                        item
                        xs={12}
                        sm={6}
                        sx={{ alignItems: "center", justifyContent: "start" }}
                    >
                        <Box>
                            <Avatar
                                src={`${userData?.image}`}
                                alt={`${userData?.name}`}
                                sx={{
                                    width: 90,
                                    height: 90,
                                    marginRight: "1rem",
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{ marginLeft: 0.8 }}
                            >
                                {userData?.name}
                            </Typography>
                            <Button size="small">Upload Photo</Button>
                        </Box>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            margin: "2rem auto",
                            alignItems: { xs: "center" },
                            justifyContent: { xs: "space-around", sm: "end" },
                        }}
                    >
                        <Button size="small">Message</Button>
                        <Button size="small">Save</Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    lg={6}
                    spacing={2}
                    sx={{ maxWidth: 600 }}
                >
                    {renderFields}
                </Grid>
            </Grid>
        </CustomDashboardCard>
    );
};

export default ProfileCard;