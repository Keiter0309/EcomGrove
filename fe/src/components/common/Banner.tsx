import { EURI } from "../../enums/EURI";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FirstBannerItems, SecondBannerItems } from "../../utils";

export default function Banner() {
  return (
    <>
      {/* Video Banner */}
      <section className="relative w-full h-[100vh]">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          controls={false}
        >
          <source src={`${EURI.MEDIA_URI}/banner.mp4`} type="video/mp4" />
        </video>
      </section>

      <section className="mt-5 px-5">
        {/* First Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FirstBannerItems.map((item) => (
            <a href={item.href} key={item.name}>
              <div className="relative border border-gray-300 overflow-hidden group hover:cursor-pointer shadow-sm h-[35rem] transition-colors duration-200 ">
                <LazyLoadImage
                  src={item.image_path}
                  alt={item.name}
                  className="w-full min-h-[35rem] object-cover"
                  width="100%"
                  height="560px"
                  effect="opacity"
                  threshold={50}
                  delayTime={100}
                />
                <div className="absolute inset-0 bg-stone-400 opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button className="w-fit relative text-white opacity-0 before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 group-hover:before:w-full group-hover:before:left-0 group-hover:opacity-100">
                    SHOP NOW
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Second Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {SecondBannerItems.map((item) => (
            <a href={item.href} key={item.name}>
              <div className="relative border border-gray-300 overflow-hidden group hover:cursor-pointer shadow-sm h-[25rem] transition-colors duration-200">
                <LazyLoadImage
                  src={item.image_path}
                  alt={item.name}
                  className="w-full min-h-[35rem] object-cover"
                  visibleByDefault={false}
                  effect="opacity"
                  width="100%"
                  height="560px"
                  threshold={200}
                  delayTime={100}
                />
                <div className="absolute inset-0 bg-stone-400 opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button className="w-fit relative text-white opacity-0 before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 group-hover:before:w-full group-hover:before:left-0 group-hover:opacity-100">
                    SHOP NOW
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
