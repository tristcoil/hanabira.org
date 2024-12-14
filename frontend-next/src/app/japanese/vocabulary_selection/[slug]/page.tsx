import Link from "next/link";
import Image, { StaticImageData } from "next/image";

import DashboardCardsWithHeader from "@/components/DashboardCardsWithHeader";

import jlpt_universal_01 from "@public/img/jlpt_universal_01.jpg";
import jlpt_universal_02 from "@public/img/jlpt_universal_02.jpg";
import jlpt_universal_03 from "@public/img/jlpt_universal_03.jpg";
import jlpt_universal_04 from "@public/img/jlpt_universal_04.jpg";
import jlpt_universal_05 from "@public/img/jlpt_universal_05.jpg";
import jlpt_universal_06 from "@public/img/jlpt_universal_06.jpg";
import jlpt_universal_07 from "@public/img/jlpt_universal_07.jpg";
import jlpt_universal_08 from "@public/img/jlpt_universal_08.jpg";
import jlpt_universal_09 from "@public/img/jlpt_universal_09.jpg";
import jlpt_universal_10 from "@public/img/jlpt_universal_10.jpg";
import jlpt_universal_11 from "@public/img/jlpt_universal_11.jpg";
import jlpt_universal_12 from "@public/img/jlpt_universal_12.jpg";
import jlpt_universal_13 from "@public/img/jlpt_universal_13.jpg";
import jlpt_universal_14 from "@public/img/jlpt_universal_14.jpg";

export default function Dashboard({ params }: { params: { slug: string } }) {
  const p_dashboardId = params.slug;
  const dashboardCardsProps = getDashboardCardsProps(p_dashboardId || "");
  const headlineProps = getHeadlineProps(p_dashboardId || "")



  console.log("slug: " + p_dashboardId);
  console.log("dashboardCardsProps: " + dashboardCardsProps);

  return (
    <div className=" flex flex-col">
      <div className="flex flex-col flex-shrink-0">
        <DashboardCardsWithHeader
          cards={dashboardCardsProps}
          headline={headlineProps}
        />
      </div>
    </div>
  );
}




interface DashboardCardsProps {
    id: string;
    name: string;
    link: string;
    file: StaticImageData;
    description: string;
  }

const getDashboardCardsProps = (level: string): DashboardCardsProps[] => {

    switch (level) {

        case "JLPT_N5":
            return [];
      
          case "JLPT_N4":
            return [];
      
          case "JLPT_N3":
            return [
              {
                id: "1",
                name: "JLPT N3 i-Adjectives",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/i-adjective",
                file: jlpt_universal_01,
                description: "",
              },
              {
                id: "2",
                name: "JLPT N3 na-Adjectives",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/na-adjective",
                file: jlpt_universal_02,
                description: "",
              },
              {
                id: "3",
                name: "JLPT N3 Verbs 50",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/verbs-1",
                file: jlpt_universal_03,
                description: "",
              },
              {
                id: "4",
                name: "JLPT N3 Verbs 100",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/verbs-2",
                file: jlpt_universal_04,
                description: "",
              },
              {
                id: "5",
                name: "JLPT N3 Verbs 150",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/verbs-3",
                file: jlpt_universal_05,
                description: "",
              },
              {
                id: "6",
                name: "JLPT N3 Verbs 200",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/verbs-4",
                file: jlpt_universal_06,
                description: "",
              },
              {
                id: "7",
                name: "JLPT N3 Verbs 250",
                link: "/japanese/vocabulary_dashboard/JLPT_N3/verbs-5",
                file: jlpt_universal_07,
                description: "",
              },
            ];
      
          case "JLPT_N2":
            return [];
      
          case "JLPT_N1":
            return [];
      
          case "essential_verbs":
            return [
              {
                id: "1",
                name: "Essential Verbs 50",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-1",
                file: jlpt_universal_01,
                description: "",
              },
              {
                id: "2",
                name: "Essential Verbs 100",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-2",
                file: jlpt_universal_02,
                description: "",
              },
              {
                id: "3",
                name: "Essential Verbs 150",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-3",
                file: jlpt_universal_03,
                description: "",
              },
              {
                id: "4",
                name: "Essential Verbs 200",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-4",
                file: jlpt_universal_04,
                description: "",
              },
              {
                id: "5",
                name: "Essential Verbs 250",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-5",
                file: jlpt_universal_05,
                description: "",
              },
              {
                id: "6",
                name: "Essential Verbs 300",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-6",
                file: jlpt_universal_06,
                description: "",
              },
              {
                id: "7",
                name: "Essential Verbs 350",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-7",
                file: jlpt_universal_07,
                description: "",
              },
              {
                id: "8",
                name: "Essential Verbs 400",
                link: "/japanese/vocabulary_dashboard/essential_600_verbs/verbs-8",
                file: jlpt_universal_08,
                description: "",
              },
              {
                id: "9",
                name: "Suru Verbs 50",
                link: "/japanese/vocabulary_dashboard/suru_essential_600_verbs/verbs-1",
                file: jlpt_universal_09,
                description: "",
              },
              {
                id: "10",
                name: "Suru Verbs 100",
                link: "/japanese/vocabulary_dashboard/suru_essential_600_verbs/verbs-2",
                file: jlpt_universal_10,
                description: "",
              },
              {
                id: "11",
                name: "Suru Verbs 150",
                link: "/japanese/vocabulary_dashboard/suru_essential_600_verbs/verbs-3",
                file: jlpt_universal_11,
                description: "",
              },
              {
                id: "12",
                name: "Suru Verbs 200",
                link: "/japanese/vocabulary_dashboard/suru_essential_600_verbs/verbs-4",
                file: jlpt_universal_12,
                description: "",
              },
              {
                id: "13",
                name: "Suru Verbs 250",
                link: "/japanese/vocabulary_dashboard/suru_essential_600_verbs/verbs-5",
                file: jlpt_universal_13,
                description: "",
              },
              {
                id: "14",
                name: "Suru Verbs 300",
                link: "/japanese/vocabulary_dashboard/suru_essential_600_verbs/verbs-6",
                file: jlpt_universal_14,
                description: "",
              },
            ];


    // Add more cases for other levels
    default:
      return [];
  }
};



interface HeadlineProps {
  title: string;
  subtitle: string;
}
  

const getHeadlineProps = (level: string): HeadlineProps => {
    switch (level) {
        case "JLPT_N5":
        return {
            title: "JLPT N5 Vocabulary",
            subtitle: "JLPT N5 vocabulary with example sentences and audio.",
          };
        case  "JLPT_N4": 
        return {
            title: "JLPT N4 Vocabulary",
            subtitle: "JLPT N4 vocabulary with example sentences and audio.",
          };
        case  "JLPT_N3": 
        return {
            title: "JLPT N3 Vocabulary",
            subtitle: "JLPT N3 vocabulary with example sentences and audio.",
          };
        case  "JLPT_N2": 
        return{
            title: "JLPT N2 Vocabulary",
            subtitle: "JLPT N2 vocabulary with example sentences and audio.",
          };
        case  "JLPT_N1": 
        return {
            title: "JLPT N1 Vocabulary",
            subtitle: "JLPT N1 vocabulary with example sentences and audio.",
          };
        case  "essential_verbs": 
        return {
            title: "Essential Japanese Verbs",
            subtitle: "Essential Japanese Verbs with example sentences and audio.",
          };


      default:
        return {
          title: "",
          subtitle: "",
        };
    }
  };
  

























