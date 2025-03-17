import { ForwardRefExoticComponent } from "react";

export interface getInTouch {
    id: number;
    desc: string;
    social: {
        name: string;
        href: string;
        icon: ForwardRefExoticComponent<any>;
    }[];
}

export interface help {
    id: number,
    name: string,
    href: string
}
