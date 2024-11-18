import { useState } from "react"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Video } from "./Video"
import { useWebRTC } from "../provider/WebRTCProvider"
import { toast } from "@/hooks/use-toast"

export const JoinCall = () => {
    const [remoteID, setRemoteID] = useState<string | null>()

    const {
        answerCall,
    } = useWebRTC();

    const
        HandleChange = (evt) => {
            setRemoteID(evt.target.value)
        },
        HandleOnClick = () => {
            toast({
                title: 'Remote ID',
                description: remoteID
            });
            if (remoteID !== null) {
                answerCall(remoteID);
            }
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
                <Video.LocalStram />
                <Video.RemoteStream />
            </div>
            <div className="flex flex-row gap-2">
                <Input type="text" onChange={HandleChange} />
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