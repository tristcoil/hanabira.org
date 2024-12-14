"use client";

// components/CookieConsent.js
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white text-center p-4 z-50">
      <p className="inline">
        This website uses cookies to ensure you get the best experience on our
        website. Read our {" "}
        {/* <a href="/privacy-policy" className="underline">
          Read our Privacy Policy
        </a> */}
        <a href="/privacy-policy" className="underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms-of-service" className="underline">
          Terms of Service
        </a>
        .
      </p>

      <button
        onClick={acceptCookies}
        className="ml-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
