import AuthProvider from "@/providers/auth-provider";
import { Outlet } from "react-router";

function UserLayout() {
    return (
        <section>
            <Outlet />
        </section>
    )
}

export default AuthProvider(UserLayout);
