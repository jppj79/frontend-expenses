export const useLayout = () => {
    const isSidebarOpen = useState('layout-sidebar-open', () => false) // Mobile state (closed default)
    const isSidebarCollapsed = useState('layout-sidebar-collapsed', () => false) // Desktop state (expanded default)

    const toggleSidebar = () => {
        // We can check viewport width or just toggle based on current state.
        // But since we have separate states for mobile slide-out and desktop collapse, we need logic.
        // Since we are running on client mostly for this interaction:
        if (window.innerWidth >= 1024) { // lg breakpoint
            isSidebarCollapsed.value = !isSidebarCollapsed.value
        } else {
            isSidebarOpen.value = !isSidebarOpen.value
        }
    }

    const closeSidebar = () => {
        isSidebarOpen.value = false
    }

    return {
        isSidebarOpen,
        isSidebarCollapsed,
        toggleSidebar,
        closeSidebar
    }
}
