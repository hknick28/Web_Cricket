const fs = require("fs");
const path = require("path");

/**
 * Takes the complete calibration matrix and writes it to a local JSON file.
 * @param {Object} profileData - The complete calibrationProfiles object from the frontend.
 */
export function saveCalibrationToFile(profileData) {
  // Define the file name and path where it will be saved
  const filePath = path.join(__dirname, "calibration_profiles.json");

  try {
    // Convert the JavaScript object into a formatted string
    // The 'null, 2' arguments format it beautifully with indentation
    const dataString = JSON.stringify(profileData, null, 2);

    // Write the file to your hard drive synchronously for reliability
    fs.writeFileSync(filePath, dataString, "utf8");

    console.log("🚀 Success! Calibration data saved to:", filePath);
    return true;
  } catch (error) {
    console.error("❌ Failed to write calibration file:", error);
    return false;
  }
}
