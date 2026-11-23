import type { Metadata } from "next";
import "./globals.css";
import { AdminAuthGate } from "./components/admin-auth-gate";
export const metadata: Metadata={title:"DOJO WALK · Owner Console",description:"Managed dog walking operations"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AdminAuthGate>{children}</AdminAuthGate></body></html>}
