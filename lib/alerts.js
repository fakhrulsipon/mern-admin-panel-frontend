"use client";

import Swal from "sweetalert2";

const maisonClasses = {
  popup: "rounded-sm border border-[#E5DED4] shadow-[0_24px_80px_rgba(23,21,17,0.12)]",
  title: "font-serif text-[#1A1A1A]",
  htmlContainer: "text-[#514A42]",
  confirmButton: "rounded-sm bg-[#1C2421] px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white",
  cancelButton: "rounded-sm border border-[#D8D0C5] bg-transparent px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-[#1A1A1A]",
};

const baseAlert = Swal.mixin({
  background: "#FAF8F5",
  color: "#1A1A1A",
  buttonsStyling: false,
  customClass: maisonClasses,
});

const toastAlert = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2400,
  timerProgressBar: true,
  background: "#FFFFFF",
  color: "#1A1A1A",
  customClass: {
    popup: "rounded-sm border border-[#E5DED4] shadow-[0_18px_50px_rgba(23,21,17,0.10)]",
    title: "text-xs font-medium uppercase tracking-widest text-[#1A1A1A]",
  },
});

export const getFriendlyErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const message = error instanceof Error ? error.message : String(error || fallback);

  if (message === "Failed to fetch" || message.toLowerCase().includes("failed to fetch")) {
    return "The server is currently waking up. Please wait a moment and try again.";
  }

  return message || fallback;
};

export const showError = (error, fallback) => {
  return baseAlert.fire({
    title: "Request Failed",
    text: getFriendlyErrorMessage(error, fallback),
    icon: "error",
    iconColor: "#8F2F26",
    confirmButtonText: "Confirm Action",
  });
};

export const showSuccess = (message) => {
  return toastAlert.fire({
    title: message,
    icon: "success",
    iconColor: "#1C2421",
  });
};

export const confirmAction = async ({
  title = "Are you sure you want to continue?",
  text = "This action requires your confirmation.",
  confirmButtonText = "Confirm Action",
  cancelButtonText = "Cancel",
} = {}) => {
  const result = await baseAlert.fire({
    title,
    text,
    icon: "warning",
    iconColor: "#1C2421",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};
