import React from "react";
import { CategoriesItem, GetInTouchItems, HelpItems } from "../../utils";

export default function Footer() {
  return (
    <footer className="md:p-15 bg-[#222222] h-[70rem] md:h-[30rem] text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 pt-5">
        <div className="p-5">
          <h3 className="uppercase font-bold">categories</h3>
          <ul className="flex flex-col gap-y-5 mt-5 text-sm text-gray-300">
            {CategoriesItem.map((item) => (
              <li
                key={item.id}
                className="hover:text-indigo-400 transition-all duration-300 ease-in-out hover:cursor-pointer"
              >
                <a href={item.href} aria-label={`Go to ${item.name}`}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <h3 className="uppercase font-bold">help</h3>
          <ul className="flex flex-col gap-y-5 mt-5 text-sm text-gray-300">
            {HelpItems.map((item) => (
              <li
                key={item.id}
                className="hover:text-indigo-400 transition-all duration-300 ease-in-out hover:cursor-pointer"
              >
                <a href={item.href} aria-label={`Go to ${item.name}`}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <h3 className="uppercase font-bold">get in touch</h3>
          <ul className="flex flex-col gap-y-5 mt-5 text-sm text-gray-300">
            {GetInTouchItems.map((item) => (
              <div key={item.id}>
                <li>{item.desc}</li>
                {item.social.map((socialItem) => (
                  <a
                    key={socialItem.name}
                    href={socialItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition"
                    aria-label={`Visit ${socialItem.name} page`}
                  >
                    {React.createElement(socialItem.icon, {
                      className: "w-6 h-6 inline-block my-3 mr-3",
                    })}
                  </a>
                ))}
              </div>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <h3 className="uppercase font-bold">newsletter</h3>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            className="border-b-1 border-b-gray-700 border-spacing-10 focus:outline-none focus:border-b-indigo-500 transition-all duration-300 text-sm py-2 px-2 w-full"
            aria-label="Enter your email for the newsletter"
          />
          <button className="mt-5 w-full py-2 px-3 rounded-full bg-indigo-400 text-white shadow-md hover:bg-white hover:text-indigo-400 hover:cursor-pointer transition-all duration-300 ease-in-out uppercase">subscribe</button>
        </div>
      </div>
    </footer>
  );
}
