import { useEffect, useState } from "react";

export type Language = "id" | "en";

export const LANGUAGE_KEY = "elbouquet_language";

export function getLanguage(): Language {
    if (typeof window === "undefined") return "id";
    try {
        return (localStorage.getItem(LANGUAGE_KEY) as Language) || "id";
    } catch {
        return "id";
    }
}

export function setLanguage(language: Language) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LANGUAGE_KEY, language);
    window.dispatchEvent(new Event("languageChanged"));
}

export function toggleLanguage(current?: Language): Language {
    const next = (current ?? getLanguage()) === "id" ? "en" : "id";
    setLanguage(next);
    return next;
}

export function useLanguage() {
    const [language, setLanguageState] = useState<Language>(getLanguage());

    useEffect(() => {
        const handler = () => setLanguageState(getLanguage());
        window.addEventListener("languageChanged", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("languageChanged", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return [language, (next: Language) => setLanguage(next)] as const;
}
