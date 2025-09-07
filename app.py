import yt_dlp
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400

    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'noplaylist': True,
            'quiet': True,
            'extract_flat': True, # Faster for search, doesn't download
            'force_generic_extractor': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Search for videos
            info = ydl.extract_info(f"ytsearch10:{query}", download=False) # Search top 10 results

            results = []
            if 'entries' in info:
                for entry in info['entries']:
                    if entry and entry.get('id') and entry.get('title'):
                        # Basic duration formatting
                        duration_seconds = entry.get('duration')
                        duration_str = ""
                        if duration_seconds:
                            minutes = int(duration_seconds // 60)
                            seconds = int(duration_seconds % 60)
                            duration_str = f"{minutes}:{seconds:02d}"

                        thumbnail_url = ''
                        if 'thumbnails' in entry and entry['thumbnails']:
                            # Try to get the last (usually highest resolution) thumbnail
                            thumbnail_url = entry['thumbnails'][-1]['url']
                        elif 'thumbnail' in entry: # Fallback to single thumbnail if 'thumbnails' list is not present
                            thumbnail_url = entry['thumbnail']

                        results.append({
                            'id': entry['id'],
                            'title': entry['title'],
                            'artist': entry.get('channel', 'Unknown Artist'), # Use channel as artist
                            'thumbnail': thumbnail_url,
                            'duration': duration_str
                        })
            return jsonify(results)
    except Exception as e:
        print(f"Error during YouTube search: {e}")
        return jsonify({'error': 'Failed to perform search. Please try again later.'}), 500

@app.route('/api/stream', methods=['GET'])
def stream():
    video_id = request.args.get('id', '')
    if not video_id:
        return jsonify({'error': 'Video ID parameter "id" is required'}), 400

    try:
        ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio',
            'noplaylist': True,
            'quiet': True,
            'source_address': '0.0.0.0', # Attempt to force a source address
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
            
            # ydl.extract_info with download=False still gets the stream URL
            if 'url' in info:
                return jsonify({'stream_url': info['url']})
            else:
                # This part might be reached if the video is unavailable or restricted.
                # We can try one more time without the format selection.
                del ydl_opts['format']
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
                if 'url' in info:
                    return jsonify({'stream_url': info['url']})
                else:
                    return jsonify({'error': 'Could not find a suitable stream URL.'}), 404

    except Exception as e:
        print(f"Error during stream URL extraction: {e}")
        return jsonify({'error': 'Failed to get stream URL. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(debug=True)

