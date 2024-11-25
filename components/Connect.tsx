import { useEffect, useState } from "react";
import Image from "next/image";
import { ChooseCase, JoinCall, StartCall } from "./connect-break-down/Components";

import PeersLogoSvg from "@/public/PeersLogo.svg";
import { useRouter, useSearchParams } from "next/navigation";
// import { useWebRTC } from "./provider/WebRTCProvider";

export const Connect = () => {

    const
        [useCase, setUseCase] = useState<'offer' | 'accept' | 'meet' | null>(null),
        searchParams = useSearchParams(),
        router = useRouter();

    const
        offer = searchParams.get('offer');

        useEffect(() => {
            if (offer)
                setUseCase('accept');
        }, [offer])
        useEffect(() => {
            if (useCase === 'meet')
                router.replace('meet')
        }, [useCase])
        
    return (
        <div className="flex flex-col gap-8 items-center justify-center max-w-full px-4">
            <Image src={PeersLogoSvg} alt="Peers" />
            {(useCase === null) && <ChooseCase setUseCase={setUseCase} />}
            {(useCase === 'offer') && <StartCall />}
            {(useCase === 'accept') && <JoinCall />}
        </div>
    );
};
