//'use client';



// pages/your-page.js
import SocialShare from "@/components/SocialShare";

const YourPage = () => {

  const pageUrl = 'https://hanabira.org'; // Hanabira.org URL
  const pageTitle = 'Hanabira.org - Free Open-Source Self-Hostable No-Ads Japanese Learning Platform';


  return (
    <div className="container mx-auto p-4">
      {/* Your page content */}
      <h1 className="text-2xl font-bold mb-4">Your Page Title</h1>
      <p className="mb-8">Your page content goes here... SSR Rendered</p>

      <SocialShare url={pageUrl} title={pageTitle} />
    </div>
  );
};

export default YourPage;


// ---





