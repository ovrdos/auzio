#AUZIO by Kamal Hakim
#finds songs based on a artist - song query and downloads and converts it
#kamal.hakim 03-01-18

song="$*"
cat logo
play_song()
{
	echo "Press enter to play!"
	read playnow
	mpg123 "$1" &> /dev/null &
        procid=$!
        echo "Now playing: $1"
        echo ""
	echo "Press enter to stop playing."
        read stopnow
        kill -9 $procid &> /dev/null &
	exit 0
}


check_tools()
{
	brew="$(which apt-get)"
        if [ -z $brew ]
        then
                echo "Please install apt-get first!"
                exit 0
        fi
	ytdl="$(which youtube-dl)"
        if [ -z $ytdl ]
        then
                echo "Installing YTDL..."
                sudo apt-get install youtube-dl
                wait $!
        fi
        mpg="$(which mpg123)"
	if [ -z $mpg ]
        then
                echo "Installing MPG123..."
                sudo apt-get install mpg123
                wait $!
        fi
	ffmpeg="$(which ffmpeg)"
        if [ -z $ffmpeg ]
        then
                echo "Installing FFMPEG..."
                sudo apt-get install ffmpeg
                wait $!
        fi
}

re="^.* - .*$"
if [[ -z "${song}" ||! "$song" =~ $re ]]
then
	echo "to run enter: ./auzio Artist - Song"
	exit 0
	else
	#check dependencies
	check_tools
	song=${song// /+}
	song="${song}+Lyrics"
	songIndex=$(curl -s https://www.youtube.com/results?search_query="${song}"|grep "/watch?v="|cut -d/ -f2|head -4|cut -d= -f2|cut -d'"' -f1|sed -n 1p)
	#echo "index: $songIndex"
	file=$(ls mp3/*${songIndex}.mp3 &> /dev/null &)
	if [ -z "$file"  ]
	then
                title=$(echo "$*" | tr '[a-z]' '[A-Z]')
                echo -n "Loading: ${title} "
                youtube-dl --extract-audio --audio-format=mp3 -t https://www.youtube.com/watch?v=$songIndex &> /dev/null &
                while kill -0 $! 2> /dev/null; do
                        echo -n "#"
                        sleep 1
                done
                echo ""
                file="$(ls *${songIndex}.mp3)"
                echo "Found song: ${file}"
                rnfile=${file// /_}
                rnfile=${rnfile//\'/}
                mkdir -p mp3
                mv "$file" "mp3/$rnfile"
        fi

	play_song "./mp3/$rnfile"
fi

exit 0
