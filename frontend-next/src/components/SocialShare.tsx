// components/SocialShare.js
import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaRedditAlien,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const SocialShare = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareButtons = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF />,
      label: 'Facebook',
      bgColor: 'bg-blue-600',
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTwitter />,
      label: 'Twitter',
      bgColor: 'bg-blue-500',
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <FaLinkedinIn />,
      label: 'LinkedIn',
      bgColor: 'bg-blue-700',
    },
    {
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <FaRedditAlien />,
      label: 'Reddit',
      bgColor: 'bg-orange-600',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {shareButtons.map((button, index) => (
        <a
          key={index}
          href={button.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center px-4 py-2 text-white ${button.bgColor} rounded hover:opacity-90`}
        >
          {button.icon}
          <span className="ml-2">{button.label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialShare;

