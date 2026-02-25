---
description: Check if MongoDB service is running
---

This workflow helps you verify if the MongoDB service is active on your Windows machine.

1. Open PowerShell/Command Prompt.
2. Run the following command to check the service status:
// turbo
```powershell
Get-Service -Name MongoDB
```
3. If the status is "Running", you are good to go.
4. If it's "Stopped", you can try to start it with:
// turbo
```powershell
Start-Service -Name MongoDB
```
5. If the command fails because "MongoDB" is not found, it means MongoDB is not installed. Follow the installation guide.
