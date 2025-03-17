import { banner } from "../interfaces";
import img_1 from "../assets/images/1.jpg";
import img_2 from "../assets/images/2.jpg";
import img_3 from "../assets/images/3.jpg";
import img_4 from "../assets/images/4.jpg";
import img_5 from "../assets/images/5.jpg";

export const FirstBannerItems: banner[] = [
  {
    name: "Ocean & Sea Photography",
    desc: "Sunrise over the ocean",
    href: "/ocean-sea",
    image_path: img_1,
  },
  {
    name: "Mountain & Highland Photography",
    desc: "Valleys & rolling hills",
    href: "/mountain-highland",
    image_path: img_2,
  },
];
export const SecondBannerItems: banner[] = [
  {
    name: "Forest & Nature Photographya",
    desc: "Tropical rainforests",
    href: "/forest-nature",
    image_path: img_5,
  },
  {
    name: "Desert & Grassland Photography",
    desc: "Cactus & desert flora",
    href: "/desert-grassland",
    image_path: img_3,
  },
  {
    name: "Cityscape & Urban Photography",
    desc: "City skyline at night",
    href: "city-urban",
    image_path: img_4,
  },
];
