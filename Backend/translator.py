import cv2
import easyocr
import numpy as np
import translators as ts
from PIL import Image, ImageDraw, ImageFont

class MangaTranslator:
    def __init__(self, config):
        self.config = config
        self.reader = easyocr.Reader(['ja', 'en'])  # Japanese and English

    def translate(self, image, src_lang='auto', dest_lang='en'):
        """
        Translates the text in an image.
        :param image: The image to translate (numpy array).
        :param src_lang: The source language.
        :param dest_lang: The destination language.
        :return: The translated image (numpy array).
        """
        # Detect text
        text_detections = self.reader.readtext(image)

        # Inpaint original text
        inpainted_image = self.inpaint_text(image, text_detections)

        # Translate and draw new text
        translated_image = self.draw_translated_text(inpainted_image, text_detections, src_lang, dest_lang)

        return translated_image

    def inpaint_text(self, image, detections):
        """
        Inpaints the detected text regions in the image.
        :param image: The image to inpaint (numpy array).
        :param detections: The text detections from easyocr.
        :return: The inpainted image (numpy array).
        """
        mask = np.zeros(image.shape[:2], dtype=np.uint8)
        for (bbox, text, prob) in detections:
            (top_left, top_right, bottom_right, bottom_left) = bbox
            top_left = (int(top_left[0]), int(top_left[1]))
            bottom_right = (int(bottom_right[0]), int(bottom_right[1]))
            cv2.rectangle(mask, top_left, bottom_right, (255), -1)

        inpainted_image = cv2.inpaint(image, mask, 3, cv2.INPAINT_TELEA)
        return inpainted_image

    def draw_translated_text(self, image, detections, src_lang, dest_lang):
        """
        Draws the translated text onto the image.
        :param image: The image to draw on (numpy array).
        :param detections: The text detections from easyocr.
        :param src_lang: The source language.
        :param dest_lang: The destination language.
        :return: The image with translated text (numpy array).
        """
        pil_image = Image.fromarray(image)
        draw = ImageDraw.Draw(pil_image)

        for (bbox, text, prob) in detections:
            if not text.strip():
                continue

            translated_text = ts.translate_text(text, from_language=src_lang, to_language=dest_lang)

            (top_left, top_right, bottom_right, bottom_left) = bbox
            top_left = (int(top_left[0]), int(top_left[1]))

            # Simple font choice for now
            try:
                font = ImageFont.truetype("arial.ttf", 15)
            except IOError:
                font = ImageFont.load_default()

            draw.text(top_left, translated_text, font=font, fill=(0, 0, 0))

        return np.array(pil_image)
