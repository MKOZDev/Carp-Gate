"use client";
import Image from "next/image";

export default function AnimatedImage() {
  return (
    <div className="relative z-10 rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-square">
      <div className="w-full h-full animate-kenburns">
        <Image
          src="/main-page-about.png"
          alt="AboutUs"
          width={590}
          height={589}
          priority
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
