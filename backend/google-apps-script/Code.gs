const SHEET_NAME = 'Registrations';

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    if (!event || !event.postData || !event.postData.contents) {
      return jsonOutput({ success: false, message: 'Request body is empty.' });
    }

    const registration = JSON.parse(event.postData.contents);
    const childName = requiredText(registration.childName, 80);
    const childClass = requiredText(registration.childClass, 40);
    const parentName = requiredText(registration.parentName, 80);
    const parentPhone = requiredText(registration.parentPhone, 10);

    if (!/^[6-9]\d{9}$/.test(parentPhone)) {
      throw new Error('Invalid parent phone number.');
    }

    lock.waitLock(10000);
    try {
      const sheet = getRegistrationSheet();
      sheet.appendRow([new Date(), childName, childClass, parentName, parentPhone]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    return jsonOutput({ success: true });
  } catch (error) {
    console.error(error);
    return jsonOutput({ success: false, message: 'Registration could not be saved.' });
  }
}

function getRegistrationSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID script property is not configured.');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Child Name', 'Class', 'Parent Name', 'Parent Phone Number']);
  }

  return sheet;
}

function requiredText(value, maxLength) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > maxLength) {
    throw new Error('A registration field is missing or invalid.');
  }
  return value.trim();
}

function jsonOutput(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function testSheetConnection() {
  const sheet = getRegistrationSheet();
  Logger.log('Sheet: ' + sheet.getName());
  Logger.log('Connection successful!');
}

function testRegistration() {
  const event = {
    postData: {
      contents: JSON.stringify({
        childName: 'Test Child',
        childClass: '4',
        parentName: 'Test Parent',
        parentPhone: '9876543210'
      })
    }
  };

  Logger.log('Test response: ' + doPost(event).getContent());
}