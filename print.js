const { jsPDF } = window.jspdf;

function onPrint(state) {
  return new Promise(async (resolve) => {
    // Default export is a4 paper, portrait, using millimeters for units

    const {
      aspectRatio,
      cols,
      rows,
      enabledFormat,
      printCutlines,
      name,
      tagline,
      backText,
      charge,
      madeDate,
      first_name,
      last_name,
      street,
      zipcity,
      mobile,
      phone,
      email,
      frontUrl,
      img,
    } = state;

    //guard clauses

    const pagemarginX = 10;
    const pagemarginY = 10;
    let numRows = rows;
    let numCols = cols;

    const pageOuterWidth = 210;
    const pageInnerWidth = pageOuterWidth - 2 * pagemarginX;
    const pageOuterHeight = 297;
    const pageInnerHeight = pageOuterHeight - 2 * pagemarginY;

    const gridGap = 2;

    const imageWidth = pageInnerWidth / numCols - gridGap;
    let imageHeight = pageInnerHeight / numRows - gridGap;

    if (enabledFormat) {
      imageHeight = imageWidth / aspectRatio;
      numRows = Math.floor(pageInnerHeight / imageHeight);
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [297, 210],
    });

    doc.setFont("helvetica").setFontSize(9);
    /**
     * FRONTPAGE
     * **/
    doc.text(`${name}.pdf`, 5, 5);

    /*let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = frontUrl;*/

    //Draw images
    for (let a = 0; a < numRows; a++) {
      for (let b = 0; b < numCols; b++) {
        doc.addImage(
          img,
          "JPEG",
          pagemarginX + gridGap + b * (imageWidth + gridGap),
          pagemarginY + gridGap + a * (imageHeight + gridGap),
          imageWidth,
          imageHeight
        );
      }
    }

    if (printCutlines) {
      /** DRAW CUTLINES */
      doc.setLineDash([1, 1.5, 1, 1.5, 1, 1.5, 3, 2, 3, 2, 3, 2], 7.5);
      //Draw Cutlines horizontal
      for (let j = 0; j <= numRows; j++) {
        doc.line(
          pagemarginX,
          pagemarginY + gridGap / 2 + j * (imageHeight + gridGap),
          pagemarginX + pageInnerWidth + 2 * gridGap,
          pagemarginY + gridGap / 2 + j * (imageHeight + gridGap)
        );
      }

      //Draw Cutlines vertical
      for (let i = 0; i <= numCols; i++) {
        doc.line(
          pagemarginX + gridGap / 2 + i * (imageWidth + gridGap),
          pagemarginY,
          pagemarginX + gridGap / 2 + i * (imageWidth + gridGap),
          pagemarginY + numRows * imageHeight + (numRows + 1) * gridGap
        );
      }
    }
    /**
     * BACKPAGE
     */
    doc.addPage();
    /** DRAW CUTLINES */
    if (printCutlines) {
      doc.setLineDash([1, 1.5, 1, 1.5, 1, 1.5, 3, 2, 3, 2, 3, 2], 7.5);
      //Draw Cutlines horizontal
      for (let j = 0; j <= numRows; j++) {
        doc.line(
          pagemarginX,
          pagemarginY + gridGap / 2 + j * (imageHeight + gridGap),
          pagemarginX + pageInnerWidth + 2 * gridGap,
          pagemarginY + gridGap / 2 + j * (imageHeight + gridGap)
        );
      }

      //Draw Cutlines vertical
      for (let i = 0; i <= numCols; i++) {
        doc.line(
          pagemarginX + gridGap / 2 + i * (imageWidth + gridGap),
          pagemarginY,
          pagemarginX + gridGap / 2 + i * (imageWidth + gridGap),
          pagemarginY + numRows * imageHeight + (numRows + 1) * gridGap
        );
      }
    }
    //Draw Backtext
    doc.setFont("helvetica").setFontSize(7);

    for (let a = 0; a < numRows; a++) {
      for (let b = 0; b < numCols; b++) {
        let splittext = doc.splitTextToSize(backText, imageWidth - 12);

        doc.text(
          splittext || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + 8
        );

        doc.text(
          `Chargen-Nr: ${charge}` || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 31
        );
        doc.text(
          `Gesiedet am ${madeDate}` || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 27
        );

        doc.text(
          first_name + " " + last_name || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 21
        );

        doc.text(
          street + "," || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 17
        );

        doc.text(
          zipcity || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 13
        );

        doc.text(
          "Home: " + phone || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 9
        );

        doc.text(
          "Mobil: " + mobile || "Missing",
          pagemarginX + gridGap + b * (imageWidth + gridGap) + 6,
          pagemarginY + gridGap + a * (imageHeight + gridGap) + imageHeight - 5
        );
      }
    }

    // Set the document to automatically print via JS
    //doc.autoPrint();

    await doc.save(`${name || "untitled"}.pdf`, { returnPromise: true });
    console.log("done the pdf");

    resolve("resolved");
  });
}
