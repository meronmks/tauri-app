"use client";

import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@material-tailwind/react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ToastContainer
                position="bottom-right"
            />
            <I18nextProvider i18n={i18next}>
                <ThemeProvider value={{
                    Typography: {
                        styles: {
                            font: 'normal'
                        }
                    }
                }}>
                    {children as any}
                </ThemeProvider>
            </I18nextProvider>
        </>


    );
}