// utils/getUserFromCookies.js

import Cookies from 'js-cookie';

// Function to get user and JWT from cookies, providing dummy values if not found
export const getUserFromCookies = () => {
  // Retrieve the hanabira_user and hanabira_jwt from cookies
  const userName = Cookies.get('hanabira_userName') || 'dummyuserName';
  const userId = Cookies.get('hanabira_userId') || 'dummyuserId';
  const jwt = Cookies.get('hanabira_jwt') || 'dummy.JWT.token';

  console.log('User Name:', userName);
  console.log('User ID:', userId);
  console.log('JWT:', jwt);

  // Return the user and jwt token
  return { userName, userId, jwt };
};
