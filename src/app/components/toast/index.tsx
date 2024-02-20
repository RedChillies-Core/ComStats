import { toast } from "react-toastify"

export const infoToast = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    progress: "",
  })
}
export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    progress: "",
  })
}
export const errorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    progress: "",
  })
}
