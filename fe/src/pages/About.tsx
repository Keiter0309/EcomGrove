import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { ETypes } from "../enums/ETypes";
import { EURI } from "../enums/EURI";
import { ourMission, ourStory } from "../utils";

export default function About() {
  const baseUri = `${EURI.IMAGE_URI}/${ETypes.CITY}/city_1.jpg`;

  return (
    <>
      {/* Header */}
      <Header />

      {/* Banner */}
      {ourStory.map((item, index) => (
        <div key={index}>
          <div
            className="relative min-h-[15rem] bg-cover bg-center flex justify-center items-center mt-0 lg:mt-14"
            style={{ backgroundImage: `url(${baseUri})` }}
          >
            <span className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4">
              {item.name}
            </span>
          </div>

          {/* Our Story */}
          <section className="py-10 container mx-auto px-4">
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 flex flex-col max-w-3xl">
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    {item.title}
                  </h1>
                  {Object.values(item.content).map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="pt-5 md:pt-8 text-sm md:text-base leading-relaxed text-gray-500"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="lg:col-span-1 relative">
                  <div className="absolute -top-8 -left-8 w-full h-full border border-gray-300 rounded-lg transform translate-x-5 translate-y-5 pointer-events-none"></div>
                  <img
                    src={`${EURI.IMAGE_URI}/${ETypes.SUNRISE}/sunrise_1.jpg`}
                    alt=""
                    className="w-full h-full object-cover rounded-lg relative z-10 transition-transform duration-300 ease-in-out hover:translate-x-2 hover:translate-y-2"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      ))}
      {ourMission.map((item, index) => (
        <div key={index}>
          {/* Our Mission */}
          <section className="py-10 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 relative order-1 lg:order-none">
                <div className="absolute -top-8 -left-8 w-full h-full border border-gray-300 rounded-lg transform translate-x-5 translate-y-5 pointer-events-none"></div>
                <img
                  src={`${EURI.IMAGE_URI}/${ETypes.VALLEY}/valley_1.jpg`}
                  alt=""
                  className="w-full h-full object-cover rounded-lg relative z-10 transition-transform duration-300 ease-in-out hover:translate-x-2 hover:translate-y-2"
                />
              </div>
              <div className="lg:col-span-2 flex flex-col max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {item.title}
                </h1>
                <p className="pt-5 md:pt-8 text-sm md:text-base leading-relaxed text-gray-500">
                  {item.content.paragraph_1}
                </p>
                <p className="pt-5 text-sm md:text-base leading-relaxed text-gray-500 border-l-4 border-gray-300 pl-4">
                  {item.content.paragraph_2}
                </p>
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* Footer */}
      <Footer />
    </>
  );
}
