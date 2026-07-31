$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = $null
$port = 8765

try {
    $listener = [System.Net.Sockets.TcpListener]::new(
        [System.Net.IPAddress]::Loopback,
        $port
    )
    $listener.Start()
}
catch {
    Write-Host "" 
    Write-Host "Port 8765 sedang dipakai aplikasi lain." -ForegroundColor Red
    Write-Host "Tutup jendela CHARISNA Money Management lama, lalu coba klik BUKA-CHARISNA-MONEY.bat lagi." -ForegroundColor Yellow
    throw
}

$mimeTypes = @{
    ".html"        = "text/html; charset=utf-8"
    ".css"         = "text/css; charset=utf-8"
    ".js"          = "application/javascript; charset=utf-8"
    ".json"        = "application/json; charset=utf-8"
    ".webmanifest" = "application/manifest+json; charset=utf-8"
    ".png"         = "image/png"
    ".jpg"         = "image/jpeg"
    ".jpeg"        = "image/jpeg"
    ".svg"         = "image/svg+xml"
    ".ico"         = "image/x-icon"
    ".txt"         = "text/plain; charset=utf-8"
}

$url = "http://localhost:8765/index.html?v=11-1-stable"
Write-Host ""
Write-Host "CHARISNA Money Management v11.1 Stability & Input Fix sedang berjalan." -ForegroundColor Green
Write-Host "Alamat tetap: $url" -ForegroundColor Cyan
Write-Host "Jangan tutup jendela ini selama aplikasi digunakan." -ForegroundColor Yellow
Write-Host "Tekan Ctrl+C untuk menghentikan CHARISNA Money Management." -ForegroundColor DarkGray
Write-Host ""

Start-Process $url

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $reader = $null
        $stream = $null

        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new(
                $stream,
                [System.Text.Encoding]::ASCII,
                $false,
                8192,
                $true
            )

            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

            while ($true) {
                $headerLine = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($headerLine)) { break }
            }

            $parts = $requestLine.Split(" ")
            $method = if ($parts.Length -gt 0) { $parts[0] } else { "GET" }
            $rawPath = if ($parts.Length -gt 1) { $parts[1] } else { "/" }

            if ($method -notin @("GET", "HEAD")) {
                $body = [System.Text.Encoding]::UTF8.GetBytes("Method Not Allowed")
                $header = "HTTP/1.1 405 Method Not Allowed`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                if ($method -ne "HEAD") { $stream.Write($body, 0, $body.Length) }
                continue
            }

            $pathOnly = $rawPath.Split("?")[0]
            $decodedPath = [System.Uri]::UnescapeDataString($pathOnly)
            if ($decodedPath -eq "/") { $decodedPath = "/index.html" }

            $relativePath = $decodedPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $candidatePath = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
            $rootPath = [System.IO.Path]::GetFullPath($root)

            $rootPrefix = $rootPath.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
            $isRootFile = $candidatePath.Equals($rootPath, [System.StringComparison]::OrdinalIgnoreCase)
            $isInsideRoot = $candidatePath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)

            if (-not $isRootFile -and -not $isInsideRoot) {
                $candidatePath = Join-Path $root "__forbidden__"
            }

            if (Test-Path $candidatePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($candidatePath)
                $extension = [System.IO.Path]::GetExtension($candidatePath).ToLowerInvariant()
                $contentType = if ($mimeTypes.ContainsKey($extension)) {
                    $mimeTypes[$extension]
                } else {
                    "application/octet-stream"
                }

                $cacheHeader = if ($extension -in @(".html", ".js", ".css", ".webmanifest")) {
                    "Cache-Control: no-cache`r`n"
                } else {
                    "Cache-Control: public, max-age=86400`r`n"
                }

                $header = (
                    "HTTP/1.1 200 OK`r`n" +
                    "Content-Type: $contentType`r`n" +
                    "Content-Length: $($bytes.Length)`r`n" +
                    $cacheHeader +
                    "Connection: close`r`n`r`n"
                )
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                if ($method -ne "HEAD") { $stream.Write($bytes, 0, $bytes.Length) }
            }
            else {
                $body = [System.Text.Encoding]::UTF8.GetBytes("404 - File tidak ditemukan")
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                if ($method -ne "HEAD") { $stream.Write($body, 0, $body.Length) }
            }
        }
        catch {
            Write-Host "Permintaan gagal: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
        finally {
            if ($reader) { $reader.Dispose() }
            if ($stream) { $stream.Dispose() }
            $client.Close()
        }
    }
}
finally {
    if ($listener) { $listener.Stop() }
}
