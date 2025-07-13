// Utility functions for protocol-specific configurations

export function getProtocolDuration(protocolName: string): number {
  switch (protocolName) {
    case "Tabata Protocol (HIIT)":
      return 6;
    case "Billat 30:30 Interval Protocol":
      return 8;
    case "Norwegian 4x4 Protocol (Aerobic HIIT)":
      return 8;
    case "10-20-30 Protocol":
      return 7;
    case "Zone 2 Training (Low-Intensity Aerobic Base)":
      return 12;
    case "Lactate Threshold Training":
      return 8;
    default:
      return 8;
  }
}

export function getProtocolSessionsPerWeek(protocolName: string): number {
  switch (protocolName) {
    case "Tabata Protocol (HIIT)":
      return 5;
    case "Billat 30:30 Interval Protocol":
      return 3;
    case "Norwegian 4x4 Protocol (Aerobic HIIT)":
      return 3;
    case "10-20-30 Protocol":
      return 3;
    case "Zone 2 Training (Low-Intensity Aerobic Base)":
      return 4;
    case "Lactate Threshold Training":
      return 3;
    default:
      return 3;
  }
}
