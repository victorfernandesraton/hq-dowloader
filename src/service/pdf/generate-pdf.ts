import { PDFDocument } from 'pdf-lib'
import { Chapter } from '../../types/chapter'

export const generatePdf = async (chapter: Chapter): Promise<Uint8Array> => {
	const pdfDoc = await PDFDocument.create()

	const imagesGetter = chapter.pages.map(async (page) => {
		const data = await fetch(` https://api.allorigins.win/raw?url=${page}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'image/jpeg',
			},
			credentials: 'include'
		})
		return data.arrayBuffer()
	})

	const images = await Promise.all(imagesGetter)

	for (const image of images) {
		const page = pdfDoc.addPage()
		const jpgImage = await pdfDoc.embedJpg(image)
		page.drawImage(jpgImage, {
			width: jpgImage.width / 1.78,
			height: jpgImage.height / 1.78,
			x: 0,
			y: 0
		})
	}


	const pdfBytes = await pdfDoc.save()

	return pdfBytes
}