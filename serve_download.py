import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = r"d:\full stack project"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path in ('/', '/download', '/ENVIROTRACK_INFRA_PROJECT_REPORT_VISHAL_K.pdf'):
            file_path = os.path.join(DIRECTORY, "ENVIROTRACK_INFRA_PROJECT_REPORT_VISHAL_K.pdf")
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/pdf')
                self.send_header('Content-Disposition', 'attachment; filename="ENVIROTRACK_INFRA_PROJECT_REPORT_VISHAL_K.pdf"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
        elif self.path == '/view':
            file_path = os.path.join(DIRECTORY, "ENVIROTRACK_INFRA_PROJECT_REPORT_VISHAL_K.pdf")
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/pdf')
                self.send_header('Content-Disposition', 'inline; filename="ENVIROTRACK_INFRA_PROJECT_REPORT_VISHAL_K.pdf"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
        super().do_GET()

print(f"Serving download server on http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.serve_forever()
