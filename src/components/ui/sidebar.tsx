// components/ui/sidebar.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: onOpenChangeProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [_open, _setOpen] = React.useState(defaultOpen)
    const [openMobile, setOpenMobile] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024)
      }
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (onOpenChangeProp) {
          onOpenChangeProp(openState)
        } else {
          _setOpen(openState)
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [open, onOpenChangeProp]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const value: SidebarContext = {
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }

    return (
      <SidebarContext.Provider value={value}>
        <div
          ref={ref}
          data-state={value.state}
          className={cn("group/sidebar-wrapper flex", className)}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      ...props
    },
    ref
  ) => {
    const { isMobile, openMobile, setOpenMobile } = useSidebar()

    return (
      <>
        {isMobile && openMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpenMobile(false)}
          />
        )}
        <div
          ref={ref}
          className={cn(
            "bg-sidebar text-sidebar-foreground flex h-svh w-[var(--sidebar-width)] flex-col transition-all duration-300",
            variant === "floating" && "rounded-lg border m-2",
            collapsible === "icon" && "group-data-[state=collapsed]/sidebar-wrapper:w-16",
            isMobile &&
              cn(
                "fixed inset-y-0 z-50 border-r",
                side === "left" && "-translate-x-full transition-transform duration-300",
                openMobile && "translate-x-0"
              ),
            className
          )}
          {...props}
        />
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex flex-1 flex-col min-w-0", className)}
    {...props}
  />
))
SidebarInset.displayName = "SidebarInset"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-hidden overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex w-full min-w-0 flex-col px-2 py-4", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-sidebar-foreground/70 px-2 py-1.5 text-xs font-medium truncate",
      className
    )}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-md p-2 hover:bg-sidebar-accent",
      className
    )}
    {...props}
  />
))
SidebarGroupAction.displayName = "SidebarGroupAction"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props} />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  cn(
    "peer/menu-button relative flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
    "active:bg-sidebar-primary active:text-sidebar-primary-foreground"
  ),
  {
    variants: {
      isActive: {
        true: "bg-sidebar-primary text-sidebar-primary-foreground",
      },
      size: {
        default: "h-8",
        sm: "h-7 text-xs",
        lg: "h-12 text-base px-3",
      },
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    { className, isActive, size = "default", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size }),
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "peer/menu-action absolute right-1.5 top-1/2 flex aspect-square w-5 -translate-y-1/2 items-center justify-center rounded-md p-0 outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 opacity-0 group-hover/menu-item:opacity-100",
      className
    )}
    {...props}
  />
))
SidebarMenuAction.displayName = "SidebarMenuAction"

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "border-sidebar-border mx-3.5 flex min-w-0 flex-col gap-1 border-l px-2.5 py-0.5",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("group/menu-sub-item relative", className)} {...props} />
))
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

export const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "peer/menu-sub-button relative flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export const SidebarMenuBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1 text-[10px] font-medium text-sidebar-primary-foreground",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

export const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showIcon?: boolean }
>(({ className, showIcon = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-2 py-1.5", className)}
    {...props}
  >
    {showIcon && <div className="h-4 w-4 rounded bg-sidebar-accent" />}
    <div className="flex-1 h-4 bg-sidebar-accent rounded" />
  </div>
))
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

export const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("bg-sidebar-border -mx-2 my-2 h-px", className)}
    {...props}
  />
))
SidebarSeparator.displayName = "SidebarSeparator"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      onClick={toggleSidebar}
      className={cn("rounded-md p-2 hover:bg-accent", className)}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 right-0 w-1 hover:bg-sidebar-accent transition-colors",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"
