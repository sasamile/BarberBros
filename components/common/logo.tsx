import { ImgHTMLAttributes, MouseEvent } from "react";
import { Magnetic } from "./magnetic";
import Image from "next/image";

export function Logo() {
  const handleNavItemClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // const url = new URL(e.currentTarget.href);
    // const hash = url.hash;

    // console.log(hash)

    const target = document.querySelector("#home");

    if (!target) return;

    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Magnetic>
      <div className="cursor-pointer" onClick={handleNavItemClick}>
        <Image src={"/img/LOGO.png"} alt="Logo" width={500} height={100} />
      </div>
    </Magnetic>
  );
}
