import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="bg-white p-2 m-2 min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow p-4">
                <div className="bg-gray-100 p-8 m-4 rounded-2xl shadow-lg overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
