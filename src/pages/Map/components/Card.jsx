import React, { forwardRef, useEffect, useRef, useState } from "react";
import { FaCar } from "react-icons/fa";
import { RiMotorbikeFill } from "react-icons/ri";
import { FaTrainSubway } from "react-icons/fa6";
import { FaWalking } from "react-icons/fa";
import gsap from "gsap";

const cardDetails = {
  DBS: {
    name: "DBS International School",
    time: { drive: 8, transport: 10, bike: 5, walk: 16 },
    details:
      "Deutsche Schule Bombay, a noted international school in vibrant Mumbai.",
    src: "/images/DSB_International_School.webp",
  },
  wilson: {
    name: "Wilson College",
    time: { drive: 5, transport: 10, bike: 5, walk: 25 },
    details:
      "Wilson College, among Mumbai's oldest, stands tall by Girgaon.",
    src: "/images/wilson-college.webp",
  },
  malabarClub: {
    name: "Malabar Hill Club",
    time: { drive: 12, transport: 25, bike: 10, walk: 31 },
    details:
      "Malabar Hill Club, earlier WIAA, is a famous Mumbai-based sports club.",
    src: "/images/malabar.webp",
  },
  cricketClub: {
    name: "Cricket Club of India",
    time: { drive: 17, transport: 33, bike: 20, walk: 72 },
    details:
      "The Cricket Club of India is a premier sporting hub at Churchgate.",
    src: "/images/cricket-club.webp",
  },
  NationalGallery: {
    name: "National Gallery of Modern Art",
    time: { drive: 21, transport: 33, bike: 21, walk: 80 },
    details:
      "National Gallery of Modern Art showcases diverse art and culture.",
    src: "/images/national-gallery.webp",
  },
  NCPA: {
    name: "NCPA",
    time: { drive: 19, transport: 32, bike: 24, walk: 90 },
    details:
      "NCPA, Mumbai’s cultural hub, hosts music, dance, plays and diverse events.",
    src: "/images/NCPA.webp",
  },
  iskonTemple: {
    name: "Iskon Temple",
    time: { drive: 7, transport: 9, bike: 6, walk: 20 },
    details:
      "ISKCON Temple in Mumbai promotes Krishna devotion and spiritual practices.",
    src: "/images/iskcon-temple.webp",
  },
  walkeshwar: {
    name: "Shri Walkeshware Temple",
    time: { drive: 10, transport: 20, bike: 15, walk: 45 },
    details:
      "Shri Walkeshwar Temple, an ancient Shiva shrine, is revered in Mumbai.",
    src: "/images/walkeshwar.webp",
  },
  wasabi: {
    name: "Wasabi by Morimoto",
    time: { drive: 20, transport: 25, bike: 21, walk: 80 },
    details:
      "Wasabi by Morimoto offers authentic Japanese delights in south Mumbai.",
    src: "/images/wasabi.webp",
  },
  interContinental: {
    name: "Intercontinental Dome",
    time: { drive: 19, transport: 30, bike: 24, walk: 70 },
    details:
      "The Dome at Intercontinental offers panoramic views of Marine Drive.",
    src: "/images/intercontinental.webp",
  },
  taj: {
    name: "The Taj Mahal Palace",
    time: { drive: 20, transport: 28, bike: 24, walk: 80 },
    details:
      "The Taj Mahal Palace, Colaba, is a luxury hotel with heritage charm.",
    src: "/images/taj.webp",
  },
  trident: {
    name: "Trident",
    time: { drive: 16, transport: 26, bike: 21, walk: 72 },
    details:
      "The Trident Nariman Point overlooks the Arabian Sea and Marine Drive.",
    src: "/images/trident.webp",
  },
  wankhede: {
    name: "Wankhede Stadium",
    time: { drive: 14, transport: 30, bike: 21, walk: 65 },
    details:
      "Wankhede Stadium in Mumbai is a world-famous international cricket arena.",
    src: "/images/wankhede.webp",
  },
  mahalaxmi: {
    name: "Mahalaxmi Race Course",
    time: { drive: 15, transport: 19, bike: 15, walk: 31 },
    details:
      "Mahalaxmi Racecourse in Mumbai is a renowned horse racing destination.",
    src: "/images/mahalaxmi.webp",
  },
};

const Card = forwardRef(({ activeMarker }, ref) => {
  const [transportState, setTransportState] = useState("drive");
  const [key, setKey] = useState(activeMarker);
  const card = key ? cardDetails[key] : undefined;
  console.log(card);

  const TransportBn = ({type, Icon}) => {
    return (
      <button
        onClick={() => setTransportState(type)}
        className={`${
          transportState === type
            ? "text-black bg-[#b99249]"
            : "hover:bg-[#fefeff46] text-gray-300"
        } size-4 flex justify-center items-center  rounded-sm cursor-pointer
        sm:size-5
        md:size-6
        lg:size-8
        `}
      >
        <Icon className="text-[12px]
        md:text-[17px]
        lg:text-[22px]
        " />
      </button>
    );
  };

  useEffect(() => {
    if (activeMarker) {
      // Animate in from the left
      // gsap.fromTo(
      //   ref.current,
      //   { x: "-100%", duration: 1, opacity: 0 },
      //   { x: "0%", opacity: 1, duration: 1, ease: "power3.out" }
      // );
      gsap.to(
        ref.current,

        {
          x: "-100%",
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            setKey(activeMarker);
            gsap.fromTo(
              ref.current,
              { x: "-100%", opacity: 0 },
              { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
            );
          },
        }
      );
    } else {
      // Animate out to the left
      gsap.to(
        ref.current,

        {
          x: "-100%",
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {},
        }
      );
    }
  }, [activeMarker]);

  return (
    <>
      {
        <div
          ref={ref}
          className="translate-x-[-100%] w-30 p-2 h-fit top-1 flex flex-col items-center fixed inset-0 left-1 bg-clip-padding backdrop-blur-sm bg-[rgba(24,26,61,0.67)] border-solid border-2 rounded-lg border-[rgb(187,174,99)]
           sm:w-35
           md:w-50 md:rounded-xl
           lg:w-65 lg:p-3
          "
        >
          {/* Details */}
          <div className=" flex flex-col">
            <img
              className="aspect-5/2 mb-0.5 opacity-60 w-full object-cover rounded-md
              sm:aspect-4/2
              md:rounded-lg
              lg:mb-1
              "
              src={card?.src}
              alt=""
            />
            <h1 className="font-zap text-[#f3b94d] text-left text-[12px]
              sm:text-[13px]
              md:text-[18px]
              lg:text-xl
            ">
              {card?.name}
            </h1>
            {/* <p className="text-gray-200 text-[8px]">Mumbai</p> */}

            <h2 className=" bottom-0 text-[8px] mb-0.5 text-gray-200
              sm:text-[9px]
              md:text-[12px] md:mb-2
              lg:text-[18px]
            ">
              {card?.details}
            </h2>
          </div>

          {/* Transport */}
          <hr className="w-full mb-1 mt-0.5 text-gray-500
          md:mb-2
          lg:mb-3
          " />
          <div className="blue-glass w-full flex justify-between ">
            <div className="grid w-fit h-fit gap-1 grid-cols-2
            lg:gap-2
            ">
              <TransportBn type={'drive'} Icon={FaCar} />
              <TransportBn type={'bike'} Icon={RiMotorbikeFill} />
              <TransportBn type={'transport'} Icon={FaTrainSubway} />
              <TransportBn type={'walk'} Icon={FaWalking} />
              
            </div>
            <div className="text-right">
              <p className="text-xs font-zap text-[#b99249] font-bold
              sm:text-sm
              md:text-base
              lg:text-2xl
              ">
                {card?.time[transportState]} min
              </p>
              <p className="text-gray-300 text-[8px] font-semibold
              sm:text-[9px]
              md:text-[12px]
              lg:text-[17px]
              ">
                from{" "}
                <span className="bg-gradient-to-r font-zap-bold uppercase text-[10px] text-[#b99249]
                sm:text-[11px]
                md:text-[15px]
                lg:text-[21px]
                ">
                  Runwal
                </span>{" "}
                <span className="font-sign text-[8px] block
                sm:text-[9px]
                md:text-[12px]
                lg:text-[17px]
                "> Malabar</span>
              </p>
            </div>
          </div>
        </div>
      }
    </>
  );
});

export default Card;
