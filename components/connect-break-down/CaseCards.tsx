import Image from "next/image";
import { useEffect, useState } from "react";

import ContactSvg from "@/public/pixeltrue-contact.svg";
import VisionSvg from "@/public/pixeltrue-vision-1 1.svg";

export const CaseCards = (
    { onChange }: { onChange: (evt) => void }
) => {
    const
        [ChoosenCase, setChoosenCase] = useState<'offer' | 'accept' | null>(null);

    const Cases = [
        { code: 'offer', title: `I’d like to connect with peers and am offering my availability.`, imgSrc: ContactSvg },
        { code: 'accept', title: `I have an invite code and am ready to connect.`, imgSrc: VisionSvg },
    ]

    useEffect(() => {
        if (ChoosenCase !== null)
            onChange(ChoosenCase);
    }, [ChoosenCase])

    const Card = ({ code, title, imgSrc }) => (
        <div
            key={code}
            onClick={() => setChoosenCase(code)}
            className={`
                flex flex-col items-center justify-center w-72 min-w-min border border-[#ffffff25] 
                rounded-xl hover:scale-[1.025] transition-all duration-300 cursor-pointer 
                ${ChoosenCase === code ? "!border-white" : ""}`}>
            <Image
                src={imgSrc}
                alt={title}
                className={`aspect-square w-full ${ChoosenCase !== code && "grayscale"}`} />
            <p
                className={`
                text-center w-full px-12 py-6 transition-opacity duration-300
                 ${ChoosenCase !== code ? "opacity-45" : ""}`}>
                {title}
            </p>
        </div>
    )

    return <div className="flex flex-row gap-4">
        {Cases.map((item, idx) =>
            <Card key={idx} {...item} />
        )}
    </div>
}