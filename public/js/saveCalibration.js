const fs = require("fs");
const path = require("path");

export function saveCalibrationToFile(profileData) {
  const dataString = JSON.stringify(profileData, null, 2);
  const blob = new Blob([dataString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "calibration_profiles.json";
  a.click();
  URL.revokeObjectURL(url);
}
