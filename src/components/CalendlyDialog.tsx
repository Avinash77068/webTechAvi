import { useState } from "react";
import { Calendar, Send, Loader2, CheckCircle2, User, Mail, Phone, Building2, Briefcase, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contact } from "./Contact";

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
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto glass-strong border-primary/20">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 glow-border-secondary">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-heading">Book a Free Discovery Call</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Tell us about your project and we'll send a written proposal within 24 hours.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6">
          <Contact />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyDialog;
