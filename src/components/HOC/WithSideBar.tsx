import * as React from "react"
import { useSidebar, SidebarContextProps } from "@/components/ui/sidebar"

export function withSidebar<T>(Component: React.ComponentType<T>)
{
    return (props: Omit<T, keyof SidebarContextProps>) =>
    {
        const sidebarContext = useSidebar()
        return <Component {...(props as T)} {...sidebarContext} />
    }
}