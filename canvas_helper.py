import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, PageBreak, Spacer, Table, TableStyle, Image, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas

class AcademicNumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas for exact academic numbering:
    - Page 1: Title page (no footer)
    - Page 2: Bonafide Certificate -> 'ii'
    - Page 3: Viva Voce -> no footer
    - Page 4: Abstract -> 'i'
    - Page 5: Acknowledgement -> 'ii'
    - Page 6: Table of Contents -> 'iii'
    - Page 7: Table of Contents cont. -> 'iv'
    - Page 8: List of Figures -> 'v'
    - Page 9: List of Tables -> 'vi'
    - Page 10 to 40: Chapter 1 to References -> Arabic '1' to '31'
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        p = self._pageNumber
        self.saveState()
        self.setFont("Times-Roman", 10)
        footer_text = None

        if p == 1:
            footer_text = None
        elif p == 2:
            footer_text = "ii"
        elif p == 3:
            footer_text = None
        elif p == 4:
            footer_text = "i"
        elif p == 5:
            footer_text = "ii"
        elif p == 6:
            footer_text = "iii"
        elif p == 7:
            footer_text = "iv"
        elif p == 8:
            footer_text = "v"
        elif p == 9:
            footer_text = "vi"
        elif p >= 10:
            footer_text = str(p - 9)

        if footer_text:
            self.drawCentredString(A4[0] / 2.0, 36, footer_text)

        self.restoreState()

print("Canvas class defined")
