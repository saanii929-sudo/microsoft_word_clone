"use client";

import { useState } from "react";

export default function TopMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 select-none">
      <div className="relative">
        <button
          onMouseEnter={() => toggleMenu("view")}
          className="px-3 py-1 font-semibold rounded text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          View
        </button>

        {openMenu === "view" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute left-0 mt-1 w-72 bg-white shadow-xl border border-gray-200 rounded-md py-2 z-50"
          >
            <DropdownItem 
              label="Mode" 
              arrow 
              icon={<ModeIcon />}
            />

            <DropdownItem 
              label="Comments" 
              arrow 
              icon={<CommentsIcon />}
            />

            <DropdownItem
              label="Collapse tabs & outlines sidebar"
              shortcut="Ctrl+Alt+A • Ctrl+Alt+H"
              icon={<CollapseIcon />}
            />

            <Divider />

            <DropdownCheck label="Show print layout" checked icon={<PrintLayoutIcon />} />
            <DropdownCheck label="Show ruler" checked icon={<RulerIcon />} />
            <DropdownItem label="Show equation toolbar" icon={<EquationIcon />} />
            <DropdownItem label="Show non-printing characters" shortcut="Ctrl+Shift+P" icon={<CharactersIcon />} />

            <Divider />

            <DropdownItem label="Full screen" icon={<FullScreenIcon />} />
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onMouseEnter={() => toggleMenu("format")}
          className="px-3 py-1 font-semibold rounded text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          Format
        </button>

        {openMenu === "format" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute left-0 mt-1 w-72 bg-white shadow-xl border border-gray-200 rounded-md py-2 z-50"
          >
            <DropdownItem label="Text" arrow icon={<TextIcon />} />
            <DropdownItem label="Paragraph styles" arrow icon={<ParagraphIcon />} />
            <DropdownItem label="Align & indent" arrow icon={<AlignIcon />} />
            <DropdownItem label="Line & paragraph spacing" arrow icon={<LineSpacingIcon />} />
            <DropdownItem label="Columns" arrow icon={<ColumnsIcon />} />
            <DropdownItem label="Bullets & numbering" arrow icon={<BulletsIcon />} />

            <Divider />

            <DropdownItem label="Headers & footers" icon={<HeadersIcon />} />
            <DropdownItem label="Page numbers" icon={<PageNumbersIcon />} />
            <DropdownItem label="Page orientation" icon={<OrientationIcon />} />
            <DropdownItem label="Switch to Pageless format" icon={<PagelessIcon />} />

            <Divider />

            <DropdownItem label="Table" disabled />
            <DropdownItem label="Image" disabled />
            <DropdownItem label="Borders & lines" disabled />

            <Divider />

            <DropdownItem label="Clear formatting" icon={<ClearFormattingIcon />} />
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onMouseEnter={() => toggleMenu("help")}
          className="px-3 font-semibold py-1 rounded text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          Help
        </button>

        {openMenu === "help" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute left-0 mt-1 w-72 bg-white shadow-xl border border-gray-200 rounded-md py-2 z-50"
          >
            <DropdownItem label="Search the menus" shortcut="Alt+/" icon={<SearchIcon />} />

            <DropdownItem label="Docs Help" icon={<HelpIcon />} />
            <DropdownItem label="Training" icon={<TrainingIcon />} />
            <DropdownItem label="Updates" icon={<UpdatesIcon />} />

            <Divider />

            <DropdownItem label="Help Docs improve" icon={<ImproveIcon />} />
            <DropdownItem label="Privacy Policy" icon={<PolicyIcon />} />
            <DropdownItem label="Terms of Service" icon={<TermsIcon />} />

            <Divider />

            <DropdownItem label="Keyboard shortcuts" shortcut="Ctrl+/" icon={<KeyboardIcon />} />
          </div>
        )}
      </div>
    </div>
  );
}

const DropdownItem = ({
  label,
  disabled,
  shortcut,
  arrow,
  icon,
}: {
  label: string;
  disabled?: boolean;
  shortcut?: string;
  arrow?: boolean;
  icon?: React.ReactNode;
}) => (
  <div
    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
      disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <span>{label}</span>
    </div>

    <div className="flex items-center gap-2">
      {shortcut && <span className="text-xs text-gray-500">{shortcut}</span>}
      {arrow && <span className="text-gray-500 text-lg">›</span>}
    </div>
  </div>
);

const DropdownCheck = ({ 
  label, 
  checked, 
  icon 
}: { 
  label: string; 
  checked?: boolean; 
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
    <div className="w-4 h-4 flex items-center justify-center">
      {checked ? (
        <span className="text-blue-600">
          <CheckIcon />
        </span>
      ) : (
        <div className="w-4 h-4" />
      )}
    </div>
    <div className="w-4 h-4 flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <span>{label}</span>
  </div>
);

const Divider = () => <div className="my-2 border-t border-gray-200" />;

const ModeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 7h6M9 12h6M9 17h6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CommentsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2"/>
  </svg>
);

const CollapseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18M3 12h10M3 18h18" strokeWidth="2"/>
  </svg>
);

const PrintLayoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z" strokeWidth="2"/>
  </svg>
);

const RulerIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16M4 8h8M4 12h12M4 16h10" strokeWidth="2"/>
  </svg>
);

const EquationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M8 6h8M8 12h8M8 18h8M6 4v16" strokeWidth="2"/>
  </svg>
);

const CharactersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16M4 8h10M4 12h16M4 16h10" strokeWidth="2"/>
  </svg>
);

const FullScreenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h6M4 10V4M20 20h-6M20 14v6" strokeWidth="2"/>
  </svg>
);

const TextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 6h16M4 10h10M4 14h16M4 18h10" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ParagraphIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16M4 8h12M4 12h8M4 16h10" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const AlignIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18M3 12h12M3 18h18" strokeWidth="2"/>
  </svg>
);

const LineSpacingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M8 6h8M8 12h8M8 18h8M6 4v16" strokeWidth="2"/>
  </svg>
);

const ColumnsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h6v16H4zM14 4h6v16h-6z" strokeWidth="2"/>
  </svg>
);

const BulletsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="5" cy="6" r="1.5"/>
    <circle cx="5" cy="12" r="1.5"/>
    <circle cx="5" cy="18" r="1.5"/>
    <path d="M10 6h9M10 12h9M10 18h9" strokeWidth="2"/>
  </svg>
);

const HeadersIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M4 4h16v4H4zM4 16h16v4H4zM4 8h16v8H4z" strokeWidth="2"/>
  </svg>
);

const PageNumbersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16M4 8h8M4 12h12M4 16h10" strokeWidth="2"/>
  </svg>
);

const OrientationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M4 4h16M12 4v16" strokeWidth="2"/>
  </svg>
);

const PagelessIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z" strokeWidth="2"/>
  </svg>
);

const ClearFormattingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 18h12M6 6h12M6 12h12" strokeWidth="2"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4a7 7 0 014.95 11.95l4.24 4.24-1.41 1.41-4.24-4.24A7 7 0 1111 4z" strokeWidth="2"/>
  </svg>
);

const HelpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 18h.01M12 14a4 4 0 10-4-4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TrainingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l7 4v6c0 5-3.5 9-7 9s-7-4-7-9V6l7-4z" strokeWidth="2"/>
  </svg>
);

const UpdatesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 10a7 7 0 017-7 7 7 0 017 7" strokeWidth="2"/>
    <path d="M5 10v4h4" strokeWidth="2"/>
  </svg>
);

const ImproveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 5h18M3 12h18M3 19h18" strokeWidth="2"/>
  </svg>
);

const PolicyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z" strokeWidth="2"/>
  </svg>
);

const TermsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z" strokeWidth="2"/>
  </svg>
);

const KeyboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);