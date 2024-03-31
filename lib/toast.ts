import { toast } from "react-toastify";

export function toastNormal(message: string) {
    toast(message, {
        pauseOnFocusLoss: false,
    });
}