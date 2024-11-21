import { Clipboard } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Video } from "./Video"
import { useWebRTC } from "../provider/WebRTCProvider"
import { toast } from "@/hooks/use-toast"

export const StartCall = () => {

    const
        { callId, createCall, localStream } = useWebRTC();

    const
        JoinLink = `https://kalam-p2p.vercel.app/connect?offer=${callId}`

    const
        HandleCopyCallId = () => {
            navigator.clipboard.writeText(JoinLink);
            toast({
                title: 'Code Copied to clipboard.',
                description: 'Your call code is copied and ready to be shared.'
            });
        }

    return <>
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-normal text-center max-sm:text-2xl">
                Now you started a call.</h2>
            <p className="text-sm font-light opacity-45">
                Share the code to connect with peers.</p>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex flex-row max-md:flex-col gap-2">
                <Video.LocalStream />
                <Video.RemoteStream />
            </div>
            {
                callId === null ?
                    localStream && <Button variant="secondary" onClick={createCall}>
                        Create Call
                    </Button> :
                    <div className="flex flex-row gap-2">
                        <Input readOnly type="text" value={callId} />
                        <Button variant="default" className="-left-[1px]" onClick={HandleCopyCallId}>
                            Copy Invite Link
                            <Clipboard />
                        </Button>
                    </div>
            }
        </div>
    </>
}