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

if exists "mp3\*%%songIndex%%.mp3" (
	
) else (
	title=echo "%song%"
	echo -n "Finding: %title%"
	youtube-dl --extract-audio 
        echo -n "... "
        youtube-dl --extract-audio -o %song%.mp3 "ytsearch:%song%+official+lyrics"
        ffmpeg -i %song%.* -vn -acodec libmp3lame -ac 2 -qscale:a 4 -ar 48000 "Auzio-%title%.mp3"                
)

exit /b 0






exit /b 0
