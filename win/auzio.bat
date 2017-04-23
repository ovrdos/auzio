@echo off
REM #AUZIO by Kamal Hakim
REM #finds songs based on a artist - song query and downloads and converts it
REM #kamal.hakim 07-2-13-2017 wiindows version

set song="%*"
type logo


set re="^.* - .*$"

if "%song%"=="""" (
	echo To run enter Artist - Song after auzio
	exit /b 1
)
REM exit /b 0
REM set song=%song%// /+
set song=%song%+Lyrics+Clean
echo %song%
curl -s https://www.youtube.com/results?search_query="${song}"|find "/watch?v=" > conn
for /f "tokens=1,2 delims=/ " %a in ('type conn') do set songIndex=%%b
echo songIndex - %songIndex%
exit /b 0
set songIndex=$(curl -s https://www.youtube.com/results?search_query="${song}"|find "/watch?v="|cut -d/ -f2|head -4|cut -d= -f2|cut -d'"' -f1|sed -n 1p)
for /f "tokens=1 delims=/ " %%a in ("%date%") do set songIndex=%%a
echo %songIndex%
REM exit /b 0
if exists "mp3\*%%songIndex%%.mp3" (
	
) else (
	title=echo "%song%"
	echo -n "Loading: %title%"
	youtube-dl --extract-audio --audio-format=mp3 -t https://www.youtube.com/watch?v=%songIndex%
                
	
)

exit /b 0






exit /b 0