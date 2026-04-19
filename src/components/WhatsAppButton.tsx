import { MessageCircle } from "lucide-react";
import { brand } from "@/data/constants";

const WhatsAppButton = () => {
  const message = encodeURIComponent(
    `Hi ${brand.name}! I'd like to discuss a project.`,
  );
  const href = `https://wa.me/${brand.whatsappNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
      <span className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all hover:scale-105">
        <MessageCircle size={22} />
        <span className="hidden sm:inline text-sm font-semibold pr-1">Chat on WhatsApp</span>
      </span>
    </a>
  );
};

export default WhatsAppButton;
