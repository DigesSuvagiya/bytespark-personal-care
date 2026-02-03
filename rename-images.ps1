# PowerShell script to rename image files to lowercase
$path = "public/products"
Get-ChildItem -Path $path -File | ForEach-Object {
    $newName = $_.Name.ToLower()
    if ($_.Name -ne $newName) {
        Rename-Item -Path $_.FullName -NewName $newName
        Write-Host "Renamed: $($_.Name) -> $newName"
    }
}
Write-Host "All files renamed to lowercase!"
