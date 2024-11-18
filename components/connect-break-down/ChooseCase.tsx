import { useState } from "react";

import { Button } from "../ui/button";
import { CaseCards } from "./CaseCards";

export const ChooseCase = (
    { setUseCase }
) => {
    const
        [ChoosenCase, setChoosenCase] = useState<'offer' | 'accept' | null>(null);

    const
        HandleOnClick = () => {
            setUseCase(ChoosenCase)
        },
        HandleCaseChange = (code) => {
            setChoosenCase(code)
        }

    return <>
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-normal text-center max-sm:text-2xl">
                Are you looking to make <br /> an offer or accept one?</h2>
            <p className="text-sm font-light opacity-45">
                Please select the option that best describes you:</p>
        </div>
        <div className="flex flex-row gap-4 max-w-full overflow-x-auto p-4">
            <CaseCards onChange={HandleCaseChange} />
        </div>
        <Button
            onClick={HandleOnClick}
            disabled={ChoosenCase === null}
            size="lg" variant="secondary"
            className="font-semibold text-base"
        > Next </Button>
    </>
}