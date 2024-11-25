import { Clipboard, QrCode } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Video } from "./Video"
import { useWebRTC } from "../provider/WebRTCProvider"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import QRCODE from "qrcode";
import { useState } from "react"
import Image from "next/image"

export const StartCall = () => {

    const
        { callId, createCall, localStream } = useWebRTC(),
        [QrCodeSrc, setQrCodeSrc] = useState<string | null>();


    const
        JoinLink = `https://kalam-p2p.vercel.app/connect?offer=${callId}`,
        GenerateQrCode = () =>
            QRCODE.toDataURL(JoinLink).then(setQrCodeSrc);

    const
        HandleCopyCallId = () => {
            navigator.clipboard.writeText(JoinLink);
            toast({
                title: 'Code Copied to clipboard.',
                description: 'Your call code is copied and ready to be shared.'
            });
        };


    return <>
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-normal text-center max-sm:text-2xl">
                Now you started a call.</h2>
            <p className="text-sm font-light opacity-45">
                Share the code to connect with peers.</p>
        </div>
        <div className="flex flex-col gap-9">
            <div className="flex flex-row max-md:flex-col gap-2">
                <Video.LocalStream />
                <Video.RemoteStream />
            </div>
            {
                callId === null ?
                    localStream && <Button variant="default" onClick={createCall}>
                        Create Call
                    </Button> :
                    <div className="flex flex-row gap-2 justify-center">
                        <Button variant="outline" className="-left-[1px]" onClick={HandleCopyCallId}>
                            Copy Invite Link
                            <Clipboard />
                        </Button>

                        <Dialog>
                            <DialogTrigger>
                                <Button variant="ghost" onClick={GenerateQrCode}>
                                    <QrCode />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Scan the Qr Code</DialogTitle>
                                    <span className="flex items-center justify-center w-full aspect-square border border-[#ffffff12] rounded ">
                                    <Image className="dark:invert" height={345} width={345} src={QrCodeSrc} alt="Qr Code For Invite."/>
                                    </span>
                                    <Input readOnly type="text" value={callId} />
                                    <DialogDescription>
                                        You can copy the code manually.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
            }
        </div>
    </>
}