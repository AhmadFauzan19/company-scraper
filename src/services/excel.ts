import * as XLSX from 'xlsx';

export function readExcel(filePath: string): (string | undefined)[] {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];

    // If no sheet is found, log an error and return an empty array
    if (!sheetName) {
      console.error('No sheets found in the Excel file');
      return [];
    }

    const sheet = workbook.Sheets[sheetName];

    // Get the range of cells in the sheet
    const range = XLSX.utils.decode_range(sheet['!ref']!); // Get the range of the sheet

    // Store the values of column B
    const columnBValues: (string | undefined)[] = [];

    // Loop through rows and access column B (index 1)
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = { c: 1, r: row }; // Column B corresponds to index 1 (A=0, B=1, ...)
      const cell = sheet[XLSX.utils.encode_cell(cellAddress)];

      // If the cell exists, push its value to the array
      if (cell) {
        columnBValues.push(cell.v);
      } else {
        columnBValues.push(undefined); // Handle case where the cell is empty
      }
    }

    // Return the array of values in column B
    return columnBValues;
  } catch (error) {
    console.error('Error reading or processing the Excel file:', error);
    return [];
  }
}
