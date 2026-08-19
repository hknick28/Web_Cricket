export function saveCalibrationToFile(profileData, socket) {
  if (socket) {
    socket.emit("saveCalibrationData", profileData);
    console.log("📡 Calibration profiles sent to server for local saving.");
  } else {
    console.error(
      "❌ Socket instance not found. Unable to save calibration data.",
    );
  }
}
