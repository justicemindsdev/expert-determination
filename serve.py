#!/usr/bin/env python3
"""
Simple HTTPS server for Expert Determination website testing
Usage: python3 serve.py [port]
"""

import http.server
import ssl
import sys
import os
from pathlib import Path

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8443
    
    # Change to website directory
    os.chdir(Path(__file__).parent)
    
    # Create HTTP server
    handler = http.server.SimpleHTTPRequestHandler
    httpd = http.server.HTTPServer(('localhost', port), handler)
    
    # Try to create SSL context (for local testing)
    try:
        context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        # For testing only - in production, use proper certificates
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        protocol = "https"
    except Exception as e:
        print(f"SSL not available, using HTTP: {e}")
        protocol = "http"
    
    print(f"🌐 Expert Determination website server running...")
    print(f"📍 Local URL: {protocol}://localhost:{port}/")
    print(f"📁 Serving from: {os.getcwd()}")
    print(f"🔧 Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n⏹  Server stopped")
        httpd.server_close()

if __name__ == "__main__":
    main()