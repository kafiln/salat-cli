import CitySelect from "#components/CitySelect";
import { QueryProvider } from "#components/QueryProvider";
import App from "#components/TimesApp";
import React, { useState } from "react";

interface TimesCommandWrapperProps {
    initialCity?: string;
    once?: boolean;
}

const TimesCommandWrapper: React.FC<TimesCommandWrapperProps> = ({
    initialCity,
    once,
}) => {
    const [city, setCity] = useState<string | undefined>(initialCity);

    return (
        <QueryProvider>
            {city ? (
                <App cityNameArg={city} once={once} onReset={() => setCity(undefined)} />
            ) : (
                <CitySelect onSelect={setCity} />
            )}
        </QueryProvider>
    );
};

export default TimesCommandWrapper;
