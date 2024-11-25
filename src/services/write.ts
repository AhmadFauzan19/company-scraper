import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Function to append data to Excel
export async function appendToExcel(
  newData: Record<string, string>,
  companyName: string,
  links: string[]
) {
  console.log("Starting appendToExcel function...");
  let existingData: Array<Record<string, string>> = [];

  console.log("Adding custom fields to the new data...");
  // Check if the file exists and if there is existing data
  const filePath = path.join(__dirname, "../file/", "Output Data 3.xlsx");
  console.log("File path set to:", filePath);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    console.log("File exists. Reading existing data...");
    // Read the existing Excel file
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log("Existing data read successfully.");
    // Append existing data
    existingData = jsonData as Array<Record<string, string>>;
  } else {
    console.log("File does not exist. A new file will be created.");
  }

  // Combine the links array into a single string, separated by commas
  const referenceLinks = links.join(', '); // Join all the links into a single string

  // Calculate the "No" value based on the length of final data (existingData + new data)
  const updatedData: Record<string, string> = {
    "No": (existingData.length + 1).toString(),  // Add "No" based on the final data length
    "Nama Perusahaan": companyName, // Handle undefined companyName
    ...newData, // Spread existing fields
    "Reference Links": referenceLinks,
    "Search Method": "crawler",
  };
  console.log("Updated data:", updatedData);

  // Combine existing data with the new record
  const finalData = [...existingData, updatedData];

  // Create a worksheet from the final data
  console.log("Creating worksheet from the final data...");
  const worksheet = XLSX.utils.json_to_sheet(finalData);

  // Create a new workbook and append the worksheet
  console.log("Creating a new workbook and appending the worksheet...");
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

  // Ensure the directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    console.log("Directory does not exist. Creating directory...");
    fs.mkdirSync(dir, { recursive: true });
    console.log("Directory created:", dir);
  }

  // Write the updated workbook to the specified file path
  console.log("Writing the updated workbook to the file...");
  XLSX.writeFile(workbook, filePath);
  console.log("Workbook written successfully to", filePath);
  console.log("appendToExcel function completed successfully.");
}
