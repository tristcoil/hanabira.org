import { Fragment } from "react";

import { FcSpeaker } from "react-icons/fc";
import axios from "axios";

import {
  AdjustmentsVerticalIcon,
  DocumentChartBarIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

import Rows from "./Rows";
import ItemsRibbon from "./ItemsRibbon";
import MySpeakerWaveIcon from "./MySpeakerWaveIcon";
import { PropaneSharp } from "@mui/icons-material";

// http://localhost:3000/dashboard/123
// we might need to use , so we have those 2 vars ready for parsing
// http://localhost:3000/dashboard/JLPT_N3/100

// Rows component fetches data from API in general and shows multiple lines
// to make nice cards we would want another component that would treat Row as a card element,
// then we could have nice borders around
// so some other element should fetch the data, then we should feed it one by one to single Row

export default async function ItemsSentences({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const p_dashboardId = params.slug; //'JLPT_N3'
  const s_dashboardId = params.id; //'verbs-1'

  //const p_dashboardId = 'JLPT_N3'
  //const s_dashboardId = 'verbs-1'

  return (
    <div className="w-full lg:p-5">
      <div>Parent-Dashboard ID: {p_dashboardId}</div>

      <div>Sub-Dashboard ID: {s_dashboardId}</div>

      <div className="w-full bg-gray-50 p-5">
        <ItemsRibbon />

        <Rows
          p_dashboardId={p_dashboardId ?? ""}
          s_dashboardId={s_dashboardId ?? ""}
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------ //




