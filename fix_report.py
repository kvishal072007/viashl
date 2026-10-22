import os

with open('build_full_report.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Register TrueType fonts
font_reg = """from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

if os.path.exists("C:/Windows/Fonts/times.ttf"):
    pdfmetrics.registerFont(TTFont('Times-Roman', 'C:/Windows/Fonts/times.ttf'))
if os.path.exists("C:/Windows/Fonts/timesbd.ttf"):
    pdfmetrics.registerFont(TTFont('Times-Bold', 'C:/Windows/Fonts/timesbd.ttf'))
if os.path.exists("C:/Windows/Fonts/timesi.ttf"):
    pdfmetrics.registerFont(TTFont('Times-Italic', 'C:/Windows/Fonts/timesi.ttf'))
if os.path.exists("C:/Windows/Fonts/timesbi.ttf"):
    pdfmetrics.registerFont(TTFont('Times-BoldItalic', 'C:/Windows/Fonts/timesbi.ttf'))
if os.path.exists("C:/Windows/Fonts/cour.ttf"):
    pdfmetrics.registerFont(TTFont('Courier', 'C:/Windows/Fonts/cour.ttf'))
if os.path.exists("C:/Windows/Fonts/courbd.ttf"):
    pdfmetrics.registerFont(TTFont('Courier-Bold', 'C:/Windows/Fonts/courbd.ttf'))
"""

new_lines = []
for line in lines:
    if line.startswith("from canvas_helper import AcademicNumberedCanvas"):
        new_lines.append(line)
        new_lines.append(font_reg + "\n")
    else:
        new_lines.append(line)

content = "".join(new_lines)

# 2. Fix tree string
content = content.replace("├──", "|-- ")
content = content.replace("└──", "\\-- ")
content = content.replace("│", "|")

# 3. Fix Section 5.9
s59_start = content.find('story.append(Paragraph("5.9 DEPLOYMENT AND EXECUTION INSTRUCTIONS", h2_style))')
s59_end = content.find('story.append(PageBreak())\n\n    # =========================================================================\n    # PAGE 25: CHAPTER 6')

if s59_start != -1 and s59_end != -1:
    print(f"Found Section 5.9 between {s59_start} and {s59_end}")
    new_59_code = '''story.append(Paragraph("5.9 DEPLOYMENT AND EXECUTION INSTRUCTIONS", h2_style))
    story.append(Paragraph(
        "To run the application locally in a development environment, execute the following commands:", body_style
    ))

    # Step 1
    story.append(Paragraph("<b>Step 1: Database Setup &amp; Execution (Terminal 1):</b>", ParagraphStyle('StepH1', parent=body_style, fontSize=9, leading=12, spaceBefore=2, spaceAfter=2)))
    code_s1 = (
        "\\\"C:\\\\Program Files\\\\PostgreSQL\\\\16\\\\bin\\\\postgres.exe\\\" -D \\\"C:\\\\data\\\\pg\\\"\\n"
        "# Redis: redis-server --port 6379 (Or run: docker run -p 5432:5432 -p 6379:6379 -d pg-redis)"
    )
    t_s1 = Table([[Paragraph(code_s1.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3)
    ]))
    story.append(t_s1)

    # Step 2
    story.append(Paragraph("<b>Step 2: Backend Setup &amp; Execution (Terminal 2):</b>", ParagraphStyle('StepH2', parent=body_style, fontSize=9, leading=12, spaceBefore=3, spaceAfter=2)))
    code_s2 = (
        "cd server\\n"
        "npm install\\n"
        "npm run seed    # Initializes schema & baseline statutory data\\n"
        "npm run dev     # Starts Express REST API on http://localhost:5000"
    )
    t_s2 = Table([[Paragraph(code_s2.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3)
    ]))
    story.append(t_s2)

    # Step 3
    story.append(Paragraph("<b>Step 3: Frontend Setup &amp; Execution (Terminal 3):</b>", ParagraphStyle('StepH3', parent=body_style, fontSize=9, leading=12, spaceBefore=3, spaceAfter=2)))
    code_s3 = (
        "cd client\\n"
        "npm install\\n"
        "npm run dev\\n"
        "# Starts Vite development server on http://localhost:3000"
    )
    t_s3 = Table([[Paragraph(code_s3.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3)
    ]))
    story.append(t_s3)

    # Step 4
    story.append(Paragraph("<b>Step 4: All-in-One Execution Script (Alternative):</b>", ParagraphStyle('StepH4', parent=body_style, fontSize=9, leading=12, spaceBefore=3, spaceAfter=2)))
    code_s4 = (
        "# Double-click run.bat located in project root (or execute: docker-compose up --build)\\n"
        "# Automatically launches PostgreSQL, Redis, Backend Server, and Frontend simultaneously."
    )
    t_s4 = Table([[Paragraph(code_s4.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3)
    ]))
    story.append(t_s4)\n    '''
    content = content[:s59_start] + new_59_code + content[s59_end:]
else:
    print("Could not find section 5.9 boundaries")

# 4. Point to user uploaded screenshot images
content = content.replace('report_assets/fig_A2_executive_dashboard.png', 'report_assets/fig_A2_command_center.png')
content = content.replace('report_assets/fig_A3_command_center_workflow.png', 'report_assets/fig_A3_approvals_tracker.png')

with open('build_full_report.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated build_full_report.py successfully!")
