'use client'

import Sidebar from "./Side_bar";
import RecentDesign from "./Recent_Design";

export default function SideNav({ drawerOpen, setDrawerOpen }: { drawerOpen: boolean, setDrawerOpen: (open: boolean) => void }) {
    return (
        <div className="flex flex-col md:flex-row h-auto md:h-screen w-full relative">
            {/* Backdrop for mobile drawer */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close recent designs menu"
                />
            )}
            <div className="w-full md:w-auto h-[60px] md:h-full">
                <Sidebar />
            </div>
            {/* Drawer for mobile, always visible on desktop */}
            <div className="w-full h-auto md:h-full">
                <RecentDesign drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            </div>
        </div>
    );
}