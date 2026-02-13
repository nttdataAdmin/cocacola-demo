# Mock Data for Pepsico Manufacturing

This folder contains sample forms for testing the Production Line Management System.

## Files Included

### Handwritten Forms (Offline - OCR)
- `form_handwritten_01.png` - No-Go form for PL-042
- `form_handwritten_02.png` - Go form for PL-015
- `form_handwritten_03.png` - No-Go form for PL-078

### Digital Forms (Online)
- `form_online_01.docx` - Go form for PL-001
- `form_online_02.docx` - No-Go form for PL-025
- `form_online_03.docx` - Go form for PL-050

## How to Use

1. Go to the **Upload** tab in the application
2. Select the form type (Online or Offline)
3. Upload the files from this folder
4. The system will automatically:
   - Extract text (OCR for handwritten forms)
   - Classify as Go/No-Go
   - Extract attributes
   - Generate worker reallocation recommendations (for No-Go forms)

## Form Content

### Handwritten Forms
These are simulated handwritten forms that will be processed using OCR. The content includes:
- Production Line ID
- Manager name
- Date
- Status (Go/No-Go)
- Reason (for No-Go)
- Worker count
- Skills mentioned

### Digital Forms
These are structured DOCX documents with the same information in digital format.

