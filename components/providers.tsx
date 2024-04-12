"use client";

import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@material-tailwind/react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

import 'react-toastify/dist/ReactToastify.min.css';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                theme="light"
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