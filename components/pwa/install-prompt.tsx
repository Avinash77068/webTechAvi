"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  useEffect(() => {
    if (isAppInstalled()) return;

    let installToastId: string | number | undefined;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      const installEvent = event as BeforeInstallPromptEvent;

      installToastId = toast("Install TechSutra", {
        id: "pwa-install-prompt",
        description: "Add TechSutra to your device for quick access to your tools.",
        position: "top-center",
        duration: Infinity,
        action: {
          label: "Install",
          onClick: () => {
            void installEvent.prompt().then(async () => {
              const { outcome } = await installEvent.userChoice;
              toast.dismiss(installToastId);
              if (outcome === "accepted") {
                toast.success("TechSutra installed", {
                  id: "pwa-install-success",
                  position: "top-center",
                });
              }
            }).catch(() => {
              toast.error("Could not open the install prompt", { position: "top-center" });
            });
          },
        },
        cancel: {
          label: "Later",
          onClick: () => toast.dismiss(installToastId),
        },
      });
    }

    function handleAppInstalled() {
      toast.dismiss(installToastId);
      toast.success("TechSutra installed", {
        id: "pwa-install-success",
        position: "top-center",
      });
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS && !sessionStorage.getItem("techsutra-ios-install-hint")) {
      sessionStorage.setItem("techsutra-ios-install-hint", "shown");
      toast.info("Install TechSutra", {
        description: "Safari mein Share tap karein, phir ‘Add to Home Screen’ chunein.",
        position: "top-center",
        duration: 9000,
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return null;
}
