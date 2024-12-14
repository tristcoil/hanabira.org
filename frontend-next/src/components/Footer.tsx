import Link from "next/link";

import PatternedComponent from "./PatternedComponent";
import FeaturesBanner from "./FeaturesBanner";

type Props = {
  title: string;
  link: any;
};

//page with amazing icons:
//https://react-icons.github.io/react-icons/icons/fa/

//patterns:
//https://heropatterns.com/

export default function Footer() {
  // const backgroundColor = "#ffffff";
  // const svgPattern = `url("data:image/svg+xml,%3Csvg width='44' height='12' viewBox='0 0 44 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 12v-2L0 0v10l4 2h16zm18 0l4-2V0L22 10v2h16zM20 0v8L4 0h16zm18 0L22 8V0h16z' fill='%239C92AC' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  return (
    <div
      className="flex flex-col items-center justify-center py-5 lg:py-20 w-full border-t border-gray-200 dark:border-gray-600  bg-gray-50 dark:bg-gray-800"
    // style={{ backgroundColor: backgroundColor, backgroundImage: svgPattern }}
    >
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-1 w-10/12 lg:w-9/12">
        <div className="flex justify-between w-full">
          <div>
            <Link
              href="/"
              className="text-3xl font-bold text-gray-800 dark:text-gray-200"
            >
              hanabira.org
            </Link>
            <p className="mt-3 font-medium text-lg text-gray-700 dark:text-gray-300">
              Ace your Japanese JLPT N5-N1 preparation.
            </p>



            {/* <div className="mt-5 flex items-center">
              <img src="/img/insta.png" alt="" className="h-6 mr-4" />
              <img src="/img/fb.png" alt="" className="h-6 mr-4" />
              <img src="/img/twtr.png" alt="" className="h-6 mr-4" />
            </div> */}


            <div className="mt-4 flex items-center">
              <a
                href="https://discord.com/invite/afefVyfAkH"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200 mr-4"
                aria-label="Join us on Discord"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#5865F2" viewBox="0 0 16 16">
                  <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                </svg>
              </a>
              <a
                href="https://www.reddit.com/r/hanabira/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200 mr-4"
                aria-label="Join us on Reddit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#FF4500" viewBox="0 0 16 16">
                  <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z" />
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165" />
                </svg>
              </a>
              <a
                href="https://github.com/tristcoil/hanabira.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200 mr-4"
                aria-label="Check us on Github"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
              </a>
            </div>







            {/* These icons are ugly, use the link above at the top of the page */}

            {/* <div className="mt-5 flex items-center">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <DiscordIcon />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <GithubIcon />
              </a>
              <a
                href="https://reddit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <RedditIcon />
              </a>
            </div> */}
          </div>

          {/* <div className="mt-5">
            <BuyMeACoffeeButton />
          </div> */}
        </div>

        {/* <div className="lg:pl-16">
          <h1 className="mt-3 font-semibold text-lg text-gray-800 dark:text-gray-200">
            Quick links
          </h1>
          <div className="flex flex-col">
            <PageLink title="Home" link="/" />
            <PageLink title="Pricing" link="/" />
            <PageLink title="Features" link="/" />
            <PageLink title="Community" link="/" />
          </div>
        </div> */}

        <div className="mt-0">
          <h1 className="mt-3 font-semibold text-lg text-gray-800 dark:text-gray-200">
            Disclaimer
          </h1>

          <div className="flex justify-between items-center flex-wrap">
            <div className="w-full">
              {/* <p className="text-sm mb-1 mt-2 text-gray-600 dark:text-gray-400">
                Public Alpha version, Open Source. This site is currently undergoing active
                development. You may encounter bugs, inconsistencies or limited
                functionality. Lots of sentences might not sound natural. We are
                progressively addressing these issues with native speakers. You
                can support the development by buying us a coffee.
              </p> */}

              <p className="text-sm mb-1 mt-2 text-gray-600 dark:text-gray-400">
                Public Alpha version Open Source{" "}
                <Link href="https://github.com/tristcoil/hanabira.org">
                  (GitHub)
                </Link>
                . This site is currently undergoing active development. You may (will)
                encounter bugs, inconsistencies, or limited functionality. Lots
                of sentences might not sound natural. We are progressively
                addressing these issues with native speakers. 
              </p>
            </div>

            <br></br>

            {/* <div
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
              role="alert"
            >
              <p className="font-bold">Contribute to Hanabira.org</p>
              <p className="text-sm mb-1 mt-2 text-gray-600 dark:text-gray-400">
                Hanabira.org lead dev has set aside several hundred dollars
                (monthly) for meaningful contributions to the project. We
                welcome developers, designers, and content creators to join us
                in enhancing our platform. Your innovative ideas and
                contributions can make a significant impact to the project.
                <br></br>
                <Link
                  href="/about"
                  className="text-sm font-bold text-gray-800 dark:text-gray-200"
                >
                  Contact us.
                </Link>
              </p>
            </div> */}

            <FeaturesBanner />


        <div className="flex justify-center gap-4 text-blue-600">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
        </div>




            <div className="w-full lg:w-1/3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>花びら散る</p>
              <p>夢のような跡</p>
              <p>朝露に</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 flex mt-7 mb-2 justify-center text-center w-10/12 lg:w-9/12">
        <CurrentYear />
      </p>

      {/* patterns
      https://heropatterns.com/ */}

      {/* <PatternedComponent /> */}
    </div>
  );
}


function PageLink({ link, title }: Props) {
  return (
    <Link
      title={title}
      href={link}
      className="mt-2 capitalize text-gray-500 hover:text-primary"
    >
      {title}
    </Link>
  );
}




const CurrentYear: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      Copyright {currentYear} @
      <a href="https://hanabira.org" target="_blank" rel="noopener noreferrer">
        hanabira.org
      </a>
    </>
  );
};





const BuyMeACoffeeButton: React.FC = () => {
  return (
    <div>
      {/* causes huge delay */}
      {/* <link
        href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext"
        rel="stylesheet"
      /> */}
      <a
        className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 bg-orange-500 hover:bg-orange-600 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.buymeacoffee.com/tcoilinfo"
      >
        <img
          className="h-6 w-6 mb-1 sm:h-9 sm:w-9" // Smaller on base, larger on sm screens and up
          src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
          alt="Buy me a coffee"
        />
        <span className="ml-2 text-sm sm:text-lg sm:ml-3">Buy us coffee</span>{" "}
        {/* Smaller on base, larger on sm screens and up */}
      </a>
    </div>
  );
};

// const DiscordIcon = () => {
//   return (
//     <svg
//       class="h-5 w-5"
//       fill="currentColor"
//       viewbox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//       fillRule="evenodd"
//       clipRule="evenodd"
//     >
//       <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
//     </svg>
//   );
// };

// const GithubIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       class="h-5 w-5"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//     </svg>
//   );
// };

// const RedditIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       class="h-5 w-5"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z" />
//     </svg>
//   );
// };
