import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


interface CalendlyDialogProps {
  triggerClassName?: string;
  triggerLabel?: string;
  showIcon?: boolean;
}

const CalendlyDialog = ({
  triggerClassName = "inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity",
  triggerLabel = "Book a Discovery Call",
  showIcon = true,
}: CalendlyDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClassName}>
        {showIcon && <Calendar size={18} />}
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Book a free 30-minute call</DialogTitle>
          <DialogDescription>
            Tell us about your project and we'll send a written proposal within 24 hours.
          </DialogDescription>
        </DialogHeader>
       
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyDialog;
