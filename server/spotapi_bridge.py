import sys
import json
from spotapi import Song

def search_songs(query, limit=10):
    try:
        song = Song()
        res = song.query_songs(query, limit=int(limit))
        tracks = []
        search_v2 = res.get('data', {}).get('searchV2', {})
        items = search_v2.get('tracksV2', {}).get('items', [])
        
        for item in items:
            t = item.get('item', {}).get('data', {})
            if not t:
                continue
            
            track_id = t.get('id') or t.get('uri', '').replace('spotify:track:', '')
            name = t.get('name', 'Unknown')
            artists = [a.get('profile', {}).get('name') for a in t.get('artists', {}).get('items', [])]
            duration_ms = t.get('duration', {}).get('totalMilliseconds', 0)
            album_data = t.get('albumOfTrack', {})
            album_name = album_data.get('name', '')
            covers = album_data.get('coverArt', {}).get('sources', [])
            cover_url = covers[0].get('url') if covers else None

            tracks.append({
                'id': track_id,
                'title': name,
                'artist': ', '.join(artists) if artists else 'Unknown Artist',
                'album': album_name,
                'durationMs': duration_ms,
                'coverUrl': cover_url,
                'uri': t.get('uri')
            })
            
        return {'success': True, 'tracks': tracks}
    except Exception as e:
        return {'success': False, 'error': str(e), 'tracks': []}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No action provided'}))
        sys.exit(1)
        
    action = sys.argv[1]
    if action == 'search':
        query = sys.argv[2] if len(sys.argv) > 2 else ''
        limit = sys.argv[3] if len(sys.argv) > 3 else 10
        result = search_songs(query, limit)
        # Ensure utf-8 output without terminal encoding exceptions
        sys.stdout.reconfigure(encoding='utf-8')
        print(json.dumps(result, ensure_ascii=False))
    else:
        print(json.dumps({'error': f'Unknown action: {action}'}))
