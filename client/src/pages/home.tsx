import { XeveDocApp } from "@/components/XeveDocApp";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <XeveDocApp />
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </>
  );
}
