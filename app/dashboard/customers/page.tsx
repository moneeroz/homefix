import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Customers = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (!session && status === "unauthenticated") {
            toast.error("Please log in first");
            throw new Error("You don't have permissions to access this page");
        }
    }, [session, status]);

    return <div>Customers</div>;
};

export default Customers;
