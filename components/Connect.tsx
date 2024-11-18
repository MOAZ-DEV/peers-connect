import { useEffect, useState } from "react";
import Image from "next/image";
import { ChooseCase, JoinCall, StartCall } from "./connect-break-down/Components";

import PeersLogoSvg from "@/public/PeersLogo.svg";
import { useWebRTC } from "./provider/WebRTCProvider";

export const Connect = () => {

    const
        [useCase, setUseCase] = useState<'offer' | 'accept' | null>(null),
        { createCall, callId } = useWebRTC();

    useEffect(() => {
        if (useCase === 'offer' && !callId) createCall();
    }, [callId, createCall, useCase])

    return (
        <div className="flex flex-col gap-8 items-center justify-center max-w-full">
            <Image src={PeersLogoSvg} alt="Peers" />
            {(useCase === null) && <ChooseCase setUseCase={setUseCase} />}
            {(useCase === 'offer') && <StartCall />}
            {(useCase === 'accept') && <JoinCall />}
        </div>
    );
};
