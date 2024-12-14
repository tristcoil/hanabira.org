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
        return [
          {
            id: "1",
            name: "JLPT N5 Grammar 25",
            link: "/japanese/grammar_dashboard/JLPT_N5/25",
            file: jlpt_universal_01,
            description: "",
          },
          {
            id: "2",
            name: "JLPT N5 Grammar 50",
            link: "/japanese/grammar_dashboard/JLPT_N5/50",
            file: jlpt_universal_02,
            description: "",
          },
          {
            id: "3",
            name: "JLPT N5 Grammar 75",
            link: "/japanese/grammar_dashboard/JLPT_N5/75",
            file: jlpt_universal_03,
            description: "",
          },
          {
            id: "4",
            name: "JLPT N5 Grammar 100",
            link: "/japanese/grammar_dashboard/JLPT_N5/100",
            file: jlpt_universal_04,
            description: "",
          },
          {
            id: "5",
            name: "JLPT N5 Grammar 125",
            link: "/japanese/grammar_dashboard/JLPT_N5/125",
            file: jlpt_universal_05,
            description: "",
          },
          {
            id: "6",
            name: "JLPT N5 Grammar 150",
            link: "/japanese/grammar_dashboard/JLPT_N5/150",
            file: jlpt_universal_06,
            description: "",
          },
        ];
  
        case "JLPT_N4":
          return [
            {
              id: "1",
              name: "JLPT N4 Grammar 25",
              link: "/japanese/grammar_dashboard/JLPT_N4/25",
              file: jlpt_universal_01,
              description: "",
            },
            {
              id: "2",
              name: "JLPT N4 Grammar 50",
              link: "/japanese/grammar_dashboard/JLPT_N4/50",
              file: jlpt_universal_02,
              description: "",
            },
            {
              id: "3",
              name: "JLPT N4 Grammar 75",
              link: "/japanese/grammar_dashboard/JLPT_N4/75",
              file: jlpt_universal_03,
              description: "",
            },
            {
              id: "4",
              name: "JLPT N4 Grammar 100",
              link: "/japanese/grammar_dashboard/JLPT_N4/100",
              file: jlpt_universal_04,
              description: "",
            },
            {
              id: "5",
              name: "JLPT N4 Grammar 125",
              link: "/japanese/grammar_dashboard/JLPT_N4/125",
              file: jlpt_universal_05,
              description: "",
            },
          ];
  
      case "JLPT_N3":
        return [
          {
            id: "1",
            name: "JLPT N3 Grammar 10",
            link: "/japanese/grammar_dashboard/JLPT_N3/10",
            file: jlpt_universal_01,
            description: ""
          },
          {
            id: "2",
            name: "JLPT N3 Grammar 20",
            link: "/japanese/grammar_dashboard/JLPT_N3/20",
            file: jlpt_universal_02,
            description: ""
          },
          {
            id: "3",
            name: "JLPT N3 Grammar 30",
            link: "/japanese/grammar_dashboard/JLPT_N3/30",
            file: jlpt_universal_03,
            description: ""
          },
          {
            id: "4",
            name: "JLPT N3 Grammar 40",
            link: "/japanese/grammar_dashboard/JLPT_N3/40",
            file: jlpt_universal_04,
            description: ""
          },
          {
            id: "5",
            name: "JLPT N3 Grammar 50",
            link: "/japanese/grammar_dashboard/JLPT_N3/50",
            file: jlpt_universal_05,
            description: ""
          },
          {
            id: "6",
            name: "JLPT N3 Grammar 60",
            link: "/japanese/grammar_dashboard/JLPT_N3/60",
            file: jlpt_universal_06,
            description: ""
          },
          {
            id: "7",
            name: "JLPT N3 Grammar 70",
            link: "/japanese/grammar_dashboard/JLPT_N3/70",
            file: jlpt_universal_07,
            description: ""
          },
          {
            id: "8",
            name: "JLPT N3 Grammar 80",
            link: "/japanese/grammar_dashboard/JLPT_N3/80",
            file: jlpt_universal_08,
            description: ""
          },
          {
            id: "9",
            name: "JLPT N3 Grammar 90",
            link: "/japanese/grammar_dashboard/JLPT_N3/90",
            file: jlpt_universal_09,
            description: ""
          },
          {
            id: "10",
            name: "JLPT N3 Grammar 100",
            link: "/japanese/grammar_dashboard/JLPT_N3/100",
            file: jlpt_universal_10,
            description: ""
          },
          {
            id: "11",
            name: "JLPT N3 Grammar 110",
            link: "/japanese/grammar_dashboard/JLPT_N3/110",
            file: jlpt_universal_11,
            description: ""
          },
          {
            id: "12",
            name: "JLPT N3 Grammar 120",
            link: "/japanese/grammar_dashboard/JLPT_N3/120",
            file: jlpt_universal_12,
            description: ""
          },
          {
            id: "13",
            name: "JLPT N3 Grammar 130",
            link: "/japanese/grammar_dashboard/JLPT_N3/130",
            file: jlpt_universal_13,
            description: ""
          },
          {
            id: "14",
            name: "JLPT N3 Grammar 140",
            link: "/japanese/grammar_dashboard/JLPT_N3/140",
            file: jlpt_universal_14,
            description: ""
          }
        ];
  
      case "JLPT_N2":
        return [
          {
            id: "1",
            name: "JLPT N2 Grammar 25",
            link: "/japanese/grammar_dashboard/JLPT_N2/25",
            file: jlpt_universal_01,
            description: "",
          },
          {
            id: "2",
            name: "JLPT N2 Grammar 50",
            link: "/japanese/grammar_dashboard/JLPT_N2/50",
            file: jlpt_universal_02,
            description: "",
          },
          {
            id: "3",
            name: "JLPT N2 Grammar 75",
            link: "/japanese/grammar_dashboard/JLPT_N2/75",
            file: jlpt_universal_03,
            description: "",
          },
          {
            id: "4",
            name: "JLPT N2 Grammar 100",
            link: "/japanese/grammar_dashboard/JLPT_N2/100",
            file: jlpt_universal_04,
            description: "",
          },
          {
            id: "5",
            name: "JLPT N2 Grammar 125",
            link: "/japanese/grammar_dashboard/JLPT_N2/125",
            file: jlpt_universal_05,
            description: "",
          },
          {
            id: "6",
            name: "JLPT N2 Grammar 150",
            link: "/japanese/grammar_dashboard/JLPT_N2/150",
            file: jlpt_universal_06,
            description: "",
          },
          {
            id: "7",
            name: "JLPT N2 Grammar 175",
            link: "/japanese/grammar_dashboard/JLPT_N2/175",
            file: jlpt_universal_07,
            description: "",
          },
          {
            id: "8",
            name: "JLPT N2 Grammar 200",
            link: "/japanese/grammar_dashboard/JLPT_N2/200",
            file: jlpt_universal_08,
            description: "",
          },
        ];
  
  
        case "JLPT_N1":
          return [
            {
              id: "1",
              name: "JLPT N1 Grammar 25",
              link: "/japanese/grammar_dashboard/JLPT_N1/25",
              file: jlpt_universal_01,
              description: "",
            },
            {
              id: "2",
              name: "JLPT N1 Grammar 50",
              link: "/japanese/grammar_dashboard/JLPT_N1/50",
              file: jlpt_universal_02,
              description: "",
            },
            {
              id: "3",
              name: "JLPT N1 Grammar 75",
              link: "/japanese/grammar_dashboard/JLPT_N1/75",
              file: jlpt_universal_03,
              description: "",
            },
            {
              id: "4",
              name: "JLPT N1 Grammar 100",
              link: "/japanese/grammar_dashboard/JLPT_N1/100",
              file: jlpt_universal_04,
              description: "",
            },
            {
              id: "5",
              name: "JLPT N1 Grammar 125",
              link: "/japanese/grammar_dashboard/JLPT_N1/125",
              file: jlpt_universal_05,
              description: "",
            },
            {
              id: "6",
              name: "JLPT N1 Grammar 150",
              link: "/japanese/grammar_dashboard/JLPT_N1/150",
              file: jlpt_universal_06,
              description: "",
            },
            {
              id: "7",
              name: "JLPT N1 Grammar 175",
              link: "/japanese/grammar_dashboard/JLPT_N1/175",
              file: jlpt_universal_07,
              description: "",
            },
            {
              id: "8",
              name: "JLPT N1 Grammar 200",
              link: "/japanese/grammar_dashboard/JLPT_N1/200",
              file: jlpt_universal_08,
              description: "",
            },
            {
              id: "9",
              name: "JLPT N1 Grammar 225",
              link: "/japanese/grammar_dashboard/JLPT_N1/225",
              file: jlpt_universal_09,
              description: "",
            },
            {
              id: "10",
              name: "JLPT N1 Grammar 250",
              link: "/japanese/grammar_dashboard/JLPT_N1/250",
              file: jlpt_universal_10,
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
          title: "Japanese JLPT N5 Grammar",
          subtitle: "N5 grammar with explanation and example sentences.",
        };
      case "JLPT_N4":
        return {
          title: "Japanese JLPT N4 Grammar",
          subtitle: "N4 grammar with explanation and example sentences.",
        };
      case "JLPT_N3":
        return {
          title: "Japanese JLPT N3 Grammar",
          subtitle: "N3 grammar with explanation and example sentences.",
        };
      case "JLPT_N2":
        return {
          title: "Japanese JLPT N2 Grammar",
          subtitle: "N2 grammar with explanation and example sentences.",
        };
      case "JLPT_N1":
        return {
          title: "Japanese JLPT N1 Grammar",
          subtitle: "N1 grammar with explanation and example sentences.",
        };
      default:
        return {
          title: "",
          subtitle: "",
        };
    }
  };
  

























