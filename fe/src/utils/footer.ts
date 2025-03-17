import { Facebook, Instagram, Youtube } from "lucide-react";
import { getInTouch, help } from "../interfaces";

export const GetInTouchItems: getInTouch[] = [
    {
        id: 1,
        desc: "Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879",
        social: [
            { name: "facebook", href: "https://facebook.com", icon: Facebook }, // Store component reference
            { name: "instagram", href: "https://instagram.com", icon: Instagram },
            { name: "youtube", href: "https://youtube.com", icon: Youtube },
        ],
    },
];



export const HelpItems: help[] = [
    { id: 1, name: "Track Order", href: "/track-order" },
    { id: 2, name: "Returns", href: "/returns" },
    { id: 3, name: "Shipping", href: "/shipping" },
    { id: 4, name: "FAQs", href: "/faqs" },
];
