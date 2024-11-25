import { useEffect, useState } from "react"
import { useWebRTC } from "../provider/WebRTCProvider"
import { useSearchParams } from "next/navigation"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Video } from "./Video"


export const JoinCall = () => {

    const
        [remoteID, setRemoteID] = useState<string | null>(null),
        { answerCall, localStream } = useWebRTC(),
        searchParams = useSearchParams(),
        offer = searchParams.get('offer');

    useEffect(() => {
        if (offer)
            setRemoteID(offer);
        HandleOnClick();
    }, [offer])

    const
        HandleChange = (evt) => 
            setRemoteID(evt.target.value),
        HandleOnClick = () => {
            if (remoteID !== null)
                answerCall(remoteID);
        }

    return <>
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-normal text-center max-sm:text-2xl">
                Connect with you peer.</h2>
            <p className="text-sm font-light opacity-45">
                Paste the code provided by the other peer to connect.</p>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex flex-row max-md:flex-col gap-2">
                <Video.LocalStream />
                <Video.RemoteStream />
            </div>
            <div className="flex flex-row gap-2">
                {localStream && <Input type="text" onChange={HandleChange} value={remoteID} />}
            </div>
        </div>
        <Button
            onClick={HandleOnClick}
            disabled={remoteID === null}
            size="lg" variant="secondary"
            className="font-semibold text-base"
        > Join </Button>
    </>
}