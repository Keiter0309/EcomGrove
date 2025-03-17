export interface SubMenu {
  name: string;
  href: string;
}

export interface Nav {
  name: string;
  href: string;
  submenu?: {
    category: string;
    items: SubMenu[];
  }[];
}
