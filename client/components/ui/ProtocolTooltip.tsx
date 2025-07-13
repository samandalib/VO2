import { useState } from "react";
import {
  PROTOCOL_DEFINITIONS,
  ProtocolDefinitionKey,
} from "@/constants/protocolDefinitions";

interface ProtocolTooltipProps {
  term: ProtocolDefinitionKey;
  children: React.ReactNode;
  className?: string;
}

export function ProtocolTooltip({
  term,
  children,
  className = "",
}: ProtocolTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const definition = PROTOCOL_DEFINITIONS[term];

  return (
    <div className="relative inline-block">
      <div
        className={`cursor-help transition-all duration-200 hover:opacity-80 ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute z-50 w-80 p-4 mt-2 bg-white border rounded-lg shadow-lg border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-gray-900">
                {"fullName" in definition
                  ? definition.fullName
                  : definition.term}
              </h4>
              {"fullName" in definition && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {definition.term}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {definition.definition}
            </p>
          </div>

          {/* Arrow pointer */}
          <div className="absolute top-[-6px] left-4 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
