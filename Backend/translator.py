import cv2
import numpy as np
import translators as ts
from PIL import Image, ImageDraw, ImageFont
from manga_ocr import MangaOcr

class MangaTranslator:
    def __init__(self, config):
        self.config = config
        self.mocr = MangaOcr()

    def translate(self, image, src_lang='auto', dest_lang='en'):
        """
        Translates the text in an image.
        :param image: The image to translate (numpy array).
        :param src_lang: The source language.
        :param dest_lang: The destination language.
        :return: The translated image (numpy array).
        """
        pil_image = Image.fromarray(image)

        # Detect text
        text_detections = self.mocr(pil_image)

        # Inpaint original text
        inpainted_image = self.inpaint_text(image, text_detections)

        # Translate and draw new text
        translated_image = self.draw_translated_text(inpainted_image, text_detections, src_lang, dest_lang)

        return translated_image

    def inpaint_text(self, image, detections):
        """
        Inpaints the detected text regions in the image.
        :param image: The image to inpaint (numpy array).
        :param detections: The text detections from manga-ocr.
        :return: The inpainted image (numpy array).
        """
        mask = np.zeros(image.shape[:2], dtype=np.uint8)
        for detection in detections:
            bbox = np.array(detection['bbox'], dtype=np.int32)
            cv2.fillConvexPoly(mask, bbox, (255))

        inpainted_image = cv2.inpaint(image, mask, 3, cv2.INPAINT_TELEA)
        return inpainted_image

    def draw_translated_text(self, image, detections, src_lang, dest_lang):
        """
        Draws the translated text onto the image.
        :param image: The image to draw on (numpy array).
        :param detections: The text detections from manga-ocr.
        :param src_lang: The source language.
        :param dest_lang: The destination language.
        :return: The image with translated text (numpy array).
        """
        pil_image = Image.fromarray(image)
        draw = ImageDraw.Draw(pil_image)

        for detection in detections:
            text = detection['text']
            if not text.strip():
                continue

            translated_text = ts.translate_text(text, from_language=src_lang, to_language=dest_lang)

            bbox = detection['bbox']
            top_left = (int(bbox[0][0]), int(bbox[0][1]))

            # Simple font choice for now
            try:
                font = ImageFont.truetype("arial.ttf", 15)
            except IOError:
                font = ImageFont.load_default()

            draw.text(top_left, translated_text, font=font, fill=(0, 0, 0))

        return np.array(pil_image)
