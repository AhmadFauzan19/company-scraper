import * as XLSX from "xlsx";
import * as fs from "fs";

/**
 * Writes company information to an Excel file, appending data to the existing sheet if it already exists.
 * @param companyInfoStr - The JSON string containing company info.
 * @param filePath - The path where the Excel file will be saved.
 */
export async function writeExcel(companyInfoStr: string, filePath: string) {
  try {
    // Clean up the input string by removing the 'Output: ' prefix (if it exists)
    companyInfoStr = companyInfoStr.replace(/^Output:\s*/, "");

    // Parse the JSON string
    let parsedData = JSON.parse(companyInfoStr);
    console.log("Parsed Data:", parsedData);

    // Wrap the parsed data into an array if it's a single object
    if (!Array.isArray(parsedData)) {
      console.log("Wrapping single object into an array.");
      parsedData = [parsedData];
    }

    let workbook;
    let worksheet;

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // Read the existing workbook
      workbook = XLSX.readFile(filePath);

      // If the workbook is empty (no sheets), initialize it
      if (!workbook.SheetNames.length) {
        console.log("Workbook is empty, creating new sheet.");
        worksheet = XLSX.utils.json_to_sheet(parsedData);
        workbook.Sheets["Company Info"] = worksheet;
      } else {
        // Check if the "Company Info" sheet exists
        if (workbook.Sheets["Company Info"]) {
          console.log("Updating existing sheet with new data.");
          worksheet = workbook.Sheets["Company Info"];
          const existingData = XLSX.utils.sheet_to_json(worksheet);

          // Append new data
          parsedData = [...existingData, ...parsedData];
          worksheet = XLSX.utils.json_to_sheet(parsedData);
          workbook.Sheets["Company Info"] = worksheet;
        } else {
          console.log("Creating a new sheet named 'Company Info'.");
          worksheet = XLSX.utils.json_to_sheet(parsedData);
          workbook.Sheets["Company Info"] = worksheet;
        }
      }
    } else {
      // Create a new workbook and worksheet
      console.log("Creating a new workbook and sheet.");
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet(parsedData);
      workbook.Sheets["Company Info"] = worksheet;
    }

    // Write the workbook to the file system
    XLSX.writeFile(workbook, filePath);

    console.log(`Excel file successfully written to ${filePath}`);
  } catch (error) {
    console.error("Error processing JSON string:", error);
  }
};
