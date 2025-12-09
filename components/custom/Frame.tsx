"use client";

import { CopyPlus, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Card {
  id: number;
  type: "blank";
  content: { title: string; body: string };
}

interface InitialPageContent {
  id: number;
  title?: string;
  type:
    | "cover"
    | "text"
    | "text-with-list"
    | "business-model"
    | "gtm"
    | "table"
    | "team"
    | "chart";
  content: any;
}

// Helper component for Image Placeholders
const ImagePlaceholder = ({
  name,
  title,
  imgFile,
  size = "w-16 h-16",
}: {
  name: string;
  title: string;
  imgFile: string;
  size?: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div
      className={`relative ${size} bg-gray-700 mb-2 flex items-center justify-center overflow-hidden rounded-md`}
    >
      <Image
        src={`/${imgFile}`}
        alt={name}
        width={64}
        height={64}
        className="object-cover w-full h-full"
      />
    </div>
    <p
      className="text-xs md:text-sm font-semibold mt-1 text-center"
      contentEditable
      suppressContentEditableWarning
    >
      {name}
    </p>
    <p
      className="text-xs md:text-sm text-center text-gray-400 leading-tight"
      contentEditable
      suppressContentEditableWarning
    >
      {title}
    </p>
  </div>
);

const initialPresentationData: InitialPageContent[] = [
  // Page 1/13: Cover (Slide 1)
  {
    id: 1,
    title: "",
    type: "cover",
    content: {
      title: "Solving the Post-Literacy Crisis",
      subtitle: "ScribeMatrix",
      tagline: "The Future of Reading",
      ceo: "Tray Bailey, Founder & CEO, ScribeMatrix Incorporated",
      email: "InvestorRelations@ScribeMatrix.org",
      footer: "Pre-Seed Investment Opportunity\nNovember 2025",
    },
  },
  // Page 1/12: The Problem (Slide 2)
  {
    id: 2,
    title: "The Problem",
    type: "text-with-list",
    content: {
      subtitle: "Static Text is Losing the War for Mindshare",
      points: [
        "Screentime is Up causing disengagement from static pages that don’t speak our contemporary digital language",
        "Achievement is Down as retention declines and deep reading erodes",
        "Comprehension is Challenged causing costly mistakes and disintegration of shared societal understanding replaced by shallow fragmented content",
      ],
    },
  },
  // Page 1/11: The ScribeMatrix Solution (Slide 3)
  {
    id: 3,
    title: "The ScribeMatrix Solution",
    type: "text-with-list",
    content: {
      subtitle:
        "ScribeMatrix empowers authors to move beyond static text and craft multisensory stories",
      points: [
        "expanded by AI",
        "enhanced with rich media",
        "supported by new revenue streams redefining the book industry",
      ],
      isSmallList: true, // Custom style for smaller list
    },
  },
  // Page 1/10: Underlying Magic (Slide 4)
  {
    id: 4,
    title: "Underlying Magic",
    type: "text-with-list",
    content: {
      points: [
        "Core technology: Unified video, audio, and text generation for dynamic storytelling.",
        "Special features: AI content creation, intuitive Design Studio, and integrated digital marketplaces.",
      ],
    },
  },
  // Page 1/9: Business Model (Slide 5)
  {
    id: 5,
    title: "Business Model",
    type: "business-model",
    content: {
      sections: [
        {
          title: "SaaS Subscriptions:",
          description: "Annual or monthly fees from creators.",
          subpoints: [
            "Freemium",
            "Pro – $19.99/month ($203.99/year)",
            "Enterprise – $299.99/month ($3,059.99/year)",
          ],
        },
        {
          title: "Marketplace Fees:",
          description:
            "Low commissions on asset sales and ads; none on eBook purchases.",
          subpoints: [],
        },
      ],
    },
  },
  // Page 1/8: GTM Strategy (3 Months) (Slide 6)
  {
    id: 6,
    title: "GTM Strategy (3 Months)",
    type: "gtm",
    content: {
      main: "Launch in a local K-12 classroom to gather quantifiable data on student engagement and learning outcomes.",
      deliverables: [
        "Pilot implementation report",
        "Student engagement metrics",
        "Learning outcomes analysis",
      ],
    },
  },
  // Page 1/7: GTM Strategy – Early Adopter Outreach (Slide 7)
  {
    id: 7,
    title: "GTM Strategy – Early Adopter Outreach",
    type: "gtm",
    content: {
      main: "Leverage pilot case study results to secure 3-5 contracts with innovative charter schools eager to adopt immersive digital publishing tools.",
      deliverables: [
        "Case study documentation",
        "Contracts with charter schools",
        "Feedback from early adopters",
      ],
    },
  },
  // Page 1/6: GTM Strategy – Enterprise Sales (6-12 Months) (Slide 8)
  {
    id: 8,
    title: "GTM Strategy – Enterprise Sales (6-12 Months)",
    type: "gtm",
    content: {
      main: "Use data and case studies from earlier phases to target large academic publishers for broader ICP market penetration.",
      deliverables: [
        "Enterprise sales pitch materials",
        "Meetings with academic publishers",
        "Pipeline of potential enterprise clients",
      ],
    },
  },
  // Page 1/5: Competitive Analysis (Slide 9)
  {
    id: 9,
    title: "Competitive Analysis",
    type: "table",
    content: {
      columns: [
        "Feature",
        "Project DPE",
        "Shorthand",
        "Neon Ichiban",
        "Amazon (Audible)",
      ],
      rows: [
        ["Integrated workflow", true, true, false, false],
        ["Fully immersive reading experience", true, false, false, false],
        [
          "Multimodal GenAI tools for content creation",
          true,
          false,
          false,
          false,
        ],
        ["100% ownership of book revenue", true, false, true, true],
        ["Integrated digital marketplace(s)", false, false, false, false],
      ],
    },
  },
  // Page 1/4: Team (Slide 10)
  {
    id: 10,
    title: "Team",
    type: "team",
    content: {
      members: [
        // Using name as part of the placeholder image filename for easy replacement
        {
          name: "Tray Bailey",
          title: "Founder & CEO",
          isMain: true,
          imgFile: "Members/Tray_Bailey.png",
        },
        {
          name: "David McNeil",
          title: "Founder & CTO",
          isMain: true,
          imgFile: "Members/David_McNeil.png",
        },
        {
          name: "Daphne Augustine",
          title: "UI/UX Designer",
          isMain: false,
          imgFile: "Members/Daphne_Augustine.png",
        },
        {
          name: "Rafael Grunhaus",
          title: "Business Development Associate",
          isMain: false,
          imgFile: "Members/Rafael_Grunhaus.png",
        },
        {
          name: "Francis Hammond",
          title: "Frontend Developer",
          isMain: false,
          imgFile: "Members/Francis_Hammond.png",
        },
        {
          name: "Saani Iddi",
          title: "Fullstack Developer",
          isMain: false,
          imgFile: "Members/Saani_Iddi.png",
        },
        {
          name: "Abubakari Mahamudu",
          title: "Frontend Developer & Talent Acquisition Specialist",
          isMain: false,
          imgFile: "Members/Abubakari_Mahamudu.png",
        },
        {
          name: "Abul Hafis Muhammad",
          title: "Lead Immersive Reader Developer",
          isMain: false,
          imgFile: "Members/Abul_Muhammad.png",
        },
        {
          name: "Abdulai Suhuyini",
          title: "Lead AI & LLM Developer",
          isMain: false,
          imgFile: "Members/Abdulai_Suhuyini.png",
        },
        {
          name: "Yussif Yakhuza",
          title: "Project Manager & Fullstack Developer",
          isMain: false,
          imgFile: "Members/Yussif_Yakhuza.png",
        },
        {
          name: "Casey Smirniotopoulos",
          title: "Mentor",
          isMain: true,
          imgFile: "Members/Casey_Smirniotopoulos.png",
        },
      ],
      // Placeholder names for logos to indicate the user can add image files here too
      logos: [
        "Fayetteville_State_University.png",
        "Aspen_Music_Festival_and_School.png",
        "Mastercard.png",
        "A_Red_Logo.png",
        "InnOhub.png",
        "Vizyon.png",
        "Open_Eye_Media.png",
        "OUI2.png",
        "Green_Dollar_Logo.png",
        "Black_Business_Labs.png",
        "The_New_School.png",
        "Mannes.png",
        "Dataware.png",
        "A_Blue_and_White_Logo.png",
        "A_Red_and_Yellow_Logo.png",
        "Volta_River_Authority.png",
        "Finance_Factory.png",
        "The_Open_University_of_Israel.png",
      ],
    },
  },
  // Page 1/3: Financial Projections (Slide 11)
  {
    id: 11,
    title: "Financial Projections",
    type: "chart",
    content: {
      type: "bar",
      labels: [
        "MVP & MMP Iteration (18 mo)",
        "MLP Iteration (1 yr)",
        "General market (1st year)",
      ],
      series: [
        {
          name: "Revenue",
          data: [17982, 239880, 2398800],
          color: "bg-green-600",
        },
        { name: "Costs", data: [396000, 396000, 252000], color: "bg-red-600" },
      ],
      yMax: 3000000,
    },
  },
  // Page 1/2: Key Metrics (Slide 12)
  {
    id: 12,
    title: "Key Metrics",
    type: "chart",
    content: {
      type: "line",
      labels: [
        "MVP & MMP iteration (18 mo)",
        "MLP iteration (1 yr)",
        "General market (1st year)",
      ],
      series: [
        {
          name: "Paid Users",
          data: [100, 1000, 10000],
          color: "bg-yellow-400",
          labelY: "Subscribers",
        },
      ],
      yMax: 12000,
    },
  },
  // Page 1/1: Current Status (Slide 13)
  {
    id: 13,
    title: "Current Status",
    type: "text-with-list",
    content: {
      points: [
        "Prototype: Bootstrapped, showcasing core capabilities and vision.",
        "Traction: Positive feedback from Marvel and Phoenix Pictures executives.",
        "Use of Funds: $750K for MMP and MLP development, and general market launch.",
      ],
    },
  },
];

const EditableContainer = ({
  children,
  title,
  pageNum,
  totalPages,
  onDelete,
  onAdd,
}: {
  children: React.ReactNode;
  title: string;
  pageNum: number;
  totalPages: number;
  onDelete: () => void;
  onAdd: () => void;
}) => (
  <div className="w-full flex flex-col items-center">
    {/* Header */}
    <div className="w-full flex items-center justify-between px-4 py-2 mb-2 max-w-[900px]">
      <span className="text-blue-950 text-sm md:text-[14px] font-medium">
        Page {pageNum}/{totalPages}
      </span>
      <div className="flex gap-3">
        <CopyPlus
          size={20}
          className="cursor-pointer text-blue-950 hover:text-blue-400 transition-colors"
          onClick={onAdd}
        />
        <Trash2
          size={20}
          className="cursor-pointer text-blue-950 hover:text-red-400 transition-colors"
          onClick={onDelete}
        />
      </div>
    </div>

    {/* Slide content */}
    <div className="w-full h-70 sm:h-[420px]  bg-black border border-gray-700 rounded-lg shadow-xl p-2 sm:p-8 flex flex-col text-white overflow-y-auto aspect-[16/9]">
      {title && (
        <h2
          className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-left leading-tight"
          contentEditable
          suppressContentEditableWarning
        >
          {title}
        </h2>
      )}

      {/* Content area */}
      <div
        className="
        "
        contentEditable
        suppressContentEditableWarning
      >
        {children}
      </div>
    </div>
  </div>
);

const CoverPage = ({ data }: { data: InitialPageContent }) => (
  <div className="flex flex-col h-full w-full justify-between items-center text-center">
    <div className="pt-10">
      <p
        className="text-sm sm:text-4xl text-center font-light mb-4 leading-snug"
        contentEditable
        suppressContentEditableWarning
      >
        {data.content.title}
      </p>
      <h1
        className="text-xl sm:text-6xl font-extrabold my-4 sm:my-6 break-words"
        contentEditable
        suppressContentEditableWarning
      >
        {data.content.subtitle}
      </h1>
      <h3
        className="text-base sm:text-3xl font-medium"
        contentEditable
        suppressContentEditableWarning
      >
        {data.content.tagline}
      </h3>
    </div>

    <div className="text-xs sm:text-sm pb-6 space-y-1">
      <p contentEditable suppressContentEditableWarning>
        {data.content.ceo}
      </p>
      <p
        contentEditable
        suppressContentEditableWarning
        className="text-blue-400"
      >
        {data.content.email}
      </p>
      <div
        className="pt-4 text-[10px] sm:text-xs text-gray-400 whitespace-pre-wrap"
        contentEditable
        suppressContentEditableWarning
      >
        {data.content.footer}
      </div>
    </div>
  </div>
);

const TextWithListPage = ({ data }: { data: InitialPageContent }) => (
  <div className="flex flex-col h-full w-full overflow-y-auto">
    {data.content.subtitle && (
      <p
        className="text-xs text-left sm:text-xl font-semibold mb-4 text-red-500"
        contentEditable
        suppressContentEditableWarning
      >
        {data.content.subtitle}
      </p>
    )}
    <ul
      className={`list-disc text-xs sm:text-base space-y-2 sm:space-y-4 ${
        data.content.isSmallList
          ? "text-base sm:text-xl"
          : "text-base sm:text-2xl"
      }`}
    >
      {data.content.points.map((point: string, idx: number) => (
        <li
          key={idx}
          className={`${
            data.content.isSmallList
              ? "text-white font-normal"
              : "text-white font-medium"
          }`}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{
              __html: point.replace(/(\w+):/g, "<b>$1:</b>"),
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

/* ----------------------- BUSINESS MODEL PAGE ----------------------- */
const BusinessModelPage = ({ data }: { data: InitialPageContent }) => (
  <div className="flex flex-col h-full w-full space-y-6 overflow-y-auto">
    {data.content.sections.map((section: any, idx: number) => (
      <div key={idx} className="space-y-2">
        <p
          className="text-sm sm:text-2xl font-bold"
          contentEditable
          suppressContentEditableWarning
        >
          {section.title}
          <span
            className="text-xs sm:text-lg font-normal ml-2"
            contentEditable
            suppressContentEditableWarning
          >
            {section.description}
          </span>
        </p>
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-xs sm:text-lg">
          {section.subpoints.map((subpoint: string, subIdx: number) => (
            <li key={subIdx}>
              <span
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{
                  __html: subpoint.replace(/–/g, "&ndash;"),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const ChartPage = ({ data }: { data: InitialPageContent }) => {
  const isBar = data.content.type === "bar";
  const isLine = data.content.type === "line";

  // Helper for formatting large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${Math.round(num / 1000)}K`;
    return num.toLocaleString();
  };
  const formatYAxis = (num: number) => {
    if (num >= 1000) return `${Math.round(num / 1000)}k`;
    return num.toLocaleString();
  };

  const getYAxisTicks = (max: number) => {
    const ticks = [];
    const step = max / 5;
    for (let i = 0; i <= 5; i++) {
      ticks.push(i * step);
    }
    return ticks;
  };

  const yTicks = getYAxisTicks(data.content.yMax);

  return (
    <div className="flex flex-col h-full text-sm">
      <div className="relative flex-grow flex p-2 pt-6">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between text-right pr-2 border-r border-gray-700 text-xs text-gray-400">
          {yTicks
            .slice()
            .reverse()
            .map((tick, idx) => (
              <div key={idx} className="h-0 relative">
                {idx > 0 && (
                  <span className="absolute right-0 -mr-2 -translate-y-1/2">
                    {isBar ? formatNumber(tick) : formatYAxis(tick)}
                  </span>
                )}
              </div>
            ))}
        </div>

        {/* Chart Area */}
        <div className="flex-grow flex justify-around items-end relative">
          {data.content.labels.map((label: string, xIdx: number) => (
            <div
              key={xIdx}
              className="flex flex-col h-full justify-end items-center mx-2 w-1/4"
            >
              {/* Data Points / Bars */}
              <div className="relative flex w-full h-full justify-center items-end">
                {isBar &&
                  data.content.series.map((series: any, sIdx: number) => {
                    const height =
                      (series.data[xIdx] / data.content.yMax) * 100;
                    return (
                      <div
                        key={sIdx}
                        className={`w-1/2 mx-0.5 ${series.color} transition-all duration-500`}
                        style={{ height: `${Math.min(height, 100)}%` }}
                      >
                        <span
                          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-xs font-semibold text-white pointer-events-none"
                          contentEditable="true"
                          suppressContentEditableWarning={true}
                        >
                          {formatNumber(series.data[xIdx])}
                        </span>
                      </div>
                    );
                  })}
                {isLine &&
                  data.content.series.map((series: any, sIdx: number) => {
                    const value = series.data[xIdx];
                    const position = (value / data.content.yMax) * 100;
                    return (
                      <div
                        key={sIdx}
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ bottom: `${position}%` }}
                      >
                        <div
                          className={`${series.color} w-3 h-3 rounded-full border-2 border-black`}
                        />
                        <span
                          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-xs font-semibold text-white pointer-events-none"
                          contentEditable="true"
                          suppressContentEditableWarning={true}
                        >
                          {value.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
          {/* Line Chart Connector (Simplified) */}
          {isLine &&
            data.content.series.map((series: any, sIdx: number) => (
              <svg
                key={`line-${sIdx}`}
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "visible" }}
              >
                {data.content.labels.map((_: any, idx: number) => {
                  if (idx === data.content.labels.length - 1) return null;

                  const p1Value = series.data[idx];
                  const p2Value = series.data[idx + 1];

                  const p1Bottom = (p1Value / data.content.yMax) * 100;
                  const p2Bottom = (p2Value / data.content.yMax) * 100;

                  // Simple percentages for x coordinates, adjusting for margins
                  const xPositions = [15, 50, 85];

                  const x1 = xPositions[idx];
                  const x2 = xPositions[idx + 1];

                  const y1 = 100 - p1Bottom;
                  const y2 = 100 - p2Bottom;

                  return (
                    <line
                      key={idx}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="rgb(250, 204, 21)"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            ))}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between border-t border-gray-700 pt-2 px-2 text-center text-xs">
        {data.content.labels.map((label: string, idx: number) => (
          <p
            key={idx}
            className="w-1/3 mx-1"
            contentEditable="true"
            suppressContentEditableWarning={true}
          >
            {label}
          </p>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 text-xs">
        {data.content.series.map((series: any, idx: number) => (
          <div key={idx} className="flex items-center mx-2">
            <div className={`w-3 h-3 ${series.color} mr-1`}></div>
            <span contentEditable="true" suppressContentEditableWarning={true}>
              {series.name || series.labelY}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------------- GTM PAGE ----------------------- */
const GTMPage = ({ data }: { data: InitialPageContent }) => (
  <div className="flex flex-col h-full space-y-4 sm:space-y-6">
    <p
      className="text-sm sm:text-xl font-normal mb-2 sm:mb-4"
      contentEditable
      suppressContentEditableWarning
    >
      &bull; {data.content.main}
    </p>
    <ul className="list-disc pl-4 sm:pl-5 space-y-2 sm:space-y-3 text-xs sm:text-lg mt-2 sm:mt-4">
      {data.content.deliverables.map((item: string, idx: number) => (
        <li
          key={idx}
          className="list-none before:content-['\2022'] before:mr-2 before:text-white before:font-bold"
        >
          <span contentEditable suppressContentEditableWarning>
            {item}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
const CompetitiveAnalysisPage = ({ data }: { data: InitialPageContent }) => {
  const checkmark = (
    <span className="text-green-500 font-extrabold">&#10003;</span>
  );
  return (
    <div className="flex flex-col h-full overflow-x-auto">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {data.content.columns.map((col: string, idx: number) => (
              <th
                key={idx}
                className={`py-2 px-2 text-xs sm:text-base font-bold ${
                  idx === 0 ? "w-1/3 sm:w-1/4" : "text-center"
                }`}
                contentEditable
                suppressContentEditableWarning
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.content.rows.map((row: any[], rowIdx: number) => (
            <tr key={rowIdx} className="border-b border-gray-800">
              {row.map((cell: any, colIdx: number) => (
                <td
                  key={colIdx}
                  className={`py-2 px-2 text-xs sm:text-base ${
                    colIdx === 0 ? "font-medium" : "text-center"
                  }`}
                  contentEditable={colIdx === 0 ? true : false}
                  suppressContentEditableWarning
                >
                  {typeof cell === "boolean" ? (cell ? checkmark : "") : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const TeamPage = ({ data }: { data: InitialPageContent }) => {
  const mainMembers = data.content.members.filter((m: any) => m.isMain);
  const otherMembers = data.content.members.filter(
    (m: any) => !m.isMain && m.name !== "Casey Smirniotopoulos"
  );
  const mentor = data.content.members.find(
    (m: any) => m.name === "Casey Smirniotopoulos"
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Main Members */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 justify-center">
        {mainMembers
          .filter((m: any) => m.title !== "Mentor")
          .map((member: any, idx: number) => (
            <div
              key={idx}
              className="col-span-1 flex flex-col items-center text-center"
            >
              <ImagePlaceholder
                name={member.name}
                title={member.title}
                imgFile={member.imgFile}
                size="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>
          ))}
      </div>

      {/* Other Members */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 border-b border-gray-700">
        {otherMembers.map((member: any, idx: number) => (
          <div
            key={idx}
            className="col-span-1 flex flex-col items-center text-center"
          >
            <ImagePlaceholder
              name={member.name}
              title={member.title}
              imgFile={member.imgFile}
              size="w-10 h-10 sm:w-12 sm:h-12"
            />
          </div>
        ))}
      </div>

      {/* Mentor */}
      {mentor && (
        <div className="flex flex-col items-start mb-6">
          <p
            className="text-xs sm:text-sm font-semibold"
            contentEditable
            suppressContentEditableWarning
          >
            {mentor.name}
          </p>
          <p
            className="text-[10px] sm:text-xs text-gray-400"
            contentEditable
            suppressContentEditableWarning
          >
            {mentor.title}
          </p>
        </div>
      )}

      {/* Logos */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-auto pt-4">
        {data.content.logos.map((logo: string, idx: number) => (
          <div
            key={idx}
            className="h-6 w-12 sm:h-8 sm:w-14 bg-gray-800 flex items-center justify-center text-[8px] sm:text-[10px] text-gray-500 rounded"
            title={logo}
          >
            Logo
          </div>
        ))}
      </div>
    </div>
  );
};



const RenderPageContent = ({ page }: { page: InitialPageContent | Card }) => {
  switch (page.type) {
    case "cover":
      return <CoverPage data={page} />;
    case "text":
    case "text-with-list":
      return <TextWithListPage data={page} />;
    case "business-model":
      return <BusinessModelPage data={page} />;
    case "gtm":
      return <GTMPage data={page} />;
    case "table":
      return <CompetitiveAnalysisPage data={page} />;
    case "team":
      return <TeamPage data={page} />;
    case "chart":
      return (
        <ChartPage data={page} />
      );
    case "blank":
      return (
        <div className="text-center text-gray-500 italic">
          Editable Content Area
        </div>
      );
    default:
      return <div className="text-red-500">Page Type Not Found</div>;
  }
};

// 3. Main Frame Component

export default function Frame() {
  const [initialPages, setInitialPages] = useState<InitialPageContent[]>(
    initialPresentationData
  );
  const [dynamicCards, setDynamicCards] = useState<Card[]>([]);
  const [nextId, setNextId] = useState(initialPresentationData.length + 1);

  const handleAddCard = () => {
    setDynamicCards([
      ...dynamicCards,
      {
        id: nextId,
        type: "blank",
        content: {
          title: "New Page Title",
          body: "Start typing your content here...",
        },
      } as Card,
    ]);
    setNextId(nextId + 1);
  };

  const handleDeleteCard = (id: number) => {
    // Check if it's an initial page or dynamic card
    const isInitialPage = initialPages.some((page) => page.id === id);

    if (isInitialPage) {
      setInitialPages(initialPages.filter((page) => page.id !== id));
    } else {
      setDynamicCards(dynamicCards.filter((card) => card.id !== id));
    }
  };

  const totalPages = initialPages.length + dynamicCards.length;

  // Combine initial content with dynamic cards for rendering
  const allPages = [...initialPages, ...dynamicCards];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center gap-4 md:gap-8 w-full max-w-[800px]">
        {allPages.map((page, index) => (
          <EditableContainer
            key={page.id}
            pageNum={index + 1}
            totalPages={totalPages}
            title={"title" in page ? page.title || "" : ""}
            onAdd={handleAddCard}
            onDelete={() => handleDeleteCard(page.id)}
          >
            <RenderPageContent page={page} />
          </EditableContainer>
        ))}

        <div className="w-full max-w-[800px] flex justify-center mt-4">
          <Button
            onClick={handleAddCard}
            variant="outline"
            className="flex justify-center items-center gap-2 py-2  font-medium text-bg-gray-800 hover:bg-gray-200 transition-colors shadow-sm w-full max-w-[700px] border-gray-300"
          >
            <Plus size={20} />
            <span className="text-center text-sm md:text-[16px] font-[400]">
              Add new page
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
