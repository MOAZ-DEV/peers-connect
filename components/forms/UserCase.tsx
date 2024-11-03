import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

import PeersLogoSvg from "@/public/PeersLogo.svg";
import ContactSvg from "@/public/pixeltrue-contact.svg";
import VisionSvg from "@/public/pixeltrue-vision-1 1.svg";
import { UserData, useUserState } from "@/states/user-state";
import { useCreateCall } from "@/hooks/use-create-call";
import { usePeerConnection } from "@/states/pc-connection";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

export const UserRegist = () => {
    const PcRef = usePeerConnection();
    const [userData, setUserData] = useUserState();
    const { hasCallCode, CallCode } = userData;
    const [userCase, setUserCase] = useState<number | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const { createCall, callId } = useCreateCall(PcRef);
    const { toast } = useToast();

    const
        HandleCaseSelect = () => {
            setUserData({
                ...userData,
                hasCallCode: userCase === 0,
            } as UserData);
            setCurrentStep(userCase === 0 ? 2 : 1);
            if (userCase === 0 && PcRef.current) {
                createCall();
            }
        }, HandleCopyCallId = () => {
            navigator.clipboard.writeText(callId);
            toast({
                title: 'Code Copied to clipboard.',
                description: 'Your call code is copied and ready to be shared.'
            });

        }

    const Steps = [
        {
            title: <>Are you looking to make <br /> an offer or accept one?</>,
            describe: `Please select the option that best describes you:`,
            cta: {
                title: <>Next <ArrowRight /></>,
                onClick: HandleCaseSelect,
            },
        },
        {
            title: <>Connect with you peer.</>,
            describe: `Paste the code provided by the other peer to connect.`,
            cta: {
                title: <>Connect <ArrowRight /></>,
                onClick: () => { /* Add the function to handle connection */ },
            },
        },
        {
            title: <>Now you started a call.</>,
            describe: `Share the code to connect with peers.`,
            cta: null,
        },
    ];

    const Cases = [
        { title: `I’d like to connect with peers and am offering my availability.`, imgSrc: ContactSvg },
        { title: `I have an invite code and am ready to connect.`, imgSrc: VisionSvg },
    ];

    const
        UserCases = () => (
            <div className="flex flex-row gap-4 max-w-full overflow-x-auto p-4">
            <div className="flex flex-row gap-4">
                {Cases.map(({ title, imgSrc }, idx) => (
                    <div
                        key={idx}
                        onClick={() => setUserCase(idx)}
                        className={`flex flex-col items-center justify-center w-72 min-w-min border border-[#ffffff25] rounded-xl hover:scale-[1.025] transition-all duration-300 cursor-pointer ${userCase === idx ? "!border-white" : ""}`}>
                        <Image src={imgSrc} alt={title} className={`aspect-square w-full ${userCase !== idx && "grayscale"}`} />
                        <p className={`text-center w-full px-12 py-6 transition-opacity duration-300 ${userCase !== idx ? "opacity-45" : ""}`}>
                            {title}
                        </p>
                    </div>
                ))}
            </div>
            </div>
        ),
        CreateCallCode = () => (
            <div className="flex flex-row gap-0">
                <Input readOnly type="text" value={callId} />
                <Button variant="default" className="-left-[1px]" onClick={HandleCopyCallId}>
                    <Clipboard />
                </Button>
            </div>
        )

    return (
        <div className="flex flex-col gap-12 items-center justify-center max-w-full">
            <Image src={PeersLogoSvg} alt="Peers" />
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-4xl font-normal text-center">
                    {Steps[currentStep].title}
                </h2>
                <p className="text-sm font-light opacity-45">
                    {Steps[currentStep].describe}
                </p>
            </div>

            {hasCallCode === null ? (
                <UserCases />
            ) : !hasCallCode && !CallCode ? (
                <>Paste Call Code</>
            ) : hasCallCode && !CallCode ? (
                <CreateCallCode />
            ) : null}

            {Steps[currentStep].cta && (
                <Button
                    size="lg"
                    variant="secondary"
                    onClick={Steps[currentStep].cta.onClick}
                    className="font-semibold text-base"
                    disabled={userCase === null}>
                    {Steps[currentStep].cta.title}
                </Button>
            )}
        </div>
    );
};
