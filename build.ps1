Remove-Item "./backend/assets" -Recurse -Force
Remove-Item "./backend/index.html" -Force
bun run build
Copy-Item "./dist/*" "./backend/" -Recurse
Copy-Item "./listos/listos.css" "./backend/assets/"
Copy-Item "./listos/listos.js" "./backend/assets/" 
Write-Output "Build complete"