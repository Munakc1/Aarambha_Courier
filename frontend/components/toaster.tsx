"use client";
// how this works: re-export the Lacspace toast API + <Toaster/> from one place.
// Render <Toaster/> once in app/layout.tsx, then call toast.* from anywhere.
export { Toaster, useToast, toast } from "@lacspace/notify/react";
