export interface PatientFooterData {
  fullName?: string;
  age?: string;
  gender?: string;
  hn?: string;
  an?: string;
}

const renderFooterToDataUrl = (
  patient: PatientFooterData,
  pageNumber: number,
  totalPages: number
): string => {
  const canvas = document.createElement('canvas');
  // High-res canvas: 180mm @ 2x screen scale ~ 1360px
  const width = 1360;
  const height = 56;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top dividing line for footer
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(width, 2);
  ctx.stroke();

  // Typography - TH Sarabun PSK
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 22px "TH Sarabun PSK", "TH Sarabun New", "Sarabun", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const fullName = patient.fullName?.trim() || 'ไม่ระบุชื่อ';
  const age = patient.age?.trim() ? `${patient.age.trim()} ปี` : '-';
  const gender = patient.gender || '-';
  const hn = patient.hn?.trim() || '-';
  const an = patient.an?.trim() || '-';

  // 1-line footer: ชื่อ-สกุล: ...  อายุ: ...  เพศ: ...  HN: ...  AN: ...
  const leftText = `ชื่อ-สกุล: ${fullName}   |   อายุ: ${age}   |   เพศ: ${gender}   |   HN: ${hn}   |   AN: ${an}`;
  ctx.fillText(leftText, 4, 30);

  // Right text with page count
  ctx.textAlign = 'right';
  ctx.font = 'normal 20px "TH Sarabun PSK", "TH Sarabun New", "Sarabun", sans-serif';
  ctx.fillStyle = '#374151';
  const rightText = `หน้า ${pageNumber}/${totalPages} · แบบบันทึกแรกรับผู้ป่วยจิตเวช รพ.ภูมิพลอดุลยเดช`;
  ctx.fillText(rightText, width - 4, 30);

  return canvas.toDataURL('image/png');
};

export const exportElementToA4Pdf = async (
  elementId: string,
  fileName: string = 'Psychiatric_Assessment.pdf',
  patientInfo?: PatientFooterData
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id #${elementId} not found`);
    return false;
  }

  try {
    // Wait for fonts to be ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Dynamically load heavy libraries for tree-shaking / bundle splitting
    const [jsPDFModule, html2canvasModule] = await Promise.all([
      import('jspdf'),
      import('html2canvas-pro')
    ]);
    const jsPDF = jsPDFModule.default || jsPDFModule;
    const html2canvas = html2canvasModule.default || html2canvasModule;

    // Extract patient info from element dataset if not explicitly passed
    const effectivePatientInfo: PatientFooterData = {
      fullName: patientInfo?.fullName || element.getAttribute('data-fullname') || '',
      age: patientInfo?.age || element.getAttribute('data-age') || '',
      gender: patientInfo?.gender || element.getAttribute('data-gender') || '',
      hn: patientInfo?.hn || element.getAttribute('data-hn') || '',
      an: patientInfo?.an || element.getAttribute('data-an') || '',
    };

    // If the document is structured as distinct A4 page sheets (.a4-page-sheet),
    // capture each page individually for exact 1:1 fidelity with zero cutting across sections!
    const pageSheets = element.querySelectorAll<HTMLElement>('.a4-page-sheet');
    if (pageSheets && pageSheets.length > 0) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      for (let i = 0; i < pageSheets.length; i++) {
        const sheet = pageSheets[i];
        const canvas = await html2canvas(sheet, {
          scale: 2, // 2x scale for sharp print quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1024,
          onclone: (_clonedDoc, clonedElement) => {
            if (clonedElement) {
              clonedElement.style.visibility = 'visible';
              clonedElement.style.display = 'flex';
              clonedElement.style.position = 'static';
            }
          },
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      pdf.save(fileName);
      return true;
    }

    // Fallback: Continuous DOM capture using html2canvas-pro
    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale for sharp print quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure element is visible in the cloned DOM (especially when rendered offscreen)
        if (clonedElement) {
          clonedElement.style.visibility = 'visible';
          clonedElement.style.display = 'block';
          clonedElement.style.position = 'static';
          clonedElement.style.left = 'auto';
          clonedElement.style.top = 'auto';
        }
      },
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // If final A4 PDF has multiple pages, starting from page 2 until the last page,
    // inject a 1-line footer with patient identifiers to prevent document mix-ups if dropped
    const totalPages: number =
      typeof (pdf as any).getNumberOfPages === 'function'
        ? (pdf as any).getNumberOfPages()
        : (pdf.internal.pages ? pdf.internal.pages.length - 1 : 1);
    if (totalPages > 1) {
      for (let p = 2; p <= totalPages; p++) {
        pdf.setPage(p);

        // White out bottom margin area to ensure clean footer placement without overlapping text
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 287, 210, 10, 'F');

        const footerImgData = renderFooterToDataUrl(effectivePatientInfo, p, totalPages);
        if (footerImgData) {
          pdf.addImage(footerImgData, 'PNG', 15, 288, 180, 7.4, undefined, 'FAST');
        }
      }
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: trigger native browser print dialog
    window.print();
    return false;
  }
};
